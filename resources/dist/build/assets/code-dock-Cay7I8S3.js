const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-Dpuj8sxX.js","./index-B5fiB6ig.js","./index-eMi007Cw.js","./index-zsjA895l.js","./index-BsAZfAgM.js","./index-D2YMCfE7.js","./html-tag-sync-BlP2Mk13.js","./index-BatCsQTe.js"])))=>i.map(i=>d[i]);
import{o as S,c as C,a as m,t as X,F as D,r as ne,w as P,f as Xn,d as Ct,V as Kn,a8 as so,aa as Yn,aj as Zn,a3 as Gn,U as ro,a4 as Jn,i as k,ak as Qn,al as es,am as io,an as ts,ao,ap as Fe,aq as Ot,D as ve,ar as lo,a0 as Ce,a2 as G,q as Ve,as as os,g as ns,C as ss,a7 as re}from"./addon-CcLBFEc4.js";import{at as Ma,au as Ia}from"./addon-CcLBFEc4.js";import{p as rs}from"./html-tree-parse-CO6ZQU4u.js";import{h as is,a as as,e as ls,A as cs,b as ds,c as us,d as tt,i as Oo}from"./html-tag-sync-BlP2Mk13.js";import"./index-Dpuj8sxX.js";import"./index-B5fiB6ig.js";import"./index-BatCsQTe.js";import"./index-BsAZfAgM.js";import"./index-zsjA895l.js";import"./index-D2YMCfE7.js";import"./index-eMi007Cw.js";const fs={class:"sve-code-dock"},ps={"data-sve-code-bar":""},hs={type:"button","data-sve-code-pane-btn":"html"},ms={type:"button","data-sve-code-pane-btn":"css"},gs={type:"button","data-sve-code-pane-btn":"js"},vs={type:"button","data-sve-html-scope":"","aria-pressed":"true"},xs=["innerHTML"],ys={"data-sve-code-panes":""},bs={"data-sve-code-pane":"html"},ks={"data-sve-code-pane-label":""},$s={"data-sve-code-pane":"css"},_s={"data-sve-css-chrome":"subrow-2"},Ss={"data-sve-code-pane-label":""},Cs={"data-sve-code-pane":"js"},As={"data-sve-code-pane-label":""},Es={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},treeIcon:{type:String,required:!0}},setup(e){return(t,o)=>(S(),C("div",fs,[o[17]||(o[17]=m("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),m("div",ps,[m("button",hs,X(e.htmlLabel),1),m("button",ms,X(e.cssLabel),1),m("button",gs,X(e.jsLabel),1),o[0]||(o[0]=m("button",{type:"button","data-sve-code-back":"",hidden:""},null,-1)),o[1]||(o[1]=m("span",{"data-sve-code-path":""},null,-1)),o[2]||(o[2]=m("span",{"data-sve-code-status":""},null,-1)),m("button",vs,[m("span",{innerHTML:e.treeIcon},null,8,xs)]),o[3]||(o[3]=m("button",{type:"button","data-sve-code-autosave":"","aria-pressed":"true"},null,-1)),o[4]||(o[4]=m("button",{type:"button","data-sve-code-save":"",hidden:""},null,-1)),o[5]||(o[5]=m("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[18]||(o[18]=m("div",{"data-sve-code-lock-banner":""},null,-1)),m("div",ys,[m("div",bs,[m("div",ks,[m("span",null,X(e.htmlLabel),1),o[6]||(o[6]=m("div",{"data-sve-html-tools":""},null,-1)),o[7]||(o[7]=m("div",{"data-sve-visual-edit-tools":""},null,-1)),o[8]||(o[8]=m("div",{"data-sve-antlers-tools":""},null,-1))]),o[9]||(o[9]=m("div",{"data-sve-code-host":""},null,-1))]),o[15]||(o[15]=m("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),m("div",$s,[m("div",_s,[m("div",Ss,[m("span",null,X(e.cssLabel),1),o[10]||(o[10]=m("button",{type:"button","data-sve-css-add-class":""},null,-1)),o[11]||(o[11]=m("div",{"data-sve-css-tools":""},null,-1))]),o[12]||(o[12]=m("div",{"data-sve-css-subrow":""},[m("div",{"data-sve-css-sub":"box"}),m("div",{"data-sve-css-sub":"display"})],-1))]),o[13]||(o[13]=m("div",{"data-sve-code-host":""},null,-1))]),o[16]||(o[16]=m("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),m("div",Cs,[m("div",As,[m("span",null,X(e.jsLabel),1)]),o[14]||(o[14]=m("div",{"data-sve-code-host":""},null,-1))])])]))}},ws=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],Ts=["innerHTML"],Bs={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>(S(!0),C(D,null,ne(e.tools,n=>(S(),C("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:P(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:P(s=>e.onTool(n.id),["prevent"])},[n.letter?(S(),C(D,{key:0},[Xn(X(n.letter),1)],64)):(S(),C("span",{key:1,innerHTML:n.icon},null,8,Ts))],40,ws))),128))}},Ls=["aria-label"],Ms={value:""},Is=["label"],Os=["value"],Ho={__name:"CodeDockAntlersSelect",props:{label:{type:String,required:!0},groups:{type:Array,required:!0},onPick:{type:Function,required:!0}},setup(e){const t=e;function o(n){const s=n.target.value;n.target.value="",s&&t.onPick(s)}return(n,s)=>(S(),C("select",{"data-sve-antlers-select":"","aria-label":e.label,onChange:o},[m("option",Ms,X(e.label),1),(S(!0),C(D,null,ne(e.groups,r=>(S(),C("optgroup",{key:r.id,label:r.label},[(S(!0),C(D,null,ne(r.items,i=>(S(),C("option",{key:i.id,value:i.id},X(i.label),9,Os))),128))],8,Is))),128))],40,Ls))}},Hs=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Ds={__name:"CodeDockCssTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>(S(!0),C(D,null,ne(e.tools,n=>(S(),C("button",{key:n.id,type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:P(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:P(s=>e.onTool(n.id),["prevent"])},null,40,Hs))),128))}},js={key:0,"data-sve-css-sep":"","aria-hidden":"true"},Ps=["data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick"],Rs={__name:"CodeDockCssBoxRow",props:{sides:{type:Array,required:!0},onSide:{type:Function,required:!0}},setup(e){return(t,o)=>(S(!0),C(D,null,ne(e.sides,n=>(S(),C(D,{key:n.id},[n.sep?(S(),C("span",js)):Ct("",!0),m("button",{type:"button","data-sve-css-box-side":n.suffix,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:P(s=>e.onSide(n.suffix),["prevent","stop"])},null,8,Ps)],64))),128))}},qs={key:0,"data-sve-css-sep":"","aria-hidden":"true"},zs=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Ns={"data-sve-css-flex-extras":""},Fs={key:0,"data-sve-css-sep":"","aria-hidden":"true"},Vs=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Ws={__name:"CodeDockCssDisplayRow",props:{items:{type:Array,required:!0},extras:{type:Array,default:()=>[]},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>(S(),C(D,null,[(S(!0),C(D,null,ne(e.items,n=>(S(),C(D,{key:n.id},[n.sep?(S(),C("span",qs)):Ct("",!0),m("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:P(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:P(s=>e.onTool(n.id),["prevent"])},null,40,zs)],64))),128)),m("div",Ns,[(S(!0),C(D,null,ne(e.extras,n=>(S(),C(D,{key:n.id},[n.sep?(S(),C("span",Fs)):Ct("",!0),m("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:P(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:P(s=>e.onTool(n.id),["prevent"])},null,40,Vs)],64))),128))])],64))}},Us={key:0,"data-sve-css-swatches":""},Xs=["data-sve-css-token","title","data-active","onClick"],Ks=["data-sve-css-token","data-active","onClick"],Ht={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(e){return(t,o)=>e.kind==="colors"?(S(),C("div",Us,[m("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=P((...n)=>e.onClear&&e.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[m("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[m("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),(S(!0),C(D,null,ne(e.swatches,n=>(S(),C("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:Kn({background:n.hex||"transparent"}),onClick:P(s=>e.onPick(n.name),["prevent","stop"])},null,12,Xs))),128))])):(S(!0),C(D,{key:1},ne(e.choices,n=>(S(),C("button",{key:n.value,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:P(s=>e.onPick(n.value),["prevent","stop"])},X(n.label),9,Ks))),128))}},Ys={"data-sve-css-add-label":""},Zs=["placeholder","onKeydown"],Do={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0}},setup(e){const t=e,o=so(t.initial||""),n=so(null);Yn(()=>Zn(()=>{n.value?.focus(),n.value?.select()}));function s(){const r=o.value.trim();if(!r){n.value?.focus();return}t.onAdd(r)}return(r,i)=>(S(),C(D,null,[m("label",Ys,X(e.label),1),Gn(m("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":i[0]||(i[0]=a=>o.value=a),type:"text",placeholder:e.placeholder,onKeydown:[ro(P(s,["prevent"]),["enter"]),i[1]||(i[1]=ro(P(()=>{},["stop"]),["escape"]))]},null,40,Zs),[[Jn,o.value]])],64))}},jo=/^\.[a-zA-Z_][\w-]*$/;function Po(e){const t=String(e||"").match(/\[\s*([\s\S]*?)\s*\]/);return t?t[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).filter(o=>/^[a-zA-Z_][\w-]*$/.test(o)):[]}function Gs(e){const t=String(e||"").match(/\sclass\s*=\s*(["'])([^"']*)\1/i);return t?Po(t[2]):[]}function at(e){const t=String(e||""),o=[],n=/\sclass\s*=\s*(["'])/gi;let s;for(;s=n.exec(t);){const r=s[1],i=s.index+s[0].length,a=t.indexOf(r,i);if(a===-1)break;const c=t.slice(i,a).match(/\[([\s\S]*?)\]/);if(c){const f=c[1],u=i+c.index+1,p=f.replace(/\{\{[\s\S]*?\}\}/g,v=>" ".repeat(v.length)),g=/[a-zA-Z_][\w-]*/g;let b;for(;b=g.exec(p);)o.push({name:b[0],from:u+b.index,to:u+b.index+b[0].length})}n.lastIndex=a+1}return o}function co(e,t){return at(e).find(o=>t>=o.from&&t<=o.to)||null}function uo(e,t){const o=String(e||""),n=at(o);let s=o;for(let r=n.length-1;r>=0;r-=1){const i=n[r],a=t(i.name);if(a!==i.name){if(!a){let l=i.from,c=i.to;s[c]===" "?c+=1:l>0&&s[l-1]===" "&&(l-=1),s=s.slice(0,l)+s.slice(c);continue}s=s.slice(0,i.from)+a+s.slice(i.to)}}return s}function Ro(e){const t=[],o=/(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;let n;for(;n=o.exec(String(e||""));)t.push(n[2]);return t}function qo(e,t){const o=[],n=[],s=[];let r=0,i=0;for(;r<e.length&&i<t.length;){if(e[r]===t[i]){r+=1,i+=1;continue}const a=t.indexOf(e[r],i),l=e.indexOf(t[i],r);a===-1&&l===-1?(o.push({from:e[r],to:t[i]}),r+=1,i+=1):a===-1?(s.push(e[r]),r+=1):l===-1||a<=l?(n.push(t[i]),i+=1):(s.push(e[r]),r+=1)}for(;r<e.length;)s.push(e[r]),r+=1;for(;i<t.length;)n.push(t[i]),i+=1;return{renamed:o,added:n,removed:s}}function ye(e){let t=String(e||"").trim().replace(/^\.+/,"").replace(/\s+/g,"-").replace(/[^a-zA-Z0-9_-]/g,"");return/^[a-zA-Z_]/.test(t)||(t=t.replace(/^[^a-zA-Z_]+/,"")),jo.test(`.${t}`)?t:""}function Js(e,t){const o=String(e||""),n=ye(t);if(!o||!n)return o;const s=o.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(s){const r=s[1];let i=s[2];const a=[...i.matchAll(/\[([\s\S]*?)\]/g)];if(a.length){const l=a.map(g=>g[1].trim()).filter(Boolean).join(" "),f=Po(`[ ${l} ]`).includes(n)?l:`${l} ${n}`.trim(),u=i.indexOf("["),p=i.lastIndexOf("]");i=`${i.slice(0,u)}[ ${f} ]${i.slice(p+1)}`.replace(/\s+/g," ").trim()}else i=`[ ${n} ] ${i}`.replace(/\s+/g," ").trim();return o.slice(0,s.index)+` class=${r}${i}${r}`+o.slice(s.index+s[0].length)}return/\/\s*>$/.test(o)?o.replace(/(\s*)(\/\s*>)$/,` class="[ ${n} ]"$1$2`):o.replace(/(\s*)>$/,` class="[ ${n} ]"$1>`)}function Qs(e,t){const o=String(e).indexOf(">",t.from);return o===-1?"":e.slice(t.from,o+1)}function zo(e,t){const o=[];for(const n of t){const s=Gs(Qs(e,n)),r=zo(e,n.children||[]);if(s.length){o.push({className:s[0],children:r});for(const i of s.slice(1))o.push({className:i,children:[]})}else o.push(...r)}return o}function lt(e){return zo(e,rs(e))}function ot(e){return String(e).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Dt(e,t){if(e.startsWith("/*",t)){const o=e.indexOf("*/",t+2);return o===-1?e.length:o+2}return t}function jt(e,t){let o=0;for(let n=t;n<e.length;n+=1){if(e.startsWith("/*",n)){n=Dt(e,n)-1;continue}if(e[n]==="{")o+=1;else if(e[n]==="}"&&(o-=1,o===0))return n}return-1}function K(e,t){const o=String(e||""),n=new RegExp(`(^|[^\\w-])\\.${ot(t)}\\s*\\{`,"g");let s;for(;s=n.exec(o);){const r=s.index+s[1].length,i=o.indexOf("{",r);if(i===-1)continue;const a=jt(o,i);if(a!==-1)return{from:r,brace:i,close:a,to:a+1,name:t}}return null}function er(e){const t=String(e||""),o=[],n={},s=[];let r=0,i="";const a=()=>{const l=i.trim();l&&o.push(l),i=""};for(;r<t.length;){if(t.startsWith("/*",r)){const l=Dt(t,r);i+=t.slice(r,l),r=l;continue}if(t[r]==="{"){const l=i.trim(),c=jt(t,r);if(c===-1)break;const f=t.slice(r+1,c);i="",jo.test(l)?n[l.slice(1)]=f:l&&s.push(`${l} {${f}}`),r=c+1;continue}i+=t[r],r+=1}return a(),{decls:o.join(`
`),classes:n,other:s}}function fo(e,t){const o="    ".repeat(t);return String(e||"").split(`
`).map(n=>n.trim()?o+n.trim():"").filter((n,s,r)=>n||s>0&&s<r.length-1).join(`
`)}function tr(e,t){const o=K(e,t);return o?String(e).slice(o.brace+1,o.close):""}function No(e,t,o){const n=er(tr(t,e.className)),s="    ".repeat(o),r=[];n.decls&&r.push(fo(n.decls.replace(/;+\s*$/,";"),o+1));for(const a of n.other)r.push(fo(a,o+1));for(const a of e.children)r.push(No(a,t,o+1));const i=r.filter(Boolean).join(`
`);return i?`${s}.${e.className} {
${i}
${s}}`:`${s}.${e.className} {
${s}}`}function Pt(e,t){return t?.length?t.map(o=>No(o,e,0)).join(`

`)+`
`:""}function Fo(e){const t=String(e||"").match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);return t?t[1]:""}function or(e){const t=[],o=/\.([a-zA-Z_][\w-]*)\s*\{/g;let n,s=!0;for(;n=o.exec(String(e||""));){if(s){s=!1;continue}t.push(n[1])}return t}function nr(e,t){const o=String(e).lastIndexOf(`
`,t-1)+1,n=e.slice(o,t);return/^\s*$/.test(n)?n:""}function sr(e,t){return t?e.split(`
`).map((o,n)=>n===0||!o?o:t+o).join(`
`):e}function rr(e,t){let o=0;for(let n=0;n<t.from;n+=1){if(e.startsWith("/*",n)){n=Dt(e,n)-1;continue}e[n]==="{"?o+=1:e[n]==="}"&&(o-=1)}return o===0}function Rt(e,t,o){const n=Fo(t)||o;if(!n)return String(e||"");let s=String(t||"").trim();s?new RegExp(`^\\.${ot(n)}\\s*\\{`).test(s)||(s=`.${n} {
${s}
}`):s=`.${n} {
}`;let r=String(e||"");const i=K(r,n),a=or(s);if(i){const c=nr(r,i.from);r=r.slice(0,i.from)+sr(s,c)+r.slice(i.to)}else r=`${r.trimEnd()}${r.trim()?`
`:""}${s}
`;const l=K(r,n);if(!l)return r;for(const c of[...new Set(a)].reverse()){const f=new RegExp(`(^|[^\\w-])\\.${ot(c)}\\s*\\{`,"g"),u=[];let p;for(;p=f.exec(r);){const g=p.index+p[1].length,b=r.indexOf("{",g),v=jt(r,b);v!==-1&&u.push({from:g,to:v+1})}for(const g of u.reverse()){if(g.from>=l.from&&g.to<=l.to||!rr(r,g))continue;let b=g.from;const v=r.lastIndexOf(`
`,b-1)+1;/^\s*$/.test(r.slice(v,b))&&(b=v);let I=g.to;r[I]===`
`&&(I+=1),r=r.slice(0,b)+r.slice(I)}}return r}function kt(e,t){const o=String(e||"");return`${o.trimEnd()}${o.trim()?`
`:""}.${t} {
}
`}function ir(e,t,o){const n=ye(o);return!t||!n||t===n?String(e||""):K(e,n)?Vo(e,t):String(e||"").replace(new RegExp(`(^|[^\\w-])\\.${ot(t)}(\\s*\\{)`,"g"),`$1.${n}$2`)}function Vo(e,t){let o=String(e||"");for(;;){const n=K(o,t);if(!n)break;let s=n.from;const r=o.lastIndexOf(`
`,s-1)+1;/^\s*$/.test(o.slice(r,s))&&(s=r);let i=n.to;o[i]===`
`&&(i+=1),o=o.slice(0,s)+o.slice(i)}return o}function ar(e,t,o){const n=Array.isArray(t)?t:[],s=Array.isArray(o)?o:[],{renamed:r,added:i}=qo(n,s),a=new Set(s);let l=String(e||"");for(const c of r){const f=ye(c.to);if(f){if(a.has(c.from)){K(l,f)||(l=kt(l,f));continue}K(l,c.from)?l=ir(l,c.from,f):K(l,f)||(l=kt(l,f))}}for(const c of i){const f=ye(c);!f||K(l,f)||(l=kt(l,f))}return l}function lr(e,t,o){const n=new Set(Array.isArray(t)?t:[]),s=new Set(Array.isArray(o)?o:[]);let r=String(e||"");for(const i of s)n.has(i)||(r=Vo(r,i));return r}const Ye="visual_edit",cr=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],Wo=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function dr(e){return Wo.find(t=>t.id===e)||null}function ur(e,t,o,n){let s=t;for(;s<o;){const r=e.indexOf("{{",s);if(r===-1||r>=o)return null;const i=e.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const a=e.slice(r+2,i);if((a.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:a};s=i+2}return null}function fr(e,t){const o=String(t).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(e)}const le="__sve-partial-menu",pr=/\{\{#([\s\S]*?)#\}\}/g,po=/\{\{\s*partial(?::([^\s}]+)|(?=[\s}]))([\s\S]*?)\}\}/gi,$t=new Map;function Uo(e){const t=String(e||"").replace(pr,s=>" ".repeat(s.length)),o=[];po.lastIndex=0;let n;for(;n=po.exec(t);){const s=(n[1]||"").trim(),i=(n[2]||"").match(/\bsrc\s*=\s*(["'])([^"']+)\1/i),a=s||(i?i[2].trim():"");!a||a.includes("..")||o.push({from:n.index,to:n.index+n[0].length,src:a})}return o}function ho(e,t){return Uo(e).find(o=>t>=o.from&&t<=o.to)||null}const hr=new Set(["if","elseif","else","unless","foreach","forelse","noparse","once","cache","nocache","section","yield","partial","slot","switch","case","vite","sve_html","sve_css","sve_js","sve_tw","style_push","script_push"]);function mr(e,t){const o=[],n=/\{\{\s*(\/?)([A-Za-z_][A-Za-z0-9_]*)\b[\s\S]*?\}\}/g;let s;for(;s=n.exec(String(e||""));){const i=s[2];if(!hr.has(i.toLowerCase())){if(!s[1]){o.push({name:i,from:s.index,to:null});continue}for(let a=o.length-1;a>=0;a-=1)if(o[a].name===i&&o[a].to==null){o[a].to=s.index+s[0].length;break}}}let r=null;for(const i of o)i.to==null||t<i.from||t>i.to||(!r||i.to-i.from<r.to-r.from)&&(r=i);return r?.name||null}function gr(e,t){const o=new Set,n=s=>{if(Array.isArray(s)){if(!t){for(const r of s)r&&typeof r=="object"&&typeof r.type=="string"&&r.type&&o.add(r.type),n(r);return}s.forEach(n);return}if(!(!s||typeof s!="object")){if(t&&Array.isArray(s[t]))for(const r of s[t])r&&typeof r=="object"&&typeof r.type=="string"&&r.type&&o.add(r.type);Object.values(s).forEach(n)}};return n(e),o}function vr(e,t,o,n){if(!e.src.includes("{")||!n)return t;const s=mr(o,e.from),r=gr(n,s);return s?t.filter(i=>r.has(i.label)):r.size===0?t:t.filter(i=>r.has(i.label))}function xr(e,t){if($t.has(t))return $t.get(t);const o=e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>Array.isArray(n.items)?n.items:[]).catch(()=>[]);return $t.set(t,o),o}let Ie=null;function mo(e){e.clearTimeout(Ie),Ie=null}function yr(e,t){Ie||(Ie=e.setTimeout(()=>{Ie=null,t?.()},180))}function J(e){e?.getElementById(le)?.remove()}function br(e,t,o,n,{onOpen:s,emptyLabel:r,onStay:i,onLeave:a}){const l=e.document;J(l);const c=l.createElement("div");if(c.id=le,c.style.left=`${Math.max(8,Math.round(o))}px`,c.style.top=`${Math.max(8,Math.round(n))}px`,t.length)t.forEach(b=>{const v=l.createElement("button");v.type="button",v.setAttribute("data-sve-partial-choice",""),v.textContent=b.label,v.title=b.path||b.type,v.addEventListener("click",I=>{I.preventDefault(),I.stopPropagation(),J(l),s?.(b.type)}),c.appendChild(v)});else{const b=l.createElement("div");b.setAttribute("data-sve-partial-empty",""),b.textContent=r||"",c.appendChild(b)}l.body.appendChild(c);const f=c.getBoundingClientRect(),u=8;let p=f.left,g=f.top;f.right>e.innerWidth-u&&(p=Math.max(u,e.innerWidth-f.width-u)),f.bottom>e.innerHeight-u&&(g=Math.max(u,e.innerHeight-f.height-u)),c.style.left=`${Math.round(p)}px`,c.style.top=`${Math.round(g)}px`,c.addEventListener("mouseenter",()=>i?.()),c.addEventListener("mouseleave",()=>a?.())}function kr(e){const t=e.Decoration.mark({class:"sve-cm-partial"}),o=e.Decoration.line({class:"sve-cm-partial-line"}),n=e.StateEffect.define(),s=e.StateField.define({create(i){return go(i,e,t)},update(i,a){return a.docChanged?go(a.state,e,t):i},provide:i=>e.EditorView.decorations.from(i)}),r=e.StateField.define({create(){return e.Decoration.none},update(i,a){let l;for(const p of a.effects)p.is(n)&&(l=p.value);if(l===void 0)return a.docChanged?e.Decoration.none:i;if(!l)return e.Decoration.none;const c=new e.RangeSetBuilder,f=a.state.doc.lineAt(l.from),u=a.state.doc.lineAt(l.to);for(let p=f.number;p<=u.number;p+=1){const g=a.state.doc.line(p);c.add(g.from,g.from,o)}return c.finish()},provide:i=>e.EditorView.decorations.from(i)});return{extensions:[s,r],setHover(i,a){i&&i.dispatch({effects:n.of(a)})}}}function go(e,t,o){const n=new t.RangeSetBuilder;for(const s of Uo(e.doc.toString()))n.add(s.from,s.to,o);return n.finish()}function $r(e,t,{onOpen:o,emptyLabel:n,sectionValues:s,isLocked:r,setHover:i}){if(!t?.dom||t.dom._svePartialBound)return;t.dom._svePartialBound=!0;let a=null,l="",c="";const f=()=>{mo(e),e.clearTimeout(a),a=null,c="",l="",i?.(t,null),J(e.document)},u={stay:()=>mo(e),leave:()=>yr(e,f)},p=()=>{e.clearTimeout(a),a=null,c="",i?.(t,null)},g=()=>!!r?.(),b=(v,I,O,{click:ie}={})=>{if(g()){J(e.document),i?.(t,null);return}l=v.src,xr(e,v.src).then(we=>{if(l!==v.src)return;const Un=t.state.doc.toString(),Ke=vr(v,we,Un,s?.()||null);if(Ke.length===1){ie&&(J(e.document),o?.(Ke[0].type));return}!Ke.length&&!ie||br(e,Ke,I,O,{onOpen:o,emptyLabel:n,onStay:u.stay,onLeave:u.leave})})};t.dom.addEventListener("mousemove",v=>{if(g()){f();return}const I=t.posAtCoords({x:v.clientX,y:v.clientY});if(I==null)return;const O=ho(t.state.doc.toString(),I);if(!O){e.clearTimeout(a),a=null,c="",u.leave();return}u.stay(),i?.(t,{from:O.from,to:O.to}),!(c===O.src&&a)&&(p(),c=O.src,a=e.setTimeout(()=>{const ie=t.coordsAtPos(O.from);b(O,ie?.left??v.clientX,(ie?.bottom??v.clientY)+6)},280))}),t.dom.addEventListener("mouseleave",v=>{if(v.relatedTarget?.closest?.(`#${le}`)){u.stay();return}u.leave()}),t.dom.addEventListener("click",v=>{if(g()){J(e.document);return}const I=t.posAtCoords({x:v.clientX,y:v.clientY});if(I==null)return;const O=ho(t.state.doc.toString(),I);O&&(p(),b(O,v.clientX,v.clientY+8,{click:!0}))}),_r(e.document)||(e.document.addEventListener("mousedown",v=>{v.target.closest(`#${le}, .sve-cm-partial`)||J(e.document)}),e.document._svePartialDismiss=!0)}function _r(e){return!!e._svePartialDismiss}const Q="__sve-css-rename-chip",Sr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function Cr(e){const t=e.Decoration.mark({class:"sve-cm-css-token"}),o=e.StateEffect.define();return{extensions:[e.StateField.define({create(){return e.Decoration.none},update(s,r){let i;for(const l of r.effects)l.is(o)&&(i=l.value);if(i===void 0)return r.docChanged?e.Decoration.none:s;if(!i)return e.Decoration.none;const a=new e.RangeSetBuilder;return a.add(i.from,i.to,t),a.finish()},provide:s=>e.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function oe(e){e?.getElementById(Q)?.remove()}function Ar(e,t,o,n){t.style.left=`${Math.max(6,Math.min(o,e.innerWidth-28))}px`,t.style.top=`${Math.max(6,n)}px`}function Er(e,t,o,{onRename:n,title:s}){const r=e.document,i=t.coordsAtPos(o.to);if(!i)return;oe(r);const a=r.createElement("button");a.id=Q,a.type="button",a.innerHTML=Sr,a.title=s,a.setAttribute("aria-label",s),a.addEventListener("mousedown",l=>{l.preventDefault(),l.stopPropagation(),oe(r),n?.(o)}),a.addEventListener("mouseleave",()=>{e.setTimeout(()=>{t.dom.matches(":hover")||a.matches(":hover")||oe(r)},120)}),r.body.appendChild(a),Ar(e,a,i.right+2,i.top-1)}function wr(e,t,{onRename:o,isLocked:n,setHover:s,title:r}){if(!t?.dom||t.dom._sveClassTokenBound)return;t.dom._sveClassTokenBound=!0;let i=null,a="";const l=()=>!!n?.(),c=()=>{e.clearTimeout(i),i=null,a="",s?.(t,null),oe(e.document)},f=u=>{if(l()){c();return}c(),o?.(u)};t.dom.addEventListener("mousemove",u=>{if(l()){c();return}if(u.target?.closest?.(`#${Q}`))return;const p=t.posAtCoords({x:u.clientX,y:u.clientY});if(p==null)return;const g=co(t.state.doc.toString(),p);if(!g){e.clearTimeout(i),i=null,a="",s?.(t,null);return}const b=`${g.from}:${g.to}:${g.name}`;s?.(t,{from:g.from,to:g.to}),!(a===b&&(i||e.document.getElementById(Q)))&&(e.clearTimeout(i),a=b,i=e.setTimeout(()=>{i=null,Er(e,t,g,{onRename:f,title:r||"Rename class"})},160))}),t.dom.addEventListener("mouseleave",u=>{u.relatedTarget?.closest?.(`#${Q}`)||e.setTimeout(()=>{e.document.getElementById(Q)?.matches(":hover")||c()},160)}),t.dom.addEventListener("dblclick",u=>{if(l())return;const p=t.posAtCoords({x:u.clientX,y:u.clientY});if(p==null)return;const g=co(t.state.doc.toString(),p);g&&(u.preventDefault(),u.stopPropagation(),f(g))},!0),t.scrollDOM?.addEventListener("scroll",c),e.document._sveClassTokenDismiss||(e.document._sveClassTokenDismiss=!0,e.document.addEventListener("mousedown",u=>{u.target.closest(`#${Q}`)||oe(e.document)}))}const Xo=["sm","md","lg","xl","2xl","max-sm","max-md","max-lg","max-xl","max-2xl","dark","hover","focus","focus-visible","active","disabled","group-hover"],vo={sm:"(min-width: 640px)",md:"(min-width: 768px)",lg:"(min-width: 1024px)",xl:"(min-width: 1280px)","2xl":"(min-width: 1536px)","max-sm":"(max-width: 639px)","max-md":"(max-width: 767px)","max-lg":"(max-width: 1023px)","max-xl":"(max-width: 1279px)","max-2xl":"(max-width: 1535px)",dark:"(prefers-color-scheme: dark)"},xo={hover:":hover",focus:":focus","focus-visible":":focus-visible",active:":active",disabled:":disabled","group-hover":":is(:where(.group):hover *)"},Tr={relative:"position: relative",absolute:"position: absolute",fixed:"position: fixed",sticky:"position: sticky",static:"position: static",block:"display: block",inline:"display: inline","inline-block":"display: inline-block",flex:"display: flex","inline-flex":"display: inline-flex",grid:"display: grid",hidden:"display: none","flex-row":"flex-direction: row","flex-col":"flex-direction: column","flex-wrap":"flex-wrap: wrap","items-start":"align-items: flex-start","items-center":"align-items: center","items-end":"align-items: flex-end","items-stretch":"align-items: stretch","justify-start":"justify-content: flex-start","justify-center":"justify-content: center","justify-end":"justify-content: flex-end","justify-between":"justify-content: space-between","justify-around":"justify-content: space-around","text-left":"text-align: left","text-center":"text-align: center","text-right":"text-align: right","w-full":"width: 100%","h-full":"height: 100%","w-screen":"width: 100vw","h-screen":"height: 100vh","overflow-hidden":"overflow: hidden","overflow-auto":"overflow: auto","pointer-events-none":"pointer-events: none",underline:"text-decoration-line: underline",italic:"font-style: italic","font-bold":"font-weight: 700","font-medium":"font-weight: 500",uppercase:"text-transform: uppercase",truncate:"overflow: hidden; text-overflow: ellipsis; white-space: nowrap","z-10":"z-index: 10","z-20":"z-index: 20","z-50":"z-index: 50"},Br={p:"padding",px:"padding-inline",py:"padding-block",pt:"padding-top",pr:"padding-right",pb:"padding-bottom",pl:"padding-left",m:"margin",mx:"margin-inline",my:"margin-block",mt:"margin-top",mr:"margin-right",mb:"margin-bottom",ml:"margin-left",gap:"gap","gap-x":"column-gap","gap-y":"row-gap",w:"width",h:"height","min-w":"min-width","min-h":"min-height","max-w":"max-width","max-h":"max-height"},Lr={bg:"background-color",border:"border-color",outline:"outline-color",fill:"fill",stroke:"stroke"};let _t=null;function Ko(e){return e?.Statamic?.$config?.get?.("sveFeatures")?.tailwind_dock===!0}function Mr(e){return t=>{if(!Ko(e)||!Or(t))return null;const o=t.matchBefore(/[^\s"']*$/),n=o?.text??"";return n.includes("{")||n.includes("}")?null:Yo(e).then(s=>{const r=jr(n,s).slice(0,80);return r.length?{from:o?o.from:t.pos,options:r,validFor:/^[^\s"'=]*$/}:null})}}function Ir(e,t){return e((o,n)=>{if(!Ko(t))return null;const s=Hr(o.state,n);return s?Yo(t).then(r=>{const i=Pr(s.text,r);return i?{pos:s.from,end:s.to,create(){return{dom:zr(i,Rr(s.text,r))}}}:null}):null})}function yo(e){const t={color:[],spacing:[],text:[],leading:[],font:[],radius:[]},o=/--(color|spacing|text|leading|font|radius)-([a-zA-Z0-9][a-zA-Z0-9._-]*)\s*:\s*([^;]+);/g;let n;for(;n=o.exec(String(e||""));)n[2]!=="*"&&t[n[1]].push({name:n[2],value:n[3].trim()});const s=[];Object.entries(Tr).forEach(([i,a])=>{s.push({label:i,css:a,color:null})}),t.color.forEach(({name:i,value:a})=>{const l=qr(a);Object.entries(Lr).forEach(([c,f])=>{s.push({label:`${c}-${i}`,css:`${f}: var(--color-${i})`,color:l})}),s.push({label:`text-${i}`,css:`color: var(--color-${i})`,color:l})}),t.spacing.forEach(({name:i})=>{Object.entries(Br).forEach(([a,l])=>{s.push({label:`${a}-${i}`,css:`${l}: var(--spacing-${i})`,color:null})})}),t.text.forEach(({name:i})=>{s.push({label:`text-${i}`,css:`font-size: var(--text-${i})`,color:null})}),t.leading.forEach(({name:i})=>{s.push({label:`leading-${i}`,css:`line-height: var(--leading-${i})`,color:null})}),t.font.forEach(({name:i})=>{s.push({label:`font-${i}`,css:`font-family: var(--font-${i})`,color:null})}),t.radius.forEach(({name:i})=>{s.push({label:i==="DEFAULT"?"rounded":`rounded-${i}`,css:`border-radius: var(--radius-${i})`,color:null})});const r=new Map;return s.forEach(i=>{r.has(i.label)||r.set(i.label,i)}),{items:[...r.values()],byUtility:r}}function Yo(e){return _t||(_t=e.fetch("/!/sve/tailwind-theme",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(t=>t.ok?t.json():{css:""}).then(t=>yo(typeof t.css=="string"?t.css:"")).catch(()=>yo(""))),_t}function Or(e){return!!(e.matchBefore(/class\s*=\s*"[^"]*$/i)||e.matchBefore(/class\s*=\s*'[^']*$/i))}function Hr(e,t){const o=e.doc.lineAt(t),n=t-o.from,s=Dr(o.text,n);if(!s)return null;const r=o.text.slice(s.valueFrom,s.valueTo),i=n-s.valueFrom,a=r.slice(0,i),l=r.slice(i),c=(a.match(/[^\s]*$/)||[""])[0],f=(l.match(/^[^\s]*/)||[""])[0],u=c+f;if(!u||u.includes("{"))return null;const p=o.from+s.valueFrom+(a.length-c.length);return{from:p,to:p+u.length,text:u}}function Dr(e,t){const o=/\bclass\s*=\s*(["'])/gi;let n;for(;n=o.exec(e);){const s=n[1],r=n.index+n[0].length,i=e.indexOf(s,r),a=i===-1?e.length:i;if(t>=r&&t<=a)return{valueFrom:r,valueTo:a}}return null}function qt(e){const t=[...Xo].sort((i,a)=>a.length-i.length),o=[];let n=String(e||""),s=!0;for(;s;){s=!1;for(const i of t){const a=`${i}:`;if(n.startsWith(a)){o.push(i),n=n.slice(a.length),s=!0;break}}}let r=!1;return n.startsWith("!")?(r=!0,n=n.slice(1)):n.endsWith("!")&&(r=!0,n=n.slice(0,-1)),{variants:o,utility:n,important:r}}function jr(e,t){const{variants:o,utility:n}=qt(e),s=o.length?`${o.join(":")}:`:"",r=n.toLowerCase(),i=[];return!r&&!s&&Xo.forEach(a=>{i.push({label:`${a}:`,type:"keyword",detail:"variant",boost:2})}),t.items.forEach(a=>{if(r&&!a.label.startsWith(r)&&!a.label.includes(r))return;const l=`${s}${a.label}`;i.push({label:l,type:"property",detail:a.css,boost:a.label.startsWith(r)?1:0})}),i.sort((a,l)=>(l.boost||0)-(a.boost||0)||a.label.localeCompare(l.label))}function Pr(e,t){const{variants:o,utility:n,important:s}=qt(e),r=t.byUtility.get(n);if(!r)return"";let i=r.css;s&&(i+=" !important");const a=e.replace(/[^a-zA-Z0-9_-]/g,u=>`\\${u}`);let l="";const c=[];o.forEach(u=>{vo[u]?c.push(vo[u]):xo[u]&&(l+=xo[u])});let f=`.${a}${l} { ${i} }`;return c.slice().reverse().forEach(u=>{f=`@media ${u} {
  ${f}
}`}),f}function Rr(e,t){const{utility:o}=qt(e);return t.byUtility.get(o)?.color||null}function qr(e){const t=String(e||"").trim();return/^#([0-9a-fA-F]{3,8})$/.test(t)?t:null}function zr(e,t){const o=document.createElement("div");if(o.className="sve-tw-info",t){const s=document.createElement("span");s.className="sve-tw-swatch",s.style.background=t,o.appendChild(s)}const n=document.createElement("pre");return n.textContent=e,o.appendChild(n),o}let te,At,Zo,Go,Jo,me,nt,zt,Nt,Ft,Vt,Qo,en,tn,on,nn,sn,rn,an,ln,cn,dn,un,fn,pn,hn,mn,L,Te=null;function Nr(){return Te||(Te=Promise.all([G(()=>import("./index-Dpuj8sxX.js").then(e=>e.i),__vite__mapDeps([0,1]),import.meta.url),G(()=>import("./index-B5fiB6ig.js"),[],import.meta.url),G(()=>import("./index-eMi007Cw.js"),__vite__mapDeps([2,1,0,3,4]),import.meta.url),G(()=>import("./index-D2YMCfE7.js"),__vite__mapDeps([5,1,0,3,4]),import.meta.url),G(()=>import("./html-tag-sync-BlP2Mk13.js").then(e=>e.g),__vite__mapDeps([6,0,1,7,4,3,5,2]),import.meta.url),G(()=>import("./index-BatCsQTe.js").then(e=>e.i),__vite__mapDeps([7,4,3,1,0]),import.meta.url),G(()=>import("./html-tag-sync-BlP2Mk13.js").then(e=>e.f),__vite__mapDeps([6,0,1,7,4,3,5,2]),import.meta.url),G(()=>import("./index-zsjA895l.js"),__vite__mapDeps([3,4,1,0]),import.meta.url),G(()=>import("./index-BsAZfAgM.js").then(e=>e.i),[],import.meta.url)]).then(([e,t,o,n,s,r,i,a,l])=>{te=e.EditorView,At=e.keymap,Zo=e.lineNumbers,Go=e.highlightActiveLine,Jo=e.highlightActiveLineGutter,me=t.Compartment,nt=t.EditorState,zt=t.StateField,Nt=t.StateEffect,Ft=t.RangeSetBuilder,Vt=e.Decoration,Qo=o.defaultKeymap,en=o.indentWithTab,tn=o.historyKeymap,on=o.history,nn=n.autocompletion,sn=n.closeBrackets,rn=n.closeBracketsKeymap,an=n.closeCompletion,ln=n.completionKeymap,cn=e.hoverTooltip,dn=s.htmlLanguage,un=s.html,fn=r.css,pn=i.javascript,hn=a.HighlightStyle,mn=a.syntaxHighlighting,L=l.tags,De.html=new me,De.css=new me,De.js=new me,je.html=new me,je.css=new me,je.js=new me}).catch(e=>{throw Te=null,e}),Te)}const d="__sve-code-dock",bo="__sve-code-dock-style",U="__sve-code-dock-unlock",gn="sve-code-dock-height",vn="sve-code-dock-panes",xn="sve-code-dock-widths",Wt="sve-html-scope-v2",yn="sve-code-dock-autosave",Fr=280,bn=120,St=140,Vr=250,R=["html","css","js"],Wr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Ur='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',Xr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',kn='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',Kr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',Yr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',Zr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',T="__sve-css-menu",$n=["h1","h2","h3","h4","h5","h6"],Et=[{id:"heading",title:"heading",menu:"heading",letter:"H"},{id:"p",title:"paragraph",tag:"p",letter:"P"},{id:"div",title:"div",tag:"div"},{id:"section",title:"section",tag:"section"},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"}],Gr=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],_n=[{id:"all",suffix:"",title:"all"},{id:"block",suffix:"-block",title:"block",sep:!0},{id:"block-start",suffix:"-block-start",title:"block start"},{id:"block-end",suffix:"-block-end",title:"block end"},{id:"inline",suffix:"-inline",title:"inline",sep:!0},{id:"inline-start",suffix:"-inline-start",title:"inline start"},{id:"inline-end",suffix:"-inline-end",title:"inline end"}],Sn=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],wt=[{id:"display",title:"display",menu:"display"},{id:"absolute",title:"absolute",insert:"position: absolute;"},{id:"color",title:"color",property:"color",menu:"colors"},{id:"bg",title:"background color",property:"background-color",menu:"colors"},{id:"padding",title:"padding",property:"padding",menu:"box"},{id:"margin",title:"margin",property:"margin",menu:"box"}],Tt=[{id:"display-flex",title:"flex",display:"flex"},{id:"flex-row",title:"row",flexDir:"row",sep:!0},{id:"flex-col",title:"column",flexDir:"column"}],Bt=[{id:"justify-start",title:"justify start",property:"justify-content",value:"flex-start"},{id:"justify-center",title:"justify center",property:"justify-content",value:"center"},{id:"justify-end",title:"justify end",property:"justify-content",value:"flex-end"},{id:"justify-between",title:"space between",property:"justify-content",value:"space-between"},{id:"justify-around",title:"space around",property:"justify-content",value:"space-around"},{id:"align-start",title:"align start",property:"align-items",value:"flex-start",group:"align"},{id:"align-center",title:"align center",property:"align-items",value:"center",group:"align"},{id:"align-end",title:"align end",property:"align-items",value:"flex-end",group:"align"},{id:"align-stretch",title:"align stretch",property:"align-items",value:"stretch",group:"align"}],Ze={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 13.5 L8 2.5 L12 13.5"/><path d="M5.4 10h5.2"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="12" height="12" rx="2" opacity=".85"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>'},Jr={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>'};let Ge=null,be=null,E=null,ce=[],V={html:"",css:"",js:""},M=!1,ke=!1,$=null,Be=0,Z=null,z=null,ge=null,Oe=null,Re=!1,q=!1,H=!0,B=!1,y=null,A="",_="",Y="full",de="",ae=null,He=null,Le=null,Me=null,ko=!1;const h={html:null,css:null,js:null},De={html:null,css:null,js:null},je={html:null,css:null,js:null};function x(e,t,o={}){let n=e.Statamic?.$config?.get?.("sveStrings")?.[t]??t;for(const[s,r]of Object.entries(o))n=String(n).replaceAll(`:${s}`,r);return n}function Cn(e){return e.document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||e.Statamic?.$config?.get?.("csrfToken")||e.Statamic?.$config?.get?.("csrf_token")||""}function Qr(){return[te.theme({"&":{height:"auto",backgroundColor:"#1e1e1e",color:"#d4d4d4"},".cm-content":{caretColor:"#aeafad",padding:"12px 0",fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:"13px",lineHeight:"1.55"},".cm-cursor":{borderLeftColor:"#aeafad"},".cm-activeLine":{backgroundColor:"#ffffff0d"},".cm-activeLineGutter":{backgroundColor:"#ffffff0d"},".cm-gutters":{backgroundColor:"#1e1e1e",color:"#858585",border:"none",borderRight:"1px solid #3c3c3c",fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:"13px",lineHeight:"1.55"},".cm-lineNumbers .cm-gutterElement":{paddingLeft:"8px",paddingRight:"12px"},".cm-scroller":{overflow:"visible",height:"auto",minHeight:0},".cm-selectionBackground, &.cm-focused .cm-selectionBackground":{backgroundColor:"#264f78 !important"}},{dark:!0}),mn(hn.define([{tag:L.keyword,color:"#569cd6"},{tag:L.string,color:"#ce9178"},{tag:L.comment,color:"#6a9955",fontStyle:"italic"},{tag:L.number,color:"#b5cea8"},{tag:L.className,color:"#d7ba7d"},{tag:L.tagName,color:"#4ec9b0"},{tag:L.propertyName,color:"#9cdcfe"},{tag:L.variableName,color:"#9cdcfe"},{tag:L.attributeName,color:"#9cdcfe"},{tag:L.attributeValue,color:"#ce9178"},{tag:L.angleBracket,color:"#808080"},{tag:L.unit,color:"#b5cea8"},{tag:L.color,color:"#ce9178"},{tag:L.bracket,color:"#ffd700"},{tag:L.punctuation,color:"#d4d4d4"},{tag:L.operator,color:"#d4d4d4"}]))]}function ei(e){return e==="css"?fn():e==="js"?pn():un({autoCloseTags:!0})}function ti(e){return e.querySelector(".live-preview")||e.body}function Lt(e,t){const o=ti(e);t.parentElement!==o&&o.appendChild(t)}function $o(e){if(e._sveShield)return;e._sveShield=!0;const t=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])e.addEventListener(o,t)}function oi(e){try{return new URLSearchParams(e.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function ni(e){const t=parseInt(Fe(e,gn)??"",10);return Number.isFinite(t)&&t>=bn?t:Fr}function si(e,t){Ce(e,gn,String(t))}function An(e){try{const t=JSON.parse(Fe(e,vn)||"null");if(t&&typeof t=="object")return{html:t.html!==!1,css:t.css!==!1,js:t.js===!0}}catch{}return{html:!0,css:!0,js:!1}}function ri(e,t){Ce(e,vn,JSON.stringify(t))}function En(e){try{const t=JSON.parse(Fe(e,xn)||"null");if(t&&typeof t=="object"){const o=n=>Number.isFinite(n)&&n>0?n:1;return{html:o(t.html),css:o(t.css),js:o(t.js)}}}catch{}return{html:1,css:1,js:1}}function ii(e,t){Ce(e,xn,JSON.stringify(t))}function ai(e){let t=e.getElementById(bo);t||(t=e.createElement("style"),t.id=bo,e.head.appendChild(t)),t.textContent=`
@keyframes sve-cm-wait { to { transform: rotate(360deg); } }
#${d} {
  position: fixed;
  /* Same band as the right dock: above the page, under Statamic stacks. */
  z-index: var(--z-index-above, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #1e1e1e;
  color: #d4d4d4;
  border-top: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 -8px 24px rgba(0,0,0,.28);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${d} [data-sve-code-bar] {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  user-select: none;
  cursor: ns-resize;
}
#${d} [data-sve-code-pane-btn] {
  all: unset;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .02em;
  opacity: .55;
}
#${d} [data-sve-code-pane-btn][aria-pressed="true"] {
  background: rgba(255,255,255,.12);
  opacity: 1;
}
#${d} [data-sve-code-path] {
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  opacity: .4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  margin-left: 4px;
}
#${d} [data-sve-code-back] {
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
#${d} [data-sve-code-back]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${d} [data-sve-code-back][hidden] {
  display: none;
}
#${d} [data-sve-code-status] {
  margin-left: auto;
  font-size: 11px;
  opacity: .7;
  flex: 0 0 auto;
}
#${d} [data-sve-code-lock] {
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
#${d} [data-sve-code-lock]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${d} [data-sve-code-lock][aria-pressed="true"] {
  opacity: 1;
  color: #fbbf24;
  background: rgba(251,191,36,.12);
}
#${d} [data-sve-code-lock][hidden] {
  display: none;
}
#${d} [data-sve-html-scope] {
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
#${d} [data-sve-html-scope]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${d} [data-sve-html-scope][aria-pressed="true"] {
  opacity: 1;
  color: #93c5fd;
  background: rgba(56,88,233,.22);
}
#${d} [data-sve-code-autosave],
#${d} [data-sve-code-save] {
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
#${d} [data-sve-code-autosave]:hover,
#${d} [data-sve-code-save]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${d} [data-sve-code-autosave][aria-pressed="true"] {
  opacity: 1;
  color: #93c5fd;
  background: rgba(56,88,233,.22);
}
#${d} [data-sve-code-save][data-dirty] {
  opacity: 1;
  color: #93c5fd;
  background: rgba(56,88,233,.22);
}
#${d} [data-sve-code-save][hidden] {
  display: none;
}
#${d}[data-sve-code-locked] [data-sve-code-autosave],
#${d}[data-sve-code-locked] [data-sve-html-scope],
#${d}[data-sve-code-locked] [data-sve-code-save] {
  pointer-events: none;
  opacity: .28;
}
#${d}[data-sve-code-locked] [data-sve-css-tools],
#${d}[data-sve-code-locked] [data-sve-css-subrow],
#${d}[data-sve-code-locked] [data-sve-html-tools],
#${d}[data-sve-code-locked] [data-sve-antlers-tools],
#${d}[data-sve-code-locked] [data-sve-visual-edit-tools],
#${d}[data-sve-code-locked] [data-sve-css-add-class] {
  pointer-events: none;
  opacity: .28;
}
#${d}[data-sve-code-locked] [data-sve-code-pane] .cm-editor {
  opacity: .62;
}
#${d} [data-sve-code-lock-banner] {
  display: none;
  flex: 0 0 auto;
  padding: 6px 12px;
  font-size: 11px;
  line-height: 1.4;
  color: #fbbf24;
  background: rgba(251,191,36,.08);
  border-bottom: 1px solid rgba(251,191,36,.18);
}
#${d}[data-sve-code-locked] [data-sve-code-lock-banner] {
  display: block;
}
#${U} {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.5);
}
#${U} [data-sve-unlock-card] {
  width: min(420px, calc(100vw - 32px));
  padding: 20px;
  border-radius: 12px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 16px 40px rgba(0,0,0,.45);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${U} [data-sve-unlock-title] {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}
#${U} [data-sve-unlock-body] {
  font-size: 13px;
  line-height: 1.45;
  opacity: .75;
  margin-bottom: 18px;
}
#${U} [data-sve-unlock-actions] {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
#${U} [data-sve-unlock-actions] button {
  all: unset;
  cursor: pointer;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}
#${U} [data-sve-unlock-cancel] {
  background: rgba(255,255,255,.1);
  color: #d4d4d4;
}
#${U} [data-sve-unlock-confirm] {
  background: #b45309;
  color: #fff;
}
#${d} [data-sve-code-grip] {
  flex: 0 0 16px;
  height: 16px;
  width: 100%;
  cursor: ns-resize;
  z-index: 3;
  ${lo("ns")}
  background-color: var(--theme-color-gray-800, #27272a);
}
#${d} .sve-code-dock {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
#${d} [data-sve-code-panes] {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  overflow: hidden;
}
#${d} [data-sve-code-pane] {
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
#${d} [data-sve-code-pane-label] {
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
#${d} [data-sve-code-pane-label] > span {
  opacity: .38;
}
#${d} [data-sve-css-add-class] {
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
#${d} [data-sve-css-add-class]:hover,
#${d} [data-sve-css-add-class][data-open] {
  background: rgba(255,255,255,.16);
  opacity: 1;
}
#${d} [data-sve-css-tools],
#${d} [data-sve-html-tools] {
  pointer-events: auto;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 1px;
  min-width: 0;
  overflow-x: auto;
}
#${d} [data-sve-html-tools] {
  flex: 1 1 auto;
}
#${d} [data-sve-antlers-tools],
#${d} [data-sve-visual-edit-tools] {
  pointer-events: auto;
  flex: 0 0 auto;
  align-self: stretch;
  margin: -7px 0;
  padding-right: 8px;
  display: flex;
  align-items: stretch;
}
#${d} [data-sve-antlers-select] {
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
#${d} [data-sve-antlers-select]:hover,
#${d} [data-sve-antlers-select]:focus-visible {
  background: transparent;
}
#${d} [data-sve-css-chrome] {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
#${d} [data-sve-css-subrow] {
  display: none;
  align-items: center;
  padding: 4px 8px;
  background: rgba(255,255,255,.12);
  pointer-events: auto;
  min-width: 0;
}
#${d} [data-sve-css-chrome][data-sve-css-sub] [data-sve-css-subrow] {
  display: flex;
}
#${d} [data-sve-css-subrow] > [data-sve-css-sub] {
  display: none;
  align-items: center;
  flex-wrap: wrap;
  gap: 1px;
  min-width: 0;
}
#${d} [data-sve-css-chrome][data-sve-css-sub="padding"] [data-sve-css-sub="box"],
#${d} [data-sve-css-chrome][data-sve-css-sub="margin"] [data-sve-css-sub="box"],
#${d} [data-sve-css-chrome][data-sve-css-sub="display"] [data-sve-css-sub="display"] {
  display: flex;
}
#${d} [data-sve-css-flex-extras] {
  display: none;
  align-items: center;
  flex-wrap: wrap;
  gap: 1px;
}
#${d} [data-sve-css-chrome][data-sve-css-flex-on] [data-sve-css-flex-extras] {
  display: contents;
}
#${d} [data-sve-css-sep] {
  width: 1px;
  height: 12px;
  margin: 0 4px;
  background: rgba(255,255,255,.16);
  flex: 0 0 auto;
}
#${d} [data-sve-css-tool],
#${d} [data-sve-css-box-side],
#${d} [data-sve-html-tool] {
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
#${d} [data-sve-css-tool]:hover,
#${d} [data-sve-css-tool][data-open],
#${d} [data-sve-css-tool][data-active],
#${d} [data-sve-html-tool]:hover,
#${d} [data-sve-html-tool][data-open],
#${d} [data-sve-html-tool][data-active] {
  background: rgba(255,255,255,.12);
  opacity: 1;
}
#${d} [data-sve-css-box-side]:hover,
#${d} [data-sve-css-box-side][data-open],
#${d} [data-sve-css-box-side][data-active],
#${d} [data-sve-css-subrow] [data-sve-css-tool]:hover,
#${d} [data-sve-css-subrow] [data-sve-css-tool][data-open],
#${d} [data-sve-css-subrow] [data-sve-css-tool][data-active] {
  background: rgba(255,255,255,.22);
  opacity: 1;
}
#${d} [data-sve-css-tool]::after,
#${d} [data-sve-css-box-side]::after,
#${d} [data-sve-html-tool]::after {
  content: attr(data-tip);
  position: absolute;
  left: 50%;
  top: calc(100% + 6px);
  transform: translateX(-50%);
  padding: 3px 7px;
  border-radius: 4px;
  background: #1f1f1f;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.14);
  box-shadow: 0 4px 12px rgba(0,0,0,.35);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.3;
  text-transform: none;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  z-index: 8;
}
#${d} [data-sve-css-tool]:hover::after,
#${d} [data-sve-css-box-side]:hover::after,
#${d} [data-sve-html-tool]:hover::after {
  opacity: 1;
}
#${d} [data-sve-css-tool][data-open]::after,
#${d} [data-sve-css-box-side][data-open]::after,
#${d} [data-sve-html-tool][data-open]::after {
  display: none;
}
#${d} [data-sve-html-tool][data-letter] {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: none;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${T} {
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
#${T} [data-sve-css-swatches] {
  display: grid;
  grid-template-columns: repeat(8, 16px);
  gap: 4px;
}
#${T} [data-sve-css-swatch] {
  all: unset;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px solid rgba(255,255,255,.2);
}
#${T} [data-sve-css-swatch]:hover,
#${T} [data-sve-css-clear]:hover {
  outline: 1px solid #fff;
  outline-offset: 1px;
}
#${T} [data-sve-css-clear] {
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
#${T} [data-sve-css-choice] {
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
#${T} [data-sve-css-choice]:hover,
#${T} [data-sve-css-swatch][data-active],
#${T} [data-sve-css-choice][data-active] {
  outline: 1px solid #fff;
  outline-offset: 1px;
  background: rgba(255,255,255,.1);
}
#${T} [data-sve-css-add-label] {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
  margin-bottom: 6px;
}
#${T} [data-sve-css-add-input] {
  box-sizing: border-box;
  width: 100%;
  height: 28px;
  padding: 0 8px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 4px;
  background: #1e1e1e;
  color: #d4d4d4;
  font-size: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
#${d} [data-sve-code-split] {
  flex: 0 0 16px;
  cursor: col-resize;
  ${lo("ew")}
  background-color: var(--theme-color-gray-800, #27272a);
  position: relative;
  z-index: 1;
}
#${d} [data-sve-code-split]:hover,
#${d} [data-sve-code-split][data-active] {
  filter: brightness(1.15);
}
#${d} [data-sve-code-pane] .cm-editor {
  height: auto !important;
  min-height: 0;
  overflow: visible;
}
#${d} [data-sve-code-pane] .cm-scroller {
  overflow: visible !important;
  height: auto !important;
  min-height: 0 !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
#${d} [data-sve-code-host] {
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.35) transparent;
}
#${d} [data-sve-code-host]::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
#${d} [data-sve-code-host]::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,.28);
  border-radius: 6px;
}
#${d} .sve-cm-css-token {
  background: rgba(215,186,125,.22);
  border-radius: 2px;
}
#${Q} {
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
#${Q}:hover {
  background: #4a4a4a;
}
#${d} .sve-cm-partial {
  text-decoration: underline dotted;
  text-underline-offset: 3px;
  background: rgba(251,191,36,.16);
  cursor: pointer;
}
#${d} .sve-cm-partial-line {
  background: rgba(251,191,36,.12);
}
#${d}[data-sve-code-locked] .sve-cm-partial {
  text-decoration: none;
  background: transparent;
  cursor: default;
  pointer-events: none;
}
#${d}[data-sve-code-locked] .sve-cm-partial-line {
  background: transparent;
}
#${le} {
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
#${le} [data-sve-partial-choice] {
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
#${le} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${le} [data-sve-partial-empty] {
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
  background: #1e1e1e !important;
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
#${d} .emmet-tracker {
  text-decoration: underline 1px #4ade80;
}
`}function li(e){const t=e.querySelector(".live-preview-editor");if(!t)return 0;const o=t.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function ci(e){let t=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=e.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>e.documentElement.clientWidth-8&&(t=Math.max(t,Math.round(s.width)))}return t}function Ut(e){const t=e.document;if(He=e,typeof e.ResizeObserver!="function")return;ae||(ae=new e.ResizeObserver(()=>{He&&pa(He)}));const o=t.querySelector(".live-preview-editor"),n=t.getElementById("__sve-right-dock");o!==Le&&(Le&&ae.unobserve(Le),Le=o,o&&ae.observe(o)),n!==Me&&(Me&&ae.unobserve(Me),Me=n,n&&ae.observe(n))}function di(){ae?.disconnect(),ae=null,He=null,Le=null,Me=null}function ui(e){ko||(ko=!0,e.addEventListener("sve-right-dock-change",()=>Ut(e)))}function Xt(e,t){const o=e.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=t?`${t}px`:"")}function Kt(e){if(!e)return;const t=e.clientHeight,o=e.querySelector("[data-sve-code-bar]"),n=e.querySelector("[data-sve-code-lock-banner]"),s=n&&fi(e)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,t-(o?.offsetHeight||0)-s),i=e.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),e.querySelectorAll("[data-sve-code-host]").forEach(a=>{const l=a.closest("[data-sve-code-pane]");if(!l||l.style.display==="none")return;let c=0;for(const u of l.children)u!==a&&(c+=u.offsetHeight);const f=Math.max(64,r-c);a.style.height=`${f}px`,a.style.maxHeight=`${f}px`,a.style.minHeight="0",a.style.overflow="auto",pi(a)})}function fi(e){return e.ownerDocument?.defaultView||$}function pi(e){e._sveWheelBound||(e._sveWheelBound=!0,e.addEventListener("wheel",t=>{const o=e.scrollHeight-e.clientHeight,n=e.scrollWidth-e.clientWidth;let s=!1;if(t.deltaY&&o>0){const r=Math.min(o,Math.max(0,e.scrollTop+t.deltaY));r!==e.scrollTop&&(e.scrollTop=r,s=!0)}if(t.deltaX&&n>0){const r=Math.min(n,Math.max(0,e.scrollLeft+t.deltaX));r!==e.scrollLeft&&(e.scrollLeft=r,s=!0)}s&&(t.preventDefault(),t.stopPropagation())},{passive:!1}))}function wn(){const e=(He||$)?.document?.getElementById(d);e&&Kt(e);for(const t of R)h[t]?.requestMeasure()}function Tn(e,t){const o=An(e),n={};for(const s of R){const r=t.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function Bn(e,t){for(const n of R){const s=e.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",t[n]?"true":"false"),r&&(r.style.display=t[n]?"flex":"none")}const o=R.filter(n=>t[n]);e.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),Ln(e.ownerDocument.defaultView,e),Kt(e)}function Ln(e,t){const o=En(e);for(const n of R){const s=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function qe(e,t){if(Re)return;const o=e.document;Lt(o,t);const n=ni(e),s=li(o),r=ci(o);t.style.left=`${s}px`,t.style.right=`${r}px`,t.style.bottom="0",t.style.height=`${n}px`,Xt(o,n),Kt(t)}function Mn(e,t,o,n){const s=e.document,r=[...s.querySelectorAll("iframe")];r.forEach(f=>{f.style.pointerEvents="none"});const i=s.createElement("div");i.setAttribute("data-sve-code-drag-shield",""),i.style.cssText=`position:fixed;inset:0;z-index:2147483646;cursor:${t};user-select:none;`,s.body.appendChild(i),Re=!0;let a=!1;const l=f=>{o(f)},c=()=>{a||(a=!0,Re=!1,s.removeEventListener("mousemove",l),s.removeEventListener("mouseup",c),e.removeEventListener("blur",c),r.forEach(f=>{f.style.pointerEvents=""}),i.remove(),n?.())};s.addEventListener("mousemove",l),s.addEventListener("mouseup",c),e.addEventListener("blur",c)}function hi(e,t){if(t._sveResizeBound)return;t._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest("[data-sve-code-pane-btn], [data-sve-code-back], [data-sve-html-scope], [data-sve-code-lock], [data-sve-code-autosave], [data-sve-code-save], .cm-editor"))return;n.preventDefault();const s=n.clientY,r=t.getBoundingClientRect().height;let i=r;Mn(e,"ns-resize",a=>{i=Math.min(Math.max(bn,r+(s-a.clientY)),Math.round(e.innerHeight*.7)),t.style.height=`${i}px`,Xt(e.document,i),wn()},()=>{si(e,i),qe(e,t),e.dispatchEvent(new Event("resize"))})};t.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),t.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function mi(e,t){t._sveSplitBound||(t._sveSplitBound=!0,t.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=R.filter(v=>Tn(e,t)[v]),i=r.indexOf(s),a=r[i],l=r[i+1];if(!a||!l)return;const c=t.querySelector(`[data-sve-code-pane="${a}"]`),f=t.querySelector(`[data-sve-code-pane="${l}"]`),u=n.clientX,p=c.getBoundingClientRect().width,g=f.getBoundingClientRect().width,b=p+g;o.setAttribute("data-active",""),Mn(e,"col-resize",v=>{const I=v.clientX-u;let O=Math.max(St,Math.min(b-St,p+I)),ie=b-O;b<St*2&&(O=p,ie=g);const we=En(e);we[a]=O,we[l]=ie,ii(e,we),Ln(e,t),wn()},()=>{o.removeAttribute("data-active")})})}))}function gi(e,t){t._svePaneBound||(t._svePaneBound=!0,t.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=Tn(e,t),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),ri(e,i),Bn(t,i)})}))}function N(e,t){const o=e.getElementById(d)?.querySelector("[data-sve-code-status]");o&&(o.textContent=t||"")}function In(e,t){const o=e.getElementById(d)?.querySelector("[data-sve-code-path]");o&&(o.textContent=t||"",o.title=t||"")}function ze(e){const t=e?.document?.getElementById(d)?.querySelector("[data-sve-code-back]");t&&(t.hidden=ce.length===0,t.title=x(e,"code_dock_back"),t.setAttribute("aria-label",t.title),t.innerHTML=Xr)}function _o(e,t){const o=t.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),yi(e)}))}function vi(e){const t=be,o=typeof k.activeContainers=="function"?k.activeContainers(e.document):[];for(const n of o){const s=k.unwrapRef?.(n.values)||n.values;if(!(!s||typeof s!="object")&&t&&typeof k.findPathByUid=="function"){const r=k.findPathByUid(s,t);if(r){const i=r.split("."),a=k.dataGet?.(s,i.slice(0,2).join("."));if(a&&typeof a=="object")return a}}}for(const n of o){const s=k.unwrapRef?.(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function xi(e,t){!t||t===E||(se(e.document),bt(e,t,"push"))}function yi(e){const t=ce.pop();if(!t){ze(e);return}se(e.document),bt(e,t,"keep")}function Se(e){const t=e.document.getElementById(d),o=t?.querySelector("[data-sve-code-lock]"),n=t?.querySelector("[data-sve-code-lock-banner]");if(!t||!o)return;const s=M;t.toggleAttribute("data-sve-code-locked",s),s&&(J(e.document),oe(e.document),xe&&(xe.setHover(h.html,null),xe.setHover(h.css,null)),Pe?.setHover(h.html,null)),o.hidden=!ke,o.setAttribute("aria-pressed",M?"true":"false"),o.title=x(e,M?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=M?Wr:Ur,n&&(n.textContent=x(e,"code_dock_locked_banner"))}function We(e){return e?Fe(e,Wt)!=="0":H}function ct(e,t,o){return e!=null&&t!=null&&e>=0&&t>e&&t<=o}function dt(){const e=h.html?.state.doc.toString()??"";if(!B||!y){A=e;return}if(y.from<0||y.from>A.length||y.to<y.from){B=!1,A=e,y=null;return}A=A.slice(0,y.from)+e+A.slice(y.to),y={from:y.from,to:y.from+e.length}}function ut(){return dt(),B?A:h.html?.state.doc.toString()??V.html??""}function ft(){z=at(ut()).map(e=>e.name)}function Ae(){ge=Ro(h.css?.state.doc.toString()??_)}function On(e,t){return Array.isArray(e)&&Array.isArray(t)&&e.length===t.length&&e.every((o,n)=>o===t[n])}function bi(){const e=B?Zt():ut(),t=lt(e);t.length&&(_=Rt(_,Pt(_,t),t[0].className))}function Hn(e,t){_=ar(_,e,t),bi(),_=lr(_,t,e)}function ki(e){if(q||M||z==null)return;const t=at(ut()).map(o=>o.name);On(z,t)||(Hn(z,t),z=t,ht(),Ae())}function $i(){if(q||M||ge==null||z==null||Y==="empty")return;const e=h.html,t=Ro(h.css?.state.doc.toString()??"");if(!e||On(ge,t))return;const o=new Set(z),{renamed:n,removed:s}=qo(ge,t);let r=e.state.doc.toString();const i=r;for(const a of n){const l=ye(a.to);!o.has(a.from)||!l||(r=uo(r,c=>c===a.from?l:c))}for(const a of s)!o.has(a)||t.includes(a)||(r=uo(r,l=>l===a?"":l));if(r!==i){q=!0;try{pt(r)}finally{q=!1}}ft(),ge=t}function _i(e,t){const o=ye(t),n=h.html;if(!o||!n||n.state.readOnly||o===e.name)return;q=!0;try{n.dispatch({changes:{from:e.from,to:e.to,insert:o}})}finally{q=!1}const s=z==null?[]:z.slice();ft(),Hn(s,z),ht(),Ae(),$&&(he($),pe($))}function Si(e,t){const o=e.document,s=h.html?.coordsAtPos(t.from);w(o),oe(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=T,o.body.appendChild(r),Ue(e,i,r),r._sveApp=Ve(Do,r,{label:x(e,"code_dock_css_rename_class"),placeholder:x(e,"code_dock_css_class_placeholder"),initial:t.name,onAdd:a=>{_i(t,a),w(o)}})}function Dn(){return H&&ct(y?.from,y?.to,A.length)?(B=!0,A.slice(y.from,y.to)):(B=!1,A)}function Yt(e,t,o){const n=h[e];if(!n)return;const s=n.state.doc.toString();q=!0;try{s!==t?n.dispatch({changes:{from:0,to:s.length,insert:t},...o?{selection:o,scrollIntoView:!0}:{}}):o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{q=!1}}function pt(e,t){Yt("html",e,t)}function Zt(){return B?h.html?.state.doc.toString()??"":ct(y?.from,y?.to,A.length)?A.slice(y.from,y.to):""}function Ee(){const e=h.css?.state.doc.toString()??"";if(Y==="tree"){if(e===de)return;const t=lt(Zt())[0]?.className||Fo(e);_=Rt(_,e,t),de=e}else Y==="full"&&(_=e)}function jn(e,t){for(const o of t||[])if(!K(e,o.className)||jn(e,o.children))return!0;return!1}function ht(){let e=_,t=[],o=!1;!H||!B?(Y="full",e=_):(t=lt(Zt()),t.length?(Y="tree",e=Pt(_,t),jn(_,t)&&(_=Rt(_,e,t[0].className),o=!0)):(Y="empty",e="")),de=e,Yt("css",e),Ae(),$&&(pe($),o&&he($))}function Gt(){const e=h.html;if(!e||!y)return;B||(A=e.state.doc.toString());const t=A.length,o=Math.max(0,Math.min(y.from,t)),n=Math.max(o,Math.min(y.to,t));n<=o||(y={from:o,to:n},B=!0,pt(A.slice(o,n),{anchor:0,head:0}),ht(),e.focus())}function Jt(e=!0){const t=h.html;if(!t)return;Ee(),dt(),B=!1;const o=A||t.state.doc.toString(),n=e&&ct(y?.from,y?.to,o.length)?{anchor:y.from,head:y.to}:null;A=o,pt(o,n),Y="full",de=_,Yt("css",_),Ae()}function Qt(){y=null,B=!1,A="",_="",Y="full",de="",z=null,ge=null}let Ne=!1;function _e(e){return!!e?.document.getElementById(k.HTML_TREE_PANEL_ID)}function So(e,t){if(!(!e||k.featureOn?.(e,"html_tree")===!1)){if(!t){_e(e)&&k.closeHtmlTreePanel?.(e);return}_e(e)||(Ne=!0,os("html_tree").then(()=>{_e(e)||k.toggleHtmlTreePanel?.(e)}).catch(()=>{}).finally(()=>{Ne=!1,W(e)}))}}function W(e){const t=e?.document.getElementById(d)?.querySelector("[data-sve-html-scope]");if(!t)return;H=We(e);const o=k.featureOn?.(e,"html_tree")===!1?H:_e(e)||Ne;t.setAttribute("aria-pressed",o?"true":"false"),t.title=x(e,o?"code_dock_html_scope_off":"code_dock_html_scope"),t.setAttribute("aria-label",t.title),t.innerHTML=kn,e.document.getElementById(d)?.toggleAttribute("data-sve-html-scoped",B)}function Co(e,t){t._sveHtmlScopeBound||(t._sveHtmlScopeBound=!0,H=We(e),Ci(e,t),So(e,H),t.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),H=!(_e(e)||Ne),Ce(e,Wt,H?"1":"0"),H?y&&(Ee(),Gt()):B&&Jt(),So(e,H),W(e)}))}function Ci(e,t){t._sveTreeWatchBound||(t._sveTreeWatchBound=!0,e.addEventListener("sve-right-dock-change",()=>{if(Ne||k.featureOn?.(e,"html_tree")===!1||!e.document.getElementById(d))return;const o=_e(e);o!==We(e)&&(H=o,Ce(e,Wt,o?"1":"0"),o?y&&(Ee(),Gt()):B&&Jt(),W(e))}))}function Ao(e,t){t._sveLockBound||(t._sveLockBound=!0,t.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!ke||!E)){if(M){Ei(e);return}Pn(e,!0)}}))}function eo(e){return e?Fe(e,yn)!=="0":!0}function Ai(){const e=h.html;return!e||e.state.readOnly||!E?!1:!oo(to(),V)}function ue(e){const t=e?.document.getElementById(d),o=t?.querySelector("[data-sve-code-autosave]"),n=t?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=eo(e),r=Ai();o.setAttribute("aria-pressed",s?"true":"false"),o.title=x(e,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=Kr,n.hidden=s,n.title=x(e,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=Yr,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function Eo(e,t){t._sveAutosaveBound||(t._sveAutosaveBound=!0,t.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!eo(e);Ce(e,yn,n?"1":"0"),n?se(e.document):Z&&(clearTimeout(Z),Z=null),ue(e)}),t.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),se(e.document)}))}function Ei(e){e.document.getElementById(U)?.remove();const t=ns(e.document,ss,{title:x(e,"code_dock_unlock_title"),body:x(e,"code_dock_unlock_body"),buttons:[{value:"cancel",label:x(e,"cancel"),variant:"ghost"},{value:"ok",label:x(e,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{t.dismiss(),o==="ok"&&Pn(e,!1)}});t.host.id=U}function Pn(e,t){const o=E;if(!o)return;const n=()=>{E===o&&e.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Cn(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:t})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));E===o&&(M=t,Se(e),mt(V,t),W(e),N(e.document,t?x(e,"code_dock_locked"):""))}).catch(()=>{N(e.document,x(e,"code_dock_error"))})};if(t&&(se(e.document),Oe)){Oe.finally(n);return}n()}function to(){const e={html:"",css:"",js:""};dt(),Ee();for(const t of R)t==="html"?e.html=B?A:h.html?.state.doc.toString()??"":t==="css"?e.css=_:e[t]=h[t]?.state.doc.toString()??"";return e}function wi(){if(!(H&&ct(y?.from,y?.to,A.length)))return Y="full",de=_,_;const e=lt(A.slice(y.from,y.to));if(!e.length)return Y="empty",de="","";Y="tree";const t=Pt(_,e);return de=t,t}function mt(e,t){q=!0;try{$&&(H=We($)),A=e.html??"",_=e.css??"";for(const o of R){const n=h[o];let s=e[o]??"";try{s=o==="html"?Dn():o==="css"?wi():s}catch{s=o==="html"?A||e.html||"":o==="css"?_||e.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[De[o].reconfigure(nt.readOnly.of(!!t)),je[o].reconfigure(te.editable.of(!t))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{q=!1}ft(),Ae(),Ot("dock:html-changed"),$&&(pe($),yt($),W($))}function oo(e,t){return e.html===t.html&&e.css===t.css&&e.js===t.js}function Rn(e){return String(e||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function gt(e){const t=Rn(e).match(/^([a-z-]+)\s*:/i);return t?t[1].toLowerCase():""}function Ti(e,t){return e===t||e.startsWith(`${t}-`)}function vt(e){const t=Rn(e),o=t.indexOf(":");return o===-1?"":t.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function j(e){const t=String(e||"").trim().toLowerCase();return t==="start"||t==="flex-start"||t==="left"||t==="top"?"flex-start":t==="end"||t==="flex-end"||t==="right"||t==="bottom"?"flex-end":t==="row-reverse"?"row-reverse":t==="column-reverse"?"column-reverse":t}function st(e){const t=j(e);return t==="flex"||t==="inline-flex"}function no(){const e=h.css;if(!e)return null;const t=e.state.selection.main.head,o=e.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const a=o.indexOf("}}",i+2);if(a===-1)break;i=a+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const a=n.pop();a!=null&&s.push({from:a+1,to:i,text:o.slice(a+1,i),open:a})}}let r=null;for(const i of s)t<i.open||t>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function Bi(e){const t=String(e||"");let o="",n=0;for(let s=0;s<t.length;s+=1){if(t[s]==="{"&&t[s+1]==="{"){const r=t.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=t.slice(s,r+2)),s=r+1;continue}if(t[s]==="{"){n+=1;continue}if(t[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=t[s])}return o}function Li(e){const t={};for(const o of Bi(e).split(";")){const n=gt(o);n&&(t[n]=vt(`${o};`))}return t}function Mi(e,t,o){if(!t||t.from>=t.to)return null;let n=e.state.doc.lineAt(t.from),s=0;for(;n.from<=t.to;){const r=Math.max(n.from,t.from),i=Math.min(n.to,t.to),a=e.state.doc.sliceString(r,i);if(s===0&&gt(a)===o)return{from:r,to:i,text:a};if(s+=Ii(a),n.to>=e.state.doc.length||n.to>=t.to)break;n=e.state.doc.lineAt(n.to+1)}return null}function Ii(e){let t=0;const o=String(e);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?t+=1:o[n]==="}"&&(t-=1)}return t}function fe(e){return(String(e).match(/^\s*/)||[""])[0]}function xt(e,t,o){for(let n=t.number-1;n>=1;n-=1){const s=e.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=fe(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function Oi(e,t){const o=e.state.doc.lineAt(t);if(o.text.trim())return fe(o.text);const n=xt(e,o,!0);if(n)return n;const s=no();return s?qn(e,s):"  "}function qn(e,t){const o=e.state.doc.lineAt(t.from),n=e.state.doc.lineAt(Math.max(t.from,t.to));for(let r=n.number;r>=o.number;r-=1){const i=e.state.doc.line(r),a=Math.max(i.from,t.from),l=Math.min(i.to,t.to),c=e.state.doc.sliceString(a,l);if(c.trim())return(c.match(/^\s*/)||[""])[0]||"  "}return`${(e.state.doc.lineAt(Math.max(0,t.from-1)).text.match(/^\s*/)||[""])[0]}  `}function wo(){h.css?.focus(),$&&(he($),pe($))}function F(e){const t=h.css;if(!t||t.state.readOnly||!e.length)return;const o=no();if(!o){const i=e.filter(a=>a.value!=null).map(a=>`${a.property}: ${a.value};`).join(`
`);i&&Pi(i),wo();return}const n=[],s=[],r=qn(t,o);for(const i of e){const a=Mi(t,o,i.property);if(i.value==null){if(!a)continue;let l=a.from,c=a.to;t.state.doc.sliceString(c,c+1)===`
`&&(c+=1),l=Math.max(l,o.from),c=Math.min(c,o.to),n.push({from:l,to:c});continue}if(!(a&&j(vt(a.text))===j(i.value)))if(a){const l=(a.text.match(/^\s*/)||[""])[0];n.push({from:a.from,to:a.to,insert:`${l}${i.property}: ${i.value};`})}else s.push(`${r}${i.property}: ${i.value};`)}if(s.length){const i=!o.text.includes(`
`)||!/\n\s*$/.test(o.text)?`
`:"";n.push({from:o.to,to:o.to,insert:`${i}${s.join(`
`)}
`})}n.length&&(n.sort((i,a)=>a.from-i.from||a.to-i.to),t.dispatch({changes:n})),wo()}function $e(){const e=no();return e?Li(e.text):{}}function Hi(e){const t=$e(),o=st(t.display),n=j(t["flex-direction"])||(o?"row":"");if(o&&n===e){const s=[];t["flex-direction"]&&s.push({property:"flex-direction",value:null}),st(t.display)&&s.push({property:"display",value:null}),F(s);return}F([{property:"display",value:"flex"},{property:"flex-direction",value:e}])}function Di(e){const t=$e();if(e==="flex"&&st(t.display)){F([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}F([{property:"display",value:e}])}function ji(e,t){const o=$e();if(j(o[e])===j(t)){F([{property:e,value:null}]);return}F([{property:e,value:t}])}function Pi(e){const t=h.css;if(!t||t.state.readOnly)return;const o=t.state.selection.main.head,n=t.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=Oi(t,o),a=e.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const c=`${i}${a}
${i}`;t.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}});return}const l=`
${i}${a}
${i}`;t.dispatch({changes:{from:o,to:t.state.selection.main.to,insert:l},selection:{anchor:o+l.length}})}function pe(e){try{Ri(e)}catch{}}function Ri(e){const t=e?.document?.getElementById(d),o=$e(),n=st(o.display),s=j(o["flex-direction"])||(n?"row":""),r=t?.querySelector("[data-sve-css-tools]"),i=t?.querySelector("[data-sve-css-chrome]"),a=i?.getAttribute("data-sve-css-sub")||"",l=a==="padding"||a==="margin"?a:"";if(t){i&&(n?i.setAttribute("data-sve-css-flex-on",""):i.removeAttribute("data-sve-css-flex-on")),r&&(n?r.setAttribute("data-sve-css-flex-on",""):r.removeAttribute("data-sve-css-flex-on"));for(const c of[...wt,...Tt]){const f=t.querySelector(`[data-sve-css-tool="${c.id}"]`);if(!f)continue;let u=!1;if(c.flexDir)u=n&&s===c.flexDir;else if(c.display)u=c.display==="flex"?n:j(o.display)===c.display;else if(c.insert){const p=gt(c.insert);u=!!p&&j(o[p])===j(vt(c.insert))}else c.menu==="box"?(u=Object.keys(o).some(p=>Ti(p,c.property)),a===c.property?f.setAttribute("data-open",""):f.removeAttribute("data-open")):c.menu==="display"?(u=!!o.display,a==="display"?f.setAttribute("data-open",""):f.removeAttribute("data-open")):c.property&&(u=c.property in o);u?f.setAttribute("data-active",""):f.removeAttribute("data-active")}for(const c of _n){const f=t.querySelector(`[data-sve-css-box-side="${c.suffix}"]`);if(!f)continue;!!l&&`${l}${c.suffix}`in o?f.setAttribute("data-active",""):f.removeAttribute("data-active")}for(const c of Bt){const f=t.querySelector(`[data-sve-css-tool="${c.id}"]`);if(!f)continue;j(o[c.property])===j(c.value)?f.setAttribute("data-active",""):f.removeAttribute("data-active")}}}function w(e){const t=e?.getElementById(T);t?._sveApp?.unmount(),t?.remove(),e?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-css-box-side][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open]").forEach(o=>o.removeAttribute("data-open"))}function Ta(e){w(e),oe(e);for(const t of R)h[t]&&an?.(h[t])}function qi(e){if(Ge)return Ge;const t=e.Statamic?.$config?.get?.("cpUrl")||`/${e.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return Ge=e.fetch(`${t}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,a=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!a||n.has(a)||(n.add(a),s.push({name:a,hex:r.hex||r.color||""}))}for(const[r,i]of Sn)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),Ge}function zn(e,t){const o=$e()[t]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of e.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function Ue(e,t,o){const n=t.getBoundingClientRect(),s=8;o.style.left=`${Math.max(s,Math.min(n.left,e.innerWidth-220))}px`,o.style.top=`${Math.max(s,n.bottom+4)}px`}function zi(e,t,o){const n=e.document;w(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=T,n.body.appendChild(s),Ue(e,t,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=Ve(Ht,s,{kind:"colors",swatches:i,onClear:()=>{F([{property:o,value:null}]),w(n)},onPick:a=>{F([{property:o,value:`var(${a})`}]),w(n)}}),zn(s,o)};r(Sn.map(([i,a])=>({name:i,hex:a}))),qi(e).then(i=>{n.getElementById(T)&&r(i.map(a=>({name:a.name,hex:a.hex})))})}function To(e,t,o){const n=e.document;w(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=T,n.body.appendChild(s),Ue(e,t,s),s._sveApp=Ve(Ht,s,{kind:"choices",choices:Gr.map(r=>({value:r,token:r,label:r})),onPick:r=>{F([{property:o,value:`var(${r})`}]),w(n)}}),zn(s,o)}function et(e){return e?.querySelector("[data-sve-css-chrome]")}function Bo(e,t){const o=e.document.getElementById(d),n=et(o);w(e.document),n&&(n.getAttribute("data-sve-css-sub")===t?n.removeAttribute("data-sve-css-sub"):n.setAttribute("data-sve-css-sub",t),pe(e))}function Nn(e,t){if(e.startsWith("{{",t)){const o=e.indexOf("}}",t+2);return o===-1?e.length:o+2}if(e.startsWith("<!--",t)){const o=e.indexOf("-->",t+4);return o===-1?e.length:o+3}return t}function Mt(e,t){if(e[t]!=="<")return null;const o=e.indexOf(">",t+1);if(o===-1)return null;const n=e.slice(t,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:t,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:t,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:t,to:o+1}}function Lo(e,t,o){let n=1,s=o;for(;s<e.length;){const r=Nn(e,s);if(r!==s){s=r;continue}if(e[s]!=="<"){s+=1;continue}const i=Mt(e,s);if(!i)break;if(i.kind==="open"&&i.name===t)n+=1;else if(i.kind==="close"&&i.name===t&&(n-=1,n===0))return i;s=i.to}return null}function Xe(){const e=h.html;if(!e)return null;const t=e.state.selection.main.head,o=e.state.doc.toString(),n=[];let s=0;for(;s<t;){const l=Nn(o,s);if(l!==s){s=l;continue}if(o[s]!=="<"){s+=1;continue}const c=Mt(o,s);if(!c||c.from>=t)break;if(c.kind==="open")n.push(c);else if(c.kind==="close"){for(let f=n.length-1;f>=0;f-=1)if(n[f].name===c.name){n.splice(f);break}}s=c.to}const r=o.lastIndexOf("<",Math.max(0,t-1));if(r!==-1&&o.indexOf(">",r)>=t){const l=Mt(o,r);if(l?.kind==="open"||l?.kind==="void"){const c=l.kind==="void"?null:Lo(o,l.name,l.to);return c?{name:l.name,open:l,close:c}:{name:l.name,open:l,close:null}}}const i=n[n.length-1];if(!i)return null;const a=Lo(o,i.name,i.to);return{name:i.name,open:i,close:a}}function It(e){return $n.includes(e)}function ee(){h.html?.focus(),$&&(he($),yt($))}function Je(e,t,o){const n=[...t].sort((s,r)=>r.from-s.from||r.to-s.to);e.dispatch({changes:n,selection:o})}function rt(e,t){const o=h.html;if(!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.slice(0,n-s.from),i=s.text.trim()?fe(s.text):xt(o,s)||fe(s.text);let a=e,l=0;if(r.trim()!=="")a=`
${i}${e}`,l=1+i.length;else if(!s.text.trim()){a=`${i}${e}`,l=i.length,o.dispatch({changes:{from:s.from,to:s.to,insert:a},selection:{anchor:s.from+l+t}});return}o.dispatch({changes:{from:n,to:o.state.selection.main.to,insert:a},selection:{anchor:n+l+t}})}function Fn(e){const t=h.html;if(!t||t.state.readOnly)return;const o=t.state.selection.main,n=t.state.doc.toString();if(!o.empty){const a=n.slice(o.from,o.to),l=a.match(new RegExp(`^<${e}(\\s[^>]*)?>([\\s\\S]*)</${e}>$`,"i"));if(l){Je(t,[{from:o.from,to:o.to,insert:l[2]}],{anchor:o.from,head:o.from+l[2].length}),ee();return}let c=`<${e}>${a}</${e}>`,f=o.from+e.length+2;e==="ul"&&(c=`<ul>
  <li>${a}</li>
</ul>`,f=o.from+11),Je(t,[{from:o.from,to:o.to,insert:c}],{anchor:f,head:f+a.length}),ee();return}const s=Xe();if(s?.open&&s.close){if(s.name===e){Je(t,[{from:s.close.from,to:s.close.to,insert:""},{from:s.open.from,to:s.open.to,insert:""}],{anchor:s.open.from}),ee();return}if(It(s.name)&&It(e)){const a=n.slice(s.open.from,s.open.to).replace(new RegExp(`^<${s.name}`,"i"),`<${e}`);Je(t,[{from:s.close.from,to:s.close.to,insert:`</${e}>`},{from:s.open.from,to:s.open.to,insert:a}],{anchor:s.open.from+e.length+1}),ee();return}}const i=(t.state.doc.lineAt(o.head).text.match(/^\s*/)||[""])[0];if(e==="ul"){const a=`<ul>
${i}  <li></li>
${i}</ul>`;rt(a,`<ul>
${i}  <li>`.length)}else rt(`<${e}></${e}>`,e.length+2);ee()}function yt(e){try{Ni(e)}catch{}}function Ni(e){const t=e?.document?.getElementById(d),n=Xe()?.name||"";if(t)for(const s of Et){const r=t.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!r)continue;(s.id==="heading"?It(n):n===s.tag)?r.setAttribute("data-active",""):r.removeAttribute("data-active")}}function Fi(e,t){const o=e.document,n=Xe()?.name||"";w(o),t.setAttribute("data-open","");const s=o.createElement("div");s.id=T,o.body.appendChild(s),Ue(e,t,s),s._sveApp=Ve(Ht,s,{kind:"choices",choices:$n.map(r=>({value:r,label:r.toUpperCase(),active:n===r})),onPick:r=>{Fn(r),w(o)}})}function Vi(e){const t=ye(e),o=h.html,n=h.css;if(!t||o?.state.readOnly||n?.state.readOnly)return;const s=Xe();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=Js(r,t);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}Ee(),K(_,t)||(_=`${String(_||"").trimEnd()}${_?.trim()?`
`:""}.${t} {
}
`),ht(),ft(),Ae(),$&&(he($),yt($),pe($))}function Wi(e,t){const o=e.document;if(t.hasAttribute("data-open")){w(o);return}w(o),t.setAttribute("data-open","");const n=o.createElement("div");n.id=T,o.body.appendChild(n),Ue(e,t,n),n._sveApp=Ve(Do,n,{label:x(e,"code_dock_css_class_name"),placeholder:x(e,"code_dock_css_class_placeholder"),onAdd:s=>{Vi(s),w(o)}})}function Ui(e,t){const o=t.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=Zr,o.title=x(e,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Wi(e,o)}))}function Xi(e,t){const o=t.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=[...wt,...Tt,...Bt],s=(c,f)=>{const u=n.find(p=>p.id===c);if(u){if(u.flexDir){w(e.document),Hi(u.flexDir);return}if(u.display){w(e.document),Di(u.display);return}if(u.property&&u.value){w(e.document),ji(u.property,u.value);return}if(u.insert){const p=gt(u.insert),g=vt(u.insert),b=$e();w(e.document),et(t)?.removeAttribute("data-sve-css-sub"),p&&j(b[p])===j(g)?F([{property:p,value:null}]):F([{property:p,value:g}]);return}if(u.menu==="colors"){et(t)?.removeAttribute("data-sve-css-sub"),zi(e,f,u.property);return}if(u.menu==="box"){Bo(e,u.property);return}if(u.menu==="display"){Bo(e,"display");return}u.menu==="spacing"&&To(e,f,u.property)}};let r=!1;const i=Bt.map((c,f)=>{const u={...c,icon:Ze[c.id]||"",sep:f===0||c.group==="align"&&!r};return c.group==="align"&&!r&&(r=!0),u});ve(o,Ds,{tools:wt.map(c=>({...c,icon:Ze[c.id]||""})),onTool:c=>s(c,t.querySelector(`[data-sve-css-tool="${c}"]`))});const a=t.querySelector('[data-sve-css-sub="box"]');a&&!a._sveBound&&(a._sveBound=!0,ve(a,Rs,{sides:_n.map(c=>({...c,icon:Ze[`box-${c.id}`]||""})),onSide:c=>{const f=et(t)?.getAttribute("data-sve-css-sub"),u=a.querySelector(`[data-sve-css-box-side="${c}"]`),p=`${f}${c}`,g=$e();if(!(f!=="padding"&&f!=="margin"||!u)){if(p in g){w(e.document),F([{property:p,value:null}]);return}To(e,u,p),pe(e)}}}));const l=t.querySelector('[data-sve-css-sub="display"]');l&&!l._sveBound&&(l._sveBound=!0,ve(l,Ws,{items:Tt.map(c=>({...c,icon:Ze[c.id]||""})),extras:i,onTool:c=>s(c,t.querySelector(`[data-sve-css-tool="${c}"]`))})),e.document.addEventListener("mousedown",c=>{c.target.closest(`#${T}, [data-sve-css-tools], [data-sve-css-subrow], [data-sve-html-tools], [data-sve-css-add-class]`)||w(e.document)},!0)}function Ki(e,t){const o=t.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,ve(o,Bs,{tools:Et.map(n=>({...n,icon:Jr[n.id]||""})),onTool:n=>{const s=Et.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){Fi(e,r);return}w(e.document),Fn(s.tag)}}}),Yi(e,t),Gi(e,t))}function Yi(e,t){const o=t.querySelector("[data-sve-antlers-tools]");!o||o._sveBound||(o._sveBound=!0,ve(o,Ho,{label:x(e,"code_dock_antlers"),groups:cs.map(n=>({id:n.id,label:x(e,n.lang),items:ds.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>Zi(n)}))}function Zi(e){const t=us(e),o=h.html;if(!t||!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.trim()?fe(s.text):xt(o,s)||fe(s.text),{text:i,cursor:a}=tt(t.snippet);rt(Oo(i,r),a),ee()}function Gi(e,t){const o=t.querySelector("[data-sve-visual-edit-tools]");!o||o._sveBound||(o._sveBound=!0,ve(o,Ho,{label:x(e,"code_dock_visual_edit"),groups:cr.map(n=>({id:n.id,label:x(e,n.lang),items:Wo.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>Qi(n)}))}function Ji(e,t,o,n){if(fr(o.inner,n.attr)){e.focus();return}const{text:s,cursor:r}=tt(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(t[i-1]);)i--;e.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),ee()}function Qi(e){const t=dr(e),o=h.html;if(!t||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=Xe();if(s?.open){const u=ur(n,s.open.from,s.open.to,Ye);if(u){t.attr?Ji(o,n,u,t):(o.dispatch({selection:{anchor:u.openIdx+2+Ye.length}}),o.focus());return}const p=s.open.from+1+s.name.length,g=t.standalone||`{{ ${Ye} ${t.attr} }}`,{text:b,cursor:v}=tt(g);o.dispatch({changes:{from:p,to:p,insert:` ${b}`},selection:{anchor:p+1+v}}),ee();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),a=i.text.trim()?fe(i.text):xt(o,i)||fe(i.text),l=t.standalone||`{{ ${Ye} ${t.attr} }}`,{text:c,cursor:f}=tt(l);rt(Oo(c,a),f),ee()}function Vn(e){if(!be||!E||String(E).startsWith("view:")){io(e);return}const t=ts(be,e.document);io(e,t.length?{sectionUids:t}:void 0)}function ea(e,t,o){return Oe=e.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Cn(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:t,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{}})}).then(async n=>{if(n.status===423){M=!0,ke=!0,Se(e),mt(V,!0),W(e),N(e.document,x(e,"code_dock_locked"));return}if(!n.ok)throw new Error(String(n.status));E===t&&(V=o,N(e.document,x(e,"code_dock_saved")),ue(e),e.setTimeout(()=>{const s=e.document.getElementById(d)?.querySelector("[data-sve-code-status]");s&&s.textContent===x(e,"code_dock_saved")&&(s.textContent="")},1800)),Vn(e),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}).catch(()=>{N(e.document,x(e,"code_dock_error"))}).finally(()=>{Oe=null}),Oe}function se(e){Z&&(clearTimeout(Z),Z=null);const t=E,o=$,n=h.html;if(!n||n.state.readOnly||!t||!o)return;const s=to();oo(s,V)||(N(e,x(o,"code_dock_saving")),ea(o,t,s))}function ta(e,t){Z&&clearTimeout(Z),Z=e.setTimeout(()=>{Z=null,se(t)},Vr)}function he(e){if(q)return;const t=to();if(oo(t,V)){ue(e);return}if(ue(e),!eo(e)){N(e.document,x(e,"code_dock_unsaved"));return}N(e.document,x(e,"code_dock_saving")),ta(e,e.document)}let xe=null,Pe=null;function oa(){return xe||(xe=kr({Decoration:Vt,StateField:zt,StateEffect:Nt,RangeSetBuilder:Ft,EditorView:te})),xe}function na(){return Pe||(Pe=Cr({Decoration:Vt,StateField:zt,StateEffect:Nt,RangeSetBuilder:Ft,EditorView:te})),Pe}function sa(e,t,o){h[t]?.destroy();const n=At.of([{key:"Mod-s",run:()=>(se(e.document),!0)}]);h[t]=new te({state:nt.create({doc:"",extensions:[Zo(),Go(),Jo(),on(),ei(t),sn(),nn({tooltipClass:()=>"sve-tw-complete"}),...t==="html"?[dn.data.of({autocomplete:Mr(e)}),Ir(cn,e)]:[],...t==="html"?[...is(),as()]:[],At.of([...Qo,...t==="html"?[{key:"Tab",run:ls}]:[],en,...tn,...ln,...rn]),n,te.lineWrapping,...t==="html"||t==="css"?oa().extensions:[],...t==="html"?na().extensions:[],De[t].of(nt.readOnly.of(!!M)),je[t].of(te.editable.of(!M)),te.updateListener.of(s=>{t==="html"&&s.docChanged&&!q&&(ki(),Ot("dock:html-changed")),t==="css"&&s.docChanged&&!q&&$i(),s.docChanged&&he(e),t==="css"&&(s.docChanged||s.selectionSet)&&pe(e),t==="html"&&(s.docChanged||s.selectionSet)&&yt(e)}),...Qr()]}),parent:o})}function ra(e){if(!e||e.querySelector(".cm-editor"))return;e.replaceChildren();const t=e.ownerDocument.createElement("span");t.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",e.appendChild(t)}let Qe=null;async function ia(e){const t=e.document;ai(t);let o=t.getElementById(d);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-subrow]")&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-7")){for(const s of R)h[s]?.destroy(),h[s]=null;o.remove(),o=null}if(!o){o=t.createElement("div"),o.id=d,o.setAttribute("data-sve-code-chrome","scope-7"),ve(o,Es,{htmlLabel:x(e,"code_dock_html"),cssLabel:x(e,"code_dock_css"),jsLabel:x(e,"code_dock_js"),treeIcon:kn}),Lt(t,o),$o(o),Bn(o,An(e)),hi(e,o),gi(e,o),mi(e,o),Xi(e,o),Ui(e,o),Ki(e,o),Co(e,o),Ao(e,o),_o(e,o),Eo(e,o);for(const n of R){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);ra(s)}k.openHtmlTreePanel?.(e)}if(Lt(t,o),$o(o),Co(e,o),Ao(e,o),_o(e,o),Eo(e,o),ui(e),Ut(e),Se(e),W(e),ze(e),ue(e),await Nr(),!h.html){for(const n of R){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),sa(e,n,s)}for(const n of["html","css"])h[n]&&$r(e,h[n],{onOpen:s=>xi(e,s),emptyLabel:x(e,"code_dock_partials_empty"),sectionValues:()=>vi(e),isLocked:()=>it(),setHover:(s,r)=>xe?.setHover(s,r)});wr(e,h.html,{onRename:n=>Si(e,n),isLocked:()=>it(),setHover:(n,s)=>Pe?.setHover(n,s),title:x(e,"code_dock_css_rename_class")})}return o}function Wn(e){return Qe||(Qe=ia(e).finally(()=>{Qe=null})),Qe}async function Mo(e,t){const o=await Wn(e);E=t,M=!0,ke=!0,V={html:"",css:"",js:""},Qt(),Se(e),mt(V,!0),In(e.document,t),N(e.document,x(e,"code_dock_missing")),W(e),ze(e),ue(e),qe(e,o)}async function bt(e,t,o="replace"){o==="replace"?ce=[]:o==="push"&&E&&E!==t&&ce.push(E);const n=++Be;E=t,ke=!1,Qt(),N(e.document,x(e,"code_dock_loading"));const s=await Wn(e);Se(e),W(e),ze(e),ue(e),qe(e,s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(t)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async r=>{if(n!==Be)return;if(r.status===404){Mo(e,t);return}if(!r.ok)throw new Error(String(r.status));const i=await r.json();n===Be&&(V={html:typeof i.html=="string"?i.html:"",css:typeof i.css=="string"?i.css:"",js:typeof i.js=="string"?i.js:""},E=t,M=!!i.locked,ke=!0,Se(e),mt(V,M),In(e.document,i.path||t),N(e.document,M?x(e,"code_dock_locked"):""),W(e),ze(e),ue(e),qe(e,s))}).catch(()=>{n===Be&&(Mo(e,t),N(e.document,x(e,"code_dock_error")))})}function aa(){return E||""}function la(e){return!!e?.getElementById(d)}function it(){return M}function ca(e,t){const o=typeof t?.html=="string"?t.html.trim():"",n=typeof t?.css=="string"?t.css.trim():"",s=typeof t?.js=="string"?t.js.trim():"";if(!o&&!n&&!s||!e?.document?.getElementById(d))return!1;let r=!1;return o&&(r=da("html",o)||r),n&&(r=Io("css",n)||r),s&&(r=Io("js",s)||r),r&&he(e),r}function da(e,t){const o=h[e];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,l=`${s===`
`?"":`
`}${t}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:l},selection:{anchor:n.from+l.length}}),!0}function Io(e,t){const o=h[e];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${t}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function ua(e){if(Vn(e),!E||!e.document.getElementById(d))return;const t=E;E=null,bt(e,t,"keep")}function fa(e){Be+=1,se(e),be=null,E=null,ce=[],V={html:"",css:"",js:""},M=!1,ke=!1,z=null,ge=null,Qt(),$=e?.defaultView||$,w(e),J(e),oe(e),e?.getElementById(U)?.remove();for(const o of R)h[o]?.destroy(),h[o]=null;e?.getElementById(d)?.remove(),di(),e&&Xt(e,0);const t=e?.defaultView||$;t?.document.getElementById(k.HTML_TREE_PANEL_ID)&&k.closeHtmlTreePanel?.(t)}function pa(e){if(Re)return;const t=e.document.getElementById(d);t&&(Ut(e),qe(e,t))}function ha(e,t,o){if(o){const r=ao(o,t)||ao(o,e.document)||o;return String(typeof k.setTypeForUid=="function"&&(k.setTypeForUid(r,t)||k.setTypeForUid(r,e.document))||"").trim()}const n=typeof k.sectionField=="function"?k.sectionField(e):"page_sections",s=typeof k.activeContainers=="function"?k.activeContainers(e.document):[];for(const r of s){const a=(k.unwrapRef?.(r.values)||r.values)?.[n];if(Array.isArray(a))for(const l of a){const c=typeof l?.type=="string"?l.type.trim():"";if(c)return c}}return""}function ma(e){if((e.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=e.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(e.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof k.activeContainers=="function"?k.activeContainers(e.document):[];for(const r of s){const i=k.unwrapRef?.(r.values)||r.values,a=typeof i?.view=="string"?i.view.trim():"";if(!a||a.includes(".."))continue;const l=a.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(l)return`view:${l}`}return""}function ga(e,t){const o=k.chromeInlineKind||k.activeChromeKind;if(o!=="header"&&o!=="footer"||!k.chromeHost?.(t)&&!k.chromeEditorOpen?.(t))return"";const s=(k.unwrapRef?.(k.chromeContainer?.()?.values)||{})[o==="footer"?"footer_style":"header_style"]||"style_1";return`${o}/${s}`}function va(e){const t=k.globalSectionHost?.(e)||e.getElementById("__sve-global-section-host");return t&&t.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function xa(e,t,o){if(Re)return;if(!e||!t||oi(t)||!Qn(e)||!es(e)){t&&fa(t);return}const n=ga(e,t)||va(t)||ha(e,t,o)||ma(e)||(o?"":E),s=!!(o&&o!==be);if($=e,o&&(be=o),!!n&&!(n===E&&t.getElementById(d))){if(ce.length&&E&&E!==n){const r=ce[0];if(n===r&&!s)return;ce=[]}se(t),bt(e,n,"replace")}}re("dock:is-open",e=>la(e));re("dock:is-locked",()=>it());re("dock:html",()=>ut());re("dock:reveal-html",({from:e,to:t}={})=>{const o=h.html;if(!o||e==null)return;H=We($),dt(),Ee();const n=A.length,s=Math.max(0,Math.min(e,n)),r=Math.max(s,Math.min(t??e,n));if(y=r>s?{from:s,to:r}:null,H&&y){Gt(),W($);return}if(B){Jt(),W($);return}o.dispatch({selection:{anchor:s,head:r},scrollIntoView:!0}),o.focus()});re("dock:insert-snippet",({win:e,parts:t})=>ca(e,t));re("dock:refresh",e=>ua(e));re("dock:current-type",()=>aa());re("dock:current-uid",()=>be);re("dock:set-html",e=>{if(typeof e!="string"||it())return!1;const t=h.html;if(!t||!$)return!1;if(A=e,B)return pt(Dn()),he($),Ot("dock:html-changed"),!0;const o=t.state.doc.toString();return o!==e&&t.dispatch({changes:{from:0,to:o.length,insert:e}}),!0});k.syncCodeDock=xa;export{Ma as ARMED_KEY,fa as closeCodeDock,Ta as closeCodeDockPopups,aa as currentTemplateType,ca as insertAiSnippet,es as isCodeDockArmed,it as isCodeDockLocked,la as isCodeDockOpen,ua as refreshCodeDockFromDisk,pa as relayoutCodeDock,Ia as setCodeDockArmed,xa as syncCodeDock,Qn as templateDockAllowed};
