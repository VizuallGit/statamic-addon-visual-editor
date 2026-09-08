import{r as ce,_ as ue,o as y,c as x,u as $,a as b,t as _,d as z,F as B,e as j,f as T,I as it,m as de,n as ft,Q as I,H as P,T as fe,a2 as wt,K as pe,w as U,L as me,j as w,i as he,a9 as Z,M as Y,l as ve,a8 as Bt,N as ge}from"./addon-BOW82e2s.js";import{H as be}from"./html-pick-align-gkRPeJkt.js";const Ot=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function Ft(t){return String(t||"").replace(/\{\{[\s\S]*?\}\}/g,e=>" ".repeat(e.length))}function ye(t){const e=t.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(!e)return"";const n=e[2].match(/\[\s*([\s\S]*?)\s*\]/);if(n){const o=n[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).find(s=>/^[a-zA-Z_][\w-]*$/.test(s));if(o)return o}return(e[2].trim().split(/\s+/)[0]||"").replace(/\[|\]/g,"")}function It(t,e,n,o){t.hidden=!0,o&&(t.wrapFrom=e,t.wrapTo=n);for(const s of t.children)It(s,e,n,!1)}function Rt(t,e,n,o){const s=[],r=[];let a=n,i=0;const l=f=>{r.length?r[r.length-1].children.push(f):s.push(f)};for(;a<o;){if(e[a]!=="<"){a+=1;continue}if(e.startsWith("<!--",a)){const c=e.indexOf("-->",a+4),p=c===-1||c>o?o:c,M=c===-1||c+3>o?o:c+3,et=Rt(t,e,a+4,p);for(const xt of et)It(xt,a,M,!0),l(xt);a=M;continue}if(e.startsWith("<!",a)||e.startsWith("<?",a)){const c=e.indexOf(">",a+2);a=c===-1||c+1>o?o:c+1;continue}const f=e[a+1]==="/",h=e.slice(a,o).match(/^<\/?([a-zA-Z][a-zA-Z0-9:-]*)/);if(!h){a+=1;continue}const d=h[1].toLowerCase(),m=e.indexOf(">",a);if(m===-1||m>=o)break;const A=e.slice(a,m+1),q=!f&&(Ot.has(d)||/\/\s*>$/.test(A));if(f){for(let c=r.length-1;c>=0;c-=1)if(r[c].tag===d){r[c].to=m+1,r.length=c;break}a=m+1;continue}const V=ye(t.slice(a,m+1)),O=r.length?r[r.length-1]:null,F=O?O.children:s,tt=O?`${O.path}/${F.length}:${d}`:`${F.length}:${d}`,v={id:`${d}-${a}-${i}`,tag:d,klass:V,path:tt,label:V,from:a,to:m+1,openTo:m+1,hidden:!1,children:[]};i+=1,l(v),q?v.to=m+1:r.push(v),a=m+1}for(;r.length;)r.pop().to=o;return s}function xe(t){const e=String(t||""),n=Ft(e);return Rt(e,n,0,n.length)}function Pt(t,e,n=0,o=[]){for(const s of t){const r=s.children.length>0,a=e.has(s.id);o.push({id:s.id,tag:s.tag,klass:s.klass||"",path:s.path,label:s.label,from:s.from,to:s.to,openTo:s.openTo,hidden:!!s.hidden,wrapFrom:s.wrapFrom,wrapTo:s.wrapTo,depth:n,hasChildren:r,shut:a}),r&&!a&&Pt(s.children,e,n+1,o)}return o}function In(t){return Ot.has(String(t||"").toLowerCase())}const jt=["sm","md","lg","xl","2xl","max-sm","max-md","max-lg","max-xl","max-2xl","dark","hover","focus","focus-visible","active","disabled","group-hover"],kt={sm:"(min-width: 640px)",md:"(min-width: 768px)",lg:"(min-width: 1024px)",xl:"(min-width: 1280px)","2xl":"(min-width: 1536px)","max-sm":"(max-width: 639px)","max-md":"(max-width: 767px)","max-lg":"(max-width: 1023px)","max-xl":"(max-width: 1279px)","max-2xl":"(max-width: 1535px)",dark:"(prefers-color-scheme: dark)"},$t={hover:":hover",focus:":focus","focus-visible":":focus-visible",active:":active",disabled:":disabled","group-hover":":is(:where(.group):hover *)"},we={relative:"position: relative",absolute:"position: absolute",fixed:"position: fixed",sticky:"position: sticky",static:"position: static",block:"display: block",inline:"display: inline","inline-block":"display: inline-block",flex:"display: flex","inline-flex":"display: inline-flex",grid:"display: grid",hidden:"display: none","flex-row":"flex-direction: row","flex-col":"flex-direction: column","flex-wrap":"flex-wrap: wrap","items-start":"align-items: flex-start","items-center":"align-items: center","items-end":"align-items: flex-end","items-stretch":"align-items: stretch","justify-start":"justify-content: flex-start","justify-center":"justify-content: center","justify-end":"justify-content: flex-end","justify-between":"justify-content: space-between","justify-around":"justify-content: space-around","text-left":"text-align: left","text-center":"text-align: center","text-right":"text-align: right","w-full":"width: 100%","h-full":"height: 100%","w-screen":"width: 100vw","h-screen":"height: 100vh","overflow-hidden":"overflow: hidden","overflow-auto":"overflow: auto","pointer-events-none":"pointer-events: none",underline:"text-decoration-line: underline",italic:"font-style: italic","font-bold":"font-weight: 700","font-medium":"font-weight: 500",uppercase:"text-transform: uppercase",truncate:"overflow: hidden; text-overflow: ellipsis; white-space: nowrap","z-10":"z-index: 10","z-20":"z-index: 20","z-50":"z-index: 50"},Wt={p:"padding",px:"padding-inline",py:"padding-block",pt:"padding-top",pr:"padding-right",pb:"padding-bottom",pl:"padding-left",m:"margin",mx:"margin-inline",my:"margin-block",mt:"margin-top",mr:"margin-right",mb:"margin-bottom",ml:"margin-left",gap:"gap","gap-x":"column-gap","gap-y":"row-gap",w:"width",h:"height","min-w":"min-width","min-h":"min-height","max-w":"max-width","max-h":"max-height"},Dt={bg:"background-color",border:"border-color",outline:"outline-color",fill:"fill",stroke:"stroke"};let nt=null;function Ht(t){return t?.Statamic?.$config?.get?.("sveFeatures")?.tailwind_dock===!0}function Rn(t){return e=>{if(!Ht(t)||!ke(e))return null;const n=e.matchBefore(/[^\s"']*$/),o=n?.text??"";return o.includes("{")||o.includes("}")?null:pt(t).then(s=>{const r=Ce(o,s).slice(0,80);return r.length?{from:n?n.from:e.pos,options:r,validFor:/^[^\s"'=]*$/}:null})}}function Pn(t,e){return t((n,o)=>{if(!Ht(e))return null;const s=$e(n.state,o);return s?pt(e).then(r=>{const a=Te(s.text,r);return a?{pos:s.from,end:s.to,create(){return{dom:Me(a,Se(s.text,r))}}}:null}):null})}function _t(t){const e={color:[],spacing:[],text:[],leading:[],font:[],radius:[]},n=/--(color|spacing|text|leading|font|radius)-([a-zA-Z0-9][a-zA-Z0-9._-]*)\s*:\s*([^;]+);/g;let o;for(;o=n.exec(String(t||""));)o[2]!=="*"&&e[o[1]].push({name:o[2],value:o[3].trim()});const s=[];Object.entries(we).forEach(([a,i])=>{s.push({label:a,css:i,color:null})}),e.color.forEach(({name:a,value:i})=>{const l=Ee(i);Object.entries(Dt).forEach(([f,h])=>{s.push({label:`${f}-${a}`,css:`${h}: var(--color-${a})`,color:l})}),s.push({label:`text-${a}`,css:`color: var(--color-${a})`,color:l})}),e.spacing.forEach(({name:a})=>{Object.entries(Wt).forEach(([i,l])=>{s.push({label:`${i}-${a}`,css:`${l}: var(--spacing-${a})`,color:null})})}),e.text.forEach(({name:a})=>{s.push({label:`text-${a}`,css:`font-size: var(--text-${a})`,color:null})}),e.leading.forEach(({name:a})=>{s.push({label:`leading-${a}`,css:`line-height: var(--leading-${a})`,color:null})}),e.font.forEach(({name:a})=>{s.push({label:`font-${a}`,css:`font-family: var(--font-${a})`,color:null})}),e.radius.forEach(({name:a})=>{s.push({label:a==="DEFAULT"?"rounded":`rounded-${a}`,css:`border-radius: var(--radius-${a})`,color:null})});const r=new Map;return s.forEach(a=>{r.has(a.label)||r.set(a.label,a)}),{items:[...r.values()],byUtility:r}}function pt(t){return nt||(nt=t.fetch("/!/sve/tailwind-theme",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{css:""}).then(e=>_t(typeof e.css=="string"?e.css:"")).catch(()=>_t(""))),nt}function ke(t){return!!(t.matchBefore(/class\s*=\s*"[^"]*$/i)||t.matchBefore(/class\s*=\s*'[^']*$/i))}function $e(t,e){const n=t.doc.lineAt(e),o=e-n.from,s=_e(n.text,o);if(!s)return null;const r=n.text.slice(s.valueFrom,s.valueTo),a=o-s.valueFrom,i=r.slice(0,a),l=r.slice(a),f=(i.match(/[^\s]*$/)||[""])[0],h=(l.match(/^[^\s]*/)||[""])[0],d=f+h;if(!d||d.includes("{"))return null;const m=n.from+s.valueFrom+(i.length-f.length);return{from:m,to:m+d.length,text:d}}function _e(t,e){const n=/\bclass\s*=\s*(["'])/gi;let o;for(;o=n.exec(t);){const s=o[1],r=o.index+o[0].length,a=t.indexOf(s,r),i=a===-1?t.length:a;if(e>=r&&e<=i)return{valueFrom:r,valueTo:i}}return null}function mt(t){const e=[...jt].sort((a,i)=>i.length-a.length),n=[];let o=String(t||""),s=!0;for(;s;){s=!1;for(const a of e){const i=`${a}:`;if(o.startsWith(i)){n.push(a),o=o.slice(i.length),s=!0;break}}}let r=!1;return o.startsWith("!")?(r=!0,o=o.slice(1)):o.endsWith("!")&&(r=!0,o=o.slice(0,-1)),{variants:n,utility:o,important:r}}function Ce(t,e){const{variants:n,utility:o}=mt(t),s=n.length?`${n.join(":")}:`:"",r=o.toLowerCase(),a=[];return!r&&!s&&jt.forEach(i=>{a.push({label:`${i}:`,type:"keyword",detail:"variant",boost:2})}),e.items.forEach(i=>{if(r&&!i.label.startsWith(r)&&!i.label.includes(r))return;const l=`${s}${i.label}`;a.push({label:l,type:"property",detail:i.css,boost:i.label.startsWith(r)?1:0})}),a.sort((i,l)=>(l.boost||0)-(i.boost||0)||i.label.localeCompare(l.label))}function Te(t,e){const{variants:n,utility:o,important:s}=mt(t),r=e.byUtility.get(o);if(!r)return"";let a=r.css;s&&(a+=" !important");const i=t.replace(/[^a-zA-Z0-9_-]/g,d=>`\\${d}`);let l="";const f=[];n.forEach(d=>{kt[d]?f.push(kt[d]):$t[d]&&(l+=$t[d])});let h=`.${i}${l} { ${a} }`;return f.slice().reverse().forEach(d=>{h=`@media ${d} {
  ${h}
}`}),h}function Se(t,e){const{utility:n}=mt(t);return e.byUtility.get(n)?.color||null}function Ee(t){const e=String(t||"").trim();return/^#([0-9a-fA-F]{3,8})$/.test(e)?e:null}function Me(t,e){const n=document.createElement("div");if(n.className="sve-tw-info",e){const s=document.createElement("span");s.className="sve-tw-swatch",s.style.background=e,n.appendChild(s)}const o=document.createElement("pre");return o.textContent=t,n.appendChild(o),n}function qt(t,e,n){const o=String(t||"").slice(e,n),s=Ft(o),r=/(\sclass\s*=\s*)(["'])/i.exec(s);if(!r)return null;const a=r[2],i=r.index+r[1].length+1,l=s.indexOf(a,i);return l===-1?null:{from:e+i,to:e+l,quote:a,value:o.slice(i,l)}}function Le(t){const e=String(t||""),n=[];let o=0;for(;o<e.length;){if(/\s/.test(e[o])){o+=1;continue}let s=o,r=!1;for(;s<e.length;){if(e.startsWith("{{",s)){const a=e.indexOf("}}",s+2);r=!0,s=a===-1?e.length:a+2;continue}if(/\s/.test(e[s]))break;s+=1}n.push({text:e.slice(o,s),from:o,to:s,dynamic:r}),o=s}return n}function Ae(t){const e=String(t||""),n=[];let o=0,s=0;for(let a=0;a<e.length;a+=1){const i=e[a];i==="["||i==="("?o+=1:i==="]"||i===")"?o=Math.max(0,o-1):i===":"&&o===0&&(n.push(e.slice(s,a)),s=a+1)}const r=e.slice(s);return{variants:n,base:r}}function ze(t){let n=String(t||""),o="";n.startsWith("!")?(o="pre",n=n.slice(1)):n.endsWith("!")&&(o="post",n=n.slice(0,-1));let s="";const r=Be(n);return r!==-1&&(s=n.slice(r),n=n.slice(0,r)),{name:n,modifier:s,important:o}}function Be(t){let e=0;for(let n=0;n<t.length;n+=1){const o=t[n];if(o==="["||o==="(")e+=1;else if(o==="]"||o===")")e=Math.max(0,e-1);else if(o==="/"&&e===0)return n}return-1}function lt({variants:t,name:e,modifier:n,important:o}){let s=`${e}${n||""}`;return o==="pre"?s=`!${s}`:o==="post"&&(s=`${s}!`),[...t||[],s].join(":")}function Vt(t){const e=Le(t),n=new Map;let o=null,s=0;const r=e.findIndex(i=>i.text==="]");if(e[0]?.text==="["&&r>0){const i=e.slice(1,r);o={from:e[0].from,to:e[r].to,label:`[ ${i.map(l=>l.text).join(" ")} ]`},s=r+1}for(;s<e.length;s+=1){const i=e[s],{variants:l,base:f}=Ae(i.text),{name:h,modifier:d,important:m}=ze(f),A=l.join(":");n.has(A)||n.set(A,{key:A,variants:l,items:[]}),n.get(A).items.push({raw:i.text,from:i.from,to:i.to,dynamic:i.dynamic,variants:l,name:h,modifier:d,important:m})}const a=[...n.values()];return a.sort((i,l)=>i.key===""?-1:l.key===""?1:0),{scope:o,groups:a}}function ct(t,e,n){const o=String(t||"");if(n)return o.slice(0,e.from)+n+o.slice(e.to);let s=e.from,r=e.to;if(s>0&&(o[s-1]===" "||o[s-1]==="	"))for(;s>0&&(o[s-1]===" "||o[s-1]==="	");)s-=1;else for(;r<o.length&&(o[r]===" "||o[r]==="	");)r+=1;return Oe(o.slice(0,s)+o.slice(r),s)}function Oe(t,e){const n=t.lastIndexOf(`
`,Math.max(0,e-1));if(n===-1)return t;const o=t.indexOf(`
`,n+1);return t.slice(n+1,o===-1?t.length:o).trim()!==""?t:t.slice(0,n)+t.slice(o===-1?t.length:o)}function Ut(t,e){const n=String(t||"");return n.trim()?`${n.replace(/\s+$/,"")} ${e}`:e}function Fe(t,e,n){const o=qt(t,e.from,e.openTo);if(o)return t.slice(0,o.from)+n+t.slice(o.to);const s=String(t).slice(e.from,e.openTo),r=/^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(s);if(!r||!n)return t;const a=e.from+r[0].length;return`${t.slice(0,a)} class="${n}"${t.slice(a)}`}const Ie=[...Object.keys(Wt),...Object.keys(Dt),"text","leading","font","rounded"].sort((t,e)=>e.length-t.length);let ot=null;function Re(t){return ot||(ot=pt(t).then(Pe)),ot}function Nt(t){const e=String(t||"");if(e.includes(";"))return"";const n=e.indexOf(":");return n===-1?"":e.slice(0,n).trim()}function Pe(t){const e=new Map,n=new Map,o=new Map;for(const s of t.items){const r=Nt(s.css);r&&(e.has(r)||e.set(r,[]),e.get(r).push(s),n.set(s.label,r));const a=Zt(s.label);a&&(o.has(a)||o.set(a,[]),o.get(a).push(s))}return{catalog:t,byProperty:e,propertyOfUtility:n,byPrefix:o}}function Zt(t){for(const e of Ie)if(String(t).startsWith(`${e}-`))return e;return""}function Kt(t,e){if(!e||!t)return null;const n=e.propertyOfUtility.get(t);if(n)return{label:n,options:e.byProperty.get(n)||[]};const o=Zt(t),s=o?e.byPrefix.get(o):null;return s?.length?{label:Nt(s[0].css)||o,options:s}:null}function Xt(t,e){return e?.catalog?.byUtility?.get(t)?.css||""}function je(t,e){return e?.catalog?.byUtility?.get(t)?.color||""}const u=ce({emptyText:"",tag:"",scope:"",scopeTitle:"",baseLabel:"",groups:[],canEdit:!1,onChip:null,variant:"",breakpoints:[],onBreakpoint:null,state:"",stateLabel:"",onState:null,siteClasses:[]}),C="__sve-tw-strip",Ct="__sve-tw-strip-style";let Tt=null,N=null;function Yt(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o}catch{}return null}function We(t){if(t.getElementById(Ct))return;const e=t.createElement("style");e.id=Ct,e.textContent=`
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
  `,t.head.appendChild(e)}function De(t){t?.document.getElementById(C)?.remove()}function He(t){const e=()=>qe(t);Tt!==t&&(Tt=t,t.addEventListener("resize",e),t.addEventListener("scroll",e,!0));const n=Yt(t)?.contentWindow;if(n&&!n._sveStripBound)try{n._sveStripBound=!0,n.addEventListener("scroll",e,!0),n.addEventListener("resize",e)}catch{}}function qe(t){const e=t?.document.getElementById(C);!e||!N?.el?.isConnected||Gt(t,e,N.frame,N.el)}function Ve(t,e){if(!t)return;const n=t.document,o=Yt(t),s=o?.contentDocument,r=e&&s?s.querySelector(`[data-sve-ht-path="${e}"]`):null;if(!r||!u.groups.length){De(t);return}We(n),He(t);let a=n.getElementById(C);a||(a=n.createElement("div"),a.id=C,n.body.appendChild(a)),a.replaceChildren();const i=n.createElement("span");i.setAttribute("data-sve-tw-strip-tag",""),i.textContent=`<${u.tag}>`,a.appendChild(i);for(const f of u.groups)for(const h of f.chips){const d=n.createElement("button");if(d.type="button",d.title=h.title||"",h.locked&&d.setAttribute("data-locked",""),h.color){const m=n.createElement("span");m.setAttribute("data-dot",""),m.style.background=h.color,d.appendChild(m)}d.appendChild(n.createTextNode(h.raw)),h.locked||d.addEventListener("click",m=>{m.preventDefault(),m.stopPropagation(),u.onChip?.(m,h.id)}),a.appendChild(d)}const l=n.createElement("button");l.type="button",l.setAttribute("data-add",""),l.textContent="+",l.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),An(t,f.currentTarget)}),a.appendChild(l),N={frame:o,el:r},Gt(t,a,o,r)}function Gt(t,e,n,o){const s=n.getBoundingClientRect(),r=n.clientWidth?s.width/n.clientWidth:1,a=o.getBoundingClientRect(),i=e.getBoundingClientRect(),l=6,f=s.left+a.left*r,h=s.top+a.top*r-i.height-l,d=s.top+a.top*r+l;e.style.left=`${Math.max(l,Math.min(f,t.innerWidth-i.width-l))}px`,e.style.top=`${Math.max(s.top+l,h<s.top?d:h)}px`;const m=n.clientHeight||s.height;e.hidden=a.bottom<=0||a.top>=m}const Ue={class:"sve-tw"},Ne={key:0,class:"sve-tw-head"},Ze={class:"sve-tw-tag"},Ke=["title"],Xe=["title","data-active","disabled","onClick"],Ye=["data-active","disabled"],Ge={key:1,class:"sve-tw-empty"},Qe=["data-sve-tw-base","data-current"],Je={class:"sve-tw-chips"},tn=["title","onClick"],en={__name:"TwClassList",setup(t){function e(n){const o={"data-sve-tw-chip":n.id};return n.locked&&(o["data-sve-tw-locked"]=""),n.open&&(o["data-open"]=""),o}return(n,o)=>(y(),x("div",Ue,[$(u).tag?(y(),x("div",Ne,[b("span",Ze,"<"+_($(u).tag)+">",1),$(u).scope?(y(),x("span",{key:0,class:"sve-tw-scope",title:$(u).scopeTitle},_($(u).scope),9,Ke)):z("",!0),o[2]||(o[2]=b("span",{class:"sve-tw-gap"},null,-1)),(y(!0),x(B,null,j($(u).breakpoints,s=>(y(),x("button",{key:s.index,type:"button","data-sve-tw-bp":"",title:s.title,"data-active":s.active?"":void 0,disabled:!$(u).canEdit,onClick:T(r=>$(u).onBreakpoint?.(s.index),["prevent","stop"])},_(s.label),9,Xe))),128)),b("button",{type:"button","data-sve-tw-state":"","data-active":$(u).state?"":void 0,disabled:!$(u).canEdit,onClick:o[0]||(o[0]=T(s=>$(u).onState?.(s),["prevent","stop"]))},[it(_($(u).stateLabel)+" ",1),o[1]||(o[1]=b("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[b("path",{d:"m6 9 6 6 6-6"})],-1))],8,Ye)])):z("",!0),$(u).groups.length?z("",!0):(y(),x("div",Ge,_($(u).emptyText),1)),(y(!0),x(B,null,j($(u).groups,s=>(y(),x("div",{key:s.key,class:"sve-tw-group"},[b("span",{class:"sve-tw-variant","data-sve-tw-base":s.key===""?"":void 0,"data-current":s.current?"":void 0},_(s.key===""?$(u).baseLabel:s.key),9,Qe),b("div",Je,[(y(!0),x(B,null,j(s.chips,r=>(y(),x("button",de({key:r.id,type:"button"},{ref_for:!0},e(r),{title:r.title,onClick:T(a=>$(u).onChip?.(a,r.id),["prevent","stop"])}),[r.color?(y(),x("span",{key:0,class:"sve-tw-dot",style:ft({background:r.color})},null,4)):z("",!0),it(" "+_(r.raw),1)],16,tn))),128))])]))),128))]))}},nn=ue(en,[["__scopeId","data-v-33c4f5f2"]]),on={key:0,"data-sve-tw-menu-title":""},sn={"data-sve-tw-menu-list":""},rn=["data-active","title","onClick"],an={"data-sve-tw-tick":""},ln={"data-sve-tw-label":""},ht={__name:"TwClassMenu",props:{title:{type:String,default:""},options:{type:Array,default:()=>[]},removeLabel:{type:String,default:""},onPick:{type:Function,required:!0},onRemove:{type:Function,required:!0}},setup(t){return(e,n)=>(y(),x(B,null,[t.title?(y(),x("div",on,_(t.title),1)):z("",!0),b("div",sn,[(y(!0),x(B,null,j(t.options,o=>(y(),x("button",{key:o.label,type:"button","data-sve-tw-option":"","data-active":o.active?"":void 0,title:o.css,onClick:T(s=>t.onPick(o.label),["prevent","stop"])},[b("span",an,_(o.active?"✓":""),1),o.color?(y(),x("span",{key:0,"data-sve-tw-dot":"",style:ft({background:o.color})},null,4)):z("",!0),b("span",ln,_(o.label),1)],8,rn))),128))]),b("button",{type:"button","data-sve-tw-remove":"",onClick:n[0]||(n[0]=T(o=>t.onRemove(),["prevent","stop"]))},[n[1]||(n[1]=b("span",{"data-sve-tw-tick":""},"✕",-1)),it(_(t.removeLabel),1)])],64))}},cn={"data-sve-tw-search":""},un=["placeholder","aria-label","onKeydown"],dn={"data-sve-tw-tabs":""},fn=["data-active"],pn=["data-active"],mn={key:0,"data-sve-tw-add-empty":""},hn=["data-cursor","data-active","data-sve-tw-off","title","onMouseenter","onClick"],vn={"data-sve-tw-label":""},gn={__name:"TwAddClass",props:{label:{type:String,default:""},placeholder:{type:String,default:""},sitePlaceholder:{type:String,default:""},emptyText:{type:String,default:""},offText:{type:String,default:""},siteLabel:{type:String,default:""},tailwindLabel:{type:String,default:""},search:{type:Function,required:!0},onAdd:{type:Function,required:!0}},setup(t){const e=t,n=I(""),o=I(null),s=I("tailwind"),r=I(null),a=I(-1),i=I(!1),l=P(()=>n.value.trim().toLowerCase()),f=P(()=>(u.siteClasses||[]).flatMap(v=>v.items).filter(v=>!l.value||v.name.toLowerCase().includes(l.value))),h=P(()=>e.search(n.value)),d=P(()=>s.value==="site"?f.value:h.value),m=P(()=>s.value==="site"?e.sitePlaceholder:e.placeholder);fe(()=>wt(()=>o.value?.focus()));function A(v){return v?.name||v?.label||""}function q(v){i.value=!0;const c=d.value.length;if(!c){a.value=-1;return}const p=a.value+v;a.value=p<0?-1:Math.min(p,c-1),wt(()=>V())}function V(){const v=r.value?.querySelector("[data-cursor]");if(!v)return;let c=v.parentElement;for(;c&&c.scrollHeight<=c.clientHeight;)c=c.parentElement;if(!c)return;const p=v.offsetTop,M=p+v.offsetHeight;p<c.scrollTop?c.scrollTop=p:M>c.scrollTop+c.clientHeight&&(c.scrollTop=M-c.clientHeight)}function O(v){i.value||(a.value=v)}function F(){a.value=-1}function tt(){const v=a.value>=0?d.value[a.value]:null,c=v?A(v):n.value.trim();c&&e.onAdd(c)}return(v,c)=>(y(),x(B,null,[b("div",cn,[c[7]||(c[7]=b("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[b("circle",{cx:"11",cy:"11",r:"7"}),b("path",{d:"m20 20-3.5-3.5"})],-1)),pe(b("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":c[0]||(c[0]=p=>n.value=p),type:"text",placeholder:m.value,"aria-label":t.label,onInput:F,onKeydown:[c[1]||(c[1]=U(T(p=>q(1),["prevent"]),["down"])),c[2]||(c[2]=U(T(p=>q(-1),["prevent"]),["up"])),U(T(tt,["prevent"]),["enter"]),c[3]||(c[3]=U(T(()=>{},["stop"]),["escape"]))]},null,40,un),[[me,n.value]])]),b("div",dn,[b("button",{type:"button","data-sve-tw-tab":"","data-active":s.value==="tailwind"?"":void 0,onClick:c[4]||(c[4]=T(p=>{s.value="tailwind",F()},["prevent","stop"]))},_(t.tailwindLabel),9,fn),b("button",{type:"button","data-sve-tw-tab":"","data-active":s.value==="site"?"":void 0,onClick:c[5]||(c[5]=T(p=>{s.value="site",F()},["prevent","stop"]))},_(t.siteLabel),9,pn)]),d.value.length?z("",!0):(y(),x("div",mn,_(t.emptyText),1)),b("div",{ref_key:"rowsEl",ref:r,onMousemove:c[6]||(c[6]=p=>i.value=!1)},[(y(!0),x(B,null,j(d.value,(p,M)=>(y(),x("button",{key:p.name||p.label,type:"button","data-sve-tw-option":"","data-cursor":M===a.value?"":void 0,"data-active":M===a.value?"":void 0,"data-sve-tw-off":p.loaded===!1?"":void 0,title:p.loaded===!1?t.offText:p.file||p.css,onMouseenter:et=>O(M),onClick:T(et=>t.onAdd(p.name||p.label),["prevent","stop"])},[p.color?(y(),x("span",{key:0,"data-sve-tw-dot":"",style:ft({background:p.color})},null,4)):z("",!0),b("span",vn,_(p.name||p.label),1)],40,hn))),128))],544)],64))}},g="__sve-tw-menu",St="__sve-tw-style",vt=[{key:"",all:!0,device:"Responsive",label:"tw_size_all"},{key:"",device:"Laptop",label:"tw_size_base"},{key:"max-lg",device:"Tablet",word:"responsive_tablet",under:1024},{key:"max-md",device:"Mobile",word:"responsive_mobile",under:768}],Et=["","dark","hover","focus","active","before","after"],Qt={Mobile:"max-md",Tablet:"max-lg",Laptop:"",Desktop:""};let Jt="",R="",G=!1;function bn(){try{return Qt[Bt(window,"sve-lp-device")]??""}catch{return""}}function gt(){return G?Jt:bn()}function te(){return[gt(),R].filter(Boolean)}function bt(){return te().join(":")}const yn=/^(max-)?(sm|md|lg|xl|2xl)$/;function xn(t){return String(t||"").split(":").find(e=>yn.test(e))||""}function ee(){if(G)return!0;try{return Object.prototype.hasOwnProperty.call(Qt,Bt(window,"sve-lp-device"))}catch{return!1}}function wn(t){if(!ee())return!0;const e=xn(t);return e===gt()?!0:!vt.some(n=>n.key===e)}let k=null,K=new Map,E=null,st=!1,X="",ut=null;function ne(t){return t?.querySelector?.('[data-sve-style="tw"] [data-sve-tw-host]')||null}function oe(t){if(t.getElementById(St))return;const e=t.createElement("style");e.id=St,e.textContent=`
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
  `,t.head.appendChild(e)}function se(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e.contentDocument;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o.contentDocument}catch{}return null}function kn(t,e,n){const o=se(t);if(!(!o||!k?.path))for(const s of o.querySelectorAll(`[${be}="${k.path}"]`))try{e&&s.classList.remove(e),n&&s.classList.add(n)}catch{}}const rt=new Map,$n=/(^|-)color$|^fill$|^stroke$/;function yt(t){const e=String(t||""),n=e.slice(0,e.indexOf(":")).trim();return $n.test(n)&&/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(e)?.[1]||""}function re(t,e){if(!e)return"";if(rt.has(e))return rt.get(e);const n=se(t),o=n?.documentElement,s=n?.defaultView;if(!o||!s)return"";let r="",a=e;for(let i=0;i<6&&a;i+=1){try{r=s.getComputedStyle(o).getPropertyValue(a).trim()}catch{return""}if(!r)return"";if(a=yt(r),!a)break}return r&&!r.startsWith("var(")?(rt.set(e,r),r):""}function _n(t,e){return je(e,E)||re(t,yt(Xt(e,E)))}function S(t){const e=t?.document.getElementById(g);ut?.(),ut=null,X="",e&&(e._sveApp?.unmount(),e.remove())}function Mt(t,e,n){const o=e.getBoundingClientRect(),s=n.offsetWidth||176,r=8,a=140,i=o.bottom+4,l=t.innerHeight-i-r,f=Math.max(a,Math.min(l,420));n.style.left=`${Math.max(r,Math.min(o.left,t.innerWidth-s-r))}px`,n.style.maxHeight=`${f}px`,n.style.top=`${l>=a?i:Math.max(r,t.innerHeight-r-f)}px`}function Q(t,e,n,o){const s=t.document;S(t),oe(s);const r=s.createElement("div");r.id=g,s.body.appendChild(r),r._sveApp=ve(n,r,o),Mt(t,e,r);const a=()=>Mt(t,e,r),i=f=>{!r.contains(f.target)&&!e.contains(f.target)&&(S(t),D())},l=f=>{f.key==="Escape"&&(S(t),D())};return s.addEventListener("pointerdown",i,!0),s.addEventListener("keydown",l,!0),t.addEventListener("scroll",a,!0),t.addEventListener("resize",a),ut=()=>{s.removeEventListener("pointerdown",i,!0),s.removeEventListener("keydown",l,!0),t.removeEventListener("scroll",a,!0),t.removeEventListener("resize",a)},r}function ae(t,e,n){return(e||[]).map(o=>({label:o.label,css:o.css,color:o.color||re(t,yt(o.css)),active:o.label===n}))}function J(){return!k||Y("dock:is-locked")===!0}function H(){const t=Y("dock:html");if(!k||typeof t!="string"||t[k.from]!=="<")return null;const e=qt(t,k.from,k.openTo);return{html:t,value:e?e.value:""}}function Cn(t){if(!k?.path)return;const n=Pt(xe(t),new Set).find(o=>o.path===k.path);n&&(k={from:n.from,openTo:n.openTo,path:n.path,tag:n.tag})}function W(t,e,n,o,s){const r=Fe(e,k,n);r!==e&&(kn(t,o,s),Y("dock:set-html",r),Cn(r),L(t))}function dt(t){return Kt(t,E)?.label||""}function ie(t){return Vt(t).groups.flatMap(e=>e.items)}function le(t){const e=bt();return ie(t).filter(n=>!n.dynamic&&n.variants.join(":")===e)}function Lt(t,e){if(J()||!e)return;const n=H();if(!n)return;const o=dt(e),s=le(n.value).find(a=>a.name===e||o&&dt(a.name)===o);if(s?.name===e){W(t,n.html,ct(n.value,s,""),e,"");return}if(s){const a=lt({variants:s.variants,name:e,modifier:s.modifier,important:s.important});W(t,n.html,ct(n.value,s,a),s.raw,a);return}const r=lt({variants:te(),name:e,modifier:"",important:""});W(t,n.html,Ut(n.value,r),"",r)}function Tn(t,e){const n=String(e||"").trim(),o=bt(),s=o&&!n.includes(":")?`${o}:${n}`:n;if(J()||!n)return;const r=H();!r||ie(r.value).some(i=>i.raw===s)||W(t,r.html,Ut(r.value,s),"",s.includes(":")?"":s)}function At(t,e,n){if(J())return;const o=H();if(!o||o.value.slice(e.from,e.to)!==e.raw){L(t);return}const s=n?lt({variants:e.variants,name:n,modifier:e.modifier,important:e.important}):"";W(t,o.html,ct(o.value,e,s),e.raw,s)}function jn(){return!!k}function Sn(t,e){const n=vt[e];n&&(Y("lp:set-device",{win:t,key:n.device}),G=!n.all,Jt=n.key,S(t),L(t),Z("tw:changed"))}function En(t,e){Q(t,e,ht,{title:w(t,"tw_state"),removeLabel:w(t,"tw_state_none"),options:Et.filter(Boolean).map(n=>({label:n,css:"",color:null,active:n===R})),onPick:n=>{R=Et.includes(n)?n:"",S(t),L(t),Z("tw:changed")},onRemove:()=>{R="",S(t),L(t),Z("tw:changed")}})}ge("lp:device",()=>{G=!1,ne(window.document)&&L(window)});function Mn(t){const e=t?H():null;return e&&le(e.value).find(n=>dt(n.name)===t)?.name||""}function Wn(t,e,n,o){const s=E?.byProperty.get(n)||[];if(!s.length)return;const r=Mn(n);Q(t,e,ht,{title:n,removeLabel:w(t,"tw_classes_remove"),options:ae(t,s,r),onPick:a=>{Lt(t,a),S(t),o?.(a)},onRemove:()=>{r&&Lt(t,r),S(t),o?.("")}})}let zt=[],at=!1;function Ln(t){at||(at=!0,t.fetch("/!/sve/site-css/classes",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{groups:[]}).then(e=>{zt=Array.isArray(e?.groups)?e.groups:[],u.siteClasses=zt}).catch(()=>{at=!1}))}function An(t,e){Ln(t),Q(t,e,gn,{label:w(t,"tw_add_class"),placeholder:w(t,"tw_add_placeholder"),emptyText:w(t,"tw_add_empty"),offText:w(t,"tw_class_not_imported"),sitePlaceholder:w(t,"tw_add_placeholder_site"),siteLabel:w(t,"tw_add_site"),tailwindLabel:w(t,"tw_add_tailwind"),search:n=>{const o=String(n||"").trim().toLowerCase();if(!o||!E)return[];const s=E.catalog.items.filter(r=>r.label.toLowerCase().includes(o));return s.sort((r,a)=>{const i=r.label.toLowerCase().startsWith(o)?0:1,l=a.label.toLowerCase().startsWith(o)?0:1;return i-l||r.label.length-a.label.length}),s.slice(0,40).map(r=>({label:r.label,css:r.css,color:r.color,active:!1}))},onAdd:n=>{Tn(t,n)}})}function zn(t,e,n){const o=K.get(n);if(!o||o.locked)return;if(X===n){S(t),D();return}const s=Kt(o.name,E);Q(t,e.currentTarget,ht,{title:s?.label||"",removeLabel:w(t,"tw_classes_remove"),options:ae(t,s?.options,o.name),onPick:r=>{At(t,o,r),S(t)},onRemove:()=>{At(t,o,""),S(t)}}),X=n,D()}function D(){for(const t of u.groups)for(const e of t.chips)e.open=e.id===X}function Dn(t,e){if(!e||e.from==null||e.openTo==null){k=null,K=new Map,S(t),L(t);return}k={from:e.from,openTo:e.openTo,path:e.path,tag:e.tag},L(t)}function L(t){Bn(t);const e=k?H():null,n=e?Vt(e.value):{scope:null,groups:[]};K=new Map,u.baseLabel=w(t,"tw_size_base"),u.scopeTitle=w(t,"tw_classes_scope"),u.variant=bt(),u.onBreakpoint=r=>Sn(t,r),u.onState=r=>En(t,r.currentTarget);const o=ee();u.breakpoints=vt.map((r,a)=>({index:a,label:r.word?`${r.key}`:w(t,r.label),title:r.word?`${w(t,r.word)}  ·  < ${r.under}px`:w(t,r.all?"tw_size_all_title":"tw_size_base_title"),active:r.all?!o:o&&r.key===gt()})),u.state=R,u.stateLabel=R||w(t,"tw_state"),u.canEdit=!J(),u.onChip=(r,a)=>zn(t,r,a),u.tag=k?.tag||"",u.scope=n.scope?.label||"",u.emptyText=w(t,k?n.groups.length?"tw_classes_none_size":"tw_classes_none":"tw_classes_pick"),u.groups=n.groups.filter(r=>wn(r.key)).map(r=>({key:r.key,current:r.key===u.variant,chips:r.items.map((a,i)=>{const l={...a,id:`${r.key}-${i}-${a.from}`,locked:a.dynamic||!u.canEdit,open:!1,color:a.dynamic?"":_n(t,a.name),title:a.dynamic?w(t,"tw_classes_dynamic"):Xt(a.name,E)||a.raw};return K.set(l.id,l),l})}));const s=ne(t.document);s&&(oe(t.document),he(s,nn)),D(),Ve(t,k?.path||""),Z("tw:changed")}function Bn(t){E||st||(st=!0,Re(t).then(e=>{E=e,L(t)}).catch(()=>{st=!1}))}export{Rn as a,Pn as b,S as c,Mn as d,Wn as e,Pt as f,An as g,Lt as h,In as i,jn as j,xe as p,Dn as r,Ht as t};
