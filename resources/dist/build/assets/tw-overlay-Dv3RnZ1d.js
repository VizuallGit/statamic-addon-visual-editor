import{r as Ie,_ as De,o as $,c as C,u as T,a as b,f as M,t as P,F,e as Z,I as ht,d as q,m as Fe,n as kt,M as z,H as N,N as ee,a2 as gt,K as ne,w as W,L as oe,j as S,l as je,i as qe,a9 as et,P as j,a8 as $t,T as We,A as He}from"./addon-1HDb-ect.js";import{H as Ne}from"./html-pick-align-Cjtvi4Nz.js";const rt="__sve-partial-menu",Ve=/\{\{#([\s\S]*?)#\}\}/g,Dt=/\{\{\s*partial(?::([^\s}]+)|(?=[\s}]))([\s\S]*?)\}\}/gi,ct=new Map;function Ct(t){const e=String(t||"").replace(Ve,r=>" ".repeat(r.length)),n=[];Dt.lastIndex=0;let o;for(;o=Dt.exec(e);){const r=(o[1]||"").trim(),s=(o[2]||"").match(/\bsrc\s*=\s*(["'])([^"']+)\1/i),i=r||(s?s[2].trim():"");!i||i.includes("..")||n.push({from:o.index,to:o.index+o[0].length,src:i})}return n}function Ft(t,e){return Ct(t).find(n=>e>=n.from&&e<=n.to)||null}const Ue=new Set(["if","elseif","else","unless","foreach","forelse","noparse","once","cache","nocache","section","yield","partial","slot","switch","case","vite","sve_html","sve_css","sve_js","sve_tw","style_push","script_push"]);function Xe(t,e){const n=[],o=/\{\{\s*(\/?)([A-Za-z_][A-Za-z0-9_]*)\b[\s\S]*?\}\}/g;let r;for(;r=o.exec(String(t||""));){const s=r[2];if(!Ue.has(s.toLowerCase())){if(!r[1]){n.push({name:s,from:r.index,to:null});continue}for(let i=n.length-1;i>=0;i-=1)if(n[i].name===s&&n[i].to==null){n[i].to=r.index+r[0].length;break}}}let a=null;for(const s of n)s.to==null||e<s.from||e>s.to||(!a||s.to-s.from<a.to-a.from)&&(a=s);return a?.name||null}function Ze(t,e){const n=new Set,o=r=>{if(Array.isArray(r)){if(!e){for(const a of r)a&&typeof a=="object"&&typeof a.type=="string"&&a.type&&n.add(a.type),o(a);return}r.forEach(o);return}if(!(!r||typeof r!="object")){if(e&&Array.isArray(r[e]))for(const a of r[e])a&&typeof a=="object"&&typeof a.type=="string"&&a.type&&n.add(a.type);Object.values(r).forEach(o)}};return o(t),n}function Ke(t,e,n,o){if(!t.src.includes("{")||!o)return e;const r=Xe(n,t.from),a=Ze(o,r);return r?e.filter(s=>a.has(s.label)):a.size===0?e:e.filter(s=>a.has(s.label))}function Ye(t,e){if(ct.has(e))return ct.get(e);const n=t.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():{items:[]}).then(o=>Array.isArray(o.items)?o.items:[]).catch(()=>[]);return ct.set(e,n),n}let Q=null;function jt(t){t.clearTimeout(Q),Q=null}function Ge(t,e){Q||(Q=t.setTimeout(()=>{Q=null,e?.()},180))}function V(t){t?.getElementById(rt)?.remove()}function Je(t,e,n,o,{onOpen:r,emptyLabel:a,onStay:s,onLeave:i}){const l=t.document;V(l);const d=l.createElement("div");if(d.id=rt,d.style.left=`${Math.max(8,Math.round(n))}px`,d.style.top=`${Math.max(8,Math.round(o))}px`,e.length)e.forEach(g=>{const v=l.createElement("button");v.type="button",v.setAttribute("data-sve-partial-choice",""),v.textContent=g.label,v.title=g.path||g.type,v.addEventListener("click",A=>{A.preventDefault(),A.stopPropagation(),V(l),r?.(g.type)}),d.appendChild(v)});else{const g=l.createElement("div");g.setAttribute("data-sve-partial-empty",""),g.textContent=a||"",d.appendChild(g)}l.body.appendChild(d);const p=d.getBoundingClientRect(),c=8;let u=p.left,h=p.top;p.right>t.innerWidth-c&&(u=Math.max(c,t.innerWidth-p.width-c)),p.bottom>t.innerHeight-c&&(h=Math.max(c,t.innerHeight-p.height-c)),d.style.left=`${Math.round(u)}px`,d.style.top=`${Math.round(h)}px`,d.addEventListener("mouseenter",()=>s?.()),d.addEventListener("mouseleave",()=>i?.())}function Lo(t){const e=t.Decoration.mark({class:"sve-cm-partial"}),n=t.Decoration.line({class:"sve-cm-partial-line"}),o=t.StateEffect.define(),r=t.StateField.define({create(s){return qt(s,t,e)},update(s,i){return i.docChanged?qt(i.state,t,e):s},provide:s=>t.EditorView.decorations.from(s)}),a=t.StateField.define({create(){return t.Decoration.none},update(s,i){let l;for(const u of i.effects)u.is(o)&&(l=u.value);if(l===void 0)return i.docChanged?t.Decoration.none:s;if(!l)return t.Decoration.none;const d=new t.RangeSetBuilder,p=i.state.doc.lineAt(l.from),c=i.state.doc.lineAt(l.to);for(let u=p.number;u<=c.number;u+=1){const h=i.state.doc.line(u);d.add(h.from,h.from,n)}return d.finish()},provide:s=>t.EditorView.decorations.from(s)});return{extensions:[r,a],setHover(s,i){s&&s.dispatch({effects:o.of(i)})}}}function qt(t,e,n){const o=new e.RangeSetBuilder;for(const r of Ct(t.doc.toString()))o.add(r.from,r.to,n);return o.finish()}function Ao(t,e,{onOpen:n,emptyLabel:o,sectionValues:r,isLocked:a,setHover:s}){if(!e?.dom||e.dom._svePartialBound)return;e.dom._svePartialBound=!0;let i=null,l="",d="";const p=()=>{jt(t),t.clearTimeout(i),i=null,d="",l="",s?.(e,null),V(t.document)},c={stay:()=>jt(t),leave:()=>Ge(t,p)},u=()=>{t.clearTimeout(i),i=null,d="",s?.(e,null)},h=()=>!!a?.(),g=(v,A,L,{click:I}={})=>{if(h()){V(t.document),s?.(e,null);return}l=v.src,Ye(t,v.src).then(w=>{if(l!==v.src)return;const f=e.state.doc.toString(),x=Ke(v,w,f,r?.()||null);if(x.length===1){I&&(V(t.document),n?.(x[0].type));return}!x.length&&!I||Je(t,x,A,L,{onOpen:n,emptyLabel:o,onStay:c.stay,onLeave:c.leave})})};e.dom.addEventListener("mousemove",v=>{if(h()){p();return}const A=e.posAtCoords({x:v.clientX,y:v.clientY});if(A==null)return;const L=Ft(e.state.doc.toString(),A);if(!L){t.clearTimeout(i),i=null,d="",c.leave();return}c.stay(),s?.(e,{from:L.from,to:L.to}),!(d===L.src&&i)&&(u(),d=L.src,i=t.setTimeout(()=>{const I=e.coordsAtPos(L.from);g(L,I?.left??v.clientX,(I?.bottom??v.clientY)+6)},280))}),e.dom.addEventListener("mouseleave",v=>{if(v.relatedTarget?.closest?.(`#${rt}`)){c.stay();return}c.leave()}),e.dom.addEventListener("click",v=>{if(h()){V(t.document);return}const A=e.posAtCoords({x:v.clientX,y:v.clientY});if(A==null)return;const L=Ft(e.state.doc.toString(),A);L&&(u(),g(L,v.clientX,v.clientY+8,{click:!0}))}),Qe(t.document)||(t.document.addEventListener("mousedown",v=>{v.target.closest(`#${rt}, .sve-cm-partial`)||V(t.document)}),t.document._svePartialDismiss=!0)}function Qe(t){return!!t._svePartialDismiss}const re=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function se(t){return String(t||"").replace(/\{\{[\s\S]*?\}\}/g,e=>" ".repeat(e.length))}function tn(t){const e=t.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(!e)return"";const n=e[2].match(/\[\s*([\s\S]*?)\s*\]/);if(n){const o=n[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).find(r=>/^[a-zA-Z_][\w-]*$/.test(r));if(o)return o}return(e[2].trim().split(/\s+/)[0]||"").replace(/\[|\]/g,"")}function ae(t,e,n,o){t.hidden=!0,o&&(t.wrapFrom=e,t.wrapTo=n);for(const r of t.children)ae(r,e,n,!1)}function ie(t,e,n,o){const r=[],a=[];let s=n,i=0;const l=d=>{a.length?a[a.length-1].children.push(d):r.push(d)};for(;s<o;){if(e[s]!=="<"){s+=1;continue}if(e.startsWith("<!--",s)){const f=e.indexOf("-->",s+4),x=f===-1||f>o?o:f,D=f===-1||f+3>o?o:f+3,lt=ie(t,e,s+4,x);for(const It of lt)ae(It,s,D,!0),l(It);s=D;continue}if(e.startsWith("<!",s)||e.startsWith("<?",s)){const f=e.indexOf(">",s+2);s=f===-1||f+1>o?o:f+1;continue}const d=e[s+1]==="/",p=e.slice(s,o).match(/^<\/?([a-zA-Z][a-zA-Z0-9:-]*)/);if(!p){s+=1;continue}const c=p[1].toLowerCase(),u=e.indexOf(">",s);if(u===-1||u>=o)break;const h=e.slice(s,u+1),g=!d&&(re.has(c)||/\/\s*>$/.test(h));if(d){for(let f=a.length-1;f>=0;f-=1)if(a[f].tag===c){a[f].to=u+1,a.length=f;break}s=u+1;continue}const v=tn(t.slice(s,u+1)),A=a.length?a[a.length-1]:null,L=A?A.children:r,I=A?`${A.path}/${L.length}:${c}`:`${L.length}:${c}`,w={id:`${c}-${s}-${i}`,tag:c,klass:v,path:I,label:v,from:s,to:u+1,openTo:u+1,hidden:!1,children:[]};i+=1,l(w),g?w.to=u+1:a.push(w),s=u+1}for(;a.length;)a.pop().to=o;return r}function en(t){return String(t||"").split("/").pop()||""}function le(t,e,n){for(const o of t||[])if(!(e<o.openTo||n>o.to))return le(o.children,e,n)||o;return null}function nn(t,e){for(const n of Ct(e)){const o=le(t,n.from,n.to),r=o?o.children:t,a=en(n.src),s={id:`component-${n.from}`,tag:"component",kind:"component",src:n.src,klass:a,path:`${o?`${o.path}/`:""}c${n.from}:component`,label:a,from:n.from,to:n.to,openTo:n.to,hidden:!!o?.hidden,children:[]};let i=r.findIndex(l=>l.from>n.from);i===-1&&(i=r.length),r.splice(i,0,s)}return t}function St(t){const e=String(t||""),n=se(e);return ie(e,n,0,n.length)}function Po(t){const e=String(t||"");return nn(St(e),e)}function _t(t,e,n=0,o=[]){for(const r of t){const a=r.children.length>0,s=e.has(r.id);o.push({id:r.id,tag:r.tag,kind:r.kind||"",src:r.src||"",klass:r.klass||"",path:r.path,label:r.label,from:r.from,to:r.to,openTo:r.openTo,hidden:!!r.hidden,wrapFrom:r.wrapFrom,wrapTo:r.wrapTo,depth:n,hasChildren:a,shut:s}),a&&!s&&_t(r.children,e,n+1,o)}return o}function Bo(t){return re.has(String(t||"").toLowerCase())}const ce=["sm","md","lg","xl","2xl","max-sm","max-md","max-lg","max-xl","max-2xl","dark","hover","focus","focus-visible","active","disabled","group-hover"],Wt={sm:"(min-width: 640px)",md:"(min-width: 768px)",lg:"(min-width: 1024px)",xl:"(min-width: 1280px)","2xl":"(min-width: 1536px)","max-sm":"(max-width: 639px)","max-md":"(max-width: 767px)","max-lg":"(max-width: 1023px)","max-xl":"(max-width: 1279px)","max-2xl":"(max-width: 1535px)",dark:"(prefers-color-scheme: dark)"},Ht={hover:":hover",focus:":focus","focus-visible":":focus-visible",active:":active",disabled:":disabled","group-hover":":is(:where(.group):hover *)"},on={relative:"position: relative",absolute:"position: absolute",fixed:"position: fixed",sticky:"position: sticky",static:"position: static",block:"display: block",inline:"display: inline","inline-block":"display: inline-block",flex:"display: flex","inline-flex":"display: inline-flex",grid:"display: grid",hidden:"display: none","flex-row":"flex-direction: row","flex-col":"flex-direction: column","flex-wrap":"flex-wrap: wrap","items-start":"align-items: flex-start","items-center":"align-items: center","items-end":"align-items: flex-end","items-stretch":"align-items: stretch","justify-start":"justify-content: flex-start","justify-center":"justify-content: center","justify-end":"justify-content: flex-end","justify-between":"justify-content: space-between","justify-around":"justify-content: space-around","text-left":"text-align: left","text-center":"text-align: center","text-right":"text-align: right","w-full":"width: 100%","h-full":"height: 100%","w-screen":"width: 100vw","h-screen":"height: 100vh","overflow-hidden":"overflow: hidden","overflow-auto":"overflow: auto","pointer-events-none":"pointer-events: none",underline:"text-decoration-line: underline",italic:"font-style: italic","font-bold":"font-weight: 700","font-medium":"font-weight: 500",uppercase:"text-transform: uppercase",truncate:"overflow: hidden; text-overflow: ellipsis; white-space: nowrap","z-10":"z-index: 10","z-20":"z-index: 20","z-50":"z-index: 50"},de={p:"padding",px:"padding-inline",py:"padding-block",pt:"padding-top",pr:"padding-right",pb:"padding-bottom",pl:"padding-left",m:"margin",mx:"margin-inline",my:"margin-block",mt:"margin-top",mr:"margin-right",mb:"margin-bottom",ml:"margin-left",gap:"gap","gap-x":"column-gap","gap-y":"row-gap",w:"width",h:"height","min-w":"min-width","min-h":"min-height","max-w":"max-width","max-h":"max-height"},ue={bg:"background-color",border:"border-color",outline:"outline-color",fill:"fill",stroke:"stroke"};let dt=null;function fe(t){return t?.Statamic?.$config?.get?.("sveFeatures")?.tailwind_dock===!0}function zo(t){return e=>{if(!fe(t)||!rn(e))return null;const n=e.matchBefore(/[^\s"']*$/),o=n?.text??"";return o.includes("{")||o.includes("}")?null:Tt(t).then(r=>{const a=ln(o,r).slice(0,80);return a.length?{from:n?n.from:e.pos,options:a,validFor:/^[^\s"'=]*$/}:null})}}function Oo(t,e){return t((n,o)=>{if(!fe(e))return null;const r=sn(n.state,o);return r?Tt(e).then(a=>{const s=cn(r.text,a);return s?{pos:r.from,end:r.to,create(){return{dom:fn(s,dn(r.text,a))}}}:null}):null})}function Nt(t){const e={color:[],spacing:[],text:[],leading:[],font:[],radius:[]},n=/--(color|spacing|text|leading|font|radius)-([a-zA-Z0-9][a-zA-Z0-9._-]*)\s*:\s*([^;]+);/g;let o;for(;o=n.exec(String(t||""));)o[2]!=="*"&&e[o[1]].push({name:o[2],value:o[3].trim()});const r=[];Object.entries(on).forEach(([s,i])=>{r.push({label:s,css:i,color:null})}),e.color.forEach(({name:s,value:i})=>{const l=un(i);Object.entries(ue).forEach(([d,p])=>{r.push({label:`${d}-${s}`,css:`${p}: var(--color-${s})`,color:l})}),r.push({label:`text-${s}`,css:`color: var(--color-${s})`,color:l})}),e.spacing.forEach(({name:s})=>{Object.entries(de).forEach(([i,l])=>{r.push({label:`${i}-${s}`,css:`${l}: var(--spacing-${s})`,color:null})})}),e.text.forEach(({name:s})=>{r.push({label:`text-${s}`,css:`font-size: var(--text-${s})`,color:null})}),e.leading.forEach(({name:s})=>{r.push({label:`leading-${s}`,css:`line-height: var(--leading-${s})`,color:null})}),e.font.forEach(({name:s})=>{r.push({label:`font-${s}`,css:`font-family: var(--font-${s})`,color:null})}),e.radius.forEach(({name:s})=>{r.push({label:s==="DEFAULT"?"rounded":`rounded-${s}`,css:`border-radius: var(--radius-${s})`,color:null})});const a=new Map;return r.forEach(s=>{a.has(s.label)||a.set(s.label,s)}),{items:[...a.values()],byUtility:a}}function Tt(t){return dt||(dt=t.fetch("/!/sve/tailwind-theme",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{css:""}).then(e=>Nt(typeof e.css=="string"?e.css:"")).catch(()=>Nt(""))),dt}function rn(t){return!!(t.matchBefore(/class\s*=\s*"[^"]*$/i)||t.matchBefore(/class\s*=\s*'[^']*$/i))}function sn(t,e){const n=t.doc.lineAt(e),o=e-n.from,r=an(n.text,o);if(!r)return null;const a=n.text.slice(r.valueFrom,r.valueTo),s=o-r.valueFrom,i=a.slice(0,s),l=a.slice(s),d=(i.match(/[^\s]*$/)||[""])[0],p=(l.match(/^[^\s]*/)||[""])[0],c=d+p;if(!c||c.includes("{"))return null;const u=n.from+r.valueFrom+(i.length-d.length);return{from:u,to:u+c.length,text:c}}function an(t,e){const n=/\bclass\s*=\s*(["'])/gi;let o;for(;o=n.exec(t);){const r=o[1],a=o.index+o[0].length,s=t.indexOf(r,a),i=s===-1?t.length:s;if(e>=a&&e<=i)return{valueFrom:a,valueTo:i}}return null}function Et(t){const e=[...ce].sort((s,i)=>i.length-s.length),n=[];let o=String(t||""),r=!0;for(;r;){r=!1;for(const s of e){const i=`${s}:`;if(o.startsWith(i)){n.push(s),o=o.slice(i.length),r=!0;break}}}let a=!1;return o.startsWith("!")?(a=!0,o=o.slice(1)):o.endsWith("!")&&(a=!0,o=o.slice(0,-1)),{variants:n,utility:o,important:a}}function ln(t,e){const{variants:n,utility:o}=Et(t),r=n.length?`${n.join(":")}:`:"",a=o.toLowerCase(),s=[];return!a&&!r&&ce.forEach(i=>{s.push({label:`${i}:`,type:"keyword",detail:"variant",boost:2})}),e.items.forEach(i=>{if(a&&!i.label.startsWith(a)&&!i.label.includes(a))return;const l=`${r}${i.label}`;s.push({label:l,type:"property",detail:i.css,boost:i.label.startsWith(a)?1:0})}),s.sort((i,l)=>(l.boost||0)-(i.boost||0)||i.label.localeCompare(l.label))}function cn(t,e){const{variants:n,utility:o,important:r}=Et(t),a=e.byUtility.get(o);if(!a)return"";let s=a.css;r&&(s+=" !important");const i=t.replace(/[^a-zA-Z0-9_-]/g,c=>`\\${c}`);let l="";const d=[];n.forEach(c=>{Wt[c]?d.push(Wt[c]):Ht[c]&&(l+=Ht[c])});let p=`.${i}${l} { ${s} }`;return d.slice().reverse().forEach(c=>{p=`@media ${c} {
  ${p}
}`}),p}function dn(t,e){const{utility:n}=Et(t);return e.byUtility.get(n)?.color||null}function un(t){const e=String(t||"").trim();return/^#([0-9a-fA-F]{3,8})$/.test(e)?e:null}function fn(t,e){const n=document.createElement("div");if(n.className="sve-tw-info",e){const r=document.createElement("span");r.className="sve-tw-swatch",r.style.background=e,n.appendChild(r)}const o=document.createElement("pre");return o.textContent=t,n.appendChild(o),n}const m=Ie({emptyText:"",tag:"",scope:"",scopeTitle:"",baseLabel:"",groups:[],canEdit:!1,onChip:null,variant:"",breakpoints:[],onBreakpoint:null,state:"",stateLabel:"",onState:null,onTag:null,dropTitle:"",onDrop:null,sortTitle:"",onSort:null,siteClasses:[]});function pe(t,e,n){const o=String(t||"").slice(e,n),r=se(o),a=/(\sclass\s*=\s*)(["'])/i.exec(r);if(!a)return null;const s=a[2],i=a.index+a[1].length+1,l=r.indexOf(s,i);return l===-1?null:{from:e+i,to:e+l,quote:s,value:o.slice(i,l)}}function pn(t){const e=String(t||""),n=[];let o=0;for(;o<e.length;){if(/\s/.test(e[o])){o+=1;continue}let r=o,a=!1;for(;r<e.length;){if(e.startsWith("{{",r)){const s=e.indexOf("}}",r+2);a=!0,r=s===-1?e.length:s+2;continue}if(/\s/.test(e[r]))break;r+=1}n.push({text:e.slice(o,r),from:o,to:r,dynamic:a}),o=r}return n}function me(t){const e=String(t||""),n=[];let o=0,r=0;for(let s=0;s<e.length;s+=1){const i=e[s];i==="["||i==="("?o+=1:i==="]"||i===")"?o=Math.max(0,o-1):i===":"&&o===0&&(n.push(e.slice(r,s)),r=s+1)}const a=e.slice(r);return{variants:n,base:a}}function he(t){let n=String(t||""),o="";n.startsWith("!")?(o="pre",n=n.slice(1)):n.endsWith("!")&&(o="post",n=n.slice(0,-1));let r="";const a=mn(n);return a!==-1&&(r=n.slice(a),n=n.slice(0,a)),{name:n,modifier:r,important:o}}function mn(t){let e=0;for(let n=0;n<t.length;n+=1){const o=t[n];if(o==="["||o==="(")e+=1;else if(o==="]"||o===")")e=Math.max(0,e-1);else if(o==="/"&&e===0)return n}return-1}function vt({variants:t,name:e,modifier:n,important:o}){let r=`${e}${n||""}`;return o==="pre"?r=`!${r}`:o==="post"&&(r=`${r}!`),[...t||[],r].join(":")}function Mt(t){const e=pn(t),n=new Map;let o=null,r=0;const a=e.findIndex(i=>i.text==="]");if(e[0]?.text==="["&&a>0){const i=e.slice(1,a);o={from:e[0].from,to:e[a].to,label:`[ ${i.map(l=>l.text).join(" ")} ]`},r=a+1}for(;r<e.length;r+=1){const i=e[r],{variants:l,base:d}=me(i.text),{name:p,modifier:c,important:u}=he(d),h=l.join(":");n.has(h)||n.set(h,{key:h,variants:l,items:[]}),n.get(h).items.push({raw:i.text,from:i.from,to:i.to,dynamic:i.dynamic,variants:l,name:p,modifier:c,important:u})}const s=[...n.values()];return s.sort((i,l)=>i.key===""?-1:l.key===""?1:0),{scope:o,groups:s}}function st(t,e,n){const o=String(t||"");if(n)return o.slice(0,e.from)+n+o.slice(e.to);let r=e.from,a=e.to;if(r>0&&(o[r-1]===" "||o[r-1]==="	"))for(;r>0&&(o[r-1]===" "||o[r-1]==="	");)r-=1;else for(;a<o.length&&(o[a]===" "||o[a]==="	");)a+=1;return hn(o.slice(0,r)+o.slice(a),r)}function hn(t,e){const n=t.lastIndexOf(`
`,Math.max(0,e-1));if(n===-1)return t;const o=t.indexOf(`
`,n+1);return t.slice(n+1,o===-1?t.length:o).trim()!==""?t:t.slice(0,n)+t.slice(o===-1?t.length:o)}function ge(t,e){const n=String(t||"");return n.trim()?`${n.replace(/\s+$/,"")} ${e}`:e}function ve(t,e,n){const o=String(t||"");if(!Array.isArray(e)||e.length!==n?.length)return o;let r=o;for(let a=e.length-1;a>=0;a-=1)r=r.slice(0,e[a].from)+n[a]+r.slice(e[a].to);return r}function be(t,e,n){const o=String(t||""),r=String(n||"").trim().toLowerCase();if(!/^[a-z][a-z0-9-]*$/.test(r)||!e?.tag||r===e.tag.toLowerCase())return o;const a=e.tag.toLowerCase(),s=o.slice(e.from,e.openTo);if(!new RegExp(`^<${a}(?=[\\s/>])`,"i").test(s))return o;let i=o;const l=i.toLowerCase().lastIndexOf(`</${a}`,e.to);return l>e.from&&l<e.to&&(i=i.slice(0,l)+`</${r}`+i.slice(l+2+a.length)),i.slice(0,e.from)+`<${r}`+i.slice(e.from+1+a.length)}function gn(t,e,n){const o=pe(t,e.from,e.openTo);if(o)return t.slice(0,o.from)+n+t.slice(o.to);const r=String(t).slice(e.from,e.openTo),a=/^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(r);if(!a||!n)return t;const s=e.from+a[0].length;return`${t.slice(0,s)} class="${n}"${t.slice(s)}`}const vn=[...Object.keys(de),...Object.keys(ue),"text","leading","font","rounded"].sort((t,e)=>e.length-t.length);let ut=null;function bn(t){return ut||(ut=Tt(t).then(yn)),ut}function ye(t){const e=String(t||"");if(e.includes(";"))return"";const n=e.indexOf(":");return n===-1?"":e.slice(0,n).trim()}function yn(t){const e=new Map,n=new Map,o=new Map;for(const r of t.items){const a=ye(r.css);a&&(e.has(a)||e.set(a,[]),e.get(a).push(r),n.set(r.label,a));const s=xe(r.label);s&&(o.has(s)||o.set(s,[]),o.get(s).push(r))}return{catalog:t,byProperty:e,propertyOfUtility:n,byPrefix:o}}function xe(t){for(const e of vn)if(String(t).startsWith(`${e}-`))return e;return""}function we(t,e){if(!e||!t)return null;const n=e.propertyOfUtility.get(t);if(n)return{label:n,options:e.byProperty.get(n)||[]};const o=xe(t),r=o?e.byPrefix.get(o):null;return r?.length?{label:ye(r[0].css)||o,options:r}:null}function ke(t,e){return e?.catalog?.byUtility?.get(t)?.css||""}function xn(t,e){return e?.catalog?.byUtility?.get(t)?.color||""}const wn={class:"sve-tw"},kn={key:0,class:"sve-tw-head"},$n=["disabled"],Cn=["title","data-active","disabled","onClick"],Sn=["data-active","disabled"],_n=["title","disabled"],Tn={key:1,class:"sve-tw-empty"},En=["data-sve-tw-base","data-current"],Mn={class:"sve-tw-chips"},Ln=["title","onClick"],An=["title","onClick"],Pn={__name:"TwClassList",setup(t){function e(n){const o={"data-sve-tw-chip":n.id};return n.locked&&(o["data-sve-tw-locked"]=""),n.open&&(o["data-open"]=""),o}return(n,o)=>($(),C("div",wn,[T(m).tag?($(),C("div",kn,[b("button",{type:"button",class:"sve-tw-tag",disabled:!T(m).canEdit,onClick:o[0]||(o[0]=M(r=>T(m).onTag?.(r),["prevent","stop"]))},"<"+P(T(m).tag)+">",9,$n),($(!0),C(F,null,Z(T(m).breakpoints,r=>($(),C("button",{key:r.index,type:"button","data-sve-tw-bp":"",title:r.title,"data-active":r.active?"":void 0,disabled:!T(m).canEdit,onClick:M(a=>T(m).onBreakpoint?.(r.index),["prevent","stop"])},P(r.label),9,Cn))),128)),b("button",{type:"button","data-sve-tw-state":"","data-active":T(m).state?"":void 0,disabled:!T(m).canEdit,onClick:o[1]||(o[1]=M(r=>T(m).onState?.(r),["prevent","stop"]))},[ht(P(T(m).stateLabel)+" ",1),o[3]||(o[3]=b("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[b("path",{d:"m6 9 6 6 6-6"})],-1))],8,Sn),b("button",{type:"button","data-sve-tw-sort":"",title:T(m).sortTitle,disabled:!T(m).canEdit,onClick:o[2]||(o[2]=M(r=>T(m).onSort?.(),["prevent","stop"]))},[...o[4]||(o[4]=[b("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round"},[b("path",{d:"M2.5 4h9M2.5 8h6M2.5 12h3"}),b("path",{d:"M13 5v7M11.4 10.4 13 12l1.6-1.6"})],-1)])],8,_n),o[5]||(o[5]=b("span",{class:"sve-tw-gap"},null,-1))])):q("",!0),T(m).groups.length?q("",!0):($(),C("div",Tn,P(T(m).emptyText),1)),($(!0),C(F,null,Z(T(m).groups,r=>($(),C("div",{key:r.key,class:"sve-tw-group"},[b("span",{class:"sve-tw-variant","data-sve-tw-base":r.key===""?"":void 0,"data-current":r.current?"":void 0},P(r.key===""?T(m).baseLabel:r.key),9,En),b("div",Mn,[($(!0),C(F,null,Z(r.chips,a=>($(),C("span",{key:a.id,class:"sve-tw-chip-wrap"},[b("button",Fe({type:"button"},{ref_for:!0},e(a),{title:a.title,onClick:M(s=>T(m).onChip?.(s,a.id),["prevent","stop"])}),[a.color?($(),C("span",{key:0,class:"sve-tw-dot",style:kt({background:a.color})},null,4)):q("",!0),ht(" "+P(a.raw),1)],16,Ln),a.locked?q("",!0):($(),C("button",{key:0,type:"button",class:"sve-tw-drop",title:T(m).dropTitle,onClick:M(s=>T(m).onDrop?.(a.id),["prevent","stop"])},"−",8,An))]))),128))])]))),128))]))}},Bn=De(Pn,[["__scopeId","data-v-d1960a11"]]),zn={key:0,"data-sve-tw-menu-title":""},On={"data-sve-tw-menu-list":""},Rn=["data-active","title","onClick"],In={"data-sve-tw-tick":""},Dn={"data-sve-tw-label":""},Lt={__name:"TwClassMenu",props:{title:{type:String,default:""},options:{type:Array,default:()=>[]},removeLabel:{type:String,default:""},onPick:{type:Function,required:!0},onRemove:{type:Function,required:!0}},setup(t){return(e,n)=>($(),C(F,null,[t.title?($(),C("div",zn,P(t.title),1)):q("",!0),b("div",On,[($(!0),C(F,null,Z(t.options,o=>($(),C("button",{key:o.label,type:"button","data-sve-tw-option":"","data-active":o.active?"":void 0,title:o.css,onClick:M(r=>t.onPick(o.label),["prevent","stop"])},[b("span",In,P(o.active?"✓":""),1),o.color?($(),C("span",{key:0,"data-sve-tw-dot":"",style:kt({background:o.color})},null,4)):q("",!0),b("span",Dn,P(o.label),1)],8,Rn))),128))]),b("button",{type:"button","data-sve-tw-remove":"",onClick:n[0]||(n[0]=M(o=>t.onRemove(),["prevent","stop"]))},[n[1]||(n[1]=b("span",{"data-sve-tw-tick":""},"✕",-1)),ht(P(t.removeLabel),1)])],64))}},Fn={"data-sve-tw-search":""},jn=["placeholder","aria-label","onKeydown"],qn={"data-sve-tw-tabs":""},Wn=["data-active"],Hn=["data-active"],Nn={key:0,"data-sve-tw-add-empty":""},Vn=["data-cursor","data-active","data-sve-tw-off","title","onMouseenter","onClick"],Un={"data-sve-tw-label":""},Xn={__name:"TwAddClass",props:{label:{type:String,default:""},placeholder:{type:String,default:""},sitePlaceholder:{type:String,default:""},emptyText:{type:String,default:""},offText:{type:String,default:""},siteLabel:{type:String,default:""},tailwindLabel:{type:String,default:""},search:{type:Function,required:!0},onAdd:{type:Function,required:!0}},setup(t){const e=t,n=z(""),o=z(null),r=z("tailwind"),a=z(null),s=z(-1),i=z(!1),l=N(()=>n.value.trim().toLowerCase()),d=N(()=>(m.siteClasses||[]).flatMap(w=>w.items).filter(w=>!l.value||w.name.toLowerCase().includes(l.value))),p=N(()=>e.search(n.value)),c=N(()=>r.value==="site"?d.value:p.value),u=N(()=>r.value==="site"?e.sitePlaceholder:e.placeholder);ee(()=>gt(()=>o.value?.focus()));function h(w){return w?.name||w?.label||""}function g(w){i.value=!0;const f=c.value.length;if(!f){s.value=-1;return}const x=s.value+w;s.value=x<0?-1:Math.min(x,f-1),gt(()=>v())}function v(){const w=a.value?.querySelector("[data-cursor]");if(!w)return;let f=w.parentElement;for(;f&&f.scrollHeight<=f.clientHeight;)f=f.parentElement;if(!f)return;const x=w.offsetTop,D=x+w.offsetHeight;x<f.scrollTop?f.scrollTop=x:D>f.scrollTop+f.clientHeight&&(f.scrollTop=D-f.clientHeight)}function A(w){i.value||(s.value=w)}function L(){s.value=-1}function I(){const w=s.value>=0?c.value[s.value]:null,f=w?h(w):n.value.trim();f&&e.onAdd(f)}return(w,f)=>($(),C(F,null,[b("div",Fn,[f[7]||(f[7]=b("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[b("circle",{cx:"11",cy:"11",r:"7"}),b("path",{d:"m20 20-3.5-3.5"})],-1)),ne(b("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":f[0]||(f[0]=x=>n.value=x),type:"text",placeholder:u.value,"aria-label":t.label,onInput:L,onKeydown:[f[1]||(f[1]=W(M(x=>g(1),["prevent"]),["down"])),f[2]||(f[2]=W(M(x=>g(-1),["prevent"]),["up"])),W(M(I,["prevent"]),["enter"]),f[3]||(f[3]=W(M(()=>{},["stop"]),["escape"]))]},null,40,jn),[[oe,n.value]])]),b("div",qn,[b("button",{type:"button","data-sve-tw-tab":"","data-active":r.value==="tailwind"?"":void 0,onClick:f[4]||(f[4]=M(x=>{r.value="tailwind",L()},["prevent","stop"]))},P(t.tailwindLabel),9,Wn),b("button",{type:"button","data-sve-tw-tab":"","data-active":r.value==="site"?"":void 0,onClick:f[5]||(f[5]=M(x=>{r.value="site",L()},["prevent","stop"]))},P(t.siteLabel),9,Hn)]),c.value.length?q("",!0):($(),C("div",Nn,P(t.emptyText),1)),b("div",{ref_key:"rowsEl",ref:a,onMousemove:f[6]||(f[6]=x=>i.value=!1)},[($(!0),C(F,null,Z(c.value,(x,D)=>($(),C("button",{key:x.name||x.label,type:"button","data-sve-tw-option":"","data-cursor":D===s.value?"":void 0,"data-active":D===s.value?"":void 0,"data-sve-tw-off":x.loaded===!1?"":void 0,title:x.loaded===!1?t.offText:x.file||x.css,onMouseenter:lt=>A(D),onClick:M(lt=>t.onAdd(x.name||x.label),["prevent","stop"])},[x.color?($(),C("span",{key:0,"data-sve-tw-dot":"",style:kt({background:x.color})},null,4)):q("",!0),b("span",Un,P(x.name||x.label),1)],40,Vn))),128))],544)],64))}},Zn={"data-sve-tw-search":""},Kn=["placeholder","aria-label","onKeydown"],Yn=["data-active","onMouseenter","onClick"],Gn={"data-sve-tw-tick":""},Jn={"data-sve-tw-label":""},$e={__name:"TwTagMenu",props:{label:{type:String,default:""},placeholder:{type:String,default:""},current:{type:String,default:""},tags:{type:Array,default:()=>[]},onPick:{type:Function,required:!0}},setup(t){const e=t,n=z(""),o=z(null),r=z(-1),a=z(!1),s=N(()=>n.value.trim().toLowerCase()),i=N(()=>{if(!s.value)return e.tags;const p=e.tags.filter(c=>c.includes(s.value));return p.sort((c,u)=>(c.startsWith(s.value)?0:1)-(u.startsWith(s.value)?0:1)),p});ee(()=>gt(()=>o.value?.focus()));function l(p){a.value=!0;const c=i.value.length;r.value=c?Math.min(Math.max(r.value+p,-1),c-1):-1}function d(){const p=r.value>=0?i.value[r.value]:n.value.trim().toLowerCase();p&&e.onPick(p)}return(p,c)=>($(),C(F,null,[b("div",Zn,[c[6]||(c[6]=b("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[b("circle",{cx:"11",cy:"11",r:"7"}),b("path",{d:"m20 20-3.5-3.5"})],-1)),ne(b("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":c[0]||(c[0]=u=>n.value=u),type:"text",placeholder:t.placeholder,"aria-label":t.label,onInput:c[1]||(c[1]=u=>r.value=-1),onKeydown:[c[2]||(c[2]=W(M(u=>l(1),["prevent"]),["down"])),c[3]||(c[3]=W(M(u=>l(-1),["prevent"]),["up"])),W(M(d,["prevent"]),["enter"]),c[4]||(c[4]=W(M(()=>{},["stop"]),["escape"]))]},null,40,Kn),[[oe,n.value]])]),b("div",{onMousemove:c[5]||(c[5]=u=>a.value=!1)},[($(!0),C(F,null,Z(i.value,(u,h)=>($(),C("button",{key:u,type:"button","data-sve-tw-option":"","data-active":h===r.value||r.value===-1&&u===t.current?"":void 0,onMouseenter:g=>a.value?null:r.value=h,onClick:M(g=>t.onPick(u),["prevent","stop"])},[b("span",Gn,P(u===t.current?"✓":""),1),b("span",Jn,"<"+P(u)+">",1)],40,Yn))),128))],32)],64))}},_="__sve-tw-menu",Vt="--sve-tw-anchor",Qn=typeof CSS<"u"&&CSS.supports?.("anchor-name: --x");let ot=null;const Ut="__sve-tw-style",At=[{key:"",all:!0,device:"Responsive",label:"tw_size_all"},{key:"",device:"Laptop",label:"tw_size_laptop",prefix:""},{key:"max-lg",device:"Tablet",label:"responsive_tablet",under:1024},{key:"max-md",device:"Mobile",label:"responsive_mobile",under:768}],Xt=["","dark","hover","focus","active","before","after"],Ce={Mobile:"max-md",Tablet:"max-lg",Laptop:"",Desktop:""},Se=["div","section","article","header","footer","main","aside","nav","h1","h2","h3","h4","h5","h6","p","span","a","button","label","ul","ol","li","figure","figcaption","blockquote","strong","em","small","picture","img","video","form","table","tr","td","th"];let _e="",K="",it=!1;function to(){try{return Ce[$t(window,"sve-lp-device")]??""}catch{return""}}function Pt(){return it?_e:to()}function Te(){return[Pt(),K].filter(Boolean)}function Bt(){return Te().join(":")}const eo=/^(max-)?(sm|md|lg|xl|2xl)$/;function no(t){return String(t||"").split(":").find(e=>eo.test(e))||""}function Ee(){if(it)return!0;try{return Object.prototype.hasOwnProperty.call(Ce,$t(window,"sve-lp-device"))}catch{return!1}}function oo(t){if(!Ee())return!0;const e=no(t);return e===Pt()?!0:!At.some(n=>n.key===e)}let k=null,Y=new Map,O=null,ft=!1,at="",bt=null;function Me(t){return t?.querySelector?.('[data-sve-style="tw"] [data-sve-tw-host]')||null}function Le(t){if(t.getElementById(Ut))return;const e=t.createElement("style");e.id=Ut,e.textContent=`
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
  `,t.head.appendChild(e)}function Ae(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e.contentDocument;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o.contentDocument}catch{}return null}function ro(t,e,n){const o=Ae(t);if(!(!o||!k?.path))for(const r of o.querySelectorAll(`[${Ne}="${k.path}"]`))try{e&&r.classList.remove(e),n&&r.classList.add(n)}catch{}}const pt=new Map,so=/(^|-)color$|^fill$|^stroke$/;function zt(t){const e=String(t||""),n=e.slice(0,e.indexOf(":")).trim();return so.test(n)&&/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(e)?.[1]||""}function Pe(t,e){if(!e)return"";if(pt.has(e))return pt.get(e);const n=Ae(t),o=n?.documentElement,r=n?.defaultView;if(!o||!r)return"";let a="",s=e;for(let i=0;i<6&&s;i+=1){try{a=r.getComputedStyle(o).getPropertyValue(s).trim()}catch{return""}if(!a)return"";if(s=zt(a),!s)break}return a&&!a.startsWith("var(")?(pt.set(e,a),a):""}function ao(t,e){return xn(e,O)||Pe(t,zt(ke(e,O)))}function B(t){const e=t?.document.getElementById(_);ot&&(ot.style.removeProperty("anchor-name"),ot=null),bt?.(),bt=null,at="",e&&(e._sveApp?.unmount(),e.remove())}function Zt(t,e,n){const o=e.getBoundingClientRect(),r=n.offsetWidth||176,a=8,s=140,i=e.closest?.("#__sve-tw-strip")?Co(t):null,l=i?i.top:0,d=i?i.bottom:t.innerHeight,p=i?i.left:0,c=i?i.right:t.innerWidth,u=o.bottom+4,h=d-u-a,g=Math.max(s,Math.min(h,420));n.style.left=`${Math.max(p+a,Math.min(o.left,c-r-a))}px`,n.style.maxHeight=`${g}px`,n.style.top=`${h>=s?u:Math.max(l+a,d-a-g)}px`}function J(t,e,n,o){const r=t.document;B(t),Le(r);const a=r.createElement("div");a.id=_,r.body.appendChild(a),a._sveApp=je(n,a,o);const s=Qn&&!!e.closest?.("#__sve-tw-strip");s?(ot=e,e.style.setProperty("anchor-name",Vt),a.style.setProperty("position","absolute"),a.style.setProperty("position-anchor",Vt),a.style.setProperty("position-area","block-end span-inline-start"),a.style.setProperty("position-try-fallbacks","flip-block, flip-inline, flip-block flip-inline"),a.style.setProperty("margin","4px 0 0 0"),a.style.setProperty("max-height","20rem")):Zt(t,e,a);const i=()=>{s||Zt(t,e,a)},l=p=>{!a.contains(p.target)&&!e.contains(p.target)&&(B(t),nt())},d=p=>{p.key==="Escape"&&(B(t),nt())};return r.addEventListener("pointerdown",l,!0),r.addEventListener("keydown",d,!0),t.addEventListener("scroll",i,!0),t.addEventListener("resize",i),bt=()=>{r.removeEventListener("pointerdown",l,!0),r.removeEventListener("keydown",d,!0),t.removeEventListener("scroll",i,!0),t.removeEventListener("resize",i)},a}function Be(t,e,n){return(e||[]).map(o=>({label:o.label,css:o.css,color:o.color||Pe(t,zt(o.css)),active:o.label===n}))}function U(){return!k||j("dock:is-locked")===!0}function X(){const t=j("dock:html");if(!k||typeof t!="string"||t[k.from]!=="<")return null;const e=pe(t,k.from,k.openTo);return{html:t,value:e?e.value:""}}function io(t){if(!k?.path)return;const n=_t(St(t),new Set).find(o=>o.path===k.path);n&&(k={from:n.from,openTo:n.openTo,path:n.path,tag:n.tag})}function H(t,e,n,o,r){const a=gn(e,k,n);a!==e&&(ro(t,o,r),j("dock:set-html",a),io(a),R(t))}const Kt=["display","position","inset","top","right","bottom","left","z-index","flex-direction","flex-wrap","justify-content","align-items","gap","column-gap","row-gap","margin","margin-inline","margin-block","margin-top","margin-right","margin-bottom","margin-left","padding","padding-inline","padding-block","padding-top","padding-right","padding-bottom","padding-left","width","min-width","max-width","height","min-height","max-height","font-family","font-size","font-weight","line-height","text-align","text-transform","text-decoration-line","font-style","color","background-color","border-color","border-radius","fill","stroke","outline-color","overflow"];function Yt(t){const e=G(t);if(!e)return-1;const n=Kt.indexOf(e);return n===-1?Kt.length:n}function lo(t){if(U())return;const e=X();if(!e)return;const n=Mt(e.value),o=n.groups.flatMap(l=>l.items).filter(l=>!l.dynamic);if(o.length<2)return;const r=new Map;n.groups.forEach((l,d)=>r.set(l.key,l.key===""?-1:d));const a=[...o].sort((l,d)=>{const p=r.get(l.variants.join(":"))??0,c=r.get(d.variants.join(":"))??0;return p-c||Yt(l.name)-Yt(d.name)||l.name.localeCompare(d.name)}),s=[...o].sort((l,d)=>l.from-d.from).map(l=>({from:l.from,to:l.to})),i=ve(e.value,s,a.map(l=>l.raw));i!==e.value&&H(t,e.html,i,"","")}function G(t){return we(t,O)?.label||""}function yt(t){return Mt(t).groups.flatMap(e=>e.items)}function ze(t){const e=Bt();return yt(t).filter(n=>!n.dynamic&&n.variants.join(":")===e)}function Gt(t,e){if(U()||!e)return;const n=X();if(!n)return;const o=G(e),r=ze(n.value).find(s=>s.name===e||o&&G(s.name)===o);if(r?.name===e){H(t,n.html,st(n.value,r,""),e,"");return}if(r){const s=vt({variants:r.variants,name:e,modifier:r.modifier,important:r.important});H(t,n.html,st(n.value,r,s),r.raw,s);return}const a=vt({variants:Te(),name:e,modifier:"",important:""});H(t,n.html,ge(n.value,a),"",a)}function co(t,e){const n=String(e||"").trim(),o=Bt(),r=o&&!n.includes(":")?`${o}:${n}`:n;if(U()||!n)return;const a=X();if(!a||yt(a.value).some(u=>u.raw===r))return;const{variants:i,base:l}=me(r),d=G(he(l).name),p=i.join(":"),c=d?yt(a.value).find(u=>!u.dynamic&&u.variants.join(":")===p&&G(u.name)===d):null;if(c){H(t,a.html,st(a.value,c,r),c.raw,r);return}H(t,a.html,ge(a.value,r),"",r.includes(":")?"":r)}function xt(t,e,n){if(U())return;const o=X();if(!o||o.value.slice(e.from,e.to)!==e.raw){R(t);return}const r=n?vt({variants:e.variants,name:n,modifier:e.modifier,important:e.important}):"";H(t,o.html,st(o.value,e,r),e.raw,r)}function uo(t,e){if(U()||!k)return;const n=j("dock:html");if(typeof n!="string"||n[k.from]!=="<")return;const o=be(n,k,e);if(o===n)return;const r=k.from;j("dock:set-html",o);const s=_t(St(o),new Set).find(i=>i.from===r);s&&(k={from:s.from,openTo:s.openTo,path:s.path,tag:s.tag}),R(t),et("tw:changed")}function Ro(t,e,n){n?.tag&&J(t,e,$e,{label:S(t,"tw_tag"),placeholder:S(t,"tw_tag_placeholder"),current:String(n.tag).toLowerCase(),tags:Se,onPick:o=>{fo(t,n,o),B(t)}})}function fo(t,e,n){if(j("dock:is-locked")===!0)return;const o=j("dock:html");if(typeof o!="string"||o[e.from]!=="<")return;const r=be(o,e,n);r!==o&&j("dock:set-html",r)}function po(t,e){J(t,e,$e,{label:S(t,"tw_tag"),placeholder:S(t,"tw_tag_placeholder"),current:(k?.tag||"").toLowerCase(),tags:Se,onPick:n=>{uo(t,n),B(t)}})}function mo(t,e){if(U())return;const n=X();if(!n)return;const o=e.map(s=>Y.get(s)).filter(Boolean);if(o.length<2)return;const r=[...o].sort((s,i)=>s.from-i.from).map(s=>({from:s.from,to:s.to})),a=ve(n.value,r,o.map(s=>s.raw));a!==n.value&&H(t,n.html,a,"","")}function Io(t){Rt(t,k?.path||"")}function Do(){return!!k}function ho(t,e){const n=At[e];n&&(j("lp:set-device",{win:t,key:n.device}),it=!n.all,_e=n.key,B(t),R(t),et("tw:changed"))}function go(t,e){J(t,e,Lt,{title:S(t,"tw_state"),removeLabel:S(t,"tw_state_none"),options:Xt.filter(Boolean).map(n=>({label:n,css:"",color:null,active:n===K})),onPick:n=>{K=Xt.includes(n)?n:"",B(t),R(t),et("tw:changed")},onRemove:()=>{K="",B(t),R(t),et("tw:changed")}})}We("lp:device",()=>{it=!1,Me(window.document)&&R(window)});function vo(t){const e=t?X():null;return e&&ze(e.value).find(n=>G(n.name)===t)?.name||""}function Fo(t,e,n,o){const r=O?.byProperty.get(n)||[];if(!r.length)return;const a=vo(n);J(t,e,Lt,{title:n,removeLabel:S(t,"tw_classes_remove"),options:Be(t,r,a),onPick:s=>{Gt(t,s),B(t),o?.(s)},onRemove:()=>{a&&Gt(t,a),B(t),o?.("")}})}let Jt=[],mt=!1;function bo(t){mt||(mt=!0,t.fetch("/!/sve/site-css/classes",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{groups:[]}).then(e=>{Jt=Array.isArray(e?.groups)?e.groups:[],m.siteClasses=Jt}).catch(()=>{mt=!1}))}function yo(t,e){bo(t),J(t,e,Xn,{label:S(t,"tw_add_class"),placeholder:S(t,"tw_add_placeholder"),emptyText:S(t,"tw_add_empty"),offText:S(t,"tw_class_not_imported"),sitePlaceholder:S(t,"tw_add_placeholder_site"),siteLabel:S(t,"tw_add_site"),tailwindLabel:S(t,"tw_add_tailwind"),search:n=>{const o=String(n||"").trim().toLowerCase();if(!o||!O)return[];const r=O.catalog.items.filter(a=>a.label.toLowerCase().includes(o));return r.sort((a,s)=>{const i=a.label.toLowerCase().startsWith(o)?0:1,l=s.label.toLowerCase().startsWith(o)?0:1;return i-l||a.label.length-s.label.length}),r.slice(0,40).map(a=>({label:a.label,css:a.css,color:a.color,active:!1}))},onAdd:n=>{co(t,n)}})}function xo(t,e,n){const o=Y.get(n);if(!o||o.locked)return;if(at===n){B(t),nt();return}const r=we(o.name,O);J(t,e.currentTarget,Lt,{title:r?.label||"",removeLabel:S(t,"tw_classes_remove"),options:Be(t,r?.options,o.name),onPick:a=>{xt(t,o,a),B(t)},onRemove:()=>{xt(t,o,""),B(t)}}),at=n,nt()}function nt(){for(const t of m.groups)for(const e of t.chips)e.open=e.id===at}function jo(t,e){if(!e||e.from==null||e.openTo==null){k=null,Y=new Map,B(t),R(t);return}k={from:e.from,openTo:e.openTo,path:e.path,tag:e.tag},R(t)}function R(t){wo(t);const e=k?X():null,n=e?Mt(e.value):{scope:null,groups:[]};Y=new Map,m.baseLabel=S(t,"tw_size_base"),m.scopeTitle=S(t,"tw_classes_scope"),m.dropTitle=S(t,"tw_classes_remove"),m.variant=Bt(),m.onBreakpoint=s=>ho(t,s),m.onState=s=>go(t,s.currentTarget);const o=Ee();m.breakpoints=At.map((s,i)=>({index:i,label:S(t,s.label),title:s.under?`${s.key}:  ·  < ${s.under}px`:S(t,s.all?"tw_size_all_title":"tw_size_base_title"),active:s.all?!o:o&&s.key===Pt()})),m.state=K,m.stateLabel=K||S(t,"tw_state"),m.canEdit=!U(),m.onChip=(s,i)=>xo(t,s,i),m.onTag=s=>po(t,s.currentTarget),m.sortTitle=S(t,"tw_sort"),m.onSort=()=>lo(t),m.onDrop=s=>{const i=Y.get(s);i&&!i.locked&&(B(t),xt(t,i,""))},m.tag=k?.tag||"";const r=n.scope?.label||"";m.scope=/^\[\s*\]$/.test(r)?"":r,m.emptyText=S(t,k?n.groups.length?"tw_classes_none_size":"tw_classes_none":"tw_classes_pick"),m.groups=n.groups.filter(s=>oo(s.key)).map(s=>({key:s.key,current:s.key===m.variant,chips:s.items.map((i,l)=>{const d={...i,id:`${s.key}-${l}-${i.from}`,locked:i.dynamic||!m.canEdit,open:!1,color:i.dynamic?"":ao(t,i.name),title:i.dynamic?S(t,"tw_classes_dynamic"):ke(i.name,O)||i.raw};return Y.set(d.id,d),d})}));const a=Me(t.document);a&&(Le(t.document),qe(a,Bn)),nt(),Rt(t,k?.path||""),et("tw:changed")}function wo(t){O||ft||(ft=!0,bn(t).then(e=>{O=e,R(t)}).catch(()=>{ft=!1}))}const Oe="sve-tw-strip";function ko(t){try{return $t(t,Oe)!=="0"}catch{return!0}}function qo(t,e){He(t,Oe,e?"1":"0"),e||wt(t)}const y="__sve-tw-strip",Qt="__sve-tw-strip-style";let te=null,tt=null;function Ot(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o}catch{}return null}function $o(t){if(t.getElementById(Qt))return;const e=t.createElement("style");e.id=Qt,e.textContent=`
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
      cursor: grab;
    }
    #${y} [data-chip-wrap][data-dragging] {
      opacity: .35;
      cursor: grabbing;
    }
    #${y}[data-dragging],
    #${y}[data-dragging] * { cursor: grabbing !important; }
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
    /* The ghost lives on the body, outside the strip, so none of the rules
       above reach it — it carries its own copy of the chip's look. */
    #${y}-ghost {
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
    #${y}-ghost [data-dot] {
      width: 0.8em;
      height: 0.8em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
  `,t.head.appendChild(e)}function Co(t){const e=Ot(t);return e?e.getBoundingClientRect():null}let E=null;function So(t,e,n,o){if(e.button!==0||e.target?.closest?.("[data-drop]"))return;E={wrap:n,scroll:o,strip:t.document.getElementById(y),x:e.clientX,moved:!1,ghost:null};const r=s=>{if(!E||!E.moved&&Math.abs(s.clientX-E.x)<4)return;if(!E.moved){E.moved=!0,E.wrap.setAttribute("data-dragging",""),E.strip?.setAttribute("data-dragging","");const d=E.wrap.querySelector("button")?.cloneNode(!0);d&&(d.id=`${y}-ghost`,d.querySelector("[data-drop]")?.remove(),t.document.body.appendChild(d),E.ghost=d)}s.preventDefault(),E.ghost&&(E.ghost.style.left=`${s.clientX}px`,E.ghost.style.top=`${s.clientY}px`);const i=t.document.elementFromPoint(s.clientX,s.clientY)?.closest?.("[data-chip-wrap]");if(!i||i===E.wrap||i.parentElement!==E.scroll)return;const l=i.getBoundingClientRect();s.clientX<l.left+l.width/2?E.scroll.insertBefore(E.wrap,i):E.scroll.insertBefore(E.wrap,i.nextSibling)},a=()=>{t.document.removeEventListener("pointermove",r,!0),t.document.removeEventListener("pointerup",a,!0),t.document.removeEventListener("pointercancel",a,!0);const s=E;if(E=null,s?.ghost?.remove(),!s?.moved)return;s.wrap.removeAttribute("data-dragging"),s.strip?.removeAttribute("data-dragging");const i=l=>{l.preventDefault(),l.stopPropagation()};t.addEventListener("click",i,!0),t.setTimeout(()=>t.removeEventListener("click",i,!0),0),mo(t,[...s.scroll.querySelectorAll("[data-chip-wrap]")].map(l=>l.dataset.chip))};t.document.addEventListener("pointermove",r,!0),t.document.addEventListener("pointerup",a,!0),t.document.addEventListener("pointercancel",a,!0)}function wt(t){t?.document.getElementById(y)?.remove()}function _o(t){const e=()=>To(t);te!==t&&(te=t,t.addEventListener("resize",e),t.addEventListener("scroll",e,!0));const n=Ot(t)?.contentWindow;if(n&&!n._sveStripBound)try{n._sveStripBound=!0,n.addEventListener("scroll",e,!0),n.addEventListener("resize",e),n.addEventListener("statamic:preview-updated",()=>{t.setTimeout(()=>Rt(t,tt?.path||""),60)})}catch{}}function To(t){const e=t?.document.getElementById(y);!e||!tt?.el?.isConnected||Re(t,e,tt.frame,tt.el)}function Rt(t,e){if(!t||!ko(t)){wt(t);return}const n=t.document,o=Ot(t),r=o?.contentDocument,a=e&&r?r.querySelector(`[data-sve-ht-path="${e}"]`):null;if(!a||!m.tag){wt(t);return}$o(n),_o(t);let s=n.getElementById(y);s||(s=n.createElement("div"),s.id=y,n.body.appendChild(s));let i=s.querySelector('[data-group="tag"]');if(!i){i=n.createElement("div"),i.setAttribute("data-group","tag");const c=n.createElement("span");c.setAttribute("data-sve-tw-strip-tag",""),i.appendChild(c),s.appendChild(i)}i.firstChild.textContent=`<${m.tag}>`;let l=s.querySelector('[data-group="classes"]'),d=l?.querySelector("[data-scroll]");const p=m.groups.flatMap(c=>c.chips);if(p.length&&!l){l=n.createElement("div"),l.setAttribute("data-group","classes"),d=n.createElement("div"),d.setAttribute("data-scroll","");const c=n.createElement("span");c.setAttribute("data-fade",""),l.appendChild(d),l.appendChild(c);const u=()=>{d.scrollWidth-d.scrollLeft-d.clientWidth>2?l.setAttribute("data-overflow",""):l.removeAttribute("data-overflow")};d.addEventListener("scroll",u),l._sveSync=u,s.insertBefore(l,s.querySelector('[data-group="add"]'))}if(!p.length)l?.remove();else if(d){d.replaceChildren();for(const c of p){const u=n.createElement("button");if(u.type="button",u.title=c.title||"",c.locked&&u.setAttribute("data-locked",""),c.color){const g=n.createElement("span");g.setAttribute("data-dot",""),g.style.background=c.color,u.appendChild(g)}u.appendChild(n.createTextNode(c.raw));const h=n.createElement("span");if(h.setAttribute("data-chip-wrap",""),h.dataset.chip=c.id,h.appendChild(u),c.locked||h.addEventListener("pointerdown",g=>So(t,g,h,d)),!c.locked){const g=n.createElement("button");g.type="button",g.setAttribute("data-drop",""),g.title=m.dropTitle||"",g.textContent="−",g.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation(),m.onDrop?.(c.id)}),h.appendChild(g),u.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation(),m.onChip?.(v,c.id)})}d.appendChild(h)}t.requestAnimationFrame(()=>l._sveSync?.())}if(!s.querySelector('[data-group="add"]')){const c=n.createElement("div");c.setAttribute("data-group","add");const u=n.createElement("button");u.type="button",u.setAttribute("data-add","");const h=n.createElement("span");h.setAttribute("data-plus",""),h.textContent="+",u.appendChild(h),u.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),yo(t,g.currentTarget)}),c.appendChild(u),s.appendChild(c)}tt={frame:o,el:a,path:e},Re(t,s,o,a)}function Re(t,e,n,o){const r=n.getBoundingClientRect(),a=n.clientWidth?r.width/n.clientWidth:1,s=o.getBoundingClientRect(),i=e.getBoundingClientRect(),l=6,d=16,p=r.left+s.left*a,c=r.top+s.top*a-i.height-l,u=r.top+s.top*a+l,h=Math.max(l,r.left+d),g=Math.max(h,Math.min(r.right,t.innerWidth)-i.width-d);e.style.left=`${Math.max(h,Math.min(p,g))}px`,e.style.top=`${Math.max(r.top+d,c<r.top+d?u:c)}px`;const v=n.clientHeight||r.height;e.hidden=s.bottom<=0||s.top>=v}export{rt as P,Ro as a,St as b,B as c,V as d,ko as e,_t as f,Ao as g,Io as h,Bo as i,zo as j,Oo as k,Lo as l,vo as m,Fo as n,yo as o,Po as p,Gt as q,jo as r,qo as s,fe as t,Do as u};
