const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-Dpuj8sxX.js","./index-B5fiB6ig.js","./index-eMi007Cw.js","./index-zsjA895l.js","./index-BsAZfAgM.js","./index-D2YMCfE7.js","./html-tag-sync-BlP2Mk13.js","./index-BatCsQTe.js","./tw-compile-B9daJWrZ.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{o as _,c as S,a as m,t as X,b as vo,F as I,e as re,f as j,I as us,d as Lt,n as fs,M as go,N as ps,a2 as hs,K as ms,w as yo,L as vs,P as xo,x as gs,s as x,a3 as ys,a4 as xs,a5 as bo,a6 as bs,a7 as ko,J as Z,a8 as we,a9 as Wt,i as ve,aa as ks,ab as _o,A as fe,l as Ce,ac as _s,Q as Ss,a1 as $s,T as ws,U as z}from"./addon-qlledA5B.js";import{ad as al,ae as ll}from"./addon-qlledA5B.js";import{b as Ut,d as Ro,t as zo,e as No,g as Cs,P as Ke,s as As,h as Es,j as Ts,k as Ms,c as Ot,l as Bs,r as Ls,m as Xe,n as It,f as Os,o as Is,q as Hs,u as Tt}from"./tw-overlay-B5XNofNv.js";import{t as js}from"./tw-candidates-wYTeDvRv.js";import{h as Ds,a as Ps,e as qs,A as Rs,b as zs,c as Ns,d as tt,i as Fo}from"./html-tag-sync-BlP2Mk13.js";import"./html-pick-align-Cjtvi4Nz.js";import"./index-Dpuj8sxX.js";import"./index-B5fiB6ig.js";import"./index-BatCsQTe.js";import"./index-BsAZfAgM.js";import"./index-zsjA895l.js";import"./index-D2YMCfE7.js";import"./index-eMi007Cw.js";const Fs={class:"sve-code-dock"},Vs={"data-sve-code-bar":""},Ws={type:"button","data-sve-code-pane-btn":"html"},Us={type:"button","data-sve-code-pane-btn":"css"},Ks={type:"button","data-sve-code-pane-btn":"js"},Xs={type:"button","data-sve-html-scope":"","aria-pressed":"true"},Ys=["innerHTML"],Gs={"data-sve-code-panes":""},Zs={"data-sve-code-pane":"html"},Js={"data-sve-code-pane-label":""},Qs={"data-sve-code-pane":"css"},er={"data-sve-css-chrome":"subrow-2"},tr={"data-sve-code-pane-label":""},or={"data-sve-css-label":""},nr={"data-sve-code-pane":"js"},sr={"data-sve-code-pane-label":""},rr={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},treeIcon:{type:String,required:!0}},setup(e){return(t,o)=>(_(),S("div",Fs,[o[14]||(o[14]=m("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),m("div",Vs,[m("button",Ws,X(e.htmlLabel),1),m("button",Us,X(e.cssLabel),1),m("button",Ks,X(e.jsLabel),1),o[0]||(o[0]=vo('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-code-strip></button><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button>',6)),m("button",Xs,[m("span",{innerHTML:e.treeIcon},null,8,Ys)]),o[1]||(o[1]=m("button",{type:"button","data-sve-code-autosave":"","aria-pressed":"true"},null,-1)),o[2]||(o[2]=m("button",{type:"button","data-sve-code-save":"",hidden:""},null,-1)),o[3]||(o[3]=m("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[15]||(o[15]=m("div",{"data-sve-code-lock-banner":""},null,-1)),m("div",Gs,[m("div",Zs,[m("div",Js,[m("span",null,X(e.htmlLabel),1),o[4]||(o[4]=m("div",{"data-sve-html-tools":""},null,-1)),o[5]||(o[5]=m("div",{"data-sve-visual-edit-tools":""},null,-1)),o[6]||(o[6]=m("div",{"data-sve-antlers-tools":""},null,-1))]),o[7]||(o[7]=m("div",{"data-sve-code-host":""},null,-1))]),o[12]||(o[12]=m("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),m("div",Qs,[m("div",er,[m("div",tr,[m("span",or,X(e.cssLabel),1),o[8]||(o[8]=vo('<button type="button" data-sve-css-add-class></button><div data-sve-css-tools></div><div data-sve-css-subrow><div data-sve-css-sub="box"></div><div data-sve-css-sub="display"></div></div>',3))])]),o[9]||(o[9]=m("div",{"data-sve-code-host":""},null,-1)),o[10]||(o[10]=m("div",{"data-sve-tw-host":""},null,-1))]),o[13]||(o[13]=m("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),m("div",nr,[m("div",sr,[m("span",null,X(e.jsLabel),1)]),o[11]||(o[11]=m("div",{"data-sve-code-host":""},null,-1))])])]))}},ir=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],ar=["innerHTML"],lr={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>(_(!0),S(I,null,re(e.tools,n=>(_(),S("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:j(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:j(s=>e.onTool(n.id),["prevent"])},[n.letter?(_(),S(I,{key:0},[us(X(n.letter),1)],64)):(_(),S("span",{key:1,innerHTML:n.icon},null,8,ar))],40,ir))),128))}},cr=["aria-label"],dr={value:""},ur=["label"],fr=["value"],Vo={__name:"CodeDockAntlersSelect",props:{label:{type:String,required:!0},groups:{type:Array,required:!0},onPick:{type:Function,required:!0}},setup(e){const t=e;function o(n){const s=n.target.value;n.target.value="",s&&t.onPick(s)}return(n,s)=>(_(),S("select",{"data-sve-antlers-select":"","aria-label":e.label,onChange:o},[m("option",dr,X(e.label),1),(_(!0),S(I,null,re(e.groups,r=>(_(),S("optgroup",{key:r.id,label:r.label},[(_(!0),S(I,null,re(r.items,i=>(_(),S("option",{key:i.id,value:i.id},X(i.label),9,fr))),128))],8,ur))),128))],40,cr))}},pr=["data-sve-css-item"],hr=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],mr={__name:"CodeDockCssTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>(_(!0),S(I,null,re(e.tools,n=>(_(),S("li",{key:n.id,"data-sve-css-item":n.id},[m("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:j(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:j(s=>e.onTool(n.id),["prevent"])},null,40,hr)],8,pr))),128))}},vr={key:0,"data-sve-css-sep":"","aria-hidden":"true"},gr=["data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick"],yr={__name:"CodeDockCssBoxRow",props:{sides:{type:Array,required:!0},onSide:{type:Function,required:!0}},setup(e){return(t,o)=>(_(!0),S(I,null,re(e.sides,n=>(_(),S(I,{key:n.id},[n.sep?(_(),S("span",vr)):Lt("",!0),m("button",{type:"button","data-sve-css-box-side":n.suffix,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:j(s=>e.onSide(n.suffix),["prevent","stop"])},null,8,gr)],64))),128))}},xr={key:0,"data-sve-css-sep":"","aria-hidden":"true"},br=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],kr={"data-sve-css-flex-extras":""},_r={key:0,"data-sve-css-sep":"","aria-hidden":"true"},Sr=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],$r={__name:"CodeDockCssDisplayRow",props:{items:{type:Array,required:!0},extras:{type:Array,default:()=>[]},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>(_(),S(I,null,[(_(!0),S(I,null,re(e.items,n=>(_(),S(I,{key:n.id},[n.sep?(_(),S("span",xr)):Lt("",!0),m("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:j(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:j(s=>e.onTool(n.id),["prevent"])},null,40,br)],64))),128)),m("div",kr,[(_(!0),S(I,null,re(e.extras,n=>(_(),S(I,{key:n.id},[n.sep?(_(),S("span",_r)):Lt("",!0),m("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:j(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:j(s=>e.onTool(n.id),["prevent"])},null,40,Sr)],64))),128))])],64))}},wr={key:0,"data-sve-css-swatches":""},Cr=["data-sve-css-token","title","data-active","onClick"],Ar=["data-sve-css-token","data-active","onClick"],dt={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(e){return(t,o)=>e.kind==="colors"?(_(),S("div",wr,[m("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=j((...n)=>e.onClear&&e.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[m("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[m("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(_(!0),S(I,null,re(e.swatches,n=>(_(),S("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:fs({background:n.hex||"transparent"}),onClick:j(s=>e.onPick(n.name),["prevent","stop"])},null,12,Cr))),128))])):(_(!0),S(I,{key:1},re(e.choices,n=>(_(),S("button",{key:n.value,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:j(s=>e.onPick(n.value),["prevent","stop"])},X(n.label),9,Ar))),128))}},Er={"data-sve-css-add-label":""},Tr=["placeholder","onKeydown"],Wo={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0}},setup(e){const t=e,o=go(t.initial||""),n=go(null);ps(()=>hs(()=>{n.value?.focus(),n.value?.select()}));function s(){const r=o.value.trim();if(!r){n.value?.focus();return}t.onAdd(r)}return(r,i)=>(_(),S(I,null,[m("label",Er,X(e.label),1),ms(m("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":i[0]||(i[0]=a=>o.value=a),type:"text",placeholder:e.placeholder,onKeydown:[yo(j(s,["prevent"]),["enter"]),i[1]||(i[1]=yo(j(()=>{},["stop"]),["escape"]))]},null,40,Tr),[[vs,o.value]])],64))}},So="view:",$o="partials/";function Mr(e){const t=String(e||"");if(!t.startsWith(So))return null;const o=t.slice(So.length);return o.startsWith($o)?o.slice($o.length):o}function Br(e){const t=String(e||"").match(/\sclass\s*=\s*(["'])([\s\S]*?)\1/i);return t?t[2].replace(/\{\{[\s\S]*?\}\}/g,"\0").split(/[\s[\]]+/).filter(o=>o&&!o.includes("\0")&&/^[A-Za-z_][\w:./%!#-]*$/.test(o)):[]}const Lr=e=>globalThis.CSS?.escape?globalThis.CSS.escape(e):e.replace(/([^\w-])/g,"\\$1");function Or(e){const t=Ut(e)[0];if(!t)return null;const o=Br(String(e).slice(t.from,t.openTo));return!o.length&&!/^(header|footer|main|nav|aside|figure|form|table)$/.test(t.tag)?null:t.tag+o.map(n=>`.${Lr(n)}`).join("")}function Uo(e){const t=Mr(xo("dock:current-type")),o=t?xo("dock:html"):"",n=t&&typeof o=="string"?Or(o):null;gs({source:"statamic-visual-editor",type:"sve-component-focus",on:!!n,name:t?String(t).split("/").pop():"",selector:n||""},e)}const Ko=/^\.[a-zA-Z_][\w-]*$/;function Xo(e){const t=String(e||"").match(/\[\s*([\s\S]*?)\s*\]/);return t?t[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).filter(o=>/^[a-zA-Z_][\w-]*$/.test(o)):[]}function Ir(e){const t=String(e||"").match(/\sclass\s*=\s*(["'])([^"']*)\1/i);return t?Xo(t[2]):[]}function ut(e){const t=String(e||""),o=[],n=/\sclass\s*=\s*(["'])/gi;let s;for(;s=n.exec(t);){const r=s[1],i=s.index+s[0].length,a=t.indexOf(r,i);if(a===-1)break;const d=t.slice(i,a).match(/\[([\s\S]*?)\]/);if(d){const u=d[1],f=i+d.index+1,y=u.replace(/\{\{[\s\S]*?\}\}/g,P=>" ".repeat(P.length)),b=/[a-zA-Z_][\w-]*/g;let A;for(;A=b.exec(y);)o.push({name:A[0],from:f+A.index,to:f+A.index+A[0].length})}n.lastIndex=a+1}return o}function wo(e,t){return ut(e).find(o=>t>=o.from&&t<=o.to)||null}function Co(e,t){const o=String(e||""),n=ut(o);let s=o;for(let r=n.length-1;r>=0;r-=1){const i=n[r],a=t(i.name);if(a!==i.name){if(!a){let l=i.from,d=i.to;s[d]===" "?d+=1:l>0&&s[l-1]===" "&&(l-=1),s=s.slice(0,l)+s.slice(d);continue}s=s.slice(0,i.from)+a+s.slice(i.to)}}return s}function Yo(e){const t=[],o=/(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;let n;for(;n=o.exec(String(e||""));)t.push(n[2]);return t}function Go(e,t){const o=[],n=[],s=[];let r=0,i=0;for(;r<e.length&&i<t.length;){if(e[r]===t[i]){r+=1,i+=1;continue}const a=t.indexOf(e[r],i),l=e.indexOf(t[i],r);a===-1&&l===-1?(o.push({from:e[r],to:t[i]}),r+=1,i+=1):a===-1?(s.push(e[r]),r+=1):l===-1||a<=l?(n.push(t[i]),i+=1):(s.push(e[r]),r+=1)}for(;r<e.length;)s.push(e[r]),r+=1;for(;i<t.length;)n.push(t[i]),i+=1;return{renamed:o,added:n,removed:s}}function ye(e){let t=String(e||"").trim().replace(/^\.+/,"").replace(/\s+/g,"-").replace(/[^a-zA-Z0-9_-]/g,"");return/^[a-zA-Z_]/.test(t)||(t=t.replace(/^[^a-zA-Z_]+/,"")),Ko.test(`.${t}`)?t:""}function Hr(e,t){const o=String(e||""),n=ye(t);if(!o||!n)return o;const s=o.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(s){const r=s[1];let i=s[2];const a=[...i.matchAll(/\[([\s\S]*?)\]/g)];if(a.length){const l=a.map(b=>b[1].trim()).filter(Boolean).join(" "),u=Xo(`[ ${l} ]`).includes(n)?l:`${l} ${n}`.trim(),f=i.indexOf("["),y=i.lastIndexOf("]");i=`${i.slice(0,f)}[ ${u} ]${i.slice(y+1)}`.replace(/\s+/g," ").trim()}else i=`[ ${n} ] ${i}`.replace(/\s+/g," ").trim();return o.slice(0,s.index)+` class=${r}${i}${r}`+o.slice(s.index+s[0].length)}return/\/\s*>$/.test(o)?o.replace(/(\s*)(\/\s*>)$/,` class="[ ${n} ]"$1$2`):o.replace(/(\s*)>$/,` class="[ ${n} ]"$1>`)}function jr(e,t){const o=String(e).indexOf(">",t.from);return o===-1?"":e.slice(t.from,o+1)}function Zo(e,t){const o=[];for(const n of t){const s=Ir(jr(e,n)),r=Zo(e,n.children||[]);if(s.length){o.push({className:s[0],children:r});for(const i of s.slice(1))o.push({className:i,children:[]})}else o.push(...r)}return o}function ft(e){return Zo(e,Ut(e))}function ot(e){return String(e).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Kt(e,t){if(e.startsWith("/*",t)){const o=e.indexOf("*/",t+2);return o===-1?e.length:o+2}return t}function Xt(e,t){let o=0;for(let n=t;n<e.length;n+=1){if(e.startsWith("/*",n)){n=Kt(e,n)-1;continue}if(e[n]==="{")o+=1;else if(e[n]==="}"&&(o-=1,o===0))return n}return-1}function Y(e,t){const o=String(e||""),n=new RegExp(`(^|[^\\w-])\\.${ot(t)}\\s*\\{`,"g");let s;for(;s=n.exec(o);){const r=s.index+s[1].length,i=o.indexOf("{",r);if(i===-1)continue;const a=Xt(o,i);if(a!==-1)return{from:r,brace:i,close:a,to:a+1,name:t}}return null}function Dr(e){const t=String(e||""),o=[],n={},s=[];let r=0,i="";const a=()=>{const l=i.trim();l&&o.push(l),i=""};for(;r<t.length;){if(t.startsWith("/*",r)){const l=Kt(t,r);i+=t.slice(r,l),r=l;continue}if(t[r]==="{"){const l=i.trim(),d=Xt(t,r);if(d===-1)break;const u=t.slice(r+1,d);i="",Ko.test(l)?n[l.slice(1)]=u:l&&s.push(`${l} {${u}}`),r=d+1;continue}i+=t[r],r+=1}return a(),{decls:o.join(`
`),classes:n,other:s}}function Ao(e,t){const o="    ".repeat(t);return String(e||"").split(`
`).map(n=>n.trim()?o+n.trim():"").filter((n,s,r)=>n||s>0&&s<r.length-1).join(`
`)}function Pr(e,t){const o=Y(e,t);return o?String(e).slice(o.brace+1,o.close):""}function Jo(e,t,o){const n=Dr(Pr(t,e.className)),s="    ".repeat(o),r=[];n.decls&&r.push(Ao(n.decls.replace(/;+\s*$/,";"),o+1));for(const a of n.other)r.push(Ao(a,o+1));for(const a of e.children)r.push(Jo(a,t,o+1));const i=r.filter(Boolean).join(`
`);return i?`${s}.${e.className} {
${i}
${s}}`:`${s}.${e.className} {
${s}}`}function Yt(e,t){return t?.length?t.map(o=>Jo(o,e,0)).join(`

`)+`
`:""}function Qo(e){const t=String(e||"").match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);return t?t[1]:""}function qr(e){const t=[],o=/\.([a-zA-Z_][\w-]*)\s*\{/g;let n,s=!0;for(;n=o.exec(String(e||""));){if(s){s=!1;continue}t.push(n[1])}return t}function Rr(e,t){const o=String(e).lastIndexOf(`
`,t-1)+1,n=e.slice(o,t);return/^\s*$/.test(n)?n:""}function zr(e,t){return t?e.split(`
`).map((o,n)=>n===0||!o?o:t+o).join(`
`):e}function Nr(e,t){let o=0;for(let n=0;n<t.from;n+=1){if(e.startsWith("/*",n)){n=Kt(e,n)-1;continue}e[n]==="{"?o+=1:e[n]==="}"&&(o-=1)}return o===0}function Gt(e,t,o){const n=Qo(t)||o;if(!n)return String(e||"");let s=String(t||"").trim();s?new RegExp(`^\\.${ot(n)}\\s*\\{`).test(s)||(s=`.${n} {
${s}
}`):s=`.${n} {
}`;let r=String(e||"");const i=Y(r,n),a=qr(s);if(i){const d=Rr(r,i.from);r=r.slice(0,i.from)+zr(s,d)+r.slice(i.to)}else r=`${r.trimEnd()}${r.trim()?`
`:""}${s}
`;const l=Y(r,n);if(!l)return r;for(const d of[...new Set(a)].reverse()){const u=new RegExp(`(^|[^\\w-])\\.${ot(d)}\\s*\\{`,"g"),f=[];let y;for(;y=u.exec(r);){const b=y.index+y[1].length,A=r.indexOf("{",b),P=Xt(r,A);P!==-1&&f.push({from:b,to:P+1})}for(const b of f.reverse()){if(b.from>=l.from&&b.to<=l.to||!Nr(r,b))continue;let A=b.from;const P=r.lastIndexOf(`
`,A-1)+1;/^\s*$/.test(r.slice(P,A))&&(A=P);let Te=b.to;r[Te]===`
`&&(Te+=1),r=r.slice(0,A)+r.slice(Te)}}return r}function Mt(e,t){const o=String(e||"");return`${o.trimEnd()}${o.trim()?`
`:""}.${t} {
}
`}function Fr(e,t,o){const n=ye(o);return!t||!n||t===n?String(e||""):Y(e,n)?en(e,t):String(e||"").replace(new RegExp(`(^|[^\\w-])\\.${ot(t)}(\\s*\\{)`,"g"),`$1.${n}$2`)}function en(e,t){let o=String(e||"");for(;;){const n=Y(o,t);if(!n)break;let s=n.from;const r=o.lastIndexOf(`
`,s-1)+1;/^\s*$/.test(o.slice(r,s))&&(s=r);let i=n.to;o[i]===`
`&&(i+=1),o=o.slice(0,s)+o.slice(i)}return o}function Vr(e,t,o){const n=Array.isArray(t)?t:[],s=Array.isArray(o)?o:[],{renamed:r,added:i}=Go(n,s),a=new Set(s);let l=String(e||"");for(const d of r){const u=ye(d.to);if(u){if(a.has(d.from)){Y(l,u)||(l=Mt(l,u));continue}Y(l,d.from)?l=Fr(l,d.from,u):Y(l,u)||(l=Mt(l,u))}}for(const d of i){const u=ye(d);!u||Y(l,u)||(l=Mt(l,u))}return l}function Wr(e,t,o){const n=new Set(Array.isArray(t)?t:[]),s=new Set(Array.isArray(o)?o:[]);let r=String(e||"");for(const i of s)n.has(i)||(r=en(r,i));return r}const Ye="visual_edit",Ur=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],tn=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function Kr(e){return tn.find(t=>t.id===e)||null}function Xr(e,t,o,n){let s=t;for(;s<o;){const r=e.indexOf("{{",s);if(r===-1||r>=o)return null;const i=e.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const a=e.slice(r+2,i);if((a.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:a};s=i+2}return null}function Yr(e,t){const o=String(t).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(e)}const te="__sve-css-rename-chip",Gr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function Zr(e){const t=e.Decoration.mark({class:"sve-cm-css-token"}),o=e.StateEffect.define();return{extensions:[e.StateField.define({create(){return e.Decoration.none},update(s,r){let i;for(const l of r.effects)l.is(o)&&(i=l.value);if(i===void 0)return r.docChanged?e.Decoration.none:s;if(!i)return e.Decoration.none;const a=new e.RangeSetBuilder;return a.add(i.from,i.to,t),a.finish()},provide:s=>e.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function se(e){e?.getElementById(te)?.remove()}function Jr(e,t,o,n){t.style.left=`${Math.max(6,Math.min(o,e.innerWidth-28))}px`,t.style.top=`${Math.max(6,n)}px`}function Qr(e,t,o,{onRename:n,title:s}){const r=e.document,i=t.coordsAtPos(o.to);if(!i)return;se(r);const a=r.createElement("button");a.id=te,a.type="button",a.innerHTML=Gr,a.title=s,a.setAttribute("aria-label",s),a.addEventListener("mousedown",l=>{l.preventDefault(),l.stopPropagation(),se(r),n?.(o)}),a.addEventListener("mouseleave",()=>{e.setTimeout(()=>{t.dom.matches(":hover")||a.matches(":hover")||se(r)},120)}),r.body.appendChild(a),Jr(e,a,i.right+2,i.top-1)}function ei(e,t,{onRename:o,isLocked:n,setHover:s,title:r}){if(!t?.dom||t.dom._sveClassTokenBound)return;t.dom._sveClassTokenBound=!0;let i=null,a="";const l=()=>!!n?.(),d=()=>{e.clearTimeout(i),i=null,a="",s?.(t,null),se(e.document)},u=f=>{if(l()){d();return}d(),o?.(f)};t.dom.addEventListener("mousemove",f=>{if(l()){d();return}if(f.target?.closest?.(`#${te}`))return;const y=t.posAtCoords({x:f.clientX,y:f.clientY});if(y==null)return;const b=wo(t.state.doc.toString(),y);if(!b){e.clearTimeout(i),i=null,a="",s?.(t,null);return}const A=`${b.from}:${b.to}:${b.name}`;s?.(t,{from:b.from,to:b.to}),!(a===A&&(i||e.document.getElementById(te)))&&(e.clearTimeout(i),a=A,i=e.setTimeout(()=>{i=null,Qr(e,t,b,{onRename:u,title:r||"Rename class"})},160))}),t.dom.addEventListener("mouseleave",f=>{f.relatedTarget?.closest?.(`#${te}`)||e.setTimeout(()=>{e.document.getElementById(te)?.matches(":hover")||d()},160)}),t.dom.addEventListener("dblclick",f=>{if(l())return;const y=t.posAtCoords({x:f.clientX,y:f.clientY});if(y==null)return;const b=wo(t.state.doc.toString(),y);b&&(f.preventDefault(),f.stopPropagation(),u(b))},!0),t.scrollDOM?.addEventListener("scroll",d),e.document._sveClassTokenDismiss||(e.document._sveClassTokenDismiss=!0,e.document.addEventListener("mousedown",f=>{f.target.closest(`#${te}`)||se(e.document)}))}let ne,Ht,on,nn,sn,he,nt,Zt,Jt,Qt,eo,rn,an,ln,cn,dn,un,fn,pn,hn,mn,vn,gn,yn,xn,bn,kn,B,Me=null;function ti(){return Me||(Me=Promise.all([Z(()=>import("./index-Dpuj8sxX.js").then(e=>e.i),__vite__mapDeps([0,1]),import.meta.url),Z(()=>import("./index-B5fiB6ig.js"),[],import.meta.url),Z(()=>import("./index-eMi007Cw.js"),__vite__mapDeps([2,1,0,3,4]),import.meta.url),Z(()=>import("./index-D2YMCfE7.js"),__vite__mapDeps([5,1,0,3,4]),import.meta.url),Z(()=>import("./html-tag-sync-BlP2Mk13.js").then(e=>e.g),__vite__mapDeps([6,0,1,7,4,3,5,2]),import.meta.url),Z(()=>import("./index-BatCsQTe.js").then(e=>e.i),__vite__mapDeps([7,4,3,1,0]),import.meta.url),Z(()=>import("./html-tag-sync-BlP2Mk13.js").then(e=>e.f),__vite__mapDeps([6,0,1,7,4,3,5,2]),import.meta.url),Z(()=>import("./index-zsjA895l.js"),__vite__mapDeps([3,4,1,0]),import.meta.url),Z(()=>import("./index-BsAZfAgM.js").then(e=>e.i),[],import.meta.url)]).then(([e,t,o,n,s,r,i,a,l])=>{ne=e.EditorView,Ht=e.keymap,on=e.lineNumbers,nn=e.highlightActiveLine,sn=e.highlightActiveLineGutter,he=t.Compartment,nt=t.EditorState,Zt=t.StateField,Jt=t.StateEffect,Qt=t.RangeSetBuilder,eo=e.Decoration,rn=o.defaultKeymap,an=o.indentWithTab,ln=o.historyKeymap,cn=o.history,dn=n.autocompletion,un=n.closeBrackets,fn=n.closeBracketsKeymap,pn=n.closeCompletion,hn=n.completionKeymap,mn=e.hoverTooltip,vn=s.htmlLanguage,gn=s.html,yn=r.css,xn=i.javascript,bn=a.HighlightStyle,kn=a.syntaxHighlighting,B=l.tags,De.html=new he,De.css=new he,De.js=new he,Pe.html=new he,Pe.css=new he,Pe.js=new he}).catch(e=>{throw Me=null,e}),Me)}const c="__sve-code-dock",Eo="__sve-code-dock-style",K="__sve-code-dock-unlock",_n="sve-code-dock-height",Sn="sve-code-dock-panes",$n="sve-code-dock-widths",pt="sve-html-scope-v2",wn="sve-code-dock-autosave",Cn="sve-code-dock-style-mode",oi=280,An=120,Bt=140,ni=250,q=["html","css","js"],si='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',ri='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',ii='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',En='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',ai='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',li='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',ci='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',E="__sve-css-menu",Tn=["h1","h2","h3","h4","h5","h6"],jt=[{id:"heading",title:"heading",menu:"heading",letter:"H"},{id:"p",title:"paragraph",tag:"p",letter:"P"},{id:"div",title:"div",tag:"div"},{id:"section",title:"section",tag:"section"},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"}],di=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],to=[{id:"all",suffix:"",title:"All sides"},{id:"block",suffix:"-block",title:"Top and bottom",sep:!0},{id:"block-start",suffix:"-block-start",title:"Top"},{id:"block-end",suffix:"-block-end",title:"Bottom"},{id:"inline",suffix:"-inline",title:"Left and right",sep:!0},{id:"inline-start",suffix:"-inline-start",title:"Left"},{id:"inline-end",suffix:"-inline-end",title:"Right"}],Mn={display:"display",absolute:"position",color:"color",bg:"background-color",padding:"padding",margin:"margin","tw-text":"font-size","tw-leading":"line-height","tw-font":"font-family","tw-radius":"border-radius","tw-gap":"gap","tw-align":"text-align","tw-w":"width","tw-h":"height","tw-maxw":"max-width","tw-overflow":"overflow","tw-border":"border-color"},Bn={"display-flex":"flex","flex-row":"flex-row","flex-col":"flex-col","justify-start":"justify-start","justify-center":"justify-center","justify-end":"justify-end","justify-between":"justify-between","justify-around":"justify-around","align-start":"items-start","align-center":"items-center","align-end":"items-end","align-stretch":"items-stretch"},Ln=[{id:"tw-text",title:"Font size"},{id:"tw-leading",title:"Line height"},{id:"tw-font",title:"Font family"},{id:"tw-align",title:"Text align"},{id:"tw-border",title:"Border color"},{id:"tw-radius",title:"Radius"},{id:"tw-gap",title:"Gap"},{id:"tw-w",title:"Width"},{id:"tw-h",title:"Height"},{id:"tw-maxw",title:"Max width"},{id:"tw-overflow",title:"Overflow"}],ui={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>'},On={"":"","-block":"-block","-inline":"-inline","-block-start":"-top","-block-end":"-bottom","-inline-start":"-left","-inline-end":"-right"},fi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="10" width="18" height="11" rx="2"/><rect x="6" y="3" width="9" height="4" rx="1.4" fill="currentColor" stroke="none"/></svg>',pi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',hi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',mi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',In=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],Ie=[{id:"display",title:"Display",menu:"display"},{id:"absolute",title:"Position",insert:"position: absolute;"},{id:"color",title:"Text color",property:"color",menu:"colors"},{id:"bg",title:"Background color",property:"background-color",menu:"colors"},{id:"padding",title:"Padding",property:"padding",menu:"box"},{id:"margin",title:"Margin",property:"margin",menu:"box"}],Dt=[{id:"display-flex",title:"Flex",display:"flex"},{id:"flex-row",title:"Direction: row",flexDir:"row",sep:!0},{id:"flex-col",title:"Direction: column",flexDir:"column"}],Pt=[{id:"justify-start",title:"Justify: start",property:"justify-content",value:"flex-start"},{id:"justify-center",title:"Justify: center",property:"justify-content",value:"center"},{id:"justify-end",title:"Justify: end",property:"justify-content",value:"flex-end"},{id:"justify-between",title:"Justify: between",property:"justify-content",value:"space-between"},{id:"justify-around",title:"Justify: around",property:"justify-content",value:"space-around"},{id:"align-start",title:"Align: start",property:"align-items",value:"flex-start",group:"align"},{id:"align-center",title:"Align: center",property:"align-items",value:"center",group:"align"},{id:"align-end",title:"Align: end",property:"align-items",value:"flex-end",group:"align"},{id:"align-stretch",title:"Align: stretch",property:"align-items",value:"stretch",group:"align"}],Ge={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>'},vi={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>'};let Ze=null,xe=null,C=null,le=[],R={html:"",css:"",js:""},T=!1,be=!1,v=null,Be=0,J=null,N=null,me=null,He=null,Re=!1,D=!1,L=!0,M=!1,O="css",qt=null,st=null,rt="",Je=!1,it=!1,g=null,w="",k="",G="full",ce="",ae=null,je=null,Le=null,Oe=null,To=!1;const p={html:null,css:null,js:null},De={html:null,css:null,js:null},Pe={html:null,css:null,js:null};function h(e,t,o={}){let n=e.Statamic?.$config?.get?.("sveStrings")?.[t]??t;for(const[s,r]of Object.entries(o))n=String(n).replaceAll(`:${s}`,r);return n}function Hn(e){return e.document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||e.Statamic?.$config?.get?.("csrfToken")||e.Statamic?.$config?.get?.("csrf_token")||""}function gi(){return[ne.theme({"&":{height:"auto",backgroundColor:"#1E1E21",color:"#d4d4d4"},".cm-content":{caretColor:"#aeafad",padding:"12px 0",fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:"13px",lineHeight:"1.55"},".cm-cursor":{borderLeftColor:"#aeafad"},".cm-activeLine":{backgroundColor:"#ffffff0d"},".cm-activeLineGutter":{backgroundColor:"#ffffff0d"},".cm-gutters":{backgroundColor:"#1E1E21",color:"#858585",border:"none",borderRight:"1px solid #3c3c3c",fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:"13px",lineHeight:"1.55"},".cm-lineNumbers .cm-gutterElement":{paddingLeft:"8px",paddingRight:"12px"},".cm-scroller":{overflow:"visible",height:"auto",minHeight:0},".cm-selectionBackground, &.cm-focused .cm-selectionBackground":{backgroundColor:"#264f78 !important"}},{dark:!0}),kn(bn.define([{tag:B.keyword,color:"#569cd6"},{tag:B.string,color:"#ce9178"},{tag:B.comment,color:"#6a9955",fontStyle:"italic"},{tag:B.number,color:"#b5cea8"},{tag:B.className,color:"#d7ba7d"},{tag:B.tagName,color:"#4ec9b0"},{tag:B.propertyName,color:"#9cdcfe"},{tag:B.variableName,color:"#9cdcfe"},{tag:B.attributeName,color:"#9cdcfe"},{tag:B.attributeValue,color:"#ce9178"},{tag:B.angleBracket,color:"#808080"},{tag:B.unit,color:"#b5cea8"},{tag:B.color,color:"#ce9178"},{tag:B.bracket,color:"#ffd700"},{tag:B.punctuation,color:"#d4d4d4"},{tag:B.operator,color:"#d4d4d4"}]))]}function yi(e){return e==="css"?yn():e==="js"?xn():gn({autoCloseTags:!0})}function xi(e){return e.querySelector(".live-preview")||e.body}function Rt(e,t){const o=xi(e);t.parentElement!==o&&o.appendChild(t)}function Mo(e){if(e._sveShield)return;e._sveShield=!0;const t=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])e.addEventListener(o,t)}function bi(e){try{return new URLSearchParams(e.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function ki(e){const t=parseInt(we(e,_n)??"",10);return Number.isFinite(t)&&t>=An?t:oi}function _i(e,t){fe(e,_n,String(t))}function jn(e){try{const t=JSON.parse(we(e,Sn)||"null");if(t&&typeof t=="object")return{html:t.html!==!1,css:t.css!==!1,js:t.js===!0}}catch{}return{html:!0,css:!0,js:!1}}function Si(e,t){fe(e,Sn,JSON.stringify(t))}function Dn(e){try{const t=JSON.parse(we(e,$n)||"null");if(t&&typeof t=="object"){const o=n=>Number.isFinite(n)&&n>0?n:1;return{html:o(t.html),css:o(t.css),js:o(t.js)}}}catch{}return{html:1,css:1,js:1}}function $i(e,t){fe(e,$n,JSON.stringify(t))}function wi(e){let t=e.getElementById(Eo);t||(t=e.createElement("style"),t.id=Eo,e.head.appendChild(t)),t.textContent=`
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
  ${_o("ns")}
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
  ${_o("ew")}
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
`}function Ci(e){const t=e.querySelector(".live-preview-editor");if(!t)return 0;const o=t.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function Ai(e){let t=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=e.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>e.documentElement.clientWidth-8&&(t=Math.max(t,Math.round(s.width)))}return t}function oo(e){const t=e.document;if(je=e,typeof e.ResizeObserver!="function")return;ae||(ae=new e.ResizeObserver(()=>{je&&qa(je)}));const o=t.querySelector(".live-preview-editor"),n=t.getElementById("__sve-right-dock");o!==Le&&(Le&&ae.unobserve(Le),Le=o,o&&ae.observe(o)),n!==Oe&&(Oe&&ae.unobserve(Oe),Oe=n,n&&ae.observe(n))}function Ei(){ae?.disconnect(),ae=null,je=null,Le=null,Oe=null}function Ti(e){To||(To=!0,e.addEventListener("sve-right-dock-change",()=>oo(e)))}function no(e,t){const o=e.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=t?`${t}px`:"")}function so(e){if(!e)return;const t=e.clientHeight,o=e.querySelector("[data-sve-code-bar]"),n=e.querySelector("[data-sve-code-lock-banner]"),s=n&&Mi(e)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,t-(o?.offsetHeight||0)-s),i=e.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),e.querySelectorAll("[data-sve-code-host]").forEach(a=>{const l=a.closest("[data-sve-code-pane]");if(!l||l.style.display==="none")return;let d=0;for(const f of l.children)f!==a&&(d+=f.offsetHeight);const u=Math.max(64,r-d);a.style.height=`${u}px`,a.style.maxHeight=`${u}px`,a.style.minHeight="0",a.style.overflow="auto",Bi(a)})}function Mi(e){return e.ownerDocument?.defaultView||v}function Bi(e){e._sveWheelBound||(e._sveWheelBound=!0,e.addEventListener("wheel",t=>{const o=e.scrollHeight-e.clientHeight,n=e.scrollWidth-e.clientWidth;let s=!1;if(t.deltaY&&o>0){const r=Math.min(o,Math.max(0,e.scrollTop+t.deltaY));r!==e.scrollTop&&(e.scrollTop=r,s=!0)}if(t.deltaX&&n>0){const r=Math.min(n,Math.max(0,e.scrollLeft+t.deltaX));r!==e.scrollLeft&&(e.scrollLeft=r,s=!0)}s&&(t.preventDefault(),t.stopPropagation())},{passive:!1}))}function Pn(){const e=(je||v)?.document?.getElementById(c);e&&so(e);for(const t of q)p[t]?.requestMeasure()}function qn(e,t){const o=jn(e),n={};for(const s of q){const r=t.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function Rn(e,t){for(const n of q){const s=e.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",t[n]?"true":"false"),r&&(r.style.display=t[n]?"flex":"none")}const o=q.filter(n=>t[n]);e.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),zn(e.ownerDocument.defaultView,e),so(e)}function zn(e,t){const o=Dn(e);for(const n of q){const s=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function ze(e,t){if(Re)return;const o=e.document;Rt(o,t);const n=ki(e),s=Ci(o),r=Ai(o);t.style.left=`${s}px`,t.style.right=`${r}px`,t.style.bottom="0",t.style.height=`${n}px`,no(o,n),so(t)}function Nn(e,t,o,n){const s=e.document,r=[...s.querySelectorAll("iframe")];r.forEach(u=>{u.style.pointerEvents="none"});const i=s.createElement("div");i.setAttribute("data-sve-code-drag-shield",""),i.style.cssText=`position:fixed;inset:0;z-index:2147483646;cursor:${t};user-select:none;`,s.body.appendChild(i),Re=!0;let a=!1;const l=u=>{o(u)},d=()=>{a||(a=!0,Re=!1,s.removeEventListener("mousemove",l),s.removeEventListener("mouseup",d),e.removeEventListener("blur",d),r.forEach(u=>{u.style.pointerEvents=""}),i.remove(),n?.())};s.addEventListener("mousemove",l),s.addEventListener("mouseup",d),e.addEventListener("blur",d)}function Li(e,t){if(t._sveResizeBound)return;t._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest("[data-sve-code-pane-btn], [data-sve-code-back], [data-sve-style-mode], [data-sve-code-history], [data-sve-code-strip], [data-sve-html-scope], [data-sve-code-lock], [data-sve-code-autosave], [data-sve-code-save], .cm-editor"))return;n.preventDefault();const s=n.clientY,r=t.getBoundingClientRect().height;let i=r;Nn(e,"ns-resize",a=>{i=Math.min(Math.max(An,r+(s-a.clientY)),Math.round(e.innerHeight*.7)),t.style.height=`${i}px`,no(e.document,i),Pn()},()=>{_i(e,i),ze(e,t),e.dispatchEvent(new Event("resize"))})};t.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),t.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function Oi(e,t){t._sveSplitBound||(t._sveSplitBound=!0,t.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=q.filter(P=>qn(e,t)[P]),i=r.indexOf(s),a=r[i],l=r[i+1];if(!a||!l)return;const d=t.querySelector(`[data-sve-code-pane="${a}"]`),u=t.querySelector(`[data-sve-code-pane="${l}"]`),f=n.clientX,y=d.getBoundingClientRect().width,b=u.getBoundingClientRect().width,A=y+b;o.setAttribute("data-active",""),Nn(e,"col-resize",P=>{const Te=P.clientX-f;let At=Math.max(Bt,Math.min(A-Bt,y+Te)),mo=A-At;A<Bt*2&&(At=y,mo=b);const Et=Dn(e);Et[a]=At,Et[l]=mo,$i(e,Et),zn(e,t),Pn()},()=>{o.removeAttribute("data-active")})})}))}function Ii(e,t){t._svePaneBound||(t._svePaneBound=!0,t.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=qn(e,t),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),Si(e,i),Rn(t,i)})}))}function F(e,t){const o=e.getElementById(c)?.querySelector("[data-sve-code-status]");o&&(o.textContent=t||"")}function Fn(e,t){const o=e.getElementById(c)?.querySelector("[data-sve-code-path]");o&&(o.textContent=t||"",o.title=t||"")}function Ne(e){const t=e?.document?.getElementById(c)?.querySelector("[data-sve-code-back]");t&&(t.hidden=le.length===0,t.title=h(e,"code_dock_back"),t.setAttribute("aria-label",t.title),t.innerHTML=ii)}function Bo(e,t){const o=t.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ji(e)}))}function Hi(e){const t=xe,o=typeof x.activeContainers=="function"?x.activeContainers(e.document):[];for(const n of o){const s=x.unwrapRef?.(n.values)||n.values;if(!(!s||typeof s!="object")&&t&&typeof x.findPathByUid=="function"){const r=x.findPathByUid(s,t);if(r){const i=r.split("."),a=x.dataGet?.(s,i.slice(0,2).join("."));if(a&&typeof a=="object")return a}}}for(const n of o){const s=x.unwrapRef?.(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function Vn(e,t){!t||t===C||(ie(e.document),Ct(e,t,"push"))}function ji(e){const t=le.pop();if(!t){Ne(e);return}ie(e.document),Ct(e,t,"keep")}function $e(e){const t=e.document.getElementById(c),o=t?.querySelector("[data-sve-code-lock]"),n=t?.querySelector("[data-sve-code-lock-banner]");if(!t||!o)return;const s=T;t.toggleAttribute("data-sve-code-locked",s),s&&(Ro(e.document),se(e.document),ge&&(ge.setHover(p.html,null),ge.setHover(p.css,null)),qe?.setHover(p.html,null)),o.hidden=!be,o.setAttribute("aria-pressed",T?"true":"false"),o.title=h(e,T?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=T?si:ri,n&&(n.textContent=h(e,"code_dock_locked_banner"))}function Ve(e){return e?we(e,pt)!=="0":L}function ht(e,t,o){return e!=null&&t!=null&&e>=0&&t>e&&t<=o}function mt(){const e=p.html?.state.doc.toString()??"";if(!M||!g){w=e;return}if(g.from<0||g.from>w.length||g.to<g.from){M=!1,w=e,g=null;return}w=w.slice(0,g.from)+e+w.slice(g.to),g={from:g.from,to:g.from+e.length}}function vt(){return mt(),M?w:p.html?.state.doc.toString()??R.html??""}function gt(){N=ut(vt()).map(e=>e.name)}function Ae(){me=Yo(p.css?.state.doc.toString()??k)}function Wn(e,t){return Array.isArray(e)&&Array.isArray(t)&&e.length===t.length&&e.every((o,n)=>o===t[n])}function Di(){const e=M?ro():vt(),t=ft(e);t.length&&(k=Gt(k,Yt(k,t),t[0].className))}function Un(e,t){k=Vr(k,e,t),Di(),k=Wr(k,t,e)}function Pi(e){if(D||T||N==null)return;const t=ut(vt()).map(o=>o.name);Wn(N,t)||(Un(N,t),N=t,bt(),Ae())}function qi(){if(D||T||me==null||N==null||G==="empty")return;const e=p.html,t=Yo(p.css?.state.doc.toString()??"");if(!e||Wn(me,t))return;const o=new Set(N),{renamed:n,removed:s}=Go(me,t);let r=e.state.doc.toString();const i=r;for(const a of n){const l=ye(a.to);!o.has(a.from)||!l||(r=Co(r,d=>d===a.from?l:d))}for(const a of s)!o.has(a)||t.includes(a)||(r=Co(r,l=>l===a?"":l));if(r!==i){D=!0;try{xt(r)}finally{D=!1}}gt(),me=t}function Ri(e,t){const o=ye(t),n=p.html;if(!o||!n||n.state.readOnly||o===e.name)return;D=!0;try{n.dispatch({changes:{from:e.from,to:e.to,insert:o}})}finally{D=!1}const s=N==null?[]:N.slice();gt(),Un(s,N),bt(),Ae(),v&&(ee(v),U(v))}function zi(e,t){const o=e.document,s=p.html?.coordsAtPos(t.from);$(o),se(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=E,o.body.appendChild(r),Ee(e,i,r),r._sveApp=Ce(Wo,r,{label:h(e,"code_dock_css_rename_class"),placeholder:h(e,"code_dock_css_class_placeholder"),initial:t.name,onAdd:a=>{Ri(t,a),$(o)}})}function Kn(){return L&&ht(g?.from,g?.to,w.length)?(M=!0,w.slice(g.from,g.to)):(M=!1,w)}function yt(e,t,o){const n=p[e];if(!n)return;const s=n.state.doc.toString();D=!0;try{s!==t?n.dispatch({changes:{from:0,to:s.length,insert:t},...o?{selection:o,scrollIntoView:!0}:{}}):o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{D=!1}}function xt(e,t){yt("html",e,t)}function ro(){return M?p.html?.state.doc.toString()??"":ht(g?.from,g?.to,w.length)?w.slice(g.from,g.to):""}function pe(){const e=p.css?.state.doc.toString()??"";if(G==="tree"){if(e===ce)return;const t=ft(ro())[0]?.className||Qo(e);k=Gt(k,e,t),ce=e}else G==="full"&&(k=e)}function Xn(e,t){for(const o of t||[])if(!Y(e,o.className)||Xn(e,o.children))return!0;return!1}function bt(){let e=k,t=[],o=!1;!L||!M?(G="full",e=k):(t=ft(ro()),t.length?(G="tree",e=Yt(k,t),Xn(k,t)&&(k=Gt(k,e,t[0].className),o=!0)):(G="empty",e="")),ce=e,yt("css",e),Ae(),v&&(U(v),o&&ee(v))}function io(){const e=p.html;if(!e||!g)return;M||(w=e.state.doc.toString());const t=w.length,o=Math.max(0,Math.min(g.from,t)),n=Math.max(o,Math.min(g.to,t));n<=o||(g={from:o,to:n},M=!0,xt(w.slice(o,n),{anchor:0,head:0}),bt(),e.focus())}function ao(e=!0){const t=p.html;if(!t)return;pe(),mt(),M=!1;const o=w||t.state.doc.toString(),n=e&&ht(g?.from,g?.to,o.length)?{anchor:g.from,head:g.to}:null;w=o,xt(o,n),G="full",ce=k,yt("css",k),Ae()}function lo(){g=null,M=!1,w="",k="",G="full",ce="",N=null,me=null}let Fe=!1;function Se(e){return!!e?.document.getElementById(x.HTML_TREE_PANEL_ID)}function zt(e,t){if(!(!e||x.featureOn?.(e,"html_tree")===!1)){if(!t){Se(e)&&x.closeHtmlTreePanel?.(e);return}Se(e)||(Fe=!0,_s("html_tree").then(()=>{Se(e)||x.toggleHtmlTreePanel?.(e)}).catch(()=>{}).finally(()=>{Fe=!1,W(e)}))}}function W(e){const t=e?.document.getElementById(c)?.querySelector("[data-sve-html-scope]");if(!t)return;L=Ve(e);const o=x.featureOn?.(e,"html_tree")===!1?L:Se(e)||Fe;t.setAttribute("aria-pressed",o?"true":"false"),t.title=h(e,o?"code_dock_html_scope_off":"code_dock_html_scope"),t.setAttribute("aria-label",t.title),t.innerHTML=En,e.document.getElementById(c)?.toggleAttribute("data-sve-html-scoped",M)}function Lo(e,t){t._sveHtmlScopeBound||(t._sveHtmlScopeBound=!0,L=Ve(e),Ni(e,t),zt(e,L),t.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),L=!(Se(e)||Fe),fe(e,pt,L?"1":"0"),L?g&&(pe(),io()):M&&ao(),zt(e,L),W(e)}))}function Ni(e,t){t._sveTreeWatchBound||(t._sveTreeWatchBound=!0,e.addEventListener("sve-right-dock-change",()=>{if(Fe||x.featureOn?.(e,"html_tree")===!1||!e.document.getElementById(c))return;const o=Se(e);o!==Ve(e)&&(L=o,fe(e,pt,o?"1":"0"),o?g&&(pe(),io()):M&&ao(),W(e))}))}function Oo(e,t){t._sveLockBound||(t._sveLockBound=!0,t.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!be||!C)){if(T){Vi(e);return}Yn(e,!0)}}))}function co(e){return e?we(e,wn)!=="0":!0}function Fi(){const e=p.html;return!e||e.state.readOnly||!C?!1:!fo(uo(),R)}function de(e){const t=e?.document.getElementById(c),o=t?.querySelector("[data-sve-code-autosave]"),n=t?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=co(e),r=Fi();o.setAttribute("aria-pressed",s?"true":"false"),o.title=h(e,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=ai,n.hidden=s,n.title=h(e,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=li,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function Io(e,t){t._sveAutosaveBound||(t._sveAutosaveBound=!0,t.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!co(e);fe(e,wn,n?"1":"0"),n?ie(e.document):J&&(clearTimeout(J),J=null),de(e)}),t.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),ie(e.document)}))}function Vi(e){e.document.getElementById(K)?.remove();const t=Ss(e.document,$s,{title:h(e,"code_dock_unlock_title"),body:h(e,"code_dock_unlock_body"),buttons:[{value:"cancel",label:h(e,"cancel"),variant:"ghost"},{value:"ok",label:h(e,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{t.dismiss(),o==="ok"&&Yn(e,!1)}});t.host.id=K}function Yn(e,t){const o=C;if(!o)return;const n=()=>{C===o&&e.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Hn(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:t})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));C===o&&(T=t,$e(e),We(R,t),W(e),F(e.document,t?h(e,"code_dock_locked"):""))}).catch(()=>{F(e.document,h(e,"code_dock_error"))})};if(t&&(ie(e.document),He)){He.finally(n);return}n()}function uo(){const e={html:"",css:"",js:""};mt(),pe();for(const t of q)t==="html"?e.html=M?w:p.html?.state.doc.toString()??"":t==="css"?e.css=k:e[t]=p[t]?.state.doc.toString()??"";return e}function Gn(){if(!(L&&ht(g?.from,g?.to,w.length)))return G="full",ce=k,k;const e=ft(w.slice(g.from,g.to));if(!e.length)return G="empty",ce="","";G="tree";const t=Yt(k,e);return ce=t,t}function We(e,t){D=!0;try{v&&(L=Ve(v)),w=e.html??"",k=e.css??"";for(const o of q){const n=p[o];let s=e[o]??"";try{s=o==="html"?Kn():o==="css"?Gn():s}catch{s=o==="html"?w||e.html||"":o==="css"?k||e.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[De[o].reconfigure(nt.readOnly.of(!!t)),Pe[o].reconfigure(ne.editable.of(!t))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{D=!1}gt(),Ae(),Wt("dock:html-changed"),v&&(U(v),$t(v),W(v))}function fo(e,t){return e.html===t.html&&e.css===t.css&&e.js===t.js}function Zn(e){return String(e||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function kt(e){const t=Zn(e).match(/^([a-z-]+)\s*:/i);return t?t[1].toLowerCase():""}function Wi(e,t){return e===t||e.startsWith(`${t}-`)}function _t(e){const t=Zn(e),o=t.indexOf(":");return o===-1?"":t.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function H(e){const t=String(e||"").trim().toLowerCase();return t==="start"||t==="flex-start"||t==="left"||t==="top"?"flex-start":t==="end"||t==="flex-end"||t==="right"||t==="bottom"?"flex-end":t==="row-reverse"?"row-reverse":t==="column-reverse"?"column-reverse":t}function at(e){const t=H(e);return t==="flex"||t==="inline-flex"}function po(){const e=p.css;if(!e)return null;const t=e.state.selection.main.head,o=e.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const a=o.indexOf("}}",i+2);if(a===-1)break;i=a+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const a=n.pop();a!=null&&s.push({from:a+1,to:i,text:o.slice(a+1,i),open:a})}}let r=null;for(const i of s)t<i.open||t>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function Ui(e){const t=String(e||"");let o="",n=0;for(let s=0;s<t.length;s+=1){if(t[s]==="{"&&t[s+1]==="{"){const r=t.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=t.slice(s,r+2)),s=r+1;continue}if(t[s]==="{"){n+=1;continue}if(t[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=t[s])}return o}function Ki(e){const t={};for(const o of Ui(e).split(";")){const n=kt(o);n&&(t[n]=_t(`${o};`))}return t}function Xi(e,t,o){if(!t||t.from>=t.to)return null;let n=e.state.doc.lineAt(t.from),s=0;for(;n.from<=t.to;){const r=Math.max(n.from,t.from),i=Math.min(n.to,t.to),a=e.state.doc.sliceString(r,i);if(s===0&&kt(a)===o)return{from:r,to:i,text:a};if(s+=Yi(a),n.to>=e.state.doc.length||n.to>=t.to)break;n=e.state.doc.lineAt(n.to+1)}return null}function Yi(e){let t=0;const o=String(e);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?t+=1:o[n]==="}"&&(t-=1)}return t}function ue(e){return(String(e).match(/^\s*/)||[""])[0]}function St(e,t,o){for(let n=t.number-1;n>=1;n-=1){const s=e.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=ue(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function Gi(e,t){const o=e.state.doc.lineAt(t);if(o.text.trim())return ue(o.text);const n=St(e,o,!0);if(n)return n;const s=po();return s?Jn(e,s):"  "}function Jn(e,t){const o=e.state.doc.lineAt(t.from),n=e.state.doc.lineAt(Math.max(t.from,t.to));for(let r=n.number;r>=o.number;r-=1){const i=e.state.doc.line(r),a=Math.max(i.from,t.from),l=Math.min(i.to,t.to),d=e.state.doc.sliceString(a,l);if(d.trim())return(d.match(/^\s*/)||[""])[0]||"  "}return`${(e.state.doc.lineAt(Math.max(0,t.from-1)).text.match(/^\s*/)||[""])[0]}  `}function Ho(){p.css?.focus(),v&&(ee(v),U(v))}function V(e){const t=p.css;if(!t||t.state.readOnly||!e.length)return;const o=po();if(!o){const i=e.filter(a=>a.value!=null).map(a=>`${a.property}: ${a.value};`).join(`
`);i&&ea(i),Ho();return}const n=[],s=[],r=Jn(t,o);for(const i of e){const a=Xi(t,o,i.property);if(i.value==null){if(!a)continue;let l=a.from,d=a.to;t.state.doc.sliceString(d,d+1)===`
`&&(d+=1),l=Math.max(l,o.from),d=Math.min(d,o.to),n.push({from:l,to:d});continue}if(!(a&&H(_t(a.text))===H(i.value)))if(a){const l=(a.text.match(/^\s*/)||[""])[0];n.push({from:a.from,to:a.to,insert:`${l}${i.property}: ${i.value};`})}else s.push(`${r}${i.property}: ${i.value};`)}if(s.length){const i=!o.text.includes(`
`)||!/\n\s*$/.test(o.text)?`
`:"";n.push({from:o.to,to:o.to,insert:`${i}${s.join(`
`)}
`})}n.length&&(n.sort((i,a)=>a.from-i.from||a.to-i.to),t.dispatch({changes:n})),Ho()}function ke(){const e=po();return e?Ki(e.text):{}}function Zi(e){const t=ke(),o=at(t.display),n=H(t["flex-direction"])||(o?"row":"");if(o&&n===e){const s=[];t["flex-direction"]&&s.push({property:"flex-direction",value:null}),at(t.display)&&s.push({property:"display",value:null}),V(s);return}V([{property:"display",value:"flex"},{property:"flex-direction",value:e}])}function Ji(e){const t=ke();if(e==="flex"&&at(t.display)){V([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}V([{property:"display",value:e}])}function Qi(e,t){const o=ke();if(H(o[e])===H(t)){V([{property:e,value:null}]);return}V([{property:e,value:t}])}function ea(e){const t=p.css;if(!t||t.state.readOnly)return;const o=t.state.selection.main.head,n=t.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=Gi(t,o),a=e.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const d=`${i}${a}
${i}`;t.dispatch({changes:{from:n.from,to:n.to,insert:d},selection:{anchor:n.from+d.length}});return}const l=`
${i}${a}
${i}`;t.dispatch({changes:{from:o,to:t.state.selection.main.to,insert:l},selection:{anchor:o+l.length}})}function U(e){try{ta(e)}catch{}}function ta(e){const t=e?.document?.getElementById(c);if(t&&es(t),O==="tw"){t&&xa(e,t);return}const o=ke(),n=at(o.display),s=H(o["flex-direction"])||(n?"row":""),r=t?.querySelector("[data-sve-css-tools]"),i=t?.querySelector("[data-sve-css-chrome]"),a=i?.getAttribute("data-sve-css-sub")||"",l=a==="padding"||a==="margin"?a:"";if(t){i&&(n?i.setAttribute("data-sve-css-flex-on",""):i.removeAttribute("data-sve-css-flex-on")),r&&(n?r.setAttribute("data-sve-css-flex-on",""):r.removeAttribute("data-sve-css-flex-on"));for(const d of[...Ie,...Dt]){const u=t.querySelector(`[data-sve-css-tool="${d.id}"]`);if(!u)continue;let f=!1;if(d.flexDir)f=n&&s===d.flexDir;else if(d.display)f=d.display==="flex"?n:H(o.display)===d.display;else if(d.insert){const y=kt(d.insert);f=!!y&&H(o[y])===H(_t(d.insert))}else d.menu==="box"?(f=Object.keys(o).some(y=>Wi(y,d.property)),a===d.property?u.setAttribute("data-open",""):u.removeAttribute("data-open")):d.menu==="display"?(f=!!o.display,a==="display"?u.setAttribute("data-open",""):u.removeAttribute("data-open")):d.property&&(f=d.property in o);f?u.setAttribute("data-active",""):u.removeAttribute("data-active")}for(const d of to){const u=t.querySelector(`[data-sve-css-box-side="${d.suffix}"]`);if(!u)continue;!!l&&`${l}${d.suffix}`in o?u.setAttribute("data-active",""):u.removeAttribute("data-active")}for(const d of Pt){const u=t.querySelector(`[data-sve-css-tool="${d.id}"]`);if(!u)continue;H(o[d.property])===H(d.value)?u.setAttribute("data-active",""):u.removeAttribute("data-active")}}}function $(e){const t=e?.getElementById(E);t?._sveApp?.unmount(),t?.remove(),e?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-css-box-side][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(o=>o.removeAttribute("data-open"))}function nl(e){$(e),se(e);for(const t of q)p[t]&&pn?.(p[t])}function oa(e){if(Ze)return Ze;const t=e.Statamic?.$config?.get?.("cpUrl")||`/${e.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return Ze=e.fetch(`${t}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,a=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!a||n.has(a)||(n.add(a),s.push({name:a,hex:r.hex||r.color||""}))}for(const[r,i]of In)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),Ze}function Qn(e,t){const o=ke()[t]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of e.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function Ee(e,t,o){const n=t.getBoundingClientRect(),s=8;o.style.left=`${Math.max(s,Math.min(n.left,e.innerWidth-220))}px`,o.style.top=`${Math.max(s,n.bottom+4)}px`}function na(e,t,o){const n=e.document;$(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=E,n.body.appendChild(s),Ee(e,t,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=Ce(dt,s,{kind:"colors",swatches:i,onClear:()=>{V([{property:o,value:null}]),$(n)},onPick:a=>{V([{property:o,value:`var(${a})`}]),$(n)}}),Qn(s,o)};r(In.map(([i,a])=>({name:i,hex:a}))),oa(e).then(i=>{n.getElementById(E)&&r(i.map(a=>({name:a.name,hex:a.hex})))})}function jo(e,t,o){const n=e.document;$(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=E,n.body.appendChild(s),Ee(e,t,s),s._sveApp=Ce(dt,s,{kind:"choices",choices:di.map(r=>({value:r,token:r,label:r})),onPick:r=>{V([{property:o,value:`var(${r})`}]),$(n)}}),Qn(s,o)}function es(e){const t=Q(e),o=t?.querySelector("[data-sve-css-subrow]");if(!t||!o)return;t.querySelectorAll("[data-sve-css-item][data-sve-css-open]").forEach(i=>i.removeAttribute("data-sve-css-open"));const n=t.getAttribute("data-sve-css-sub")||"",s=n?t.querySelector(`[data-sve-css-item="${n}"]`):null;if(s){o.parentElement!==s&&s.appendChild(o),s.setAttribute("data-sve-css-open","");return}const r=t.querySelector("[data-sve-code-pane-label]");r&&o.parentElement!==r&&r.appendChild(o)}function Q(e){return e?.querySelector("[data-sve-css-chrome]")}function Nt(e,t){const o=e.document.getElementById(c),n=Q(o);$(e.document),n&&(n.getAttribute("data-sve-css-sub")===t?n.removeAttribute("data-sve-css-sub"):n.setAttribute("data-sve-css-sub",t),U(e))}function ts(e,t){if(e.startsWith("{{",t)){const o=e.indexOf("}}",t+2);return o===-1?e.length:o+2}if(e.startsWith("<!--",t)){const o=e.indexOf("-->",t+4);return o===-1?e.length:o+3}return t}function Ft(e,t){if(e[t]!=="<")return null;const o=e.indexOf(">",t+1);if(o===-1)return null;const n=e.slice(t,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:t,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:t,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:t,to:o+1}}function Do(e,t,o){let n=1,s=o;for(;s<e.length;){const r=ts(e,s);if(r!==s){s=r;continue}if(e[s]!=="<"){s+=1;continue}const i=Ft(e,s);if(!i)break;if(i.kind==="open"&&i.name===t)n+=1;else if(i.kind==="close"&&i.name===t&&(n-=1,n===0))return i;s=i.to}return null}function Ue(){const e=p.html;if(!e)return null;const t=e.state.selection.main.head,o=e.state.doc.toString(),n=[];let s=0;for(;s<t;){const l=ts(o,s);if(l!==s){s=l;continue}if(o[s]!=="<"){s+=1;continue}const d=Ft(o,s);if(!d||d.from>=t)break;if(d.kind==="open")n.push(d);else if(d.kind==="close"){for(let u=n.length-1;u>=0;u-=1)if(n[u].name===d.name){n.splice(u);break}}s=d.to}const r=o.lastIndexOf("<",Math.max(0,t-1));if(r!==-1&&o.indexOf(">",r)>=t){const l=Ft(o,r);if(l?.kind==="open"||l?.kind==="void"){const d=l.kind==="void"?null:Do(o,l.name,l.to);return d?{name:l.name,open:l,close:d}:{name:l.name,open:l,close:null}}}const i=n[n.length-1];if(!i)return null;const a=Do(o,i.name,i.to);return{name:i.name,open:i,close:a}}function Vt(e){return Tn.includes(e)}function oe(){p.html?.focus(),v&&(ee(v),$t(v))}function Qe(e,t,o){const n=[...t].sort((s,r)=>r.from-s.from||r.to-s.to);e.dispatch({changes:n,selection:o})}function lt(e,t){const o=p.html;if(!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.slice(0,n-s.from),i=s.text.trim()?ue(s.text):St(o,s)||ue(s.text);let a=e,l=0;if(r.trim()!=="")a=`
${i}${e}`,l=1+i.length;else if(!s.text.trim()){a=`${i}${e}`,l=i.length,o.dispatch({changes:{from:s.from,to:s.to,insert:a},selection:{anchor:s.from+l+t}});return}o.dispatch({changes:{from:n,to:o.state.selection.main.to,insert:a},selection:{anchor:n+l+t}})}function os(e){const t=p.html;if(!t||t.state.readOnly)return;const o=t.state.selection.main,n=t.state.doc.toString();if(!o.empty){const a=n.slice(o.from,o.to),l=a.match(new RegExp(`^<${e}(\\s[^>]*)?>([\\s\\S]*)</${e}>$`,"i"));if(l){Qe(t,[{from:o.from,to:o.to,insert:l[2]}],{anchor:o.from,head:o.from+l[2].length}),oe();return}let d=`<${e}>${a}</${e}>`,u=o.from+e.length+2;e==="ul"&&(d=`<ul>
  <li>${a}</li>
</ul>`,u=o.from+11),Qe(t,[{from:o.from,to:o.to,insert:d}],{anchor:u,head:u+a.length}),oe();return}const s=Ue();if(s?.open&&s.close){if(s.name===e){Qe(t,[{from:s.close.from,to:s.close.to,insert:""},{from:s.open.from,to:s.open.to,insert:""}],{anchor:s.open.from}),oe();return}if(Vt(s.name)&&Vt(e)){const a=n.slice(s.open.from,s.open.to).replace(new RegExp(`^<${s.name}`,"i"),`<${e}`);Qe(t,[{from:s.close.from,to:s.close.to,insert:`</${e}>`},{from:s.open.from,to:s.open.to,insert:a}],{anchor:s.open.from+e.length+1}),oe();return}}const i=(t.state.doc.lineAt(o.head).text.match(/^\s*/)||[""])[0];if(e==="ul"){const a=`<ul>
${i}  <li></li>
${i}</ul>`;lt(a,`<ul>
${i}  <li>`.length)}else lt(`<${e}></${e}>`,e.length+2);oe()}function $t(e){try{sa(e)}catch{}}function sa(e){const t=e?.document?.getElementById(c),n=Ue()?.name||"";if(t)for(const s of jt){const r=t.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!r)continue;(s.id==="heading"?Vt(n):n===s.tag)?r.setAttribute("data-active",""):r.removeAttribute("data-active")}}function ra(e,t){const o=e.document,n=Ue()?.name||"";$(o),t.setAttribute("data-open","");const s=o.createElement("div");s.id=E,o.body.appendChild(s),Ee(e,t,s),s._sveApp=Ce(dt,s,{kind:"choices",choices:Tn.map(r=>({value:r,label:r.toUpperCase(),active:n===r})),onPick:r=>{os(r),$(o)}})}function ia(e){const t=ye(e),o=p.html,n=p.css;if(!t||o?.state.readOnly||n?.state.readOnly)return;const s=Ue();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=Hr(r,t);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}pe(),Y(k,t)||(k=`${String(k||"").trimEnd()}${k?.trim()?`
`:""}.${t} {
}
`),bt(),gt(),Ae(),v&&(ee(v),$t(v),U(v))}function aa(e,t){const o=e.document;if(t.hasAttribute("data-open")){$(o);return}$(o),t.setAttribute("data-open","");const n=o.createElement("div");n.id=E,o.body.appendChild(n),Ee(e,t,n),n._sveApp=Ce(Wo,n,{label:h(e,"code_dock_css_class_name"),placeholder:h(e,"code_dock_css_class_placeholder"),onAdd:s=>{ia(s),$(o)}})}function la(e,t){const o=t.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=ci,o.title=h(e,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),O==="tw"){$(e.document),Is(e,o);return}aa(e,o)}))}function ca(e){const t=Math.max(0,Math.round(Date.now()/1e3-e)),o=new Date(e*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let n=o;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});t<90?n=s.format(-t,"second"):t<5400?n=s.format(-Math.round(t/60),"minute"):t<86400?n=s.format(-Math.round(t/3600),"hour"):n=s.format(-Math.round(t/86400),"day")}catch{}return`${n} · ${o}`}function ns(e,t){return e.fetch(t,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function da(e,t){const o=e.document,n=ds();if($(o),!n)return;let s=[];try{const i=await ns(e,`/!/sve/section-template/history?type=${encodeURIComponent(n)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!o.getElementById(c)||!o.contains(t))return;t.setAttribute("data-open","");const r=o.createElement("div");r.id=E,o.body.appendChild(r),Ee(e,t,r),r._sveApp=Ce(dt,r,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:ca(i.at)})):[{value:"",label:h(e,"code_dock_history_empty")}],onPick:i=>{$(o),i&&ua(e,n,i)}})}async function ua(e,t,o){if(_e())return;let n=null;try{const s=await ns(e,`/!/sve/section-template/history/entry?type=${encodeURIComponent(t)}&id=${encodeURIComponent(o)}`);s.ok&&(n=await s.json())}catch{n=null}!n||_e()||(We({html:n.html??"",css:n.css??"",js:n.js??""},T),ee(e),wt(e))}function ct(e){const t=e?.document.getElementById(c)?.querySelector("[data-sve-code-strip]");if(!t)return;const o=No(e);t.innerHTML=fi,t.title=h(e,o?"tw_strip_on":"tw_strip_off"),t.setAttribute("aria-label",t.title),t.setAttribute("aria-pressed",o?"true":"false")}function fa(e,t){const o=t.querySelector("[data-sve-code-strip]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),As(e,!No(e)),ct(e),Es(e)}),ct(e))}function pa(e,t){const o=t.querySelector("[data-sve-code-history]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=pi,o.title=h(e,"code_dock_history"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),o.hasAttribute("data-open")){$(e.document);return}da(e,o)}))}function sl(){return O}function ha(e){const t=p.html;if(!t||O!=="tw")return null;const o=M&&!!g,n=o?w:t.state.doc.toString(),r=(o?g.from:0)+t.state.selection.main.from,i=Os(Ut(n),new Set);let a=null;for(const l of i)l.from<=r&&r<l.to&&(a=l);return a}function wt(e){O==="tw"&&Ls(e,ha())}function ho(e){const t=e?.document.getElementById(c);if(!t)return;const o=O==="tw";t.setAttribute("data-sve-style",O);const n=t.querySelector("[data-sve-css-label]");n&&(n.textContent=o?h(e,"code_dock_style_tw"):h(e,"code_dock_css"));const s=t.querySelector("[data-sve-style-mode]");if(!s)return;const r=e.document.createElement("span");r.textContent=o?h(e,"code_dock_style_tw"):h(e,"code_dock_css"),s.innerHTML=o?mi:hi,s.appendChild(r),s.title=h(e,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function ss(e){const t=e?.document.getElementById(c);$(e.document),Ot(e),Q(t)?.removeAttribute("data-sve-css-sub"),ho(e),qt?.(),O==="tw"&&(L=!0,fe(e,pt,"1"),zt(e,!0)),wt(e),U(e)}function ma(e,t){O=t==="tw"?"tw":"css",fe(e,Cn,O),ss(e)}function va(e,t){t._sveStyleModeBound||(t._sveStyleModeBound=!0,O=we(e,Cn)==="tw"?"tw":"css",t.querySelector("[data-sve-style-mode]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),ma(e,O==="tw"?"css":"tw")}),ss(e))}function ga(e,t,o,n){const s=Bn[o];if(s){Ot(e),Hs(e,s),U(e);return}const r=Mn[o];if(!(!r||!n)){if(o==="display"){Q(t)?.removeAttribute("data-sve-css-sub"),It(e,n,"display",i=>{const a=Q(t);i==="flex"||i==="inline-flex"||i==="grid"?a?.setAttribute("data-sve-css-sub","display"):a?.removeAttribute("data-sve-css-sub"),U(e)});return}if(o==="padding"||o==="margin"){Ot(e),Nt(e,r);return}Q(t)?.removeAttribute("data-sve-css-sub"),It(e,n,r)}}function ya(e){return e==="flex"?"display":e.startsWith("justify-")?"justify-content":e.startsWith("items-")?"align-items":"flex-direction"}function xa(e,t){const o=t.querySelector("[data-sve-css-chrome]"),n=o?.getAttribute("data-sve-css-sub")||"",s=n==="padding"||n==="margin"?n:"",r=Tt()?Xe("display"):"",i=r==="flex"||r==="inline-flex"||r==="grid";for(const a of[o,t.querySelector("[data-sve-css-tools]")])a&&(i?a.setAttribute("data-sve-css-flex-on",""):a.removeAttribute("data-sve-css-flex-on"));for(const[a,l]of Object.entries(Bn)){const d=t.querySelector(`[data-sve-css-tool="${a}"]`);d&&(Tt()&&Xe(ya(l))===l?d.setAttribute("data-active",""):d.removeAttribute("data-active"))}for(const a of[...Ie,...Ln]){const l=t.querySelector(`[data-sve-css-tool="${a.id}"]`);if(!l)continue;const d=Mn[a.id],u=Tt()&&!!d&&!!Xe(d);n===d&&(a.id==="padding"||a.id==="margin")?l.setAttribute("data-open",""):l.removeAttribute("data-open"),u?l.setAttribute("data-active",""):l.removeAttribute("data-active")}for(const a of to){const l=t.querySelector(`[data-sve-css-box-side="${a.suffix}"]`);if(!l)continue;const d=s?`${s}${On[a.suffix]??a.suffix}`:"";d&&Xe(d)?l.setAttribute("data-active",""):l.removeAttribute("data-active")}}function ba(e,t){const o=t.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=[...Ie,...Dt,...Pt],s=(d,u)=>{if(O==="tw"){ga(e,t,d,u);return}const f=n.find(y=>y.id===d);if(f){if(f.flexDir){$(e.document),Zi(f.flexDir);return}if(f.display){$(e.document),Ji(f.display);return}if(f.property&&f.value){$(e.document),Qi(f.property,f.value);return}if(f.insert){const y=kt(f.insert),b=_t(f.insert),A=ke();$(e.document),Q(t)?.removeAttribute("data-sve-css-sub"),y&&H(A[y])===H(b)?V([{property:y,value:null}]):V([{property:y,value:b}]);return}if(f.menu==="colors"){Q(t)?.removeAttribute("data-sve-css-sub"),na(e,u,f.property);return}if(f.menu==="box"){Nt(e,f.property);return}if(f.menu==="display"){Nt(e,"display");return}f.menu==="spacing"&&jo(e,u,f.property)}};let r=!1;const i=Pt.map((d,u)=>{const f={...d,icon:Ge[d.id]||"",sep:u===0||d.group==="align"&&!r};return d.group==="align"&&!r&&(r=!0),f});qt=()=>{const d=O==="tw"?[...Ie,...Ln]:Ie;Q(t)?.removeAttribute("data-sve-css-sub"),es(t),ve(o,mr,{tools:d.map(u=>({...u,icon:Ge[u.id]||ui[u.id]||""})),onTool:u=>s(u,t.querySelector(`[data-sve-css-tool="${u}"]`))})},qt();const a=t.querySelector('[data-sve-css-sub="box"]');a&&!a._sveBound&&(a._sveBound=!0,ve(a,yr,{sides:to.map(d=>({...d,icon:Ge[`box-${d.id}`]||""})),onSide:d=>{const u=Q(t)?.getAttribute("data-sve-css-sub"),f=a.querySelector(`[data-sve-css-box-side="${d}"]`),y=`${u}${d}`,b=O==="tw"?{}:ke();if(!(u!=="padding"&&u!=="margin"||!f)){if(O==="tw"){It(e,f,`${u}${On[d]??d}`);return}if(y in b){$(e.document),V([{property:y,value:null}]);return}jo(e,f,y),U(e)}}}));const l=t.querySelector('[data-sve-css-sub="display"]');l&&!l._sveBound&&(l._sveBound=!0,ve(l,$r,{items:Dt.map(d=>({...d,icon:Ge[d.id]||""})),extras:i,onTool:d=>s(d,t.querySelector(`[data-sve-css-tool="${d}"]`))})),e.document.addEventListener("mousedown",d=>{d.target.closest(`#${E}, [data-sve-css-tools], [data-sve-css-subrow], [data-sve-html-tools], [data-sve-css-add-class]`)||$(e.document)},!0)}function ka(e,t){const o=t.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,ve(o,lr,{tools:jt.map(n=>({...n,icon:vi[n.id]||""})),onTool:n=>{const s=jt.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){ra(e,r);return}$(e.document),os(s.tag)}}}),_a(e,t),$a(e,t))}function _a(e,t){const o=t.querySelector("[data-sve-antlers-tools]");!o||o._sveBound||(o._sveBound=!0,ve(o,Vo,{label:h(e,"code_dock_antlers"),groups:Rs.map(n=>({id:n.id,label:h(e,n.lang),items:zs.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>Sa(n)}))}function Sa(e){const t=Ns(e),o=p.html;if(!t||!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.trim()?ue(s.text):St(o,s)||ue(s.text),{text:i,cursor:a}=tt(t.snippet);lt(Fo(i,r),a),oe()}function $a(e,t){const o=t.querySelector("[data-sve-visual-edit-tools]");!o||o._sveBound||(o._sveBound=!0,ve(o,Vo,{label:h(e,"code_dock_visual_edit"),groups:Ur.map(n=>({id:n.id,label:h(e,n.lang),items:tn.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>Ca(n)}))}function wa(e,t,o,n){if(Yr(o.inner,n.attr)){e.focus();return}const{text:s,cursor:r}=tt(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(t[i-1]);)i--;e.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),oe()}function Ca(e){const t=Kr(e),o=p.html;if(!t||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=Ue();if(s?.open){const f=Xr(n,s.open.from,s.open.to,Ye);if(f){t.attr?wa(o,n,f,t):(o.dispatch({selection:{anchor:f.openIdx+2+Ye.length}}),o.focus());return}const y=s.open.from+1+s.name.length,b=t.standalone||`{{ ${Ye} ${t.attr} }}`,{text:A,cursor:P}=tt(b);o.dispatch({changes:{from:y,to:y,insert:` ${A}`},selection:{anchor:y+1+P}}),oe();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),a=i.text.trim()?ue(i.text):St(o,i)||ue(i.text),l=t.standalone||`{{ ${Ye} ${t.attr} }}`,{text:d,cursor:u}=tt(l);lt(Fo(d,a),u),oe()}function rs(e){if(!xe||!C||String(C).startsWith("view:")){bo(e);return}const t=bs(xe,e.document);bo(e,t.length?{sectionUids:t}:void 0)}function Aa(e,t,o){return He=e.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Hn(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:t,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{}})}).then(async n=>{if(n.status===423){T=!0,be=!0,$e(e),We(R,!0),W(e),F(e.document,h(e,"code_dock_locked"));return}if(!n.ok)throw new Error(String(n.status));C===t&&(R=o,F(e.document,h(e,"code_dock_saved")),de(e),e.setTimeout(()=>{const s=e.document.getElementById(c)?.querySelector("[data-sve-code-status]");s&&s.textContent===h(e,"code_dock_saved")&&(s.textContent="")},1800)),rs(e),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}).catch(()=>{F(e.document,h(e,"code_dock_error"))}).finally(()=>{He=null}),He}function ie(e){J&&(clearTimeout(J),J=null);const t=C,o=v,n=p.html;if(!n||n.state.readOnly||!t||!o)return;const s=uo(),r=st!==null&&zo(o)&&is(s.html)===rt;fo(s,R)&&!(r&&it)||(r&&(s.tw=st,it=!1),F(e,h(o,"code_dock_saving")),Aa(o,t,s))}function is(e){return js(e).sort().join(" ")}function Ea(){st=null,rt="",it=!1}function as(e,t){if(!e||!zo(e))return;const o=is(t);o===rt||Je||(Je=!0,Z(()=>import("./tw-compile-B9daJWrZ.js"),__vite__mapDeps([8,9]),import.meta.url).then(n=>n.compileTailwind(e,t)).then(n=>{Je=!1,st=n,rt=o,it=!0,ls(e,e.document)}).catch(n=>{Je=!1,console.error("[sve] tailwind compile",n)}))}function ls(e,t){J&&clearTimeout(J),J=e.setTimeout(()=>{J=null,ie(t)},ni)}function ee(e){if(D)return;const t=uo();if(fo(t,R)){de(e);return}if(de(e),as(e,t.html),!co(e)){F(e.document,h(e,"code_dock_unsaved"));return}F(e.document,h(e,"code_dock_saving")),ls(e,e.document)}let ge=null,qe=null;function Ta(){return ge||(ge=Bs({Decoration:eo,StateField:Zt,StateEffect:Jt,RangeSetBuilder:Qt,EditorView:ne})),ge}function Ma(){return qe||(qe=Zr({Decoration:eo,StateField:Zt,StateEffect:Jt,RangeSetBuilder:Qt,EditorView:ne})),qe}function Ba(e,t,o){p[t]?.destroy();const n=Ht.of([{key:"Mod-s",run:()=>(ie(e.document),!0)}]);p[t]=new ne({state:nt.create({doc:"",extensions:[on(),nn(),sn(),cn(),yi(t),un(),dn({tooltipClass:()=>"sve-tw-complete"}),...t==="html"?[vn.data.of({autocomplete:Ts(e)}),Ms(mn,e)]:[],...t==="html"?[...Ds(),Ps()]:[],Ht.of([...rn,...t==="html"?[{key:"Tab",run:qs}]:[],an,...ln,...hn,...fn]),n,ne.lineWrapping,...t==="html"||t==="css"?Ta().extensions:[],...t==="html"?Ma().extensions:[],De[t].of(nt.readOnly.of(!!T)),Pe[t].of(ne.editable.of(!T)),ne.updateListener.of(s=>{t==="html"&&s.docChanged&&!D&&(Pi(),Wt("dock:html-changed")),t==="css"&&s.docChanged&&!D&&qi(),s.docChanged&&ee(e),t==="css"&&(s.docChanged||s.selectionSet)&&U(e),t==="html"&&(s.docChanged||s.selectionSet)&&($t(e),D||wt(e))}),...gi()]}),parent:o})}function La(e){if(!e||e.querySelector(".cm-editor"))return;e.replaceChildren();const t=e.ownerDocument.createElement("span");t.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",e.appendChild(t)}let et=null;async function Oa(e){const t=e.document;wi(t);let o=t.getElementById(c);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-subrow]")&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-7")){for(const s of q)p[s]?.destroy(),p[s]=null;o.remove(),o=null}if(!o){o=t.createElement("div"),o.id=c,o.setAttribute("data-sve-code-chrome","scope-7"),ve(o,rr,{htmlLabel:h(e,"code_dock_html"),cssLabel:h(e,"code_dock_css"),jsLabel:h(e,"code_dock_js"),treeIcon:En}),Rt(t,o),Mo(o),Rn(o,jn(e)),Li(e,o),Ii(e,o),Oi(e,o),ba(e,o),la(e,o),va(e,o),pa(e,o),fa(e,o),ks(e,o),ka(e,o),Lo(e,o),Oo(e,o),Bo(e,o),Io(e,o);for(const n of q){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);La(s)}x.openHtmlTreePanel?.(e)}if(Rt(t,o),Mo(o),Lo(e,o),Oo(e,o),Bo(e,o),Io(e,o),Ti(e),oo(e),$e(e),W(e),Ne(e),de(e),ho(e),ct(e),await ti(),!p.html){for(const n of q){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),Ba(e,n,s)}for(const n of["html","css"])p[n]&&Cs(e,p[n],{onOpen:s=>Vn(e,s),emptyLabel:h(e,"code_dock_partials_empty"),sectionValues:()=>Hi(e),isLocked:()=>_e(),setHover:(s,r)=>ge?.setHover(s,r)});ei(e,p.html,{onRename:n=>zi(e,n),isLocked:()=>_e(),setHover:(n,s)=>qe?.setHover(n,s),title:h(e,"code_dock_css_rename_class")})}return o}function cs(e){return et||(et=Oa(e).finally(()=>{et=null})),et}async function Po(e,t){const o=await cs(e);C=t,T=!0,be=!0,R={html:"",css:"",js:""},lo(),$e(e),We(R,!0),Fn(e.document,t),F(e.document,h(e,"code_dock_missing")),W(e),Ne(e),de(e),ze(e,o)}async function Ct(e,t,o="replace"){o==="replace"?le=[]:o==="push"&&C&&C!==t&&le.push(C);const n=++Be;C=t,be=!1,lo(),F(e.document,h(e,"code_dock_loading"));const s=await cs(e);$e(e),W(e),Ne(e),de(e),ho(e),ct(e),ze(e,s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(t)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async r=>{if(n!==Be)return;if(r.status===404){Po(e,t);return}if(!r.ok)throw new Error(String(r.status));const i=await r.json();n===Be&&(R={html:typeof i.html=="string"?i.html:"",css:typeof i.css=="string"?i.css:"",js:typeof i.js=="string"?i.js:""},C=t,T=!!i.locked,be=!0,Ea(),$e(e),We(R,T),T||as(e,R.html),Fn(e.document,i.path||t),F(e.document,T?h(e,"code_dock_locked"):""),Uo(e),W(e),Ne(e),de(e),ze(e,s))}).catch(()=>{n===Be&&(Po(e,t),F(e.document,h(e,"code_dock_error")))})}function ds(){return C||""}function Ia(e){return!!e?.getElementById(c)}function _e(){return T}function Ha(e,t){const o=typeof t?.html=="string"?t.html.trim():"",n=typeof t?.css=="string"?t.css.trim():"",s=typeof t?.js=="string"?t.js.trim():"";if(!o&&!n&&!s||!e?.document?.getElementById(c))return!1;let r=!1;return o&&(r=ja("html",o)||r),n&&(r=qo("css",n)||r),s&&(r=qo("js",s)||r),r&&ee(e),r}function ja(e,t){const o=p[e];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,l=`${s===`
`?"":`
`}${t}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:l},selection:{anchor:n.from+l.length}}),!0}function qo(e,t){const o=p[e];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${t}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function Da(e){if(rs(e),!C||!e.document.getElementById(c))return;const t=C;C=null,Ct(e,t,"keep")}function Pa(e){Be+=1,ie(e),xe=null,C=null,le=[],R={html:"",css:"",js:""},T=!1,be=!1,N=null,me=null,lo(),v=e?.defaultView||v,$(e),Ro(e),se(e),e?.getElementById(K)?.remove();for(const o of q)p[o]?.destroy(),p[o]=null;e?.getElementById(c)?.remove(),Ei(),e&&no(e,0);const t=e?.defaultView||v;t?.document.getElementById(x.HTML_TREE_PANEL_ID)&&x.closeHtmlTreePanel?.(t),t&&Uo(t)}function qa(e){if(Re)return;const t=e.document.getElementById(c);t&&(oo(e),ze(e,t))}function Ra(e,t,o){if(o){const r=ko(o,t)||ko(o,e.document)||o;return String(typeof x.setTypeForUid=="function"&&(x.setTypeForUid(r,t)||x.setTypeForUid(r,e.document))||"").trim()}const n=typeof x.sectionField=="function"?x.sectionField(e):"page_sections",s=typeof x.activeContainers=="function"?x.activeContainers(e.document):[];for(const r of s){const a=(x.unwrapRef?.(r.values)||r.values)?.[n];if(Array.isArray(a))for(const l of a){const d=typeof l?.type=="string"?l.type.trim():"";if(d)return d}}return""}function za(e){if((e.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=e.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(e.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof x.activeContainers=="function"?x.activeContainers(e.document):[];for(const r of s){const i=x.unwrapRef?.(r.values)||r.values,a=typeof i?.view=="string"?i.view.trim():"";if(!a||a.includes(".."))continue;const l=a.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(l)return`view:${l}`}return""}function Na(e,t){const o=x.chromeInlineKind||x.activeChromeKind;if(o!=="header"&&o!=="footer"||!x.chromeHost?.(t)&&!x.chromeEditorOpen?.(t))return"";const s=(x.unwrapRef?.(x.chromeContainer?.()?.values)||{})[o==="footer"?"footer_style":"header_style"]||"style_1";return`${o}/${s}`}function Fa(e){const t=x.globalSectionHost?.(e)||e.getElementById("__sve-global-section-host");return t&&t.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function Va(e,t,o){if(Re)return;if(!e||!t||bi(t)||!ys(e)||!xs(e)){t&&Pa(t);return}const n=Na(e,t)||Fa(t)||Ra(e,t,o)||za(e)||(o?"":C),s=!!(o&&o!==xe);if(v=e,o&&(xe=o),!!n&&!(n===C&&t.getElementById(c))){if(le.length&&C&&C!==n){const r=le[0];if(n===r&&!s)return;le=[]}ie(t),Ct(e,n,"replace")}}ws("tw:changed",()=>{v&&O==="tw"&&U(v)});z("dock:is-open",e=>Ia(e));z("dock:is-locked",()=>_e());z("dock:html",()=>vt());z("dock:reveal-html",({from:e,to:t}={})=>{const o=p.html;if(!o||e==null)return;L=Ve(v),mt(),pe();const n=w.length,s=Math.max(0,Math.min(e,n)),r=Math.max(s,Math.min(t??e,n));if(g=r>s?{from:s,to:r}:null,L&&g){io(),W(v);return}if(M){ao(),W(v);return}o.dispatch({selection:{anchor:s,head:r},scrollIntoView:!0}),o.focus()});z("dock:insert-snippet",({win:e,parts:t})=>Ha(e,t));z("dock:refresh",e=>Da(e));z("dock:tw-follow",()=>{v&&wt(v)});z("dock:css",()=>(pe(),k));z("dock:set-css",e=>typeof e!="string"||_e()||!p.css||!v?!1:(pe(),k=e,yt("css",Gn()),ee(v),!0));z("dock:current-type",()=>ds());z("dock:current-uid",()=>xe);z("dock:open-template",e=>typeof e!="string"||!e||!v?!1:(Vn(v,e),!0));z("dock:set-html",e=>{if(typeof e!="string"||_e())return!1;const t=p.html;if(!t||!v)return!1;if(w=e,M)return xt(Kn()),ee(v),Wt("dock:html-changed"),!0;const o=t.state.doc.toString();return o!==e&&t.dispatch({changes:{from:0,to:o.length,insert:e}}),!0});x.syncCodeDock=Va;export{al as ARMED_KEY,Pa as closeCodeDock,nl as closeCodeDockPopups,sl as codeDockStyleMode,ds as currentTemplateType,Ha as insertAiSnippet,xs as isCodeDockArmed,_e as isCodeDockLocked,Ia as isCodeDockOpen,Da as refreshCodeDockFromDisk,qa as relayoutCodeDock,Ea as resetTailwindCompile,ll as setCodeDockArmed,Va as syncCodeDock,ys as templateDockAllowed};
