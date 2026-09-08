import{r as le,_ as ce,o as y,c as x,u as $,a as b,t as _,d as z,F as O,e as j,f as T,I as at,m as ue,n as dt,Q as R,H as P,T as de,a2 as xt,K as fe,w as U,L as pe,j as w,i as me,a9 as N,M as X,l as he,a8 as zt,N as ve}from"./addon-Dun4Kk-e.js";import{H as ge}from"./html-pick-align-gkRPeJkt.js";const Ot=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function Bt(t){return String(t||"").replace(/\{\{[\s\S]*?\}\}/g,e=>" ".repeat(e.length))}function be(t){const e=t.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(!e)return"";const n=e[2].match(/\[\s*([\s\S]*?)\s*\]/);if(n){const o=n[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).find(s=>/^[a-zA-Z_][\w-]*$/.test(s));if(o)return o}return(e[2].trim().split(/\s+/)[0]||"").replace(/\[|\]/g,"")}function Ft(t,e,n,o){t.hidden=!0,o&&(t.wrapFrom=e,t.wrapTo=n);for(const s of t.children)Ft(s,e,n,!1)}function Rt(t,e,n,o){const s=[],r=[];let a=n,i=0;const l=f=>{r.length?r[r.length-1].children.push(f):s.push(f)};for(;a<o;){if(e[a]!=="<"){a+=1;continue}if(e.startsWith("<!--",a)){const c=e.indexOf("-->",a+4),p=c===-1||c>o?o:c,M=c===-1||c+3>o?o:c+3,tt=Rt(t,e,a+4,p);for(const yt of tt)Ft(yt,a,M,!0),l(yt);a=M;continue}if(e.startsWith("<!",a)||e.startsWith("<?",a)){const c=e.indexOf(">",a+2);a=c===-1||c+1>o?o:c+1;continue}const f=e[a+1]==="/",m=e.slice(a,o).match(/^<\/?([a-zA-Z][a-zA-Z0-9:-]*)/);if(!m){a+=1;continue}const d=m[1].toLowerCase(),h=e.indexOf(">",a);if(h===-1||h>=o)break;const A=e.slice(a,h+1),q=!f&&(Ot.has(d)||/\/\s*>$/.test(A));if(f){for(let c=r.length-1;c>=0;c-=1)if(r[c].tag===d){r[c].to=h+1,r.length=c;break}a=h+1;continue}const V=be(t.slice(a,h+1)),B=r.length?r[r.length-1]:null,F=B?B.children:s,J=B?`${B.path}/${F.length}:${d}`:`${F.length}:${d}`,v={id:`${d}-${a}-${i}`,tag:d,klass:V,path:J,label:V,from:a,to:h+1,openTo:h+1,hidden:!1,children:[]};i+=1,l(v),q?v.to=h+1:r.push(v),a=h+1}for(;r.length;)r.pop().to=o;return s}function ye(t){const e=String(t||""),n=Bt(e);return Rt(e,n,0,n.length)}function It(t,e,n=0,o=[]){for(const s of t){const r=s.children.length>0,a=e.has(s.id);o.push({id:s.id,tag:s.tag,klass:s.klass||"",path:s.path,label:s.label,from:s.from,to:s.to,openTo:s.openTo,hidden:!!s.hidden,wrapFrom:s.wrapFrom,wrapTo:s.wrapTo,depth:n,hasChildren:r,shut:a}),r&&!a&&It(s.children,e,n+1,o)}return o}function Bn(t){return Ot.has(String(t||"").toLowerCase())}const Pt=["sm","md","lg","xl","2xl","max-sm","max-md","max-lg","max-xl","max-2xl","dark","hover","focus","focus-visible","active","disabled","group-hover"],wt={sm:"(min-width: 640px)",md:"(min-width: 768px)",lg:"(min-width: 1024px)",xl:"(min-width: 1280px)","2xl":"(min-width: 1536px)","max-sm":"(max-width: 639px)","max-md":"(max-width: 767px)","max-lg":"(max-width: 1023px)","max-xl":"(max-width: 1279px)","max-2xl":"(max-width: 1535px)",dark:"(prefers-color-scheme: dark)"},kt={hover:":hover",focus:":focus","focus-visible":":focus-visible",active:":active",disabled:":disabled","group-hover":":is(:where(.group):hover *)"},xe={relative:"position: relative",absolute:"position: absolute",fixed:"position: fixed",sticky:"position: sticky",static:"position: static",block:"display: block",inline:"display: inline","inline-block":"display: inline-block",flex:"display: flex","inline-flex":"display: inline-flex",grid:"display: grid",hidden:"display: none","flex-row":"flex-direction: row","flex-col":"flex-direction: column","flex-wrap":"flex-wrap: wrap","items-start":"align-items: flex-start","items-center":"align-items: center","items-end":"align-items: flex-end","items-stretch":"align-items: stretch","justify-start":"justify-content: flex-start","justify-center":"justify-content: center","justify-end":"justify-content: flex-end","justify-between":"justify-content: space-between","justify-around":"justify-content: space-around","text-left":"text-align: left","text-center":"text-align: center","text-right":"text-align: right","w-full":"width: 100%","h-full":"height: 100%","w-screen":"width: 100vw","h-screen":"height: 100vh","overflow-hidden":"overflow: hidden","overflow-auto":"overflow: auto","pointer-events-none":"pointer-events: none",underline:"text-decoration-line: underline",italic:"font-style: italic","font-bold":"font-weight: 700","font-medium":"font-weight: 500",uppercase:"text-transform: uppercase",truncate:"overflow: hidden; text-overflow: ellipsis; white-space: nowrap","z-10":"z-index: 10","z-20":"z-index: 20","z-50":"z-index: 50"},jt={p:"padding",px:"padding-inline",py:"padding-block",pt:"padding-top",pr:"padding-right",pb:"padding-bottom",pl:"padding-left",m:"margin",mx:"margin-inline",my:"margin-block",mt:"margin-top",mr:"margin-right",mb:"margin-bottom",ml:"margin-left",gap:"gap","gap-x":"column-gap","gap-y":"row-gap",w:"width",h:"height","min-w":"min-width","min-h":"min-height","max-w":"max-width","max-h":"max-height"},Dt={bg:"background-color",border:"border-color",outline:"outline-color",fill:"fill",stroke:"stroke"};let et=null;function Wt(t){return t?.Statamic?.$config?.get?.("sveFeatures")?.tailwind_dock===!0}function Fn(t){return e=>{if(!Wt(t)||!we(e))return null;const n=e.matchBefore(/[^\s"']*$/),o=n?.text??"";return o.includes("{")||o.includes("}")?null:ft(t).then(s=>{const r=_e(o,s).slice(0,80);return r.length?{from:n?n.from:e.pos,options:r,validFor:/^[^\s"'=]*$/}:null})}}function Rn(t,e){return t((n,o)=>{if(!Wt(e))return null;const s=ke(n.state,o);return s?ft(e).then(r=>{const a=Ce(s.text,r);return a?{pos:s.from,end:s.to,create(){return{dom:Ee(a,Te(s.text,r))}}}:null}):null})}function $t(t){const e={color:[],spacing:[],text:[],leading:[],font:[],radius:[]},n=/--(color|spacing|text|leading|font|radius)-([a-zA-Z0-9][a-zA-Z0-9._-]*)\s*:\s*([^;]+);/g;let o;for(;o=n.exec(String(t||""));)o[2]!=="*"&&e[o[1]].push({name:o[2],value:o[3].trim()});const s=[];Object.entries(xe).forEach(([a,i])=>{s.push({label:a,css:i,color:null})}),e.color.forEach(({name:a,value:i})=>{const l=Se(i);Object.entries(Dt).forEach(([f,m])=>{s.push({label:`${f}-${a}`,css:`${m}: var(--color-${a})`,color:l})}),s.push({label:`text-${a}`,css:`color: var(--color-${a})`,color:l})}),e.spacing.forEach(({name:a})=>{Object.entries(jt).forEach(([i,l])=>{s.push({label:`${i}-${a}`,css:`${l}: var(--spacing-${a})`,color:null})})}),e.text.forEach(({name:a})=>{s.push({label:`text-${a}`,css:`font-size: var(--text-${a})`,color:null})}),e.leading.forEach(({name:a})=>{s.push({label:`leading-${a}`,css:`line-height: var(--leading-${a})`,color:null})}),e.font.forEach(({name:a})=>{s.push({label:`font-${a}`,css:`font-family: var(--font-${a})`,color:null})}),e.radius.forEach(({name:a})=>{s.push({label:a==="DEFAULT"?"rounded":`rounded-${a}`,css:`border-radius: var(--radius-${a})`,color:null})});const r=new Map;return s.forEach(a=>{r.has(a.label)||r.set(a.label,a)}),{items:[...r.values()],byUtility:r}}function ft(t){return et||(et=t.fetch("/!/sve/tailwind-theme",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{css:""}).then(e=>$t(typeof e.css=="string"?e.css:"")).catch(()=>$t(""))),et}function we(t){return!!(t.matchBefore(/class\s*=\s*"[^"]*$/i)||t.matchBefore(/class\s*=\s*'[^']*$/i))}function ke(t,e){const n=t.doc.lineAt(e),o=e-n.from,s=$e(n.text,o);if(!s)return null;const r=n.text.slice(s.valueFrom,s.valueTo),a=o-s.valueFrom,i=r.slice(0,a),l=r.slice(a),f=(i.match(/[^\s]*$/)||[""])[0],m=(l.match(/^[^\s]*/)||[""])[0],d=f+m;if(!d||d.includes("{"))return null;const h=n.from+s.valueFrom+(i.length-f.length);return{from:h,to:h+d.length,text:d}}function $e(t,e){const n=/\bclass\s*=\s*(["'])/gi;let o;for(;o=n.exec(t);){const s=o[1],r=o.index+o[0].length,a=t.indexOf(s,r),i=a===-1?t.length:a;if(e>=r&&e<=i)return{valueFrom:r,valueTo:i}}return null}function pt(t){const e=[...Pt].sort((a,i)=>i.length-a.length),n=[];let o=String(t||""),s=!0;for(;s;){s=!1;for(const a of e){const i=`${a}:`;if(o.startsWith(i)){n.push(a),o=o.slice(i.length),s=!0;break}}}let r=!1;return o.startsWith("!")?(r=!0,o=o.slice(1)):o.endsWith("!")&&(r=!0,o=o.slice(0,-1)),{variants:n,utility:o,important:r}}function _e(t,e){const{variants:n,utility:o}=pt(t),s=n.length?`${n.join(":")}:`:"",r=o.toLowerCase(),a=[];return!r&&!s&&Pt.forEach(i=>{a.push({label:`${i}:`,type:"keyword",detail:"variant",boost:2})}),e.items.forEach(i=>{if(r&&!i.label.startsWith(r)&&!i.label.includes(r))return;const l=`${s}${i.label}`;a.push({label:l,type:"property",detail:i.css,boost:i.label.startsWith(r)?1:0})}),a.sort((i,l)=>(l.boost||0)-(i.boost||0)||i.label.localeCompare(l.label))}function Ce(t,e){const{variants:n,utility:o,important:s}=pt(t),r=e.byUtility.get(o);if(!r)return"";let a=r.css;s&&(a+=" !important");const i=t.replace(/[^a-zA-Z0-9_-]/g,d=>`\\${d}`);let l="";const f=[];n.forEach(d=>{wt[d]?f.push(wt[d]):kt[d]&&(l+=kt[d])});let m=`.${i}${l} { ${a} }`;return f.slice().reverse().forEach(d=>{m=`@media ${d} {
  ${m}
}`}),m}function Te(t,e){const{utility:n}=pt(t);return e.byUtility.get(n)?.color||null}function Se(t){const e=String(t||"").trim();return/^#([0-9a-fA-F]{3,8})$/.test(e)?e:null}function Ee(t,e){const n=document.createElement("div");if(n.className="sve-tw-info",e){const s=document.createElement("span");s.className="sve-tw-swatch",s.style.background=e,n.appendChild(s)}const o=document.createElement("pre");return o.textContent=t,n.appendChild(o),n}function Ht(t,e,n){const o=String(t||"").slice(e,n),s=Bt(o),r=/(\sclass\s*=\s*)(["'])/i.exec(s);if(!r)return null;const a=r[2],i=r.index+r[1].length+1,l=s.indexOf(a,i);return l===-1?null:{from:e+i,to:e+l,quote:a,value:o.slice(i,l)}}function Me(t){const e=String(t||""),n=[];let o=0;for(;o<e.length;){if(/\s/.test(e[o])){o+=1;continue}let s=o,r=!1;for(;s<e.length;){if(e.startsWith("{{",s)){const a=e.indexOf("}}",s+2);r=!0,s=a===-1?e.length:a+2;continue}if(/\s/.test(e[s]))break;s+=1}n.push({text:e.slice(o,s),from:o,to:s,dynamic:r}),o=s}return n}function Le(t){const e=String(t||""),n=[];let o=0,s=0;for(let a=0;a<e.length;a+=1){const i=e[a];i==="["||i==="("?o+=1:i==="]"||i===")"?o=Math.max(0,o-1):i===":"&&o===0&&(n.push(e.slice(s,a)),s=a+1)}const r=e.slice(s);return{variants:n,base:r}}function Ae(t){let n=String(t||""),o="";n.startsWith("!")?(o="pre",n=n.slice(1)):n.endsWith("!")&&(o="post",n=n.slice(0,-1));let s="";const r=ze(n);return r!==-1&&(s=n.slice(r),n=n.slice(0,r)),{name:n,modifier:s,important:o}}function ze(t){let e=0;for(let n=0;n<t.length;n+=1){const o=t[n];if(o==="["||o==="(")e+=1;else if(o==="]"||o===")")e=Math.max(0,e-1);else if(o==="/"&&e===0)return n}return-1}function it({variants:t,name:e,modifier:n,important:o}){let s=`${e}${n||""}`;return o==="pre"?s=`!${s}`:o==="post"&&(s=`${s}!`),[...t||[],s].join(":")}function qt(t){const e=Me(t),n=new Map;let o=null,s=0;const r=e.findIndex(i=>i.text==="]");if(e[0]?.text==="["&&r>0){const i=e.slice(1,r);o={from:e[0].from,to:e[r].to,label:`[ ${i.map(l=>l.text).join(" ")} ]`},s=r+1}for(;s<e.length;s+=1){const i=e[s],{variants:l,base:f}=Le(i.text),{name:m,modifier:d,important:h}=Ae(f),A=l.join(":");n.has(A)||n.set(A,{key:A,variants:l,items:[]}),n.get(A).items.push({raw:i.text,from:i.from,to:i.to,dynamic:i.dynamic,variants:l,name:m,modifier:d,important:h})}const a=[...n.values()];return a.sort((i,l)=>i.key===""?-1:l.key===""?1:0),{scope:o,groups:a}}function lt(t,e,n){const o=String(t||"");if(n)return o.slice(0,e.from)+n+o.slice(e.to);let s=e.from,r=e.to;if(s>0&&(o[s-1]===" "||o[s-1]==="	"))for(;s>0&&(o[s-1]===" "||o[s-1]==="	");)s-=1;else for(;r<o.length&&(o[r]===" "||o[r]==="	");)r+=1;return Oe(o.slice(0,s)+o.slice(r),s)}function Oe(t,e){const n=t.lastIndexOf(`
`,Math.max(0,e-1));if(n===-1)return t;const o=t.indexOf(`
`,n+1);return t.slice(n+1,o===-1?t.length:o).trim()!==""?t:t.slice(0,n)+t.slice(o===-1?t.length:o)}function Vt(t,e){const n=String(t||"");return n.trim()?`${n.replace(/\s+$/,"")} ${e}`:e}function Be(t,e,n){const o=Ht(t,e.from,e.openTo);if(o)return t.slice(0,o.from)+n+t.slice(o.to);const s=String(t).slice(e.from,e.openTo),r=/^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(s);if(!r||!n)return t;const a=e.from+r[0].length;return`${t.slice(0,a)} class="${n}"${t.slice(a)}`}const Fe=[...Object.keys(jt),...Object.keys(Dt),"text","leading","font","rounded"].sort((t,e)=>e.length-t.length);let nt=null;function Re(t){return nt||(nt=ft(t).then(Ie)),nt}function Ut(t){const e=String(t||"");if(e.includes(";"))return"";const n=e.indexOf(":");return n===-1?"":e.slice(0,n).trim()}function Ie(t){const e=new Map,n=new Map,o=new Map;for(const s of t.items){const r=Ut(s.css);r&&(e.has(r)||e.set(r,[]),e.get(r).push(s),n.set(s.label,r));const a=Nt(s.label);a&&(o.has(a)||o.set(a,[]),o.get(a).push(s))}return{catalog:t,byProperty:e,propertyOfUtility:n,byPrefix:o}}function Nt(t){for(const e of Fe)if(String(t).startsWith(`${e}-`))return e;return""}function Zt(t,e){if(!e||!t)return null;const n=e.propertyOfUtility.get(t);if(n)return{label:n,options:e.byProperty.get(n)||[]};const o=Nt(t),s=o?e.byPrefix.get(o):null;return s?.length?{label:Ut(s[0].css)||o,options:s}:null}function Kt(t,e){return e?.catalog?.byUtility?.get(t)?.css||""}function Pe(t,e){return e?.catalog?.byUtility?.get(t)?.color||""}const u=le({emptyText:"",tag:"",scope:"",scopeTitle:"",baseLabel:"",groups:[],canEdit:!1,onChip:null,variant:"",breakpoints:[],onBreakpoint:null,state:"",stateLabel:"",onState:null,siteClasses:[]}),C="__sve-tw-strip",_t="__sve-tw-strip-style";let Ct=!1;function Xt(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o}catch{}return null}function je(t){if(t.getElementById(_t))return;const e=t.createElement("style");e.id=_t,e.textContent=`
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
  `,t.head.appendChild(e)}function De(t){t?.document.getElementById(C)?.remove()}function We(t){if(Ct)return;Ct=!0;const e=()=>Yt(t);t.addEventListener("resize",e),t.addEventListener("scroll",e,!0);const n=Xt(t);try{n?.contentWindow?.addEventListener("scroll",e,!0)}catch{}}function Yt(t,e){if(!t)return;const n=t.document,o=Xt(t),s=o?.contentDocument,r=e&&s?s.querySelector(`[data-sve-ht-path="${e}"]`):null;if(!r||!u.groups.length){De(t);return}je(n),We(t);let a=n.getElementById(C);a||(a=n.createElement("div"),a.id=C,n.body.appendChild(a)),a.replaceChildren();const i=n.createElement("span");i.setAttribute("data-sve-tw-strip-tag",""),i.textContent=`<${u.tag}>`,a.appendChild(i);for(const f of u.groups)for(const m of f.chips){const d=n.createElement("button");if(d.type="button",d.title=m.title||"",m.locked&&d.setAttribute("data-locked",""),m.color){const h=n.createElement("span");h.setAttribute("data-dot",""),h.style.background=m.color,d.appendChild(h)}d.appendChild(n.createTextNode(m.raw)),m.locked||d.addEventListener("click",h=>{h.preventDefault(),h.stopPropagation(),u.onChip?.(h,m.id)}),a.appendChild(d)}const l=n.createElement("button");l.type="button",l.setAttribute("data-add",""),l.textContent="+",l.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),Mn(t,f.currentTarget)}),a.appendChild(l),He(t,a,o,r)}function He(t,e,n,o){const s=n.getBoundingClientRect(),r=n.clientWidth?s.width/n.clientWidth:1,a=o.getBoundingClientRect(),i=e.getBoundingClientRect(),l=6,f=s.left+a.left*r,m=s.top+a.top*r-i.height-l,d=s.top+a.top*r+l;e.style.left=`${Math.max(l,Math.min(f,t.innerWidth-i.width-l))}px`,e.style.top=`${Math.max(s.top+l,m<s.top?d:m)}px`,e.hidden=a.bottom*r+s.top<s.top||a.top*r+s.top>s.bottom}const qe={class:"sve-tw"},Ve={key:0,class:"sve-tw-head"},Ue={class:"sve-tw-tag"},Ne=["title"],Ze=["title","data-active","disabled","onClick"],Ke=["data-active","disabled"],Xe={key:1,class:"sve-tw-empty"},Ye=["data-sve-tw-base","data-current"],Ge={class:"sve-tw-chips"},Qe=["title","onClick"],Je={__name:"TwClassList",setup(t){function e(n){const o={"data-sve-tw-chip":n.id};return n.locked&&(o["data-sve-tw-locked"]=""),n.open&&(o["data-open"]=""),o}return(n,o)=>(y(),x("div",qe,[$(u).tag?(y(),x("div",Ve,[b("span",Ue,"<"+_($(u).tag)+">",1),$(u).scope?(y(),x("span",{key:0,class:"sve-tw-scope",title:$(u).scopeTitle},_($(u).scope),9,Ne)):z("",!0),o[2]||(o[2]=b("span",{class:"sve-tw-gap"},null,-1)),(y(!0),x(O,null,j($(u).breakpoints,s=>(y(),x("button",{key:s.index,type:"button","data-sve-tw-bp":"",title:s.title,"data-active":s.active?"":void 0,disabled:!$(u).canEdit,onClick:T(r=>$(u).onBreakpoint?.(s.index),["prevent","stop"])},_(s.label),9,Ze))),128)),b("button",{type:"button","data-sve-tw-state":"","data-active":$(u).state?"":void 0,disabled:!$(u).canEdit,onClick:o[0]||(o[0]=T(s=>$(u).onState?.(s),["prevent","stop"]))},[at(_($(u).stateLabel)+" ",1),o[1]||(o[1]=b("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[b("path",{d:"m6 9 6 6 6-6"})],-1))],8,Ke)])):z("",!0),$(u).groups.length?z("",!0):(y(),x("div",Xe,_($(u).emptyText),1)),(y(!0),x(O,null,j($(u).groups,s=>(y(),x("div",{key:s.key,class:"sve-tw-group"},[b("span",{class:"sve-tw-variant","data-sve-tw-base":s.key===""?"":void 0,"data-current":s.current?"":void 0},_(s.key===""?$(u).baseLabel:s.key),9,Ye),b("div",Ge,[(y(!0),x(O,null,j(s.chips,r=>(y(),x("button",ue({key:r.id,type:"button"},{ref_for:!0},e(r),{title:r.title,onClick:T(a=>$(u).onChip?.(a,r.id),["prevent","stop"])}),[r.color?(y(),x("span",{key:0,class:"sve-tw-dot",style:dt({background:r.color})},null,4)):z("",!0),at(" "+_(r.raw),1)],16,Qe))),128))])]))),128))]))}},tn=ce(Je,[["__scopeId","data-v-33c4f5f2"]]),en={key:0,"data-sve-tw-menu-title":""},nn={"data-sve-tw-menu-list":""},on=["data-active","title","onClick"],sn={"data-sve-tw-tick":""},rn={"data-sve-tw-label":""},mt={__name:"TwClassMenu",props:{title:{type:String,default:""},options:{type:Array,default:()=>[]},removeLabel:{type:String,default:""},onPick:{type:Function,required:!0},onRemove:{type:Function,required:!0}},setup(t){return(e,n)=>(y(),x(O,null,[t.title?(y(),x("div",en,_(t.title),1)):z("",!0),b("div",nn,[(y(!0),x(O,null,j(t.options,o=>(y(),x("button",{key:o.label,type:"button","data-sve-tw-option":"","data-active":o.active?"":void 0,title:o.css,onClick:T(s=>t.onPick(o.label),["prevent","stop"])},[b("span",sn,_(o.active?"✓":""),1),o.color?(y(),x("span",{key:0,"data-sve-tw-dot":"",style:dt({background:o.color})},null,4)):z("",!0),b("span",rn,_(o.label),1)],8,on))),128))]),b("button",{type:"button","data-sve-tw-remove":"",onClick:n[0]||(n[0]=T(o=>t.onRemove(),["prevent","stop"]))},[n[1]||(n[1]=b("span",{"data-sve-tw-tick":""},"✕",-1)),at(_(t.removeLabel),1)])],64))}},an={"data-sve-tw-search":""},ln=["placeholder","aria-label","onKeydown"],cn={"data-sve-tw-tabs":""},un=["data-active"],dn=["data-active"],fn={key:0,"data-sve-tw-add-empty":""},pn=["data-cursor","data-active","data-sve-tw-off","title","onMouseenter","onClick"],mn={"data-sve-tw-label":""},hn={__name:"TwAddClass",props:{label:{type:String,default:""},placeholder:{type:String,default:""},sitePlaceholder:{type:String,default:""},emptyText:{type:String,default:""},offText:{type:String,default:""},siteLabel:{type:String,default:""},tailwindLabel:{type:String,default:""},search:{type:Function,required:!0},onAdd:{type:Function,required:!0}},setup(t){const e=t,n=R(""),o=R(null),s=R("tailwind"),r=R(null),a=R(-1),i=R(!1),l=P(()=>n.value.trim().toLowerCase()),f=P(()=>(u.siteClasses||[]).flatMap(v=>v.items).filter(v=>!l.value||v.name.toLowerCase().includes(l.value))),m=P(()=>e.search(n.value)),d=P(()=>s.value==="site"?f.value:m.value),h=P(()=>s.value==="site"?e.sitePlaceholder:e.placeholder);de(()=>xt(()=>o.value?.focus()));function A(v){return v?.name||v?.label||""}function q(v){i.value=!0;const c=d.value.length;if(!c){a.value=-1;return}const p=a.value+v;a.value=p<0?-1:Math.min(p,c-1),xt(()=>V())}function V(){const v=r.value?.querySelector("[data-cursor]");if(!v)return;let c=v.parentElement;for(;c&&c.scrollHeight<=c.clientHeight;)c=c.parentElement;if(!c)return;const p=v.offsetTop,M=p+v.offsetHeight;p<c.scrollTop?c.scrollTop=p:M>c.scrollTop+c.clientHeight&&(c.scrollTop=M-c.clientHeight)}function B(v){i.value||(a.value=v)}function F(){a.value=-1}function J(){const v=a.value>=0?d.value[a.value]:null,c=v?A(v):n.value.trim();c&&e.onAdd(c)}return(v,c)=>(y(),x(O,null,[b("div",an,[c[7]||(c[7]=b("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[b("circle",{cx:"11",cy:"11",r:"7"}),b("path",{d:"m20 20-3.5-3.5"})],-1)),fe(b("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":c[0]||(c[0]=p=>n.value=p),type:"text",placeholder:h.value,"aria-label":t.label,onInput:F,onKeydown:[c[1]||(c[1]=U(T(p=>q(1),["prevent"]),["down"])),c[2]||(c[2]=U(T(p=>q(-1),["prevent"]),["up"])),U(T(J,["prevent"]),["enter"]),c[3]||(c[3]=U(T(()=>{},["stop"]),["escape"]))]},null,40,ln),[[pe,n.value]])]),b("div",cn,[b("button",{type:"button","data-sve-tw-tab":"","data-active":s.value==="tailwind"?"":void 0,onClick:c[4]||(c[4]=T(p=>{s.value="tailwind",F()},["prevent","stop"]))},_(t.tailwindLabel),9,un),b("button",{type:"button","data-sve-tw-tab":"","data-active":s.value==="site"?"":void 0,onClick:c[5]||(c[5]=T(p=>{s.value="site",F()},["prevent","stop"]))},_(t.siteLabel),9,dn)]),d.value.length?z("",!0):(y(),x("div",fn,_(t.emptyText),1)),b("div",{ref_key:"rowsEl",ref:r,onMousemove:c[6]||(c[6]=p=>i.value=!1)},[(y(!0),x(O,null,j(d.value,(p,M)=>(y(),x("button",{key:p.name||p.label,type:"button","data-sve-tw-option":"","data-cursor":M===a.value?"":void 0,"data-active":M===a.value?"":void 0,"data-sve-tw-off":p.loaded===!1?"":void 0,title:p.loaded===!1?t.offText:p.file||p.css,onMouseenter:tt=>B(M),onClick:T(tt=>t.onAdd(p.name||p.label),["prevent","stop"])},[p.color?(y(),x("span",{key:0,"data-sve-tw-dot":"",style:dt({background:p.color})},null,4)):z("",!0),b("span",mn,_(p.name||p.label),1)],40,pn))),128))],544)],64))}},g="__sve-tw-menu",Tt="__sve-tw-style",ht=[{key:"",all:!0,device:"Responsive",label:"tw_size_all"},{key:"",device:"Laptop",label:"tw_size_base"},{key:"max-lg",device:"Tablet",word:"responsive_tablet",under:1024},{key:"max-md",device:"Mobile",word:"responsive_mobile",under:768}],St=["","dark","hover","focus","active","before","after"],Gt={Mobile:"max-md",Tablet:"max-lg",Laptop:"",Desktop:""};let Qt="",I="",Y=!1;function vn(){try{return Gt[zt(window,"sve-lp-device")]??""}catch{return""}}function vt(){return Y?Qt:vn()}function Jt(){return[vt(),I].filter(Boolean)}function gt(){return Jt().join(":")}const gn=/^(max-)?(sm|md|lg|xl|2xl)$/;function bn(t){return String(t||"").split(":").find(e=>gn.test(e))||""}function te(){if(Y)return!0;try{return Object.prototype.hasOwnProperty.call(Gt,zt(window,"sve-lp-device"))}catch{return!1}}function yn(t){if(!te())return!0;const e=bn(t);return e===vt()?!0:!ht.some(n=>n.key===e)}let k=null,Z=new Map,E=null,ot=!1,K="",ct=null;function ee(t){return t?.querySelector?.('[data-sve-style="tw"] [data-sve-tw-host]')||null}function ne(t){if(t.getElementById(Tt))return;const e=t.createElement("style");e.id=Tt,e.textContent=`
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
  `,t.head.appendChild(e)}function oe(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e.contentDocument;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o.contentDocument}catch{}return null}function xn(t,e,n){const o=oe(t);if(!(!o||!k?.path))for(const s of o.querySelectorAll(`[${ge}="${k.path}"]`))try{e&&s.classList.remove(e),n&&s.classList.add(n)}catch{}}const st=new Map,wn=/(^|-)color$|^fill$|^stroke$/;function bt(t){const e=String(t||""),n=e.slice(0,e.indexOf(":")).trim();return wn.test(n)&&/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(e)?.[1]||""}function se(t,e){if(!e)return"";if(st.has(e))return st.get(e);const n=oe(t),o=n?.documentElement,s=n?.defaultView;if(!o||!s)return"";let r="",a=e;for(let i=0;i<6&&a;i+=1){try{r=s.getComputedStyle(o).getPropertyValue(a).trim()}catch{return""}if(!r)return"";if(a=bt(r),!a)break}return r&&!r.startsWith("var(")?(st.set(e,r),r):""}function kn(t,e){return Pe(e,E)||se(t,bt(Kt(e,E)))}function S(t){const e=t?.document.getElementById(g);ct?.(),ct=null,K="",e&&(e._sveApp?.unmount(),e.remove())}function Et(t,e,n){const o=e.getBoundingClientRect(),s=n.offsetWidth||176,r=8,a=140,i=o.bottom+4,l=t.innerHeight-i-r,f=Math.max(a,Math.min(l,420));n.style.left=`${Math.max(r,Math.min(o.left,t.innerWidth-s-r))}px`,n.style.maxHeight=`${f}px`,n.style.top=`${l>=a?i:Math.max(r,t.innerHeight-r-f)}px`}function G(t,e,n,o){const s=t.document;S(t),ne(s);const r=s.createElement("div");r.id=g,s.body.appendChild(r),r._sveApp=he(n,r,o),Et(t,e,r);const a=()=>Et(t,e,r),i=f=>{!r.contains(f.target)&&!e.contains(f.target)&&(S(t),W())},l=f=>{f.key==="Escape"&&(S(t),W())};return s.addEventListener("pointerdown",i,!0),s.addEventListener("keydown",l,!0),t.addEventListener("scroll",a,!0),t.addEventListener("resize",a),ct=()=>{s.removeEventListener("pointerdown",i,!0),s.removeEventListener("keydown",l,!0),t.removeEventListener("scroll",a,!0),t.removeEventListener("resize",a)},r}function re(t,e,n){return(e||[]).map(o=>({label:o.label,css:o.css,color:o.color||se(t,bt(o.css)),active:o.label===n}))}function Q(){return!k||X("dock:is-locked")===!0}function H(){const t=X("dock:html");if(!k||typeof t!="string"||t[k.from]!=="<")return null;const e=Ht(t,k.from,k.openTo);return{html:t,value:e?e.value:""}}function $n(t){if(!k?.path)return;const n=It(ye(t),new Set).find(o=>o.path===k.path);n&&(k={from:n.from,openTo:n.openTo,path:n.path,tag:n.tag})}function D(t,e,n,o,s){const r=Be(e,k,n);r!==e&&(xn(t,o,s),X("dock:set-html",r),$n(r),L(t))}function ut(t){return Zt(t,E)?.label||""}function ae(t){return qt(t).groups.flatMap(e=>e.items)}function ie(t){const e=gt();return ae(t).filter(n=>!n.dynamic&&n.variants.join(":")===e)}function Mt(t,e){if(Q()||!e)return;const n=H();if(!n)return;const o=ut(e),s=ie(n.value).find(a=>a.name===e||o&&ut(a.name)===o);if(s?.name===e){D(t,n.html,lt(n.value,s,""),e,"");return}if(s){const a=it({variants:s.variants,name:e,modifier:s.modifier,important:s.important});D(t,n.html,lt(n.value,s,a),s.raw,a);return}const r=it({variants:Jt(),name:e,modifier:"",important:""});D(t,n.html,Vt(n.value,r),"",r)}function _n(t,e){const n=String(e||"").trim(),o=gt(),s=o&&!n.includes(":")?`${o}:${n}`:n;if(Q()||!n)return;const r=H();!r||ae(r.value).some(i=>i.raw===s)||D(t,r.html,Vt(r.value,s),"",s.includes(":")?"":s)}function Lt(t,e,n){if(Q())return;const o=H();if(!o||o.value.slice(e.from,e.to)!==e.raw){L(t);return}const s=n?it({variants:e.variants,name:n,modifier:e.modifier,important:e.important}):"";D(t,o.html,lt(o.value,e,s),e.raw,s)}function In(){return!!k}function Cn(t,e){const n=ht[e];n&&(X("lp:set-device",{win:t,key:n.device}),Y=!n.all,Qt=n.key,S(t),L(t),N("tw:changed"))}function Tn(t,e){G(t,e,mt,{title:w(t,"tw_state"),removeLabel:w(t,"tw_state_none"),options:St.filter(Boolean).map(n=>({label:n,css:"",color:null,active:n===I})),onPick:n=>{I=St.includes(n)?n:"",S(t),L(t),N("tw:changed")},onRemove:()=>{I="",S(t),L(t),N("tw:changed")}})}ve("lp:device",()=>{Y=!1,ee(window.document)&&L(window)});function Sn(t){const e=t?H():null;return e&&ie(e.value).find(n=>ut(n.name)===t)?.name||""}function Pn(t,e,n,o){const s=E?.byProperty.get(n)||[];if(!s.length)return;const r=Sn(n);G(t,e,mt,{title:n,removeLabel:w(t,"tw_classes_remove"),options:re(t,s,r),onPick:a=>{Mt(t,a),S(t),o?.(a)},onRemove:()=>{r&&Mt(t,r),S(t),o?.("")}})}let At=[],rt=!1;function En(t){rt||(rt=!0,t.fetch("/!/sve/site-css/classes",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{groups:[]}).then(e=>{At=Array.isArray(e?.groups)?e.groups:[],u.siteClasses=At}).catch(()=>{rt=!1}))}function Mn(t,e){En(t),G(t,e,hn,{label:w(t,"tw_add_class"),placeholder:w(t,"tw_add_placeholder"),emptyText:w(t,"tw_add_empty"),offText:w(t,"tw_class_not_imported"),sitePlaceholder:w(t,"tw_add_placeholder_site"),siteLabel:w(t,"tw_add_site"),tailwindLabel:w(t,"tw_add_tailwind"),search:n=>{const o=String(n||"").trim().toLowerCase();return!o||!E?[]:E.catalog.items.filter(s=>s.label.toLowerCase().includes(o)).slice(0,40).map(s=>({label:s.label,css:s.css,color:s.color,active:!1}))},onAdd:n=>{_n(t,n)}})}function Ln(t,e,n){const o=Z.get(n);if(!o||o.locked)return;if(K===n){S(t),W();return}const s=Zt(o.name,E);G(t,e.currentTarget,mt,{title:s?.label||"",removeLabel:w(t,"tw_classes_remove"),options:re(t,s?.options,o.name),onPick:r=>{Lt(t,o,r),S(t)},onRemove:()=>{Lt(t,o,""),S(t)}}),K=n,W()}function W(){for(const t of u.groups)for(const e of t.chips)e.open=e.id===K}function jn(t,e){if(!e||e.from==null||e.openTo==null){k=null,Z=new Map,S(t),L(t);return}k={from:e.from,openTo:e.openTo,path:e.path,tag:e.tag},L(t)}function L(t){An(t);const e=k?H():null,n=e?qt(e.value):{scope:null,groups:[]};Z=new Map,u.baseLabel=w(t,"tw_size_base"),u.scopeTitle=w(t,"tw_classes_scope"),u.variant=gt(),u.onBreakpoint=r=>Cn(t,r),u.onState=r=>Tn(t,r.currentTarget);const o=te();u.breakpoints=ht.map((r,a)=>({index:a,label:r.word?`${r.key}`:w(t,r.label),title:r.word?`${w(t,r.word)}  ·  < ${r.under}px`:w(t,r.all?"tw_size_all_title":"tw_size_base_title"),active:r.all?!o:o&&r.key===vt()})),u.state=I,u.stateLabel=I||w(t,"tw_state"),u.canEdit=!Q(),u.onChip=(r,a)=>Ln(t,r,a),u.tag=k?.tag||"",u.scope=n.scope?.label||"",u.emptyText=w(t,k?n.groups.length?"tw_classes_none_size":"tw_classes_none":"tw_classes_pick"),u.groups=n.groups.filter(r=>yn(r.key)).map(r=>({key:r.key,current:r.key===u.variant,chips:r.items.map((a,i)=>{const l={...a,id:`${r.key}-${i}-${a.from}`,locked:a.dynamic||!u.canEdit,open:!1,color:a.dynamic?"":kn(t,a.name),title:a.dynamic?w(t,"tw_classes_dynamic"):Kt(a.name,E)||a.raw};return Z.set(l.id,l),l})}));const s=ee(t.document);s&&(ne(t.document),me(s,tn)),W(),Yt(t,k?.path||""),N("tw:changed")}function An(t){E||ot||(ot=!0,Re(t).then(e=>{E=e,L(t)}).catch(()=>{ot=!1}))}export{Fn as a,Rn as b,S as c,Sn as d,Pn as e,It as f,Mn as g,Mt as h,Bn as i,In as j,ye as p,jn as r,Wt as t};
