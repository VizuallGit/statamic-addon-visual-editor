import{r as Se,_ as Ee,o as x,c as k,u as T,a as h,f as E,t as M,F as R,e as U,I as ut,d as I,m as Me,n as bt,Q as z,H as q,T as Vt,a2 as pt,K as Ut,w as j,L as Xt,j as $,l as Le,i as Ae,a9 as Q,M as F,a8 as yt,N as ze,A as Oe}from"./addon-BPQ6QsWu.js";import{H as Be}from"./html-pick-align-gkRPeJkt.js";const Kt=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function Zt(t){return String(t||"").replace(/\{\{[\s\S]*?\}\}/g,e=>" ".repeat(e.length))}function Pe(t){const e=t.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(!e)return"";const n=e[2].match(/\[\s*([\s\S]*?)\s*\]/);if(n){const o=n[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).find(r=>/^[a-zA-Z_][\w-]*$/.test(r));if(o)return o}return(e[2].trim().split(/\s+/)[0]||"").replace(/\[|\]/g,"")}function Yt(t,e,n,o){t.hidden=!0,o&&(t.wrapFrom=e,t.wrapTo=n);for(const r of t.children)Yt(r,e,n,!1)}function Gt(t,e,n,o){const r=[],a=[];let s=n,i=0;const l=d=>{a.length?a[a.length-1].children.push(d):r.push(d)};for(;s<o;){if(e[s]!=="<"){s+=1;continue}if(e.startsWith("<!--",s)){const p=e.indexOf("-->",s+4),y=p===-1||p>o?o:p,P=p===-1||p+3>o?o:p+3,st=Gt(t,e,s+4,y);for(const At of st)Yt(At,s,P,!0),l(At);s=P;continue}if(e.startsWith("<!",s)||e.startsWith("<?",s)){const p=e.indexOf(">",s+2);s=p===-1||p+1>o?o:p+1;continue}const d=e[s+1]==="/",m=e.slice(s,o).match(/^<\/?([a-zA-Z][a-zA-Z0-9:-]*)/);if(!m){s+=1;continue}const c=m[1].toLowerCase(),u=e.indexOf(">",s);if(u===-1||u>=o)break;const v=e.slice(s,u+1),b=!d&&(Kt.has(c)||/\/\s*>$/.test(v));if(d){for(let p=a.length-1;p>=0;p-=1)if(a[p].tag===c){a[p].to=u+1,a.length=p;break}s=u+1;continue}const A=Pe(t.slice(s,u+1)),N=a.length?a[a.length-1]:null,V=N?N.children:r,rt=N?`${N.path}/${V.length}:${c}`:`${V.length}:${c}`,C={id:`${c}-${s}-${i}`,tag:c,klass:A,path:rt,label:A,from:s,to:u+1,openTo:u+1,hidden:!1,children:[]};i+=1,l(C),b?C.to=u+1:a.push(C),s=u+1}for(;a.length;)a.pop().to=o;return r}function Qt(t){const e=String(t||""),n=Zt(e);return Gt(e,n,0,n.length)}function wt(t,e,n=0,o=[]){for(const r of t){const a=r.children.length>0,s=e.has(r.id);o.push({id:r.id,tag:r.tag,klass:r.klass||"",path:r.path,label:r.label,from:r.from,to:r.to,openTo:r.openTo,hidden:!!r.hidden,wrapFrom:r.wrapFrom,wrapTo:r.wrapTo,depth:n,hasChildren:a,shut:s}),a&&!s&&wt(r.children,e,n+1,o)}return o}function lo(t){return Kt.has(String(t||"").toLowerCase())}const Jt=["sm","md","lg","xl","2xl","max-sm","max-md","max-lg","max-xl","max-2xl","dark","hover","focus","focus-visible","active","disabled","group-hover"],zt={sm:"(min-width: 640px)",md:"(min-width: 768px)",lg:"(min-width: 1024px)",xl:"(min-width: 1280px)","2xl":"(min-width: 1536px)","max-sm":"(max-width: 639px)","max-md":"(max-width: 767px)","max-lg":"(max-width: 1023px)","max-xl":"(max-width: 1279px)","max-2xl":"(max-width: 1535px)",dark:"(prefers-color-scheme: dark)"},Ot={hover:":hover",focus:":focus","focus-visible":":focus-visible",active:":active",disabled:":disabled","group-hover":":is(:where(.group):hover *)"},Re={relative:"position: relative",absolute:"position: absolute",fixed:"position: fixed",sticky:"position: sticky",static:"position: static",block:"display: block",inline:"display: inline","inline-block":"display: inline-block",flex:"display: flex","inline-flex":"display: inline-flex",grid:"display: grid",hidden:"display: none","flex-row":"flex-direction: row","flex-col":"flex-direction: column","flex-wrap":"flex-wrap: wrap","items-start":"align-items: flex-start","items-center":"align-items: center","items-end":"align-items: flex-end","items-stretch":"align-items: stretch","justify-start":"justify-content: flex-start","justify-center":"justify-content: center","justify-end":"justify-content: flex-end","justify-between":"justify-content: space-between","justify-around":"justify-content: space-around","text-left":"text-align: left","text-center":"text-align: center","text-right":"text-align: right","w-full":"width: 100%","h-full":"height: 100%","w-screen":"width: 100vw","h-screen":"height: 100vh","overflow-hidden":"overflow: hidden","overflow-auto":"overflow: auto","pointer-events-none":"pointer-events: none",underline:"text-decoration-line: underline",italic:"font-style: italic","font-bold":"font-weight: 700","font-medium":"font-weight: 500",uppercase:"text-transform: uppercase",truncate:"overflow: hidden; text-overflow: ellipsis; white-space: nowrap","z-10":"z-index: 10","z-20":"z-index: 20","z-50":"z-index: 50"},te={p:"padding",px:"padding-inline",py:"padding-block",pt:"padding-top",pr:"padding-right",pb:"padding-bottom",pl:"padding-left",m:"margin",mx:"margin-inline",my:"margin-block",mt:"margin-top",mr:"margin-right",mb:"margin-bottom",ml:"margin-left",gap:"gap","gap-x":"column-gap","gap-y":"row-gap",w:"width",h:"height","min-w":"min-width","min-h":"min-height","max-w":"max-width","max-h":"max-height"},ee={bg:"background-color",border:"border-color",outline:"outline-color",fill:"fill",stroke:"stroke"};let at=null;function ne(t){return t?.Statamic?.$config?.get?.("sveFeatures")?.tailwind_dock===!0}function co(t){return e=>{if(!ne(t)||!Fe(e))return null;const n=e.matchBefore(/[^\s"']*$/),o=n?.text??"";return o.includes("{")||o.includes("}")?null:xt(t).then(r=>{const a=De(o,r).slice(0,80);return a.length?{from:n?n.from:e.pos,options:a,validFor:/^[^\s"'=]*$/}:null})}}function uo(t,e){return t((n,o)=>{if(!ne(e))return null;const r=Ie(n.state,o);return r?xt(e).then(a=>{const s=qe(r.text,a);return s?{pos:r.from,end:r.to,create(){return{dom:Ne(s,We(r.text,a))}}}:null}):null})}function Bt(t){const e={color:[],spacing:[],text:[],leading:[],font:[],radius:[]},n=/--(color|spacing|text|leading|font|radius)-([a-zA-Z0-9][a-zA-Z0-9._-]*)\s*:\s*([^;]+);/g;let o;for(;o=n.exec(String(t||""));)o[2]!=="*"&&e[o[1]].push({name:o[2],value:o[3].trim()});const r=[];Object.entries(Re).forEach(([s,i])=>{r.push({label:s,css:i,color:null})}),e.color.forEach(({name:s,value:i})=>{const l=He(i);Object.entries(ee).forEach(([d,m])=>{r.push({label:`${d}-${s}`,css:`${m}: var(--color-${s})`,color:l})}),r.push({label:`text-${s}`,css:`color: var(--color-${s})`,color:l})}),e.spacing.forEach(({name:s})=>{Object.entries(te).forEach(([i,l])=>{r.push({label:`${i}-${s}`,css:`${l}: var(--spacing-${s})`,color:null})})}),e.text.forEach(({name:s})=>{r.push({label:`text-${s}`,css:`font-size: var(--text-${s})`,color:null})}),e.leading.forEach(({name:s})=>{r.push({label:`leading-${s}`,css:`line-height: var(--leading-${s})`,color:null})}),e.font.forEach(({name:s})=>{r.push({label:`font-${s}`,css:`font-family: var(--font-${s})`,color:null})}),e.radius.forEach(({name:s})=>{r.push({label:s==="DEFAULT"?"rounded":`rounded-${s}`,css:`border-radius: var(--radius-${s})`,color:null})});const a=new Map;return r.forEach(s=>{a.has(s.label)||a.set(s.label,s)}),{items:[...a.values()],byUtility:a}}function xt(t){return at||(at=t.fetch("/!/sve/tailwind-theme",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{css:""}).then(e=>Bt(typeof e.css=="string"?e.css:"")).catch(()=>Bt(""))),at}function Fe(t){return!!(t.matchBefore(/class\s*=\s*"[^"]*$/i)||t.matchBefore(/class\s*=\s*'[^']*$/i))}function Ie(t,e){const n=t.doc.lineAt(e),o=e-n.from,r=je(n.text,o);if(!r)return null;const a=n.text.slice(r.valueFrom,r.valueTo),s=o-r.valueFrom,i=a.slice(0,s),l=a.slice(s),d=(i.match(/[^\s]*$/)||[""])[0],m=(l.match(/^[^\s]*/)||[""])[0],c=d+m;if(!c||c.includes("{"))return null;const u=n.from+r.valueFrom+(i.length-d.length);return{from:u,to:u+c.length,text:c}}function je(t,e){const n=/\bclass\s*=\s*(["'])/gi;let o;for(;o=n.exec(t);){const r=o[1],a=o.index+o[0].length,s=t.indexOf(r,a),i=s===-1?t.length:s;if(e>=a&&e<=i)return{valueFrom:a,valueTo:i}}return null}function kt(t){const e=[...Jt].sort((s,i)=>i.length-s.length),n=[];let o=String(t||""),r=!0;for(;r;){r=!1;for(const s of e){const i=`${s}:`;if(o.startsWith(i)){n.push(s),o=o.slice(i.length),r=!0;break}}}let a=!1;return o.startsWith("!")?(a=!0,o=o.slice(1)):o.endsWith("!")&&(a=!0,o=o.slice(0,-1)),{variants:n,utility:o,important:a}}function De(t,e){const{variants:n,utility:o}=kt(t),r=n.length?`${n.join(":")}:`:"",a=o.toLowerCase(),s=[];return!a&&!r&&Jt.forEach(i=>{s.push({label:`${i}:`,type:"keyword",detail:"variant",boost:2})}),e.items.forEach(i=>{if(a&&!i.label.startsWith(a)&&!i.label.includes(a))return;const l=`${r}${i.label}`;s.push({label:l,type:"property",detail:i.css,boost:i.label.startsWith(a)?1:0})}),s.sort((i,l)=>(l.boost||0)-(i.boost||0)||i.label.localeCompare(l.label))}function qe(t,e){const{variants:n,utility:o,important:r}=kt(t),a=e.byUtility.get(o);if(!a)return"";let s=a.css;r&&(s+=" !important");const i=t.replace(/[^a-zA-Z0-9_-]/g,c=>`\\${c}`);let l="";const d=[];n.forEach(c=>{zt[c]?d.push(zt[c]):Ot[c]&&(l+=Ot[c])});let m=`.${i}${l} { ${s} }`;return d.slice().reverse().forEach(c=>{m=`@media ${c} {
  ${m}
}`}),m}function We(t,e){const{utility:n}=kt(t);return e.byUtility.get(n)?.color||null}function He(t){const e=String(t||"").trim();return/^#([0-9a-fA-F]{3,8})$/.test(e)?e:null}function Ne(t,e){const n=document.createElement("div");if(n.className="sve-tw-info",e){const r=document.createElement("span");r.className="sve-tw-swatch",r.style.background=e,n.appendChild(r)}const o=document.createElement("pre");return o.textContent=t,n.appendChild(o),n}const f=Se({emptyText:"",tag:"",scope:"",scopeTitle:"",baseLabel:"",groups:[],canEdit:!1,onChip:null,variant:"",breakpoints:[],onBreakpoint:null,state:"",stateLabel:"",onState:null,onTag:null,dropTitle:"",onDrop:null,sortTitle:"",onSort:null,siteClasses:[]});function oe(t,e,n){const o=String(t||"").slice(e,n),r=Zt(o),a=/(\sclass\s*=\s*)(["'])/i.exec(r);if(!a)return null;const s=a[2],i=a.index+a[1].length+1,l=r.indexOf(s,i);return l===-1?null:{from:e+i,to:e+l,quote:s,value:o.slice(i,l)}}function Ve(t){const e=String(t||""),n=[];let o=0;for(;o<e.length;){if(/\s/.test(e[o])){o+=1;continue}let r=o,a=!1;for(;r<e.length;){if(e.startsWith("{{",r)){const s=e.indexOf("}}",r+2);a=!0,r=s===-1?e.length:s+2;continue}if(/\s/.test(e[r]))break;r+=1}n.push({text:e.slice(o,r),from:o,to:r,dynamic:a}),o=r}return n}function re(t){const e=String(t||""),n=[];let o=0,r=0;for(let s=0;s<e.length;s+=1){const i=e[s];i==="["||i==="("?o+=1:i==="]"||i===")"?o=Math.max(0,o-1):i===":"&&o===0&&(n.push(e.slice(r,s)),r=s+1)}const a=e.slice(r);return{variants:n,base:a}}function se(t){let n=String(t||""),o="";n.startsWith("!")?(o="pre",n=n.slice(1)):n.endsWith("!")&&(o="post",n=n.slice(0,-1));let r="";const a=Ue(n);return a!==-1&&(r=n.slice(a),n=n.slice(0,a)),{name:n,modifier:r,important:o}}function Ue(t){let e=0;for(let n=0;n<t.length;n+=1){const o=t[n];if(o==="["||o==="(")e+=1;else if(o==="]"||o===")")e=Math.max(0,e-1);else if(o==="/"&&e===0)return n}return-1}function ft({variants:t,name:e,modifier:n,important:o}){let r=`${e}${n||""}`;return o==="pre"?r=`!${r}`:o==="post"&&(r=`${r}!`),[...t||[],r].join(":")}function $t(t){const e=Ve(t),n=new Map;let o=null,r=0;const a=e.findIndex(i=>i.text==="]");if(e[0]?.text==="["&&a>0){const i=e.slice(1,a);o={from:e[0].from,to:e[a].to,label:`[ ${i.map(l=>l.text).join(" ")} ]`},r=a+1}for(;r<e.length;r+=1){const i=e[r],{variants:l,base:d}=re(i.text),{name:m,modifier:c,important:u}=se(d),v=l.join(":");n.has(v)||n.set(v,{key:v,variants:l,items:[]}),n.get(v).items.push({raw:i.text,from:i.from,to:i.to,dynamic:i.dynamic,variants:l,name:m,modifier:c,important:u})}const s=[...n.values()];return s.sort((i,l)=>i.key===""?-1:l.key===""?1:0),{scope:o,groups:s}}function et(t,e,n){const o=String(t||"");if(n)return o.slice(0,e.from)+n+o.slice(e.to);let r=e.from,a=e.to;if(r>0&&(o[r-1]===" "||o[r-1]==="	"))for(;r>0&&(o[r-1]===" "||o[r-1]==="	");)r-=1;else for(;a<o.length&&(o[a]===" "||o[a]==="	");)a+=1;return Xe(o.slice(0,r)+o.slice(a),r)}function Xe(t,e){const n=t.lastIndexOf(`
`,Math.max(0,e-1));if(n===-1)return t;const o=t.indexOf(`
`,n+1);return t.slice(n+1,o===-1?t.length:o).trim()!==""?t:t.slice(0,n)+t.slice(o===-1?t.length:o)}function ae(t,e){const n=String(t||"");return n.trim()?`${n.replace(/\s+$/,"")} ${e}`:e}function ie(t,e,n){const o=String(t||"");if(!Array.isArray(e)||e.length!==n?.length)return o;let r=o;for(let a=e.length-1;a>=0;a-=1)r=r.slice(0,e[a].from)+n[a]+r.slice(e[a].to);return r}function le(t,e,n){const o=String(t||""),r=String(n||"").trim().toLowerCase();if(!/^[a-z][a-z0-9-]*$/.test(r)||!e?.tag||r===e.tag.toLowerCase())return o;const a=e.tag.toLowerCase(),s=o.slice(e.from,e.openTo);if(!new RegExp(`^<${a}(?=[\\s/>])`,"i").test(s))return o;let i=o;const l=i.toLowerCase().lastIndexOf(`</${a}`,e.to);return l>e.from&&l<e.to&&(i=i.slice(0,l)+`</${r}`+i.slice(l+2+a.length)),i.slice(0,e.from)+`<${r}`+i.slice(e.from+1+a.length)}function Ke(t,e,n){const o=oe(t,e.from,e.openTo);if(o)return t.slice(0,o.from)+n+t.slice(o.to);const r=String(t).slice(e.from,e.openTo),a=/^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(r);if(!a||!n)return t;const s=e.from+a[0].length;return`${t.slice(0,s)} class="${n}"${t.slice(s)}`}const Ze=[...Object.keys(te),...Object.keys(ee),"text","leading","font","rounded"].sort((t,e)=>e.length-t.length);let it=null;function Ye(t){return it||(it=xt(t).then(Ge)),it}function ce(t){const e=String(t||"");if(e.includes(";"))return"";const n=e.indexOf(":");return n===-1?"":e.slice(0,n).trim()}function Ge(t){const e=new Map,n=new Map,o=new Map;for(const r of t.items){const a=ce(r.css);a&&(e.has(a)||e.set(a,[]),e.get(a).push(r),n.set(r.label,a));const s=de(r.label);s&&(o.has(s)||o.set(s,[]),o.get(s).push(r))}return{catalog:t,byProperty:e,propertyOfUtility:n,byPrefix:o}}function de(t){for(const e of Ze)if(String(t).startsWith(`${e}-`))return e;return""}function ue(t,e){if(!e||!t)return null;const n=e.propertyOfUtility.get(t);if(n)return{label:n,options:e.byProperty.get(n)||[]};const o=de(t),r=o?e.byPrefix.get(o):null;return r?.length?{label:ce(r[0].css)||o,options:r}:null}function pe(t,e){return e?.catalog?.byUtility?.get(t)?.css||""}function Qe(t,e){return e?.catalog?.byUtility?.get(t)?.color||""}const Je={class:"sve-tw"},tn={key:0,class:"sve-tw-head"},en=["disabled"],nn=["title","data-active","disabled","onClick"],on=["data-active","disabled"],rn=["title","disabled"],sn={key:1,class:"sve-tw-empty"},an=["data-sve-tw-base","data-current"],ln={class:"sve-tw-chips"},cn=["title","onClick"],dn=["title","onClick"],un={__name:"TwClassList",setup(t){function e(n){const o={"data-sve-tw-chip":n.id};return n.locked&&(o["data-sve-tw-locked"]=""),n.open&&(o["data-open"]=""),o}return(n,o)=>(x(),k("div",Je,[T(f).tag?(x(),k("div",tn,[h("button",{type:"button",class:"sve-tw-tag",disabled:!T(f).canEdit,onClick:o[0]||(o[0]=E(r=>T(f).onTag?.(r),["prevent","stop"]))},"<"+M(T(f).tag)+">",9,en),(x(!0),k(R,null,U(T(f).breakpoints,r=>(x(),k("button",{key:r.index,type:"button","data-sve-tw-bp":"",title:r.title,"data-active":r.active?"":void 0,disabled:!T(f).canEdit,onClick:E(a=>T(f).onBreakpoint?.(r.index),["prevent","stop"])},M(r.label),9,nn))),128)),h("button",{type:"button","data-sve-tw-state":"","data-active":T(f).state?"":void 0,disabled:!T(f).canEdit,onClick:o[1]||(o[1]=E(r=>T(f).onState?.(r),["prevent","stop"]))},[ut(M(T(f).stateLabel)+" ",1),o[3]||(o[3]=h("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[h("path",{d:"m6 9 6 6 6-6"})],-1))],8,on),h("button",{type:"button","data-sve-tw-sort":"",title:T(f).sortTitle,disabled:!T(f).canEdit,onClick:o[2]||(o[2]=E(r=>T(f).onSort?.(),["prevent","stop"]))},[...o[4]||(o[4]=[h("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round"},[h("path",{d:"M2.5 4h9M2.5 8h6M2.5 12h3"}),h("path",{d:"M13 5v7M11.4 10.4 13 12l1.6-1.6"})],-1)])],8,rn),o[5]||(o[5]=h("span",{class:"sve-tw-gap"},null,-1))])):I("",!0),T(f).groups.length?I("",!0):(x(),k("div",sn,M(T(f).emptyText),1)),(x(!0),k(R,null,U(T(f).groups,r=>(x(),k("div",{key:r.key,class:"sve-tw-group"},[h("span",{class:"sve-tw-variant","data-sve-tw-base":r.key===""?"":void 0,"data-current":r.current?"":void 0},M(r.key===""?T(f).baseLabel:r.key),9,an),h("div",ln,[(x(!0),k(R,null,U(r.chips,a=>(x(),k("span",{key:a.id,class:"sve-tw-chip-wrap"},[h("button",Me({type:"button"},{ref_for:!0},e(a),{title:a.title,onClick:E(s=>T(f).onChip?.(s,a.id),["prevent","stop"])}),[a.color?(x(),k("span",{key:0,class:"sve-tw-dot",style:bt({background:a.color})},null,4)):I("",!0),ut(" "+M(a.raw),1)],16,cn),a.locked?I("",!0):(x(),k("button",{key:0,type:"button",class:"sve-tw-drop",title:T(f).dropTitle,onClick:E(s=>T(f).onDrop?.(a.id),["prevent","stop"])},"−",8,dn))]))),128))])]))),128))]))}},pn=Ee(un,[["__scopeId","data-v-d1960a11"]]),fn={key:0,"data-sve-tw-menu-title":""},mn={"data-sve-tw-menu-list":""},hn=["data-active","title","onClick"],gn={"data-sve-tw-tick":""},vn={"data-sve-tw-label":""},Ct={__name:"TwClassMenu",props:{title:{type:String,default:""},options:{type:Array,default:()=>[]},removeLabel:{type:String,default:""},onPick:{type:Function,required:!0},onRemove:{type:Function,required:!0}},setup(t){return(e,n)=>(x(),k(R,null,[t.title?(x(),k("div",fn,M(t.title),1)):I("",!0),h("div",mn,[(x(!0),k(R,null,U(t.options,o=>(x(),k("button",{key:o.label,type:"button","data-sve-tw-option":"","data-active":o.active?"":void 0,title:o.css,onClick:E(r=>t.onPick(o.label),["prevent","stop"])},[h("span",gn,M(o.active?"✓":""),1),o.color?(x(),k("span",{key:0,"data-sve-tw-dot":"",style:bt({background:o.color})},null,4)):I("",!0),h("span",vn,M(o.label),1)],8,hn))),128))]),h("button",{type:"button","data-sve-tw-remove":"",onClick:n[0]||(n[0]=E(o=>t.onRemove(),["prevent","stop"]))},[n[1]||(n[1]=h("span",{"data-sve-tw-tick":""},"✕",-1)),ut(M(t.removeLabel),1)])],64))}},bn={"data-sve-tw-search":""},yn=["placeholder","aria-label","onKeydown"],wn={"data-sve-tw-tabs":""},xn=["data-active"],kn=["data-active"],$n={key:0,"data-sve-tw-add-empty":""},Cn=["data-cursor","data-active","data-sve-tw-off","title","onMouseenter","onClick"],_n={"data-sve-tw-label":""},Tn={__name:"TwAddClass",props:{label:{type:String,default:""},placeholder:{type:String,default:""},sitePlaceholder:{type:String,default:""},emptyText:{type:String,default:""},offText:{type:String,default:""},siteLabel:{type:String,default:""},tailwindLabel:{type:String,default:""},search:{type:Function,required:!0},onAdd:{type:Function,required:!0}},setup(t){const e=t,n=z(""),o=z(null),r=z("tailwind"),a=z(null),s=z(-1),i=z(!1),l=q(()=>n.value.trim().toLowerCase()),d=q(()=>(f.siteClasses||[]).flatMap(C=>C.items).filter(C=>!l.value||C.name.toLowerCase().includes(l.value))),m=q(()=>e.search(n.value)),c=q(()=>r.value==="site"?d.value:m.value),u=q(()=>r.value==="site"?e.sitePlaceholder:e.placeholder);Vt(()=>pt(()=>o.value?.focus()));function v(C){return C?.name||C?.label||""}function b(C){i.value=!0;const p=c.value.length;if(!p){s.value=-1;return}const y=s.value+C;s.value=y<0?-1:Math.min(y,p-1),pt(()=>A())}function A(){const C=a.value?.querySelector("[data-cursor]");if(!C)return;let p=C.parentElement;for(;p&&p.scrollHeight<=p.clientHeight;)p=p.parentElement;if(!p)return;const y=C.offsetTop,P=y+C.offsetHeight;y<p.scrollTop?p.scrollTop=y:P>p.scrollTop+p.clientHeight&&(p.scrollTop=P-p.clientHeight)}function N(C){i.value||(s.value=C)}function V(){s.value=-1}function rt(){const C=s.value>=0?c.value[s.value]:null,p=C?v(C):n.value.trim();p&&e.onAdd(p)}return(C,p)=>(x(),k(R,null,[h("div",bn,[p[7]||(p[7]=h("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[h("circle",{cx:"11",cy:"11",r:"7"}),h("path",{d:"m20 20-3.5-3.5"})],-1)),Ut(h("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":p[0]||(p[0]=y=>n.value=y),type:"text",placeholder:u.value,"aria-label":t.label,onInput:V,onKeydown:[p[1]||(p[1]=j(E(y=>b(1),["prevent"]),["down"])),p[2]||(p[2]=j(E(y=>b(-1),["prevent"]),["up"])),j(E(rt,["prevent"]),["enter"]),p[3]||(p[3]=j(E(()=>{},["stop"]),["escape"]))]},null,40,yn),[[Xt,n.value]])]),h("div",wn,[h("button",{type:"button","data-sve-tw-tab":"","data-active":r.value==="tailwind"?"":void 0,onClick:p[4]||(p[4]=E(y=>{r.value="tailwind",V()},["prevent","stop"]))},M(t.tailwindLabel),9,xn),h("button",{type:"button","data-sve-tw-tab":"","data-active":r.value==="site"?"":void 0,onClick:p[5]||(p[5]=E(y=>{r.value="site",V()},["prevent","stop"]))},M(t.siteLabel),9,kn)]),c.value.length?I("",!0):(x(),k("div",$n,M(t.emptyText),1)),h("div",{ref_key:"rowsEl",ref:a,onMousemove:p[6]||(p[6]=y=>i.value=!1)},[(x(!0),k(R,null,U(c.value,(y,P)=>(x(),k("button",{key:y.name||y.label,type:"button","data-sve-tw-option":"","data-cursor":P===s.value?"":void 0,"data-active":P===s.value?"":void 0,"data-sve-tw-off":y.loaded===!1?"":void 0,title:y.loaded===!1?t.offText:y.file||y.css,onMouseenter:st=>N(P),onClick:E(st=>t.onAdd(y.name||y.label),["prevent","stop"])},[y.color?(x(),k("span",{key:0,"data-sve-tw-dot":"",style:bt({background:y.color})},null,4)):I("",!0),h("span",_n,M(y.name||y.label),1)],40,Cn))),128))],544)],64))}},Sn={"data-sve-tw-search":""},En=["placeholder","aria-label","onKeydown"],Mn=["data-active","onMouseenter","onClick"],Ln={"data-sve-tw-tick":""},An={"data-sve-tw-label":""},fe={__name:"TwTagMenu",props:{label:{type:String,default:""},placeholder:{type:String,default:""},current:{type:String,default:""},tags:{type:Array,default:()=>[]},onPick:{type:Function,required:!0}},setup(t){const e=t,n=z(""),o=z(null),r=z(-1),a=z(!1),s=q(()=>n.value.trim().toLowerCase()),i=q(()=>{if(!s.value)return e.tags;const m=e.tags.filter(c=>c.includes(s.value));return m.sort((c,u)=>(c.startsWith(s.value)?0:1)-(u.startsWith(s.value)?0:1)),m});Vt(()=>pt(()=>o.value?.focus()));function l(m){a.value=!0;const c=i.value.length;r.value=c?Math.min(Math.max(r.value+m,-1),c-1):-1}function d(){const m=r.value>=0?i.value[r.value]:n.value.trim().toLowerCase();m&&e.onPick(m)}return(m,c)=>(x(),k(R,null,[h("div",Sn,[c[6]||(c[6]=h("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[h("circle",{cx:"11",cy:"11",r:"7"}),h("path",{d:"m20 20-3.5-3.5"})],-1)),Ut(h("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":c[0]||(c[0]=u=>n.value=u),type:"text",placeholder:t.placeholder,"aria-label":t.label,onInput:c[1]||(c[1]=u=>r.value=-1),onKeydown:[c[2]||(c[2]=j(E(u=>l(1),["prevent"]),["down"])),c[3]||(c[3]=j(E(u=>l(-1),["prevent"]),["up"])),j(E(d,["prevent"]),["enter"]),c[4]||(c[4]=j(E(()=>{},["stop"]),["escape"]))]},null,40,En),[[Xt,n.value]])]),h("div",{onMousemove:c[5]||(c[5]=u=>a.value=!1)},[(x(!0),k(R,null,U(i.value,(u,v)=>(x(),k("button",{key:u,type:"button","data-sve-tw-option":"","data-active":v===r.value||r.value===-1&&u===t.current?"":void 0,onMouseenter:b=>a.value?null:r.value=v,onClick:E(b=>t.onPick(u),["prevent","stop"])},[h("span",Ln,M(u===t.current?"✓":""),1),h("span",An,"<"+M(u)+">",1)],40,Mn))),128))],32)],64))}},_="__sve-tw-menu",Pt="--sve-tw-anchor",zn=typeof CSS<"u"&&CSS.supports?.("anchor-name: --x");let tt=null;const Rt="__sve-tw-style",_t=[{key:"",all:!0,device:"Responsive",label:"tw_size_all"},{key:"",device:"Laptop",label:"tw_size_laptop",prefix:""},{key:"max-lg",device:"Tablet",label:"responsive_tablet",under:1024},{key:"max-md",device:"Mobile",label:"responsive_mobile",under:768}],Ft=["","dark","hover","focus","active","before","after"],me={Mobile:"max-md",Tablet:"max-lg",Laptop:"",Desktop:""},he=["div","section","article","header","footer","main","aside","nav","h1","h2","h3","h4","h5","h6","p","span","a","button","label","ul","ol","li","figure","figcaption","blockquote","strong","em","small","picture","img","video","form","table","tr","td","th"];let ge="",X="",ot=!1;function On(){try{return me[yt(window,"sve-lp-device")]??""}catch{return""}}function Tt(){return ot?ge:On()}function ve(){return[Tt(),X].filter(Boolean)}function St(){return ve().join(":")}const Bn=/^(max-)?(sm|md|lg|xl|2xl)$/;function Pn(t){return String(t||"").split(":").find(e=>Bn.test(e))||""}function be(){if(ot)return!0;try{return Object.prototype.hasOwnProperty.call(me,yt(window,"sve-lp-device"))}catch{return!1}}function Rn(t){if(!be())return!0;const e=Pn(t);return e===Tt()?!0:!_t.some(n=>n.key===e)}let w=null,K=new Map,O=null,lt=!1,nt="",mt=null;function ye(t){return t?.querySelector?.('[data-sve-style="tw"] [data-sve-tw-host]')||null}function we(t){if(t.getElementById(Rt))return;const e=t.createElement("style");e.id=Rt,e.textContent=`
    #${_} {
      position: fixed;
      z-index: 100000;
      box-sizing: border-box;
      min-width: 13rem;
      max-width: 18rem;
      max-height: 60vh;
      overflow-y: auto;
      padding: 0.5rem;
      border-radius: 0.6rem;
      border: 1px solid rgba(255,255,255,.12);
      background: #252526;
      color: #d4d4d4;
      box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,.4);
      font-size: 0.75rem;
    }
    #${_} [data-sve-tw-menu-title] {
      padding: 0.1em 0.2em 0.5em;
      opacity: .55;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.6875rem;
    }
    #${_} [data-sve-tw-option],
    #${_} [data-sve-tw-remove] {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 0.55em;
      width: 100%;
      padding: 0.4em 0.5em;
      border-radius: 0.4em;
      cursor: pointer;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      line-height: 1.5;
    }
    #${_} [data-sve-tw-option]:hover,
    #${_} [data-sve-tw-remove]:hover {
      background: rgba(255,255,255,.1);
    }
    #${_} [data-sve-tw-option][data-active] {
      background: rgba(255,255,255,.06);
    }
    #${_} [data-sve-tw-option][data-sve-tw-off] [data-sve-tw-label] {
      opacity: .45;
      text-decoration: line-through;
      text-decoration-thickness: 1px;
    }
    #${_} [data-sve-tw-tick] {
      flex: 0 0 auto;
      width: 0.9em;
      opacity: .7;
      font-family: ui-sans-serif, system-ui, sans-serif;
      line-height: 1;
    }
    #${_} [data-sve-tw-dot] {
      flex: 0 0 auto;
      width: 0.9em;
      height: 0.9em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
    #${_} [data-sve-tw-label] {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #${_} [data-sve-tw-remove] {
      margin-top: 0.3rem;
      border-top: 1px solid rgba(255,255,255,.14);
      border-radius: 0 0 0.4em 0.4em;
      padding-top: 0.6em;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    #${_} [data-sve-tw-search] {
      display: flex;
      align-items: center;
      gap: 0.5em;
      box-sizing: border-box;
      height: 2.2rem;
      padding: 0 0.6em;
      margin-bottom: 0.45rem;
      border-radius: 0.45em;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(0,0,0,.28);
    }
    #${_} [data-sve-tw-search]:focus-within {
      border-color: rgba(147,197,253,.7);
    }
    #${_} [data-sve-tw-search] svg {
      flex: 0 0 auto;
      opacity: .5;
    }
    #${_} [data-sve-tw-add-input] {
      all: unset;
      flex: 1 1 auto;
      min-width: 0;
      color: inherit;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.75rem;
    }
    #${_} [data-sve-tw-tabs] {
      display: flex;
      gap: 0.2rem;
      margin-bottom: 0.45rem;
      padding: 0.15rem;
      border-radius: 0.45em;
      background: rgba(0,0,0,.28);
    }
    #${_} [data-sve-tw-tab] {
      all: unset;
      flex: 1 1 0;
      box-sizing: border-box;
      padding: 0.35em 0;
      border-radius: 0.35em;
      cursor: pointer;
      text-align: center;
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-size: 0.6875rem;
      opacity: .65;
    }
    #${_} [data-sve-tw-tab]:hover { opacity: 1; }
    #${_} [data-sve-tw-tab][data-active] {
      opacity: 1;
      background: rgba(255,255,255,.14);
    }
    #${_} [data-sve-tw-add-empty] {
      padding: 0.4em 0.5em;
      opacity: .55;
    }
  `,t.head.appendChild(e)}function xe(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e.contentDocument;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o.contentDocument}catch{}return null}function Fn(t,e,n){const o=xe(t);if(!(!o||!w?.path))for(const r of o.querySelectorAll(`[${Be}="${w.path}"]`))try{e&&r.classList.remove(e),n&&r.classList.add(n)}catch{}}const ct=new Map,In=/(^|-)color$|^fill$|^stroke$/;function Et(t){const e=String(t||""),n=e.slice(0,e.indexOf(":")).trim();return In.test(n)&&/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(e)?.[1]||""}function ke(t,e){if(!e)return"";if(ct.has(e))return ct.get(e);const n=xe(t),o=n?.documentElement,r=n?.defaultView;if(!o||!r)return"";let a="",s=e;for(let i=0;i<6&&s;i+=1){try{a=r.getComputedStyle(o).getPropertyValue(s).trim()}catch{return""}if(!a)return"";if(s=Et(a),!s)break}return a&&!a.startsWith("var(")?(ct.set(e,a),a):""}function jn(t,e){return Qe(e,O)||ke(t,Et(pe(e,O)))}function L(t){const e=t?.document.getElementById(_);tt&&(tt.style.removeProperty("anchor-name"),tt=null),mt?.(),mt=null,nt="",e&&(e._sveApp?.unmount(),e.remove())}function It(t,e,n){const o=e.getBoundingClientRect(),r=n.offsetWidth||176,a=8,s=140,i=e.closest?.("#__sve-tw-strip")?no(t):null,l=i?i.top:0,d=i?i.bottom:t.innerHeight,m=i?i.left:0,c=i?i.right:t.innerWidth,u=o.bottom+4,v=d-u-a,b=Math.max(s,Math.min(v,420));n.style.left=`${Math.max(m+a,Math.min(o.left,c-r-a))}px`,n.style.maxHeight=`${b}px`,n.style.top=`${v>=s?u:Math.max(l+a,d-a-b)}px`}function Y(t,e,n,o){const r=t.document;L(t),we(r);const a=r.createElement("div");a.id=_,r.body.appendChild(a),a._sveApp=Le(n,a,o);const s=zn&&!!e.closest?.("#__sve-tw-strip");s?(tt=e,e.style.setProperty("anchor-name",Pt),a.style.setProperty("position","absolute"),a.style.setProperty("position-anchor",Pt),a.style.setProperty("position-area","block-end span-inline-start"),a.style.setProperty("position-try-fallbacks","flip-block, flip-inline, flip-block flip-inline"),a.style.setProperty("margin","4px 0 0 0"),a.style.setProperty("max-height","20rem")):It(t,e,a);const i=()=>{s||It(t,e,a)},l=m=>{!a.contains(m.target)&&!e.contains(m.target)&&(L(t),J())},d=m=>{m.key==="Escape"&&(L(t),J())};return r.addEventListener("pointerdown",l,!0),r.addEventListener("keydown",d,!0),t.addEventListener("scroll",i,!0),t.addEventListener("resize",i),mt=()=>{r.removeEventListener("pointerdown",l,!0),r.removeEventListener("keydown",d,!0),t.removeEventListener("scroll",i,!0),t.removeEventListener("resize",i)},a}function $e(t,e,n){return(e||[]).map(o=>({label:o.label,css:o.css,color:o.color||ke(t,Et(o.css)),active:o.label===n}))}function W(){return!w||F("dock:is-locked")===!0}function H(){const t=F("dock:html");if(!w||typeof t!="string"||t[w.from]!=="<")return null;const e=oe(t,w.from,w.openTo);return{html:t,value:e?e.value:""}}function Dn(t){if(!w?.path)return;const n=wt(Qt(t),new Set).find(o=>o.path===w.path);n&&(w={from:n.from,openTo:n.openTo,path:n.path,tag:n.tag})}function D(t,e,n,o,r){const a=Ke(e,w,n);a!==e&&(Fn(t,o,r),F("dock:set-html",a),Dn(a),B(t))}const jt=["display","position","inset","top","right","bottom","left","z-index","flex-direction","flex-wrap","justify-content","align-items","gap","column-gap","row-gap","margin","margin-inline","margin-block","margin-top","margin-right","margin-bottom","margin-left","padding","padding-inline","padding-block","padding-top","padding-right","padding-bottom","padding-left","width","min-width","max-width","height","min-height","max-height","font-family","font-size","font-weight","line-height","text-align","text-transform","text-decoration-line","font-style","color","background-color","border-color","border-radius","fill","stroke","outline-color","overflow"];function Dt(t){const e=Z(t);if(!e)return-1;const n=jt.indexOf(e);return n===-1?jt.length:n}function qn(t){if(W())return;const e=H();if(!e)return;const n=$t(e.value),o=n.groups.flatMap(l=>l.items).filter(l=>!l.dynamic);if(o.length<2)return;const r=new Map;n.groups.forEach((l,d)=>r.set(l.key,l.key===""?-1:d));const a=[...o].sort((l,d)=>{const m=r.get(l.variants.join(":"))??0,c=r.get(d.variants.join(":"))??0;return m-c||Dt(l.name)-Dt(d.name)||l.name.localeCompare(d.name)}),s=[...o].sort((l,d)=>l.from-d.from).map(l=>({from:l.from,to:l.to})),i=ie(e.value,s,a.map(l=>l.raw));i!==e.value&&D(t,e.html,i,"","")}function Z(t){return ue(t,O)?.label||""}function ht(t){return $t(t).groups.flatMap(e=>e.items)}function Ce(t){const e=St();return ht(t).filter(n=>!n.dynamic&&n.variants.join(":")===e)}function qt(t,e){if(W()||!e)return;const n=H();if(!n)return;const o=Z(e),r=Ce(n.value).find(s=>s.name===e||o&&Z(s.name)===o);if(r?.name===e){D(t,n.html,et(n.value,r,""),e,"");return}if(r){const s=ft({variants:r.variants,name:e,modifier:r.modifier,important:r.important});D(t,n.html,et(n.value,r,s),r.raw,s);return}const a=ft({variants:ve(),name:e,modifier:"",important:""});D(t,n.html,ae(n.value,a),"",a)}function Wn(t,e){const n=String(e||"").trim(),o=St(),r=o&&!n.includes(":")?`${o}:${n}`:n;if(W()||!n)return;const a=H();if(!a||ht(a.value).some(u=>u.raw===r))return;const{variants:i,base:l}=re(r),d=Z(se(l).name),m=i.join(":"),c=d?ht(a.value).find(u=>!u.dynamic&&u.variants.join(":")===m&&Z(u.name)===d):null;if(c){D(t,a.html,et(a.value,c,r),c.raw,r);return}D(t,a.html,ae(a.value,r),"",r.includes(":")?"":r)}function gt(t,e,n){if(W())return;const o=H();if(!o||o.value.slice(e.from,e.to)!==e.raw){B(t);return}const r=n?ft({variants:e.variants,name:n,modifier:e.modifier,important:e.important}):"";D(t,o.html,et(o.value,e,r),e.raw,r)}function Hn(t,e){if(W()||!w)return;const n=F("dock:html");if(typeof n!="string"||n[w.from]!=="<")return;const o=le(n,w,e);if(o===n)return;const r=w.from;F("dock:set-html",o);const s=wt(Qt(o),new Set).find(i=>i.from===r);s&&(w={from:s.from,openTo:s.openTo,path:s.path,tag:s.tag}),B(t),Q("tw:changed")}function po(t,e,n){n?.tag&&Y(t,e,fe,{label:$(t,"tw_tag"),placeholder:$(t,"tw_tag_placeholder"),current:String(n.tag).toLowerCase(),tags:he,onPick:o=>{Nn(t,n,o),L(t)}})}function Nn(t,e,n){if(F("dock:is-locked")===!0)return;const o=F("dock:html");if(typeof o!="string"||o[e.from]!=="<")return;const r=le(o,e,n);r!==o&&F("dock:set-html",r)}function Vn(t,e){Y(t,e,fe,{label:$(t,"tw_tag"),placeholder:$(t,"tw_tag_placeholder"),current:(w?.tag||"").toLowerCase(),tags:he,onPick:n=>{Hn(t,n),L(t)}})}function Un(t,e){if(W())return;const n=H();if(!n)return;const o=e.map(s=>K.get(s)).filter(Boolean);if(o.length<2)return;const r=[...o].sort((s,i)=>s.from-i.from).map(s=>({from:s.from,to:s.to})),a=ie(n.value,r,o.map(s=>s.raw));a!==n.value&&D(t,n.html,a,"","")}function fo(t){Lt(t,w?.path||"")}function mo(){return!!w}function Xn(t,e){const n=_t[e];n&&(F("lp:set-device",{win:t,key:n.device}),ot=!n.all,ge=n.key,L(t),B(t),Q("tw:changed"))}function Kn(t,e){Y(t,e,Ct,{title:$(t,"tw_state"),removeLabel:$(t,"tw_state_none"),options:Ft.filter(Boolean).map(n=>({label:n,css:"",color:null,active:n===X})),onPick:n=>{X=Ft.includes(n)?n:"",L(t),B(t),Q("tw:changed")},onRemove:()=>{X="",L(t),B(t),Q("tw:changed")}})}ze("lp:device",()=>{ot=!1,ye(window.document)&&B(window)});function Zn(t){const e=t?H():null;return e&&Ce(e.value).find(n=>Z(n.name)===t)?.name||""}function ho(t,e,n,o){const r=O?.byProperty.get(n)||[];if(!r.length)return;const a=Zn(n);Y(t,e,Ct,{title:n,removeLabel:$(t,"tw_classes_remove"),options:$e(t,r,a),onPick:s=>{qt(t,s),L(t),o?.(s)},onRemove:()=>{a&&qt(t,a),L(t),o?.("")}})}let Wt=[],dt=!1;function Yn(t){dt||(dt=!0,t.fetch("/!/sve/site-css/classes",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{groups:[]}).then(e=>{Wt=Array.isArray(e?.groups)?e.groups:[],f.siteClasses=Wt}).catch(()=>{dt=!1}))}function Gn(t,e){Yn(t),Y(t,e,Tn,{label:$(t,"tw_add_class"),placeholder:$(t,"tw_add_placeholder"),emptyText:$(t,"tw_add_empty"),offText:$(t,"tw_class_not_imported"),sitePlaceholder:$(t,"tw_add_placeholder_site"),siteLabel:$(t,"tw_add_site"),tailwindLabel:$(t,"tw_add_tailwind"),search:n=>{const o=String(n||"").trim().toLowerCase();if(!o||!O)return[];const r=O.catalog.items.filter(a=>a.label.toLowerCase().includes(o));return r.sort((a,s)=>{const i=a.label.toLowerCase().startsWith(o)?0:1,l=s.label.toLowerCase().startsWith(o)?0:1;return i-l||a.label.length-s.label.length}),r.slice(0,40).map(a=>({label:a.label,css:a.css,color:a.color,active:!1}))},onAdd:n=>{Wn(t,n)}})}function Qn(t,e,n){const o=K.get(n);if(!o||o.locked)return;if(nt===n){L(t),J();return}const r=ue(o.name,O);Y(t,e.currentTarget,Ct,{title:r?.label||"",removeLabel:$(t,"tw_classes_remove"),options:$e(t,r?.options,o.name),onPick:a=>{gt(t,o,a),L(t)},onRemove:()=>{gt(t,o,""),L(t)}}),nt=n,J()}function J(){for(const t of f.groups)for(const e of t.chips)e.open=e.id===nt}function go(t,e){if(!e||e.from==null||e.openTo==null){w=null,K=new Map,L(t),B(t);return}w={from:e.from,openTo:e.openTo,path:e.path,tag:e.tag},B(t)}function B(t){Jn(t);const e=w?H():null,n=e?$t(e.value):{scope:null,groups:[]};K=new Map,f.baseLabel=$(t,"tw_size_base"),f.scopeTitle=$(t,"tw_classes_scope"),f.dropTitle=$(t,"tw_classes_remove"),f.variant=St(),f.onBreakpoint=s=>Xn(t,s),f.onState=s=>Kn(t,s.currentTarget);const o=be();f.breakpoints=_t.map((s,i)=>({index:i,label:$(t,s.label),title:s.under?`${s.key}:  ·  < ${s.under}px`:$(t,s.all?"tw_size_all_title":"tw_size_base_title"),active:s.all?!o:o&&s.key===Tt()})),f.state=X,f.stateLabel=X||$(t,"tw_state"),f.canEdit=!W(),f.onChip=(s,i)=>Qn(t,s,i),f.onTag=s=>Vn(t,s.currentTarget),f.sortTitle=$(t,"tw_sort"),f.onSort=()=>qn(t),f.onDrop=s=>{const i=K.get(s);i&&!i.locked&&(L(t),gt(t,i,""))},f.tag=w?.tag||"";const r=n.scope?.label||"";f.scope=/^\[\s*\]$/.test(r)?"":r,f.emptyText=$(t,w?n.groups.length?"tw_classes_none_size":"tw_classes_none":"tw_classes_pick"),f.groups=n.groups.filter(s=>Rn(s.key)).map(s=>({key:s.key,current:s.key===f.variant,chips:s.items.map((i,l)=>{const d={...i,id:`${s.key}-${l}-${i.from}`,locked:i.dynamic||!f.canEdit,open:!1,color:i.dynamic?"":jn(t,i.name),title:i.dynamic?$(t,"tw_classes_dynamic"):pe(i.name,O)||i.raw};return K.set(d.id,d),d})}));const a=ye(t.document);a&&(we(t.document),Ae(a,pn)),J(),Lt(t,w?.path||""),Q("tw:changed")}function Jn(t){O||lt||(lt=!0,Ye(t).then(e=>{O=e,B(t)}).catch(()=>{lt=!1}))}const _e="sve-tw-strip";function to(t){try{return yt(t,_e)!=="0"}catch{return!0}}function vo(t,e){Oe(t,_e,e?"1":"0"),e||vt(t)}const g="__sve-tw-strip",Ht="__sve-tw-strip-style";let Nt=null,G=null;function Mt(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o}catch{}return null}function eo(t){if(t.getElementById(Ht))return;const e=t.createElement("style");e.id=Ht,e.textContent=`
    #${g} {
      position: fixed;
      z-index: 99998;
      display: flex;
      align-items: stretch;
      gap: 0.3rem;
      font-size: 0.6875rem;
    }
    #${g} [data-group] {
      display: flex;
      align-items: center;
      gap: 0.2rem;
      min-width: 0;
      /* The same height with or without the middle group: only whether it is
         there should change, not the shape of the two beside it. */
      min-height: 2.2rem;
      padding: 0.2rem 0.3rem;
      border-radius: 0.45rem;
      border: 1px solid rgba(255,255,255,.12);
      background: #252526;
      color: #d4d4d4;
      box-shadow: 0 0.3rem 0.9rem rgba(0,0,0,.35);
    }
    #${g} [data-group="classes"] {
      position: relative;
      max-width: 30rem;
      padding: 0;
    }
    #${g} [data-scroll] {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      min-width: 0;
      padding: 0.45rem;
      overflow-x: auto;
      scrollbar-width: none;
    }
    #${g} [data-scroll]::-webkit-scrollbar { display: none; }
    /* The fade is a sibling, never a mask on the scroller: a mask-image on a
       scrollable element resets scrollLeft in Chrome. */
    #${g} [data-fade] {
      position: absolute;
      top: 1px;
      right: 1px;
      bottom: 1px;
      width: 1.6rem;
      border-radius: 0 0.45rem 0.45rem 0;
      pointer-events: none;
      opacity: 0;
      transition: opacity .12s linear;
      background: linear-gradient(to right, rgba(37,37,38,0), #252526);
    }
    #${g} [data-group="classes"][data-overflow] [data-fade] { opacity: 1; }
    #${g} [data-sve-tw-strip-tag] {
      flex: 0 0 auto;
      padding: 0 0.2em;
      opacity: .75;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    #${g} button {
      all: unset;
      position: relative;
      flex: 0 0 auto;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 0.35em;
      padding: 0.22em 0.5em;
      border-radius: 0.35em;
      background: rgba(255,255,255,.1);
      cursor: pointer;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      line-height: 1.45;
      white-space: nowrap;
    }
    #${g} button:hover { background: rgba(255,255,255,.2); }
    #${g} button[data-locked] { cursor: default; opacity: .5; }
    #${g} button[data-locked]:hover { background: rgba(255,255,255,.1); }
    #${g} [data-chip-wrap] {
      position: relative;
      display: inline-flex;
      flex: 0 0 auto;
      touch-action: none;
      cursor: grab;
    }
    #${g} [data-chip-wrap][data-dragging] {
      opacity: .35;
      cursor: grabbing;
    }
    #${g}[data-dragging],
    #${g}[data-dragging] * { cursor: grabbing !important; }
    #${g}[data-dragging] [data-drop] { opacity: 0 !important; }
    #${g} [data-drop] {
      position: absolute;
      top: -0.5em;
      right: -0.5em;
      width: 1.5em;
      height: 1.5em;
      min-width: 0;
      padding: 0;
      justify-content: center;
      border-radius: 50%;
      border: 2px solid #252526;
      background: #e11d48;
      color: #fff;
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-size: 0.85em;
      line-height: 1;
      opacity: 0;
      cursor: pointer;
    }
    #${g} [data-chip-wrap]:hover [data-drop] { opacity: 1; }
    #${g} [data-drop]:hover { background: #f43f5e; }
    /* One box, not a button inside a plate: the group is the button. */
    #${g} [data-group="add"] {
      padding: 0;
    }
    #${g} [data-add],
    #${g} [data-add]:hover {
      justify-content: center;
      min-width: 2rem;
      align-self: stretch;
      background: transparent;
      border-radius: 0.45rem;
      padding: 0 0.5em;
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-size: 1.05rem;
      line-height: 1;
    }
    #${g} [data-plus] {
      display: block;
      transform: translateY(-0.09em);
    }
    #${g} [data-group="add"]:hover {
      background: #3858e9;
      border-color: #3858e9;
      color: #fff;
    }
    #${g} [data-dot] {
      width: 0.8em;
      height: 0.8em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
    /* The ghost lives on the body, outside the strip, so none of the rules
       above reach it — it carries its own copy of the chip's look. */
    #${g}-ghost {
      position: fixed;
      z-index: 100002;
      pointer-events: none;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 0.35em;
      padding: 0.22em 0.5em;
      border-radius: 0.35em;
      background: #3a3a3e;
      color: #d4d4d4;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.6875rem;
      line-height: 1.45;
      white-space: nowrap;
      opacity: .5;
      transform: translate(-50%, -50%) rotate(20deg) scale(.9);
      box-shadow: 0 0.4rem 1rem rgba(0,0,0,.45);
    }
    #${g}-ghost [data-dot] {
      width: 0.8em;
      height: 0.8em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
  `,t.head.appendChild(e)}function no(t){const e=Mt(t);return e?e.getBoundingClientRect():null}let S=null;function oo(t,e,n,o){if(e.button!==0||e.target?.closest?.("[data-drop]"))return;S={wrap:n,scroll:o,strip:t.document.getElementById(g),x:e.clientX,moved:!1,ghost:null};const r=s=>{if(!S||!S.moved&&Math.abs(s.clientX-S.x)<4)return;if(!S.moved){S.moved=!0,S.wrap.setAttribute("data-dragging",""),S.strip?.setAttribute("data-dragging","");const d=S.wrap.querySelector("button")?.cloneNode(!0);d&&(d.id=`${g}-ghost`,d.querySelector("[data-drop]")?.remove(),t.document.body.appendChild(d),S.ghost=d)}s.preventDefault(),S.ghost&&(S.ghost.style.left=`${s.clientX}px`,S.ghost.style.top=`${s.clientY}px`);const i=t.document.elementFromPoint(s.clientX,s.clientY)?.closest?.("[data-chip-wrap]");if(!i||i===S.wrap||i.parentElement!==S.scroll)return;const l=i.getBoundingClientRect();s.clientX<l.left+l.width/2?S.scroll.insertBefore(S.wrap,i):S.scroll.insertBefore(S.wrap,i.nextSibling)},a=()=>{t.document.removeEventListener("pointermove",r,!0),t.document.removeEventListener("pointerup",a,!0),t.document.removeEventListener("pointercancel",a,!0);const s=S;if(S=null,s?.ghost?.remove(),!s?.moved)return;s.wrap.removeAttribute("data-dragging"),s.strip?.removeAttribute("data-dragging");const i=l=>{l.preventDefault(),l.stopPropagation()};t.addEventListener("click",i,!0),t.setTimeout(()=>t.removeEventListener("click",i,!0),0),Un(t,[...s.scroll.querySelectorAll("[data-chip-wrap]")].map(l=>l.dataset.chip))};t.document.addEventListener("pointermove",r,!0),t.document.addEventListener("pointerup",a,!0),t.document.addEventListener("pointercancel",a,!0)}function vt(t){t?.document.getElementById(g)?.remove()}function ro(t){const e=()=>so(t);Nt!==t&&(Nt=t,t.addEventListener("resize",e),t.addEventListener("scroll",e,!0));const n=Mt(t)?.contentWindow;if(n&&!n._sveStripBound)try{n._sveStripBound=!0,n.addEventListener("scroll",e,!0),n.addEventListener("resize",e),n.addEventListener("statamic:preview-updated",()=>{t.setTimeout(()=>Lt(t,G?.path||""),60)})}catch{}}function so(t){const e=t?.document.getElementById(g);!e||!G?.el?.isConnected||Te(t,e,G.frame,G.el)}function Lt(t,e){if(!t||!to(t)){vt(t);return}const n=t.document,o=Mt(t),r=o?.contentDocument,a=e&&r?r.querySelector(`[data-sve-ht-path="${e}"]`):null;if(!a||!f.tag){vt(t);return}eo(n),ro(t);let s=n.getElementById(g);s||(s=n.createElement("div"),s.id=g,n.body.appendChild(s));let i=s.querySelector('[data-group="tag"]');if(!i){i=n.createElement("div"),i.setAttribute("data-group","tag");const c=n.createElement("span");c.setAttribute("data-sve-tw-strip-tag",""),i.appendChild(c),s.appendChild(i)}i.firstChild.textContent=`<${f.tag}>`;let l=s.querySelector('[data-group="classes"]'),d=l?.querySelector("[data-scroll]");const m=f.groups.flatMap(c=>c.chips);if(m.length&&!l){l=n.createElement("div"),l.setAttribute("data-group","classes"),d=n.createElement("div"),d.setAttribute("data-scroll","");const c=n.createElement("span");c.setAttribute("data-fade",""),l.appendChild(d),l.appendChild(c);const u=()=>{d.scrollWidth-d.scrollLeft-d.clientWidth>2?l.setAttribute("data-overflow",""):l.removeAttribute("data-overflow")};d.addEventListener("scroll",u),l._sveSync=u,s.insertBefore(l,s.querySelector('[data-group="add"]'))}if(!m.length)l?.remove();else if(d){d.replaceChildren();for(const c of m){const u=n.createElement("button");if(u.type="button",u.title=c.title||"",c.locked&&u.setAttribute("data-locked",""),c.color){const b=n.createElement("span");b.setAttribute("data-dot",""),b.style.background=c.color,u.appendChild(b)}u.appendChild(n.createTextNode(c.raw));const v=n.createElement("span");if(v.setAttribute("data-chip-wrap",""),v.dataset.chip=c.id,v.appendChild(u),c.locked||v.addEventListener("pointerdown",b=>oo(t,b,v,d)),!c.locked){const b=n.createElement("button");b.type="button",b.setAttribute("data-drop",""),b.title=f.dropTitle||"",b.textContent="−",b.addEventListener("click",A=>{A.preventDefault(),A.stopPropagation(),f.onDrop?.(c.id)}),v.appendChild(b),u.addEventListener("click",A=>{A.preventDefault(),A.stopPropagation(),f.onChip?.(A,c.id)})}d.appendChild(v)}t.requestAnimationFrame(()=>l._sveSync?.())}if(!s.querySelector('[data-group="add"]')){const c=n.createElement("div");c.setAttribute("data-group","add");const u=n.createElement("button");u.type="button",u.setAttribute("data-add","");const v=n.createElement("span");v.setAttribute("data-plus",""),v.textContent="+",u.appendChild(v),u.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation(),Gn(t,b.currentTarget)}),c.appendChild(u),s.appendChild(c)}G={frame:o,el:a,path:e},Te(t,s,o,a)}function Te(t,e,n,o){const r=n.getBoundingClientRect(),a=n.clientWidth?r.width/n.clientWidth:1,s=o.getBoundingClientRect(),i=e.getBoundingClientRect(),l=6,d=16,m=r.left+s.left*a,c=r.top+s.top*a-i.height-l,u=r.top+s.top*a+l,v=Math.max(l,r.left+d),b=Math.max(v,Math.min(r.right,t.innerWidth)-i.width-d);e.style.left=`${Math.max(v,Math.min(m,b))}px`,e.style.top=`${Math.max(r.top+d,c<r.top+d?u:c)}px`;const A=n.clientHeight||r.height;e.hidden=s.bottom<=0||s.top>=A}export{ne as a,to as b,L as c,fo as d,co as e,wt as f,uo as g,Zn as h,lo as i,ho as j,Gn as k,qt as l,mo as m,Qt as p,go as r,vo as s,po as t};
