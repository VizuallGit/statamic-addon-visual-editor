import{r as fe,_ as pe,o as y,c as x,u as $,a as b,t as _,d as z,F as O,e as W,f as T,I as lt,m as me,n as pt,Q as F,H as j,T as he,a2 as $t,K as ve,w as U,L as ge,j as w,i as be,a9 as K,M as G,l as ye,a8 as Rt,N as xe}from"./addon-dv5mAxHV.js";import{H as we}from"./html-pick-align-gkRPeJkt.js";const Ft=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function It(t){return String(t||"").replace(/\{\{[\s\S]*?\}\}/g,e=>" ".repeat(e.length))}function ke(t){const e=t.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(!e)return"";const n=e[2].match(/\[\s*([\s\S]*?)\s*\]/);if(n){const o=n[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).find(s=>/^[a-zA-Z_][\w-]*$/.test(s));if(o)return o}return(e[2].trim().split(/\s+/)[0]||"").replace(/\[|\]/g,"")}function jt(t,e,n,o){t.hidden=!0,o&&(t.wrapFrom=e,t.wrapTo=n);for(const s of t.children)jt(s,e,n,!1)}function Wt(t,e,n,o){const s=[],r=[];let i=n,a=0;const l=p=>{r.length?r[r.length-1].children.push(p):s.push(p)};for(;i<o;){if(e[i]!=="<"){i+=1;continue}if(e.startsWith("<!--",i)){const c=e.indexOf("-->",i+4),h=c===-1||c>o?o:c,L=c===-1||c+3>o?o:c+3,nt=Wt(t,e,i+4,h);for(const kt of nt)jt(kt,i,L,!0),l(kt);i=L;continue}if(e.startsWith("<!",i)||e.startsWith("<?",i)){const c=e.indexOf(">",i+2);i=c===-1||c+1>o?o:c+1;continue}const p=e[i+1]==="/",f=e.slice(i,o).match(/^<\/?([a-zA-Z][a-zA-Z0-9:-]*)/);if(!f){i+=1;continue}const d=f[1].toLowerCase(),m=e.indexOf(">",i);if(m===-1||m>=o)break;const E=e.slice(i,m+1),B=!p&&(Ft.has(d)||/\/\s*>$/.test(E));if(p){for(let c=r.length-1;c>=0;c-=1)if(r[c].tag===d){r[c].to=m+1,r.length=c;break}i=m+1;continue}const V=ke(t.slice(i,m+1)),P=r.length?r[r.length-1]:null,R=P?P.children:s,et=P?`${P.path}/${R.length}:${d}`:`${R.length}:${d}`,v={id:`${d}-${i}-${a}`,tag:d,klass:V,path:et,label:V,from:i,to:m+1,openTo:m+1,hidden:!1,children:[]};a+=1,l(v),B?v.to=m+1:r.push(v),i=m+1}for(;r.length;)r.pop().to=o;return s}function $e(t){const e=String(t||""),n=It(e);return Wt(e,n,0,n.length)}function Dt(t,e,n=0,o=[]){for(const s of t){const r=s.children.length>0,i=e.has(s.id);o.push({id:s.id,tag:s.tag,klass:s.klass||"",path:s.path,label:s.label,from:s.from,to:s.to,openTo:s.openTo,hidden:!!s.hidden,wrapFrom:s.wrapFrom,wrapTo:s.wrapTo,depth:n,hasChildren:r,shut:i}),r&&!i&&Dt(s.children,e,n+1,o)}return o}function Wn(t){return Ft.has(String(t||"").toLowerCase())}const Ht=["sm","md","lg","xl","2xl","max-sm","max-md","max-lg","max-xl","max-2xl","dark","hover","focus","focus-visible","active","disabled","group-hover"],_t={sm:"(min-width: 640px)",md:"(min-width: 768px)",lg:"(min-width: 1024px)",xl:"(min-width: 1280px)","2xl":"(min-width: 1536px)","max-sm":"(max-width: 639px)","max-md":"(max-width: 767px)","max-lg":"(max-width: 1023px)","max-xl":"(max-width: 1279px)","max-2xl":"(max-width: 1535px)",dark:"(prefers-color-scheme: dark)"},Ct={hover:":hover",focus:":focus","focus-visible":":focus-visible",active:":active",disabled:":disabled","group-hover":":is(:where(.group):hover *)"},_e={relative:"position: relative",absolute:"position: absolute",fixed:"position: fixed",sticky:"position: sticky",static:"position: static",block:"display: block",inline:"display: inline","inline-block":"display: inline-block",flex:"display: flex","inline-flex":"display: inline-flex",grid:"display: grid",hidden:"display: none","flex-row":"flex-direction: row","flex-col":"flex-direction: column","flex-wrap":"flex-wrap: wrap","items-start":"align-items: flex-start","items-center":"align-items: center","items-end":"align-items: flex-end","items-stretch":"align-items: stretch","justify-start":"justify-content: flex-start","justify-center":"justify-content: center","justify-end":"justify-content: flex-end","justify-between":"justify-content: space-between","justify-around":"justify-content: space-around","text-left":"text-align: left","text-center":"text-align: center","text-right":"text-align: right","w-full":"width: 100%","h-full":"height: 100%","w-screen":"width: 100vw","h-screen":"height: 100vh","overflow-hidden":"overflow: hidden","overflow-auto":"overflow: auto","pointer-events-none":"pointer-events: none",underline:"text-decoration-line: underline",italic:"font-style: italic","font-bold":"font-weight: 700","font-medium":"font-weight: 500",uppercase:"text-transform: uppercase",truncate:"overflow: hidden; text-overflow: ellipsis; white-space: nowrap","z-10":"z-index: 10","z-20":"z-index: 20","z-50":"z-index: 50"},qt={p:"padding",px:"padding-inline",py:"padding-block",pt:"padding-top",pr:"padding-right",pb:"padding-bottom",pl:"padding-left",m:"margin",mx:"margin-inline",my:"margin-block",mt:"margin-top",mr:"margin-right",mb:"margin-bottom",ml:"margin-left",gap:"gap","gap-x":"column-gap","gap-y":"row-gap",w:"width",h:"height","min-w":"min-width","min-h":"min-height","max-w":"max-width","max-h":"max-height"},Nt={bg:"background-color",border:"border-color",outline:"outline-color",fill:"fill",stroke:"stroke"};let ot=null;function Vt(t){return t?.Statamic?.$config?.get?.("sveFeatures")?.tailwind_dock===!0}function Dn(t){return e=>{if(!Vt(t)||!Ce(e))return null;const n=e.matchBefore(/[^\s"']*$/),o=n?.text??"";return o.includes("{")||o.includes("}")?null:mt(t).then(s=>{const r=Ee(o,s).slice(0,80);return r.length?{from:n?n.from:e.pos,options:r,validFor:/^[^\s"'=]*$/}:null})}}function Hn(t,e){return t((n,o)=>{if(!Vt(e))return null;const s=Te(n.state,o);return s?mt(e).then(r=>{const i=Me(s.text,r);return i?{pos:s.from,end:s.to,create(){return{dom:ze(i,Le(s.text,r))}}}:null}):null})}function Tt(t){const e={color:[],spacing:[],text:[],leading:[],font:[],radius:[]},n=/--(color|spacing|text|leading|font|radius)-([a-zA-Z0-9][a-zA-Z0-9._-]*)\s*:\s*([^;]+);/g;let o;for(;o=n.exec(String(t||""));)o[2]!=="*"&&e[o[1]].push({name:o[2],value:o[3].trim()});const s=[];Object.entries(_e).forEach(([i,a])=>{s.push({label:i,css:a,color:null})}),e.color.forEach(({name:i,value:a})=>{const l=Ae(a);Object.entries(Nt).forEach(([p,f])=>{s.push({label:`${p}-${i}`,css:`${f}: var(--color-${i})`,color:l})}),s.push({label:`text-${i}`,css:`color: var(--color-${i})`,color:l})}),e.spacing.forEach(({name:i})=>{Object.entries(qt).forEach(([a,l])=>{s.push({label:`${a}-${i}`,css:`${l}: var(--spacing-${i})`,color:null})})}),e.text.forEach(({name:i})=>{s.push({label:`text-${i}`,css:`font-size: var(--text-${i})`,color:null})}),e.leading.forEach(({name:i})=>{s.push({label:`leading-${i}`,css:`line-height: var(--leading-${i})`,color:null})}),e.font.forEach(({name:i})=>{s.push({label:`font-${i}`,css:`font-family: var(--font-${i})`,color:null})}),e.radius.forEach(({name:i})=>{s.push({label:i==="DEFAULT"?"rounded":`rounded-${i}`,css:`border-radius: var(--radius-${i})`,color:null})});const r=new Map;return s.forEach(i=>{r.has(i.label)||r.set(i.label,i)}),{items:[...r.values()],byUtility:r}}function mt(t){return ot||(ot=t.fetch("/!/sve/tailwind-theme",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{css:""}).then(e=>Tt(typeof e.css=="string"?e.css:"")).catch(()=>Tt(""))),ot}function Ce(t){return!!(t.matchBefore(/class\s*=\s*"[^"]*$/i)||t.matchBefore(/class\s*=\s*'[^']*$/i))}function Te(t,e){const n=t.doc.lineAt(e),o=e-n.from,s=Se(n.text,o);if(!s)return null;const r=n.text.slice(s.valueFrom,s.valueTo),i=o-s.valueFrom,a=r.slice(0,i),l=r.slice(i),p=(a.match(/[^\s]*$/)||[""])[0],f=(l.match(/^[^\s]*/)||[""])[0],d=p+f;if(!d||d.includes("{"))return null;const m=n.from+s.valueFrom+(a.length-p.length);return{from:m,to:m+d.length,text:d}}function Se(t,e){const n=/\bclass\s*=\s*(["'])/gi;let o;for(;o=n.exec(t);){const s=o[1],r=o.index+o[0].length,i=t.indexOf(s,r),a=i===-1?t.length:i;if(e>=r&&e<=a)return{valueFrom:r,valueTo:a}}return null}function ht(t){const e=[...Ht].sort((i,a)=>a.length-i.length),n=[];let o=String(t||""),s=!0;for(;s;){s=!1;for(const i of e){const a=`${i}:`;if(o.startsWith(a)){n.push(i),o=o.slice(a.length),s=!0;break}}}let r=!1;return o.startsWith("!")?(r=!0,o=o.slice(1)):o.endsWith("!")&&(r=!0,o=o.slice(0,-1)),{variants:n,utility:o,important:r}}function Ee(t,e){const{variants:n,utility:o}=ht(t),s=n.length?`${n.join(":")}:`:"",r=o.toLowerCase(),i=[];return!r&&!s&&Ht.forEach(a=>{i.push({label:`${a}:`,type:"keyword",detail:"variant",boost:2})}),e.items.forEach(a=>{if(r&&!a.label.startsWith(r)&&!a.label.includes(r))return;const l=`${s}${a.label}`;i.push({label:l,type:"property",detail:a.css,boost:a.label.startsWith(r)?1:0})}),i.sort((a,l)=>(l.boost||0)-(a.boost||0)||a.label.localeCompare(l.label))}function Me(t,e){const{variants:n,utility:o,important:s}=ht(t),r=e.byUtility.get(o);if(!r)return"";let i=r.css;s&&(i+=" !important");const a=t.replace(/[^a-zA-Z0-9_-]/g,d=>`\\${d}`);let l="";const p=[];n.forEach(d=>{_t[d]?p.push(_t[d]):Ct[d]&&(l+=Ct[d])});let f=`.${a}${l} { ${i} }`;return p.slice().reverse().forEach(d=>{f=`@media ${d} {
  ${f}
}`}),f}function Le(t,e){const{utility:n}=ht(t);return e.byUtility.get(n)?.color||null}function Ae(t){const e=String(t||"").trim();return/^#([0-9a-fA-F]{3,8})$/.test(e)?e:null}function ze(t,e){const n=document.createElement("div");if(n.className="sve-tw-info",e){const s=document.createElement("span");s.className="sve-tw-swatch",s.style.background=e,n.appendChild(s)}const o=document.createElement("pre");return o.textContent=t,n.appendChild(o),n}function Ut(t,e,n){const o=String(t||"").slice(e,n),s=It(o),r=/(\sclass\s*=\s*)(["'])/i.exec(s);if(!r)return null;const i=r[2],a=r.index+r[1].length+1,l=s.indexOf(i,a);return l===-1?null:{from:e+a,to:e+l,quote:i,value:o.slice(a,l)}}function Be(t){const e=String(t||""),n=[];let o=0;for(;o<e.length;){if(/\s/.test(e[o])){o+=1;continue}let s=o,r=!1;for(;s<e.length;){if(e.startsWith("{{",s)){const i=e.indexOf("}}",s+2);r=!0,s=i===-1?e.length:i+2;continue}if(/\s/.test(e[s]))break;s+=1}n.push({text:e.slice(o,s),from:o,to:s,dynamic:r}),o=s}return n}function Oe(t){const e=String(t||""),n=[];let o=0,s=0;for(let i=0;i<e.length;i+=1){const a=e[i];a==="["||a==="("?o+=1:a==="]"||a===")"?o=Math.max(0,o-1):a===":"&&o===0&&(n.push(e.slice(s,i)),s=i+1)}const r=e.slice(s);return{variants:n,base:r}}function Pe(t){let n=String(t||""),o="";n.startsWith("!")?(o="pre",n=n.slice(1)):n.endsWith("!")&&(o="post",n=n.slice(0,-1));let s="";const r=Re(n);return r!==-1&&(s=n.slice(r),n=n.slice(0,r)),{name:n,modifier:s,important:o}}function Re(t){let e=0;for(let n=0;n<t.length;n+=1){const o=t[n];if(o==="["||o==="(")e+=1;else if(o==="]"||o===")")e=Math.max(0,e-1);else if(o==="/"&&e===0)return n}return-1}function ct({variants:t,name:e,modifier:n,important:o}){let s=`${e}${n||""}`;return o==="pre"?s=`!${s}`:o==="post"&&(s=`${s}!`),[...t||[],s].join(":")}function Zt(t){const e=Be(t),n=new Map;let o=null,s=0;const r=e.findIndex(a=>a.text==="]");if(e[0]?.text==="["&&r>0){const a=e.slice(1,r);o={from:e[0].from,to:e[r].to,label:`[ ${a.map(l=>l.text).join(" ")} ]`},s=r+1}for(;s<e.length;s+=1){const a=e[s],{variants:l,base:p}=Oe(a.text),{name:f,modifier:d,important:m}=Pe(p),E=l.join(":");n.has(E)||n.set(E,{key:E,variants:l,items:[]}),n.get(E).items.push({raw:a.text,from:a.from,to:a.to,dynamic:a.dynamic,variants:l,name:f,modifier:d,important:m})}const i=[...n.values()];return i.sort((a,l)=>a.key===""?-1:l.key===""?1:0),{scope:o,groups:i}}function ut(t,e,n){const o=String(t||"");if(n)return o.slice(0,e.from)+n+o.slice(e.to);let s=e.from,r=e.to;if(s>0&&(o[s-1]===" "||o[s-1]==="	"))for(;s>0&&(o[s-1]===" "||o[s-1]==="	");)s-=1;else for(;r<o.length&&(o[r]===" "||o[r]==="	");)r+=1;return Fe(o.slice(0,s)+o.slice(r),s)}function Fe(t,e){const n=t.lastIndexOf(`
`,Math.max(0,e-1));if(n===-1)return t;const o=t.indexOf(`
`,n+1);return t.slice(n+1,o===-1?t.length:o).trim()!==""?t:t.slice(0,n)+t.slice(o===-1?t.length:o)}function Kt(t,e){const n=String(t||"");return n.trim()?`${n.replace(/\s+$/,"")} ${e}`:e}function Ie(t,e,n){const o=Ut(t,e.from,e.openTo);if(o)return t.slice(0,o.from)+n+t.slice(o.to);const s=String(t).slice(e.from,e.openTo),r=/^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(s);if(!r||!n)return t;const i=e.from+r[0].length;return`${t.slice(0,i)} class="${n}"${t.slice(i)}`}const je=[...Object.keys(qt),...Object.keys(Nt),"text","leading","font","rounded"].sort((t,e)=>e.length-t.length);let st=null;function We(t){return st||(st=mt(t).then(De)),st}function Xt(t){const e=String(t||"");if(e.includes(";"))return"";const n=e.indexOf(":");return n===-1?"":e.slice(0,n).trim()}function De(t){const e=new Map,n=new Map,o=new Map;for(const s of t.items){const r=Xt(s.css);r&&(e.has(r)||e.set(r,[]),e.get(r).push(s),n.set(s.label,r));const i=Yt(s.label);i&&(o.has(i)||o.set(i,[]),o.get(i).push(s))}return{catalog:t,byProperty:e,propertyOfUtility:n,byPrefix:o}}function Yt(t){for(const e of je)if(String(t).startsWith(`${e}-`))return e;return""}function Gt(t,e){if(!e||!t)return null;const n=e.propertyOfUtility.get(t);if(n)return{label:n,options:e.byProperty.get(n)||[]};const o=Yt(t),s=o?e.byPrefix.get(o):null;return s?.length?{label:Xt(s[0].css)||o,options:s}:null}function Qt(t,e){return e?.catalog?.byUtility?.get(t)?.css||""}function He(t,e){return e?.catalog?.byUtility?.get(t)?.color||""}const u=fe({emptyText:"",tag:"",scope:"",scopeTitle:"",baseLabel:"",groups:[],canEdit:!1,onChip:null,variant:"",breakpoints:[],onBreakpoint:null,state:"",stateLabel:"",onState:null,siteClasses:[]}),C="__sve-tw-strip",St="__sve-tw-strip-style";let Et=null,D=null;function vt(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o}catch{}return null}function qe(t){if(t.getElementById(St))return;const e=t.createElement("style");e.id=St,e.textContent=`
    #${C} {
      position: fixed;
      z-index: 99998;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      max-width: 100%;
      padding: 0.25rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(255,255,255,.12);
      background: #252526;
      color: #d4d4d4;
      box-shadow: 0 0.4rem 1.2rem rgba(0,0,0,.35);
      font-size: 0.6875rem;
      overflow-x: auto;
      scrollbar-width: none;
    }
    #${C}::-webkit-scrollbar { display: none; }
    #${C} [data-sve-tw-strip-tag] {
      flex: 0 0 auto;
      padding: 0 0.35em 0 0.15em;
      opacity: .55;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    #${C} button {
      all: unset;
      flex: 0 0 auto;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 0.4em;
      padding: 0.25em 0.55em;
      border-radius: 0.4em;
      background: rgba(255,255,255,.1);
      cursor: pointer;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      line-height: 1.4;
      white-space: nowrap;
    }
    #${C} button:hover { background: rgba(255,255,255,.2); }
    #${C} button[data-locked] { cursor: default; opacity: .5; }
    #${C} button[data-locked]:hover { background: rgba(255,255,255,.1); }
    #${C} [data-add] {
      background: transparent;
      border: 1px solid rgba(255,255,255,.25);
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    #${C} [data-dot] {
      width: 0.8em;
      height: 0.8em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
  `,t.head.appendChild(e)}function Ne(t){const e=vt(t);return e?e.getBoundingClientRect():null}function Ve(t){t?.document.getElementById(C)?.remove()}function Ue(t){const e=()=>Ze(t);Et!==t&&(Et=t,t.addEventListener("resize",e),t.addEventListener("scroll",e,!0));const n=vt(t)?.contentWindow;if(n&&!n._sveStripBound)try{n._sveStripBound=!0,n.addEventListener("scroll",e,!0),n.addEventListener("resize",e),n.addEventListener("statamic:preview-updated",()=>{t.setTimeout(()=>Jt(t,D?.path||""),60)})}catch{}}function Ze(t){const e=t?.document.getElementById(C);!e||!D?.el?.isConnected||te(t,e,D.frame,D.el)}function Jt(t,e){if(!t)return;const n=t.document,o=vt(t),s=o?.contentDocument,r=e&&s?s.querySelector(`[data-sve-ht-path="${e}"]`):null;if(!r||!u.groups.length){Ve(t);return}qe(n),Ue(t);let i=n.getElementById(C);i||(i=n.createElement("div"),i.id=C,n.body.appendChild(i)),i.replaceChildren();const a=n.createElement("span");a.setAttribute("data-sve-tw-strip-tag",""),a.textContent=`<${u.tag}>`,i.appendChild(a);for(const p of u.groups)for(const f of p.chips){const d=n.createElement("button");if(d.type="button",d.title=f.title||"",f.locked&&d.setAttribute("data-locked",""),f.color){const m=n.createElement("span");m.setAttribute("data-dot",""),m.style.background=f.color,d.appendChild(m)}d.appendChild(n.createTextNode(f.raw)),f.locked||d.addEventListener("click",m=>{m.preventDefault(),m.stopPropagation(),u.onChip?.(m,f.id)}),i.appendChild(d)}const l=n.createElement("button");l.type="button",l.setAttribute("data-add",""),l.textContent="+",l.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation(),Pn(t,p.currentTarget)}),i.appendChild(l),D={frame:o,el:r,path:e},te(t,i,o,r)}function te(t,e,n,o){const s=n.getBoundingClientRect(),r=n.clientWidth?s.width/n.clientWidth:1,i=o.getBoundingClientRect(),a=e.getBoundingClientRect(),l=6,p=s.left+i.left*r,f=s.top+i.top*r-a.height-l,d=s.top+i.top*r+l;e.style.left=`${Math.max(l,Math.min(p,t.innerWidth-a.width-l))}px`,e.style.top=`${Math.max(s.top+l,f<s.top?d:f)}px`;const m=n.clientHeight||s.height;e.hidden=i.bottom<=0||i.top>=m}const Ke={class:"sve-tw"},Xe={key:0,class:"sve-tw-head"},Ye={class:"sve-tw-tag"},Ge=["title"],Qe=["title","data-active","disabled","onClick"],Je=["data-active","disabled"],tn={key:1,class:"sve-tw-empty"},en=["data-sve-tw-base","data-current"],nn={class:"sve-tw-chips"},on=["title","onClick"],sn={__name:"TwClassList",setup(t){function e(n){const o={"data-sve-tw-chip":n.id};return n.locked&&(o["data-sve-tw-locked"]=""),n.open&&(o["data-open"]=""),o}return(n,o)=>(y(),x("div",Ke,[$(u).tag?(y(),x("div",Xe,[b("span",Ye,"<"+_($(u).tag)+">",1),$(u).scope?(y(),x("span",{key:0,class:"sve-tw-scope",title:$(u).scopeTitle},_($(u).scope),9,Ge)):z("",!0),o[2]||(o[2]=b("span",{class:"sve-tw-gap"},null,-1)),(y(!0),x(O,null,W($(u).breakpoints,s=>(y(),x("button",{key:s.index,type:"button","data-sve-tw-bp":"",title:s.title,"data-active":s.active?"":void 0,disabled:!$(u).canEdit,onClick:T(r=>$(u).onBreakpoint?.(s.index),["prevent","stop"])},_(s.label),9,Qe))),128)),b("button",{type:"button","data-sve-tw-state":"","data-active":$(u).state?"":void 0,disabled:!$(u).canEdit,onClick:o[0]||(o[0]=T(s=>$(u).onState?.(s),["prevent","stop"]))},[lt(_($(u).stateLabel)+" ",1),o[1]||(o[1]=b("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[b("path",{d:"m6 9 6 6 6-6"})],-1))],8,Je)])):z("",!0),$(u).groups.length?z("",!0):(y(),x("div",tn,_($(u).emptyText),1)),(y(!0),x(O,null,W($(u).groups,s=>(y(),x("div",{key:s.key,class:"sve-tw-group"},[b("span",{class:"sve-tw-variant","data-sve-tw-base":s.key===""?"":void 0,"data-current":s.current?"":void 0},_(s.key===""?$(u).baseLabel:s.key),9,en),b("div",nn,[(y(!0),x(O,null,W(s.chips,r=>(y(),x("button",me({key:r.id,type:"button"},{ref_for:!0},e(r),{title:r.title,onClick:T(i=>$(u).onChip?.(i,r.id),["prevent","stop"])}),[r.color?(y(),x("span",{key:0,class:"sve-tw-dot",style:pt({background:r.color})},null,4)):z("",!0),lt(" "+_(r.raw),1)],16,on))),128))])]))),128))]))}},rn=pe(sn,[["__scopeId","data-v-33c4f5f2"]]),an={key:0,"data-sve-tw-menu-title":""},ln={"data-sve-tw-menu-list":""},cn=["data-active","title","onClick"],un={"data-sve-tw-tick":""},dn={"data-sve-tw-label":""},gt={__name:"TwClassMenu",props:{title:{type:String,default:""},options:{type:Array,default:()=>[]},removeLabel:{type:String,default:""},onPick:{type:Function,required:!0},onRemove:{type:Function,required:!0}},setup(t){return(e,n)=>(y(),x(O,null,[t.title?(y(),x("div",an,_(t.title),1)):z("",!0),b("div",ln,[(y(!0),x(O,null,W(t.options,o=>(y(),x("button",{key:o.label,type:"button","data-sve-tw-option":"","data-active":o.active?"":void 0,title:o.css,onClick:T(s=>t.onPick(o.label),["prevent","stop"])},[b("span",un,_(o.active?"✓":""),1),o.color?(y(),x("span",{key:0,"data-sve-tw-dot":"",style:pt({background:o.color})},null,4)):z("",!0),b("span",dn,_(o.label),1)],8,cn))),128))]),b("button",{type:"button","data-sve-tw-remove":"",onClick:n[0]||(n[0]=T(o=>t.onRemove(),["prevent","stop"]))},[n[1]||(n[1]=b("span",{"data-sve-tw-tick":""},"✕",-1)),lt(_(t.removeLabel),1)])],64))}},fn={"data-sve-tw-search":""},pn=["placeholder","aria-label","onKeydown"],mn={"data-sve-tw-tabs":""},hn=["data-active"],vn=["data-active"],gn={key:0,"data-sve-tw-add-empty":""},bn=["data-cursor","data-active","data-sve-tw-off","title","onMouseenter","onClick"],yn={"data-sve-tw-label":""},xn={__name:"TwAddClass",props:{label:{type:String,default:""},placeholder:{type:String,default:""},sitePlaceholder:{type:String,default:""},emptyText:{type:String,default:""},offText:{type:String,default:""},siteLabel:{type:String,default:""},tailwindLabel:{type:String,default:""},search:{type:Function,required:!0},onAdd:{type:Function,required:!0}},setup(t){const e=t,n=F(""),o=F(null),s=F("tailwind"),r=F(null),i=F(-1),a=F(!1),l=j(()=>n.value.trim().toLowerCase()),p=j(()=>(u.siteClasses||[]).flatMap(v=>v.items).filter(v=>!l.value||v.name.toLowerCase().includes(l.value))),f=j(()=>e.search(n.value)),d=j(()=>s.value==="site"?p.value:f.value),m=j(()=>s.value==="site"?e.sitePlaceholder:e.placeholder);he(()=>$t(()=>o.value?.focus()));function E(v){return v?.name||v?.label||""}function B(v){a.value=!0;const c=d.value.length;if(!c){i.value=-1;return}const h=i.value+v;i.value=h<0?-1:Math.min(h,c-1),$t(()=>V())}function V(){const v=r.value?.querySelector("[data-cursor]");if(!v)return;let c=v.parentElement;for(;c&&c.scrollHeight<=c.clientHeight;)c=c.parentElement;if(!c)return;const h=v.offsetTop,L=h+v.offsetHeight;h<c.scrollTop?c.scrollTop=h:L>c.scrollTop+c.clientHeight&&(c.scrollTop=L-c.clientHeight)}function P(v){a.value||(i.value=v)}function R(){i.value=-1}function et(){const v=i.value>=0?d.value[i.value]:null,c=v?E(v):n.value.trim();c&&e.onAdd(c)}return(v,c)=>(y(),x(O,null,[b("div",fn,[c[7]||(c[7]=b("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[b("circle",{cx:"11",cy:"11",r:"7"}),b("path",{d:"m20 20-3.5-3.5"})],-1)),ve(b("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":c[0]||(c[0]=h=>n.value=h),type:"text",placeholder:m.value,"aria-label":t.label,onInput:R,onKeydown:[c[1]||(c[1]=U(T(h=>B(1),["prevent"]),["down"])),c[2]||(c[2]=U(T(h=>B(-1),["prevent"]),["up"])),U(T(et,["prevent"]),["enter"]),c[3]||(c[3]=U(T(()=>{},["stop"]),["escape"]))]},null,40,pn),[[ge,n.value]])]),b("div",mn,[b("button",{type:"button","data-sve-tw-tab":"","data-active":s.value==="tailwind"?"":void 0,onClick:c[4]||(c[4]=T(h=>{s.value="tailwind",R()},["prevent","stop"]))},_(t.tailwindLabel),9,hn),b("button",{type:"button","data-sve-tw-tab":"","data-active":s.value==="site"?"":void 0,onClick:c[5]||(c[5]=T(h=>{s.value="site",R()},["prevent","stop"]))},_(t.siteLabel),9,vn)]),d.value.length?z("",!0):(y(),x("div",gn,_(t.emptyText),1)),b("div",{ref_key:"rowsEl",ref:r,onMousemove:c[6]||(c[6]=h=>a.value=!1)},[(y(!0),x(O,null,W(d.value,(h,L)=>(y(),x("button",{key:h.name||h.label,type:"button","data-sve-tw-option":"","data-cursor":L===i.value?"":void 0,"data-active":L===i.value?"":void 0,"data-sve-tw-off":h.loaded===!1?"":void 0,title:h.loaded===!1?t.offText:h.file||h.css,onMouseenter:nt=>P(L),onClick:T(nt=>t.onAdd(h.name||h.label),["prevent","stop"])},[h.color?(y(),x("span",{key:0,"data-sve-tw-dot":"",style:pt({background:h.color})},null,4)):z("",!0),b("span",yn,_(h.name||h.label),1)],40,bn))),128))],544)],64))}},g="__sve-tw-menu",Mt="--sve-tw-anchor",wn=typeof CSS<"u"&&CSS.supports?.("anchor-name: --x");let Z=null;const Lt="__sve-tw-style",bt=[{key:"",all:!0,device:"Responsive",label:"tw_size_all"},{key:"",device:"Laptop",label:"tw_size_base"},{key:"max-lg",device:"Tablet",word:"responsive_tablet",under:1024},{key:"max-md",device:"Mobile",word:"responsive_mobile",under:768}],At=["","dark","hover","focus","active","before","after"],ee={Mobile:"max-md",Tablet:"max-lg",Laptop:"",Desktop:""};let ne="",I="",Q=!1;function kn(){try{return ee[Rt(window,"sve-lp-device")]??""}catch{return""}}function yt(){return Q?ne:kn()}function oe(){return[yt(),I].filter(Boolean)}function xt(){return oe().join(":")}const $n=/^(max-)?(sm|md|lg|xl|2xl)$/;function _n(t){return String(t||"").split(":").find(e=>$n.test(e))||""}function se(){if(Q)return!0;try{return Object.prototype.hasOwnProperty.call(ee,Rt(window,"sve-lp-device"))}catch{return!1}}function Cn(t){if(!se())return!0;const e=_n(t);return e===yt()?!0:!bt.some(n=>n.key===e)}let k=null,X=new Map,M=null,rt=!1,Y="",dt=null;function re(t){return t?.querySelector?.('[data-sve-style="tw"] [data-sve-tw-host]')||null}function ie(t){if(t.getElementById(Lt))return;const e=t.createElement("style");e.id=Lt,e.textContent=`
    #${g} {
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
    #${g} [data-sve-tw-menu-title] {
      padding: 0.1em 0.2em 0.5em;
      opacity: .55;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.6875rem;
    }
    #${g} [data-sve-tw-option],
    #${g} [data-sve-tw-remove] {
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
    #${g} [data-sve-tw-option]:hover,
    #${g} [data-sve-tw-remove]:hover {
      background: rgba(255,255,255,.1);
    }
    #${g} [data-sve-tw-option][data-active] {
      background: rgba(255,255,255,.06);
    }
    #${g} [data-sve-tw-option][data-sve-tw-off] [data-sve-tw-label] {
      opacity: .45;
      text-decoration: line-through;
      text-decoration-thickness: 1px;
    }
    #${g} [data-sve-tw-tick] {
      flex: 0 0 auto;
      width: 0.9em;
      opacity: .7;
      font-family: ui-sans-serif, system-ui, sans-serif;
      line-height: 1;
    }
    #${g} [data-sve-tw-dot] {
      flex: 0 0 auto;
      width: 0.9em;
      height: 0.9em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
    #${g} [data-sve-tw-label] {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #${g} [data-sve-tw-remove] {
      margin-top: 0.3rem;
      border-top: 1px solid rgba(255,255,255,.14);
      border-radius: 0 0 0.4em 0.4em;
      padding-top: 0.6em;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    #${g} [data-sve-tw-search] {
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
    #${g} [data-sve-tw-search]:focus-within {
      border-color: rgba(147,197,253,.7);
    }
    #${g} [data-sve-tw-search] svg {
      flex: 0 0 auto;
      opacity: .5;
    }
    #${g} [data-sve-tw-add-input] {
      all: unset;
      flex: 1 1 auto;
      min-width: 0;
      color: inherit;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.75rem;
    }
    #${g} [data-sve-tw-tabs] {
      display: flex;
      gap: 0.2rem;
      margin-bottom: 0.45rem;
      padding: 0.15rem;
      border-radius: 0.45em;
      background: rgba(0,0,0,.28);
    }
    #${g} [data-sve-tw-tab] {
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
    #${g} [data-sve-tw-tab]:hover { opacity: 1; }
    #${g} [data-sve-tw-tab][data-active] {
      opacity: 1;
      background: rgba(255,255,255,.14);
    }
    #${g} [data-sve-tw-add-empty] {
      padding: 0.4em 0.5em;
      opacity: .55;
    }
  `,t.head.appendChild(e)}function ae(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e.contentDocument;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o.contentDocument}catch{}return null}function Tn(t,e,n){const o=ae(t);if(!(!o||!k?.path))for(const s of o.querySelectorAll(`[${we}="${k.path}"]`))try{e&&s.classList.remove(e),n&&s.classList.add(n)}catch{}}const it=new Map,Sn=/(^|-)color$|^fill$|^stroke$/;function wt(t){const e=String(t||""),n=e.slice(0,e.indexOf(":")).trim();return Sn.test(n)&&/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(e)?.[1]||""}function le(t,e){if(!e)return"";if(it.has(e))return it.get(e);const n=ae(t),o=n?.documentElement,s=n?.defaultView;if(!o||!s)return"";let r="",i=e;for(let a=0;a<6&&i;a+=1){try{r=s.getComputedStyle(o).getPropertyValue(i).trim()}catch{return""}if(!r)return"";if(i=wt(r),!i)break}return r&&!r.startsWith("var(")?(it.set(e,r),r):""}function En(t,e){return He(e,M)||le(t,wt(Qt(e,M)))}function S(t){const e=t?.document.getElementById(g);Z&&(Z.style.removeProperty("anchor-name"),Z=null),dt?.(),dt=null,Y="",e&&(e._sveApp?.unmount(),e.remove())}function zt(t,e,n){const o=e.getBoundingClientRect(),s=n.offsetWidth||176,r=8,i=140,a=e.closest?.("#__sve-tw-strip")?Ne(t):null,l=a?a.top:0,p=a?a.bottom:t.innerHeight,f=a?a.left:0,d=a?a.right:t.innerWidth,m=o.bottom+4,E=p-m-r,B=Math.max(i,Math.min(E,420));n.style.left=`${Math.max(f+r,Math.min(o.left,d-s-r))}px`,n.style.maxHeight=`${B}px`,n.style.top=`${E>=i?m:Math.max(l+r,p-r-B)}px`}function J(t,e,n,o){const s=t.document;S(t),ie(s);const r=s.createElement("div");r.id=g,s.body.appendChild(r),r._sveApp=ye(n,r,o);const i=wn&&!!e.closest?.("#__sve-tw-strip");i?(Z=e,e.style.setProperty("anchor-name",Mt),r.style.setProperty("position","absolute"),r.style.setProperty("position-anchor",Mt),r.style.setProperty("position-area","block-end span-inline-start"),r.style.setProperty("position-try-fallbacks","flip-block, flip-inline, flip-block flip-inline"),r.style.setProperty("margin","4px 0 0 0"),r.style.setProperty("max-height","20rem")):zt(t,e,r);const a=()=>{i||zt(t,e,r)},l=f=>{!r.contains(f.target)&&!e.contains(f.target)&&(S(t),q())},p=f=>{f.key==="Escape"&&(S(t),q())};return s.addEventListener("pointerdown",l,!0),s.addEventListener("keydown",p,!0),t.addEventListener("scroll",a,!0),t.addEventListener("resize",a),dt=()=>{s.removeEventListener("pointerdown",l,!0),s.removeEventListener("keydown",p,!0),t.removeEventListener("scroll",a,!0),t.removeEventListener("resize",a)},r}function ce(t,e,n){return(e||[]).map(o=>({label:o.label,css:o.css,color:o.color||le(t,wt(o.css)),active:o.label===n}))}function tt(){return!k||G("dock:is-locked")===!0}function N(){const t=G("dock:html");if(!k||typeof t!="string"||t[k.from]!=="<")return null;const e=Ut(t,k.from,k.openTo);return{html:t,value:e?e.value:""}}function Mn(t){if(!k?.path)return;const n=Dt($e(t),new Set).find(o=>o.path===k.path);n&&(k={from:n.from,openTo:n.openTo,path:n.path,tag:n.tag})}function H(t,e,n,o,s){const r=Ie(e,k,n);r!==e&&(Tn(t,o,s),G("dock:set-html",r),Mn(r),A(t))}function ft(t){return Gt(t,M)?.label||""}function ue(t){return Zt(t).groups.flatMap(e=>e.items)}function de(t){const e=xt();return ue(t).filter(n=>!n.dynamic&&n.variants.join(":")===e)}function Bt(t,e){if(tt()||!e)return;const n=N();if(!n)return;const o=ft(e),s=de(n.value).find(i=>i.name===e||o&&ft(i.name)===o);if(s?.name===e){H(t,n.html,ut(n.value,s,""),e,"");return}if(s){const i=ct({variants:s.variants,name:e,modifier:s.modifier,important:s.important});H(t,n.html,ut(n.value,s,i),s.raw,i);return}const r=ct({variants:oe(),name:e,modifier:"",important:""});H(t,n.html,Kt(n.value,r),"",r)}function Ln(t,e){const n=String(e||"").trim(),o=xt(),s=o&&!n.includes(":")?`${o}:${n}`:n;if(tt()||!n)return;const r=N();!r||ue(r.value).some(a=>a.raw===s)||H(t,r.html,Kt(r.value,s),"",s.includes(":")?"":s)}function Ot(t,e,n){if(tt())return;const o=N();if(!o||o.value.slice(e.from,e.to)!==e.raw){A(t);return}const s=n?ct({variants:e.variants,name:n,modifier:e.modifier,important:e.important}):"";H(t,o.html,ut(o.value,e,s),e.raw,s)}function qn(){return!!k}function An(t,e){const n=bt[e];n&&(G("lp:set-device",{win:t,key:n.device}),Q=!n.all,ne=n.key,S(t),A(t),K("tw:changed"))}function zn(t,e){J(t,e,gt,{title:w(t,"tw_state"),removeLabel:w(t,"tw_state_none"),options:At.filter(Boolean).map(n=>({label:n,css:"",color:null,active:n===I})),onPick:n=>{I=At.includes(n)?n:"",S(t),A(t),K("tw:changed")},onRemove:()=>{I="",S(t),A(t),K("tw:changed")}})}xe("lp:device",()=>{Q=!1,re(window.document)&&A(window)});function Bn(t){const e=t?N():null;return e&&de(e.value).find(n=>ft(n.name)===t)?.name||""}function Nn(t,e,n,o){const s=M?.byProperty.get(n)||[];if(!s.length)return;const r=Bn(n);J(t,e,gt,{title:n,removeLabel:w(t,"tw_classes_remove"),options:ce(t,s,r),onPick:i=>{Bt(t,i),S(t),o?.(i)},onRemove:()=>{r&&Bt(t,r),S(t),o?.("")}})}let Pt=[],at=!1;function On(t){at||(at=!0,t.fetch("/!/sve/site-css/classes",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{groups:[]}).then(e=>{Pt=Array.isArray(e?.groups)?e.groups:[],u.siteClasses=Pt}).catch(()=>{at=!1}))}function Pn(t,e){On(t),J(t,e,xn,{label:w(t,"tw_add_class"),placeholder:w(t,"tw_add_placeholder"),emptyText:w(t,"tw_add_empty"),offText:w(t,"tw_class_not_imported"),sitePlaceholder:w(t,"tw_add_placeholder_site"),siteLabel:w(t,"tw_add_site"),tailwindLabel:w(t,"tw_add_tailwind"),search:n=>{const o=String(n||"").trim().toLowerCase();if(!o||!M)return[];const s=M.catalog.items.filter(r=>r.label.toLowerCase().includes(o));return s.sort((r,i)=>{const a=r.label.toLowerCase().startsWith(o)?0:1,l=i.label.toLowerCase().startsWith(o)?0:1;return a-l||r.label.length-i.label.length}),s.slice(0,40).map(r=>({label:r.label,css:r.css,color:r.color,active:!1}))},onAdd:n=>{Ln(t,n)}})}function Rn(t,e,n){const o=X.get(n);if(!o||o.locked)return;if(Y===n){S(t),q();return}const s=Gt(o.name,M);J(t,e.currentTarget,gt,{title:s?.label||"",removeLabel:w(t,"tw_classes_remove"),options:ce(t,s?.options,o.name),onPick:r=>{Ot(t,o,r),S(t)},onRemove:()=>{Ot(t,o,""),S(t)}}),Y=n,q()}function q(){for(const t of u.groups)for(const e of t.chips)e.open=e.id===Y}function Vn(t,e){if(!e||e.from==null||e.openTo==null){k=null,X=new Map,S(t),A(t);return}k={from:e.from,openTo:e.openTo,path:e.path,tag:e.tag},A(t)}function A(t){Fn(t);const e=k?N():null,n=e?Zt(e.value):{scope:null,groups:[]};X=new Map,u.baseLabel=w(t,"tw_size_base"),u.scopeTitle=w(t,"tw_classes_scope"),u.variant=xt(),u.onBreakpoint=r=>An(t,r),u.onState=r=>zn(t,r.currentTarget);const o=se();u.breakpoints=bt.map((r,i)=>({index:i,label:r.word?`${r.key}`:w(t,r.label),title:r.word?`${w(t,r.word)}  ·  < ${r.under}px`:w(t,r.all?"tw_size_all_title":"tw_size_base_title"),active:r.all?!o:o&&r.key===yt()})),u.state=I,u.stateLabel=I||w(t,"tw_state"),u.canEdit=!tt(),u.onChip=(r,i)=>Rn(t,r,i),u.tag=k?.tag||"",u.scope=n.scope?.label||"",u.emptyText=w(t,k?n.groups.length?"tw_classes_none_size":"tw_classes_none":"tw_classes_pick"),u.groups=n.groups.filter(r=>Cn(r.key)).map(r=>({key:r.key,current:r.key===u.variant,chips:r.items.map((i,a)=>{const l={...i,id:`${r.key}-${a}-${i.from}`,locked:i.dynamic||!u.canEdit,open:!1,color:i.dynamic?"":En(t,i.name),title:i.dynamic?w(t,"tw_classes_dynamic"):Qt(i.name,M)||i.raw};return X.set(l.id,l),l})}));const s=re(t.document);s&&(ie(t.document),be(s,rn)),q(),Jt(t,k?.path||""),K("tw:changed")}function Fn(t){M||rt||(rt=!0,We(t).then(e=>{M=e,A(t)}).catch(()=>{rt=!1}))}export{Dn as a,Hn as b,S as c,Bn as d,Nn as e,Dt as f,Pn as g,Bt as h,Wn as i,qn as j,$e as p,Vn as r,Vt as t};
