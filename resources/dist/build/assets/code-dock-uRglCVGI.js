const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-Dpuj8sxX.js","./index-B5fiB6ig.js","./index-eMi007Cw.js","./index-zsjA895l.js","./index-BsAZfAgM.js","./index-D2YMCfE7.js","./html-tag-sync-BlP2Mk13.js","./index-BatCsQTe.js","./tw-compile-B9daJWrZ.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{o as _,c as S,a as m,t as X,b as mo,F as I,e as re,f as D,I as as,d as Lt,n as ls,M as vo,N as cs,a2 as ds,K as us,w as go,L as fs,s as x,a3 as ps,a4 as hs,a5 as yo,a6 as ms,a7 as xo,J as Z,a8 as we,a9 as Wt,i as ve,aa as vs,ab as bo,A as fe,l as Ce,ac as gs,Q as ys,a1 as xs,T as bs,U as z}from"./addon-BtTyLfb2.js";import{ad as Ja,ae as Qa}from"./addon-BtTyLfb2.js";import{b as Do,d as jo,t as qo,e as Ro,g as ks,P as Ke,s as _s,h as Ss,j as $s,k as ws,c as Ot,l as Cs,r as As,m as Xe,n as It,f as Es,o as Ts,q as Ms,u as Tt}from"./tw-overlay-ueFM43ow.js";import{t as Bs}from"./tw-candidates-wYTeDvRv.js";import{h as Ls,a as Os,e as Is,A as Hs,b as Ds,c as js,d as tt,i as Po}from"./html-tag-sync-BlP2Mk13.js";import"./html-pick-align-C4_uZYVV.js";import"./index-Dpuj8sxX.js";import"./index-B5fiB6ig.js";import"./index-BatCsQTe.js";import"./index-BsAZfAgM.js";import"./index-zsjA895l.js";import"./index-D2YMCfE7.js";import"./index-eMi007Cw.js";const qs={class:"sve-code-dock"},Rs={"data-sve-code-bar":""},Ps={type:"button","data-sve-code-pane-btn":"html"},zs={type:"button","data-sve-code-pane-btn":"css"},Ns={type:"button","data-sve-code-pane-btn":"js"},Fs={type:"button","data-sve-html-scope":"","aria-pressed":"true"},Vs=["innerHTML"],Ws={"data-sve-code-panes":""},Us={"data-sve-code-pane":"html"},Ks={"data-sve-code-pane-label":""},Xs={"data-sve-code-pane":"css"},Ys={"data-sve-css-chrome":"subrow-2"},Gs={"data-sve-code-pane-label":""},Zs={"data-sve-css-label":""},Js={"data-sve-code-pane":"js"},Qs={"data-sve-code-pane-label":""},er={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},treeIcon:{type:String,required:!0}},setup(e){return(t,o)=>(_(),S("div",qs,[o[14]||(o[14]=m("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),m("div",Rs,[m("button",Ps,X(e.htmlLabel),1),m("button",zs,X(e.cssLabel),1),m("button",Ns,X(e.jsLabel),1),o[0]||(o[0]=mo('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button>',6)),m("button",Fs,[m("span",{innerHTML:e.treeIcon},null,8,Vs)]),o[1]||(o[1]=m("button",{type:"button","data-sve-code-autosave":"","aria-pressed":"true"},null,-1)),o[2]||(o[2]=m("button",{type:"button","data-sve-code-save":"",hidden:""},null,-1)),o[3]||(o[3]=m("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[15]||(o[15]=m("div",{"data-sve-code-lock-banner":""},null,-1)),m("div",Ws,[m("div",Us,[m("div",Ks,[m("span",null,X(e.htmlLabel),1),o[4]||(o[4]=m("div",{"data-sve-html-tools":""},null,-1)),o[5]||(o[5]=m("div",{"data-sve-visual-edit-tools":""},null,-1)),o[6]||(o[6]=m("div",{"data-sve-antlers-tools":""},null,-1))]),o[7]||(o[7]=m("div",{"data-sve-code-host":""},null,-1))]),o[12]||(o[12]=m("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),m("div",Xs,[m("div",Ys,[m("div",Gs,[m("span",Zs,X(e.cssLabel),1),o[8]||(o[8]=mo('<button type="button" data-sve-css-add-class></button><div data-sve-css-tools></div><div data-sve-css-subrow><div data-sve-css-sub="box"></div><div data-sve-css-sub="display"></div></div>',3))])]),o[9]||(o[9]=m("div",{"data-sve-code-host":""},null,-1)),o[10]||(o[10]=m("div",{"data-sve-tw-host":""},null,-1))]),o[13]||(o[13]=m("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),m("div",Js,[m("div",Qs,[m("span",null,X(e.jsLabel),1)]),o[11]||(o[11]=m("div",{"data-sve-code-host":""},null,-1))])])]))}},tr=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],or=["innerHTML"],nr={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>(_(!0),S(I,null,re(e.tools,n=>(_(),S("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:D(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:D(s=>e.onTool(n.id),["prevent"])},[n.letter?(_(),S(I,{key:0},[as(X(n.letter),1)],64)):(_(),S("span",{key:1,innerHTML:n.icon},null,8,or))],40,tr))),128))}},sr=["aria-label"],rr={value:""},ir=["label"],ar=["value"],zo={__name:"CodeDockAntlersSelect",props:{label:{type:String,required:!0},groups:{type:Array,required:!0},onPick:{type:Function,required:!0}},setup(e){const t=e;function o(n){const s=n.target.value;n.target.value="",s&&t.onPick(s)}return(n,s)=>(_(),S("select",{"data-sve-antlers-select":"","aria-label":e.label,onChange:o},[m("option",rr,X(e.label),1),(_(!0),S(I,null,re(e.groups,r=>(_(),S("optgroup",{key:r.id,label:r.label},[(_(!0),S(I,null,re(r.items,i=>(_(),S("option",{key:i.id,value:i.id},X(i.label),9,ar))),128))],8,ir))),128))],40,sr))}},lr=["data-sve-css-item"],cr=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],dr={__name:"CodeDockCssTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>(_(!0),S(I,null,re(e.tools,n=>(_(),S("li",{key:n.id,"data-sve-css-item":n.id},[m("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:D(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:D(s=>e.onTool(n.id),["prevent"])},null,40,cr)],8,lr))),128))}},ur={key:0,"data-sve-css-sep":"","aria-hidden":"true"},fr=["data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick"],pr={__name:"CodeDockCssBoxRow",props:{sides:{type:Array,required:!0},onSide:{type:Function,required:!0}},setup(e){return(t,o)=>(_(!0),S(I,null,re(e.sides,n=>(_(),S(I,{key:n.id},[n.sep?(_(),S("span",ur)):Lt("",!0),m("button",{type:"button","data-sve-css-box-side":n.suffix,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:D(s=>e.onSide(n.suffix),["prevent","stop"])},null,8,fr)],64))),128))}},hr={key:0,"data-sve-css-sep":"","aria-hidden":"true"},mr=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],vr={"data-sve-css-flex-extras":""},gr={key:0,"data-sve-css-sep":"","aria-hidden":"true"},yr=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],xr={__name:"CodeDockCssDisplayRow",props:{items:{type:Array,required:!0},extras:{type:Array,default:()=>[]},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>(_(),S(I,null,[(_(!0),S(I,null,re(e.items,n=>(_(),S(I,{key:n.id},[n.sep?(_(),S("span",hr)):Lt("",!0),m("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:D(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:D(s=>e.onTool(n.id),["prevent"])},null,40,mr)],64))),128)),m("div",vr,[(_(!0),S(I,null,re(e.extras,n=>(_(),S(I,{key:n.id},[n.sep?(_(),S("span",gr)):Lt("",!0),m("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:D(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:D(s=>e.onTool(n.id),["prevent"])},null,40,yr)],64))),128))])],64))}},br={key:0,"data-sve-css-swatches":""},kr=["data-sve-css-token","title","data-active","onClick"],_r=["data-sve-css-token","data-active","onClick"],dt={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(e){return(t,o)=>e.kind==="colors"?(_(),S("div",br,[m("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=D((...n)=>e.onClear&&e.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[m("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[m("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(_(!0),S(I,null,re(e.swatches,n=>(_(),S("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:ls({background:n.hex||"transparent"}),onClick:D(s=>e.onPick(n.name),["prevent","stop"])},null,12,kr))),128))])):(_(!0),S(I,{key:1},re(e.choices,n=>(_(),S("button",{key:n.value,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:D(s=>e.onPick(n.value),["prevent","stop"])},X(n.label),9,_r))),128))}},Sr={"data-sve-css-add-label":""},$r=["placeholder","onKeydown"],No={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0}},setup(e){const t=e,o=vo(t.initial||""),n=vo(null);cs(()=>ds(()=>{n.value?.focus(),n.value?.select()}));function s(){const r=o.value.trim();if(!r){n.value?.focus();return}t.onAdd(r)}return(r,i)=>(_(),S(I,null,[m("label",Sr,X(e.label),1),us(m("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":i[0]||(i[0]=a=>o.value=a),type:"text",placeholder:e.placeholder,onKeydown:[go(D(s,["prevent"]),["enter"]),i[1]||(i[1]=go(D(()=>{},["stop"]),["escape"]))]},null,40,$r),[[fs,o.value]])],64))}},Fo=/^\.[a-zA-Z_][\w-]*$/;function Vo(e){const t=String(e||"").match(/\[\s*([\s\S]*?)\s*\]/);return t?t[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).filter(o=>/^[a-zA-Z_][\w-]*$/.test(o)):[]}function wr(e){const t=String(e||"").match(/\sclass\s*=\s*(["'])([^"']*)\1/i);return t?Vo(t[2]):[]}function ut(e){const t=String(e||""),o=[],n=/\sclass\s*=\s*(["'])/gi;let s;for(;s=n.exec(t);){const r=s[1],i=s.index+s[0].length,a=t.indexOf(r,i);if(a===-1)break;const d=t.slice(i,a).match(/\[([\s\S]*?)\]/);if(d){const u=d[1],f=i+d.index+1,y=u.replace(/\{\{[\s\S]*?\}\}/g,q=>" ".repeat(q.length)),b=/[a-zA-Z_][\w-]*/g;let A;for(;A=b.exec(y);)o.push({name:A[0],from:f+A.index,to:f+A.index+A[0].length})}n.lastIndex=a+1}return o}function ko(e,t){return ut(e).find(o=>t>=o.from&&t<=o.to)||null}function _o(e,t){const o=String(e||""),n=ut(o);let s=o;for(let r=n.length-1;r>=0;r-=1){const i=n[r],a=t(i.name);if(a!==i.name){if(!a){let l=i.from,d=i.to;s[d]===" "?d+=1:l>0&&s[l-1]===" "&&(l-=1),s=s.slice(0,l)+s.slice(d);continue}s=s.slice(0,i.from)+a+s.slice(i.to)}}return s}function Wo(e){const t=[],o=/(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;let n;for(;n=o.exec(String(e||""));)t.push(n[2]);return t}function Uo(e,t){const o=[],n=[],s=[];let r=0,i=0;for(;r<e.length&&i<t.length;){if(e[r]===t[i]){r+=1,i+=1;continue}const a=t.indexOf(e[r],i),l=e.indexOf(t[i],r);a===-1&&l===-1?(o.push({from:e[r],to:t[i]}),r+=1,i+=1):a===-1?(s.push(e[r]),r+=1):l===-1||a<=l?(n.push(t[i]),i+=1):(s.push(e[r]),r+=1)}for(;r<e.length;)s.push(e[r]),r+=1;for(;i<t.length;)n.push(t[i]),i+=1;return{renamed:o,added:n,removed:s}}function ye(e){let t=String(e||"").trim().replace(/^\.+/,"").replace(/\s+/g,"-").replace(/[^a-zA-Z0-9_-]/g,"");return/^[a-zA-Z_]/.test(t)||(t=t.replace(/^[^a-zA-Z_]+/,"")),Fo.test(`.${t}`)?t:""}function Cr(e,t){const o=String(e||""),n=ye(t);if(!o||!n)return o;const s=o.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(s){const r=s[1];let i=s[2];const a=[...i.matchAll(/\[([\s\S]*?)\]/g)];if(a.length){const l=a.map(b=>b[1].trim()).filter(Boolean).join(" "),u=Vo(`[ ${l} ]`).includes(n)?l:`${l} ${n}`.trim(),f=i.indexOf("["),y=i.lastIndexOf("]");i=`${i.slice(0,f)}[ ${u} ]${i.slice(y+1)}`.replace(/\s+/g," ").trim()}else i=`[ ${n} ] ${i}`.replace(/\s+/g," ").trim();return o.slice(0,s.index)+` class=${r}${i}${r}`+o.slice(s.index+s[0].length)}return/\/\s*>$/.test(o)?o.replace(/(\s*)(\/\s*>)$/,` class="[ ${n} ]"$1$2`):o.replace(/(\s*)>$/,` class="[ ${n} ]"$1>`)}function Ar(e,t){const o=String(e).indexOf(">",t.from);return o===-1?"":e.slice(t.from,o+1)}function Ko(e,t){const o=[];for(const n of t){const s=wr(Ar(e,n)),r=Ko(e,n.children||[]);if(s.length){o.push({className:s[0],children:r});for(const i of s.slice(1))o.push({className:i,children:[]})}else o.push(...r)}return o}function ft(e){return Ko(e,Do(e))}function ot(e){return String(e).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Ut(e,t){if(e.startsWith("/*",t)){const o=e.indexOf("*/",t+2);return o===-1?e.length:o+2}return t}function Kt(e,t){let o=0;for(let n=t;n<e.length;n+=1){if(e.startsWith("/*",n)){n=Ut(e,n)-1;continue}if(e[n]==="{")o+=1;else if(e[n]==="}"&&(o-=1,o===0))return n}return-1}function Y(e,t){const o=String(e||""),n=new RegExp(`(^|[^\\w-])\\.${ot(t)}\\s*\\{`,"g");let s;for(;s=n.exec(o);){const r=s.index+s[1].length,i=o.indexOf("{",r);if(i===-1)continue;const a=Kt(o,i);if(a!==-1)return{from:r,brace:i,close:a,to:a+1,name:t}}return null}function Er(e){const t=String(e||""),o=[],n={},s=[];let r=0,i="";const a=()=>{const l=i.trim();l&&o.push(l),i=""};for(;r<t.length;){if(t.startsWith("/*",r)){const l=Ut(t,r);i+=t.slice(r,l),r=l;continue}if(t[r]==="{"){const l=i.trim(),d=Kt(t,r);if(d===-1)break;const u=t.slice(r+1,d);i="",Fo.test(l)?n[l.slice(1)]=u:l&&s.push(`${l} {${u}}`),r=d+1;continue}i+=t[r],r+=1}return a(),{decls:o.join(`
`),classes:n,other:s}}function So(e,t){const o="    ".repeat(t);return String(e||"").split(`
`).map(n=>n.trim()?o+n.trim():"").filter((n,s,r)=>n||s>0&&s<r.length-1).join(`
`)}function Tr(e,t){const o=Y(e,t);return o?String(e).slice(o.brace+1,o.close):""}function Xo(e,t,o){const n=Er(Tr(t,e.className)),s="    ".repeat(o),r=[];n.decls&&r.push(So(n.decls.replace(/;+\s*$/,";"),o+1));for(const a of n.other)r.push(So(a,o+1));for(const a of e.children)r.push(Xo(a,t,o+1));const i=r.filter(Boolean).join(`
`);return i?`${s}.${e.className} {
${i}
${s}}`:`${s}.${e.className} {
${s}}`}function Xt(e,t){return t?.length?t.map(o=>Xo(o,e,0)).join(`

`)+`
`:""}function Yo(e){const t=String(e||"").match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);return t?t[1]:""}function Mr(e){const t=[],o=/\.([a-zA-Z_][\w-]*)\s*\{/g;let n,s=!0;for(;n=o.exec(String(e||""));){if(s){s=!1;continue}t.push(n[1])}return t}function Br(e,t){const o=String(e).lastIndexOf(`
`,t-1)+1,n=e.slice(o,t);return/^\s*$/.test(n)?n:""}function Lr(e,t){return t?e.split(`
`).map((o,n)=>n===0||!o?o:t+o).join(`
`):e}function Or(e,t){let o=0;for(let n=0;n<t.from;n+=1){if(e.startsWith("/*",n)){n=Ut(e,n)-1;continue}e[n]==="{"?o+=1:e[n]==="}"&&(o-=1)}return o===0}function Yt(e,t,o){const n=Yo(t)||o;if(!n)return String(e||"");let s=String(t||"").trim();s?new RegExp(`^\\.${ot(n)}\\s*\\{`).test(s)||(s=`.${n} {
${s}
}`):s=`.${n} {
}`;let r=String(e||"");const i=Y(r,n),a=Mr(s);if(i){const d=Br(r,i.from);r=r.slice(0,i.from)+Lr(s,d)+r.slice(i.to)}else r=`${r.trimEnd()}${r.trim()?`
`:""}${s}
`;const l=Y(r,n);if(!l)return r;for(const d of[...new Set(a)].reverse()){const u=new RegExp(`(^|[^\\w-])\\.${ot(d)}\\s*\\{`,"g"),f=[];let y;for(;y=u.exec(r);){const b=y.index+y[1].length,A=r.indexOf("{",b),q=Kt(r,A);q!==-1&&f.push({from:b,to:q+1})}for(const b of f.reverse()){if(b.from>=l.from&&b.to<=l.to||!Or(r,b))continue;let A=b.from;const q=r.lastIndexOf(`
`,A-1)+1;/^\s*$/.test(r.slice(q,A))&&(A=q);let Te=b.to;r[Te]===`
`&&(Te+=1),r=r.slice(0,A)+r.slice(Te)}}return r}function Mt(e,t){const o=String(e||"");return`${o.trimEnd()}${o.trim()?`
`:""}.${t} {
}
`}function Ir(e,t,o){const n=ye(o);return!t||!n||t===n?String(e||""):Y(e,n)?Go(e,t):String(e||"").replace(new RegExp(`(^|[^\\w-])\\.${ot(t)}(\\s*\\{)`,"g"),`$1.${n}$2`)}function Go(e,t){let o=String(e||"");for(;;){const n=Y(o,t);if(!n)break;let s=n.from;const r=o.lastIndexOf(`
`,s-1)+1;/^\s*$/.test(o.slice(r,s))&&(s=r);let i=n.to;o[i]===`
`&&(i+=1),o=o.slice(0,s)+o.slice(i)}return o}function Hr(e,t,o){const n=Array.isArray(t)?t:[],s=Array.isArray(o)?o:[],{renamed:r,added:i}=Uo(n,s),a=new Set(s);let l=String(e||"");for(const d of r){const u=ye(d.to);if(u){if(a.has(d.from)){Y(l,u)||(l=Mt(l,u));continue}Y(l,d.from)?l=Ir(l,d.from,u):Y(l,u)||(l=Mt(l,u))}}for(const d of i){const u=ye(d);!u||Y(l,u)||(l=Mt(l,u))}return l}function Dr(e,t,o){const n=new Set(Array.isArray(t)?t:[]),s=new Set(Array.isArray(o)?o:[]);let r=String(e||"");for(const i of s)n.has(i)||(r=Go(r,i));return r}const Ye="visual_edit",jr=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],Zo=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function qr(e){return Zo.find(t=>t.id===e)||null}function Rr(e,t,o,n){let s=t;for(;s<o;){const r=e.indexOf("{{",s);if(r===-1||r>=o)return null;const i=e.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const a=e.slice(r+2,i);if((a.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:a};s=i+2}return null}function Pr(e,t){const o=String(t).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(e)}const te="__sve-css-rename-chip",zr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function Nr(e){const t=e.Decoration.mark({class:"sve-cm-css-token"}),o=e.StateEffect.define();return{extensions:[e.StateField.define({create(){return e.Decoration.none},update(s,r){let i;for(const l of r.effects)l.is(o)&&(i=l.value);if(i===void 0)return r.docChanged?e.Decoration.none:s;if(!i)return e.Decoration.none;const a=new e.RangeSetBuilder;return a.add(i.from,i.to,t),a.finish()},provide:s=>e.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function se(e){e?.getElementById(te)?.remove()}function Fr(e,t,o,n){t.style.left=`${Math.max(6,Math.min(o,e.innerWidth-28))}px`,t.style.top=`${Math.max(6,n)}px`}function Vr(e,t,o,{onRename:n,title:s}){const r=e.document,i=t.coordsAtPos(o.to);if(!i)return;se(r);const a=r.createElement("button");a.id=te,a.type="button",a.innerHTML=zr,a.title=s,a.setAttribute("aria-label",s),a.addEventListener("mousedown",l=>{l.preventDefault(),l.stopPropagation(),se(r),n?.(o)}),a.addEventListener("mouseleave",()=>{e.setTimeout(()=>{t.dom.matches(":hover")||a.matches(":hover")||se(r)},120)}),r.body.appendChild(a),Fr(e,a,i.right+2,i.top-1)}function Wr(e,t,{onRename:o,isLocked:n,setHover:s,title:r}){if(!t?.dom||t.dom._sveClassTokenBound)return;t.dom._sveClassTokenBound=!0;let i=null,a="";const l=()=>!!n?.(),d=()=>{e.clearTimeout(i),i=null,a="",s?.(t,null),se(e.document)},u=f=>{if(l()){d();return}d(),o?.(f)};t.dom.addEventListener("mousemove",f=>{if(l()){d();return}if(f.target?.closest?.(`#${te}`))return;const y=t.posAtCoords({x:f.clientX,y:f.clientY});if(y==null)return;const b=ko(t.state.doc.toString(),y);if(!b){e.clearTimeout(i),i=null,a="",s?.(t,null);return}const A=`${b.from}:${b.to}:${b.name}`;s?.(t,{from:b.from,to:b.to}),!(a===A&&(i||e.document.getElementById(te)))&&(e.clearTimeout(i),a=A,i=e.setTimeout(()=>{i=null,Vr(e,t,b,{onRename:u,title:r||"Rename class"})},160))}),t.dom.addEventListener("mouseleave",f=>{f.relatedTarget?.closest?.(`#${te}`)||e.setTimeout(()=>{e.document.getElementById(te)?.matches(":hover")||d()},160)}),t.dom.addEventListener("dblclick",f=>{if(l())return;const y=t.posAtCoords({x:f.clientX,y:f.clientY});if(y==null)return;const b=ko(t.state.doc.toString(),y);b&&(f.preventDefault(),f.stopPropagation(),u(b))},!0),t.scrollDOM?.addEventListener("scroll",d),e.document._sveClassTokenDismiss||(e.document._sveClassTokenDismiss=!0,e.document.addEventListener("mousedown",f=>{f.target.closest(`#${te}`)||se(e.document)}))}let ne,Ht,Jo,Qo,en,he,nt,Gt,Zt,Jt,Qt,tn,on,nn,sn,rn,an,ln,cn,dn,un,fn,pn,hn,mn,vn,gn,B,Me=null;function Ur(){return Me||(Me=Promise.all([Z(()=>import("./index-Dpuj8sxX.js").then(e=>e.i),__vite__mapDeps([0,1]),import.meta.url),Z(()=>import("./index-B5fiB6ig.js"),[],import.meta.url),Z(()=>import("./index-eMi007Cw.js"),__vite__mapDeps([2,1,0,3,4]),import.meta.url),Z(()=>import("./index-D2YMCfE7.js"),__vite__mapDeps([5,1,0,3,4]),import.meta.url),Z(()=>import("./html-tag-sync-BlP2Mk13.js").then(e=>e.g),__vite__mapDeps([6,0,1,7,4,3,5,2]),import.meta.url),Z(()=>import("./index-BatCsQTe.js").then(e=>e.i),__vite__mapDeps([7,4,3,1,0]),import.meta.url),Z(()=>import("./html-tag-sync-BlP2Mk13.js").then(e=>e.f),__vite__mapDeps([6,0,1,7,4,3,5,2]),import.meta.url),Z(()=>import("./index-zsjA895l.js"),__vite__mapDeps([3,4,1,0]),import.meta.url),Z(()=>import("./index-BsAZfAgM.js").then(e=>e.i),[],import.meta.url)]).then(([e,t,o,n,s,r,i,a,l])=>{ne=e.EditorView,Ht=e.keymap,Jo=e.lineNumbers,Qo=e.highlightActiveLine,en=e.highlightActiveLineGutter,he=t.Compartment,nt=t.EditorState,Gt=t.StateField,Zt=t.StateEffect,Jt=t.RangeSetBuilder,Qt=e.Decoration,tn=o.defaultKeymap,on=o.indentWithTab,nn=o.historyKeymap,sn=o.history,rn=n.autocompletion,an=n.closeBrackets,ln=n.closeBracketsKeymap,cn=n.closeCompletion,dn=n.completionKeymap,un=e.hoverTooltip,fn=s.htmlLanguage,pn=s.html,hn=r.css,mn=i.javascript,vn=a.HighlightStyle,gn=a.syntaxHighlighting,B=l.tags,je.html=new he,je.css=new he,je.js=new he,qe.html=new he,qe.css=new he,qe.js=new he}).catch(e=>{throw Me=null,e}),Me)}const c="__sve-code-dock",$o="__sve-code-dock-style",K="__sve-code-dock-unlock",yn="sve-code-dock-height",xn="sve-code-dock-panes",bn="sve-code-dock-widths",pt="sve-html-scope-v2",kn="sve-code-dock-autosave",_n="sve-code-dock-style-mode",Kr=280,Sn=120,Bt=140,Xr=250,R=["html","css","js"],Yr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Gr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',Zr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',$n='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',Jr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',Qr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',ei='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',E="__sve-css-menu",wn=["h1","h2","h3","h4","h5","h6"],Dt=[{id:"heading",title:"heading",menu:"heading",letter:"H"},{id:"p",title:"paragraph",tag:"p",letter:"P"},{id:"div",title:"div",tag:"div"},{id:"section",title:"section",tag:"section"},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"}],ti=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],eo=[{id:"all",suffix:"",title:"All sides"},{id:"block",suffix:"-block",title:"Top and bottom",sep:!0},{id:"block-start",suffix:"-block-start",title:"Top"},{id:"block-end",suffix:"-block-end",title:"Bottom"},{id:"inline",suffix:"-inline",title:"Left and right",sep:!0},{id:"inline-start",suffix:"-inline-start",title:"Left"},{id:"inline-end",suffix:"-inline-end",title:"Right"}],Cn={display:"display",absolute:"position",color:"color",bg:"background-color",padding:"padding",margin:"margin","tw-text":"font-size","tw-leading":"line-height","tw-font":"font-family","tw-radius":"border-radius","tw-gap":"gap","tw-align":"text-align","tw-w":"width","tw-h":"height","tw-maxw":"max-width","tw-overflow":"overflow","tw-border":"border-color"},An={"display-flex":"flex","flex-row":"flex-row","flex-col":"flex-col","justify-start":"justify-start","justify-center":"justify-center","justify-end":"justify-end","justify-between":"justify-between","justify-around":"justify-around","align-start":"items-start","align-center":"items-center","align-end":"items-end","align-stretch":"items-stretch"},En=[{id:"tw-text",title:"Font size"},{id:"tw-leading",title:"Line height"},{id:"tw-font",title:"Font family"},{id:"tw-align",title:"Text align"},{id:"tw-border",title:"Border color"},{id:"tw-radius",title:"Radius"},{id:"tw-gap",title:"Gap"},{id:"tw-w",title:"Width"},{id:"tw-h",title:"Height"},{id:"tw-maxw",title:"Max width"},{id:"tw-overflow",title:"Overflow"}],oi={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>'},Tn={"":"","-block":"-block","-inline":"-inline","-block-start":"-top","-block-end":"-bottom","-inline-start":"-left","-inline-end":"-right"},ni='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',si='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',ri='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',ii='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',Mn=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],Ie=[{id:"display",title:"Display",menu:"display"},{id:"absolute",title:"Position",insert:"position: absolute;"},{id:"color",title:"Text color",property:"color",menu:"colors"},{id:"bg",title:"Background color",property:"background-color",menu:"colors"},{id:"padding",title:"Padding",property:"padding",menu:"box"},{id:"margin",title:"Margin",property:"margin",menu:"box"}],jt=[{id:"display-flex",title:"Flex",display:"flex"},{id:"flex-row",title:"Direction: row",flexDir:"row",sep:!0},{id:"flex-col",title:"Direction: column",flexDir:"column"}],qt=[{id:"justify-start",title:"Justify: start",property:"justify-content",value:"flex-start"},{id:"justify-center",title:"Justify: center",property:"justify-content",value:"center"},{id:"justify-end",title:"Justify: end",property:"justify-content",value:"flex-end"},{id:"justify-between",title:"Justify: between",property:"justify-content",value:"space-between"},{id:"justify-around",title:"Justify: around",property:"justify-content",value:"space-around"},{id:"align-start",title:"Align: start",property:"align-items",value:"flex-start",group:"align"},{id:"align-center",title:"Align: center",property:"align-items",value:"center",group:"align"},{id:"align-end",title:"Align: end",property:"align-items",value:"flex-end",group:"align"},{id:"align-stretch",title:"Align: stretch",property:"align-items",value:"stretch",group:"align"}],Ge={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>'},ai={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>'};let Ze=null,xe=null,C=null,le=[],P={html:"",css:"",js:""},T=!1,be=!1,v=null,Be=0,J=null,N=null,me=null,He=null,Pe=!1,j=!1,L=!0,M=!1,O="css",Rt=null,st=null,rt="",Je=!1,it=!1,g=null,w="",k="",G="full",ce="",ae=null,De=null,Le=null,Oe=null,wo=!1;const p={html:null,css:null,js:null},je={html:null,css:null,js:null},qe={html:null,css:null,js:null};function h(e,t,o={}){let n=e.Statamic?.$config?.get?.("sveStrings")?.[t]??t;for(const[s,r]of Object.entries(o))n=String(n).replaceAll(`:${s}`,r);return n}function Bn(e){return e.document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||e.Statamic?.$config?.get?.("csrfToken")||e.Statamic?.$config?.get?.("csrf_token")||""}function li(){return[ne.theme({"&":{height:"auto",backgroundColor:"#1E1E21",color:"#d4d4d4"},".cm-content":{caretColor:"#aeafad",padding:"12px 0",fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:"13px",lineHeight:"1.55"},".cm-cursor":{borderLeftColor:"#aeafad"},".cm-activeLine":{backgroundColor:"#ffffff0d"},".cm-activeLineGutter":{backgroundColor:"#ffffff0d"},".cm-gutters":{backgroundColor:"#1E1E21",color:"#858585",border:"none",borderRight:"1px solid #3c3c3c",fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:"13px",lineHeight:"1.55"},".cm-lineNumbers .cm-gutterElement":{paddingLeft:"8px",paddingRight:"12px"},".cm-scroller":{overflow:"visible",height:"auto",minHeight:0},".cm-selectionBackground, &.cm-focused .cm-selectionBackground":{backgroundColor:"#264f78 !important"}},{dark:!0}),gn(vn.define([{tag:B.keyword,color:"#569cd6"},{tag:B.string,color:"#ce9178"},{tag:B.comment,color:"#6a9955",fontStyle:"italic"},{tag:B.number,color:"#b5cea8"},{tag:B.className,color:"#d7ba7d"},{tag:B.tagName,color:"#4ec9b0"},{tag:B.propertyName,color:"#9cdcfe"},{tag:B.variableName,color:"#9cdcfe"},{tag:B.attributeName,color:"#9cdcfe"},{tag:B.attributeValue,color:"#ce9178"},{tag:B.angleBracket,color:"#808080"},{tag:B.unit,color:"#b5cea8"},{tag:B.color,color:"#ce9178"},{tag:B.bracket,color:"#ffd700"},{tag:B.punctuation,color:"#d4d4d4"},{tag:B.operator,color:"#d4d4d4"}]))]}function ci(e){return e==="css"?hn():e==="js"?mn():pn({autoCloseTags:!0})}function di(e){return e.querySelector(".live-preview")||e.body}function Pt(e,t){const o=di(e);t.parentElement!==o&&o.appendChild(t)}function Co(e){if(e._sveShield)return;e._sveShield=!0;const t=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])e.addEventListener(o,t)}function ui(e){try{return new URLSearchParams(e.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function fi(e){const t=parseInt(we(e,yn)??"",10);return Number.isFinite(t)&&t>=Sn?t:Kr}function pi(e,t){fe(e,yn,String(t))}function Ln(e){try{const t=JSON.parse(we(e,xn)||"null");if(t&&typeof t=="object")return{html:t.html!==!1,css:t.css!==!1,js:t.js===!0}}catch{}return{html:!0,css:!0,js:!1}}function hi(e,t){fe(e,xn,JSON.stringify(t))}function On(e){try{const t=JSON.parse(we(e,bn)||"null");if(t&&typeof t=="object"){const o=n=>Number.isFinite(n)&&n>0?n:1;return{html:o(t.html),css:o(t.css),js:o(t.js)}}}catch{}return{html:1,css:1,js:1}}function mi(e,t){fe(e,bn,JSON.stringify(t))}function vi(e){let t=e.getElementById($o);t||(t=e.createElement("style"),t.id=$o,e.head.appendChild(t)),t.textContent=`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${c} {
  position: fixed;
  /* Same band as the right dock: above the page, under Statamic stacks. */
  z-index: var(--z-index-above, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #1E1E21;
  color: #d4d4d4;
  border-top: 1px solid rgba(255,255,255,.12);
  /* No shadow: the sidebars sit flat against the page and this is the same
     kind of panel. The border is what marks the edge. */
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${c} [data-sve-code-bar] {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  user-select: none;
  cursor: ns-resize;
}
#${c} [data-sve-code-pane-btn] {
  all: unset;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .02em;
  opacity: .55;
}
#${c} [data-sve-code-pane-btn][aria-pressed="true"] {
  background: rgba(255,255,255,.12);
  opacity: 1;
}
#${c} [data-sve-code-path] {
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  opacity: .4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  margin-left: 4px;
}
#${c} [data-sve-code-back] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 8px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .7;
}
#${c} [data-sve-code-back]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${c} [data-sve-code-back][hidden] {
  display: none;
}
#${c} [data-sve-code-status] {
  margin-left: auto;
  font-size: 11px;
  opacity: .7;
  flex: 0 0 auto;
}
#${c} [data-sve-code-lock] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .55;
}
#${c} [data-sve-code-lock]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${c} [data-sve-code-lock][aria-pressed="true"] {
  opacity: 1;
  color: #fbbf24;
  background: rgba(251,191,36,.12);
}
#${c} [data-sve-code-lock][hidden] {
  display: none;
}
#${c} [data-sve-html-scope] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .55;
}
#${c} [data-sve-html-scope]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${c} [data-sve-html-scope][aria-pressed="true"] {
  opacity: 1;
  color: #93c5fd;
  background: rgba(56,88,233,.22);
}
#${c} [data-sve-code-strip],
#${c} [data-sve-code-history] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .55;
}
#${c} [data-sve-code-strip]:hover,
#${c} [data-sve-code-history]:hover,
#${c} [data-sve-code-history][data-open] {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${c} [data-sve-code-strip][aria-pressed="true"] {
  opacity: 1;
  color: #7dd3fc;
  background: rgba(56,189,248,.16);
}
#${c} [data-sve-style-mode] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 8px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .6;
  font-size: 11px;
  white-space: nowrap;
}
#${c} [data-sve-style-mode]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${c} [data-sve-style-mode][aria-pressed="true"] {
  opacity: 1;
  color: #7dd3fc;
  background: rgba(56,189,248,.16);
}
/* The CSS pane holds two things and shows one: the editor, or the chips. */
#${c} [data-sve-tw-host] {
  display: none;
}
#${c}[data-sve-style="tw"] [data-sve-code-pane="css"] [data-sve-code-host] {
  display: none;
}
#${c}[data-sve-style="tw"] [data-sve-tw-host] {
  display: block;
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
#${c} [data-sve-code-autosave],
#${c} [data-sve-code-save] {
  all: unset;
  cursor: pointer;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin-left: 4px;
  border-radius: 6px;
  color: #d4d4d4;
  opacity: .55;
}
#${c} [data-sve-code-autosave]:hover,
#${c} [data-sve-code-save]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${c} [data-sve-code-autosave][aria-pressed="true"] {
  opacity: 1;
  color: #93c5fd;
  background: rgba(56,88,233,.22);
}
#${c} [data-sve-code-save][data-dirty] {
  opacity: 1;
  color: #93c5fd;
  background: rgba(56,88,233,.22);
}
#${c} [data-sve-code-save][hidden] {
  display: none;
}
#${c}[data-sve-code-locked] [data-sve-code-autosave],
#${c}[data-sve-code-locked] [data-sve-html-scope],
#${c}[data-sve-code-locked] [data-sve-style-mode],
#${c}[data-sve-code-locked] [data-sve-code-history],
#${c}[data-sve-code-locked] [data-sve-code-strip],
#${c}[data-sve-code-locked] [data-sve-code-save] {
  pointer-events: none;
  opacity: .28;
}
#${c}[data-sve-code-locked] [data-sve-css-tools],
#${c}[data-sve-code-locked] [data-sve-css-subrow],
#${c}[data-sve-code-locked] [data-sve-html-tools],
#${c}[data-sve-code-locked] [data-sve-antlers-tools],
#${c}[data-sve-code-locked] [data-sve-visual-edit-tools],
#${c}[data-sve-code-locked] [data-sve-css-add-class] {
  pointer-events: none;
  opacity: .28;
}
#${c}[data-sve-code-locked] [data-sve-code-pane] .cm-editor,
#${c}[data-sve-code-locked] [data-sve-tw-host] {
  opacity: .62;
}
#${c} [data-sve-code-lock-banner] {
  display: none;
  flex: 0 0 auto;
  padding: 6px 12px;
  font-size: 11px;
  line-height: 1.4;
  color: #fbbf24;
  background: rgba(251,191,36,.08);
  border-bottom: 1px solid rgba(251,191,36,.18);
}
#${c}[data-sve-code-locked] [data-sve-code-lock-banner] {
  display: block;
}
#${K} {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.5);
}
#${K} [data-sve-unlock-card] {
  width: min(420px, calc(100vw - 32px));
  padding: 20px;
  border-radius: 12px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 16px 40px rgba(0,0,0,.45);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${K} [data-sve-unlock-title] {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}
#${K} [data-sve-unlock-body] {
  font-size: 13px;
  line-height: 1.45;
  opacity: .75;
  margin-bottom: 18px;
}
#${K} [data-sve-unlock-actions] {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
#${K} [data-sve-unlock-actions] button {
  all: unset;
  cursor: pointer;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}
#${K} [data-sve-unlock-cancel] {
  background: rgba(255,255,255,.1);
  color: #d4d4d4;
}
#${K} [data-sve-unlock-confirm] {
  background: #b45309;
  color: #fff;
}
#${c} [data-sve-code-grip] {
  flex: 0 0 16px;
  height: 16px;
  width: 100%;
  cursor: ns-resize;
  z-index: 3;
  ${bo("ns")}
  background-color: var(--theme-color-gray-800, #27272a);
}
#${c} .sve-code-dock {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
#${c} [data-sve-code-panes] {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  overflow: hidden;
}
#${c} [data-sve-code-pane] {
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
#${c} [data-sve-code-pane-label] {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255,255,255,.06);
  user-select: none;
  pointer-events: none;
  position: relative;
  z-index: 2;
  overflow: visible;
  min-width: 0;
}
#${c} [data-sve-code-pane-label] > span {
  opacity: .38;
}
#${c} [data-sve-css-add-class] {
  all: unset;
  pointer-events: auto;
  box-sizing: border-box;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(255,255,255,.1);
  color: #d4d4d4;
  cursor: pointer;
  opacity: .75;
  flex: none;
}
#${c} [data-sve-css-add-class]:hover,
#${c} [data-sve-css-add-class][data-open] {
  background: rgba(255,255,255,.16);
  opacity: 1;
}
#${c} [data-sve-css-tools],
#${c} [data-sve-html-tools] {
  pointer-events: auto;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 1px;
  min-width: 0;
  overflow-x: auto;
}
#${c} [data-sve-html-tools] {
  flex: 1 1 auto;
}
#${c} [data-sve-antlers-tools],
#${c} [data-sve-visual-edit-tools] {
  pointer-events: auto;
  flex: 0 0 auto;
  align-self: stretch;
  margin: -7px 0;
  padding-right: 8px;
  display: flex;
  align-items: stretch;
}
#${c} [data-sve-antlers-select] {
  box-sizing: border-box;
  max-width: 148px;
  height: auto;
  padding: 0 8px 0 10px;
  border: 0;
  border-left: 1px solid rgba(255,255,255,.06);
  border-radius: 0;
  background: transparent;
  color: #d4d4d4;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  cursor: pointer;
  color-scheme: dark;
}
#${c} [data-sve-antlers-select]:hover,
#${c} [data-sve-antlers-select]:focus-visible {
  background: transparent;
}
#${c} [data-sve-css-chrome] {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
#${c} [data-sve-css-subrow] {
  display: none;
  align-items: center;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(255,255,255,.12);
  pointer-events: auto;
  min-width: 0;
}
/**
 * Air between the tools themselves, not between a tool's children.
 *
 * A separate rule so the HTML pane's own row, which shares the one above,
 * keeps the spacing it has. The children sit in their own containers inside
 * the pill and keep their 1px.
 */
#${c} [data-sve-css-tools] {
  gap: 3px;
  scrollbar-width: none;
}
#${c} [data-sve-css-tools]::-webkit-scrollbar {
  display: none;
}

/**
 * A tool is one item, and its children live inside that item.
 *
 * The surface belongs to the item, so it wraps the icon and whatever it opens
 * without a single offset: everything stays in flow, nothing is drawn over
 * anything, and opening a group only makes its own item wider.
 */
#${c} [data-sve-css-item] {
  list-style: none;
  display: inline-flex;
  align-items: center;
  /* Same radius as the button's own highlight, so the shape around the icon
     is identical open and closed. */
  border-radius: 4px;
}
/* Only to the right: nothing may move the icon when the group opens. */
#${c} [data-sve-css-item][data-sve-css-open] {
  background: rgba(255,255,255,.12);
}
#${c} [data-sve-css-item][data-sve-css-open] > [data-sve-css-tool][data-open] {
  background: transparent;
}
#${c} [data-sve-css-item] > [data-sve-css-subrow] {
  padding: 0;
  background: transparent;
  border-radius: 0;
}
#${c} [data-sve-css-item] > [data-sve-css-subrow]::before {
  content: '';
  flex: 0 0 auto;
  width: 1px;
  height: 12px;
  margin: 0 6px 0 4px;
  background: rgba(255,255,255,.16);
}
#${c} [data-sve-css-chrome][data-sve-css-sub] [data-sve-css-subrow] {
  display: flex;
}
#${c} [data-sve-css-subrow] > [data-sve-css-sub] {
  display: none;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  min-width: 0;
}
#${c} [data-sve-css-chrome][data-sve-css-sub="padding"] [data-sve-css-sub="box"],
#${c} [data-sve-css-chrome][data-sve-css-sub="margin"] [data-sve-css-sub="box"],
#${c} [data-sve-css-chrome][data-sve-css-sub="display"] [data-sve-css-sub="display"] {
  display: flex;
}
#${c} [data-sve-css-flex-extras] {
  display: none;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
}
#${c} [data-sve-css-chrome][data-sve-css-flex-on] [data-sve-css-flex-extras] {
  display: contents;
}
#${c} [data-sve-css-sep] {
  width: 1px;
  height: 12px;
  margin: 0 4px;
  background: rgba(255,255,255,.16);
  flex: 0 0 auto;
}
#${c} [data-sve-css-tool],
#${c} [data-sve-css-box-side],
#${c} [data-sve-html-tool] {
  all: unset;
  cursor: pointer;
  position: relative;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #d4d4d4;
  opacity: .7;
}
#${c} [data-sve-css-tool]:hover,
#${c} [data-sve-css-tool][data-open],
#${c} [data-sve-css-tool][data-active],
#${c} [data-sve-html-tool]:hover,
#${c} [data-sve-html-tool][data-open],
#${c} [data-sve-html-tool][data-active] {
  background: rgba(255,255,255,.12);
  opacity: 1;
}
#${c} [data-sve-css-box-side]:hover,
#${c} [data-sve-css-box-side][data-open],
#${c} [data-sve-css-box-side][data-active],
#${c} [data-sve-css-subrow] [data-sve-css-tool]:hover,
#${c} [data-sve-css-subrow] [data-sve-css-tool][data-open],
#${c} [data-sve-css-subrow] [data-sve-css-tool][data-active] {
  background: transparent;
  opacity: 1;
}
/* The hover label lives on the body — see bindTips. A row that scrolls
   would clip anything drawn inside it. */
#${c} [data-sve-html-tool][data-letter] {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: none;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${E} {
  position: fixed;
  z-index: 60;
  min-width: 168px;
  max-width: 240px;
  max-height: 240px;
  overflow: auto;
  padding: 8px;
  border-radius: 8px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${E} [data-sve-css-swatches] {
  display: grid;
  grid-template-columns: repeat(8, 16px);
  gap: 4px;
}
#${E} [data-sve-css-swatch] {
  all: unset;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px solid rgba(255,255,255,.2);
}
#${E} [data-sve-css-swatch]:hover,
#${E} [data-sve-css-clear]:hover {
  outline: 1px solid #fff;
  outline-offset: 1px;
}
#${E} [data-sve-css-clear] {
  all: unset;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px solid rgba(255,255,255,.35);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #d4d4d4;
  background: repeating-conic-gradient(#3f3f3f 0% 25%, #2a2a2a 0% 50%) 50% / 8px 8px;
}
#${E} [data-sve-css-choice] {
  all: unset;
  cursor: pointer;
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
#${E} [data-sve-css-choice]:hover,
#${E} [data-sve-css-swatch][data-active],
#${E} [data-sve-css-choice][data-active] {
  outline: 1px solid #fff;
  outline-offset: 1px;
  background: rgba(255,255,255,.1);
}
#${E} [data-sve-css-add-label] {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
  margin-bottom: 6px;
}
#${E} [data-sve-css-add-input] {
  box-sizing: border-box;
  width: 100%;
  height: 28px;
  padding: 0 8px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 4px;
  background: #1E1E21;
  color: #d4d4d4;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
#${c} [data-sve-code-split] {
  flex: 0 0 16px;
  cursor: col-resize;
  ${bo("ew")}
  background-color: var(--theme-color-gray-800, #27272a);
  position: relative;
  z-index: 1;
}
#${c} [data-sve-code-split]:hover,
#${c} [data-sve-code-split][data-active] {
  filter: brightness(1.15);
}
#${c} [data-sve-code-pane] .cm-editor {
  height: auto !important;
  min-height: 0;
  overflow: visible;
}
#${c} [data-sve-code-pane] .cm-scroller {
  overflow: visible !important;
  height: auto !important;
  min-height: 0 !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
#${c} [data-sve-code-host] {
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.35) transparent;
}
#${c} [data-sve-code-host]::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
#${c} [data-sve-code-host]::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,.28);
  border-radius: 6px;
}
#${c} .sve-cm-css-token {
  background: rgba(215,186,125,.22);
  border-radius: 2px;
}
#${te} {
  all: unset;
  position: fixed;
  z-index: 90;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: #3c3c3c;
  color: #d7ba7d;
  border: 1px solid rgba(255,255,255,.16);
  box-shadow: 0 2px 8px rgba(0,0,0,.35);
  cursor: pointer;
}
#${te}:hover {
  background: #4a4a4a;
}
#${c} .sve-cm-partial {
  text-decoration: underline dotted;
  text-underline-offset: 3px;
  background: rgba(251,191,36,.16);
  cursor: pointer;
}
#${c} .sve-cm-partial-line {
  background: rgba(251,191,36,.12);
}
#${c}[data-sve-code-locked] .sve-cm-partial {
  text-decoration: none;
  background: transparent;
  cursor: default;
  pointer-events: none;
}
#${c}[data-sve-code-locked] .sve-cm-partial-line {
  background: transparent;
}
#${Ke} {
  position: fixed;
  z-index: 90;
  min-width: 168px;
  max-width: 280px;
  max-height: 240px;
  overflow: auto;
  padding: 6px;
  border-radius: 8px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${Ke} [data-sve-partial-choice] {
  all: unset;
  cursor: pointer;
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
#${Ke} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${Ke} [data-sve-partial-empty] {
  padding: 6px 8px;
  font-size: 12px;
  opacity: .55;
}
.sve-tw-info {
  font: 11px/1.4 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  padding: 6px 8px;
  max-width: 320px;
  color: #d4d4d4;
}
.sve-tw-info pre {
  margin: 0;
  white-space: pre-wrap;
  font: inherit;
}
.sve-tw-swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  border: 1px solid rgba(255,255,255,.25);
  margin: 0 6px 4px 0;
  vertical-align: middle;
}
.cm-tooltip.sve-tw-complete {
  background: #1E1E21 !important;
  color: #d4d4d4;
  border: 1px solid #454545 !important;
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0,0,0,.45);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-size: 12px !important;
  line-height: 18px !important;
  padding: 0 !important;
  overflow: hidden;
}
.cm-tooltip.sve-tw-complete > ul {
  font: inherit !important;
  max-height: 240px;
  padding: 2px 0;
  margin: 0;
}
.cm-tooltip.sve-tw-complete > ul > li {
  padding: 1px 8px 1px 6px !important;
  line-height: 22px !important;
  font: inherit !important;
}
.cm-tooltip.sve-tw-complete > ul > li[aria-selected] {
  background: rgba(255,255,255,.1) !important;
}
.cm-tooltip.sve-tw-complete .cm-completionLabel {
  color: #9cdcfe;
  font-size: 12px !important;
}
.cm-tooltip.sve-tw-complete .cm-completionMatchedText {
  text-decoration: none;
  font-weight: 600;
}
.cm-tooltip.sve-tw-complete .cm-completionDetail {
  display: none;
  color: #808080 !important;
  font-size: 11px !important;
  font-style: normal !important;
  margin-left: 16px;
}
.cm-tooltip.sve-tw-complete > ul > li[aria-selected] .cm-completionDetail {
  display: inline;
}
.cm-tooltip.sve-tw-complete .cm-completionIcon {
  width: 14px;
  height: 14px;
  opacity: .65;
  font-size: 11px !important;
  margin-right: 6px;
}
#${c} .emmet-tracker {
  text-decoration: underline 1px #4ade80;
}
`}function gi(e){const t=e.querySelector(".live-preview-editor");if(!t)return 0;const o=t.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function yi(e){let t=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=e.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>e.documentElement.clientWidth-8&&(t=Math.max(t,Math.round(s.width)))}return t}function to(e){const t=e.document;if(De=e,typeof e.ResizeObserver!="function")return;ae||(ae=new e.ResizeObserver(()=>{De&&Ma(De)}));const o=t.querySelector(".live-preview-editor"),n=t.getElementById("__sve-right-dock");o!==Le&&(Le&&ae.unobserve(Le),Le=o,o&&ae.observe(o)),n!==Oe&&(Oe&&ae.unobserve(Oe),Oe=n,n&&ae.observe(n))}function xi(){ae?.disconnect(),ae=null,De=null,Le=null,Oe=null}function bi(e){wo||(wo=!0,e.addEventListener("sve-right-dock-change",()=>to(e)))}function oo(e,t){const o=e.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=t?`${t}px`:"")}function no(e){if(!e)return;const t=e.clientHeight,o=e.querySelector("[data-sve-code-bar]"),n=e.querySelector("[data-sve-code-lock-banner]"),s=n&&ki(e)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,t-(o?.offsetHeight||0)-s),i=e.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),e.querySelectorAll("[data-sve-code-host]").forEach(a=>{const l=a.closest("[data-sve-code-pane]");if(!l||l.style.display==="none")return;let d=0;for(const f of l.children)f!==a&&(d+=f.offsetHeight);const u=Math.max(64,r-d);a.style.height=`${u}px`,a.style.maxHeight=`${u}px`,a.style.minHeight="0",a.style.overflow="auto",_i(a)})}function ki(e){return e.ownerDocument?.defaultView||v}function _i(e){e._sveWheelBound||(e._sveWheelBound=!0,e.addEventListener("wheel",t=>{const o=e.scrollHeight-e.clientHeight,n=e.scrollWidth-e.clientWidth;let s=!1;if(t.deltaY&&o>0){const r=Math.min(o,Math.max(0,e.scrollTop+t.deltaY));r!==e.scrollTop&&(e.scrollTop=r,s=!0)}if(t.deltaX&&n>0){const r=Math.min(n,Math.max(0,e.scrollLeft+t.deltaX));r!==e.scrollLeft&&(e.scrollLeft=r,s=!0)}s&&(t.preventDefault(),t.stopPropagation())},{passive:!1}))}function In(){const e=(De||v)?.document?.getElementById(c);e&&no(e);for(const t of R)p[t]?.requestMeasure()}function Hn(e,t){const o=Ln(e),n={};for(const s of R){const r=t.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function Dn(e,t){for(const n of R){const s=e.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",t[n]?"true":"false"),r&&(r.style.display=t[n]?"flex":"none")}const o=R.filter(n=>t[n]);e.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),jn(e.ownerDocument.defaultView,e),no(e)}function jn(e,t){const o=On(e);for(const n of R){const s=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function ze(e,t){if(Pe)return;const o=e.document;Pt(o,t);const n=fi(e),s=gi(o),r=yi(o);t.style.left=`${s}px`,t.style.right=`${r}px`,t.style.bottom="0",t.style.height=`${n}px`,oo(o,n),no(t)}function qn(e,t,o,n){const s=e.document,r=[...s.querySelectorAll("iframe")];r.forEach(u=>{u.style.pointerEvents="none"});const i=s.createElement("div");i.setAttribute("data-sve-code-drag-shield",""),i.style.cssText=`position:fixed;inset:0;z-index:2147483646;cursor:${t};user-select:none;`,s.body.appendChild(i),Pe=!0;let a=!1;const l=u=>{o(u)},d=()=>{a||(a=!0,Pe=!1,s.removeEventListener("mousemove",l),s.removeEventListener("mouseup",d),e.removeEventListener("blur",d),r.forEach(u=>{u.style.pointerEvents=""}),i.remove(),n?.())};s.addEventListener("mousemove",l),s.addEventListener("mouseup",d),e.addEventListener("blur",d)}function Si(e,t){if(t._sveResizeBound)return;t._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest("[data-sve-code-pane-btn], [data-sve-code-back], [data-sve-style-mode], [data-sve-code-history], [data-sve-code-strip], [data-sve-html-scope], [data-sve-code-lock], [data-sve-code-autosave], [data-sve-code-save], .cm-editor"))return;n.preventDefault();const s=n.clientY,r=t.getBoundingClientRect().height;let i=r;qn(e,"ns-resize",a=>{i=Math.min(Math.max(Sn,r+(s-a.clientY)),Math.round(e.innerHeight*.7)),t.style.height=`${i}px`,oo(e.document,i),In()},()=>{pi(e,i),ze(e,t),e.dispatchEvent(new Event("resize"))})};t.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),t.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function $i(e,t){t._sveSplitBound||(t._sveSplitBound=!0,t.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=R.filter(q=>Hn(e,t)[q]),i=r.indexOf(s),a=r[i],l=r[i+1];if(!a||!l)return;const d=t.querySelector(`[data-sve-code-pane="${a}"]`),u=t.querySelector(`[data-sve-code-pane="${l}"]`),f=n.clientX,y=d.getBoundingClientRect().width,b=u.getBoundingClientRect().width,A=y+b;o.setAttribute("data-active",""),qn(e,"col-resize",q=>{const Te=q.clientX-f;let At=Math.max(Bt,Math.min(A-Bt,y+Te)),ho=A-At;A<Bt*2&&(At=y,ho=b);const Et=On(e);Et[a]=At,Et[l]=ho,mi(e,Et),jn(e,t),In()},()=>{o.removeAttribute("data-active")})})}))}function wi(e,t){t._svePaneBound||(t._svePaneBound=!0,t.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=Hn(e,t),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),hi(e,i),Dn(t,i)})}))}function F(e,t){const o=e.getElementById(c)?.querySelector("[data-sve-code-status]");o&&(o.textContent=t||"")}function Rn(e,t){const o=e.getElementById(c)?.querySelector("[data-sve-code-path]");o&&(o.textContent=t||"",o.title=t||"")}function Ne(e){const t=e?.document?.getElementById(c)?.querySelector("[data-sve-code-back]");t&&(t.hidden=le.length===0,t.title=h(e,"code_dock_back"),t.setAttribute("aria-label",t.title),t.innerHTML=Zr)}function Ao(e,t){const o=t.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Ai(e)}))}function Ci(e){const t=xe,o=typeof x.activeContainers=="function"?x.activeContainers(e.document):[];for(const n of o){const s=x.unwrapRef?.(n.values)||n.values;if(!(!s||typeof s!="object")&&t&&typeof x.findPathByUid=="function"){const r=x.findPathByUid(s,t);if(r){const i=r.split("."),a=x.dataGet?.(s,i.slice(0,2).join("."));if(a&&typeof a=="object")return a}}}for(const n of o){const s=x.unwrapRef?.(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function Pn(e,t){!t||t===C||(ie(e.document),Ct(e,t,"push"))}function Ai(e){const t=le.pop();if(!t){Ne(e);return}ie(e.document),Ct(e,t,"keep")}function $e(e){const t=e.document.getElementById(c),o=t?.querySelector("[data-sve-code-lock]"),n=t?.querySelector("[data-sve-code-lock-banner]");if(!t||!o)return;const s=T;t.toggleAttribute("data-sve-code-locked",s),s&&(jo(e.document),se(e.document),ge&&(ge.setHover(p.html,null),ge.setHover(p.css,null)),Re?.setHover(p.html,null)),o.hidden=!be,o.setAttribute("aria-pressed",T?"true":"false"),o.title=h(e,T?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=T?Yr:Gr,n&&(n.textContent=h(e,"code_dock_locked_banner"))}function Ve(e){return e?we(e,pt)!=="0":L}function ht(e,t,o){return e!=null&&t!=null&&e>=0&&t>e&&t<=o}function mt(){const e=p.html?.state.doc.toString()??"";if(!M||!g){w=e;return}if(g.from<0||g.from>w.length||g.to<g.from){M=!1,w=e,g=null;return}w=w.slice(0,g.from)+e+w.slice(g.to),g={from:g.from,to:g.from+e.length}}function vt(){return mt(),M?w:p.html?.state.doc.toString()??P.html??""}function gt(){N=ut(vt()).map(e=>e.name)}function Ae(){me=Wo(p.css?.state.doc.toString()??k)}function zn(e,t){return Array.isArray(e)&&Array.isArray(t)&&e.length===t.length&&e.every((o,n)=>o===t[n])}function Ei(){const e=M?so():vt(),t=ft(e);t.length&&(k=Yt(k,Xt(k,t),t[0].className))}function Nn(e,t){k=Hr(k,e,t),Ei(),k=Dr(k,t,e)}function Ti(e){if(j||T||N==null)return;const t=ut(vt()).map(o=>o.name);zn(N,t)||(Nn(N,t),N=t,bt(),Ae())}function Mi(){if(j||T||me==null||N==null||G==="empty")return;const e=p.html,t=Wo(p.css?.state.doc.toString()??"");if(!e||zn(me,t))return;const o=new Set(N),{renamed:n,removed:s}=Uo(me,t);let r=e.state.doc.toString();const i=r;for(const a of n){const l=ye(a.to);!o.has(a.from)||!l||(r=_o(r,d=>d===a.from?l:d))}for(const a of s)!o.has(a)||t.includes(a)||(r=_o(r,l=>l===a?"":l));if(r!==i){j=!0;try{xt(r)}finally{j=!1}}gt(),me=t}function Bi(e,t){const o=ye(t),n=p.html;if(!o||!n||n.state.readOnly||o===e.name)return;j=!0;try{n.dispatch({changes:{from:e.from,to:e.to,insert:o}})}finally{j=!1}const s=N==null?[]:N.slice();gt(),Nn(s,N),bt(),Ae(),v&&(ee(v),U(v))}function Li(e,t){const o=e.document,s=p.html?.coordsAtPos(t.from);$(o),se(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=E,o.body.appendChild(r),Ee(e,i,r),r._sveApp=Ce(No,r,{label:h(e,"code_dock_css_rename_class"),placeholder:h(e,"code_dock_css_class_placeholder"),initial:t.name,onAdd:a=>{Bi(t,a),$(o)}})}function Fn(){return L&&ht(g?.from,g?.to,w.length)?(M=!0,w.slice(g.from,g.to)):(M=!1,w)}function yt(e,t,o){const n=p[e];if(!n)return;const s=n.state.doc.toString();j=!0;try{s!==t?n.dispatch({changes:{from:0,to:s.length,insert:t},...o?{selection:o,scrollIntoView:!0}:{}}):o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{j=!1}}function xt(e,t){yt("html",e,t)}function so(){return M?p.html?.state.doc.toString()??"":ht(g?.from,g?.to,w.length)?w.slice(g.from,g.to):""}function pe(){const e=p.css?.state.doc.toString()??"";if(G==="tree"){if(e===ce)return;const t=ft(so())[0]?.className||Yo(e);k=Yt(k,e,t),ce=e}else G==="full"&&(k=e)}function Vn(e,t){for(const o of t||[])if(!Y(e,o.className)||Vn(e,o.children))return!0;return!1}function bt(){let e=k,t=[],o=!1;!L||!M?(G="full",e=k):(t=ft(so()),t.length?(G="tree",e=Xt(k,t),Vn(k,t)&&(k=Yt(k,e,t[0].className),o=!0)):(G="empty",e="")),ce=e,yt("css",e),Ae(),v&&(U(v),o&&ee(v))}function ro(){const e=p.html;if(!e||!g)return;M||(w=e.state.doc.toString());const t=w.length,o=Math.max(0,Math.min(g.from,t)),n=Math.max(o,Math.min(g.to,t));n<=o||(g={from:o,to:n},M=!0,xt(w.slice(o,n),{anchor:0,head:0}),bt(),e.focus())}function io(e=!0){const t=p.html;if(!t)return;pe(),mt(),M=!1;const o=w||t.state.doc.toString(),n=e&&ht(g?.from,g?.to,o.length)?{anchor:g.from,head:g.to}:null;w=o,xt(o,n),G="full",ce=k,yt("css",k),Ae()}function ao(){g=null,M=!1,w="",k="",G="full",ce="",N=null,me=null}let Fe=!1;function Se(e){return!!e?.document.getElementById(x.HTML_TREE_PANEL_ID)}function zt(e,t){if(!(!e||x.featureOn?.(e,"html_tree")===!1)){if(!t){Se(e)&&x.closeHtmlTreePanel?.(e);return}Se(e)||(Fe=!0,gs("html_tree").then(()=>{Se(e)||x.toggleHtmlTreePanel?.(e)}).catch(()=>{}).finally(()=>{Fe=!1,W(e)}))}}function W(e){const t=e?.document.getElementById(c)?.querySelector("[data-sve-html-scope]");if(!t)return;L=Ve(e);const o=x.featureOn?.(e,"html_tree")===!1?L:Se(e)||Fe;t.setAttribute("aria-pressed",o?"true":"false"),t.title=h(e,o?"code_dock_html_scope_off":"code_dock_html_scope"),t.setAttribute("aria-label",t.title),t.innerHTML=$n,e.document.getElementById(c)?.toggleAttribute("data-sve-html-scoped",M)}function Eo(e,t){t._sveHtmlScopeBound||(t._sveHtmlScopeBound=!0,L=Ve(e),Oi(e,t),zt(e,L),t.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),L=!(Se(e)||Fe),fe(e,pt,L?"1":"0"),L?g&&(pe(),ro()):M&&io(),zt(e,L),W(e)}))}function Oi(e,t){t._sveTreeWatchBound||(t._sveTreeWatchBound=!0,e.addEventListener("sve-right-dock-change",()=>{if(Fe||x.featureOn?.(e,"html_tree")===!1||!e.document.getElementById(c))return;const o=Se(e);o!==Ve(e)&&(L=o,fe(e,pt,o?"1":"0"),o?g&&(pe(),ro()):M&&io(),W(e))}))}function To(e,t){t._sveLockBound||(t._sveLockBound=!0,t.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!be||!C)){if(T){Hi(e);return}Wn(e,!0)}}))}function lo(e){return e?we(e,kn)!=="0":!0}function Ii(){const e=p.html;return!e||e.state.readOnly||!C?!1:!uo(co(),P)}function de(e){const t=e?.document.getElementById(c),o=t?.querySelector("[data-sve-code-autosave]"),n=t?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=lo(e),r=Ii();o.setAttribute("aria-pressed",s?"true":"false"),o.title=h(e,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=Jr,n.hidden=s,n.title=h(e,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=Qr,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function Mo(e,t){t._sveAutosaveBound||(t._sveAutosaveBound=!0,t.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!lo(e);fe(e,kn,n?"1":"0"),n?ie(e.document):J&&(clearTimeout(J),J=null),de(e)}),t.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),ie(e.document)}))}function Hi(e){e.document.getElementById(K)?.remove();const t=ys(e.document,xs,{title:h(e,"code_dock_unlock_title"),body:h(e,"code_dock_unlock_body"),buttons:[{value:"cancel",label:h(e,"cancel"),variant:"ghost"},{value:"ok",label:h(e,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{t.dismiss(),o==="ok"&&Wn(e,!1)}});t.host.id=K}function Wn(e,t){const o=C;if(!o)return;const n=()=>{C===o&&e.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Bn(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:t})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));C===o&&(T=t,$e(e),We(P,t),W(e),F(e.document,t?h(e,"code_dock_locked"):""))}).catch(()=>{F(e.document,h(e,"code_dock_error"))})};if(t&&(ie(e.document),He)){He.finally(n);return}n()}function co(){const e={html:"",css:"",js:""};mt(),pe();for(const t of R)t==="html"?e.html=M?w:p.html?.state.doc.toString()??"":t==="css"?e.css=k:e[t]=p[t]?.state.doc.toString()??"";return e}function Un(){if(!(L&&ht(g?.from,g?.to,w.length)))return G="full",ce=k,k;const e=ft(w.slice(g.from,g.to));if(!e.length)return G="empty",ce="","";G="tree";const t=Xt(k,e);return ce=t,t}function We(e,t){j=!0;try{v&&(L=Ve(v)),w=e.html??"",k=e.css??"";for(const o of R){const n=p[o];let s=e[o]??"";try{s=o==="html"?Fn():o==="css"?Un():s}catch{s=o==="html"?w||e.html||"":o==="css"?k||e.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[je[o].reconfigure(nt.readOnly.of(!!t)),qe[o].reconfigure(ne.editable.of(!t))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{j=!1}gt(),Ae(),Wt("dock:html-changed"),v&&(U(v),$t(v),W(v))}function uo(e,t){return e.html===t.html&&e.css===t.css&&e.js===t.js}function Kn(e){return String(e||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function kt(e){const t=Kn(e).match(/^([a-z-]+)\s*:/i);return t?t[1].toLowerCase():""}function Di(e,t){return e===t||e.startsWith(`${t}-`)}function _t(e){const t=Kn(e),o=t.indexOf(":");return o===-1?"":t.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function H(e){const t=String(e||"").trim().toLowerCase();return t==="start"||t==="flex-start"||t==="left"||t==="top"?"flex-start":t==="end"||t==="flex-end"||t==="right"||t==="bottom"?"flex-end":t==="row-reverse"?"row-reverse":t==="column-reverse"?"column-reverse":t}function at(e){const t=H(e);return t==="flex"||t==="inline-flex"}function fo(){const e=p.css;if(!e)return null;const t=e.state.selection.main.head,o=e.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const a=o.indexOf("}}",i+2);if(a===-1)break;i=a+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const a=n.pop();a!=null&&s.push({from:a+1,to:i,text:o.slice(a+1,i),open:a})}}let r=null;for(const i of s)t<i.open||t>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function ji(e){const t=String(e||"");let o="",n=0;for(let s=0;s<t.length;s+=1){if(t[s]==="{"&&t[s+1]==="{"){const r=t.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=t.slice(s,r+2)),s=r+1;continue}if(t[s]==="{"){n+=1;continue}if(t[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=t[s])}return o}function qi(e){const t={};for(const o of ji(e).split(";")){const n=kt(o);n&&(t[n]=_t(`${o};`))}return t}function Ri(e,t,o){if(!t||t.from>=t.to)return null;let n=e.state.doc.lineAt(t.from),s=0;for(;n.from<=t.to;){const r=Math.max(n.from,t.from),i=Math.min(n.to,t.to),a=e.state.doc.sliceString(r,i);if(s===0&&kt(a)===o)return{from:r,to:i,text:a};if(s+=Pi(a),n.to>=e.state.doc.length||n.to>=t.to)break;n=e.state.doc.lineAt(n.to+1)}return null}function Pi(e){let t=0;const o=String(e);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?t+=1:o[n]==="}"&&(t-=1)}return t}function ue(e){return(String(e).match(/^\s*/)||[""])[0]}function St(e,t,o){for(let n=t.number-1;n>=1;n-=1){const s=e.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=ue(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function zi(e,t){const o=e.state.doc.lineAt(t);if(o.text.trim())return ue(o.text);const n=St(e,o,!0);if(n)return n;const s=fo();return s?Xn(e,s):"  "}function Xn(e,t){const o=e.state.doc.lineAt(t.from),n=e.state.doc.lineAt(Math.max(t.from,t.to));for(let r=n.number;r>=o.number;r-=1){const i=e.state.doc.line(r),a=Math.max(i.from,t.from),l=Math.min(i.to,t.to),d=e.state.doc.sliceString(a,l);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(e.state.doc.lineAt(Math.max(0,t.from-1)).text.match(/^\s*/)||[""])[0]}  `}function Bo(){p.css?.focus(),v&&(ee(v),U(v))}function V(e){const t=p.css;if(!t||t.state.readOnly||!e.length)return;const o=fo();if(!o){const i=e.filter(a=>a.value!=null).map(a=>`${a.property}: ${a.value};`).join(`
`);i&&Wi(i),Bo();return}const n=[],s=[],r=Xn(t,o);for(const i of e){const a=Ri(t,o,i.property);if(i.value==null){if(!a)continue;let l=a.from,d=a.to;t.state.doc.sliceString(d,d+1)===`
`&&(d+=1),l=Math.max(l,o.from),d=Math.min(d,o.to),n.push({from:l,to:d});continue}if(!(a&&H(_t(a.text))===H(i.value)))if(a){const l=(a.text.match(/^\s*/)||[""])[0];n.push({from:a.from,to:a.to,insert:`${l}${i.property}: ${i.value};`})}else s.push(`${r}${i.property}: ${i.value};`)}if(s.length){const i=!o.text.includes(`
`)||!/\n\s*$/.test(o.text)?`
`:"";n.push({from:o.to,to:o.to,insert:`${i}${s.join(`
`)}
`})}n.length&&(n.sort((i,a)=>a.from-i.from||a.to-i.to),t.dispatch({changes:n})),Bo()}function ke(){const e=fo();return e?qi(e.text):{}}function Ni(e){const t=ke(),o=at(t.display),n=H(t["flex-direction"])||(o?"row":"");if(o&&n===e){const s=[];t["flex-direction"]&&s.push({property:"flex-direction",value:null}),at(t.display)&&s.push({property:"display",value:null}),V(s);return}V([{property:"display",value:"flex"},{property:"flex-direction",value:e}])}function Fi(e){const t=ke();if(e==="flex"&&at(t.display)){V([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}V([{property:"display",value:e}])}function Vi(e,t){const o=ke();if(H(o[e])===H(t)){V([{property:e,value:null}]);return}V([{property:e,value:t}])}function Wi(e){const t=p.css;if(!t||t.state.readOnly)return;const o=t.state.selection.main.head,n=t.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=zi(t,o),a=e.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const d=`${i}${a}
${i}`;t.dispatch({changes:{from:n.from,to:n.to,insert:d},selection:{anchor:n.from+d.length}});return}const l=`
${i}${a}
${i}`;t.dispatch({changes:{from:o,to:t.state.selection.main.to,insert:l},selection:{anchor:o+l.length}})}function U(e){try{Ui(e)}catch{}}function Ui(e){const t=e?.document?.getElementById(c);if(t&&Gn(t),O==="tw"){t&&da(e,t);return}const o=ke(),n=at(o.display),s=H(o["flex-direction"])||(n?"row":""),r=t?.querySelector("[data-sve-css-tools]"),i=t?.querySelector("[data-sve-css-chrome]"),a=i?.getAttribute("data-sve-css-sub")||"",l=a==="padding"||a==="margin"?a:"";if(t){i&&(n?i.setAttribute("data-sve-css-flex-on",""):i.removeAttribute("data-sve-css-flex-on")),r&&(n?r.setAttribute("data-sve-css-flex-on",""):r.removeAttribute("data-sve-css-flex-on"));for(const d of[...Ie,...jt]){const u=t.querySelector(`[data-sve-css-tool="${d.id}"]`);if(!u)continue;let f=!1;if(d.flexDir)f=n&&s===d.flexDir;else if(d.display)f=d.display==="flex"?n:H(o.display)===d.display;else if(d.insert){const y=kt(d.insert);f=!!y&&H(o[y])===H(_t(d.insert))}else d.menu==="box"?(f=Object.keys(o).some(y=>Di(y,d.property)),a===d.property?u.setAttribute("data-open",""):u.removeAttribute("data-open")):d.menu==="display"?(f=!!o.display,a==="display"?u.setAttribute("data-open",""):u.removeAttribute("data-open")):d.property&&(f=d.property in o);f?u.setAttribute("data-active",""):u.removeAttribute("data-active")}for(const d of eo){const u=t.querySelector(`[data-sve-css-box-side="${d.suffix}"]`);if(!u)continue;!!l&&`${l}${d.suffix}`in o?u.setAttribute("data-active",""):u.removeAttribute("data-active")}for(const d of qt){const u=t.querySelector(`[data-sve-css-tool="${d.id}"]`);if(!u)continue;H(o[d.property])===H(d.value)?u.setAttribute("data-active",""):u.removeAttribute("data-active")}}}function $(e){const t=e?.getElementById(E);t?._sveApp?.unmount(),t?.remove(),e?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-css-box-side][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(o=>o.removeAttribute("data-open"))}function Xa(e){$(e),se(e);for(const t of R)p[t]&&cn?.(p[t])}function Ki(e){if(Ze)return Ze;const t=e.Statamic?.$config?.get?.("cpUrl")||`/${e.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return Ze=e.fetch(`${t}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,a=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!a||n.has(a)||(n.add(a),s.push({name:a,hex:r.hex||r.color||""}))}for(const[r,i]of Mn)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),Ze}function Yn(e,t){const o=ke()[t]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of e.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function Ee(e,t,o){const n=t.getBoundingClientRect(),s=8;o.style.left=`${Math.max(s,Math.min(n.left,e.innerWidth-220))}px`,o.style.top=`${Math.max(s,n.bottom+4)}px`}function Xi(e,t,o){const n=e.document;$(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=E,n.body.appendChild(s),Ee(e,t,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=Ce(dt,s,{kind:"colors",swatches:i,onClear:()=>{V([{property:o,value:null}]),$(n)},onPick:a=>{V([{property:o,value:`var(${a})`}]),$(n)}}),Yn(s,o)};r(Mn.map(([i,a])=>({name:i,hex:a}))),Ki(e).then(i=>{n.getElementById(E)&&r(i.map(a=>({name:a.name,hex:a.hex})))})}function Lo(e,t,o){const n=e.document;$(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=E,n.body.appendChild(s),Ee(e,t,s),s._sveApp=Ce(dt,s,{kind:"choices",choices:ti.map(r=>({value:r,token:r,label:r})),onPick:r=>{V([{property:o,value:`var(${r})`}]),$(n)}}),Yn(s,o)}function Gn(e){const t=Q(e),o=t?.querySelector("[data-sve-css-subrow]");if(!t||!o)return;t.querySelectorAll("[data-sve-css-item][data-sve-css-open]").forEach(i=>i.removeAttribute("data-sve-css-open"));const n=t.getAttribute("data-sve-css-sub")||"",s=n?t.querySelector(`[data-sve-css-item="${n}"]`):null;if(s){o.parentElement!==s&&s.appendChild(o),s.setAttribute("data-sve-css-open","");return}const r=t.querySelector("[data-sve-code-pane-label]");r&&o.parentElement!==r&&r.appendChild(o)}function Q(e){return e?.querySelector("[data-sve-css-chrome]")}function Nt(e,t){const o=e.document.getElementById(c),n=Q(o);$(e.document),n&&(n.getAttribute("data-sve-css-sub")===t?n.removeAttribute("data-sve-css-sub"):n.setAttribute("data-sve-css-sub",t),U(e))}function Zn(e,t){if(e.startsWith("{{",t)){const o=e.indexOf("}}",t+2);return o===-1?e.length:o+2}if(e.startsWith("<!--",t)){const o=e.indexOf("-->",t+4);return o===-1?e.length:o+3}return t}function Ft(e,t){if(e[t]!=="<")return null;const o=e.indexOf(">",t+1);if(o===-1)return null;const n=e.slice(t,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:t,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:t,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:t,to:o+1}}function Oo(e,t,o){let n=1,s=o;for(;s<e.length;){const r=Zn(e,s);if(r!==s){s=r;continue}if(e[s]!=="<"){s+=1;continue}const i=Ft(e,s);if(!i)break;if(i.kind==="open"&&i.name===t)n+=1;else if(i.kind==="close"&&i.name===t&&(n-=1,n===0))return i;s=i.to}return null}function Ue(){const e=p.html;if(!e)return null;const t=e.state.selection.main.head,o=e.state.doc.toString(),n=[];let s=0;for(;s<t;){const l=Zn(o,s);if(l!==s){s=l;continue}if(o[s]!=="<"){s+=1;continue}const d=Ft(o,s);if(!d||d.from>=t)break;if(d.kind==="open")n.push(d);else if(d.kind==="close"){for(let u=n.length-1;u>=0;u-=1)if(n[u].name===d.name){n.splice(u);break}}s=d.to}const r=o.lastIndexOf("<",Math.max(0,t-1));if(r!==-1&&o.indexOf(">",r)>=t){const l=Ft(o,r);if(l?.kind==="open"||l?.kind==="void"){const d=l.kind==="void"?null:Oo(o,l.name,l.to);return d?{name:l.name,open:l,close:d}:{name:l.name,open:l,close:null}}}const i=n[n.length-1];if(!i)return null;const a=Oo(o,i.name,i.to);return{name:i.name,open:i,close:a}}function Vt(e){return wn.includes(e)}function oe(){p.html?.focus(),v&&(ee(v),$t(v))}function Qe(e,t,o){const n=[...t].sort((s,r)=>r.from-s.from||r.to-s.to);e.dispatch({changes:n,selection:o})}function lt(e,t){const o=p.html;if(!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.slice(0,n-s.from),i=s.text.trim()?ue(s.text):St(o,s)||ue(s.text);let a=e,l=0;if(r.trim()!=="")a=`
${i}${e}`,l=1+i.length;else if(!s.text.trim()){a=`${i}${e}`,l=i.length,o.dispatch({changes:{from:s.from,to:s.to,insert:a},selection:{anchor:s.from+l+t}});return}o.dispatch({changes:{from:n,to:o.state.selection.main.to,insert:a},selection:{anchor:n+l+t}})}function Jn(e){const t=p.html;if(!t||t.state.readOnly)return;const o=t.state.selection.main,n=t.state.doc.toString();if(!o.empty){const a=n.slice(o.from,o.to),l=a.match(new RegExp(`^<${e}(\\s[^>]*)?>([\\s\\S]*)</${e}>$`,"i"));if(l){Qe(t,[{from:o.from,to:o.to,insert:l[2]}],{anchor:o.from,head:o.from+l[2].length}),oe();return}let d=`<${e}>${a}</${e}>`,u=o.from+e.length+2;e==="ul"&&(d=`<ul>
  <li>${a}</li>
</ul>`,u=o.from+11),Qe(t,[{from:o.from,to:o.to,insert:d}],{anchor:u,head:u+a.length}),oe();return}const s=Ue();if(s?.open&&s.close){if(s.name===e){Qe(t,[{from:s.close.from,to:s.close.to,insert:""},{from:s.open.from,to:s.open.to,insert:""}],{anchor:s.open.from}),oe();return}if(Vt(s.name)&&Vt(e)){const a=n.slice(s.open.from,s.open.to).replace(new RegExp(`^<${s.name}`,"i"),`<${e}`);Qe(t,[{from:s.close.from,to:s.close.to,insert:`</${e}>`},{from:s.open.from,to:s.open.to,insert:a}],{anchor:s.open.from+e.length+1}),oe();return}}const i=(t.state.doc.lineAt(o.head).text.match(/^\s*/)||[""])[0];if(e==="ul"){const a=`<ul>
${i}  <li></li>
${i}</ul>`;lt(a,`<ul>
${i}  <li>`.length)}else lt(`<${e}></${e}>`,e.length+2);oe()}function $t(e){try{Yi(e)}catch{}}function Yi(e){const t=e?.document?.getElementById(c),n=Ue()?.name||"";if(t)for(const s of Dt){const r=t.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!r)continue;(s.id==="heading"?Vt(n):n===s.tag)?r.setAttribute("data-active",""):r.removeAttribute("data-active")}}function Gi(e,t){const o=e.document,n=Ue()?.name||"";$(o),t.setAttribute("data-open","");const s=o.createElement("div");s.id=E,o.body.appendChild(s),Ee(e,t,s),s._sveApp=Ce(dt,s,{kind:"choices",choices:wn.map(r=>({value:r,label:r.toUpperCase(),active:n===r})),onPick:r=>{Jn(r),$(o)}})}function Zi(e){const t=ye(e),o=p.html,n=p.css;if(!t||o?.state.readOnly||n?.state.readOnly)return;const s=Ue();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=Cr(r,t);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}pe(),Y(k,t)||(k=`${String(k||"").trimEnd()}${k?.trim()?`
`:""}.${t} {
}
`),bt(),gt(),Ae(),v&&(ee(v),$t(v),U(v))}function Ji(e,t){const o=e.document;if(t.hasAttribute("data-open")){$(o);return}$(o),t.setAttribute("data-open","");const n=o.createElement("div");n.id=E,o.body.appendChild(n),Ee(e,t,n),n._sveApp=Ce(No,n,{label:h(e,"code_dock_css_class_name"),placeholder:h(e,"code_dock_css_class_placeholder"),onAdd:s=>{Zi(s),$(o)}})}function Qi(e,t){const o=t.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=ei,o.title=h(e,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),O==="tw"){$(e.document),Ts(e,o);return}Ji(e,o)}))}function ea(e){const t=Math.max(0,Math.round(Date.now()/1e3-e)),o=new Date(e*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let n=o;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});t<90?n=s.format(-t,"second"):t<5400?n=s.format(-Math.round(t/60),"minute"):t<86400?n=s.format(-Math.round(t/3600),"hour"):n=s.format(-Math.round(t/86400),"day")}catch{}return`${n} · ${o}`}function Qn(e,t){return e.fetch(t,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function ta(e,t){const o=e.document,n=is();if($(o),!n)return;let s=[];try{const i=await Qn(e,`/!/sve/section-template/history?type=${encodeURIComponent(n)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!o.getElementById(c)||!o.contains(t))return;t.setAttribute("data-open","");const r=o.createElement("div");r.id=E,o.body.appendChild(r),Ee(e,t,r),r._sveApp=Ce(dt,r,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:ea(i.at)})):[{value:"",label:h(e,"code_dock_history_empty")}],onPick:i=>{$(o),i&&oa(e,n,i)}})}async function oa(e,t,o){if(_e())return;let n=null;try{const s=await Qn(e,`/!/sve/section-template/history/entry?type=${encodeURIComponent(t)}&id=${encodeURIComponent(o)}`);s.ok&&(n=await s.json())}catch{n=null}!n||_e()||(We({html:n.html??"",css:n.css??"",js:n.js??""},T),ee(e),wt(e))}function ct(e){const t=e?.document.getElementById(c)?.querySelector("[data-sve-code-strip]");if(!t)return;const o=Ro(e);t.innerHTML=ni,t.title=h(e,o?"tw_strip_on":"tw_strip_off"),t.setAttribute("aria-label",t.title),t.setAttribute("aria-pressed",o?"true":"false")}function na(e,t){const o=t.querySelector("[data-sve-code-strip]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),_s(e,!Ro(e)),ct(e),Ss(e)}),ct(e))}function sa(e,t){const o=t.querySelector("[data-sve-code-history]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=si,o.title=h(e,"code_dock_history"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),o.hasAttribute("data-open")){$(e.document);return}ta(e,o)}))}function Ya(){return O}function ra(e){const t=p.html;if(!t||O!=="tw")return null;const o=M&&!!g,n=o?w:t.state.doc.toString(),r=(o?g.from:0)+t.state.selection.main.from,i=Es(Do(n),new Set);let a=null;for(const l of i)l.from<=r&&r<l.to&&(a=l);return a}function wt(e){O==="tw"&&As(e,ra())}function po(e){const t=e?.document.getElementById(c);if(!t)return;const o=O==="tw";t.setAttribute("data-sve-style",O);const n=t.querySelector("[data-sve-css-label]");n&&(n.textContent=o?h(e,"code_dock_style_tw"):h(e,"code_dock_css"));const s=t.querySelector("[data-sve-style-mode]");if(!s)return;const r=e.document.createElement("span");r.textContent=o?h(e,"code_dock_style_tw"):h(e,"code_dock_css"),s.innerHTML=o?ii:ri,s.appendChild(r),s.title=h(e,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function es(e){const t=e?.document.getElementById(c);$(e.document),Ot(e),Q(t)?.removeAttribute("data-sve-css-sub"),po(e),Rt?.(),O==="tw"&&(L=!0,fe(e,pt,"1"),zt(e,!0)),wt(e),U(e)}function ia(e,t){O=t==="tw"?"tw":"css",fe(e,_n,O),es(e)}function aa(e,t){t._sveStyleModeBound||(t._sveStyleModeBound=!0,O=we(e,_n)==="tw"?"tw":"css",t.querySelector("[data-sve-style-mode]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),ia(e,O==="tw"?"css":"tw")}),es(e))}function la(e,t,o,n){const s=An[o];if(s){Ot(e),Ms(e,s),U(e);return}const r=Cn[o];if(!(!r||!n)){if(o==="display"){Q(t)?.removeAttribute("data-sve-css-sub"),It(e,n,"display",i=>{const a=Q(t);i==="flex"||i==="inline-flex"||i==="grid"?a?.setAttribute("data-sve-css-sub","display"):a?.removeAttribute("data-sve-css-sub"),U(e)});return}if(o==="padding"||o==="margin"){Ot(e),Nt(e,r);return}Q(t)?.removeAttribute("data-sve-css-sub"),It(e,n,r)}}function ca(e){return e==="flex"?"display":e.startsWith("justify-")?"justify-content":e.startsWith("items-")?"align-items":"flex-direction"}function da(e,t){const o=t.querySelector("[data-sve-css-chrome]"),n=o?.getAttribute("data-sve-css-sub")||"",s=n==="padding"||n==="margin"?n:"",r=Tt()?Xe("display"):"",i=r==="flex"||r==="inline-flex"||r==="grid";for(const a of[o,t.querySelector("[data-sve-css-tools]")])a&&(i?a.setAttribute("data-sve-css-flex-on",""):a.removeAttribute("data-sve-css-flex-on"));for(const[a,l]of Object.entries(An)){const d=t.querySelector(`[data-sve-css-tool="${a}"]`);d&&(Tt()&&Xe(ca(l))===l?d.setAttribute("data-active",""):d.removeAttribute("data-active"))}for(const a of[...Ie,...En]){const l=t.querySelector(`[data-sve-css-tool="${a.id}"]`);if(!l)continue;const d=Cn[a.id],u=Tt()&&!!d&&!!Xe(d);n===d&&(a.id==="padding"||a.id==="margin")?l.setAttribute("data-open",""):l.removeAttribute("data-open"),u?l.setAttribute("data-active",""):l.removeAttribute("data-active")}for(const a of eo){const l=t.querySelector(`[data-sve-css-box-side="${a.suffix}"]`);if(!l)continue;const d=s?`${s}${Tn[a.suffix]??a.suffix}`:"";d&&Xe(d)?l.setAttribute("data-active",""):l.removeAttribute("data-active")}}function ua(e,t){const o=t.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=[...Ie,...jt,...qt],s=(d,u)=>{if(O==="tw"){la(e,t,d,u);return}const f=n.find(y=>y.id===d);if(f){if(f.flexDir){$(e.document),Ni(f.flexDir);return}if(f.display){$(e.document),Fi(f.display);return}if(f.property&&f.value){$(e.document),Vi(f.property,f.value);return}if(f.insert){const y=kt(f.insert),b=_t(f.insert),A=ke();$(e.document),Q(t)?.removeAttribute("data-sve-css-sub"),y&&H(A[y])===H(b)?V([{property:y,value:null}]):V([{property:y,value:b}]);return}if(f.menu==="colors"){Q(t)?.removeAttribute("data-sve-css-sub"),Xi(e,u,f.property);return}if(f.menu==="box"){Nt(e,f.property);return}if(f.menu==="display"){Nt(e,"display");return}f.menu==="spacing"&&Lo(e,u,f.property)}};let r=!1;const i=qt.map((d,u)=>{const f={...d,icon:Ge[d.id]||"",sep:u===0||d.group==="align"&&!r};return d.group==="align"&&!r&&(r=!0),f});Rt=()=>{const d=O==="tw"?[...Ie,...En]:Ie;Q(t)?.removeAttribute("data-sve-css-sub"),Gn(t),ve(o,dr,{tools:d.map(u=>({...u,icon:Ge[u.id]||oi[u.id]||""})),onTool:u=>s(u,t.querySelector(`[data-sve-css-tool="${u}"]`))})},Rt();const a=t.querySelector('[data-sve-css-sub="box"]');a&&!a._sveBound&&(a._sveBound=!0,ve(a,pr,{sides:eo.map(d=>({...d,icon:Ge[`box-${d.id}`]||""})),onSide:d=>{const u=Q(t)?.getAttribute("data-sve-css-sub"),f=a.querySelector(`[data-sve-css-box-side="${d}"]`),y=`${u}${d}`,b=O==="tw"?{}:ke();if(!(u!=="padding"&&u!=="margin"||!f)){if(O==="tw"){It(e,f,`${u}${Tn[d]??d}`);return}if(y in b){$(e.document),V([{property:y,value:null}]);return}Lo(e,f,y),U(e)}}}));const l=t.querySelector('[data-sve-css-sub="display"]');l&&!l._sveBound&&(l._sveBound=!0,ve(l,xr,{items:jt.map(d=>({...d,icon:Ge[d.id]||""})),extras:i,onTool:d=>s(d,t.querySelector(`[data-sve-css-tool="${d}"]`))})),e.document.addEventListener("mousedown",d=>{d.target.closest(`#${E}, [data-sve-css-tools], [data-sve-css-subrow], [data-sve-html-tools], [data-sve-css-add-class]`)||$(e.document)},!0)}function fa(e,t){const o=t.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,ve(o,nr,{tools:Dt.map(n=>({...n,icon:ai[n.id]||""})),onTool:n=>{const s=Dt.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){Gi(e,r);return}$(e.document),Jn(s.tag)}}}),pa(e,t),ma(e,t))}function pa(e,t){const o=t.querySelector("[data-sve-antlers-tools]");!o||o._sveBound||(o._sveBound=!0,ve(o,zo,{label:h(e,"code_dock_antlers"),groups:Hs.map(n=>({id:n.id,label:h(e,n.lang),items:Ds.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>ha(n)}))}function ha(e){const t=js(e),o=p.html;if(!t||!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.trim()?ue(s.text):St(o,s)||ue(s.text),{text:i,cursor:a}=tt(t.snippet);lt(Po(i,r),a),oe()}function ma(e,t){const o=t.querySelector("[data-sve-visual-edit-tools]");!o||o._sveBound||(o._sveBound=!0,ve(o,zo,{label:h(e,"code_dock_visual_edit"),groups:jr.map(n=>({id:n.id,label:h(e,n.lang),items:Zo.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>ga(n)}))}function va(e,t,o,n){if(Pr(o.inner,n.attr)){e.focus();return}const{text:s,cursor:r}=tt(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(t[i-1]);)i--;e.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),oe()}function ga(e){const t=qr(e),o=p.html;if(!t||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=Ue();if(s?.open){const f=Rr(n,s.open.from,s.open.to,Ye);if(f){t.attr?va(o,n,f,t):(o.dispatch({selection:{anchor:f.openIdx+2+Ye.length}}),o.focus());return}const y=s.open.from+1+s.name.length,b=t.standalone||`{{ ${Ye} ${t.attr} }}`,{text:A,cursor:q}=tt(b);o.dispatch({changes:{from:y,to:y,insert:` ${A}`},selection:{anchor:y+1+q}}),oe();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),a=i.text.trim()?ue(i.text):St(o,i)||ue(i.text),l=t.standalone||`{{ ${Ye} ${t.attr} }}`,{text:d,cursor:u}=tt(l);lt(Po(d,a),u),oe()}function ts(e){if(!xe||!C||String(C).startsWith("view:")){yo(e);return}const t=ms(xe,e.document);yo(e,t.length?{sectionUids:t}:void 0)}function ya(e,t,o){return He=e.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Bn(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:t,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{}})}).then(async n=>{if(n.status===423){T=!0,be=!0,$e(e),We(P,!0),W(e),F(e.document,h(e,"code_dock_locked"));return}if(!n.ok)throw new Error(String(n.status));C===t&&(P=o,F(e.document,h(e,"code_dock_saved")),de(e),e.setTimeout(()=>{const s=e.document.getElementById(c)?.querySelector("[data-sve-code-status]");s&&s.textContent===h(e,"code_dock_saved")&&(s.textContent="")},1800)),ts(e),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}).catch(()=>{F(e.document,h(e,"code_dock_error"))}).finally(()=>{He=null}),He}function ie(e){J&&(clearTimeout(J),J=null);const t=C,o=v,n=p.html;if(!n||n.state.readOnly||!t||!o)return;const s=co(),r=st!==null&&qo(o)&&os(s.html)===rt;uo(s,P)&&!(r&&it)||(r&&(s.tw=st,it=!1),F(e,h(o,"code_dock_saving")),ya(o,t,s))}function os(e){return Bs(e).sort().join(" ")}function xa(){st=null,rt="",it=!1}function ns(e,t){if(!e||!qo(e))return;const o=os(t);o===rt||Je||(Je=!0,Z(()=>import("./tw-compile-B9daJWrZ.js"),__vite__mapDeps([8,9]),import.meta.url).then(n=>n.compileTailwind(e,t)).then(n=>{Je=!1,st=n,rt=o,it=!0,ss(e,e.document)}).catch(n=>{Je=!1,console.error("[sve] tailwind compile",n)}))}function ss(e,t){J&&clearTimeout(J),J=e.setTimeout(()=>{J=null,ie(t)},Xr)}function ee(e){if(j)return;const t=co();if(uo(t,P)){de(e);return}if(de(e),ns(e,t.html),!lo(e)){F(e.document,h(e,"code_dock_unsaved"));return}F(e.document,h(e,"code_dock_saving")),ss(e,e.document)}let ge=null,Re=null;function ba(){return ge||(ge=Cs({Decoration:Qt,StateField:Gt,StateEffect:Zt,RangeSetBuilder:Jt,EditorView:ne})),ge}function ka(){return Re||(Re=Nr({Decoration:Qt,StateField:Gt,StateEffect:Zt,RangeSetBuilder:Jt,EditorView:ne})),Re}function _a(e,t,o){p[t]?.destroy();const n=Ht.of([{key:"Mod-s",run:()=>(ie(e.document),!0)}]);p[t]=new ne({state:nt.create({doc:"",extensions:[Jo(),Qo(),en(),sn(),ci(t),an(),rn({tooltipClass:()=>"sve-tw-complete"}),...t==="html"?[fn.data.of({autocomplete:$s(e)}),ws(un,e)]:[],...t==="html"?[...Ls(),Os()]:[],Ht.of([...tn,...t==="html"?[{key:"Tab",run:Is}]:[],on,...nn,...dn,...ln]),n,ne.lineWrapping,...t==="html"||t==="css"?ba().extensions:[],...t==="html"?ka().extensions:[],je[t].of(nt.readOnly.of(!!T)),qe[t].of(ne.editable.of(!T)),ne.updateListener.of(s=>{t==="html"&&s.docChanged&&!j&&(Ti(),Wt("dock:html-changed")),t==="css"&&s.docChanged&&!j&&Mi(),s.docChanged&&ee(e),t==="css"&&(s.docChanged||s.selectionSet)&&U(e),t==="html"&&(s.docChanged||s.selectionSet)&&($t(e),j||wt(e))}),...li()]}),parent:o})}function Sa(e){if(!e||e.querySelector(".cm-editor"))return;e.replaceChildren();const t=e.ownerDocument.createElement("span");t.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",e.appendChild(t)}let et=null;async function $a(e){const t=e.document;vi(t);let o=t.getElementById(c);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-subrow]")&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-7")){for(const s of R)p[s]?.destroy(),p[s]=null;o.remove(),o=null}if(!o){o=t.createElement("div"),o.id=c,o.setAttribute("data-sve-code-chrome","scope-7"),ve(o,er,{htmlLabel:h(e,"code_dock_html"),cssLabel:h(e,"code_dock_css"),jsLabel:h(e,"code_dock_js"),treeIcon:$n}),Pt(t,o),Co(o),Dn(o,Ln(e)),Si(e,o),wi(e,o),$i(e,o),ua(e,o),Qi(e,o),aa(e,o),sa(e,o),na(e,o),vs(e,o),fa(e,o),Eo(e,o),To(e,o),Ao(e,o),Mo(e,o);for(const n of R){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);Sa(s)}x.openHtmlTreePanel?.(e)}if(Pt(t,o),Co(o),Eo(e,o),To(e,o),Ao(e,o),Mo(e,o),bi(e),to(e),$e(e),W(e),Ne(e),de(e),po(e),ct(e),await Ur(),!p.html){for(const n of R){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),_a(e,n,s)}for(const n of["html","css"])p[n]&&ks(e,p[n],{onOpen:s=>Pn(e,s),emptyLabel:h(e,"code_dock_partials_empty"),sectionValues:()=>Ci(e),isLocked:()=>_e(),setHover:(s,r)=>ge?.setHover(s,r)});Wr(e,p.html,{onRename:n=>Li(e,n),isLocked:()=>_e(),setHover:(n,s)=>Re?.setHover(n,s),title:h(e,"code_dock_css_rename_class")})}return o}function rs(e){return et||(et=$a(e).finally(()=>{et=null})),et}async function Io(e,t){const o=await rs(e);C=t,T=!0,be=!0,P={html:"",css:"",js:""},ao(),$e(e),We(P,!0),Rn(e.document,t),F(e.document,h(e,"code_dock_missing")),W(e),Ne(e),de(e),ze(e,o)}async function Ct(e,t,o="replace"){o==="replace"?le=[]:o==="push"&&C&&C!==t&&le.push(C);const n=++Be;C=t,be=!1,ao(),F(e.document,h(e,"code_dock_loading"));const s=await rs(e);$e(e),W(e),Ne(e),de(e),po(e),ct(e),ze(e,s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(t)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async r=>{if(n!==Be)return;if(r.status===404){Io(e,t);return}if(!r.ok)throw new Error(String(r.status));const i=await r.json();n===Be&&(P={html:typeof i.html=="string"?i.html:"",css:typeof i.css=="string"?i.css:"",js:typeof i.js=="string"?i.js:""},C=t,T=!!i.locked,be=!0,xa(),$e(e),We(P,T),T||ns(e,P.html),Rn(e.document,i.path||t),F(e.document,T?h(e,"code_dock_locked"):""),W(e),Ne(e),de(e),ze(e,s))}).catch(()=>{n===Be&&(Io(e,t),F(e.document,h(e,"code_dock_error")))})}function is(){return C||""}function wa(e){return!!e?.getElementById(c)}function _e(){return T}function Ca(e,t){const o=typeof t?.html=="string"?t.html.trim():"",n=typeof t?.css=="string"?t.css.trim():"",s=typeof t?.js=="string"?t.js.trim():"";if(!o&&!n&&!s||!e?.document?.getElementById(c))return!1;let r=!1;return o&&(r=Aa("html",o)||r),n&&(r=Ho("css",n)||r),s&&(r=Ho("js",s)||r),r&&ee(e),r}function Aa(e,t){const o=p[e];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,l=`${s===`
`?"":`
`}${t}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:l},selection:{anchor:n.from+l.length}}),!0}function Ho(e,t){const o=p[e];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${t}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function Ea(e){if(ts(e),!C||!e.document.getElementById(c))return;const t=C;C=null,Ct(e,t,"keep")}function Ta(e){Be+=1,ie(e),xe=null,C=null,le=[],P={html:"",css:"",js:""},T=!1,be=!1,N=null,me=null,ao(),v=e?.defaultView||v,$(e),jo(e),se(e),e?.getElementById(K)?.remove();for(const o of R)p[o]?.destroy(),p[o]=null;e?.getElementById(c)?.remove(),xi(),e&&oo(e,0);const t=e?.defaultView||v;t?.document.getElementById(x.HTML_TREE_PANEL_ID)&&x.closeHtmlTreePanel?.(t)}function Ma(e){if(Pe)return;const t=e.document.getElementById(c);t&&(to(e),ze(e,t))}function Ba(e,t,o){if(o){const r=xo(o,t)||xo(o,e.document)||o;return String(typeof x.setTypeForUid=="function"&&(x.setTypeForUid(r,t)||x.setTypeForUid(r,e.document))||"").trim()}const n=typeof x.sectionField=="function"?x.sectionField(e):"page_sections",s=typeof x.activeContainers=="function"?x.activeContainers(e.document):[];for(const r of s){const a=(x.unwrapRef?.(r.values)||r.values)?.[n];if(Array.isArray(a))for(const l of a){const d=typeof l?.type=="string"?l.type.trim():"";if(d)return d}}return""}function La(e){if((e.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=e.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(e.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof x.activeContainers=="function"?x.activeContainers(e.document):[];for(const r of s){const i=x.unwrapRef?.(r.values)||r.values,a=typeof i?.view=="string"?i.view.trim():"";if(!a||a.includes(".."))continue;const l=a.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(l)return`view:${l}`}return""}function Oa(e,t){const o=x.chromeInlineKind||x.activeChromeKind;if(o!=="header"&&o!=="footer"||!x.chromeHost?.(t)&&!x.chromeEditorOpen?.(t))return"";const s=(x.unwrapRef?.(x.chromeContainer?.()?.values)||{})[o==="footer"?"footer_style":"header_style"]||"style_1";return`${o}/${s}`}function Ia(e){const t=x.globalSectionHost?.(e)||e.getElementById("__sve-global-section-host");return t&&t.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function Ha(e,t,o){if(Pe)return;if(!e||!t||ui(t)||!ps(e)||!hs(e)){t&&Ta(t);return}const n=Oa(e,t)||Ia(t)||Ba(e,t,o)||La(e)||(o?"":C),s=!!(o&&o!==xe);if(v=e,o&&(xe=o),!!n&&!(n===C&&t.getElementById(c))){if(le.length&&C&&C!==n){const r=le[0];if(n===r&&!s)return;le=[]}ie(t),Ct(e,n,"replace")}}bs("tw:changed",()=>{v&&O==="tw"&&U(v)});z("dock:is-open",e=>wa(e));z("dock:is-locked",()=>_e());z("dock:html",()=>vt());z("dock:reveal-html",({from:e,to:t}={})=>{const o=p.html;if(!o||e==null)return;L=Ve(v),mt(),pe();const n=w.length,s=Math.max(0,Math.min(e,n)),r=Math.max(s,Math.min(t??e,n));if(g=r>s?{from:s,to:r}:null,L&&g){ro(),W(v);return}if(M){io(),W(v);return}o.dispatch({selection:{anchor:s,head:r},scrollIntoView:!0}),o.focus()});z("dock:insert-snippet",({win:e,parts:t})=>Ca(e,t));z("dock:refresh",e=>Ea(e));z("dock:tw-follow",()=>{v&&wt(v)});z("dock:css",()=>(pe(),k));z("dock:set-css",e=>typeof e!="string"||_e()||!p.css||!v?!1:(pe(),k=e,yt("css",Un()),ee(v),!0));z("dock:current-type",()=>is());z("dock:current-uid",()=>xe);z("dock:open-template",e=>typeof e!="string"||!e||!v?!1:(Pn(v,e),!0));z("dock:set-html",e=>{if(typeof e!="string"||_e())return!1;const t=p.html;if(!t||!v)return!1;if(w=e,M)return xt(Fn()),ee(v),Wt("dock:html-changed"),!0;const o=t.state.doc.toString();return o!==e&&t.dispatch({changes:{from:0,to:o.length,insert:e}}),!0});x.syncCodeDock=Ha;export{Ja as ARMED_KEY,Ta as closeCodeDock,Xa as closeCodeDockPopups,Ya as codeDockStyleMode,is as currentTemplateType,Ca as insertAiSnippet,hs as isCodeDockArmed,_e as isCodeDockLocked,wa as isCodeDockOpen,Ea as refreshCodeDockFromDisk,Ma as relayoutCodeDock,xa as resetTailwindCompile,Qa as setCodeDockArmed,Ha as syncCodeDock,ps as templateDockAllowed};
