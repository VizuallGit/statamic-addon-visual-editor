import{r as ue,_ as de,o as y,c as x,u as $,a as b,t as _,d as z,F as O,e as W,f as T,I as it,m as fe,n as ft,Q as I,H as j,T as pe,a2 as kt,K as me,w as N,L as he,j as w,i as ve,a9 as Z,M as Y,l as ge,a8 as Ot,N as be}from"./addon-FNXXiShf.js";import{H as ye}from"./html-pick-align-gkRPeJkt.js";const Rt=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function Ft(t){return String(t||"").replace(/\{\{[\s\S]*?\}\}/g,e=>" ".repeat(e.length))}function xe(t){const e=t.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(!e)return"";const n=e[2].match(/\[\s*([\s\S]*?)\s*\]/);if(n){const o=n[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).find(s=>/^[a-zA-Z_][\w-]*$/.test(s));if(o)return o}return(e[2].trim().split(/\s+/)[0]||"").replace(/\[|\]/g,"")}function It(t,e,n,o){t.hidden=!0,o&&(t.wrapFrom=e,t.wrapTo=n);for(const s of t.children)It(s,e,n,!1)}function Pt(t,e,n,o){const s=[],r=[];let a=n,i=0;const l=f=>{r.length?r[r.length-1].children.push(f):s.push(f)};for(;a<o;){if(e[a]!=="<"){a+=1;continue}if(e.startsWith("<!--",a)){const c=e.indexOf("-->",a+4),m=c===-1||c>o?o:c,L=c===-1||c+3>o?o:c+3,et=Pt(t,e,a+4,m);for(const wt of et)It(wt,a,L,!0),l(wt);a=L;continue}if(e.startsWith("<!",a)||e.startsWith("<?",a)){const c=e.indexOf(">",a+2);a=c===-1||c+1>o?o:c+1;continue}const f=e[a+1]==="/",h=e.slice(a,o).match(/^<\/?([a-zA-Z][a-zA-Z0-9:-]*)/);if(!h){a+=1;continue}const d=h[1].toLowerCase(),p=e.indexOf(">",a);if(p===-1||p>=o)break;const E=e.slice(a,p+1),B=!f&&(Rt.has(d)||/\/\s*>$/.test(E));if(f){for(let c=r.length-1;c>=0;c-=1)if(r[c].tag===d){r[c].to=p+1,r.length=c;break}a=p+1;continue}const U=xe(t.slice(a,p+1)),R=r.length?r[r.length-1]:null,F=R?R.children:s,tt=R?`${R.path}/${F.length}:${d}`:`${F.length}:${d}`,v={id:`${d}-${a}-${i}`,tag:d,klass:U,path:tt,label:U,from:a,to:p+1,openTo:p+1,hidden:!1,children:[]};i+=1,l(v),B?v.to=p+1:r.push(v),a=p+1}for(;r.length;)r.pop().to=o;return s}function we(t){const e=String(t||""),n=Ft(e);return Pt(e,n,0,n.length)}function jt(t,e,n=0,o=[]){for(const s of t){const r=s.children.length>0,a=e.has(s.id);o.push({id:s.id,tag:s.tag,klass:s.klass||"",path:s.path,label:s.label,from:s.from,to:s.to,openTo:s.openTo,hidden:!!s.hidden,wrapFrom:s.wrapFrom,wrapTo:s.wrapTo,depth:n,hasChildren:r,shut:a}),r&&!a&&jt(s.children,e,n+1,o)}return o}function In(t){return Rt.has(String(t||"").toLowerCase())}const Wt=["sm","md","lg","xl","2xl","max-sm","max-md","max-lg","max-xl","max-2xl","dark","hover","focus","focus-visible","active","disabled","group-hover"],$t={sm:"(min-width: 640px)",md:"(min-width: 768px)",lg:"(min-width: 1024px)",xl:"(min-width: 1280px)","2xl":"(min-width: 1536px)","max-sm":"(max-width: 639px)","max-md":"(max-width: 767px)","max-lg":"(max-width: 1023px)","max-xl":"(max-width: 1279px)","max-2xl":"(max-width: 1535px)",dark:"(prefers-color-scheme: dark)"},_t={hover:":hover",focus:":focus","focus-visible":":focus-visible",active:":active",disabled:":disabled","group-hover":":is(:where(.group):hover *)"},ke={relative:"position: relative",absolute:"position: absolute",fixed:"position: fixed",sticky:"position: sticky",static:"position: static",block:"display: block",inline:"display: inline","inline-block":"display: inline-block",flex:"display: flex","inline-flex":"display: inline-flex",grid:"display: grid",hidden:"display: none","flex-row":"flex-direction: row","flex-col":"flex-direction: column","flex-wrap":"flex-wrap: wrap","items-start":"align-items: flex-start","items-center":"align-items: center","items-end":"align-items: flex-end","items-stretch":"align-items: stretch","justify-start":"justify-content: flex-start","justify-center":"justify-content: center","justify-end":"justify-content: flex-end","justify-between":"justify-content: space-between","justify-around":"justify-content: space-around","text-left":"text-align: left","text-center":"text-align: center","text-right":"text-align: right","w-full":"width: 100%","h-full":"height: 100%","w-screen":"width: 100vw","h-screen":"height: 100vh","overflow-hidden":"overflow: hidden","overflow-auto":"overflow: auto","pointer-events-none":"pointer-events: none",underline:"text-decoration-line: underline",italic:"font-style: italic","font-bold":"font-weight: 700","font-medium":"font-weight: 500",uppercase:"text-transform: uppercase",truncate:"overflow: hidden; text-overflow: ellipsis; white-space: nowrap","z-10":"z-index: 10","z-20":"z-index: 20","z-50":"z-index: 50"},Dt={p:"padding",px:"padding-inline",py:"padding-block",pt:"padding-top",pr:"padding-right",pb:"padding-bottom",pl:"padding-left",m:"margin",mx:"margin-inline",my:"margin-block",mt:"margin-top",mr:"margin-right",mb:"margin-bottom",ml:"margin-left",gap:"gap","gap-x":"column-gap","gap-y":"row-gap",w:"width",h:"height","min-w":"min-width","min-h":"min-height","max-w":"max-width","max-h":"max-height"},Ht={bg:"background-color",border:"border-color",outline:"outline-color",fill:"fill",stroke:"stroke"};let nt=null;function qt(t){return t?.Statamic?.$config?.get?.("sveFeatures")?.tailwind_dock===!0}function Pn(t){return e=>{if(!qt(t)||!$e(e))return null;const n=e.matchBefore(/[^\s"']*$/),o=n?.text??"";return o.includes("{")||o.includes("}")?null:pt(t).then(s=>{const r=Te(o,s).slice(0,80);return r.length?{from:n?n.from:e.pos,options:r,validFor:/^[^\s"'=]*$/}:null})}}function jn(t,e){return t((n,o)=>{if(!qt(e))return null;const s=_e(n.state,o);return s?pt(e).then(r=>{const a=Se(s.text,r);return a?{pos:s.from,end:s.to,create(){return{dom:Le(a,Ee(s.text,r))}}}:null}):null})}function Ct(t){const e={color:[],spacing:[],text:[],leading:[],font:[],radius:[]},n=/--(color|spacing|text|leading|font|radius)-([a-zA-Z0-9][a-zA-Z0-9._-]*)\s*:\s*([^;]+);/g;let o;for(;o=n.exec(String(t||""));)o[2]!=="*"&&e[o[1]].push({name:o[2],value:o[3].trim()});const s=[];Object.entries(ke).forEach(([a,i])=>{s.push({label:a,css:i,color:null})}),e.color.forEach(({name:a,value:i})=>{const l=Me(i);Object.entries(Ht).forEach(([f,h])=>{s.push({label:`${f}-${a}`,css:`${h}: var(--color-${a})`,color:l})}),s.push({label:`text-${a}`,css:`color: var(--color-${a})`,color:l})}),e.spacing.forEach(({name:a})=>{Object.entries(Dt).forEach(([i,l])=>{s.push({label:`${i}-${a}`,css:`${l}: var(--spacing-${a})`,color:null})})}),e.text.forEach(({name:a})=>{s.push({label:`text-${a}`,css:`font-size: var(--text-${a})`,color:null})}),e.leading.forEach(({name:a})=>{s.push({label:`leading-${a}`,css:`line-height: var(--leading-${a})`,color:null})}),e.font.forEach(({name:a})=>{s.push({label:`font-${a}`,css:`font-family: var(--font-${a})`,color:null})}),e.radius.forEach(({name:a})=>{s.push({label:a==="DEFAULT"?"rounded":`rounded-${a}`,css:`border-radius: var(--radius-${a})`,color:null})});const r=new Map;return s.forEach(a=>{r.has(a.label)||r.set(a.label,a)}),{items:[...r.values()],byUtility:r}}function pt(t){return nt||(nt=t.fetch("/!/sve/tailwind-theme",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{css:""}).then(e=>Ct(typeof e.css=="string"?e.css:"")).catch(()=>Ct(""))),nt}function $e(t){return!!(t.matchBefore(/class\s*=\s*"[^"]*$/i)||t.matchBefore(/class\s*=\s*'[^']*$/i))}function _e(t,e){const n=t.doc.lineAt(e),o=e-n.from,s=Ce(n.text,o);if(!s)return null;const r=n.text.slice(s.valueFrom,s.valueTo),a=o-s.valueFrom,i=r.slice(0,a),l=r.slice(a),f=(i.match(/[^\s]*$/)||[""])[0],h=(l.match(/^[^\s]*/)||[""])[0],d=f+h;if(!d||d.includes("{"))return null;const p=n.from+s.valueFrom+(i.length-f.length);return{from:p,to:p+d.length,text:d}}function Ce(t,e){const n=/\bclass\s*=\s*(["'])/gi;let o;for(;o=n.exec(t);){const s=o[1],r=o.index+o[0].length,a=t.indexOf(s,r),i=a===-1?t.length:a;if(e>=r&&e<=i)return{valueFrom:r,valueTo:i}}return null}function mt(t){const e=[...Wt].sort((a,i)=>i.length-a.length),n=[];let o=String(t||""),s=!0;for(;s;){s=!1;for(const a of e){const i=`${a}:`;if(o.startsWith(i)){n.push(a),o=o.slice(i.length),s=!0;break}}}let r=!1;return o.startsWith("!")?(r=!0,o=o.slice(1)):o.endsWith("!")&&(r=!0,o=o.slice(0,-1)),{variants:n,utility:o,important:r}}function Te(t,e){const{variants:n,utility:o}=mt(t),s=n.length?`${n.join(":")}:`:"",r=o.toLowerCase(),a=[];return!r&&!s&&Wt.forEach(i=>{a.push({label:`${i}:`,type:"keyword",detail:"variant",boost:2})}),e.items.forEach(i=>{if(r&&!i.label.startsWith(r)&&!i.label.includes(r))return;const l=`${s}${i.label}`;a.push({label:l,type:"property",detail:i.css,boost:i.label.startsWith(r)?1:0})}),a.sort((i,l)=>(l.boost||0)-(i.boost||0)||i.label.localeCompare(l.label))}function Se(t,e){const{variants:n,utility:o,important:s}=mt(t),r=e.byUtility.get(o);if(!r)return"";let a=r.css;s&&(a+=" !important");const i=t.replace(/[^a-zA-Z0-9_-]/g,d=>`\\${d}`);let l="";const f=[];n.forEach(d=>{$t[d]?f.push($t[d]):_t[d]&&(l+=_t[d])});let h=`.${i}${l} { ${a} }`;return f.slice().reverse().forEach(d=>{h=`@media ${d} {
  ${h}
}`}),h}function Ee(t,e){const{utility:n}=mt(t);return e.byUtility.get(n)?.color||null}function Me(t){const e=String(t||"").trim();return/^#([0-9a-fA-F]{3,8})$/.test(e)?e:null}function Le(t,e){const n=document.createElement("div");if(n.className="sve-tw-info",e){const s=document.createElement("span");s.className="sve-tw-swatch",s.style.background=e,n.appendChild(s)}const o=document.createElement("pre");return o.textContent=t,n.appendChild(o),n}function Vt(t,e,n){const o=String(t||"").slice(e,n),s=Ft(o),r=/(\sclass\s*=\s*)(["'])/i.exec(s);if(!r)return null;const a=r[2],i=r.index+r[1].length+1,l=s.indexOf(a,i);return l===-1?null:{from:e+i,to:e+l,quote:a,value:o.slice(i,l)}}function Ae(t){const e=String(t||""),n=[];let o=0;for(;o<e.length;){if(/\s/.test(e[o])){o+=1;continue}let s=o,r=!1;for(;s<e.length;){if(e.startsWith("{{",s)){const a=e.indexOf("}}",s+2);r=!0,s=a===-1?e.length:a+2;continue}if(/\s/.test(e[s]))break;s+=1}n.push({text:e.slice(o,s),from:o,to:s,dynamic:r}),o=s}return n}function ze(t){const e=String(t||""),n=[];let o=0,s=0;for(let a=0;a<e.length;a+=1){const i=e[a];i==="["||i==="("?o+=1:i==="]"||i===")"?o=Math.max(0,o-1):i===":"&&o===0&&(n.push(e.slice(s,a)),s=a+1)}const r=e.slice(s);return{variants:n,base:r}}function Be(t){let n=String(t||""),o="";n.startsWith("!")?(o="pre",n=n.slice(1)):n.endsWith("!")&&(o="post",n=n.slice(0,-1));let s="";const r=Oe(n);return r!==-1&&(s=n.slice(r),n=n.slice(0,r)),{name:n,modifier:s,important:o}}function Oe(t){let e=0;for(let n=0;n<t.length;n+=1){const o=t[n];if(o==="["||o==="(")e+=1;else if(o==="]"||o===")")e=Math.max(0,e-1);else if(o==="/"&&e===0)return n}return-1}function lt({variants:t,name:e,modifier:n,important:o}){let s=`${e}${n||""}`;return o==="pre"?s=`!${s}`:o==="post"&&(s=`${s}!`),[...t||[],s].join(":")}function Ut(t){const e=Ae(t),n=new Map;let o=null,s=0;const r=e.findIndex(i=>i.text==="]");if(e[0]?.text==="["&&r>0){const i=e.slice(1,r);o={from:e[0].from,to:e[r].to,label:`[ ${i.map(l=>l.text).join(" ")} ]`},s=r+1}for(;s<e.length;s+=1){const i=e[s],{variants:l,base:f}=ze(i.text),{name:h,modifier:d,important:p}=Be(f),E=l.join(":");n.has(E)||n.set(E,{key:E,variants:l,items:[]}),n.get(E).items.push({raw:i.text,from:i.from,to:i.to,dynamic:i.dynamic,variants:l,name:h,modifier:d,important:p})}const a=[...n.values()];return a.sort((i,l)=>i.key===""?-1:l.key===""?1:0),{scope:o,groups:a}}function ct(t,e,n){const o=String(t||"");if(n)return o.slice(0,e.from)+n+o.slice(e.to);let s=e.from,r=e.to;if(s>0&&(o[s-1]===" "||o[s-1]==="	"))for(;s>0&&(o[s-1]===" "||o[s-1]==="	");)s-=1;else for(;r<o.length&&(o[r]===" "||o[r]==="	");)r+=1;return Re(o.slice(0,s)+o.slice(r),s)}function Re(t,e){const n=t.lastIndexOf(`
`,Math.max(0,e-1));if(n===-1)return t;const o=t.indexOf(`
`,n+1);return t.slice(n+1,o===-1?t.length:o).trim()!==""?t:t.slice(0,n)+t.slice(o===-1?t.length:o)}function Nt(t,e){const n=String(t||"");return n.trim()?`${n.replace(/\s+$/,"")} ${e}`:e}function Fe(t,e,n){const o=Vt(t,e.from,e.openTo);if(o)return t.slice(0,o.from)+n+t.slice(o.to);const s=String(t).slice(e.from,e.openTo),r=/^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(s);if(!r||!n)return t;const a=e.from+r[0].length;return`${t.slice(0,a)} class="${n}"${t.slice(a)}`}const Ie=[...Object.keys(Dt),...Object.keys(Ht),"text","leading","font","rounded"].sort((t,e)=>e.length-t.length);let ot=null;function Pe(t){return ot||(ot=pt(t).then(je)),ot}function Zt(t){const e=String(t||"");if(e.includes(";"))return"";const n=e.indexOf(":");return n===-1?"":e.slice(0,n).trim()}function je(t){const e=new Map,n=new Map,o=new Map;for(const s of t.items){const r=Zt(s.css);r&&(e.has(r)||e.set(r,[]),e.get(r).push(s),n.set(s.label,r));const a=Kt(s.label);a&&(o.has(a)||o.set(a,[]),o.get(a).push(s))}return{catalog:t,byProperty:e,propertyOfUtility:n,byPrefix:o}}function Kt(t){for(const e of Ie)if(String(t).startsWith(`${e}-`))return e;return""}function Xt(t,e){if(!e||!t)return null;const n=e.propertyOfUtility.get(t);if(n)return{label:n,options:e.byProperty.get(n)||[]};const o=Kt(t),s=o?e.byPrefix.get(o):null;return s?.length?{label:Zt(s[0].css)||o,options:s}:null}function Yt(t,e){return e?.catalog?.byUtility?.get(t)?.css||""}function We(t,e){return e?.catalog?.byUtility?.get(t)?.color||""}const u=ue({emptyText:"",tag:"",scope:"",scopeTitle:"",baseLabel:"",groups:[],canEdit:!1,onChip:null,variant:"",breakpoints:[],onBreakpoint:null,state:"",stateLabel:"",onState:null,siteClasses:[]}),C="__sve-tw-strip",Tt="__sve-tw-strip-style";let St=null,D=null;function ht(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o}catch{}return null}function De(t){if(t.getElementById(Tt))return;const e=t.createElement("style");e.id=Tt,e.textContent=`
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
  `,t.head.appendChild(e)}function He(t){const e=ht(t);return e?e.getBoundingClientRect():null}function qe(t){t?.document.getElementById(C)?.remove()}function Ve(t){const e=()=>Ue(t);St!==t&&(St=t,t.addEventListener("resize",e),t.addEventListener("scroll",e,!0));const n=ht(t)?.contentWindow;if(n&&!n._sveStripBound)try{n._sveStripBound=!0,n.addEventListener("scroll",e,!0),n.addEventListener("resize",e),n.addEventListener("statamic:preview-updated",()=>{t.setTimeout(()=>Gt(t,D?.path||""),60)})}catch{}}function Ue(t){const e=t?.document.getElementById(C);!e||!D?.el?.isConnected||Qt(t,e,D.frame,D.el)}function Gt(t,e){if(!t)return;const n=t.document,o=ht(t),s=o?.contentDocument,r=e&&s?s.querySelector(`[data-sve-ht-path="${e}"]`):null;if(!r||!u.groups.length){qe(t);return}De(n),Ve(t);let a=n.getElementById(C);a||(a=n.createElement("div"),a.id=C,n.body.appendChild(a)),a.replaceChildren();const i=n.createElement("span");i.setAttribute("data-sve-tw-strip-tag",""),i.textContent=`<${u.tag}>`,a.appendChild(i);for(const f of u.groups)for(const h of f.chips){const d=n.createElement("button");if(d.type="button",d.title=h.title||"",h.locked&&d.setAttribute("data-locked",""),h.color){const p=n.createElement("span");p.setAttribute("data-dot",""),p.style.background=h.color,d.appendChild(p)}d.appendChild(n.createTextNode(h.raw)),h.locked||d.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation(),u.onChip?.(p,h.id)}),a.appendChild(d)}const l=n.createElement("button");l.type="button",l.setAttribute("data-add",""),l.textContent="+",l.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),zn(t,f.currentTarget)}),a.appendChild(l),D={frame:o,el:r,path:e},Qt(t,a,o,r)}function Qt(t,e,n,o){const s=n.getBoundingClientRect(),r=n.clientWidth?s.width/n.clientWidth:1,a=o.getBoundingClientRect(),i=e.getBoundingClientRect(),l=6,f=s.left+a.left*r,h=s.top+a.top*r-i.height-l,d=s.top+a.top*r+l;e.style.left=`${Math.max(l,Math.min(f,t.innerWidth-i.width-l))}px`,e.style.top=`${Math.max(s.top+l,h<s.top?d:h)}px`;const p=n.clientHeight||s.height;e.hidden=a.bottom<=0||a.top>=p}const Ne={class:"sve-tw"},Ze={key:0,class:"sve-tw-head"},Ke={class:"sve-tw-tag"},Xe=["title"],Ye=["title","data-active","disabled","onClick"],Ge=["data-active","disabled"],Qe={key:1,class:"sve-tw-empty"},Je=["data-sve-tw-base","data-current"],tn={class:"sve-tw-chips"},en=["title","onClick"],nn={__name:"TwClassList",setup(t){function e(n){const o={"data-sve-tw-chip":n.id};return n.locked&&(o["data-sve-tw-locked"]=""),n.open&&(o["data-open"]=""),o}return(n,o)=>(y(),x("div",Ne,[$(u).tag?(y(),x("div",Ze,[b("span",Ke,"<"+_($(u).tag)+">",1),$(u).scope?(y(),x("span",{key:0,class:"sve-tw-scope",title:$(u).scopeTitle},_($(u).scope),9,Xe)):z("",!0),o[2]||(o[2]=b("span",{class:"sve-tw-gap"},null,-1)),(y(!0),x(O,null,W($(u).breakpoints,s=>(y(),x("button",{key:s.index,type:"button","data-sve-tw-bp":"",title:s.title,"data-active":s.active?"":void 0,disabled:!$(u).canEdit,onClick:T(r=>$(u).onBreakpoint?.(s.index),["prevent","stop"])},_(s.label),9,Ye))),128)),b("button",{type:"button","data-sve-tw-state":"","data-active":$(u).state?"":void 0,disabled:!$(u).canEdit,onClick:o[0]||(o[0]=T(s=>$(u).onState?.(s),["prevent","stop"]))},[it(_($(u).stateLabel)+" ",1),o[1]||(o[1]=b("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[b("path",{d:"m6 9 6 6 6-6"})],-1))],8,Ge)])):z("",!0),$(u).groups.length?z("",!0):(y(),x("div",Qe,_($(u).emptyText),1)),(y(!0),x(O,null,W($(u).groups,s=>(y(),x("div",{key:s.key,class:"sve-tw-group"},[b("span",{class:"sve-tw-variant","data-sve-tw-base":s.key===""?"":void 0,"data-current":s.current?"":void 0},_(s.key===""?$(u).baseLabel:s.key),9,Je),b("div",tn,[(y(!0),x(O,null,W(s.chips,r=>(y(),x("button",fe({key:r.id,type:"button"},{ref_for:!0},e(r),{title:r.title,onClick:T(a=>$(u).onChip?.(a,r.id),["prevent","stop"])}),[r.color?(y(),x("span",{key:0,class:"sve-tw-dot",style:ft({background:r.color})},null,4)):z("",!0),it(" "+_(r.raw),1)],16,en))),128))])]))),128))]))}},on=de(nn,[["__scopeId","data-v-33c4f5f2"]]),sn={key:0,"data-sve-tw-menu-title":""},rn={"data-sve-tw-menu-list":""},an=["data-active","title","onClick"],ln={"data-sve-tw-tick":""},cn={"data-sve-tw-label":""},vt={__name:"TwClassMenu",props:{title:{type:String,default:""},options:{type:Array,default:()=>[]},removeLabel:{type:String,default:""},onPick:{type:Function,required:!0},onRemove:{type:Function,required:!0}},setup(t){return(e,n)=>(y(),x(O,null,[t.title?(y(),x("div",sn,_(t.title),1)):z("",!0),b("div",rn,[(y(!0),x(O,null,W(t.options,o=>(y(),x("button",{key:o.label,type:"button","data-sve-tw-option":"","data-active":o.active?"":void 0,title:o.css,onClick:T(s=>t.onPick(o.label),["prevent","stop"])},[b("span",ln,_(o.active?"✓":""),1),o.color?(y(),x("span",{key:0,"data-sve-tw-dot":"",style:ft({background:o.color})},null,4)):z("",!0),b("span",cn,_(o.label),1)],8,an))),128))]),b("button",{type:"button","data-sve-tw-remove":"",onClick:n[0]||(n[0]=T(o=>t.onRemove(),["prevent","stop"]))},[n[1]||(n[1]=b("span",{"data-sve-tw-tick":""},"✕",-1)),it(_(t.removeLabel),1)])],64))}},un={"data-sve-tw-search":""},dn=["placeholder","aria-label","onKeydown"],fn={"data-sve-tw-tabs":""},pn=["data-active"],mn=["data-active"],hn={key:0,"data-sve-tw-add-empty":""},vn=["data-cursor","data-active","data-sve-tw-off","title","onMouseenter","onClick"],gn={"data-sve-tw-label":""},bn={__name:"TwAddClass",props:{label:{type:String,default:""},placeholder:{type:String,default:""},sitePlaceholder:{type:String,default:""},emptyText:{type:String,default:""},offText:{type:String,default:""},siteLabel:{type:String,default:""},tailwindLabel:{type:String,default:""},search:{type:Function,required:!0},onAdd:{type:Function,required:!0}},setup(t){const e=t,n=I(""),o=I(null),s=I("tailwind"),r=I(null),a=I(-1),i=I(!1),l=j(()=>n.value.trim().toLowerCase()),f=j(()=>(u.siteClasses||[]).flatMap(v=>v.items).filter(v=>!l.value||v.name.toLowerCase().includes(l.value))),h=j(()=>e.search(n.value)),d=j(()=>s.value==="site"?f.value:h.value),p=j(()=>s.value==="site"?e.sitePlaceholder:e.placeholder);pe(()=>kt(()=>o.value?.focus()));function E(v){return v?.name||v?.label||""}function B(v){i.value=!0;const c=d.value.length;if(!c){a.value=-1;return}const m=a.value+v;a.value=m<0?-1:Math.min(m,c-1),kt(()=>U())}function U(){const v=r.value?.querySelector("[data-cursor]");if(!v)return;let c=v.parentElement;for(;c&&c.scrollHeight<=c.clientHeight;)c=c.parentElement;if(!c)return;const m=v.offsetTop,L=m+v.offsetHeight;m<c.scrollTop?c.scrollTop=m:L>c.scrollTop+c.clientHeight&&(c.scrollTop=L-c.clientHeight)}function R(v){i.value||(a.value=v)}function F(){a.value=-1}function tt(){const v=a.value>=0?d.value[a.value]:null,c=v?E(v):n.value.trim();c&&e.onAdd(c)}return(v,c)=>(y(),x(O,null,[b("div",un,[c[7]||(c[7]=b("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[b("circle",{cx:"11",cy:"11",r:"7"}),b("path",{d:"m20 20-3.5-3.5"})],-1)),me(b("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":c[0]||(c[0]=m=>n.value=m),type:"text",placeholder:p.value,"aria-label":t.label,onInput:F,onKeydown:[c[1]||(c[1]=N(T(m=>B(1),["prevent"]),["down"])),c[2]||(c[2]=N(T(m=>B(-1),["prevent"]),["up"])),N(T(tt,["prevent"]),["enter"]),c[3]||(c[3]=N(T(()=>{},["stop"]),["escape"]))]},null,40,dn),[[he,n.value]])]),b("div",fn,[b("button",{type:"button","data-sve-tw-tab":"","data-active":s.value==="tailwind"?"":void 0,onClick:c[4]||(c[4]=T(m=>{s.value="tailwind",F()},["prevent","stop"]))},_(t.tailwindLabel),9,pn),b("button",{type:"button","data-sve-tw-tab":"","data-active":s.value==="site"?"":void 0,onClick:c[5]||(c[5]=T(m=>{s.value="site",F()},["prevent","stop"]))},_(t.siteLabel),9,mn)]),d.value.length?z("",!0):(y(),x("div",hn,_(t.emptyText),1)),b("div",{ref_key:"rowsEl",ref:r,onMousemove:c[6]||(c[6]=m=>i.value=!1)},[(y(!0),x(O,null,W(d.value,(m,L)=>(y(),x("button",{key:m.name||m.label,type:"button","data-sve-tw-option":"","data-cursor":L===a.value?"":void 0,"data-active":L===a.value?"":void 0,"data-sve-tw-off":m.loaded===!1?"":void 0,title:m.loaded===!1?t.offText:m.file||m.css,onMouseenter:et=>R(L),onClick:T(et=>t.onAdd(m.name||m.label),["prevent","stop"])},[m.color?(y(),x("span",{key:0,"data-sve-tw-dot":"",style:ft({background:m.color})},null,4)):z("",!0),b("span",gn,_(m.name||m.label),1)],40,vn))),128))],544)],64))}},g="__sve-tw-menu",Et="__sve-tw-style",gt=[{key:"",all:!0,device:"Responsive",label:"tw_size_all"},{key:"",device:"Laptop",label:"tw_size_base"},{key:"max-lg",device:"Tablet",word:"responsive_tablet",under:1024},{key:"max-md",device:"Mobile",word:"responsive_mobile",under:768}],Mt=["","dark","hover","focus","active","before","after"],Jt={Mobile:"max-md",Tablet:"max-lg",Laptop:"",Desktop:""};let te="",P="",G=!1;function yn(){try{return Jt[Ot(window,"sve-lp-device")]??""}catch{return""}}function bt(){return G?te:yn()}function ee(){return[bt(),P].filter(Boolean)}function yt(){return ee().join(":")}const xn=/^(max-)?(sm|md|lg|xl|2xl)$/;function wn(t){return String(t||"").split(":").find(e=>xn.test(e))||""}function ne(){if(G)return!0;try{return Object.prototype.hasOwnProperty.call(Jt,Ot(window,"sve-lp-device"))}catch{return!1}}function kn(t){if(!ne())return!0;const e=wn(t);return e===bt()?!0:!gt.some(n=>n.key===e)}let k=null,K=new Map,M=null,st=!1,X="",ut=null;function oe(t){return t?.querySelector?.('[data-sve-style="tw"] [data-sve-tw-host]')||null}function se(t){if(t.getElementById(Et))return;const e=t.createElement("style");e.id=Et,e.textContent=`
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
  `,t.head.appendChild(e)}function re(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e.contentDocument;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o.contentDocument}catch{}return null}function $n(t,e,n){const o=re(t);if(!(!o||!k?.path))for(const s of o.querySelectorAll(`[${ye}="${k.path}"]`))try{e&&s.classList.remove(e),n&&s.classList.add(n)}catch{}}const rt=new Map,_n=/(^|-)color$|^fill$|^stroke$/;function xt(t){const e=String(t||""),n=e.slice(0,e.indexOf(":")).trim();return _n.test(n)&&/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(e)?.[1]||""}function ae(t,e){if(!e)return"";if(rt.has(e))return rt.get(e);const n=re(t),o=n?.documentElement,s=n?.defaultView;if(!o||!s)return"";let r="",a=e;for(let i=0;i<6&&a;i+=1){try{r=s.getComputedStyle(o).getPropertyValue(a).trim()}catch{return""}if(!r)return"";if(a=xt(r),!a)break}return r&&!r.startsWith("var(")?(rt.set(e,r),r):""}function Cn(t,e){return We(e,M)||ae(t,xt(Yt(e,M)))}function S(t){const e=t?.document.getElementById(g);ut?.(),ut=null,X="",e&&(e._sveApp?.unmount(),e.remove())}function Lt(t,e,n){const o=e.getBoundingClientRect(),s=n.offsetWidth||176,r=8,a=140,i=e.closest?.("#__sve-tw-strip")?He(t):null,l=i?i.top:0,f=i?i.bottom:t.innerHeight,h=i?i.left:0,d=i?i.right:t.innerWidth,p=o.bottom+4,E=f-p-r,B=Math.max(a,Math.min(E,420));n.style.left=`${Math.max(h+r,Math.min(o.left,d-s-r))}px`,n.style.maxHeight=`${B}px`,n.style.top=`${E>=a?p:Math.max(l+r,f-r-B)}px`}function Q(t,e,n,o){const s=t.document;S(t),se(s);const r=s.createElement("div");r.id=g,s.body.appendChild(r),r._sveApp=ge(n,r,o),Lt(t,e,r);const a=()=>Lt(t,e,r),i=f=>{!r.contains(f.target)&&!e.contains(f.target)&&(S(t),q())},l=f=>{f.key==="Escape"&&(S(t),q())};return s.addEventListener("pointerdown",i,!0),s.addEventListener("keydown",l,!0),t.addEventListener("scroll",a,!0),t.addEventListener("resize",a),ut=()=>{s.removeEventListener("pointerdown",i,!0),s.removeEventListener("keydown",l,!0),t.removeEventListener("scroll",a,!0),t.removeEventListener("resize",a)},r}function ie(t,e,n){return(e||[]).map(o=>({label:o.label,css:o.css,color:o.color||ae(t,xt(o.css)),active:o.label===n}))}function J(){return!k||Y("dock:is-locked")===!0}function V(){const t=Y("dock:html");if(!k||typeof t!="string"||t[k.from]!=="<")return null;const e=Vt(t,k.from,k.openTo);return{html:t,value:e?e.value:""}}function Tn(t){if(!k?.path)return;const n=jt(we(t),new Set).find(o=>o.path===k.path);n&&(k={from:n.from,openTo:n.openTo,path:n.path,tag:n.tag})}function H(t,e,n,o,s){const r=Fe(e,k,n);r!==e&&($n(t,o,s),Y("dock:set-html",r),Tn(r),A(t))}function dt(t){return Xt(t,M)?.label||""}function le(t){return Ut(t).groups.flatMap(e=>e.items)}function ce(t){const e=yt();return le(t).filter(n=>!n.dynamic&&n.variants.join(":")===e)}function At(t,e){if(J()||!e)return;const n=V();if(!n)return;const o=dt(e),s=ce(n.value).find(a=>a.name===e||o&&dt(a.name)===o);if(s?.name===e){H(t,n.html,ct(n.value,s,""),e,"");return}if(s){const a=lt({variants:s.variants,name:e,modifier:s.modifier,important:s.important});H(t,n.html,ct(n.value,s,a),s.raw,a);return}const r=lt({variants:ee(),name:e,modifier:"",important:""});H(t,n.html,Nt(n.value,r),"",r)}function Sn(t,e){const n=String(e||"").trim(),o=yt(),s=o&&!n.includes(":")?`${o}:${n}`:n;if(J()||!n)return;const r=V();!r||le(r.value).some(i=>i.raw===s)||H(t,r.html,Nt(r.value,s),"",s.includes(":")?"":s)}function zt(t,e,n){if(J())return;const o=V();if(!o||o.value.slice(e.from,e.to)!==e.raw){A(t);return}const s=n?lt({variants:e.variants,name:n,modifier:e.modifier,important:e.important}):"";H(t,o.html,ct(o.value,e,s),e.raw,s)}function Wn(){return!!k}function En(t,e){const n=gt[e];n&&(Y("lp:set-device",{win:t,key:n.device}),G=!n.all,te=n.key,S(t),A(t),Z("tw:changed"))}function Mn(t,e){Q(t,e,vt,{title:w(t,"tw_state"),removeLabel:w(t,"tw_state_none"),options:Mt.filter(Boolean).map(n=>({label:n,css:"",color:null,active:n===P})),onPick:n=>{P=Mt.includes(n)?n:"",S(t),A(t),Z("tw:changed")},onRemove:()=>{P="",S(t),A(t),Z("tw:changed")}})}be("lp:device",()=>{G=!1,oe(window.document)&&A(window)});function Ln(t){const e=t?V():null;return e&&ce(e.value).find(n=>dt(n.name)===t)?.name||""}function Dn(t,e,n,o){const s=M?.byProperty.get(n)||[];if(!s.length)return;const r=Ln(n);Q(t,e,vt,{title:n,removeLabel:w(t,"tw_classes_remove"),options:ie(t,s,r),onPick:a=>{At(t,a),S(t),o?.(a)},onRemove:()=>{r&&At(t,r),S(t),o?.("")}})}let Bt=[],at=!1;function An(t){at||(at=!0,t.fetch("/!/sve/site-css/classes",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{groups:[]}).then(e=>{Bt=Array.isArray(e?.groups)?e.groups:[],u.siteClasses=Bt}).catch(()=>{at=!1}))}function zn(t,e){An(t),Q(t,e,bn,{label:w(t,"tw_add_class"),placeholder:w(t,"tw_add_placeholder"),emptyText:w(t,"tw_add_empty"),offText:w(t,"tw_class_not_imported"),sitePlaceholder:w(t,"tw_add_placeholder_site"),siteLabel:w(t,"tw_add_site"),tailwindLabel:w(t,"tw_add_tailwind"),search:n=>{const o=String(n||"").trim().toLowerCase();if(!o||!M)return[];const s=M.catalog.items.filter(r=>r.label.toLowerCase().includes(o));return s.sort((r,a)=>{const i=r.label.toLowerCase().startsWith(o)?0:1,l=a.label.toLowerCase().startsWith(o)?0:1;return i-l||r.label.length-a.label.length}),s.slice(0,40).map(r=>({label:r.label,css:r.css,color:r.color,active:!1}))},onAdd:n=>{Sn(t,n)}})}function Bn(t,e,n){const o=K.get(n);if(!o||o.locked)return;if(X===n){S(t),q();return}const s=Xt(o.name,M);Q(t,e.currentTarget,vt,{title:s?.label||"",removeLabel:w(t,"tw_classes_remove"),options:ie(t,s?.options,o.name),onPick:r=>{zt(t,o,r),S(t)},onRemove:()=>{zt(t,o,""),S(t)}}),X=n,q()}function q(){for(const t of u.groups)for(const e of t.chips)e.open=e.id===X}function Hn(t,e){if(!e||e.from==null||e.openTo==null){k=null,K=new Map,S(t),A(t);return}k={from:e.from,openTo:e.openTo,path:e.path,tag:e.tag},A(t)}function A(t){On(t);const e=k?V():null,n=e?Ut(e.value):{scope:null,groups:[]};K=new Map,u.baseLabel=w(t,"tw_size_base"),u.scopeTitle=w(t,"tw_classes_scope"),u.variant=yt(),u.onBreakpoint=r=>En(t,r),u.onState=r=>Mn(t,r.currentTarget);const o=ne();u.breakpoints=gt.map((r,a)=>({index:a,label:r.word?`${r.key}`:w(t,r.label),title:r.word?`${w(t,r.word)}  ·  < ${r.under}px`:w(t,r.all?"tw_size_all_title":"tw_size_base_title"),active:r.all?!o:o&&r.key===bt()})),u.state=P,u.stateLabel=P||w(t,"tw_state"),u.canEdit=!J(),u.onChip=(r,a)=>Bn(t,r,a),u.tag=k?.tag||"",u.scope=n.scope?.label||"",u.emptyText=w(t,k?n.groups.length?"tw_classes_none_size":"tw_classes_none":"tw_classes_pick"),u.groups=n.groups.filter(r=>kn(r.key)).map(r=>({key:r.key,current:r.key===u.variant,chips:r.items.map((a,i)=>{const l={...a,id:`${r.key}-${i}-${a.from}`,locked:a.dynamic||!u.canEdit,open:!1,color:a.dynamic?"":Cn(t,a.name),title:a.dynamic?w(t,"tw_classes_dynamic"):Yt(a.name,M)||a.raw};return K.set(l.id,l),l})}));const s=oe(t.document);s&&(se(t.document),ve(s,on)),q(),Gt(t,k?.path||""),Z("tw:changed")}function On(t){M||st||(st=!0,Pe(t).then(e=>{M=e,A(t)}).catch(()=>{st=!1}))}export{Pn as a,jn as b,S as c,Ln as d,Dn as e,jt as f,zn as g,At as h,In as i,Wn as j,we as p,Hn as r,qt as t};
