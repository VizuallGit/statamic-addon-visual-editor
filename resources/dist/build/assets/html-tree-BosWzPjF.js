import{q as v,f as Ta,o as m,c as g,a as F,t as O,u as i,e as xa,l as Co,F as B,j as ae,g as C,w,Y as Ne,N as Y,aa as wa,a2 as _a,ag as ke,k as Mt,ae as Sa,X as le,aE as Ca,v as lo,x as Ea,W as Pa,aF as Ha,ac as Eo,aG as Ma,D as mt,m as Ut,p as qt,V as qe,a8 as La,aH as Ia,aI as Ra}from"./addon-CJqd57W5.js";import{c as Po,a as Oa,o as $a,b as Da,d as Aa,T as Fa,i as Ba,r as Na,e as Va,f as ja,u as co,l as ho}from"./section-create-BLRywL3V.js";import{canEditFields as Ho,openGlobalFieldsOverlay as Ka,openFieldsetOverlay as Mo}from"./section-fields-BA42ZTY9.js";import{U as t,V as Ua,W as ee,X as qa,b,Y as Ya,Z as za,_ as de,$ as Lo,s as Yt,y as Te,j as Lt,H as Xa,i as Wa,E as Io,F as Ro,a0 as uo,a1 as Oo,m as Ve,D as Ga,R as Za,G as Qa,a2 as Ge,a3 as Ja,a4 as vo,a5 as en,a6 as tn,a7 as $o,a8 as Do,a9 as Ao,aa as on,ab as an,o as Fo,ac as nn,ad as Bo,l as pt,ae as Ze,af as No,ag as sn,ah as zt,ai as rn,aj as ln,ak as dn,x as cn,al as hn,am as un,an as vn,ao as Vo,ap as jo,aq as fn,ar as mn,as as pn,at as gn,au as Ko,av as kn,aw as yn,ax as bn,A as Tn,ay as Xt}from"./lp-cluster-Dyx8Lgii.js";import{H as at,u as xn,d as wn}from"./shortcuts-BIxtNjMb.js";import{_ as Wt,o as Oe}from"./ChoiceDialog-qx1xhtbN.js";import{M as j,S as Z}from"./protocol-CfmvxZS7.js";import{C as _n,H as $e,s as Gt,c as Sn,a as Cn,b as Uo,t as En,d as Le,h as qo,e as Pn,f as Hn,w as Zt,g as Mn,i as Ln,j as In,p as Rn,r as On,k as $n,l as Dn,m as An,v as Fn,n as Bn,o as Nn,q as Vn,u as fo,x as jn,y as Kn,z as Un,A as qn,B as Yn,D as zn,E as mo,F as Xn,G as Wn}from"./component-extract-BFxp3XBp.js";import{H as Gn,r as Yo,o as Zn,h as po,e as Qn,w as Jn}from"./logic-popup-B1atcpBs.js";import{b as es}from"./html-pick-align-BNtmyz2s.js";import{l as ts,a as os,b as as,c as ns,d as ss,e as rs,f as is,g as ls,h as ds}from"./loop-inspector-BVmZDzNv.js";import"./css-scope-Cd5T5M9M.js";import"./FieldsetOverlay-NwTVrzw4.js";import"./anim-still-4pEwKCsB.js";import"./container-widths-DWv7tm7u.js";import"./help-styles-OY8sNv8l.js";const Tt=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,cs=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function hs(e){const o=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,s=>" ".repeat(s.length)),n=o.match(/^<[a-zA-Z][\w:-]*/);if(!n)return null;let a=n[0].length;for(;a<o.length;){Tt.lastIndex=a;const s=Tt.exec(o);if(!s){a+=1;continue}if(s[1].toLowerCase()==="x-data")return s[2]??s[3]??s[4]??"";a=Tt.lastIndex}return null}function us(e,o){const n=e[o];for(let a=o+1;a<e.length;a+=1)if(e[a]==="\\")a+=1;else if(e[a]===n)return a;return e.length-1}function vs(e){const o=String(e||""),n=o.search(/\S/);if(n===-1||o[n]!=="{")return[];const a=new Map;let s=0,l="";const r=()=>{const h=l.match(cs);h&&a.set(h[1]??h[2]??h[3],h[4]==="true"),l=""};for(let h=n;h<o.length;h+=1){const f=o[h];if(f==='"'||f==="'"||f==="`"){const p=us(o,h);l+=o.slice(h,p+1),h=p;continue}if(f==="/"&&o[h+1]==="/"){const p=o.indexOf(`
`,h);h=p===-1?o.length:p-1;continue}if(f==="/"&&o[h+1]==="*"){const p=o.indexOf("*/",h+2);h=p===-1?o.length:p+1;continue}if(f==="{"||f==="["||f==="("){if(s+=1,s===1)continue}else if(f==="}"||f==="]"||f===")"){if(s-=1,s===0)break}else if(f===","&&s===1){r();continue}l+=f}return r(),[...a].map(([h,f])=>({key:h,value:f}))}const fs={class:"sve-html-tree"},ms={class:"sve-pane-bar","data-sve-pane-bar":""},ps={"data-sve-right-title":""},gs={"data-sve-right-actions":""},ks=["aria-pressed","title","aria-label"],ys=["title"],bs={class:"sve-ht-used-by__label"},Ts={class:"sve-ht-used-by__chips"},xs=["title","onClick"],ws={key:1,class:"sve-ht-used-by__chip"},_s={key:0,class:"sve-ht-used-by__empty"},Ss={class:"sve-ht-tools"},Cs=["title"],Es=["placeholder","aria-label","value"],Ps=["aria-label"],Hs=["title","aria-label"],Ms=["title","aria-label"],Ls={key:3,class:"sve-tree-exit"},Is=["title"],Rs=["title"],Os='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',$s='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',Ds='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',As='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Fs='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',Bs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',Ns={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const o=v(window,"html_tree_search");t.layers=Ua(window);const n=v(window,"html_tree_layers_on"),a=v(window,"html_tree_layers_off");function s(){qa(window,!t.layers)}const l=Po(window),r=v(window,"section_new"),h=v(window,"html_tree_add_element"),f=v(window,"html_tree_sections_slot"),p=v(window,"html_tree_sections_no_field");function S(){const L=t.templateSections.length?t.templateSections:[wa(window)],_=new Set(t.rows.filter(u=>u.kind==="sections").map(u=>u.tag));return L.filter(u=>!_.has(u)).map(u=>({tag:`sections:${u}`,label:L.length>1?`${f} · ${u}`:f,noField:!t.templateSections.length}))}const T=Ta(!1),P=v(window,"section_import");function M(){T.value=!1}async function I(L){if(!L)return;await _a(),t.onRefresh?.();const _=b("html-tree:open-section",L);_&&Na(window,_.ids)}function R(){const L=t.rows.find(_=>_.current&&!_.context&&!_.synthetic)||null;return L?.lockedIn?t.rows.filter(_=>_.locked&&_.from<=L.from&&_.to>=L.to).sort((_,u)=>_.from-u.from)[0]||null:L}function x(L){const _=L.getBoundingClientRect(),u=R();let d=null;const k=($,Ae,ue="")=>()=>{d?.dismiss(),d=null,M();const kt=Ba(window,$,u,Ae);kt!==null&&(t.selectFrom={at:kt,left:4},ue&&window.Statamic?.$toast?.info?.(ue))};d=Oe(document,$e,{items:[...Fa.map($=>({label:$,onPick:k($,`<${$}>`)})),...S().map($=>({label:$.label,onPick:k($.tag,$.label,$.noField?p:"")}))],x:Math.round(_.left),y:Math.round(_.bottom+4),onClose:()=>{d=null,M()}})}function V(L){if(!T.value){if(T.value=!0,!(t.sections.length||t.pageBuilder)){x(L.currentTarget);return}(async()=>{const _=await Oa(window);if(!_){M();return}const u=t.sections.length?t.sections[t.sections.length-1].uid:null,d=k=>{M(),I(k?.uid)};if(_==="static"){$a(window,{afterUid:u,onDone:d,onError:M,onClose:M});return}Da(window,{afterUid:u,onDone:d,onError:M,onClose:M})})()}}function Q(){if(T.value)return;T.value=!0;const L=!!(t.sections.length||t.pageBuilder);Aa(window,{intoTemplate:!L,after:L?null:R(),afterUid:L&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:_=>{if(M(),L){I(_?.uid);return}Number.isInteger(_?.at)&&(t.selectFrom={at:_.at,left:4})},onError:M,onClose:M})}function K(L){const _=!!t.query;t.query=L,_!==!!L&&t.onQuery?.()}return(L,_)=>(m(),g("div",fs,[F("div",ms,[F("div",ps,O(e.title),1),F("div",gs,[F("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":i(t).layers?"true":"false",title:i(t).layers?i(a):i(n),"aria-label":i(t).layers?i(a):i(n),innerHTML:Os,onClick:s},null,8,ks),_[5]||(_[5]=xa('<button type="button" data-sve-right-pin aria-pressed="false" data-v-2763765f></button><button type="button" data-sve-close aria-label="Close" data-v-2763765f><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-2763765f><path d="M18 6 6 18" data-v-2763765f></path><path d="m6 6 12 12" data-v-2763765f></path></svg></button>',2))])]),i(t).usedBy?(m(),g("div",{key:0,class:"sve-ht-used-by",title:i(t).usedBy.hint||null},[F("span",bs,[F("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:Fs}),Co(" "+O(i(t).usedBy.label),1)]),F("span",Ts,[(m(!0),g(B,null,ae(i(t).usedBy.items,u=>(m(),g(B,{key:u.kind+":"+u.name},[u.onOpen?(m(),g("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:u.openLabel,onClick:d=>u.onOpen(d.currentTarget)},O(u.name),9,xs)):(m(),g("span",ws,O(u.name),1))],64))),128)),i(t).usedBy.empty?(m(),g("span",_s,O(i(t).usedBy.empty),1)):C("",!0)])],8,ys)):C("",!0),F("div",Ss,[F("label",{class:"sve-ht-search",title:i(o)},[F("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:As}),F("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:i(o),"aria-label":i(o),value:i(t).query,autocomplete:"off",spellcheck:"false",onInput:_[0]||(_[0]=u=>K(u.target.value)),onKeydown:[_[1]||(_[1]=w(()=>{},["stop"])),_[2]||(_[2]=Ne(w(u=>K(""),["prevent"]),["escape"]))]},null,40,Es),i(t).query?(m(),g("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":i(o),innerHTML:Bs,onClick:_[3]||(_[3]=u=>K(""))},null,8,Ps)):C("",!0)],8,Cs),i(l)&&(i(t).sections.length||i(t).pageBuilder||i(t).rows.length&&!i(t).layoutFile)?(m(),g("button",{key:0,type:"button",class:"sve-ht-new",title:i(t).sections.length||i(t).pageBuilder?i(r):i(h),"aria-label":i(t).sections.length||i(t).pageBuilder?i(r):i(h),innerHTML:$s,onClick:V},null,8,Hs)):C("",!0),i(l)&&(i(t).sections.length||i(t).pageBuilder||i(t).rows.length&&!i(t).layoutFile)?(m(),g("button",{key:1,type:"button",class:"sve-ht-import",title:i(P),"aria-label":i(P),innerHTML:Ds,onClick:Q},null,8,Ms)):C("",!0)]),i(ee).inSidebar?C("",!0):(m(),Y(_n,{key:1})),_[6]||(_[6]=F("div",{"data-sve-html-tree-list":""},null,-1)),i(t).inspect?.logic?C("",!0):(m(),Y(Gn,{key:2})),i(t).exitOpen&&!i(ee).inSidebar?(m(),g("div",Ls,[F("span",{class:"sve-tree-exit__name",title:i(t).exitName},O(i(t).exitName),9,Is),F("button",{type:"button",class:"sve-tree-exit__go",title:i(t).exitTitle,onClick:_[4]||(_[4]=u=>i(t).onExit?.())},O(i(t).exitLabel),9,Rs)])):C("",!0)]))}},zo=Wt(Ns,[["__scopeId","data-v-2763765f"]]);function Xo(e){return String(e||"").trim().toLowerCase()}function It(e,o){return o?[e.name,e.tag,e.klass,e.label,e.src].filter(n=>typeof n=="string"&&n).join(" ").toLowerCase().includes(o):!0}function Vs(e,o){const n=Xo(o);if(!n)return{rows:e,hits:new Set};const a=new Set;for(const r of e)It(r,n)&&a.add(r.path);const s=[...a];return{rows:e.filter(r=>a.has(r.path)||s.some(h=>h.startsWith(`${r.path}/`))),hits:a}}function js(e,o,n=0){const a=[];for(const r of e)a.push({row:r,depth:r.depth,room:!1}),o(r)&&a.push({row:r,depth:r.depth+1,room:!0});const s=new Map;let l=0;return a.forEach((r,h)=>{const f=h+1<a.length?a[h+1].depth:n,p=Math.max(0,r.depth-f),S=s.get(r.row.id)||{ends:0,after:0,roomEnds:0};r.room?S.roomEnds=p:(S.ends=p,S.after=l),s.set(r.row.id,S),l=p}),s}const Ks=["title"],Us={"data-sve-ht-indent":"","aria-hidden":"true"},qs=["data-sve-ht-cat"],Ys={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},zs={key:2,"data-sve-ht-letter":""},Xs=["innerHTML"],Ws=["title"],Gs=["title"],Zs={key:1,"data-sve-ht-kind":""},Qs=["data-sve-ht-classes"],Js={key:4,"data-sve-ht-actions":""},er=["data-on","title","innerHTML"],tr=["title"],or={key:5,"data-sve-ht-actions":""},ar=["data-on","title","innerHTML"],nr=["data-on","title","innerHTML"],sr=["disabled","title"],rr=["disabled","title","innerHTML"],ir=["disabled","title"],lr=["disabled","title"],dr=["aria-label"],cr=["data-sve-ht-id"],hr={key:0,"data-sve-ht-indent":"","aria-hidden":"true"},ur=["data-sve-ht-cat"],vr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',fr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',mr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',pr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',gr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',kr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',yr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',go='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',ko='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',br='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Tr='<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',xr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',wr=120,_r={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},box:{type:Object,default:null},dim:{type:Boolean,default:!1}},setup(e){const o=Ho(window);function n(u){return u.synthetic?u.frame==="main"?t.frameMainTitle:u.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:u.kind==="component"?u.src?`partial:${u.src}`:u.tag:u.name?`${u.tag} ${u.name}`:u.tag}function a(u){return!!u.section}function s(u){return!!u.frame}function l(u){return u.kind==="slot"}function r(u,d){s(d)||l(d)||(a(d)?t.onSectionPointerDown?.(u,d.section):d.sectionRoot?t.onSectionPointerDown?.(u,d.sectionRoot):t.onPointerDown?.(u,d.id))}function h(u,d){if(u.synthetic){t.onFrame?.(u.frame);return}if(a(u)){t.onSection?.(u.section);return}t.onSelect?.(u.id,d)}function f(u,d){const k={"data-sve-ht-id":u.id};return u.locked&&(k["data-sve-ht-locked"]=""),u.current&&(k["data-sve-ht-current"]=""),(u.hidden||u.sectionOff)&&(k["data-sve-ht-hidden"]=""),(u.videoNth>=0||u.alpineNth>=0)&&(k["data-sve-ht-special"]=""),k["data-sve-ht-cat"]=u.cat||"other",k["data-sve-ht-depth"]=String(u.depth),d&&(k["data-sve-ht-dim"]=""),a(u)&&(k["data-sve-ht-sec"]=""),s(u)&&(k["data-sve-ht-frame"]=u.frame),!a(u)&&t.dropId===u.id&&t.dropPlace&&(k["data-sve-ht-drop"]=t.dropPlace),k}function p(u){return!!u.fixed}function S(u){return u.kind==="sections"}function T(u){return!!(u.locked||u.lockedIn)}function P(u){return!u.lockedIn&&!p(u)}function M(u){return Q(u)||!p(u)&&!S(u)&&!T(u)&&(!u.hidden||u.wrapFrom!=null)}function I(u){if(!K(u))return t.lockedTitle;const d=u.hidden||u.sectionOff;return Q(u)?d?t.sectionShowTitle:t.sectionHideTitle:d?t.showTitle:t.hideTitle}let R=null;function x(u,d){window.clearTimeout(R),R=window.setTimeout(()=>t.onMore?.(u,d.id),wr)}function V(){window.clearTimeout(R)}function Q(u){return!!u.sectionRoot||!!u.section}function K(u){return t.canEdit&&!T(u)||Q(u)}function L(u,d){return de()?{"--sve-ht-depth":u.depth,"--sve-ht-ends":d?.ends||0,"--sve-ht-after":d?.after||0}:{"--sve-ht-depth":u.depth}}function _(u,d,k){return de()?{style:{"--sve-ht-up":u-k},"data-sve-ht-end":k>=u-d?"":null}:{}}return(u,d)=>(m(),g(B,null,[F("div",ke({"data-sve-ht-row":""},f(e.row,e.dim),{role:"button",tabindex:"0",title:n(e.row),style:L(e.row,e.box),onClick:d[43]||(d[43]=k=>h(e.row,k.currentTarget)),onDblclick:d[44]||(d[44]=w(k=>e.row.synthetic?i(t).onFrameEnter?.(e.row.frame):s(e.row)||l(e.row)||a(e.row)?null:i(t).onRename?.(e.row.id),["prevent"])),onKeydown:[d[45]||(d[45]=Ne(w(k=>h(e.row,k.currentTarget),["prevent"]),["enter"])),d[46]||(d[46]=Ne(w(k=>h(e.row,k.currentTarget),["prevent"]),["space"]))],onPointerdown:d[47]||(d[47]=k=>r(k,e.row)),onPointerenter:d[48]||(d[48]=k=>a(e.row)?i(t).onSectionHover?.(e.row.section):null),onContextmenu:d[49]||(d[49]=w(k=>s(e.row)||l(e.row)||a(e.row)?null:i(t).onContext?.(k,e.row.id),["prevent","stop"]))}),[F("span",Us,[(m(!0),g(B,null,ae(e.row.guides||[],(k,$)=>(m(),g("i",ke({key:$,"data-sve-ht-cat":k},{ref_for:!0},_(e.row.depth,e.box?.ends||0,$)),null,16,qs))),128))]),e.row.hasChildren||i(Ya)(e.row)?(m(),g("button",ke({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?i(t).mainShut:i(za)(e.row))?{"data-sve-ht-shut":""}:{},{innerHTML:fr,onClick:d[0]||(d[0]=w(k=>e.row.synthetic?i(t).onFrameTwist?.():a(e.row)?i(t).onSection?.(e.row.section):i(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:d[1]||(d[1]=w(()=>{},["stop"])),onDblclick:d[2]||(d[2]=w(()=>{},["stop"]))}),null,16)):(m(),g("span",Ys)),e.row.letter?(m(),g("span",zs,O(e.row.letter),1)):(m(),g("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Xs)),F("span",{"data-sve-ht-text":"",title:i(t).renameTitle},[!e.row.kind&&!a(e.row)&&!s(e.row)?(m(),g("button",{key:0,type:"button","data-sve-ht-tag":"",title:i(t).tagTitle,onClick:d[3]||(d[3]=w(()=>{},["stop","prevent"])),onPointerdown:d[4]||(d[4]=w(()=>{},["stop"])),onDblclick:d[5]||(d[5]=w(k=>i(t).onTagChange?.(k,e.row.id),["stop","prevent"]))},O(e.row.tag),41,Gs)):(m(),g("span",Zs,O(e.row.tag),1)),i(t).editingId===e.row.id&&!a(e.row)?Mt((m(),g("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":d[6]||(d[6]=k=>i(t).draft=k),onMousedown:d[7]||(d[7]=w(()=>{},["stop"])),onPointerdown:d[8]||(d[8]=w(()=>{},["stop"])),onClick:d[9]||(d[9]=w(()=>{},["stop"])),onDblclick:d[10]||(d[10]=w(()=>{},["stop"])),onKeydown:[d[11]||(d[11]=w(()=>{},["stop"])),d[12]||(d[12]=Ne(w(k=>i(t).onRenameCommit?.(),["prevent"]),["enter"])),d[13]||(d[13]=Ne(w(k=>i(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:d[14]||(d[14]=k=>i(t).onRenameCommit?.())},null,544)),[[Sa,i(t).draft]]):(m(),g("span",{key:3,"data-sve-ht-name":"","data-sve-ht-classes":i(de)()&&e.row.classes?e.row.classes:null},O(i(de)()&&e.row.display?e.row.display:e.row.name),9,Qs))],8,Ws),s(e.row)?(m(),g("span",Js,[e.row.alpineNth>=0?(m(),g("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:i(t).alpineTitle,innerHTML:e.row.alpineSet?ko:go,onClick:d[15]||(d[15]=w(k=>i(t).onAlpineState?.(k,e.row.id),["stop","prevent"])),onPointerdown:d[16]||(d[16]=w(()=>{},["stop"])),onDblclick:d[17]||(d[17]=w(()=>{},["stop"]))},null,40,er)):C("",!0),e.row.frame!=="main"&&i(o)?(m(),g("button",{key:1,type:"button","data-sve-ht-fields":"",title:i(t).frameFieldsTitle,innerHTML:vr,onClick:d[18]||(d[18]=w(k=>i(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:d[19]||(d[19]=w(()=>{},["stop"])),onDblclick:d[20]||(d[20]=w(()=>{},["stop"]))},null,40,tr)):C("",!0)])):l(e.row)?C("",!0):(m(),g("span",or,[e.row.videoNth>=0?(m(),g("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?i(t).videoPlayTitle:i(t).videoHoldTitle,innerHTML:e.row.videoHeld?yr:kr,onClick:d[21]||(d[21]=w(k=>i(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:d[22]||(d[22]=w(()=>{},["stop"])),onDblclick:d[23]||(d[23]=w(()=>{},["stop"]))},null,40,ar)):C("",!0),e.row.alpineNth>=0?(m(),g("button",{key:1,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:i(t).alpineTitle,innerHTML:e.row.alpineSet?ko:go,onClick:d[24]||(d[24]=w(k=>i(t).onAlpineState?.(k,e.row.id),["stop","prevent"])),onPointerdown:d[25]||(d[25]=w(()=>{},["stop"])),onDblclick:d[26]||(d[26]=w(()=>{},["stop"]))},null,40,nr)):C("",!0),e.row.locked?(m(),g("button",{key:2,type:"button","data-sve-ht-lock":"","data-on":"",disabled:!i(t).canEdit||!i(t).canUnlock,title:i(t).canUnlock?i(t).unlockTitle:i(t).lockedByTitle,"aria-pressed":"true",innerHTML:br,onClick:d[27]||(d[27]=w(k=>i(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:d[28]||(d[28]=w(()=>{},["stop"])),onDblclick:d[29]||(d[29]=w(()=>{},["stop"]))},null,40,sr)):C("",!0),M(e.row)?(m(),g("button",{key:3,type:"button","data-sve-ht-eye":"",disabled:!K(e.row),title:I(e.row),innerHTML:e.row.hidden||e.row.sectionOff?pr:mr,onClick:d[30]||(d[30]=w(k=>i(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:d[31]||(d[31]=w(()=>{},["stop"])),onDblclick:d[32]||(d[32]=w(()=>{},["stop"]))},null,40,rr)):C("",!0),!p(e.row)&&!S(e.row)?(m(),g("button",{key:4,type:"button","data-sve-ht-dup":"",disabled:!K(e.row),title:K(e.row)?i(t).duplicateTitle:i(t).lockedTitle,innerHTML:gr,onClick:d[33]||(d[33]=w(k=>i(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:d[34]||(d[34]=w(()=>{},["stop"])),onDblclick:d[35]||(d[35]=w(()=>{},["stop"]))},null,40,ir)):C("",!0),p(e.row)?C("",!0):(m(),g("button",{key:5,type:"button","data-sve-ht-del":"",disabled:!K(e.row),title:K(e.row)?i(t).deleteTitle:i(t).lockedTitle,innerHTML:xr,onClick:d[36]||(d[36]=w(k=>i(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:d[37]||(d[37]=w(()=>{},["stop"])),onDblclick:d[38]||(d[38]=w(()=>{},["stop"]))},null,40,lr)),P(e.row)?(m(),g("button",{key:6,type:"button","data-sve-ht-more":"","aria-label":i(t).moreTitle,"aria-haspopup":"menu",innerHTML:Tr,onPointerenter:d[39]||(d[39]=k=>x(k.currentTarget,e.row)),onPointerleave:V,onClick:d[40]||(d[40]=w(k=>{V(),i(t).onMore?.(k.currentTarget,e.row.id)},["stop","prevent"])),onPointerdown:d[41]||(d[41]=w(()=>{},["stop"])),onDblclick:d[42]||(d[42]=w(()=>{},["stop"]))},null,40,dr)):C("",!0)]))],16,Ks),i(Lo)(e.row)?(m(),g("div",ke({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},i(t).dropId===e.row.id&&i(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:i(de)()?{"--sve-ht-depth":e.row.depth+1,"--sve-ht-ends":e.box?.roomEnds||0}:{"--sve-ht-depth":e.row.depth+1}}),[i(de)()?(m(),g("span",hr,[(m(!0),g(B,null,ae([...e.row.guides||[],e.row.cat],(k,$)=>(m(),g("i",ke({key:$,"data-sve-ht-cat":k},{ref_for:!0},_(e.row.depth+1,e.box?.roomEnds||0,$)),null,16,ur))),128))])):C("",!0),Co(O(i(t).slotText),1)],16,cr)):C("",!0)],64))}},J=Wt(_r,[["__scopeId","data-v-c06bd31f"]]),Sr=["data-sve-ht-look","data-sve-ht-layers"],Cr={key:0,class:"sve-ht-page-template"},Er={key:0,class:"sve-ht-page-template__text"},Pr={class:"sve-ht-page-template__note"},Hr={key:1,class:"sve-ht-empty"},Mr={key:2,class:"sve-ht-empty"},Lr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},Ir={key:0,class:"sve-ht-empty"},Rr={key:0,class:"sve-ht-empty"},Or=["data-sve-ht-under-main"],$r={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},Dr={key:0,class:"sve-ht-empty"},Ar=["data-sve-ht-under-main"],Fr=["data-dim"],Br={key:0,class:"sve-ht-empty"},Nr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Vr={key:0,class:"sve-ht-empty"},jr={key:4,"data-sve-ht-branch":"","data-sve-ht-cat":"component"},Kr={__name:"HtmlTreeList",setup(e){const o=le(()=>Xo(t.query)),n=le(()=>Vs(t.rows,o.value)),a=le(()=>n.value.rows),s=le(()=>de()?js(a.value,Lo,t.frame?.kind==="main"&&!t.mainShut?1:0):new Map),l=le(()=>o.value?t.sections.filter(I=>It(I.row,o.value)||I.current&&I.ready&&a.value.length>0):t.sections);function r(I){return!!I&&(!o.value||It(I,o.value))}function h(I){const R=t.frame?.kind;return t.inComponent||(R==="header"||R==="footer")&&R!==I}const f=le(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),p=le(()=>!!t.frame&&["header","main","footer"].some(I=>r(t.frame[I]))),S=le(()=>!!t.frame&&(t.frame.kind==="main"||r(t.frame.main))),T=le(()=>!!o.value&&!l.value.length&&!a.value.length&&!p.value);function P(I){return!!o.value&&!n.value.hits.has(I.path)}function M(I){const R={"data-sve-ht-sec-uid":I.uid};return I.current&&(R["data-sve-ht-branch"]="",R["data-sve-ht-cat"]=I.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===I.uid&&(R["data-sve-ht-drop"]=t.sectionDrop.place),R}return(I,R)=>(m(),g("div",ke({class:"sve-ht-root","data-sve-ht-look":i(t).layers?"tags":i(t).look,"data-sve-ht-layers":i(t).layers?"":null,style:i(t).familyStyle},i(t).dragging?{"data-sve-ht-dragging":""}:{}),[i(t).pageTemplate?(m(),g("div",Cr,[i(t).pageTemplate.text?(m(),g("p",Er,O(i(t).pageTemplate.text),1)):C("",!0),F("p",Pr,O(i(t).pageTemplate.note),1),i(t).pageTemplate.canOpen?(m(),g("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:R[0]||(R[0]=x=>i(t).pageTemplate.onOpen(x.currentTarget))},O(i(t).pageTemplate.openLabel),1)):C("",!0)])):!i(t).rows.length&&!i(t).sections.length&&!i(t).frame?(m(),g("div",Hr,O(i(t).emptyText),1)):T.value?(m(),g("div",Mr,O(i(t).searchEmpty),1)):C("",!0),i(t).frame||i(t).sections.length?(m(),g(B,{key:3},[i(t).frame?(m(),g(B,{key:0},[i(t).frame.kind==="header"?(m(),g("div",Lr,[(m(!0),g(B,null,ae(a.value,x=>(m(),Y(J,{key:x.id,row:x,dim:P(x),box:s.value.get(x.id)},null,8,["row","dim","box"]))),128)),i(t).rows.length?C("",!0):(m(),g("div",Ir,O(i(t).emptyText),1))])):!f.value&&r(i(t).frame.header)?(m(),Y(J,{key:1,row:i(t).frame.header,dim:h("header")},null,8,["row","dim"])):C("",!0)],64)):C("",!0),f.value?C("",!0):(m(),g("div",Ca(ke({key:1},i(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[i(t).frame?.kind==="main"?(m(),g(B,{key:0},[(m(!0),g(B,null,ae(a.value,x=>(m(),Y(J,{key:x.id,row:x,dim:P(x),box:s.value.get(x.id)},null,8,["row","dim","box"]))),128)),i(t).rows.length?C("",!0):(m(),g("div",Rr,O(i(t).emptyText),1))],64)):i(t).frame&&r(i(t).frame.main)?(m(),Y(J,{key:1,row:i(t).frame.main,dim:h("main")},null,8,["row","dim"])):C("",!0),i(t).frame?.kind==="template"?Mt((m(),g("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":S.value?"":null},[F("div",$r,[(m(!0),g(B,null,ae(a.value,x=>(m(),Y(J,{key:x.id,row:x,dim:P(x),box:s.value.get(x.id)},null,8,["row","dim","box"]))),128)),i(t).rows.length?C("",!0):(m(),g("div",Dr,O(i(t).emptyText),1))])],8,Or)),[[lo,!i(t).mainShut]]):C("",!0),i(t).sections.length||i(t).frame?Mt((m(),g("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":S.value?"":null},[i(t).frame?.template&&r(i(t).frame.template)?(m(),Y(J,{key:0,row:i(t).frame.template,dim:h("template")},null,8,["row","dim"])):C("",!0),i(t).frame&&!i(t).frame.template&&!i(t).sections.length&&!o.value?(m(),g("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":h("")?"":void 0},O(i(t).frameEmptyText),9,Fr)):C("",!0),(m(!0),g(B,null,ae(l.value,x=>(m(),g("div",ke({key:x.uid},{ref_for:!0},M(x)),[x.ready?(m(),g(B,{key:0},[(m(!0),g(B,null,ae(a.value,V=>(m(),Y(J,{key:V.id,row:V,dim:P(V),box:s.value.get(V.id)},null,8,["row","dim","box"]))),128)),i(t).rows.length?C("",!0):(m(),g("div",Br,O(i(t).emptyText),1))],64)):(m(),Y(J,{key:1,row:x.row,dim:h("")},null,8,["row","dim"]))],16))),128))],8,Ar)),[[lo,!i(t).frame||!i(t).mainShut]]):C("",!0)],16)),i(t).frame?(m(),g(B,{key:2},[i(t).frame.kind==="footer"?(m(),g("div",Nr,[(m(!0),g(B,null,ae(a.value,x=>(m(),Y(J,{key:x.id,row:x,dim:P(x),box:s.value.get(x.id)},null,8,["row","dim","box"]))),128)),i(t).rows.length?C("",!0):(m(),g("div",Vr,O(i(t).emptyText),1))])):!f.value&&r(i(t).frame.footer)?(m(),Y(J,{key:1,row:i(t).frame.footer,dim:h("footer")},null,8,["row","dim"])):C("",!0)],64)):C("",!0)],64)):i(t).inComponent&&i(t).rows.length?(m(),g("div",jr,[(m(!0),g(B,null,ae(a.value,x=>(m(),Y(J,{key:x.id,row:x,dim:P(x),box:s.value.get(x.id)},null,8,["row","dim","box"]))),128))])):i(t).rows.length?(m(!0),g(B,{key:5},ae(a.value,x=>(m(),Y(J,{key:x.id,row:x,dim:P(x),box:s.value.get(x.id)},null,8,["row","dim","box"]))),128)):C("",!0)],16,Sr))}},xt=Wt(Kr,[["__scopeId","data-v-b417b999"]]);let wt=null;function Ur(e){return wt||(wt=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():{pages:[]}).then(o=>Array.isArray(o.pages)?o.pages:[]).catch(()=>[])),wt}let nt=null;function _t(){nt?.dismiss(),nt=null}function qr(e,o,n){_t();const a=o?.getBoundingClientRect?.(),s={x:a?a.left:0,y:a?a.bottom+4:0};Ur(e).then(l=>{const r=l.length?l.map(h=>({label:h.title||h.url,onPick:()=>{_t(),n(h.url)}})):[{label:v(e,"component_props_pages_none"),onPick:null}];_t(),nt=Oe(e.document,$e,{items:r,x:s.x,y:s.y,onClose:()=>{nt=null}})})}function Wo(e){for(const o of e||[]){if(o.kind==="component"||o.kind==="svg"&&o.dynamic)continue;const n=o.kind==="antlers"?Wo(o.children):o;if(n)return n}return null}const z=Pn("sve-call-values"),Yr="__sve-html-tree-style";function zr(e,o,n){if(o||n)return!1;const a=String(b("dock:chrome-kind")||"");if(a==="header"||a==="footer")return!1;const s=Eo(e);return!!s&&s!=="create"&&La(e)!==Ia(e)}function Qt(e){return{sectionLoops:Ma(e),sectionsLabel:v(e,"html_tree_sections_slot")}}function Xr(e,o){const n={entry:o,text:"",note:v(e,"html_tree_page_template_note"),openLabel:v(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return No(e,{entry:o}).then(a=>{!a||t.pageTemplate?.entry!==o||(t.pageTemplate={...t.pageTemplate,text:v(e,"html_tree_page_template",{name:a.name}),canOpen:!!a.open,onOpen:a.open?s=>sn(e,s,a.open):null})}),n}function Wr(e,o){const n=o.replace(/^view:/,"");if(!n||b("dock:current-type")!==o){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==n&&(t.usedBy=null,No(e,{view:n}).then(a=>{if(!a||b("dock:current-type")!==o)return;const s=a.everything?[{name:v(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:a.used_by.map(l=>({...l,...Gr(e,l)}));t.templateSections=Array.isArray(a.sections_fields)?a.sections_fields:[],t.usedBy={view:n,label:v(e,"html_tree_used_by"),items:s,empty:s.length?"":v(e,"html_tree_used_by_nobody"),hint:s.length?v(e,"html_tree_used_by_hint",{list:s.map(l=>l.name).join(", ")}):""}}))}function Gr(e,o){if(!o.url)return{openLabel:"",onOpen:null};const n=v(e,"html_tree_used_by_open",{name:o.name});return o.kind==="page"?{openLabel:n,onOpen:a=>hn(e,a,un(e,o.url))}:{openLabel:n,onOpen:a=>vn(e,{anchor:a,url:o.url,subtitle:o.name})}}const A=new Set;let Rt="",Me=!1,St=null,be=!0,X="",Se=0,Go="";const Ce=new Map,je=new Set,Ot=new Map,st=new Map;let q="",Zo=!1,D=null,rt=null,tt="",Ye="",it=0,$t=null,ye=[],_e=null,Ke=null,lt=null,dt=null,Dt=null,he=!1,te=null,ze=null,Ue=null,ct=null,ht=null,At=null,we=null;function W(e){return e.getElementById(at)}function Zr(e){Ea(e,Yr,`
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
       The tags look with the layers switch off — the one the tree opens in.
       Since 6 Nov 2026 it draws the tree as Etch's structure panel does.
       Every rule hangs off :not([data-sve-ht-layers]), so the layers look
       above — the tags rules plus its own — is exactly what it was.
       1. Every element is a card; an open one is a box, and its children
          sit inside it one level in. The rows are flat, so each row paints
          its share of the boxes it is inside: one <i> per level in its
          spacer (HtmlTreeRow levelBind), reaching left to that level's
          edge and up across the gap above the row; the last row in a box
          rounds it off below (cp/html-tree/boxes.js says which). Every
          layer is the same grey at a low alpha, so where they stack the
          deeper box reads lighter, whatever order they paint in.
       2. An empty div, section or list shows its room — the dashed slot an
          empty loop shows — inside its box, and folds like a parent.
       3. <div> first, then the name, in the panel's sans; the classes
          after the name, faint, the first to give way. The icon keeps its
          family's colour (Live Preview settings).
       4. The picked row in the search field's grey; the arrow a filled
          triangle. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) {
      --sve-ht-gap: 0.25rem;
      --sve-ht-pad: 0.3125rem;
      --sve-ht-radius: 0.3125rem;
      --sve-ht-box: rgba(128,128,128,.05);
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
    /* Main's box: the frame body holds the sections main holds. It tucks up
       under main's row across the gap, so main's card heads the box. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-frame-body][data-sve-ht-under-main] {
      --sve-ht-base: 1;
      margin: calc(-1 * var(--sve-ht-gap)) 0 var(--sve-ht-gap);
      padding: var(--sve-ht-gap) 0 0;
      background: var(--sve-ht-box);
      border-radius: 0 0 var(--sve-ht-radius) var(--sve-ht-radius);
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] + [data-sve-ht-row],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-sec] {
      /* Below only, so two rows' gaps never collapse into one: the gap, and
         the room at the foot of every box that closes after this row. */
      margin: 0 0 calc(var(--sve-ht-gap) + var(--sve-ht-pad) * var(--sve-ht-ends, 0)) calc((var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * var(--sve-ht-step));
      padding: 0.0625rem 0.375rem 0.0625rem var(--sve-ht-inset);
      min-height: 1.75rem;
      border-radius: var(--sve-ht-radius);
      /* The spacer's layers paint under the row's content, over nothing else. */
      isolation: isolate;
    }
    /* The card is the spacer's (below), so the row itself wears nothing. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row]:hover,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-current],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-current]:hover {
      background: none;
      box-shadow: none;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-indent] {
      display: block;
      position: absolute;
      inset: 0;
      width: auto;
      z-index: -1;
      pointer-events: none;
    }
    /* The slot's spacer covers its border too. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-slot] > [data-sve-ht-indent] { inset: -1px; }
    /* One box the row is inside, --sve-ht-up levels out. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-indent] i,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row]:has(> [data-sve-ht-twist]:not([data-sve-ht-shut])) + [data-sve-ht-row] [data-sve-ht-indent] i:last-child {
      position: absolute;
      display: block;
      width: auto;
      margin: 0;
      opacity: 1;
      top: calc(-1 * (var(--sve-ht-gap) + var(--sve-ht-pad) * var(--sve-ht-after, 0)));
      bottom: 0;
      left: calc(-1 * var(--sve-ht-up, 0) * var(--sve-ht-step));
      right: 0;
      background: var(--sve-ht-box);
    }
    /* The box closes after this row: down past the row, one pad per box
       nested inside it, and round. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-indent] i[data-sve-ht-end] {
      bottom: calc(-1 * var(--sve-ht-pad) * var(--sve-ht-up, 0));
      border-radius: 0 0 var(--sve-ht-radius) var(--sve-ht-radius);
    }
    /* The row's own box starts at the row (open, so children or a room
       follow), and its card sits on top. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] > [data-sve-ht-indent]::before,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] > [data-sve-ht-indent]::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: var(--sve-ht-radius);
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row]:has(> [data-sve-ht-twist]:not([data-sve-ht-shut])) > [data-sve-ht-indent]::before {
      background: var(--sve-ht-box);
      border-radius: var(--sve-ht-radius) var(--sve-ht-radius) 0 0;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] > [data-sve-ht-indent]::after { background: var(--sve-ht-card); }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row]:hover > [data-sve-ht-indent]::after { background: var(--sve-ht-card-hover); }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-current] > [data-sve-ht-indent]::after { background: var(--sve-ht-card-pick); }
    /* Held back — hidden, or only the way to a search match: the content
       fades, not the row, whose layers are part of the boxes around it. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-hidden],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-dim] { opacity: 1; }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-hidden] > :not([data-sve-ht-indent]) { filter: opacity(.5); }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-dim] > :not([data-sve-ht-indent]) { filter: opacity(.45); }
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
    /* The room inside an empty element: one level in, in its row's box. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-slot][data-sve-ht-id] {
      position: relative;
      isolation: isolate;
      display: flex;
      align-items: center;
      margin: 0 0 calc(var(--sve-ht-gap) + var(--sve-ht-pad) * var(--sve-ht-ends, 0)) calc((var(--sve-ht-depth, 0) + var(--sve-ht-base, 0)) * var(--sve-ht-step));
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
    /* A filled triangle, as Etch draws it; it turns as the chevron did. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-twist] svg { display: none; }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-twist]::before {
      content: '';
      border-style: solid;
      border-width: 0.3125rem 0.25rem 0;
      border-color: currentColor transparent transparent;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-text] {
      font-family: inherit;
      font-size: 0.75rem;
      gap: 0.3125rem;
    }
    /* <div>, then the name: one face, the tag a shade back. Still the
       button a double-click changes. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-tag],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-kind] {
      flex: none;
      padding: 0;
      background: none;
      opacity: 1;
      color: color-mix(in srgb, currentColor 55%, transparent);
      font: inherit;
      font-weight: 400;
      letter-spacing: 0;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-tag]:hover {
      background: none;
      color: inherit;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-tag],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-kind] { background: none; }
    /* Brackets on what is a tag: a tag row's, a shut section's, the frame's. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-tag]::before,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-sec] [data-sve-ht-kind]::before,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-frame] [data-sve-ht-kind]::before { content: '<'; }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-tag]::after,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-sec] [data-sve-ht-kind]::after,
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-frame] [data-sve-ht-kind]::after { content: '>'; }
    /* The name keeps its room; the classes after it give way first. */
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-name],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row][data-sve-ht-depth="0"] [data-sve-ht-name],
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-row] [data-sve-ht-rename] {
      flex: 0 1 auto;
      min-width: 1.5em;
      opacity: 1;
      font-weight: inherit;
    }
    [data-sve-ht-look="tags"]:not([data-sve-ht-layers]) [data-sve-ht-name][data-sve-ht-classes]::after {
      content: " · " attr(data-sve-ht-classes);
      color: color-mix(in srgb, currentColor 45%, transparent);
      font: 400 0.6875rem/1.35 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }
  `)}function G(){const e=b("dock:html");return typeof e=="string"?e:""}function Qo(e){return!!b("dock:is-open",e)}function De(e,{save:o=!1,unlock:n=!1}={}){return ut()||b("dock:set-html",n?{html:e,unlock:!0}:e)!==!0?!1:(o&&b("dock:save-now"),!0)}function Ct(e){const o=b("dock:component-exit-state")||{};if(t.exitOpen=!!o.open,!o.open){t.onExit=null;return}t.exitName=o.name||"",t.exitLabel=v(e,"component_exit"),t.exitTitle=v(e,o.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{b("dock:exit-component"),H(e)}}const Xe=[];let Et=!1;function Pt(e,o){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(o,{timeout:2e3});return}e.setTimeout(o,200)}function Qr(e,o){for(const n of o){const a=n.type;!a||Ce.has(a)||je.has(a)||Xe.includes(a)||Xe.push(a)}Yt.htmlTreePrefetchArmed&&Jo(e)}function al(e){Yt.htmlTreePrefetchArmed=!0,Jo(e)}function Jo(e){if(Et||!Xe.length)return;Et=!0;const o=()=>{const n=Xe.shift();if(!n){Et=!1;return}if(Ce.has(n)||je.has(n)){Pt(e,o);return}je.add(n),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(n)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(a=>a.ok?a.json():null).then(a=>{if(typeof a?.html=="string"){Ce.set(n,a.html);const s=st.get(n);st.delete(n),s&&s!==ea(e,n)&&H(e)}}).catch(()=>{}).finally(()=>{je.delete(n),Pt(e,o)})};Pt(e,o)}function ut(){return!!q}function ea(e,o){return ta(o)||Ra(e,o)||"section"}function ta(e){const o=Ce.get(e);if(!o)return"";const n=Ot.get(e);if(n&&n.html===o)return n.tag;const a=Jt(Ge(o))?.tag||"";return Ot.set(e,{html:o,tag:a}),a}function Qe(e,o){const n=mt(e)||"page_sections",a=[];for(const s of Ut(o)||[]){if(s.name===nn||s.name===xn)continue;const l=qt(s.values),r=l&&typeof l=="object"?l[n]:null;if(Array.isArray(r)){r.forEach(h=>{if(!h||typeof h!="object"||Array.isArray(h)||typeof h.type!="string")return;const f=[h._visual_id,h.id,h._id].filter(M=>typeof M=="string"&&M!=="");if(!f.length)return;const p=Bo(e,h),S=typeof h._sve_label=="string"?h._sve_label.trim():"",T=ea(e,p);ta(p)||st.set(p,T);const P=Yo(p)[`0:${T}`];a.push({uid:f[0],ids:f,type:p,tag:T,label:S||(typeof P=="string"&&P.trim()?P.trim():"")||pt(e,p)?.display||qe(p)||p,svg:qo(T,yo(T),null).svg||Le.section,cat:Ao(T,yo(T)),enabled:h.enabled!==!1,static:Va(e,p)})});break}}return a}function Jr(e,o,n){if(!n.length)return"";const a=b("dock:current-type")||"",s=b("dock:current-uid"),l=!!b("dock:component-exit-state")?.open;if(s){const r=Ze(s,o),h=n.find(f=>f.ids.some(p=>r.includes(p)));if(h&&(l||h.type===a))return h.uid}return n.find(r=>r.type===a)?.uid||""}function ei(e,o,n){const a=b("dock:component-exit-state");if(a?.open)return qe(a.name)||a.name||"";if(n)return o.find(l=>l.uid===n)?.label||"";const s=b("dock:current-type")||"";return String(s).startsWith("view:")?"":pt(e,s)?.display||qe(s)||""}function gt(e,o,n,a,s){const l=n.find(r=>r.uid===a);l&&a!==s&&(A.clear(),D=null,be=!1,N(),Je(),b("build:reveal",{ids:l.ids}),X=a,Go=G(),q=Ce.get(l.type)||"",q&&(D=Bt(Ge(q))||null),Zo=(b("dock:current-type")||"")===l.type,e.clearTimeout(Se),Se=e.setTimeout(()=>{X="",Me=!1,H(e)},4e3),H(e),cn(e,l.uid,"tree"),Te({source:Z,type:j.SVE_ACTIVATE,ids:l.ids},e),e.setTimeout(()=>H(e),0))}function Ft(e,o){if(!o)return!1;for(const n of e||[])if(n.id===o||Ft(n.children,o))return!0;return!1}function Bt(e){return Jt(e)?.id||""}function Jt(e){for(const o of e||[]){if(oa(o))return o;const n=Jt(o.children);if(n)return n}return null}function oa(e){return!e.kind||e.kind==="component"}function yo(e){return e==="component"?"component":""}function ti(e,o){const n=o===0||e.path===Ye;return A.has(e.path)?n:!n}function oi(e){const o=new Set,n=de(),a=(s,l)=>{for(const r of s)(r.children.length?ti(r,l):n&&(r.kind==="antlers"||r.hollow)&&A.has(r.path))&&o.add(r.id),a(r.children,l+1)};return a(e,0),o}function H(e){const o=e.document,a=W(o)?.querySelector("[data-sve-html-tree-list]");if(!a)return;Zr(o),Cn(e);const s=G();q&&q===s&&(q=""),b("dock:chrome-kind")&&(q="");const l=q||s,r=Ge(l,Qt(e));ye=r,Ye="";const h=b("dock:current-type")||"",f=Yo(h),p=Ha(e,o),T=!!(b("dock:component-exit-state")||{}).open;h&&s&&!q&&Ce.set(h,s);const P=Qe(e,o);Qr(e,P);const M=Jr(e,o,P);if(zr(e,p,T)){const c=Eo(e);ye=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==c&&(t.pageTemplate=Xr(e,c)),t.onRefresh=()=>H(e),t.onSection=null,Ct(e),Ve(a,xt),Ht(e,[]);return}t.pageTemplate=null,Wr(e,String(b("dock:collection-view")||""));const I=String(b("dock:chrome-kind")||"");if(Ja(e),p&&!P.length&&!I){ye=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyText=v(e,"html_tree_page_empty"),t.canEdit=!b("dock:is-locked"),t.look=vo(e),t.onRefresh=()=>H(e),t.onSection=null,Ct(e),Ve(a,xt),Ht(e,[]);return}t.pageBuilder=p;const R=`${h}|${M}`;let x=!1;R!==Rt&&(Rt=R,A.clear(),St!==null&&l!==St?x=!0:Me=l),(x||Me!==!1&&l!==Me)&&(Me=!1,A.clear(),D=Bt(r)||null),St=l,X&&(X===M||!P.length)&&(Zo||l!==Go)&&(e.clearTimeout(Se),X="",Me=!1,Ft(r,D)||(A.clear(),D=Bt(r)||null));const V=P.some(c=>c.uid===X)?X:"",Q=be?"":V||M,K=!!(V||M),L=K||T?"":String(b("dock:chrome-kind")||""),u=p&&(!h&&!K||L==="main"&&b("dock:on-empty-page")===!0),d=u||L==="template"?"":L;t.layoutFile=d==="main",d!=="main"&&(tt="");const k=d==="main"?bo(r,"main"):null,$=k?vt(r,c=>c.tag==="body"&&Ft(c.children,k.id)):null;Ye=$?$.path:"",k&&(ot(($||k).path),tt!==R&&(ot(k.path),A.add(k.path)));const Ae=d==="header"||d==="footer"?vt(r,c=>l.slice(c.from,c.openTo).includes(`data-sve-chrome="${d}"`)):null,ue=Ae||(d==="header"||d==="footer"?bo(r,d):null);ue&&ot(ue.path);const U=u||!(d==="main"?!!k:d==="header"||d==="footer"?!!ue:!0)?[]:en(r,t.query?new Set:oi(r));!l.trim()&&!Qo(o)?t.emptyText=v(e,"html_tree_need_dock"):t.emptyText=v(e,"html_tree_empty"),t.slotText=v(e,"antlers_drop_here"),t.dataTitle=v(e,"data_vars_title"),t.pageTitle=v(e,"component_props_page"),t.renameTitle=v(e,"html_tree_rename"),t.tagTitle=v(e,"tw_tag"),t.hideTitle=v(e,"html_tree_hide"),t.showTitle=v(e,"html_tree_show"),t.sectionHideTitle=v(e,"html_tree_section_hide"),t.sectionShowTitle=v(e,"html_tree_section_show"),t.moreTitle=v(e,"html_tree_more"),t.duplicateTitle=v(e,"html_tree_duplicate"),t.deleteTitle=v(e,"html_tree_delete"),t.videoHoldTitle=v(e,"html_tree_video_hold"),t.videoPlayTitle=v(e,"html_tree_video_play"),t.alpineTitle=v(e,"html_tree_alpine_state"),t.lockedTitle=v(e,"html_tree_locked"),t.searchEmpty=v(e,"html_tree_search_empty"),t.canEdit=!b("dock:is-locked"),t.look=vo(e),t.onQuery=()=>H(e),Ct(e),t.inComponent=T,t.onSelect=(c,y)=>{const E=U.find(ne=>ne.id===c);if(E&&Uo(e,E.path))return;y&&!Kn()&&(t.rowClicks+=1);const ie=!!y&&E?.kind==="antlers"&&!he&&tn(e);Re(e,c,U),y&&E&&!he&&!ut()&&b("build:reveal",{path:E.path,section:!!E.sectionRoot}),ie&&Zn(e,{path:E.path,at:y,beside:W(e.document)})},t.onTwist=c=>{const y=U.find(E=>E.id===c)?.path;y&&(A.has(y)?A.delete(y):A.add(y),H(e))},t.onTagChange=(c,y)=>{const E=t.rows.find(ie=>ie.id===y);E&&!ut()&&!eo(e,E)&&En(e,c.currentTarget,E)},t.onRename=c=>di(e,c),t.onRenameCommit=()=>To(e,!0),t.onRenameCancel=()=>To(e,!1),t.onHide=c=>fi(e,c),t.onLock=c=>sa(e,c),t.onMore=(c,y)=>yi(e,c,y),t.canUnlock=na(e),t.lockTitle=v(e,"html_tree_lock"),t.unlockTitle=v(e,"html_tree_unlock"),t.lockedByTitle=v(e,"html_tree_locked_by_developer"),t.onVideoHold=c=>hi(e,c),t.onAlpineState=(c,y)=>vi(e,c,y),t.onDuplicate=c=>mi(e,c),t.onDelete=c=>gi(e,c),t.onPointerDown=(c,y)=>xi(e,c,y),t.onSectionPointerDown=(c,y)=>Ci(e,c,y),t.onSectionHover=c=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:c}})),t.onContext=(c,y)=>ca(e,c,y),t.onInspectCommit=c=>Ri(e,c),t.onPropValue=(c,y,E)=>So(e,c,y,E),t.onPropPage=(c,y)=>qr(e,c,E=>So(e,y,E,!1)),t.onLoopKind=c=>Oi(e,c),t.onAddBranch=c=>$i(e,c),t.onLoopSortField=c=>{const y=ft();if(!y)return;const E=we?.id===y.id?we.dir:"";we=null,ce(e,ts(y,c,E))},t.onLoopSortDir=c=>{const y=ft();if(!y)return;const E=os(y,c);if(E.draft){we={id:y.id,dir:E.draft},jt(e,y);return}we=null,ce(e,E.edit)},t.onLoopDepth=c=>ce(e,ss(c)),t.onLoopIncludeHome=c=>ce(e,rs(c)),t.onLoopLimit=c=>ce(e,is(c)),t.onLoopOffset=c=>ce(e,ls(c)),t.onPropHost=c=>c?z.mount(c):z.unmount(),t.onInspectData=(c,y)=>{b("dock:data-menu",{anchor:c,at:U.find(E=>E.id===D)?.from,onPick:E=>y(String(E?.var||"").trim())})};const yt=U.find(oa)?.id,et=T?"":ei(e,P,Q),ve=Q&&!T?P.find(c=>c.uid===Q):null;t.nameAt=(c,y)=>{if(y!==l||!c)return"";const E=se=>{for(const re of se||[]){if(re.path===c)return re;const Be=c.startsWith(`${re.path}/`)?E(re.children):null;if(Be)return Be}return null},ie=t.look==="tags"&&!t.layers,ne=t.rows.find(se=>se.path===c&&!se.kind);if(ne)return ie&&ne.display?ne.display:ne.name;const oe=E(r);if(!oe)return"";const Fe=oe.id===yt,Pe=Fe&&et?et:oe.klass,He=Fe&&ve?Pe:po(Pe,oe.path,f);return ie&&!Fe&&He===oe.klass?"":He};const pa=$o(e,String(b("dock:current-type")||""));let ga=0;const ka=ui(Ae?[Ae]:r,l),ya=Do(e,String(h)),fe=d==="header"||d==="footer"?d:"",Ee=ue?ue.id:"",xe=k&&U.find(c=>c.id===k.id)||null,so=$&&U.find(c=>c.id===$.id)||null,me=so||xe||Ee&&U.find(c=>c.id===Ee)||null,ro=me?ri(U,me):-1;if(me&&!U.slice(U.indexOf(me),ro).some(c=>c.id===D)&&(D=me.id),t.selectFrom){const c=U.find(y=>y.from===t.selectFrom.at&&(!y.kind||y.kind==="sections"));c?(D=c.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const io=t.layoutFile?si(e):null;t.rows=U.map(c=>{const y=io&&c.kind==="component"&&io.get(c.src)||"",E=c.tag==="body"&&!c.kind,ie=y?{svg:Le[y]}:qo(c.tag,c.kind,c.antlers),ne=c.tag==="video"&&!c.kind?ga++:-1,oe=ka.get(c.id),Fe=oe?ya[oe.nth]||{}:{},Pe=oe?oe.booleans.map(({key:re,value:Be})=>({key:re,file:Be,value:Fe[re]??Be})):[],He=c.id===yt&&et?et:c.klass,se=c.id===yt;return{...c,tag:y||c.tag,frameCall:y,fixed:!!y||E,base:He,name:y?v(e,`html_tree_frame_${y}`):fe&&c.id===Ee?v(e,`html_tree_frame_${fe}`):c===xe?v(e,"html_tree_frame_main"):se&&ve?He:po(He,c.path,f),current:c.id===D,letter:ie.letter||"",svg:fe&&c.id===Ee?Le[fe]:c===xe?Le.main:se&&ve?ve.svg:ie.svg||"",frame:fe&&c.id===Ee?fe:c===xe?"main":"",cat:fe&&c.id===Ee?fe:c===xe||E?"main":y||Ao(c.tag,c.kind,c.antlers),componentRoot:se&&T,sectionRoot:se&&ve?ve.uid:"",sectionOff:!!(se&&ve&&!ve.enabled),videoNth:ne,videoHeld:ne>=0&&pa.has(ne),alpineNth:Pe.length?oe.nth:-1,alpineKeys:Pe,alpineSet:Pe.some(re=>re.value!==re.file)}});const ba=Qn(l,r);for(const c of t.rows){const y=c.kind?null:ba.get(c.path);y&&(c.classes=y.classes,y.kind!=="tag"&&!c.frame&&!c.fixed&&!c.sectionRoot&&c.name===c.klass&&(c.display=y.kind==="column"?v(e,"el_column",{n:y.index}):v(e,`el_${y.kind}`)))}on(e),an(e);const bt=[];for(const c of t.rows)bt.length=c.depth,c.guides=bt.slice(),bt[c.depth]=c.cat;if(me){const c=U.indexOf(me),y=me.depth;t.rows=t.rows.slice(c,ro).map(E=>({...E,depth:E.depth-y,guides:E.guides.slice(y)})),xe&&tt!==R&&(tt=R,e.setTimeout(()=>Re(e,xe.id,U),0))}t.sections=p&&!T&&(K||d||u)?P.map(c=>{const y=!!Q&&c.uid===Q;return{...c,current:y,ready:y&&(!V||!!q),row:{id:`sec:${c.uid}`,section:c.uid,tag:c.tag,name:c.label,kind:"",svg:c.svg,cat:c.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:y,hidden:!c.enabled}}}):[],t.frame=ni(e,P,K,T,d,!1,!!so),t.frameEmptyText=v(e,"html_tree_frame_no_sections"),ai(e,d),t.onSection=c=>{he||(Nt(e),gt(e,o,P,c,Q))},t.onRefresh=()=>H(e),jt(e,t.rows.find(c=>c.id===D)),Ve(a,xt),Ht(e,r)}function ai(e,o){t.frameOpenTitle=v(e,"html_tree_frame_open"),t.frameMainTitle=v(e,"html_tree_frame_main_open"),t.frameTemplateTitle=v(e,"html_tree_frame_template_open"),t.frameFieldsTitle=v(e,"html_tree_frame_fields"),t.onFrame=n=>{o===n?ii(e,n):Vt(e,n)},t.onFrameEnter=n=>Vt(e,n),t.onFrameFields=n=>Ka(e,ln(e,n),v(e,`html_tree_frame_${n}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function ni(e,o,n,a,s,l=!1,r=!1){if(!s&&!l||r)return null;const h=S=>({id:`frame:${S}`,frame:S,synthetic:!0,tag:S,name:v(e,`html_tree_frame_${S}`),kind:"",svg:Le[S]||"",cat:S,letter:"",depth:0,hasChildren:S==="main"&&(o.length>0||s==="template"),shut:S!=="main",current:!1,hidden:!1}),f={kind:s,header:h("header"),main:h("main"),footer:h("footer"),template:null},p=s&&s!=="template"?String(b("dock:collection-view")||""):"";return p&&(f.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:pt(e,p)?.display||qe(p.replace(/^view:/,"")),kind:"",svg:Le.section||"",cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),f}function bo(e,o){return vt(e,n=>n.tag===o)}function vt(e,o){for(const n of e||[]){if(!n.kind&&o(n))return n;const a=vt(n.children,o);if(a)return a}return null}function si(e){const o=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},n=new Map;for(const a of["header","footer"]){const s=Mn(o[a]?.type);s&&n.set(s,a)}return n}function ri(e,o){let n=e.indexOf(o)+1;for(;n<e.length&&e[n].depth>o.depth;)n+=1;return n}function ii(e,o){const n=Ko(e);(o==="main"||o==="template"?n?.querySelector("main"):n?.querySelector(`[data-sve-chrome="${o}"]`))?.scrollIntoView({behavior:bn(),block:"start"})}function Nt(e){const o=String(b("dock:chrome-open",e.document)||"");return o!=="header"&&o!=="footer"?!1:(dn(e),Te({source:Z,type:j.SVE_FORCE_EXIT_CHROME},e),!0)}function li(e){e.clearTimeout(Se),X="",q="",A.clear(),D=null,be=!1,N(),Je()}function Vt(e,o){if(e.document,String(b("dock:chrome-kind")||"")===o)return;if(li(e),o==="main"){Nt(e),b("dock:open-file",wn);return}if(o==="template"){const l=String(b("dock:collection-view")||"");l&&(Nt(e),b("dock:open-file",l));return}if(o!=="header"&&o!=="footer")return;const n=Ko(e)?.querySelector(`[data-sve-chrome="${o}"]`);n?(n.scrollIntoView({block:"nearest"}),n.dispatchEvent(new n.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:Z,type:j.OPEN_CHROME,kind:o},e.location.origin);const a=Date.now(),s=async()=>{if(String(b("dock:chrome-kind")||"")!==o){Date.now()-a<3e4&&e.setTimeout(s,250);return}await(b("dock:load-settled")||null),ma(e)};e.setTimeout(s,250)}function Ht(e,o){W(e.document)&&aa(e,o)}function aa(e,o){const n=Wo(o),a=!!b("dock:component-src"),s=a?"":b("dock:current-uid")||"";Te({source:Z,type:j.SVE_HTML_PICK,on:!0,uid:s,uids:s?Ze(s,e.document):[],all:a,tag:n?.tag||"",klass:n?.klass||"",nodes:es(o)},e)}function ot(e){if(!e)return;const o=(n,a)=>{for(const s of n||[]){if(s.path===e)return!0;if(o(s.children,a+1))return a===0||s.path===Ye?A.delete(s.path):A.add(s.path),!0}return!1};o(ye,0)}function di(e,o){if(he)return;const n=t.rows.find(a=>a.id===o);eo(e,n)||!n||n.kind||(D=o,t.rows.forEach(a=>{a.current=a.id===o}),t.editingId=o,t.draft=n.name,e.setTimeout(()=>{const a=W(e.document)?.querySelector("[data-sve-ht-rename]");a?.focus(),a?.select()},0))}function To(e,o){const n=t.editingId;if(!n)return;const a=t.rows.find(s=>s.id===n);t.editingId=null,o&&a&&(a.sectionRoot?ci(e,a.sectionRoot,t.draft):Jn(b("dock:current-type")||"",a.path,t.draft,a.base||a.klass)),t.draft="",H(e)}function ci(e,o,n){const a=mt(e)||"page_sections",s=String(n||"").replace(/\s+/g," ").trim();for(const l of Ut(e.document)||[]){const r=qt(l.values),h=r&&typeof r=="object"?r[a]:null;if(!Array.isArray(h))continue;const f=h.findIndex(P=>P&&typeof P=="object"&&[P._visual_id,P.id,P._id].includes(o));if(f===-1)continue;const p=Bo(e,h[f]),S=pt(e,p)?.display||qe(p)||p,T=JSON.parse(JSON.stringify(h));return T[f]={...T[f]},!s||s===S?delete T[f]._sve_label:T[f]._sve_label=s,l.setFieldValue(a,T),!0}return!1}function hi(e,o){const n=t.rows.find(h=>h.id===o);if(!n||!(n.videoNth>=0))return;const a=String(b("dock:current-type")||""),s=$o(e,a),l=!s.has(n.videoNth);l?s.add(n.videoNth):s.delete(n.videoNth);const r=String(b("dock:current-uid")||"");rn(e,a,s),Te({source:Z,type:j.SVE_VIDEO_HOLD,uid:r,uids:r?Ze(r,e.document):[],nth:n.videoNth,on:l},e),H(e)}function ui(e,o){const n=new Map;let a=0;const s=l=>{for(const r of l){if(r.hidden)continue;const h=r.kind?null:hs(o.slice(r.from,r.openTo));h!==null&&n.set(r.id,{nth:a++,booleans:vs(h)}),s(r.children||[])}};return s(e),n}function vi(e,o,n){const a=t.rows.find(l=>l.id===n);if(!a||!(a.alpineNth>=0))return;if(a.alpineKeys.length===1){xo(e,a,a.alpineKeys[0]);return}const s=o.currentTarget.getBoundingClientRect();N(),te=Oe(e.document,$e,{items:a.alpineKeys.map(l=>({label:l.key,icon:l.value?ia:la,onPick:()=>{N(),xo(e,a,l)}})),x:Math.round(s.left),y:Math.round(s.bottom+4),onClose:()=>{te=null}})}function xo(e,o,n){const a=String(b("dock:current-type")||""),s=Do(e,a),l=!n.value,r=l!==n.file,h={...s[o.alpineNth]||{}};r?h[n.key]=l:delete h[n.key],Object.keys(h).length?s[o.alpineNth]=h:delete s[o.alpineNth];const f=pn(String(b("dock:chrome-kind")||"")),p=f?"":String(b("dock:current-uid")||"");gn(e,a,s),Te({source:Z,type:j.SVE_ALPINE_STATE,uid:p,uids:p?Ze(p,e.document):[],chrome:f,nth:o.alpineNth,key:n.key,value:l,on:r},e),H(e)}function eo(e,o){return!o||!(o.locked||o.lockedIn)?!1:(e.Statamic?.$toast?.error(v(e,"html_tree_locked_element")),!0)}function na(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function sa(e,o){const n=t.rows.find(a=>a.id===o);if(!(!n||n.lockedIn||b("dock:is-locked"))){if(!n.locked){Ie(e,o,Un,{lockAction:!0});return}if(!na(e)){e.Statamic?.$toast?.error(v(e,"html_tree_unlock_denied"));return}zt(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>Ie(e,o,qn,{lockAction:!0,unlock:!0}))}}function to(e){return!!t.rows.find(o=>o.id===e)?.fixed}function oo(e){const o=t.sections?.find(a=>a.row?.id===e);if(o)return o;const n=t.rows.find(a=>a.id===e)?.sectionRoot;return n&&t.sections?.find(a=>a.uid===n)||null}function fi(e,o){if(to(o))return;const n=oo(o),a=t.rows.find(s=>s.id===o);if(n&&!(a?.hidden&&a.wrapFrom!=null)){e.postMessage({source:Z,type:j.HIDE_ROW,uid:n.uid,show:!n.enabled},e.location.origin),e.setTimeout(()=>H(e),60);return}Ie(e,o,Yn)}function mi(e,o){if(to(o))return;const n=oo(o)?.uid;if(n){e.postMessage({source:Z,type:j.DUPLICATE_ROW,uid:n},e.location.origin);return}Ie(e,o,zn)}function ra(e,o){zt(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const n=e.document;Tn({uid:o},n,e)})}function pi(e,o,n){X===n&&(e.clearTimeout(Se),X="",q=""),D=null,be=!1,Rt="";const a=Qe(e,o),s=a.find(l=>l.uid!==n)||a[0];s?gt(e,o,a,s.uid,""):(q="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,H(e)),e.setTimeout(()=>{W(e.document)&&H(e)},0)}Fo("row:removed",({uid:e,parentPath:o,doc:n,win:a})=>{o!==mt(a)||!W(a.document)||pi(a,n,e)});function gi(e,o){if(to(o))return;const n=t.sections?.find(s=>s.row?.id===o),a=n?n.row?.section||n.uid:t.rows.find(s=>s.id===o)?.sectionRoot;if(a){ra(e,a);return}if(t.rows.find(s=>s.id===o)?.kind==="sections"){zt(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>Ie(e,o,mo));return}Ie(e,o,mo)}function Ie(e,o,n,{lockAction:a=!1,unlock:s=!1}={}){if(b("dock:is-locked"))return;const l=G(),r=t.rows.find(f=>f.id===o);if(!r||!a&&eo(e,r))return;const h=n(l,r);h!==l&&De(h,{unlock:s})}let We=null;function ao(){We?.closest("[data-sve-ht-row]")?.removeAttribute("data-sve-ht-more-open"),We=null}function N(){te?.dismiss(),te=null,ao()}const ia='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',la='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>',pe=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,ge={up:pe('<path d="M12 19V5M6 11l6-6 6 6"/>'),down:pe('<path d="M12 5v14M6 13l6 6 6-6"/>'),save:pe('<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>'),add:pe('<path d="M12 5v14M5 12h14"/>'),blueprint:pe('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>'),fieldset:pe('<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/>'),lock:pe('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),unlock:pe('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/>')};function ki(e,o){const n=t.sections||[],a=n.findIndex(r=>r.uid===o.uid),s=(r,h={})=>()=>{N(),e.postMessage({source:Z,type:r,uid:o.uid,...h},e.location.origin),e.setTimeout(()=>H(e),60)},l=[{label:v(e,"move_up"),icon:ge.up,onPick:a>0?s(j.MOVE,{direction:-1}):null},{label:v(e,"move_down"),icon:ge.down,onPick:a>=0&&a<n.length-1?s(j.MOVE,{direction:1}):null},{label:v(e,"html_tree_save_section"),icon:ge.save,onPick:s(j.SAVE_SECTION)},{label:v(e,"add_section_below"),icon:ge.add,onPick:s(j.ADD_SET)}];if(fn(e)&&l.push({label:v(e,"blueprint"),icon:ge.blueprint,onPick:()=>{N(),mn(e)}}),Ho(e)&&o.type&&!o.static){const r=o.current&&!t.canEdit;l.push({label:v(e,"html_tree_fieldset"),icon:ge.fieldset,onPick:r?null:()=>{N(),Mo(e,o.type)}})}return l}function wo(e,o){const n=t.canEdit&&(!o.locked||t.canUnlock);return{label:o.locked?t.canUnlock?t.unlockTitle:t.lockedByTitle:t.lockTitle,icon:o.locked?ge.unlock:ge.lock,onPick:n?()=>{N(),sa(e,o.id)}:null}}function yi(e,o,n){if(!o.isConnected||te&&We===o)return;const a=oo(n),s=t.rows.find(l=>l.id===n);if(!a){ca(e,null,n,{anchor:o,lead:s?[wo(e,s)]:[]});return}N(),We=o,o.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open",""),te=Oe(e.document,$e,{items:[...ki(e,a),...s?[wo(e,s)]:[]],x:0,y:0,anchor:o,onClose:()=>{te=null,ao()}})}function da(e,o){const n=t.sections?.find(f=>f.uid===o),a=n?.type||"";if(!a||!Po(e))return[];const s=n.label||a,l=ja(e,a),r=()=>e.Statamic?.$toast?.error(v(e,"section_update_failed")),h=[{label:v(e,"static_section_insertable"),icon:l?la:ia,onPick:()=>{N(),co(e,{handle:a,hidden:!l}).then(()=>{e.Statamic?.$toast?.success(v(e,l?"section_shown_to_editors":"section_hidden_from_editors",{name:s})),ho(e)}).catch(r)}}];return n.static&&h.push({label:v(e,"section_add_fields"),onPick:()=>{N(),co(e,{handle:a,fields:!0}).then(()=>{e.Statamic?.$toast?.success(v(e,"section_fields_added",{name:s})),ho(e),H(e),Mo(e,a)}).catch(r)}}),h}function bi(e,o,n){const a=n.row?.section||n.uid;a&&(te=Oe(e.document,$e,{items:[...da(e,a),{label:v(e,"html_tree_remove_section"),danger:!0,onPick:()=>{N(),ra(e,a)}}],x:o.clientX,y:o.clientY,onClose:()=>{te=null}}))}function ca(e,o,n,{anchor:a=null,lead:s=[]}={}){N();const l=t.sections?.find(p=>p.row?.id===n);if(l){bi(e,o,l);return}const r=t.rows.find(p=>p.id===n);if(!r)return;a||Re(e,n,t.rows);const h=a?{x:0,y:0}:{x:o.clientX,y:o.clientY},f=p=>{const S=[...s,...p.map(T=>a&&T.onPick?{...T,onPick:()=>{Re(e,n,t.rows),T.onPick()}}:T)];S.length&&(te?.dismiss(),a&&(We=a,a.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open","")),te=Oe(e.document,$e,{items:S,x:h.x,y:h.y,anchor:a,onClose:()=>{te=null,ao()}}))};if(r.frameCall){f([{label:v(e,"html_tree_frame_edit",{frame:v(e,`chrome_${r.frameCall}`)}),onPick:()=>{N(),Vt(e,r.frameCall)}}]);return}if(r.kind==="component"){Ti(e,r,f);return}if(r.kind==="slot"||r.kind==="sections"||r.kind==="svg"||r.locked||r.lockedIn){f([]);return}if(!t.canEdit){f([]);return}if(r.componentRoot){f([]);return}f([...r.sectionRoot?da(e,r.sectionRoot):[],{label:v(e,"component_make"),onPick:()=>{N(),Hn(e,r,{onDone:()=>H(e),onError:p=>{e.alert(p?.status===409?v(e,"component_exists"):v(e,"component_failed"))}})}}])}const _o=(e,o)=>{N(),b("dock:open-template",o)};function Ti(e,o,n){if(!kn(o.src)){n([{label:v(e,"component_open_named",{name:yn(o.src)||o.src}),onPick:()=>_o(e,`view:partials/${o.src}`)}]);return}n([{label:v(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(o.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(a=>a.ok?a.json():{items:[]}).then(a=>{const s=Array.isArray(a.items)?a.items:[];n(s.length?s.map(l=>({label:v(e,"component_open_named",{name:l.label}),onPick:()=>_o(e,l.type)})):[{label:v(e,"component_none"),onPick:null}])}).catch(()=>n([{label:v(e,"component_none"),onPick:null}]))}function xi(e,o,n){if(o.button!==0||b("dock:is-locked")||t.editingId)return;const a=t.rows.find(r=>r.id===n);if(a&&(a.locked||a.lockedIn)||o.target?.closest?.("button, input"))return;Je(),_e=n,Ke={x:o.clientX,y:o.clientY},lt=o.currentTarget,dt=o.pointerId;const s=r=>wi(e,r),l=r=>_i(e,r);Dt=()=>{e.document.removeEventListener("pointermove",s,!0),e.document.removeEventListener("pointerup",l,!0),e.document.removeEventListener("pointercancel",l,!0),Dt=null},e.document.addEventListener("pointermove",s,!0),e.document.addEventListener("pointerup",l,!0),e.document.addEventListener("pointercancel",l,!0)}function wi(e,o){if(!_e||!Ke)return;const n=o.clientX-Ke.x,a=o.clientY-Ke.y;if(!t.dragging&&n*n+a*a<25)return;if(!t.dragging){t.dragging=!0;try{lt?.setPointerCapture?.(dt)}catch{}}o.preventDefault();const s=e.document.elementFromPoint(o.clientX,o.clientY),l=s?.closest?.("[data-sve-ht-slot]");if(l){const T=l.getAttribute("data-sve-ht-id");if(T&&T!==_e){t.dropId=T,t.dropPlace="inside";return}}const r=s?.closest?.("[data-sve-ht-row]"),h=r?.getAttribute("data-sve-ht-id");if(!h||h===_e){t.dropId=null,t.dropPlace=null;return}const f=t.rows.find(T=>T.id===h),p=t.rows.find(T=>T.id===_e);if(!f||f.lockedIn||p&&f.path.startsWith(`${p.path}/`)){t.dropId=null,t.dropPlace=null;return}const S=r.getBoundingClientRect();t.dropId=h,t.dropPlace=Bn(o.clientY-S.top,S.height,!jo(f.tag)&&!Vo(f)&&!f.locked)}function _i(e,o){const n=_e,a=t.dropId,s=t.dropPlace||"after",l=t.dragging;if(Je(),l&&(he=!0,e.setTimeout(()=>{he=!1},0)),!l||b("dock:is-locked")||!n||!a||n===a)return;o?.preventDefault?.();const r=G(),h=Nn(r,ye,n,a,s);if(h!==r){const f=s==="inside"&&de()?Si(e,r,h,n,a):null;De(h)||f?.()}}function Si(e,o,n,a,s){const l=fo(ye,a),r=fo(ye,s);if(!l||!r||r.children.length||!(r.kind==="antlers"||r.hollow))return null;const h=jn(o,l),f=h.from<r.from?r.from-(h.to-h.from):r.from,p=(I,R)=>{for(const x of I){if(x.from===f&&x.tag===r.tag)return{node:x,depth:R};const V=p(x.children,R+1);if(V)return V}return null},S=p(Ge(n,Qt(e)),0);if(!S)return null;const{path:T}=S.node,P=S.depth===0||T===Ye,M=A.has(T);return P?A.delete(T):A.add(T),()=>{M?A.add(T):A.delete(T)}}function Je(){try{lt?.releasePointerCapture?.(dt)}catch{}Dt?.(),_e=null,Ke=null,lt=null,dt=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function Ci(e,o,n){if(o.button!==0||!n||t.editingId||o.target?.closest?.("button, input"))return;ha(),ze=n,Ue={x:o.clientX,y:o.clientY},ct=o.currentTarget,ht=o.pointerId;const a=l=>Ei(e,l),s=l=>Pi(e,l);At=()=>{e.document.removeEventListener("pointermove",a,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),At=null},e.document.addEventListener("pointermove",a,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function Ei(e,o){if(!ze||!Ue)return;const n=o.clientX-Ue.x,a=o.clientY-Ue.y;if(!t.dragging&&n*n+a*a<25)return;if(!t.dragging){t.dragging=!0;try{ct?.setPointerCapture?.(ht)}catch{}}o.preventDefault();const l=e.document.elementFromPoint(o.clientX,o.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=l?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===ze){t.sectionDrop=null;return}const h=l.getBoundingClientRect();t.sectionDrop={uid:r,place:o.clientY-h.top<h.height/2?"before":"after"}}function Pi(e,o){const n=ze,a=t.sectionDrop,s=t.dragging;ha(),s&&(he=!0,e.setTimeout(()=>{he=!1},0)),!(!s||!n||!a?.uid||a.uid===n)&&(o?.preventDefault?.(),Hi(e,n,a.uid,a.place))}function ha(){try{ct?.releasePointerCapture?.(ht)}catch{}At?.(),ze=null,Ue=null,ct=null,ht=null,t.dragging=!1,t.sectionDrop=null}function Hi(e,o,n,a){const s=mt(e)||"page_sections";for(const l of Ut(e.document)||[]){const r=qt(l.values),h=r&&typeof r=="object"?r[s]:null;if(!Array.isArray(h))continue;const f=P=>h.findIndex(M=>M&&typeof M=="object"&&[M._visual_id,M.id,M._id].includes(P)),p=f(o),S=f(n);if(p===-1||S===-1||p===S)return!1;let T=a==="before"?S:S+1;return p<T&&(T-=1),T===p?!1:(e.postMessage({source:Z,type:j.MOVE,uid:o,toIndex:T},e.location.origin),e.setTimeout(()=>H(e),60),!0)}return!1}function jt(e,o){if(o?.kind==="component"){Mi(e,o);return}if(ee.callOpen&&(ee.callOpen=!1,ee.callStore=null,z.forget(),Gt(e)),o?.kind!=="antlers"){t.inspect=null;return}const n=o.id,a={logic:!0,path:o.path};if(o.tag==="else"){t.inspect={key:n,...a,title:v(e,"antlers_condition"),mode:"note",note:v(e,"antlers_else_note")};return}if(o.antlers==="loop"){t.inspect={...ns(e,o,{key:n,draft:we?.id===o.id?we.dir:""}),...a};return}t.inspect={key:n,...a,title:v(e,"antlers_condition"),mode:"condition",value:o.expr||"",placeholder:v(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:v(e,"antlers_add_elseif")},{id:"else",label:v(e,"antlers_add_else")}]}}function Mi(e,o){if(!In(e)){t.inspect=null;return}if(!o.src)return;const n=o.id;if(t.inspect={key:n,title:v(e,"component_props_values"),mode:"note",note:v(e,"code_dock_loading")},Rn()){const a={},s={},l=new Map;for(const[r,h]of On(G().slice(o.from,o.to))){const f=$n(r);f&&(r!==f||!l.has(f))&&l.set(f,h)}for(const[r,h]of l)h.bound?s[r]=h.value:a[r]=h.value;t.inspect=null,ee.callOpen=!0,ee.title=ee.title||v(e,"component_props"),ee.callTitle=o.klass||o.name||o.src,ee.callStore=z.ui,z.ui.canBind=!0,z.ui.dataTitle=v(e,"data_vars_title"),z.ui.exprPlaceholder=v(e,"component_props_expr"),z.ui.onBox=(r,h)=>Ii(e,r,h),z.ui.onPickData=(r,h)=>b("dock:data-menu",{anchor:h,at:o.from,types:Dn(z.ui.fields.find(f=>f.handle===r)?.type),onPick:f=>ua(e,r,String(f?.var||"").trim())}),z.load(e,{key:`${o.src}::${n}`,src:o.src,params:a,bindings:s,readOnly:b("dock:is-locked")===!0}),z.watch(e,{src:o.src,write:r=>Li(e,r,s)}),Gt(e);return}An(e,o.src).then(a=>{if(t.inspect?.key===n){if(!a.length){t.inspect={key:n,title:v(e,"component_props_values"),mode:"note",note:v(e,"component_props_values_none")};return}t.inspect={key:n,title:v(e,"component_props_values"),mode:"props",inheritLabel:v(e,"component_props_inherit"),rows:Fn(a,G().slice(o.from,o.to))}}})}function Li(e,o,n={}){const a=t.rows.find(r=>r.id===D);if(a?.kind!=="component"||b("dock:is-locked"))return;let s=G(),l=a.to;for(const[r,h]of Object.entries(o||{})){if(r in n)continue;const f=s.length,p=Zt(s,{from:a.from,to:l},r,h);p!==s&&(l+=p.length-f,s=p)}s!==G()&&(De(s,{save:!0}),H(e))}function ua(e,o,n){va(e,o,n,!0),H(e)}function Ii(e,o,n){const a=Vn(n);if(a){ua(e,o,a);return}z.forget(),va(e,o,String(n??"").trim(),!1),H(e)}function va(e,o,n,a){const s=t.rows.find(h=>h.id===D);if(s?.kind!=="component"||b("dock:is-locked"))return;const l=G(),r=Zt(l,s,o,n,{bound:a});r!==l&&De(r,{save:!0})}function ft(){const e=t.rows.find(o=>o.id===D);return e?.kind==="antlers"&&!b("dock:is-locked")?e:null}function ce(e,o){const n=ft();if(!n)return;const a=G(),s=o(a,n);s!==a&&(De(s),H(e))}function So(e,o,n,a){const s=t.rows.find(h=>h.id===D);if(s?.kind!=="component"||b("dock:is-locked"))return;const l=G(),r=Zt(l,s,o,n,{bound:a});r!==l&&(De(r,{save:!0}),H(e))}function Ri(e,o){ce(e,(n,a)=>a.antlers==="loop"?ds(a,o)(n,a):Xn(n,a,o))}function Oi(e,o){const n=ft();if(!n||n.antlers!=="loop")return;const a=as(e,n,o);a&&ce(e,a)}function $i(e,o){ce(e,(n,a)=>Wn(n,a,o))}function Di(e,o){if(!e||!o||Vo(o)||jo(o.tag))return null;const n=Ln(e,o);if(n<o.openTo)return null;const a=e.lastIndexOf(`
`,n-1)+1;return e.slice(a,n).trim()===""&&a>o.openTo?a-1:n}function Re(e,o,n,{reveal:a=!0}={}){if(he)return;const s=(n||t.rows).find(l=>l.id===o);s&&(D=o,t.rows.forEach(l=>{l.current=l.id===o}),jt(e,s),!ut()&&(a&&(b("dock:reveal-html",{from:s.from,to:s.to,caret:Di(G(),s)}),b("dock:tw-follow")),Te({source:Z,type:j.SVE_HTML_PICK_FOCUS,path:s.path,src:s.kind==="component"&&s.src||""},e)))}function Ai(e,o){if(!o)return"";const n=[],a=(s,l)=>{for(const r of s||[]){const h=l||r.path===e;r.kind==="component"&&r.src===o&&n.push({path:r.path,inside:h}),a(r.children,h)}};return a(ye,!1),(n.find(s=>s.inside)||n[0])?.path||""}function Fi(e,o,{reveal:n=!0}={}){if(!o||!W(e.document))return;be=!1;const a=t.rows.find(l=>l.current);if(a&&a.path===o){Re(e,a.id,t.rows,{reveal:n});return}H(e),ot(o),H(e);const s=t.rows.find(l=>l.path===o);s&&(Re(e,s.id,t.rows,{reveal:n}),e.setTimeout(()=>{W(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Kt(e){if(rt)return;const o=()=>{t.editingId||t.dragging||(e.clearTimeout(it),it=e.setTimeout(()=>{W(e.document)&&H(e)},80))},n=()=>{if(o(),b("dock:on-empty-page")===!0){const a=Qe(e,e.document);a.length===1&&gt(e,e.document,a,a[0].uid,"")}};rt=Fo("dock:html-changed",o),e.document.addEventListener("sve-page-structure",n),$t=()=>{e.document.removeEventListener("sve-page-structure",n)}}function Bi(e){rt?.(),rt=null,$t?.(),$t=null,e?.clearTimeout?.(it),it=0}function no(e){const o=W(e.document);if(Te({source:Z,type:j.SVE_HTML_PICK,on:!1},e),Bi(e),z.forget(),ee.callOpen=!1,ee.callStore=null,Gt(e),Je(),N(),Sn(e),D=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,X="",e?.clearTimeout?.(Se),!o){Lt(e);return}o.remove(),Yt.headerTab==="html_tree"&&Xa(e,null),Wa(e),Io(e),Ro(e),Lt(e)}const fa="button[title], button[data-tip], label[title]";function nl(e,o){o.querySelector("[data-sve-html-tree-list]")||(o.id=at,Oo(e,o,{only:fa}),Ve(o,zo,{title:v(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>no(e)))}function sl(e){Kt(e),H(e)}function ma(e){const o=e.document;if(!Pa(e,"html_tree"))return;if(W(o)){Kt(e),H(e);return}if(!Qo(o))return;be=!0,A.clear(),Ga(e,[at]);const n=o.createElement("div");n.id=at,Oo(e,n,{only:fa}),n.style.cssText=Za,Ve(n,zo,{title:v(e,"html_tree")}),n.querySelector("[data-sve-close]")?.addEventListener("click",()=>no(e)),Qa(e,n),Io(e),Ro(e),Lt(e),Kt(e),H(e)}function rl(e){if(W(e.document)){no(e);return}ma(e)}Xt("html-tree:open-section",e=>{const o=window,n=o.document,a=Qe(o,n),s=a.find(l=>l.uid===e||l.ids.includes(e));return s?(gt(o,n,a,s.uid,""),{uid:s.uid,ids:s.ids}):null});Xt("html-tree:from-preview",({path:e,src:o,uid:n,reveal:a=!0}={})=>{if(!Uo(window,e)){if(!e){Ni(window,n);return}Fi(window,Ai(e,o)||e,{reveal:a})}});function Ni(e,o){if(!o||!W(e.document))return;const n=Qe(e,e.document),a=Ze(o,e.document),s=n.find(l=>l.ids.some(r=>a.includes(r)));s&&(be&&(be=!1,A.clear(),D=null),X&&X!==s.uid&&(e.clearTimeout(Se),X="",q=""),!b("dock:load-settled")&&H(e))}Xt("html-tree:arm-pick",e=>{const o=window;return e?(aa(o,Ge(G(),Qt(o))),!0):(W(o.document)||Te({source:Z,type:j.SVE_HTML_PICK,on:!1},o),!0)});function il(){Ce.clear(),je.clear(),Ot.clear(),st.clear(),Xe.length=0}export{Yr as HTML_TREE_STYLE_ID,al as armHtmlTreePrefetch,il as clearHtmlTreeTemplates,N as closeHtmlTreeMenu,no as closeHtmlTreePanel,Zr as ensureHtmlTreeStyles,nl as fillHtmlTreePane,D as htmlTreeActiveId,W as htmlTreePanel,it as htmlTreeTimer,rt as htmlTreeUnhook,ma as openHtmlTreePanel,H as renderHtmlTree,sl as showHtmlTreePane,Bi as stopWatchHtmlTreeDock,rl as toggleHtmlTreePanel,Kt as watchHtmlTreeDock};
