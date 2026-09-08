import{r as Ce,_ as _e,o as x,c as k,u as E,a as h,f as T,t as L,F as R,e as N,I as dt,d as I,m as Te,n as bt,Q as B,H as j,T as qt,a2 as pt,K as Ht,w as D,L as Nt,j as _,l as Ee,i as Se,a9 as G,M as F,a8 as yt,N as Le,A as Ae}from"./addon-Bwi_UAJ0.js";import{H as Me}from"./html-pick-align-gkRPeJkt.js";const Vt=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function Ut(t){return String(t||"").replace(/\{\{[\s\S]*?\}\}/g,e=>" ".repeat(e.length))}function Be(t){const e=t.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(!e)return"";const n=e[2].match(/\[\s*([\s\S]*?)\s*\]/);if(n){const o=n[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).find(r=>/^[a-zA-Z_][\w-]*$/.test(r));if(o)return o}return(e[2].trim().split(/\s+/)[0]||"").replace(/\[|\]/g,"")}function Xt(t,e,n,o){t.hidden=!0,o&&(t.wrapFrom=e,t.wrapTo=n);for(const r of t.children)Xt(r,e,n,!1)}function Kt(t,e,n,o){const r=[],a=[];let s=n,i=0;const c=p=>{a.length?a[a.length-1].children.push(p):r.push(p)};for(;s<o;){if(e[s]!=="<"){s+=1;continue}if(e.startsWith("<!--",s)){const d=e.indexOf("-->",s+4),b=d===-1||d>o?o:d,z=d===-1||d+3>o?o:d+3,st=Kt(t,e,s+4,b);for(const At of st)Xt(At,s,z,!0),c(At);s=z;continue}if(e.startsWith("<!",s)||e.startsWith("<?",s)){const d=e.indexOf(">",s+2);s=d===-1||d+1>o?o:d+1;continue}const p=e[s+1]==="/",m=e.slice(s,o).match(/^<\/?([a-zA-Z][a-zA-Z0-9:-]*)/);if(!m){s+=1;continue}const l=m[1].toLowerCase(),u=e.indexOf(">",s);if(u===-1||u>=o)break;const v=e.slice(s,u+1),g=!p&&(Vt.has(l)||/\/\s*>$/.test(v));if(p){for(let d=a.length-1;d>=0;d-=1)if(a[d].tag===l){a[d].to=u+1,a.length=d;break}s=u+1;continue}const M=Be(t.slice(s,u+1)),q=a.length?a[a.length-1]:null,H=q?q.children:r,rt=q?`${q.path}/${H.length}:${l}`:`${H.length}:${l}`,$={id:`${l}-${s}-${i}`,tag:l,klass:M,path:rt,label:M,from:s,to:u+1,openTo:u+1,hidden:!1,children:[]};i+=1,c($),g?$.to=u+1:a.push($),s=u+1}for(;a.length;)a.pop().to=o;return r}function Zt(t){const e=String(t||""),n=Ut(e);return Kt(e,n,0,n.length)}function wt(t,e,n=0,o=[]){for(const r of t){const a=r.children.length>0,s=e.has(r.id);o.push({id:r.id,tag:r.tag,klass:r.klass||"",path:r.path,label:r.label,from:r.from,to:r.to,openTo:r.openTo,hidden:!!r.hidden,wrapFrom:r.wrapFrom,wrapTo:r.wrapTo,depth:n,hasChildren:a,shut:s}),a&&!s&&wt(r.children,e,n+1,o)}return o}function ro(t){return Vt.has(String(t||"").toLowerCase())}const Yt=["sm","md","lg","xl","2xl","max-sm","max-md","max-lg","max-xl","max-2xl","dark","hover","focus","focus-visible","active","disabled","group-hover"],Mt={sm:"(min-width: 640px)",md:"(min-width: 768px)",lg:"(min-width: 1024px)",xl:"(min-width: 1280px)","2xl":"(min-width: 1536px)","max-sm":"(max-width: 639px)","max-md":"(max-width: 767px)","max-lg":"(max-width: 1023px)","max-xl":"(max-width: 1279px)","max-2xl":"(max-width: 1535px)",dark:"(prefers-color-scheme: dark)"},Bt={hover:":hover",focus:":focus","focus-visible":":focus-visible",active:":active",disabled:":disabled","group-hover":":is(:where(.group):hover *)"},Oe={relative:"position: relative",absolute:"position: absolute",fixed:"position: fixed",sticky:"position: sticky",static:"position: static",block:"display: block",inline:"display: inline","inline-block":"display: inline-block",flex:"display: flex","inline-flex":"display: inline-flex",grid:"display: grid",hidden:"display: none","flex-row":"flex-direction: row","flex-col":"flex-direction: column","flex-wrap":"flex-wrap: wrap","items-start":"align-items: flex-start","items-center":"align-items: center","items-end":"align-items: flex-end","items-stretch":"align-items: stretch","justify-start":"justify-content: flex-start","justify-center":"justify-content: center","justify-end":"justify-content: flex-end","justify-between":"justify-content: space-between","justify-around":"justify-content: space-around","text-left":"text-align: left","text-center":"text-align: center","text-right":"text-align: right","w-full":"width: 100%","h-full":"height: 100%","w-screen":"width: 100vw","h-screen":"height: 100vh","overflow-hidden":"overflow: hidden","overflow-auto":"overflow: auto","pointer-events-none":"pointer-events: none",underline:"text-decoration-line: underline",italic:"font-style: italic","font-bold":"font-weight: 700","font-medium":"font-weight: 500",uppercase:"text-transform: uppercase",truncate:"overflow: hidden; text-overflow: ellipsis; white-space: nowrap","z-10":"z-index: 10","z-20":"z-index: 20","z-50":"z-index: 50"},Gt={p:"padding",px:"padding-inline",py:"padding-block",pt:"padding-top",pr:"padding-right",pb:"padding-bottom",pl:"padding-left",m:"margin",mx:"margin-inline",my:"margin-block",mt:"margin-top",mr:"margin-right",mb:"margin-bottom",ml:"margin-left",gap:"gap","gap-x":"column-gap","gap-y":"row-gap",w:"width",h:"height","min-w":"min-width","min-h":"min-height","max-w":"max-width","max-h":"max-height"},Qt={bg:"background-color",border:"border-color",outline:"outline-color",fill:"fill",stroke:"stroke"};let at=null;function Jt(t){return t?.Statamic?.$config?.get?.("sveFeatures")?.tailwind_dock===!0}function so(t){return e=>{if(!Jt(t)||!Pe(e))return null;const n=e.matchBefore(/[^\s"']*$/),o=n?.text??"";return o.includes("{")||o.includes("}")?null:xt(t).then(r=>{const a=Fe(o,r).slice(0,80);return a.length?{from:n?n.from:e.pos,options:a,validFor:/^[^\s"'=]*$/}:null})}}function ao(t,e){return t((n,o)=>{if(!Jt(e))return null;const r=ze(n.state,o);return r?xt(e).then(a=>{const s=Ie(r.text,a);return s?{pos:r.from,end:r.to,create(){return{dom:We(s,De(r.text,a))}}}:null}):null})}function Ot(t){const e={color:[],spacing:[],text:[],leading:[],font:[],radius:[]},n=/--(color|spacing|text|leading|font|radius)-([a-zA-Z0-9][a-zA-Z0-9._-]*)\s*:\s*([^;]+);/g;let o;for(;o=n.exec(String(t||""));)o[2]!=="*"&&e[o[1]].push({name:o[2],value:o[3].trim()});const r=[];Object.entries(Oe).forEach(([s,i])=>{r.push({label:s,css:i,color:null})}),e.color.forEach(({name:s,value:i})=>{const c=je(i);Object.entries(Qt).forEach(([p,m])=>{r.push({label:`${p}-${s}`,css:`${m}: var(--color-${s})`,color:c})}),r.push({label:`text-${s}`,css:`color: var(--color-${s})`,color:c})}),e.spacing.forEach(({name:s})=>{Object.entries(Gt).forEach(([i,c])=>{r.push({label:`${i}-${s}`,css:`${c}: var(--spacing-${s})`,color:null})})}),e.text.forEach(({name:s})=>{r.push({label:`text-${s}`,css:`font-size: var(--text-${s})`,color:null})}),e.leading.forEach(({name:s})=>{r.push({label:`leading-${s}`,css:`line-height: var(--leading-${s})`,color:null})}),e.font.forEach(({name:s})=>{r.push({label:`font-${s}`,css:`font-family: var(--font-${s})`,color:null})}),e.radius.forEach(({name:s})=>{r.push({label:s==="DEFAULT"?"rounded":`rounded-${s}`,css:`border-radius: var(--radius-${s})`,color:null})});const a=new Map;return r.forEach(s=>{a.has(s.label)||a.set(s.label,s)}),{items:[...a.values()],byUtility:a}}function xt(t){return at||(at=t.fetch("/!/sve/tailwind-theme",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{css:""}).then(e=>Ot(typeof e.css=="string"?e.css:"")).catch(()=>Ot(""))),at}function Pe(t){return!!(t.matchBefore(/class\s*=\s*"[^"]*$/i)||t.matchBefore(/class\s*=\s*'[^']*$/i))}function ze(t,e){const n=t.doc.lineAt(e),o=e-n.from,r=Re(n.text,o);if(!r)return null;const a=n.text.slice(r.valueFrom,r.valueTo),s=o-r.valueFrom,i=a.slice(0,s),c=a.slice(s),p=(i.match(/[^\s]*$/)||[""])[0],m=(c.match(/^[^\s]*/)||[""])[0],l=p+m;if(!l||l.includes("{"))return null;const u=n.from+r.valueFrom+(i.length-p.length);return{from:u,to:u+l.length,text:l}}function Re(t,e){const n=/\bclass\s*=\s*(["'])/gi;let o;for(;o=n.exec(t);){const r=o[1],a=o.index+o[0].length,s=t.indexOf(r,a),i=s===-1?t.length:s;if(e>=a&&e<=i)return{valueFrom:a,valueTo:i}}return null}function kt(t){const e=[...Yt].sort((s,i)=>i.length-s.length),n=[];let o=String(t||""),r=!0;for(;r;){r=!1;for(const s of e){const i=`${s}:`;if(o.startsWith(i)){n.push(s),o=o.slice(i.length),r=!0;break}}}let a=!1;return o.startsWith("!")?(a=!0,o=o.slice(1)):o.endsWith("!")&&(a=!0,o=o.slice(0,-1)),{variants:n,utility:o,important:a}}function Fe(t,e){const{variants:n,utility:o}=kt(t),r=n.length?`${n.join(":")}:`:"",a=o.toLowerCase(),s=[];return!a&&!r&&Yt.forEach(i=>{s.push({label:`${i}:`,type:"keyword",detail:"variant",boost:2})}),e.items.forEach(i=>{if(a&&!i.label.startsWith(a)&&!i.label.includes(a))return;const c=`${r}${i.label}`;s.push({label:c,type:"property",detail:i.css,boost:i.label.startsWith(a)?1:0})}),s.sort((i,c)=>(c.boost||0)-(i.boost||0)||i.label.localeCompare(c.label))}function Ie(t,e){const{variants:n,utility:o,important:r}=kt(t),a=e.byUtility.get(o);if(!a)return"";let s=a.css;r&&(s+=" !important");const i=t.replace(/[^a-zA-Z0-9_-]/g,l=>`\\${l}`);let c="";const p=[];n.forEach(l=>{Mt[l]?p.push(Mt[l]):Bt[l]&&(c+=Bt[l])});let m=`.${i}${c} { ${s} }`;return p.slice().reverse().forEach(l=>{m=`@media ${l} {
  ${m}
}`}),m}function De(t,e){const{utility:n}=kt(t);return e.byUtility.get(n)?.color||null}function je(t){const e=String(t||"").trim();return/^#([0-9a-fA-F]{3,8})$/.test(e)?e:null}function We(t,e){const n=document.createElement("div");if(n.className="sve-tw-info",e){const r=document.createElement("span");r.className="sve-tw-swatch",r.style.background=e,n.appendChild(r)}const o=document.createElement("pre");return o.textContent=t,n.appendChild(o),n}const f=Ce({emptyText:"",tag:"",scope:"",scopeTitle:"",baseLabel:"",groups:[],canEdit:!1,onChip:null,variant:"",breakpoints:[],onBreakpoint:null,state:"",stateLabel:"",onState:null,onTag:null,dropTitle:"",onDrop:null,siteClasses:[]});function te(t,e,n){const o=String(t||"").slice(e,n),r=Ut(o),a=/(\sclass\s*=\s*)(["'])/i.exec(r);if(!a)return null;const s=a[2],i=a.index+a[1].length+1,c=r.indexOf(s,i);return c===-1?null:{from:e+i,to:e+c,quote:s,value:o.slice(i,c)}}function qe(t){const e=String(t||""),n=[];let o=0;for(;o<e.length;){if(/\s/.test(e[o])){o+=1;continue}let r=o,a=!1;for(;r<e.length;){if(e.startsWith("{{",r)){const s=e.indexOf("}}",r+2);a=!0,r=s===-1?e.length:s+2;continue}if(/\s/.test(e[r]))break;r+=1}n.push({text:e.slice(o,r),from:o,to:r,dynamic:a}),o=r}return n}function ee(t){const e=String(t||""),n=[];let o=0,r=0;for(let s=0;s<e.length;s+=1){const i=e[s];i==="["||i==="("?o+=1:i==="]"||i===")"?o=Math.max(0,o-1):i===":"&&o===0&&(n.push(e.slice(r,s)),r=s+1)}const a=e.slice(r);return{variants:n,base:a}}function ne(t){let n=String(t||""),o="";n.startsWith("!")?(o="pre",n=n.slice(1)):n.endsWith("!")&&(o="post",n=n.slice(0,-1));let r="";const a=He(n);return a!==-1&&(r=n.slice(a),n=n.slice(0,a)),{name:n,modifier:r,important:o}}function He(t){let e=0;for(let n=0;n<t.length;n+=1){const o=t[n];if(o==="["||o==="(")e+=1;else if(o==="]"||o===")")e=Math.max(0,e-1);else if(o==="/"&&e===0)return n}return-1}function ft({variants:t,name:e,modifier:n,important:o}){let r=`${e}${n||""}`;return o==="pre"?r=`!${r}`:o==="post"&&(r=`${r}!`),[...t||[],r].join(":")}function oe(t){const e=qe(t),n=new Map;let o=null,r=0;const a=e.findIndex(i=>i.text==="]");if(e[0]?.text==="["&&a>0){const i=e.slice(1,a);o={from:e[0].from,to:e[a].to,label:`[ ${i.map(c=>c.text).join(" ")} ]`},r=a+1}for(;r<e.length;r+=1){const i=e[r],{variants:c,base:p}=ee(i.text),{name:m,modifier:l,important:u}=ne(p),v=c.join(":");n.has(v)||n.set(v,{key:v,variants:c,items:[]}),n.get(v).items.push({raw:i.text,from:i.from,to:i.to,dynamic:i.dynamic,variants:c,name:m,modifier:l,important:u})}const s=[...n.values()];return s.sort((i,c)=>i.key===""?-1:c.key===""?1:0),{scope:o,groups:s}}function et(t,e,n){const o=String(t||"");if(n)return o.slice(0,e.from)+n+o.slice(e.to);let r=e.from,a=e.to;if(r>0&&(o[r-1]===" "||o[r-1]==="	"))for(;r>0&&(o[r-1]===" "||o[r-1]==="	");)r-=1;else for(;a<o.length&&(o[a]===" "||o[a]==="	");)a+=1;return Ne(o.slice(0,r)+o.slice(a),r)}function Ne(t,e){const n=t.lastIndexOf(`
`,Math.max(0,e-1));if(n===-1)return t;const o=t.indexOf(`
`,n+1);return t.slice(n+1,o===-1?t.length:o).trim()!==""?t:t.slice(0,n)+t.slice(o===-1?t.length:o)}function re(t,e){const n=String(t||"");return n.trim()?`${n.replace(/\s+$/,"")} ${e}`:e}function Ve(t,e,n){const o=String(t||"");if(!Array.isArray(e)||e.length!==n?.length)return o;let r=o;for(let a=e.length-1;a>=0;a-=1)r=r.slice(0,e[a].from)+n[a]+r.slice(e[a].to);return r}function se(t,e,n){const o=String(t||""),r=String(n||"").trim().toLowerCase();if(!/^[a-z][a-z0-9-]*$/.test(r)||!e?.tag||r===e.tag.toLowerCase())return o;const a=e.tag.toLowerCase(),s=o.slice(e.from,e.openTo);if(!new RegExp(`^<${a}(?=[\\s/>])`,"i").test(s))return o;let i=o;const c=i.toLowerCase().lastIndexOf(`</${a}`,e.to);return c>e.from&&c<e.to&&(i=i.slice(0,c)+`</${r}`+i.slice(c+2+a.length)),i.slice(0,e.from)+`<${r}`+i.slice(e.from+1+a.length)}function Ue(t,e,n){const o=te(t,e.from,e.openTo);if(o)return t.slice(0,o.from)+n+t.slice(o.to);const r=String(t).slice(e.from,e.openTo),a=/^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(r);if(!a||!n)return t;const s=e.from+a[0].length;return`${t.slice(0,s)} class="${n}"${t.slice(s)}`}const Xe=[...Object.keys(Gt),...Object.keys(Qt),"text","leading","font","rounded"].sort((t,e)=>e.length-t.length);let it=null;function Ke(t){return it||(it=xt(t).then(Ze)),it}function ae(t){const e=String(t||"");if(e.includes(";"))return"";const n=e.indexOf(":");return n===-1?"":e.slice(0,n).trim()}function Ze(t){const e=new Map,n=new Map,o=new Map;for(const r of t.items){const a=ae(r.css);a&&(e.has(a)||e.set(a,[]),e.get(a).push(r),n.set(r.label,a));const s=ie(r.label);s&&(o.has(s)||o.set(s,[]),o.get(s).push(r))}return{catalog:t,byProperty:e,propertyOfUtility:n,byPrefix:o}}function ie(t){for(const e of Xe)if(String(t).startsWith(`${e}-`))return e;return""}function le(t,e){if(!e||!t)return null;const n=e.propertyOfUtility.get(t);if(n)return{label:n,options:e.byProperty.get(n)||[]};const o=ie(t),r=o?e.byPrefix.get(o):null;return r?.length?{label:ae(r[0].css)||o,options:r}:null}function ce(t,e){return e?.catalog?.byUtility?.get(t)?.css||""}function Ye(t,e){return e?.catalog?.byUtility?.get(t)?.color||""}const Ge={class:"sve-tw"},Qe={key:0,class:"sve-tw-head"},Je=["disabled"],tn=["title","data-active","disabled","onClick"],en=["data-active","disabled"],nn={key:1,class:"sve-tw-empty"},on=["data-sve-tw-base","data-current"],rn={class:"sve-tw-chips"},sn=["title","onClick"],an=["title","onClick"],ln={__name:"TwClassList",setup(t){function e(n){const o={"data-sve-tw-chip":n.id};return n.locked&&(o["data-sve-tw-locked"]=""),n.open&&(o["data-open"]=""),o}return(n,o)=>(x(),k("div",Ge,[E(f).tag?(x(),k("div",Qe,[h("button",{type:"button",class:"sve-tw-tag",disabled:!E(f).canEdit,onClick:o[0]||(o[0]=T(r=>E(f).onTag?.(r),["prevent","stop"]))},"<"+L(E(f).tag)+">",9,Je),(x(!0),k(R,null,N(E(f).breakpoints,r=>(x(),k("button",{key:r.index,type:"button","data-sve-tw-bp":"",title:r.title,"data-active":r.active?"":void 0,disabled:!E(f).canEdit,onClick:T(a=>E(f).onBreakpoint?.(r.index),["prevent","stop"])},L(r.label),9,tn))),128)),h("button",{type:"button","data-sve-tw-state":"","data-active":E(f).state?"":void 0,disabled:!E(f).canEdit,onClick:o[1]||(o[1]=T(r=>E(f).onState?.(r),["prevent","stop"]))},[dt(L(E(f).stateLabel)+" ",1),o[2]||(o[2]=h("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[h("path",{d:"m6 9 6 6 6-6"})],-1))],8,en),o[3]||(o[3]=h("span",{class:"sve-tw-gap"},null,-1))])):I("",!0),E(f).groups.length?I("",!0):(x(),k("div",nn,L(E(f).emptyText),1)),(x(!0),k(R,null,N(E(f).groups,r=>(x(),k("div",{key:r.key,class:"sve-tw-group"},[h("span",{class:"sve-tw-variant","data-sve-tw-base":r.key===""?"":void 0,"data-current":r.current?"":void 0},L(r.key===""?E(f).baseLabel:r.key),9,on),h("div",rn,[(x(!0),k(R,null,N(r.chips,a=>(x(),k("span",{key:a.id,class:"sve-tw-chip-wrap"},[h("button",Te({type:"button"},{ref_for:!0},e(a),{title:a.title,onClick:T(s=>E(f).onChip?.(s,a.id),["prevent","stop"])}),[a.color?(x(),k("span",{key:0,class:"sve-tw-dot",style:bt({background:a.color})},null,4)):I("",!0),dt(" "+L(a.raw),1)],16,sn),a.locked?I("",!0):(x(),k("button",{key:0,type:"button",class:"sve-tw-drop",title:E(f).dropTitle,onClick:T(s=>E(f).onDrop?.(a.id),["prevent","stop"])},"−",8,an))]))),128))])]))),128))]))}},cn=_e(ln,[["__scopeId","data-v-bfb30e9d"]]),un={key:0,"data-sve-tw-menu-title":""},dn={"data-sve-tw-menu-list":""},pn=["data-active","title","onClick"],fn={"data-sve-tw-tick":""},mn={"data-sve-tw-label":""},$t={__name:"TwClassMenu",props:{title:{type:String,default:""},options:{type:Array,default:()=>[]},removeLabel:{type:String,default:""},onPick:{type:Function,required:!0},onRemove:{type:Function,required:!0}},setup(t){return(e,n)=>(x(),k(R,null,[t.title?(x(),k("div",un,L(t.title),1)):I("",!0),h("div",dn,[(x(!0),k(R,null,N(t.options,o=>(x(),k("button",{key:o.label,type:"button","data-sve-tw-option":"","data-active":o.active?"":void 0,title:o.css,onClick:T(r=>t.onPick(o.label),["prevent","stop"])},[h("span",fn,L(o.active?"✓":""),1),o.color?(x(),k("span",{key:0,"data-sve-tw-dot":"",style:bt({background:o.color})},null,4)):I("",!0),h("span",mn,L(o.label),1)],8,pn))),128))]),h("button",{type:"button","data-sve-tw-remove":"",onClick:n[0]||(n[0]=T(o=>t.onRemove(),["prevent","stop"]))},[n[1]||(n[1]=h("span",{"data-sve-tw-tick":""},"✕",-1)),dt(L(t.removeLabel),1)])],64))}},hn={"data-sve-tw-search":""},vn=["placeholder","aria-label","onKeydown"],gn={"data-sve-tw-tabs":""},bn=["data-active"],yn=["data-active"],wn={key:0,"data-sve-tw-add-empty":""},xn=["data-cursor","data-active","data-sve-tw-off","title","onMouseenter","onClick"],kn={"data-sve-tw-label":""},$n={__name:"TwAddClass",props:{label:{type:String,default:""},placeholder:{type:String,default:""},sitePlaceholder:{type:String,default:""},emptyText:{type:String,default:""},offText:{type:String,default:""},siteLabel:{type:String,default:""},tailwindLabel:{type:String,default:""},search:{type:Function,required:!0},onAdd:{type:Function,required:!0}},setup(t){const e=t,n=B(""),o=B(null),r=B("tailwind"),a=B(null),s=B(-1),i=B(!1),c=j(()=>n.value.trim().toLowerCase()),p=j(()=>(f.siteClasses||[]).flatMap($=>$.items).filter($=>!c.value||$.name.toLowerCase().includes(c.value))),m=j(()=>e.search(n.value)),l=j(()=>r.value==="site"?p.value:m.value),u=j(()=>r.value==="site"?e.sitePlaceholder:e.placeholder);qt(()=>pt(()=>o.value?.focus()));function v($){return $?.name||$?.label||""}function g($){i.value=!0;const d=l.value.length;if(!d){s.value=-1;return}const b=s.value+$;s.value=b<0?-1:Math.min(b,d-1),pt(()=>M())}function M(){const $=a.value?.querySelector("[data-cursor]");if(!$)return;let d=$.parentElement;for(;d&&d.scrollHeight<=d.clientHeight;)d=d.parentElement;if(!d)return;const b=$.offsetTop,z=b+$.offsetHeight;b<d.scrollTop?d.scrollTop=b:z>d.scrollTop+d.clientHeight&&(d.scrollTop=z-d.clientHeight)}function q($){i.value||(s.value=$)}function H(){s.value=-1}function rt(){const $=s.value>=0?l.value[s.value]:null,d=$?v($):n.value.trim();d&&e.onAdd(d)}return($,d)=>(x(),k(R,null,[h("div",hn,[d[7]||(d[7]=h("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[h("circle",{cx:"11",cy:"11",r:"7"}),h("path",{d:"m20 20-3.5-3.5"})],-1)),Ht(h("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":d[0]||(d[0]=b=>n.value=b),type:"text",placeholder:u.value,"aria-label":t.label,onInput:H,onKeydown:[d[1]||(d[1]=D(T(b=>g(1),["prevent"]),["down"])),d[2]||(d[2]=D(T(b=>g(-1),["prevent"]),["up"])),D(T(rt,["prevent"]),["enter"]),d[3]||(d[3]=D(T(()=>{},["stop"]),["escape"]))]},null,40,vn),[[Nt,n.value]])]),h("div",gn,[h("button",{type:"button","data-sve-tw-tab":"","data-active":r.value==="tailwind"?"":void 0,onClick:d[4]||(d[4]=T(b=>{r.value="tailwind",H()},["prevent","stop"]))},L(t.tailwindLabel),9,bn),h("button",{type:"button","data-sve-tw-tab":"","data-active":r.value==="site"?"":void 0,onClick:d[5]||(d[5]=T(b=>{r.value="site",H()},["prevent","stop"]))},L(t.siteLabel),9,yn)]),l.value.length?I("",!0):(x(),k("div",wn,L(t.emptyText),1)),h("div",{ref_key:"rowsEl",ref:a,onMousemove:d[6]||(d[6]=b=>i.value=!1)},[(x(!0),k(R,null,N(l.value,(b,z)=>(x(),k("button",{key:b.name||b.label,type:"button","data-sve-tw-option":"","data-cursor":z===s.value?"":void 0,"data-active":z===s.value?"":void 0,"data-sve-tw-off":b.loaded===!1?"":void 0,title:b.loaded===!1?t.offText:b.file||b.css,onMouseenter:st=>q(z),onClick:T(st=>t.onAdd(b.name||b.label),["prevent","stop"])},[b.color?(x(),k("span",{key:0,"data-sve-tw-dot":"",style:bt({background:b.color})},null,4)):I("",!0),h("span",kn,L(b.name||b.label),1)],40,xn))),128))],544)],64))}},Cn={"data-sve-tw-search":""},_n=["placeholder","aria-label","onKeydown"],Tn=["data-active","onMouseenter","onClick"],En={"data-sve-tw-tick":""},Sn={"data-sve-tw-label":""},ue={__name:"TwTagMenu",props:{label:{type:String,default:""},placeholder:{type:String,default:""},current:{type:String,default:""},tags:{type:Array,default:()=>[]},onPick:{type:Function,required:!0}},setup(t){const e=t,n=B(""),o=B(null),r=B(-1),a=B(!1),s=j(()=>n.value.trim().toLowerCase()),i=j(()=>{if(!s.value)return e.tags;const m=e.tags.filter(l=>l.includes(s.value));return m.sort((l,u)=>(l.startsWith(s.value)?0:1)-(u.startsWith(s.value)?0:1)),m});qt(()=>pt(()=>o.value?.focus()));function c(m){a.value=!0;const l=i.value.length;r.value=l?Math.min(Math.max(r.value+m,-1),l-1):-1}function p(){const m=r.value>=0?i.value[r.value]:n.value.trim().toLowerCase();m&&e.onPick(m)}return(m,l)=>(x(),k(R,null,[h("div",Cn,[l[6]||(l[6]=h("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[h("circle",{cx:"11",cy:"11",r:"7"}),h("path",{d:"m20 20-3.5-3.5"})],-1)),Ht(h("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":l[0]||(l[0]=u=>n.value=u),type:"text",placeholder:t.placeholder,"aria-label":t.label,onInput:l[1]||(l[1]=u=>r.value=-1),onKeydown:[l[2]||(l[2]=D(T(u=>c(1),["prevent"]),["down"])),l[3]||(l[3]=D(T(u=>c(-1),["prevent"]),["up"])),D(T(p,["prevent"]),["enter"]),l[4]||(l[4]=D(T(()=>{},["stop"]),["escape"]))]},null,40,_n),[[Nt,n.value]])]),h("div",{onMousemove:l[5]||(l[5]=u=>a.value=!1)},[(x(!0),k(R,null,N(i.value,(u,v)=>(x(),k("button",{key:u,type:"button","data-sve-tw-option":"","data-active":v===r.value||r.value===-1&&u===t.current?"":void 0,onMouseenter:g=>a.value?null:r.value=v,onClick:T(g=>t.onPick(u),["prevent","stop"])},[h("span",En,L(u===t.current?"✓":""),1),h("span",Sn,"<"+L(u)+">",1)],40,Tn))),128))],32)],64))}},C="__sve-tw-menu",Pt="--sve-tw-anchor",Ln=typeof CSS<"u"&&CSS.supports?.("anchor-name: --x");let tt=null;const zt="__sve-tw-style",Ct=[{key:"",all:!0,device:"Responsive",label:"tw_size_all"},{key:"",device:"Laptop",label:"tw_size_laptop",prefix:""},{key:"max-lg",device:"Tablet",label:"responsive_tablet",under:1024},{key:"max-md",device:"Mobile",label:"responsive_mobile",under:768}],Rt=["","dark","hover","focus","active","before","after"],de={Mobile:"max-md",Tablet:"max-lg",Laptop:"",Desktop:""},pe=["div","section","article","header","footer","main","aside","nav","h1","h2","h3","h4","h5","h6","p","span","a","button","label","ul","ol","li","figure","figcaption","blockquote","strong","em","small","picture","img","video","form","table","tr","td","th"];let fe="",V="",ot=!1;function An(){try{return de[yt(window,"sve-lp-device")]??""}catch{return""}}function _t(){return ot?fe:An()}function me(){return[_t(),V].filter(Boolean)}function Tt(){return me().join(":")}const Mn=/^(max-)?(sm|md|lg|xl|2xl)$/;function Bn(t){return String(t||"").split(":").find(e=>Mn.test(e))||""}function he(){if(ot)return!0;try{return Object.prototype.hasOwnProperty.call(de,yt(window,"sve-lp-device"))}catch{return!1}}function On(t){if(!he())return!0;const e=Bn(t);return e===_t()?!0:!Ct.some(n=>n.key===e)}let w=null,U=new Map,O=null,lt=!1,nt="",mt=null;function ve(t){return t?.querySelector?.('[data-sve-style="tw"] [data-sve-tw-host]')||null}function ge(t){if(t.getElementById(zt))return;const e=t.createElement("style");e.id=zt,e.textContent=`
    #${C} {
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
    #${C} [data-sve-tw-menu-title] {
      padding: 0.1em 0.2em 0.5em;
      opacity: .55;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.6875rem;
    }
    #${C} [data-sve-tw-option],
    #${C} [data-sve-tw-remove] {
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
    #${C} [data-sve-tw-option]:hover,
    #${C} [data-sve-tw-remove]:hover {
      background: rgba(255,255,255,.1);
    }
    #${C} [data-sve-tw-option][data-active] {
      background: rgba(255,255,255,.06);
    }
    #${C} [data-sve-tw-option][data-sve-tw-off] [data-sve-tw-label] {
      opacity: .45;
      text-decoration: line-through;
      text-decoration-thickness: 1px;
    }
    #${C} [data-sve-tw-tick] {
      flex: 0 0 auto;
      width: 0.9em;
      opacity: .7;
      font-family: ui-sans-serif, system-ui, sans-serif;
      line-height: 1;
    }
    #${C} [data-sve-tw-dot] {
      flex: 0 0 auto;
      width: 0.9em;
      height: 0.9em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
    #${C} [data-sve-tw-label] {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #${C} [data-sve-tw-remove] {
      margin-top: 0.3rem;
      border-top: 1px solid rgba(255,255,255,.14);
      border-radius: 0 0 0.4em 0.4em;
      padding-top: 0.6em;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    #${C} [data-sve-tw-search] {
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
    #${C} [data-sve-tw-search]:focus-within {
      border-color: rgba(147,197,253,.7);
    }
    #${C} [data-sve-tw-search] svg {
      flex: 0 0 auto;
      opacity: .5;
    }
    #${C} [data-sve-tw-add-input] {
      all: unset;
      flex: 1 1 auto;
      min-width: 0;
      color: inherit;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.75rem;
    }
    #${C} [data-sve-tw-tabs] {
      display: flex;
      gap: 0.2rem;
      margin-bottom: 0.45rem;
      padding: 0.15rem;
      border-radius: 0.45em;
      background: rgba(0,0,0,.28);
    }
    #${C} [data-sve-tw-tab] {
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
    #${C} [data-sve-tw-tab]:hover { opacity: 1; }
    #${C} [data-sve-tw-tab][data-active] {
      opacity: 1;
      background: rgba(255,255,255,.14);
    }
    #${C} [data-sve-tw-add-empty] {
      padding: 0.4em 0.5em;
      opacity: .55;
    }
  `,t.head.appendChild(e)}function be(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e.contentDocument;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o.contentDocument}catch{}return null}function Pn(t,e,n){const o=be(t);if(!(!o||!w?.path))for(const r of o.querySelectorAll(`[${Me}="${w.path}"]`))try{e&&r.classList.remove(e),n&&r.classList.add(n)}catch{}}const ct=new Map,zn=/(^|-)color$|^fill$|^stroke$/;function Et(t){const e=String(t||""),n=e.slice(0,e.indexOf(":")).trim();return zn.test(n)&&/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(e)?.[1]||""}function ye(t,e){if(!e)return"";if(ct.has(e))return ct.get(e);const n=be(t),o=n?.documentElement,r=n?.defaultView;if(!o||!r)return"";let a="",s=e;for(let i=0;i<6&&s;i+=1){try{a=r.getComputedStyle(o).getPropertyValue(s).trim()}catch{return""}if(!a)return"";if(s=Et(a),!s)break}return a&&!a.startsWith("var(")?(ct.set(e,a),a):""}function Rn(t,e){return Ye(e,O)||ye(t,Et(ce(e,O)))}function A(t){const e=t?.document.getElementById(C);tt&&(tt.style.removeProperty("anchor-name"),tt=null),mt?.(),mt=null,nt="",e&&(e._sveApp?.unmount(),e.remove())}function Ft(t,e,n){const o=e.getBoundingClientRect(),r=n.offsetWidth||176,a=8,s=140,i=e.closest?.("#__sve-tw-strip")?Qn(t):null,c=i?i.top:0,p=i?i.bottom:t.innerHeight,m=i?i.left:0,l=i?i.right:t.innerWidth,u=o.bottom+4,v=p-u-a,g=Math.max(s,Math.min(v,420));n.style.left=`${Math.max(m+a,Math.min(o.left,l-r-a))}px`,n.style.maxHeight=`${g}px`,n.style.top=`${v>=s?u:Math.max(c+a,p-a-g)}px`}function X(t,e,n,o){const r=t.document;A(t),ge(r);const a=r.createElement("div");a.id=C,r.body.appendChild(a),a._sveApp=Ee(n,a,o);const s=Ln&&!!e.closest?.("#__sve-tw-strip");s?(tt=e,e.style.setProperty("anchor-name",Pt),a.style.setProperty("position","absolute"),a.style.setProperty("position-anchor",Pt),a.style.setProperty("position-area","block-end span-inline-start"),a.style.setProperty("position-try-fallbacks","flip-block, flip-inline, flip-block flip-inline"),a.style.setProperty("margin","4px 0 0 0"),a.style.setProperty("max-height","20rem")):Ft(t,e,a);const i=()=>{s||Ft(t,e,a)},c=m=>{!a.contains(m.target)&&!e.contains(m.target)&&(A(t),J())},p=m=>{m.key==="Escape"&&(A(t),J())};return r.addEventListener("pointerdown",c,!0),r.addEventListener("keydown",p,!0),t.addEventListener("scroll",i,!0),t.addEventListener("resize",i),mt=()=>{r.removeEventListener("pointerdown",c,!0),r.removeEventListener("keydown",p,!0),t.removeEventListener("scroll",i,!0),t.removeEventListener("resize",i)},a}function we(t,e,n){return(e||[]).map(o=>({label:o.label,css:o.css,color:o.color||ye(t,Et(o.css)),active:o.label===n}))}function K(){return!w||F("dock:is-locked")===!0}function Z(){const t=F("dock:html");if(!w||typeof t!="string"||t[w.from]!=="<")return null;const e=te(t,w.from,w.openTo);return{html:t,value:e?e.value:""}}function Fn(t){if(!w?.path)return;const n=wt(Zt(t),new Set).find(o=>o.path===w.path);n&&(w={from:n.from,openTo:n.openTo,path:n.path,tag:n.tag})}function W(t,e,n,o,r){const a=Ue(e,w,n);a!==e&&(Pn(t,o,r),F("dock:set-html",a),Fn(a),P(t))}function Q(t){return le(t,O)?.label||""}function ht(t){return oe(t).groups.flatMap(e=>e.items)}function xe(t){const e=Tt();return ht(t).filter(n=>!n.dynamic&&n.variants.join(":")===e)}function It(t,e){if(K()||!e)return;const n=Z();if(!n)return;const o=Q(e),r=xe(n.value).find(s=>s.name===e||o&&Q(s.name)===o);if(r?.name===e){W(t,n.html,et(n.value,r,""),e,"");return}if(r){const s=ft({variants:r.variants,name:e,modifier:r.modifier,important:r.important});W(t,n.html,et(n.value,r,s),r.raw,s);return}const a=ft({variants:me(),name:e,modifier:"",important:""});W(t,n.html,re(n.value,a),"",a)}function In(t,e){const n=String(e||"").trim(),o=Tt(),r=o&&!n.includes(":")?`${o}:${n}`:n;if(K()||!n)return;const a=Z();if(!a||ht(a.value).some(u=>u.raw===r))return;const{variants:i,base:c}=ee(r),p=Q(ne(c).name),m=i.join(":"),l=p?ht(a.value).find(u=>!u.dynamic&&u.variants.join(":")===m&&Q(u.name)===p):null;if(l){W(t,a.html,et(a.value,l,r),l.raw,r);return}W(t,a.html,re(a.value,r),"",r.includes(":")?"":r)}function vt(t,e,n){if(K())return;const o=Z();if(!o||o.value.slice(e.from,e.to)!==e.raw){P(t);return}const r=n?ft({variants:e.variants,name:n,modifier:e.modifier,important:e.important}):"";W(t,o.html,et(o.value,e,r),e.raw,r)}function Dn(t,e){if(K()||!w)return;const n=F("dock:html");if(typeof n!="string"||n[w.from]!=="<")return;const o=se(n,w,e);if(o===n)return;const r=w.from;F("dock:set-html",o);const s=wt(Zt(o),new Set).find(i=>i.from===r);s&&(w={from:s.from,openTo:s.openTo,path:s.path,tag:s.tag}),P(t),G("tw:changed")}function io(t,e,n){n?.tag&&X(t,e,ue,{label:_(t,"tw_tag"),placeholder:_(t,"tw_tag_placeholder"),current:String(n.tag).toLowerCase(),tags:pe,onPick:o=>{jn(t,n,o),A(t)}})}function jn(t,e,n){if(F("dock:is-locked")===!0)return;const o=F("dock:html");if(typeof o!="string"||o[e.from]!=="<")return;const r=se(o,e,n);r!==o&&F("dock:set-html",r)}function Wn(t,e){X(t,e,ue,{label:_(t,"tw_tag"),placeholder:_(t,"tw_tag_placeholder"),current:(w?.tag||"").toLowerCase(),tags:pe,onPick:n=>{Dn(t,n),A(t)}})}function qn(t,e){if(K())return;const n=Z();if(!n)return;const o=e.map(s=>U.get(s)).filter(Boolean);if(o.length<2)return;const r=[...o].sort((s,i)=>s.from-i.from).map(s=>({from:s.from,to:s.to})),a=Ve(n.value,r,o.map(s=>s.raw));a!==n.value&&W(t,n.html,a,"","")}function lo(t){Lt(t,w?.path||"")}function co(){return!!w}function Hn(t,e){const n=Ct[e];n&&(F("lp:set-device",{win:t,key:n.device}),ot=!n.all,fe=n.key,A(t),P(t),G("tw:changed"))}function Nn(t,e){X(t,e,$t,{title:_(t,"tw_state"),removeLabel:_(t,"tw_state_none"),options:Rt.filter(Boolean).map(n=>({label:n,css:"",color:null,active:n===V})),onPick:n=>{V=Rt.includes(n)?n:"",A(t),P(t),G("tw:changed")},onRemove:()=>{V="",A(t),P(t),G("tw:changed")}})}Le("lp:device",()=>{ot=!1,ve(window.document)&&P(window)});function Vn(t){const e=t?Z():null;return e&&xe(e.value).find(n=>Q(n.name)===t)?.name||""}function uo(t,e,n,o){const r=O?.byProperty.get(n)||[];if(!r.length)return;const a=Vn(n);X(t,e,$t,{title:n,removeLabel:_(t,"tw_classes_remove"),options:we(t,r,a),onPick:s=>{It(t,s),A(t),o?.(s)},onRemove:()=>{a&&It(t,a),A(t),o?.("")}})}let Dt=[],ut=!1;function Un(t){ut||(ut=!0,t.fetch("/!/sve/site-css/classes",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{groups:[]}).then(e=>{Dt=Array.isArray(e?.groups)?e.groups:[],f.siteClasses=Dt}).catch(()=>{ut=!1}))}function Xn(t,e){Un(t),X(t,e,$n,{label:_(t,"tw_add_class"),placeholder:_(t,"tw_add_placeholder"),emptyText:_(t,"tw_add_empty"),offText:_(t,"tw_class_not_imported"),sitePlaceholder:_(t,"tw_add_placeholder_site"),siteLabel:_(t,"tw_add_site"),tailwindLabel:_(t,"tw_add_tailwind"),search:n=>{const o=String(n||"").trim().toLowerCase();if(!o||!O)return[];const r=O.catalog.items.filter(a=>a.label.toLowerCase().includes(o));return r.sort((a,s)=>{const i=a.label.toLowerCase().startsWith(o)?0:1,c=s.label.toLowerCase().startsWith(o)?0:1;return i-c||a.label.length-s.label.length}),r.slice(0,40).map(a=>({label:a.label,css:a.css,color:a.color,active:!1}))},onAdd:n=>{In(t,n)}})}function Kn(t,e,n){const o=U.get(n);if(!o||o.locked)return;if(nt===n){A(t),J();return}const r=le(o.name,O);X(t,e.currentTarget,$t,{title:r?.label||"",removeLabel:_(t,"tw_classes_remove"),options:we(t,r?.options,o.name),onPick:a=>{vt(t,o,a),A(t)},onRemove:()=>{vt(t,o,""),A(t)}}),nt=n,J()}function J(){for(const t of f.groups)for(const e of t.chips)e.open=e.id===nt}function po(t,e){if(!e||e.from==null||e.openTo==null){w=null,U=new Map,A(t),P(t);return}w={from:e.from,openTo:e.openTo,path:e.path,tag:e.tag},P(t)}function P(t){Zn(t);const e=w?Z():null,n=e?oe(e.value):{scope:null,groups:[]};U=new Map,f.baseLabel=_(t,"tw_size_base"),f.scopeTitle=_(t,"tw_classes_scope"),f.dropTitle=_(t,"tw_classes_remove"),f.variant=Tt(),f.onBreakpoint=s=>Hn(t,s),f.onState=s=>Nn(t,s.currentTarget);const o=he();f.breakpoints=Ct.map((s,i)=>({index:i,label:_(t,s.label),title:s.under?`${s.key}:  ·  < ${s.under}px`:_(t,s.all?"tw_size_all_title":"tw_size_base_title"),active:s.all?!o:o&&s.key===_t()})),f.state=V,f.stateLabel=V||_(t,"tw_state"),f.canEdit=!K(),f.onChip=(s,i)=>Kn(t,s,i),f.onTag=s=>Wn(t,s.currentTarget),f.onDrop=s=>{const i=U.get(s);i&&!i.locked&&(A(t),vt(t,i,""))},f.tag=w?.tag||"";const r=n.scope?.label||"";f.scope=/^\[\s*\]$/.test(r)?"":r,f.emptyText=_(t,w?n.groups.length?"tw_classes_none_size":"tw_classes_none":"tw_classes_pick"),f.groups=n.groups.filter(s=>On(s.key)).map(s=>({key:s.key,current:s.key===f.variant,chips:s.items.map((i,c)=>{const p={...i,id:`${s.key}-${c}-${i.from}`,locked:i.dynamic||!f.canEdit,open:!1,color:i.dynamic?"":Rn(t,i.name),title:i.dynamic?_(t,"tw_classes_dynamic"):ce(i.name,O)||i.raw};return U.set(p.id,p),p})}));const a=ve(t.document);a&&(ge(t.document),Se(a,cn)),J(),Lt(t,w?.path||""),G("tw:changed")}function Zn(t){O||lt||(lt=!0,Ke(t).then(e=>{O=e,P(t)}).catch(()=>{lt=!1}))}const ke="sve-tw-strip";function Yn(t){try{return yt(t,ke)!=="0"}catch{return!0}}function fo(t,e){Ae(t,ke,e?"1":"0"),e||gt(t)}const y="__sve-tw-strip",jt="__sve-tw-strip-style";let Wt=null,Y=null;function St(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o}catch{}return null}function Gn(t){if(t.getElementById(jt))return;const e=t.createElement("style");e.id=jt,e.textContent=`
    #${y} {
      position: fixed;
      z-index: 99998;
      display: flex;
      align-items: stretch;
      gap: 0.3rem;
      font-size: 0.6875rem;
    }
    #${y} [data-group] {
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
    #${y} [data-group="classes"] {
      position: relative;
      max-width: 30rem;
      padding: 0;
    }
    #${y} [data-scroll] {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      min-width: 0;
      padding: 0.45rem;
      overflow-x: auto;
      scrollbar-width: none;
    }
    #${y} [data-scroll]::-webkit-scrollbar { display: none; }
    /* The fade is a sibling, never a mask on the scroller: a mask-image on a
       scrollable element resets scrollLeft in Chrome. */
    #${y} [data-fade] {
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
    #${y} [data-group="classes"][data-overflow] [data-fade] { opacity: 1; }
    #${y} [data-sve-tw-strip-tag] {
      flex: 0 0 auto;
      padding: 0 0.2em;
      opacity: .75;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    #${y} button {
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
    #${y} button:hover { background: rgba(255,255,255,.2); }
    #${y} button[data-locked] { cursor: default; opacity: .5; }
    #${y} button[data-locked]:hover { background: rgba(255,255,255,.1); }
    #${y} [data-chip-wrap] {
      position: relative;
      display: inline-flex;
      flex: 0 0 auto;
      touch-action: none;
    }
    #${y} [data-chip-wrap][data-dragging] {
      opacity: .6;
      cursor: grabbing;
    }
    #${y}[data-dragging] [data-drop] { opacity: 0 !important; }
    #${y} [data-drop] {
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
    #${y} [data-chip-wrap]:hover [data-drop] { opacity: 1; }
    #${y} [data-drop]:hover { background: #f43f5e; }
    /* One box, not a button inside a plate: the group is the button. */
    #${y} [data-group="add"] {
      padding: 0;
    }
    #${y} [data-add],
    #${y} [data-add]:hover {
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
    #${y} [data-plus] {
      display: block;
      transform: translateY(-0.09em);
    }
    #${y} [data-group="add"]:hover {
      background: #3858e9;
      border-color: #3858e9;
      color: #fff;
    }
    #${y} [data-dot] {
      width: 0.8em;
      height: 0.8em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
  `,t.head.appendChild(e)}function Qn(t){const e=St(t);return e?e.getBoundingClientRect():null}let S=null;function Jn(t,e,n,o){if(e.button!==0||e.target?.closest?.("[data-drop]"))return;S={wrap:n,scroll:o,x:e.clientX,moved:!1};const r=s=>{if(!S||!S.moved&&Math.abs(s.clientX-S.x)<4)return;S.moved||(S.moved=!0,S.wrap.setAttribute("data-dragging",""),S.scroll.parentElement?.parentElement?.setAttribute("data-dragging","")),s.preventDefault();const i=t.document.elementFromPoint(s.clientX,s.clientY)?.closest?.("[data-chip-wrap]");if(!i||i===S.wrap||i.parentElement!==S.scroll)return;const c=i.getBoundingClientRect();s.clientX<c.left+c.width/2?S.scroll.insertBefore(S.wrap,i):S.scroll.insertBefore(S.wrap,i.nextSibling)},a=()=>{t.document.removeEventListener("pointermove",r,!0),t.document.removeEventListener("pointerup",a,!0),t.document.removeEventListener("pointercancel",a,!0);const s=S;if(S=null,!s?.moved)return;s.wrap.removeAttribute("data-dragging"),s.scroll.parentElement?.parentElement?.removeAttribute("data-dragging");const i=c=>{c.preventDefault(),c.stopPropagation()};t.addEventListener("click",i,!0),t.setTimeout(()=>t.removeEventListener("click",i,!0),0),qn(t,[...s.scroll.querySelectorAll("[data-chip-wrap]")].map(c=>c.dataset.chip))};t.document.addEventListener("pointermove",r,!0),t.document.addEventListener("pointerup",a,!0),t.document.addEventListener("pointercancel",a,!0)}function gt(t){t?.document.getElementById(y)?.remove()}function to(t){const e=()=>eo(t);Wt!==t&&(Wt=t,t.addEventListener("resize",e),t.addEventListener("scroll",e,!0));const n=St(t)?.contentWindow;if(n&&!n._sveStripBound)try{n._sveStripBound=!0,n.addEventListener("scroll",e,!0),n.addEventListener("resize",e),n.addEventListener("statamic:preview-updated",()=>{t.setTimeout(()=>Lt(t,Y?.path||""),60)})}catch{}}function eo(t){const e=t?.document.getElementById(y);!e||!Y?.el?.isConnected||$e(t,e,Y.frame,Y.el)}function Lt(t,e){if(!t||!Yn(t)){gt(t);return}const n=t.document,o=St(t),r=o?.contentDocument,a=e&&r?r.querySelector(`[data-sve-ht-path="${e}"]`):null;if(!a||!f.tag){gt(t);return}Gn(n),to(t);let s=n.getElementById(y);s||(s=n.createElement("div"),s.id=y,n.body.appendChild(s));let i=s.querySelector('[data-group="tag"]');if(!i){i=n.createElement("div"),i.setAttribute("data-group","tag");const l=n.createElement("span");l.setAttribute("data-sve-tw-strip-tag",""),i.appendChild(l),s.appendChild(i)}i.firstChild.textContent=`<${f.tag}>`;let c=s.querySelector('[data-group="classes"]'),p=c?.querySelector("[data-scroll]");const m=f.groups.flatMap(l=>l.chips);if(m.length&&!c){c=n.createElement("div"),c.setAttribute("data-group","classes"),p=n.createElement("div"),p.setAttribute("data-scroll","");const l=n.createElement("span");l.setAttribute("data-fade",""),c.appendChild(p),c.appendChild(l);const u=()=>{p.scrollWidth-p.scrollLeft-p.clientWidth>2?c.setAttribute("data-overflow",""):c.removeAttribute("data-overflow")};p.addEventListener("scroll",u),c._sveSync=u,s.insertBefore(c,s.querySelector('[data-group="add"]'))}if(!m.length)c?.remove();else if(p){p.replaceChildren();for(const l of m){const u=n.createElement("button");if(u.type="button",u.title=l.title||"",l.locked&&u.setAttribute("data-locked",""),l.color){const g=n.createElement("span");g.setAttribute("data-dot",""),g.style.background=l.color,u.appendChild(g)}u.appendChild(n.createTextNode(l.raw));const v=n.createElement("span");if(v.setAttribute("data-chip-wrap",""),v.dataset.chip=l.id,v.appendChild(u),l.locked||v.addEventListener("pointerdown",g=>Jn(t,g,v,p)),!l.locked){const g=n.createElement("button");g.type="button",g.setAttribute("data-drop",""),g.title=f.dropTitle||"",g.textContent="−",g.addEventListener("click",M=>{M.preventDefault(),M.stopPropagation(),f.onDrop?.(l.id)}),v.appendChild(g),u.addEventListener("click",M=>{M.preventDefault(),M.stopPropagation(),f.onChip?.(M,l.id)})}p.appendChild(v)}t.requestAnimationFrame(()=>c._sveSync?.())}if(!s.querySelector('[data-group="add"]')){const l=n.createElement("div");l.setAttribute("data-group","add");const u=n.createElement("button");u.type="button",u.setAttribute("data-add","");const v=n.createElement("span");v.setAttribute("data-plus",""),v.textContent="+",u.appendChild(v),u.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),Xn(t,g.currentTarget)}),l.appendChild(u),s.appendChild(l)}Y={frame:o,el:a,path:e},$e(t,s,o,a)}function $e(t,e,n,o){const r=n.getBoundingClientRect(),a=n.clientWidth?r.width/n.clientWidth:1,s=o.getBoundingClientRect(),i=e.getBoundingClientRect(),c=6,p=16,m=r.left+s.left*a,l=r.top+s.top*a-i.height-c,u=r.top+s.top*a+c,v=Math.max(c,r.left+p),g=Math.max(v,Math.min(r.right,t.innerWidth)-i.width-p);e.style.left=`${Math.max(v,Math.min(m,g))}px`,e.style.top=`${Math.max(r.top+p,l<r.top+p?u:l)}px`;const M=n.clientHeight||r.height;e.hidden=s.bottom<=0||s.top>=M}export{Jt as a,Yn as b,A as c,lo as d,so as e,wt as f,ao as g,Vn as h,ro as i,uo as j,Xn as k,It as l,co as m,Zt as p,po as r,fo as s,io as t};
