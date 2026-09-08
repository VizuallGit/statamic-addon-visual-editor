const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-Dpuj8sxX.js","./index-B5fiB6ig.js","./index-eMi007Cw.js","./index-zsjA895l.js","./index-BsAZfAgM.js","./index-D2YMCfE7.js","./html-tag-sync-BlP2Mk13.js","./index-BatCsQTe.js"])))=>i.map(i=>d[i]);
import{o as $,c as C,a as h,t as X,F as D,e as re,f as q,I as Xn,d as At,n as Yn,Q as lo,T as Gn,a2 as Zn,K as Jn,w as co,L as Qn,s as _,a3 as es,a4 as ts,a5 as uo,a6 as os,a7 as fo,a8 as Te,a9 as Pt,i as xe,aa as po,A as Ce,J as Q,l as Ue,ab as ns,$ as ss,a0 as rs,N as is,O as ae}from"./addon-BpmiUmJ-.js";import{ac as Da,ad as Pa}from"./addon-BpmiUmJ-.js";import{p as as,t as ls,a as cs,c as Et,b as ds,d as us,e as ho,g as fs,h as Oo,j as ps}from"./tw-classes-i4MfOf_5.js";import{h as hs,a as ms,e as vs,A as gs,b as xs,c as ys,d as ot,i as Ho}from"./html-tag-sync-BlP2Mk13.js";import"./html-pick-align-gkRPeJkt.js";import"./index-Dpuj8sxX.js";import"./index-B5fiB6ig.js";import"./index-BatCsQTe.js";import"./index-BsAZfAgM.js";import"./index-zsjA895l.js";import"./index-D2YMCfE7.js";import"./index-eMi007Cw.js";const bs={class:"sve-code-dock"},ks={"data-sve-code-bar":""},_s={type:"button","data-sve-code-pane-btn":"html"},Ss={type:"button","data-sve-code-pane-btn":"css"},$s={type:"button","data-sve-code-pane-btn":"js"},Cs={type:"button","data-sve-html-scope":"","aria-pressed":"true"},As=["innerHTML"],Es={"data-sve-code-panes":""},Ts={"data-sve-code-pane":"html"},ws={"data-sve-code-pane-label":""},Ms={"data-sve-code-pane":"css"},Bs={"data-sve-css-chrome":"subrow-2"},Ls={"data-sve-code-pane-label":""},Is={"data-sve-css-label":""},Os={"data-sve-code-pane":"js"},Hs={"data-sve-code-pane-label":""},Ds={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},treeIcon:{type:String,required:!0}},setup(e){return(t,o)=>($(),C("div",bs,[o[19]||(o[19]=h("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),h("div",ks,[h("button",_s,X(e.htmlLabel),1),h("button",Ss,X(e.cssLabel),1),h("button",$s,X(e.jsLabel),1),o[0]||(o[0]=h("button",{type:"button","data-sve-code-back":"",hidden:""},null,-1)),o[1]||(o[1]=h("span",{"data-sve-code-path":""},null,-1)),o[2]||(o[2]=h("span",{"data-sve-code-status":""},null,-1)),o[3]||(o[3]=h("button",{type:"button","data-sve-style-mode":""},null,-1)),h("button",Cs,[h("span",{innerHTML:e.treeIcon},null,8,As)]),o[4]||(o[4]=h("button",{type:"button","data-sve-code-autosave":"","aria-pressed":"true"},null,-1)),o[5]||(o[5]=h("button",{type:"button","data-sve-code-save":"",hidden:""},null,-1)),o[6]||(o[6]=h("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[20]||(o[20]=h("div",{"data-sve-code-lock-banner":""},null,-1)),h("div",Es,[h("div",Ts,[h("div",ws,[h("span",null,X(e.htmlLabel),1),o[7]||(o[7]=h("div",{"data-sve-html-tools":""},null,-1)),o[8]||(o[8]=h("div",{"data-sve-visual-edit-tools":""},null,-1)),o[9]||(o[9]=h("div",{"data-sve-antlers-tools":""},null,-1))]),o[10]||(o[10]=h("div",{"data-sve-code-host":""},null,-1))]),o[17]||(o[17]=h("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),h("div",Ms,[h("div",Bs,[h("div",Ls,[h("span",Is,X(e.cssLabel),1),o[11]||(o[11]=h("button",{type:"button","data-sve-css-add-class":""},null,-1)),o[12]||(o[12]=h("div",{"data-sve-css-tools":""},null,-1))]),o[13]||(o[13]=h("div",{"data-sve-css-subrow":""},[h("div",{"data-sve-css-sub":"box"}),h("div",{"data-sve-css-sub":"display"})],-1))]),o[14]||(o[14]=h("div",{"data-sve-code-host":""},null,-1)),o[15]||(o[15]=h("div",{"data-sve-tw-host":""},null,-1))]),o[18]||(o[18]=h("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),h("div",Os,[h("div",Hs,[h("span",null,X(e.jsLabel),1)]),o[16]||(o[16]=h("div",{"data-sve-code-host":""},null,-1))])])]))}},Ps=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],qs=["innerHTML"],Rs={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>($(!0),C(D,null,re(e.tools,n=>($(),C("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:q(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:q(s=>e.onTool(n.id),["prevent"])},[n.letter?($(),C(D,{key:0},[Xn(X(n.letter),1)],64)):($(),C("span",{key:1,innerHTML:n.icon},null,8,qs))],40,Ps))),128))}},js=["aria-label"],zs={value:""},Ns=["label"],Fs=["value"],Do={__name:"CodeDockAntlersSelect",props:{label:{type:String,required:!0},groups:{type:Array,required:!0},onPick:{type:Function,required:!0}},setup(e){const t=e;function o(n){const s=n.target.value;n.target.value="",s&&t.onPick(s)}return(n,s)=>($(),C("select",{"data-sve-antlers-select":"","aria-label":e.label,onChange:o},[h("option",zs,X(e.label),1),($(!0),C(D,null,re(e.groups,r=>($(),C("optgroup",{key:r.id,label:r.label},[($(!0),C(D,null,re(r.items,i=>($(),C("option",{key:i.id,value:i.id},X(i.label),9,Fs))),128))],8,Ns))),128))],40,js))}},Vs=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Ws={__name:"CodeDockCssTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>($(!0),C(D,null,re(e.tools,n=>($(),C("button",{key:n.id,type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:q(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:q(s=>e.onTool(n.id),["prevent"])},null,40,Vs))),128))}},Us={key:0,"data-sve-css-sep":"","aria-hidden":"true"},Ks=["data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick"],Xs={__name:"CodeDockCssBoxRow",props:{sides:{type:Array,required:!0},onSide:{type:Function,required:!0}},setup(e){return(t,o)=>($(!0),C(D,null,re(e.sides,n=>($(),C(D,{key:n.id},[n.sep?($(),C("span",Us)):At("",!0),h("button",{type:"button","data-sve-css-box-side":n.suffix,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:q(s=>e.onSide(n.suffix),["prevent","stop"])},null,8,Ks)],64))),128))}},Ys={key:0,"data-sve-css-sep":"","aria-hidden":"true"},Gs=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Zs={"data-sve-css-flex-extras":""},Js={key:0,"data-sve-css-sep":"","aria-hidden":"true"},Qs=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],er={__name:"CodeDockCssDisplayRow",props:{items:{type:Array,required:!0},extras:{type:Array,default:()=>[]},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>($(),C(D,null,[($(!0),C(D,null,re(e.items,n=>($(),C(D,{key:n.id},[n.sep?($(),C("span",Ys)):At("",!0),h("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:q(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:q(s=>e.onTool(n.id),["prevent"])},null,40,Gs)],64))),128)),h("div",Zs,[($(!0),C(D,null,re(e.extras,n=>($(),C(D,{key:n.id},[n.sep?($(),C("span",Js)):At("",!0),h("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:q(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:q(s=>e.onTool(n.id),["prevent"])},null,40,Qs)],64))),128))])],64))}},tr={key:0,"data-sve-css-swatches":""},or=["data-sve-css-token","title","data-active","onClick"],nr=["data-sve-css-token","data-active","onClick"],qt={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(e){return(t,o)=>e.kind==="colors"?($(),C("div",tr,[h("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=q((...n)=>e.onClear&&e.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[h("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[h("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),($(!0),C(D,null,re(e.swatches,n=>($(),C("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:Yn({background:n.hex||"transparent"}),onClick:q(s=>e.onPick(n.name),["prevent","stop"])},null,12,or))),128))])):($(!0),C(D,{key:1},re(e.choices,n=>($(),C("button",{key:n.value,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:q(s=>e.onPick(n.value),["prevent","stop"])},X(n.label),9,nr))),128))}},sr={"data-sve-css-add-label":""},rr=["placeholder","onKeydown"],Po={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0}},setup(e){const t=e,o=lo(t.initial||""),n=lo(null);Gn(()=>Zn(()=>{n.value?.focus(),n.value?.select()}));function s(){const r=o.value.trim();if(!r){n.value?.focus();return}t.onAdd(r)}return(r,i)=>($(),C(D,null,[h("label",sr,X(e.label),1),Jn(h("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":i[0]||(i[0]=a=>o.value=a),type:"text",placeholder:e.placeholder,onKeydown:[co(q(s,["prevent"]),["enter"]),i[1]||(i[1]=co(q(()=>{},["stop"]),["escape"]))]},null,40,rr),[[Qn,o.value]])],64))}},qo=/^\.[a-zA-Z_][\w-]*$/;function Ro(e){const t=String(e||"").match(/\[\s*([\s\S]*?)\s*\]/);return t?t[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).filter(o=>/^[a-zA-Z_][\w-]*$/.test(o)):[]}function ir(e){const t=String(e||"").match(/\sclass\s*=\s*(["'])([^"']*)\1/i);return t?Ro(t[2]):[]}function ct(e){const t=String(e||""),o=[],n=/\sclass\s*=\s*(["'])/gi;let s;for(;s=n.exec(t);){const r=s[1],i=s.index+s[0].length,a=t.indexOf(r,i);if(a===-1)break;const l=t.slice(i,a).match(/\[([\s\S]*?)\]/);if(l){const u=l[1],f=i+l.index+1,p=u.replace(/\{\{[\s\S]*?\}\}/g,x=>" ".repeat(x.length)),v=/[a-zA-Z_][\w-]*/g;let k;for(;k=v.exec(p);)o.push({name:k[0],from:f+k.index,to:f+k.index+k[0].length})}n.lastIndex=a+1}return o}function mo(e,t){return ct(e).find(o=>t>=o.from&&t<=o.to)||null}function vo(e,t){const o=String(e||""),n=ct(o);let s=o;for(let r=n.length-1;r>=0;r-=1){const i=n[r],a=t(i.name);if(a!==i.name){if(!a){let c=i.from,l=i.to;s[l]===" "?l+=1:c>0&&s[c-1]===" "&&(c-=1),s=s.slice(0,c)+s.slice(l);continue}s=s.slice(0,i.from)+a+s.slice(i.to)}}return s}function jo(e){const t=[],o=/(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;let n;for(;n=o.exec(String(e||""));)t.push(n[2]);return t}function zo(e,t){const o=[],n=[],s=[];let r=0,i=0;for(;r<e.length&&i<t.length;){if(e[r]===t[i]){r+=1,i+=1;continue}const a=t.indexOf(e[r],i),c=e.indexOf(t[i],r);a===-1&&c===-1?(o.push({from:e[r],to:t[i]}),r+=1,i+=1):a===-1?(s.push(e[r]),r+=1):c===-1||a<=c?(n.push(t[i]),i+=1):(s.push(e[r]),r+=1)}for(;r<e.length;)s.push(e[r]),r+=1;for(;i<t.length;)n.push(t[i]),i+=1;return{renamed:o,added:n,removed:s}}function ke(e){let t=String(e||"").trim().replace(/^\.+/,"").replace(/\s+/g,"-").replace(/[^a-zA-Z0-9_-]/g,"");return/^[a-zA-Z_]/.test(t)||(t=t.replace(/^[^a-zA-Z_]+/,"")),qo.test(`.${t}`)?t:""}function ar(e,t){const o=String(e||""),n=ke(t);if(!o||!n)return o;const s=o.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(s){const r=s[1];let i=s[2];const a=[...i.matchAll(/\[([\s\S]*?)\]/g)];if(a.length){const c=a.map(v=>v[1].trim()).filter(Boolean).join(" "),u=Ro(`[ ${c} ]`).includes(n)?c:`${c} ${n}`.trim(),f=i.indexOf("["),p=i.lastIndexOf("]");i=`${i.slice(0,f)}[ ${u} ]${i.slice(p+1)}`.replace(/\s+/g," ").trim()}else i=`[ ${n} ] ${i}`.replace(/\s+/g," ").trim();return o.slice(0,s.index)+` class=${r}${i}${r}`+o.slice(s.index+s[0].length)}return/\/\s*>$/.test(o)?o.replace(/(\s*)(\/\s*>)$/,` class="[ ${n} ]"$1$2`):o.replace(/(\s*)>$/,` class="[ ${n} ]"$1>`)}function lr(e,t){const o=String(e).indexOf(">",t.from);return o===-1?"":e.slice(t.from,o+1)}function No(e,t){const o=[];for(const n of t){const s=ir(lr(e,n)),r=No(e,n.children||[]);if(s.length){o.push({className:s[0],children:r});for(const i of s.slice(1))o.push({className:i,children:[]})}else o.push(...r)}return o}function dt(e){return No(e,as(e))}function nt(e){return String(e).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Rt(e,t){if(e.startsWith("/*",t)){const o=e.indexOf("*/",t+2);return o===-1?e.length:o+2}return t}function jt(e,t){let o=0;for(let n=t;n<e.length;n+=1){if(e.startsWith("/*",n)){n=Rt(e,n)-1;continue}if(e[n]==="{")o+=1;else if(e[n]==="}"&&(o-=1,o===0))return n}return-1}function Y(e,t){const o=String(e||""),n=new RegExp(`(^|[^\\w-])\\.${nt(t)}\\s*\\{`,"g");let s;for(;s=n.exec(o);){const r=s.index+s[1].length,i=o.indexOf("{",r);if(i===-1)continue;const a=jt(o,i);if(a!==-1)return{from:r,brace:i,close:a,to:a+1,name:t}}return null}function cr(e){const t=String(e||""),o=[],n={},s=[];let r=0,i="";const a=()=>{const c=i.trim();c&&o.push(c),i=""};for(;r<t.length;){if(t.startsWith("/*",r)){const c=Rt(t,r);i+=t.slice(r,c),r=c;continue}if(t[r]==="{"){const c=i.trim(),l=jt(t,r);if(l===-1)break;const u=t.slice(r+1,l);i="",qo.test(c)?n[c.slice(1)]=u:c&&s.push(`${c} {${u}}`),r=l+1;continue}i+=t[r],r+=1}return a(),{decls:o.join(`
`),classes:n,other:s}}function go(e,t){const o="    ".repeat(t);return String(e||"").split(`
`).map(n=>n.trim()?o+n.trim():"").filter((n,s,r)=>n||s>0&&s<r.length-1).join(`
`)}function dr(e,t){const o=Y(e,t);return o?String(e).slice(o.brace+1,o.close):""}function Fo(e,t,o){const n=cr(dr(t,e.className)),s="    ".repeat(o),r=[];n.decls&&r.push(go(n.decls.replace(/;+\s*$/,";"),o+1));for(const a of n.other)r.push(go(a,o+1));for(const a of e.children)r.push(Fo(a,t,o+1));const i=r.filter(Boolean).join(`
`);return i?`${s}.${e.className} {
${i}
${s}}`:`${s}.${e.className} {
${s}}`}function zt(e,t){return t?.length?t.map(o=>Fo(o,e,0)).join(`

`)+`
`:""}function Vo(e){const t=String(e||"").match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);return t?t[1]:""}function ur(e){const t=[],o=/\.([a-zA-Z_][\w-]*)\s*\{/g;let n,s=!0;for(;n=o.exec(String(e||""));){if(s){s=!1;continue}t.push(n[1])}return t}function fr(e,t){const o=String(e).lastIndexOf(`
`,t-1)+1,n=e.slice(o,t);return/^\s*$/.test(n)?n:""}function pr(e,t){return t?e.split(`
`).map((o,n)=>n===0||!o?o:t+o).join(`
`):e}function hr(e,t){let o=0;for(let n=0;n<t.from;n+=1){if(e.startsWith("/*",n)){n=Rt(e,n)-1;continue}e[n]==="{"?o+=1:e[n]==="}"&&(o-=1)}return o===0}function Nt(e,t,o){const n=Vo(t)||o;if(!n)return String(e||"");let s=String(t||"").trim();s?new RegExp(`^\\.${nt(n)}\\s*\\{`).test(s)||(s=`.${n} {
${s}
}`):s=`.${n} {
}`;let r=String(e||"");const i=Y(r,n),a=ur(s);if(i){const l=fr(r,i.from);r=r.slice(0,i.from)+pr(s,l)+r.slice(i.to)}else r=`${r.trimEnd()}${r.trim()?`
`:""}${s}
`;const c=Y(r,n);if(!c)return r;for(const l of[...new Set(a)].reverse()){const u=new RegExp(`(^|[^\\w-])\\.${nt(l)}\\s*\\{`,"g"),f=[];let p;for(;p=u.exec(r);){const v=p.index+p[1].length,k=r.indexOf("{",v),x=jt(r,k);x!==-1&&f.push({from:v,to:x+1})}for(const v of f.reverse()){if(v.from>=c.from&&v.to<=c.to||!hr(r,v))continue;let k=v.from;const x=r.lastIndexOf(`
`,k-1)+1;/^\s*$/.test(r.slice(x,k))&&(k=x);let I=v.to;r[I]===`
`&&(I+=1),r=r.slice(0,k)+r.slice(I)}}return r}function St(e,t){const o=String(e||"");return`${o.trimEnd()}${o.trim()?`
`:""}.${t} {
}
`}function mr(e,t,o){const n=ke(o);return!t||!n||t===n?String(e||""):Y(e,n)?Wo(e,t):String(e||"").replace(new RegExp(`(^|[^\\w-])\\.${nt(t)}(\\s*\\{)`,"g"),`$1.${n}$2`)}function Wo(e,t){let o=String(e||"");for(;;){const n=Y(o,t);if(!n)break;let s=n.from;const r=o.lastIndexOf(`
`,s-1)+1;/^\s*$/.test(o.slice(r,s))&&(s=r);let i=n.to;o[i]===`
`&&(i+=1),o=o.slice(0,s)+o.slice(i)}return o}function vr(e,t,o){const n=Array.isArray(t)?t:[],s=Array.isArray(o)?o:[],{renamed:r,added:i}=zo(n,s),a=new Set(s);let c=String(e||"");for(const l of r){const u=ke(l.to);if(u){if(a.has(l.from)){Y(c,u)||(c=St(c,u));continue}Y(c,l.from)?c=mr(c,l.from,u):Y(c,u)||(c=St(c,u))}}for(const l of i){const u=ke(l);!u||Y(c,u)||(c=St(c,u))}return c}function gr(e,t,o){const n=new Set(Array.isArray(t)?t:[]),s=new Set(Array.isArray(o)?o:[]);let r=String(e||"");for(const i of s)n.has(i)||(r=Wo(r,i));return r}const Ze="visual_edit",xr=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],Uo=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function yr(e){return Uo.find(t=>t.id===e)||null}function br(e,t,o,n){let s=t;for(;s<o;){const r=e.indexOf("{{",s);if(r===-1||r>=o)return null;const i=e.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const a=e.slice(r+2,i);if((a.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:a};s=i+2}return null}function kr(e,t){const o=String(t).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(e)}const de="__sve-partial-menu",_r=/\{\{#([\s\S]*?)#\}\}/g,xo=/\{\{\s*partial(?::([^\s}]+)|(?=[\s}]))([\s\S]*?)\}\}/gi,$t=new Map;function Ko(e){const t=String(e||"").replace(_r,s=>" ".repeat(s.length)),o=[];xo.lastIndex=0;let n;for(;n=xo.exec(t);){const s=(n[1]||"").trim(),i=(n[2]||"").match(/\bsrc\s*=\s*(["'])([^"']+)\1/i),a=s||(i?i[2].trim():"");!a||a.includes("..")||o.push({from:n.index,to:n.index+n[0].length,src:a})}return o}function yo(e,t){return Ko(e).find(o=>t>=o.from&&t<=o.to)||null}const Sr=new Set(["if","elseif","else","unless","foreach","forelse","noparse","once","cache","nocache","section","yield","partial","slot","switch","case","vite","sve_html","sve_css","sve_js","sve_tw","style_push","script_push"]);function $r(e,t){const o=[],n=/\{\{\s*(\/?)([A-Za-z_][A-Za-z0-9_]*)\b[\s\S]*?\}\}/g;let s;for(;s=n.exec(String(e||""));){const i=s[2];if(!Sr.has(i.toLowerCase())){if(!s[1]){o.push({name:i,from:s.index,to:null});continue}for(let a=o.length-1;a>=0;a-=1)if(o[a].name===i&&o[a].to==null){o[a].to=s.index+s[0].length;break}}}let r=null;for(const i of o)i.to==null||t<i.from||t>i.to||(!r||i.to-i.from<r.to-r.from)&&(r=i);return r?.name||null}function Cr(e,t){const o=new Set,n=s=>{if(Array.isArray(s)){if(!t){for(const r of s)r&&typeof r=="object"&&typeof r.type=="string"&&r.type&&o.add(r.type),n(r);return}s.forEach(n);return}if(!(!s||typeof s!="object")){if(t&&Array.isArray(s[t]))for(const r of s[t])r&&typeof r=="object"&&typeof r.type=="string"&&r.type&&o.add(r.type);Object.values(s).forEach(n)}};return n(e),o}function Ar(e,t,o,n){if(!e.src.includes("{")||!n)return t;const s=$r(o,e.from),r=Cr(n,s);return s?t.filter(i=>r.has(i.label)):r.size===0?t:t.filter(i=>r.has(i.label))}function Er(e,t){if($t.has(t))return $t.get(t);const o=e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>Array.isArray(n.items)?n.items:[]).catch(()=>[]);return $t.set(t,o),o}let De=null;function bo(e){e.clearTimeout(De),De=null}function Tr(e,t){De||(De=e.setTimeout(()=>{De=null,t?.()},180))}function ee(e){e?.getElementById(de)?.remove()}function wr(e,t,o,n,{onOpen:s,emptyLabel:r,onStay:i,onLeave:a}){const c=e.document;ee(c);const l=c.createElement("div");if(l.id=de,l.style.left=`${Math.max(8,Math.round(o))}px`,l.style.top=`${Math.max(8,Math.round(n))}px`,t.length)t.forEach(k=>{const x=c.createElement("button");x.type="button",x.setAttribute("data-sve-partial-choice",""),x.textContent=k.label,x.title=k.path||k.type,x.addEventListener("click",I=>{I.preventDefault(),I.stopPropagation(),ee(c),s?.(k.type)}),l.appendChild(x)});else{const k=c.createElement("div");k.setAttribute("data-sve-partial-empty",""),k.textContent=r||"",l.appendChild(k)}c.body.appendChild(l);const u=l.getBoundingClientRect(),f=8;let p=u.left,v=u.top;u.right>e.innerWidth-f&&(p=Math.max(f,e.innerWidth-u.width-f)),u.bottom>e.innerHeight-f&&(v=Math.max(f,e.innerHeight-u.height-f)),l.style.left=`${Math.round(p)}px`,l.style.top=`${Math.round(v)}px`,l.addEventListener("mouseenter",()=>i?.()),l.addEventListener("mouseleave",()=>a?.())}function Mr(e){const t=e.Decoration.mark({class:"sve-cm-partial"}),o=e.Decoration.line({class:"sve-cm-partial-line"}),n=e.StateEffect.define(),s=e.StateField.define({create(i){return ko(i,e,t)},update(i,a){return a.docChanged?ko(a.state,e,t):i},provide:i=>e.EditorView.decorations.from(i)}),r=e.StateField.define({create(){return e.Decoration.none},update(i,a){let c;for(const p of a.effects)p.is(n)&&(c=p.value);if(c===void 0)return a.docChanged?e.Decoration.none:i;if(!c)return e.Decoration.none;const l=new e.RangeSetBuilder,u=a.state.doc.lineAt(c.from),f=a.state.doc.lineAt(c.to);for(let p=u.number;p<=f.number;p+=1){const v=a.state.doc.line(p);l.add(v.from,v.from,o)}return l.finish()},provide:i=>e.EditorView.decorations.from(i)});return{extensions:[s,r],setHover(i,a){i&&i.dispatch({effects:n.of(a)})}}}function ko(e,t,o){const n=new t.RangeSetBuilder;for(const s of Ko(e.doc.toString()))n.add(s.from,s.to,o);return n.finish()}function Br(e,t,{onOpen:o,emptyLabel:n,sectionValues:s,isLocked:r,setHover:i}){if(!t?.dom||t.dom._svePartialBound)return;t.dom._svePartialBound=!0;let a=null,c="",l="";const u=()=>{bo(e),e.clearTimeout(a),a=null,l="",c="",i?.(t,null),ee(e.document)},f={stay:()=>bo(e),leave:()=>Tr(e,u)},p=()=>{e.clearTimeout(a),a=null,l="",i?.(t,null)},v=()=>!!r?.(),k=(x,I,O,{click:le}={})=>{if(v()){ee(e.document),i?.(t,null);return}c=x.src,Er(e,x.src).then(Be=>{if(c!==x.src)return;const Kn=t.state.doc.toString(),Ge=Ar(x,Be,Kn,s?.()||null);if(Ge.length===1){le&&(ee(e.document),o?.(Ge[0].type));return}!Ge.length&&!le||wr(e,Ge,I,O,{onOpen:o,emptyLabel:n,onStay:f.stay,onLeave:f.leave})})};t.dom.addEventListener("mousemove",x=>{if(v()){u();return}const I=t.posAtCoords({x:x.clientX,y:x.clientY});if(I==null)return;const O=yo(t.state.doc.toString(),I);if(!O){e.clearTimeout(a),a=null,l="",f.leave();return}f.stay(),i?.(t,{from:O.from,to:O.to}),!(l===O.src&&a)&&(p(),l=O.src,a=e.setTimeout(()=>{const le=t.coordsAtPos(O.from);k(O,le?.left??x.clientX,(le?.bottom??x.clientY)+6)},280))}),t.dom.addEventListener("mouseleave",x=>{if(x.relatedTarget?.closest?.(`#${de}`)){f.stay();return}f.leave()}),t.dom.addEventListener("click",x=>{if(v()){ee(e.document);return}const I=t.posAtCoords({x:x.clientX,y:x.clientY});if(I==null)return;const O=yo(t.state.doc.toString(),I);O&&(p(),k(O,x.clientX,x.clientY+8,{click:!0}))}),Lr(e.document)||(e.document.addEventListener("mousedown",x=>{x.target.closest(`#${de}, .sve-cm-partial`)||ee(e.document)}),e.document._svePartialDismiss=!0)}function Lr(e){return!!e._svePartialDismiss}const te="__sve-css-rename-chip",Ir='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function Or(e){const t=e.Decoration.mark({class:"sve-cm-css-token"}),o=e.StateEffect.define();return{extensions:[e.StateField.define({create(){return e.Decoration.none},update(s,r){let i;for(const c of r.effects)c.is(o)&&(i=c.value);if(i===void 0)return r.docChanged?e.Decoration.none:s;if(!i)return e.Decoration.none;const a=new e.RangeSetBuilder;return a.add(i.from,i.to,t),a.finish()},provide:s=>e.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function se(e){e?.getElementById(te)?.remove()}function Hr(e,t,o,n){t.style.left=`${Math.max(6,Math.min(o,e.innerWidth-28))}px`,t.style.top=`${Math.max(6,n)}px`}function Dr(e,t,o,{onRename:n,title:s}){const r=e.document,i=t.coordsAtPos(o.to);if(!i)return;se(r);const a=r.createElement("button");a.id=te,a.type="button",a.innerHTML=Ir,a.title=s,a.setAttribute("aria-label",s),a.addEventListener("mousedown",c=>{c.preventDefault(),c.stopPropagation(),se(r),n?.(o)}),a.addEventListener("mouseleave",()=>{e.setTimeout(()=>{t.dom.matches(":hover")||a.matches(":hover")||se(r)},120)}),r.body.appendChild(a),Hr(e,a,i.right+2,i.top-1)}function Pr(e,t,{onRename:o,isLocked:n,setHover:s,title:r}){if(!t?.dom||t.dom._sveClassTokenBound)return;t.dom._sveClassTokenBound=!0;let i=null,a="";const c=()=>!!n?.(),l=()=>{e.clearTimeout(i),i=null,a="",s?.(t,null),se(e.document)},u=f=>{if(c()){l();return}l(),o?.(f)};t.dom.addEventListener("mousemove",f=>{if(c()){l();return}if(f.target?.closest?.(`#${te}`))return;const p=t.posAtCoords({x:f.clientX,y:f.clientY});if(p==null)return;const v=mo(t.state.doc.toString(),p);if(!v){e.clearTimeout(i),i=null,a="",s?.(t,null);return}const k=`${v.from}:${v.to}:${v.name}`;s?.(t,{from:v.from,to:v.to}),!(a===k&&(i||e.document.getElementById(te)))&&(e.clearTimeout(i),a=k,i=e.setTimeout(()=>{i=null,Dr(e,t,v,{onRename:u,title:r||"Rename class"})},160))}),t.dom.addEventListener("mouseleave",f=>{f.relatedTarget?.closest?.(`#${te}`)||e.setTimeout(()=>{e.document.getElementById(te)?.matches(":hover")||l()},160)}),t.dom.addEventListener("dblclick",f=>{if(c())return;const p=t.posAtCoords({x:f.clientX,y:f.clientY});if(p==null)return;const v=mo(t.state.doc.toString(),p);v&&(f.preventDefault(),f.stopPropagation(),u(v))},!0),t.scrollDOM?.addEventListener("scroll",l),e.document._sveClassTokenDismiss||(e.document._sveClassTokenDismiss=!0,e.document.addEventListener("mousedown",f=>{f.target.closest(`#${te}`)||se(e.document)}))}let ne,Tt,Xo,Yo,Go,ve,st,Ft,Vt,Wt,Ut,Zo,Jo,Qo,en,tn,on,nn,sn,rn,an,ln,cn,dn,un,fn,pn,B,Le=null;function qr(){return Le||(Le=Promise.all([Q(()=>import("./index-Dpuj8sxX.js").then(e=>e.i),__vite__mapDeps([0,1]),import.meta.url),Q(()=>import("./index-B5fiB6ig.js"),[],import.meta.url),Q(()=>import("./index-eMi007Cw.js"),__vite__mapDeps([2,1,0,3,4]),import.meta.url),Q(()=>import("./index-D2YMCfE7.js"),__vite__mapDeps([5,1,0,3,4]),import.meta.url),Q(()=>import("./html-tag-sync-BlP2Mk13.js").then(e=>e.g),__vite__mapDeps([6,0,1,7,4,3,5,2]),import.meta.url),Q(()=>import("./index-BatCsQTe.js").then(e=>e.i),__vite__mapDeps([7,4,3,1,0]),import.meta.url),Q(()=>import("./html-tag-sync-BlP2Mk13.js").then(e=>e.f),__vite__mapDeps([6,0,1,7,4,3,5,2]),import.meta.url),Q(()=>import("./index-zsjA895l.js"),__vite__mapDeps([3,4,1,0]),import.meta.url),Q(()=>import("./index-BsAZfAgM.js").then(e=>e.i),[],import.meta.url)]).then(([e,t,o,n,s,r,i,a,c])=>{ne=e.EditorView,Tt=e.keymap,Xo=e.lineNumbers,Yo=e.highlightActiveLine,Go=e.highlightActiveLineGutter,ve=t.Compartment,st=t.EditorState,Ft=t.StateField,Vt=t.StateEffect,Wt=t.RangeSetBuilder,Ut=e.Decoration,Zo=o.defaultKeymap,Jo=o.indentWithTab,Qo=o.historyKeymap,en=o.history,tn=n.autocompletion,on=n.closeBrackets,nn=n.closeBracketsKeymap,sn=n.closeCompletion,rn=n.completionKeymap,an=e.hoverTooltip,ln=s.htmlLanguage,cn=s.html,dn=r.css,un=i.javascript,fn=a.HighlightStyle,pn=a.syntaxHighlighting,B=c.tags,Re.html=new ve,Re.css=new ve,Re.js=new ve,je.html=new ve,je.css=new ve,je.js=new ve}).catch(e=>{throw Le=null,e}),Le)}const d="__sve-code-dock",_o="__sve-code-dock-style",K="__sve-code-dock-unlock",hn="sve-code-dock-height",mn="sve-code-dock-panes",vn="sve-code-dock-widths",Kt="sve-html-scope-v2",gn="sve-code-dock-autosave",xn="sve-code-dock-style-mode",Rr=280,yn=120,Ct=140,jr=250,j=["html","css","js"],zr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',Nr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',Fr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',bn='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',Vr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',Wr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',Ur='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',w="__sve-css-menu",kn=["h1","h2","h3","h4","h5","h6"],wt=[{id:"heading",title:"heading",menu:"heading",letter:"H"},{id:"p",title:"paragraph",tag:"p",letter:"P"},{id:"div",title:"div",tag:"div"},{id:"section",title:"section",tag:"section"},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"}],Kr=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],Xt=[{id:"all",suffix:"",title:"all"},{id:"block",suffix:"-block",title:"block",sep:!0},{id:"block-start",suffix:"-block-start",title:"block start"},{id:"block-end",suffix:"-block-end",title:"block end"},{id:"inline",suffix:"-inline",title:"inline",sep:!0},{id:"inline-start",suffix:"-inline-start",title:"inline start"},{id:"inline-end",suffix:"-inline-end",title:"inline end"}],_n={display:"display",absolute:"position",color:"color",bg:"background-color",padding:"padding",margin:"margin"},Sn={"":"","-block":"-block","-inline":"-inline","-block-start":"-top","-block-end":"-bottom","-inline-start":"-left","-inline-end":"-right"},Xr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',Yr='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',$n=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],rt=[{id:"display",title:"display",menu:"display"},{id:"absolute",title:"absolute",insert:"position: absolute;"},{id:"color",title:"color",property:"color",menu:"colors"},{id:"bg",title:"background color",property:"background-color",menu:"colors"},{id:"padding",title:"padding",property:"padding",menu:"box"},{id:"margin",title:"margin",property:"margin",menu:"box"}],Mt=[{id:"display-flex",title:"flex",display:"flex"},{id:"flex-row",title:"row",flexDir:"row",sep:!0},{id:"flex-col",title:"column",flexDir:"column"}],Bt=[{id:"justify-start",title:"justify start",property:"justify-content",value:"flex-start"},{id:"justify-center",title:"justify center",property:"justify-content",value:"center"},{id:"justify-end",title:"justify end",property:"justify-content",value:"flex-end"},{id:"justify-between",title:"space between",property:"justify-content",value:"space-between"},{id:"justify-around",title:"space around",property:"justify-content",value:"space-around"},{id:"align-start",title:"align start",property:"align-items",value:"flex-start",group:"align"},{id:"align-center",title:"align center",property:"align-items",value:"center",group:"align"},{id:"align-end",title:"align end",property:"align-items",value:"flex-end",group:"align"},{id:"align-stretch",title:"align stretch",property:"align-items",value:"stretch",group:"align"}],Je={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 13.5 L8 2.5 L12 13.5"/><path d="M5.4 10h5.2"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="12" height="12" rx="2" opacity=".85"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>'},Gr={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>'};let Qe=null,_e=null,E=null,ue=[],W={html:"",css:"",js:""},L=!1,Se=!1,b=null,Ie=0,J=null,N=null,ge=null,Pe=null,Ne=!1,z=!1,H=!0,M=!1,R="css",y=null,A="",S="",G="full",fe="",ce=null,qe=null,Oe=null,He=null,So=!1;const m={html:null,css:null,js:null},Re={html:null,css:null,js:null},je={html:null,css:null,js:null};function g(e,t,o={}){let n=e.Statamic?.$config?.get?.("sveStrings")?.[t]??t;for(const[s,r]of Object.entries(o))n=String(n).replaceAll(`:${s}`,r);return n}function Cn(e){return e.document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||e.Statamic?.$config?.get?.("csrfToken")||e.Statamic?.$config?.get?.("csrf_token")||""}function Zr(){return[ne.theme({"&":{height:"auto",backgroundColor:"#1e1e1e",color:"#d4d4d4"},".cm-content":{caretColor:"#aeafad",padding:"12px 0",fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:"13px",lineHeight:"1.55"},".cm-cursor":{borderLeftColor:"#aeafad"},".cm-activeLine":{backgroundColor:"#ffffff0d"},".cm-activeLineGutter":{backgroundColor:"#ffffff0d"},".cm-gutters":{backgroundColor:"#1e1e1e",color:"#858585",border:"none",borderRight:"1px solid #3c3c3c",fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:"13px",lineHeight:"1.55"},".cm-lineNumbers .cm-gutterElement":{paddingLeft:"8px",paddingRight:"12px"},".cm-scroller":{overflow:"visible",height:"auto",minHeight:0},".cm-selectionBackground, &.cm-focused .cm-selectionBackground":{backgroundColor:"#264f78 !important"}},{dark:!0}),pn(fn.define([{tag:B.keyword,color:"#569cd6"},{tag:B.string,color:"#ce9178"},{tag:B.comment,color:"#6a9955",fontStyle:"italic"},{tag:B.number,color:"#b5cea8"},{tag:B.className,color:"#d7ba7d"},{tag:B.tagName,color:"#4ec9b0"},{tag:B.propertyName,color:"#9cdcfe"},{tag:B.variableName,color:"#9cdcfe"},{tag:B.attributeName,color:"#9cdcfe"},{tag:B.attributeValue,color:"#ce9178"},{tag:B.angleBracket,color:"#808080"},{tag:B.unit,color:"#b5cea8"},{tag:B.color,color:"#ce9178"},{tag:B.bracket,color:"#ffd700"},{tag:B.punctuation,color:"#d4d4d4"},{tag:B.operator,color:"#d4d4d4"}]))]}function Jr(e){return e==="css"?dn():e==="js"?un():cn({autoCloseTags:!0})}function Qr(e){return e.querySelector(".live-preview")||e.body}function Lt(e,t){const o=Qr(e);t.parentElement!==o&&o.appendChild(t)}function $o(e){if(e._sveShield)return;e._sveShield=!0;const t=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])e.addEventListener(o,t)}function ei(e){try{return new URLSearchParams(e.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function ti(e){const t=parseInt(Te(e,hn)??"",10);return Number.isFinite(t)&&t>=yn?t:Rr}function oi(e,t){Ce(e,hn,String(t))}function An(e){try{const t=JSON.parse(Te(e,mn)||"null");if(t&&typeof t=="object")return{html:t.html!==!1,css:t.css!==!1,js:t.js===!0}}catch{}return{html:!0,css:!0,js:!1}}function ni(e,t){Ce(e,mn,JSON.stringify(t))}function En(e){try{const t=JSON.parse(Te(e,vn)||"null");if(t&&typeof t=="object"){const o=n=>Number.isFinite(n)&&n>0?n:1;return{html:o(t.html),css:o(t.css),js:o(t.js)}}}catch{}return{html:1,css:1,js:1}}function si(e,t){Ce(e,vn,JSON.stringify(t))}function ri(e){let t=e.getElementById(_o);t||(t=e.createElement("style"),t.id=_o,e.head.appendChild(t)),t.textContent=`
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
  ${po("ns")}
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
  ${po("ew")}
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
#${de} {
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
#${de} [data-sve-partial-choice] {
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
#${de} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${de} [data-sve-partial-empty] {
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
`}function ii(e){const t=e.querySelector(".live-preview-editor");if(!t)return 0;const o=t.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function ai(e){let t=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=e.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>e.documentElement.clientWidth-8&&(t=Math.max(t,Math.round(s.width)))}return t}function Yt(e){const t=e.document;if(qe=e,typeof e.ResizeObserver!="function")return;ce||(ce=new e.ResizeObserver(()=>{qe&&ma(qe)}));const o=t.querySelector(".live-preview-editor"),n=t.getElementById("__sve-right-dock");o!==Oe&&(Oe&&ce.unobserve(Oe),Oe=o,o&&ce.observe(o)),n!==He&&(He&&ce.unobserve(He),He=n,n&&ce.observe(n))}function li(){ce?.disconnect(),ce=null,qe=null,Oe=null,He=null}function ci(e){So||(So=!0,e.addEventListener("sve-right-dock-change",()=>Yt(e)))}function Gt(e,t){const o=e.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=t?`${t}px`:"")}function Zt(e){if(!e)return;const t=e.clientHeight,o=e.querySelector("[data-sve-code-bar]"),n=e.querySelector("[data-sve-code-lock-banner]"),s=n&&di(e)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,t-(o?.offsetHeight||0)-s),i=e.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),e.querySelectorAll("[data-sve-code-host]").forEach(a=>{const c=a.closest("[data-sve-code-pane]");if(!c||c.style.display==="none")return;let l=0;for(const f of c.children)f!==a&&(l+=f.offsetHeight);const u=Math.max(64,r-l);a.style.height=`${u}px`,a.style.maxHeight=`${u}px`,a.style.minHeight="0",a.style.overflow="auto",ui(a)})}function di(e){return e.ownerDocument?.defaultView||b}function ui(e){e._sveWheelBound||(e._sveWheelBound=!0,e.addEventListener("wheel",t=>{const o=e.scrollHeight-e.clientHeight,n=e.scrollWidth-e.clientWidth;let s=!1;if(t.deltaY&&o>0){const r=Math.min(o,Math.max(0,e.scrollTop+t.deltaY));r!==e.scrollTop&&(e.scrollTop=r,s=!0)}if(t.deltaX&&n>0){const r=Math.min(n,Math.max(0,e.scrollLeft+t.deltaX));r!==e.scrollLeft&&(e.scrollLeft=r,s=!0)}s&&(t.preventDefault(),t.stopPropagation())},{passive:!1}))}function Tn(){const e=(qe||b)?.document?.getElementById(d);e&&Zt(e);for(const t of j)m[t]?.requestMeasure()}function wn(e,t){const o=An(e),n={};for(const s of j){const r=t.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function Mn(e,t){for(const n of j){const s=e.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",t[n]?"true":"false"),r&&(r.style.display=t[n]?"flex":"none")}const o=j.filter(n=>t[n]);e.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),Bn(e.ownerDocument.defaultView,e),Zt(e)}function Bn(e,t){const o=En(e);for(const n of j){const s=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function Fe(e,t){if(Ne)return;const o=e.document;Lt(o,t);const n=ti(e),s=ii(o),r=ai(o);t.style.left=`${s}px`,t.style.right=`${r}px`,t.style.bottom="0",t.style.height=`${n}px`,Gt(o,n),Zt(t)}function Ln(e,t,o,n){const s=e.document,r=[...s.querySelectorAll("iframe")];r.forEach(u=>{u.style.pointerEvents="none"});const i=s.createElement("div");i.setAttribute("data-sve-code-drag-shield",""),i.style.cssText=`position:fixed;inset:0;z-index:2147483646;cursor:${t};user-select:none;`,s.body.appendChild(i),Ne=!0;let a=!1;const c=u=>{o(u)},l=()=>{a||(a=!0,Ne=!1,s.removeEventListener("mousemove",c),s.removeEventListener("mouseup",l),e.removeEventListener("blur",l),r.forEach(u=>{u.style.pointerEvents=""}),i.remove(),n?.())};s.addEventListener("mousemove",c),s.addEventListener("mouseup",l),e.addEventListener("blur",l)}function fi(e,t){if(t._sveResizeBound)return;t._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest("[data-sve-code-pane-btn], [data-sve-code-back], [data-sve-style-mode], [data-sve-html-scope], [data-sve-code-lock], [data-sve-code-autosave], [data-sve-code-save], .cm-editor"))return;n.preventDefault();const s=n.clientY,r=t.getBoundingClientRect().height;let i=r;Ln(e,"ns-resize",a=>{i=Math.min(Math.max(yn,r+(s-a.clientY)),Math.round(e.innerHeight*.7)),t.style.height=`${i}px`,Gt(e.document,i),Tn()},()=>{oi(e,i),Fe(e,t),e.dispatchEvent(new Event("resize"))})};t.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),t.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function pi(e,t){t._sveSplitBound||(t._sveSplitBound=!0,t.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=j.filter(x=>wn(e,t)[x]),i=r.indexOf(s),a=r[i],c=r[i+1];if(!a||!c)return;const l=t.querySelector(`[data-sve-code-pane="${a}"]`),u=t.querySelector(`[data-sve-code-pane="${c}"]`),f=n.clientX,p=l.getBoundingClientRect().width,v=u.getBoundingClientRect().width,k=p+v;o.setAttribute("data-active",""),Ln(e,"col-resize",x=>{const I=x.clientX-f;let O=Math.max(Ct,Math.min(k-Ct,p+I)),le=k-O;k<Ct*2&&(O=p,le=v);const Be=En(e);Be[a]=O,Be[c]=le,si(e,Be),Bn(e,t),Tn()},()=>{o.removeAttribute("data-active")})})}))}function hi(e,t){t._svePaneBound||(t._svePaneBound=!0,t.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=wn(e,t),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),ni(e,i),Mn(t,i)})}))}function F(e,t){const o=e.getElementById(d)?.querySelector("[data-sve-code-status]");o&&(o.textContent=t||"")}function In(e,t){const o=e.getElementById(d)?.querySelector("[data-sve-code-path]");o&&(o.textContent=t||"",o.title=t||"")}function Ve(e){const t=e?.document?.getElementById(d)?.querySelector("[data-sve-code-back]");t&&(t.hidden=ue.length===0,t.title=g(e,"code_dock_back"),t.setAttribute("aria-label",t.title),t.innerHTML=Fr)}function Co(e,t){const o=t.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),gi(e)}))}function mi(e){const t=_e,o=typeof _.activeContainers=="function"?_.activeContainers(e.document):[];for(const n of o){const s=_.unwrapRef?.(n.values)||n.values;if(!(!s||typeof s!="object")&&t&&typeof _.findPathByUid=="function"){const r=_.findPathByUid(s,t);if(r){const i=r.split("."),a=_.dataGet?.(s,i.slice(0,2).join("."));if(a&&typeof a=="object")return a}}}for(const n of o){const s=_.unwrapRef?.(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function vi(e,t){!t||t===E||(ie(e.document),_t(e,t,"push"))}function gi(e){const t=ue.pop();if(!t){Ve(e);return}ie(e.document),_t(e,t,"keep")}function Ee(e){const t=e.document.getElementById(d),o=t?.querySelector("[data-sve-code-lock]"),n=t?.querySelector("[data-sve-code-lock-banner]");if(!t||!o)return;const s=L;t.toggleAttribute("data-sve-code-locked",s),s&&(ee(e.document),se(e.document),be&&(be.setHover(m.html,null),be.setHover(m.css,null)),ze?.setHover(m.html,null)),o.hidden=!Se,o.setAttribute("aria-pressed",L?"true":"false"),o.title=g(e,L?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=L?zr:Nr,n&&(n.textContent=g(e,"code_dock_locked_banner"))}function Ke(e){return e?Te(e,Kt)!=="0":H}function ut(e,t,o){return e!=null&&t!=null&&e>=0&&t>e&&t<=o}function ft(){const e=m.html?.state.doc.toString()??"";if(!M||!y){A=e;return}if(y.from<0||y.from>A.length||y.to<y.from){M=!1,A=e,y=null;return}A=A.slice(0,y.from)+e+A.slice(y.to),y={from:y.from,to:y.from+e.length}}function pt(){return ft(),M?A:m.html?.state.doc.toString()??W.html??""}function ht(){N=ct(pt()).map(e=>e.name)}function we(){ge=jo(m.css?.state.doc.toString()??S)}function On(e,t){return Array.isArray(e)&&Array.isArray(t)&&e.length===t.length&&e.every((o,n)=>o===t[n])}function xi(){const e=M?Qt():pt(),t=dt(e);t.length&&(S=Nt(S,zt(S,t),t[0].className))}function Hn(e,t){S=vr(S,e,t),xi(),S=gr(S,t,e)}function yi(e){if(z||L||N==null)return;const t=ct(pt()).map(o=>o.name);On(N,t)||(Hn(N,t),N=t,vt(),we())}function bi(){if(z||L||ge==null||N==null||G==="empty")return;const e=m.html,t=jo(m.css?.state.doc.toString()??"");if(!e||On(ge,t))return;const o=new Set(N),{renamed:n,removed:s}=zo(ge,t);let r=e.state.doc.toString();const i=r;for(const a of n){const c=ke(a.to);!o.has(a.from)||!c||(r=vo(r,l=>l===a.from?c:l))}for(const a of s)!o.has(a)||t.includes(a)||(r=vo(r,c=>c===a?"":c));if(r!==i){z=!0;try{mt(r)}finally{z=!1}}ht(),ge=t}function ki(e,t){const o=ke(t),n=m.html;if(!o||!n||n.state.readOnly||o===e.name)return;z=!0;try{n.dispatch({changes:{from:e.from,to:e.to,insert:o}})}finally{z=!1}const s=N==null?[]:N.slice();ht(),Hn(s,N),vt(),we(),b&&(me(b),Z(b))}function _i(e,t){const o=e.document,s=m.html?.coordsAtPos(t.from);T(o),se(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=w,o.body.appendChild(r),Xe(e,i,r),r._sveApp=Ue(Po,r,{label:g(e,"code_dock_css_rename_class"),placeholder:g(e,"code_dock_css_class_placeholder"),initial:t.name,onAdd:a=>{ki(t,a),T(o)}})}function Dn(){return H&&ut(y?.from,y?.to,A.length)?(M=!0,A.slice(y.from,y.to)):(M=!1,A)}function Jt(e,t,o){const n=m[e];if(!n)return;const s=n.state.doc.toString();z=!0;try{s!==t?n.dispatch({changes:{from:0,to:s.length,insert:t},...o?{selection:o,scrollIntoView:!0}:{}}):o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{z=!1}}function mt(e,t){Jt("html",e,t)}function Qt(){return M?m.html?.state.doc.toString()??"":ut(y?.from,y?.to,A.length)?A.slice(y.from,y.to):""}function Me(){const e=m.css?.state.doc.toString()??"";if(G==="tree"){if(e===fe)return;const t=dt(Qt())[0]?.className||Vo(e);S=Nt(S,e,t),fe=e}else G==="full"&&(S=e)}function Pn(e,t){for(const o of t||[])if(!Y(e,o.className)||Pn(e,o.children))return!0;return!1}function vt(){let e=S,t=[],o=!1;!H||!M?(G="full",e=S):(t=dt(Qt()),t.length?(G="tree",e=zt(S,t),Pn(S,t)&&(S=Nt(S,e,t[0].className),o=!0)):(G="empty",e="")),fe=e,Jt("css",e),we(),b&&(Z(b),o&&me(b))}function eo(){const e=m.html;if(!e||!y)return;M||(A=e.state.doc.toString());const t=A.length,o=Math.max(0,Math.min(y.from,t)),n=Math.max(o,Math.min(y.to,t));n<=o||(y={from:o,to:n},M=!0,mt(A.slice(o,n),{anchor:0,head:0}),vt(),e.focus())}function to(e=!0){const t=m.html;if(!t)return;Me(),ft(),M=!1;const o=A||t.state.doc.toString(),n=e&&ut(y?.from,y?.to,o.length)?{anchor:y.from,head:y.to}:null;A=o,mt(o,n),G="full",fe=S,Jt("css",S),we()}function oo(){y=null,M=!1,A="",S="",G="full",fe="",N=null,ge=null}let We=!1;function Ae(e){return!!e?.document.getElementById(_.HTML_TREE_PANEL_ID)}function It(e,t){if(!(!e||_.featureOn?.(e,"html_tree")===!1)){if(!t){Ae(e)&&_.closeHtmlTreePanel?.(e);return}Ae(e)||(We=!0,ns("html_tree").then(()=>{Ae(e)||_.toggleHtmlTreePanel?.(e)}).catch(()=>{}).finally(()=>{We=!1,U(e)}))}}function U(e){const t=e?.document.getElementById(d)?.querySelector("[data-sve-html-scope]");if(!t)return;H=Ke(e);const o=_.featureOn?.(e,"html_tree")===!1?H:Ae(e)||We;t.setAttribute("aria-pressed",o?"true":"false"),t.title=g(e,o?"code_dock_html_scope_off":"code_dock_html_scope"),t.setAttribute("aria-label",t.title),t.innerHTML=bn,e.document.getElementById(d)?.toggleAttribute("data-sve-html-scoped",M)}function Ao(e,t){t._sveHtmlScopeBound||(t._sveHtmlScopeBound=!0,H=Ke(e),Si(e,t),It(e,H),t.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),H=!(Ae(e)||We),Ce(e,Kt,H?"1":"0"),H?y&&(Me(),eo()):M&&to(),It(e,H),U(e)}))}function Si(e,t){t._sveTreeWatchBound||(t._sveTreeWatchBound=!0,e.addEventListener("sve-right-dock-change",()=>{if(We||_.featureOn?.(e,"html_tree")===!1||!e.document.getElementById(d))return;const o=Ae(e);o!==Ke(e)&&(H=o,Ce(e,Kt,o?"1":"0"),o?y&&(Me(),eo()):M&&to(),U(e))}))}function Eo(e,t){t._sveLockBound||(t._sveLockBound=!0,t.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!Se||!E)){if(L){Ci(e);return}qn(e,!0)}}))}function no(e){return e?Te(e,gn)!=="0":!0}function $i(){const e=m.html;return!e||e.state.readOnly||!E?!1:!ro(so(),W)}function pe(e){const t=e?.document.getElementById(d),o=t?.querySelector("[data-sve-code-autosave]"),n=t?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=no(e),r=$i();o.setAttribute("aria-pressed",s?"true":"false"),o.title=g(e,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=Vr,n.hidden=s,n.title=g(e,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=Wr,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function To(e,t){t._sveAutosaveBound||(t._sveAutosaveBound=!0,t.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!no(e);Ce(e,gn,n?"1":"0"),n?ie(e.document):J&&(clearTimeout(J),J=null),pe(e)}),t.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),ie(e.document)}))}function Ci(e){e.document.getElementById(K)?.remove();const t=ss(e.document,rs,{title:g(e,"code_dock_unlock_title"),body:g(e,"code_dock_unlock_body"),buttons:[{value:"cancel",label:g(e,"cancel"),variant:"ghost"},{value:"ok",label:g(e,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{t.dismiss(),o==="ok"&&qn(e,!1)}});t.host.id=K}function qn(e,t){const o=E;if(!o)return;const n=()=>{E===o&&e.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Cn(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:t})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));E===o&&(L=t,Ee(e),gt(W,t),U(e),F(e.document,t?g(e,"code_dock_locked"):""))}).catch(()=>{F(e.document,g(e,"code_dock_error"))})};if(t&&(ie(e.document),Pe)){Pe.finally(n);return}n()}function so(){const e={html:"",css:"",js:""};ft(),Me();for(const t of j)t==="html"?e.html=M?A:m.html?.state.doc.toString()??"":t==="css"?e.css=S:e[t]=m[t]?.state.doc.toString()??"";return e}function Ai(){if(!(H&&ut(y?.from,y?.to,A.length)))return G="full",fe=S,S;const e=dt(A.slice(y.from,y.to));if(!e.length)return G="empty",fe="","";G="tree";const t=zt(S,e);return fe=t,t}function gt(e,t){z=!0;try{b&&(H=Ke(b)),A=e.html??"",S=e.css??"";for(const o of j){const n=m[o];let s=e[o]??"";try{s=o==="html"?Dn():o==="css"?Ai():s}catch{s=o==="html"?A||e.html||"":o==="css"?S||e.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[Re[o].reconfigure(st.readOnly.of(!!t)),je[o].reconfigure(ne.editable.of(!t))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{z=!1}ht(),we(),Pt("dock:html-changed"),b&&(Z(b),kt(b),U(b))}function ro(e,t){return e.html===t.html&&e.css===t.css&&e.js===t.js}function Rn(e){return String(e||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function xt(e){const t=Rn(e).match(/^([a-z-]+)\s*:/i);return t?t[1].toLowerCase():""}function Ei(e,t){return e===t||e.startsWith(`${t}-`)}function yt(e){const t=Rn(e),o=t.indexOf(":");return o===-1?"":t.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function P(e){const t=String(e||"").trim().toLowerCase();return t==="start"||t==="flex-start"||t==="left"||t==="top"?"flex-start":t==="end"||t==="flex-end"||t==="right"||t==="bottom"?"flex-end":t==="row-reverse"?"row-reverse":t==="column-reverse"?"column-reverse":t}function it(e){const t=P(e);return t==="flex"||t==="inline-flex"}function io(){const e=m.css;if(!e)return null;const t=e.state.selection.main.head,o=e.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const a=o.indexOf("}}",i+2);if(a===-1)break;i=a+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const a=n.pop();a!=null&&s.push({from:a+1,to:i,text:o.slice(a+1,i),open:a})}}let r=null;for(const i of s)t<i.open||t>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function Ti(e){const t=String(e||"");let o="",n=0;for(let s=0;s<t.length;s+=1){if(t[s]==="{"&&t[s+1]==="{"){const r=t.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=t.slice(s,r+2)),s=r+1;continue}if(t[s]==="{"){n+=1;continue}if(t[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=t[s])}return o}function wi(e){const t={};for(const o of Ti(e).split(";")){const n=xt(o);n&&(t[n]=yt(`${o};`))}return t}function Mi(e,t,o){if(!t||t.from>=t.to)return null;let n=e.state.doc.lineAt(t.from),s=0;for(;n.from<=t.to;){const r=Math.max(n.from,t.from),i=Math.min(n.to,t.to),a=e.state.doc.sliceString(r,i);if(s===0&&xt(a)===o)return{from:r,to:i,text:a};if(s+=Bi(a),n.to>=e.state.doc.length||n.to>=t.to)break;n=e.state.doc.lineAt(n.to+1)}return null}function Bi(e){let t=0;const o=String(e);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?t+=1:o[n]==="}"&&(t-=1)}return t}function he(e){return(String(e).match(/^\s*/)||[""])[0]}function bt(e,t,o){for(let n=t.number-1;n>=1;n-=1){const s=e.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=he(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function Li(e,t){const o=e.state.doc.lineAt(t);if(o.text.trim())return he(o.text);const n=bt(e,o,!0);if(n)return n;const s=io();return s?jn(e,s):"  "}function jn(e,t){const o=e.state.doc.lineAt(t.from),n=e.state.doc.lineAt(Math.max(t.from,t.to));for(let r=n.number;r>=o.number;r-=1){const i=e.state.doc.line(r),a=Math.max(i.from,t.from),c=Math.min(i.to,t.to),l=e.state.doc.sliceString(a,c);if(l.trim())return(l.match(/^\s*/)||[""])[0]||"  "}return`${(e.state.doc.lineAt(Math.max(0,t.from-1)).text.match(/^\s*/)||[""])[0]}  `}function wo(){m.css?.focus(),b&&(me(b),Z(b))}function V(e){const t=m.css;if(!t||t.state.readOnly||!e.length)return;const o=io();if(!o){const i=e.filter(a=>a.value!=null).map(a=>`${a.property}: ${a.value};`).join(`
`);i&&Di(i),wo();return}const n=[],s=[],r=jn(t,o);for(const i of e){const a=Mi(t,o,i.property);if(i.value==null){if(!a)continue;let c=a.from,l=a.to;t.state.doc.sliceString(l,l+1)===`
`&&(l+=1),c=Math.max(c,o.from),l=Math.min(l,o.to),n.push({from:c,to:l});continue}if(!(a&&P(yt(a.text))===P(i.value)))if(a){const c=(a.text.match(/^\s*/)||[""])[0];n.push({from:a.from,to:a.to,insert:`${c}${i.property}: ${i.value};`})}else s.push(`${r}${i.property}: ${i.value};`)}if(s.length){const i=!o.text.includes(`
`)||!/\n\s*$/.test(o.text)?`
`:"";n.push({from:o.to,to:o.to,insert:`${i}${s.join(`
`)}
`})}n.length&&(n.sort((i,a)=>a.from-i.from||a.to-i.to),t.dispatch({changes:n})),wo()}function $e(){const e=io();return e?wi(e.text):{}}function Ii(e){const t=$e(),o=it(t.display),n=P(t["flex-direction"])||(o?"row":"");if(o&&n===e){const s=[];t["flex-direction"]&&s.push({property:"flex-direction",value:null}),it(t.display)&&s.push({property:"display",value:null}),V(s);return}V([{property:"display",value:"flex"},{property:"flex-direction",value:e}])}function Oi(e){const t=$e();if(e==="flex"&&it(t.display)){V([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}V([{property:"display",value:e}])}function Hi(e,t){const o=$e();if(P(o[e])===P(t)){V([{property:e,value:null}]);return}V([{property:e,value:t}])}function Di(e){const t=m.css;if(!t||t.state.readOnly)return;const o=t.state.selection.main.head,n=t.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=Li(t,o),a=e.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const l=`${i}${a}
${i}`;t.dispatch({changes:{from:n.from,to:n.to,insert:l},selection:{anchor:n.from+l.length}});return}const c=`
${i}${a}
${i}`;t.dispatch({changes:{from:o,to:t.state.selection.main.to,insert:c},selection:{anchor:o+c.length}})}function Z(e){try{Pi(e)}catch{}}function Pi(e){const t=e?.document?.getElementById(d);if(R==="tw"){t&&Xi(e,t);return}const o=$e(),n=it(o.display),s=P(o["flex-direction"])||(n?"row":""),r=t?.querySelector("[data-sve-css-tools]"),i=t?.querySelector("[data-sve-css-chrome]"),a=i?.getAttribute("data-sve-css-sub")||"",c=a==="padding"||a==="margin"?a:"";if(t){i&&(n?i.setAttribute("data-sve-css-flex-on",""):i.removeAttribute("data-sve-css-flex-on")),r&&(n?r.setAttribute("data-sve-css-flex-on",""):r.removeAttribute("data-sve-css-flex-on"));for(const l of[...rt,...Mt]){const u=t.querySelector(`[data-sve-css-tool="${l.id}"]`);if(!u)continue;let f=!1;if(l.flexDir)f=n&&s===l.flexDir;else if(l.display)f=l.display==="flex"?n:P(o.display)===l.display;else if(l.insert){const p=xt(l.insert);f=!!p&&P(o[p])===P(yt(l.insert))}else l.menu==="box"?(f=Object.keys(o).some(p=>Ei(p,l.property)),a===l.property?u.setAttribute("data-open",""):u.removeAttribute("data-open")):l.menu==="display"?(f=!!o.display,a==="display"?u.setAttribute("data-open",""):u.removeAttribute("data-open")):l.property&&(f=l.property in o);f?u.setAttribute("data-active",""):u.removeAttribute("data-active")}for(const l of Xt){const u=t.querySelector(`[data-sve-css-box-side="${l.suffix}"]`);if(!u)continue;!!c&&`${c}${l.suffix}`in o?u.setAttribute("data-active",""):u.removeAttribute("data-active")}for(const l of Bt){const u=t.querySelector(`[data-sve-css-tool="${l.id}"]`);if(!u)continue;P(o[l.property])===P(l.value)?u.setAttribute("data-active",""):u.removeAttribute("data-active")}}}function T(e){const t=e?.getElementById(w);t?._sveApp?.unmount(),t?.remove(),e?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-css-box-side][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open]").forEach(o=>o.removeAttribute("data-open"))}function La(e){T(e),se(e);for(const t of j)m[t]&&sn?.(m[t])}function qi(e){if(Qe)return Qe;const t=e.Statamic?.$config?.get?.("cpUrl")||`/${e.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return Qe=e.fetch(`${t}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,a=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!a||n.has(a)||(n.add(a),s.push({name:a,hex:r.hex||r.color||""}))}for(const[r,i]of $n)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),Qe}function zn(e,t){const o=$e()[t]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of e.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function Xe(e,t,o){const n=t.getBoundingClientRect(),s=8;o.style.left=`${Math.max(s,Math.min(n.left,e.innerWidth-220))}px`,o.style.top=`${Math.max(s,n.bottom+4)}px`}function Ri(e,t,o){const n=e.document;T(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=w,n.body.appendChild(s),Xe(e,t,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=Ue(qt,s,{kind:"colors",swatches:i,onClear:()=>{V([{property:o,value:null}]),T(n)},onPick:a=>{V([{property:o,value:`var(${a})`}]),T(n)}}),zn(s,o)};r($n.map(([i,a])=>({name:i,hex:a}))),qi(e).then(i=>{n.getElementById(w)&&r(i.map(a=>({name:a.name,hex:a.hex})))})}function Mo(e,t,o){const n=e.document;T(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=w,n.body.appendChild(s),Xe(e,t,s),s._sveApp=Ue(qt,s,{kind:"choices",choices:Kr.map(r=>({value:r,token:r,label:r})),onPick:r=>{V([{property:o,value:`var(${r})`}]),T(n)}}),zn(s,o)}function ye(e){return e?.querySelector("[data-sve-css-chrome]")}function Ot(e,t){const o=e.document.getElementById(d),n=ye(o);T(e.document),n&&(n.getAttribute("data-sve-css-sub")===t?n.removeAttribute("data-sve-css-sub"):n.setAttribute("data-sve-css-sub",t),Z(e))}function Nn(e,t){if(e.startsWith("{{",t)){const o=e.indexOf("}}",t+2);return o===-1?e.length:o+2}if(e.startsWith("<!--",t)){const o=e.indexOf("-->",t+4);return o===-1?e.length:o+3}return t}function Ht(e,t){if(e[t]!=="<")return null;const o=e.indexOf(">",t+1);if(o===-1)return null;const n=e.slice(t,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:t,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:t,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:t,to:o+1}}function Bo(e,t,o){let n=1,s=o;for(;s<e.length;){const r=Nn(e,s);if(r!==s){s=r;continue}if(e[s]!=="<"){s+=1;continue}const i=Ht(e,s);if(!i)break;if(i.kind==="open"&&i.name===t)n+=1;else if(i.kind==="close"&&i.name===t&&(n-=1,n===0))return i;s=i.to}return null}function Ye(){const e=m.html;if(!e)return null;const t=e.state.selection.main.head,o=e.state.doc.toString(),n=[];let s=0;for(;s<t;){const c=Nn(o,s);if(c!==s){s=c;continue}if(o[s]!=="<"){s+=1;continue}const l=Ht(o,s);if(!l||l.from>=t)break;if(l.kind==="open")n.push(l);else if(l.kind==="close"){for(let u=n.length-1;u>=0;u-=1)if(n[u].name===l.name){n.splice(u);break}}s=l.to}const r=o.lastIndexOf("<",Math.max(0,t-1));if(r!==-1&&o.indexOf(">",r)>=t){const c=Ht(o,r);if(c?.kind==="open"||c?.kind==="void"){const l=c.kind==="void"?null:Bo(o,c.name,c.to);return l?{name:c.name,open:c,close:l}:{name:c.name,open:c,close:null}}}const i=n[n.length-1];if(!i)return null;const a=Bo(o,i.name,i.to);return{name:i.name,open:i,close:a}}function Dt(e){return kn.includes(e)}function oe(){m.html?.focus(),b&&(me(b),kt(b))}function et(e,t,o){const n=[...t].sort((s,r)=>r.from-s.from||r.to-s.to);e.dispatch({changes:n,selection:o})}function at(e,t){const o=m.html;if(!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.slice(0,n-s.from),i=s.text.trim()?he(s.text):bt(o,s)||he(s.text);let a=e,c=0;if(r.trim()!=="")a=`
${i}${e}`,c=1+i.length;else if(!s.text.trim()){a=`${i}${e}`,c=i.length,o.dispatch({changes:{from:s.from,to:s.to,insert:a},selection:{anchor:s.from+c+t}});return}o.dispatch({changes:{from:n,to:o.state.selection.main.to,insert:a},selection:{anchor:n+c+t}})}function Fn(e){const t=m.html;if(!t||t.state.readOnly)return;const o=t.state.selection.main,n=t.state.doc.toString();if(!o.empty){const a=n.slice(o.from,o.to),c=a.match(new RegExp(`^<${e}(\\s[^>]*)?>([\\s\\S]*)</${e}>$`,"i"));if(c){et(t,[{from:o.from,to:o.to,insert:c[2]}],{anchor:o.from,head:o.from+c[2].length}),oe();return}let l=`<${e}>${a}</${e}>`,u=o.from+e.length+2;e==="ul"&&(l=`<ul>
  <li>${a}</li>
</ul>`,u=o.from+11),et(t,[{from:o.from,to:o.to,insert:l}],{anchor:u,head:u+a.length}),oe();return}const s=Ye();if(s?.open&&s.close){if(s.name===e){et(t,[{from:s.close.from,to:s.close.to,insert:""},{from:s.open.from,to:s.open.to,insert:""}],{anchor:s.open.from}),oe();return}if(Dt(s.name)&&Dt(e)){const a=n.slice(s.open.from,s.open.to).replace(new RegExp(`^<${s.name}`,"i"),`<${e}`);et(t,[{from:s.close.from,to:s.close.to,insert:`</${e}>`},{from:s.open.from,to:s.open.to,insert:a}],{anchor:s.open.from+e.length+1}),oe();return}}const i=(t.state.doc.lineAt(o.head).text.match(/^\s*/)||[""])[0];if(e==="ul"){const a=`<ul>
${i}  <li></li>
${i}</ul>`;at(a,`<ul>
${i}  <li>`.length)}else at(`<${e}></${e}>`,e.length+2);oe()}function kt(e){try{ji(e)}catch{}}function ji(e){const t=e?.document?.getElementById(d),n=Ye()?.name||"";if(t)for(const s of wt){const r=t.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!r)continue;(s.id==="heading"?Dt(n):n===s.tag)?r.setAttribute("data-active",""):r.removeAttribute("data-active")}}function zi(e,t){const o=e.document,n=Ye()?.name||"";T(o),t.setAttribute("data-open","");const s=o.createElement("div");s.id=w,o.body.appendChild(s),Xe(e,t,s),s._sveApp=Ue(qt,s,{kind:"choices",choices:kn.map(r=>({value:r,label:r.toUpperCase(),active:n===r})),onPick:r=>{Fn(r),T(o)}})}function Ni(e){const t=ke(e),o=m.html,n=m.css;if(!t||o?.state.readOnly||n?.state.readOnly)return;const s=Ye();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=ar(r,t);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}Me(),Y(S,t)||(S=`${String(S||"").trimEnd()}${S?.trim()?`
`:""}.${t} {
}
`),vt(),ht(),we(),b&&(me(b),kt(b),Z(b))}function Fi(e,t){const o=e.document;if(t.hasAttribute("data-open")){T(o);return}T(o),t.setAttribute("data-open","");const n=o.createElement("div");n.id=w,o.body.appendChild(n),Xe(e,t,n),n._sveApp=Ue(Po,n,{label:g(e,"code_dock_css_class_name"),placeholder:g(e,"code_dock_css_class_placeholder"),onAdd:s=>{Ni(s),T(o)}})}function Vi(e,t){const o=t.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=Ur,o.title=g(e,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),R==="tw"){T(e.document),ps(e,o);return}Fi(e,o)}))}function Ia(){return R}function ao(e){const t=e?.document.getElementById(d);if(!t)return;const o=R==="tw";t.setAttribute("data-sve-style",R);const n=t.querySelector("[data-sve-css-label]");n&&(n.textContent=o?g(e,"code_dock_style_tw"):g(e,"code_dock_css"));const s=t.querySelector("[data-sve-style-mode]");if(!s)return;const r=e.document.createElement("span");r.textContent=o?g(e,"code_dock_style_tw"):g(e,"code_dock_css"),s.innerHTML=o?Yr:Xr,s.appendChild(r),s.title=g(e,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function Vn(e){const t=e?.document.getElementById(d);T(e.document),Et(e),ye(t)?.removeAttribute("data-sve-css-sub"),ao(e),R==="tw"&&It(e,!0),ds(e),Z(e)}function Wi(e,t){R=t==="tw"?"tw":"css",Ce(e,xn,R),Vn(e)}function Ui(e,t){t._sveStyleModeBound||(t._sveStyleModeBound=!0,R=Te(e,xn)==="tw"?"tw":"css",t.querySelector("[data-sve-style-mode]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),Wi(e,R==="tw"?"css":"tw")}),Vn(e))}function Ki(e,t,o,n){const s=_n[o];if(!(!s||!n)){if(o==="absolute"){Et(e),ye(t)?.removeAttribute("data-sve-css-sub"),fs(e,"absolute"),Z(e);return}if(o==="padding"||o==="margin"){Et(e),Ot(e,s);return}ye(t)?.removeAttribute("data-sve-css-sub"),Oo(e,n,s)}}function Xi(e,t){const o=t.querySelector("[data-sve-css-chrome]"),n=o?.getAttribute("data-sve-css-sub")||"",s=n==="padding"||n==="margin"?n:"";o?.removeAttribute("data-sve-css-flex-on"),t.querySelector("[data-sve-css-tools]")?.removeAttribute("data-sve-css-flex-on");for(const r of rt){const i=t.querySelector(`[data-sve-css-tool="${r.id}"]`);if(!i)continue;const a=_n[r.id],c=us()&&!!a&&!!ho(a);n===a&&(r.id==="padding"||r.id==="margin")?i.setAttribute("data-open",""):i.removeAttribute("data-open"),c?i.setAttribute("data-active",""):i.removeAttribute("data-active")}for(const r of Xt){const i=t.querySelector(`[data-sve-css-box-side="${r.suffix}"]`);if(!i)continue;const a=s?`${s}${Sn[r.suffix]??r.suffix}`:"";a&&ho(a)?i.setAttribute("data-active",""):i.removeAttribute("data-active")}}function Yi(e,t){const o=t.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=[...rt,...Mt,...Bt],s=(l,u)=>{const f=n.find(p=>p.id===l);if(f){if(R==="tw"){Ki(e,t,l,u);return}if(f.flexDir){T(e.document),Ii(f.flexDir);return}if(f.display){T(e.document),Oi(f.display);return}if(f.property&&f.value){T(e.document),Hi(f.property,f.value);return}if(f.insert){const p=xt(f.insert),v=yt(f.insert),k=$e();T(e.document),ye(t)?.removeAttribute("data-sve-css-sub"),p&&P(k[p])===P(v)?V([{property:p,value:null}]):V([{property:p,value:v}]);return}if(f.menu==="colors"){ye(t)?.removeAttribute("data-sve-css-sub"),Ri(e,u,f.property);return}if(f.menu==="box"){Ot(e,f.property);return}if(f.menu==="display"){Ot(e,"display");return}f.menu==="spacing"&&Mo(e,u,f.property)}};let r=!1;const i=Bt.map((l,u)=>{const f={...l,icon:Je[l.id]||"",sep:u===0||l.group==="align"&&!r};return l.group==="align"&&!r&&(r=!0),f});xe(o,Ws,{tools:rt.map(l=>({...l,icon:Je[l.id]||""})),onTool:l=>s(l,t.querySelector(`[data-sve-css-tool="${l}"]`))});const a=t.querySelector('[data-sve-css-sub="box"]');a&&!a._sveBound&&(a._sveBound=!0,xe(a,Xs,{sides:Xt.map(l=>({...l,icon:Je[`box-${l.id}`]||""})),onSide:l=>{const u=ye(t)?.getAttribute("data-sve-css-sub"),f=a.querySelector(`[data-sve-css-box-side="${l}"]`),p=`${u}${l}`,v=R==="tw"?{}:$e();if(!(u!=="padding"&&u!=="margin"||!f)){if(R==="tw"){Oo(e,f,`${u}${Sn[l]??l}`);return}if(p in v){T(e.document),V([{property:p,value:null}]);return}Mo(e,f,p),Z(e)}}}));const c=t.querySelector('[data-sve-css-sub="display"]');c&&!c._sveBound&&(c._sveBound=!0,xe(c,er,{items:Mt.map(l=>({...l,icon:Je[l.id]||""})),extras:i,onTool:l=>s(l,t.querySelector(`[data-sve-css-tool="${l}"]`))})),e.document.addEventListener("mousedown",l=>{l.target.closest(`#${w}, [data-sve-css-tools], [data-sve-css-subrow], [data-sve-html-tools], [data-sve-css-add-class]`)||T(e.document)},!0)}function Gi(e,t){const o=t.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,xe(o,Rs,{tools:wt.map(n=>({...n,icon:Gr[n.id]||""})),onTool:n=>{const s=wt.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){zi(e,r);return}T(e.document),Fn(s.tag)}}}),Zi(e,t),Qi(e,t))}function Zi(e,t){const o=t.querySelector("[data-sve-antlers-tools]");!o||o._sveBound||(o._sveBound=!0,xe(o,Do,{label:g(e,"code_dock_antlers"),groups:gs.map(n=>({id:n.id,label:g(e,n.lang),items:xs.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>Ji(n)}))}function Ji(e){const t=ys(e),o=m.html;if(!t||!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.trim()?he(s.text):bt(o,s)||he(s.text),{text:i,cursor:a}=ot(t.snippet);at(Ho(i,r),a),oe()}function Qi(e,t){const o=t.querySelector("[data-sve-visual-edit-tools]");!o||o._sveBound||(o._sveBound=!0,xe(o,Do,{label:g(e,"code_dock_visual_edit"),groups:xr.map(n=>({id:n.id,label:g(e,n.lang),items:Uo.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>ta(n)}))}function ea(e,t,o,n){if(kr(o.inner,n.attr)){e.focus();return}const{text:s,cursor:r}=ot(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(t[i-1]);)i--;e.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),oe()}function ta(e){const t=yr(e),o=m.html;if(!t||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=Ye();if(s?.open){const f=br(n,s.open.from,s.open.to,Ze);if(f){t.attr?ea(o,n,f,t):(o.dispatch({selection:{anchor:f.openIdx+2+Ze.length}}),o.focus());return}const p=s.open.from+1+s.name.length,v=t.standalone||`{{ ${Ze} ${t.attr} }}`,{text:k,cursor:x}=ot(v);o.dispatch({changes:{from:p,to:p,insert:` ${k}`},selection:{anchor:p+1+x}}),oe();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),a=i.text.trim()?he(i.text):bt(o,i)||he(i.text),c=t.standalone||`{{ ${Ze} ${t.attr} }}`,{text:l,cursor:u}=ot(c);at(Ho(l,a),u),oe()}function Wn(e){if(!_e||!E||String(E).startsWith("view:")){uo(e);return}const t=os(_e,e.document);uo(e,t.length?{sectionUids:t}:void 0)}function oa(e,t,o){return Pe=e.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Cn(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:t,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{}})}).then(async n=>{if(n.status===423){L=!0,Se=!0,Ee(e),gt(W,!0),U(e),F(e.document,g(e,"code_dock_locked"));return}if(!n.ok)throw new Error(String(n.status));E===t&&(W=o,F(e.document,g(e,"code_dock_saved")),pe(e),e.setTimeout(()=>{const s=e.document.getElementById(d)?.querySelector("[data-sve-code-status]");s&&s.textContent===g(e,"code_dock_saved")&&(s.textContent="")},1800)),Wn(e),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}).catch(()=>{F(e.document,g(e,"code_dock_error"))}).finally(()=>{Pe=null}),Pe}function ie(e){J&&(clearTimeout(J),J=null);const t=E,o=b,n=m.html;if(!n||n.state.readOnly||!t||!o)return;const s=so();ro(s,W)||(F(e,g(o,"code_dock_saving")),oa(o,t,s))}function na(e,t){J&&clearTimeout(J),J=e.setTimeout(()=>{J=null,ie(t)},jr)}function me(e){if(z)return;const t=so();if(ro(t,W)){pe(e);return}if(pe(e),!no(e)){F(e.document,g(e,"code_dock_unsaved"));return}F(e.document,g(e,"code_dock_saving")),na(e,e.document)}let be=null,ze=null;function sa(){return be||(be=Mr({Decoration:Ut,StateField:Ft,StateEffect:Vt,RangeSetBuilder:Wt,EditorView:ne})),be}function ra(){return ze||(ze=Or({Decoration:Ut,StateField:Ft,StateEffect:Vt,RangeSetBuilder:Wt,EditorView:ne})),ze}function ia(e,t,o){m[t]?.destroy();const n=Tt.of([{key:"Mod-s",run:()=>(ie(e.document),!0)}]);m[t]=new ne({state:st.create({doc:"",extensions:[Xo(),Yo(),Go(),en(),Jr(t),on(),tn({tooltipClass:()=>"sve-tw-complete"}),...t==="html"?[ln.data.of({autocomplete:ls(e)}),cs(an,e)]:[],...t==="html"?[...hs(),ms()]:[],Tt.of([...Zo,...t==="html"?[{key:"Tab",run:vs}]:[],Jo,...Qo,...rn,...nn]),n,ne.lineWrapping,...t==="html"||t==="css"?sa().extensions:[],...t==="html"?ra().extensions:[],Re[t].of(st.readOnly.of(!!L)),je[t].of(ne.editable.of(!L)),ne.updateListener.of(s=>{t==="html"&&s.docChanged&&!z&&(yi(),Pt("dock:html-changed")),t==="css"&&s.docChanged&&!z&&bi(),s.docChanged&&me(e),t==="css"&&(s.docChanged||s.selectionSet)&&Z(e),t==="html"&&(s.docChanged||s.selectionSet)&&kt(e)}),...Zr()]}),parent:o})}function aa(e){if(!e||e.querySelector(".cm-editor"))return;e.replaceChildren();const t=e.ownerDocument.createElement("span");t.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",e.appendChild(t)}let tt=null;async function la(e){const t=e.document;ri(t);let o=t.getElementById(d);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-subrow]")&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-7")){for(const s of j)m[s]?.destroy(),m[s]=null;o.remove(),o=null}if(!o){o=t.createElement("div"),o.id=d,o.setAttribute("data-sve-code-chrome","scope-7"),xe(o,Ds,{htmlLabel:g(e,"code_dock_html"),cssLabel:g(e,"code_dock_css"),jsLabel:g(e,"code_dock_js"),treeIcon:bn}),Lt(t,o),$o(o),Mn(o,An(e)),fi(e,o),hi(e,o),pi(e,o),Yi(e,o),Vi(e,o),Ui(e,o),Gi(e,o),Ao(e,o),Eo(e,o),Co(e,o),To(e,o);for(const n of j){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);aa(s)}_.openHtmlTreePanel?.(e)}if(Lt(t,o),$o(o),Ao(e,o),Eo(e,o),Co(e,o),To(e,o),ci(e),Yt(e),Ee(e),U(e),Ve(e),pe(e),ao(e),await qr(),!m.html){for(const n of j){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),ia(e,n,s)}for(const n of["html","css"])m[n]&&Br(e,m[n],{onOpen:s=>vi(e,s),emptyLabel:g(e,"code_dock_partials_empty"),sectionValues:()=>mi(e),isLocked:()=>lt(),setHover:(s,r)=>be?.setHover(s,r)});Pr(e,m.html,{onRename:n=>_i(e,n),isLocked:()=>lt(),setHover:(n,s)=>ze?.setHover(n,s),title:g(e,"code_dock_css_rename_class")})}return o}function Un(e){return tt||(tt=la(e).finally(()=>{tt=null})),tt}async function Lo(e,t){const o=await Un(e);E=t,L=!0,Se=!0,W={html:"",css:"",js:""},oo(),Ee(e),gt(W,!0),In(e.document,t),F(e.document,g(e,"code_dock_missing")),U(e),Ve(e),pe(e),Fe(e,o)}async function _t(e,t,o="replace"){o==="replace"?ue=[]:o==="push"&&E&&E!==t&&ue.push(E);const n=++Ie;E=t,Se=!1,oo(),F(e.document,g(e,"code_dock_loading"));const s=await Un(e);Ee(e),U(e),Ve(e),pe(e),ao(e),Fe(e,s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(t)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async r=>{if(n!==Ie)return;if(r.status===404){Lo(e,t);return}if(!r.ok)throw new Error(String(r.status));const i=await r.json();n===Ie&&(W={html:typeof i.html=="string"?i.html:"",css:typeof i.css=="string"?i.css:"",js:typeof i.js=="string"?i.js:""},E=t,L=!!i.locked,Se=!0,Ee(e),gt(W,L),In(e.document,i.path||t),F(e.document,L?g(e,"code_dock_locked"):""),U(e),Ve(e),pe(e),Fe(e,s))}).catch(()=>{n===Ie&&(Lo(e,t),F(e.document,g(e,"code_dock_error")))})}function ca(){return E||""}function da(e){return!!e?.getElementById(d)}function lt(){return L}function ua(e,t){const o=typeof t?.html=="string"?t.html.trim():"",n=typeof t?.css=="string"?t.css.trim():"",s=typeof t?.js=="string"?t.js.trim():"";if(!o&&!n&&!s||!e?.document?.getElementById(d))return!1;let r=!1;return o&&(r=fa("html",o)||r),n&&(r=Io("css",n)||r),s&&(r=Io("js",s)||r),r&&me(e),r}function fa(e,t){const o=m[e];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,c=`${s===`
`?"":`
`}${t}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}}),!0}function Io(e,t){const o=m[e];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${t}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function pa(e){if(Wn(e),!E||!e.document.getElementById(d))return;const t=E;E=null,_t(e,t,"keep")}function ha(e){Ie+=1,ie(e),_e=null,E=null,ue=[],W={html:"",css:"",js:""},L=!1,Se=!1,N=null,ge=null,oo(),b=e?.defaultView||b,T(e),ee(e),se(e),e?.getElementById(K)?.remove();for(const o of j)m[o]?.destroy(),m[o]=null;e?.getElementById(d)?.remove(),li(),e&&Gt(e,0);const t=e?.defaultView||b;t?.document.getElementById(_.HTML_TREE_PANEL_ID)&&_.closeHtmlTreePanel?.(t)}function ma(e){if(Ne)return;const t=e.document.getElementById(d);t&&(Yt(e),Fe(e,t))}function va(e,t,o){if(o){const r=fo(o,t)||fo(o,e.document)||o;return String(typeof _.setTypeForUid=="function"&&(_.setTypeForUid(r,t)||_.setTypeForUid(r,e.document))||"").trim()}const n=typeof _.sectionField=="function"?_.sectionField(e):"page_sections",s=typeof _.activeContainers=="function"?_.activeContainers(e.document):[];for(const r of s){const a=(_.unwrapRef?.(r.values)||r.values)?.[n];if(Array.isArray(a))for(const c of a){const l=typeof c?.type=="string"?c.type.trim():"";if(l)return l}}return""}function ga(e){if((e.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=e.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(e.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof _.activeContainers=="function"?_.activeContainers(e.document):[];for(const r of s){const i=_.unwrapRef?.(r.values)||r.values,a=typeof i?.view=="string"?i.view.trim():"";if(!a||a.includes(".."))continue;const c=a.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(c)return`view:${c}`}return""}function xa(e,t){const o=_.chromeInlineKind||_.activeChromeKind;if(o!=="header"&&o!=="footer"||!_.chromeHost?.(t)&&!_.chromeEditorOpen?.(t))return"";const s=(_.unwrapRef?.(_.chromeContainer?.()?.values)||{})[o==="footer"?"footer_style":"header_style"]||"style_1";return`${o}/${s}`}function ya(e){const t=_.globalSectionHost?.(e)||e.getElementById("__sve-global-section-host");return t&&t.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function ba(e,t,o){if(Ne)return;if(!e||!t||ei(t)||!es(e)||!ts(e)){t&&ha(t);return}const n=xa(e,t)||ya(t)||va(e,t,o)||ga(e)||(o?"":E),s=!!(o&&o!==_e);if(b=e,o&&(_e=o),!!n&&!(n===E&&t.getElementById(d))){if(ue.length&&E&&E!==n){const r=ue[0];if(n===r&&!s)return;ue=[]}ie(t),_t(e,n,"replace")}}is("tw:changed",()=>{b&&R==="tw"&&Z(b)});ae("dock:is-open",e=>da(e));ae("dock:is-locked",()=>lt());ae("dock:html",()=>pt());ae("dock:reveal-html",({from:e,to:t}={})=>{const o=m.html;if(!o||e==null)return;H=Ke(b),ft(),Me();const n=A.length,s=Math.max(0,Math.min(e,n)),r=Math.max(s,Math.min(t??e,n));if(y=r>s?{from:s,to:r}:null,H&&y){eo(),U(b);return}if(M){to(),U(b);return}o.dispatch({selection:{anchor:s,head:r},scrollIntoView:!0}),o.focus()});ae("dock:insert-snippet",({win:e,parts:t})=>ua(e,t));ae("dock:refresh",e=>pa(e));ae("dock:current-type",()=>ca());ae("dock:current-uid",()=>_e);ae("dock:set-html",e=>{if(typeof e!="string"||lt())return!1;const t=m.html;if(!t||!b)return!1;if(A=e,M)return mt(Dn()),me(b),Pt("dock:html-changed"),!0;const o=t.state.doc.toString();return o!==e&&t.dispatch({changes:{from:0,to:o.length,insert:e}}),!0});_.syncCodeDock=ba;export{Da as ARMED_KEY,ha as closeCodeDock,La as closeCodeDockPopups,Ia as codeDockStyleMode,ca as currentTemplateType,ua as insertAiSnippet,ts as isCodeDockArmed,lt as isCodeDockLocked,da as isCodeDockOpen,pa as refreshCodeDockFromDisk,ma as relayoutCodeDock,Pa as setCodeDockArmed,ba as syncCodeDock,es as templateDockAllowed};
