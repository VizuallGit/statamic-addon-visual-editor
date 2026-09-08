import{r as xe,_ as ke,o as x,c as k,u as T,a as v,f as _,t as S,F as P,e as D,I as lt,d as I,m as $e,n as ht,Q as L,H as F,T as qt,a2 as ct,K as jt,w as R,L as Dt,j as $,l as Ce,i as _e,a9 as K,M as B,a8 as vt,N as Te,A as Se}from"./addon-BMstgNMv.js";import{H as Ee}from"./html-pick-align-gkRPeJkt.js";const Ht=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function Nt(t){return String(t||"").replace(/\{\{[\s\S]*?\}\}/g,e=>" ".repeat(e.length))}function Me(t){const e=t.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(!e)return"";const n=e[2].match(/\[\s*([\s\S]*?)\s*\]/);if(n){const o=n[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).find(s=>/^[a-zA-Z_][\w-]*$/.test(s));if(o)return o}return(e[2].trim().split(/\s+/)[0]||"").replace(/\[|\]/g,"")}function Vt(t,e,n,o){t.hidden=!0,o&&(t.wrapFrom=e,t.wrapTo=n);for(const s of t.children)Vt(s,e,n,!1)}function Ut(t,e,n,o){const s=[],a=[];let r=n,i=0;const c=f=>{a.length?a[a.length-1].children.push(f):s.push(f)};for(;r<o;){if(e[r]!=="<"){r+=1;continue}if(e.startsWith("<!--",r)){const d=e.indexOf("-->",r+4),g=d===-1||d>o?o:d,z=d===-1||d+3>o?o:d+3,nt=Ut(t,e,r+4,g);for(const St of nt)Vt(St,r,z,!0),c(St);r=z;continue}if(e.startsWith("<!",r)||e.startsWith("<?",r)){const d=e.indexOf(">",r+2);r=d===-1||d+1>o?o:d+1;continue}const f=e[r+1]==="/",m=e.slice(r,o).match(/^<\/?([a-zA-Z][a-zA-Z0-9:-]*)/);if(!m){r+=1;continue}const l=m[1].toLowerCase(),u=e.indexOf(">",r);if(u===-1||u>=o)break;const h=e.slice(r,u+1),M=!f&&(Ht.has(l)||/\/\s*>$/.test(h));if(f){for(let d=a.length-1;d>=0;d-=1)if(a[d].tag===l){a[d].to=u+1,a.length=d;break}r=u+1;continue}const W=Me(t.slice(r,u+1)),q=a.length?a[a.length-1]:null,j=q?q.children:s,et=q?`${q.path}/${j.length}:${l}`:`${j.length}:${l}`,y={id:`${l}-${r}-${i}`,tag:l,klass:W,path:et,label:W,from:r,to:u+1,openTo:u+1,hidden:!1,children:[]};i+=1,c(y),M?y.to=u+1:a.push(y),r=u+1}for(;a.length;)a.pop().to=o;return s}function Kt(t){const e=String(t||""),n=Nt(e);return Ut(e,n,0,n.length)}function gt(t,e,n=0,o=[]){for(const s of t){const a=s.children.length>0,r=e.has(s.id);o.push({id:s.id,tag:s.tag,klass:s.klass||"",path:s.path,label:s.label,from:s.from,to:s.to,openTo:s.openTo,hidden:!!s.hidden,wrapFrom:s.wrapFrom,wrapTo:s.wrapTo,depth:n,hasChildren:a,shut:r}),a&&!r&&gt(s.children,e,n+1,o)}return o}function Jn(t){return Ht.has(String(t||"").toLowerCase())}const Zt=["sm","md","lg","xl","2xl","max-sm","max-md","max-lg","max-xl","max-2xl","dark","hover","focus","focus-visible","active","disabled","group-hover"],Et={sm:"(min-width: 640px)",md:"(min-width: 768px)",lg:"(min-width: 1024px)",xl:"(min-width: 1280px)","2xl":"(min-width: 1536px)","max-sm":"(max-width: 639px)","max-md":"(max-width: 767px)","max-lg":"(max-width: 1023px)","max-xl":"(max-width: 1279px)","max-2xl":"(max-width: 1535px)",dark:"(prefers-color-scheme: dark)"},Mt={hover:":hover",focus:":focus","focus-visible":":focus-visible",active:":active",disabled:":disabled","group-hover":":is(:where(.group):hover *)"},Le={relative:"position: relative",absolute:"position: absolute",fixed:"position: fixed",sticky:"position: sticky",static:"position: static",block:"display: block",inline:"display: inline","inline-block":"display: inline-block",flex:"display: flex","inline-flex":"display: inline-flex",grid:"display: grid",hidden:"display: none","flex-row":"flex-direction: row","flex-col":"flex-direction: column","flex-wrap":"flex-wrap: wrap","items-start":"align-items: flex-start","items-center":"align-items: center","items-end":"align-items: flex-end","items-stretch":"align-items: stretch","justify-start":"justify-content: flex-start","justify-center":"justify-content: center","justify-end":"justify-content: flex-end","justify-between":"justify-content: space-between","justify-around":"justify-content: space-around","text-left":"text-align: left","text-center":"text-align: center","text-right":"text-align: right","w-full":"width: 100%","h-full":"height: 100%","w-screen":"width: 100vw","h-screen":"height: 100vh","overflow-hidden":"overflow: hidden","overflow-auto":"overflow: auto","pointer-events-none":"pointer-events: none",underline:"text-decoration-line: underline",italic:"font-style: italic","font-bold":"font-weight: 700","font-medium":"font-weight: 500",uppercase:"text-transform: uppercase",truncate:"overflow: hidden; text-overflow: ellipsis; white-space: nowrap","z-10":"z-index: 10","z-20":"z-index: 20","z-50":"z-index: 50"},Xt={p:"padding",px:"padding-inline",py:"padding-block",pt:"padding-top",pr:"padding-right",pb:"padding-bottom",pl:"padding-left",m:"margin",mx:"margin-inline",my:"margin-block",mt:"margin-top",mr:"margin-right",mb:"margin-bottom",ml:"margin-left",gap:"gap","gap-x":"column-gap","gap-y":"row-gap",w:"width",h:"height","min-w":"min-width","min-h":"min-height","max-w":"max-width","max-h":"max-height"},Yt={bg:"background-color",border:"border-color",outline:"outline-color",fill:"fill",stroke:"stroke"};let ot=null;function Gt(t){return t?.Statamic?.$config?.get?.("sveFeatures")?.tailwind_dock===!0}function to(t){return e=>{if(!Gt(t)||!Ae(e))return null;const n=e.matchBefore(/[^\s"']*$/),o=n?.text??"";return o.includes("{")||o.includes("}")?null:bt(t).then(s=>{const a=Pe(o,s).slice(0,80);return a.length?{from:n?n.from:e.pos,options:a,validFor:/^[^\s"'=]*$/}:null})}}function eo(t,e){return t((n,o)=>{if(!Gt(e))return null;const s=Oe(n.state,o);return s?bt(e).then(a=>{const r=Be(s.text,a);return r?{pos:s.from,end:s.to,create(){return{dom:Ie(r,Re(s.text,a))}}}:null}):null})}function Lt(t){const e={color:[],spacing:[],text:[],leading:[],font:[],radius:[]},n=/--(color|spacing|text|leading|font|radius)-([a-zA-Z0-9][a-zA-Z0-9._-]*)\s*:\s*([^;]+);/g;let o;for(;o=n.exec(String(t||""));)o[2]!=="*"&&e[o[1]].push({name:o[2],value:o[3].trim()});const s=[];Object.entries(Le).forEach(([r,i])=>{s.push({label:r,css:i,color:null})}),e.color.forEach(({name:r,value:i})=>{const c=Fe(i);Object.entries(Yt).forEach(([f,m])=>{s.push({label:`${f}-${r}`,css:`${m}: var(--color-${r})`,color:c})}),s.push({label:`text-${r}`,css:`color: var(--color-${r})`,color:c})}),e.spacing.forEach(({name:r})=>{Object.entries(Xt).forEach(([i,c])=>{s.push({label:`${i}-${r}`,css:`${c}: var(--spacing-${r})`,color:null})})}),e.text.forEach(({name:r})=>{s.push({label:`text-${r}`,css:`font-size: var(--text-${r})`,color:null})}),e.leading.forEach(({name:r})=>{s.push({label:`leading-${r}`,css:`line-height: var(--leading-${r})`,color:null})}),e.font.forEach(({name:r})=>{s.push({label:`font-${r}`,css:`font-family: var(--font-${r})`,color:null})}),e.radius.forEach(({name:r})=>{s.push({label:r==="DEFAULT"?"rounded":`rounded-${r}`,css:`border-radius: var(--radius-${r})`,color:null})});const a=new Map;return s.forEach(r=>{a.has(r.label)||a.set(r.label,r)}),{items:[...a.values()],byUtility:a}}function bt(t){return ot||(ot=t.fetch("/!/sve/tailwind-theme",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{css:""}).then(e=>Lt(typeof e.css=="string"?e.css:"")).catch(()=>Lt(""))),ot}function Ae(t){return!!(t.matchBefore(/class\s*=\s*"[^"]*$/i)||t.matchBefore(/class\s*=\s*'[^']*$/i))}function Oe(t,e){const n=t.doc.lineAt(e),o=e-n.from,s=ze(n.text,o);if(!s)return null;const a=n.text.slice(s.valueFrom,s.valueTo),r=o-s.valueFrom,i=a.slice(0,r),c=a.slice(r),f=(i.match(/[^\s]*$/)||[""])[0],m=(c.match(/^[^\s]*/)||[""])[0],l=f+m;if(!l||l.includes("{"))return null;const u=n.from+s.valueFrom+(i.length-f.length);return{from:u,to:u+l.length,text:l}}function ze(t,e){const n=/\bclass\s*=\s*(["'])/gi;let o;for(;o=n.exec(t);){const s=o[1],a=o.index+o[0].length,r=t.indexOf(s,a),i=r===-1?t.length:r;if(e>=a&&e<=i)return{valueFrom:a,valueTo:i}}return null}function yt(t){const e=[...Zt].sort((r,i)=>i.length-r.length),n=[];let o=String(t||""),s=!0;for(;s;){s=!1;for(const r of e){const i=`${r}:`;if(o.startsWith(i)){n.push(r),o=o.slice(i.length),s=!0;break}}}let a=!1;return o.startsWith("!")?(a=!0,o=o.slice(1)):o.endsWith("!")&&(a=!0,o=o.slice(0,-1)),{variants:n,utility:o,important:a}}function Pe(t,e){const{variants:n,utility:o}=yt(t),s=n.length?`${n.join(":")}:`:"",a=o.toLowerCase(),r=[];return!a&&!s&&Zt.forEach(i=>{r.push({label:`${i}:`,type:"keyword",detail:"variant",boost:2})}),e.items.forEach(i=>{if(a&&!i.label.startsWith(a)&&!i.label.includes(a))return;const c=`${s}${i.label}`;r.push({label:c,type:"property",detail:i.css,boost:i.label.startsWith(a)?1:0})}),r.sort((i,c)=>(c.boost||0)-(i.boost||0)||i.label.localeCompare(c.label))}function Be(t,e){const{variants:n,utility:o,important:s}=yt(t),a=e.byUtility.get(o);if(!a)return"";let r=a.css;s&&(r+=" !important");const i=t.replace(/[^a-zA-Z0-9_-]/g,l=>`\\${l}`);let c="";const f=[];n.forEach(l=>{Et[l]?f.push(Et[l]):Mt[l]&&(c+=Mt[l])});let m=`.${i}${c} { ${r} }`;return f.slice().reverse().forEach(l=>{m=`@media ${l} {
  ${m}
}`}),m}function Re(t,e){const{utility:n}=yt(t);return e.byUtility.get(n)?.color||null}function Fe(t){const e=String(t||"").trim();return/^#([0-9a-fA-F]{3,8})$/.test(e)?e:null}function Ie(t,e){const n=document.createElement("div");if(n.className="sve-tw-info",e){const s=document.createElement("span");s.className="sve-tw-swatch",s.style.background=e,n.appendChild(s)}const o=document.createElement("pre");return o.textContent=t,n.appendChild(o),n}const p=xe({emptyText:"",tag:"",scope:"",scopeTitle:"",baseLabel:"",groups:[],canEdit:!1,onChip:null,variant:"",breakpoints:[],onBreakpoint:null,state:"",stateLabel:"",onState:null,onTag:null,siteClasses:[]});function Qt(t,e,n){const o=String(t||"").slice(e,n),s=Nt(o),a=/(\sclass\s*=\s*)(["'])/i.exec(s);if(!a)return null;const r=a[2],i=a.index+a[1].length+1,c=s.indexOf(r,i);return c===-1?null:{from:e+i,to:e+c,quote:r,value:o.slice(i,c)}}function We(t){const e=String(t||""),n=[];let o=0;for(;o<e.length;){if(/\s/.test(e[o])){o+=1;continue}let s=o,a=!1;for(;s<e.length;){if(e.startsWith("{{",s)){const r=e.indexOf("}}",s+2);a=!0,s=r===-1?e.length:r+2;continue}if(/\s/.test(e[s]))break;s+=1}n.push({text:e.slice(o,s),from:o,to:s,dynamic:a}),o=s}return n}function qe(t){const e=String(t||""),n=[];let o=0,s=0;for(let r=0;r<e.length;r+=1){const i=e[r];i==="["||i==="("?o+=1:i==="]"||i===")"?o=Math.max(0,o-1):i===":"&&o===0&&(n.push(e.slice(s,r)),s=r+1)}const a=e.slice(s);return{variants:n,base:a}}function je(t){let n=String(t||""),o="";n.startsWith("!")?(o="pre",n=n.slice(1)):n.endsWith("!")&&(o="post",n=n.slice(0,-1));let s="";const a=De(n);return a!==-1&&(s=n.slice(a),n=n.slice(0,a)),{name:n,modifier:s,important:o}}function De(t){let e=0;for(let n=0;n<t.length;n+=1){const o=t[n];if(o==="["||o==="(")e+=1;else if(o==="]"||o===")")e=Math.max(0,e-1);else if(o==="/"&&e===0)return n}return-1}function ut({variants:t,name:e,modifier:n,important:o}){let s=`${e}${n||""}`;return o==="pre"?s=`!${s}`:o==="post"&&(s=`${s}!`),[...t||[],s].join(":")}function Jt(t){const e=We(t),n=new Map;let o=null,s=0;const a=e.findIndex(i=>i.text==="]");if(e[0]?.text==="["&&a>0){const i=e.slice(1,a);o={from:e[0].from,to:e[a].to,label:`[ ${i.map(c=>c.text).join(" ")} ]`},s=a+1}for(;s<e.length;s+=1){const i=e[s],{variants:c,base:f}=qe(i.text),{name:m,modifier:l,important:u}=je(f),h=c.join(":");n.has(h)||n.set(h,{key:h,variants:c,items:[]}),n.get(h).items.push({raw:i.text,from:i.from,to:i.to,dynamic:i.dynamic,variants:c,name:m,modifier:l,important:u})}const r=[...n.values()];return r.sort((i,c)=>i.key===""?-1:c.key===""?1:0),{scope:o,groups:r}}function dt(t,e,n){const o=String(t||"");if(n)return o.slice(0,e.from)+n+o.slice(e.to);let s=e.from,a=e.to;if(s>0&&(o[s-1]===" "||o[s-1]==="	"))for(;s>0&&(o[s-1]===" "||o[s-1]==="	");)s-=1;else for(;a<o.length&&(o[a]===" "||o[a]==="	");)a+=1;return He(o.slice(0,s)+o.slice(a),s)}function He(t,e){const n=t.lastIndexOf(`
`,Math.max(0,e-1));if(n===-1)return t;const o=t.indexOf(`
`,n+1);return t.slice(n+1,o===-1?t.length:o).trim()!==""?t:t.slice(0,n)+t.slice(o===-1?t.length:o)}function te(t,e){const n=String(t||"");return n.trim()?`${n.replace(/\s+$/,"")} ${e}`:e}function ee(t,e,n){const o=String(t||""),s=String(n||"").trim().toLowerCase();if(!/^[a-z][a-z0-9-]*$/.test(s)||!e?.tag||s===e.tag.toLowerCase())return o;const a=e.tag.toLowerCase(),r=o.slice(e.from,e.openTo);if(!new RegExp(`^<${a}(?=[\\s/>])`,"i").test(r))return o;let i=o;const c=i.toLowerCase().lastIndexOf(`</${a}`,e.to);return c>e.from&&c<e.to&&(i=i.slice(0,c)+`</${s}`+i.slice(c+2+a.length)),i.slice(0,e.from)+`<${s}`+i.slice(e.from+1+a.length)}function Ne(t,e,n){const o=Qt(t,e.from,e.openTo);if(o)return t.slice(0,o.from)+n+t.slice(o.to);const s=String(t).slice(e.from,e.openTo),a=/^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(s);if(!a||!n)return t;const r=e.from+a[0].length;return`${t.slice(0,r)} class="${n}"${t.slice(r)}`}const Ve=[...Object.keys(Xt),...Object.keys(Yt),"text","leading","font","rounded"].sort((t,e)=>e.length-t.length);let st=null;function Ue(t){return st||(st=bt(t).then(Ke)),st}function ne(t){const e=String(t||"");if(e.includes(";"))return"";const n=e.indexOf(":");return n===-1?"":e.slice(0,n).trim()}function Ke(t){const e=new Map,n=new Map,o=new Map;for(const s of t.items){const a=ne(s.css);a&&(e.has(a)||e.set(a,[]),e.get(a).push(s),n.set(s.label,a));const r=oe(s.label);r&&(o.has(r)||o.set(r,[]),o.get(r).push(s))}return{catalog:t,byProperty:e,propertyOfUtility:n,byPrefix:o}}function oe(t){for(const e of Ve)if(String(t).startsWith(`${e}-`))return e;return""}function se(t,e){if(!e||!t)return null;const n=e.propertyOfUtility.get(t);if(n)return{label:n,options:e.byProperty.get(n)||[]};const o=oe(t),s=o?e.byPrefix.get(o):null;return s?.length?{label:ne(s[0].css)||o,options:s}:null}function re(t,e){return e?.catalog?.byUtility?.get(t)?.css||""}function Ze(t,e){return e?.catalog?.byUtility?.get(t)?.color||""}const Xe={class:"sve-tw"},Ye={key:0,class:"sve-tw-head"},Ge=["disabled"],Qe=["title","data-active","disabled","onClick"],Je=["data-active","disabled"],tn={key:1,class:"sve-tw-empty"},en=["data-sve-tw-base","data-current"],nn={class:"sve-tw-chips"},on=["title","onClick"],sn={__name:"TwClassList",setup(t){function e(n){const o={"data-sve-tw-chip":n.id};return n.locked&&(o["data-sve-tw-locked"]=""),n.open&&(o["data-open"]=""),o}return(n,o)=>(x(),k("div",Xe,[T(p).tag?(x(),k("div",Ye,[v("button",{type:"button",class:"sve-tw-tag",disabled:!T(p).canEdit,onClick:o[0]||(o[0]=_(s=>T(p).onTag?.(s),["prevent","stop"]))},"<"+S(T(p).tag)+">",9,Ge),(x(!0),k(P,null,D(T(p).breakpoints,s=>(x(),k("button",{key:s.index,type:"button","data-sve-tw-bp":"",title:s.title,"data-active":s.active?"":void 0,disabled:!T(p).canEdit,onClick:_(a=>T(p).onBreakpoint?.(s.index),["prevent","stop"])},S(s.label),9,Qe))),128)),v("button",{type:"button","data-sve-tw-state":"","data-active":T(p).state?"":void 0,disabled:!T(p).canEdit,onClick:o[1]||(o[1]=_(s=>T(p).onState?.(s),["prevent","stop"]))},[lt(S(T(p).stateLabel)+" ",1),o[2]||(o[2]=v("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[v("path",{d:"m6 9 6 6 6-6"})],-1))],8,Je),o[3]||(o[3]=v("span",{class:"sve-tw-gap"},null,-1))])):I("",!0),T(p).groups.length?I("",!0):(x(),k("div",tn,S(T(p).emptyText),1)),(x(!0),k(P,null,D(T(p).groups,s=>(x(),k("div",{key:s.key,class:"sve-tw-group"},[v("span",{class:"sve-tw-variant","data-sve-tw-base":s.key===""?"":void 0,"data-current":s.current?"":void 0},S(s.key===""?T(p).baseLabel:s.key),9,en),v("div",nn,[(x(!0),k(P,null,D(s.chips,a=>(x(),k("button",$e({key:a.id,type:"button"},{ref_for:!0},e(a),{title:a.title,onClick:_(r=>T(p).onChip?.(r,a.id),["prevent","stop"])}),[a.color?(x(),k("span",{key:0,class:"sve-tw-dot",style:ht({background:a.color})},null,4)):I("",!0),lt(" "+S(a.raw),1)],16,on))),128))])]))),128))]))}},rn=ke(sn,[["__scopeId","data-v-039d7562"]]),an={key:0,"data-sve-tw-menu-title":""},ln={"data-sve-tw-menu-list":""},cn=["data-active","title","onClick"],un={"data-sve-tw-tick":""},dn={"data-sve-tw-label":""},wt={__name:"TwClassMenu",props:{title:{type:String,default:""},options:{type:Array,default:()=>[]},removeLabel:{type:String,default:""},onPick:{type:Function,required:!0},onRemove:{type:Function,required:!0}},setup(t){return(e,n)=>(x(),k(P,null,[t.title?(x(),k("div",an,S(t.title),1)):I("",!0),v("div",ln,[(x(!0),k(P,null,D(t.options,o=>(x(),k("button",{key:o.label,type:"button","data-sve-tw-option":"","data-active":o.active?"":void 0,title:o.css,onClick:_(s=>t.onPick(o.label),["prevent","stop"])},[v("span",un,S(o.active?"✓":""),1),o.color?(x(),k("span",{key:0,"data-sve-tw-dot":"",style:ht({background:o.color})},null,4)):I("",!0),v("span",dn,S(o.label),1)],8,cn))),128))]),v("button",{type:"button","data-sve-tw-remove":"",onClick:n[0]||(n[0]=_(o=>t.onRemove(),["prevent","stop"]))},[n[1]||(n[1]=v("span",{"data-sve-tw-tick":""},"✕",-1)),lt(S(t.removeLabel),1)])],64))}},fn={"data-sve-tw-search":""},pn=["placeholder","aria-label","onKeydown"],mn={"data-sve-tw-tabs":""},hn=["data-active"],vn=["data-active"],gn={key:0,"data-sve-tw-add-empty":""},bn=["data-cursor","data-active","data-sve-tw-off","title","onMouseenter","onClick"],yn={"data-sve-tw-label":""},wn={__name:"TwAddClass",props:{label:{type:String,default:""},placeholder:{type:String,default:""},sitePlaceholder:{type:String,default:""},emptyText:{type:String,default:""},offText:{type:String,default:""},siteLabel:{type:String,default:""},tailwindLabel:{type:String,default:""},search:{type:Function,required:!0},onAdd:{type:Function,required:!0}},setup(t){const e=t,n=L(""),o=L(null),s=L("tailwind"),a=L(null),r=L(-1),i=L(!1),c=F(()=>n.value.trim().toLowerCase()),f=F(()=>(p.siteClasses||[]).flatMap(y=>y.items).filter(y=>!c.value||y.name.toLowerCase().includes(c.value))),m=F(()=>e.search(n.value)),l=F(()=>s.value==="site"?f.value:m.value),u=F(()=>s.value==="site"?e.sitePlaceholder:e.placeholder);qt(()=>ct(()=>o.value?.focus()));function h(y){return y?.name||y?.label||""}function M(y){i.value=!0;const d=l.value.length;if(!d){r.value=-1;return}const g=r.value+y;r.value=g<0?-1:Math.min(g,d-1),ct(()=>W())}function W(){const y=a.value?.querySelector("[data-cursor]");if(!y)return;let d=y.parentElement;for(;d&&d.scrollHeight<=d.clientHeight;)d=d.parentElement;if(!d)return;const g=y.offsetTop,z=g+y.offsetHeight;g<d.scrollTop?d.scrollTop=g:z>d.scrollTop+d.clientHeight&&(d.scrollTop=z-d.clientHeight)}function q(y){i.value||(r.value=y)}function j(){r.value=-1}function et(){const y=r.value>=0?l.value[r.value]:null,d=y?h(y):n.value.trim();d&&e.onAdd(d)}return(y,d)=>(x(),k(P,null,[v("div",fn,[d[7]||(d[7]=v("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[v("circle",{cx:"11",cy:"11",r:"7"}),v("path",{d:"m20 20-3.5-3.5"})],-1)),jt(v("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":d[0]||(d[0]=g=>n.value=g),type:"text",placeholder:u.value,"aria-label":t.label,onInput:j,onKeydown:[d[1]||(d[1]=R(_(g=>M(1),["prevent"]),["down"])),d[2]||(d[2]=R(_(g=>M(-1),["prevent"]),["up"])),R(_(et,["prevent"]),["enter"]),d[3]||(d[3]=R(_(()=>{},["stop"]),["escape"]))]},null,40,pn),[[Dt,n.value]])]),v("div",mn,[v("button",{type:"button","data-sve-tw-tab":"","data-active":s.value==="tailwind"?"":void 0,onClick:d[4]||(d[4]=_(g=>{s.value="tailwind",j()},["prevent","stop"]))},S(t.tailwindLabel),9,hn),v("button",{type:"button","data-sve-tw-tab":"","data-active":s.value==="site"?"":void 0,onClick:d[5]||(d[5]=_(g=>{s.value="site",j()},["prevent","stop"]))},S(t.siteLabel),9,vn)]),l.value.length?I("",!0):(x(),k("div",gn,S(t.emptyText),1)),v("div",{ref_key:"rowsEl",ref:a,onMousemove:d[6]||(d[6]=g=>i.value=!1)},[(x(!0),k(P,null,D(l.value,(g,z)=>(x(),k("button",{key:g.name||g.label,type:"button","data-sve-tw-option":"","data-cursor":z===r.value?"":void 0,"data-active":z===r.value?"":void 0,"data-sve-tw-off":g.loaded===!1?"":void 0,title:g.loaded===!1?t.offText:g.file||g.css,onMouseenter:nt=>q(z),onClick:_(nt=>t.onAdd(g.name||g.label),["prevent","stop"])},[g.color?(x(),k("span",{key:0,"data-sve-tw-dot":"",style:ht({background:g.color})},null,4)):I("",!0),v("span",yn,S(g.name||g.label),1)],40,bn))),128))],544)],64))}},xn={"data-sve-tw-search":""},kn=["placeholder","aria-label","onKeydown"],$n=["data-active","onMouseenter","onClick"],Cn={"data-sve-tw-tick":""},_n={"data-sve-tw-label":""},ae={__name:"TwTagMenu",props:{label:{type:String,default:""},placeholder:{type:String,default:""},current:{type:String,default:""},tags:{type:Array,default:()=>[]},onPick:{type:Function,required:!0}},setup(t){const e=t,n=L(""),o=L(null),s=L(-1),a=L(!1),r=F(()=>n.value.trim().toLowerCase()),i=F(()=>{if(!r.value)return e.tags;const m=e.tags.filter(l=>l.includes(r.value));return m.sort((l,u)=>(l.startsWith(r.value)?0:1)-(u.startsWith(r.value)?0:1)),m});qt(()=>ct(()=>o.value?.focus()));function c(m){a.value=!0;const l=i.value.length;s.value=l?Math.min(Math.max(s.value+m,-1),l-1):-1}function f(){const m=s.value>=0?i.value[s.value]:n.value.trim().toLowerCase();m&&e.onPick(m)}return(m,l)=>(x(),k(P,null,[v("div",xn,[l[6]||(l[6]=v("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[v("circle",{cx:"11",cy:"11",r:"7"}),v("path",{d:"m20 20-3.5-3.5"})],-1)),jt(v("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":l[0]||(l[0]=u=>n.value=u),type:"text",placeholder:t.placeholder,"aria-label":t.label,onInput:l[1]||(l[1]=u=>s.value=-1),onKeydown:[l[2]||(l[2]=R(_(u=>c(1),["prevent"]),["down"])),l[3]||(l[3]=R(_(u=>c(-1),["prevent"]),["up"])),R(_(f,["prevent"]),["enter"]),l[4]||(l[4]=R(_(()=>{},["stop"]),["escape"]))]},null,40,kn),[[Dt,n.value]])]),v("div",{onMousemove:l[5]||(l[5]=u=>a.value=!1)},[(x(!0),k(P,null,D(i.value,(u,h)=>(x(),k("button",{key:u,type:"button","data-sve-tw-option":"","data-active":h===s.value||s.value===-1&&u===t.current?"":void 0,onMouseenter:M=>a.value?null:s.value=h,onClick:_(M=>t.onPick(u),["prevent","stop"])},[v("span",Cn,S(u===t.current?"✓":""),1),v("span",_n,"<"+S(u)+">",1)],40,$n))),128))],32)],64))}},w="__sve-tw-menu",At="--sve-tw-anchor",Tn=typeof CSS<"u"&&CSS.supports?.("anchor-name: --x");let G=null;const Ot="__sve-tw-style",xt=[{key:"",all:!0,device:"Responsive",label:"tw_size_all"},{key:"",device:"Laptop",label:"tw_size_laptop",prefix:""},{key:"max-lg",device:"Tablet",label:"responsive_tablet",under:1024},{key:"max-md",device:"Mobile",label:"responsive_mobile",under:768}],zt=["","dark","hover","focus","active","before","after"],ie={Mobile:"max-md",Tablet:"max-lg",Laptop:"",Desktop:""},le=["div","section","article","header","footer","main","aside","nav","h1","h2","h3","h4","h5","h6","p","span","a","button","label","ul","ol","li","figure","figcaption","blockquote","strong","em","small","picture","img","video","form","table","tr","td","th"];let ce="",H="",tt=!1;function Sn(){try{return ie[vt(window,"sve-lp-device")]??""}catch{return""}}function kt(){return tt?ce:Sn()}function ue(){return[kt(),H].filter(Boolean)}function $t(){return ue().join(":")}const En=/^(max-)?(sm|md|lg|xl|2xl)$/;function Mn(t){return String(t||"").split(":").find(e=>En.test(e))||""}function de(){if(tt)return!0;try{return Object.prototype.hasOwnProperty.call(ie,vt(window,"sve-lp-device"))}catch{return!1}}function Ln(t){if(!de())return!0;const e=Mn(t);return e===kt()?!0:!xt.some(n=>n.key===e)}let b=null,Q=new Map,A=null,rt=!1,J="",ft=null;function fe(t){return t?.querySelector?.('[data-sve-style="tw"] [data-sve-tw-host]')||null}function pe(t){if(t.getElementById(Ot))return;const e=t.createElement("style");e.id=Ot,e.textContent=`
    #${w} {
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
    #${w} [data-sve-tw-menu-title] {
      padding: 0.1em 0.2em 0.5em;
      opacity: .55;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.6875rem;
    }
    #${w} [data-sve-tw-option],
    #${w} [data-sve-tw-remove] {
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
    #${w} [data-sve-tw-option]:hover,
    #${w} [data-sve-tw-remove]:hover {
      background: rgba(255,255,255,.1);
    }
    #${w} [data-sve-tw-option][data-active] {
      background: rgba(255,255,255,.06);
    }
    #${w} [data-sve-tw-option][data-sve-tw-off] [data-sve-tw-label] {
      opacity: .45;
      text-decoration: line-through;
      text-decoration-thickness: 1px;
    }
    #${w} [data-sve-tw-tick] {
      flex: 0 0 auto;
      width: 0.9em;
      opacity: .7;
      font-family: ui-sans-serif, system-ui, sans-serif;
      line-height: 1;
    }
    #${w} [data-sve-tw-dot] {
      flex: 0 0 auto;
      width: 0.9em;
      height: 0.9em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
    #${w} [data-sve-tw-label] {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #${w} [data-sve-tw-remove] {
      margin-top: 0.3rem;
      border-top: 1px solid rgba(255,255,255,.14);
      border-radius: 0 0 0.4em 0.4em;
      padding-top: 0.6em;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    #${w} [data-sve-tw-search] {
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
    #${w} [data-sve-tw-search]:focus-within {
      border-color: rgba(147,197,253,.7);
    }
    #${w} [data-sve-tw-search] svg {
      flex: 0 0 auto;
      opacity: .5;
    }
    #${w} [data-sve-tw-add-input] {
      all: unset;
      flex: 1 1 auto;
      min-width: 0;
      color: inherit;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.75rem;
    }
    #${w} [data-sve-tw-tabs] {
      display: flex;
      gap: 0.2rem;
      margin-bottom: 0.45rem;
      padding: 0.15rem;
      border-radius: 0.45em;
      background: rgba(0,0,0,.28);
    }
    #${w} [data-sve-tw-tab] {
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
    #${w} [data-sve-tw-tab]:hover { opacity: 1; }
    #${w} [data-sve-tw-tab][data-active] {
      opacity: 1;
      background: rgba(255,255,255,.14);
    }
    #${w} [data-sve-tw-add-empty] {
      padding: 0.4em 0.5em;
      opacity: .55;
    }
  `,t.head.appendChild(e)}function me(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e.contentDocument;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o.contentDocument}catch{}return null}function An(t,e,n){const o=me(t);if(!(!o||!b?.path))for(const s of o.querySelectorAll(`[${Ee}="${b.path}"]`))try{e&&s.classList.remove(e),n&&s.classList.add(n)}catch{}}const at=new Map,On=/(^|-)color$|^fill$|^stroke$/;function Ct(t){const e=String(t||""),n=e.slice(0,e.indexOf(":")).trim();return On.test(n)&&/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(e)?.[1]||""}function he(t,e){if(!e)return"";if(at.has(e))return at.get(e);const n=me(t),o=n?.documentElement,s=n?.defaultView;if(!o||!s)return"";let a="",r=e;for(let i=0;i<6&&r;i+=1){try{a=s.getComputedStyle(o).getPropertyValue(r).trim()}catch{return""}if(!a)return"";if(r=Ct(a),!r)break}return a&&!a.startsWith("var(")?(at.set(e,a),a):""}function zn(t,e){return Ze(e,A)||he(t,Ct(re(e,A)))}function E(t){const e=t?.document.getElementById(w);G&&(G.style.removeProperty("anchor-name"),G=null),ft?.(),ft=null,J="",e&&(e._sveApp?.unmount(),e.remove())}function Pt(t,e,n){const o=e.getBoundingClientRect(),s=n.offsetWidth||176,a=8,r=140,i=e.closest?.("#__sve-tw-strip")?Zn(t):null,c=i?i.top:0,f=i?i.bottom:t.innerHeight,m=i?i.left:0,l=i?i.right:t.innerWidth,u=o.bottom+4,h=f-u-a,M=Math.max(r,Math.min(h,420));n.style.left=`${Math.max(m+a,Math.min(o.left,l-s-a))}px`,n.style.maxHeight=`${M}px`,n.style.top=`${h>=r?u:Math.max(c+a,f-a-M)}px`}function N(t,e,n,o){const s=t.document;E(t),pe(s);const a=s.createElement("div");a.id=w,s.body.appendChild(a),a._sveApp=Ce(n,a,o);const r=Tn&&!!e.closest?.("#__sve-tw-strip");r?(G=e,e.style.setProperty("anchor-name",At),a.style.setProperty("position","absolute"),a.style.setProperty("position-anchor",At),a.style.setProperty("position-area","block-end span-inline-start"),a.style.setProperty("position-try-fallbacks","flip-block, flip-inline, flip-block flip-inline"),a.style.setProperty("margin","4px 0 0 0"),a.style.setProperty("max-height","20rem")):Pt(t,e,a);const i=()=>{r||Pt(t,e,a)},c=m=>{!a.contains(m.target)&&!e.contains(m.target)&&(E(t),Z())},f=m=>{m.key==="Escape"&&(E(t),Z())};return s.addEventListener("pointerdown",c,!0),s.addEventListener("keydown",f,!0),t.addEventListener("scroll",i,!0),t.addEventListener("resize",i),ft=()=>{s.removeEventListener("pointerdown",c,!0),s.removeEventListener("keydown",f,!0),t.removeEventListener("scroll",i,!0),t.removeEventListener("resize",i)},a}function ve(t,e,n){return(e||[]).map(o=>({label:o.label,css:o.css,color:o.color||he(t,Ct(o.css)),active:o.label===n}))}function X(){return!b||B("dock:is-locked")===!0}function Y(){const t=B("dock:html");if(!b||typeof t!="string"||t[b.from]!=="<")return null;const e=Qt(t,b.from,b.openTo);return{html:t,value:e?e.value:""}}function Pn(t){if(!b?.path)return;const n=gt(Kt(t),new Set).find(o=>o.path===b.path);n&&(b={from:n.from,openTo:n.openTo,path:n.path,tag:n.tag})}function V(t,e,n,o,s){const a=Ne(e,b,n);a!==e&&(An(t,o,s),B("dock:set-html",a),Pn(a),O(t))}function pt(t){return se(t,A)?.label||""}function ge(t){return Jt(t).groups.flatMap(e=>e.items)}function be(t){const e=$t();return ge(t).filter(n=>!n.dynamic&&n.variants.join(":")===e)}function Bt(t,e){if(X()||!e)return;const n=Y();if(!n)return;const o=pt(e),s=be(n.value).find(r=>r.name===e||o&&pt(r.name)===o);if(s?.name===e){V(t,n.html,dt(n.value,s,""),e,"");return}if(s){const r=ut({variants:s.variants,name:e,modifier:s.modifier,important:s.important});V(t,n.html,dt(n.value,s,r),s.raw,r);return}const a=ut({variants:ue(),name:e,modifier:"",important:""});V(t,n.html,te(n.value,a),"",a)}function Bn(t,e){const n=String(e||"").trim(),o=$t(),s=o&&!n.includes(":")?`${o}:${n}`:n;if(X()||!n)return;const a=Y();!a||ge(a.value).some(i=>i.raw===s)||V(t,a.html,te(a.value,s),"",s.includes(":")?"":s)}function Rt(t,e,n){if(X())return;const o=Y();if(!o||o.value.slice(e.from,e.to)!==e.raw){O(t);return}const s=n?ut({variants:e.variants,name:n,modifier:e.modifier,important:e.important}):"";V(t,o.html,dt(o.value,e,s),e.raw,s)}function Rn(t,e){if(X()||!b)return;const n=B("dock:html");if(typeof n!="string"||n[b.from]!=="<")return;const o=ee(n,b,e);if(o===n)return;const s=b.from;B("dock:set-html",o);const r=gt(Kt(o),new Set).find(i=>i.from===s);r&&(b={from:r.from,openTo:r.openTo,path:r.path,tag:r.tag}),O(t),K("tw:changed")}function no(t,e,n){n?.tag&&N(t,e,ae,{label:$(t,"tw_tag"),placeholder:$(t,"tw_tag_placeholder"),current:String(n.tag).toLowerCase(),tags:le,onPick:o=>{Fn(t,n,o),E(t)}})}function Fn(t,e,n){if(B("dock:is-locked")===!0)return;const o=B("dock:html");if(typeof o!="string"||o[e.from]!=="<")return;const s=ee(o,e,n);s!==o&&B("dock:set-html",s)}function In(t,e){N(t,e,ae,{label:$(t,"tw_tag"),placeholder:$(t,"tw_tag_placeholder"),current:(b?.tag||"").toLowerCase(),tags:le,onPick:n=>{Rn(t,n),E(t)}})}function oo(t){Tt(t,b?.path||"")}function so(){return!!b}function Wn(t,e){const n=xt[e];n&&(B("lp:set-device",{win:t,key:n.device}),tt=!n.all,ce=n.key,E(t),O(t),K("tw:changed"))}function qn(t,e){N(t,e,wt,{title:$(t,"tw_state"),removeLabel:$(t,"tw_state_none"),options:zt.filter(Boolean).map(n=>({label:n,css:"",color:null,active:n===H})),onPick:n=>{H=zt.includes(n)?n:"",E(t),O(t),K("tw:changed")},onRemove:()=>{H="",E(t),O(t),K("tw:changed")}})}Te("lp:device",()=>{tt=!1,fe(window.document)&&O(window)});function jn(t){const e=t?Y():null;return e&&be(e.value).find(n=>pt(n.name)===t)?.name||""}function ro(t,e,n,o){const s=A?.byProperty.get(n)||[];if(!s.length)return;const a=jn(n);N(t,e,wt,{title:n,removeLabel:$(t,"tw_classes_remove"),options:ve(t,s,a),onPick:r=>{Bt(t,r),E(t),o?.(r)},onRemove:()=>{a&&Bt(t,a),E(t),o?.("")}})}let Ft=[],it=!1;function Dn(t){it||(it=!0,t.fetch("/!/sve/site-css/classes",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{groups:[]}).then(e=>{Ft=Array.isArray(e?.groups)?e.groups:[],p.siteClasses=Ft}).catch(()=>{it=!1}))}function Hn(t,e){Dn(t),N(t,e,wn,{label:$(t,"tw_add_class"),placeholder:$(t,"tw_add_placeholder"),emptyText:$(t,"tw_add_empty"),offText:$(t,"tw_class_not_imported"),sitePlaceholder:$(t,"tw_add_placeholder_site"),siteLabel:$(t,"tw_add_site"),tailwindLabel:$(t,"tw_add_tailwind"),search:n=>{const o=String(n||"").trim().toLowerCase();if(!o||!A)return[];const s=A.catalog.items.filter(a=>a.label.toLowerCase().includes(o));return s.sort((a,r)=>{const i=a.label.toLowerCase().startsWith(o)?0:1,c=r.label.toLowerCase().startsWith(o)?0:1;return i-c||a.label.length-r.label.length}),s.slice(0,40).map(a=>({label:a.label,css:a.css,color:a.color,active:!1}))},onAdd:n=>{Bn(t,n)}})}function Nn(t,e,n){const o=Q.get(n);if(!o||o.locked)return;if(J===n){E(t),Z();return}const s=se(o.name,A);N(t,e.currentTarget,wt,{title:s?.label||"",removeLabel:$(t,"tw_classes_remove"),options:ve(t,s?.options,o.name),onPick:a=>{Rt(t,o,a),E(t)},onRemove:()=>{Rt(t,o,""),E(t)}}),J=n,Z()}function Z(){for(const t of p.groups)for(const e of t.chips)e.open=e.id===J}function ao(t,e){if(!e||e.from==null||e.openTo==null){b=null,Q=new Map,E(t),O(t);return}b={from:e.from,openTo:e.openTo,path:e.path,tag:e.tag},O(t)}function O(t){Vn(t);const e=b?Y():null,n=e?Jt(e.value):{scope:null,groups:[]};Q=new Map,p.baseLabel=$(t,"tw_size_base"),p.scopeTitle=$(t,"tw_classes_scope"),p.variant=$t(),p.onBreakpoint=r=>Wn(t,r),p.onState=r=>qn(t,r.currentTarget);const o=de();p.breakpoints=xt.map((r,i)=>({index:i,label:$(t,r.label),title:r.under?`${r.key}:  ·  < ${r.under}px`:$(t,r.all?"tw_size_all_title":"tw_size_base_title"),active:r.all?!o:o&&r.key===kt()})),p.state=H,p.stateLabel=H||$(t,"tw_state"),p.canEdit=!X(),p.onChip=(r,i)=>Nn(t,r,i),p.onTag=r=>In(t,r.currentTarget),p.tag=b?.tag||"";const s=n.scope?.label||"";p.scope=/^\[\s*\]$/.test(s)?"":s,p.emptyText=$(t,b?n.groups.length?"tw_classes_none_size":"tw_classes_none":"tw_classes_pick"),p.groups=n.groups.filter(r=>Ln(r.key)).map(r=>({key:r.key,current:r.key===p.variant,chips:r.items.map((i,c)=>{const f={...i,id:`${r.key}-${c}-${i.from}`,locked:i.dynamic||!p.canEdit,open:!1,color:i.dynamic?"":zn(t,i.name),title:i.dynamic?$(t,"tw_classes_dynamic"):re(i.name,A)||i.raw};return Q.set(f.id,f),f})}));const a=fe(t.document);a&&(pe(t.document),_e(a,rn)),Z(),Tt(t,b?.path||""),K("tw:changed")}function Vn(t){A||rt||(rt=!0,Ue(t).then(e=>{A=e,O(t)}).catch(()=>{rt=!1}))}const ye="sve-tw-strip";function Un(t){try{return vt(t,ye)!=="0"}catch{return!0}}function io(t,e){Se(t,ye,e?"1":"0"),e||mt(t)}const C="__sve-tw-strip",It="__sve-tw-strip-style";let Wt=null,U=null;function _t(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o}catch{}return null}function Kn(t){if(t.getElementById(It))return;const e=t.createElement("style");e.id=It,e.textContent=`
    #${C} {
      position: fixed;
      z-index: 99998;
      display: flex;
      align-items: stretch;
      gap: 0.3rem;
      font-size: 0.6875rem;
    }
    #${C} [data-group] {
      display: flex;
      align-items: center;
      gap: 0.2rem;
      min-width: 0;
      padding: 0.2rem 0.3rem;
      border-radius: 0.45rem;
      border: 1px solid rgba(255,255,255,.12);
      background: #252526;
      color: #d4d4d4;
      box-shadow: 0 0.3rem 0.9rem rgba(0,0,0,.35);
    }
    #${C} [data-group="classes"] {
      position: relative;
      max-width: 30rem;
      padding: 0;
    }
    #${C} [data-scroll] {
      display: flex;
      align-items: center;
      gap: 0.2rem;
      min-width: 0;
      padding: 0.2rem 0.3rem;
      overflow-x: auto;
      scrollbar-width: none;
    }
    #${C} [data-scroll]::-webkit-scrollbar { display: none; }
    /* The fade is a sibling, never a mask on the scroller: a mask-image on a
       scrollable element resets scrollLeft in Chrome. */
    #${C} [data-fade] {
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
    #${C} [data-group="classes"][data-overflow] [data-fade] { opacity: 1; }
    #${C} [data-sve-tw-strip-tag] {
      flex: 0 0 auto;
      padding: 0 0.2em;
      opacity: .75;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    #${C} button {
      all: unset;
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
    #${C} button:hover { background: rgba(255,255,255,.2); }
    #${C} button[data-locked] { cursor: default; opacity: .5; }
    #${C} button[data-locked]:hover { background: rgba(255,255,255,.1); }
    #${C} [data-add] {
      background: transparent;
      padding: 0.22em 0.55em;
      font-family: ui-sans-serif, system-ui, sans-serif;
      font-size: 0.8rem;
    }
    #${C} [data-add]:hover { background: rgba(255,255,255,.2); }
    #${C} [data-dot] {
      width: 0.8em;
      height: 0.8em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
  `,t.head.appendChild(e)}function Zn(t){const e=_t(t);return e?e.getBoundingClientRect():null}function mt(t){t?.document.getElementById(C)?.remove()}function Xn(t){const e=()=>Yn(t);Wt!==t&&(Wt=t,t.addEventListener("resize",e),t.addEventListener("scroll",e,!0));const n=_t(t)?.contentWindow;if(n&&!n._sveStripBound)try{n._sveStripBound=!0,n.addEventListener("scroll",e,!0),n.addEventListener("resize",e),n.addEventListener("statamic:preview-updated",()=>{t.setTimeout(()=>Tt(t,U?.path||""),60)})}catch{}}function Yn(t){const e=t?.document.getElementById(C);!e||!U?.el?.isConnected||we(t,e,U.frame,U.el)}function Tt(t,e){if(!t||!Un(t)){mt(t);return}const n=t.document,o=_t(t),s=o?.contentDocument,a=e&&s?s.querySelector(`[data-sve-ht-path="${e}"]`):null;if(!a||!p.tag){mt(t);return}Kn(n),Xn(t);let r=n.getElementById(C);r||(r=n.createElement("div"),r.id=C,n.body.appendChild(r));let i=r.querySelector('[data-group="tag"]');if(!i){i=n.createElement("div"),i.setAttribute("data-group","tag");const l=n.createElement("span");l.setAttribute("data-sve-tw-strip-tag",""),i.appendChild(l),r.appendChild(i)}i.firstChild.textContent=`<${p.tag}>`;let c=r.querySelector('[data-group="classes"]'),f=c?.querySelector("[data-scroll]");const m=p.groups.flatMap(l=>l.chips);if(m.length&&!c){c=n.createElement("div"),c.setAttribute("data-group","classes"),f=n.createElement("div"),f.setAttribute("data-scroll","");const l=n.createElement("span");l.setAttribute("data-fade",""),c.appendChild(f),c.appendChild(l);const u=()=>{f.scrollWidth-f.scrollLeft-f.clientWidth>2?c.setAttribute("data-overflow",""):c.removeAttribute("data-overflow")};f.addEventListener("scroll",u),c._sveSync=u,r.insertBefore(c,r.querySelector('[data-group="add"]'))}if(!m.length)c?.remove();else if(f){f.replaceChildren();for(const l of m){const u=n.createElement("button");if(u.type="button",u.title=l.title||"",l.locked&&u.setAttribute("data-locked",""),l.color){const h=n.createElement("span");h.setAttribute("data-dot",""),h.style.background=l.color,u.appendChild(h)}u.appendChild(n.createTextNode(l.raw)),l.locked||u.addEventListener("click",h=>{h.preventDefault(),h.stopPropagation(),p.onChip?.(h,l.id)}),f.appendChild(u)}t.requestAnimationFrame(()=>c._sveSync?.())}if(!r.querySelector('[data-group="add"]')){const l=n.createElement("div");l.setAttribute("data-group","add");const u=n.createElement("button");u.type="button",u.setAttribute("data-add",""),u.textContent="+",u.addEventListener("click",h=>{h.preventDefault(),h.stopPropagation(),Hn(t,h.currentTarget)}),l.appendChild(u),r.appendChild(l)}U={frame:o,el:a,path:e},we(t,r,o,a)}function we(t,e,n,o){const s=n.getBoundingClientRect(),a=n.clientWidth?s.width/n.clientWidth:1,r=o.getBoundingClientRect(),i=e.getBoundingClientRect(),c=6,f=16,m=s.left+r.left*a,l=s.top+r.top*a-i.height-c,u=s.top+r.top*a+c,h=Math.max(c,s.left+f),M=Math.max(h,Math.min(s.right,t.innerWidth)-i.width-f);e.style.left=`${Math.max(h,Math.min(m,M))}px`,e.style.top=`${Math.max(s.top+f,l<s.top+f?u:l)}px`;const W=n.clientHeight||s.height;e.hidden=r.bottom<=0||r.top>=W}export{Gt as a,Un as b,E as c,oo as d,to as e,gt as f,eo as g,jn as h,Jn as i,ro as j,Hn as k,Bt as l,so as m,Kt as p,ao as r,io as s,no as t};
