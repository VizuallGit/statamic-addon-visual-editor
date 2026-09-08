import{r as xe,_ as ke,o as y,c as w,u as S,a as v,f as _,t as E,F as z,e as q,I as lt,d as R,m as $e,n as vt,Q as M,H as I,T as Dt,a2 as ct,K as jt,w as F,L as qt,j as $,l as Ce,i as _e,a9 as Z,M as B,a8 as gt,N as Te,A as Se}from"./addon-CeQIS6oI.js";import{H as Ee}from"./html-pick-align-gkRPeJkt.js";const Ht=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function Nt(t){return String(t||"").replace(/\{\{[\s\S]*?\}\}/g,e=>" ".repeat(e.length))}function Le(t){const e=t.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(!e)return"";const n=e[2].match(/\[\s*([\s\S]*?)\s*\]/);if(n){const o=n[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).find(s=>/^[a-zA-Z_][\w-]*$/.test(s));if(o)return o}return(e[2].trim().split(/\s+/)[0]||"").replace(/\[|\]/g,"")}function Vt(t,e,n,o){t.hidden=!0,o&&(t.wrapFrom=e,t.wrapTo=n);for(const s of t.children)Vt(s,e,n,!1)}function Ut(t,e,n,o){const s=[],a=[];let r=n,i=0;const c=p=>{a.length?a[a.length-1].children.push(p):s.push(p)};for(;r<o;){if(e[r]!=="<"){r+=1;continue}if(e.startsWith("<!--",r)){const d=e.indexOf("-->",r+4),g=d===-1||d>o?o:d,P=d===-1||d+3>o?o:d+3,nt=Ut(t,e,r+4,g);for(const Et of nt)Vt(Et,r,P,!0),c(Et);r=P;continue}if(e.startsWith("<!",r)||e.startsWith("<?",r)){const d=e.indexOf(">",r+2);r=d===-1||d+1>o?o:d+1;continue}const p=e[r+1]==="/",m=e.slice(r,o).match(/^<\/?([a-zA-Z][a-zA-Z0-9:-]*)/);if(!m){r+=1;continue}const l=m[1].toLowerCase(),u=e.indexOf(">",r);if(u===-1||u>=o)break;const h=e.slice(r,u+1),T=!p&&(Ht.has(l)||/\/\s*>$/.test(h));if(p){for(let d=a.length-1;d>=0;d-=1)if(a[d].tag===l){a[d].to=u+1,a.length=d;break}r=u+1;continue}const W=Le(t.slice(r,u+1)),D=a.length?a[a.length-1]:null,j=D?D.children:s,et=D?`${D.path}/${j.length}:${l}`:`${j.length}:${l}`,x={id:`${l}-${r}-${i}`,tag:l,klass:W,path:et,label:W,from:r,to:u+1,openTo:u+1,hidden:!1,children:[]};i+=1,c(x),T?x.to=u+1:a.push(x),r=u+1}for(;a.length;)a.pop().to=o;return s}function Kt(t){const e=String(t||""),n=Nt(e);return Ut(e,n,0,n.length)}function bt(t,e,n=0,o=[]){for(const s of t){const a=s.children.length>0,r=e.has(s.id);o.push({id:s.id,tag:s.tag,klass:s.klass||"",path:s.path,label:s.label,from:s.from,to:s.to,openTo:s.openTo,hidden:!!s.hidden,wrapFrom:s.wrapFrom,wrapTo:s.wrapTo,depth:n,hasChildren:a,shut:r}),a&&!r&&bt(s.children,e,n+1,o)}return o}function to(t){return Ht.has(String(t||"").toLowerCase())}const Zt=["sm","md","lg","xl","2xl","max-sm","max-md","max-lg","max-xl","max-2xl","dark","hover","focus","focus-visible","active","disabled","group-hover"],Lt={sm:"(min-width: 640px)",md:"(min-width: 768px)",lg:"(min-width: 1024px)",xl:"(min-width: 1280px)","2xl":"(min-width: 1536px)","max-sm":"(max-width: 639px)","max-md":"(max-width: 767px)","max-lg":"(max-width: 1023px)","max-xl":"(max-width: 1279px)","max-2xl":"(max-width: 1535px)",dark:"(prefers-color-scheme: dark)"},Mt={hover:":hover",focus:":focus","focus-visible":":focus-visible",active:":active",disabled:":disabled","group-hover":":is(:where(.group):hover *)"},Me={relative:"position: relative",absolute:"position: absolute",fixed:"position: fixed",sticky:"position: sticky",static:"position: static",block:"display: block",inline:"display: inline","inline-block":"display: inline-block",flex:"display: flex","inline-flex":"display: inline-flex",grid:"display: grid",hidden:"display: none","flex-row":"flex-direction: row","flex-col":"flex-direction: column","flex-wrap":"flex-wrap: wrap","items-start":"align-items: flex-start","items-center":"align-items: center","items-end":"align-items: flex-end","items-stretch":"align-items: stretch","justify-start":"justify-content: flex-start","justify-center":"justify-content: center","justify-end":"justify-content: flex-end","justify-between":"justify-content: space-between","justify-around":"justify-content: space-around","text-left":"text-align: left","text-center":"text-align: center","text-right":"text-align: right","w-full":"width: 100%","h-full":"height: 100%","w-screen":"width: 100vw","h-screen":"height: 100vh","overflow-hidden":"overflow: hidden","overflow-auto":"overflow: auto","pointer-events-none":"pointer-events: none",underline:"text-decoration-line: underline",italic:"font-style: italic","font-bold":"font-weight: 700","font-medium":"font-weight: 500",uppercase:"text-transform: uppercase",truncate:"overflow: hidden; text-overflow: ellipsis; white-space: nowrap","z-10":"z-index: 10","z-20":"z-index: 20","z-50":"z-index: 50"},Xt={p:"padding",px:"padding-inline",py:"padding-block",pt:"padding-top",pr:"padding-right",pb:"padding-bottom",pl:"padding-left",m:"margin",mx:"margin-inline",my:"margin-block",mt:"margin-top",mr:"margin-right",mb:"margin-bottom",ml:"margin-left",gap:"gap","gap-x":"column-gap","gap-y":"row-gap",w:"width",h:"height","min-w":"min-width","min-h":"min-height","max-w":"max-width","max-h":"max-height"},Yt={bg:"background-color",border:"border-color",outline:"outline-color",fill:"fill",stroke:"stroke"};let ot=null;function Gt(t){return t?.Statamic?.$config?.get?.("sveFeatures")?.tailwind_dock===!0}function eo(t){return e=>{if(!Gt(t)||!Ae(e))return null;const n=e.matchBefore(/[^\s"']*$/),o=n?.text??"";return o.includes("{")||o.includes("}")?null:yt(t).then(s=>{const a=ze(o,s).slice(0,80);return a.length?{from:n?n.from:e.pos,options:a,validFor:/^[^\s"'=]*$/}:null})}}function no(t,e){return t((n,o)=>{if(!Gt(e))return null;const s=Oe(n.state,o);return s?yt(e).then(a=>{const r=Be(s.text,a);return r?{pos:s.from,end:s.to,create(){return{dom:Ie(r,Re(s.text,a))}}}:null}):null})}function At(t){const e={color:[],spacing:[],text:[],leading:[],font:[],radius:[]},n=/--(color|spacing|text|leading|font|radius)-([a-zA-Z0-9][a-zA-Z0-9._-]*)\s*:\s*([^;]+);/g;let o;for(;o=n.exec(String(t||""));)o[2]!=="*"&&e[o[1]].push({name:o[2],value:o[3].trim()});const s=[];Object.entries(Me).forEach(([r,i])=>{s.push({label:r,css:i,color:null})}),e.color.forEach(({name:r,value:i})=>{const c=Fe(i);Object.entries(Yt).forEach(([p,m])=>{s.push({label:`${p}-${r}`,css:`${m}: var(--color-${r})`,color:c})}),s.push({label:`text-${r}`,css:`color: var(--color-${r})`,color:c})}),e.spacing.forEach(({name:r})=>{Object.entries(Xt).forEach(([i,c])=>{s.push({label:`${i}-${r}`,css:`${c}: var(--spacing-${r})`,color:null})})}),e.text.forEach(({name:r})=>{s.push({label:`text-${r}`,css:`font-size: var(--text-${r})`,color:null})}),e.leading.forEach(({name:r})=>{s.push({label:`leading-${r}`,css:`line-height: var(--leading-${r})`,color:null})}),e.font.forEach(({name:r})=>{s.push({label:`font-${r}`,css:`font-family: var(--font-${r})`,color:null})}),e.radius.forEach(({name:r})=>{s.push({label:r==="DEFAULT"?"rounded":`rounded-${r}`,css:`border-radius: var(--radius-${r})`,color:null})});const a=new Map;return s.forEach(r=>{a.has(r.label)||a.set(r.label,r)}),{items:[...a.values()],byUtility:a}}function yt(t){return ot||(ot=t.fetch("/!/sve/tailwind-theme",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{css:""}).then(e=>At(typeof e.css=="string"?e.css:"")).catch(()=>At(""))),ot}function Ae(t){return!!(t.matchBefore(/class\s*=\s*"[^"]*$/i)||t.matchBefore(/class\s*=\s*'[^']*$/i))}function Oe(t,e){const n=t.doc.lineAt(e),o=e-n.from,s=Pe(n.text,o);if(!s)return null;const a=n.text.slice(s.valueFrom,s.valueTo),r=o-s.valueFrom,i=a.slice(0,r),c=a.slice(r),p=(i.match(/[^\s]*$/)||[""])[0],m=(c.match(/^[^\s]*/)||[""])[0],l=p+m;if(!l||l.includes("{"))return null;const u=n.from+s.valueFrom+(i.length-p.length);return{from:u,to:u+l.length,text:l}}function Pe(t,e){const n=/\bclass\s*=\s*(["'])/gi;let o;for(;o=n.exec(t);){const s=o[1],a=o.index+o[0].length,r=t.indexOf(s,a),i=r===-1?t.length:r;if(e>=a&&e<=i)return{valueFrom:a,valueTo:i}}return null}function wt(t){const e=[...Zt].sort((r,i)=>i.length-r.length),n=[];let o=String(t||""),s=!0;for(;s;){s=!1;for(const r of e){const i=`${r}:`;if(o.startsWith(i)){n.push(r),o=o.slice(i.length),s=!0;break}}}let a=!1;return o.startsWith("!")?(a=!0,o=o.slice(1)):o.endsWith("!")&&(a=!0,o=o.slice(0,-1)),{variants:n,utility:o,important:a}}function ze(t,e){const{variants:n,utility:o}=wt(t),s=n.length?`${n.join(":")}:`:"",a=o.toLowerCase(),r=[];return!a&&!s&&Zt.forEach(i=>{r.push({label:`${i}:`,type:"keyword",detail:"variant",boost:2})}),e.items.forEach(i=>{if(a&&!i.label.startsWith(a)&&!i.label.includes(a))return;const c=`${s}${i.label}`;r.push({label:c,type:"property",detail:i.css,boost:i.label.startsWith(a)?1:0})}),r.sort((i,c)=>(c.boost||0)-(i.boost||0)||i.label.localeCompare(c.label))}function Be(t,e){const{variants:n,utility:o,important:s}=wt(t),a=e.byUtility.get(o);if(!a)return"";let r=a.css;s&&(r+=" !important");const i=t.replace(/[^a-zA-Z0-9_-]/g,l=>`\\${l}`);let c="";const p=[];n.forEach(l=>{Lt[l]?p.push(Lt[l]):Mt[l]&&(c+=Mt[l])});let m=`.${i}${c} { ${r} }`;return p.slice().reverse().forEach(l=>{m=`@media ${l} {
  ${m}
}`}),m}function Re(t,e){const{utility:n}=wt(t);return e.byUtility.get(n)?.color||null}function Fe(t){const e=String(t||"").trim();return/^#([0-9a-fA-F]{3,8})$/.test(e)?e:null}function Ie(t,e){const n=document.createElement("div");if(n.className="sve-tw-info",e){const s=document.createElement("span");s.className="sve-tw-swatch",s.style.background=e,n.appendChild(s)}const o=document.createElement("pre");return o.textContent=t,n.appendChild(o),n}const f=xe({emptyText:"",tag:"",scope:"",scopeTitle:"",baseLabel:"",groups:[],canEdit:!1,onChip:null,variant:"",breakpoints:[],onBreakpoint:null,state:"",stateLabel:"",onState:null,onTag:null,dropTitle:"",onDrop:null,siteClasses:[]});function Qt(t,e,n){const o=String(t||"").slice(e,n),s=Nt(o),a=/(\sclass\s*=\s*)(["'])/i.exec(s);if(!a)return null;const r=a[2],i=a.index+a[1].length+1,c=s.indexOf(r,i);return c===-1?null:{from:e+i,to:e+c,quote:r,value:o.slice(i,c)}}function We(t){const e=String(t||""),n=[];let o=0;for(;o<e.length;){if(/\s/.test(e[o])){o+=1;continue}let s=o,a=!1;for(;s<e.length;){if(e.startsWith("{{",s)){const r=e.indexOf("}}",s+2);a=!0,s=r===-1?e.length:r+2;continue}if(/\s/.test(e[s]))break;s+=1}n.push({text:e.slice(o,s),from:o,to:s,dynamic:a}),o=s}return n}function De(t){const e=String(t||""),n=[];let o=0,s=0;for(let r=0;r<e.length;r+=1){const i=e[r];i==="["||i==="("?o+=1:i==="]"||i===")"?o=Math.max(0,o-1):i===":"&&o===0&&(n.push(e.slice(s,r)),s=r+1)}const a=e.slice(s);return{variants:n,base:a}}function je(t){let n=String(t||""),o="";n.startsWith("!")?(o="pre",n=n.slice(1)):n.endsWith("!")&&(o="post",n=n.slice(0,-1));let s="";const a=qe(n);return a!==-1&&(s=n.slice(a),n=n.slice(0,a)),{name:n,modifier:s,important:o}}function qe(t){let e=0;for(let n=0;n<t.length;n+=1){const o=t[n];if(o==="["||o==="(")e+=1;else if(o==="]"||o===")")e=Math.max(0,e-1);else if(o==="/"&&e===0)return n}return-1}function ut({variants:t,name:e,modifier:n,important:o}){let s=`${e}${n||""}`;return o==="pre"?s=`!${s}`:o==="post"&&(s=`${s}!`),[...t||[],s].join(":")}function Jt(t){const e=We(t),n=new Map;let o=null,s=0;const a=e.findIndex(i=>i.text==="]");if(e[0]?.text==="["&&a>0){const i=e.slice(1,a);o={from:e[0].from,to:e[a].to,label:`[ ${i.map(c=>c.text).join(" ")} ]`},s=a+1}for(;s<e.length;s+=1){const i=e[s],{variants:c,base:p}=De(i.text),{name:m,modifier:l,important:u}=je(p),h=c.join(":");n.has(h)||n.set(h,{key:h,variants:c,items:[]}),n.get(h).items.push({raw:i.text,from:i.from,to:i.to,dynamic:i.dynamic,variants:c,name:m,modifier:l,important:u})}const r=[...n.values()];return r.sort((i,c)=>i.key===""?-1:c.key===""?1:0),{scope:o,groups:r}}function dt(t,e,n){const o=String(t||"");if(n)return o.slice(0,e.from)+n+o.slice(e.to);let s=e.from,a=e.to;if(s>0&&(o[s-1]===" "||o[s-1]==="	"))for(;s>0&&(o[s-1]===" "||o[s-1]==="	");)s-=1;else for(;a<o.length&&(o[a]===" "||o[a]==="	");)a+=1;return He(o.slice(0,s)+o.slice(a),s)}function He(t,e){const n=t.lastIndexOf(`
`,Math.max(0,e-1));if(n===-1)return t;const o=t.indexOf(`
`,n+1);return t.slice(n+1,o===-1?t.length:o).trim()!==""?t:t.slice(0,n)+t.slice(o===-1?t.length:o)}function te(t,e){const n=String(t||"");return n.trim()?`${n.replace(/\s+$/,"")} ${e}`:e}function ee(t,e,n){const o=String(t||""),s=String(n||"").trim().toLowerCase();if(!/^[a-z][a-z0-9-]*$/.test(s)||!e?.tag||s===e.tag.toLowerCase())return o;const a=e.tag.toLowerCase(),r=o.slice(e.from,e.openTo);if(!new RegExp(`^<${a}(?=[\\s/>])`,"i").test(r))return o;let i=o;const c=i.toLowerCase().lastIndexOf(`</${a}`,e.to);return c>e.from&&c<e.to&&(i=i.slice(0,c)+`</${s}`+i.slice(c+2+a.length)),i.slice(0,e.from)+`<${s}`+i.slice(e.from+1+a.length)}function Ne(t,e,n){const o=Qt(t,e.from,e.openTo);if(o)return t.slice(0,o.from)+n+t.slice(o.to);const s=String(t).slice(e.from,e.openTo),a=/^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(s);if(!a||!n)return t;const r=e.from+a[0].length;return`${t.slice(0,r)} class="${n}"${t.slice(r)}`}const Ve=[...Object.keys(Xt),...Object.keys(Yt),"text","leading","font","rounded"].sort((t,e)=>e.length-t.length);let st=null;function Ue(t){return st||(st=yt(t).then(Ke)),st}function ne(t){const e=String(t||"");if(e.includes(";"))return"";const n=e.indexOf(":");return n===-1?"":e.slice(0,n).trim()}function Ke(t){const e=new Map,n=new Map,o=new Map;for(const s of t.items){const a=ne(s.css);a&&(e.has(a)||e.set(a,[]),e.get(a).push(s),n.set(s.label,a));const r=oe(s.label);r&&(o.has(r)||o.set(r,[]),o.get(r).push(s))}return{catalog:t,byProperty:e,propertyOfUtility:n,byPrefix:o}}function oe(t){for(const e of Ve)if(String(t).startsWith(`${e}-`))return e;return""}function se(t,e){if(!e||!t)return null;const n=e.propertyOfUtility.get(t);if(n)return{label:n,options:e.byProperty.get(n)||[]};const o=oe(t),s=o?e.byPrefix.get(o):null;return s?.length?{label:ne(s[0].css)||o,options:s}:null}function re(t,e){return e?.catalog?.byUtility?.get(t)?.css||""}function Ze(t,e){return e?.catalog?.byUtility?.get(t)?.color||""}const Xe={class:"sve-tw"},Ye={key:0,class:"sve-tw-head"},Ge=["disabled"],Qe=["title","data-active","disabled","onClick"],Je=["data-active","disabled"],tn={key:1,class:"sve-tw-empty"},en=["data-sve-tw-base","data-current"],nn={class:"sve-tw-chips"},on=["title","onClick"],sn=["title","onClick"],rn={__name:"TwClassList",setup(t){function e(n){const o={"data-sve-tw-chip":n.id};return n.locked&&(o["data-sve-tw-locked"]=""),n.open&&(o["data-open"]=""),o}return(n,o)=>(y(),w("div",Xe,[S(f).tag?(y(),w("div",Ye,[v("button",{type:"button",class:"sve-tw-tag",disabled:!S(f).canEdit,onClick:o[0]||(o[0]=_(s=>S(f).onTag?.(s),["prevent","stop"]))},"<"+E(S(f).tag)+">",9,Ge),(y(!0),w(z,null,q(S(f).breakpoints,s=>(y(),w("button",{key:s.index,type:"button","data-sve-tw-bp":"",title:s.title,"data-active":s.active?"":void 0,disabled:!S(f).canEdit,onClick:_(a=>S(f).onBreakpoint?.(s.index),["prevent","stop"])},E(s.label),9,Qe))),128)),v("button",{type:"button","data-sve-tw-state":"","data-active":S(f).state?"":void 0,disabled:!S(f).canEdit,onClick:o[1]||(o[1]=_(s=>S(f).onState?.(s),["prevent","stop"]))},[lt(E(S(f).stateLabel)+" ",1),o[2]||(o[2]=v("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[v("path",{d:"m6 9 6 6 6-6"})],-1))],8,Je),o[3]||(o[3]=v("span",{class:"sve-tw-gap"},null,-1))])):R("",!0),S(f).groups.length?R("",!0):(y(),w("div",tn,E(S(f).emptyText),1)),(y(!0),w(z,null,q(S(f).groups,s=>(y(),w("div",{key:s.key,class:"sve-tw-group"},[v("span",{class:"sve-tw-variant","data-sve-tw-base":s.key===""?"":void 0,"data-current":s.current?"":void 0},E(s.key===""?S(f).baseLabel:s.key),9,en),v("div",nn,[(y(!0),w(z,null,q(s.chips,a=>(y(),w("button",$e({key:a.id,type:"button"},{ref_for:!0},e(a),{title:a.title,onClick:_(r=>S(f).onChip?.(r,a.id),["prevent","stop"])}),[a.color?(y(),w("span",{key:0,class:"sve-tw-dot",style:vt({background:a.color})},null,4)):R("",!0),lt(" "+E(a.raw)+" ",1),a.locked?R("",!0):(y(),w("span",{key:1,class:"sve-tw-drop",role:"button",title:S(f).dropTitle,onClick:_(r=>S(f).onDrop?.(a.id),["prevent","stop"])},"−",8,sn))],16,on))),128))])]))),128))]))}},an=ke(rn,[["__scopeId","data-v-aded08c3"]]),ln={key:0,"data-sve-tw-menu-title":""},cn={"data-sve-tw-menu-list":""},un=["data-active","title","onClick"],dn={"data-sve-tw-tick":""},fn={"data-sve-tw-label":""},xt={__name:"TwClassMenu",props:{title:{type:String,default:""},options:{type:Array,default:()=>[]},removeLabel:{type:String,default:""},onPick:{type:Function,required:!0},onRemove:{type:Function,required:!0}},setup(t){return(e,n)=>(y(),w(z,null,[t.title?(y(),w("div",ln,E(t.title),1)):R("",!0),v("div",cn,[(y(!0),w(z,null,q(t.options,o=>(y(),w("button",{key:o.label,type:"button","data-sve-tw-option":"","data-active":o.active?"":void 0,title:o.css,onClick:_(s=>t.onPick(o.label),["prevent","stop"])},[v("span",dn,E(o.active?"✓":""),1),o.color?(y(),w("span",{key:0,"data-sve-tw-dot":"",style:vt({background:o.color})},null,4)):R("",!0),v("span",fn,E(o.label),1)],8,un))),128))]),v("button",{type:"button","data-sve-tw-remove":"",onClick:n[0]||(n[0]=_(o=>t.onRemove(),["prevent","stop"]))},[n[1]||(n[1]=v("span",{"data-sve-tw-tick":""},"✕",-1)),lt(E(t.removeLabel),1)])],64))}},pn={"data-sve-tw-search":""},mn=["placeholder","aria-label","onKeydown"],hn={"data-sve-tw-tabs":""},vn=["data-active"],gn=["data-active"],bn={key:0,"data-sve-tw-add-empty":""},yn=["data-cursor","data-active","data-sve-tw-off","title","onMouseenter","onClick"],wn={"data-sve-tw-label":""},xn={__name:"TwAddClass",props:{label:{type:String,default:""},placeholder:{type:String,default:""},sitePlaceholder:{type:String,default:""},emptyText:{type:String,default:""},offText:{type:String,default:""},siteLabel:{type:String,default:""},tailwindLabel:{type:String,default:""},search:{type:Function,required:!0},onAdd:{type:Function,required:!0}},setup(t){const e=t,n=M(""),o=M(null),s=M("tailwind"),a=M(null),r=M(-1),i=M(!1),c=I(()=>n.value.trim().toLowerCase()),p=I(()=>(f.siteClasses||[]).flatMap(x=>x.items).filter(x=>!c.value||x.name.toLowerCase().includes(c.value))),m=I(()=>e.search(n.value)),l=I(()=>s.value==="site"?p.value:m.value),u=I(()=>s.value==="site"?e.sitePlaceholder:e.placeholder);Dt(()=>ct(()=>o.value?.focus()));function h(x){return x?.name||x?.label||""}function T(x){i.value=!0;const d=l.value.length;if(!d){r.value=-1;return}const g=r.value+x;r.value=g<0?-1:Math.min(g,d-1),ct(()=>W())}function W(){const x=a.value?.querySelector("[data-cursor]");if(!x)return;let d=x.parentElement;for(;d&&d.scrollHeight<=d.clientHeight;)d=d.parentElement;if(!d)return;const g=x.offsetTop,P=g+x.offsetHeight;g<d.scrollTop?d.scrollTop=g:P>d.scrollTop+d.clientHeight&&(d.scrollTop=P-d.clientHeight)}function D(x){i.value||(r.value=x)}function j(){r.value=-1}function et(){const x=r.value>=0?l.value[r.value]:null,d=x?h(x):n.value.trim();d&&e.onAdd(d)}return(x,d)=>(y(),w(z,null,[v("div",pn,[d[7]||(d[7]=v("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[v("circle",{cx:"11",cy:"11",r:"7"}),v("path",{d:"m20 20-3.5-3.5"})],-1)),jt(v("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":d[0]||(d[0]=g=>n.value=g),type:"text",placeholder:u.value,"aria-label":t.label,onInput:j,onKeydown:[d[1]||(d[1]=F(_(g=>T(1),["prevent"]),["down"])),d[2]||(d[2]=F(_(g=>T(-1),["prevent"]),["up"])),F(_(et,["prevent"]),["enter"]),d[3]||(d[3]=F(_(()=>{},["stop"]),["escape"]))]},null,40,mn),[[qt,n.value]])]),v("div",hn,[v("button",{type:"button","data-sve-tw-tab":"","data-active":s.value==="tailwind"?"":void 0,onClick:d[4]||(d[4]=_(g=>{s.value="tailwind",j()},["prevent","stop"]))},E(t.tailwindLabel),9,vn),v("button",{type:"button","data-sve-tw-tab":"","data-active":s.value==="site"?"":void 0,onClick:d[5]||(d[5]=_(g=>{s.value="site",j()},["prevent","stop"]))},E(t.siteLabel),9,gn)]),l.value.length?R("",!0):(y(),w("div",bn,E(t.emptyText),1)),v("div",{ref_key:"rowsEl",ref:a,onMousemove:d[6]||(d[6]=g=>i.value=!1)},[(y(!0),w(z,null,q(l.value,(g,P)=>(y(),w("button",{key:g.name||g.label,type:"button","data-sve-tw-option":"","data-cursor":P===r.value?"":void 0,"data-active":P===r.value?"":void 0,"data-sve-tw-off":g.loaded===!1?"":void 0,title:g.loaded===!1?t.offText:g.file||g.css,onMouseenter:nt=>D(P),onClick:_(nt=>t.onAdd(g.name||g.label),["prevent","stop"])},[g.color?(y(),w("span",{key:0,"data-sve-tw-dot":"",style:vt({background:g.color})},null,4)):R("",!0),v("span",wn,E(g.name||g.label),1)],40,yn))),128))],544)],64))}},kn={"data-sve-tw-search":""},$n=["placeholder","aria-label","onKeydown"],Cn=["data-active","onMouseenter","onClick"],_n={"data-sve-tw-tick":""},Tn={"data-sve-tw-label":""},ae={__name:"TwTagMenu",props:{label:{type:String,default:""},placeholder:{type:String,default:""},current:{type:String,default:""},tags:{type:Array,default:()=>[]},onPick:{type:Function,required:!0}},setup(t){const e=t,n=M(""),o=M(null),s=M(-1),a=M(!1),r=I(()=>n.value.trim().toLowerCase()),i=I(()=>{if(!r.value)return e.tags;const m=e.tags.filter(l=>l.includes(r.value));return m.sort((l,u)=>(l.startsWith(r.value)?0:1)-(u.startsWith(r.value)?0:1)),m});Dt(()=>ct(()=>o.value?.focus()));function c(m){a.value=!0;const l=i.value.length;s.value=l?Math.min(Math.max(s.value+m,-1),l-1):-1}function p(){const m=s.value>=0?i.value[s.value]:n.value.trim().toLowerCase();m&&e.onPick(m)}return(m,l)=>(y(),w(z,null,[v("div",kn,[l[6]||(l[6]=v("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[v("circle",{cx:"11",cy:"11",r:"7"}),v("path",{d:"m20 20-3.5-3.5"})],-1)),jt(v("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":l[0]||(l[0]=u=>n.value=u),type:"text",placeholder:t.placeholder,"aria-label":t.label,onInput:l[1]||(l[1]=u=>s.value=-1),onKeydown:[l[2]||(l[2]=F(_(u=>c(1),["prevent"]),["down"])),l[3]||(l[3]=F(_(u=>c(-1),["prevent"]),["up"])),F(_(p,["prevent"]),["enter"]),l[4]||(l[4]=F(_(()=>{},["stop"]),["escape"]))]},null,40,$n),[[qt,n.value]])]),v("div",{onMousemove:l[5]||(l[5]=u=>a.value=!1)},[(y(!0),w(z,null,q(i.value,(u,h)=>(y(),w("button",{key:u,type:"button","data-sve-tw-option":"","data-active":h===s.value||s.value===-1&&u===t.current?"":void 0,onMouseenter:T=>a.value?null:s.value=h,onClick:_(T=>t.onPick(u),["prevent","stop"])},[v("span",_n,E(u===t.current?"✓":""),1),v("span",Tn,"<"+E(u)+">",1)],40,Cn))),128))],32)],64))}},k="__sve-tw-menu",Ot="--sve-tw-anchor",Sn=typeof CSS<"u"&&CSS.supports?.("anchor-name: --x");let Q=null;const Pt="__sve-tw-style",kt=[{key:"",all:!0,device:"Responsive",label:"tw_size_all"},{key:"",device:"Laptop",label:"tw_size_laptop",prefix:""},{key:"max-lg",device:"Tablet",label:"responsive_tablet",under:1024},{key:"max-md",device:"Mobile",label:"responsive_mobile",under:768}],zt=["","dark","hover","focus","active","before","after"],ie={Mobile:"max-md",Tablet:"max-lg",Laptop:"",Desktop:""},le=["div","section","article","header","footer","main","aside","nav","h1","h2","h3","h4","h5","h6","p","span","a","button","label","ul","ol","li","figure","figcaption","blockquote","strong","em","small","picture","img","video","form","table","tr","td","th"];let ce="",H="",tt=!1;function En(){try{return ie[gt(window,"sve-lp-device")]??""}catch{return""}}function $t(){return tt?ce:En()}function ue(){return[$t(),H].filter(Boolean)}function Ct(){return ue().join(":")}const Ln=/^(max-)?(sm|md|lg|xl|2xl)$/;function Mn(t){return String(t||"").split(":").find(e=>Ln.test(e))||""}function de(){if(tt)return!0;try{return Object.prototype.hasOwnProperty.call(ie,gt(window,"sve-lp-device"))}catch{return!1}}function An(t){if(!de())return!0;const e=Mn(t);return e===$t()?!0:!kt.some(n=>n.key===e)}let b=null,V=new Map,A=null,rt=!1,J="",ft=null;function fe(t){return t?.querySelector?.('[data-sve-style="tw"] [data-sve-tw-host]')||null}function pe(t){if(t.getElementById(Pt))return;const e=t.createElement("style");e.id=Pt,e.textContent=`
    #${k} {
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
    #${k} [data-sve-tw-menu-title] {
      padding: 0.1em 0.2em 0.5em;
      opacity: .55;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.6875rem;
    }
    #${k} [data-sve-tw-option],
    #${k} [data-sve-tw-remove] {
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
    #${k} [data-sve-tw-option]:hover,
    #${k} [data-sve-tw-remove]:hover {
      background: rgba(255,255,255,.1);
    }
    #${k} [data-sve-tw-option][data-active] {
      background: rgba(255,255,255,.06);
    }
    #${k} [data-sve-tw-option][data-sve-tw-off] [data-sve-tw-label] {
      opacity: .45;
      text-decoration: line-through;
      text-decoration-thickness: 1px;
    }
    #${k} [data-sve-tw-tick] {
      flex: 0 0 auto;
      width: 0.9em;
      opacity: .7;
      font-family: ui-sans-serif, system-ui, sans-serif;
      line-height: 1;
    }
    #${k} [data-sve-tw-dot] {
      flex: 0 0 auto;
      width: 0.9em;
      height: 0.9em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
    #${k} [data-sve-tw-label] {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #${k} [data-sve-tw-remove] {
      margin-top: 0.3rem;
      border-top: 1px solid rgba(255,255,255,.14);
      border-radius: 0 0 0.4em 0.4em;
      padding-top: 0.6em;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    #${k} [data-sve-tw-search] {
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
    #${k} [data-sve-tw-search]:focus-within {
      border-color: rgba(147,197,253,.7);
    }
    #${k} [data-sve-tw-search] svg {
      flex: 0 0 auto;
      opacity: .5;
    }
    #${k} [data-sve-tw-add-input] {
      all: unset;
      flex: 1 1 auto;
      min-width: 0;
      color: inherit;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.75rem;
    }
    #${k} [data-sve-tw-tabs] {
      display: flex;
      gap: 0.2rem;
      margin-bottom: 0.45rem;
      padding: 0.15rem;
      border-radius: 0.45em;
      background: rgba(0,0,0,.28);
    }
    #${k} [data-sve-tw-tab] {
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
    #${k} [data-sve-tw-tab]:hover { opacity: 1; }
    #${k} [data-sve-tw-tab][data-active] {
      opacity: 1;
      background: rgba(255,255,255,.14);
    }
    #${k} [data-sve-tw-add-empty] {
      padding: 0.4em 0.5em;
      opacity: .55;
    }
  `,t.head.appendChild(e)}function me(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e.contentDocument;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o.contentDocument}catch{}return null}function On(t,e,n){const o=me(t);if(!(!o||!b?.path))for(const s of o.querySelectorAll(`[${Ee}="${b.path}"]`))try{e&&s.classList.remove(e),n&&s.classList.add(n)}catch{}}const at=new Map,Pn=/(^|-)color$|^fill$|^stroke$/;function _t(t){const e=String(t||""),n=e.slice(0,e.indexOf(":")).trim();return Pn.test(n)&&/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(e)?.[1]||""}function he(t,e){if(!e)return"";if(at.has(e))return at.get(e);const n=me(t),o=n?.documentElement,s=n?.defaultView;if(!o||!s)return"";let a="",r=e;for(let i=0;i<6&&r;i+=1){try{a=s.getComputedStyle(o).getPropertyValue(r).trim()}catch{return""}if(!a)return"";if(r=_t(a),!r)break}return a&&!a.startsWith("var(")?(at.set(e,a),a):""}function zn(t,e){return Ze(e,A)||he(t,_t(re(e,A)))}function L(t){const e=t?.document.getElementById(k);Q&&(Q.style.removeProperty("anchor-name"),Q=null),ft?.(),ft=null,J="",e&&(e._sveApp?.unmount(),e.remove())}function Bt(t,e,n){const o=e.getBoundingClientRect(),s=n.offsetWidth||176,a=8,r=140,i=e.closest?.("#__sve-tw-strip")?Xn(t):null,c=i?i.top:0,p=i?i.bottom:t.innerHeight,m=i?i.left:0,l=i?i.right:t.innerWidth,u=o.bottom+4,h=p-u-a,T=Math.max(r,Math.min(h,420));n.style.left=`${Math.max(m+a,Math.min(o.left,l-s-a))}px`,n.style.maxHeight=`${T}px`,n.style.top=`${h>=r?u:Math.max(c+a,p-a-T)}px`}function N(t,e,n,o){const s=t.document;L(t),pe(s);const a=s.createElement("div");a.id=k,s.body.appendChild(a),a._sveApp=Ce(n,a,o);const r=Sn&&!!e.closest?.("#__sve-tw-strip");r?(Q=e,e.style.setProperty("anchor-name",Ot),a.style.setProperty("position","absolute"),a.style.setProperty("position-anchor",Ot),a.style.setProperty("position-area","block-end span-inline-start"),a.style.setProperty("position-try-fallbacks","flip-block, flip-inline, flip-block flip-inline"),a.style.setProperty("margin","4px 0 0 0"),a.style.setProperty("max-height","20rem")):Bt(t,e,a);const i=()=>{r||Bt(t,e,a)},c=m=>{!a.contains(m.target)&&!e.contains(m.target)&&(L(t),X())},p=m=>{m.key==="Escape"&&(L(t),X())};return s.addEventListener("pointerdown",c,!0),s.addEventListener("keydown",p,!0),t.addEventListener("scroll",i,!0),t.addEventListener("resize",i),ft=()=>{s.removeEventListener("pointerdown",c,!0),s.removeEventListener("keydown",p,!0),t.removeEventListener("scroll",i,!0),t.removeEventListener("resize",i)},a}function ve(t,e,n){return(e||[]).map(o=>({label:o.label,css:o.css,color:o.color||he(t,_t(o.css)),active:o.label===n}))}function Y(){return!b||B("dock:is-locked")===!0}function G(){const t=B("dock:html");if(!b||typeof t!="string"||t[b.from]!=="<")return null;const e=Qt(t,b.from,b.openTo);return{html:t,value:e?e.value:""}}function Bn(t){if(!b?.path)return;const n=bt(Kt(t),new Set).find(o=>o.path===b.path);n&&(b={from:n.from,openTo:n.openTo,path:n.path,tag:n.tag})}function U(t,e,n,o,s){const a=Ne(e,b,n);a!==e&&(On(t,o,s),B("dock:set-html",a),Bn(a),O(t))}function pt(t){return se(t,A)?.label||""}function ge(t){return Jt(t).groups.flatMap(e=>e.items)}function be(t){const e=Ct();return ge(t).filter(n=>!n.dynamic&&n.variants.join(":")===e)}function Rt(t,e){if(Y()||!e)return;const n=G();if(!n)return;const o=pt(e),s=be(n.value).find(r=>r.name===e||o&&pt(r.name)===o);if(s?.name===e){U(t,n.html,dt(n.value,s,""),e,"");return}if(s){const r=ut({variants:s.variants,name:e,modifier:s.modifier,important:s.important});U(t,n.html,dt(n.value,s,r),s.raw,r);return}const a=ut({variants:ue(),name:e,modifier:"",important:""});U(t,n.html,te(n.value,a),"",a)}function Rn(t,e){const n=String(e||"").trim(),o=Ct(),s=o&&!n.includes(":")?`${o}:${n}`:n;if(Y()||!n)return;const a=G();!a||ge(a.value).some(i=>i.raw===s)||U(t,a.html,te(a.value,s),"",s.includes(":")?"":s)}function mt(t,e,n){if(Y())return;const o=G();if(!o||o.value.slice(e.from,e.to)!==e.raw){O(t);return}const s=n?ut({variants:e.variants,name:n,modifier:e.modifier,important:e.important}):"";U(t,o.html,dt(o.value,e,s),e.raw,s)}function Fn(t,e){if(Y()||!b)return;const n=B("dock:html");if(typeof n!="string"||n[b.from]!=="<")return;const o=ee(n,b,e);if(o===n)return;const s=b.from;B("dock:set-html",o);const r=bt(Kt(o),new Set).find(i=>i.from===s);r&&(b={from:r.from,openTo:r.openTo,path:r.path,tag:r.tag}),O(t),Z("tw:changed")}function oo(t,e,n){n?.tag&&N(t,e,ae,{label:$(t,"tw_tag"),placeholder:$(t,"tw_tag_placeholder"),current:String(n.tag).toLowerCase(),tags:le,onPick:o=>{In(t,n,o),L(t)}})}function In(t,e,n){if(B("dock:is-locked")===!0)return;const o=B("dock:html");if(typeof o!="string"||o[e.from]!=="<")return;const s=ee(o,e,n);s!==o&&B("dock:set-html",s)}function Wn(t,e){N(t,e,ae,{label:$(t,"tw_tag"),placeholder:$(t,"tw_tag_placeholder"),current:(b?.tag||"").toLowerCase(),tags:le,onPick:n=>{Fn(t,n),L(t)}})}function so(t){St(t,b?.path||"")}function ro(){return!!b}function Dn(t,e){const n=kt[e];n&&(B("lp:set-device",{win:t,key:n.device}),tt=!n.all,ce=n.key,L(t),O(t),Z("tw:changed"))}function jn(t,e){N(t,e,xt,{title:$(t,"tw_state"),removeLabel:$(t,"tw_state_none"),options:zt.filter(Boolean).map(n=>({label:n,css:"",color:null,active:n===H})),onPick:n=>{H=zt.includes(n)?n:"",L(t),O(t),Z("tw:changed")},onRemove:()=>{H="",L(t),O(t),Z("tw:changed")}})}Te("lp:device",()=>{tt=!1,fe(window.document)&&O(window)});function qn(t){const e=t?G():null;return e&&be(e.value).find(n=>pt(n.name)===t)?.name||""}function ao(t,e,n,o){const s=A?.byProperty.get(n)||[];if(!s.length)return;const a=qn(n);N(t,e,xt,{title:n,removeLabel:$(t,"tw_classes_remove"),options:ve(t,s,a),onPick:r=>{Rt(t,r),L(t),o?.(r)},onRemove:()=>{a&&Rt(t,a),L(t),o?.("")}})}let Ft=[],it=!1;function Hn(t){it||(it=!0,t.fetch("/!/sve/site-css/classes",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{groups:[]}).then(e=>{Ft=Array.isArray(e?.groups)?e.groups:[],f.siteClasses=Ft}).catch(()=>{it=!1}))}function Nn(t,e){Hn(t),N(t,e,xn,{label:$(t,"tw_add_class"),placeholder:$(t,"tw_add_placeholder"),emptyText:$(t,"tw_add_empty"),offText:$(t,"tw_class_not_imported"),sitePlaceholder:$(t,"tw_add_placeholder_site"),siteLabel:$(t,"tw_add_site"),tailwindLabel:$(t,"tw_add_tailwind"),search:n=>{const o=String(n||"").trim().toLowerCase();if(!o||!A)return[];const s=A.catalog.items.filter(a=>a.label.toLowerCase().includes(o));return s.sort((a,r)=>{const i=a.label.toLowerCase().startsWith(o)?0:1,c=r.label.toLowerCase().startsWith(o)?0:1;return i-c||a.label.length-r.label.length}),s.slice(0,40).map(a=>({label:a.label,css:a.css,color:a.color,active:!1}))},onAdd:n=>{Rn(t,n)}})}function Vn(t,e,n){const o=V.get(n);if(!o||o.locked)return;if(J===n){L(t),X();return}const s=se(o.name,A);N(t,e.currentTarget,xt,{title:s?.label||"",removeLabel:$(t,"tw_classes_remove"),options:ve(t,s?.options,o.name),onPick:a=>{mt(t,o,a),L(t)},onRemove:()=>{mt(t,o,""),L(t)}}),J=n,X()}function X(){for(const t of f.groups)for(const e of t.chips)e.open=e.id===J}function io(t,e){if(!e||e.from==null||e.openTo==null){b=null,V=new Map,L(t),O(t);return}b={from:e.from,openTo:e.openTo,path:e.path,tag:e.tag},O(t)}function O(t){Un(t);const e=b?G():null,n=e?Jt(e.value):{scope:null,groups:[]};V=new Map,f.baseLabel=$(t,"tw_size_base"),f.scopeTitle=$(t,"tw_classes_scope"),f.dropTitle=$(t,"tw_classes_remove"),f.variant=Ct(),f.onBreakpoint=r=>Dn(t,r),f.onState=r=>jn(t,r.currentTarget);const o=de();f.breakpoints=kt.map((r,i)=>({index:i,label:$(t,r.label),title:r.under?`${r.key}:  ·  < ${r.under}px`:$(t,r.all?"tw_size_all_title":"tw_size_base_title"),active:r.all?!o:o&&r.key===$t()})),f.state=H,f.stateLabel=H||$(t,"tw_state"),f.canEdit=!Y(),f.onChip=(r,i)=>Vn(t,r,i),f.onTag=r=>Wn(t,r.currentTarget),f.onDrop=r=>{const i=V.get(r);i&&!i.locked&&(L(t),mt(t,i,""))},f.tag=b?.tag||"";const s=n.scope?.label||"";f.scope=/^\[\s*\]$/.test(s)?"":s,f.emptyText=$(t,b?n.groups.length?"tw_classes_none_size":"tw_classes_none":"tw_classes_pick"),f.groups=n.groups.filter(r=>An(r.key)).map(r=>({key:r.key,current:r.key===f.variant,chips:r.items.map((i,c)=>{const p={...i,id:`${r.key}-${c}-${i.from}`,locked:i.dynamic||!f.canEdit,open:!1,color:i.dynamic?"":zn(t,i.name),title:i.dynamic?$(t,"tw_classes_dynamic"):re(i.name,A)||i.raw};return V.set(p.id,p),p})}));const a=fe(t.document);a&&(pe(t.document),_e(a,an)),X(),St(t,b?.path||""),Z("tw:changed")}function Un(t){A||rt||(rt=!0,Ue(t).then(e=>{A=e,O(t)}).catch(()=>{rt=!1}))}const ye="sve-tw-strip";function Kn(t){try{return gt(t,ye)!=="0"}catch{return!0}}function lo(t,e){Se(t,ye,e?"1":"0"),e||ht(t)}const C="__sve-tw-strip",It="__sve-tw-strip-style";let Wt=null,K=null;function Tt(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o}catch{}return null}function Zn(t){if(t.getElementById(It))return;const e=t.createElement("style");e.id=It,e.textContent=`
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
      position: relative;
      flex: 0 0 auto;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 0.35em;
      padding: 0.22em 1.45em 0.22em 0.5em;
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
    #${C} [data-drop] {
      position: absolute;
      right: 0.26em;
      top: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.05em;
      height: 1.05em;
      border-radius: 50%;
      background: rgba(255,255,255,.28);
      color: #fff;
      font-family: ui-sans-serif, system-ui, sans-serif;
      line-height: 1;
      opacity: 0;
      cursor: pointer;
    }
    #${C} button:hover [data-drop] { opacity: 1; }
    #${C} [data-drop]:hover { background: #e11d48; }
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
  `,t.head.appendChild(e)}function Xn(t){const e=Tt(t);return e?e.getBoundingClientRect():null}function ht(t){t?.document.getElementById(C)?.remove()}function Yn(t){const e=()=>Gn(t);Wt!==t&&(Wt=t,t.addEventListener("resize",e),t.addEventListener("scroll",e,!0));const n=Tt(t)?.contentWindow;if(n&&!n._sveStripBound)try{n._sveStripBound=!0,n.addEventListener("scroll",e,!0),n.addEventListener("resize",e),n.addEventListener("statamic:preview-updated",()=>{t.setTimeout(()=>St(t,K?.path||""),60)})}catch{}}function Gn(t){const e=t?.document.getElementById(C);!e||!K?.el?.isConnected||we(t,e,K.frame,K.el)}function St(t,e){if(!t||!Kn(t)){ht(t);return}const n=t.document,o=Tt(t),s=o?.contentDocument,a=e&&s?s.querySelector(`[data-sve-ht-path="${e}"]`):null;if(!a||!f.tag){ht(t);return}Zn(n),Yn(t);let r=n.getElementById(C);r||(r=n.createElement("div"),r.id=C,n.body.appendChild(r));let i=r.querySelector('[data-group="tag"]');if(!i){i=n.createElement("div"),i.setAttribute("data-group","tag");const l=n.createElement("span");l.setAttribute("data-sve-tw-strip-tag",""),i.appendChild(l),r.appendChild(i)}i.firstChild.textContent=`<${f.tag}>`;let c=r.querySelector('[data-group="classes"]'),p=c?.querySelector("[data-scroll]");const m=f.groups.flatMap(l=>l.chips);if(m.length&&!c){c=n.createElement("div"),c.setAttribute("data-group","classes"),p=n.createElement("div"),p.setAttribute("data-scroll","");const l=n.createElement("span");l.setAttribute("data-fade",""),c.appendChild(p),c.appendChild(l);const u=()=>{p.scrollWidth-p.scrollLeft-p.clientWidth>2?c.setAttribute("data-overflow",""):c.removeAttribute("data-overflow")};p.addEventListener("scroll",u),c._sveSync=u,r.insertBefore(c,r.querySelector('[data-group="add"]'))}if(!m.length)c?.remove();else if(p){p.replaceChildren();for(const l of m){const u=n.createElement("button");if(u.type="button",u.title=l.title||"",l.locked&&u.setAttribute("data-locked",""),l.color){const h=n.createElement("span");h.setAttribute("data-dot",""),h.style.background=l.color,u.appendChild(h)}if(u.appendChild(n.createTextNode(l.raw)),!l.locked){const h=n.createElement("span");h.setAttribute("data-drop",""),h.setAttribute("role","button"),h.title=f.dropTitle||"",h.textContent="−",h.addEventListener("click",T=>{T.preventDefault(),T.stopPropagation(),f.onDrop?.(l.id)}),u.appendChild(h),u.addEventListener("click",T=>{T.preventDefault(),T.stopPropagation(),f.onChip?.(T,l.id)})}p.appendChild(u)}t.requestAnimationFrame(()=>c._sveSync?.())}if(!r.querySelector('[data-group="add"]')){const l=n.createElement("div");l.setAttribute("data-group","add");const u=n.createElement("button");u.type="button",u.setAttribute("data-add",""),u.textContent="+",u.addEventListener("click",h=>{h.preventDefault(),h.stopPropagation(),Nn(t,h.currentTarget)}),l.appendChild(u),r.appendChild(l)}K={frame:o,el:a,path:e},we(t,r,o,a)}function we(t,e,n,o){const s=n.getBoundingClientRect(),a=n.clientWidth?s.width/n.clientWidth:1,r=o.getBoundingClientRect(),i=e.getBoundingClientRect(),c=6,p=16,m=s.left+r.left*a,l=s.top+r.top*a-i.height-c,u=s.top+r.top*a+c,h=Math.max(c,s.left+p),T=Math.max(h,Math.min(s.right,t.innerWidth)-i.width-p);e.style.left=`${Math.max(h,Math.min(m,T))}px`,e.style.top=`${Math.max(s.top+p,l<s.top+p?u:l)}px`;const W=n.clientHeight||s.height;e.hidden=r.bottom<=0||r.top>=W}export{Gt as a,Kn as b,L as c,so as d,eo as e,bt as f,no as g,qn as h,to as i,ao as j,Nn as k,Rt as l,ro as m,Kt as p,io as r,lo as s,oo as t};
