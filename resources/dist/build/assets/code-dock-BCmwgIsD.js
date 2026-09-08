const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-Dpuj8sxX.js","./index-B5fiB6ig.js","./index-eMi007Cw.js","./index-zsjA895l.js","./index-BsAZfAgM.js","./index-D2YMCfE7.js","./html-tag-sync-BlP2Mk13.js","./index-BatCsQTe.js"])))=>i.map(i=>d[i]);
import{o as $,c as C,a as m,t as K,F as D,e as ne,f as R,I as jn,d as $t,n as qn,Q as oo,T as zn,a2 as Nn,K as Fn,w as no,L as Vn,s as k,a3 as Wn,a4 as Un,a5 as so,a6 as Kn,a7 as ro,a8 as Fe,a9 as It,i as ve,aa as io,A as Ce,J as Z,l as Ve,ab as Xn,$ as Yn,a0 as Gn,O as re}from"./addon-BJYv3p6P.js";import{ac as pa,ad as ha}from"./addon-BJYv3p6P.js";import{p as Zn,t as Jn,a as Qn}from"./tailwind-complete-CSJ8XaZ4.js";import{h as es,a as ts,e as os,A as ns,b as ss,c as rs,d as tt,i as wo}from"./html-tag-sync-BlP2Mk13.js";import"./index-Dpuj8sxX.js";import"./index-B5fiB6ig.js";import"./index-BatCsQTe.js";import"./index-BsAZfAgM.js";import"./index-zsjA895l.js";import"./index-D2YMCfE7.js";import"./index-eMi007Cw.js";const is={class:"sve-code-dock"},as={"data-sve-code-bar":""},ls={type:"button","data-sve-code-pane-btn":"html"},cs={type:"button","data-sve-code-pane-btn":"css"},ds={type:"button","data-sve-code-pane-btn":"js"},us={type:"button","data-sve-html-scope":"","aria-pressed":"true"},fs=["innerHTML"],ps={"data-sve-code-panes":""},hs={"data-sve-code-pane":"html"},ms={"data-sve-code-pane-label":""},gs={"data-sve-code-pane":"css"},vs={"data-sve-css-chrome":"subrow-2"},xs={"data-sve-code-pane-label":""},ys={"data-sve-code-pane":"js"},bs={"data-sve-code-pane-label":""},ks={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},treeIcon:{type:String,required:!0}},setup(e){return(t,o)=>($(),C("div",is,[o[17]||(o[17]=m("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),m("div",as,[m("button",ls,K(e.htmlLabel),1),m("button",cs,K(e.cssLabel),1),m("button",ds,K(e.jsLabel),1),o[0]||(o[0]=m("button",{type:"button","data-sve-code-back":"",hidden:""},null,-1)),o[1]||(o[1]=m("span",{"data-sve-code-path":""},null,-1)),o[2]||(o[2]=m("span",{"data-sve-code-status":""},null,-1)),m("button",us,[m("span",{innerHTML:e.treeIcon},null,8,fs)]),o[3]||(o[3]=m("button",{type:"button","data-sve-code-autosave":"","aria-pressed":"true"},null,-1)),o[4]||(o[4]=m("button",{type:"button","data-sve-code-save":"",hidden:""},null,-1)),o[5]||(o[5]=m("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[18]||(o[18]=m("div",{"data-sve-code-lock-banner":""},null,-1)),m("div",ps,[m("div",hs,[m("div",ms,[m("span",null,K(e.htmlLabel),1),o[6]||(o[6]=m("div",{"data-sve-html-tools":""},null,-1)),o[7]||(o[7]=m("div",{"data-sve-visual-edit-tools":""},null,-1)),o[8]||(o[8]=m("div",{"data-sve-antlers-tools":""},null,-1))]),o[9]||(o[9]=m("div",{"data-sve-code-host":""},null,-1))]),o[15]||(o[15]=m("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),m("div",gs,[m("div",vs,[m("div",xs,[m("span",null,K(e.cssLabel),1),o[10]||(o[10]=m("button",{type:"button","data-sve-css-add-class":""},null,-1)),o[11]||(o[11]=m("div",{"data-sve-css-tools":""},null,-1))]),o[12]||(o[12]=m("div",{"data-sve-css-subrow":""},[m("div",{"data-sve-css-sub":"box"}),m("div",{"data-sve-css-sub":"display"})],-1))]),o[13]||(o[13]=m("div",{"data-sve-code-host":""},null,-1))]),o[16]||(o[16]=m("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),m("div",ys,[m("div",bs,[m("span",null,K(e.jsLabel),1)]),o[14]||(o[14]=m("div",{"data-sve-code-host":""},null,-1))])])]))}},_s=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],Ss=["innerHTML"],$s={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>($(!0),C(D,null,ne(e.tools,n=>($(),C("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:R(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:R(s=>e.onTool(n.id),["prevent"])},[n.letter?($(),C(D,{key:0},[jn(K(n.letter),1)],64)):($(),C("span",{key:1,innerHTML:n.icon},null,8,Ss))],40,_s))),128))}},Cs=["aria-label"],As={value:""},Es=["label"],Ts=["value"],Bo={__name:"CodeDockAntlersSelect",props:{label:{type:String,required:!0},groups:{type:Array,required:!0},onPick:{type:Function,required:!0}},setup(e){const t=e;function o(n){const s=n.target.value;n.target.value="",s&&t.onPick(s)}return(n,s)=>($(),C("select",{"data-sve-antlers-select":"","aria-label":e.label,onChange:o},[m("option",As,K(e.label),1),($(!0),C(D,null,ne(e.groups,r=>($(),C("optgroup",{key:r.id,label:r.label},[($(!0),C(D,null,ne(r.items,i=>($(),C("option",{key:i.id,value:i.id},K(i.label),9,Ts))),128))],8,Es))),128))],40,Cs))}},ws=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Bs={__name:"CodeDockCssTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>($(!0),C(D,null,ne(e.tools,n=>($(),C("button",{key:n.id,type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:R(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:R(s=>e.onTool(n.id),["prevent"])},null,40,ws))),128))}},Ls={key:0,"data-sve-css-sep":"","aria-hidden":"true"},Ms=["data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick"],Is={__name:"CodeDockCssBoxRow",props:{sides:{type:Array,required:!0},onSide:{type:Function,required:!0}},setup(e){return(t,o)=>($(!0),C(D,null,ne(e.sides,n=>($(),C(D,{key:n.id},[n.sep?($(),C("span",Ls)):$t("",!0),m("button",{type:"button","data-sve-css-box-side":n.suffix,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:R(s=>e.onSide(n.suffix),["prevent","stop"])},null,8,Ms)],64))),128))}},Hs={key:0,"data-sve-css-sep":"","aria-hidden":"true"},Os=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Ds={"data-sve-css-flex-extras":""},Ps={key:0,"data-sve-css-sep":"","aria-hidden":"true"},Rs=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],js={__name:"CodeDockCssDisplayRow",props:{items:{type:Array,required:!0},extras:{type:Array,default:()=>[]},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>($(),C(D,null,[($(!0),C(D,null,ne(e.items,n=>($(),C(D,{key:n.id},[n.sep?($(),C("span",Hs)):$t("",!0),m("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:R(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:R(s=>e.onTool(n.id),["prevent"])},null,40,Os)],64))),128)),m("div",Ds,[($(!0),C(D,null,ne(e.extras,n=>($(),C(D,{key:n.id},[n.sep?($(),C("span",Ps)):$t("",!0),m("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:R(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:R(s=>e.onTool(n.id),["prevent"])},null,40,Rs)],64))),128))])],64))}},qs={key:0,"data-sve-css-swatches":""},zs=["data-sve-css-token","title","data-active","onClick"],Ns=["data-sve-css-token","data-active","onClick"],Ht={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(e){return(t,o)=>e.kind==="colors"?($(),C("div",qs,[m("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=R((...n)=>e.onClear&&e.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[m("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[m("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),($(!0),C(D,null,ne(e.swatches,n=>($(),C("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:qn({background:n.hex||"transparent"}),onClick:R(s=>e.onPick(n.name),["prevent","stop"])},null,12,zs))),128))])):($(!0),C(D,{key:1},ne(e.choices,n=>($(),C("button",{key:n.value,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:R(s=>e.onPick(n.value),["prevent","stop"])},K(n.label),9,Ns))),128))}},Fs={"data-sve-css-add-label":""},Vs=["placeholder","onKeydown"],Lo={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0}},setup(e){const t=e,o=oo(t.initial||""),n=oo(null);zn(()=>Nn(()=>{n.value?.focus(),n.value?.select()}));function s(){const r=o.value.trim();if(!r){n.value?.focus();return}t.onAdd(r)}return(r,i)=>($(),C(D,null,[m("label",Fs,K(e.label),1),Fn(m("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":i[0]||(i[0]=a=>o.value=a),type:"text",placeholder:e.placeholder,onKeydown:[no(R(s,["prevent"]),["enter"]),i[1]||(i[1]=no(R(()=>{},["stop"]),["escape"]))]},null,40,Vs),[[Vn,o.value]])],64))}},Mo=/^\.[a-zA-Z_][\w-]*$/;function Io(e){const t=String(e||"").match(/\[\s*([\s\S]*?)\s*\]/);return t?t[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).filter(o=>/^[a-zA-Z_][\w-]*$/.test(o)):[]}function Ws(e){const t=String(e||"").match(/\sclass\s*=\s*(["'])([^"']*)\1/i);return t?Io(t[2]):[]}function at(e){const t=String(e||""),o=[],n=/\sclass\s*=\s*(["'])/gi;let s;for(;s=n.exec(t);){const r=s[1],i=s.index+s[0].length,a=t.indexOf(r,i);if(a===-1)break;const l=t.slice(i,a).match(/\[([\s\S]*?)\]/);if(l){const u=l[1],f=i+l.index+1,p=u.replace(/\{\{[\s\S]*?\}\}/g,v=>" ".repeat(v.length)),g=/[a-zA-Z_][\w-]*/g;let b;for(;b=g.exec(p);)o.push({name:b[0],from:f+b.index,to:f+b.index+b[0].length})}n.lastIndex=a+1}return o}function ao(e,t){return at(e).find(o=>t>=o.from&&t<=o.to)||null}function lo(e,t){const o=String(e||""),n=at(o);let s=o;for(let r=n.length-1;r>=0;r-=1){const i=n[r],a=t(i.name);if(a!==i.name){if(!a){let c=i.from,l=i.to;s[l]===" "?l+=1:c>0&&s[c-1]===" "&&(c-=1),s=s.slice(0,c)+s.slice(l);continue}s=s.slice(0,i.from)+a+s.slice(i.to)}}return s}function Ho(e){const t=[],o=/(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;let n;for(;n=o.exec(String(e||""));)t.push(n[2]);return t}function Oo(e,t){const o=[],n=[],s=[];let r=0,i=0;for(;r<e.length&&i<t.length;){if(e[r]===t[i]){r+=1,i+=1;continue}const a=t.indexOf(e[r],i),c=e.indexOf(t[i],r);a===-1&&c===-1?(o.push({from:e[r],to:t[i]}),r+=1,i+=1):a===-1?(s.push(e[r]),r+=1):c===-1||a<=c?(n.push(t[i]),i+=1):(s.push(e[r]),r+=1)}for(;r<e.length;)s.push(e[r]),r+=1;for(;i<t.length;)n.push(t[i]),i+=1;return{renamed:o,added:n,removed:s}}function ye(e){let t=String(e||"").trim().replace(/^\.+/,"").replace(/\s+/g,"-").replace(/[^a-zA-Z0-9_-]/g,"");return/^[a-zA-Z_]/.test(t)||(t=t.replace(/^[^a-zA-Z_]+/,"")),Mo.test(`.${t}`)?t:""}function Us(e,t){const o=String(e||""),n=ye(t);if(!o||!n)return o;const s=o.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(s){const r=s[1];let i=s[2];const a=[...i.matchAll(/\[([\s\S]*?)\]/g)];if(a.length){const c=a.map(g=>g[1].trim()).filter(Boolean).join(" "),u=Io(`[ ${c} ]`).includes(n)?c:`${c} ${n}`.trim(),f=i.indexOf("["),p=i.lastIndexOf("]");i=`${i.slice(0,f)}[ ${u} ]${i.slice(p+1)}`.replace(/\s+/g," ").trim()}else i=`[ ${n} ] ${i}`.replace(/\s+/g," ").trim();return o.slice(0,s.index)+` class=${r}${i}${r}`+o.slice(s.index+s[0].length)}return/\/\s*>$/.test(o)?o.replace(/(\s*)(\/\s*>)$/,` class="[ ${n} ]"$1$2`):o.replace(/(\s*)>$/,` class="[ ${n} ]"$1>`)}function Ks(e,t){const o=String(e).indexOf(">",t.from);return o===-1?"":e.slice(t.from,o+1)}function Do(e,t){const o=[];for(const n of t){const s=Ws(Ks(e,n)),r=Do(e,n.children||[]);if(s.length){o.push({className:s[0],children:r});for(const i of s.slice(1))o.push({className:i,children:[]})}else o.push(...r)}return o}function lt(e){return Do(e,Zn(e))}function ot(e){return String(e).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Ot(e,t){if(e.startsWith("/*",t)){const o=e.indexOf("*/",t+2);return o===-1?e.length:o+2}return t}function Dt(e,t){let o=0;for(let n=t;n<e.length;n+=1){if(e.startsWith("/*",n)){n=Ot(e,n)-1;continue}if(e[n]==="{")o+=1;else if(e[n]==="}"&&(o-=1,o===0))return n}return-1}function X(e,t){const o=String(e||""),n=new RegExp(`(^|[^\\w-])\\.${ot(t)}\\s*\\{`,"g");let s;for(;s=n.exec(o);){const r=s.index+s[1].length,i=o.indexOf("{",r);if(i===-1)continue;const a=Dt(o,i);if(a!==-1)return{from:r,brace:i,close:a,to:a+1,name:t}}return null}function Xs(e){const t=String(e||""),o=[],n={},s=[];let r=0,i="";const a=()=>{const c=i.trim();c&&o.push(c),i=""};for(;r<t.length;){if(t.startsWith("/*",r)){const c=Ot(t,r);i+=t.slice(r,c),r=c;continue}if(t[r]==="{"){const c=i.trim(),l=Dt(t,r);if(l===-1)break;const u=t.slice(r+1,l);i="",Mo.test(c)?n[c.slice(1)]=u:c&&s.push(`${c} {${u}}`),r=l+1;continue}i+=t[r],r+=1}return a(),{decls:o.join(`
`),classes:n,other:s}}function co(e,t){const o="    ".repeat(t);return String(e||"").split(`
`).map(n=>n.trim()?o+n.trim():"").filter((n,s,r)=>n||s>0&&s<r.length-1).join(`
`)}function Ys(e,t){const o=X(e,t);return o?String(e).slice(o.brace+1,o.close):""}function Po(e,t,o){const n=Xs(Ys(t,e.className)),s="    ".repeat(o),r=[];n.decls&&r.push(co(n.decls.replace(/;+\s*$/,";"),o+1));for(const a of n.other)r.push(co(a,o+1));for(const a of e.children)r.push(Po(a,t,o+1));const i=r.filter(Boolean).join(`
`);return i?`${s}.${e.className} {
${i}
${s}}`:`${s}.${e.className} {
${s}}`}function Pt(e,t){return t?.length?t.map(o=>Po(o,e,0)).join(`

`)+`
`:""}function Ro(e){const t=String(e||"").match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);return t?t[1]:""}function Gs(e){const t=[],o=/\.([a-zA-Z_][\w-]*)\s*\{/g;let n,s=!0;for(;n=o.exec(String(e||""));){if(s){s=!1;continue}t.push(n[1])}return t}function Zs(e,t){const o=String(e).lastIndexOf(`
`,t-1)+1,n=e.slice(o,t);return/^\s*$/.test(n)?n:""}function Js(e,t){return t?e.split(`
`).map((o,n)=>n===0||!o?o:t+o).join(`
`):e}function Qs(e,t){let o=0;for(let n=0;n<t.from;n+=1){if(e.startsWith("/*",n)){n=Ot(e,n)-1;continue}e[n]==="{"?o+=1:e[n]==="}"&&(o-=1)}return o===0}function Rt(e,t,o){const n=Ro(t)||o;if(!n)return String(e||"");let s=String(t||"").trim();s?new RegExp(`^\\.${ot(n)}\\s*\\{`).test(s)||(s=`.${n} {
${s}
}`):s=`.${n} {
}`;let r=String(e||"");const i=X(r,n),a=Gs(s);if(i){const l=Zs(r,i.from);r=r.slice(0,i.from)+Js(s,l)+r.slice(i.to)}else r=`${r.trimEnd()}${r.trim()?`
`:""}${s}
`;const c=X(r,n);if(!c)return r;for(const l of[...new Set(a)].reverse()){const u=new RegExp(`(^|[^\\w-])\\.${ot(l)}\\s*\\{`,"g"),f=[];let p;for(;p=u.exec(r);){const g=p.index+p[1].length,b=r.indexOf("{",g),v=Dt(r,b);v!==-1&&f.push({from:g,to:v+1})}for(const g of f.reverse()){if(g.from>=c.from&&g.to<=c.to||!Qs(r,g))continue;let b=g.from;const v=r.lastIndexOf(`
`,b-1)+1;/^\s*$/.test(r.slice(v,b))&&(b=v);let I=g.to;r[I]===`
`&&(I+=1),r=r.slice(0,b)+r.slice(I)}}return r}function kt(e,t){const o=String(e||"");return`${o.trimEnd()}${o.trim()?`
`:""}.${t} {
}
`}function er(e,t,o){const n=ye(o);return!t||!n||t===n?String(e||""):X(e,n)?jo(e,t):String(e||"").replace(new RegExp(`(^|[^\\w-])\\.${ot(t)}(\\s*\\{)`,"g"),`$1.${n}$2`)}function jo(e,t){let o=String(e||"");for(;;){const n=X(o,t);if(!n)break;let s=n.from;const r=o.lastIndexOf(`
`,s-1)+1;/^\s*$/.test(o.slice(r,s))&&(s=r);let i=n.to;o[i]===`
`&&(i+=1),o=o.slice(0,s)+o.slice(i)}return o}function tr(e,t,o){const n=Array.isArray(t)?t:[],s=Array.isArray(o)?o:[],{renamed:r,added:i}=Oo(n,s),a=new Set(s);let c=String(e||"");for(const l of r){const u=ye(l.to);if(u){if(a.has(l.from)){X(c,u)||(c=kt(c,u));continue}X(c,l.from)?c=er(c,l.from,u):X(c,u)||(c=kt(c,u))}}for(const l of i){const u=ye(l);!u||X(c,u)||(c=kt(c,u))}return c}function or(e,t,o){const n=new Set(Array.isArray(t)?t:[]),s=new Set(Array.isArray(o)?o:[]);let r=String(e||"");for(const i of s)n.has(i)||(r=jo(r,i));return r}const Ye="visual_edit",nr=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],qo=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function sr(e){return qo.find(t=>t.id===e)||null}function rr(e,t,o,n){let s=t;for(;s<o;){const r=e.indexOf("{{",s);if(r===-1||r>=o)return null;const i=e.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const a=e.slice(r+2,i);if((a.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:a};s=i+2}return null}function ir(e,t){const o=String(t).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(e)}const le="__sve-partial-menu",ar=/\{\{#([\s\S]*?)#\}\}/g,uo=/\{\{\s*partial(?::([^\s}]+)|(?=[\s}]))([\s\S]*?)\}\}/gi,_t=new Map;function zo(e){const t=String(e||"").replace(ar,s=>" ".repeat(s.length)),o=[];uo.lastIndex=0;let n;for(;n=uo.exec(t);){const s=(n[1]||"").trim(),i=(n[2]||"").match(/\bsrc\s*=\s*(["'])([^"']+)\1/i),a=s||(i?i[2].trim():"");!a||a.includes("..")||o.push({from:n.index,to:n.index+n[0].length,src:a})}return o}function fo(e,t){return zo(e).find(o=>t>=o.from&&t<=o.to)||null}const lr=new Set(["if","elseif","else","unless","foreach","forelse","noparse","once","cache","nocache","section","yield","partial","slot","switch","case","vite","sve_html","sve_css","sve_js","sve_tw","style_push","script_push"]);function cr(e,t){const o=[],n=/\{\{\s*(\/?)([A-Za-z_][A-Za-z0-9_]*)\b[\s\S]*?\}\}/g;let s;for(;s=n.exec(String(e||""));){const i=s[2];if(!lr.has(i.toLowerCase())){if(!s[1]){o.push({name:i,from:s.index,to:null});continue}for(let a=o.length-1;a>=0;a-=1)if(o[a].name===i&&o[a].to==null){o[a].to=s.index+s[0].length;break}}}let r=null;for(const i of o)i.to==null||t<i.from||t>i.to||(!r||i.to-i.from<r.to-r.from)&&(r=i);return r?.name||null}function dr(e,t){const o=new Set,n=s=>{if(Array.isArray(s)){if(!t){for(const r of s)r&&typeof r=="object"&&typeof r.type=="string"&&r.type&&o.add(r.type),n(r);return}s.forEach(n);return}if(!(!s||typeof s!="object")){if(t&&Array.isArray(s[t]))for(const r of s[t])r&&typeof r=="object"&&typeof r.type=="string"&&r.type&&o.add(r.type);Object.values(s).forEach(n)}};return n(e),o}function ur(e,t,o,n){if(!e.src.includes("{")||!n)return t;const s=cr(o,e.from),r=dr(n,s);return s?t.filter(i=>r.has(i.label)):r.size===0?t:t.filter(i=>r.has(i.label))}function fr(e,t){if(_t.has(t))return _t.get(t);const o=e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>Array.isArray(n.items)?n.items:[]).catch(()=>[]);return _t.set(t,o),o}let Ie=null;function po(e){e.clearTimeout(Ie),Ie=null}function pr(e,t){Ie||(Ie=e.setTimeout(()=>{Ie=null,t?.()},180))}function J(e){e?.getElementById(le)?.remove()}function hr(e,t,o,n,{onOpen:s,emptyLabel:r,onStay:i,onLeave:a}){const c=e.document;J(c);const l=c.createElement("div");if(l.id=le,l.style.left=`${Math.max(8,Math.round(o))}px`,l.style.top=`${Math.max(8,Math.round(n))}px`,t.length)t.forEach(b=>{const v=c.createElement("button");v.type="button",v.setAttribute("data-sve-partial-choice",""),v.textContent=b.label,v.title=b.path||b.type,v.addEventListener("click",I=>{I.preventDefault(),I.stopPropagation(),J(c),s?.(b.type)}),l.appendChild(v)});else{const b=c.createElement("div");b.setAttribute("data-sve-partial-empty",""),b.textContent=r||"",l.appendChild(b)}c.body.appendChild(l);const u=l.getBoundingClientRect(),f=8;let p=u.left,g=u.top;u.right>e.innerWidth-f&&(p=Math.max(f,e.innerWidth-u.width-f)),u.bottom>e.innerHeight-f&&(g=Math.max(f,e.innerHeight-u.height-f)),l.style.left=`${Math.round(p)}px`,l.style.top=`${Math.round(g)}px`,l.addEventListener("mouseenter",()=>i?.()),l.addEventListener("mouseleave",()=>a?.())}function mr(e){const t=e.Decoration.mark({class:"sve-cm-partial"}),o=e.Decoration.line({class:"sve-cm-partial-line"}),n=e.StateEffect.define(),s=e.StateField.define({create(i){return ho(i,e,t)},update(i,a){return a.docChanged?ho(a.state,e,t):i},provide:i=>e.EditorView.decorations.from(i)}),r=e.StateField.define({create(){return e.Decoration.none},update(i,a){let c;for(const p of a.effects)p.is(n)&&(c=p.value);if(c===void 0)return a.docChanged?e.Decoration.none:i;if(!c)return e.Decoration.none;const l=new e.RangeSetBuilder,u=a.state.doc.lineAt(c.from),f=a.state.doc.lineAt(c.to);for(let p=u.number;p<=f.number;p+=1){const g=a.state.doc.line(p);l.add(g.from,g.from,o)}return l.finish()},provide:i=>e.EditorView.decorations.from(i)});return{extensions:[s,r],setHover(i,a){i&&i.dispatch({effects:n.of(a)})}}}function ho(e,t,o){const n=new t.RangeSetBuilder;for(const s of zo(e.doc.toString()))n.add(s.from,s.to,o);return n.finish()}function gr(e,t,{onOpen:o,emptyLabel:n,sectionValues:s,isLocked:r,setHover:i}){if(!t?.dom||t.dom._svePartialBound)return;t.dom._svePartialBound=!0;let a=null,c="",l="";const u=()=>{po(e),e.clearTimeout(a),a=null,l="",c="",i?.(t,null),J(e.document)},f={stay:()=>po(e),leave:()=>pr(e,u)},p=()=>{e.clearTimeout(a),a=null,l="",i?.(t,null)},g=()=>!!r?.(),b=(v,I,H,{click:ie}={})=>{if(g()){J(e.document),i?.(t,null);return}c=v.src,fr(e,v.src).then(Te=>{if(c!==v.src)return;const Rn=t.state.doc.toString(),Xe=ur(v,Te,Rn,s?.()||null);if(Xe.length===1){ie&&(J(e.document),o?.(Xe[0].type));return}!Xe.length&&!ie||hr(e,Xe,I,H,{onOpen:o,emptyLabel:n,onStay:f.stay,onLeave:f.leave})})};t.dom.addEventListener("mousemove",v=>{if(g()){u();return}const I=t.posAtCoords({x:v.clientX,y:v.clientY});if(I==null)return;const H=fo(t.state.doc.toString(),I);if(!H){e.clearTimeout(a),a=null,l="",f.leave();return}f.stay(),i?.(t,{from:H.from,to:H.to}),!(l===H.src&&a)&&(p(),l=H.src,a=e.setTimeout(()=>{const ie=t.coordsAtPos(H.from);b(H,ie?.left??v.clientX,(ie?.bottom??v.clientY)+6)},280))}),t.dom.addEventListener("mouseleave",v=>{if(v.relatedTarget?.closest?.(`#${le}`)){f.stay();return}f.leave()}),t.dom.addEventListener("click",v=>{if(g()){J(e.document);return}const I=t.posAtCoords({x:v.clientX,y:v.clientY});if(I==null)return;const H=fo(t.state.doc.toString(),I);H&&(p(),b(H,v.clientX,v.clientY+8,{click:!0}))}),vr(e.document)||(e.document.addEventListener("mousedown",v=>{v.target.closest(`#${le}, .sve-cm-partial`)||J(e.document)}),e.document._svePartialDismiss=!0)}function vr(e){return!!e._svePartialDismiss}const Q="__sve-css-rename-chip",xr='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function yr(e){const t=e.Decoration.mark({class:"sve-cm-css-token"}),o=e.StateEffect.define();return{extensions:[e.StateField.define({create(){return e.Decoration.none},update(s,r){let i;for(const c of r.effects)c.is(o)&&(i=c.value);if(i===void 0)return r.docChanged?e.Decoration.none:s;if(!i)return e.Decoration.none;const a=new e.RangeSetBuilder;return a.add(i.from,i.to,t),a.finish()},provide:s=>e.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function oe(e){e?.getElementById(Q)?.remove()}function br(e,t,o,n){t.style.left=`${Math.max(6,Math.min(o,e.innerWidth-28))}px`,t.style.top=`${Math.max(6,n)}px`}function kr(e,t,o,{onRename:n,title:s}){const r=e.document,i=t.coordsAtPos(o.to);if(!i)return;oe(r);const a=r.createElement("button");a.id=Q,a.type="button",a.innerHTML=xr,a.title=s,a.setAttribute("aria-label",s),a.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),oe(r),n?.(o)}),a.addEventListener("mouseleave",()=>{e.setTimeout(()=>{t.dom.matches(":hover")||a.matches(":hover")||oe(r)},120)}),r.body.appendChild(a),br(e,a,i.right+2,i.top-1)}function _r(e,t,{onRename:o,isLocked:n,setHover:s,title:r}){if(!t?.dom||t.dom._sveClassTokenBound)return;t.dom._sveClassTokenBound=!0;let i=null,a="";const c=()=>!!n?.(),l=()=>{e.clearTimeout(i),i=null,a="",s?.(t,null),oe(e.document)},u=f=>{if(c()){l();return}l(),o?.(f)};t.dom.addEventListener("mousemove",f=>{if(c()){l();return}if(f.target?.closest?.(`#${Q}`))return;const p=t.posAtCoords({x:f.clientX,y:f.clientY});if(p==null)return;const g=ao(t.state.doc.toString(),p);if(!g){e.clearTimeout(i),i=null,a="",s?.(t,null);return}const b=`${g.from}:${g.to}:${g.name}`;s?.(t,{from:g.from,to:g.to}),!(a===b&&(i||e.document.getElementById(Q)))&&(e.clearTimeout(i),a=b,i=e.setTimeout(()=>{i=null,kr(e,t,g,{onRename:u,title:r||"Rename class"})},160))}),t.dom.addEventListener("mouseleave",f=>{f.relatedTarget?.closest?.(`#${Q}`)||e.setTimeout(()=>{e.document.getElementById(Q)?.matches(":hover")||l()},160)}),t.dom.addEventListener("dblclick",f=>{if(c())return;const p=t.posAtCoords({x:f.clientX,y:f.clientY});if(p==null)return;const g=ao(t.state.doc.toString(),p);g&&(f.preventDefault(),f.stopPropagation(),u(g))},!0),t.scrollDOM?.addEventListener("scroll",l),e.document._sveClassTokenDismiss||(e.document._sveClassTokenDismiss=!0,e.document.addEventListener("mousedown",f=>{f.target.closest(`#${Q}`)||oe(e.document)}))}let te,Ct,No,Fo,Vo,me,nt,jt,qt,zt,Nt,Wo,Uo,Ko,Xo,Yo,Go,Zo,Jo,Qo,en,tn,on,nn,sn,rn,an,L,we=null;function Sr(){return we||(we=Promise.all([Z(()=>import("./index-Dpuj8sxX.js").then(e=>e.i),__vite__mapDeps([0,1]),import.meta.url),Z(()=>import("./index-B5fiB6ig.js"),[],import.meta.url),Z(()=>import("./index-eMi007Cw.js"),__vite__mapDeps([2,1,0,3,4]),import.meta.url),Z(()=>import("./index-D2YMCfE7.js"),__vite__mapDeps([5,1,0,3,4]),import.meta.url),Z(()=>import("./html-tag-sync-BlP2Mk13.js").then(e=>e.g),__vite__mapDeps([6,0,1,7,4,3,5,2]),import.meta.url),Z(()=>import("./index-BatCsQTe.js").then(e=>e.i),__vite__mapDeps([7,4,3,1,0]),import.meta.url),Z(()=>import("./html-tag-sync-BlP2Mk13.js").then(e=>e.f),__vite__mapDeps([6,0,1,7,4,3,5,2]),import.meta.url),Z(()=>import("./index-zsjA895l.js"),__vite__mapDeps([3,4,1,0]),import.meta.url),Z(()=>import("./index-BsAZfAgM.js").then(e=>e.i),[],import.meta.url)]).then(([e,t,o,n,s,r,i,a,c])=>{te=e.EditorView,Ct=e.keymap,No=e.lineNumbers,Fo=e.highlightActiveLine,Vo=e.highlightActiveLineGutter,me=t.Compartment,nt=t.EditorState,jt=t.StateField,qt=t.StateEffect,zt=t.RangeSetBuilder,Nt=e.Decoration,Wo=o.defaultKeymap,Uo=o.indentWithTab,Ko=o.historyKeymap,Xo=o.history,Yo=n.autocompletion,Go=n.closeBrackets,Zo=n.closeBracketsKeymap,Jo=n.closeCompletion,Qo=n.completionKeymap,en=e.hoverTooltip,tn=s.htmlLanguage,on=s.html,nn=r.css,sn=i.javascript,rn=a.HighlightStyle,an=a.syntaxHighlighting,L=c.tags,De.html=new me,De.css=new me,De.js=new me,Pe.html=new me,Pe.css=new me,Pe.js=new me}).catch(e=>{throw we=null,e}),we)}const d="__sve-code-dock",mo="__sve-code-dock-style",U="__sve-code-dock-unlock",ln="sve-code-dock-height",cn="sve-code-dock-panes",dn="sve-code-dock-widths",Ft="sve-html-scope-v2",un="sve-code-dock-autosave",$r=280,fn=120,St=140,Cr=250,j=["html","css","js"],Ar='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Er='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',Tr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',pn='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',wr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',Br='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',Lr='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',w="__sve-css-menu",hn=["h1","h2","h3","h4","h5","h6"],At=[{id:"heading",title:"heading",menu:"heading",letter:"H"},{id:"p",title:"paragraph",tag:"p",letter:"P"},{id:"div",title:"div",tag:"div"},{id:"section",title:"section",tag:"section"},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"}],Mr=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],mn=[{id:"all",suffix:"",title:"all"},{id:"block",suffix:"-block",title:"block",sep:!0},{id:"block-start",suffix:"-block-start",title:"block start"},{id:"block-end",suffix:"-block-end",title:"block end"},{id:"inline",suffix:"-inline",title:"inline",sep:!0},{id:"inline-start",suffix:"-inline-start",title:"inline start"},{id:"inline-end",suffix:"-inline-end",title:"inline end"}],gn=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],Et=[{id:"display",title:"display",menu:"display"},{id:"absolute",title:"absolute",insert:"position: absolute;"},{id:"color",title:"color",property:"color",menu:"colors"},{id:"bg",title:"background color",property:"background-color",menu:"colors"},{id:"padding",title:"padding",property:"padding",menu:"box"},{id:"margin",title:"margin",property:"margin",menu:"box"}],Tt=[{id:"display-flex",title:"flex",display:"flex"},{id:"flex-row",title:"row",flexDir:"row",sep:!0},{id:"flex-col",title:"column",flexDir:"column"}],wt=[{id:"justify-start",title:"justify start",property:"justify-content",value:"flex-start"},{id:"justify-center",title:"justify center",property:"justify-content",value:"center"},{id:"justify-end",title:"justify end",property:"justify-content",value:"flex-end"},{id:"justify-between",title:"space between",property:"justify-content",value:"space-between"},{id:"justify-around",title:"space around",property:"justify-content",value:"space-around"},{id:"align-start",title:"align start",property:"align-items",value:"flex-start",group:"align"},{id:"align-center",title:"align center",property:"align-items",value:"center",group:"align"},{id:"align-end",title:"align end",property:"align-items",value:"flex-end",group:"align"},{id:"align-stretch",title:"align stretch",property:"align-items",value:"stretch",group:"align"}],Ge={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 13.5 L8 2.5 L12 13.5"/><path d="M5.4 10h5.2"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="12" height="12" rx="2" opacity=".85"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>'},Ir={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>'};let Ze=null,be=null,E=null,ce=[],V={html:"",css:"",js:""},M=!1,ke=!1,_=null,Be=0,G=null,z=null,ge=null,He=null,je=!1,q=!1,O=!0,B=!1,y=null,A="",S="",Y="full",de="",ae=null,Oe=null,Le=null,Me=null,go=!1;const h={html:null,css:null,js:null},De={html:null,css:null,js:null},Pe={html:null,css:null,js:null};function x(e,t,o={}){let n=e.Statamic?.$config?.get?.("sveStrings")?.[t]??t;for(const[s,r]of Object.entries(o))n=String(n).replaceAll(`:${s}`,r);return n}function vn(e){return e.document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||e.Statamic?.$config?.get?.("csrfToken")||e.Statamic?.$config?.get?.("csrf_token")||""}function Hr(){return[te.theme({"&":{height:"auto",backgroundColor:"#1e1e1e",color:"#d4d4d4"},".cm-content":{caretColor:"#aeafad",padding:"12px 0",fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:"13px",lineHeight:"1.55"},".cm-cursor":{borderLeftColor:"#aeafad"},".cm-activeLine":{backgroundColor:"#ffffff0d"},".cm-activeLineGutter":{backgroundColor:"#ffffff0d"},".cm-gutters":{backgroundColor:"#1e1e1e",color:"#858585",border:"none",borderRight:"1px solid #3c3c3c",fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:"13px",lineHeight:"1.55"},".cm-lineNumbers .cm-gutterElement":{paddingLeft:"8px",paddingRight:"12px"},".cm-scroller":{overflow:"visible",height:"auto",minHeight:0},".cm-selectionBackground, &.cm-focused .cm-selectionBackground":{backgroundColor:"#264f78 !important"}},{dark:!0}),an(rn.define([{tag:L.keyword,color:"#569cd6"},{tag:L.string,color:"#ce9178"},{tag:L.comment,color:"#6a9955",fontStyle:"italic"},{tag:L.number,color:"#b5cea8"},{tag:L.className,color:"#d7ba7d"},{tag:L.tagName,color:"#4ec9b0"},{tag:L.propertyName,color:"#9cdcfe"},{tag:L.variableName,color:"#9cdcfe"},{tag:L.attributeName,color:"#9cdcfe"},{tag:L.attributeValue,color:"#ce9178"},{tag:L.angleBracket,color:"#808080"},{tag:L.unit,color:"#b5cea8"},{tag:L.color,color:"#ce9178"},{tag:L.bracket,color:"#ffd700"},{tag:L.punctuation,color:"#d4d4d4"},{tag:L.operator,color:"#d4d4d4"}]))]}function Or(e){return e==="css"?nn():e==="js"?sn():on({autoCloseTags:!0})}function Dr(e){return e.querySelector(".live-preview")||e.body}function Bt(e,t){const o=Dr(e);t.parentElement!==o&&o.appendChild(t)}function vo(e){if(e._sveShield)return;e._sveShield=!0;const t=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])e.addEventListener(o,t)}function Pr(e){try{return new URLSearchParams(e.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function Rr(e){const t=parseInt(Fe(e,ln)??"",10);return Number.isFinite(t)&&t>=fn?t:$r}function jr(e,t){Ce(e,ln,String(t))}function xn(e){try{const t=JSON.parse(Fe(e,cn)||"null");if(t&&typeof t=="object")return{html:t.html!==!1,css:t.css!==!1,js:t.js===!0}}catch{}return{html:!0,css:!0,js:!1}}function qr(e,t){Ce(e,cn,JSON.stringify(t))}function yn(e){try{const t=JSON.parse(Fe(e,dn)||"null");if(t&&typeof t=="object"){const o=n=>Number.isFinite(n)&&n>0?n:1;return{html:o(t.html),css:o(t.css),js:o(t.js)}}}catch{}return{html:1,css:1,js:1}}function zr(e,t){Ce(e,dn,JSON.stringify(t))}function Nr(e){let t=e.getElementById(mo);t||(t=e.createElement("style"),t.id=mo,e.head.appendChild(t)),t.textContent=`
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
  ${io("ns")}
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
#${w} {
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
#${w} [data-sve-css-swatches] {
  display: grid;
  grid-template-columns: repeat(8, 16px);
  gap: 4px;
}
#${w} [data-sve-css-swatch] {
  all: unset;
  cursor: pointer;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  box-sizing: border-box;
  border: 1px solid rgba(255,255,255,.2);
}
#${w} [data-sve-css-swatch]:hover,
#${w} [data-sve-css-clear]:hover {
  outline: 1px solid #fff;
  outline-offset: 1px;
}
#${w} [data-sve-css-clear] {
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
#${w} [data-sve-css-choice] {
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
#${w} [data-sve-css-choice]:hover,
#${w} [data-sve-css-swatch][data-active],
#${w} [data-sve-css-choice][data-active] {
  outline: 1px solid #fff;
  outline-offset: 1px;
  background: rgba(255,255,255,.1);
}
#${w} [data-sve-css-add-label] {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  opacity: .55;
  margin-bottom: 6px;
}
#${w} [data-sve-css-add-input] {
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
  ${io("ew")}
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
`}function Fr(e){const t=e.querySelector(".live-preview-editor");if(!t)return 0;const o=t.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function Vr(e){let t=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=e.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>e.documentElement.clientWidth-8&&(t=Math.max(t,Math.round(s.width)))}return t}function Vt(e){const t=e.document;if(Oe=e,typeof e.ResizeObserver!="function")return;ae||(ae=new e.ResizeObserver(()=>{Oe&&Xi(Oe)}));const o=t.querySelector(".live-preview-editor"),n=t.getElementById("__sve-right-dock");o!==Le&&(Le&&ae.unobserve(Le),Le=o,o&&ae.observe(o)),n!==Me&&(Me&&ae.unobserve(Me),Me=n,n&&ae.observe(n))}function Wr(){ae?.disconnect(),ae=null,Oe=null,Le=null,Me=null}function Ur(e){go||(go=!0,e.addEventListener("sve-right-dock-change",()=>Vt(e)))}function Wt(e,t){const o=e.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=t?`${t}px`:"")}function Ut(e){if(!e)return;const t=e.clientHeight,o=e.querySelector("[data-sve-code-bar]"),n=e.querySelector("[data-sve-code-lock-banner]"),s=n&&Kr(e)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,t-(o?.offsetHeight||0)-s),i=e.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),e.querySelectorAll("[data-sve-code-host]").forEach(a=>{const c=a.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let l=0;for(const f of c.children)f!==a&&(l+=f.offsetHeight);const u=Math.max(64,r-l);a.style.height=`${u}px`,a.style.maxHeight=`${u}px`,a.style.minHeight="0",a.style.overflow="auto",Xr(a)})}function Kr(e){return e.ownerDocument?.defaultView||_}function Xr(e){e._sveWheelBound||(e._sveWheelBound=!0,e.addEventListener("wheel",t=>{const o=e.scrollHeight-e.clientHeight,n=e.scrollWidth-e.clientWidth;let s=!1;if(t.deltaY&&o>0){const r=Math.min(o,Math.max(0,e.scrollTop+t.deltaY));r!==e.scrollTop&&(e.scrollTop=r,s=!0)}if(t.deltaX&&n>0){const r=Math.min(n,Math.max(0,e.scrollLeft+t.deltaX));r!==e.scrollLeft&&(e.scrollLeft=r,s=!0)}s&&(t.preventDefault(),t.stopPropagation())},{passive:!1}))}function bn(){const e=(Oe||_)?.document?.getElementById(d);e&&Ut(e);for(const t of j)h[t]?.requestMeasure()}function kn(e,t){const o=xn(e),n={};for(const s of j){const r=t.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function _n(e,t){for(const n of j){const s=e.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",t[n]?"true":"false"),r&&(r.style.display=t[n]?"flex":"none")}const o=j.filter(n=>t[n]);e.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),Sn(e.ownerDocument.defaultView,e),Ut(e)}function Sn(e,t){const o=yn(e);for(const n of j){const s=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function qe(e,t){if(je)return;const o=e.document;Bt(o,t);const n=Rr(e),s=Fr(o),r=Vr(o);t.style.left=`${s}px`,t.style.right=`${r}px`,t.style.bottom="0",t.style.height=`${n}px`,Wt(o,n),Ut(t)}function $n(e,t,o,n){const s=e.document,r=[...s.querySelectorAll("iframe")];r.forEach(u=>{u.style.pointerEvents="none"});const i=s.createElement("div");i.setAttribute("data-sve-code-drag-shield",""),i.style.cssText=`position:fixed;inset:0;z-index:2147483646;cursor:${t};user-select:none;`,s.body.appendChild(i),je=!0;let a=!1;const c=u=>{o(u)},l=()=>{a||(a=!0,je=!1,s.removeEventListener("mousemove",c),s.removeEventListener("mouseup",l),e.removeEventListener("blur",l),r.forEach(u=>{u.style.pointerEvents=""}),i.remove(),n?.())};s.addEventListener("mousemove",c),s.addEventListener("mouseup",l),e.addEventListener("blur",l)}function Yr(e,t){if(t._sveResizeBound)return;t._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest("[data-sve-code-pane-btn], [data-sve-code-back], [data-sve-html-scope], [data-sve-code-lock], [data-sve-code-autosave], [data-sve-code-save], .cm-editor"))return;n.preventDefault();const s=n.clientY,r=t.getBoundingClientRect().height;let i=r;$n(e,"ns-resize",a=>{i=Math.min(Math.max(fn,r+(s-a.clientY)),Math.round(e.innerHeight*.7)),t.style.height=`${i}px`,Wt(e.document,i),bn()},()=>{jr(e,i),qe(e,t),e.dispatchEvent(new Event("resize"))})};t.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),t.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function Gr(e,t){t._sveSplitBound||(t._sveSplitBound=!0,t.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=j.filter(v=>kn(e,t)[v]),i=r.indexOf(s),a=r[i],c=r[i+1];if(!a||!c)return;const l=t.querySelector(`[data-sve-code-pane="${a}"]`),u=t.querySelector(`[data-sve-code-pane="${c}"]`),f=n.clientX,p=l.getBoundingClientRect().width,g=u.getBoundingClientRect().width,b=p+g;o.setAttribute("data-active",""),$n(e,"col-resize",v=>{const I=v.clientX-f;let H=Math.max(St,Math.min(b-St,p+I)),ie=b-H;b<St*2&&(H=p,ie=g);const Te=yn(e);Te[a]=H,Te[c]=ie,zr(e,Te),Sn(e,t),bn()},()=>{o.removeAttribute("data-active")})})}))}function Zr(e,t){t._svePaneBound||(t._svePaneBound=!0,t.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=kn(e,t),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),qr(e,i),_n(t,i)})}))}function N(e,t){const o=e.getElementById(d)?.querySelector("[data-sve-code-status]");o&&(o.textContent=t||"")}function Cn(e,t){const o=e.getElementById(d)?.querySelector("[data-sve-code-path]");o&&(o.textContent=t||"",o.title=t||"")}function ze(e){const t=e?.document?.getElementById(d)?.querySelector("[data-sve-code-back]");t&&(t.hidden=ce.length===0,t.title=x(e,"code_dock_back"),t.setAttribute("aria-label",t.title),t.innerHTML=Tr)}function xo(e,t){const o=t.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),ei(e)}))}function Jr(e){const t=be,o=typeof k.activeContainers=="function"?k.activeContainers(e.document):[];for(const n of o){const s=k.unwrapRef?.(n.values)||n.values;if(!(!s||typeof s!="object")&&t&&typeof k.findPathByUid=="function"){const r=k.findPathByUid(s,t);if(r){const i=r.split("."),a=k.dataGet?.(s,i.slice(0,2).join("."));if(a&&typeof a=="object")return a}}}for(const n of o){const s=k.unwrapRef?.(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function Qr(e,t){!t||t===E||(se(e.document),bt(e,t,"push"))}function ei(e){const t=ce.pop();if(!t){ze(e);return}se(e.document),bt(e,t,"keep")}function $e(e){const t=e.document.getElementById(d),o=t?.querySelector("[data-sve-code-lock]"),n=t?.querySelector("[data-sve-code-lock-banner]");if(!t||!o)return;const s=M;t.toggleAttribute("data-sve-code-locked",s),s&&(J(e.document),oe(e.document),xe&&(xe.setHover(h.html,null),xe.setHover(h.css,null)),Re?.setHover(h.html,null)),o.hidden=!ke,o.setAttribute("aria-pressed",M?"true":"false"),o.title=x(e,M?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=M?Ar:Er,n&&(n.textContent=x(e,"code_dock_locked_banner"))}function We(e){return e?Fe(e,Ft)!=="0":O}function ct(e,t,o){return e!=null&&t!=null&&e>=0&&t>e&&t<=o}function dt(){const e=h.html?.state.doc.toString()??"";if(!B||!y){A=e;return}if(y.from<0||y.from>A.length||y.to<y.from){B=!1,A=e,y=null;return}A=A.slice(0,y.from)+e+A.slice(y.to),y={from:y.from,to:y.from+e.length}}function ut(){return dt(),B?A:h.html?.state.doc.toString()??V.html??""}function ft(){z=at(ut()).map(e=>e.name)}function Ae(){ge=Ho(h.css?.state.doc.toString()??S)}function An(e,t){return Array.isArray(e)&&Array.isArray(t)&&e.length===t.length&&e.every((o,n)=>o===t[n])}function ti(){const e=B?Xt():ut(),t=lt(e);t.length&&(S=Rt(S,Pt(S,t),t[0].className))}function En(e,t){S=tr(S,e,t),ti(),S=or(S,t,e)}function oi(e){if(q||M||z==null)return;const t=at(ut()).map(o=>o.name);An(z,t)||(En(z,t),z=t,ht(),Ae())}function ni(){if(q||M||ge==null||z==null||Y==="empty")return;const e=h.html,t=Ho(h.css?.state.doc.toString()??"");if(!e||An(ge,t))return;const o=new Set(z),{renamed:n,removed:s}=Oo(ge,t);let r=e.state.doc.toString();const i=r;for(const a of n){const c=ye(a.to);!o.has(a.from)||!c||(r=lo(r,l=>l===a.from?c:l))}for(const a of s)!o.has(a)||t.includes(a)||(r=lo(r,c=>c===a?"":c));if(r!==i){q=!0;try{pt(r)}finally{q=!1}}ft(),ge=t}function si(e,t){const o=ye(t),n=h.html;if(!o||!n||n.state.readOnly||o===e.name)return;q=!0;try{n.dispatch({changes:{from:e.from,to:e.to,insert:o}})}finally{q=!1}const s=z==null?[]:z.slice();ft(),En(s,z),ht(),Ae(),_&&(he(_),pe(_))}function ri(e,t){const o=e.document,s=h.html?.coordsAtPos(t.from);T(o),oe(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=w,o.body.appendChild(r),Ue(e,i,r),r._sveApp=Ve(Lo,r,{label:x(e,"code_dock_css_rename_class"),placeholder:x(e,"code_dock_css_class_placeholder"),initial:t.name,onAdd:a=>{si(t,a),T(o)}})}function Tn(){return O&&ct(y?.from,y?.to,A.length)?(B=!0,A.slice(y.from,y.to)):(B=!1,A)}function Kt(e,t,o){const n=h[e];if(!n)return;const s=n.state.doc.toString();q=!0;try{s!==t?n.dispatch({changes:{from:0,to:s.length,insert:t},...o?{selection:o,scrollIntoView:!0}:{}}):o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{q=!1}}function pt(e,t){Kt("html",e,t)}function Xt(){return B?h.html?.state.doc.toString()??"":ct(y?.from,y?.to,A.length)?A.slice(y.from,y.to):""}function Ee(){const e=h.css?.state.doc.toString()??"";if(Y==="tree"){if(e===de)return;const t=lt(Xt())[0]?.className||Ro(e);S=Rt(S,e,t),de=e}else Y==="full"&&(S=e)}function wn(e,t){for(const o of t||[])if(!X(e,o.className)||wn(e,o.children))return!0;return!1}function ht(){let e=S,t=[],o=!1;!O||!B?(Y="full",e=S):(t=lt(Xt()),t.length?(Y="tree",e=Pt(S,t),wn(S,t)&&(S=Rt(S,e,t[0].className),o=!0)):(Y="empty",e="")),de=e,Kt("css",e),Ae(),_&&(pe(_),o&&he(_))}function Yt(){const e=h.html;if(!e||!y)return;B||(A=e.state.doc.toString());const t=A.length,o=Math.max(0,Math.min(y.from,t)),n=Math.max(o,Math.min(y.to,t));n<=o||(y={from:o,to:n},B=!0,pt(A.slice(o,n),{anchor:0,head:0}),ht(),e.focus())}function Gt(e=!0){const t=h.html;if(!t)return;Ee(),dt(),B=!1;const o=A||t.state.doc.toString(),n=e&&ct(y?.from,y?.to,o.length)?{anchor:y.from,head:y.to}:null;A=o,pt(o,n),Y="full",de=S,Kt("css",S),Ae()}function Zt(){y=null,B=!1,A="",S="",Y="full",de="",z=null,ge=null}let Ne=!1;function Se(e){return!!e?.document.getElementById(k.HTML_TREE_PANEL_ID)}function yo(e,t){if(!(!e||k.featureOn?.(e,"html_tree")===!1)){if(!t){Se(e)&&k.closeHtmlTreePanel?.(e);return}Se(e)||(Ne=!0,Xn("html_tree").then(()=>{Se(e)||k.toggleHtmlTreePanel?.(e)}).catch(()=>{}).finally(()=>{Ne=!1,W(e)}))}}function W(e){const t=e?.document.getElementById(d)?.querySelector("[data-sve-html-scope]");if(!t)return;O=We(e);const o=k.featureOn?.(e,"html_tree")===!1?O:Se(e)||Ne;t.setAttribute("aria-pressed",o?"true":"false"),t.title=x(e,o?"code_dock_html_scope_off":"code_dock_html_scope"),t.setAttribute("aria-label",t.title),t.innerHTML=pn,e.document.getElementById(d)?.toggleAttribute("data-sve-html-scoped",B)}function bo(e,t){t._sveHtmlScopeBound||(t._sveHtmlScopeBound=!0,O=We(e),ii(e,t),yo(e,O),t.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),O=!(Se(e)||Ne),Ce(e,Ft,O?"1":"0"),O?y&&(Ee(),Yt()):B&&Gt(),yo(e,O),W(e)}))}function ii(e,t){t._sveTreeWatchBound||(t._sveTreeWatchBound=!0,e.addEventListener("sve-right-dock-change",()=>{if(Ne||k.featureOn?.(e,"html_tree")===!1||!e.document.getElementById(d))return;const o=Se(e);o!==We(e)&&(O=o,Ce(e,Ft,o?"1":"0"),o?y&&(Ee(),Yt()):B&&Gt(),W(e))}))}function ko(e,t){t._sveLockBound||(t._sveLockBound=!0,t.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!ke||!E)){if(M){li(e);return}Bn(e,!0)}}))}function Jt(e){return e?Fe(e,un)!=="0":!0}function ai(){const e=h.html;return!e||e.state.readOnly||!E?!1:!eo(Qt(),V)}function ue(e){const t=e?.document.getElementById(d),o=t?.querySelector("[data-sve-code-autosave]"),n=t?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=Jt(e),r=ai();o.setAttribute("aria-pressed",s?"true":"false"),o.title=x(e,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=wr,n.hidden=s,n.title=x(e,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=Br,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function _o(e,t){t._sveAutosaveBound||(t._sveAutosaveBound=!0,t.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!Jt(e);Ce(e,un,n?"1":"0"),n?se(e.document):G&&(clearTimeout(G),G=null),ue(e)}),t.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),se(e.document)}))}function li(e){e.document.getElementById(U)?.remove();const t=Yn(e.document,Gn,{title:x(e,"code_dock_unlock_title"),body:x(e,"code_dock_unlock_body"),buttons:[{value:"cancel",label:x(e,"cancel"),variant:"ghost"},{value:"ok",label:x(e,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{t.dismiss(),o==="ok"&&Bn(e,!1)}});t.host.id=U}function Bn(e,t){const o=E;if(!o)return;const n=()=>{E===o&&e.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":vn(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:t})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));E===o&&(M=t,$e(e),mt(V,t),W(e),N(e.document,t?x(e,"code_dock_locked"):""))}).catch(()=>{N(e.document,x(e,"code_dock_error"))})};if(t&&(se(e.document),He)){He.finally(n);return}n()}function Qt(){const e={html:"",css:"",js:""};dt(),Ee();for(const t of j)t==="html"?e.html=B?A:h.html?.state.doc.toString()??"":t==="css"?e.css=S:e[t]=h[t]?.state.doc.toString()??"";return e}function ci(){if(!(O&&ct(y?.from,y?.to,A.length)))return Y="full",de=S,S;const e=lt(A.slice(y.from,y.to));if(!e.length)return Y="empty",de="","";Y="tree";const t=Pt(S,e);return de=t,t}function mt(e,t){q=!0;try{_&&(O=We(_)),A=e.html??"",S=e.css??"";for(const o of j){const n=h[o];let s=e[o]??"";try{s=o==="html"?Tn():o==="css"?ci():s}catch{s=o==="html"?A||e.html||"":o==="css"?S||e.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[De[o].reconfigure(nt.readOnly.of(!!t)),Pe[o].reconfigure(te.editable.of(!t))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{q=!1}ft(),Ae(),It("dock:html-changed"),_&&(pe(_),yt(_),W(_))}function eo(e,t){return e.html===t.html&&e.css===t.css&&e.js===t.js}function Ln(e){return String(e||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function gt(e){const t=Ln(e).match(/^([a-z-]+)\s*:/i);return t?t[1].toLowerCase():""}function di(e,t){return e===t||e.startsWith(`${t}-`)}function vt(e){const t=Ln(e),o=t.indexOf(":");return o===-1?"":t.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function P(e){const t=String(e||"").trim().toLowerCase();return t==="start"||t==="flex-start"||t==="left"||t==="top"?"flex-start":t==="end"||t==="flex-end"||t==="right"||t==="bottom"?"flex-end":t==="row-reverse"?"row-reverse":t==="column-reverse"?"column-reverse":t}function st(e){const t=P(e);return t==="flex"||t==="inline-flex"}function to(){const e=h.css;if(!e)return null;const t=e.state.selection.main.head,o=e.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const a=o.indexOf("}}",i+2);if(a===-1)break;i=a+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const a=n.pop();a!=null&&s.push({from:a+1,to:i,text:o.slice(a+1,i),open:a})}}let r=null;for(const i of s)t<i.open||t>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function ui(e){const t=String(e||"");let o="",n=0;for(let s=0;s<t.length;s+=1){if(t[s]==="{"&&t[s+1]==="{"){const r=t.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=t.slice(s,r+2)),s=r+1;continue}if(t[s]==="{"){n+=1;continue}if(t[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=t[s])}return o}function fi(e){const t={};for(const o of ui(e).split(";")){const n=gt(o);n&&(t[n]=vt(`${o};`))}return t}function pi(e,t,o){if(!t||t.from>=t.to)return null;let n=e.state.doc.lineAt(t.from),s=0;for(;n.from<=t.to;){const r=Math.max(n.from,t.from),i=Math.min(n.to,t.to),a=e.state.doc.sliceString(r,i);if(s===0&&gt(a)===o)return{from:r,to:i,text:a};if(s+=hi(a),n.to>=e.state.doc.length||n.to>=t.to)break;n=e.state.doc.lineAt(n.to+1)}return null}function hi(e){let t=0;const o=String(e);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?t+=1:o[n]==="}"&&(t-=1)}return t}function fe(e){return(String(e).match(/^\s*/)||[""])[0]}function xt(e,t,o){for(let n=t.number-1;n>=1;n-=1){const s=e.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=fe(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function mi(e,t){const o=e.state.doc.lineAt(t);if(o.text.trim())return fe(o.text);const n=xt(e,o,!0);if(n)return n;const s=to();return s?Mn(e,s):"  "}function Mn(e,t){const o=e.state.doc.lineAt(t.from),n=e.state.doc.lineAt(Math.max(t.from,t.to));for(let r=n.number;r>=o.number;r-=1){const i=e.state.doc.line(r),a=Math.max(i.from,t.from),c=Math.min(i.to,t.to),l=e.state.doc.sliceString(a,c);if(l.trim())return(l.match(/^\s*/)||[""])[0]||"  "}return`${(e.state.doc.lineAt(Math.max(0,t.from-1)).text.match(/^\s*/)||[""])[0]}  `}function So(){h.css?.focus(),_&&(he(_),pe(_))}function F(e){const t=h.css;if(!t||t.state.readOnly||!e.length)return;const o=to();if(!o){const i=e.filter(a=>a.value!=null).map(a=>`${a.property}: ${a.value};`).join(`
`);i&&yi(i),So();return}const n=[],s=[],r=Mn(t,o);for(const i of e){const a=pi(t,o,i.property);if(i.value==null){if(!a)continue;let c=a.from,l=a.to;t.state.doc.sliceString(l,l+1)===`
`&&(l+=1),c=Math.max(c,o.from),l=Math.min(l,o.to),n.push({from:c,to:l});continue}if(!(a&&P(vt(a.text))===P(i.value)))if(a){const c=(a.text.match(/^\s*/)||[""])[0];n.push({from:a.from,to:a.to,insert:`${c}${i.property}: ${i.value};`})}else s.push(`${r}${i.property}: ${i.value};`)}if(s.length){const i=!o.text.includes(`
`)||!/\n\s*$/.test(o.text)?`
`:"";n.push({from:o.to,to:o.to,insert:`${i}${s.join(`
`)}
`})}n.length&&(n.sort((i,a)=>a.from-i.from||a.to-i.to),t.dispatch({changes:n})),So()}function _e(){const e=to();return e?fi(e.text):{}}function gi(e){const t=_e(),o=st(t.display),n=P(t["flex-direction"])||(o?"row":"");if(o&&n===e){const s=[];t["flex-direction"]&&s.push({property:"flex-direction",value:null}),st(t.display)&&s.push({property:"display",value:null}),F(s);return}F([{property:"display",value:"flex"},{property:"flex-direction",value:e}])}function vi(e){const t=_e();if(e==="flex"&&st(t.display)){F([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}F([{property:"display",value:e}])}function xi(e,t){const o=_e();if(P(o[e])===P(t)){F([{property:e,value:null}]);return}F([{property:e,value:t}])}function yi(e){const t=h.css;if(!t||t.state.readOnly)return;const o=t.state.selection.main.head,n=t.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=mi(t,o),a=e.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const l=`${i}${a}
${i}`;t.dispatch({changes:{from:n.from,to:n.to,insert:l},selection:{anchor:n.from+l.length}});return}const c=`
${i}${a}
${i}`;t.dispatch({changes:{from:o,to:t.state.selection.main.to,insert:c},selection:{anchor:o+c.length}})}function pe(e){try{bi(e)}catch{}}function bi(e){const t=e?.document?.getElementById(d),o=_e(),n=st(o.display),s=P(o["flex-direction"])||(n?"row":""),r=t?.querySelector("[data-sve-css-tools]"),i=t?.querySelector("[data-sve-css-chrome]"),a=i?.getAttribute("data-sve-css-sub")||"",c=a==="padding"||a==="margin"?a:"";if(t){i&&(n?i.setAttribute("data-sve-css-flex-on",""):i.removeAttribute("data-sve-css-flex-on")),r&&(n?r.setAttribute("data-sve-css-flex-on",""):r.removeAttribute("data-sve-css-flex-on"));for(const l of[...Et,...Tt]){const u=t.querySelector(`[data-sve-css-tool="${l.id}"]`);if(!u)continue;let f=!1;if(l.flexDir)f=n&&s===l.flexDir;else if(l.display)f=l.display==="flex"?n:P(o.display)===l.display;else if(l.insert){const p=gt(l.insert);f=!!p&&P(o[p])===P(vt(l.insert))}else l.menu==="box"?(f=Object.keys(o).some(p=>di(p,l.property)),a===l.property?u.setAttribute("data-open",""):u.removeAttribute("data-open")):l.menu==="display"?(f=!!o.display,a==="display"?u.setAttribute("data-open",""):u.removeAttribute("data-open")):l.property&&(f=l.property in o);f?u.setAttribute("data-active",""):u.removeAttribute("data-active")}for(const l of mn){const u=t.querySelector(`[data-sve-css-box-side="${l.suffix}"]`);if(!u)continue;!!c&&`${c}${l.suffix}`in o?u.setAttribute("data-active",""):u.removeAttribute("data-active")}for(const l of wt){const u=t.querySelector(`[data-sve-css-tool="${l.id}"]`);if(!u)continue;P(o[l.property])===P(l.value)?u.setAttribute("data-active",""):u.removeAttribute("data-active")}}}function T(e){const t=e?.getElementById(w);t?._sveApp?.unmount(),t?.remove(),e?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-css-box-side][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open]").forEach(o=>o.removeAttribute("data-open"))}function da(e){T(e),oe(e);for(const t of j)h[t]&&Jo?.(h[t])}function ki(e){if(Ze)return Ze;const t=e.Statamic?.$config?.get?.("cpUrl")||`/${e.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return Ze=e.fetch(`${t}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,a=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!a||n.has(a)||(n.add(a),s.push({name:a,hex:r.hex||r.color||""}))}for(const[r,i]of gn)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),Ze}function In(e,t){const o=_e()[t]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of e.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function Ue(e,t,o){const n=t.getBoundingClientRect(),s=8;o.style.left=`${Math.max(s,Math.min(n.left,e.innerWidth-220))}px`,o.style.top=`${Math.max(s,n.bottom+4)}px`}function _i(e,t,o){const n=e.document;T(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=w,n.body.appendChild(s),Ue(e,t,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=Ve(Ht,s,{kind:"colors",swatches:i,onClear:()=>{F([{property:o,value:null}]),T(n)},onPick:a=>{F([{property:o,value:`var(${a})`}]),T(n)}}),In(s,o)};r(gn.map(([i,a])=>({name:i,hex:a}))),ki(e).then(i=>{n.getElementById(w)&&r(i.map(a=>({name:a.name,hex:a.hex})))})}function $o(e,t,o){const n=e.document;T(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=w,n.body.appendChild(s),Ue(e,t,s),s._sveApp=Ve(Ht,s,{kind:"choices",choices:Mr.map(r=>({value:r,token:r,label:r})),onPick:r=>{F([{property:o,value:`var(${r})`}]),T(n)}}),In(s,o)}function et(e){return e?.querySelector("[data-sve-css-chrome]")}function Co(e,t){const o=e.document.getElementById(d),n=et(o);T(e.document),n&&(n.getAttribute("data-sve-css-sub")===t?n.removeAttribute("data-sve-css-sub"):n.setAttribute("data-sve-css-sub",t),pe(e))}function Hn(e,t){if(e.startsWith("{{",t)){const o=e.indexOf("}}",t+2);return o===-1?e.length:o+2}if(e.startsWith("<!--",t)){const o=e.indexOf("-->",t+4);return o===-1?e.length:o+3}return t}function Lt(e,t){if(e[t]!=="<")return null;const o=e.indexOf(">",t+1);if(o===-1)return null;const n=e.slice(t,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:t,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:t,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:t,to:o+1}}function Ao(e,t,o){let n=1,s=o;for(;s<e.length;){const r=Hn(e,s);if(r!==s){s=r;continue}if(e[s]!=="<"){s+=1;continue}const i=Lt(e,s);if(!i)break;if(i.kind==="open"&&i.name===t)n+=1;else if(i.kind==="close"&&i.name===t&&(n-=1,n===0))return i;s=i.to}return null}function Ke(){const e=h.html;if(!e)return null;const t=e.state.selection.main.head,o=e.state.doc.toString(),n=[];let s=0;for(;s<t;){const c=Hn(o,s);if(c!==s){s=c;continue}if(o[s]!=="<"){s+=1;continue}const l=Lt(o,s);if(!l||l.from>=t)break;if(l.kind==="open")n.push(l);else if(l.kind==="close"){for(let u=n.length-1;u>=0;u-=1)if(n[u].name===l.name){n.splice(u);break}}s=l.to}const r=o.lastIndexOf("<",Math.max(0,t-1));if(r!==-1&&o.indexOf(">",r)>=t){const c=Lt(o,r);if(c?.kind==="open"||c?.kind==="void"){const l=c.kind==="void"?null:Ao(o,c.name,c.to);return l?{name:c.name,open:c,close:l}:{name:c.name,open:c,close:null}}}const i=n[n.length-1];if(!i)return null;const a=Ao(o,i.name,i.to);return{name:i.name,open:i,close:a}}function Mt(e){return hn.includes(e)}function ee(){h.html?.focus(),_&&(he(_),yt(_))}function Je(e,t,o){const n=[...t].sort((s,r)=>r.from-s.from||r.to-s.to);e.dispatch({changes:n,selection:o})}function rt(e,t){const o=h.html;if(!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.slice(0,n-s.from),i=s.text.trim()?fe(s.text):xt(o,s)||fe(s.text);let a=e,c=0;if(r.trim()!=="")a=`
${i}${e}`,c=1+i.length;else if(!s.text.trim()){a=`${i}${e}`,c=i.length,o.dispatch({changes:{from:s.from,to:s.to,insert:a},selection:{anchor:s.from+c+t}});return}o.dispatch({changes:{from:n,to:o.state.selection.main.to,insert:a},selection:{anchor:n+c+t}})}function On(e){const t=h.html;if(!t||t.state.readOnly)return;const o=t.state.selection.main,n=t.state.doc.toString();if(!o.empty){const a=n.slice(o.from,o.to),c=a.match(new RegExp(`^<${e}(\\s[^>]*)?>([\\s\\S]*)</${e}>$`,"i"));if(c){Je(t,[{from:o.from,to:o.to,insert:c[2]}],{anchor:o.from,head:o.from+c[2].length}),ee();return}let l=`<${e}>${a}</${e}>`,u=o.from+e.length+2;e==="ul"&&(l=`<ul>
  <li>${a}</li>
</ul>`,u=o.from+11),Je(t,[{from:o.from,to:o.to,insert:l}],{anchor:u,head:u+a.length}),ee();return}const s=Ke();if(s?.open&&s.close){if(s.name===e){Je(t,[{from:s.close.from,to:s.close.to,insert:""},{from:s.open.from,to:s.open.to,insert:""}],{anchor:s.open.from}),ee();return}if(Mt(s.name)&&Mt(e)){const a=n.slice(s.open.from,s.open.to).replace(new RegExp(`^<${s.name}`,"i"),`<${e}`);Je(t,[{from:s.close.from,to:s.close.to,insert:`</${e}>`},{from:s.open.from,to:s.open.to,insert:a}],{anchor:s.open.from+e.length+1}),ee();return}}const i=(t.state.doc.lineAt(o.head).text.match(/^\s*/)||[""])[0];if(e==="ul"){const a=`<ul>
${i}  <li></li>
${i}</ul>`;rt(a,`<ul>
${i}  <li>`.length)}else rt(`<${e}></${e}>`,e.length+2);ee()}function yt(e){try{Si(e)}catch{}}function Si(e){const t=e?.document?.getElementById(d),n=Ke()?.name||"";if(t)for(const s of At){const r=t.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!r)continue;(s.id==="heading"?Mt(n):n===s.tag)?r.setAttribute("data-active",""):r.removeAttribute("data-active")}}function $i(e,t){const o=e.document,n=Ke()?.name||"";T(o),t.setAttribute("data-open","");const s=o.createElement("div");s.id=w,o.body.appendChild(s),Ue(e,t,s),s._sveApp=Ve(Ht,s,{kind:"choices",choices:hn.map(r=>({value:r,label:r.toUpperCase(),active:n===r})),onPick:r=>{On(r),T(o)}})}function Ci(e){const t=ye(e),o=h.html,n=h.css;if(!t||o?.state.readOnly||n?.state.readOnly)return;const s=Ke();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=Us(r,t);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}Ee(),X(S,t)||(S=`${String(S||"").trimEnd()}${S?.trim()?`
`:""}.${t} {
}
`),ht(),ft(),Ae(),_&&(he(_),yt(_),pe(_))}function Ai(e,t){const o=e.document;if(t.hasAttribute("data-open")){T(o);return}T(o),t.setAttribute("data-open","");const n=o.createElement("div");n.id=w,o.body.appendChild(n),Ue(e,t,n),n._sveApp=Ve(Lo,n,{label:x(e,"code_dock_css_class_name"),placeholder:x(e,"code_dock_css_class_placeholder"),onAdd:s=>{Ci(s),T(o)}})}function Ei(e,t){const o=t.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=Lr,o.title=x(e,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Ai(e,o)}))}function Ti(e,t){const o=t.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=[...Et,...Tt,...wt],s=(l,u)=>{const f=n.find(p=>p.id===l);if(f){if(f.flexDir){T(e.document),gi(f.flexDir);return}if(f.display){T(e.document),vi(f.display);return}if(f.property&&f.value){T(e.document),xi(f.property,f.value);return}if(f.insert){const p=gt(f.insert),g=vt(f.insert),b=_e();T(e.document),et(t)?.removeAttribute("data-sve-css-sub"),p&&P(b[p])===P(g)?F([{property:p,value:null}]):F([{property:p,value:g}]);return}if(f.menu==="colors"){et(t)?.removeAttribute("data-sve-css-sub"),_i(e,u,f.property);return}if(f.menu==="box"){Co(e,f.property);return}if(f.menu==="display"){Co(e,"display");return}f.menu==="spacing"&&$o(e,u,f.property)}};let r=!1;const i=wt.map((l,u)=>{const f={...l,icon:Ge[l.id]||"",sep:u===0||l.group==="align"&&!r};return l.group==="align"&&!r&&(r=!0),f});ve(o,Bs,{tools:Et.map(l=>({...l,icon:Ge[l.id]||""})),onTool:l=>s(l,t.querySelector(`[data-sve-css-tool="${l}"]`))});const a=t.querySelector('[data-sve-css-sub="box"]');a&&!a._sveBound&&(a._sveBound=!0,ve(a,Is,{sides:mn.map(l=>({...l,icon:Ge[`box-${l.id}`]||""})),onSide:l=>{const u=et(t)?.getAttribute("data-sve-css-sub"),f=a.querySelector(`[data-sve-css-box-side="${l}"]`),p=`${u}${l}`,g=_e();if(!(u!=="padding"&&u!=="margin"||!f)){if(p in g){T(e.document),F([{property:p,value:null}]);return}$o(e,f,p),pe(e)}}}));const c=t.querySelector('[data-sve-css-sub="display"]');c&&!c._sveBound&&(c._sveBound=!0,ve(c,js,{items:Tt.map(l=>({...l,icon:Ge[l.id]||""})),extras:i,onTool:l=>s(l,t.querySelector(`[data-sve-css-tool="${l}"]`))})),e.document.addEventListener("mousedown",l=>{l.target.closest(`#${w}, [data-sve-css-tools], [data-sve-css-subrow], [data-sve-html-tools], [data-sve-css-add-class]`)||T(e.document)},!0)}function wi(e,t){const o=t.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,ve(o,$s,{tools:At.map(n=>({...n,icon:Ir[n.id]||""})),onTool:n=>{const s=At.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){$i(e,r);return}T(e.document),On(s.tag)}}}),Bi(e,t),Mi(e,t))}function Bi(e,t){const o=t.querySelector("[data-sve-antlers-tools]");!o||o._sveBound||(o._sveBound=!0,ve(o,Bo,{label:x(e,"code_dock_antlers"),groups:ns.map(n=>({id:n.id,label:x(e,n.lang),items:ss.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>Li(n)}))}function Li(e){const t=rs(e),o=h.html;if(!t||!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.trim()?fe(s.text):xt(o,s)||fe(s.text),{text:i,cursor:a}=tt(t.snippet);rt(wo(i,r),a),ee()}function Mi(e,t){const o=t.querySelector("[data-sve-visual-edit-tools]");!o||o._sveBound||(o._sveBound=!0,ve(o,Bo,{label:x(e,"code_dock_visual_edit"),groups:nr.map(n=>({id:n.id,label:x(e,n.lang),items:qo.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>Hi(n)}))}function Ii(e,t,o,n){if(ir(o.inner,n.attr)){e.focus();return}const{text:s,cursor:r}=tt(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(t[i-1]);)i--;e.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),ee()}function Hi(e){const t=sr(e),o=h.html;if(!t||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=Ke();if(s?.open){const f=rr(n,s.open.from,s.open.to,Ye);if(f){t.attr?Ii(o,n,f,t):(o.dispatch({selection:{anchor:f.openIdx+2+Ye.length}}),o.focus());return}const p=s.open.from+1+s.name.length,g=t.standalone||`{{ ${Ye} ${t.attr} }}`,{text:b,cursor:v}=tt(g);o.dispatch({changes:{from:p,to:p,insert:` ${b}`},selection:{anchor:p+1+v}}),ee();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),a=i.text.trim()?fe(i.text):xt(o,i)||fe(i.text),c=t.standalone||`{{ ${Ye} ${t.attr} }}`,{text:l,cursor:u}=tt(c);rt(wo(l,a),u),ee()}function Dn(e){if(!be||!E||String(E).startsWith("view:")){so(e);return}const t=Kn(be,e.document);so(e,t.length?{sectionUids:t}:void 0)}function Oi(e,t,o){return He=e.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":vn(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:t,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{}})}).then(async n=>{if(n.status===423){M=!0,ke=!0,$e(e),mt(V,!0),W(e),N(e.document,x(e,"code_dock_locked"));return}if(!n.ok)throw new Error(String(n.status));E===t&&(V=o,N(e.document,x(e,"code_dock_saved")),ue(e),e.setTimeout(()=>{const s=e.document.getElementById(d)?.querySelector("[data-sve-code-status]");s&&s.textContent===x(e,"code_dock_saved")&&(s.textContent="")},1800)),Dn(e),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}).catch(()=>{N(e.document,x(e,"code_dock_error"))}).finally(()=>{He=null}),He}function se(e){G&&(clearTimeout(G),G=null);const t=E,o=_,n=h.html;if(!n||n.state.readOnly||!t||!o)return;const s=Qt();eo(s,V)||(N(e,x(o,"code_dock_saving")),Oi(o,t,s))}function Di(e,t){G&&clearTimeout(G),G=e.setTimeout(()=>{G=null,se(t)},Cr)}function he(e){if(q)return;const t=Qt();if(eo(t,V)){ue(e);return}if(ue(e),!Jt(e)){N(e.document,x(e,"code_dock_unsaved"));return}N(e.document,x(e,"code_dock_saving")),Di(e,e.document)}let xe=null,Re=null;function Pi(){return xe||(xe=mr({Decoration:Nt,StateField:jt,StateEffect:qt,RangeSetBuilder:zt,EditorView:te})),xe}function Ri(){return Re||(Re=yr({Decoration:Nt,StateField:jt,StateEffect:qt,RangeSetBuilder:zt,EditorView:te})),Re}function ji(e,t,o){h[t]?.destroy();const n=Ct.of([{key:"Mod-s",run:()=>(se(e.document),!0)}]);h[t]=new te({state:nt.create({doc:"",extensions:[No(),Fo(),Vo(),Xo(),Or(t),Go(),Yo({tooltipClass:()=>"sve-tw-complete"}),...t==="html"?[tn.data.of({autocomplete:Jn(e)}),Qn(en,e)]:[],...t==="html"?[...es(),ts()]:[],Ct.of([...Wo,...t==="html"?[{key:"Tab",run:os}]:[],Uo,...Ko,...Qo,...Zo]),n,te.lineWrapping,...t==="html"||t==="css"?Pi().extensions:[],...t==="html"?Ri().extensions:[],De[t].of(nt.readOnly.of(!!M)),Pe[t].of(te.editable.of(!M)),te.updateListener.of(s=>{t==="html"&&s.docChanged&&!q&&(oi(),It("dock:html-changed")),t==="css"&&s.docChanged&&!q&&ni(),s.docChanged&&he(e),t==="css"&&(s.docChanged||s.selectionSet)&&pe(e),t==="html"&&(s.docChanged||s.selectionSet)&&yt(e)}),...Hr()]}),parent:o})}function qi(e){if(!e||e.querySelector(".cm-editor"))return;e.replaceChildren();const t=e.ownerDocument.createElement("span");t.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",e.appendChild(t)}let Qe=null;async function zi(e){const t=e.document;Nr(t);let o=t.getElementById(d);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-subrow]")&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-7")){for(const s of j)h[s]?.destroy(),h[s]=null;o.remove(),o=null}if(!o){o=t.createElement("div"),o.id=d,o.setAttribute("data-sve-code-chrome","scope-7"),ve(o,ks,{htmlLabel:x(e,"code_dock_html"),cssLabel:x(e,"code_dock_css"),jsLabel:x(e,"code_dock_js"),treeIcon:pn}),Bt(t,o),vo(o),_n(o,xn(e)),Yr(e,o),Zr(e,o),Gr(e,o),Ti(e,o),Ei(e,o),wi(e,o),bo(e,o),ko(e,o),xo(e,o),_o(e,o);for(const n of j){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);qi(s)}k.openHtmlTreePanel?.(e)}if(Bt(t,o),vo(o),bo(e,o),ko(e,o),xo(e,o),_o(e,o),Ur(e),Vt(e),$e(e),W(e),ze(e),ue(e),await Sr(),!h.html){for(const n of j){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),ji(e,n,s)}for(const n of["html","css"])h[n]&&gr(e,h[n],{onOpen:s=>Qr(e,s),emptyLabel:x(e,"code_dock_partials_empty"),sectionValues:()=>Jr(e),isLocked:()=>it(),setHover:(s,r)=>xe?.setHover(s,r)});_r(e,h.html,{onRename:n=>ri(e,n),isLocked:()=>it(),setHover:(n,s)=>Re?.setHover(n,s),title:x(e,"code_dock_css_rename_class")})}return o}function Pn(e){return Qe||(Qe=zi(e).finally(()=>{Qe=null})),Qe}async function Eo(e,t){const o=await Pn(e);E=t,M=!0,ke=!0,V={html:"",css:"",js:""},Zt(),$e(e),mt(V,!0),Cn(e.document,t),N(e.document,x(e,"code_dock_missing")),W(e),ze(e),ue(e),qe(e,o)}async function bt(e,t,o="replace"){o==="replace"?ce=[]:o==="push"&&E&&E!==t&&ce.push(E);const n=++Be;E=t,ke=!1,Zt(),N(e.document,x(e,"code_dock_loading"));const s=await Pn(e);$e(e),W(e),ze(e),ue(e),qe(e,s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(t)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async r=>{if(n!==Be)return;if(r.status===404){Eo(e,t);return}if(!r.ok)throw new Error(String(r.status));const i=await r.json();n===Be&&(V={html:typeof i.html=="string"?i.html:"",css:typeof i.css=="string"?i.css:"",js:typeof i.js=="string"?i.js:""},E=t,M=!!i.locked,ke=!0,$e(e),mt(V,M),Cn(e.document,i.path||t),N(e.document,M?x(e,"code_dock_locked"):""),W(e),ze(e),ue(e),qe(e,s))}).catch(()=>{n===Be&&(Eo(e,t),N(e.document,x(e,"code_dock_error")))})}function Ni(){return E||""}function Fi(e){return!!e?.getElementById(d)}function it(){return M}function Vi(e,t){const o=typeof t?.html=="string"?t.html.trim():"",n=typeof t?.css=="string"?t.css.trim():"",s=typeof t?.js=="string"?t.js.trim():"";if(!o&&!n&&!s||!e?.document?.getElementById(d))return!1;let r=!1;return o&&(r=Wi("html",o)||r),n&&(r=To("css",n)||r),s&&(r=To("js",s)||r),r&&he(e),r}function Wi(e,t){const o=h[e];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,c=`${s===`
`?"":`
`}${t}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}}),!0}function To(e,t){const o=h[e];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${t}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function Ui(e){if(Dn(e),!E||!e.document.getElementById(d))return;const t=E;E=null,bt(e,t,"keep")}function Ki(e){Be+=1,se(e),be=null,E=null,ce=[],V={html:"",css:"",js:""},M=!1,ke=!1,z=null,ge=null,Zt(),_=e?.defaultView||_,T(e),J(e),oe(e),e?.getElementById(U)?.remove();for(const o of j)h[o]?.destroy(),h[o]=null;e?.getElementById(d)?.remove(),Wr(),e&&Wt(e,0);const t=e?.defaultView||_;t?.document.getElementById(k.HTML_TREE_PANEL_ID)&&k.closeHtmlTreePanel?.(t)}function Xi(e){if(je)return;const t=e.document.getElementById(d);t&&(Vt(e),qe(e,t))}function Yi(e,t,o){if(o){const r=ro(o,t)||ro(o,e.document)||o;return String(typeof k.setTypeForUid=="function"&&(k.setTypeForUid(r,t)||k.setTypeForUid(r,e.document))||"").trim()}const n=typeof k.sectionField=="function"?k.sectionField(e):"page_sections",s=typeof k.activeContainers=="function"?k.activeContainers(e.document):[];for(const r of s){const a=(k.unwrapRef?.(r.values)||r.values)?.[n];if(Array.isArray(a))for(const c of a){const l=typeof c?.type=="string"?c.type.trim():"";if(l)return l}}return""}function Gi(e){if((e.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=e.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(e.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof k.activeContainers=="function"?k.activeContainers(e.document):[];for(const r of s){const i=k.unwrapRef?.(r.values)||r.values,a=typeof i?.view=="string"?i.view.trim():"";if(!a||a.includes(".."))continue;const c=a.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(c)return`view:${c}`}return""}function Zi(e,t){const o=k.chromeInlineKind||k.activeChromeKind;if(o!=="header"&&o!=="footer"||!k.chromeHost?.(t)&&!k.chromeEditorOpen?.(t))return"";const s=(k.unwrapRef?.(k.chromeContainer?.()?.values)||{})[o==="footer"?"footer_style":"header_style"]||"style_1";return`${o}/${s}`}function Ji(e){const t=k.globalSectionHost?.(e)||e.getElementById("__sve-global-section-host");return t&&t.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function Qi(e,t,o){if(je)return;if(!e||!t||Pr(t)||!Wn(e)||!Un(e)){t&&Ki(t);return}const n=Zi(e,t)||Ji(t)||Yi(e,t,o)||Gi(e)||(o?"":E),s=!!(o&&o!==be);if(_=e,o&&(be=o),!!n&&!(n===E&&t.getElementById(d))){if(ce.length&&E&&E!==n){const r=ce[0];if(n===r&&!s)return;ce=[]}se(t),bt(e,n,"replace")}}re("dock:is-open",e=>Fi(e));re("dock:is-locked",()=>it());re("dock:html",()=>ut());re("dock:reveal-html",({from:e,to:t}={})=>{const o=h.html;if(!o||e==null)return;O=We(_),dt(),Ee();const n=A.length,s=Math.max(0,Math.min(e,n)),r=Math.max(s,Math.min(t??e,n));if(y=r>s?{from:s,to:r}:null,O&&y){Yt(),W(_);return}if(B){Gt(),W(_);return}o.dispatch({selection:{anchor:s,head:r},scrollIntoView:!0}),o.focus()});re("dock:insert-snippet",({win:e,parts:t})=>Vi(e,t));re("dock:refresh",e=>Ui(e));re("dock:current-type",()=>Ni());re("dock:current-uid",()=>be);re("dock:set-html",e=>{if(typeof e!="string"||it())return!1;const t=h.html;if(!t||!_)return!1;if(A=e,B)return pt(Tn()),he(_),It("dock:html-changed"),!0;const o=t.state.doc.toString();return o!==e&&t.dispatch({changes:{from:0,to:o.length,insert:e}}),!0});k.syncCodeDock=Qi;export{pa as ARMED_KEY,Ki as closeCodeDock,da as closeCodeDockPopups,Ni as currentTemplateType,Vi as insertAiSnippet,Un as isCodeDockArmed,it as isCodeDockLocked,Fi as isCodeDockOpen,Ui as refreshCodeDockFromDisk,Xi as relayoutCodeDock,ha as setCodeDockArmed,Qi as syncCodeDock,Wn as templateDockAllowed};
