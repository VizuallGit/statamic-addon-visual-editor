import{r as _e,_ as Te,o as x,c as k,u as S,a as h,f as T,t as E,F as B,e as q,I as dt,d as F,m as Se,n as vt,Q as A,H as j,T as Ht,a2 as ut,K as Nt,w as I,L as Vt,j as _,l as Ee,i as Le,a9 as X,M as R,a8 as bt,N as Me,A as Ae}from"./addon-Cgbhgu7N.js";import{H as Oe}from"./html-pick-align-gkRPeJkt.js";const Ut=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function Kt(t){return String(t||"").replace(/\{\{[\s\S]*?\}\}/g,e=>" ".repeat(e.length))}function ze(t){const e=t.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(!e)return"";const n=e[2].match(/\[\s*([\s\S]*?)\s*\]/);if(n){const o=n[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).find(s=>/^[a-zA-Z_][\w-]*$/.test(s));if(o)return o}return(e[2].trim().split(/\s+/)[0]||"").replace(/\[|\]/g,"")}function Zt(t,e,n,o){t.hidden=!0,o&&(t.wrapFrom=e,t.wrapTo=n);for(const s of t.children)Zt(s,e,n,!1)}function Xt(t,e,n,o){const s=[],a=[];let r=n,i=0;const c=p=>{a.length?a[a.length-1].children.push(p):s.push(p)};for(;r<o;){if(e[r]!=="<"){r+=1;continue}if(e.startsWith("<!--",r)){const u=e.indexOf("-->",r+4),g=u===-1||u>o?o:u,P=u===-1||u+3>o?o:u+3,st=Xt(t,e,r+4,g);for(const Lt of st)Zt(Lt,r,P,!0),c(Lt);r=P;continue}if(e.startsWith("<!",r)||e.startsWith("<?",r)){const u=e.indexOf(">",r+2);r=u===-1||u+1>o?o:u+1;continue}const p=e[r+1]==="/",m=e.slice(r,o).match(/^<\/?([a-zA-Z][a-zA-Z0-9:-]*)/);if(!m){r+=1;continue}const l=m[1].toLowerCase(),d=e.indexOf(">",r);if(d===-1||d>=o)break;const v=e.slice(r,d+1),b=!p&&(Ut.has(l)||/\/\s*>$/.test(v));if(p){for(let u=a.length-1;u>=0;u-=1)if(a[u].tag===l){a[u].to=d+1,a.length=u;break}r=d+1;continue}const M=ze(t.slice(r,d+1)),W=a.length?a[a.length-1]:null,D=W?W.children:s,ot=W?`${W.path}/${D.length}:${l}`:`${D.length}:${l}`,$={id:`${l}-${r}-${i}`,tag:l,klass:M,path:ot,label:M,from:r,to:d+1,openTo:d+1,hidden:!1,children:[]};i+=1,c($),b?$.to=d+1:a.push($),r=d+1}for(;a.length;)a.pop().to=o;return s}function Yt(t){const e=String(t||""),n=Kt(e);return Xt(e,n,0,n.length)}function yt(t,e,n=0,o=[]){for(const s of t){const a=s.children.length>0,r=e.has(s.id);o.push({id:s.id,tag:s.tag,klass:s.klass||"",path:s.path,label:s.label,from:s.from,to:s.to,openTo:s.openTo,hidden:!!s.hidden,wrapFrom:s.wrapFrom,wrapTo:s.wrapTo,depth:n,hasChildren:a,shut:r}),a&&!r&&yt(s.children,e,n+1,o)}return o}function no(t){return Ut.has(String(t||"").toLowerCase())}const Gt=["sm","md","lg","xl","2xl","max-sm","max-md","max-lg","max-xl","max-2xl","dark","hover","focus","focus-visible","active","disabled","group-hover"],Mt={sm:"(min-width: 640px)",md:"(min-width: 768px)",lg:"(min-width: 1024px)",xl:"(min-width: 1280px)","2xl":"(min-width: 1536px)","max-sm":"(max-width: 639px)","max-md":"(max-width: 767px)","max-lg":"(max-width: 1023px)","max-xl":"(max-width: 1279px)","max-2xl":"(max-width: 1535px)",dark:"(prefers-color-scheme: dark)"},At={hover:":hover",focus:":focus","focus-visible":":focus-visible",active:":active",disabled:":disabled","group-hover":":is(:where(.group):hover *)"},Pe={relative:"position: relative",absolute:"position: absolute",fixed:"position: fixed",sticky:"position: sticky",static:"position: static",block:"display: block",inline:"display: inline","inline-block":"display: inline-block",flex:"display: flex","inline-flex":"display: inline-flex",grid:"display: grid",hidden:"display: none","flex-row":"flex-direction: row","flex-col":"flex-direction: column","flex-wrap":"flex-wrap: wrap","items-start":"align-items: flex-start","items-center":"align-items: center","items-end":"align-items: flex-end","items-stretch":"align-items: stretch","justify-start":"justify-content: flex-start","justify-center":"justify-content: center","justify-end":"justify-content: flex-end","justify-between":"justify-content: space-between","justify-around":"justify-content: space-around","text-left":"text-align: left","text-center":"text-align: center","text-right":"text-align: right","w-full":"width: 100%","h-full":"height: 100%","w-screen":"width: 100vw","h-screen":"height: 100vh","overflow-hidden":"overflow: hidden","overflow-auto":"overflow: auto","pointer-events-none":"pointer-events: none",underline:"text-decoration-line: underline",italic:"font-style: italic","font-bold":"font-weight: 700","font-medium":"font-weight: 500",uppercase:"text-transform: uppercase",truncate:"overflow: hidden; text-overflow: ellipsis; white-space: nowrap","z-10":"z-index: 10","z-20":"z-index: 20","z-50":"z-index: 50"},Qt={p:"padding",px:"padding-inline",py:"padding-block",pt:"padding-top",pr:"padding-right",pb:"padding-bottom",pl:"padding-left",m:"margin",mx:"margin-inline",my:"margin-block",mt:"margin-top",mr:"margin-right",mb:"margin-bottom",ml:"margin-left",gap:"gap","gap-x":"column-gap","gap-y":"row-gap",w:"width",h:"height","min-w":"min-width","min-h":"min-height","max-w":"max-width","max-h":"max-height"},Jt={bg:"background-color",border:"border-color",outline:"outline-color",fill:"fill",stroke:"stroke"};let rt=null;function te(t){return t?.Statamic?.$config?.get?.("sveFeatures")?.tailwind_dock===!0}function oo(t){return e=>{if(!te(t)||!Be(e))return null;const n=e.matchBefore(/[^\s"']*$/),o=n?.text??"";return o.includes("{")||o.includes("}")?null:wt(t).then(s=>{const a=Ie(o,s).slice(0,80);return a.length?{from:n?n.from:e.pos,options:a,validFor:/^[^\s"'=]*$/}:null})}}function so(t,e){return t((n,o)=>{if(!te(e))return null;const s=Re(n.state,o);return s?wt(e).then(a=>{const r=je(s.text,a);return r?{pos:s.from,end:s.to,create(){return{dom:qe(r,We(s.text,a))}}}:null}):null})}function Ot(t){const e={color:[],spacing:[],text:[],leading:[],font:[],radius:[]},n=/--(color|spacing|text|leading|font|radius)-([a-zA-Z0-9][a-zA-Z0-9._-]*)\s*:\s*([^;]+);/g;let o;for(;o=n.exec(String(t||""));)o[2]!=="*"&&e[o[1]].push({name:o[2],value:o[3].trim()});const s=[];Object.entries(Pe).forEach(([r,i])=>{s.push({label:r,css:i,color:null})}),e.color.forEach(({name:r,value:i})=>{const c=De(i);Object.entries(Jt).forEach(([p,m])=>{s.push({label:`${p}-${r}`,css:`${m}: var(--color-${r})`,color:c})}),s.push({label:`text-${r}`,css:`color: var(--color-${r})`,color:c})}),e.spacing.forEach(({name:r})=>{Object.entries(Qt).forEach(([i,c])=>{s.push({label:`${i}-${r}`,css:`${c}: var(--spacing-${r})`,color:null})})}),e.text.forEach(({name:r})=>{s.push({label:`text-${r}`,css:`font-size: var(--text-${r})`,color:null})}),e.leading.forEach(({name:r})=>{s.push({label:`leading-${r}`,css:`line-height: var(--leading-${r})`,color:null})}),e.font.forEach(({name:r})=>{s.push({label:`font-${r}`,css:`font-family: var(--font-${r})`,color:null})}),e.radius.forEach(({name:r})=>{s.push({label:r==="DEFAULT"?"rounded":`rounded-${r}`,css:`border-radius: var(--radius-${r})`,color:null})});const a=new Map;return s.forEach(r=>{a.has(r.label)||a.set(r.label,r)}),{items:[...a.values()],byUtility:a}}function wt(t){return rt||(rt=t.fetch("/!/sve/tailwind-theme",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{css:""}).then(e=>Ot(typeof e.css=="string"?e.css:"")).catch(()=>Ot(""))),rt}function Be(t){return!!(t.matchBefore(/class\s*=\s*"[^"]*$/i)||t.matchBefore(/class\s*=\s*'[^']*$/i))}function Re(t,e){const n=t.doc.lineAt(e),o=e-n.from,s=Fe(n.text,o);if(!s)return null;const a=n.text.slice(s.valueFrom,s.valueTo),r=o-s.valueFrom,i=a.slice(0,r),c=a.slice(r),p=(i.match(/[^\s]*$/)||[""])[0],m=(c.match(/^[^\s]*/)||[""])[0],l=p+m;if(!l||l.includes("{"))return null;const d=n.from+s.valueFrom+(i.length-p.length);return{from:d,to:d+l.length,text:l}}function Fe(t,e){const n=/\bclass\s*=\s*(["'])/gi;let o;for(;o=n.exec(t);){const s=o[1],a=o.index+o[0].length,r=t.indexOf(s,a),i=r===-1?t.length:r;if(e>=a&&e<=i)return{valueFrom:a,valueTo:i}}return null}function xt(t){const e=[...Gt].sort((r,i)=>i.length-r.length),n=[];let o=String(t||""),s=!0;for(;s;){s=!1;for(const r of e){const i=`${r}:`;if(o.startsWith(i)){n.push(r),o=o.slice(i.length),s=!0;break}}}let a=!1;return o.startsWith("!")?(a=!0,o=o.slice(1)):o.endsWith("!")&&(a=!0,o=o.slice(0,-1)),{variants:n,utility:o,important:a}}function Ie(t,e){const{variants:n,utility:o}=xt(t),s=n.length?`${n.join(":")}:`:"",a=o.toLowerCase(),r=[];return!a&&!s&&Gt.forEach(i=>{r.push({label:`${i}:`,type:"keyword",detail:"variant",boost:2})}),e.items.forEach(i=>{if(a&&!i.label.startsWith(a)&&!i.label.includes(a))return;const c=`${s}${i.label}`;r.push({label:c,type:"property",detail:i.css,boost:i.label.startsWith(a)?1:0})}),r.sort((i,c)=>(c.boost||0)-(i.boost||0)||i.label.localeCompare(c.label))}function je(t,e){const{variants:n,utility:o,important:s}=xt(t),a=e.byUtility.get(o);if(!a)return"";let r=a.css;s&&(r+=" !important");const i=t.replace(/[^a-zA-Z0-9_-]/g,l=>`\\${l}`);let c="";const p=[];n.forEach(l=>{Mt[l]?p.push(Mt[l]):At[l]&&(c+=At[l])});let m=`.${i}${c} { ${r} }`;return p.slice().reverse().forEach(l=>{m=`@media ${l} {
  ${m}
}`}),m}function We(t,e){const{utility:n}=xt(t);return e.byUtility.get(n)?.color||null}function De(t){const e=String(t||"").trim();return/^#([0-9a-fA-F]{3,8})$/.test(e)?e:null}function qe(t,e){const n=document.createElement("div");if(n.className="sve-tw-info",e){const s=document.createElement("span");s.className="sve-tw-swatch",s.style.background=e,n.appendChild(s)}const o=document.createElement("pre");return o.textContent=t,n.appendChild(o),n}const f=_e({emptyText:"",tag:"",scope:"",scopeTitle:"",baseLabel:"",groups:[],canEdit:!1,onChip:null,variant:"",breakpoints:[],onBreakpoint:null,state:"",stateLabel:"",onState:null,onTag:null,dropTitle:"",onDrop:null,siteClasses:[]});function ee(t,e,n){const o=String(t||"").slice(e,n),s=Kt(o),a=/(\sclass\s*=\s*)(["'])/i.exec(s);if(!a)return null;const r=a[2],i=a.index+a[1].length+1,c=s.indexOf(r,i);return c===-1?null:{from:e+i,to:e+c,quote:r,value:o.slice(i,c)}}function He(t){const e=String(t||""),n=[];let o=0;for(;o<e.length;){if(/\s/.test(e[o])){o+=1;continue}let s=o,a=!1;for(;s<e.length;){if(e.startsWith("{{",s)){const r=e.indexOf("}}",s+2);a=!0,s=r===-1?e.length:r+2;continue}if(/\s/.test(e[s]))break;s+=1}n.push({text:e.slice(o,s),from:o,to:s,dynamic:a}),o=s}return n}function ne(t){const e=String(t||""),n=[];let o=0,s=0;for(let r=0;r<e.length;r+=1){const i=e[r];i==="["||i==="("?o+=1:i==="]"||i===")"?o=Math.max(0,o-1):i===":"&&o===0&&(n.push(e.slice(s,r)),s=r+1)}const a=e.slice(s);return{variants:n,base:a}}function oe(t){let n=String(t||""),o="";n.startsWith("!")?(o="pre",n=n.slice(1)):n.endsWith("!")&&(o="post",n=n.slice(0,-1));let s="";const a=Ne(n);return a!==-1&&(s=n.slice(a),n=n.slice(0,a)),{name:n,modifier:s,important:o}}function Ne(t){let e=0;for(let n=0;n<t.length;n+=1){const o=t[n];if(o==="["||o==="(")e+=1;else if(o==="]"||o===")")e=Math.max(0,e-1);else if(o==="/"&&e===0)return n}return-1}function pt({variants:t,name:e,modifier:n,important:o}){let s=`${e}${n||""}`;return o==="pre"?s=`!${s}`:o==="post"&&(s=`${s}!`),[...t||[],s].join(":")}function se(t){const e=He(t),n=new Map;let o=null,s=0;const a=e.findIndex(i=>i.text==="]");if(e[0]?.text==="["&&a>0){const i=e.slice(1,a);o={from:e[0].from,to:e[a].to,label:`[ ${i.map(c=>c.text).join(" ")} ]`},s=a+1}for(;s<e.length;s+=1){const i=e[s],{variants:c,base:p}=ne(i.text),{name:m,modifier:l,important:d}=oe(p),v=c.join(":");n.has(v)||n.set(v,{key:v,variants:c,items:[]}),n.get(v).items.push({raw:i.text,from:i.from,to:i.to,dynamic:i.dynamic,variants:c,name:m,modifier:l,important:d})}const r=[...n.values()];return r.sort((i,c)=>i.key===""?-1:c.key===""?1:0),{scope:o,groups:r}}function tt(t,e,n){const o=String(t||"");if(n)return o.slice(0,e.from)+n+o.slice(e.to);let s=e.from,a=e.to;if(s>0&&(o[s-1]===" "||o[s-1]==="	"))for(;s>0&&(o[s-1]===" "||o[s-1]==="	");)s-=1;else for(;a<o.length&&(o[a]===" "||o[a]==="	");)a+=1;return Ve(o.slice(0,s)+o.slice(a),s)}function Ve(t,e){const n=t.lastIndexOf(`
`,Math.max(0,e-1));if(n===-1)return t;const o=t.indexOf(`
`,n+1);return t.slice(n+1,o===-1?t.length:o).trim()!==""?t:t.slice(0,n)+t.slice(o===-1?t.length:o)}function re(t,e){const n=String(t||"");return n.trim()?`${n.replace(/\s+$/,"")} ${e}`:e}function ae(t,e,n){const o=String(t||""),s=String(n||"").trim().toLowerCase();if(!/^[a-z][a-z0-9-]*$/.test(s)||!e?.tag||s===e.tag.toLowerCase())return o;const a=e.tag.toLowerCase(),r=o.slice(e.from,e.openTo);if(!new RegExp(`^<${a}(?=[\\s/>])`,"i").test(r))return o;let i=o;const c=i.toLowerCase().lastIndexOf(`</${a}`,e.to);return c>e.from&&c<e.to&&(i=i.slice(0,c)+`</${s}`+i.slice(c+2+a.length)),i.slice(0,e.from)+`<${s}`+i.slice(e.from+1+a.length)}function Ue(t,e,n){const o=ee(t,e.from,e.openTo);if(o)return t.slice(0,o.from)+n+t.slice(o.to);const s=String(t).slice(e.from,e.openTo),a=/^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(s);if(!a||!n)return t;const r=e.from+a[0].length;return`${t.slice(0,r)} class="${n}"${t.slice(r)}`}const Ke=[...Object.keys(Qt),...Object.keys(Jt),"text","leading","font","rounded"].sort((t,e)=>e.length-t.length);let at=null;function Ze(t){return at||(at=wt(t).then(Xe)),at}function ie(t){const e=String(t||"");if(e.includes(";"))return"";const n=e.indexOf(":");return n===-1?"":e.slice(0,n).trim()}function Xe(t){const e=new Map,n=new Map,o=new Map;for(const s of t.items){const a=ie(s.css);a&&(e.has(a)||e.set(a,[]),e.get(a).push(s),n.set(s.label,a));const r=le(s.label);r&&(o.has(r)||o.set(r,[]),o.get(r).push(s))}return{catalog:t,byProperty:e,propertyOfUtility:n,byPrefix:o}}function le(t){for(const e of Ke)if(String(t).startsWith(`${e}-`))return e;return""}function ce(t,e){if(!e||!t)return null;const n=e.propertyOfUtility.get(t);if(n)return{label:n,options:e.byProperty.get(n)||[]};const o=le(t),s=o?e.byPrefix.get(o):null;return s?.length?{label:ie(s[0].css)||o,options:s}:null}function de(t,e){return e?.catalog?.byUtility?.get(t)?.css||""}function Ye(t,e){return e?.catalog?.byUtility?.get(t)?.color||""}const Ge={class:"sve-tw"},Qe={key:0,class:"sve-tw-head"},Je=["disabled"],tn=["title","data-active","disabled","onClick"],en=["data-active","disabled"],nn={key:1,class:"sve-tw-empty"},on=["data-sve-tw-base","data-current"],sn={class:"sve-tw-chips"},rn=["title","onClick"],an=["title","onClick"],ln={__name:"TwClassList",setup(t){function e(n){const o={"data-sve-tw-chip":n.id};return n.locked&&(o["data-sve-tw-locked"]=""),n.open&&(o["data-open"]=""),o}return(n,o)=>(x(),k("div",Ge,[S(f).tag?(x(),k("div",Qe,[h("button",{type:"button",class:"sve-tw-tag",disabled:!S(f).canEdit,onClick:o[0]||(o[0]=T(s=>S(f).onTag?.(s),["prevent","stop"]))},"<"+E(S(f).tag)+">",9,Je),(x(!0),k(B,null,q(S(f).breakpoints,s=>(x(),k("button",{key:s.index,type:"button","data-sve-tw-bp":"",title:s.title,"data-active":s.active?"":void 0,disabled:!S(f).canEdit,onClick:T(a=>S(f).onBreakpoint?.(s.index),["prevent","stop"])},E(s.label),9,tn))),128)),h("button",{type:"button","data-sve-tw-state":"","data-active":S(f).state?"":void 0,disabled:!S(f).canEdit,onClick:o[1]||(o[1]=T(s=>S(f).onState?.(s),["prevent","stop"]))},[dt(E(S(f).stateLabel)+" ",1),o[2]||(o[2]=h("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[h("path",{d:"m6 9 6 6 6-6"})],-1))],8,en),o[3]||(o[3]=h("span",{class:"sve-tw-gap"},null,-1))])):F("",!0),S(f).groups.length?F("",!0):(x(),k("div",nn,E(S(f).emptyText),1)),(x(!0),k(B,null,q(S(f).groups,s=>(x(),k("div",{key:s.key,class:"sve-tw-group"},[h("span",{class:"sve-tw-variant","data-sve-tw-base":s.key===""?"":void 0,"data-current":s.current?"":void 0},E(s.key===""?S(f).baseLabel:s.key),9,on),h("div",sn,[(x(!0),k(B,null,q(s.chips,a=>(x(),k("span",{key:a.id,class:"sve-tw-chip-wrap"},[h("button",Se({type:"button"},{ref_for:!0},e(a),{title:a.title,onClick:T(r=>S(f).onChip?.(r,a.id),["prevent","stop"])}),[a.color?(x(),k("span",{key:0,class:"sve-tw-dot",style:vt({background:a.color})},null,4)):F("",!0),dt(" "+E(a.raw),1)],16,rn),a.locked?F("",!0):(x(),k("button",{key:0,type:"button",class:"sve-tw-drop",title:S(f).dropTitle,onClick:T(r=>S(f).onDrop?.(a.id),["prevent","stop"])},"−",8,an))]))),128))])]))),128))]))}},cn=Te(ln,[["__scopeId","data-v-bfb30e9d"]]),dn={key:0,"data-sve-tw-menu-title":""},un={"data-sve-tw-menu-list":""},pn=["data-active","title","onClick"],fn={"data-sve-tw-tick":""},mn={"data-sve-tw-label":""},kt={__name:"TwClassMenu",props:{title:{type:String,default:""},options:{type:Array,default:()=>[]},removeLabel:{type:String,default:""},onPick:{type:Function,required:!0},onRemove:{type:Function,required:!0}},setup(t){return(e,n)=>(x(),k(B,null,[t.title?(x(),k("div",dn,E(t.title),1)):F("",!0),h("div",un,[(x(!0),k(B,null,q(t.options,o=>(x(),k("button",{key:o.label,type:"button","data-sve-tw-option":"","data-active":o.active?"":void 0,title:o.css,onClick:T(s=>t.onPick(o.label),["prevent","stop"])},[h("span",fn,E(o.active?"✓":""),1),o.color?(x(),k("span",{key:0,"data-sve-tw-dot":"",style:vt({background:o.color})},null,4)):F("",!0),h("span",mn,E(o.label),1)],8,pn))),128))]),h("button",{type:"button","data-sve-tw-remove":"",onClick:n[0]||(n[0]=T(o=>t.onRemove(),["prevent","stop"]))},[n[1]||(n[1]=h("span",{"data-sve-tw-tick":""},"✕",-1)),dt(E(t.removeLabel),1)])],64))}},hn={"data-sve-tw-search":""},gn=["placeholder","aria-label","onKeydown"],vn={"data-sve-tw-tabs":""},bn=["data-active"],yn=["data-active"],wn={key:0,"data-sve-tw-add-empty":""},xn=["data-cursor","data-active","data-sve-tw-off","title","onMouseenter","onClick"],kn={"data-sve-tw-label":""},$n={__name:"TwAddClass",props:{label:{type:String,default:""},placeholder:{type:String,default:""},sitePlaceholder:{type:String,default:""},emptyText:{type:String,default:""},offText:{type:String,default:""},siteLabel:{type:String,default:""},tailwindLabel:{type:String,default:""},search:{type:Function,required:!0},onAdd:{type:Function,required:!0}},setup(t){const e=t,n=A(""),o=A(null),s=A("tailwind"),a=A(null),r=A(-1),i=A(!1),c=j(()=>n.value.trim().toLowerCase()),p=j(()=>(f.siteClasses||[]).flatMap($=>$.items).filter($=>!c.value||$.name.toLowerCase().includes(c.value))),m=j(()=>e.search(n.value)),l=j(()=>s.value==="site"?p.value:m.value),d=j(()=>s.value==="site"?e.sitePlaceholder:e.placeholder);Ht(()=>ut(()=>o.value?.focus()));function v($){return $?.name||$?.label||""}function b($){i.value=!0;const u=l.value.length;if(!u){r.value=-1;return}const g=r.value+$;r.value=g<0?-1:Math.min(g,u-1),ut(()=>M())}function M(){const $=a.value?.querySelector("[data-cursor]");if(!$)return;let u=$.parentElement;for(;u&&u.scrollHeight<=u.clientHeight;)u=u.parentElement;if(!u)return;const g=$.offsetTop,P=g+$.offsetHeight;g<u.scrollTop?u.scrollTop=g:P>u.scrollTop+u.clientHeight&&(u.scrollTop=P-u.clientHeight)}function W($){i.value||(r.value=$)}function D(){r.value=-1}function ot(){const $=r.value>=0?l.value[r.value]:null,u=$?v($):n.value.trim();u&&e.onAdd(u)}return($,u)=>(x(),k(B,null,[h("div",hn,[u[7]||(u[7]=h("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[h("circle",{cx:"11",cy:"11",r:"7"}),h("path",{d:"m20 20-3.5-3.5"})],-1)),Nt(h("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":u[0]||(u[0]=g=>n.value=g),type:"text",placeholder:d.value,"aria-label":t.label,onInput:D,onKeydown:[u[1]||(u[1]=I(T(g=>b(1),["prevent"]),["down"])),u[2]||(u[2]=I(T(g=>b(-1),["prevent"]),["up"])),I(T(ot,["prevent"]),["enter"]),u[3]||(u[3]=I(T(()=>{},["stop"]),["escape"]))]},null,40,gn),[[Vt,n.value]])]),h("div",vn,[h("button",{type:"button","data-sve-tw-tab":"","data-active":s.value==="tailwind"?"":void 0,onClick:u[4]||(u[4]=T(g=>{s.value="tailwind",D()},["prevent","stop"]))},E(t.tailwindLabel),9,bn),h("button",{type:"button","data-sve-tw-tab":"","data-active":s.value==="site"?"":void 0,onClick:u[5]||(u[5]=T(g=>{s.value="site",D()},["prevent","stop"]))},E(t.siteLabel),9,yn)]),l.value.length?F("",!0):(x(),k("div",wn,E(t.emptyText),1)),h("div",{ref_key:"rowsEl",ref:a,onMousemove:u[6]||(u[6]=g=>i.value=!1)},[(x(!0),k(B,null,q(l.value,(g,P)=>(x(),k("button",{key:g.name||g.label,type:"button","data-sve-tw-option":"","data-cursor":P===r.value?"":void 0,"data-active":P===r.value?"":void 0,"data-sve-tw-off":g.loaded===!1?"":void 0,title:g.loaded===!1?t.offText:g.file||g.css,onMouseenter:st=>W(P),onClick:T(st=>t.onAdd(g.name||g.label),["prevent","stop"])},[g.color?(x(),k("span",{key:0,"data-sve-tw-dot":"",style:vt({background:g.color})},null,4)):F("",!0),h("span",kn,E(g.name||g.label),1)],40,xn))),128))],544)],64))}},Cn={"data-sve-tw-search":""},_n=["placeholder","aria-label","onKeydown"],Tn=["data-active","onMouseenter","onClick"],Sn={"data-sve-tw-tick":""},En={"data-sve-tw-label":""},ue={__name:"TwTagMenu",props:{label:{type:String,default:""},placeholder:{type:String,default:""},current:{type:String,default:""},tags:{type:Array,default:()=>[]},onPick:{type:Function,required:!0}},setup(t){const e=t,n=A(""),o=A(null),s=A(-1),a=A(!1),r=j(()=>n.value.trim().toLowerCase()),i=j(()=>{if(!r.value)return e.tags;const m=e.tags.filter(l=>l.includes(r.value));return m.sort((l,d)=>(l.startsWith(r.value)?0:1)-(d.startsWith(r.value)?0:1)),m});Ht(()=>ut(()=>o.value?.focus()));function c(m){a.value=!0;const l=i.value.length;s.value=l?Math.min(Math.max(s.value+m,-1),l-1):-1}function p(){const m=s.value>=0?i.value[s.value]:n.value.trim().toLowerCase();m&&e.onPick(m)}return(m,l)=>(x(),k(B,null,[h("div",Cn,[l[6]||(l[6]=h("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[h("circle",{cx:"11",cy:"11",r:"7"}),h("path",{d:"m20 20-3.5-3.5"})],-1)),Nt(h("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":l[0]||(l[0]=d=>n.value=d),type:"text",placeholder:t.placeholder,"aria-label":t.label,onInput:l[1]||(l[1]=d=>s.value=-1),onKeydown:[l[2]||(l[2]=I(T(d=>c(1),["prevent"]),["down"])),l[3]||(l[3]=I(T(d=>c(-1),["prevent"]),["up"])),I(T(p,["prevent"]),["enter"]),l[4]||(l[4]=I(T(()=>{},["stop"]),["escape"]))]},null,40,_n),[[Vt,n.value]])]),h("div",{onMousemove:l[5]||(l[5]=d=>a.value=!1)},[(x(!0),k(B,null,q(i.value,(d,v)=>(x(),k("button",{key:d,type:"button","data-sve-tw-option":"","data-active":v===s.value||s.value===-1&&d===t.current?"":void 0,onMouseenter:b=>a.value?null:s.value=v,onClick:T(b=>t.onPick(d),["prevent","stop"])},[h("span",Sn,E(d===t.current?"✓":""),1),h("span",En,"<"+E(d)+">",1)],40,Tn))),128))],32)],64))}},C="__sve-tw-menu",zt="--sve-tw-anchor",Ln=typeof CSS<"u"&&CSS.supports?.("anchor-name: --x");let J=null;const Pt="__sve-tw-style",$t=[{key:"",all:!0,device:"Responsive",label:"tw_size_all"},{key:"",device:"Laptop",label:"tw_size_laptop",prefix:""},{key:"max-lg",device:"Tablet",label:"responsive_tablet",under:1024},{key:"max-md",device:"Mobile",label:"responsive_mobile",under:768}],Bt=["","dark","hover","focus","active","before","after"],pe={Mobile:"max-md",Tablet:"max-lg",Laptop:"",Desktop:""},fe=["div","section","article","header","footer","main","aside","nav","h1","h2","h3","h4","h5","h6","p","span","a","button","label","ul","ol","li","figure","figcaption","blockquote","strong","em","small","picture","img","video","form","table","tr","td","th"];let me="",H="",nt=!1;function Mn(){try{return pe[bt(window,"sve-lp-device")]??""}catch{return""}}function Ct(){return nt?me:Mn()}function he(){return[Ct(),H].filter(Boolean)}function _t(){return he().join(":")}const An=/^(max-)?(sm|md|lg|xl|2xl)$/;function On(t){return String(t||"").split(":").find(e=>An.test(e))||""}function ge(){if(nt)return!0;try{return Object.prototype.hasOwnProperty.call(pe,bt(window,"sve-lp-device"))}catch{return!1}}function zn(t){if(!ge())return!0;const e=On(t);return e===Ct()?!0:!$t.some(n=>n.key===e)}let w=null,K=new Map,O=null,it=!1,et="",ft=null;function ve(t){return t?.querySelector?.('[data-sve-style="tw"] [data-sve-tw-host]')||null}function be(t){if(t.getElementById(Pt))return;const e=t.createElement("style");e.id=Pt,e.textContent=`
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
  `,t.head.appendChild(e)}function ye(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e.contentDocument;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o.contentDocument}catch{}return null}function Pn(t,e,n){const o=ye(t);if(!(!o||!w?.path))for(const s of o.querySelectorAll(`[${Oe}="${w.path}"]`))try{e&&s.classList.remove(e),n&&s.classList.add(n)}catch{}}const lt=new Map,Bn=/(^|-)color$|^fill$|^stroke$/;function Tt(t){const e=String(t||""),n=e.slice(0,e.indexOf(":")).trim();return Bn.test(n)&&/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(e)?.[1]||""}function we(t,e){if(!e)return"";if(lt.has(e))return lt.get(e);const n=ye(t),o=n?.documentElement,s=n?.defaultView;if(!o||!s)return"";let a="",r=e;for(let i=0;i<6&&r;i+=1){try{a=s.getComputedStyle(o).getPropertyValue(r).trim()}catch{return""}if(!a)return"";if(r=Tt(a),!r)break}return a&&!a.startsWith("var(")?(lt.set(e,a),a):""}function Rn(t,e){return Ye(e,O)||we(t,Tt(de(e,O)))}function L(t){const e=t?.document.getElementById(C);J&&(J.style.removeProperty("anchor-name"),J=null),ft?.(),ft=null,et="",e&&(e._sveApp?.unmount(),e.remove())}function Rt(t,e,n){const o=e.getBoundingClientRect(),s=n.offsetWidth||176,a=8,r=140,i=e.closest?.("#__sve-tw-strip")?Gn(t):null,c=i?i.top:0,p=i?i.bottom:t.innerHeight,m=i?i.left:0,l=i?i.right:t.innerWidth,d=o.bottom+4,v=p-d-a,b=Math.max(r,Math.min(v,420));n.style.left=`${Math.max(m+a,Math.min(o.left,l-s-a))}px`,n.style.maxHeight=`${b}px`,n.style.top=`${v>=r?d:Math.max(c+a,p-a-b)}px`}function U(t,e,n,o){const s=t.document;L(t),be(s);const a=s.createElement("div");a.id=C,s.body.appendChild(a),a._sveApp=Ee(n,a,o);const r=Ln&&!!e.closest?.("#__sve-tw-strip");r?(J=e,e.style.setProperty("anchor-name",zt),a.style.setProperty("position","absolute"),a.style.setProperty("position-anchor",zt),a.style.setProperty("position-area","block-end span-inline-start"),a.style.setProperty("position-try-fallbacks","flip-block, flip-inline, flip-block flip-inline"),a.style.setProperty("margin","4px 0 0 0"),a.style.setProperty("max-height","20rem")):Rt(t,e,a);const i=()=>{r||Rt(t,e,a)},c=m=>{!a.contains(m.target)&&!e.contains(m.target)&&(L(t),Y())},p=m=>{m.key==="Escape"&&(L(t),Y())};return s.addEventListener("pointerdown",c,!0),s.addEventListener("keydown",p,!0),t.addEventListener("scroll",i,!0),t.addEventListener("resize",i),ft=()=>{s.removeEventListener("pointerdown",c,!0),s.removeEventListener("keydown",p,!0),t.removeEventListener("scroll",i,!0),t.removeEventListener("resize",i)},a}function xe(t,e,n){return(e||[]).map(o=>({label:o.label,css:o.css,color:o.color||we(t,Tt(o.css)),active:o.label===n}))}function G(){return!w||R("dock:is-locked")===!0}function Q(){const t=R("dock:html");if(!w||typeof t!="string"||t[w.from]!=="<")return null;const e=ee(t,w.from,w.openTo);return{html:t,value:e?e.value:""}}function Fn(t){if(!w?.path)return;const n=yt(Yt(t),new Set).find(o=>o.path===w.path);n&&(w={from:n.from,openTo:n.openTo,path:n.path,tag:n.tag})}function N(t,e,n,o,s){const a=Ue(e,w,n);a!==e&&(Pn(t,o,s),R("dock:set-html",a),Fn(a),z(t))}const Ft=["display","position","inset","top","right","bottom","left","z-index","flex-direction","flex-wrap","justify-content","align-items","gap","column-gap","row-gap","margin","margin-inline","margin-block","margin-top","margin-right","margin-bottom","margin-left","padding","padding-inline","padding-block","padding-top","padding-right","padding-bottom","padding-left","width","min-width","max-width","height","min-height","max-height","font-family","font-size","font-weight","line-height","text-align","text-transform","text-decoration-line","font-style","color","background-color","border-color","border-radius","fill","stroke","outline-color","overflow"];function It(t){const e=V(t);if(!e)return-1;const n=Ft.indexOf(e);return n===-1?Ft.length:n}function V(t){return ce(t,O)?.label||""}function mt(t){return se(t).groups.flatMap(e=>e.items)}function ke(t){const e=_t();return mt(t).filter(n=>!n.dynamic&&n.variants.join(":")===e)}function jt(t,e){if(G()||!e)return;const n=Q();if(!n)return;const o=V(e),s=ke(n.value).find(r=>r.name===e||o&&V(r.name)===o);if(s?.name===e){N(t,n.html,tt(n.value,s,""),e,"");return}if(s){const r=pt({variants:s.variants,name:e,modifier:s.modifier,important:s.important});N(t,n.html,tt(n.value,s,r),s.raw,r);return}const a=pt({variants:he(),name:e,modifier:"",important:""});N(t,n.html,re(n.value,a),"",a)}function In(t,e){const n=String(e||"").trim(),o=_t(),s=o&&!n.includes(":")?`${o}:${n}`:n;if(G()||!n)return;const a=Q();if(!a||mt(a.value).some(d=>d.raw===s))return;const{variants:i,base:c}=ne(s),p=V(oe(c).name),m=i.join(":"),l=p?mt(a.value).find(d=>!d.dynamic&&d.variants.join(":")===m&&V(d.name)===p):null;if(l){N(t,a.html,tt(a.value,l,s),l.raw,s);return}N(t,a.html,re(a.value,s),"",s.includes(":")?"":s)}function ht(t,e,n){if(G())return;const o=Q();if(!o||o.value.slice(e.from,e.to)!==e.raw){z(t);return}const s=n?pt({variants:e.variants,name:n,modifier:e.modifier,important:e.important}):"";N(t,o.html,tt(o.value,e,s),e.raw,s)}function jn(t,e){if(G()||!w)return;const n=R("dock:html");if(typeof n!="string"||n[w.from]!=="<")return;const o=ae(n,w,e);if(o===n)return;const s=w.from;R("dock:set-html",o);const r=yt(Yt(o),new Set).find(i=>i.from===s);r&&(w={from:r.from,openTo:r.openTo,path:r.path,tag:r.tag}),z(t),X("tw:changed")}function ro(t,e,n){n?.tag&&U(t,e,ue,{label:_(t,"tw_tag"),placeholder:_(t,"tw_tag_placeholder"),current:String(n.tag).toLowerCase(),tags:fe,onPick:o=>{Wn(t,n,o),L(t)}})}function Wn(t,e,n){if(R("dock:is-locked")===!0)return;const o=R("dock:html");if(typeof o!="string"||o[e.from]!=="<")return;const s=ae(o,e,n);s!==o&&R("dock:set-html",s)}function Dn(t,e){U(t,e,ue,{label:_(t,"tw_tag"),placeholder:_(t,"tw_tag_placeholder"),current:(w?.tag||"").toLowerCase(),tags:fe,onPick:n=>{jn(t,n),L(t)}})}function ao(t){Et(t,w?.path||"")}function io(){return!!w}function qn(t,e){const n=$t[e];n&&(R("lp:set-device",{win:t,key:n.device}),nt=!n.all,me=n.key,L(t),z(t),X("tw:changed"))}function Hn(t,e){U(t,e,kt,{title:_(t,"tw_state"),removeLabel:_(t,"tw_state_none"),options:Bt.filter(Boolean).map(n=>({label:n,css:"",color:null,active:n===H})),onPick:n=>{H=Bt.includes(n)?n:"",L(t),z(t),X("tw:changed")},onRemove:()=>{H="",L(t),z(t),X("tw:changed")}})}Me("lp:device",()=>{nt=!1,ve(window.document)&&z(window)});function Nn(t){const e=t?Q():null;return e&&ke(e.value).find(n=>V(n.name)===t)?.name||""}function lo(t,e,n,o){const s=O?.byProperty.get(n)||[];if(!s.length)return;const a=Nn(n);U(t,e,kt,{title:n,removeLabel:_(t,"tw_classes_remove"),options:xe(t,s,a),onPick:r=>{jt(t,r),L(t),o?.(r)},onRemove:()=>{a&&jt(t,a),L(t),o?.("")}})}let Wt=[],ct=!1;function Vn(t){ct||(ct=!0,t.fetch("/!/sve/site-css/classes",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{groups:[]}).then(e=>{Wt=Array.isArray(e?.groups)?e.groups:[],f.siteClasses=Wt}).catch(()=>{ct=!1}))}function Un(t,e){Vn(t),U(t,e,$n,{label:_(t,"tw_add_class"),placeholder:_(t,"tw_add_placeholder"),emptyText:_(t,"tw_add_empty"),offText:_(t,"tw_class_not_imported"),sitePlaceholder:_(t,"tw_add_placeholder_site"),siteLabel:_(t,"tw_add_site"),tailwindLabel:_(t,"tw_add_tailwind"),search:n=>{const o=String(n||"").trim().toLowerCase();if(!o||!O)return[];const s=O.catalog.items.filter(a=>a.label.toLowerCase().includes(o));return s.sort((a,r)=>{const i=a.label.toLowerCase().startsWith(o)?0:1,c=r.label.toLowerCase().startsWith(o)?0:1;return i-c||a.label.length-r.label.length}),s.slice(0,40).map(a=>({label:a.label,css:a.css,color:a.color,active:!1}))},onAdd:n=>{In(t,n)}})}function Kn(t,e,n){const o=K.get(n);if(!o||o.locked)return;if(et===n){L(t),Y();return}const s=ce(o.name,O);U(t,e.currentTarget,kt,{title:s?.label||"",removeLabel:_(t,"tw_classes_remove"),options:xe(t,s?.options,o.name),onPick:a=>{ht(t,o,a),L(t)},onRemove:()=>{ht(t,o,""),L(t)}}),et=n,Y()}function Y(){for(const t of f.groups)for(const e of t.chips)e.open=e.id===et}function co(t,e){if(!e||e.from==null||e.openTo==null){w=null,K=new Map,L(t),z(t);return}w={from:e.from,openTo:e.openTo,path:e.path,tag:e.tag},z(t)}function z(t){Zn(t);const e=w?Q():null,n=e?se(e.value):{scope:null,groups:[]};K=new Map,f.baseLabel=_(t,"tw_size_base"),f.scopeTitle=_(t,"tw_classes_scope"),f.dropTitle=_(t,"tw_classes_remove"),f.variant=_t(),f.onBreakpoint=r=>qn(t,r),f.onState=r=>Hn(t,r.currentTarget);const o=ge();f.breakpoints=$t.map((r,i)=>({index:i,label:_(t,r.label),title:r.under?`${r.key}:  ·  < ${r.under}px`:_(t,r.all?"tw_size_all_title":"tw_size_base_title"),active:r.all?!o:o&&r.key===Ct()})),f.state=H,f.stateLabel=H||_(t,"tw_state"),f.canEdit=!G(),f.onChip=(r,i)=>Kn(t,r,i),f.onTag=r=>Dn(t,r.currentTarget),f.onDrop=r=>{const i=K.get(r);i&&!i.locked&&(L(t),ht(t,i,""))},f.tag=w?.tag||"";const s=n.scope?.label||"";f.scope=/^\[\s*\]$/.test(s)?"":s,f.emptyText=_(t,w?n.groups.length?"tw_classes_none_size":"tw_classes_none":"tw_classes_pick"),f.groups=n.groups.filter(r=>zn(r.key)).map(r=>({key:r.key,current:r.key===f.variant,chips:[...r.items].sort((i,c)=>It(i.name)-It(c.name)||i.name.localeCompare(c.name)).map((i,c)=>{const p={...i,id:`${r.key}-${c}-${i.from}`,locked:i.dynamic||!f.canEdit,open:!1,color:i.dynamic?"":Rn(t,i.name),title:i.dynamic?_(t,"tw_classes_dynamic"):de(i.name,O)||i.raw};return K.set(p.id,p),p})}));const a=ve(t.document);a&&(be(t.document),Le(a,cn)),Y(),Et(t,w?.path||""),X("tw:changed")}function Zn(t){O||it||(it=!0,Ze(t).then(e=>{O=e,z(t)}).catch(()=>{it=!1}))}const $e="sve-tw-strip";function Xn(t){try{return bt(t,$e)!=="0"}catch{return!0}}function uo(t,e){Ae(t,$e,e?"1":"0"),e||gt(t)}const y="__sve-tw-strip",Dt="__sve-tw-strip-style";let qt=null,Z=null;function St(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o}catch{}return null}function Yn(t){if(t.getElementById(Dt))return;const e=t.createElement("style");e.id=Dt,e.textContent=`
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
    }
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
  `,t.head.appendChild(e)}function Gn(t){const e=St(t);return e?e.getBoundingClientRect():null}function gt(t){t?.document.getElementById(y)?.remove()}function Qn(t){const e=()=>Jn(t);qt!==t&&(qt=t,t.addEventListener("resize",e),t.addEventListener("scroll",e,!0));const n=St(t)?.contentWindow;if(n&&!n._sveStripBound)try{n._sveStripBound=!0,n.addEventListener("scroll",e,!0),n.addEventListener("resize",e),n.addEventListener("statamic:preview-updated",()=>{t.setTimeout(()=>Et(t,Z?.path||""),60)})}catch{}}function Jn(t){const e=t?.document.getElementById(y);!e||!Z?.el?.isConnected||Ce(t,e,Z.frame,Z.el)}function Et(t,e){if(!t||!Xn(t)){gt(t);return}const n=t.document,o=St(t),s=o?.contentDocument,a=e&&s?s.querySelector(`[data-sve-ht-path="${e}"]`):null;if(!a||!f.tag){gt(t);return}Yn(n),Qn(t);let r=n.getElementById(y);r||(r=n.createElement("div"),r.id=y,n.body.appendChild(r));let i=r.querySelector('[data-group="tag"]');if(!i){i=n.createElement("div"),i.setAttribute("data-group","tag");const l=n.createElement("span");l.setAttribute("data-sve-tw-strip-tag",""),i.appendChild(l),r.appendChild(i)}i.firstChild.textContent=`<${f.tag}>`;let c=r.querySelector('[data-group="classes"]'),p=c?.querySelector("[data-scroll]");const m=f.groups.flatMap(l=>l.chips);if(m.length&&!c){c=n.createElement("div"),c.setAttribute("data-group","classes"),p=n.createElement("div"),p.setAttribute("data-scroll","");const l=n.createElement("span");l.setAttribute("data-fade",""),c.appendChild(p),c.appendChild(l);const d=()=>{p.scrollWidth-p.scrollLeft-p.clientWidth>2?c.setAttribute("data-overflow",""):c.removeAttribute("data-overflow")};p.addEventListener("scroll",d),c._sveSync=d,r.insertBefore(c,r.querySelector('[data-group="add"]'))}if(!m.length)c?.remove();else if(p){p.replaceChildren();for(const l of m){const d=n.createElement("button");if(d.type="button",d.title=l.title||"",l.locked&&d.setAttribute("data-locked",""),l.color){const b=n.createElement("span");b.setAttribute("data-dot",""),b.style.background=l.color,d.appendChild(b)}d.appendChild(n.createTextNode(l.raw));const v=n.createElement("span");if(v.setAttribute("data-chip-wrap",""),v.appendChild(d),!l.locked){const b=n.createElement("button");b.type="button",b.setAttribute("data-drop",""),b.title=f.dropTitle||"",b.textContent="−",b.addEventListener("click",M=>{M.preventDefault(),M.stopPropagation(),f.onDrop?.(l.id)}),v.appendChild(b),d.addEventListener("click",M=>{M.preventDefault(),M.stopPropagation(),f.onChip?.(M,l.id)})}p.appendChild(v)}t.requestAnimationFrame(()=>c._sveSync?.())}if(!r.querySelector('[data-group="add"]')){const l=n.createElement("div");l.setAttribute("data-group","add");const d=n.createElement("button");d.type="button",d.setAttribute("data-add","");const v=n.createElement("span");v.setAttribute("data-plus",""),v.textContent="+",d.appendChild(v),d.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation(),Un(t,b.currentTarget)}),l.appendChild(d),r.appendChild(l)}Z={frame:o,el:a,path:e},Ce(t,r,o,a)}function Ce(t,e,n,o){const s=n.getBoundingClientRect(),a=n.clientWidth?s.width/n.clientWidth:1,r=o.getBoundingClientRect(),i=e.getBoundingClientRect(),c=6,p=16,m=s.left+r.left*a,l=s.top+r.top*a-i.height-c,d=s.top+r.top*a+c,v=Math.max(c,s.left+p),b=Math.max(v,Math.min(s.right,t.innerWidth)-i.width-p);e.style.left=`${Math.max(v,Math.min(m,b))}px`,e.style.top=`${Math.max(s.top+p,l<s.top+p?d:l)}px`;const M=n.clientHeight||s.height;e.hidden=r.bottom<=0||r.top>=M}export{te as a,Xn as b,L as c,ao as d,oo as e,yt as f,so as g,Nn as h,no as i,lo as j,Un as k,jt as l,io as m,Yt as p,co as r,uo as s,ro as t};
