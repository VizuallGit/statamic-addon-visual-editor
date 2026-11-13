import{q as v,f as Hn,o as p,c as k,a as O,t as I,u as i,e as En,l as Rt,F,j as Q,g as S,w as x,Z as Ae,N as K,ab as Mn,a3 as In,ah as Ee,k as Ot,af as Rn,Y as se,aH as On,v as po,P as $n,x as Fn,X as An,aI as Dn,ad as dt,T as Je,aJ as Bn,m as Xt,p as Gt,W as ze,a9 as Nn,aK as Vn,aL as jn,y as $o}from"./addon-CFiv3stj.js";import{c as Fo,o as Kn,a as Un,b as qn,d as zn,i as Ao,r as Yn,e as Wn,f as Xn,u as go,l as ko}from"./section-create-1zfLfdpb.js";import{canEditFields as Do,openGlobalFieldsOverlay as Gn,openFieldsetOverlay as Bo}from"./section-fields-TrkIKhJ3.js";import{V as t,W as Zn,X as ee,Y as Jn,b,Z as Qn,_ as ea,$ as ta,a0 as Zt,s as Jt,y as ke,j as $t,H as oa,i as na,E as No,F as Vo,a1 as yo,a2 as jo,m as De,D as aa,R as sa,G as ra,a3 as Qe,a4 as ia,a5 as bo,a6 as la,a7 as da,a8 as Ko,a9 as Uo,aa as qo,ab as ca,ac as ha,o as zo,ad as Qt,ae as ua,af as Yo,l as gt,ag as et,ah as va,ai as eo,aj as fa,ak as ma,al as pa,x as ga,am as ka,an as ya,ao as ba,ap as Wo,aq as Xo,ar as Ta,as as wa,at as xa,au as Go,av as _a,aw as Sa,ax as Ca,A as Pa,ay as tt}from"./lp-cluster-B76ATITI.js";import{H as ct,u as La,d as Ha}from"./shortcuts-CmY5T-rr.js";import{_ as to,o as Re}from"./ChoiceDialog-Tvu67hAX.js";import{M as N,S as J}from"./protocol-CfmvxZS7.js";import{C as Ea,H as Oe,s as oo,c as Ma,a as Ia,b as Zo,t as Ra,d as Se,h as Jo,e as Oa,o as Qo,f as ot,r as en,g as $a,w as no,i as Fa,j as Aa,k as Da,p as Ba,l as Na,m as Va,n as ja,q as Ka,v as Ua,u as qa,x as za,y as Ya,z as To,A as Wa,B as Xa,D as Ga,E as Za,F as Ja,G as Qa,I as wo,J as es,K as ts}from"./component-extract-BbTRak1Y.js";import{H as os,r as tn,o as ns,h as xo,w as as}from"./logic-popup-Ctmjcts9.js";import{T as ss}from"./template-elements-Bc-eO-1_.js";import{b as rs}from"./html-pick-align-BDjVGiSh.js";import{l as is,a as ls,b as ds,c as cs,d as hs,e as us,f as vs,g as fs,h as ms}from"./loop-inspector-BzJoqXWX.js";import"./FieldsetOverlay-BzPtfOTG.js";import"./anim-still-4pEwKCsB.js";import"./help-styles-CkLqMAsI.js";const _t=/\s*([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/y,ps=/^\s*(?:([A-Za-z_$][\w$]*)|'([^'\\]*)'|"([^"\\]*)")\s*:\s*(true|false)\s*$/;function gs(e){const o=String(e||"").replace(/\{\{[\s\S]*?\}\}/g,s=>" ".repeat(s.length)),a=o.match(/^<[a-zA-Z][\w:-]*/);if(!a)return null;let n=a[0].length;for(;n<o.length;){_t.lastIndex=n;const s=_t.exec(o);if(!s){n+=1;continue}if(s[1].toLowerCase()==="x-data")return s[2]??s[3]??s[4]??"";n=_t.lastIndex}return null}function ks(e,o){const a=e[o];for(let n=o+1;n<e.length;n+=1)if(e[n]==="\\")n+=1;else if(e[n]===a)return n;return e.length-1}function ys(e){const o=String(e||""),a=o.search(/\S/);if(a===-1||o[a]!=="{")return[];const n=new Map;let s=0,d="";const r=()=>{const h=d.match(ps);h&&n.set(h[1]??h[2]??h[3],h[4]==="true"),d=""};for(let h=a;h<o.length;h+=1){const f=o[h];if(f==='"'||f==="'"||f==="`"){const g=ks(o,h);d+=o.slice(h,g+1),h=g;continue}if(f==="/"&&o[h+1]==="/"){const g=o.indexOf(`
`,h);h=g===-1?o.length:g-1;continue}if(f==="/"&&o[h+1]==="*"){const g=o.indexOf("*/",h+2);h=g===-1?o.length:g+1;continue}if(f==="{"||f==="["||f==="("){if(s+=1,s===1)continue}else if(f==="}"||f==="]"||f===")"){if(s-=1,s===0)break}else if(f===","&&s===1){r();continue}d+=f}return r(),[...n].map(([h,f])=>({key:h,value:f}))}const bs={class:"sve-html-tree"},Ts={class:"sve-pane-bar","data-sve-pane-bar":""},ws={"data-sve-right-title":""},xs={"data-sve-right-actions":""},_s=["aria-pressed","title","aria-label"],Ss=["title"],Cs={class:"sve-ht-used-by__label"},Ps={class:"sve-ht-used-by__chips"},Ls=["title","onClick"],Hs={key:1,class:"sve-ht-used-by__chip"},Es={key:0,class:"sve-ht-used-by__empty"},Ms={class:"sve-ht-tools"},Is=["title"],Rs=["placeholder","aria-label","value"],Os=["aria-label"],$s=["title","aria-label"],Fs=["title","aria-label"],As={key:3,class:"sve-tree-exit"},Ds=["title"],Bs=["title"],Ns='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',Vs='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',js='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',Ks='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',Us='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>',qs='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',zs={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){const o=v(window,"html_tree_search");t.layers=Zn(window);const a=v(window,"html_tree_layers_on"),n=v(window,"html_tree_layers_off");function s(){Jn(window,!t.layers)}const d=Fo(window),r=v(window,"section_new"),h=v(window,"html_tree_add_element"),f=v(window,"html_tree_sections_slot"),g=v(window,"html_tree_sections_no_field");function C(){const u=t.templateSections.length?t.templateSections:[Mn(window)],l=new Set(t.rows.filter(m=>m.kind==="sections").map(m=>m.tag));return u.filter(m=>!l.has(m)).map(m=>({tag:`sections:${m}`,label:u.length>1?`${f} · ${m}`:f,noField:!t.templateSections.length}))}const y=Hn(!1),_=v(window,"section_import");function L(){y.value=!1}async function oe(u){if(!u)return;await In(),t.onRefresh?.();const l=b("html-tree:open-section",u);l&&Yn(window,l.ids)}function H(){const u=t.rows.find(l=>l.current&&!l.context&&!l.synthetic)||null;return u?.lockedIn?t.rows.filter(l=>l.locked&&l.from<=u.from&&l.to>=u.to).sort((l,m)=>l.from-m.from)[0]||null:u}function M(u){const l=u.getBoundingClientRect(),m=H();let R=null;const le=(z,ye,yt="")=>()=>{R?.dismiss(),R=null,L();const B=Ao(window,z,m,ye);B!==null&&(t.selectFrom={at:B,left:4},yt&&window.Statamic?.$toast?.info?.(yt))};R=Re(document,Oe,{items:[...t.newSectionToo?[{label:r,onPick:()=>{R?.dismiss(),R=null,$(t.lastSectionUid||null)}}]:[],...ss.map(z=>({label:z,onPick:le(z,`<${z}>`)})),...C().map(z=>({label:z.label,onPick:le(z.tag,z.label,z.noField?g:"")}))],x:Math.round(l.left),y:Math.round(l.bottom+4),onClose:()=>{R=null,L()}})}function w(u){if(!y.value){if(y.value=!0,!(t.sections.length&&!t.sectionsInLoop||t.pageBuilder)){M(u.currentTarget);return}$(t.sections.length?t.sections[t.sections.length-1].uid:null)}}function $(u){(async()=>{const l=await Un(window);if(!l){L();return}const m=R=>{L(),oe(R?.uid)};if(l==="static"){qn(window,{afterUid:u,onDone:m,onError:L,onClose:L});return}zn(window,{afterUid:u,onDone:m,onError:L,onClose:L})})()}function G(){if(y.value)return;y.value=!0;const u=!!(t.sections.length&&!t.sectionsInLoop||t.pageBuilder);Kn(window,{intoTemplate:!u,after:u?null:H(),afterUid:u&&t.sections.length?t.sections[t.sections.length-1].uid:null,onDone:l=>{if(L(),u){oe(l?.uid);return}Number.isInteger(l?.at)&&(t.selectFrom={at:l.at,left:4})},onError:L,onClose:L})}function q(u){const l=!!t.query;t.query=u,l!==!!u&&t.onQuery?.()}return(u,l)=>(p(),k("div",bs,[O("div",Ts,[O("div",ws,I(e.title),1),O("div",xs,[O("button",{type:"button","data-sve-ht-layers-switch":"","aria-pressed":i(t).layers?"true":"false",title:i(t).layers?i(n):i(a),"aria-label":i(t).layers?i(n):i(a),innerHTML:Ns,onClick:s},null,8,_s),l[5]||(l[5]=En('<button type="button" data-sve-right-pin aria-pressed="false" data-v-23557cf9></button><button type="button" data-sve-close aria-label="Close" data-v-23557cf9><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-23557cf9><path d="M18 6 6 18" data-v-23557cf9></path><path d="m6 6 12 12" data-v-23557cf9></path></svg></button>',2))])]),i(t).usedBy?(p(),k("div",{key:0,class:"sve-ht-used-by",title:i(t).usedBy.hint||null},[O("span",Cs,[O("span",{class:"sve-ht-used-by__icon","aria-hidden":"true",innerHTML:Us}),Rt(" "+I(i(t).usedBy.label),1)]),O("span",Ps,[(p(!0),k(F,null,Q(i(t).usedBy.items,m=>(p(),k(F,{key:m.kind+":"+m.name},[m.onOpen?(p(),k("button",{key:0,type:"button",class:"sve-ht-used-by__chip sve-ht-used-by__chip--open",title:m.openLabel,onClick:R=>m.onOpen(R.currentTarget)},I(m.name),9,Ls)):(p(),k("span",Hs,I(m.name),1))],64))),128)),i(t).usedBy.empty?(p(),k("span",Es,I(i(t).usedBy.empty),1)):S("",!0)])],8,Ss)):S("",!0),O("div",Ms,[O("label",{class:"sve-ht-search",title:i(o)},[O("span",{class:"sve-ht-search__icon","aria-hidden":"true",innerHTML:Ks}),O("input",{type:"text",class:"sve-ht-search__input","data-sve-ht-search":"",placeholder:i(o),"aria-label":i(o),value:i(t).query,autocomplete:"off",spellcheck:"false",onInput:l[0]||(l[0]=m=>q(m.target.value)),onKeydown:[l[1]||(l[1]=x(()=>{},["stop"])),l[2]||(l[2]=Ae(x(m=>q(""),["prevent"]),["escape"]))]},null,40,Rs),i(t).query?(p(),k("button",{key:0,type:"button",class:"sve-ht-search__clear","aria-label":i(o),innerHTML:qs,onClick:l[3]||(l[3]=m=>q(""))},null,8,Os)):S("",!0)],8,Is),i(d)&&(i(t).sections.length&&!i(t).sectionsInLoop||i(t).pageBuilder||i(t).rows.length&&!i(t).layoutFile||i(t).emptyFile)?(p(),k("button",{key:0,type:"button",class:"sve-ht-new",title:i(t).sections.length&&!i(t).sectionsInLoop||i(t).pageBuilder?i(r):i(h),"aria-label":i(t).sections.length&&!i(t).sectionsInLoop||i(t).pageBuilder?i(r):i(h),innerHTML:Vs,onClick:w},null,8,$s)):S("",!0),i(d)&&(i(t).sections.length&&!i(t).sectionsInLoop||i(t).pageBuilder||i(t).rows.length&&!i(t).layoutFile||i(t).emptyFile)?(p(),k("button",{key:1,type:"button",class:"sve-ht-import",title:i(_),"aria-label":i(_),innerHTML:js,onClick:G},null,8,Fs)):S("",!0)]),i(ee).inSidebar?S("",!0):(p(),K(Ea,{key:1})),l[6]||(l[6]=O("div",{"data-sve-html-tree-list":""},null,-1)),i(t).inspect?.logic?S("",!0):(p(),K(os,{key:2})),i(t).exitOpen&&!i(ee).inSidebar?(p(),k("div",As,[O("span",{class:"sve-tree-exit__name",title:i(t).exitName},I(i(t).exitName),9,Ds),O("button",{type:"button",class:"sve-tree-exit__go",title:i(t).exitTitle,onClick:l[4]||(l[4]=m=>i(t).onExit?.())},I(i(t).exitLabel),9,Bs)])):S("",!0)]))}},on=to(zs,[["__scopeId","data-v-23557cf9"]]);function nn(e){return String(e||"").trim().toLowerCase()}function Ft(e,o){return o?[e.name,e.tag,e.klass,e.label,e.src].filter(a=>typeof a=="string"&&a).join(" ").toLowerCase().includes(o):!0}function Ys(e,o){const a=nn(o);if(!a)return{rows:e,hits:new Set};const n=new Set;for(const r of e)Ft(r,a)&&n.add(r.path);const s=[...n];return{rows:e.filter(r=>n.has(r.path)||s.some(h=>h.startsWith(`${r.path}/`))),hits:n}}const Ws=["title"],Xs={"data-sve-ht-indent":"","aria-hidden":"true"},Gs=["data-sve-ht-cat"],Zs={key:1,"data-sve-ht-twist-gap":"","aria-hidden":"true"},Js={key:2,"data-sve-ht-letter":""},Qs=["innerHTML"],er=["title"],tr=["title"],or={key:1,"data-sve-ht-kind":""},nr={key:3,"data-sve-ht-name":""},ar={key:4,"data-sve-ht-actions":""},sr=["data-on","title","innerHTML"],rr=["title"],ir={key:5,"data-sve-ht-actions":""},lr=["data-on","title","innerHTML"],dr=["data-on","title","innerHTML"],cr=["disabled","title"],hr=["disabled","title","innerHTML"],ur=["disabled","title"],vr=["disabled","title"],fr=["aria-label"],mr=["data-sve-ht-id"],pr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/></svg>',gr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',kr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',yr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',br='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',Tr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.8 5.9v4.2L10.2 8Z" fill="currentColor" stroke="none"/></svg>',wr='<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="2" y="3" width="12" height="10" rx="1.2"/><path d="M6.3 5.8v4.4M9.7 5.8v4.4" stroke-linecap="round"/></svg>',_o='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6.5" width="20" height="11" rx="5.5"/><circle cx="7.5" cy="12" r="3" fill="currentColor" stroke="none"/></svg>',So='<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M7.5 5.5h9a6.5 6.5 0 0 1 0 13h-9a6.5 6.5 0 0 1 0-13ZM16.5 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6Z"/></svg>',xr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',_r='<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',Sr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Cr=120,Pr={__name:"HtmlTreeRow",props:{row:{type:Object,required:!0},dim:{type:Boolean,default:!1}},setup(e){const o=Do(window);function a(u){return u.synthetic?u.frame==="main"?t.frameMainTitle:u.frame==="template"?t.frameTemplateTitle:t.frameOpenTitle:u.kind==="component"?u.src?`partial:${u.src}`:u.tag:u.name?`${u.tag} ${u.name}`:u.tag}function n(u){return!!u.section}function s(u){return!!u.frame}function d(u){return u.kind==="slot"}function r(u,l){s(l)||d(l)||(n(l)?t.onSectionPointerDown?.(u,l.section):l.sectionRoot?t.onSectionPointerDown?.(u,l.sectionRoot):t.onPointerDown?.(u,l.id))}function h(u,l){if(u.synthetic){t.onFrame?.(u.frame);return}if(n(u)){t.onSection?.(u.section);return}t.onSelect?.(u.id,l)}function f(u,l){const m={"data-sve-ht-id":u.id};return u.locked&&(m["data-sve-ht-locked"]=""),u.current&&(m["data-sve-ht-current"]=""),(u.hidden||u.sectionOff)&&(m["data-sve-ht-hidden"]=""),(u.videoNth>=0||u.alpineNth>=0)&&(m["data-sve-ht-special"]=""),m["data-sve-ht-cat"]=u.cat||"other",m["data-sve-ht-depth"]=String(u.depth),l&&(m["data-sve-ht-dim"]=""),n(u)&&(m["data-sve-ht-sec"]=""),s(u)&&(m["data-sve-ht-frame"]=u.frame),!n(u)&&t.dropId===u.id&&t.dropPlace&&(m["data-sve-ht-drop"]=t.dropPlace),t.sectionsInLoop&&n(u)&&t.sectionDrop?.uid===u.section&&(m["data-sve-ht-drop"]=t.sectionDrop.place),m}function g(u){return!!u.fixed}function C(u){return u.kind==="sections"}function y(u){return!!(u.locked||u.lockedIn)}function _(u){return!u.lockedIn&&!g(u)}function L(u){return $(u)||!g(u)&&!C(u)&&!y(u)&&(!u.hidden||u.wrapFrom!=null)}function oe(u){if(!G(u))return t.lockedTitle;const l=u.hidden||u.sectionOff;return $(u)?l?t.sectionShowTitle:t.sectionHideTitle:l?t.showTitle:t.hideTitle}let H=null;function M(u,l){window.clearTimeout(H),H=window.setTimeout(()=>t.onMore?.(u,l.id),Cr)}function w(){window.clearTimeout(H)}function $(u){return!!u.sectionRoot||!!u.section}function G(u){return t.canEdit&&!y(u)||$(u)}function q(u){const l=u.name||"";return Zt()&&l.toLowerCase()===String(u.tag||"").toLowerCase()?"":l}return(u,l)=>(p(),k(F,null,[O("div",Ee({"data-sve-ht-row":""},f(e.row,e.dim),{role:"button",tabindex:"0",title:a(e.row),style:{"--sve-ht-depth":e.row.depth},onClick:l[43]||(l[43]=m=>h(e.row,m.currentTarget)),onDblclick:l[44]||(l[44]=x(m=>e.row.synthetic?i(t).onFrameEnter?.(e.row.frame):s(e.row)||d(e.row)||n(e.row)?null:i(t).onRename?.(e.row.id),["prevent"])),onKeydown:[l[45]||(l[45]=Ae(x(m=>h(e.row,m.currentTarget),["prevent"]),["enter"])),l[46]||(l[46]=Ae(x(m=>h(e.row,m.currentTarget),["prevent"]),["space"]))],onPointerdown:l[47]||(l[47]=m=>r(m,e.row)),onPointerenter:l[48]||(l[48]=m=>n(e.row)?i(t).onSectionHover?.(e.row.section):null),onContextmenu:l[49]||(l[49]=x(m=>s(e.row)||d(e.row)||n(e.row)?null:i(t).onContext?.(m,e.row.id),["prevent","stop"]))}),[O("span",Xs,[(p(!0),k(F,null,Q(e.row.guides||[],(m,R)=>(p(),k("i",{key:R,"data-sve-ht-cat":m},null,8,Gs))),128))]),e.row.hasChildren||i(Qn)(e.row)?(p(),k("button",Ee({key:0,type:"button","data-sve-ht-twist":""},(e.row.synthetic?i(t).mainShut:i(ea)(e.row))?{"data-sve-ht-shut":""}:{},{innerHTML:gr,onClick:l[0]||(l[0]=x(m=>e.row.synthetic?i(t).onFrameTwist?.():n(e.row)?i(t).onSection?.(e.row.section):i(t).onTwist?.(e.row.id),["stop","prevent"])),onPointerdown:l[1]||(l[1]=x(()=>{},["stop"])),onDblclick:l[2]||(l[2]=x(()=>{},["stop"]))}),null,16)):(p(),k("span",Zs)),e.row.letter?(p(),k("span",Js,I(e.row.letter),1)):(p(),k("span",{key:3,"data-sve-ht-icon":"",innerHTML:e.row.svg},null,8,Qs)),O("span",{"data-sve-ht-text":"",title:i(t).renameTitle},[!e.row.kind&&!n(e.row)&&!s(e.row)?(p(),k("button",{key:0,type:"button","data-sve-ht-tag":"",title:i(t).tagTitle,onClick:l[3]||(l[3]=x(()=>{},["stop","prevent"])),onPointerdown:l[4]||(l[4]=x(()=>{},["stop"])),onDblclick:l[5]||(l[5]=x(m=>i(t).onTagChange?.(m,e.row.id),["stop","prevent"]))},I(e.row.tag),41,tr)):(p(),k("span",or,I(e.row.tag),1)),i(t).editingId===e.row.id&&!n(e.row)?Ot((p(),k("input",{key:2,"data-sve-ht-rename":"","onUpdate:modelValue":l[6]||(l[6]=m=>i(t).draft=m),onMousedown:l[7]||(l[7]=x(()=>{},["stop"])),onPointerdown:l[8]||(l[8]=x(()=>{},["stop"])),onClick:l[9]||(l[9]=x(()=>{},["stop"])),onDblclick:l[10]||(l[10]=x(()=>{},["stop"])),onKeydown:[l[11]||(l[11]=x(()=>{},["stop"])),l[12]||(l[12]=Ae(x(m=>i(t).onRenameCommit?.(),["prevent"]),["enter"])),l[13]||(l[13]=Ae(x(m=>i(t).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:l[14]||(l[14]=m=>i(t).onRenameCommit?.())},null,544)),[[Rn,i(t).draft]]):(p(),k("span",nr,I(q(e.row)),1))],8,er),s(e.row)?(p(),k("span",ar,[e.row.alpineNth>=0?(p(),k("button",{key:0,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:i(t).alpineTitle,innerHTML:e.row.alpineSet?So:_o,onClick:l[15]||(l[15]=x(m=>i(t).onAlpineState?.(m,e.row.id),["stop","prevent"])),onPointerdown:l[16]||(l[16]=x(()=>{},["stop"])),onDblclick:l[17]||(l[17]=x(()=>{},["stop"]))},null,40,sr)):S("",!0),e.row.frame!=="main"&&i(o)?(p(),k("button",{key:1,type:"button","data-sve-ht-fields":"",title:i(t).frameFieldsTitle,innerHTML:pr,onClick:l[18]||(l[18]=x(m=>i(t).onFrameFields?.(e.row.frame),["stop","prevent"])),onPointerdown:l[19]||(l[19]=x(()=>{},["stop"])),onDblclick:l[20]||(l[20]=x(()=>{},["stop"]))},null,40,rr)):S("",!0)])):d(e.row)?S("",!0):(p(),k("span",ir,[e.row.videoNth>=0?(p(),k("button",{key:0,type:"button","data-sve-ht-video":"","data-on":e.row.videoHeld?"":null,title:e.row.videoHeld?i(t).videoPlayTitle:i(t).videoHoldTitle,innerHTML:e.row.videoHeld?wr:Tr,onClick:l[21]||(l[21]=x(m=>i(t).onVideoHold?.(e.row.id),["stop","prevent"])),onPointerdown:l[22]||(l[22]=x(()=>{},["stop"])),onDblclick:l[23]||(l[23]=x(()=>{},["stop"]))},null,40,lr)):S("",!0),e.row.alpineNth>=0?(p(),k("button",{key:1,type:"button","data-sve-ht-alpine":"","data-on":e.row.alpineSet?"":null,title:i(t).alpineTitle,innerHTML:e.row.alpineSet?So:_o,onClick:l[24]||(l[24]=x(m=>i(t).onAlpineState?.(m,e.row.id),["stop","prevent"])),onPointerdown:l[25]||(l[25]=x(()=>{},["stop"])),onDblclick:l[26]||(l[26]=x(()=>{},["stop"]))},null,40,dr)):S("",!0),e.row.locked?(p(),k("button",{key:2,type:"button","data-sve-ht-lock":"","data-on":"",disabled:!i(t).canEdit||!i(t).canUnlock,title:i(t).canUnlock?i(t).unlockTitle:i(t).lockedByTitle,"aria-pressed":"true",innerHTML:xr,onClick:l[27]||(l[27]=x(m=>i(t).onLock?.(e.row.id),["stop","prevent"])),onPointerdown:l[28]||(l[28]=x(()=>{},["stop"])),onDblclick:l[29]||(l[29]=x(()=>{},["stop"]))},null,40,cr)):S("",!0),L(e.row)?(p(),k("button",{key:3,type:"button","data-sve-ht-eye":"",disabled:!G(e.row),title:oe(e.row),innerHTML:e.row.hidden||e.row.sectionOff?yr:kr,onClick:l[30]||(l[30]=x(m=>i(t).onHide?.(e.row.id),["stop","prevent"])),onPointerdown:l[31]||(l[31]=x(()=>{},["stop"])),onDblclick:l[32]||(l[32]=x(()=>{},["stop"]))},null,40,hr)):S("",!0),!g(e.row)&&!C(e.row)?(p(),k("button",{key:4,type:"button","data-sve-ht-dup":"",disabled:!G(e.row),title:G(e.row)?i(t).duplicateTitle:i(t).lockedTitle,innerHTML:br,onClick:l[33]||(l[33]=x(m=>i(t).onDuplicate?.(e.row.id),["stop","prevent"])),onPointerdown:l[34]||(l[34]=x(()=>{},["stop"])),onDblclick:l[35]||(l[35]=x(()=>{},["stop"]))},null,40,ur)):S("",!0),g(e.row)?S("",!0):(p(),k("button",{key:5,type:"button","data-sve-ht-del":"",disabled:!G(e.row),title:G(e.row)?i(t).deleteTitle:i(t).lockedTitle,innerHTML:Sr,onClick:l[36]||(l[36]=x(m=>i(t).onDelete?.(e.row.id),["stop","prevent"])),onPointerdown:l[37]||(l[37]=x(()=>{},["stop"])),onDblclick:l[38]||(l[38]=x(()=>{},["stop"]))},null,40,vr)),_(e.row)?(p(),k("button",{key:6,type:"button","data-sve-ht-more":"","aria-label":i(t).moreTitle,"aria-haspopup":"menu",innerHTML:_r,onPointerenter:l[39]||(l[39]=m=>M(m.currentTarget,e.row)),onPointerleave:w,onClick:l[40]||(l[40]=x(m=>{w(),i(t).onMore?.(m.currentTarget,e.row.id)},["stop","prevent"])),onPointerdown:l[41]||(l[41]=x(()=>{},["stop"])),onDblclick:l[42]||(l[42]=x(()=>{},["stop"]))},null,40,fr)):S("",!0)]))],16,Ws),i(ta)(e.row)?(p(),k("div",Ee({key:0,"data-sve-ht-slot":"","data-sve-ht-id":e.row.id},i(t).dropId===e.row.id&&i(t).dropPlace==="inside"?{"data-sve-ht-over":""}:{},{style:{"--sve-ht-depth":e.row.depth+1}}),I(i(t).slotText),17,mr)):S("",!0)],64))}},Y=to(Pr,[["__scopeId","data-v-7912f600"]]),Lr=["data-sve-ht-look","data-sve-ht-layers"],Hr={key:0,class:"sve-ht-page-template"},Er={key:0,class:"sve-ht-page-template__text"},Mr={class:"sve-ht-page-template__note"},Ir={key:1,class:"sve-ht-empty"},Rr={key:2,class:"sve-ht-empty"},Or={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"header"},$r={key:0,class:"sve-ht-empty"},Fr={key:0,class:"sve-ht-empty"},Ar=["data-sve-ht-under-main"],Dr={"data-sve-ht-branch":"","data-sve-ht-cat":"main"},Br={key:0,class:"sve-ht-empty"},Nr=["data-sve-ht-under-main"],Vr=["data-dim"],jr={key:0,class:"sve-ht-empty"},Kr={key:0,"data-sve-ht-branch":"","data-sve-ht-cat":"footer"},Ur={key:0,class:"sve-ht-empty"},qr={key:4,"data-sve-ht-branch":"","data-sve-ht-cat":"component"},zr=["data-sve-ht-field"],Yr=["onClick"],Wr={__name:"HtmlTreeList",setup(e){const o=se(()=>nn(t.query)),a=se(()=>Ys(t.rows,o.value)),n=se(()=>a.value.rows);function s(H,M){return{...H,depth:M.depth+1,guides:[...M.guides||[],M.cat]}}const d=se(()=>o.value?[]:t.sectionsMissing||[]),r=se(()=>o.value?t.sections.filter(H=>Ft(H.row,o.value)||H.current&&H.ready&&n.value.length>0):t.sections);function h(H){return!!H&&(!o.value||Ft(H,o.value))}function f(H){const M=t.frame?.kind;return t.inComponent||(M==="header"||M==="footer")&&M!==H}const g=se(()=>t.frame?.kind==="header"||t.frame?.kind==="footer"),C=se(()=>!!t.frame&&["header","main","footer"].some(H=>h(t.frame[H]))),y=se(()=>!!t.frame&&(t.frame.kind==="main"||h(t.frame.main))),_=se(()=>!!o.value&&!r.value.length&&!n.value.length&&!C.value);function L(H){return!!o.value&&!a.value.hits.has(H.path)}function oe(H){const M={"data-sve-ht-sec-uid":H.uid};return H.current&&(M["data-sve-ht-branch"]="",M["data-sve-ht-cat"]=H.row?.cat||"layout"),t.sectionDrop&&t.sectionDrop.uid===H.uid&&(M["data-sve-ht-drop"]=t.sectionDrop.place),M}return(H,M)=>(p(),k("div",Ee({class:"sve-ht-root","data-sve-ht-look":i(t).layers?"tags":i(t).look,"data-sve-ht-layers":i(t).layers?"":null,style:i(t).familyStyle},i(t).dragging?{"data-sve-ht-dragging":""}:{}),[i(t).pageTemplate?(p(),k("div",Hr,[i(t).pageTemplate.text?(p(),k("p",Er,I(i(t).pageTemplate.text),1)):S("",!0),O("p",Mr,I(i(t).pageTemplate.note),1),i(t).pageTemplate.canOpen?(p(),k("button",{key:1,type:"button",class:"sve-ht-page-template__open",onClick:M[0]||(M[0]=w=>i(t).pageTemplate.onOpen(w.currentTarget))},I(i(t).pageTemplate.openLabel),1)):S("",!0)])):!i(t).rows.length&&!i(t).sections.length&&!i(t).frame?(p(),k("div",Ir,I(i(t).emptyText),1)):_.value?(p(),k("div",Rr,I(i(t).searchEmpty),1)):S("",!0),(i(t).frame||i(t).sections.length)&&!i(t).sectionsInLoop?(p(),k(F,{key:3},[i(t).ownFile&&!o.value?(p(),K(Y,{key:0,row:i(t).ownFile},null,8,["row"])):S("",!0),i(t).frame?(p(),k(F,{key:1},[i(t).frame.kind==="header"?(p(),k("div",Or,[(p(!0),k(F,null,Q(n.value,w=>(p(),K(Y,{key:w.id,row:w,dim:L(w)},null,8,["row","dim"]))),128)),i(t).rows.length?S("",!0):(p(),k("div",$r,I(i(t).emptyText),1))])):!g.value&&h(i(t).frame.header)?(p(),K(Y,{key:1,row:i(t).frame.header,dim:f("header")},null,8,["row","dim"])):S("",!0)],64)):S("",!0),g.value?S("",!0):(p(),k("div",On(Ee({key:2},i(t).frame?.kind==="main"?{"data-sve-ht-branch":"","data-sve-ht-cat":"main"}:{})),[i(t).frame?.kind==="main"?(p(),k(F,{key:0},[(p(!0),k(F,null,Q(n.value,w=>(p(),K(Y,{key:w.id,row:w,dim:L(w)},null,8,["row","dim"]))),128)),i(t).rows.length?S("",!0):(p(),k("div",Fr,I(i(t).emptyText),1))],64)):i(t).frame&&h(i(t).frame.main)?(p(),K(Y,{key:1,row:i(t).frame.main,dim:f("main")},null,8,["row","dim"])):S("",!0),i(t).frame?.kind==="template"?Ot((p(),k("div",{key:2,"data-sve-ht-frame-body":"","data-sve-ht-under-main":y.value?"":null},[O("div",Dr,[(p(!0),k(F,null,Q(n.value,w=>(p(),K(Y,{key:w.id,row:w,dim:L(w)},null,8,["row","dim"]))),128)),i(t).rows.length?S("",!0):(p(),k("div",Br,I(i(t).emptyText),1))])],8,Ar)),[[po,!i(t).mainShut]]):S("",!0),i(t).sections.length||i(t).frame?Ot((p(),k("div",{key:3,"data-sve-ht-frame-body":"","data-sve-ht-under-main":y.value?"":null},[i(t).frame?.template&&h(i(t).frame.template)?(p(),K(Y,{key:0,row:i(t).frame.template,dim:f("template")},null,8,["row","dim"])):S("",!0),i(t).frame&&!i(t).frame.template&&!i(t).sections.length&&!o.value?(p(),k("div",{key:1,"data-sve-ht-frame-slot":"","data-dim":f("")?"":void 0},I(i(t).frameEmptyText),9,Vr)):S("",!0),(p(!0),k(F,null,Q(r.value,w=>(p(),k("div",Ee({key:w.uid},{ref_for:!0},oe(w)),[w.ready?(p(),k(F,{key:0},[(p(!0),k(F,null,Q(n.value,$=>(p(),K(Y,{key:$.id,row:$,dim:L($)},null,8,["row","dim"]))),128)),i(t).rows.length?S("",!0):(p(),k("div",jr,I(i(t).emptyText),1))],64)):(p(),K(Y,{key:1,row:w.row,dim:f("")},null,8,["row","dim"]))],16))),128))],8,Nr)),[[po,!i(t).frame||!i(t).mainShut]]):S("",!0)],16)),i(t).frame?(p(),k(F,{key:3},[i(t).frame.kind==="footer"?(p(),k("div",Kr,[(p(!0),k(F,null,Q(n.value,w=>(p(),K(Y,{key:w.id,row:w,dim:L(w)},null,8,["row","dim"]))),128)),i(t).rows.length?S("",!0):(p(),k("div",Ur,I(i(t).emptyText),1))])):!g.value&&h(i(t).frame.footer)?(p(),K(Y,{key:1,row:i(t).frame.footer,dim:f("footer")},null,8,["row","dim"])):S("",!0)],64)):S("",!0)],64)):i(t).inComponent&&i(t).rows.length?(p(),k("div",qr,[(p(!0),k(F,null,Q(n.value,w=>(p(),K(Y,{key:w.id,row:w,dim:L(w)},null,8,["row","dim"]))),128))])):i(t).rows.length?(p(!0),k(F,{key:5},Q(n.value,w=>(p(),k(F,{key:w.id},[$n(Y,{row:w,dim:L(w)},null,8,["row","dim"]),!o.value&&i(t).sectionsInLoop&&w.kind==="sections"&&w.tag===i(t).sectionsInLoop?(p(!0),k(F,{key:0},Q(i(t).sections,$=>(p(),K(Y,{key:$.uid,row:s($.row,w)},null,8,["row"]))),128)):S("",!0)],64))),128)):S("",!0),(p(!0),k(F,null,Q(d.value,w=>(p(),k("div",{key:w,"data-sve-ht-sections-missing":"","data-sve-ht-field":w},[O("span",null,[Rt(I(i(t).sectionsMissingText),1),i(t).sectionsMissing.length>1?(p(),k(F,{key:0},[M[1]||(M[1]=Rt(" · ",-1)),O("code",null,I(w),1)],64)):S("",!0)]),O("button",{type:"button","data-sve-ht-sections-add":"",onClick:$=>i(t).onAddSections?.(w)},I(i(t).sectionsAddText),9,Yr)],8,zr))),128))],16,Lr))}},St=to(Wr,[["__scopeId","data-v-fdf9e0fa"]]);let Ct=null;function Xr(e){return Ct||(Ct=e.fetch("/!/sve/link-targets",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():{pages:[]}).then(o=>Array.isArray(o.pages)?o.pages:[]).catch(()=>[])),Ct}let ht=null;function Pt(){ht?.dismiss(),ht=null}function Gr(e,o,a){Pt();const n=o?.getBoundingClientRect?.(),s={x:n?n.left:0,y:n?n.bottom+4:0};Xr(e).then(d=>{const r=d.length?d.map(h=>({label:h.title||h.url,onPick:()=>{Pt(),a(h.url)}})):[{label:v(e,"component_props_pages_none"),onPick:null}];Pt(),ht=Re(e.document,Oe,{items:r,x:s.x,y:s.y,onClose:()=>{ht=null}})})}function an(e){for(const o of e||[]){if(o.kind==="component"||o.kind==="svg"&&o.dynamic)continue;const a=o.kind==="antlers"?an(o.children):o;if(a)return a}return null}const W=Oa("sve-call-values"),Zr="__sve-html-tree-style";function Jr(e,o,a){if(o||a)return!1;const n=String(b("dock:chrome-kind")||"");if(n==="header"||n==="footer")return!1;const s=dt(e);return ot(e)?!1:!!s&&s!=="create"&&Nn(e)!==Vn(e)}function ao(e){return{sectionLoops:[...new Set([...Bn(e),...Qo(e),...t.templateSections])],sectionsLabel:v(e,"html_tree_sections_slot")}}const Co=new Set;function Qr(e){const o=dt(e);!o||o==="create"||Co.has(o)||ot(e)||(Co.add(o),Qt(e,{entry:o}).then(a=>{!a?.own_page||!a.view||dt(e)!==o||(en(o,a.view,a.sections_fields),b("dock:current-type")||b("dock:open-file",`view:${a.view}`),E(e))}))}function ei(e,o){const a={entry:o,text:"",note:v(e,"html_tree_page_template_note"),openLabel:v(e,"html_tree_open_template"),canOpen:!1,onOpen:null};return Qt(e,{entry:o}).then(n=>{if(!(!n||t.pageTemplate?.entry!==o)){if(n.own_page&&n.view){en(o,n.view,n.sections_fields),b("dock:open-file",`view:${n.view}`),E(e);return}t.pageTemplate={...t.pageTemplate,text:v(e,"html_tree_page_template",{name:n.name}),canOpen:!!n.open,onOpen:n.open?s=>va(e,s,n.open):null}}}),a}function ti(e,o){const a=ot(e);if(a&&b("dock:current-type")===a){t.usedBy=null,t.templateSections=Qo(e);return}const n=o.replace(/^view:/,"");if(!n||b("dock:current-type")!==o){t.usedBy=null,t.templateSections=[];return}t.usedBy?.view!==n&&(t.usedBy=null,Qt(e,{view:n}).then(s=>{if(!s||b("dock:current-type")!==o)return;const d=s.everything?[{name:v(e,"html_tree_used_by_everything"),kind:"everything",url:null}]:s.used_by.map(f=>({...f,...oi(e,f)})),r=Array.isArray(s.sections_fields)?s.sections_fields:[],h=r.join()!==t.templateSections.join();t.templateSections=r,t.usedBy={view:n,label:v(e,"html_tree_used_by"),items:d,empty:d.length?"":v(e,"html_tree_used_by_nobody"),hint:d.length?v(e,"html_tree_used_by_hint",{list:d.map(f=>f.name).join(", ")}):""},h&&E(e)}))}function Po(e,o=t.templateSections){const a=new Set,n=s=>{for(const d of s||[])d.kind==="sections"&&a.add(d.tag),n(d.children)};return n(e),o.filter(s=>!a.has(s))}function oi(e,o){if(!o.url)return{openLabel:"",onOpen:null};const a=v(e,"html_tree_used_by_open",{name:o.name});return o.kind==="page"?{openLabel:a,onOpen:n=>ka(e,n,ya(e,o.url))}:{openLabel:a,onOpen:n=>ba(e,{anchor:n,url:o.url,subtitle:o.name})}}const D=new Set;let At="",He=!1,Lt=null,ge=!0,X="",Ce=0,sn="";const Pe=new Map,Be=new Set,Dt=new Map,ut=new Map;let U="",rn=!1,A=null,vt=null,it="",Ye="",ft=0,Bt=null,pe=[],_e=null,Ne=null,Ve=null,je=null,Nt=null,ie=!1,te=null,We=null,Ke=null,Ue=null,qe=null,Vt=null,we=null;function j(e){return e.getElementById(ct)}function ni(e){Fn(e,Zr,`
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
  `)}function Z(){const e=b("dock:html");return typeof e=="string"?e:""}function jt(e){return!!b("dock:is-open",e)}function $e(e,{save:o=!1,unlock:a=!1}={}){return Ge()||b("dock:set-html",a?{html:e,unlock:!0}:e)!==!0?!1:(o&&b("dock:save-now"),!0)}function Ht(e){const o=b("dock:component-exit-state")||{};if(t.exitOpen=!!o.open,!o.open){t.onExit=null;return}t.exitName=o.name||"",t.exitLabel=v(e,"component_exit"),t.exitTitle=v(e,o.back?"component_exit_back":"component_exit_close"),t.onExit=()=>{b("dock:exit-component"),E(e)}}const Xe=[];let Et=!1;function Mt(e,o){if(typeof e.requestIdleCallback=="function"){e.requestIdleCallback(o,{timeout:2e3});return}e.setTimeout(o,200)}function ai(e,o){for(const a of o){const n=a.type;!n||Pe.has(n)||Be.has(n)||Xe.includes(n)||Xe.push(n)}Jt.htmlTreePrefetchArmed&&ln(e)}function dl(e){Jt.htmlTreePrefetchArmed=!0,ln(e)}function ln(e){if(Et||!Xe.length)return;Et=!0;const o=()=>{const a=Xe.shift();if(!a){Et=!1;return}if(Pe.has(a)||Be.has(a)){Mt(e,o);return}Be.add(a),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(a)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():null).then(n=>{if(typeof n?.html=="string"){Pe.set(a,n.html);const s=ut.get(a);ut.delete(a),s&&s!==dn(e,a)&&E(e)}}).catch(()=>{}).finally(()=>{Be.delete(a),Mt(e,o)})};Mt(e,o)}function Ge(){return!!U}function dn(e,o){return cn(o)||jn(e,o)||"section"}function cn(e){const o=Pe.get(e);if(!o)return"";const a=Dt.get(e);if(a&&a.html===o)return a.tag;const n=so(Qe(o))?.tag||"";return Dt.set(e,{html:o,tag:n}),n}function nt(e,o){const a=Je(e)||"page_sections",n=[];for(const s of Xt(o)||[]){if(s.name===ua||s.name===La)continue;const d=Gt(s.values),r=d&&typeof d=="object"?d[a]:null;if(Array.isArray(r)){r.forEach(h=>{if(!h||typeof h!="object"||Array.isArray(h)||typeof h.type!="string")return;const f=[h._visual_id,h.id,h._id].filter(L=>typeof L=="string"&&L!=="");if(!f.length)return;const g=Yo(e,h),C=typeof h._sve_label=="string"?h._sve_label.trim():"",y=dn(e,g);cn(g)||ut.set(g,y);const _=tn(g)[`0:${y}`];n.push({uid:f[0],ids:f,type:g,tag:y,label:C||(typeof _=="string"&&_.trim()?_.trim():"")||gt(e,g)?.display||ze(g)||g,svg:Jo(y,Lo(y),null).svg||Se.section,cat:qo(y,Lo(y)),enabled:h.enabled!==!1,static:Wn(e,g)})});break}}return n}function si(e,o,a){if(!a.length)return"";const n=b("dock:current-type")||"",s=b("dock:current-uid"),d=!!b("dock:component-exit-state")?.open;if(s){const r=et(s,o),h=a.find(f=>f.ids.some(g=>r.includes(g)));if(h&&(d||h.type===n))return h.uid}return a.find(r=>r.type===n)?.uid||""}function ri(e,o,a){const n=b("dock:component-exit-state");if(n?.open)return ze(n.name)||n.name||"";if(a)return o.find(d=>d.uid===a)?.label||"";const s=b("dock:current-type")||"";return String(s).startsWith("view:")?"":gt(e,s)?.display||ze(s)||""}function kt(e,o,a,n,s){const d=a.find(r=>r.uid===n);d&&n!==s&&(D.clear(),A=null,ge=!1,V(),at(),b("build:reveal",{ids:d.ids}),X=n,sn=Z(),U=Pe.get(d.type)||"",U&&(A=Ut(Qe(U))||null),rn=(b("dock:current-type")||"")===d.type,e.clearTimeout(Ce),Ce=e.setTimeout(()=>{X="",He=!1,E(e)},4e3),E(e),ga(e,d.uid,"tree"),ke({source:J,type:N.SVE_ACTIVATE,ids:d.ids},e),e.setTimeout(()=>E(e),0))}function Kt(e,o){if(!o)return!1;for(const a of e||[])if(a.id===o||Kt(a.children,o))return!0;return!1}function Ut(e){return so(e)?.id||""}function so(e){for(const o of e||[]){if(hn(o))return o;const a=so(o.children);if(a)return a}return null}function hn(e){return!e.kind||e.kind==="component"}function Lo(e){return e==="component"?"component":""}function ii(e,o){const a=o===0||e.path===Ye;return D.has(e.path)?a:!a}function li(e){const o=new Set,a=Zt(),n=(s,d)=>{for(const r of s)(r.children.length?ii(r,d):a&&(r.kind==="antlers"||r.hollow)&&D.has(r.path))&&o.add(r.id),n(r.children,d+1)};return n(e,0),o}function E(e){const o=e.document,n=j(o)?.querySelector("[data-sve-html-tree-list]");if(!n)return;ni(o),Ia(e);const s=Z();U&&U===s&&(U=""),b("dock:chrome-kind")&&(U="");const d=U||s,r=Qe(d,ao(e));pe=r,Ye="";const h=b("dock:current-type")||"",f=tn(h),g=Dn(e,o);g&&Qr(e);const y=!!(b("dock:component-exit-state")||{}).open;h&&s&&!U&&Pe.set(h,s);const _=nt(e,o);ai(e,_);const L=si(e,o,_);if(Jr(e,g,y)){const c=dt(e);pe=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!1,t.layoutFile=!1,t.emptyFile=!1,t.sectionsMissing=[],t.ownFile=null,t.newSectionToo=!1,t.sectionsInLoop="",t.usedBy=null,t.emptyText="",t.pageTemplate?.entry!==c&&(t.pageTemplate=ei(e,c)),t.onRefresh=()=>E(e),t.onSection=null,Ht(e),De(n,St),It(e,[]);return}t.pageTemplate=null,ti(e,String(b("dock:collection-view")||""));const oe=String(b("dock:chrome-kind")||"");if(ia(e),g&&!_.length&&!oe){pe=[],t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,t.layoutFile=!1,t.emptyFile=!1,t.sectionsMissing=[],t.ownFile=null,t.newSectionToo=!1,t.sectionsInLoop="",t.emptyText=v(e,"html_tree_page_empty"),t.canEdit=!b("dock:is-locked"),t.look=bo(e),t.onRefresh=()=>E(e),t.onSection=null,Ht(e),De(n,St),It(e,[]);return}t.pageBuilder=g;const H=`${h}|${L}`;let M=!1;H!==At&&(At=H,D.clear(),Lt!==null&&d!==Lt?M=!0:He=d),(M||He!==!1&&d!==He)&&(He=!1,D.clear(),A=Ut(r)||null),Lt=d,X&&(X===L||!_.length)&&(rn||d!==sn)&&(e.clearTimeout(Ce),X="",He=!1,Kt(r,A)||(D.clear(),A=Ut(r)||null));const w=_.some(c=>c.uid===X)?X:"",$=ge?"":w||L,G=!!(w||L),q=G||y?"":String(b("dock:chrome-kind")||"");q==="template"&&(t.pageBuilder=!1),t.newSectionToo=g&&q==="template"&&!y,t.lastSectionUid=_.length?_[_.length-1].uid:"";const l=g&&(!h&&!G||q==="main"&&b("dock:on-empty-page")===!0),m=l||q==="template"?"":q;t.layoutFile=m==="main",m!=="main"&&(it="");const R=m==="main"?Ho(r,"main"):null,le=R?mt(r,c=>c.tag==="body"&&Kt(c.children,R.id)):null;Ye=le?le.path:"",R&&(lt((le||R).path),it!==H&&(lt(R.path),D.add(R.path)));const z=m==="header"||m==="footer"?mt(r,c=>d.slice(c.from,c.openTo).includes(`data-sve-chrome="${m}"`)):null,ye=z||(m==="header"||m==="footer"?Ho(r,m):null);ye&&lt(ye.path);const B=l||!(m==="main"?!!R:m==="header"||m==="footer"?!!ye:!0)?[]:la(r,t.query?new Set:li(r));t.emptyFile=!d.trim()&&q==="template"&&jt(o),t.sectionsMissing=q==="template"?Po(r):[],t.sectionsMissingText=v(e,"html_tree_sections_missing"),t.sectionsAddText=v(e,"html_tree_sections_add_here"),t.onAddSections=c=>{const T=Ao(e,`sections:${c}`,null,v(e,"html_tree_sections_slot"));T!==null&&(t.selectFrom={at:T,left:4})},!d.trim()&&!jt(o)?t.emptyText=v(e,"html_tree_need_dock"):t.emptyFile?t.emptyText=v(e,"html_tree_page_no_html"):t.emptyText=v(e,"html_tree_empty"),t.slotText=v(e,"antlers_drop_here"),t.dataTitle=v(e,"data_vars_title"),t.pageTitle=v(e,"component_props_page"),t.renameTitle=v(e,"html_tree_rename"),t.tagTitle=v(e,"tw_tag"),t.hideTitle=v(e,"html_tree_hide"),t.showTitle=v(e,"html_tree_show"),t.sectionHideTitle=v(e,"html_tree_section_hide"),t.sectionShowTitle=v(e,"html_tree_section_show"),t.moreTitle=v(e,"html_tree_more"),t.duplicateTitle=v(e,"html_tree_duplicate"),t.deleteTitle=v(e,"html_tree_delete"),t.videoHoldTitle=v(e,"html_tree_video_hold"),t.videoPlayTitle=v(e,"html_tree_video_play"),t.alpineTitle=v(e,"html_tree_alpine_state"),t.lockedTitle=v(e,"html_tree_locked"),t.searchEmpty=v(e,"html_tree_search_empty"),t.canEdit=!b("dock:is-locked"),t.look=bo(e),t.onQuery=()=>E(e),Ht(e),t.inComponent=y,t.onSelect=(c,T)=>{const P=B.find(ne=>ne.id===c);if(P&&Zo(e,P.path))return;T&&!Xa()&&(t.rowClicks+=1);const ae=!!T&&P?.kind==="antlers"&&!ie&&da(e);Ie(e,c,B),T&&P&&!ie&&!Ge()&&b("build:reveal",{path:P.path,section:!!P.sectionRoot}),ae&&ns(e,{path:P.path,at:T,beside:j(e.document)})},t.onTwist=c=>{const T=B.find(P=>P.id===c)?.path;T&&(D.has(T)?D.delete(T):D.add(T),E(e))},t.onTagChange=(c,T)=>{const P=t.rows.find(ae=>ae.id===T);P&&!Ge()&&!ro(e,P)&&Ra(e,c.currentTarget,P)},t.onRename=c=>pi(e,c),t.onRenameCommit=()=>Eo(e,!0),t.onRenameCancel=()=>Eo(e,!1),t.onHide=c=>Ti(e,c),t.onLock=c=>fn(e,c),t.onMore=(c,T)=>Ci(e,c,T),t.canUnlock=vn(e),t.lockTitle=v(e,"html_tree_lock"),t.unlockTitle=v(e,"html_tree_unlock"),t.lockedByTitle=v(e,"html_tree_locked_by_developer"),t.onVideoHold=c=>ki(e,c),t.onAlpineState=(c,T)=>bi(e,c,T),t.onDuplicate=c=>wi(e,c),t.onDelete=c=>_i(e,c),t.onPointerDown=(c,T)=>Hi(e,c,T),t.onSectionPointerDown=(c,T)=>Ri(e,c,T),t.onSectionHover=c=>e.dispatchEvent(new e.CustomEvent("sve-lite-hover",{detail:{uid:c}})),t.onContext=(c,T)=>yn(e,c,T),t.onInspectCommit=c=>Ni(e,c),t.onPropValue=(c,T,P)=>Oo(e,c,T,P),t.onPropPage=(c,T)=>Gr(e,c,P=>Oo(e,T,P,!1)),t.onLoopKind=c=>Vi(e,c),t.onAddBranch=c=>ji(e,c),t.onLoopSortField=c=>{const T=pt();if(!T)return;const P=we?.id===T.id?we.dir:"";we=null,re(e,is(T,c,P))},t.onLoopSortDir=c=>{const T=pt();if(!T)return;const P=ls(T,c);if(P.draft){we={id:T.id,dir:P.draft},Yt(e,T);return}we=null,re(e,P.edit)},t.onLoopDepth=c=>re(e,hs(c)),t.onLoopIncludeHome=c=>re(e,us(c)),t.onLoopLimit=c=>re(e,vs(c)),t.onLoopOffset=c=>re(e,fs(c)),t.onPropHost=c=>c?W.mount(c):W.unmount(),t.onInspectData=(c,T)=>{b("dock:data-menu",{anchor:c,at:B.find(P=>P.id===A)?.from,onPick:P=>T(String(P?.var||"").trim())})};const bt=B.find(hn)?.id,st=y?"":ri(e,_,$),de=$&&!y?_.find(c=>c.uid===$):null;t.nameAt=(c,T)=>{if(T!==d||!c)return"";const P=ve=>{for(const fe of ve||[]){if(fe.path===c)return fe;const me=c.startsWith(`${fe.path}/`)?P(fe.children):null;if(me)return me}return null},ae=t.rows.find(ve=>ve.path===c&&!ve.kind);if(ae)return ae.name;const ne=P(r);if(!ne)return"";const ue=ne.id===bt,rt=ue&&st?st:ne.klass;return ue&&de?rt:xo(rt,ne.path,f)};const Sn=Ko(e,String(b("dock:current-type")||""));let Cn=0;const Pn=yi(z?[z]:r,d),Ln=Uo(e,String(h)),ce=m==="header"||m==="footer"?m:"",Le=ye?ye.id:"",be=R&&B.find(c=>c.id===R.id)||null,uo=le&&B.find(c=>c.id===le.id)||null,he=uo||be||Le&&B.find(c=>c.id===Le)||null,vo=he?vi(B,he):-1;if(he&&!B.slice(B.indexOf(he),vo).some(c=>c.id===A)&&(A=he.id),t.selectFrom){const c=B.find(T=>T.from===t.selectFrom.at&&(!T.kind||T.kind==="sections"));c?(A=c.id,t.selectFrom=null):--t.selectFrom.left<=0&&(t.selectFrom=null)}const fo=t.layoutFile?ui(e):null;t.rows=B.map(c=>{const T=fo&&c.kind==="component"&&fo.get(c.src)||"",P=c.tag==="body"&&!c.kind,ae=T?{svg:Se[T]}:Jo(c.tag,c.kind,c.antlers),ne=c.tag==="video"&&!c.kind?Cn++:-1,ue=Pn.get(c.id),rt=ue?Ln[ue.nth]||{}:{},ve=ue?ue.booleans.map(({key:Fe,value:mo})=>({key:Fe,file:mo,value:rt[Fe]??mo})):[],fe=c.id===bt&&st?st:c.klass,me=c.id===bt;return{...c,tag:T||c.tag,frameCall:T,fixed:!!T||P,base:fe,name:T?v(e,`html_tree_frame_${T}`):ce&&c.id===Le?v(e,`html_tree_frame_${ce}`):c===be?v(e,"html_tree_frame_main"):me&&de?fe:xo(fe,c.path,f),current:c.id===A,letter:ae.letter||"",svg:ce&&c.id===Le?Se[ce]:c===be?Se.main:me&&de?de.svg:ae.svg||"",frame:ce&&c.id===Le?ce:c===be?"main":"",cat:ce&&c.id===Le?ce:c===be||P?"main":T||qo(c.tag,c.kind,c.antlers),componentRoot:me&&y,sectionRoot:me&&de?de.uid:"",sectionOff:!!(me&&de&&!de.enabled),videoNth:ne,videoHeld:ne>=0&&Sn.has(ne),alpineNth:ve.length?ue.nth:-1,alpineKeys:ve,alpineSet:ve.some(Fe=>Fe.value!==Fe.file)}}),ca(e),ha(e);const Tt=[];for(const c of t.rows)Tt.length=c.depth,c.guides=Tt.slice(),Tt[c.depth]=c.cat;if(he){const c=B.indexOf(he),T=he.depth;t.rows=t.rows.slice(c,vo).map(P=>({...P,depth:P.depth-T,guides:P.guides.slice(T)})),be&&it!==H&&(it=H,e.setTimeout(()=>Ie(e,be.id,B),0))}const wt=g&&!y&&q==="template"&&Je(e)||"",xt=wt&&Po(r,[wt]).length===0?wt:"";t.sectionsInLoop=xt,t.sections=g&&!y&&(G||m||l||xt)?_.map(c=>{const T=!!$&&c.uid===$;return{...c,current:T,ready:T&&(!w||!!U),row:{id:`sec:${c.uid}`,section:c.uid,tag:c.tag,name:c.label,kind:"",svg:c.svg,cat:c.cat,letter:"",depth:0,hasChildren:!0,shut:!0,current:T,hidden:!c.enabled}}}):[],t.frame=ci(e,_,G,y,m,!1,!!uo),t.ownFile=hi(e,t.sections.length>0),xt&&(t.ownFile=null),t.frameEmptyText=v(e,"html_tree_frame_no_sections"),di(e,m),t.onSection=c=>{ie||(qt(e),kt(e,o,_,c,$))},t.onRefresh=()=>E(e),Yt(e,t.rows.find(c=>c.id===A)),De(n,St),It(e,r)}function di(e,o){t.frameOpenTitle=v(e,"html_tree_frame_open"),t.frameMainTitle=v(e,"html_tree_frame_main_open"),t.frameTemplateTitle=v(e,"html_tree_frame_template_open"),t.frameFieldsTitle=v(e,"html_tree_frame_fields"),t.onFrame=a=>{o===a?fi(e,a):zt(e,a)},t.onFrameEnter=a=>zt(e,a),t.onFrameFields=a=>Gn(e,ma(e,a),v(e,`html_tree_frame_${a}`)),t.onFrameTwist=()=>{t.mainShut=!t.mainShut}}function ci(e,o,a,n,s,d=!1,r=!1){if(!s&&!d||r)return null;const h=C=>({id:`frame:${C}`,frame:C,synthetic:!0,tag:C,name:v(e,`html_tree_frame_${C}`),kind:"",svg:Se[C]||"",cat:C,letter:"",depth:0,hasChildren:C==="main"&&(o.length>0||s==="template"),shut:C!=="main",current:!1,hidden:!1}),f={kind:s,header:h("header"),main:h("main"),footer:h("footer"),template:null},g=s&&s!=="template"?String(b("dock:collection-view")||""):"";return g&&(f.template={id:"frame:template",frame:"template",synthetic:!0,tag:"section",name:gt(e,g)?.display||ze(g.replace(/^view:/,"")),kind:"",svg:Se.section||"",cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}),f}function hi(e,o){return!o||!ot(e)?null:{id:"frame:own",frame:"template",synthetic:!0,tag:"template",name:v(e,"html_tree_own_file"),kind:"",svg:Se.section||"",cat:"main",letter:"",depth:0,hasChildren:!1,shut:!0,current:!1,hidden:!1}}function Ho(e,o){return mt(e,a=>a.tag===o)}function mt(e,o){for(const a of e||[]){if(!a.kind&&o(a))return a;const n=mt(a.children,o);if(n)return n}return null}function ui(e){const o=e.Statamic?.$config?.get?.("sveChromeTemplates")||{},a=new Map;for(const n of["header","footer"]){const s=Fa(o[n]?.type);s&&a.set(s,n)}return a}function vi(e,o){let a=e.indexOf(o)+1;for(;a<e.length&&e[a].depth>o.depth;)a+=1;return a}function fi(e,o){const a=Go(e);(o==="main"||o==="template"?a?.querySelector("main"):a?.querySelector(`[data-sve-chrome="${o}"]`))?.scrollIntoView({behavior:Ca(),block:"start"})}function qt(e){const o=String(b("dock:chrome-open",e.document)||"");return o!=="header"&&o!=="footer"?!1:(pa(e),ke({source:J,type:N.SVE_FORCE_EXIT_CHROME},e),!0)}function mi(e){e.clearTimeout(Ce),X="",U="",D.clear(),A=null,ge=!1,V(),at()}function zt(e,o){if(e.document,String(b("dock:chrome-kind")||"")===o)return;if(mi(e),o==="main"){qt(e),b("dock:open-file",Ha);return}if(o==="template"){const d=String(b("dock:collection-view")||""),r=d||ot(e);r&&(qt(e),b("dock:open-file",r),d||xa(e,"tree"));return}if(o!=="header"&&o!=="footer")return;const a=Go(e)?.querySelector(`[data-sve-chrome="${o}"]`);a?(a.scrollIntoView({block:"nearest"}),a.dispatchEvent(new a.ownerDocument.defaultView.MouseEvent("click",{bubbles:!0,cancelable:!0}))):e.postMessage({source:J,type:N.OPEN_CHROME,kind:o},e.location.origin);const n=Date.now(),s=async()=>{if(String(b("dock:chrome-kind")||"")!==o){Date.now()-n<3e4&&e.setTimeout(s,250);return}await(b("dock:load-settled")||null),_n(e)};e.setTimeout(s,250)}function It(e,o){j(e.document)&&un(e,o)}function un(e,o){const a=an(o),n=!!b("dock:component-src"),s=n?"":b("dock:current-uid")||"";ke({source:J,type:N.SVE_HTML_PICK,on:!0,uid:s,uids:s?et(s,e.document):[],all:n,tag:a?.tag||"",klass:a?.klass||"",nodes:rs(o)},e)}function lt(e){if(!e)return;const o=(a,n)=>{for(const s of a||[]){if(s.path===e)return!0;if(o(s.children,n+1))return n===0||s.path===Ye?D.delete(s.path):D.add(s.path),!0}return!1};o(pe,0)}function pi(e,o){if(ie)return;const a=t.rows.find(n=>n.id===o);ro(e,a)||!a||a.kind||(A=o,t.rows.forEach(n=>{n.current=n.id===o}),t.editingId=o,t.draft=a.name,e.setTimeout(()=>{const n=j(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function Eo(e,o){const a=t.editingId;if(!a)return;const n=t.rows.find(s=>s.id===a);t.editingId=null,o&&n&&(n.sectionRoot?gi(e,n.sectionRoot,t.draft):as(b("dock:current-type")||"",n.path,t.draft,n.base||n.klass)),t.draft="",E(e)}function gi(e,o,a){const n=Je(e)||"page_sections",s=String(a||"").replace(/\s+/g," ").trim();for(const d of Xt(e.document)||[]){const r=Gt(d.values),h=r&&typeof r=="object"?r[n]:null;if(!Array.isArray(h))continue;const f=h.findIndex(_=>_&&typeof _=="object"&&[_._visual_id,_.id,_._id].includes(o));if(f===-1)continue;const g=Yo(e,h[f]),C=gt(e,g)?.display||ze(g)||g,y=JSON.parse(JSON.stringify(h));return y[f]={...y[f]},!s||s===C?delete y[f]._sve_label:y[f]._sve_label=s,d.setFieldValue(n,y),!0}return!1}function ki(e,o){const a=t.rows.find(h=>h.id===o);if(!a||!(a.videoNth>=0))return;const n=String(b("dock:current-type")||""),s=Ko(e,n),d=!s.has(a.videoNth);d?s.add(a.videoNth):s.delete(a.videoNth);const r=String(b("dock:current-uid")||"");fa(e,n,s),ke({source:J,type:N.SVE_VIDEO_HOLD,uid:r,uids:r?et(r,e.document):[],nth:a.videoNth,on:d},e),E(e)}function yi(e,o){const a=new Map;let n=0;const s=d=>{for(const r of d){if(r.hidden)continue;const h=r.kind?null:gs(o.slice(r.from,r.openTo));h!==null&&a.set(r.id,{nth:n++,booleans:ys(h)}),s(r.children||[])}};return s(e),a}function bi(e,o,a){const n=t.rows.find(d=>d.id===a);if(!n||!(n.alpineNth>=0))return;if(n.alpineKeys.length===1){Mo(e,n,n.alpineKeys[0]);return}const s=o.currentTarget.getBoundingClientRect();V(),te=Re(e.document,Oe,{items:n.alpineKeys.map(d=>({label:d.key,icon:d.value?pn:gn,onPick:()=>{V(),Mo(e,n,d)}})),x:Math.round(s.left),y:Math.round(s.bottom+4),onClose:()=>{te=null}})}function Mo(e,o,a){const n=String(b("dock:current-type")||""),s=Uo(e,n),d=!a.value,r=d!==a.file,h={...s[o.alpineNth]||{}};r?h[a.key]=d:delete h[a.key],Object.keys(h).length?s[o.alpineNth]=h:delete s[o.alpineNth];const f=Ta(String(b("dock:chrome-kind")||"")),g=f?"":String(b("dock:current-uid")||"");wa(e,n,s),ke({source:J,type:N.SVE_ALPINE_STATE,uid:g,uids:g?et(g,e.document):[],chrome:f,nth:o.alpineNth,key:a.key,value:d,on:r},e),E(e)}function ro(e,o){return!o||!(o.locked||o.lockedIn)?!1:(e.Statamic?.$toast?.error(v(e,"html_tree_locked_element")),!0)}function vn(e){return e.Statamic?.$permissions?.has?.("configure fields")===!0}function fn(e,o){const a=t.rows.find(n=>n.id===o);if(!(!a||a.lockedIn||b("dock:is-locked"))){if(!a.locked){Me(e,o,Ga,{lockAction:!0});return}if(!vn(e)){e.Statamic?.$toast?.error(v(e,"html_tree_unlock_denied"));return}eo(e,{titleKey:"html_tree_unlock_title",bodyKey:"html_tree_unlock_body",confirmKey:"html_tree_unlock_confirm"},()=>Me(e,o,Za,{lockAction:!0,unlock:!0}))}}function io(e){return!!t.rows.find(o=>o.id===e)?.fixed}function lo(e){const o=t.sections?.find(n=>n.row?.id===e);if(o)return o;const a=t.rows.find(n=>n.id===e)?.sectionRoot;return a&&t.sections?.find(n=>n.uid===a)||null}function Ti(e,o){if(io(o))return;const a=lo(o),n=t.rows.find(s=>s.id===o);if(a&&!(n?.hidden&&n.wrapFrom!=null)){e.postMessage({source:J,type:N.HIDE_ROW,uid:a.uid,show:!a.enabled},e.location.origin),e.setTimeout(()=>E(e),60);return}Me(e,o,Ja)}function wi(e,o){if(io(o))return;const a=lo(o)?.uid;if(a){e.postMessage({source:J,type:N.DUPLICATE_ROW,uid:a},e.location.origin);return}Me(e,o,Qa)}function mn(e,o){eo(e,{titleKey:"remove_section_title",bodyKey:"remove_section_body",confirmKey:"remove_section_confirm"},()=>{const a=e.document;Pa({uid:o},a,e)})}function xi(e,o,a){X===a&&(e.clearTimeout(Ce),X="",U=""),A=null,ge=!1,At="";const n=nt(e,o),s=n.find(d=>d.uid!==a)||n[0];s?kt(e,o,n,s.uid,""):(U="",t.rows=[],t.sections=[],t.frame=null,t.pageBuilder=!0,E(e)),e.setTimeout(()=>{j(e.document)&&E(e)},0)}zo("row:removed",({uid:e,parentPath:o,doc:a,win:n})=>{o!==Je(n)||!j(n.document)||xi(n,a,e)});function _i(e,o){if(io(o))return;const a=t.sections?.find(s=>s.row?.id===o),n=a?a.row?.section||a.uid:t.rows.find(s=>s.id===o)?.sectionRoot;if(n){mn(e,n);return}if(t.rows.find(s=>s.id===o)?.kind==="sections"){eo(e,{titleKey:"html_tree_sections_remove_title",bodyKey:"html_tree_sections_remove_body",confirmKey:"html_tree_sections_remove_confirm"},()=>Me(e,o,wo));return}Me(e,o,wo)}function Me(e,o,a,{lockAction:n=!1,unlock:s=!1}={}){if(b("dock:is-locked"))return;const d=Z(),r=t.rows.find(f=>f.id===o);if(!r||!n&&ro(e,r))return;const h=a(d,r);h!==d&&$e(h,{unlock:s})}let Ze=null;function co(){Ze?.closest("[data-sve-ht-row]")?.removeAttribute("data-sve-ht-more-open"),Ze=null}function V(){te?.dismiss(),te=null,co()}const pn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>',gn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>',Te=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,xe={up:Te('<path d="M12 19V5M6 11l6-6 6 6"/>'),down:Te('<path d="M12 5v14M6 13l6 6 6-6"/>'),save:Te('<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>'),add:Te('<path d="M12 5v14M5 12h14"/>'),fieldset:Te('<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/>'),lock:Te('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),unlock:Te('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-.9"/>')};function Si(e,o){const a=t.sections||[],n=a.findIndex(r=>r.uid===o.uid),s=(r,h={})=>()=>{V(),e.postMessage({source:J,type:r,uid:o.uid,...h},e.location.origin),e.setTimeout(()=>E(e),60)},d=[{label:v(e,"move_up"),icon:xe.up,onPick:n>0?s(N.MOVE,{direction:-1}):null},{label:v(e,"move_down"),icon:xe.down,onPick:n>=0&&n<a.length-1?s(N.MOVE,{direction:1}):null},{label:v(e,"html_tree_save_section"),icon:xe.save,onPick:s(N.SAVE_SECTION)},{label:v(e,"add_section_below"),icon:xe.add,onPick:s(N.ADD_SET)}];if(Do(e)&&o.type&&!o.static){const r=o.current&&!t.canEdit;d.push({label:v(e,"html_tree_fieldset"),icon:xe.fieldset,onPick:r?null:()=>{V(),Bo(e,o.type)}})}return d}function Io(e,o){const a=t.canEdit&&(!o.locked||t.canUnlock);return{label:o.locked?t.canUnlock?t.unlockTitle:t.lockedByTitle:t.lockTitle,icon:o.locked?xe.unlock:xe.lock,onPick:a?()=>{V(),fn(e,o.id)}:null}}function Ci(e,o,a){if(!o.isConnected||te&&Ze===o)return;const n=lo(a),s=t.rows.find(d=>d.id===a);if(!n){yn(e,null,a,{anchor:o,lead:s?[Io(e,s)]:[]});return}V(),Ze=o,o.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open",""),te=Re(e.document,Oe,{items:[...Si(e,n),...s?[Io(e,s)]:[]],x:0,y:0,anchor:o,onClose:()=>{te=null,co()}})}function kn(e,o){const a=t.sections?.find(f=>f.uid===o),n=a?.type||"";if(!n||!Fo(e))return[];const s=a.label||n,d=Xn(e,n),r=()=>e.Statamic?.$toast?.error(v(e,"section_update_failed")),h=[{label:v(e,"static_section_insertable"),icon:d?gn:pn,onPick:()=>{V(),go(e,{handle:n,hidden:!d}).then(()=>{e.Statamic?.$toast?.success(v(e,d?"section_shown_to_editors":"section_hidden_from_editors",{name:s})),ko(e)}).catch(r)}}];return a.static&&h.push({label:v(e,"section_add_fields"),onPick:()=>{V(),go(e,{handle:n,fields:!0}).then(()=>{e.Statamic?.$toast?.success(v(e,"section_fields_added",{name:s})),ko(e),E(e),Bo(e,n)}).catch(r)}}),h}function Pi(e,o,a){const n=a.row?.section||a.uid;n&&(te=Re(e.document,Oe,{items:[...kn(e,n),{label:v(e,"html_tree_remove_section"),danger:!0,onPick:()=>{V(),mn(e,n)}}],x:o.clientX,y:o.clientY,onClose:()=>{te=null}}))}function yn(e,o,a,{anchor:n=null,lead:s=[]}={}){V();const d=t.sections?.find(g=>g.row?.id===a);if(d){Pi(e,o,d);return}const r=t.rows.find(g=>g.id===a);if(!r)return;n||Ie(e,a,t.rows);const h=n?{x:0,y:0}:{x:o.clientX,y:o.clientY},f=g=>{const C=[...s,...g.map(y=>n&&y.onPick?{...y,onPick:()=>{Ie(e,a,t.rows),y.onPick()}}:y)];C.length&&(te?.dismiss(),n&&(Ze=n,n.closest("[data-sve-ht-row]")?.setAttribute("data-sve-ht-more-open","")),te=Re(e.document,Oe,{items:C,x:h.x,y:h.y,anchor:n,onClose:()=>{te=null,co()}}))};if(r.frameCall){f([{label:v(e,"html_tree_frame_edit",{frame:v(e,`chrome_${r.frameCall}`)}),onPick:()=>{V(),zt(e,r.frameCall)}}]);return}if(r.kind==="component"){Li(e,r,f);return}if(r.kind==="slot"||r.kind==="sections"||r.kind==="svg"||r.locked||r.lockedIn){f([]);return}if(!t.canEdit){f([]);return}if(r.componentRoot){f([]);return}f([...r.sectionRoot?kn(e,r.sectionRoot):[],{label:v(e,"component_make"),onPick:()=>{V(),$a(e,r,{onDone:()=>E(e),onError:g=>{e.alert(g?.status===409?v(e,"component_exists"):v(e,"component_failed"))}})}}])}const Ro=(e,o)=>{V(),b("dock:open-template",o)};function Li(e,o,a){if(!_a(o.src)){a([{label:v(e,"component_open_named",{name:Sa(o.src)||o.src}),onPick:()=>Ro(e,`view:partials/${o.src}`)}]);return}a([{label:v(e,"code_dock_loading"),onPick:null}]),e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(o.src)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>{const s=Array.isArray(n.items)?n.items:[];a(s.length?s.map(d=>({label:v(e,"component_open_named",{name:d.label}),onPick:()=>Ro(e,d.type)})):[{label:v(e,"component_none"),onPick:null}])}).catch(()=>a([{label:v(e,"component_none"),onPick:null}]))}function Hi(e,o,a){if(o.button!==0||b("dock:is-locked")||t.editingId)return;const n=t.rows.find(r=>r.id===a);if(n&&(n.locked||n.lockedIn)||o.target?.closest?.("button, input"))return;at(),_e=a,Ne={x:o.clientX,y:o.clientY},Ve=o.currentTarget,je=o.pointerId;const s=r=>Ei(e,r),d=r=>Mi(e,r);Nt=()=>{e.document.removeEventListener("pointermove",s,!0),e.document.removeEventListener("pointerup",d,!0),e.document.removeEventListener("pointercancel",d,!0),Nt=null},e.document.addEventListener("pointermove",s,!0),e.document.addEventListener("pointerup",d,!0),e.document.addEventListener("pointercancel",d,!0)}function Ei(e,o){if(!_e||!Ne)return;const a=o.clientX-Ne.x,n=o.clientY-Ne.y;if(!t.dragging&&a*a+n*n<25)return;if(!t.dragging){t.dragging=!0;try{Ve?.setPointerCapture?.(je)}catch(y){$o("html-tree: capture the pointer for a row",y)}}o.preventDefault();const s=e.document.elementFromPoint(o.clientX,o.clientY),d=s?.closest?.("[data-sve-ht-slot]");if(d){const y=d.getAttribute("data-sve-ht-id");if(y&&y!==_e){t.dropId=y,t.dropPlace="inside";return}}const r=s?.closest?.("[data-sve-ht-row]"),h=r?.getAttribute("data-sve-ht-id");if(!h||h===_e){t.dropId=null,t.dropPlace=null;return}const f=t.rows.find(y=>y.id===h),g=t.rows.find(y=>y.id===_e);if(!f||f.lockedIn||g&&f.path.startsWith(`${g.path}/`)){t.dropId=null,t.dropPlace=null;return}const C=r.getBoundingClientRect();t.dropId=h,t.dropPlace=qa(o.clientY-C.top,C.height,!Xo(f.tag)&&!Wo(f)&&!f.locked)}function Mi(e,o){const a=_e,n=t.dropId,s=t.dropPlace||"after",d=t.dragging;if(at(),d&&(ie=!0,e.setTimeout(()=>{ie=!1},0)),!d||b("dock:is-locked")||!a||!n||a===n)return;o?.preventDefault?.();const r=Z(),h=za(r,pe,a,n,s);if(h!==r){const f=s==="inside"&&Zt()?Ii(e,r,h,a,n):null;$e(h)||f?.()}}function Ii(e,o,a,n,s){const d=To(pe,n),r=To(pe,s);if(!d||!r||r.children.length||!(r.kind==="antlers"||r.hollow))return null;const h=Wa(o,d),f=h.from<r.from?r.from-(h.to-h.from):r.from,g=(oe,H)=>{for(const M of oe){if(M.from===f&&M.tag===r.tag)return{node:M,depth:H};const w=g(M.children,H+1);if(w)return w}return null},C=g(Qe(a,ao(e)),0);if(!C)return null;const{path:y}=C.node,_=C.depth===0||y===Ye,L=D.has(y);return _?D.delete(y):D.add(y),()=>{L?D.add(y):D.delete(y)}}function at(){Ve?.hasPointerCapture?.(je)&&Ve.releasePointerCapture(je),Nt?.(),_e=null,Ne=null,Ve=null,je=null,t.dragging=!1,t.dropId=null,t.dropPlace=null}function Ri(e,o,a){if(o.button!==0||!a||t.editingId||o.target?.closest?.("button, input"))return;bn(),We=a,Ke={x:o.clientX,y:o.clientY},Ue=o.currentTarget,qe=o.pointerId;const n=d=>Oi(e,d),s=d=>$i(e,d);Vt=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",s,!0),e.document.removeEventListener("pointercancel",s,!0),Vt=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",s,!0),e.document.addEventListener("pointercancel",s,!0)}function Oi(e,o){if(!We||!Ke)return;const a=o.clientX-Ke.x,n=o.clientY-Ke.y;if(!t.dragging&&a*a+n*n<25)return;if(!t.dragging){t.dragging=!0;try{Ue?.setPointerCapture?.(qe)}catch(f){$o("html-tree: capture the pointer for a section",f)}}o.preventDefault();const d=e.document.elementFromPoint(o.clientX,o.clientY)?.closest?.("[data-sve-ht-sec-uid]"),r=d?.getAttribute("data-sve-ht-sec-uid")||"";if(!r||r===We){t.sectionDrop=null;return}const h=d.getBoundingClientRect();t.sectionDrop={uid:r,place:o.clientY-h.top<h.height/2?"before":"after"}}function $i(e,o){const a=We,n=t.sectionDrop,s=t.dragging;bn(),s&&(ie=!0,e.setTimeout(()=>{ie=!1},0)),!(!s||!a||!n?.uid||n.uid===a)&&(o?.preventDefault?.(),Fi(e,a,n.uid,n.place))}function bn(){Ue?.hasPointerCapture?.(qe)&&Ue.releasePointerCapture(qe),Vt?.(),We=null,Ke=null,Ue=null,qe=null,t.dragging=!1,t.sectionDrop=null}function Fi(e,o,a,n){const s=Je(e)||"page_sections";for(const d of Xt(e.document)||[]){const r=Gt(d.values),h=r&&typeof r=="object"?r[s]:null;if(!Array.isArray(h))continue;const f=_=>h.findIndex(L=>L&&typeof L=="object"&&[L._visual_id,L.id,L._id].includes(_)),g=f(o),C=f(a);if(g===-1||C===-1||g===C)return!1;let y=n==="before"?C:C+1;return g<y&&(y-=1),y===g?!1:(e.postMessage({source:J,type:N.MOVE,uid:o,toIndex:y},e.location.origin),e.setTimeout(()=>E(e),60),!0)}return!1}function Yt(e,o){if(o?.kind==="component"){Ai(e,o);return}if(ee.callOpen&&(ee.callOpen=!1,ee.callStore=null,W.forget(),oo(e)),o?.kind!=="antlers"){t.inspect=null;return}const a=o.id,n={logic:!0,path:o.path};if(o.tag==="else"){t.inspect={key:a,...n,title:v(e,"antlers_condition"),mode:"note",note:v(e,"antlers_else_note")};return}if(o.antlers==="loop"){t.inspect={...cs(e,o,{key:a,draft:we?.id===o.id?we.dir:""}),...n};return}t.inspect={key:a,...n,title:v(e,"antlers_condition"),mode:"condition",value:o.expr||"",placeholder:v(e,"antlers_condition_placeholder"),branches:[{id:"elseif",label:v(e,"antlers_add_elseif")},{id:"else",label:v(e,"antlers_add_else")}]}}function Ai(e,o){if(!Da(e)){t.inspect=null;return}if(!o.src)return;const a=o.id;if(t.inspect={key:a,title:v(e,"component_props_values"),mode:"note",note:v(e,"code_dock_loading")},Ba()){const n={},s={},d=new Map;for(const[r,h]of Na(Z().slice(o.from,o.to))){const f=Va(r);f&&(r!==f||!d.has(f))&&d.set(f,h)}for(const[r,h]of d)h.bound?s[r]=h.value:n[r]=h.value;t.inspect=null,ee.callOpen=!0,ee.title=ee.title||v(e,"component_props"),ee.callTitle=o.klass||o.name||o.src,ee.callStore=W.ui,W.ui.canBind=!0,W.ui.dataTitle=v(e,"data_vars_title"),W.ui.exprPlaceholder=v(e,"component_props_expr"),W.ui.onBox=(r,h)=>Bi(e,r,h),W.ui.onPickData=(r,h)=>b("dock:data-menu",{anchor:h,at:o.from,types:ja(W.ui.fields.find(f=>f.handle===r)?.type),onPick:f=>Tn(e,r,String(f?.var||"").trim())}),W.load(e,{key:`${o.src}::${a}`,src:o.src,params:n,bindings:s,readOnly:b("dock:is-locked")===!0}),W.watch(e,{src:o.src,write:r=>Di(e,r,s)}),oo(e);return}Ka(e,o.src).then(n=>{if(t.inspect?.key===a){if(!n.length){t.inspect={key:a,title:v(e,"component_props_values"),mode:"note",note:v(e,"component_props_values_none")};return}t.inspect={key:a,title:v(e,"component_props_values"),mode:"props",inheritLabel:v(e,"component_props_inherit"),rows:Ua(n,Z().slice(o.from,o.to))}}})}function Di(e,o,a={}){const n=t.rows.find(r=>r.id===A);if(n?.kind!=="component"||b("dock:is-locked"))return;let s=Z(),d=n.to;for(const[r,h]of Object.entries(o||{})){if(r in a)continue;const f=s.length,g=no(s,{from:n.from,to:d},r,h);g!==s&&(d+=g.length-f,s=g)}s!==Z()&&($e(s,{save:!0}),E(e))}function Tn(e,o,a){wn(e,o,a,!0),E(e)}function Bi(e,o,a){const n=Ya(a);if(n){Tn(e,o,n);return}W.forget(),wn(e,o,String(a??"").trim(),!1),E(e)}function wn(e,o,a,n){const s=t.rows.find(h=>h.id===A);if(s?.kind!=="component"||b("dock:is-locked"))return;const d=Z(),r=no(d,s,o,a,{bound:n});r!==d&&$e(r,{save:!0})}function pt(){const e=t.rows.find(o=>o.id===A);return e?.kind==="antlers"&&!b("dock:is-locked")?e:null}function re(e,o){const a=pt();if(!a)return;const n=Z(),s=o(n,a);s!==n&&($e(s),E(e))}function Oo(e,o,a,n){const s=t.rows.find(h=>h.id===A);if(s?.kind!=="component"||b("dock:is-locked"))return;const d=Z(),r=no(d,s,o,a,{bound:n});r!==d&&($e(r,{save:!0}),E(e))}function Ni(e,o){re(e,(a,n)=>n.antlers==="loop"?ms(n,o)(a,n):es(a,n,o))}function Vi(e,o){const a=pt();if(!a||a.antlers!=="loop")return;const n=ds(e,a,o);n&&re(e,n)}function ji(e,o){re(e,(a,n)=>ts(a,n,o))}function Ki(e,o){if(!e||!o||Wo(o)||Xo(o.tag))return null;const a=Aa(e,o);if(a<o.openTo)return null;const n=e.lastIndexOf(`
`,a-1)+1;return e.slice(n,a).trim()===""&&n>o.openTo?n-1:a}function Ie(e,o,a,{reveal:n=!0}={}){if(ie)return;const s=(a||t.rows).find(d=>d.id===o);s&&(A=o,t.rows.forEach(d=>{d.current=d.id===o}),Yt(e,s),!Ge()&&(n&&(b("dock:reveal-html",{from:s.from,to:s.to,caret:Ki(Z(),s)}),b("dock:tw-follow")),ke({source:J,type:N.SVE_HTML_PICK_FOCUS,path:s.path,src:s.kind==="component"&&s.src||""},e)))}function Ui(e,o){if(!o)return"";const a=[],n=(s,d)=>{for(const r of s||[]){const h=d||r.path===e;r.kind==="component"&&r.src===o&&a.push({path:r.path,inside:h}),n(r.children,h)}};return n(pe,!1),(a.find(s=>s.inside)||a[0])?.path||""}function qi(e,o,{reveal:a=!0}={}){if(!o||!j(e.document))return;ge=!1;const n=t.rows.find(d=>d.current);if(n&&n.path===o){Ie(e,n.id,t.rows,{reveal:a});return}E(e),lt(o),E(e);const s=t.rows.find(d=>d.path===o);s&&(Ie(e,s.id,t.rows,{reveal:a}),e.setTimeout(()=>{j(e.document)?.querySelector("[data-sve-ht-row][data-sve-ht-current]")?.scrollIntoView({block:"nearest"})},0))}function Wt(e){if(vt)return;const o=()=>{t.editingId||t.dragging||(e.clearTimeout(ft),ft=e.setTimeout(()=>{j(e.document)&&E(e)},80))},a=()=>{if(o(),b("dock:on-empty-page")===!0){const n=nt(e,e.document);n.length===1&&kt(e,e.document,n,n[0].uid,"")}};vt=zo("dock:html-changed",o),e.document.addEventListener("sve-page-structure",a),Bt=()=>{e.document.removeEventListener("sve-page-structure",a)}}function zi(e){vt?.(),vt=null,Bt?.(),Bt=null,e?.clearTimeout?.(ft),ft=0}function ho(e){const o=j(e.document);if(ke({source:J,type:N.SVE_HTML_PICK,on:!1},e),zi(e),W.forget(),ee.callOpen=!1,ee.callStore=null,oo(e),at(),V(),Ma(e),A=null,t.inspect=null,t.editingId=null,t.draft="",t.sections=[],t.pageBuilder=!1,t.layoutFile=!1,X="",e?.clearTimeout?.(Ce),!o){$t(e);return}o.remove(),Jt.headerTab==="html_tree"&&oa(e,null),na(e),No(e),Vo(e),$t(e)}const xn="button[title], button[data-tip], label[title]";function cl(e,o){o.querySelector("[data-sve-html-tree-list]")||(o.id=ct,jo(e,o,{only:xn}),De(o,on,{title:v(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>ho(e)))}function hl(e){Wt(e),E(e)}function _n(e){const o=e.document;if(!An(e,"html_tree"))return;if(j(o)){Wt(e),E(e);return}if(!jt(o))return;ge=!0,D.clear(),aa(e,[ct]);const a=o.createElement("div");a.id=ct,jo(e,a,{only:xn}),a.style.cssText=sa,De(a,on,{title:v(e,"html_tree")}),a.querySelector("[data-sve-close]")?.addEventListener("click",()=>ho(e)),ra(e,a),No(e),Vo(e),$t(e),Wt(e),E(e)}function ul(e){if(j(e.document)){ho(e);return}_n(e)}tt("html-tree:open-section",e=>{const o=window,a=o.document,n=nt(o,a),s=n.find(d=>d.uid===e||d.ids.includes(e));return s?(kt(o,a,n,s.uid,""),{uid:s.uid,ids:s.ids}):null});tt("html-tree:from-preview",({path:e,src:o,uid:a,reveal:n=!0}={})=>{if(!Zo(window,e)){if(!e){Yi(window,a);return}qi(window,Ui(e,o)||e,{reveal:n})}});function Yi(e,o){if(!o||!j(e.document))return;const a=nt(e,e.document),n=et(o,e.document),s=a.find(d=>d.ids.some(r=>n.includes(r)));s&&(ge&&(ge=!1,D.clear(),A=null),X&&X!==s.uid&&(e.clearTimeout(Ce),X="",U=""),!b("dock:load-settled")&&E(e))}tt("html-tree:arm-pick",e=>{const o=window;return e?(un(o,Qe(Z(),ao(o))),!0):(j(o.document)||ke({source:J,type:N.SVE_HTML_PICK,on:!1},o),!0)});tt("html-tree:drop-hit",({x:e,y:o}={})=>{const a=window.document,n=j(a),s=n?a.elementFromPoint(e,o):null;if(!s||!n.contains(s))return null;const d={row:null,section:null};if(Ge()||t.editingId)return d;const r=s.closest("[data-sve-ht-slot]"),h=r||s.closest("[data-sve-ht-row]"),f=h?.getAttribute("data-sve-ht-id"),g=f?t.rows.find(_=>_.id===f):null;if(g?.path&&!g.section){const _=h.getBoundingClientRect();d.row={path:g.path,y:o-_.top,height:_.height,slot:!!r,closed:g.kind==="sections"}}const C=s.closest("[data-sve-ht-sec-uid]"),y=C?C.getAttribute("data-sve-ht-sec-uid"):f?.startsWith("sec:")?f.slice(4):"";if(y){const _=(C||h).getBoundingClientRect();d.section={uid:y,y:o-_.top,height:_.height}}return d});tt("html-tree:drop-mark",e=>{const o=e?.path?t.rows.find(n=>n.path===e.path&&!n.section):null,a=!o&&e?.ids?t.sections.find(n=>e.ids.includes(n.uid)):null;if(t.dropId=o?o.id:null,t.dropPlace=o?e.where:null,t.sectionDrop=a?{uid:a.uid,place:e.where}:null,e?.reveal&&(o||a)){const n=j(window.document),s=o?o.id:`sec:${a.uid}`;(a&&n?.querySelector(`[data-sve-ht-sec-uid="${CSS.escape(a.uid)}"]`)||n?.querySelector(`[data-sve-ht-row][data-sve-ht-id="${CSS.escape(s)}"]`))?.scrollIntoView({block:"nearest"})}return!!(o||a)});function vl(){Pe.clear(),Be.clear(),Dt.clear(),ut.clear(),Xe.length=0}export{Zr as HTML_TREE_STYLE_ID,dl as armHtmlTreePrefetch,vl as clearHtmlTreeTemplates,V as closeHtmlTreeMenu,ho as closeHtmlTreePanel,ni as ensureHtmlTreeStyles,cl as fillHtmlTreePane,A as htmlTreeActiveId,j as htmlTreePanel,ft as htmlTreeTimer,vt as htmlTreeUnhook,_n as openHtmlTreePanel,E as renderHtmlTree,hl as showHtmlTreePane,zi as stopWatchHtmlTreeDock,ul as toggleHtmlTreePanel,Wt as watchHtmlTreeDock};
