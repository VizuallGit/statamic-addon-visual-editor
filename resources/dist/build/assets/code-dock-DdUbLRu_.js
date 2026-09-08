const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-Dpuj8sxX.js","./index-B5fiB6ig.js","./index-eMi007Cw.js","./index-zsjA895l.js","./index-BsAZfAgM.js","./index-D2YMCfE7.js","./html-tag-sync-BlP2Mk13.js","./index-BatCsQTe.js","./tw-compile-C3ijWMMD.js","./addon-Covp0AlI.js","./addon-BEt8DEMP.css","./tw-classes-Bmgteckf.js","./html-pick-align-gkRPeJkt.js","./tw-classes-hUqO4r8J.css"])))=>i.map(i=>d[i]);
import{o as $,c as w,a as g,t as Y,b as ko,F as j,e as ae,f as R,I as Ss,d as Dt,n as $s,Q as _o,T as ws,a2 as Cs,K as As,w as So,L as Es,s as _,a3 as Uo,a4 as Ko,a5 as $o,a6 as Ts,a7 as wo,J,a8 as Te,a9 as Yt,i as xe,aa as Co,A as Ce,l as Me,ab as Ms,$ as Bs,a0 as Ls,N as Os,O as te,ac as Is,ad as Ds}from"./addon-Covp0AlI.js";import{p as Xo,t as Yo,a as Hs,b as js,c as Ht,r as Ps,d as et,e as jt,f as Rs,g as qs,h as zs,j as Bt}from"./tw-classes-Bmgteckf.js";import{h as Ns,a as Fs,e as Vs,A as Ws,b as Us,c as Ks,d as lt,i as Zo}from"./html-tag-sync-BlP2Mk13.js";const Xs={class:"sve-code-dock"},Ys={"data-sve-code-bar":""},Zs={type:"button","data-sve-code-pane-btn":"html"},Gs={type:"button","data-sve-code-pane-btn":"css"},Js={type:"button","data-sve-code-pane-btn":"js"},Qs={type:"button","data-sve-html-scope":"","aria-pressed":"true"},er=["innerHTML"],tr={"data-sve-code-panes":""},or={"data-sve-code-pane":"html"},nr={"data-sve-code-pane-label":""},sr={"data-sve-code-pane":"css"},rr={"data-sve-css-chrome":"subrow-2"},ir={"data-sve-code-pane-label":""},ar={"data-sve-css-label":""},lr={"data-sve-code-pane":"js"},cr={"data-sve-code-pane-label":""},dr={__name:"CodeDockChrome",props:{htmlLabel:{type:String,required:!0},cssLabel:{type:String,required:!0},jsLabel:{type:String,required:!0},treeIcon:{type:String,required:!0}},setup(e){return(t,o)=>($(),w("div",Xs,[o[14]||(o[14]=g("div",{"data-sve-code-grip":"","aria-hidden":"true"},null,-1)),g("div",Ys,[g("button",Zs,Y(e.htmlLabel),1),g("button",Gs,Y(e.cssLabel),1),g("button",Js,Y(e.jsLabel),1),o[0]||(o[0]=ko('<button type="button" data-sve-code-back hidden></button><span data-sve-code-path></span><span data-sve-code-status></span><button type="button" data-sve-code-history></button><button type="button" data-sve-style-mode></button>',5)),g("button",Qs,[g("span",{innerHTML:e.treeIcon},null,8,er)]),o[1]||(o[1]=g("button",{type:"button","data-sve-code-autosave":"","aria-pressed":"true"},null,-1)),o[2]||(o[2]=g("button",{type:"button","data-sve-code-save":"",hidden:""},null,-1)),o[3]||(o[3]=g("button",{type:"button","data-sve-code-lock":"",hidden:""},null,-1))]),o[15]||(o[15]=g("div",{"data-sve-code-lock-banner":""},null,-1)),g("div",tr,[g("div",or,[g("div",nr,[g("span",null,Y(e.htmlLabel),1),o[4]||(o[4]=g("div",{"data-sve-html-tools":""},null,-1)),o[5]||(o[5]=g("div",{"data-sve-visual-edit-tools":""},null,-1)),o[6]||(o[6]=g("div",{"data-sve-antlers-tools":""},null,-1))]),o[7]||(o[7]=g("div",{"data-sve-code-host":""},null,-1))]),o[12]||(o[12]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"html"},null,-1)),g("div",sr,[g("div",rr,[g("div",ir,[g("span",ar,Y(e.cssLabel),1),o[8]||(o[8]=ko('<button type="button" data-sve-css-add-class></button><div data-sve-css-tools></div><div data-sve-css-subrow><div data-sve-css-sub="box"></div><div data-sve-css-sub="display"></div></div>',3))])]),o[9]||(o[9]=g("div",{"data-sve-code-host":""},null,-1)),o[10]||(o[10]=g("div",{"data-sve-tw-host":""},null,-1))]),o[13]||(o[13]=g("div",{"data-sve-code-split":"","data-sve-code-split-after":"css"},null,-1)),g("div",lr,[g("div",cr,[g("span",null,Y(e.jsLabel),1)]),o[11]||(o[11]=g("div",{"data-sve-code-host":""},null,-1))])])]))}},ur=["data-sve-html-tool","data-tip","aria-label","data-letter","onClick","onContextmenu"],fr=["innerHTML"],pr={__name:"CodeDockHtmlTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>($(!0),w(j,null,ae(e.tools,n=>($(),w("button",{key:n.id,type:"button","data-sve-html-tool":n.id,"data-tip":n.title,"aria-label":n.title,"data-letter":n.letter?"":void 0,onClick:R(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:R(s=>e.onTool(n.id),["prevent"])},[n.letter?($(),w(j,{key:0},[Ss(Y(n.letter),1)],64)):($(),w("span",{key:1,innerHTML:n.icon},null,8,fr))],40,ur))),128))}},hr=["aria-label"],mr={value:""},vr=["label"],gr=["value"],Go={__name:"CodeDockAntlersSelect",props:{label:{type:String,required:!0},groups:{type:Array,required:!0},onPick:{type:Function,required:!0}},setup(e){const t=e;function o(n){const s=n.target.value;n.target.value="",s&&t.onPick(s)}return(n,s)=>($(),w("select",{"data-sve-antlers-select":"","aria-label":e.label,onChange:o},[g("option",mr,Y(e.label),1),($(!0),w(j,null,ae(e.groups,r=>($(),w("optgroup",{key:r.id,label:r.label},[($(!0),w(j,null,ae(r.items,i=>($(),w("option",{key:i.id,value:i.id},Y(i.label),9,gr))),128))],8,vr))),128))],40,hr))}},yr=["data-sve-css-item"],xr=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],br={__name:"CodeDockCssTools",props:{tools:{type:Array,required:!0},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>($(!0),w(j,null,ae(e.tools,n=>($(),w("li",{key:n.id,"data-sve-css-item":n.id},[g("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:R(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:R(s=>e.onTool(n.id),["prevent"])},null,40,xr)],8,yr))),128))}},kr={key:0,"data-sve-css-sep":"","aria-hidden":"true"},_r=["data-sve-css-box-side","data-tip","aria-label","innerHTML","onClick"],Sr={__name:"CodeDockCssBoxRow",props:{sides:{type:Array,required:!0},onSide:{type:Function,required:!0}},setup(e){return(t,o)=>($(!0),w(j,null,ae(e.sides,n=>($(),w(j,{key:n.id},[n.sep?($(),w("span",kr)):Dt("",!0),g("button",{type:"button","data-sve-css-box-side":n.suffix,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:R(s=>e.onSide(n.suffix),["prevent","stop"])},null,8,_r)],64))),128))}},$r={key:0,"data-sve-css-sep":"","aria-hidden":"true"},wr=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Cr={"data-sve-css-flex-extras":""},Ar={key:0,"data-sve-css-sep":"","aria-hidden":"true"},Er=["data-sve-css-tool","data-tip","aria-label","innerHTML","onClick","onContextmenu"],Tr={__name:"CodeDockCssDisplayRow",props:{items:{type:Array,required:!0},extras:{type:Array,default:()=>[]},onTool:{type:Function,required:!0}},setup(e){return(t,o)=>($(),w(j,null,[($(!0),w(j,null,ae(e.items,n=>($(),w(j,{key:n.id},[n.sep?($(),w("span",$r)):Dt("",!0),g("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:R(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:R(s=>e.onTool(n.id),["prevent"])},null,40,wr)],64))),128)),g("div",Cr,[($(!0),w(j,null,ae(e.extras,n=>($(),w(j,{key:n.id},[n.sep?($(),w("span",Ar)):Dt("",!0),g("button",{type:"button","data-sve-css-tool":n.id,"data-tip":n.title,"aria-label":n.title,innerHTML:n.icon,onClick:R(s=>e.onTool(n.id),["prevent","stop"]),onContextmenu:R(s=>e.onTool(n.id),["prevent"])},null,40,Er)],64))),128))])],64))}},Mr={key:0,"data-sve-css-swatches":""},Br=["data-sve-css-token","title","data-active","onClick"],Lr=["data-sve-css-token","data-active","onClick"],vt={__name:"CodeDockMenu",props:{kind:{type:String,required:!0},swatches:{type:Array,default:()=>[]},choices:{type:Array,default:()=>[]},onClear:{type:Function,default:null},onPick:{type:Function,required:!0}},setup(e){return(t,o)=>e.kind==="colors"?($(),w("div",Mr,[g("button",{type:"button","data-sve-css-clear":"",title:"Clear",onClick:o[0]||(o[0]=R((...n)=>e.onClear&&e.onClear(...n),["prevent","stop"]))},[...o[1]||(o[1]=[g("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none",stroke:"currentColor","stroke-width":"1.5"},[g("path",{d:"M2 2l6 6M8 2L2 8"})],-1)])]),($(!0),w(j,null,ae(e.swatches,n=>($(),w("button",{key:n.name,type:"button","data-sve-css-swatch":"","data-sve-css-token":n.name,title:n.name,"data-active":n.active?"":void 0,style:$s({background:n.hex||"transparent"}),onClick:R(s=>e.onPick(n.name),["prevent","stop"])},null,12,Br))),128))])):($(!0),w(j,{key:1},ae(e.choices,n=>($(),w("button",{key:n.value,type:"button","data-sve-css-choice":"","data-sve-css-token":n.token||void 0,"data-active":n.active?"":void 0,onClick:R(s=>e.onPick(n.value),["prevent","stop"])},Y(n.label),9,Lr))),128))}},Or={"data-sve-css-add-label":""},Ir=["placeholder","onKeydown"],Jo={__name:"CodeDockAddClass",props:{label:{type:String,required:!0},placeholder:{type:String,default:""},initial:{type:String,default:""},onAdd:{type:Function,required:!0}},setup(e){const t=e,o=_o(t.initial||""),n=_o(null);ws(()=>Cs(()=>{n.value?.focus(),n.value?.select()}));function s(){const r=o.value.trim();if(!r){n.value?.focus();return}t.onAdd(r)}return(r,i)=>($(),w(j,null,[g("label",Or,Y(e.label),1),As(g("input",{ref_key:"input",ref:n,"data-sve-css-add-input":"","onUpdate:modelValue":i[0]||(i[0]=a=>o.value=a),type:"text",placeholder:e.placeholder,onKeydown:[So(R(s,["prevent"]),["enter"]),i[1]||(i[1]=So(R(()=>{},["stop"]),["escape"]))]},null,40,Ir),[[Es,o.value]])],64))}};function Dr(e){const t=String(e||""),o=/\bclass\s*=\s*("([^"]*)"|'([^']*)')/gi,n=new Set;let s;for(;s=o.exec(t);){const r=(s[2]??s[3]??"").replace(/\{\{[\s\S]*?\}\}/g," ");for(const i of r.split(/\s+/)){const a=i.trim();!a||a==="["||a==="]"||a.includes("{")||a.includes("}")||n.add(a)}}return[...n]}function sl(e){const t=/@utility\s+([A-Za-z0-9_-]+)/g,o=new Set;let n;for(;n=t.exec(String(e||""));)o.add(n[1]);return o}const Qo=/^\.[a-zA-Z_][\w-]*$/;function en(e){const t=String(e||"").match(/\[\s*([\s\S]*?)\s*\]/);return t?t[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).filter(o=>/^[a-zA-Z_][\w-]*$/.test(o)):[]}function Hr(e){const t=String(e||"").match(/\sclass\s*=\s*(["'])([^"']*)\1/i);return t?en(t[2]):[]}function gt(e){const t=String(e||""),o=[],n=/\sclass\s*=\s*(["'])/gi;let s;for(;s=n.exec(t);){const r=s[1],i=s.index+s[0].length,a=t.indexOf(r,i);if(a===-1)break;const c=t.slice(i,a).match(/\[([\s\S]*?)\]/);if(c){const u=c[1],f=i+c.index+1,p=u.replace(/\{\{[\s\S]*?\}\}/g,y=>" ".repeat(y.length)),v=/[a-zA-Z_][\w-]*/g;let k;for(;k=v.exec(p);)o.push({name:k[0],from:f+k.index,to:f+k.index+k[0].length})}n.lastIndex=a+1}return o}function Ao(e,t){return gt(e).find(o=>t>=o.from&&t<=o.to)||null}function Eo(e,t){const o=String(e||""),n=gt(o);let s=o;for(let r=n.length-1;r>=0;r-=1){const i=n[r],a=t(i.name);if(a!==i.name){if(!a){let l=i.from,c=i.to;s[c]===" "?c+=1:l>0&&s[l-1]===" "&&(l-=1),s=s.slice(0,l)+s.slice(c);continue}s=s.slice(0,i.from)+a+s.slice(i.to)}}return s}function tn(e){const t=[],o=/(^|[^\w-])\.([a-zA-Z_][\w-]*)\s*\{/g;let n;for(;n=o.exec(String(e||""));)t.push(n[2]);return t}function on(e,t){const o=[],n=[],s=[];let r=0,i=0;for(;r<e.length&&i<t.length;){if(e[r]===t[i]){r+=1,i+=1;continue}const a=t.indexOf(e[r],i),l=e.indexOf(t[i],r);a===-1&&l===-1?(o.push({from:e[r],to:t[i]}),r+=1,i+=1):a===-1?(s.push(e[r]),r+=1):l===-1||a<=l?(n.push(t[i]),i+=1):(s.push(e[r]),r+=1)}for(;r<e.length;)s.push(e[r]),r+=1;for(;i<t.length;)n.push(t[i]),i+=1;return{renamed:o,added:n,removed:s}}function ke(e){let t=String(e||"").trim().replace(/^\.+/,"").replace(/\s+/g,"-").replace(/[^a-zA-Z0-9_-]/g,"");return/^[a-zA-Z_]/.test(t)||(t=t.replace(/^[^a-zA-Z_]+/,"")),Qo.test(`.${t}`)?t:""}function jr(e,t){const o=String(e||""),n=ke(t);if(!o||!n)return o;const s=o.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(s){const r=s[1];let i=s[2];const a=[...i.matchAll(/\[([\s\S]*?)\]/g)];if(a.length){const l=a.map(v=>v[1].trim()).filter(Boolean).join(" "),u=en(`[ ${l} ]`).includes(n)?l:`${l} ${n}`.trim(),f=i.indexOf("["),p=i.lastIndexOf("]");i=`${i.slice(0,f)}[ ${u} ]${i.slice(p+1)}`.replace(/\s+/g," ").trim()}else i=`[ ${n} ] ${i}`.replace(/\s+/g," ").trim();return o.slice(0,s.index)+` class=${r}${i}${r}`+o.slice(s.index+s[0].length)}return/\/\s*>$/.test(o)?o.replace(/(\s*)(\/\s*>)$/,` class="[ ${n} ]"$1$2`):o.replace(/(\s*)>$/,` class="[ ${n} ]"$1>`)}function Pr(e,t){const o=String(e).indexOf(">",t.from);return o===-1?"":e.slice(t.from,o+1)}function nn(e,t){const o=[];for(const n of t){const s=Hr(Pr(e,n)),r=nn(e,n.children||[]);if(s.length){o.push({className:s[0],children:r});for(const i of s.slice(1))o.push({className:i,children:[]})}else o.push(...r)}return o}function yt(e){return nn(e,Xo(e))}function ct(e){return String(e).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Zt(e,t){if(e.startsWith("/*",t)){const o=e.indexOf("*/",t+2);return o===-1?e.length:o+2}return t}function Gt(e,t){let o=0;for(let n=t;n<e.length;n+=1){if(e.startsWith("/*",n)){n=Zt(e,n)-1;continue}if(e[n]==="{")o+=1;else if(e[n]==="}"&&(o-=1,o===0))return n}return-1}function Z(e,t){const o=String(e||""),n=new RegExp(`(^|[^\\w-])\\.${ct(t)}\\s*\\{`,"g");let s;for(;s=n.exec(o);){const r=s.index+s[1].length,i=o.indexOf("{",r);if(i===-1)continue;const a=Gt(o,i);if(a!==-1)return{from:r,brace:i,close:a,to:a+1,name:t}}return null}function Rr(e){const t=String(e||""),o=[],n={},s=[];let r=0,i="";const a=()=>{const l=i.trim();l&&o.push(l),i=""};for(;r<t.length;){if(t.startsWith("/*",r)){const l=Zt(t,r);i+=t.slice(r,l),r=l;continue}if(t[r]==="{"){const l=i.trim(),c=Gt(t,r);if(c===-1)break;const u=t.slice(r+1,c);i="",Qo.test(l)?n[l.slice(1)]=u:l&&s.push(`${l} {${u}}`),r=c+1;continue}i+=t[r],r+=1}return a(),{decls:o.join(`
`),classes:n,other:s}}function To(e,t){const o="    ".repeat(t);return String(e||"").split(`
`).map(n=>n.trim()?o+n.trim():"").filter((n,s,r)=>n||s>0&&s<r.length-1).join(`
`)}function qr(e,t){const o=Z(e,t);return o?String(e).slice(o.brace+1,o.close):""}function sn(e,t,o){const n=Rr(qr(t,e.className)),s="    ".repeat(o),r=[];n.decls&&r.push(To(n.decls.replace(/;+\s*$/,";"),o+1));for(const a of n.other)r.push(To(a,o+1));for(const a of e.children)r.push(sn(a,t,o+1));const i=r.filter(Boolean).join(`
`);return i?`${s}.${e.className} {
${i}
${s}}`:`${s}.${e.className} {
${s}}`}function Jt(e,t){return t?.length?t.map(o=>sn(o,e,0)).join(`

`)+`
`:""}function rn(e){const t=String(e||"").match(/^\s*\.([a-zA-Z_][\w-]*)\s*\{/);return t?t[1]:""}function zr(e){const t=[],o=/\.([a-zA-Z_][\w-]*)\s*\{/g;let n,s=!0;for(;n=o.exec(String(e||""));){if(s){s=!1;continue}t.push(n[1])}return t}function Nr(e,t){const o=String(e).lastIndexOf(`
`,t-1)+1,n=e.slice(o,t);return/^\s*$/.test(n)?n:""}function Fr(e,t){return t?e.split(`
`).map((o,n)=>n===0||!o?o:t+o).join(`
`):e}function Vr(e,t){let o=0;for(let n=0;n<t.from;n+=1){if(e.startsWith("/*",n)){n=Zt(e,n)-1;continue}e[n]==="{"?o+=1:e[n]==="}"&&(o-=1)}return o===0}function Qt(e,t,o){const n=rn(t)||o;if(!n)return String(e||"");let s=String(t||"").trim();s?new RegExp(`^\\.${ct(n)}\\s*\\{`).test(s)||(s=`.${n} {
${s}
}`):s=`.${n} {
}`;let r=String(e||"");const i=Z(r,n),a=zr(s);if(i){const c=Nr(r,i.from);r=r.slice(0,i.from)+Fr(s,c)+r.slice(i.to)}else r=`${r.trimEnd()}${r.trim()?`
`:""}${s}
`;const l=Z(r,n);if(!l)return r;for(const c of[...new Set(a)].reverse()){const u=new RegExp(`(^|[^\\w-])\\.${ct(c)}\\s*\\{`,"g"),f=[];let p;for(;p=u.exec(r);){const v=p.index+p[1].length,k=r.indexOf("{",v),y=Gt(r,k);y!==-1&&f.push({from:v,to:y+1})}for(const v of f.reverse()){if(v.from>=l.from&&v.to<=l.to||!Vr(r,v))continue;let k=v.from;const y=r.lastIndexOf(`
`,k-1)+1;/^\s*$/.test(r.slice(y,k))&&(k=y);let I=v.to;r[I]===`
`&&(I+=1),r=r.slice(0,k)+r.slice(I)}}return r}function Lt(e,t){const o=String(e||"");return`${o.trimEnd()}${o.trim()?`
`:""}.${t} {
}
`}function Wr(e,t,o){const n=ke(o);return!t||!n||t===n?String(e||""):Z(e,n)?an(e,t):String(e||"").replace(new RegExp(`(^|[^\\w-])\\.${ct(t)}(\\s*\\{)`,"g"),`$1.${n}$2`)}function an(e,t){let o=String(e||"");for(;;){const n=Z(o,t);if(!n)break;let s=n.from;const r=o.lastIndexOf(`
`,s-1)+1;/^\s*$/.test(o.slice(r,s))&&(s=r);let i=n.to;o[i]===`
`&&(i+=1),o=o.slice(0,s)+o.slice(i)}return o}function Ur(e,t,o){const n=Array.isArray(t)?t:[],s=Array.isArray(o)?o:[],{renamed:r,added:i}=on(n,s),a=new Set(s);let l=String(e||"");for(const c of r){const u=ke(c.to);if(u){if(a.has(c.from)){Z(l,u)||(l=Lt(l,u));continue}Z(l,c.from)?l=Wr(l,c.from,u):Z(l,u)||(l=Lt(l,u))}}for(const c of i){const u=ke(c);!u||Z(l,u)||(l=Lt(l,u))}return l}function Kr(e,t,o){const n=new Set(Array.isArray(t)?t:[]),s=new Set(Array.isArray(o)?o:[]);let r=String(e||"");for(const i of s)n.has(i)||(r=an(r,i));return r}const tt="visual_edit",Xr=[{id:"base",lang:"code_dock_visual_edit_base"},{id:"field",lang:"code_dock_visual_edit_field"}],ln=[{id:"tag",group:"base",label:"{{ visual_edit }}",standalone:"{{ visual_edit| }}"},{id:"ve_popup",group:"base",label:"popup",attr:'popup="true"'},{id:"ve_orderable",group:"base",label:"orderable",attr:'orderable="true"'},{id:"ve_section_orderable",group:"base",label:"section_orderable",attr:'section_orderable="true"'},{id:"ve_outline_inside",group:"base",label:"outline_inside",attr:'outline_inside="true"'},{id:"ve_field",group:"field",label:"field",attr:'field="|"'},{id:"ve_inline_edit",group:"field",label:"inline_edit",attr:'inline_edit="true"'},{id:"ve_insertable",group:"field",label:"insertable",attr:'insertable="true"'},{id:"ve_toolbar",group:"field",label:"toolbar",attr:'toolbar="true"'},{id:"ve_scope",group:"field",label:"scope",attr:'scope="|"'},{id:"ve_controls",group:"field",label:"controls",attr:'controls="|"'}];function Yr(e){return ln.find(t=>t.id===e)||null}function Zr(e,t,o,n){let s=t;for(;s<o;){const r=e.indexOf("{{",s);if(r===-1||r>=o)return null;const i=e.indexOf("}}",r+2);if(i===-1||i+2>o)return null;const a=e.slice(r+2,i);if((a.trim().split(/\s+/)[0]||"")===n)return{openIdx:r,closeIdx:i,inner:a};s=i+2}return null}function Gr(e,t){const o=String(t).split("=")[0].trim();return new RegExp(`(^|\\s)${o}(=|\\s|$)`).test(e)}const fe="__sve-partial-menu",Jr=/\{\{#([\s\S]*?)#\}\}/g,Mo=/\{\{\s*partial(?::([^\s}]+)|(?=[\s}]))([\s\S]*?)\}\}/gi,Ot=new Map;function cn(e){const t=String(e||"").replace(Jr,s=>" ".repeat(s.length)),o=[];Mo.lastIndex=0;let n;for(;n=Mo.exec(t);){const s=(n[1]||"").trim(),i=(n[2]||"").match(/\bsrc\s*=\s*(["'])([^"']+)\1/i),a=s||(i?i[2].trim():"");!a||a.includes("..")||o.push({from:n.index,to:n.index+n[0].length,src:a})}return o}function Bo(e,t){return cn(e).find(o=>t>=o.from&&t<=o.to)||null}const Qr=new Set(["if","elseif","else","unless","foreach","forelse","noparse","once","cache","nocache","section","yield","partial","slot","switch","case","vite","sve_html","sve_css","sve_js","sve_tw","style_push","script_push"]);function ei(e,t){const o=[],n=/\{\{\s*(\/?)([A-Za-z_][A-Za-z0-9_]*)\b[\s\S]*?\}\}/g;let s;for(;s=n.exec(String(e||""));){const i=s[2];if(!Qr.has(i.toLowerCase())){if(!s[1]){o.push({name:i,from:s.index,to:null});continue}for(let a=o.length-1;a>=0;a-=1)if(o[a].name===i&&o[a].to==null){o[a].to=s.index+s[0].length;break}}}let r=null;for(const i of o)i.to==null||t<i.from||t>i.to||(!r||i.to-i.from<r.to-r.from)&&(r=i);return r?.name||null}function ti(e,t){const o=new Set,n=s=>{if(Array.isArray(s)){if(!t){for(const r of s)r&&typeof r=="object"&&typeof r.type=="string"&&r.type&&o.add(r.type),n(r);return}s.forEach(n);return}if(!(!s||typeof s!="object")){if(t&&Array.isArray(s[t]))for(const r of s[t])r&&typeof r=="object"&&typeof r.type=="string"&&r.type&&o.add(r.type);Object.values(s).forEach(n)}};return n(e),o}function oi(e,t,o,n){if(!e.src.includes("{")||!n)return t;const s=ei(o,e.from),r=ti(n,s);return s?t.filter(i=>r.has(i.label)):r.size===0?t:t.filter(i=>r.has(i.label))}function ni(e,t){if(Ot.has(t))return Ot.get(t);const o=e.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(t)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(n=>n.ok?n.json():{items:[]}).then(n=>Array.isArray(n.items)?n.items:[]).catch(()=>[]);return Ot.set(t,o),o}let Re=null;function Lo(e){e.clearTimeout(Re),Re=null}function si(e,t){Re||(Re=e.setTimeout(()=>{Re=null,t?.()},180))}function oe(e){e?.getElementById(fe)?.remove()}function ri(e,t,o,n,{onOpen:s,emptyLabel:r,onStay:i,onLeave:a}){const l=e.document;oe(l);const c=l.createElement("div");if(c.id=fe,c.style.left=`${Math.max(8,Math.round(o))}px`,c.style.top=`${Math.max(8,Math.round(n))}px`,t.length)t.forEach(k=>{const y=l.createElement("button");y.type="button",y.setAttribute("data-sve-partial-choice",""),y.textContent=k.label,y.title=k.path||k.type,y.addEventListener("click",I=>{I.preventDefault(),I.stopPropagation(),oe(l),s?.(k.type)}),c.appendChild(y)});else{const k=l.createElement("div");k.setAttribute("data-sve-partial-empty",""),k.textContent=r||"",c.appendChild(k)}l.body.appendChild(c);const u=c.getBoundingClientRect(),f=8;let p=u.left,v=u.top;u.right>e.innerWidth-f&&(p=Math.max(f,e.innerWidth-u.width-f)),u.bottom>e.innerHeight-f&&(v=Math.max(f,e.innerHeight-u.height-f)),c.style.left=`${Math.round(p)}px`,c.style.top=`${Math.round(v)}px`,c.addEventListener("mouseenter",()=>i?.()),c.addEventListener("mouseleave",()=>a?.())}function ii(e){const t=e.Decoration.mark({class:"sve-cm-partial"}),o=e.Decoration.line({class:"sve-cm-partial-line"}),n=e.StateEffect.define(),s=e.StateField.define({create(i){return Oo(i,e,t)},update(i,a){return a.docChanged?Oo(a.state,e,t):i},provide:i=>e.EditorView.decorations.from(i)}),r=e.StateField.define({create(){return e.Decoration.none},update(i,a){let l;for(const p of a.effects)p.is(n)&&(l=p.value);if(l===void 0)return a.docChanged?e.Decoration.none:i;if(!l)return e.Decoration.none;const c=new e.RangeSetBuilder,u=a.state.doc.lineAt(l.from),f=a.state.doc.lineAt(l.to);for(let p=u.number;p<=f.number;p+=1){const v=a.state.doc.line(p);c.add(v.from,v.from,o)}return c.finish()},provide:i=>e.EditorView.decorations.from(i)});return{extensions:[s,r],setHover(i,a){i&&i.dispatch({effects:n.of(a)})}}}function Oo(e,t,o){const n=new t.RangeSetBuilder;for(const s of cn(e.doc.toString()))n.add(s.from,s.to,o);return n.finish()}function ai(e,t,{onOpen:o,emptyLabel:n,sectionValues:s,isLocked:r,setHover:i}){if(!t?.dom||t.dom._svePartialBound)return;t.dom._svePartialBound=!0;let a=null,l="",c="";const u=()=>{Lo(e),e.clearTimeout(a),a=null,c="",l="",i?.(t,null),oe(e.document)},f={stay:()=>Lo(e),leave:()=>si(e,u)},p=()=>{e.clearTimeout(a),a=null,c="",i?.(t,null)},v=()=>!!r?.(),k=(y,I,D,{click:de}={})=>{if(v()){oe(e.document),i?.(t,null);return}l=y.src,ni(e,y.src).then(Ie=>{if(l!==y.src)return;const _s=t.state.doc.toString(),Qe=oi(y,Ie,_s,s?.()||null);if(Qe.length===1){de&&(oe(e.document),o?.(Qe[0].type));return}!Qe.length&&!de||ri(e,Qe,I,D,{onOpen:o,emptyLabel:n,onStay:f.stay,onLeave:f.leave})})};t.dom.addEventListener("mousemove",y=>{if(v()){u();return}const I=t.posAtCoords({x:y.clientX,y:y.clientY});if(I==null)return;const D=Bo(t.state.doc.toString(),I);if(!D){e.clearTimeout(a),a=null,c="",f.leave();return}f.stay(),i?.(t,{from:D.from,to:D.to}),!(c===D.src&&a)&&(p(),c=D.src,a=e.setTimeout(()=>{const de=t.coordsAtPos(D.from);k(D,de?.left??y.clientX,(de?.bottom??y.clientY)+6)},280))}),t.dom.addEventListener("mouseleave",y=>{if(y.relatedTarget?.closest?.(`#${fe}`)){f.stay();return}f.leave()}),t.dom.addEventListener("click",y=>{if(v()){oe(e.document);return}const I=t.posAtCoords({x:y.clientX,y:y.clientY});if(I==null)return;const D=Bo(t.state.doc.toString(),I);D&&(p(),k(D,y.clientX,y.clientY+8,{click:!0}))}),li(e.document)||(e.document.addEventListener("mousedown",y=>{y.target.closest(`#${fe}, .sve-cm-partial`)||oe(e.document)}),e.document._svePartialDismiss=!0)}function li(e){return!!e._svePartialDismiss}const ne="__sve-css-rename-chip",ci='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';function di(e){const t=e.Decoration.mark({class:"sve-cm-css-token"}),o=e.StateEffect.define();return{extensions:[e.StateField.define({create(){return e.Decoration.none},update(s,r){let i;for(const l of r.effects)l.is(o)&&(i=l.value);if(i===void 0)return r.docChanged?e.Decoration.none:s;if(!i)return e.Decoration.none;const a=new e.RangeSetBuilder;return a.add(i.from,i.to,t),a.finish()},provide:s=>e.EditorView.decorations.from(s)})],setHover(s,r){s&&s.dispatch({effects:o.of(r)})}}}function ie(e){e?.getElementById(ne)?.remove()}function ui(e,t,o,n){t.style.left=`${Math.max(6,Math.min(o,e.innerWidth-28))}px`,t.style.top=`${Math.max(6,n)}px`}function fi(e,t,o,{onRename:n,title:s}){const r=e.document,i=t.coordsAtPos(o.to);if(!i)return;ie(r);const a=r.createElement("button");a.id=ne,a.type="button",a.innerHTML=ci,a.title=s,a.setAttribute("aria-label",s),a.addEventListener("mousedown",l=>{l.preventDefault(),l.stopPropagation(),ie(r),n?.(o)}),a.addEventListener("mouseleave",()=>{e.setTimeout(()=>{t.dom.matches(":hover")||a.matches(":hover")||ie(r)},120)}),r.body.appendChild(a),ui(e,a,i.right+2,i.top-1)}function pi(e,t,{onRename:o,isLocked:n,setHover:s,title:r}){if(!t?.dom||t.dom._sveClassTokenBound)return;t.dom._sveClassTokenBound=!0;let i=null,a="";const l=()=>!!n?.(),c=()=>{e.clearTimeout(i),i=null,a="",s?.(t,null),ie(e.document)},u=f=>{if(l()){c();return}c(),o?.(f)};t.dom.addEventListener("mousemove",f=>{if(l()){c();return}if(f.target?.closest?.(`#${ne}`))return;const p=t.posAtCoords({x:f.clientX,y:f.clientY});if(p==null)return;const v=Ao(t.state.doc.toString(),p);if(!v){e.clearTimeout(i),i=null,a="",s?.(t,null);return}const k=`${v.from}:${v.to}:${v.name}`;s?.(t,{from:v.from,to:v.to}),!(a===k&&(i||e.document.getElementById(ne)))&&(e.clearTimeout(i),a=k,i=e.setTimeout(()=>{i=null,fi(e,t,v,{onRename:u,title:r||"Rename class"})},160))}),t.dom.addEventListener("mouseleave",f=>{f.relatedTarget?.closest?.(`#${ne}`)||e.setTimeout(()=>{e.document.getElementById(ne)?.matches(":hover")||c()},160)}),t.dom.addEventListener("dblclick",f=>{if(l())return;const p=t.posAtCoords({x:f.clientX,y:f.clientY});if(p==null)return;const v=Ao(t.state.doc.toString(),p);v&&(f.preventDefault(),f.stopPropagation(),u(v))},!0),t.scrollDOM?.addEventListener("scroll",c),e.document._sveClassTokenDismiss||(e.document._sveClassTokenDismiss=!0,e.document.addEventListener("mousedown",f=>{f.target.closest(`#${ne}`)||ie(e.document)}))}let re,Pt,dn,un,fn,ge,dt,eo,to,oo,no,pn,hn,mn,vn,gn,yn,xn,bn,kn,_n,Sn,$n,wn,Cn,An,En,L,De=null;function hi(){return De||(De=Promise.all([J(()=>import("./index-Dpuj8sxX.js").then(e=>e.i),__vite__mapDeps([0,1]),import.meta.url),J(()=>import("./index-B5fiB6ig.js"),[],import.meta.url),J(()=>import("./index-eMi007Cw.js"),__vite__mapDeps([2,1,0,3,4]),import.meta.url),J(()=>import("./index-D2YMCfE7.js"),__vite__mapDeps([5,1,0,3,4]),import.meta.url),J(()=>import("./html-tag-sync-BlP2Mk13.js").then(e=>e.g),__vite__mapDeps([6,0,1,7,4,3,5,2]),import.meta.url),J(()=>import("./index-BatCsQTe.js").then(e=>e.i),__vite__mapDeps([7,4,3,1,0]),import.meta.url),J(()=>import("./html-tag-sync-BlP2Mk13.js").then(e=>e.f),__vite__mapDeps([6,0,1,7,4,3,5,2]),import.meta.url),J(()=>import("./index-zsjA895l.js"),__vite__mapDeps([3,4,1,0]),import.meta.url),J(()=>import("./index-BsAZfAgM.js").then(e=>e.i),[],import.meta.url)]).then(([e,t,o,n,s,r,i,a,l])=>{re=e.EditorView,Pt=e.keymap,dn=e.lineNumbers,un=e.highlightActiveLine,fn=e.highlightActiveLineGutter,ge=t.Compartment,dt=t.EditorState,eo=t.StateField,to=t.StateEffect,oo=t.RangeSetBuilder,no=e.Decoration,pn=o.defaultKeymap,hn=o.indentWithTab,mn=o.historyKeymap,vn=o.history,gn=n.autocompletion,yn=n.closeBrackets,xn=n.closeBracketsKeymap,bn=n.closeCompletion,kn=n.completionKeymap,_n=e.hoverTooltip,Sn=s.htmlLanguage,$n=s.html,wn=r.css,Cn=i.javascript,An=a.HighlightStyle,En=a.syntaxHighlighting,L=l.tags,Fe.html=new ge,Fe.css=new ge,Fe.js=new ge,Ve.html=new ge,Ve.css=new ge,Ve.js=new ge}).catch(e=>{throw De=null,e}),De)}const d="__sve-code-dock",Io="__sve-code-dock-style",Rt="__sve-code-dock-tip",X="__sve-code-dock-unlock",Tn="sve-code-dock-height",Mn="sve-code-dock-panes",Bn="sve-code-dock-widths",so="sve-html-scope-v2",Ln="sve-code-dock-autosave",On="sve-code-dock-style-mode",mi=280,In=120,It=140,vi=250,z=["html","css","js"],gi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',yi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.9-1"/></svg>',xi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',Dn='<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>',bi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.4 16.3A8.5 8.5 0 1 1 18.3 6.3"/><path d="M21 3.2v5.4h-5.4"/></svg>',ki='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>',_i='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',T="__sve-css-menu",Hn=["h1","h2","h3","h4","h5","h6"],qt=[{id:"heading",title:"heading",menu:"heading",letter:"H"},{id:"p",title:"paragraph",tag:"p",letter:"P"},{id:"div",title:"div",tag:"div"},{id:"section",title:"section",tag:"section"},{id:"ul",title:"list",tag:"ul"},{id:"li",title:"list item",tag:"li"}],Si=["--size-100","--size-200","--size-300","--size-400","--size-500","--size-600","--size-700","--size-800","--size-900","--gutter"],ro=[{id:"all",suffix:"",title:"All sides"},{id:"block",suffix:"-block",title:"Top and bottom",sep:!0},{id:"block-start",suffix:"-block-start",title:"Top"},{id:"block-end",suffix:"-block-end",title:"Bottom"},{id:"inline",suffix:"-inline",title:"Left and right",sep:!0},{id:"inline-start",suffix:"-inline-start",title:"Left"},{id:"inline-end",suffix:"-inline-end",title:"Right"}],jn={display:"display",absolute:"position",color:"color",bg:"background-color",padding:"padding",margin:"margin","tw-text":"font-size","tw-leading":"line-height","tw-font":"font-family","tw-radius":"border-radius","tw-gap":"gap","tw-align":"text-align","tw-w":"width","tw-h":"height","tw-maxw":"max-width","tw-overflow":"overflow","tw-border":"border-color"},Pn={"display-flex":"flex","flex-row":"flex-row","flex-col":"flex-col","justify-start":"justify-start","justify-center":"justify-center","justify-end":"justify-end","justify-between":"justify-between","justify-around":"justify-around","align-start":"items-start","align-center":"items-center","align-end":"items-end","align-stretch":"items-stretch"},Rn=[{id:"tw-text",title:"Font size"},{id:"tw-leading",title:"Line height"},{id:"tw-font",title:"Font family"},{id:"tw-align",title:"Text align"},{id:"tw-border",title:"Border color"},{id:"tw-radius",title:"Radius"},{id:"tw-gap",title:"Gap"},{id:"tw-w",title:"Width"},{id:"tw-h",title:"Height"},{id:"tw-maxw",title:"Max width"},{id:"tw-overflow",title:"Overflow"}],$i={"tw-text":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 13 5 3l3.5 10M2.7 10h4.6"/><path d="M12.5 3.5v9M11 5l1.5-1.5L14 5M11 11l1.5 1.5L14 11"/></svg>',"tw-leading":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h8.5M6 8h8.5M6 12.5h8.5"/><path d="M2.5 4.5v7M1.4 5.6 2.5 4.5l1.1 1.1M1.4 10.4l1.1 1.1 1.1-1.1"/></svg>',"tw-font":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.2V3h10v1.2M8 3v10M6 13h4"/></svg>',"tw-radius":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13.5v-6a5 5 0 0 1 5-5h6"/><path d="M13.5 6.5v7h-7" stroke-dasharray="2 2"/></svg>',"tw-gap":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.6" y="3" width="4.2" height="10" rx=".6"/><rect x="10.2" y="3" width="4.2" height="10" rx=".6"/><path d="M8 4.5v7"/></svg>',"tw-align":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3.5h12M2 8h8M2 12.5h10"/></svg>',"tw-w":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3.5v9M14 3.5v9"/><path d="M4.5 8h7"/><path d="M6 6.2 4.2 8 6 9.8M10 6.2 11.8 8 10 9.8"/></svg>',"tw-h":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 2h9M3.5 14h9"/><path d="M8 4.5v7"/><path d="M6.2 6 8 4.2 9.8 6M6.2 10 8 11.8 9.8 10"/></svg>',"tw-maxw":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 3v10M14.5 3v10"/><path d="M5 8h6"/><path d="M6.6 6.2 4.8 8l1.8 1.8M9.4 6.2 11.2 8l-1.8 1.8"/></svg>',"tw-overflow":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><rect x="1.8" y="4.5" width="8.6" height="9.7" rx="1.2"/><path d="M6.5 1.8h7.7v7.7" stroke-linecap="round"/></svg>',"tw-border":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6"/><rect x="5.6" y="5.6" width="4.8" height="4.8" rx=".6" stroke-width="1" opacity=".45"/></svg>'},qn={"":"","-block":"-block","-inline":"-inline","-block-start":"-top","-block-end":"-bottom","-inline-start":"-left","-inline-end":"-right"},wi='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.1 12a8.9 8.9 0 1 0 2.8-6.5L3 8"/><path d="M3 3.4V8h4.6"/><path d="M12 7.4V12l3 1.8"/></svg>',Ci='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/></svg>',Ai='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/><path d="M3 17c1.5-4 3.8-5 6-3.5 1.4 1 1.7 2.5 3.4 2.9 2.2.5 3.6-.9 4.6-2.4"/></svg>',zn=[["--gray-50","#fafafa"],["--gray-100","#f5f5f5"],["--gray-200","#e5e5e5"],["--gray-300","#d4d4d4"],["--gray-400","#a3a3a3"],["--gray-500","#737373"],["--gray-600","#525252"],["--gray-700","#404040"],["--gray-800","#262626"],["--gray-900","#171717"],["--gray-950","#0a0a0a"]],qe=[{id:"display",title:"Display",menu:"display"},{id:"absolute",title:"Position",insert:"position: absolute;"},{id:"color",title:"Text color",property:"color",menu:"colors"},{id:"bg",title:"Background color",property:"background-color",menu:"colors"},{id:"padding",title:"Padding",property:"padding",menu:"box"},{id:"margin",title:"Margin",property:"margin",menu:"box"}],zt=[{id:"display-flex",title:"Flex",display:"flex"},{id:"flex-row",title:"Direction: row",flexDir:"row",sep:!0},{id:"flex-col",title:"Direction: column",flexDir:"column"}],Nt=[{id:"justify-start",title:"Justify: start",property:"justify-content",value:"flex-start"},{id:"justify-center",title:"Justify: center",property:"justify-content",value:"center"},{id:"justify-end",title:"Justify: end",property:"justify-content",value:"flex-end"},{id:"justify-between",title:"Justify: between",property:"justify-content",value:"space-between"},{id:"justify-around",title:"Justify: around",property:"justify-content",value:"space-around"},{id:"align-start",title:"Align: start",property:"align-items",value:"flex-start",group:"align"},{id:"align-center",title:"Align: center",property:"align-items",value:"center",group:"align"},{id:"align-end",title:"Align: end",property:"align-items",value:"flex-end",group:"align"},{id:"align-stretch",title:"Align: stretch",property:"align-items",value:"stretch",group:"align"}],ot={display:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="2.5" width="13" height="11" rx="1.2"/><path d="M5 6.5h6M5 9.5h4"/></svg>',"display-flex":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="3.4" height="9" rx=".4"/><rect x="6.3" y="3.5" width="3.4" height="9" rx=".4"/><rect x="10.6" y="3.5" width="3.4" height="9" rx=".4"/></svg>',"flex-row":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12"/><path d="M4.2 5.8 2 8l2.2 2.2"/><path d="M11.8 5.8 14 8l-2.2 2.2"/></svg>',"flex-col":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12"/><path d="M5.8 4.2 8 2l2.2 2.2"/><path d="M5.8 11.8 8 14l2.2-2.2"/></svg>',"justify-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="5.4" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4.6" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="8.2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-between":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3.5" width="2.4" height="9" rx=".4"/><rect x="11.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"justify-around":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3.5" width="2.4" height="9" rx=".4"/><rect x="9.6" y="3.5" width="2.4" height="9" rx=".4"/></svg>',"align-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="5.4" width="9" height="2.4" rx=".4"/></svg>',"align-center":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="4.6" width="9" height="2.4" rx=".4"/><rect x="3.5" y="9" width="9" height="2.4" rx=".4"/></svg>',"align-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3.5" y="8.2" width="9" height="2.4" rx=".4"/><rect x="3.5" y="11.6" width="9" height="2.4" rx=".4"/></svg>',"align-stretch":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx=".5"/><rect x="9" y="2" width="4" height="12" rx=".5"/></svg>',absolute:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/></svg>',color:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.4 11.2 7.4 2.4l4 8.8"/><path d="M4.7 8.4h5.4"/><rect x="1.6" y="12.8" width="12.8" height="2.2" rx=".6" fill="currentColor" stroke="none"/></svg>',bg:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M8 1.9a6.1 6.1 0 1 0 0 12.2c.85 0 1.35-.55 1.35-1.25 0-.38-.18-.66-.4-.88a1.2 1.2 0 0 1 .85-2.05h1.3A3.5 3.5 0 0 0 14.1 6.1C14.1 3.75 11.4 1.9 8 1.9Z"/><circle cx="4.9" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="8" cy="4.8" r=".95" fill="currentColor" stroke="none"/><circle cx="11.1" cy="6.5" r=".95" fill="currentColor" stroke="none"/><circle cx="4.7" cy="9.9" r=".95" fill="currentColor" stroke="none"/></svg>',padding:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/></svg>',margin:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4.5" y="4.5" width="7" height="7" rx=".6"/><path d="M2 2.5h12M2 13.5h12M2.5 2v12M13.5 2v12" stroke-dasharray="1.4 1.2"/></svg>',"box-all":'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1"/><rect x="4.5" y="4.5" width="7" height="7" rx=".4" fill="currentColor" stroke="none"/></svg>',"box-block":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-block-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="10.5" width="9.6" height="2.3" rx=".35" stroke="none"/></svg>',"box-inline":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-start":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="3.2" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>',"box-inline-end":'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.4"><rect x="1.5" y="1.5" width="13" height="13" rx="1" fill="none"/><rect x="10.5" y="3.2" width="2.3" height="9.6" rx=".35" stroke="none"/></svg>'},Ei={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>'};let nt=null,_e=null,E=null,pe=[],N={html:"",css:"",js:""},M=!1,Se=!1,b=null,He=0,Q=null,F=null,ye=null,ze=null,Ue=!1,q=!1,H=!0,B=!1,O="css",Ft=null,ut=null,ft="",st=!1,pt=!1,x=null,A="",S="",G="full",he="",ue=null,Ne=null,je=null,Pe=null,Do=!1;const h={html:null,css:null,js:null},Fe={html:null,css:null,js:null},Ve={html:null,css:null,js:null};function m(e,t,o={}){let n=e.Statamic?.$config?.get?.("sveStrings")?.[t]??t;for(const[s,r]of Object.entries(o))n=String(n).replaceAll(`:${s}`,r);return n}function Nn(e){return e.document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||e.Statamic?.$config?.get?.("csrfToken")||e.Statamic?.$config?.get?.("csrf_token")||""}function Ti(){return[re.theme({"&":{height:"auto",backgroundColor:"#1e1e1e",color:"#d4d4d4"},".cm-content":{caretColor:"#aeafad",padding:"12px 0",fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:"13px",lineHeight:"1.55"},".cm-cursor":{borderLeftColor:"#aeafad"},".cm-activeLine":{backgroundColor:"#ffffff0d"},".cm-activeLineGutter":{backgroundColor:"#ffffff0d"},".cm-gutters":{backgroundColor:"#1e1e1e",color:"#858585",border:"none",borderRight:"1px solid #3c3c3c",fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",fontSize:"13px",lineHeight:"1.55"},".cm-lineNumbers .cm-gutterElement":{paddingLeft:"8px",paddingRight:"12px"},".cm-scroller":{overflow:"visible",height:"auto",minHeight:0},".cm-selectionBackground, &.cm-focused .cm-selectionBackground":{backgroundColor:"#264f78 !important"}},{dark:!0}),En(An.define([{tag:L.keyword,color:"#569cd6"},{tag:L.string,color:"#ce9178"},{tag:L.comment,color:"#6a9955",fontStyle:"italic"},{tag:L.number,color:"#b5cea8"},{tag:L.className,color:"#d7ba7d"},{tag:L.tagName,color:"#4ec9b0"},{tag:L.propertyName,color:"#9cdcfe"},{tag:L.variableName,color:"#9cdcfe"},{tag:L.attributeName,color:"#9cdcfe"},{tag:L.attributeValue,color:"#ce9178"},{tag:L.angleBracket,color:"#808080"},{tag:L.unit,color:"#b5cea8"},{tag:L.color,color:"#ce9178"},{tag:L.bracket,color:"#ffd700"},{tag:L.punctuation,color:"#d4d4d4"},{tag:L.operator,color:"#d4d4d4"}]))]}function Mi(e){return e==="css"?wn():e==="js"?Cn():$n({autoCloseTags:!0})}function Bi(e){return e.querySelector(".live-preview")||e.body}function Vt(e,t){const o=Bi(e);t.parentElement!==o&&o.appendChild(t)}function Ho(e){if(e._sveShield)return;e._sveShield=!0;const t=o=>o.stopPropagation();for(const o of["keydown","keypress","keyup","pointerdown","pointerup","mousedown","mouseup","click","focusin"])e.addEventListener(o,t)}function Li(e){try{return new URLSearchParams(e.defaultView?.location?.search||"").has("sve-panel")}catch{return!1}}function Oi(e){const t=parseInt(Te(e,Tn)??"",10);return Number.isFinite(t)&&t>=In?t:mi}function Ii(e,t){Ce(e,Tn,String(t))}function Fn(e){try{const t=JSON.parse(Te(e,Mn)||"null");if(t&&typeof t=="object")return{html:t.html!==!1,css:t.css!==!1,js:t.js===!0}}catch{}return{html:!0,css:!0,js:!1}}function Di(e,t){Ce(e,Mn,JSON.stringify(t))}function Vn(e){try{const t=JSON.parse(Te(e,Bn)||"null");if(t&&typeof t=="object"){const o=n=>Number.isFinite(n)&&n>0?n:1;return{html:o(t.html),css:o(t.css),js:o(t.js)}}}catch{}return{html:1,css:1,js:1}}function Hi(e,t){Ce(e,Bn,JSON.stringify(t))}function ji(e){let t=e.getElementById(Io);t||(t=e.createElement("style"),t.id=Io,e.head.appendChild(t)),t.textContent=`
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
#${X} {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.5);
}
#${X} [data-sve-unlock-card] {
  width: min(420px, calc(100vw - 32px));
  padding: 20px;
  border-radius: 12px;
  background: #252526;
  color: #d4d4d4;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 16px 40px rgba(0,0,0,.45);
  font-family: ui-sans-serif, system-ui, sans-serif;
}
#${X} [data-sve-unlock-title] {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}
#${X} [data-sve-unlock-body] {
  font-size: 13px;
  line-height: 1.45;
  opacity: .75;
  margin-bottom: 18px;
}
#${X} [data-sve-unlock-actions] {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
#${X} [data-sve-unlock-actions] button {
  all: unset;
  cursor: pointer;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}
#${X} [data-sve-unlock-cancel] {
  background: rgba(255,255,255,.1);
  color: #d4d4d4;
}
#${X} [data-sve-unlock-confirm] {
  background: #b45309;
  color: #fff;
}
#${d} [data-sve-code-grip] {
  flex: 0 0 16px;
  height: 16px;
  width: 100%;
  cursor: ns-resize;
  z-index: 3;
  ${Co("ns")}
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
#${d} [data-sve-css-tools] {
  gap: 3px;
  scrollbar-width: none;
}
#${d} [data-sve-css-tools]::-webkit-scrollbar {
  display: none;
}

/**
 * A tool is one item, and its children live inside that item.
 *
 * The surface belongs to the item, so it wraps the icon and whatever it opens
 * without a single offset: everything stays in flow, nothing is drawn over
 * anything, and opening a group only makes its own item wider.
 */
#${d} [data-sve-css-item] {
  list-style: none;
  display: inline-flex;
  align-items: center;
  /* Same radius as the button's own highlight, so the shape around the icon
     is identical open and closed. */
  border-radius: 4px;
}
/* Only to the right: nothing may move the icon when the group opens. */
#${d} [data-sve-css-item][data-sve-css-open] {
  background: rgba(255,255,255,.12);
}
#${d} [data-sve-css-item][data-sve-css-open] > [data-sve-css-tool][data-open] {
  background: transparent;
}
#${d} [data-sve-css-item] > [data-sve-css-subrow] {
  padding: 0;
  background: transparent;
  border-radius: 0;
}
#${d} [data-sve-css-item] > [data-sve-css-subrow]::before {
  content: '';
  flex: 0 0 auto;
  width: 1px;
  height: 12px;
  margin: 0 6px 0 4px;
  background: rgba(255,255,255,.16);
}
#${d} [data-sve-css-chrome][data-sve-css-sub] [data-sve-css-subrow] {
  display: flex;
}
#${d} [data-sve-css-subrow] > [data-sve-css-sub] {
  display: none;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
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
  gap: 2px;
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
  background: transparent;
  opacity: 1;
}
/* The hover label lives on the body — see bindTips. A row that scrolls
   would clip anything drawn inside it. */
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
  ${Co("ew")}
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
#${ne} {
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
#${ne}:hover {
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
#${fe} {
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
#${fe} [data-sve-partial-choice] {
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
#${fe} [data-sve-partial-choice]:hover {
  background: rgba(255,255,255,.1);
}
#${fe} [data-sve-partial-empty] {
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
`}function Pi(e){const t=e.querySelector(".live-preview-editor");if(!t)return 0;const o=t.getBoundingClientRect();return o.width<40||o.right<40?0:Math.round(o.right)}function Ri(e){let t=0;for(const o of["__sve-section-picker","__sve-outline-panel","__sve-html-tree-panel","__sve-listview-panel","__sve-right-dock","__sve-chrome-designs","__sve-global-section-panel","__sve-ai-panel"]){const n=e.getElementById(o);if(!n||n.hasAttribute("data-sve-chrome-hidden")||n.hasAttribute("data-sve-right-closed")||n.style.display==="none")continue;const s=n.getBoundingClientRect();s.width>40&&s.right>e.documentElement.clientWidth-8&&(t=Math.max(t,Math.round(s.width)))}return t}function io(e){const t=e.document;if(Ne=e,typeof e.ResizeObserver!="function")return;ue||(ue=new e.ResizeObserver(()=>{Ne&&bs(Ne)}));const o=t.querySelector(".live-preview-editor"),n=t.getElementById("__sve-right-dock");o!==je&&(je&&ue.unobserve(je),je=o,o&&ue.observe(o)),n!==Pe&&(Pe&&ue.unobserve(Pe),Pe=n,n&&ue.observe(n))}function qi(){ue?.disconnect(),ue=null,Ne=null,je=null,Pe=null}function zi(e){Do||(Do=!0,e.addEventListener("sve-right-dock-change",()=>io(e)))}function ao(e,t){const o=e.querySelector(".live-preview-contents");o&&(o.style.paddingBottom=t?`${t}px`:"")}function lo(e){if(!e)return;const t=e.clientHeight,o=e.querySelector("[data-sve-code-bar]"),n=e.querySelector("[data-sve-code-lock-banner]"),s=n&&Ni(e)?.getComputedStyle(n).display!=="none"?n.offsetHeight:0,r=Math.max(64,t-(o?.offsetHeight||0)-s),i=e.querySelector("[data-sve-code-panes]");i&&(i.style.height=`${r}px`,i.style.minHeight="0",i.style.overflow="hidden"),e.querySelectorAll("[data-sve-code-host]").forEach(a=>{const l=a.closest("[data-sve-code-pane]");if(!l||l.style.display==="none")return;let c=0;for(const f of l.children)f!==a&&(c+=f.offsetHeight);const u=Math.max(64,r-c);a.style.height=`${u}px`,a.style.maxHeight=`${u}px`,a.style.minHeight="0",a.style.overflow="auto",Fi(a)})}function Ni(e){return e.ownerDocument?.defaultView||b}function Fi(e){e._sveWheelBound||(e._sveWheelBound=!0,e.addEventListener("wheel",t=>{const o=e.scrollHeight-e.clientHeight,n=e.scrollWidth-e.clientWidth;let s=!1;if(t.deltaY&&o>0){const r=Math.min(o,Math.max(0,e.scrollTop+t.deltaY));r!==e.scrollTop&&(e.scrollTop=r,s=!0)}if(t.deltaX&&n>0){const r=Math.min(n,Math.max(0,e.scrollLeft+t.deltaX));r!==e.scrollLeft&&(e.scrollLeft=r,s=!0)}s&&(t.preventDefault(),t.stopPropagation())},{passive:!1}))}function Wn(){const e=(Ne||b)?.document?.getElementById(d);e&&lo(e);for(const t of z)h[t]?.requestMeasure()}function Un(e,t){const o=Fn(e),n={};for(const s of z){const r=t.querySelector(`[data-sve-code-pane-btn="${s}"]`);n[s]=r?r.getAttribute("aria-pressed")==="true":o[s]}return n}function Kn(e,t){for(const n of z){const s=e.querySelector(`[data-sve-code-pane-btn="${n}"]`),r=e.querySelector(`[data-sve-code-pane="${n}"]`);s&&s.setAttribute("aria-pressed",t[n]?"true":"false"),r&&(r.style.display=t[n]?"flex":"none")}const o=z.filter(n=>t[n]);e.querySelectorAll("[data-sve-code-split]").forEach(n=>{const s=n.getAttribute("data-sve-code-split-after"),r=o.indexOf(s);n.style.display=r>=0&&r<o.length-1?"block":"none"}),Xn(e.ownerDocument.defaultView,e),lo(e)}function Xn(e,t){const o=Vn(e);for(const n of z){const s=t.querySelector(`[data-sve-code-pane="${n}"]`);s&&(s.style.flex=`${o[n]} 1 0`)}}function Ke(e,t){if(Ue)return;const o=e.document;Vt(o,t);const n=Oi(e),s=Pi(o),r=Ri(o);t.style.left=`${s}px`,t.style.right=`${r}px`,t.style.bottom="0",t.style.height=`${n}px`,ao(o,n),lo(t)}function Yn(e,t,o,n){const s=e.document,r=[...s.querySelectorAll("iframe")];r.forEach(u=>{u.style.pointerEvents="none"});const i=s.createElement("div");i.setAttribute("data-sve-code-drag-shield",""),i.style.cssText=`position:fixed;inset:0;z-index:2147483646;cursor:${t};user-select:none;`,s.body.appendChild(i),Ue=!0;let a=!1;const l=u=>{o(u)},c=()=>{a||(a=!0,Ue=!1,s.removeEventListener("mousemove",l),s.removeEventListener("mouseup",c),e.removeEventListener("blur",c),r.forEach(u=>{u.style.pointerEvents=""}),i.remove(),n?.())};s.addEventListener("mousemove",l),s.addEventListener("mouseup",c),e.addEventListener("blur",c)}function Vi(e,t){if(t._sveResizeBound)return;t._sveResizeBound=!0;const o=n=>{if(n.button!==0||n.target.closest("[data-sve-code-pane-btn], [data-sve-code-back], [data-sve-style-mode], [data-sve-html-scope], [data-sve-code-lock], [data-sve-code-autosave], [data-sve-code-save], .cm-editor"))return;n.preventDefault();const s=n.clientY,r=t.getBoundingClientRect().height;let i=r;Yn(e,"ns-resize",a=>{i=Math.min(Math.max(In,r+(s-a.clientY)),Math.round(e.innerHeight*.7)),t.style.height=`${i}px`,ao(e.document,i),Wn()},()=>{Ii(e,i),Ke(e,t),e.dispatchEvent(new Event("resize"))})};t.querySelector("[data-sve-code-bar]")?.addEventListener("mousedown",o),t.querySelector("[data-sve-code-grip]")?.addEventListener("mousedown",o)}function Wi(e,t){t._sveSplitBound||(t._sveSplitBound=!0,t.querySelectorAll("[data-sve-code-split]").forEach(o=>{o.addEventListener("mousedown",n=>{if(n.button!==0)return;n.preventDefault(),n.stopPropagation();const s=o.getAttribute("data-sve-code-split-after"),r=z.filter(y=>Un(e,t)[y]),i=r.indexOf(s),a=r[i],l=r[i+1];if(!a||!l)return;const c=t.querySelector(`[data-sve-code-pane="${a}"]`),u=t.querySelector(`[data-sve-code-pane="${l}"]`),f=n.clientX,p=c.getBoundingClientRect().width,v=u.getBoundingClientRect().width,k=p+v;o.setAttribute("data-active",""),Yn(e,"col-resize",y=>{const I=y.clientX-f;let D=Math.max(It,Math.min(k-It,p+I)),de=k-D;k<It*2&&(D=p,de=v);const Ie=Vn(e);Ie[a]=D,Ie[l]=de,Hi(e,Ie),Xn(e,t),Wn()},()=>{o.removeAttribute("data-active")})})}))}function Ui(e,t){t._svePaneBound||(t._svePaneBound=!0,t.querySelectorAll("[data-sve-code-pane-btn]").forEach(o=>{o.addEventListener("click",n=>{n.stopPropagation();const s=o.getAttribute("data-sve-code-pane-btn"),r=Un(e,t),i={...r,[s]:!r[s]};!i.html&&!i.css&&!i.js&&(i[s]=!0),Di(e,i),Kn(t,i)})}))}function V(e,t){const o=e.getElementById(d)?.querySelector("[data-sve-code-status]");o&&(o.textContent=t||"")}function Zn(e,t){const o=e.getElementById(d)?.querySelector("[data-sve-code-path]");o&&(o.textContent=t||"",o.title=t||"")}function Xe(e){const t=e?.document?.getElementById(d)?.querySelector("[data-sve-code-back]");t&&(t.hidden=pe.length===0,t.title=m(e,"code_dock_back"),t.setAttribute("aria-label",t.title),t.innerHTML=xi)}function jo(e,t){const o=t.querySelector("[data-sve-code-back]");!o||o._sveBound||(o._sveBound=!0,o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Yi(e)}))}function Ki(e){const t=_e,o=typeof _.activeContainers=="function"?_.activeContainers(e.document):[];for(const n of o){const s=_.unwrapRef?.(n.values)||n.values;if(!(!s||typeof s!="object")&&t&&typeof _.findPathByUid=="function"){const r=_.findPathByUid(s,t);if(r){const i=r.split("."),a=_.dataGet?.(s,i.slice(0,2).join("."));if(a&&typeof a=="object")return a}}}for(const n of o){const s=_.unwrapRef?.(n.values)||n.values;if(s&&typeof s=="object")return s}return null}function Xi(e,t){!t||t===E||(le(e.document),Mt(e,t,"push"))}function Yi(e){const t=pe.pop();if(!t){Xe(e);return}le(e.document),Mt(e,t,"keep")}function Ee(e){const t=e.document.getElementById(d),o=t?.querySelector("[data-sve-code-lock]"),n=t?.querySelector("[data-sve-code-lock-banner]");if(!t||!o)return;const s=M;t.toggleAttribute("data-sve-code-locked",s),s&&(oe(e.document),ie(e.document),be&&(be.setHover(h.html,null),be.setHover(h.css,null)),We?.setHover(h.html,null)),o.hidden=!Se,o.setAttribute("aria-pressed",M?"true":"false"),o.title=m(e,M?"code_dock_unlock":"code_dock_lock"),o.setAttribute("aria-label",o.title),o.innerHTML=M?gi:yi,n&&(n.textContent=m(e,"code_dock_locked_banner"))}function Ze(e){return e?Te(e,so)!=="0":H}function xt(e,t,o){return e!=null&&t!=null&&e>=0&&t>e&&t<=o}function bt(){const e=h.html?.state.doc.toString()??"";if(!B||!x){A=e;return}if(x.from<0||x.from>A.length||x.to<x.from){B=!1,A=e,x=null;return}A=A.slice(0,x.from)+e+A.slice(x.to),x={from:x.from,to:x.from+e.length}}function kt(){return bt(),B?A:h.html?.state.doc.toString()??N.html??""}function _t(){F=gt(kt()).map(e=>e.name)}function Be(){ye=tn(h.css?.state.doc.toString()??S)}function Gn(e,t){return Array.isArray(e)&&Array.isArray(t)&&e.length===t.length&&e.every((o,n)=>o===t[n])}function Zi(){const e=B?uo():kt(),t=yt(e);t.length&&(S=Qt(S,Jt(S,t),t[0].className))}function Jn(e,t){S=Ur(S,e,t),Zi(),S=Kr(S,t,e)}function Gi(e){if(q||M||F==null)return;const t=gt(kt()).map(o=>o.name);Gn(F,t)||(Jn(F,t),F=t,$t(),Be())}function Ji(){if(q||M||ye==null||F==null||G==="empty")return;const e=h.html,t=tn(h.css?.state.doc.toString()??"");if(!e||Gn(ye,t))return;const o=new Set(F),{renamed:n,removed:s}=on(ye,t);let r=e.state.doc.toString();const i=r;for(const a of n){const l=ke(a.to);!o.has(a.from)||!l||(r=Eo(r,c=>c===a.from?l:c))}for(const a of s)!o.has(a)||t.includes(a)||(r=Eo(r,l=>l===a?"":l));if(r!==i){q=!0;try{St(r)}finally{q=!1}}_t(),ye=t}function Qi(e,t){const o=ke(t),n=h.html;if(!o||!n||n.state.readOnly||o===e.name)return;q=!0;try{n.dispatch({changes:{from:e.from,to:e.to,insert:o}})}finally{q=!1}const s=F==null?[]:F.slice();_t(),Jn(s,F),$t(),Be(),b&&(ce(b),K(b))}function ea(e,t){const o=e.document,s=h.html?.coordsAtPos(t.from);C(o),ie(o);const r=o.createElement("div"),i={getBoundingClientRect:()=>({left:s?.left??12,right:s?.right??12,top:s?.top??12,bottom:s?.bottom??12,width:0,height:0})};r.id=T,o.body.appendChild(r),Oe(e,i,r),r._sveApp=Me(Jo,r,{label:m(e,"code_dock_css_rename_class"),placeholder:m(e,"code_dock_css_class_placeholder"),initial:t.name,onAdd:a=>{Qi(t,a),C(o)}})}function Qn(){return H&&xt(x?.from,x?.to,A.length)?(B=!0,A.slice(x.from,x.to)):(B=!1,A)}function co(e,t,o){const n=h[e];if(!n)return;const s=n.state.doc.toString();q=!0;try{s!==t?n.dispatch({changes:{from:0,to:s.length,insert:t},...o?{selection:o,scrollIntoView:!0}:{}}):o&&n.dispatch({selection:o,scrollIntoView:!0})}finally{q=!1}}function St(e,t){co("html",e,t)}function uo(){return B?h.html?.state.doc.toString()??"":xt(x?.from,x?.to,A.length)?A.slice(x.from,x.to):""}function Le(){const e=h.css?.state.doc.toString()??"";if(G==="tree"){if(e===he)return;const t=yt(uo())[0]?.className||rn(e);S=Qt(S,e,t),he=e}else G==="full"&&(S=e)}function es(e,t){for(const o of t||[])if(!Z(e,o.className)||es(e,o.children))return!0;return!1}function $t(){let e=S,t=[],o=!1;!H||!B?(G="full",e=S):(t=yt(uo()),t.length?(G="tree",e=Jt(S,t),es(S,t)&&(S=Qt(S,e,t[0].className),o=!0)):(G="empty",e="")),he=e,co("css",e),Be(),b&&(K(b),o&&ce(b))}function fo(){const e=h.html;if(!e||!x)return;B||(A=e.state.doc.toString());const t=A.length,o=Math.max(0,Math.min(x.from,t)),n=Math.max(o,Math.min(x.to,t));n<=o||(x={from:o,to:n},B=!0,St(A.slice(o,n),{anchor:0,head:0}),$t(),e.focus())}function po(e=!0){const t=h.html;if(!t)return;Le(),bt(),B=!1;const o=A||t.state.doc.toString(),n=e&&xt(x?.from,x?.to,o.length)?{anchor:x.from,head:x.to}:null;A=o,St(o,n),G="full",he=S,co("css",S),Be()}function ho(){x=null,B=!1,A="",S="",G="full",he="",F=null,ye=null}let Ye=!1;function Ae(e){return!!e?.document.getElementById(_.HTML_TREE_PANEL_ID)}function Wt(e,t){if(!(!e||_.featureOn?.(e,"html_tree")===!1)){if(!t){Ae(e)&&_.closeHtmlTreePanel?.(e);return}Ae(e)||(Ye=!0,Ms("html_tree").then(()=>{Ae(e)||_.toggleHtmlTreePanel?.(e)}).catch(()=>{}).finally(()=>{Ye=!1,U(e)}))}}function U(e){const t=e?.document.getElementById(d)?.querySelector("[data-sve-html-scope]");if(!t)return;H=Ze(e);const o=_.featureOn?.(e,"html_tree")===!1?H:Ae(e)||Ye;t.setAttribute("aria-pressed",o?"true":"false"),t.title=m(e,o?"code_dock_html_scope_off":"code_dock_html_scope"),t.setAttribute("aria-label",t.title),t.innerHTML=Dn,e.document.getElementById(d)?.toggleAttribute("data-sve-html-scoped",B)}function Po(e,t){t._sveHtmlScopeBound||(t._sveHtmlScopeBound=!0,H=Ze(e),ta(e,t),Wt(e,H),t.querySelector("[data-sve-html-scope]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),H=!(Ae(e)||Ye),Ce(e,so,H?"1":"0"),H?x&&(Le(),fo()):B&&po(),Wt(e,H),U(e)}))}function ta(e,t){t._sveTreeWatchBound||(t._sveTreeWatchBound=!0,e.addEventListener("sve-right-dock-change",()=>{if(Ye||_.featureOn?.(e,"html_tree")===!1||!e.document.getElementById(d))return;const o=Ae(e);o!==Ze(e)&&(H=o,Ce(e,so,o?"1":"0"),o?x&&(Le(),fo()):B&&po(),U(e))}))}function Ro(e,t){t._sveLockBound||(t._sveLockBound=!0,t.querySelector("[data-sve-code-lock]")?.addEventListener("click",o=>{if(o.preventDefault(),o.stopPropagation(),!(!Se||!E)){if(M){na(e);return}ts(e,!0)}}))}function mo(e){return e?Te(e,Ln)!=="0":!0}function oa(){const e=h.html;return!e||e.state.readOnly||!E?!1:!go(vo(),N)}function me(e){const t=e?.document.getElementById(d),o=t?.querySelector("[data-sve-code-autosave]"),n=t?.querySelector("[data-sve-code-save]");if(!o||!n)return;const s=mo(e),r=oa();o.setAttribute("aria-pressed",s?"true":"false"),o.title=m(e,s?"code_dock_autosave_on":"code_dock_autosave_off"),o.setAttribute("aria-label",o.title),o.innerHTML=bi,n.hidden=s,n.title=m(e,"code_dock_save"),n.setAttribute("aria-label",n.title),n.innerHTML=ki,r?n.setAttribute("data-dirty",""):n.removeAttribute("data-dirty")}function qo(e,t){t._sveAutosaveBound||(t._sveAutosaveBound=!0,t.querySelector("[data-sve-code-autosave]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation();const n=!mo(e);Ce(e,Ln,n?"1":"0"),n?le(e.document):Q&&(clearTimeout(Q),Q=null),me(e)}),t.querySelector("[data-sve-code-save]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),le(e.document)}))}function na(e){e.document.getElementById(X)?.remove();const t=Bs(e.document,Ls,{title:m(e,"code_dock_unlock_title"),body:m(e,"code_dock_unlock_body"),buttons:[{value:"cancel",label:m(e,"cancel"),variant:"ghost"},{value:"ok",label:m(e,"code_dock_unlock_confirm"),variant:"primary"}],onPick:o=>{t.dismiss(),o==="ok"&&ts(e,!1)}});t.host.id=X}function ts(e,t){const o=E;if(!o)return;const n=()=>{E===o&&e.fetch("/!/sve/section-template/lock",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Nn(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:o,locked:t})}).then(async s=>{if(!s.ok)throw new Error(String(s.status));E===o&&(M=t,Ee(e),Ge(N,t),U(e),V(e.document,t?m(e,"code_dock_locked"):""))}).catch(()=>{V(e.document,m(e,"code_dock_error"))})};if(t&&(le(e.document),ze)){ze.finally(n);return}n()}function vo(){const e={html:"",css:"",js:""};bt(),Le();for(const t of z)t==="html"?e.html=B?A:h.html?.state.doc.toString()??"":t==="css"?e.css=S:e[t]=h[t]?.state.doc.toString()??"";return e}function sa(){if(!(H&&xt(x?.from,x?.to,A.length)))return G="full",he=S,S;const e=yt(A.slice(x.from,x.to));if(!e.length)return G="empty",he="","";G="tree";const t=Jt(S,e);return he=t,t}function Ge(e,t){q=!0;try{b&&(H=Ze(b)),A=e.html??"",S=e.css??"";for(const o of z){const n=h[o];let s=e[o]??"";try{s=o==="html"?Qn():o==="css"?sa():s}catch{s=o==="html"?A||e.html||"":o==="css"?S||e.css||"":s}if(!n)continue;const r=n.state.doc.toString(),i=[Fe[o].reconfigure(dt.readOnly.of(!!t)),Ve[o].reconfigure(re.editable.of(!t))];r!==s?n.dispatch({changes:{from:0,to:r.length,insert:s},effects:i}):n.dispatch({effects:i})}}finally{q=!1}_t(),Be(),Yt("dock:html-changed"),b&&(K(b),Et(b),U(b))}function go(e,t){return e.html===t.html&&e.css===t.css&&e.js===t.js}function os(e){return String(e||"").replace(/\/\*[\s\S]*?\*\//g,"").trim().replace(/\s*:\s*/g,": ").replace(/\s*;\s*/g,";").replace(/\s+/g," ").replace(/;+$/,";")}function wt(e){const t=os(e).match(/^([a-z-]+)\s*:/i);return t?t[1].toLowerCase():""}function ra(e,t){return e===t||e.startsWith(`${t}-`)}function Ct(e){const t=os(e),o=t.indexOf(":");return o===-1?"":t.slice(o+1).replace(/;$/,"").trim().toLowerCase()}function P(e){const t=String(e||"").trim().toLowerCase();return t==="start"||t==="flex-start"||t==="left"||t==="top"?"flex-start":t==="end"||t==="flex-end"||t==="right"||t==="bottom"?"flex-end":t==="row-reverse"?"row-reverse":t==="column-reverse"?"column-reverse":t}function ht(e){const t=P(e);return t==="flex"||t==="inline-flex"}function yo(){const e=h.css;if(!e)return null;const t=e.state.selection.main.head,o=e.state.doc.toString(),n=[],s=[];for(let i=0;i<o.length;i+=1){if(o[i]==="{"&&o[i+1]==="{"){const a=o.indexOf("}}",i+2);if(a===-1)break;i=a+1;continue}if(o[i]==="{")n.push(i);else if(o[i]==="}"){const a=n.pop();a!=null&&s.push({from:a+1,to:i,text:o.slice(a+1,i),open:a})}}let r=null;for(const i of s)t<i.open||t>i.to||(!r||i.to-i.open<r.to-r.open)&&(r=i);return r}function ia(e){const t=String(e||"");let o="",n=0;for(let s=0;s<t.length;s+=1){if(t[s]==="{"&&t[s+1]==="{"){const r=t.indexOf("}}",s+2);if(r===-1)break;n===0&&(o+=t.slice(s,r+2)),s=r+1;continue}if(t[s]==="{"){n+=1;continue}if(t[s]==="}"){n=Math.max(0,n-1);continue}n===0&&(o+=t[s])}return o}function aa(e){const t={};for(const o of ia(e).split(";")){const n=wt(o);n&&(t[n]=Ct(`${o};`))}return t}function la(e,t,o){if(!t||t.from>=t.to)return null;let n=e.state.doc.lineAt(t.from),s=0;for(;n.from<=t.to;){const r=Math.max(n.from,t.from),i=Math.min(n.to,t.to),a=e.state.doc.sliceString(r,i);if(s===0&&wt(a)===o)return{from:r,to:i,text:a};if(s+=ca(a),n.to>=e.state.doc.length||n.to>=t.to)break;n=e.state.doc.lineAt(n.to+1)}return null}function ca(e){let t=0;const o=String(e);for(let n=0;n<o.length;n+=1){if(o[n]==="{"&&o[n+1]==="{"){const s=o.indexOf("}}",n+2);n=s===-1?o.length:s+1;continue}o[n]==="{"?t+=1:o[n]==="}"&&(t-=1)}return t}function ve(e){return(String(e).match(/^\s*/)||[""])[0]}function At(e,t,o){for(let n=t.number-1;n>=1;n-=1){const s=e.state.doc.line(n),r=s.text.trim();if(!r)continue;const i=ve(s.text);if(o&&(r==="{"||r.endsWith("{")))return`${i}  `;if(!(r==="}"||r.startsWith("}")))return i}return""}function da(e,t){const o=e.state.doc.lineAt(t);if(o.text.trim())return ve(o.text);const n=At(e,o,!0);if(n)return n;const s=yo();return s?ns(e,s):"  "}function ns(e,t){const o=e.state.doc.lineAt(t.from),n=e.state.doc.lineAt(Math.max(t.from,t.to));for(let r=n.number;r>=o.number;r-=1){const i=e.state.doc.line(r),a=Math.max(i.from,t.from),l=Math.min(i.to,t.to),c=e.state.doc.sliceString(a,l);if(c.trim())return(c.match(/^\s*/)||[""])[0]||"  "}return`${(e.state.doc.lineAt(Math.max(0,t.from-1)).text.match(/^\s*/)||[""])[0]}  `}function zo(){h.css?.focus(),b&&(ce(b),K(b))}function W(e){const t=h.css;if(!t||t.state.readOnly||!e.length)return;const o=yo();if(!o){const i=e.filter(a=>a.value!=null).map(a=>`${a.property}: ${a.value};`).join(`
`);i&&ha(i),zo();return}const n=[],s=[],r=ns(t,o);for(const i of e){const a=la(t,o,i.property);if(i.value==null){if(!a)continue;let l=a.from,c=a.to;t.state.doc.sliceString(c,c+1)===`
`&&(c+=1),l=Math.max(l,o.from),c=Math.min(c,o.to),n.push({from:l,to:c});continue}if(!(a&&P(Ct(a.text))===P(i.value)))if(a){const l=(a.text.match(/^\s*/)||[""])[0];n.push({from:a.from,to:a.to,insert:`${l}${i.property}: ${i.value};`})}else s.push(`${r}${i.property}: ${i.value};`)}if(s.length){const i=!o.text.includes(`
`)||!/\n\s*$/.test(o.text)?`
`:"";n.push({from:o.to,to:o.to,insert:`${i}${s.join(`
`)}
`})}n.length&&(n.sort((i,a)=>a.from-i.from||a.to-i.to),t.dispatch({changes:n})),zo()}function $e(){const e=yo();return e?aa(e.text):{}}function ua(e){const t=$e(),o=ht(t.display),n=P(t["flex-direction"])||(o?"row":"");if(o&&n===e){const s=[];t["flex-direction"]&&s.push({property:"flex-direction",value:null}),ht(t.display)&&s.push({property:"display",value:null}),W(s);return}W([{property:"display",value:"flex"},{property:"flex-direction",value:e}])}function fa(e){const t=$e();if(e==="flex"&&ht(t.display)){W([{property:"justify-content",value:null},{property:"align-items",value:null},{property:"flex-direction",value:null},{property:"display",value:null}]);return}W([{property:"display",value:e}])}function pa(e,t){const o=$e();if(P(o[e])===P(t)){W([{property:e,value:null}]);return}W([{property:e,value:t}])}function ha(e){const t=h.css;if(!t||t.state.readOnly)return;const o=t.state.selection.main.head,n=t.state.doc.lineAt(o),s=n.text.slice(0,o-n.from),r=n.text.slice(o-n.from),i=da(t,o),a=e.replace(/;?$/,";");if(s.trim()===""&&r.trim()===""){const c=`${i}${a}
${i}`;t.dispatch({changes:{from:n.from,to:n.to,insert:c},selection:{anchor:n.from+c.length}});return}const l=`
${i}${a}
${i}`;t.dispatch({changes:{from:o,to:t.state.selection.main.to,insert:l},selection:{anchor:o+l.length}})}function K(e){try{ma(e)}catch{}}function ma(e){const t=e?.document?.getElementById(d);if(t&&rs(t),O==="tw"){t&&Ha(e,t);return}const o=$e(),n=ht(o.display),s=P(o["flex-direction"])||(n?"row":""),r=t?.querySelector("[data-sve-css-tools]"),i=t?.querySelector("[data-sve-css-chrome]"),a=i?.getAttribute("data-sve-css-sub")||"",l=a==="padding"||a==="margin"?a:"";if(t){i&&(n?i.setAttribute("data-sve-css-flex-on",""):i.removeAttribute("data-sve-css-flex-on")),r&&(n?r.setAttribute("data-sve-css-flex-on",""):r.removeAttribute("data-sve-css-flex-on"));for(const c of[...qe,...zt]){const u=t.querySelector(`[data-sve-css-tool="${c.id}"]`);if(!u)continue;let f=!1;if(c.flexDir)f=n&&s===c.flexDir;else if(c.display)f=c.display==="flex"?n:P(o.display)===c.display;else if(c.insert){const p=wt(c.insert);f=!!p&&P(o[p])===P(Ct(c.insert))}else c.menu==="box"?(f=Object.keys(o).some(p=>ra(p,c.property)),a===c.property?u.setAttribute("data-open",""):u.removeAttribute("data-open")):c.menu==="display"?(f=!!o.display,a==="display"?u.setAttribute("data-open",""):u.removeAttribute("data-open")):c.property&&(f=c.property in o);f?u.setAttribute("data-active",""):u.removeAttribute("data-active")}for(const c of ro){const u=t.querySelector(`[data-sve-css-box-side="${c.suffix}"]`);if(!u)continue;!!l&&`${l}${c.suffix}`in o?u.setAttribute("data-active",""):u.removeAttribute("data-active")}for(const c of Nt){const u=t.querySelector(`[data-sve-css-tool="${c.id}"]`);if(!u)continue;P(o[c.property])===P(c.value)?u.setAttribute("data-active",""):u.removeAttribute("data-active")}}}function C(e){const t=e?.getElementById(T);t?._sveApp?.unmount(),t?.remove(),e?.querySelectorAll("[data-sve-css-tool][data-open], [data-sve-css-box-side][data-open], [data-sve-html-tool][data-open], [data-sve-css-add-class][data-open], [data-sve-code-history][data-open]").forEach(o=>o.removeAttribute("data-open"))}function va(e){C(e),ie(e);for(const t of z)h[t]&&bn?.(h[t])}function ga(e){if(nt)return nt;const t=e.Statamic?.$config?.get?.("cpUrl")||`/${e.Statamic?.$config?.get?.("cpRoute")||"cp"}`;return nt=e.fetch(`${t}/color-scheme/swatches`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async o=>{if(!o.ok)return[];const n=await o.json().catch(()=>[]);return Array.isArray(n)?n:[]}).catch(()=>[]).then(o=>{const n=new Set,s=[];for(const r of o){const i=r.var||r.value||r.handle,a=String(i||"").trim().replace(/^var\((.+)\)$/,"$1");!a||n.has(a)||(n.add(a),s.push({name:a,hex:r.hex||r.color||""}))}for(const[r,i]of zn)n.has(r)||(n.add(r),s.push({name:r,hex:i}));return s}),nt}function ss(e,t){const o=$e()[t]||"",n=String(o).match(/^var\(\s*([^)]+?)\s*\)$/i),s=n?n[1].trim():"";for(const r of e.querySelectorAll("[data-sve-css-token]"))s&&r.getAttribute("data-sve-css-token")===s?r.setAttribute("data-active",""):r.removeAttribute("data-active")}function Oe(e,t,o){const n=t.getBoundingClientRect(),s=8;o.style.left=`${Math.max(s,Math.min(n.left,e.innerWidth-220))}px`,o.style.top=`${Math.max(s,n.bottom+4)}px`}function ya(e,t,o){const n=e.document;C(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=T,n.body.appendChild(s),Oe(e,t,s);const r=i=>{s._sveApp?.unmount(),s._sveApp=Me(vt,s,{kind:"colors",swatches:i,onClear:()=>{W([{property:o,value:null}]),C(n)},onPick:a=>{W([{property:o,value:`var(${a})`}]),C(n)}}),ss(s,o)};r(zn.map(([i,a])=>({name:i,hex:a}))),ga(e).then(i=>{n.getElementById(T)&&r(i.map(a=>({name:a.name,hex:a.hex})))})}function No(e,t,o){const n=e.document;C(n),t.setAttribute("data-open","");const s=n.createElement("div");s.id=T,n.body.appendChild(s),Oe(e,t,s),s._sveApp=Me(vt,s,{kind:"choices",choices:Si.map(r=>({value:r,token:r,label:r})),onPick:r=>{W([{property:o,value:`var(${r})`}]),C(n)}}),ss(s,o)}function rs(e){const t=ee(e),o=t?.querySelector("[data-sve-css-subrow]");if(!t||!o)return;t.querySelectorAll("[data-sve-css-item][data-sve-css-open]").forEach(i=>i.removeAttribute("data-sve-css-open"));const n=t.getAttribute("data-sve-css-sub")||"",s=n?t.querySelector(`[data-sve-css-item="${n}"]`):null;if(s){o.parentElement!==s&&s.appendChild(o),s.setAttribute("data-sve-css-open","");return}const r=t.querySelector("[data-sve-code-pane-label]");r&&o.parentElement!==r&&r.appendChild(o)}function ee(e){return e?.querySelector("[data-sve-css-chrome]")}function Ut(e,t){const o=e.document.getElementById(d),n=ee(o);C(e.document),n&&(n.getAttribute("data-sve-css-sub")===t?n.removeAttribute("data-sve-css-sub"):n.setAttribute("data-sve-css-sub",t),K(e))}function is(e,t){if(e.startsWith("{{",t)){const o=e.indexOf("}}",t+2);return o===-1?e.length:o+2}if(e.startsWith("<!--",t)){const o=e.indexOf("-->",t+4);return o===-1?e.length:o+3}return t}function Kt(e,t){if(e[t]!=="<")return null;const o=e.indexOf(">",t+1);if(o===-1)return null;const n=e.slice(t,o+1),s=n.match(/^<\/([A-Za-z][A-Za-z0-9:-]*)\s*>/);if(s)return{kind:"close",name:s[1].toLowerCase(),from:t,to:o+1};const r=n.match(/^<([A-Za-z][A-Za-z0-9:-]*)/);if(!r)return{kind:"other",from:t,to:o+1};const i=r[1].toLowerCase();return{kind:/\/\s*>$/.test(n)||["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(i)?"void":"open",name:i,from:t,to:o+1}}function Fo(e,t,o){let n=1,s=o;for(;s<e.length;){const r=is(e,s);if(r!==s){s=r;continue}if(e[s]!=="<"){s+=1;continue}const i=Kt(e,s);if(!i)break;if(i.kind==="open"&&i.name===t)n+=1;else if(i.kind==="close"&&i.name===t&&(n-=1,n===0))return i;s=i.to}return null}function Je(){const e=h.html;if(!e)return null;const t=e.state.selection.main.head,o=e.state.doc.toString(),n=[];let s=0;for(;s<t;){const l=is(o,s);if(l!==s){s=l;continue}if(o[s]!=="<"){s+=1;continue}const c=Kt(o,s);if(!c||c.from>=t)break;if(c.kind==="open")n.push(c);else if(c.kind==="close"){for(let u=n.length-1;u>=0;u-=1)if(n[u].name===c.name){n.splice(u);break}}s=c.to}const r=o.lastIndexOf("<",Math.max(0,t-1));if(r!==-1&&o.indexOf(">",r)>=t){const l=Kt(o,r);if(l?.kind==="open"||l?.kind==="void"){const c=l.kind==="void"?null:Fo(o,l.name,l.to);return c?{name:l.name,open:l,close:c}:{name:l.name,open:l,close:null}}}const i=n[n.length-1];if(!i)return null;const a=Fo(o,i.name,i.to);return{name:i.name,open:i,close:a}}function Xt(e){return Hn.includes(e)}function se(){h.html?.focus(),b&&(ce(b),Et(b))}function rt(e,t,o){const n=[...t].sort((s,r)=>r.from-s.from||r.to-s.to);e.dispatch({changes:n,selection:o})}function mt(e,t){const o=h.html;if(!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.slice(0,n-s.from),i=s.text.trim()?ve(s.text):At(o,s)||ve(s.text);let a=e,l=0;if(r.trim()!=="")a=`
${i}${e}`,l=1+i.length;else if(!s.text.trim()){a=`${i}${e}`,l=i.length,o.dispatch({changes:{from:s.from,to:s.to,insert:a},selection:{anchor:s.from+l+t}});return}o.dispatch({changes:{from:n,to:o.state.selection.main.to,insert:a},selection:{anchor:n+l+t}})}function as(e){const t=h.html;if(!t||t.state.readOnly)return;const o=t.state.selection.main,n=t.state.doc.toString();if(!o.empty){const a=n.slice(o.from,o.to),l=a.match(new RegExp(`^<${e}(\\s[^>]*)?>([\\s\\S]*)</${e}>$`,"i"));if(l){rt(t,[{from:o.from,to:o.to,insert:l[2]}],{anchor:o.from,head:o.from+l[2].length}),se();return}let c=`<${e}>${a}</${e}>`,u=o.from+e.length+2;e==="ul"&&(c=`<ul>
  <li>${a}</li>
</ul>`,u=o.from+11),rt(t,[{from:o.from,to:o.to,insert:c}],{anchor:u,head:u+a.length}),se();return}const s=Je();if(s?.open&&s.close){if(s.name===e){rt(t,[{from:s.close.from,to:s.close.to,insert:""},{from:s.open.from,to:s.open.to,insert:""}],{anchor:s.open.from}),se();return}if(Xt(s.name)&&Xt(e)){const a=n.slice(s.open.from,s.open.to).replace(new RegExp(`^<${s.name}`,"i"),`<${e}`);rt(t,[{from:s.close.from,to:s.close.to,insert:`</${e}>`},{from:s.open.from,to:s.open.to,insert:a}],{anchor:s.open.from+e.length+1}),se();return}}const i=(t.state.doc.lineAt(o.head).text.match(/^\s*/)||[""])[0];if(e==="ul"){const a=`<ul>
${i}  <li></li>
${i}</ul>`;mt(a,`<ul>
${i}  <li>`.length)}else mt(`<${e}></${e}>`,e.length+2);se()}function Et(e){try{xa(e)}catch{}}function xa(e){const t=e?.document?.getElementById(d),n=Je()?.name||"";if(t)for(const s of qt){const r=t.querySelector(`[data-sve-html-tool="${s.id}"]`);if(!r)continue;(s.id==="heading"?Xt(n):n===s.tag)?r.setAttribute("data-active",""):r.removeAttribute("data-active")}}function ba(e,t){const o=e.document,n=Je()?.name||"";C(o),t.setAttribute("data-open","");const s=o.createElement("div");s.id=T,o.body.appendChild(s),Oe(e,t,s),s._sveApp=Me(vt,s,{kind:"choices",choices:Hn.map(r=>({value:r,label:r.toUpperCase(),active:n===r})),onPick:r=>{as(r),C(o)}})}function ka(e){const t=ke(e),o=h.html,n=h.css;if(!t||o?.state.readOnly||n?.state.readOnly)return;const s=Je();if(s?.open&&o){const r=o.state.doc.sliceString(s.open.from,s.open.to),i=jr(r,t);i!==r&&o.dispatch({changes:{from:s.open.from,to:s.open.to,insert:i}})}Le(),Z(S,t)||(S=`${String(S||"").trimEnd()}${S?.trim()?`
`:""}.${t} {
}
`),$t(),_t(),Be(),b&&(ce(b),Et(b),K(b))}function _a(e,t){const o=e.document;if(t.hasAttribute("data-open")){C(o);return}C(o),t.setAttribute("data-open","");const n=o.createElement("div");n.id=T,o.body.appendChild(n),Oe(e,t,n),n._sveApp=Me(Jo,n,{label:m(e,"code_dock_css_class_name"),placeholder:m(e,"code_dock_css_class_placeholder"),onAdd:s=>{ka(s),C(o)}})}function Sa(e,t){const o=t.querySelector("[data-sve-css-add-class]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=_i,o.title=m(e,"code_dock_css_add_class"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),O==="tw"){C(e.document),qs(e,o);return}_a(e,o)}))}function $a(e){const t=Math.max(0,Math.round(Date.now()/1e3-e)),o=new Date(e*1e3).toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});let n=o;try{const s=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"});t<90?n=s.format(-t,"second"):t<5400?n=s.format(-Math.round(t/60),"minute"):t<86400?n=s.format(-Math.round(t/3600),"hour"):n=s.format(-Math.round(t/86400),"day")}catch{}return`${n} · ${o}`}function ls(e,t){return e.fetch(t,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}})}async function wa(e,t){const o=e.document,n=bo();if(C(o),!n)return;let s=[];try{const i=await ls(e,`/!/sve/section-template/history?type=${encodeURIComponent(n)}`);i.ok&&(s=(await i.json())?.entries||[])}catch{s=[]}if(!o.getElementById(d)||!o.contains(t))return;t.setAttribute("data-open","");const r=o.createElement("div");r.id=T,o.body.appendChild(r),Oe(e,t,r),r._sveApp=Me(vt,r,{kind:"choices",choices:s.length?s.map(i=>({value:i.id,label:$a(i.at)})):[{value:"",label:m(e,"code_dock_history_empty")}],onPick:i=>{C(o),i&&Ca(e,n,i)}})}async function Ca(e,t,o){if(we())return;let n=null;try{const s=await ls(e,`/!/sve/section-template/history/entry?type=${encodeURIComponent(t)}&id=${encodeURIComponent(o)}`);s.ok&&(n=await s.json())}catch{n=null}!n||we()||(Ge({html:n.html??"",css:n.css??"",js:n.js??""},M),ce(e),Tt(e))}function Aa(e){let t=e.getElementById(Rt);return t||(t=e.createElement("div"),t.id=Rt,t.hidden=!0,t.style.cssText="position:fixed;z-index:100001;pointer-events:none;padding:3px 7px;border-radius:4px;background:#1f1f1f;color:#d4d4d4;border:1px solid rgba(255,255,255,.14);box-shadow:0 4px 12px rgba(0,0,0,.35);font-family:ui-sans-serif,system-ui,sans-serif;font-size:11px;line-height:1.3;white-space:nowrap;",e.body.appendChild(t),t)}function it(e){const t=e?.getElementById(Rt);t&&(t.hidden=!0)}function Ea(e,t){if(t._sveTipsBound)return;t._sveTipsBound=!0;const o=e.document;t.addEventListener("mouseover",n=>{const s=n.target?.closest?.("[data-tip]"),r=s?.getAttribute("data-tip")||"";if(!r){it(o);return}const i=Aa(o);i.textContent=r,i.hidden=!1;const a=s.getBoundingClientRect(),l=i.getBoundingClientRect(),c=8,u=a.bottom+6,f=u+l.height>e.innerHeight-c?a.top-l.height-6:u;i.style.top=`${Math.max(c,f)}px`,i.style.left=`${Math.max(c,Math.min(a.left+a.width/2-l.width/2,e.innerWidth-l.width-c))}px`}),t.addEventListener("mouseleave",()=>it(o)),t.addEventListener("pointerdown",()=>it(o),!0),e.addEventListener("scroll",()=>it(o),!0)}function Ta(e,t){const o=t.querySelector("[data-sve-code-history]");!o||o._sveBound||(o._sveBound=!0,o.innerHTML=wi,o.title=m(e,"code_dock_history"),o.setAttribute("aria-label",o.title),o.addEventListener("click",n=>{if(n.preventDefault(),n.stopPropagation(),o.hasAttribute("data-open")){C(e.document);return}wa(e,o)}))}function Ma(){return O}function Ba(e){const t=h.html;if(!t||O!=="tw")return null;const o=B&&!!x,n=o?A:t.state.doc.toString(),r=(o?x.from:0)+t.state.selection.main.from,i=Rs(Xo(n),new Set);let a=null;for(const l of i)l.from<=r&&r<l.to&&(a=l);return a}function Tt(e){O==="tw"&&Ps(e,Ba())}function xo(e){const t=e?.document.getElementById(d);if(!t)return;const o=O==="tw";t.setAttribute("data-sve-style",O);const n=t.querySelector("[data-sve-css-label]");n&&(n.textContent=o?m(e,"code_dock_style_tw"):m(e,"code_dock_css"));const s=t.querySelector("[data-sve-style-mode]");if(!s)return;const r=e.document.createElement("span");r.textContent=o?m(e,"code_dock_style_tw"):m(e,"code_dock_css"),s.innerHTML=o?Ai:Ci,s.appendChild(r),s.title=m(e,o?"code_dock_style_to_css":"code_dock_style_to_tw"),s.setAttribute("aria-label",s.title),s.setAttribute("aria-pressed",o?"true":"false")}function cs(e){const t=e?.document.getElementById(d);C(e.document),Ht(e),ee(t)?.removeAttribute("data-sve-css-sub"),xo(e),Ft?.(),O==="tw"&&Wt(e,!0),Tt(e),K(e)}function La(e,t){O=t==="tw"?"tw":"css",Ce(e,On,O),cs(e)}function Oa(e,t){t._sveStyleModeBound||(t._sveStyleModeBound=!0,O=Te(e,On)==="tw"?"tw":"css",t.querySelector("[data-sve-style-mode]")?.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),La(e,O==="tw"?"css":"tw")}),cs(e))}function Ia(e,t,o,n){const s=Pn[o];if(s){Ht(e),zs(e,s),K(e);return}const r=jn[o];if(!(!r||!n)){if(o==="display"){ee(t)?.removeAttribute("data-sve-css-sub"),jt(e,n,"display",i=>{const a=ee(t);i==="flex"||i==="inline-flex"||i==="grid"?a?.setAttribute("data-sve-css-sub","display"):a?.removeAttribute("data-sve-css-sub"),K(e)});return}if(o==="padding"||o==="margin"){Ht(e),Ut(e,r);return}ee(t)?.removeAttribute("data-sve-css-sub"),jt(e,n,r)}}function Da(e){return e==="flex"?"display":e.startsWith("justify-")?"justify-content":e.startsWith("items-")?"align-items":"flex-direction"}function Ha(e,t){const o=t.querySelector("[data-sve-css-chrome]"),n=o?.getAttribute("data-sve-css-sub")||"",s=n==="padding"||n==="margin"?n:"",r=Bt()?et("display"):"",i=r==="flex"||r==="inline-flex"||r==="grid";for(const a of[o,t.querySelector("[data-sve-css-tools]")])a&&(i?a.setAttribute("data-sve-css-flex-on",""):a.removeAttribute("data-sve-css-flex-on"));for(const[a,l]of Object.entries(Pn)){const c=t.querySelector(`[data-sve-css-tool="${a}"]`);c&&(Bt()&&et(Da(l))===l?c.setAttribute("data-active",""):c.removeAttribute("data-active"))}for(const a of[...qe,...Rn]){const l=t.querySelector(`[data-sve-css-tool="${a.id}"]`);if(!l)continue;const c=jn[a.id],u=Bt()&&!!c&&!!et(c);n===c&&(a.id==="padding"||a.id==="margin")?l.setAttribute("data-open",""):l.removeAttribute("data-open"),u?l.setAttribute("data-active",""):l.removeAttribute("data-active")}for(const a of ro){const l=t.querySelector(`[data-sve-css-box-side="${a.suffix}"]`);if(!l)continue;const c=s?`${s}${qn[a.suffix]??a.suffix}`:"";c&&et(c)?l.setAttribute("data-active",""):l.removeAttribute("data-active")}}function ja(e,t){const o=t.querySelector("[data-sve-css-tools]");if(!o||o._sveBound)return;o._sveBound=!0;const n=[...qe,...zt,...Nt],s=(c,u)=>{if(O==="tw"){Ia(e,t,c,u);return}const f=n.find(p=>p.id===c);if(f){if(f.flexDir){C(e.document),ua(f.flexDir);return}if(f.display){C(e.document),fa(f.display);return}if(f.property&&f.value){C(e.document),pa(f.property,f.value);return}if(f.insert){const p=wt(f.insert),v=Ct(f.insert),k=$e();C(e.document),ee(t)?.removeAttribute("data-sve-css-sub"),p&&P(k[p])===P(v)?W([{property:p,value:null}]):W([{property:p,value:v}]);return}if(f.menu==="colors"){ee(t)?.removeAttribute("data-sve-css-sub"),ya(e,u,f.property);return}if(f.menu==="box"){Ut(e,f.property);return}if(f.menu==="display"){Ut(e,"display");return}f.menu==="spacing"&&No(e,u,f.property)}};let r=!1;const i=Nt.map((c,u)=>{const f={...c,icon:ot[c.id]||"",sep:u===0||c.group==="align"&&!r};return c.group==="align"&&!r&&(r=!0),f});Ft=()=>{const c=O==="tw"?[...qe,...Rn]:qe;ee(t)?.removeAttribute("data-sve-css-sub"),rs(t),xe(o,br,{tools:c.map(u=>({...u,icon:ot[u.id]||$i[u.id]||""})),onTool:u=>s(u,t.querySelector(`[data-sve-css-tool="${u}"]`))})},Ft();const a=t.querySelector('[data-sve-css-sub="box"]');a&&!a._sveBound&&(a._sveBound=!0,xe(a,Sr,{sides:ro.map(c=>({...c,icon:ot[`box-${c.id}`]||""})),onSide:c=>{const u=ee(t)?.getAttribute("data-sve-css-sub"),f=a.querySelector(`[data-sve-css-box-side="${c}"]`),p=`${u}${c}`,v=O==="tw"?{}:$e();if(!(u!=="padding"&&u!=="margin"||!f)){if(O==="tw"){jt(e,f,`${u}${qn[c]??c}`);return}if(p in v){C(e.document),W([{property:p,value:null}]);return}No(e,f,p),K(e)}}}));const l=t.querySelector('[data-sve-css-sub="display"]');l&&!l._sveBound&&(l._sveBound=!0,xe(l,Tr,{items:zt.map(c=>({...c,icon:ot[c.id]||""})),extras:i,onTool:c=>s(c,t.querySelector(`[data-sve-css-tool="${c}"]`))})),e.document.addEventListener("mousedown",c=>{c.target.closest(`#${T}, [data-sve-css-tools], [data-sve-css-subrow], [data-sve-html-tools], [data-sve-css-add-class]`)||C(e.document)},!0)}function Pa(e,t){const o=t.querySelector("[data-sve-html-tools]");!o||o._sveBound||(o._sveBound=!0,xe(o,pr,{tools:qt.map(n=>({...n,icon:Ei[n.id]||""})),onTool:n=>{const s=qt.find(i=>i.id===n),r=o.querySelector(`[data-sve-html-tool="${n}"]`);if(s){if(s.menu==="heading"){ba(e,r);return}C(e.document),as(s.tag)}}}),Ra(e,t),za(e,t))}function Ra(e,t){const o=t.querySelector("[data-sve-antlers-tools]");!o||o._sveBound||(o._sveBound=!0,xe(o,Go,{label:m(e,"code_dock_antlers"),groups:Ws.map(n=>({id:n.id,label:m(e,n.lang),items:Us.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>qa(n)}))}function qa(e){const t=Ks(e),o=h.html;if(!t||!o||o.state.readOnly)return;const n=o.state.selection.main.head,s=o.state.doc.lineAt(n),r=s.text.trim()?ve(s.text):At(o,s)||ve(s.text),{text:i,cursor:a}=lt(t.snippet);mt(Zo(i,r),a),se()}function za(e,t){const o=t.querySelector("[data-sve-visual-edit-tools]");!o||o._sveBound||(o._sveBound=!0,xe(o,Go,{label:m(e,"code_dock_visual_edit"),groups:Xr.map(n=>({id:n.id,label:m(e,n.lang),items:ln.filter(s=>s.group===n.id).map(s=>({id:s.id,label:s.label}))})),onPick:n=>Fa(n)}))}function Na(e,t,o,n){if(Gr(o.inner,n.attr)){e.focus();return}const{text:s,cursor:r}=lt(n.attr);let i=o.closeIdx;for(;i>o.openIdx+2&&/\s/.test(t[i-1]);)i--;e.dispatch({changes:{from:i,to:o.closeIdx,insert:` ${s} `},selection:{anchor:i+1+r}}),se()}function Fa(e){const t=Yr(e),o=h.html;if(!t||!o||o.state.readOnly)return;const n=o.state.doc.toString(),s=Je();if(s?.open){const f=Zr(n,s.open.from,s.open.to,tt);if(f){t.attr?Na(o,n,f,t):(o.dispatch({selection:{anchor:f.openIdx+2+tt.length}}),o.focus());return}const p=s.open.from+1+s.name.length,v=t.standalone||`{{ ${tt} ${t.attr} }}`,{text:k,cursor:y}=lt(v);o.dispatch({changes:{from:p,to:p,insert:` ${k}`},selection:{anchor:p+1+y}}),se();return}const r=o.state.selection.main.head,i=o.state.doc.lineAt(r),a=i.text.trim()?ve(i.text):At(o,i)||ve(i.text),l=t.standalone||`{{ ${tt} ${t.attr} }}`,{text:c,cursor:u}=lt(l);mt(Zo(c,a),u),se()}function ds(e){if(!_e||!E||String(E).startsWith("view:")){$o(e);return}const t=Ts(_e,e.document);$o(e,t.length?{sectionUids:t}:void 0)}function Va(e,t,o){return ze=e.fetch("/!/sve/section-template",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":Nn(e),"X-Requested-With":"XMLHttpRequest"},body:JSON.stringify({type:t,html:o.html,css:o.css,js:o.js,...typeof o.tw=="string"?{tw:o.tw}:{}})}).then(async n=>{if(n.status===423){M=!0,Se=!0,Ee(e),Ge(N,!0),U(e),V(e.document,m(e,"code_dock_locked"));return}if(!n.ok)throw new Error(String(n.status));E===t&&(N=o,V(e.document,m(e,"code_dock_saved")),me(e),e.setTimeout(()=>{const s=e.document.getElementById(d)?.querySelector("[data-sve-code-status]");s&&s.textContent===m(e,"code_dock_saved")&&(s.textContent="")},1800)),ds(e),e.document.getElementById("__sve-section-picker")?.dispatchEvent(new e.CustomEvent("sve-library-stale"))}).catch(()=>{V(e.document,m(e,"code_dock_error"))}).finally(()=>{ze=null}),ze}function le(e){Q&&(clearTimeout(Q),Q=null);const t=E,o=b,n=h.html;if(!n||n.state.readOnly||!t||!o)return;const s=vo(),r=ut!==null&&Yo(o)&&us(s.html)===ft;go(s,N)&&!(r&&pt)||(r&&(s.tw=ut,pt=!1),V(e,m(o,"code_dock_saving")),Va(o,t,s))}function us(e){return Dr(e).sort().join(" ")}function fs(){ut=null,ft="",pt=!1}function ps(e,t){if(!e||!Yo(e))return;const o=us(t);o===ft||st||(st=!0,J(()=>import("./tw-compile-C3ijWMMD.js"),__vite__mapDeps([8,9,10,11,12,13,6,0,1,7,4,3,5,2]),import.meta.url).then(n=>n.compileTailwind(e,t)).then(n=>{st=!1,ut=n,ft=o,pt=!0,hs(e,e.document)}).catch(n=>{st=!1,console.error("[sve] tailwind compile",n)}))}function hs(e,t){Q&&clearTimeout(Q),Q=e.setTimeout(()=>{Q=null,le(t)},vi)}function ce(e){if(q)return;const t=vo();if(go(t,N)){me(e);return}if(me(e),ps(e,t.html),!mo(e)){V(e.document,m(e,"code_dock_unsaved"));return}V(e.document,m(e,"code_dock_saving")),hs(e,e.document)}let be=null,We=null;function Wa(){return be||(be=ii({Decoration:no,StateField:eo,StateEffect:to,RangeSetBuilder:oo,EditorView:re})),be}function Ua(){return We||(We=di({Decoration:no,StateField:eo,StateEffect:to,RangeSetBuilder:oo,EditorView:re})),We}function Ka(e,t,o){h[t]?.destroy();const n=Pt.of([{key:"Mod-s",run:()=>(le(e.document),!0)}]);h[t]=new re({state:dt.create({doc:"",extensions:[dn(),un(),fn(),vn(),Mi(t),yn(),gn({tooltipClass:()=>"sve-tw-complete"}),...t==="html"?[Sn.data.of({autocomplete:Hs(e)}),js(_n,e)]:[],...t==="html"?[...Ns(),Fs()]:[],Pt.of([...pn,...t==="html"?[{key:"Tab",run:Vs}]:[],hn,...mn,...kn,...xn]),n,re.lineWrapping,...t==="html"||t==="css"?Wa().extensions:[],...t==="html"?Ua().extensions:[],Fe[t].of(dt.readOnly.of(!!M)),Ve[t].of(re.editable.of(!M)),re.updateListener.of(s=>{t==="html"&&s.docChanged&&!q&&(Gi(),Yt("dock:html-changed")),t==="css"&&s.docChanged&&!q&&Ji(),s.docChanged&&ce(e),t==="css"&&(s.docChanged||s.selectionSet)&&K(e),t==="html"&&(s.docChanged||s.selectionSet)&&(Et(e),q||Tt(e))}),...Ti()]}),parent:o})}function Xa(e){if(!e||e.querySelector(".cm-editor"))return;e.replaceChildren();const t=e.ownerDocument.createElement("span");t.style.cssText="width:16px;height:16px;margin:12px;border:2px solid #858585;border-right-color:transparent;border-radius:50%;display:block;animation:sve-cm-wait .6s linear infinite",e.appendChild(t)}let at=null;async function Ya(e){const t=e.document;ji(t);let o=t.getElementById(d);if(o&&!(o.querySelector('[data-sve-css-chrome="subrow-2"]')&&o.querySelector("[data-sve-css-subrow]")&&o.querySelector("[data-sve-css-add-class]")&&o.querySelector("[data-sve-html-tools]")&&o.querySelector("[data-sve-visual-edit-tools]")&&o.querySelector("[data-sve-html-scope]")&&o.querySelector("[data-sve-code-lock]")&&o.querySelector("[data-sve-code-back]")&&o.querySelector("[data-sve-code-autosave]")&&o.querySelector("[data-sve-code-save]")&&o.getAttribute("data-sve-code-chrome")==="scope-7")){for(const s of z)h[s]?.destroy(),h[s]=null;o.remove(),o=null}if(!o){o=t.createElement("div"),o.id=d,o.setAttribute("data-sve-code-chrome","scope-7"),xe(o,dr,{htmlLabel:m(e,"code_dock_html"),cssLabel:m(e,"code_dock_css"),jsLabel:m(e,"code_dock_js"),treeIcon:Dn}),Vt(t,o),Ho(o),Kn(o,Fn(e)),Vi(e,o),Ui(e,o),Wi(e,o),ja(e,o),Sa(e,o),Oa(e,o),Ta(e,o),Ea(e,o),Pa(e,o),Po(e,o),Ro(e,o),jo(e,o),qo(e,o);for(const n of z){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);Xa(s)}_.openHtmlTreePanel?.(e)}if(Vt(t,o),Ho(o),Po(e,o),Ro(e,o),jo(e,o),qo(e,o),zi(e),io(e),Ee(e),U(e),Xe(e),me(e),xo(e),await hi(),!h.html){for(const n of z){const s=o.querySelector(`[data-sve-code-pane="${n}"] [data-sve-code-host]`);s?.replaceChildren(),Ka(e,n,s)}for(const n of["html","css"])h[n]&&ai(e,h[n],{onOpen:s=>Xi(e,s),emptyLabel:m(e,"code_dock_partials_empty"),sectionValues:()=>Ki(e),isLocked:()=>we(),setHover:(s,r)=>be?.setHover(s,r)});pi(e,h.html,{onRename:n=>ea(e,n),isLocked:()=>we(),setHover:(n,s)=>We?.setHover(n,s),title:m(e,"code_dock_css_rename_class")})}return o}function ms(e){return at||(at=Ya(e).finally(()=>{at=null})),at}async function Vo(e,t){const o=await ms(e);E=t,M=!0,Se=!0,N={html:"",css:"",js:""},ho(),Ee(e),Ge(N,!0),Zn(e.document,t),V(e.document,m(e,"code_dock_missing")),U(e),Xe(e),me(e),Ke(e,o)}async function Mt(e,t,o="replace"){o==="replace"?pe=[]:o==="push"&&E&&E!==t&&pe.push(E);const n=++He;E=t,Se=!1,ho(),V(e.document,m(e,"code_dock_loading"));const s=await ms(e);Ee(e),U(e),Xe(e),me(e),xo(e),Ke(e,s),e.fetch(`/!/sve/section-template?type=${encodeURIComponent(t)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(async r=>{if(n!==He)return;if(r.status===404){Vo(e,t);return}if(!r.ok)throw new Error(String(r.status));const i=await r.json();n===He&&(N={html:typeof i.html=="string"?i.html:"",css:typeof i.css=="string"?i.css:"",js:typeof i.js=="string"?i.js:""},E=t,M=!!i.locked,Se=!0,fs(),Ee(e),Ge(N,M),M||ps(e,N.html),Zn(e.document,i.path||t),V(e.document,M?m(e,"code_dock_locked"):""),U(e),Xe(e),me(e),Ke(e,s))}).catch(()=>{n===He&&(Vo(e,t),V(e.document,m(e,"code_dock_error")))})}function bo(){return E||""}function vs(e){return!!e?.getElementById(d)}function we(){return M}function gs(e,t){const o=typeof t?.html=="string"?t.html.trim():"",n=typeof t?.css=="string"?t.css.trim():"",s=typeof t?.js=="string"?t.js.trim():"";if(!o&&!n&&!s||!e?.document?.getElementById(d))return!1;let r=!1;return o&&(r=Za("html",o)||r),n&&(r=Wo("css",n)||r),s&&(r=Wo("js",s)||r),r&&ce(e),r}function Za(e,t){const o=h[e];if(!o||o.state.readOnly)return!1;const n=o.state.selection.main,s=n.from>0?o.state.doc.sliceString(n.from-1,n.from):`
`,r=n.to<o.state.doc.length?o.state.doc.sliceString(n.to,n.to+1):`
`,l=`${s===`
`?"":`
`}${t}${r===`
`?"":`
`}`;return o.dispatch({changes:{from:n.from,to:n.to,insert:l},selection:{anchor:n.from+l.length}}),!0}function Wo(e,t){const o=h[e];if(!o||o.state.readOnly)return!1;const n=o.state.doc.length,r=`${n>0&&o.state.doc.sliceString(Math.max(0,n-1),n)!==`
`?`

`:n?`
`:""}${t}
`;return o.dispatch({changes:{from:n,insert:r},selection:{anchor:n+r.length}}),!0}function ys(e){if(ds(e),!E||!e.document.getElementById(d))return;const t=E;E=null,Mt(e,t,"keep")}function xs(e){He+=1,le(e),_e=null,E=null,pe=[],N={html:"",css:"",js:""},M=!1,Se=!1,F=null,ye=null,ho(),b=e?.defaultView||b,C(e),oe(e),ie(e),e?.getElementById(X)?.remove();for(const o of z)h[o]?.destroy(),h[o]=null;e?.getElementById(d)?.remove(),qi(),e&&ao(e,0);const t=e?.defaultView||b;t?.document.getElementById(_.HTML_TREE_PANEL_ID)&&_.closeHtmlTreePanel?.(t)}function bs(e){if(Ue)return;const t=e.document.getElementById(d);t&&(io(e),Ke(e,t))}function Ga(e,t,o){if(o){const r=wo(o,t)||wo(o,e.document)||o;return String(typeof _.setTypeForUid=="function"&&(_.setTypeForUid(r,t)||_.setTypeForUid(r,e.document))||"").trim()}const n=typeof _.sectionField=="function"?_.sectionField(e):"page_sections",s=typeof _.activeContainers=="function"?_.activeContainers(e.document):[];for(const r of s){const a=(_.unwrapRef?.(r.values)||r.values)?.[n];if(Array.isArray(a))for(const l of a){const c=typeof l?.type=="string"?l.type.trim():"";if(c)return c}}return""}function Ja(e){if((e.Statamic?.$config?.get?.("sveFeatures")||{}).collection_templates!==!0)return"";const o=e.Statamic?.$config?.get?.("sveCollectionTemplatesCollection")||"templates";if(!(e.location?.pathname||"").includes(`/collections/${o}/entries/`))return"";const s=typeof _.activeContainers=="function"?_.activeContainers(e.document):[];for(const r of s){const i=_.unwrapRef?.(r.values)||r.values,a=typeof i?.view=="string"?i.view.trim():"";if(!a||a.includes(".."))continue;const l=a.replace(/\.(antlers\.html|blade\.php)$/i,"").replace(/^\/+|\/+$/g,"");if(l)return`view:${l}`}return""}function Qa(e,t){const o=_.chromeInlineKind||_.activeChromeKind;if(o!=="header"&&o!=="footer"||!_.chromeHost?.(t)&&!_.chromeEditorOpen?.(t))return"";const s=(_.unwrapRef?.(_.chromeContainer?.()?.values)||{})[o==="footer"?"footer_style":"header_style"]||"style_1";return`${o}/${s}`}function el(e){const t=_.globalSectionHost?.(e)||e.getElementById("__sve-global-section-host");return t&&t.querySelector("[data-replicator-set][data-type]")?.getAttribute("data-type")||""}function ks(e,t,o){if(Ue)return;if(!e||!t||Li(t)||!Uo(e)||!Ko(e)){t&&xs(t);return}const n=Qa(e,t)||el(t)||Ga(e,t,o)||Ja(e)||(o?"":E),s=!!(o&&o!==_e);if(b=e,o&&(_e=o),!!n&&!(n===E&&t.getElementById(d))){if(pe.length&&E&&E!==n){const r=pe[0];if(n===r&&!s)return;pe=[]}le(t),Mt(e,n,"replace")}}Os("tw:changed",()=>{b&&O==="tw"&&K(b)});te("dock:is-open",e=>vs(e));te("dock:is-locked",()=>we());te("dock:html",()=>kt());te("dock:reveal-html",({from:e,to:t}={})=>{const o=h.html;if(!o||e==null)return;H=Ze(b),bt(),Le();const n=A.length,s=Math.max(0,Math.min(e,n)),r=Math.max(s,Math.min(t??e,n));if(x=r>s?{from:s,to:r}:null,H&&x){fo(),U(b);return}if(B){po(),U(b);return}o.dispatch({selection:{anchor:s,head:r},scrollIntoView:!0}),o.focus()});te("dock:insert-snippet",({win:e,parts:t})=>gs(e,t));te("dock:refresh",e=>ys(e));te("dock:tw-follow",()=>{b&&Tt(b)});te("dock:current-type",()=>bo());te("dock:current-uid",()=>_e);te("dock:set-html",e=>{if(typeof e!="string"||we())return!1;const t=h.html;if(!t||!b)return!1;if(A=e,B)return St(Qn()),ce(b),Yt("dock:html-changed"),!0;const o=t.state.doc.toString();return o!==e&&t.dispatch({changes:{from:0,to:o.length,insert:e}}),!0});_.syncCodeDock=ks;const rl=Object.freeze(Object.defineProperty({__proto__:null,ARMED_KEY:Is,closeCodeDock:xs,closeCodeDockPopups:va,codeDockStyleMode:Ma,currentTemplateType:bo,insertAiSnippet:gs,isCodeDockArmed:Ko,isCodeDockLocked:we,isCodeDockOpen:vs,refreshCodeDockFromDisk:ys,relayoutCodeDock:bs,resetTailwindCompile:fs,setCodeDockArmed:Ds,syncCodeDock:ks,templateDockAllowed:Uo},Symbol.toStringTag,{value:"Module"}));export{Dr as a,rl as c,sl as t};
