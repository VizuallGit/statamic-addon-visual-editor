const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-Dpuj8sxX.js","./index-B5fiB6ig.js","./index-eMi007Cw.js","./index-zsjA895l.js","./index-BsAZfAgM.js","./index-D2YMCfE7.js","./html-tag-sync-BlP2Mk13.js","./index-BatCsQTe.js","./tw-compile-5aQxGpeR.js","./addon-BH2WkLT6.js","./addon-BEt8DEMP.css","./tw-classes-BCJ-lfwR.js","./html-pick-align-gkRPeJkt.js","./tw-classes-B-16MLMf.css"])))=>i.map(i=>d[i]);
import{o as $,c as C,a as m,t as X,b as ms,F as P,e as re,f as j,I as vs,d as Lt,n as gs,Q as vo,T as ys,a2 as xs,K as bs,w as go,L as ks,s as _,a3 as zo,a4 as No,a5 as yo,a6 as _s,a7 as xo,J,a8 as Te,a9 as Ft,i as ye,aa as bo,A as Ae,l as Me,ab as Ss,$ as $s,a0 as Cs,N as As,O as ae,ac as Es,ad as ws}from"./addon-BH2WkLT6.js";import{p as Fo,t as Vo,a as Ts,b as Ms,c as It,r as Bs,d as ko,e as Wo,f as Ls,g as Is,h as Os,j as Hs}from"./tw-classes-BCJ-lfwR.js";import{h as Ds,a as Ps,e as Rs,A as js,b as qs,c as zs,d as it,i as Uo}from"./html-tag-sync-BlP2Mk13.js";const Ns={class:"sve-code-dock"},Fs={"data-sve-code-bar":""},Vs={type:"button","data-sve-code-pane-btn":"html"},Ws={type:"button","data-sve-code-pane-btn":"css"},Us={type:"button","data-sve-code-pane-btn":"js"},Ks={type:"button","data-sve-html-scope":"","aria-pressed":"true"},Xs=["innerHTML"],Ys={"data-sve-code-panes":""},Zs={"data-sve-code-pane":"html"},Gs={"data-sve-code-pane-label":""},Js={"data-sve-code-pane":"css"},Qs={"data-sve-css-chrome":"subrow-2"},er={"data-sve-code-pane-label":""},tr={"data-sve-css-label":""},or={"data-sve-code-pane":"js"},nr={"data-sve-code-pane-label":""},sr={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},treeIcon:{type:String,required:!0}},setup(e){return(t,o)=>($(),C("div",Ns,[o[16]||(o[16]=m("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),m("div",Fs,[m("button",Vs,X(e.htmlLabel),1),m("button",Ws,X(e.cssLabel),1),m("button",Us,X(e.jsLabel),1),o[0]||(o[0]=ms('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button>',5)),m("button",Ks,[m("span",{innerHTML:e.treeIcon},null,8,Xs)]),o[1]||(o[1]=m("button",{type:"button","data-sve-code-autosave":"","aria-pressed":"true"},null,-1)),o[2]||(o[2]=m("button",{type:"button","data-sve-code-save":"",hidden:""},null,-1)),o[3]||(o[3]=m("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[17]||(o[17]=m("div",{"data-sve-code-lock-banner":""},null,-1)),m("div",Ys,[m("div",Zs,[m("div",Gs,[m("span",null,X(e.htmlLabel),1),o[4]||(o[4]=m("div",{"data-sve-html-tools":""},null,-1)),o[5]||(o[5]=m("div",{"data-sve-visual-edit-tools":""},null,-1)),o[6]||(o[6]=m("div",{"data-sve-antlers-tools":""},null,-1))]),o[7]||(o[7]=m("div",{"data-sve-code-host":""},null,-1))]),o[14]||(o[14]=m("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),m("div",Js,[m("div",Qs,[m("div",er,[m("span",tr,X(e.cssLabel),1),o[8]||(o[8]=m("button",{type:"button","data-sve-css-add-class":""},null,-1)),o[9]||(o[9]=m("div",{"data-sve-css-tools":""},null,-1))]),o[10]||(o[10]=m("div",{"data-sve-css-subrow":""},[m("div",{"data-sve-css-sub":"box"}),m("div",{"data-sve-css-sub":"display"})],-1))]),o[11]||(o[11]=m("div",{"data-sve-code-host":""},null,-1)),o[12]||(o[12]=m("div",{"data-sve-tw-host":""},null,-1))]),o[15]||(o[15]=m("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),m("div",or,[m("div",nr,[m("span",null,X(e.jsLabel),1)]),o[13]||(o[13]=m("div",{"data-sve-code-host":""},null,-1))])])]))}},rr=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],ir=["innerHTML"],ar={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>($(!0),C(P,null,re(e.tools,n=>($(),C("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:j(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:j(s=>e.onTool(n.id),["prevent"])},[n.letter?($(),C(P,{key:0},[vs(X(n.letter),1)],64)):($(),C("span",{key:1,innerHTML:n.icon},null,8,ir))],40,rr))),128))}},lr=["aria-label"],cr={value:""},dr=["label"],ur=["value"],Ko={__name:"CodeDockAntlersSelect",props:{label:{type:String,required:!0},groups:{type:Array,required:!0},onPick:{type:Function,required:!0}},setup(e){const t=e;function o(n){const s=n.target.value;n.target.value="",s&&t.onPick(s)}return(n,s)=>($(),C("select",{"data-sve-antlers-select":"","aria-label":e.label,onChange:o},[m("option",cr,X(e.label),1),($(!0),C(P,null,re(e.groups,r=>($(),C("optgroup",{key:r.id,label:r.label},[($(!0),C(P,null,re(r.items,i=>($(),C("option",{key:i.id,value:i.id},X(i.label),9,ur))),128))],8,dr))),128))],40,lr))}},fr=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],pr={__name:"CodeDockCssTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>($(!0),C(P,null,re(e.tools,n=>($(),C("button",{key:n.id,type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:j(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:j(s=>e.onTool(n.id),["prevent"])},null,40,fr))),128))}},hr={key:0,"data-sve-css-sep":"","aria-hidden":"true"},mr=["data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick"],vr={__name:"CodeDockCssBoxRow",props:{sides:{type:Array,required:!0},onSide:{type:Function,required:!0}},setup(e){return(t,o)=>($(!0),C(P,null,re(e.sides,n=>($(),C(P,{key:n.id},[n.sep?($(),C("span",hr)):Lt("",!0),m("button",{type:"button","data-sve-css-box-side":n.suffix,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:j(s=>e.onSide(n.suffix),["prevent","stop"])},null,8,mr)],64))),128))}},gr={key:0,"data-sve-css-sep":"","aria-hidden":"true"},yr=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],xr={"data-sve-css-flex-extras":""},br={key:0,"data-sve-css-sep":"","aria-hidden":"true"},kr=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],_r={__name:"CodeDockCssDisplayRow",props:{items:{type:Array,required:!0},extras:{type:Array,default:()=>[]},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>($(),C(P,null,[($(!0),C(P,null,re(e.items,n=>($(),C(P,{key:n.id},[n.sep?($(),C("span",gr)):Lt("",!0),m("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:j(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:j(s=>e.onTool(n.id),["prevent"])},null,40,yr)],64))),128)),m("div",xr,[($(!0),C(P,null,re(e.extras,n=>($(),C(P,{key:n.id},[n.sep?($(),C("span",br)):Lt("",!0),m("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:j(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:j(s=>e.onTool(n.id),["prevent"])},null,40,kr)],64))),128))])],64))}},Sr={key:0,"data-sve-css-swatches":""},$r=["data-sve-css-token","title","data-active","onClick"],Cr=["data-sve-css-token","data-active","onClick"],mt={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(e){return(t,o)=>e.kind==="colors"?($(),C("div",Sr,[m("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=j((...n)=>e.onClear&&e.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[m("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[m("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),($(!0),C(P,null,re(e.swatches,n=>($(),C("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:gs({background:n.hex||"transparent"}),onClick:j(s=>e.onPick(n.name),["prevent","stop"])},null,12,$r))),128))])):($(!0),C(P,{key:1},re(e.choices,n=>($(),C("button",{key:n.value,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:j(s=>e.onPick(n.value),["prevent","stop"])},X(n.label),9,Cr))),128))}},Ar={"data-sve-css-add-label":""},Er=["placeholder","onKeydown"],Xo={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0}},setup(e){const t=e,o=vo(t.initial||""),n=vo(null);ys(()=>xs(()=>{n.value?.focus(),n.value?.select()}));function s(){const r=o.value.trim();if(!r){n.value?.focus();return}t.onAdd(r)}return(r,i)=>($(),C(P,null,[m("label",Ar,X(e.label),1),bs(m("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":i[0]||(i[0]=a=>o.value=a),type:"text",placeholder:e.placeholder,onKeydown:[go(j(s,["prevent"]),["enter"]),i[1]||(i[1]=go(j(()=>{},["stop"]),["escape"]))]},null,40,Er),[[ks,o.value]])],64))}};function wr(e){const t=String(e||""),o=/\bclass\s*=\s*("([^"]*)"|'([^']*)')/gi,n=new Set;let s;for(;s=o.exec(t);){const r=(s[2]??s[3]??"").replace(/\{\{[\s\S]*?\}\}/g," ");for(const i of r.split(/\s+/)){const a=i.trim();!a||a==="["||a==="]"||a.includes("{")||a.includes("}")||n.add(a)}}return[...n]}function Ka(e){const t=/@utility\s+([A-Za-z0-9_-]+)/g,o=new Set;let n;for(;n=t.exec(String(e||""));)o.add(n[1]);return o}const Yo=/^\.[a-zA-Z_][\w-]*$/;function Zo(e){const t=String(e||"").match(/\[\s*([\s\S]*?)\s*\]/);return t?t[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).filter(o=>/^[a-zA-Z_][\w-]*$/.test(o)):[]}function Tr(e){const t=String(e||"").match(/\sclass\s*=\s*(["'])([^"']*)\1/i);return t?Zo(t[2]):[]}function vt(e){const t=String(e||""),o=[],n=/\sclass\s*=\s*(["'])/gi;let s;for(;s=n.exec(t);){const r=s[1],i=s.index+s[0].length,a=t.indexOf(r,i);if(a===-1)break;const l=t.slice(i,a).match(/\[([\s\S]*?)\]/);if(l){const u=l[1],f=i+l.index+1,p=u.replace(/\{\{[\s\S]*?\}\}/g,y=>" ".repeat(y.length)),g=/[a-zA-Z_][\w-]*/g;let k;for(;k=g.exec(p);)o.push({name:k[0],from:f+k.index,to:f+k.index+k[0].length})}n.lastIndex=a+1}return o}function _o(e,t){return vt(e).find(o=>t>=o.from&&t<=o.to)||null}function So(e,t){const o=String(e||""),n=vt(o);let s=o;for(let r=n.length-1;r>=0;r-=1){const i=n[r],a=t(i.name);if(a!==i.name){if(!a){let c=i.from,l=i.to;s[l]===" "?l+=1:c>0&&s[c-1]===" "&&(c-=1),s=s.slice(0,c)+s.slice(l);continue}s=s.slice(0,i.from)+a+s.slice(i.to)}}return s}function Go(e){const t=[],o=/(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;let n;for(;n=o.exec(String(e||""));)t.push(n[2]);return t}function Jo(e,t){const o=[],n=[],s=[];let r=0,i=0;for(;r<e.length&&i<t.length;){if(e[r]===t[i]){r+=1,i+=1;continue}const a=t.indexOf(e[r],i),c=e.indexOf(t[i],r);a===-1&&c===-1?(o.push({from:e[r],to:t[i]}),r+=1,i+=1):a===-1?(s.push(e[r]),r+=1):c===-1||a<=c?(n.push(t[i]),i+=1):(s.push(e[r]),r+=1)}for(;r<e.length;)s.push(e[r]),r+=1;for(;i<t.length;)n.push(t[i]),i+=1;return{renamed:o,added:n,removed:s}}function ke(e){let t=String(e||"").trim().replace(/^\.+/,"").replace(/\s+/g,"-").replace(/[^a-zA-Z0-9_-]/g,"");return/^[a-zA-Z_]/.test(t)||(t=t.replace(/^[^a-zA-Z_]+/,"")),Yo.test(`.${t}`)?t:""}function Mr(e,t){const o=String(e||""),n=ke(t);if(!o||!n)return o;const s=o.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(s){const r=s[1];let i=s[2];const a=[...i.matchAll(/\[([\s\S]*?)\]/g)];if(a.length){const c=a.map(g=>g[1].trim()).filter(Boolean).join(" "),u=Zo(`[ ${c} ]`).includes(n)?c:`${c} ${n}`.trim(),f=i.indexOf("["),p=i.lastIndexOf("]");i=`${i.slice(0,f)}[ ${u} ]${i.slice(p+1)}`.replace(/\s+/g," ").trim()}else i=`[ ${n} ] ${i}`.replace(/\s+/g," ").trim();return o.slice(0,s.index)+` class=${r}${i}${r}`+o.slice(s.index+s[0].length)}return/\/\s*>$/.test(o)?o.replace(/(\s*)(\/\s*>)$/,` class="[ ${n} ]"$1$2`):o.replace(/(\s*)>$/,` class="[ ${n} ]"$1>`)}function Br(e,t){const o=String(e).indexOf(">",t.from);return o===-1?"":e.slice(t.from,o+1)}function Qo(e,t){const o=[];for(const n of t){const s=Tr(Br(e,n)),r=Qo(e,n.children||[]);if(s.length){o.push({className:s[0],children:r});for(const i of s.slice(1))o.push({className:i,children:[]})}else o.push(...r)}return o}function gt(e){return Qo(e,Fo(e))}function at(e){return String(e).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Vt(e,t){if(e.startsWith("/*",t)){const o=e.indexOf("*/",t+2);return o===-1?e.length:o+2}return t}function Wt(e,t){let o=0;for(let n=t;n<e.length;n+=1){if(e.startsWith("/*",n)){n=Vt(e,n)-1;continue}if(e[n]==="{")o+=1;else if(e[n]==="}"&&(o-=1,o===0))return n}return-1}function Y(e,t){const o=String(e||""),n=new RegExp(`(^|[^\\w-])\\.${at(t)}\\s*\\{`,"g");let s;for(;s=n.exec(o);){const r=s.index+s[1].length,i=o.indexOf("{",r);if(i===-1)continue;const a=Wt(o,i);if(a!==-1)return{from:r,brace:i,close:a,to:a+1,name:t}}return null}function Lr(e){const t=String(e||""),o=[],n={},s=[];let r=0,i="";const a=()=>{const c=i.trim();c&&o.push(c),i=""};for(;r<t.length;){if(t.startsWith("/*",r)){const c=Vt(t,r);i+=t.slice(r,c),r=c;continue}if(t[r]==="{"){const c=i.trim(),l=Wt(t,r);if(l===-1)break;const u=t.slice(r+1,l);i="",Yo.test(c)?n[c.slice(1)]=u:c&&s.push(`${c} {${u}}`),r=l+1;continue}i+=t[r],r+=1}return a(),{decls:o.join(`
`),classes:n,other:s}}function $o(e,t){const o="    ".repeat(t);return String(e||"").split(`
`).map(n=>n.trim()?o+n.trim():"").filter((n,s,r)=>n||s>0&&s<r.length-1).join(`
`)}function Ir(e,t){const o=Y(e,t);return o?String(e).slice(o.brace+1,o.close):""}function en(e,t,o){const n=Lr(Ir(t,e.className)),s="    ".repeat(o),r=[];n.decls&&r.push($o(n.decls.replace(/;+\s*$/,";"),o+1));for(const a of n.other)r.push($o(a,o+1));for(const a of e.children)r.push(en(a,t,o+1));const i=r.filter(Boolean).join(`
`);return i?`${s}.${e.className} {
${i}
${s}}`:`${s}.${e.className} {
${s}}`}function Ut(e,t){return t?.length?t.map(o=>en(o,e,0)).join(`

`)+`
`:""}function tn(e){const t=String(e||"").match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);return t?t[1]:""}function Or(e){const t=[],o=/\.([a-zA-Z_][\w-]*)\s*\{/g;let n,s=!0;for(;n=o.exec(String(e||""));){if(s){s=!1;continue}t.push(n[1])}return t}function Hr(e,t){const o=String(e).lastIndexOf(`
`,t-1)+1,n=e.slice(o,t);return/^\s*$/.test(n)?n:""}function Dr(e,t){return t?e.split(`
`).map((o,n)=>n===0||!o?o:t+o).join(`
`):e}function Pr(e,t){let o=0;for(let n=0;n<t.from;n+=1){if(e.startsWith("/*",n)){n=Vt(e,n)-1;continue}e[n]==="{"?o+=1:e[n]==="}"&&(o-=1)}return o===0}function Kt(e,t,o){const n=tn(t)||o;if(!n)return String(e||"");let s=String(t||"").trim();s?new RegExp(`^\\.${at(n)}\\s*\\{`).test(s)||(s=`.${n} {
${s}
}`):s=`.${n} {
}`;let r=String(e||"");const i=Y(r,n),a=Or(s);if(i){const l=Hr(r,i.from);r=r.slice(0,i.from)+Dr(s,l)+r.slice(i.to)}else r=`${r.trimEnd()}${r.trim()?`
`:""}${s}
`;const c=Y(r,n);if(!c)return r;for(const l of[...new Set(a)].reverse()){const u=new RegExp(`(^|[^\\w-])\\.${at(l)}\\s*\\{`,"g"),f=[];let p;for(;p=u.exec(r);){const g=p.index+p[1].length,k=r.indexOf("{",g),y=Wt(r,k);y!==-1&&f.push({from:g,to:y+1})}for(const g of f.reverse()){if(g.from>=c.from&&g.to<=c.to||!Pr(r,g))continue;let k=g.from;const y=r.lastIndexOf(`
`,k-1)+1;/^\s*$/.test(r.slice(y,k))&&(k=y);let I=g.to;r[I]===`
`&&(I+=1),r=r.slice(0,k)+r.slice(I)}}return r}function Tt(e,t){const o=String(e||"");return`${o.trimEnd()}${o.trim()?`
`:""}.${t} {
}
`}function Rr(e,t,o){const n=ke(o);return!t||!n||t===n?String(e||""):Y(e,n)?on(e,t):String(e||"").replace(new RegExp(`(^|[^\\w-])\\.${at(t)}(\\s*\\{)`,"g"),`$1.${n}$2`)}function on(e,t){let o=String(e||"");for(;;){const n=Y(o,t);if(!n)break;let s=n.from;const r=o.lastIndexOf(`
`,s-1)+1;/^\s*$/.test(o.slice(r,s))&&(s=r);let i=n.to;o[i]===`
`&&(i+=1),o=o.slice(0,s)+o.slice(i)}return o}function jr(e,t,o){const n=Array.isArray(t)?t:[],s=Array.isArray(o)?o:[],{renamed:r,added:i}=Jo(n,s),a=new Set(s);let c=String(e||"");for(const l of r){const u=ke(l.to);if(u){if(a.has(l.from)){Y(c,u)||(c=Tt(c,u));continue}Y(c,l.from)?c=Rr(c,l.from,u):Y(c,u)||(c=Tt(c,u))}}for(const l of i){const u=ke(l);!u||Y(c,u)||(c=Tt(c,u))}return c}function qr(e,t,o){const n=new Set(Array.isArray(t)?t:[]),s=new Set(Array.isArray(o)?o:[]);let r=String(e||"");for(const i of s)n.has(i)||(r=on(r,i));return r}const et="visual_edit",zr=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],nn=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function Nr(e){return nn.find(t=>t.id===e)||null}function Fr(e,t,o,n){let s=t;for(;s<o;){const r=e.indexOf("{{",s);if(r===-1||r>=o)return null;const i=e.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const a=e.slice(r+2,i);if((a.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:a};s=i+2}return null}function Vr(e,t){const o=String(t).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(e)}const ue="__sve-partial-menu",Wr=/\{\{#([\s\S]*?)#\}\}/g,Co=/\{\{\s*partial(?::([^\s}]+)|(?=[\s}]))([\s\S]*?)\}\}/gi,Mt=new Map;function sn(e){const t=String(e||"").replace(Wr,s=>" ".repeat(s.length)),o=[];Co.lastIndex=0;let n;for(;n=Co.exec(t);){const s=(n[1]||"").trim(),i=(n[2]||"").match(/\bsrc\s*=\s*(["'])([^"']+)\1/i),a=s||(i?i[2].trim():"");!a||a.includes("..")||o.push({from:n.index,to:n.index+n[0].length,src:a})}return o}function Ao(e,t){return sn(e).find(o=>t>=o.from&&t<=o.to)||null}const Ur=new Set(["if","elseif","else","unless","foreach","forelse","noparse","once","cache","nocache","section","yield","partial","slot","switch","case","vite","sve_html","sve_css","sve_js","sve_tw","style_push","script_push"]);function Kr(e,t){const o=[],n=/\{\{\s*(\/?)([A-Za-z_][A-Za-z0-9_]*)\b[\s\S]*?\}\}/g;let s;for(;s=n.exec(String(e||""));){const i=s[2];if(!Ur.has(i.toLowerCase())){if(!s[1]){o.push({name:i,from:s.index,to:null});continue}for(let a=o.length-1;a>=0;a-=1)if(o[a].name===i&&o[a].to==null){o[a].to=s.index+s[0].length;break}}}let r=null;for(const i of o)i.to==null||t<i.from||t>i.to||(!r||i.to-i.from<r.to-r.from)&&(r=i);return r?.name||null}function Xr(e,t){const o=new Set,n=s=>{if(Array.isArray(s)){if(!t){for(const r of s)r&&typeof r=="object"&&typeof r.type=="string"&&r.type&&o.add(r.type),n(r);return}s.forEach(n);return}if(!(!s||typeof s!="object")){if(t&&Array.isArray(s[t]))for(const r of s[t])r&&typeof r=="object"&&typeof r.type=="string"&&r.type&&o.add(r.type);Object.values(s).forEach(n)}};return n(e),o}function Yr(e,t,o,n){if(!e.src.includes("{")||!n)return t;const s=Kr(o,e.from),r=Xr(n,s);return s?t.filter(i=>r.has(i.label)):r.size===0?t:t.filter(i=>r.has(i.label))}function Zr(e,t){if(Mt.has(t))return Mt.get(t);const o=e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>Array.isArray(n.items)?n.items:[]).catch(()=>[]);return Mt.set(t,o),o}let je=null;function Eo(e){e.clearTimeout(je),je=null}function Gr(e,t){je||(je=e.setTimeout(()=>{je=null,t?.()},180))}function ee(e){e?.getElementById(ue)?.remove()}function Jr(e,t,o,n,{onOpen:s,emptyLabel:r,onStay:i,onLeave:a}){const c=e.document;ee(c);const l=c.createElement("div");if(l.id=ue,l.style.left=`${Math.max(8,Math.round(o))}px`,l.style.top=`${Math.max(8,Math.round(n))}px`,t.length)t.forEach(k=>{const y=c.createElement("button");y.type="button",y.setAttribute("data-sve-partial-choice",""),y.textContent=k.label,y.title=k.path||k.type,y.addEventListener("click",I=>{I.preventDefault(),I.stopPropagation(),ee(c),s?.(k.type)}),l.appendChild(y)});else{const k=c.createElement("div");k.setAttribute("data-sve-partial-empty",""),k.textContent=r||"",l.appendChild(k)}c.body.appendChild(l);const u=l.getBoundingClientRect(),f=8;let p=u.left,g=u.top;u.right>e.innerWidth-f&&(p=Math.max(f,e.innerWidth-u.width-f)),u.bottom>e.innerHeight-f&&(g=Math.max(f,e.innerHeight-u.height-f)),l.style.left=`${Math.round(p)}px`,l.style.top=`${Math.round(g)}px`,l.addEventListener("mouseenter",()=>i?.()),l.addEventListener("mouseleave",()=>a?.())}function Qr(e){const t=e.Decoration.mark({class:"sve-cm-partial"}),o=e.Decoration.line({class:"sve-cm-partial-line"}),n=e.StateEffect.define(),s=e.StateField.define({create(i){return wo(i,e,t)},update(i,a){return a.docChanged?wo(a.state,e,t):i},provide:i=>e.EditorView.decorations.from(i)}),r=e.StateField.define({create(){return e.Decoration.none},update(i,a){let c;for(const p of a.effects)p.is(n)&&(c=p.value);if(c===void 0)return a.docChanged?e.Decoration.none:i;if(!c)return e.Decoration.none;const l=new e.RangeSetBuilder,u=a.state.doc.lineAt(c.from),f=a.state.doc.lineAt(c.to);for(let p=u.number;p<=f.number;p+=1){const g=a.state.doc.line(p);l.add(g.from,g.from,o)}return l.finish()},provide:i=>e.EditorView.decorations.from(i)});return{extensions:[s,r],setHover(i,a){i&&i.dispatch({effects:n.of(a)})}}}function wo(e,t,o){const n=new t.RangeSetBuilder;for(const s of sn(e.doc.toString()))n.add(s.from,s.to,o);return n.finish()}function ei(e,t,{onOpen:o,emptyLabel:n,sectionValues:s,isLocked:r,setHover:i}){if(!t?.dom||t.dom._svePartialBound)return;t.dom._svePartialBound=!0;let a=null,c="",l="";const u=()=>{Eo(e),e.clearTimeout(a),a=null,l="",c="",i?.(t,null),ee(e.document)},f={stay:()=>Eo(e),leave:()=>Gr(e,u)},p=()=>{e.clearTimeout(a),a=null,l="",i?.(t,null)},g=()=>!!r?.(),k=(y,I,O,{click:ce}={})=>{if(g()){ee(e.document),i?.(t,null);return}c=y.src,Zr(e,y.src).then(Oe=>{if(c!==y.src)return;const hs=t.state.doc.toString(),Qe=Yr(y,Oe,hs,s?.()||null);if(Qe.length===1){ce&&(ee(e.document),o?.(Qe[0].type));return}!Qe.length&&!ce||Jr(e,Qe,I,O,{onOpen:o,emptyLabel:n,onStay:f.stay,onLeave:f.leave})})};t.dom.addEventListener("mousemove",y=>{if(g()){u();return}const I=t.posAtCoords({x:y.clientX,y:y.clientY});if(I==null)return;const O=Ao(t.state.doc.toString(),I);if(!O){e.clearTimeout(a),a=null,l="",f.leave();return}f.stay(),i?.(t,{from:O.from,to:O.to}),!(l===O.src&&a)&&(p(),l=O.src,a=e.setTimeout(()=>{const ce=t.coordsAtPos(O.from);k(O,ce?.left??y.clientX,(ce?.bottom??y.clientY)+6)},280))}),t.dom.addEventListener("mouseleave",y=>{if(y.relatedTarget?.closest?.(`#${ue}`)){f.stay();return}f.leave()}),t.dom.addEventListener("click",y=>{if(g()){ee(e.document);return}const I=t.posAtCoords({x:y.clientX,y:y.clientY});if(I==null)return;const O=Ao(t.state.doc.toString(),I);O&&(p(),k(O,y.clientX,y.clientY+8,{click:!0}))}),ti(e.document)||(e.document.addEventListener("mousedown",y=>{y.target.closest(`#${ue}, .sve-cm-partial`)||ee(e.document)}),e.document._svePartialDismiss=!0)}function ti(e){return!!e._svePartialDismiss}const te="__sve-css-rename-chip",oi='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function ni(e){const t=e.Decoration.mark({class:"sve-cm-css-token"}),o=e.StateEffect.define();return{extensions:[e.StateField.define({create(){return e.Decoration.none},update(s,r){let i;for(const c of r.effects)c.is(o)&&(i=c.value);if(i===void 0)return r.docChanged?e.Decoration.none:s;if(!i)return e.Decoration.none;const a=new e.RangeSetBuilder;return a.add(i.from,i.to,t),a.finish()},provide:s=>e.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function se(e){e?.getElementById(te)?.remove()}function si(e,t,o,n){t.style.left=`${Math.max(6,Math.min(o,e.innerWidth-28))}px`,t.style.top=`${Math.max(6,n)}px`}function ri(e,t,o,{onRename:n,title:s}){const r=e.document,i=t.coordsAtPos(o.to);if(!i)return;se(r);const a=r.createElement("button");a.id=te,a.type="button",a.innerHTML=oi,a.title=s,a.setAttribute("aria-label",s),a.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),se(r),n?.(o)}),a.addEventListener("mouseleave",()=>{e.setTimeout(()=>{t.dom.matches(":hover")||a.matches(":hover")||se(r)},120)}),r.body.appendChild(a),si(e,a,i.right+2,i.top-1)}function ii(e,t,{onRename:o,isLocked:n,setHover:s,title:r}){if(!t?.dom||t.dom._sveClassTokenBound)return;t.dom._sveClassTokenBound=!0;let i=null,a="";const c=()=>!!n?.(),l=()=>{e.clearTimeout(i),i=null,a="",s?.(t,null),se(e.document)},u=f=>{if(c()){l();return}l(),o?.(f)};t.dom.addEventListener("mousemove",f=>{if(c()){l();return}if(f.target?.closest?.(`#${te}`))return;const p=t.posAtCoords({x:f.clientX,y:f.clientY});if(p==null)return;const g=_o(t.state.doc.toString(),p);if(!g){e.clearTimeout(i),i=null,a="",s?.(t,null);return}const k=`${g.from}:${g.to}:${g.name}`;s?.(t,{from:g.from,to:g.to}),!(a===k&&(i||e.document.getElementById(te)))&&(e.clearTimeout(i),a=k,i=e.setTimeout(()=>{i=null,ri(e,t,g,{onRename:u,title:r||"Rename class"})},160))}),t.dom.addEventListener("mouseleave",f=>{f.relatedTarget?.closest?.(`#${te}`)||e.setTimeout(()=>{e.document.getElementById(te)?.matches(":hover")||l()},160)}),t.dom.addEventListener("dblclick",f=>{if(c())return;const p=t.posAtCoords({x:f.clientX,y:f.clientY});if(p==null)return;const g=_o(t.state.doc.toString(),p);g&&(f.preventDefault(),f.stopPropagation(),u(g))},!0),t.scrollDOM?.addEventListener("scroll",l),e.document._sveClassTokenDismiss||(e.document._sveClassTokenDismiss=!0,e.document.addEventListener("mousedown",f=>{f.target.closest(`#${te}`)||se(e.document)}))}let ne,Ot,rn,an,ln,ve,lt,Xt,Yt,Zt,Gt,cn,dn,un,fn,pn,hn,mn,vn,gn,yn,xn,bn,kn,_n,Sn,$n,L,He=null;function ai(){return He||(He=Promise.all([J(()=>import("./index-Dpuj8sxX.js").then(e=>e.i),__vite__mapDeps([0,1]),import.meta.url),J(()=>import("./index-B5fiB6ig.js"),[],import.meta.url),J(()=>import("./index-eMi007Cw.js"),__vite__mapDeps([2,1,0,3,4]),import.meta.url),J(()=>import("./index-D2YMCfE7.js"),__vite__mapDeps([5,1,0,3,4]),import.meta.url),J(()=>import("./html-tag-sync-BlP2Mk13.js").then(e=>e.g),__vite__mapDeps([6,0,1,7,4,3,5,2]),import.meta.url),J(()=>import("./index-BatCsQTe.js").then(e=>e.i),__vite__mapDeps([7,4,3,1,0]),import.meta.url),J(()=>import("./html-tag-sync-BlP2Mk13.js").then(e=>e.f),__vite__mapDeps([6,0,1,7,4,3,5,2]),import.meta.url),J(()=>import("./index-zsjA895l.js"),__vite__mapDeps([3,4,1,0]),import.meta.url),J(()=>import("./index-BsAZfAgM.js").then(e=>e.i),[],import.meta.url)]).then(([e,t,o,n,s,r,i,a,c])=>{ne=e.EditorView,Ot=e.keymap,rn=e.lineNumbers,an=e.highlightActiveLine,ln=e.highlightActiveLineGutter,ve=t.Compartment,lt=t.EditorState,Xt=t.StateField,Yt=t.StateEffect,Zt=t.RangeSetBuilder,Gt=e.Decoration,cn=o.defaultKeymap,dn=o.indentWithTab,un=o.historyKeymap,fn=o.history,pn=n.autocompletion,hn=n.closeBrackets,mn=n.closeBracketsKeymap,vn=n.closeCompletion,gn=n.completionKeymap,yn=e.hoverTooltip,xn=s.htmlLanguage,bn=s.html,kn=r.css,_n=i.javascript,Sn=a.HighlightStyle,$n=a.syntaxHighlighting,L=c.tags,Ne.html=new ve,Ne.css=new ve,Ne.js=new ve,Fe.html=new ve,Fe.css=new ve,Fe.js=new ve}).catch(e=>{throw He=null,e}),He)}const d="__sve-code-dock",To="__sve-code-dock-style",K="__sve-code-dock-unlock",Cn="sve-code-dock-height",An="sve-code-dock-panes",En="sve-code-dock-widths",Jt="sve-html-scope-v2",wn="sve-code-dock-autosave",Tn="sve-code-dock-style-mode",li=280,Mn=120,Bt=140,ci=250,q=["html","css","js"],di='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',ui='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',fi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',Bn='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',pi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',hi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',mi='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',T="__sve-css-menu",Ln=["h1","h2","h3","h4","h5","h6"],Ht=[{id:"heading",title:"heading",menu:"heading",letter:"H"},{id:"p",title:"paragraph",tag:"p",letter:"P"},{id:"div",title:"div",tag:"div"},{id:"section",title:"section",tag:"section"},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"}],vi=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],Qt=[{id:"all",suffix:"",title:"all"},{id:"block",suffix:"-block",title:"block",sep:!0},{id:"block-start",suffix:"-block-start",title:"block start"},{id:"block-end",suffix:"-block-end",title:"block end"},{id:"inline",suffix:"-inline",title:"inline",sep:!0},{id:"inline-start",suffix:"-inline-start",title:"inline start"},{id:"inline-end",suffix:"-inline-end",title:"inline end"}],In={display:"display",absolute:"position",color:"color",bg:"background-color",padding:"padding",margin:"margin"},On={"":"","-block":"-block","-inline":"-inline","-block-start":"-top","-block-end":"-bottom","-inline-start":"-left","-inline-end":"-right"},gi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',yi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',xi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',Hn=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],ct=[{id:"display",title:"display",menu:"display"},{id:"absolute",title:"absolute",insert:"position: absolute;"},{id:"color",title:"color",property:"color",menu:"colors"},{id:"bg",title:"background color",property:"background-color",menu:"colors"},{id:"padding",title:"padding",property:"padding",menu:"box"},{id:"margin",title:"margin",property:"margin",menu:"box"}],Dt=[{id:"display-flex",title:"flex",display:"flex"},{id:"flex-row",title:"row",flexDir:"row",sep:!0},{id:"flex-col",title:"column",flexDir:"column"}],Pt=[{id:"justify-start",title:"justify start",property:"justify-content",value:"flex-start"},{id:"justify-center",title:"justify center",property:"justify-content",value:"center"},{id:"justify-end",title:"justify end",property:"justify-content",value:"flex-end"},{id:"justify-between",title:"space between",property:"justify-content",value:"space-between"},{id:"justify-around",title:"space around",property:"justify-content",value:"space-around"},{id:"align-start",title:"align start",property:"align-items",value:"flex-start",group:"align"},{id:"align-center",title:"align center",property:"align-items",value:"center",group:"align"},{id:"align-end",title:"align end",property:"align-items",value:"flex-end",group:"align"},{id:"align-stretch",title:"align stretch",property:"align-items",value:"stretch",group:"align"}],tt={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 13.5 L8 2.5 L12 13.5"/><path d="M5.4 10h5.2"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="12" height="12" rx="2" opacity=".85"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>'},bi={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>'};let ot=null,_e=null,w=null,fe=[],z={html:"",css:"",js:""},M=!1,Se=!1,b=null,De=0,Q=null,F=null,ge=null,qe=null,We=!1,N=!1,H=!0,B=!1,D="css",dt=null,ut="",nt=!1,ft=!1,x=null,E="",S="",Z="full",pe="",de=null,ze=null,Pe=null,Re=null,Mo=!1;const h={html:null,css:null,js:null},Ne={html:null,css:null,js:null},Fe={html:null,css:null,js:null};function v(e,t,o={}){let n=e.Statamic?.$config?.get?.("sveStrings")?.[t]??t;for(const[s,r]of Object.entries(o))n=String(n).replaceAll(`:${s}`,r);return n}function Dn(e){return e.document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||e.Statamic?.$config?.get?.("csrfToken")||e.Statamic?.$config?.get?.("csrf_token")||""}function ki(){return[ne.theme({"&":{height:"auto",backgroundColor:"#1e1e1e",color:"#d4d4d4"},".cm-content":{caretColor:"#aeafad",padding:"12px 0",fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:"13px",lineHeight:"1.55"},".cm-cursor":{borderLeftColor:"#aeafad"},".cm-activeLine":{backgroundColor:"#ffffff0d"},".cm-activeLineGutter":{backgroundColor:"#ffffff0d"},".cm-gutters":{backgroundColor:"#1e1e1e",color:"#858585",border:"none",borderRight:"1px solid #3c3c3c",fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:"13px",lineHeight:"1.55"},".cm-lineNumbers .cm-gutterElement":{paddingLeft:"8px",paddingRight:"12px"},".cm-scroller":{overflow:"visible",height:"auto",minHeight:0},".cm-selectionBackground, &.cm-focused .cm-selectionBackground":{backgroundColor:"#264f78 !important"}},{dark:!0}),$n(Sn.define([{tag:L.keyword,color:"#569cd6"},{tag:L.string,color:"#ce9178"},{tag:L.comment,color:"#6a9955",fontStyle:"italic"},{tag:L.number,color:"#b5cea8"},{tag:L.className,color:"#d7ba7d"},{tag:L.tagName,color:"#4ec9b0"},{tag:L.propertyName,color:"#9cdcfe"},{tag:L.variableName,color:"#9cdcfe"},{tag:L.attributeName,color:"#9cdcfe"},{tag:L.attributeValue,color:"#ce9178"},{tag:L.angleBracket,color:"#808080"},{tag:L.unit,color:"#b5cea8"},{tag:L.color,color:"#ce9178"},{tag:L.bracket,color:"#ffd700"},{tag:L.punctuation,color:"#d4d4d4"},{tag:L.operator,color:"#d4d4d4"}]))]}function _i(e){return e==="css"?kn():e==="js"?_n():bn({autoCloseTags:!0})}function Si(e){return e.querySelector(".live-preview")||e.body}function Rt(e,t){const o=Si(e);t.parentElement!==o&&o.appendChild(t)}function Bo(e){if(e._sveShield)return;e._sveShield=!0;const t=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])e.addEventListener(o,t)}function $i(e){try{return new URLSearchParams(e.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function Ci(e){const t=parseInt(Te(e,Cn)??"",10);return Number.isFinite(t)&&t>=Mn?t:li}function Ai(e,t){Ae(e,Cn,String(t))}function Pn(e){try{const t=JSON.parse(Te(e,An)||"null");if(t&&typeof t=="object")return{html:t.html!==!1,css:t.css!==!1,js:t.js===!0}}catch{}return{html:!0,css:!0,js:!1}}function Ei(e,t){Ae(e,An,JSON.stringify(t))}function Rn(e){try{const t=JSON.parse(Te(e,En)||"null");if(t&&typeof t=="object"){const o=n=>Number.isFinite(n)&&n>0?n:1;return{html:o(t.html),css:o(t.css),js:o(t.js)}}}catch{}return{html:1,css:1,js:1}}function wi(e,t){Ae(e,En,JSON.stringify(t))}function Ti(e){let t=e.getElementById(To);t||(t=e.createElement("style"),t.id=To,e.head.appendChild(t)),t.textContent=`
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
#${d} [data-sve-code-history] {
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
#${d} [data-sve-code-history]:hover,
#${d} [data-sve-code-history][data-open] {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${d} [data-sve-style-mode] {
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
#${d} [data-sve-style-mode]:hover {
  opacity: 1;
  background: rgba(255,255,255,.1);
}
#${d} [data-sve-style-mode][aria-pressed="true"] {
  opacity: 1;
  color: #7dd3fc;
  background: rgba(56,189,248,.16);
}
/* The CSS pane holds two things and shows one: the editor, or the chips. */
#${d} [data-sve-tw-host] {
  display: none;
}
#${d}[data-sve-style="tw"] [data-sve-code-pane="css"] [data-sve-code-host] {
  display: none;
}
#${d}[data-sve-style="tw"] [data-sve-tw-host] {
  display: block;
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
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
#${d}[data-sve-code-locked] [data-sve-style-mode],
#${d}[data-sve-code-locked] [data-sve-code-history],
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
#${d}[data-sve-code-locked] [data-sve-code-pane] .cm-editor,
#${d}[data-sve-code-locked] [data-sve-tw-host] {
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
#${d} [data-sve-code-grip] {
  flex: 0 0 16px;
  height: 16px;
  width: 100%;
  cursor: ns-resize;
  z-index: 3;
  ${bo("ns")}
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
  ${bo("ew")}
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
#${ue} {
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
#${ue} [data-sve-partial-choice] {
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
#${ue} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${ue} [data-sve-partial-empty] {
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
`}function Mi(e){const t=e.querySelector(".live-preview-editor");if(!t)return 0;const o=t.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function Bi(e){let t=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=e.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>e.documentElement.clientWidth-8&&(t=Math.max(t,Math.round(s.width)))}return t}function eo(e){const t=e.document;if(ze=e,typeof e.ResizeObserver!="function")return;de||(de=new e.ResizeObserver(()=>{ze&&fs(ze)}));const o=t.querySelector(".live-preview-editor"),n=t.getElementById("__sve-right-dock");o!==Pe&&(Pe&&de.unobserve(Pe),Pe=o,o&&de.observe(o)),n!==Re&&(Re&&de.unobserve(Re),Re=n,n&&de.observe(n))}function Li(){de?.disconnect(),de=null,ze=null,Pe=null,Re=null}function Ii(e){Mo||(Mo=!0,e.addEventListener("sve-right-dock-change",()=>eo(e)))}function to(e,t){const o=e.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=t?`${t}px`:"")}function oo(e){if(!e)return;const t=e.clientHeight,o=e.querySelector("[data-sve-code-bar]"),n=e.querySelector("[data-sve-code-lock-banner]"),s=n&&Oi(e)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,t-(o?.offsetHeight||0)-s),i=e.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),e.querySelectorAll("[data-sve-code-host]").forEach(a=>{const c=a.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let l=0;for(const f of c.children)f!==a&&(l+=f.offsetHeight);const u=Math.max(64,r-l);a.style.height=`${u}px`,a.style.maxHeight=`${u}px`,a.style.minHeight="0",a.style.overflow="auto",Hi(a)})}function Oi(e){return e.ownerDocument?.defaultView||b}function Hi(e){e._sveWheelBound||(e._sveWheelBound=!0,e.addEventListener("wheel",t=>{const o=e.scrollHeight-e.clientHeight,n=e.scrollWidth-e.clientWidth;let s=!1;if(t.deltaY&&o>0){const r=Math.min(o,Math.max(0,e.scrollTop+t.deltaY));r!==e.scrollTop&&(e.scrollTop=r,s=!0)}if(t.deltaX&&n>0){const r=Math.min(n,Math.max(0,e.scrollLeft+t.deltaX));r!==e.scrollLeft&&(e.scrollLeft=r,s=!0)}s&&(t.preventDefault(),t.stopPropagation())},{passive:!1}))}function jn(){const e=(ze||b)?.document?.getElementById(d);e&&oo(e);for(const t of q)h[t]?.requestMeasure()}function qn(e,t){const o=Pn(e),n={};for(const s of q){const r=t.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function zn(e,t){for(const n of q){const s=e.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",t[n]?"true":"false"),r&&(r.style.display=t[n]?"flex":"none")}const o=q.filter(n=>t[n]);e.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),Nn(e.ownerDocument.defaultView,e),oo(e)}function Nn(e,t){const o=Rn(e);for(const n of q){const s=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function Ue(e,t){if(We)return;const o=e.document;Rt(o,t);const n=Ci(e),s=Mi(o),r=Bi(o);t.style.left=`${s}px`,t.style.right=`${r}px`,t.style.bottom="0",t.style.height=`${n}px`,to(o,n),oo(t)}function Fn(e,t,o,n){const s=e.document,r=[...s.querySelectorAll("iframe")];r.forEach(u=>{u.style.pointerEvents="none"});const i=s.createElement("div");i.setAttribute("data-sve-code-drag-shield",""),i.style.cssText=`position:fixed;inset:0;z-index:2147483646;cursor:${t};user-select:none;`,s.body.appendChild(i),We=!0;let a=!1;const c=u=>{o(u)},l=()=>{a||(a=!0,We=!1,s.removeEventListener("mousemove",c),s.removeEventListener("mouseup",l),e.removeEventListener("blur",l),r.forEach(u=>{u.style.pointerEvents=""}),i.remove(),n?.())};s.addEventListener("mousemove",c),s.addEventListener("mouseup",l),e.addEventListener("blur",l)}function Di(e,t){if(t._sveResizeBound)return;t._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest("[data-sve-code-pane-btn], [data-sve-code-back], [data-sve-style-mode], [data-sve-html-scope], [data-sve-code-lock], [data-sve-code-autosave], [data-sve-code-save], .cm-editor"))return;n.preventDefault();const s=n.clientY,r=t.getBoundingClientRect().height;let i=r;Fn(e,"ns-resize",a=>{i=Math.min(Math.max(Mn,r+(s-a.clientY)),Math.round(e.innerHeight*.7)),t.style.height=`${i}px`,to(e.document,i),jn()},()=>{Ai(e,i),Ue(e,t),e.dispatchEvent(new Event("resize"))})};t.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),t.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function Pi(e,t){t._sveSplitBound||(t._sveSplitBound=!0,t.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=q.filter(y=>qn(e,t)[y]),i=r.indexOf(s),a=r[i],c=r[i+1];if(!a||!c)return;const l=t.querySelector(`[data-sve-code-pane="${a}"]`),u=t.querySelector(`[data-sve-code-pane="${c}"]`),f=n.clientX,p=l.getBoundingClientRect().width,g=u.getBoundingClientRect().width,k=p+g;o.setAttribute("data-active",""),Fn(e,"col-resize",y=>{const I=y.clientX-f;let O=Math.max(Bt,Math.min(k-Bt,p+I)),ce=k-O;k<Bt*2&&(O=p,ce=g);const Oe=Rn(e);Oe[a]=O,Oe[c]=ce,wi(e,Oe),Nn(e,t),jn()},()=>{o.removeAttribute("data-active")})})}))}function Ri(e,t){t._svePaneBound||(t._svePaneBound=!0,t.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=qn(e,t),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),Ei(e,i),zn(t,i)})}))}function V(e,t){const o=e.getElementById(d)?.querySelector("[data-sve-code-status]");o&&(o.textContent=t||"")}function Vn(e,t){const o=e.getElementById(d)?.querySelector("[data-sve-code-path]");o&&(o.textContent=t||"",o.title=t||"")}function Ke(e){const t=e?.document?.getElementById(d)?.querySelector("[data-sve-code-back]");t&&(t.hidden=fe.length===0,t.title=v(e,"code_dock_back"),t.setAttribute("aria-label",t.title),t.innerHTML=fi)}function Lo(e,t){const o=t.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),zi(e)}))}function ji(e){const t=_e,o=typeof _.activeContainers=="function"?_.activeContainers(e.document):[];for(const n of o){const s=_.unwrapRef?.(n.values)||n.values;if(!(!s||typeof s!="object")&&t&&typeof _.findPathByUid=="function"){const r=_.findPathByUid(s,t);if(r){const i=r.split("."),a=_.dataGet?.(s,i.slice(0,2).join("."));if(a&&typeof a=="object")return a}}}for(const n of o){const s=_.unwrapRef?.(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function qi(e,t){!t||t===w||(ie(e.document),wt(e,t,"push"))}function zi(e){const t=fe.pop();if(!t){Ke(e);return}ie(e.document),wt(e,t,"keep")}function we(e){const t=e.document.getElementById(d),o=t?.querySelector("[data-sve-code-lock]"),n=t?.querySelector("[data-sve-code-lock-banner]");if(!t||!o)return;const s=M;t.toggleAttribute("data-sve-code-locked",s),s&&(ee(e.document),se(e.document),be&&(be.setHover(h.html,null),be.setHover(h.css,null)),Ve?.setHover(h.html,null)),o.hidden=!Se,o.setAttribute("aria-pressed",M?"true":"false"),o.title=v(e,M?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=M?di:ui,n&&(n.textContent=v(e,"code_dock_locked_banner"))}function Ye(e){return e?Te(e,Jt)!=="0":H}function yt(e,t,o){return e!=null&&t!=null&&e>=0&&t>e&&t<=o}function xt(){const e=h.html?.state.doc.toString()??"";if(!B||!x){E=e;return}if(x.from<0||x.from>E.length||x.to<x.from){B=!1,E=e,x=null;return}E=E.slice(0,x.from)+e+E.slice(x.to),x={from:x.from,to:x.from+e.length}}function Ze(){return xt(),B?E:h.html?.state.doc.toString()??z.html??""}function bt(){F=vt(Ze()).map(e=>e.name)}function Be(){ge=Go(h.css?.state.doc.toString()??S)}function Wn(e,t){return Array.isArray(e)&&Array.isArray(t)&&e.length===t.length&&e.every((o,n)=>o===t[n])}function Ni(){const e=B?so():Ze(),t=gt(e);t.length&&(S=Kt(S,Ut(S,t),t[0].className))}function Un(e,t){S=jr(S,e,t),Ni(),S=qr(S,t,e)}function Fi(e){if(N||M||F==null)return;const t=vt(Ze()).map(o=>o.name);Wn(F,t)||(Un(F,t),F=t,_t(),Be())}function Vi(){if(N||M||ge==null||F==null||Z==="empty")return;const e=h.html,t=Go(h.css?.state.doc.toString()??"");if(!e||Wn(ge,t))return;const o=new Set(F),{renamed:n,removed:s}=Jo(ge,t);let r=e.state.doc.toString();const i=r;for(const a of n){const c=ke(a.to);!o.has(a.from)||!c||(r=So(r,l=>l===a.from?c:l))}for(const a of s)!o.has(a)||t.includes(a)||(r=So(r,c=>c===a?"":c));if(r!==i){N=!0;try{kt(r)}finally{N=!1}}bt(),ge=t}function Wi(e,t){const o=ke(t),n=h.html;if(!o||!n||n.state.readOnly||o===e.name)return;N=!0;try{n.dispatch({changes:{from:e.from,to:e.to,insert:o}})}finally{N=!1}const s=F==null?[]:F.slice();bt(),Un(s,F),_t(),Be(),b&&(le(b),G(b))}function Ui(e,t){const o=e.document,s=h.html?.coordsAtPos(t.from);A(o),se(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=T,o.body.appendChild(r),Ie(e,i,r),r._sveApp=Me(Xo,r,{label:v(e,"code_dock_css_rename_class"),placeholder:v(e,"code_dock_css_class_placeholder"),initial:t.name,onAdd:a=>{Wi(t,a),A(o)}})}function Kn(){return H&&yt(x?.from,x?.to,E.length)?(B=!0,E.slice(x.from,x.to)):(B=!1,E)}function no(e,t,o){const n=h[e];if(!n)return;const s=n.state.doc.toString();N=!0;try{s!==t?n.dispatch({changes:{from:0,to:s.length,insert:t},...o?{selection:o,scrollIntoView:!0}:{}}):o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{N=!1}}function kt(e,t){no("html",e,t)}function so(){return B?h.html?.state.doc.toString()??"":yt(x?.from,x?.to,E.length)?E.slice(x.from,x.to):""}function Le(){const e=h.css?.state.doc.toString()??"";if(Z==="tree"){if(e===pe)return;const t=gt(so())[0]?.className||tn(e);S=Kt(S,e,t),pe=e}else Z==="full"&&(S=e)}function Xn(e,t){for(const o of t||[])if(!Y(e,o.className)||Xn(e,o.children))return!0;return!1}function _t(){let e=S,t=[],o=!1;!H||!B?(Z="full",e=S):(t=gt(so()),t.length?(Z="tree",e=Ut(S,t),Xn(S,t)&&(S=Kt(S,e,t[0].className),o=!0)):(Z="empty",e="")),pe=e,no("css",e),Be(),b&&(G(b),o&&le(b))}function ro(){const e=h.html;if(!e||!x)return;B||(E=e.state.doc.toString());const t=E.length,o=Math.max(0,Math.min(x.from,t)),n=Math.max(o,Math.min(x.to,t));n<=o||(x={from:o,to:n},B=!0,kt(E.slice(o,n),{anchor:0,head:0}),_t(),e.focus())}function io(e=!0){const t=h.html;if(!t)return;Le(),xt(),B=!1;const o=E||t.state.doc.toString(),n=e&&yt(x?.from,x?.to,o.length)?{anchor:x.from,head:x.to}:null;E=o,kt(o,n),Z="full",pe=S,no("css",S),Be()}function ao(){x=null,B=!1,E="",S="",Z="full",pe="",F=null,ge=null}let Xe=!1;function Ee(e){return!!e?.document.getElementById(_.HTML_TREE_PANEL_ID)}function jt(e,t){if(!(!e||_.featureOn?.(e,"html_tree")===!1)){if(!t){Ee(e)&&_.closeHtmlTreePanel?.(e);return}Ee(e)||(Xe=!0,Ss("html_tree").then(()=>{Ee(e)||_.toggleHtmlTreePanel?.(e)}).catch(()=>{}).finally(()=>{Xe=!1,U(e)}))}}function U(e){const t=e?.document.getElementById(d)?.querySelector("[data-sve-html-scope]");if(!t)return;H=Ye(e);const o=_.featureOn?.(e,"html_tree")===!1?H:Ee(e)||Xe;t.setAttribute("aria-pressed",o?"true":"false"),t.title=v(e,o?"code_dock_html_scope_off":"code_dock_html_scope"),t.setAttribute("aria-label",t.title),t.innerHTML=Bn,e.document.getElementById(d)?.toggleAttribute("data-sve-html-scoped",B)}function Io(e,t){t._sveHtmlScopeBound||(t._sveHtmlScopeBound=!0,H=Ye(e),Ki(e,t),jt(e,H),t.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),H=!(Ee(e)||Xe),Ae(e,Jt,H?"1":"0"),H?x&&(Le(),ro()):B&&io(),jt(e,H),U(e)}))}function Ki(e,t){t._sveTreeWatchBound||(t._sveTreeWatchBound=!0,e.addEventListener("sve-right-dock-change",()=>{if(Xe||_.featureOn?.(e,"html_tree")===!1||!e.document.getElementById(d))return;const o=Ee(e);o!==Ye(e)&&(H=o,Ae(e,Jt,o?"1":"0"),o?x&&(Le(),ro()):B&&io(),U(e))}))}function Oo(e,t){t._sveLockBound||(t._sveLockBound=!0,t.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!Se||!w)){if(M){Yi(e);return}Yn(e,!0)}}))}function lo(e){return e?Te(e,wn)!=="0":!0}function Xi(){const e=h.html;return!e||e.state.readOnly||!w?!1:!co(St(),z)}function he(e){const t=e?.document.getElementById(d),o=t?.querySelector("[data-sve-code-autosave]"),n=t?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=lo(e),r=Xi();o.setAttribute("aria-pressed",s?"true":"false"),o.title=v(e,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=pi,n.hidden=s,n.title=v(e,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=hi,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function Ho(e,t){t._sveAutosaveBound||(t._sveAutosaveBound=!0,t.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!lo(e);Ae(e,wn,n?"1":"0"),n?ie(e.document):Q&&(clearTimeout(Q),Q=null),he(e)}),t.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),ie(e.document)}))}function Yi(e){e.document.getElementById(K)?.remove();const t=$s(e.document,Cs,{title:v(e,"code_dock_unlock_title"),body:v(e,"code_dock_unlock_body"),buttons:[{value:"cancel",label:v(e,"cancel"),variant:"ghost"},{value:"ok",label:v(e,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{t.dismiss(),o==="ok"&&Yn(e,!1)}});t.host.id=K}function Yn(e,t){const o=w;if(!o)return;const n=()=>{w===o&&e.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Dn(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:t})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));w===o&&(M=t,we(e),Ge(z,t),U(e),V(e.document,t?v(e,"code_dock_locked"):""))}).catch(()=>{V(e.document,v(e,"code_dock_error"))})};if(t&&(ie(e.document),qe)){qe.finally(n);return}n()}function St(){const e={html:"",css:"",js:""};xt(),Le();for(const t of q)t==="html"?e.html=B?E:h.html?.state.doc.toString()??"":t==="css"?e.css=S:e[t]=h[t]?.state.doc.toString()??"";return e}function Zi(){if(!(H&&yt(x?.from,x?.to,E.length)))return Z="full",pe=S,S;const e=gt(E.slice(x.from,x.to));if(!e.length)return Z="empty",pe="","";Z="tree";const t=Ut(S,e);return pe=t,t}function Ge(e,t){N=!0;try{b&&(H=Ye(b)),E=e.html??"",S=e.css??"";for(const o of q){const n=h[o];let s=e[o]??"";try{s=o==="html"?Kn():o==="css"?Zi():s}catch{s=o==="html"?E||e.html||"":o==="css"?S||e.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[Ne[o].reconfigure(lt.readOnly.of(!!t)),Fe[o].reconfigure(ne.editable.of(!t))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{N=!1}bt(),Be(),Ft("dock:html-changed"),b&&(G(b),Et(b),U(b))}function co(e,t){return e.html===t.html&&e.css===t.css&&e.js===t.js}function Zn(e){return String(e||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function $t(e){const t=Zn(e).match(/^([a-z-]+)\s*:/i);return t?t[1].toLowerCase():""}function Gi(e,t){return e===t||e.startsWith(`${t}-`)}function Ct(e){const t=Zn(e),o=t.indexOf(":");return o===-1?"":t.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function R(e){const t=String(e||"").trim().toLowerCase();return t==="start"||t==="flex-start"||t==="left"||t==="top"?"flex-start":t==="end"||t==="flex-end"||t==="right"||t==="bottom"?"flex-end":t==="row-reverse"?"row-reverse":t==="column-reverse"?"column-reverse":t}function pt(e){const t=R(e);return t==="flex"||t==="inline-flex"}function uo(){const e=h.css;if(!e)return null;const t=e.state.selection.main.head,o=e.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const a=o.indexOf("}}",i+2);if(a===-1)break;i=a+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const a=n.pop();a!=null&&s.push({from:a+1,to:i,text:o.slice(a+1,i),open:a})}}let r=null;for(const i of s)t<i.open||t>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function Ji(e){const t=String(e||"");let o="",n=0;for(let s=0;s<t.length;s+=1){if(t[s]==="{"&&t[s+1]==="{"){const r=t.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=t.slice(s,r+2)),s=r+1;continue}if(t[s]==="{"){n+=1;continue}if(t[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=t[s])}return o}function Qi(e){const t={};for(const o of Ji(e).split(";")){const n=$t(o);n&&(t[n]=Ct(`${o};`))}return t}function ea(e,t,o){if(!t||t.from>=t.to)return null;let n=e.state.doc.lineAt(t.from),s=0;for(;n.from<=t.to;){const r=Math.max(n.from,t.from),i=Math.min(n.to,t.to),a=e.state.doc.sliceString(r,i);if(s===0&&$t(a)===o)return{from:r,to:i,text:a};if(s+=ta(a),n.to>=e.state.doc.length||n.to>=t.to)break;n=e.state.doc.lineAt(n.to+1)}return null}function ta(e){let t=0;const o=String(e);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?t+=1:o[n]==="}"&&(t-=1)}return t}function me(e){return(String(e).match(/^\s*/)||[""])[0]}function At(e,t,o){for(let n=t.number-1;n>=1;n-=1){const s=e.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=me(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function oa(e,t){const o=e.state.doc.lineAt(t);if(o.text.trim())return me(o.text);const n=At(e,o,!0);if(n)return n;const s=uo();return s?Gn(e,s):"  "}function Gn(e,t){const o=e.state.doc.lineAt(t.from),n=e.state.doc.lineAt(Math.max(t.from,t.to));for(let r=n.number;r>=o.number;r-=1){const i=e.state.doc.line(r),a=Math.max(i.from,t.from),c=Math.min(i.to,t.to),l=e.state.doc.sliceString(a,c);if(l.trim())return(l.match(/^\s*/)||[""])[0]||"  "}return`${(e.state.doc.lineAt(Math.max(0,t.from-1)).text.match(/^\s*/)||[""])[0]}  `}function Do(){h.css?.focus(),b&&(le(b),G(b))}function W(e){const t=h.css;if(!t||t.state.readOnly||!e.length)return;const o=uo();if(!o){const i=e.filter(a=>a.value!=null).map(a=>`${a.property}: ${a.value};`).join(`
`);i&&ia(i),Do();return}const n=[],s=[],r=Gn(t,o);for(const i of e){const a=ea(t,o,i.property);if(i.value==null){if(!a)continue;let c=a.from,l=a.to;t.state.doc.sliceString(l,l+1)===`
`&&(l+=1),c=Math.max(c,o.from),l=Math.min(l,o.to),n.push({from:c,to:l});continue}if(!(a&&R(Ct(a.text))===R(i.value)))if(a){const c=(a.text.match(/^\s*/)||[""])[0];n.push({from:a.from,to:a.to,insert:`${c}${i.property}: ${i.value};`})}else s.push(`${r}${i.property}: ${i.value};`)}if(s.length){const i=!o.text.includes(`
`)||!/\n\s*$/.test(o.text)?`
`:"";n.push({from:o.to,to:o.to,insert:`${i}${s.join(`
`)}
`})}n.length&&(n.sort((i,a)=>a.from-i.from||a.to-i.to),t.dispatch({changes:n})),Do()}function $e(){const e=uo();return e?Qi(e.text):{}}function na(e){const t=$e(),o=pt(t.display),n=R(t["flex-direction"])||(o?"row":"");if(o&&n===e){const s=[];t["flex-direction"]&&s.push({property:"flex-direction",value:null}),pt(t.display)&&s.push({property:"display",value:null}),W(s);return}W([{property:"display",value:"flex"},{property:"flex-direction",value:e}])}function sa(e){const t=$e();if(e==="flex"&&pt(t.display)){W([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}W([{property:"display",value:e}])}function ra(e,t){const o=$e();if(R(o[e])===R(t)){W([{property:e,value:null}]);return}W([{property:e,value:t}])}function ia(e){const t=h.css;if(!t||t.state.readOnly)return;const o=t.state.selection.main.head,n=t.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=oa(t,o),a=e.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const l=`${i}${a}
${i}`;t.dispatch({changes:{from:n.from,to:n.to,insert:l},selection:{anchor:n.from+l.length}});return}const c=`
${i}${a}
${i}`;t.dispatch({changes:{from:o,to:t.state.selection.main.to,insert:c},selection:{anchor:o+c.length}})}function G(e){try{aa(e)}catch{}}function aa(e){const t=e?.document?.getElementById(d);if(D==="tw"){t&&Ca(e,t);return}const o=$e(),n=pt(o.display),s=R(o["flex-direction"])||(n?"row":""),r=t?.querySelector("[data-sve-css-tools]"),i=t?.querySelector("[data-sve-css-chrome]"),a=i?.getAttribute("data-sve-css-sub")||"",c=a==="padding"||a==="margin"?a:"";if(t){i&&(n?i.setAttribute("data-sve-css-flex-on",""):i.removeAttribute("data-sve-css-flex-on")),r&&(n?r.setAttribute("data-sve-css-flex-on",""):r.removeAttribute("data-sve-css-flex-on"));for(const l of[...ct,...Dt]){const u=t.querySelector(`[data-sve-css-tool="${l.id}"]`);if(!u)continue;let f=!1;if(l.flexDir)f=n&&s===l.flexDir;else if(l.display)f=l.display==="flex"?n:R(o.display)===l.display;else if(l.insert){const p=$t(l.insert);f=!!p&&R(o[p])===R(Ct(l.insert))}else l.menu==="box"?(f=Object.keys(o).some(p=>Gi(p,l.property)),a===l.property?u.setAttribute("data-open",""):u.removeAttribute("data-open")):l.menu==="display"?(f=!!o.display,a==="display"?u.setAttribute("data-open",""):u.removeAttribute("data-open")):l.property&&(f=l.property in o);f?u.setAttribute("data-active",""):u.removeAttribute("data-active")}for(const l of Qt){const u=t.querySelector(`[data-sve-css-box-side="${l.suffix}"]`);if(!u)continue;!!c&&`${c}${l.suffix}`in o?u.setAttribute("data-active",""):u.removeAttribute("data-active")}for(const l of Pt){const u=t.querySelector(`[data-sve-css-tool="${l.id}"]`);if(!u)continue;R(o[l.property])===R(l.value)?u.setAttribute("data-active",""):u.removeAttribute("data-active")}}}function A(e){const t=e?.getElementById(T);t?._sveApp?.unmount(),t?.remove(),e?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-css-box-side][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(o=>o.removeAttribute("data-open"))}function la(e){A(e),se(e);for(const t of q)h[t]&&vn?.(h[t])}function ca(e){if(ot)return ot;const t=e.Statamic?.$config?.get?.("cpUrl")||`/${e.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return ot=e.fetch(`${t}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,a=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!a||n.has(a)||(n.add(a),s.push({name:a,hex:r.hex||r.color||""}))}for(const[r,i]of Hn)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),ot}function Jn(e,t){const o=$e()[t]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of e.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function Ie(e,t,o){const n=t.getBoundingClientRect(),s=8;o.style.left=`${Math.max(s,Math.min(n.left,e.innerWidth-220))}px`,o.style.top=`${Math.max(s,n.bottom+4)}px`}function da(e,t,o){const n=e.document;A(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=T,n.body.appendChild(s),Ie(e,t,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=Me(mt,s,{kind:"colors",swatches:i,onClear:()=>{W([{property:o,value:null}]),A(n)},onPick:a=>{W([{property:o,value:`var(${a})`}]),A(n)}}),Jn(s,o)};r(Hn.map(([i,a])=>({name:i,hex:a}))),ca(e).then(i=>{n.getElementById(T)&&r(i.map(a=>({name:a.name,hex:a.hex})))})}function Po(e,t,o){const n=e.document;A(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=T,n.body.appendChild(s),Ie(e,t,s),s._sveApp=Me(mt,s,{kind:"choices",choices:vi.map(r=>({value:r,token:r,label:r})),onPick:r=>{W([{property:o,value:`var(${r})`}]),A(n)}}),Jn(s,o)}function xe(e){return e?.querySelector("[data-sve-css-chrome]")}function qt(e,t){const o=e.document.getElementById(d),n=xe(o);A(e.document),n&&(n.getAttribute("data-sve-css-sub")===t?n.removeAttribute("data-sve-css-sub"):n.setAttribute("data-sve-css-sub",t),G(e))}function Qn(e,t){if(e.startsWith("{{",t)){const o=e.indexOf("}}",t+2);return o===-1?e.length:o+2}if(e.startsWith("<!--",t)){const o=e.indexOf("-->",t+4);return o===-1?e.length:o+3}return t}function zt(e,t){if(e[t]!=="<")return null;const o=e.indexOf(">",t+1);if(o===-1)return null;const n=e.slice(t,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:t,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:t,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:t,to:o+1}}function Ro(e,t,o){let n=1,s=o;for(;s<e.length;){const r=Qn(e,s);if(r!==s){s=r;continue}if(e[s]!=="<"){s+=1;continue}const i=zt(e,s);if(!i)break;if(i.kind==="open"&&i.name===t)n+=1;else if(i.kind==="close"&&i.name===t&&(n-=1,n===0))return i;s=i.to}return null}function Je(){const e=h.html;if(!e)return null;const t=e.state.selection.main.head,o=e.state.doc.toString(),n=[];let s=0;for(;s<t;){const c=Qn(o,s);if(c!==s){s=c;continue}if(o[s]!=="<"){s+=1;continue}const l=zt(o,s);if(!l||l.from>=t)break;if(l.kind==="open")n.push(l);else if(l.kind==="close"){for(let u=n.length-1;u>=0;u-=1)if(n[u].name===l.name){n.splice(u);break}}s=l.to}const r=o.lastIndexOf("<",Math.max(0,t-1));if(r!==-1&&o.indexOf(">",r)>=t){const c=zt(o,r);if(c?.kind==="open"||c?.kind==="void"){const l=c.kind==="void"?null:Ro(o,c.name,c.to);return l?{name:c.name,open:c,close:l}:{name:c.name,open:c,close:null}}}const i=n[n.length-1];if(!i)return null;const a=Ro(o,i.name,i.to);return{name:i.name,open:i,close:a}}function Nt(e){return Ln.includes(e)}function oe(){h.html?.focus(),b&&(le(b),Et(b))}function st(e,t,o){const n=[...t].sort((s,r)=>r.from-s.from||r.to-s.to);e.dispatch({changes:n,selection:o})}function ht(e,t){const o=h.html;if(!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.slice(0,n-s.from),i=s.text.trim()?me(s.text):At(o,s)||me(s.text);let a=e,c=0;if(r.trim()!=="")a=`
${i}${e}`,c=1+i.length;else if(!s.text.trim()){a=`${i}${e}`,c=i.length,o.dispatch({changes:{from:s.from,to:s.to,insert:a},selection:{anchor:s.from+c+t}});return}o.dispatch({changes:{from:n,to:o.state.selection.main.to,insert:a},selection:{anchor:n+c+t}})}function es(e){const t=h.html;if(!t||t.state.readOnly)return;const o=t.state.selection.main,n=t.state.doc.toString();if(!o.empty){const a=n.slice(o.from,o.to),c=a.match(new RegExp(`^<${e}(\\s[^>]*)?>([\\s\\S]*)</${e}>$`,"i"));if(c){st(t,[{from:o.from,to:o.to,insert:c[2]}],{anchor:o.from,head:o.from+c[2].length}),oe();return}let l=`<${e}>${a}</${e}>`,u=o.from+e.length+2;e==="ul"&&(l=`<ul>
  <li>${a}</li>
</ul>`,u=o.from+11),st(t,[{from:o.from,to:o.to,insert:l}],{anchor:u,head:u+a.length}),oe();return}const s=Je();if(s?.open&&s.close){if(s.name===e){st(t,[{from:s.close.from,to:s.close.to,insert:""},{from:s.open.from,to:s.open.to,insert:""}],{anchor:s.open.from}),oe();return}if(Nt(s.name)&&Nt(e)){const a=n.slice(s.open.from,s.open.to).replace(new RegExp(`^<${s.name}`,"i"),`<${e}`);st(t,[{from:s.close.from,to:s.close.to,insert:`</${e}>`},{from:s.open.from,to:s.open.to,insert:a}],{anchor:s.open.from+e.length+1}),oe();return}}const i=(t.state.doc.lineAt(o.head).text.match(/^\s*/)||[""])[0];if(e==="ul"){const a=`<ul>
${i}  <li></li>
${i}</ul>`;ht(a,`<ul>
${i}  <li>`.length)}else ht(`<${e}></${e}>`,e.length+2);oe()}function Et(e){try{ua(e)}catch{}}function ua(e){const t=e?.document?.getElementById(d),n=Je()?.name||"";if(t)for(const s of Ht){const r=t.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!r)continue;(s.id==="heading"?Nt(n):n===s.tag)?r.setAttribute("data-active",""):r.removeAttribute("data-active")}}function fa(e,t){const o=e.document,n=Je()?.name||"";A(o),t.setAttribute("data-open","");const s=o.createElement("div");s.id=T,o.body.appendChild(s),Ie(e,t,s),s._sveApp=Me(mt,s,{kind:"choices",choices:Ln.map(r=>({value:r,label:r.toUpperCase(),active:n===r})),onPick:r=>{es(r),A(o)}})}function pa(e){const t=ke(e),o=h.html,n=h.css;if(!t||o?.state.readOnly||n?.state.readOnly)return;const s=Je();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=Mr(r,t);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}Le(),Y(S,t)||(S=`${String(S||"").trimEnd()}${S?.trim()?`
`:""}.${t} {
}
`),_t(),bt(),Be(),b&&(le(b),Et(b),G(b))}function ha(e,t){const o=e.document;if(t.hasAttribute("data-open")){A(o);return}A(o),t.setAttribute("data-open","");const n=o.createElement("div");n.id=T,o.body.appendChild(n),Ie(e,t,n),n._sveApp=Me(Xo,n,{label:v(e,"code_dock_css_class_name"),placeholder:v(e,"code_dock_css_class_placeholder"),onAdd:s=>{pa(s),A(o)}})}function ma(e,t){const o=t.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=mi,o.title=v(e,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),D==="tw"){A(e.document),Is(e,o);return}ha(e,o)}))}function va(e){const t=Math.max(0,Math.round(Date.now()/1e3-e)),o=new Date(e*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let n=o;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});t<90?n=s.format(-t,"second"):t<5400?n=s.format(-Math.round(t/60),"minute"):t<86400?n=s.format(-Math.round(t/3600),"hour"):n=s.format(-Math.round(t/86400),"day")}catch{}return`${n} · ${o}`}function ts(e,t){return e.fetch(t,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function ga(e,t){const o=e.document,n=mo();if(A(o),!n)return;let s=[];try{const i=await ts(e,`/!/sve/section-template/history?type=${encodeURIComponent(n)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!o.getElementById(d)||!o.contains(t))return;t.setAttribute("data-open","");const r=o.createElement("div");r.id=T,o.body.appendChild(r),Ie(e,t,r),r._sveApp=Me(mt,r,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:va(i.at)})):[{value:"",label:v(e,"code_dock_history_empty")}],onPick:i=>{A(o),i&&ya(e,n,i)}})}async function ya(e,t,o){if(Ce())return;let n=null;try{const s=await ts(e,`/!/sve/section-template/history/entry?type=${encodeURIComponent(t)}&id=${encodeURIComponent(o)}`);s.ok&&(n=await s.json())}catch{n=null}!n||Ce()||(Ge({html:n.html??"",css:n.css??"",js:n.js??""},M),le(e),fo(e))}function xa(e,t){const o=t.querySelector("[data-sve-code-history]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=gi,o.title=v(e,"code_dock_history"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),o.hasAttribute("data-open")){A(e.document);return}ga(e,o)}))}function ba(){return D}function ka(e){const t=h.html;if(!t||D!=="tw")return null;const o=Ze(),s=(B&&x?x.from:0)+t.state.selection.main.from,r=Ls(Fo(o),new Set);let i=null;for(const a of r)a.from<=s&&s<a.to&&(i=a);return i}function fo(e){D==="tw"&&Bs(e,ka())}function po(e){const t=e?.document.getElementById(d);if(!t)return;const o=D==="tw";t.setAttribute("data-sve-style",D);const n=t.querySelector("[data-sve-css-label]");n&&(n.textContent=o?v(e,"code_dock_style_tw"):v(e,"code_dock_css"));const s=t.querySelector("[data-sve-style-mode]");if(!s)return;const r=e.document.createElement("span");r.textContent=o?v(e,"code_dock_style_tw"):v(e,"code_dock_css"),s.innerHTML=o?xi:yi,s.appendChild(r),s.title=v(e,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function os(e){const t=e?.document.getElementById(d);A(e.document),It(e),xe(t)?.removeAttribute("data-sve-css-sub"),po(e),D==="tw"&&jt(e,!0),fo(e),G(e)}function _a(e,t){D=t==="tw"?"tw":"css",Ae(e,Tn,D),os(e)}function Sa(e,t){t._sveStyleModeBound||(t._sveStyleModeBound=!0,D=Te(e,Tn)==="tw"?"tw":"css",t.querySelector("[data-sve-style-mode]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),_a(e,D==="tw"?"css":"tw")}),os(e))}function $a(e,t,o,n){const s=In[o];if(!(!s||!n)){if(o==="absolute"){It(e),xe(t)?.removeAttribute("data-sve-css-sub"),Os(e,"absolute"),G(e);return}if(o==="padding"||o==="margin"){It(e),qt(e,s);return}xe(t)?.removeAttribute("data-sve-css-sub"),Wo(e,n,s)}}function Ca(e,t){const o=t.querySelector("[data-sve-css-chrome]"),n=o?.getAttribute("data-sve-css-sub")||"",s=n==="padding"||n==="margin"?n:"";o?.removeAttribute("data-sve-css-flex-on"),t.querySelector("[data-sve-css-tools]")?.removeAttribute("data-sve-css-flex-on");for(const r of ct){const i=t.querySelector(`[data-sve-css-tool="${r.id}"]`);if(!i)continue;const a=In[r.id],c=Hs()&&!!a&&!!ko(a);n===a&&(r.id==="padding"||r.id==="margin")?i.setAttribute("data-open",""):i.removeAttribute("data-open"),c?i.setAttribute("data-active",""):i.removeAttribute("data-active")}for(const r of Qt){const i=t.querySelector(`[data-sve-css-box-side="${r.suffix}"]`);if(!i)continue;const a=s?`${s}${On[r.suffix]??r.suffix}`:"";a&&ko(a)?i.setAttribute("data-active",""):i.removeAttribute("data-active")}}function Aa(e,t){const o=t.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=[...ct,...Dt,...Pt],s=(l,u)=>{const f=n.find(p=>p.id===l);if(f){if(D==="tw"){$a(e,t,l,u);return}if(f.flexDir){A(e.document),na(f.flexDir);return}if(f.display){A(e.document),sa(f.display);return}if(f.property&&f.value){A(e.document),ra(f.property,f.value);return}if(f.insert){const p=$t(f.insert),g=Ct(f.insert),k=$e();A(e.document),xe(t)?.removeAttribute("data-sve-css-sub"),p&&R(k[p])===R(g)?W([{property:p,value:null}]):W([{property:p,value:g}]);return}if(f.menu==="colors"){xe(t)?.removeAttribute("data-sve-css-sub"),da(e,u,f.property);return}if(f.menu==="box"){qt(e,f.property);return}if(f.menu==="display"){qt(e,"display");return}f.menu==="spacing"&&Po(e,u,f.property)}};let r=!1;const i=Pt.map((l,u)=>{const f={...l,icon:tt[l.id]||"",sep:u===0||l.group==="align"&&!r};return l.group==="align"&&!r&&(r=!0),f});ye(o,pr,{tools:ct.map(l=>({...l,icon:tt[l.id]||""})),onTool:l=>s(l,t.querySelector(`[data-sve-css-tool="${l}"]`))});const a=t.querySelector('[data-sve-css-sub="box"]');a&&!a._sveBound&&(a._sveBound=!0,ye(a,vr,{sides:Qt.map(l=>({...l,icon:tt[`box-${l.id}`]||""})),onSide:l=>{const u=xe(t)?.getAttribute("data-sve-css-sub"),f=a.querySelector(`[data-sve-css-box-side="${l}"]`),p=`${u}${l}`,g=D==="tw"?{}:$e();if(!(u!=="padding"&&u!=="margin"||!f)){if(D==="tw"){Wo(e,f,`${u}${On[l]??l}`);return}if(p in g){A(e.document),W([{property:p,value:null}]);return}Po(e,f,p),G(e)}}}));const c=t.querySelector('[data-sve-css-sub="display"]');c&&!c._sveBound&&(c._sveBound=!0,ye(c,_r,{items:Dt.map(l=>({...l,icon:tt[l.id]||""})),extras:i,onTool:l=>s(l,t.querySelector(`[data-sve-css-tool="${l}"]`))})),e.document.addEventListener("mousedown",l=>{l.target.closest(`#${T}, [data-sve-css-tools], [data-sve-css-subrow], [data-sve-html-tools], [data-sve-css-add-class]`)||A(e.document)},!0)}function Ea(e,t){const o=t.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,ye(o,ar,{tools:Ht.map(n=>({...n,icon:bi[n.id]||""})),onTool:n=>{const s=Ht.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){fa(e,r);return}A(e.document),es(s.tag)}}}),wa(e,t),Ma(e,t))}function wa(e,t){const o=t.querySelector("[data-sve-antlers-tools]");!o||o._sveBound||(o._sveBound=!0,ye(o,Ko,{label:v(e,"code_dock_antlers"),groups:js.map(n=>({id:n.id,label:v(e,n.lang),items:qs.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>Ta(n)}))}function Ta(e){const t=zs(e),o=h.html;if(!t||!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.trim()?me(s.text):At(o,s)||me(s.text),{text:i,cursor:a}=it(t.snippet);ht(Uo(i,r),a),oe()}function Ma(e,t){const o=t.querySelector("[data-sve-visual-edit-tools]");!o||o._sveBound||(o._sveBound=!0,ye(o,Ko,{label:v(e,"code_dock_visual_edit"),groups:zr.map(n=>({id:n.id,label:v(e,n.lang),items:nn.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>La(n)}))}function Ba(e,t,o,n){if(Vr(o.inner,n.attr)){e.focus();return}const{text:s,cursor:r}=it(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(t[i-1]);)i--;e.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),oe()}function La(e){const t=Nr(e),o=h.html;if(!t||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=Je();if(s?.open){const f=Fr(n,s.open.from,s.open.to,et);if(f){t.attr?Ba(o,n,f,t):(o.dispatch({selection:{anchor:f.openIdx+2+et.length}}),o.focus());return}const p=s.open.from+1+s.name.length,g=t.standalone||`{{ ${et} ${t.attr} }}`,{text:k,cursor:y}=it(g);o.dispatch({changes:{from:p,to:p,insert:` ${k}`},selection:{anchor:p+1+y}}),oe();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),a=i.text.trim()?me(i.text):At(o,i)||me(i.text),c=t.standalone||`{{ ${et} ${t.attr} }}`,{text:l,cursor:u}=it(c);ht(Uo(l,a),u),oe()}function ns(e){if(!_e||!w||String(w).startsWith("view:")){yo(e);return}const t=_s(_e,e.document);yo(e,t.length?{sectionUids:t}:void 0)}function Ia(e,t,o){return qe=e.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Dn(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:t,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{}})}).then(async n=>{if(n.status===423){M=!0,Se=!0,we(e),Ge(z,!0),U(e),V(e.document,v(e,"code_dock_locked"));return}if(!n.ok)throw new Error(String(n.status));w===t&&(z=o,V(e.document,v(e,"code_dock_saved")),he(e),e.setTimeout(()=>{const s=e.document.getElementById(d)?.querySelector("[data-sve-code-status]");s&&s.textContent===v(e,"code_dock_saved")&&(s.textContent="")},1800)),ns(e),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}).catch(()=>{V(e.document,v(e,"code_dock_error"))}).finally(()=>{qe=null}),qe}function ie(e){Q&&(clearTimeout(Q),Q=null);const t=w,o=b,n=h.html;if(!n||n.state.readOnly||!t||!o)return;const s=St(),r=dt!==null&&Vo(o)&&ss(s.html)===ut;co(s,z)&&!(r&&ft)||(r&&(s.tw=dt,ft=!1),V(e,v(o,"code_dock_saving")),Ia(o,t,s))}function ss(e){return wr(e).sort().join(" ")}function rs(){dt=null,ut="",ft=!1}function ho(e,t){if(!e||!Vo(e))return;const o=ss(t);o===ut||nt||(nt=!0,J(()=>import("./tw-compile-5aQxGpeR.js"),__vite__mapDeps([8,9,10,11,12,13,6,0,1,7,4,3,5,2]),import.meta.url).then(n=>n.compileTailwind(e,t)).then(n=>{nt=!1,dt=n,ut=o,ft=!0,is(e,e.document),ho(e,St().html)}).catch(n=>{nt=!1,console.error("[sve] tailwind compile",n)}))}function is(e,t){Q&&clearTimeout(Q),Q=e.setTimeout(()=>{Q=null,ie(t)},ci)}function le(e){if(N)return;const t=St();if(co(t,z)){he(e);return}if(he(e),ho(e,t.html),!lo(e)){V(e.document,v(e,"code_dock_unsaved"));return}V(e.document,v(e,"code_dock_saving")),is(e,e.document)}let be=null,Ve=null;function Oa(){return be||(be=Qr({Decoration:Gt,StateField:Xt,StateEffect:Yt,RangeSetBuilder:Zt,EditorView:ne})),be}function Ha(){return Ve||(Ve=ni({Decoration:Gt,StateField:Xt,StateEffect:Yt,RangeSetBuilder:Zt,EditorView:ne})),Ve}function Da(e,t,o){h[t]?.destroy();const n=Ot.of([{key:"Mod-s",run:()=>(ie(e.document),!0)}]);h[t]=new ne({state:lt.create({doc:"",extensions:[rn(),an(),ln(),fn(),_i(t),hn(),pn({tooltipClass:()=>"sve-tw-complete"}),...t==="html"?[xn.data.of({autocomplete:Ts(e)}),Ms(yn,e)]:[],...t==="html"?[...Ds(),Ps()]:[],Ot.of([...cn,...t==="html"?[{key:"Tab",run:Rs}]:[],dn,...un,...gn,...mn]),n,ne.lineWrapping,...t==="html"||t==="css"?Oa().extensions:[],...t==="html"?Ha().extensions:[],Ne[t].of(lt.readOnly.of(!!M)),Fe[t].of(ne.editable.of(!M)),ne.updateListener.of(s=>{t==="html"&&s.docChanged&&!N&&(Fi(),Ft("dock:html-changed")),t==="css"&&s.docChanged&&!N&&Vi(),s.docChanged&&le(e),t==="css"&&(s.docChanged||s.selectionSet)&&G(e),t==="html"&&(s.docChanged||s.selectionSet)&&(Et(e),fo(e))}),...ki()]}),parent:o})}function Pa(e){if(!e||e.querySelector(".cm-editor"))return;e.replaceChildren();const t=e.ownerDocument.createElement("span");t.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",e.appendChild(t)}let rt=null;async function Ra(e){const t=e.document;Ti(t);let o=t.getElementById(d);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-subrow]")&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-7")){for(const s of q)h[s]?.destroy(),h[s]=null;o.remove(),o=null}if(!o){o=t.createElement("div"),o.id=d,o.setAttribute("data-sve-code-chrome","scope-7"),ye(o,sr,{htmlLabel:v(e,"code_dock_html"),cssLabel:v(e,"code_dock_css"),jsLabel:v(e,"code_dock_js"),treeIcon:Bn}),Rt(t,o),Bo(o),zn(o,Pn(e)),Di(e,o),Ri(e,o),Pi(e,o),Aa(e,o),ma(e,o),Sa(e,o),xa(e,o),Ea(e,o),Io(e,o),Oo(e,o),Lo(e,o),Ho(e,o);for(const n of q){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);Pa(s)}_.openHtmlTreePanel?.(e)}if(Rt(t,o),Bo(o),Io(e,o),Oo(e,o),Lo(e,o),Ho(e,o),Ii(e),eo(e),we(e),U(e),Ke(e),he(e),po(e),await ai(),!h.html){for(const n of q){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),Da(e,n,s)}for(const n of["html","css"])h[n]&&ei(e,h[n],{onOpen:s=>qi(e,s),emptyLabel:v(e,"code_dock_partials_empty"),sectionValues:()=>ji(e),isLocked:()=>Ce(),setHover:(s,r)=>be?.setHover(s,r)});ii(e,h.html,{onRename:n=>Ui(e,n),isLocked:()=>Ce(),setHover:(n,s)=>Ve?.setHover(n,s),title:v(e,"code_dock_css_rename_class")})}return o}function as(e){return rt||(rt=Ra(e).finally(()=>{rt=null})),rt}async function jo(e,t){const o=await as(e);w=t,M=!0,Se=!0,z={html:"",css:"",js:""},ao(),we(e),Ge(z,!0),Vn(e.document,t),V(e.document,v(e,"code_dock_missing")),U(e),Ke(e),he(e),Ue(e,o)}async function wt(e,t,o="replace"){o==="replace"?fe=[]:o==="push"&&w&&w!==t&&fe.push(w);const n=++De;w=t,Se=!1,ao(),V(e.document,v(e,"code_dock_loading"));const s=await as(e);we(e),U(e),Ke(e),he(e),po(e),Ue(e,s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(t)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async r=>{if(n!==De)return;if(r.status===404){jo(e,t);return}if(!r.ok)throw new Error(String(r.status));const i=await r.json();n===De&&(z={html:typeof i.html=="string"?i.html:"",css:typeof i.css=="string"?i.css:"",js:typeof i.js=="string"?i.js:""},w=t,M=!!i.locked,Se=!0,rs(),we(e),Ge(z,M),M||ho(e,z.html),Vn(e.document,i.path||t),V(e.document,M?v(e,"code_dock_locked"):""),U(e),Ke(e),he(e),Ue(e,s))}).catch(()=>{n===De&&(jo(e,t),V(e.document,v(e,"code_dock_error")))})}function mo(){return w||""}function ls(e){return!!e?.getElementById(d)}function Ce(){return M}function cs(e,t){const o=typeof t?.html=="string"?t.html.trim():"",n=typeof t?.css=="string"?t.css.trim():"",s=typeof t?.js=="string"?t.js.trim():"";if(!o&&!n&&!s||!e?.document?.getElementById(d))return!1;let r=!1;return o&&(r=ja("html",o)||r),n&&(r=qo("css",n)||r),s&&(r=qo("js",s)||r),r&&le(e),r}function ja(e,t){const o=h[e];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,c=`${s===`
`?"":`
`}${t}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}}),!0}function qo(e,t){const o=h[e];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${t}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function ds(e){if(ns(e),!w||!e.document.getElementById(d))return;const t=w;w=null,wt(e,t,"keep")}function us(e){De+=1,ie(e),_e=null,w=null,fe=[],z={html:"",css:"",js:""},M=!1,Se=!1,F=null,ge=null,ao(),b=e?.defaultView||b,A(e),ee(e),se(e),e?.getElementById(K)?.remove();for(const o of q)h[o]?.destroy(),h[o]=null;e?.getElementById(d)?.remove(),Li(),e&&to(e,0);const t=e?.defaultView||b;t?.document.getElementById(_.HTML_TREE_PANEL_ID)&&_.closeHtmlTreePanel?.(t)}function fs(e){if(We)return;const t=e.document.getElementById(d);t&&(eo(e),Ue(e,t))}function qa(e,t,o){if(o){const r=xo(o,t)||xo(o,e.document)||o;return String(typeof _.setTypeForUid=="function"&&(_.setTypeForUid(r,t)||_.setTypeForUid(r,e.document))||"").trim()}const n=typeof _.sectionField=="function"?_.sectionField(e):"page_sections",s=typeof _.activeContainers=="function"?_.activeContainers(e.document):[];for(const r of s){const a=(_.unwrapRef?.(r.values)||r.values)?.[n];if(Array.isArray(a))for(const c of a){const l=typeof c?.type=="string"?c.type.trim():"";if(l)return l}}return""}function za(e){if((e.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=e.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(e.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof _.activeContainers=="function"?_.activeContainers(e.document):[];for(const r of s){const i=_.unwrapRef?.(r.values)||r.values,a=typeof i?.view=="string"?i.view.trim():"";if(!a||a.includes(".."))continue;const c=a.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(c)return`view:${c}`}return""}function Na(e,t){const o=_.chromeInlineKind||_.activeChromeKind;if(o!=="header"&&o!=="footer"||!_.chromeHost?.(t)&&!_.chromeEditorOpen?.(t))return"";const s=(_.unwrapRef?.(_.chromeContainer?.()?.values)||{})[o==="footer"?"footer_style":"header_style"]||"style_1";return`${o}/${s}`}function Fa(e){const t=_.globalSectionHost?.(e)||e.getElementById("__sve-global-section-host");return t&&t.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function ps(e,t,o){if(We)return;if(!e||!t||$i(t)||!zo(e)||!No(e)){t&&us(t);return}const n=Na(e,t)||Fa(t)||qa(e,t,o)||za(e)||(o?"":w),s=!!(o&&o!==_e);if(b=e,o&&(_e=o),!!n&&!(n===w&&t.getElementById(d))){if(fe.length&&w&&w!==n){const r=fe[0];if(n===r&&!s)return;fe=[]}ie(t),wt(e,n,"replace")}}As("tw:changed",()=>{b&&D==="tw"&&G(b)});ae("dock:is-open",e=>ls(e));ae("dock:is-locked",()=>Ce());ae("dock:html",()=>Ze());ae("dock:reveal-html",({from:e,to:t}={})=>{const o=h.html;if(!o||e==null)return;H=Ye(b),xt(),Le();const n=E.length,s=Math.max(0,Math.min(e,n)),r=Math.max(s,Math.min(t??e,n));if(x=r>s?{from:s,to:r}:null,H&&x){ro(),U(b);return}if(B){io(),U(b);return}o.dispatch({selection:{anchor:s,head:r},scrollIntoView:!0}),o.focus()});ae("dock:insert-snippet",({win:e,parts:t})=>cs(e,t));ae("dock:refresh",e=>ds(e));ae("dock:current-type",()=>mo());ae("dock:current-uid",()=>_e);ae("dock:set-html",e=>{if(typeof e!="string"||Ce())return!1;const t=h.html;if(!t||!b)return!1;if(E=e,B)return kt(Kn()),le(b),Ft("dock:html-changed"),!0;const o=t.state.doc.toString();return o!==e&&t.dispatch({changes:{from:0,to:o.length,insert:e}}),!0});_.syncCodeDock=ps;const Xa=Object.freeze(Object.defineProperty({__proto__:null,ARMED_KEY:Es,closeCodeDock:us,closeCodeDockPopups:la,codeDockStyleMode:ba,currentTemplateType:mo,insertAiSnippet:cs,isCodeDockArmed:No,isCodeDockLocked:Ce,isCodeDockOpen:ls,refreshCodeDockFromDisk:ds,relayoutCodeDock:fs,resetTailwindCompile:rs,setCodeDockArmed:ws,syncCodeDock:ps,templateDockAllowed:zo},Symbol.toStringTag,{value:"Module"}));export{wr as a,Xa as c,Ka as t};
