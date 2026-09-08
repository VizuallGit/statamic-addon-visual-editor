import{r as $e,_ as Ce,o as x,c as k,u as S,a as h,f as T,t as E,F as B,e as q,I as ut,d as F,m as _e,n as gt,Q as A,H as j,T as Dt,a2 as dt,K as qt,w as I,L as Ht,j as _,l as Te,i as Se,a9 as Z,M as R,a8 as bt,N as Ee,A as Le}from"./addon-C_yxaT-d.js";import{H as Me}from"./html-pick-align-gkRPeJkt.js";const Nt=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function Vt(t){return String(t||"").replace(/\{\{[\s\S]*?\}\}/g,e=>" ".repeat(e.length))}function Ae(t){const e=t.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(!e)return"";const n=e[2].match(/\[\s*([\s\S]*?)\s*\]/);if(n){const o=n[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).find(s=>/^[a-zA-Z_][\w-]*$/.test(s));if(o)return o}return(e[2].trim().split(/\s+/)[0]||"").replace(/\[|\]/g,"")}function Ut(t,e,n,o){t.hidden=!0,o&&(t.wrapFrom=e,t.wrapTo=n);for(const s of t.children)Ut(s,e,n,!1)}function Kt(t,e,n,o){const s=[],a=[];let r=n,i=0;const c=p=>{a.length?a[a.length-1].children.push(p):s.push(p)};for(;r<o;){if(e[r]!=="<"){r+=1;continue}if(e.startsWith("<!--",r)){const d=e.indexOf("-->",r+4),v=d===-1||d>o?o:d,P=d===-1||d+3>o?o:d+3,st=Kt(t,e,r+4,v);for(const Lt of st)Ut(Lt,r,P,!0),c(Lt);r=P;continue}if(e.startsWith("<!",r)||e.startsWith("<?",r)){const d=e.indexOf(">",r+2);r=d===-1||d+1>o?o:d+1;continue}const p=e[r+1]==="/",m=e.slice(r,o).match(/^<\/?([a-zA-Z][a-zA-Z0-9:-]*)/);if(!m){r+=1;continue}const l=m[1].toLowerCase(),u=e.indexOf(">",r);if(u===-1||u>=o)break;const g=e.slice(r,u+1),b=!p&&(Nt.has(l)||/\/\s*>$/.test(g));if(p){for(let d=a.length-1;d>=0;d-=1)if(a[d].tag===l){a[d].to=u+1,a.length=d;break}r=u+1;continue}const M=Ae(t.slice(r,u+1)),W=a.length?a[a.length-1]:null,D=W?W.children:s,ot=W?`${W.path}/${D.length}:${l}`:`${D.length}:${l}`,$={id:`${l}-${r}-${i}`,tag:l,klass:M,path:ot,label:M,from:r,to:u+1,openTo:u+1,hidden:!1,children:[]};i+=1,c($),b?$.to=u+1:a.push($),r=u+1}for(;a.length;)a.pop().to=o;return s}function Zt(t){const e=String(t||""),n=Vt(e);return Kt(e,n,0,n.length)}function yt(t,e,n=0,o=[]){for(const s of t){const a=s.children.length>0,r=e.has(s.id);o.push({id:s.id,tag:s.tag,klass:s.klass||"",path:s.path,label:s.label,from:s.from,to:s.to,openTo:s.openTo,hidden:!!s.hidden,wrapFrom:s.wrapFrom,wrapTo:s.wrapTo,depth:n,hasChildren:a,shut:r}),a&&!r&&yt(s.children,e,n+1,o)}return o}function to(t){return Nt.has(String(t||"").toLowerCase())}const Xt=["sm","md","lg","xl","2xl","max-sm","max-md","max-lg","max-xl","max-2xl","dark","hover","focus","focus-visible","active","disabled","group-hover"],Mt={sm:"(min-width: 640px)",md:"(min-width: 768px)",lg:"(min-width: 1024px)",xl:"(min-width: 1280px)","2xl":"(min-width: 1536px)","max-sm":"(max-width: 639px)","max-md":"(max-width: 767px)","max-lg":"(max-width: 1023px)","max-xl":"(max-width: 1279px)","max-2xl":"(max-width: 1535px)",dark:"(prefers-color-scheme: dark)"},At={hover:":hover",focus:":focus","focus-visible":":focus-visible",active:":active",disabled:":disabled","group-hover":":is(:where(.group):hover *)"},Oe={relative:"position: relative",absolute:"position: absolute",fixed:"position: fixed",sticky:"position: sticky",static:"position: static",block:"display: block",inline:"display: inline","inline-block":"display: inline-block",flex:"display: flex","inline-flex":"display: inline-flex",grid:"display: grid",hidden:"display: none","flex-row":"flex-direction: row","flex-col":"flex-direction: column","flex-wrap":"flex-wrap: wrap","items-start":"align-items: flex-start","items-center":"align-items: center","items-end":"align-items: flex-end","items-stretch":"align-items: stretch","justify-start":"justify-content: flex-start","justify-center":"justify-content: center","justify-end":"justify-content: flex-end","justify-between":"justify-content: space-between","justify-around":"justify-content: space-around","text-left":"text-align: left","text-center":"text-align: center","text-right":"text-align: right","w-full":"width: 100%","h-full":"height: 100%","w-screen":"width: 100vw","h-screen":"height: 100vh","overflow-hidden":"overflow: hidden","overflow-auto":"overflow: auto","pointer-events-none":"pointer-events: none",underline:"text-decoration-line: underline",italic:"font-style: italic","font-bold":"font-weight: 700","font-medium":"font-weight: 500",uppercase:"text-transform: uppercase",truncate:"overflow: hidden; text-overflow: ellipsis; white-space: nowrap","z-10":"z-index: 10","z-20":"z-index: 20","z-50":"z-index: 50"},Yt={p:"padding",px:"padding-inline",py:"padding-block",pt:"padding-top",pr:"padding-right",pb:"padding-bottom",pl:"padding-left",m:"margin",mx:"margin-inline",my:"margin-block",mt:"margin-top",mr:"margin-right",mb:"margin-bottom",ml:"margin-left",gap:"gap","gap-x":"column-gap","gap-y":"row-gap",w:"width",h:"height","min-w":"min-width","min-h":"min-height","max-w":"max-width","max-h":"max-height"},Gt={bg:"background-color",border:"border-color",outline:"outline-color",fill:"fill",stroke:"stroke"};let rt=null;function Qt(t){return t?.Statamic?.$config?.get?.("sveFeatures")?.tailwind_dock===!0}function eo(t){return e=>{if(!Qt(t)||!ze(e))return null;const n=e.matchBefore(/[^\s"']*$/),o=n?.text??"";return o.includes("{")||o.includes("}")?null:wt(t).then(s=>{const a=Re(o,s).slice(0,80);return a.length?{from:n?n.from:e.pos,options:a,validFor:/^[^\s"'=]*$/}:null})}}function no(t,e){return t((n,o)=>{if(!Qt(e))return null;const s=Pe(n.state,o);return s?wt(e).then(a=>{const r=Fe(s.text,a);return r?{pos:s.from,end:s.to,create(){return{dom:We(r,Ie(s.text,a))}}}:null}):null})}function Ot(t){const e={color:[],spacing:[],text:[],leading:[],font:[],radius:[]},n=/--(color|spacing|text|leading|font|radius)-([a-zA-Z0-9][a-zA-Z0-9._-]*)\s*:\s*([^;]+);/g;let o;for(;o=n.exec(String(t||""));)o[2]!=="*"&&e[o[1]].push({name:o[2],value:o[3].trim()});const s=[];Object.entries(Oe).forEach(([r,i])=>{s.push({label:r,css:i,color:null})}),e.color.forEach(({name:r,value:i})=>{const c=je(i);Object.entries(Gt).forEach(([p,m])=>{s.push({label:`${p}-${r}`,css:`${m}: var(--color-${r})`,color:c})}),s.push({label:`text-${r}`,css:`color: var(--color-${r})`,color:c})}),e.spacing.forEach(({name:r})=>{Object.entries(Yt).forEach(([i,c])=>{s.push({label:`${i}-${r}`,css:`${c}: var(--spacing-${r})`,color:null})})}),e.text.forEach(({name:r})=>{s.push({label:`text-${r}`,css:`font-size: var(--text-${r})`,color:null})}),e.leading.forEach(({name:r})=>{s.push({label:`leading-${r}`,css:`line-height: var(--leading-${r})`,color:null})}),e.font.forEach(({name:r})=>{s.push({label:`font-${r}`,css:`font-family: var(--font-${r})`,color:null})}),e.radius.forEach(({name:r})=>{s.push({label:r==="DEFAULT"?"rounded":`rounded-${r}`,css:`border-radius: var(--radius-${r})`,color:null})});const a=new Map;return s.forEach(r=>{a.has(r.label)||a.set(r.label,r)}),{items:[...a.values()],byUtility:a}}function wt(t){return rt||(rt=t.fetch("/!/sve/tailwind-theme",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{css:""}).then(e=>Ot(typeof e.css=="string"?e.css:"")).catch(()=>Ot(""))),rt}function ze(t){return!!(t.matchBefore(/class\s*=\s*"[^"]*$/i)||t.matchBefore(/class\s*=\s*'[^']*$/i))}function Pe(t,e){const n=t.doc.lineAt(e),o=e-n.from,s=Be(n.text,o);if(!s)return null;const a=n.text.slice(s.valueFrom,s.valueTo),r=o-s.valueFrom,i=a.slice(0,r),c=a.slice(r),p=(i.match(/[^\s]*$/)||[""])[0],m=(c.match(/^[^\s]*/)||[""])[0],l=p+m;if(!l||l.includes("{"))return null;const u=n.from+s.valueFrom+(i.length-p.length);return{from:u,to:u+l.length,text:l}}function Be(t,e){const n=/\bclass\s*=\s*(["'])/gi;let o;for(;o=n.exec(t);){const s=o[1],a=o.index+o[0].length,r=t.indexOf(s,a),i=r===-1?t.length:r;if(e>=a&&e<=i)return{valueFrom:a,valueTo:i}}return null}function xt(t){const e=[...Xt].sort((r,i)=>i.length-r.length),n=[];let o=String(t||""),s=!0;for(;s;){s=!1;for(const r of e){const i=`${r}:`;if(o.startsWith(i)){n.push(r),o=o.slice(i.length),s=!0;break}}}let a=!1;return o.startsWith("!")?(a=!0,o=o.slice(1)):o.endsWith("!")&&(a=!0,o=o.slice(0,-1)),{variants:n,utility:o,important:a}}function Re(t,e){const{variants:n,utility:o}=xt(t),s=n.length?`${n.join(":")}:`:"",a=o.toLowerCase(),r=[];return!a&&!s&&Xt.forEach(i=>{r.push({label:`${i}:`,type:"keyword",detail:"variant",boost:2})}),e.items.forEach(i=>{if(a&&!i.label.startsWith(a)&&!i.label.includes(a))return;const c=`${s}${i.label}`;r.push({label:c,type:"property",detail:i.css,boost:i.label.startsWith(a)?1:0})}),r.sort((i,c)=>(c.boost||0)-(i.boost||0)||i.label.localeCompare(c.label))}function Fe(t,e){const{variants:n,utility:o,important:s}=xt(t),a=e.byUtility.get(o);if(!a)return"";let r=a.css;s&&(r+=" !important");const i=t.replace(/[^a-zA-Z0-9_-]/g,l=>`\\${l}`);let c="";const p=[];n.forEach(l=>{Mt[l]?p.push(Mt[l]):At[l]&&(c+=At[l])});let m=`.${i}${c} { ${r} }`;return p.slice().reverse().forEach(l=>{m=`@media ${l} {
  ${m}
}`}),m}function Ie(t,e){const{utility:n}=xt(t);return e.byUtility.get(n)?.color||null}function je(t){const e=String(t||"").trim();return/^#([0-9a-fA-F]{3,8})$/.test(e)?e:null}function We(t,e){const n=document.createElement("div");if(n.className="sve-tw-info",e){const s=document.createElement("span");s.className="sve-tw-swatch",s.style.background=e,n.appendChild(s)}const o=document.createElement("pre");return o.textContent=t,n.appendChild(o),n}const f=$e({emptyText:"",tag:"",scope:"",scopeTitle:"",baseLabel:"",groups:[],canEdit:!1,onChip:null,variant:"",breakpoints:[],onBreakpoint:null,state:"",stateLabel:"",onState:null,onTag:null,dropTitle:"",onDrop:null,siteClasses:[]});function Jt(t,e,n){const o=String(t||"").slice(e,n),s=Vt(o),a=/(\sclass\s*=\s*)(["'])/i.exec(s);if(!a)return null;const r=a[2],i=a.index+a[1].length+1,c=s.indexOf(r,i);return c===-1?null:{from:e+i,to:e+c,quote:r,value:o.slice(i,c)}}function De(t){const e=String(t||""),n=[];let o=0;for(;o<e.length;){if(/\s/.test(e[o])){o+=1;continue}let s=o,a=!1;for(;s<e.length;){if(e.startsWith("{{",s)){const r=e.indexOf("}}",s+2);a=!0,s=r===-1?e.length:r+2;continue}if(/\s/.test(e[s]))break;s+=1}n.push({text:e.slice(o,s),from:o,to:s,dynamic:a}),o=s}return n}function te(t){const e=String(t||""),n=[];let o=0,s=0;for(let r=0;r<e.length;r+=1){const i=e[r];i==="["||i==="("?o+=1:i==="]"||i===")"?o=Math.max(0,o-1):i===":"&&o===0&&(n.push(e.slice(s,r)),s=r+1)}const a=e.slice(s);return{variants:n,base:a}}function ee(t){let n=String(t||""),o="";n.startsWith("!")?(o="pre",n=n.slice(1)):n.endsWith("!")&&(o="post",n=n.slice(0,-1));let s="";const a=qe(n);return a!==-1&&(s=n.slice(a),n=n.slice(0,a)),{name:n,modifier:s,important:o}}function qe(t){let e=0;for(let n=0;n<t.length;n+=1){const o=t[n];if(o==="["||o==="(")e+=1;else if(o==="]"||o===")")e=Math.max(0,e-1);else if(o==="/"&&e===0)return n}return-1}function pt({variants:t,name:e,modifier:n,important:o}){let s=`${e}${n||""}`;return o==="pre"?s=`!${s}`:o==="post"&&(s=`${s}!`),[...t||[],s].join(":")}function ne(t){const e=De(t),n=new Map;let o=null,s=0;const a=e.findIndex(i=>i.text==="]");if(e[0]?.text==="["&&a>0){const i=e.slice(1,a);o={from:e[0].from,to:e[a].to,label:`[ ${i.map(c=>c.text).join(" ")} ]`},s=a+1}for(;s<e.length;s+=1){const i=e[s],{variants:c,base:p}=te(i.text),{name:m,modifier:l,important:u}=ee(p),g=c.join(":");n.has(g)||n.set(g,{key:g,variants:c,items:[]}),n.get(g).items.push({raw:i.text,from:i.from,to:i.to,dynamic:i.dynamic,variants:c,name:m,modifier:l,important:u})}const r=[...n.values()];return r.sort((i,c)=>i.key===""?-1:c.key===""?1:0),{scope:o,groups:r}}function tt(t,e,n){const o=String(t||"");if(n)return o.slice(0,e.from)+n+o.slice(e.to);let s=e.from,a=e.to;if(s>0&&(o[s-1]===" "||o[s-1]==="	"))for(;s>0&&(o[s-1]===" "||o[s-1]==="	");)s-=1;else for(;a<o.length&&(o[a]===" "||o[a]==="	");)a+=1;return He(o.slice(0,s)+o.slice(a),s)}function He(t,e){const n=t.lastIndexOf(`
`,Math.max(0,e-1));if(n===-1)return t;const o=t.indexOf(`
`,n+1);return t.slice(n+1,o===-1?t.length:o).trim()!==""?t:t.slice(0,n)+t.slice(o===-1?t.length:o)}function oe(t,e){const n=String(t||"");return n.trim()?`${n.replace(/\s+$/,"")} ${e}`:e}function se(t,e,n){const o=String(t||""),s=String(n||"").trim().toLowerCase();if(!/^[a-z][a-z0-9-]*$/.test(s)||!e?.tag||s===e.tag.toLowerCase())return o;const a=e.tag.toLowerCase(),r=o.slice(e.from,e.openTo);if(!new RegExp(`^<${a}(?=[\\s/>])`,"i").test(r))return o;let i=o;const c=i.toLowerCase().lastIndexOf(`</${a}`,e.to);return c>e.from&&c<e.to&&(i=i.slice(0,c)+`</${s}`+i.slice(c+2+a.length)),i.slice(0,e.from)+`<${s}`+i.slice(e.from+1+a.length)}function Ne(t,e,n){const o=Jt(t,e.from,e.openTo);if(o)return t.slice(0,o.from)+n+t.slice(o.to);const s=String(t).slice(e.from,e.openTo),a=/^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(s);if(!a||!n)return t;const r=e.from+a[0].length;return`${t.slice(0,r)} class="${n}"${t.slice(r)}`}const Ve=[...Object.keys(Yt),...Object.keys(Gt),"text","leading","font","rounded"].sort((t,e)=>e.length-t.length);let at=null;function Ue(t){return at||(at=wt(t).then(Ke)),at}function re(t){const e=String(t||"");if(e.includes(";"))return"";const n=e.indexOf(":");return n===-1?"":e.slice(0,n).trim()}function Ke(t){const e=new Map,n=new Map,o=new Map;for(const s of t.items){const a=re(s.css);a&&(e.has(a)||e.set(a,[]),e.get(a).push(s),n.set(s.label,a));const r=ae(s.label);r&&(o.has(r)||o.set(r,[]),o.get(r).push(s))}return{catalog:t,byProperty:e,propertyOfUtility:n,byPrefix:o}}function ae(t){for(const e of Ve)if(String(t).startsWith(`${e}-`))return e;return""}function ie(t,e){if(!e||!t)return null;const n=e.propertyOfUtility.get(t);if(n)return{label:n,options:e.byProperty.get(n)||[]};const o=ae(t),s=o?e.byPrefix.get(o):null;return s?.length?{label:re(s[0].css)||o,options:s}:null}function le(t,e){return e?.catalog?.byUtility?.get(t)?.css||""}function Ze(t,e){return e?.catalog?.byUtility?.get(t)?.color||""}const Xe={class:"sve-tw"},Ye={key:0,class:"sve-tw-head"},Ge=["disabled"],Qe=["title","data-active","disabled","onClick"],Je=["data-active","disabled"],tn={key:1,class:"sve-tw-empty"},en=["data-sve-tw-base","data-current"],nn={class:"sve-tw-chips"},on=["title","onClick"],sn=["title","onClick"],rn={__name:"TwClassList",setup(t){function e(n){const o={"data-sve-tw-chip":n.id};return n.locked&&(o["data-sve-tw-locked"]=""),n.open&&(o["data-open"]=""),o}return(n,o)=>(x(),k("div",Xe,[S(f).tag?(x(),k("div",Ye,[h("button",{type:"button",class:"sve-tw-tag",disabled:!S(f).canEdit,onClick:o[0]||(o[0]=T(s=>S(f).onTag?.(s),["prevent","stop"]))},"<"+E(S(f).tag)+">",9,Ge),(x(!0),k(B,null,q(S(f).breakpoints,s=>(x(),k("button",{key:s.index,type:"button","data-sve-tw-bp":"",title:s.title,"data-active":s.active?"":void 0,disabled:!S(f).canEdit,onClick:T(a=>S(f).onBreakpoint?.(s.index),["prevent","stop"])},E(s.label),9,Qe))),128)),h("button",{type:"button","data-sve-tw-state":"","data-active":S(f).state?"":void 0,disabled:!S(f).canEdit,onClick:o[1]||(o[1]=T(s=>S(f).onState?.(s),["prevent","stop"]))},[ut(E(S(f).stateLabel)+" ",1),o[2]||(o[2]=h("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[h("path",{d:"m6 9 6 6 6-6"})],-1))],8,Je),o[3]||(o[3]=h("span",{class:"sve-tw-gap"},null,-1))])):F("",!0),S(f).groups.length?F("",!0):(x(),k("div",tn,E(S(f).emptyText),1)),(x(!0),k(B,null,q(S(f).groups,s=>(x(),k("div",{key:s.key,class:"sve-tw-group"},[h("span",{class:"sve-tw-variant","data-sve-tw-base":s.key===""?"":void 0,"data-current":s.current?"":void 0},E(s.key===""?S(f).baseLabel:s.key),9,en),h("div",nn,[(x(!0),k(B,null,q(s.chips,a=>(x(),k("span",{key:a.id,class:"sve-tw-chip-wrap"},[h("button",_e({type:"button"},{ref_for:!0},e(a),{title:a.title,onClick:T(r=>S(f).onChip?.(r,a.id),["prevent","stop"])}),[a.color?(x(),k("span",{key:0,class:"sve-tw-dot",style:gt({background:a.color})},null,4)):F("",!0),ut(" "+E(a.raw),1)],16,on),a.locked?F("",!0):(x(),k("button",{key:0,type:"button",class:"sve-tw-drop",title:S(f).dropTitle,onClick:T(r=>S(f).onDrop?.(a.id),["prevent","stop"])},"−",8,sn))]))),128))])]))),128))]))}},an=Ce(rn,[["__scopeId","data-v-bfb30e9d"]]),ln={key:0,"data-sve-tw-menu-title":""},cn={"data-sve-tw-menu-list":""},un=["data-active","title","onClick"],dn={"data-sve-tw-tick":""},pn={"data-sve-tw-label":""},kt={__name:"TwClassMenu",props:{title:{type:String,default:""},options:{type:Array,default:()=>[]},removeLabel:{type:String,default:""},onPick:{type:Function,required:!0},onRemove:{type:Function,required:!0}},setup(t){return(e,n)=>(x(),k(B,null,[t.title?(x(),k("div",ln,E(t.title),1)):F("",!0),h("div",cn,[(x(!0),k(B,null,q(t.options,o=>(x(),k("button",{key:o.label,type:"button","data-sve-tw-option":"","data-active":o.active?"":void 0,title:o.css,onClick:T(s=>t.onPick(o.label),["prevent","stop"])},[h("span",dn,E(o.active?"✓":""),1),o.color?(x(),k("span",{key:0,"data-sve-tw-dot":"",style:gt({background:o.color})},null,4)):F("",!0),h("span",pn,E(o.label),1)],8,un))),128))]),h("button",{type:"button","data-sve-tw-remove":"",onClick:n[0]||(n[0]=T(o=>t.onRemove(),["prevent","stop"]))},[n[1]||(n[1]=h("span",{"data-sve-tw-tick":""},"✕",-1)),ut(E(t.removeLabel),1)])],64))}},fn={"data-sve-tw-search":""},mn=["placeholder","aria-label","onKeydown"],hn={"data-sve-tw-tabs":""},vn=["data-active"],gn=["data-active"],bn={key:0,"data-sve-tw-add-empty":""},yn=["data-cursor","data-active","data-sve-tw-off","title","onMouseenter","onClick"],wn={"data-sve-tw-label":""},xn={__name:"TwAddClass",props:{label:{type:String,default:""},placeholder:{type:String,default:""},sitePlaceholder:{type:String,default:""},emptyText:{type:String,default:""},offText:{type:String,default:""},siteLabel:{type:String,default:""},tailwindLabel:{type:String,default:""},search:{type:Function,required:!0},onAdd:{type:Function,required:!0}},setup(t){const e=t,n=A(""),o=A(null),s=A("tailwind"),a=A(null),r=A(-1),i=A(!1),c=j(()=>n.value.trim().toLowerCase()),p=j(()=>(f.siteClasses||[]).flatMap($=>$.items).filter($=>!c.value||$.name.toLowerCase().includes(c.value))),m=j(()=>e.search(n.value)),l=j(()=>s.value==="site"?p.value:m.value),u=j(()=>s.value==="site"?e.sitePlaceholder:e.placeholder);Dt(()=>dt(()=>o.value?.focus()));function g($){return $?.name||$?.label||""}function b($){i.value=!0;const d=l.value.length;if(!d){r.value=-1;return}const v=r.value+$;r.value=v<0?-1:Math.min(v,d-1),dt(()=>M())}function M(){const $=a.value?.querySelector("[data-cursor]");if(!$)return;let d=$.parentElement;for(;d&&d.scrollHeight<=d.clientHeight;)d=d.parentElement;if(!d)return;const v=$.offsetTop,P=v+$.offsetHeight;v<d.scrollTop?d.scrollTop=v:P>d.scrollTop+d.clientHeight&&(d.scrollTop=P-d.clientHeight)}function W($){i.value||(r.value=$)}function D(){r.value=-1}function ot(){const $=r.value>=0?l.value[r.value]:null,d=$?g($):n.value.trim();d&&e.onAdd(d)}return($,d)=>(x(),k(B,null,[h("div",fn,[d[7]||(d[7]=h("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[h("circle",{cx:"11",cy:"11",r:"7"}),h("path",{d:"m20 20-3.5-3.5"})],-1)),qt(h("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":d[0]||(d[0]=v=>n.value=v),type:"text",placeholder:u.value,"aria-label":t.label,onInput:D,onKeydown:[d[1]||(d[1]=I(T(v=>b(1),["prevent"]),["down"])),d[2]||(d[2]=I(T(v=>b(-1),["prevent"]),["up"])),I(T(ot,["prevent"]),["enter"]),d[3]||(d[3]=I(T(()=>{},["stop"]),["escape"]))]},null,40,mn),[[Ht,n.value]])]),h("div",hn,[h("button",{type:"button","data-sve-tw-tab":"","data-active":s.value==="tailwind"?"":void 0,onClick:d[4]||(d[4]=T(v=>{s.value="tailwind",D()},["prevent","stop"]))},E(t.tailwindLabel),9,vn),h("button",{type:"button","data-sve-tw-tab":"","data-active":s.value==="site"?"":void 0,onClick:d[5]||(d[5]=T(v=>{s.value="site",D()},["prevent","stop"]))},E(t.siteLabel),9,gn)]),l.value.length?F("",!0):(x(),k("div",bn,E(t.emptyText),1)),h("div",{ref_key:"rowsEl",ref:a,onMousemove:d[6]||(d[6]=v=>i.value=!1)},[(x(!0),k(B,null,q(l.value,(v,P)=>(x(),k("button",{key:v.name||v.label,type:"button","data-sve-tw-option":"","data-cursor":P===r.value?"":void 0,"data-active":P===r.value?"":void 0,"data-sve-tw-off":v.loaded===!1?"":void 0,title:v.loaded===!1?t.offText:v.file||v.css,onMouseenter:st=>W(P),onClick:T(st=>t.onAdd(v.name||v.label),["prevent","stop"])},[v.color?(x(),k("span",{key:0,"data-sve-tw-dot":"",style:gt({background:v.color})},null,4)):F("",!0),h("span",wn,E(v.name||v.label),1)],40,yn))),128))],544)],64))}},kn={"data-sve-tw-search":""},$n=["placeholder","aria-label","onKeydown"],Cn=["data-active","onMouseenter","onClick"],_n={"data-sve-tw-tick":""},Tn={"data-sve-tw-label":""},ce={__name:"TwTagMenu",props:{label:{type:String,default:""},placeholder:{type:String,default:""},current:{type:String,default:""},tags:{type:Array,default:()=>[]},onPick:{type:Function,required:!0}},setup(t){const e=t,n=A(""),o=A(null),s=A(-1),a=A(!1),r=j(()=>n.value.trim().toLowerCase()),i=j(()=>{if(!r.value)return e.tags;const m=e.tags.filter(l=>l.includes(r.value));return m.sort((l,u)=>(l.startsWith(r.value)?0:1)-(u.startsWith(r.value)?0:1)),m});Dt(()=>dt(()=>o.value?.focus()));function c(m){a.value=!0;const l=i.value.length;s.value=l?Math.min(Math.max(s.value+m,-1),l-1):-1}function p(){const m=s.value>=0?i.value[s.value]:n.value.trim().toLowerCase();m&&e.onPick(m)}return(m,l)=>(x(),k(B,null,[h("div",kn,[l[6]||(l[6]=h("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[h("circle",{cx:"11",cy:"11",r:"7"}),h("path",{d:"m20 20-3.5-3.5"})],-1)),qt(h("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":l[0]||(l[0]=u=>n.value=u),type:"text",placeholder:t.placeholder,"aria-label":t.label,onInput:l[1]||(l[1]=u=>s.value=-1),onKeydown:[l[2]||(l[2]=I(T(u=>c(1),["prevent"]),["down"])),l[3]||(l[3]=I(T(u=>c(-1),["prevent"]),["up"])),I(T(p,["prevent"]),["enter"]),l[4]||(l[4]=I(T(()=>{},["stop"]),["escape"]))]},null,40,$n),[[Ht,n.value]])]),h("div",{onMousemove:l[5]||(l[5]=u=>a.value=!1)},[(x(!0),k(B,null,q(i.value,(u,g)=>(x(),k("button",{key:u,type:"button","data-sve-tw-option":"","data-active":g===s.value||s.value===-1&&u===t.current?"":void 0,onMouseenter:b=>a.value?null:s.value=g,onClick:T(b=>t.onPick(u),["prevent","stop"])},[h("span",_n,E(u===t.current?"✓":""),1),h("span",Tn,"<"+E(u)+">",1)],40,Cn))),128))],32)],64))}},C="__sve-tw-menu",zt="--sve-tw-anchor",Sn=typeof CSS<"u"&&CSS.supports?.("anchor-name: --x");let J=null;const Pt="__sve-tw-style",$t=[{key:"",all:!0,device:"Responsive",label:"tw_size_all"},{key:"",device:"Laptop",label:"tw_size_laptop",prefix:""},{key:"max-lg",device:"Tablet",label:"responsive_tablet",under:1024},{key:"max-md",device:"Mobile",label:"responsive_mobile",under:768}],Bt=["","dark","hover","focus","active","before","after"],ue={Mobile:"max-md",Tablet:"max-lg",Laptop:"",Desktop:""},de=["div","section","article","header","footer","main","aside","nav","h1","h2","h3","h4","h5","h6","p","span","a","button","label","ul","ol","li","figure","figcaption","blockquote","strong","em","small","picture","img","video","form","table","tr","td","th"];let pe="",H="",nt=!1;function En(){try{return ue[bt(window,"sve-lp-device")]??""}catch{return""}}function Ct(){return nt?pe:En()}function fe(){return[Ct(),H].filter(Boolean)}function _t(){return fe().join(":")}const Ln=/^(max-)?(sm|md|lg|xl|2xl)$/;function Mn(t){return String(t||"").split(":").find(e=>Ln.test(e))||""}function me(){if(nt)return!0;try{return Object.prototype.hasOwnProperty.call(ue,bt(window,"sve-lp-device"))}catch{return!1}}function An(t){if(!me())return!0;const e=Mn(t);return e===Ct()?!0:!$t.some(n=>n.key===e)}let w=null,U=new Map,O=null,it=!1,et="",ft=null;function he(t){return t?.querySelector?.('[data-sve-style="tw"] [data-sve-tw-host]')||null}function ve(t){if(t.getElementById(Pt))return;const e=t.createElement("style");e.id=Pt,e.textContent=`
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
  `,t.head.appendChild(e)}function ge(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e.contentDocument;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o.contentDocument}catch{}return null}function On(t,e,n){const o=ge(t);if(!(!o||!w?.path))for(const s of o.querySelectorAll(`[${Me}="${w.path}"]`))try{e&&s.classList.remove(e),n&&s.classList.add(n)}catch{}}const lt=new Map,zn=/(^|-)color$|^fill$|^stroke$/;function Tt(t){const e=String(t||""),n=e.slice(0,e.indexOf(":")).trim();return zn.test(n)&&/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(e)?.[1]||""}function be(t,e){if(!e)return"";if(lt.has(e))return lt.get(e);const n=ge(t),o=n?.documentElement,s=n?.defaultView;if(!o||!s)return"";let a="",r=e;for(let i=0;i<6&&r;i+=1){try{a=s.getComputedStyle(o).getPropertyValue(r).trim()}catch{return""}if(!a)return"";if(r=Tt(a),!r)break}return a&&!a.startsWith("var(")?(lt.set(e,a),a):""}function Pn(t,e){return Ze(e,O)||be(t,Tt(le(e,O)))}function L(t){const e=t?.document.getElementById(C);J&&(J.style.removeProperty("anchor-name"),J=null),ft?.(),ft=null,et="",e&&(e._sveApp?.unmount(),e.remove())}function Rt(t,e,n){const o=e.getBoundingClientRect(),s=n.offsetWidth||176,a=8,r=140,i=e.closest?.("#__sve-tw-strip")?Xn(t):null,c=i?i.top:0,p=i?i.bottom:t.innerHeight,m=i?i.left:0,l=i?i.right:t.innerWidth,u=o.bottom+4,g=p-u-a,b=Math.max(r,Math.min(g,420));n.style.left=`${Math.max(m+a,Math.min(o.left,l-s-a))}px`,n.style.maxHeight=`${b}px`,n.style.top=`${g>=r?u:Math.max(c+a,p-a-b)}px`}function V(t,e,n,o){const s=t.document;L(t),ve(s);const a=s.createElement("div");a.id=C,s.body.appendChild(a),a._sveApp=Te(n,a,o);const r=Sn&&!!e.closest?.("#__sve-tw-strip");r?(J=e,e.style.setProperty("anchor-name",zt),a.style.setProperty("position","absolute"),a.style.setProperty("position-anchor",zt),a.style.setProperty("position-area","block-end span-inline-start"),a.style.setProperty("position-try-fallbacks","flip-block, flip-inline, flip-block flip-inline"),a.style.setProperty("margin","4px 0 0 0"),a.style.setProperty("max-height","20rem")):Rt(t,e,a);const i=()=>{r||Rt(t,e,a)},c=m=>{!a.contains(m.target)&&!e.contains(m.target)&&(L(t),Y())},p=m=>{m.key==="Escape"&&(L(t),Y())};return s.addEventListener("pointerdown",c,!0),s.addEventListener("keydown",p,!0),t.addEventListener("scroll",i,!0),t.addEventListener("resize",i),ft=()=>{s.removeEventListener("pointerdown",c,!0),s.removeEventListener("keydown",p,!0),t.removeEventListener("scroll",i,!0),t.removeEventListener("resize",i)},a}function ye(t,e,n){return(e||[]).map(o=>({label:o.label,css:o.css,color:o.color||be(t,Tt(o.css)),active:o.label===n}))}function G(){return!w||R("dock:is-locked")===!0}function Q(){const t=R("dock:html");if(!w||typeof t!="string"||t[w.from]!=="<")return null;const e=Jt(t,w.from,w.openTo);return{html:t,value:e?e.value:""}}function Bn(t){if(!w?.path)return;const n=yt(Zt(t),new Set).find(o=>o.path===w.path);n&&(w={from:n.from,openTo:n.openTo,path:n.path,tag:n.tag})}function N(t,e,n,o,s){const a=Ne(e,w,n);a!==e&&(On(t,o,s),R("dock:set-html",a),Bn(a),z(t))}function X(t){return ie(t,O)?.label||""}function mt(t){return ne(t).groups.flatMap(e=>e.items)}function we(t){const e=_t();return mt(t).filter(n=>!n.dynamic&&n.variants.join(":")===e)}function Ft(t,e){if(G()||!e)return;const n=Q();if(!n)return;const o=X(e),s=we(n.value).find(r=>r.name===e||o&&X(r.name)===o);if(s?.name===e){N(t,n.html,tt(n.value,s,""),e,"");return}if(s){const r=pt({variants:s.variants,name:e,modifier:s.modifier,important:s.important});N(t,n.html,tt(n.value,s,r),s.raw,r);return}const a=pt({variants:fe(),name:e,modifier:"",important:""});N(t,n.html,oe(n.value,a),"",a)}function Rn(t,e){const n=String(e||"").trim(),o=_t(),s=o&&!n.includes(":")?`${o}:${n}`:n;if(G()||!n)return;const a=Q();if(!a||mt(a.value).some(u=>u.raw===s))return;const{variants:i,base:c}=te(s),p=X(ee(c).name),m=i.join(":"),l=p?mt(a.value).find(u=>!u.dynamic&&u.variants.join(":")===m&&X(u.name)===p):null;if(l){N(t,a.html,tt(a.value,l,s),l.raw,s);return}N(t,a.html,oe(a.value,s),"",s.includes(":")?"":s)}function ht(t,e,n){if(G())return;const o=Q();if(!o||o.value.slice(e.from,e.to)!==e.raw){z(t);return}const s=n?pt({variants:e.variants,name:n,modifier:e.modifier,important:e.important}):"";N(t,o.html,tt(o.value,e,s),e.raw,s)}function Fn(t,e){if(G()||!w)return;const n=R("dock:html");if(typeof n!="string"||n[w.from]!=="<")return;const o=se(n,w,e);if(o===n)return;const s=w.from;R("dock:set-html",o);const r=yt(Zt(o),new Set).find(i=>i.from===s);r&&(w={from:r.from,openTo:r.openTo,path:r.path,tag:r.tag}),z(t),Z("tw:changed")}function oo(t,e,n){n?.tag&&V(t,e,ce,{label:_(t,"tw_tag"),placeholder:_(t,"tw_tag_placeholder"),current:String(n.tag).toLowerCase(),tags:de,onPick:o=>{In(t,n,o),L(t)}})}function In(t,e,n){if(R("dock:is-locked")===!0)return;const o=R("dock:html");if(typeof o!="string"||o[e.from]!=="<")return;const s=se(o,e,n);s!==o&&R("dock:set-html",s)}function jn(t,e){V(t,e,ce,{label:_(t,"tw_tag"),placeholder:_(t,"tw_tag_placeholder"),current:(w?.tag||"").toLowerCase(),tags:de,onPick:n=>{Fn(t,n),L(t)}})}function so(t){Et(t,w?.path||"")}function ro(){return!!w}function Wn(t,e){const n=$t[e];n&&(R("lp:set-device",{win:t,key:n.device}),nt=!n.all,pe=n.key,L(t),z(t),Z("tw:changed"))}function Dn(t,e){V(t,e,kt,{title:_(t,"tw_state"),removeLabel:_(t,"tw_state_none"),options:Bt.filter(Boolean).map(n=>({label:n,css:"",color:null,active:n===H})),onPick:n=>{H=Bt.includes(n)?n:"",L(t),z(t),Z("tw:changed")},onRemove:()=>{H="",L(t),z(t),Z("tw:changed")}})}Ee("lp:device",()=>{nt=!1,he(window.document)&&z(window)});function qn(t){const e=t?Q():null;return e&&we(e.value).find(n=>X(n.name)===t)?.name||""}function ao(t,e,n,o){const s=O?.byProperty.get(n)||[];if(!s.length)return;const a=qn(n);V(t,e,kt,{title:n,removeLabel:_(t,"tw_classes_remove"),options:ye(t,s,a),onPick:r=>{Ft(t,r),L(t),o?.(r)},onRemove:()=>{a&&Ft(t,a),L(t),o?.("")}})}let It=[],ct=!1;function Hn(t){ct||(ct=!0,t.fetch("/!/sve/site-css/classes",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{groups:[]}).then(e=>{It=Array.isArray(e?.groups)?e.groups:[],f.siteClasses=It}).catch(()=>{ct=!1}))}function Nn(t,e){Hn(t),V(t,e,xn,{label:_(t,"tw_add_class"),placeholder:_(t,"tw_add_placeholder"),emptyText:_(t,"tw_add_empty"),offText:_(t,"tw_class_not_imported"),sitePlaceholder:_(t,"tw_add_placeholder_site"),siteLabel:_(t,"tw_add_site"),tailwindLabel:_(t,"tw_add_tailwind"),search:n=>{const o=String(n||"").trim().toLowerCase();if(!o||!O)return[];const s=O.catalog.items.filter(a=>a.label.toLowerCase().includes(o));return s.sort((a,r)=>{const i=a.label.toLowerCase().startsWith(o)?0:1,c=r.label.toLowerCase().startsWith(o)?0:1;return i-c||a.label.length-r.label.length}),s.slice(0,40).map(a=>({label:a.label,css:a.css,color:a.color,active:!1}))},onAdd:n=>{Rn(t,n)}})}function Vn(t,e,n){const o=U.get(n);if(!o||o.locked)return;if(et===n){L(t),Y();return}const s=ie(o.name,O);V(t,e.currentTarget,kt,{title:s?.label||"",removeLabel:_(t,"tw_classes_remove"),options:ye(t,s?.options,o.name),onPick:a=>{ht(t,o,a),L(t)},onRemove:()=>{ht(t,o,""),L(t)}}),et=n,Y()}function Y(){for(const t of f.groups)for(const e of t.chips)e.open=e.id===et}function io(t,e){if(!e||e.from==null||e.openTo==null){w=null,U=new Map,L(t),z(t);return}w={from:e.from,openTo:e.openTo,path:e.path,tag:e.tag},z(t)}function z(t){Un(t);const e=w?Q():null,n=e?ne(e.value):{scope:null,groups:[]};U=new Map,f.baseLabel=_(t,"tw_size_base"),f.scopeTitle=_(t,"tw_classes_scope"),f.dropTitle=_(t,"tw_classes_remove"),f.variant=_t(),f.onBreakpoint=r=>Wn(t,r),f.onState=r=>Dn(t,r.currentTarget);const o=me();f.breakpoints=$t.map((r,i)=>({index:i,label:_(t,r.label),title:r.under?`${r.key}:  ·  < ${r.under}px`:_(t,r.all?"tw_size_all_title":"tw_size_base_title"),active:r.all?!o:o&&r.key===Ct()})),f.state=H,f.stateLabel=H||_(t,"tw_state"),f.canEdit=!G(),f.onChip=(r,i)=>Vn(t,r,i),f.onTag=r=>jn(t,r.currentTarget),f.onDrop=r=>{const i=U.get(r);i&&!i.locked&&(L(t),ht(t,i,""))},f.tag=w?.tag||"";const s=n.scope?.label||"";f.scope=/^\[\s*\]$/.test(s)?"":s,f.emptyText=_(t,w?n.groups.length?"tw_classes_none_size":"tw_classes_none":"tw_classes_pick"),f.groups=n.groups.filter(r=>An(r.key)).map(r=>({key:r.key,current:r.key===f.variant,chips:r.items.map((i,c)=>{const p={...i,id:`${r.key}-${c}-${i.from}`,locked:i.dynamic||!f.canEdit,open:!1,color:i.dynamic?"":Pn(t,i.name),title:i.dynamic?_(t,"tw_classes_dynamic"):le(i.name,O)||i.raw};return U.set(p.id,p),p})}));const a=he(t.document);a&&(ve(t.document),Se(a,an)),Y(),Et(t,w?.path||""),Z("tw:changed")}function Un(t){O||it||(it=!0,Ue(t).then(e=>{O=e,z(t)}).catch(()=>{it=!1}))}const xe="sve-tw-strip";function Kn(t){try{return bt(t,xe)!=="0"}catch{return!0}}function lo(t,e){Le(t,xe,e?"1":"0"),e||vt(t)}const y="__sve-tw-strip",jt="__sve-tw-strip-style";let Wt=null,K=null;function St(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o}catch{}return null}function Zn(t){if(t.getElementById(jt))return;const e=t.createElement("style");e.id=jt,e.textContent=`
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
  `,t.head.appendChild(e)}function Xn(t){const e=St(t);return e?e.getBoundingClientRect():null}function vt(t){t?.document.getElementById(y)?.remove()}function Yn(t){const e=()=>Gn(t);Wt!==t&&(Wt=t,t.addEventListener("resize",e),t.addEventListener("scroll",e,!0));const n=St(t)?.contentWindow;if(n&&!n._sveStripBound)try{n._sveStripBound=!0,n.addEventListener("scroll",e,!0),n.addEventListener("resize",e),n.addEventListener("statamic:preview-updated",()=>{t.setTimeout(()=>Et(t,K?.path||""),60)})}catch{}}function Gn(t){const e=t?.document.getElementById(y);!e||!K?.el?.isConnected||ke(t,e,K.frame,K.el)}function Et(t,e){if(!t||!Kn(t)){vt(t);return}const n=t.document,o=St(t),s=o?.contentDocument,a=e&&s?s.querySelector(`[data-sve-ht-path="${e}"]`):null;if(!a||!f.tag){vt(t);return}Zn(n),Yn(t);let r=n.getElementById(y);r||(r=n.createElement("div"),r.id=y,n.body.appendChild(r));let i=r.querySelector('[data-group="tag"]');if(!i){i=n.createElement("div"),i.setAttribute("data-group","tag");const l=n.createElement("span");l.setAttribute("data-sve-tw-strip-tag",""),i.appendChild(l),r.appendChild(i)}i.firstChild.textContent=`<${f.tag}>`;let c=r.querySelector('[data-group="classes"]'),p=c?.querySelector("[data-scroll]");const m=f.groups.flatMap(l=>l.chips);if(m.length&&!c){c=n.createElement("div"),c.setAttribute("data-group","classes"),p=n.createElement("div"),p.setAttribute("data-scroll","");const l=n.createElement("span");l.setAttribute("data-fade",""),c.appendChild(p),c.appendChild(l);const u=()=>{p.scrollWidth-p.scrollLeft-p.clientWidth>2?c.setAttribute("data-overflow",""):c.removeAttribute("data-overflow")};p.addEventListener("scroll",u),c._sveSync=u,r.insertBefore(c,r.querySelector('[data-group="add"]'))}if(!m.length)c?.remove();else if(p){p.replaceChildren();for(const l of m){const u=n.createElement("button");if(u.type="button",u.title=l.title||"",l.locked&&u.setAttribute("data-locked",""),l.color){const b=n.createElement("span");b.setAttribute("data-dot",""),b.style.background=l.color,u.appendChild(b)}u.appendChild(n.createTextNode(l.raw));const g=n.createElement("span");if(g.setAttribute("data-chip-wrap",""),g.appendChild(u),!l.locked){const b=n.createElement("button");b.type="button",b.setAttribute("data-drop",""),b.title=f.dropTitle||"",b.textContent="−",b.addEventListener("click",M=>{M.preventDefault(),M.stopPropagation(),f.onDrop?.(l.id)}),g.appendChild(b),u.addEventListener("click",M=>{M.preventDefault(),M.stopPropagation(),f.onChip?.(M,l.id)})}p.appendChild(g)}t.requestAnimationFrame(()=>c._sveSync?.())}if(!r.querySelector('[data-group="add"]')){const l=n.createElement("div");l.setAttribute("data-group","add");const u=n.createElement("button");u.type="button",u.setAttribute("data-add","");const g=n.createElement("span");g.setAttribute("data-plus",""),g.textContent="+",u.appendChild(g),u.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation(),Nn(t,b.currentTarget)}),l.appendChild(u),r.appendChild(l)}K={frame:o,el:a,path:e},ke(t,r,o,a)}function ke(t,e,n,o){const s=n.getBoundingClientRect(),a=n.clientWidth?s.width/n.clientWidth:1,r=o.getBoundingClientRect(),i=e.getBoundingClientRect(),c=6,p=16,m=s.left+r.left*a,l=s.top+r.top*a-i.height-c,u=s.top+r.top*a+c,g=Math.max(c,s.left+p),b=Math.max(g,Math.min(s.right,t.innerWidth)-i.width-p);e.style.left=`${Math.max(g,Math.min(m,b))}px`,e.style.top=`${Math.max(s.top+p,l<s.top+p?u:l)}px`;const M=n.clientHeight||s.height;e.hidden=r.bottom<=0||r.top>=M}export{Qt as a,Kn as b,L as c,so as d,eo as e,yt as f,no as g,qn as h,to as i,ao as j,Nn as k,Ft as l,ro as m,Zt as p,io as r,lo as s,oo as t};
