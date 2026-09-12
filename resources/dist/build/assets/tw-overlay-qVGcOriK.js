import{r as Fe,_ as je,o as $,c as C,u as T,a as b,f as A,t as P,F,e as K,I as ht,d as W,m as We,n as kt,N as z,H as N,O as re,a2 as gt,L as se,w as q,M as ae,j as _,l as qe,i as He,a9 as et,Q as j,a8 as $t,U as Ne,A as Ue}from"./addon-DxCxIAc8.js";import{H as Ve}from"./html-pick-align-BQgDq65Q.js";const rt="__sve-partial-menu",Ze=/\{\{#([\s\S]*?)#\}\}/g,Ft=/\{\{\s*partial(?::([^\s}]+)|(?=[\s}]))([\s\S]*?)\}\}/gi,ct=new Map;function Ct(t){const e=String(t||"").replace(Ze,r=>" ".repeat(r.length)),n=[];Ft.lastIndex=0;let o;for(;o=Ft.exec(e);){const r=(o[1]||"").trim(),s=(o[2]||"").match(/\bsrc\s*=\s*(["'])([^"']+)\1/i),i=r||(s?s[2].trim():"");!i||i.includes("..")||n.push({from:o.index,to:o.index+o[0].length,src:i})}return n}function jt(t,e){return Ct(t).find(n=>e>=n.from&&e<=n.to)||null}const Ke=new Set(["if","elseif","else","unless","foreach","forelse","noparse","once","cache","nocache","section","yield","partial","slot","switch","case","vite","sve_html","sve_css","sve_js","sve_tw","style_push","script_push"]);function Xe(t,e){const n=[],o=/\{\{\s*(\/?)([A-Za-z_][A-Za-z0-9_]*)\b[\s\S]*?\}\}/g;let r;for(;r=o.exec(String(t||""));){const s=r[2];if(!Ke.has(s.toLowerCase())){if(!r[1]){n.push({name:s,from:r.index,to:null});continue}for(let i=n.length-1;i>=0;i-=1)if(n[i].name===s&&n[i].to==null){n[i].to=r.index+r[0].length;break}}}let a=null;for(const s of n)s.to==null||e<s.from||e>s.to||(!a||s.to-s.from<a.to-a.from)&&(a=s);return a?.name||null}function Ye(t,e){const n=new Set,o=r=>{if(Array.isArray(r)){if(!e){for(const a of r)a&&typeof a=="object"&&typeof a.type=="string"&&a.type&&n.add(a.type),o(a);return}r.forEach(o);return}if(!(!r||typeof r!="object")){if(e&&Array.isArray(r[e]))for(const a of r[e])a&&typeof a=="object"&&typeof a.type=="string"&&a.type&&n.add(a.type);Object.values(r).forEach(o)}};return o(t),n}function Ge(t,e,n,o){if(!t.src.includes("{")||!o)return e;const r=Xe(n,t.from),a=Ye(o,r);return r?e.filter(s=>a.has(s.label)):a.size===0?e:e.filter(s=>a.has(s.label))}function Qe(t,e){if(ct.has(e))return ct.get(e);const n=t.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():{items:[]}).then(o=>Array.isArray(o.items)?o.items:[]).catch(()=>[]);return ct.set(e,n),n}let J=null;function Wt(t){t.clearTimeout(J),J=null}function Je(t,e){J||(J=t.setTimeout(()=>{J=null,e?.()},180))}function U(t){t?.getElementById(rt)?.remove()}function tn(t,e,n,o,{onOpen:r,emptyLabel:a,onStay:s,onLeave:i}){const l=t.document;U(l);const d=l.createElement("div");if(d.id=rt,d.style.left=`${Math.max(8,Math.round(n))}px`,d.style.top=`${Math.max(8,Math.round(o))}px`,e.length)e.forEach(g=>{const m=l.createElement("button");m.type="button",m.setAttribute("data-sve-partial-choice",""),m.textContent=g.label,m.title=g.path||g.type,m.addEventListener("click",M=>{M.preventDefault(),M.stopPropagation(),U(l),r?.(g.type)}),d.appendChild(m)});else{const g=l.createElement("div");g.setAttribute("data-sve-partial-empty",""),g.textContent=a||"",d.appendChild(g)}l.body.appendChild(d);const f=d.getBoundingClientRect(),c=8;let u=f.left,v=f.top;f.right>t.innerWidth-c&&(u=Math.max(c,t.innerWidth-f.width-c)),f.bottom>t.innerHeight-c&&(v=Math.max(c,t.innerHeight-f.height-c)),d.style.left=`${Math.round(u)}px`,d.style.top=`${Math.round(v)}px`,d.addEventListener("mouseenter",()=>s?.()),d.addEventListener("mouseleave",()=>i?.())}function Bo(t){const e=t.Decoration.mark({class:"sve-cm-partial"}),n=t.Decoration.line({class:"sve-cm-partial-line"}),o=t.StateEffect.define(),r=t.StateField.define({create(s){return qt(s,t,e)},update(s,i){return i.docChanged?qt(i.state,t,e):s},provide:s=>t.EditorView.decorations.from(s)}),a=t.StateField.define({create(){return t.Decoration.none},update(s,i){let l;for(const u of i.effects)u.is(o)&&(l=u.value);if(l===void 0)return i.docChanged?t.Decoration.none:s;if(!l)return t.Decoration.none;const d=new t.RangeSetBuilder,f=i.state.doc.lineAt(l.from),c=i.state.doc.lineAt(l.to);for(let u=f.number;u<=c.number;u+=1){const v=i.state.doc.line(u);d.add(v.from,v.from,n)}return d.finish()},provide:s=>t.EditorView.decorations.from(s)});return{extensions:[r,a],setHover(s,i){s&&s.dispatch({effects:o.of(i)})}}}function qt(t,e,n){const o=new e.RangeSetBuilder;for(const r of Ct(t.doc.toString()))o.add(r.from,r.to,n);return o.finish()}function Ro(t,e,{onOpen:n,emptyLabel:o,sectionValues:r,isLocked:a,setHover:s}){if(!e?.dom||e.dom._svePartialBound)return;e.dom._svePartialBound=!0;let i=null,l="",d="";const f=()=>{Wt(t),t.clearTimeout(i),i=null,d="",l="",s?.(e,null),U(t.document)},c={stay:()=>Wt(t),leave:()=>Je(t,f)},u=()=>{t.clearTimeout(i),i=null,d="",s?.(e,null)},v=()=>!!a?.(),g=(m,M,L,{click:I}={})=>{if(v()){U(t.document),s?.(e,null);return}l=m.src,Qe(t,m.src).then(w=>{if(l!==m.src)return;const p=e.state.doc.toString(),x=Ge(m,w,p,r?.()||null);if(x.length===1){I&&(U(t.document),n?.(x[0].type));return}!x.length&&!I||tn(t,x,M,L,{onOpen:n,emptyLabel:o,onStay:c.stay,onLeave:c.leave})})};e.dom.addEventListener("mousemove",m=>{if(v()){f();return}const M=e.posAtCoords({x:m.clientX,y:m.clientY});if(M==null)return;const L=jt(e.state.doc.toString(),M);if(!L){t.clearTimeout(i),i=null,d="",c.leave();return}c.stay(),s?.(e,{from:L.from,to:L.to}),!(d===L.src&&i)&&(u(),d=L.src,i=t.setTimeout(()=>{const I=e.coordsAtPos(L.from);g(L,I?.left??m.clientX,(I?.bottom??m.clientY)+6)},280))}),e.dom.addEventListener("mouseleave",m=>{if(m.relatedTarget?.closest?.(`#${rt}`)){c.stay();return}c.leave()}),e.dom.addEventListener("click",m=>{if(v()){U(t.document);return}const M=e.posAtCoords({x:m.clientX,y:m.clientY});if(M==null)return;const L=jt(e.state.doc.toString(),M);L&&(u(),g(L,m.clientX,m.clientY+8,{click:!0}))}),en(t.document)||(t.document.addEventListener("mousedown",m=>{m.target.closest(`#${rt}, .sve-cm-partial`)||U(t.document)}),t.document._svePartialDismiss=!0)}function en(t){return!!t._svePartialDismiss}const nn=new Set(["if","elseif","else","endif","unless","foreach","forelse","noparse","once","cache","nocache","section","yield","partial","slot","switch","case","vite","sve_html","sve_css","sve_js","sve_tw","sve_prop","style_push","script_push","visual_edit","responsive_css"]),Ht=/\{\{\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.-]*)((?::[^\s}]*)?[\s\S]*?)\}\}/g;function Nt(t){return String(t||"").replace(/\s+/g," ").trim()}function on(t){const e=String(t||""),n=[],o=[];Ht.lastIndex=0;let r;for(;r=Ht.exec(e);){const a=!!r[1],s=r[2].toLowerCase(),i=r.index,l=i+r[0].length;if(a||s==="endif"){const g=s==="endif"?"if":s;for(let m=o.length-1;m>=0;m-=1)if(g==="if"?o[m].branchOf==="if":o[m].name===g){n.push({...o[m],to:l}),o.length=m;break}continue}if(s==="if"||s==="unless"){o.push({kind:"if",loopKind:"",name:s,handle:"",params:"",expr:Nt(r[3]),from:i,openTo:l,branchOf:s});continue}if(s==="elseif"||s==="else"){let g=-1;for(let m=o.length-1;m>=0;m-=1)if(o[m].branchOf==="if"){g=m;break}if(g===-1)continue;n.push({...o[g],to:i}),o.length=g+1,o[g]={kind:"if",loopKind:"",name:s,handle:"",params:"",expr:Nt(r[3]),from:i,openTo:l,branchOf:"if"};continue}if(nn.has(s)||r[3].trim().startsWith("="))continue;const d=r[3]||"",f=d.match(/^:([A-Za-z0-9_-]+)/),c=d.match(/\bfrom\s*=\s*["']([A-Za-z0-9_-]+)["']/),u=f?.[1]||c?.[1]||"",v=s==="collection";o.push({kind:"loop",loopKind:v?"collection":"field",name:s,handle:u,params:v?d.replace(/^:[A-Za-z0-9_-]+/,"").trim():"",expr:v?u:s,from:i,openTo:l,branchOf:null})}return n.filter(a=>a.to>a.openTo).sort((a,s)=>a.from-s.from||s.to-a.to)}const ie=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function le(t){return String(t||"").replace(/\{\{[\s\S]*?\}\}/g,e=>" ".repeat(e.length))}function rn(t){const e=t.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(!e)return"";const n=e[2].match(/\[\s*([\s\S]*?)\s*\]/);if(n){const o=n[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).find(r=>/^[a-zA-Z_][\w-]*$/.test(r));if(o)return o}return(e[2].trim().split(/\s+/)[0]||"").replace(/\[|\]/g,"")}function ce(t,e,n,o){t.hidden=!0,o&&(t.wrapFrom=e,t.wrapTo=n);for(const r of t.children)ce(r,e,n,!1)}function de(t,e,n,o){const r=[],a=[];let s=n,i=0;const l=d=>{a.length?a[a.length-1].children.push(d):r.push(d)};for(;s<o;){if(e[s]!=="<"){s+=1;continue}if(e.startsWith("<!--",s)){const p=e.indexOf("-->",s+4),x=p===-1||p>o?o:p,D=p===-1||p+3>o?o:p+3,lt=de(t,e,s+4,x);for(const Dt of lt)ce(Dt,s,D,!0),l(Dt);s=D;continue}if(e.startsWith("<!",s)||e.startsWith("<?",s)){const p=e.indexOf(">",s+2);s=p===-1||p+1>o?o:p+1;continue}const d=e[s+1]==="/",f=e.slice(s,o).match(/^<\/?([a-zA-Z][a-zA-Z0-9:-]*)/);if(!f){s+=1;continue}const c=f[1].toLowerCase(),u=e.indexOf(">",s);if(u===-1||u>=o)break;const v=e.slice(s,u+1),g=!d&&(ie.has(c)||/\/\s*>$/.test(v));if(d){for(let p=a.length-1;p>=0;p-=1)if(a[p].tag===c){a[p].to=u+1,a.length=p;break}s=u+1;continue}const m=rn(t.slice(s,u+1)),M=a.length?a[a.length-1]:null,L=M?M.children:r,I=M?`${M.path}/${L.length}:${c}`:`${L.length}:${c}`,w={id:`${c}-${s}-${i}`,tag:c,klass:m,path:I,label:m,from:s,to:u+1,openTo:u+1,hidden:!1,children:[]};i+=1,l(w),g?w.to=u+1:a.push(w),s=u+1}for(;a.length;)a.pop().to=o;return r}function sn(t){const e=String(t||"");return/\{[A-Za-z_][A-Za-z0-9_]*\}/.test(e)?e:e.split("/").pop()||""}function _t(t,e,n){for(const o of t||[])if(!(e<o.openTo||n>o.to))return _t(o.children,e,n)||o;return null}function an(t,e){for(const n of on(e)){const o=_t(t,n.from,n.to),r=o?o.children:t,a=[];let s=!1;for(const f of r){const c=f.wrapFrom??f.from,u=f.wrapTo??f.to;if(!(u<=n.from||c>=n.to)){if(c<n.from||u>n.to){s=!0;break}a.push(f)}}if(s)continue;const i=n.loopKind==="collection"?`collection: ${n.handle||"?"}`:n.kind==="loop"?n.name:n.expr,l={id:`antlers-${n.from}`,tag:n.name,kind:"antlers",antlers:n.kind,loopKind:n.loopKind||"",handle:n.handle||"",params:n.params||"",expr:n.expr,klass:i,path:`${o?`${o.path}/`:""}a${n.from}:${n.name}`,label:i,from:n.from,to:n.to,openTo:n.openTo,hidden:!!o?.hidden,children:a},d=a.length?r.indexOf(a[0]):r.findIndex(f=>f.from>n.from);r.splice(d===-1?r.length:d,a.length,l)}return t}function ln(t,e){for(const n of Ct(e)){const o=_t(t,n.from,n.to),r=o?o.children:t,a=sn(n.src),s={id:`component-${n.from}`,tag:"component",kind:"component",src:n.src,klass:a,path:`${o?`${o.path}/`:""}c${n.from}:component`,label:a,from:n.from,to:n.to,openTo:n.to,hidden:!!o?.hidden,children:[]};let i=r.findIndex(l=>l.from>n.from);i===-1&&(i=r.length),r.splice(i,0,s)}return t}function St(t){const e=String(t||""),n=le(e);return de(e,n,0,n.length)}function Io(t){const e=String(t||"");return ln(an(St(e),e),e)}function Tt(t,e,n=0,o=[]){for(const r of t){const a=r.children.length>0,s=e.has(r.id);o.push({id:r.id,tag:r.tag,kind:r.kind||"",antlers:r.antlers||"",loopKind:r.loopKind||"",handle:r.handle||"",params:r.params||"",expr:r.expr||"",src:r.src||"",klass:r.klass||"",path:r.path,label:r.label,from:r.from,to:r.to,openTo:r.openTo,hidden:!!r.hidden,wrapFrom:r.wrapFrom,wrapTo:r.wrapTo,depth:n,hasChildren:a,emptyBlock:r.kind==="antlers"&&!a,shut:s}),a&&!s&&Tt(r.children,e,n+1,o)}return o}function Do(t){return ie.has(String(t||"").toLowerCase())}const ue=["sm","md","lg","xl","2xl","max-sm","max-md","max-lg","max-xl","max-2xl","dark","hover","focus","focus-visible","active","disabled","group-hover"],Ut={sm:"(min-width: 640px)",md:"(min-width: 768px)",lg:"(min-width: 1024px)",xl:"(min-width: 1280px)","2xl":"(min-width: 1536px)","max-sm":"(max-width: 639px)","max-md":"(max-width: 767px)","max-lg":"(max-width: 1023px)","max-xl":"(max-width: 1279px)","max-2xl":"(max-width: 1535px)",dark:"(prefers-color-scheme: dark)"},Vt={hover:":hover",focus:":focus","focus-visible":":focus-visible",active:":active",disabled:":disabled","group-hover":":is(:where(.group):hover *)"},cn={relative:"position: relative",absolute:"position: absolute",fixed:"position: fixed",sticky:"position: sticky",static:"position: static",block:"display: block",inline:"display: inline","inline-block":"display: inline-block",flex:"display: flex","inline-flex":"display: inline-flex",grid:"display: grid",hidden:"display: none","flex-row":"flex-direction: row","flex-col":"flex-direction: column","flex-wrap":"flex-wrap: wrap","items-start":"align-items: flex-start","items-center":"align-items: center","items-end":"align-items: flex-end","items-stretch":"align-items: stretch","justify-start":"justify-content: flex-start","justify-center":"justify-content: center","justify-end":"justify-content: flex-end","justify-between":"justify-content: space-between","justify-around":"justify-content: space-around","text-left":"text-align: left","text-center":"text-align: center","text-right":"text-align: right","w-full":"width: 100%","h-full":"height: 100%","w-screen":"width: 100vw","h-screen":"height: 100vh","overflow-hidden":"overflow: hidden","overflow-auto":"overflow: auto","pointer-events-none":"pointer-events: none",underline:"text-decoration-line: underline",italic:"font-style: italic","font-bold":"font-weight: 700","font-medium":"font-weight: 500",uppercase:"text-transform: uppercase",truncate:"overflow: hidden; text-overflow: ellipsis; white-space: nowrap","z-10":"z-index: 10","z-20":"z-index: 20","z-50":"z-index: 50"},fe={p:"padding",px:"padding-inline",py:"padding-block",pt:"padding-top",pr:"padding-right",pb:"padding-bottom",pl:"padding-left",m:"margin",mx:"margin-inline",my:"margin-block",mt:"margin-top",mr:"margin-right",mb:"margin-bottom",ml:"margin-left",gap:"gap","gap-x":"column-gap","gap-y":"row-gap",w:"width",h:"height","min-w":"min-width","min-h":"min-height","max-w":"max-width","max-h":"max-height"},pe={bg:"background-color",border:"border-color",outline:"outline-color",fill:"fill",stroke:"stroke"};let dt=null;function me(t){return t?.Statamic?.$config?.get?.("sveFeatures")?.tailwind_dock===!0}function Fo(t){return e=>{if(!me(t)||!dn(e))return null;const n=e.matchBefore(/[^\s"']*$/),o=n?.text??"";return o.includes("{")||o.includes("}")?null:Et(t).then(r=>{const a=pn(o,r).slice(0,80);return a.length?{from:n?n.from:e.pos,options:a,validFor:/^[^\s"'=]*$/}:null})}}function jo(t,e){return t((n,o)=>{if(!me(e))return null;const r=un(n.state,o);return r?Et(e).then(a=>{const s=mn(r.text,a);return s?{pos:r.from,end:r.to,create(){return{dom:vn(s,hn(r.text,a))}}}:null}):null})}function Zt(t){const e={color:[],spacing:[],text:[],leading:[],font:[],radius:[]},n=/--(color|spacing|text|leading|font|radius)-([a-zA-Z0-9][a-zA-Z0-9._-]*)\s*:\s*([^;]+);/g;let o;for(;o=n.exec(String(t||""));)o[2]!=="*"&&e[o[1]].push({name:o[2],value:o[3].trim()});const r=[];Object.entries(cn).forEach(([s,i])=>{r.push({label:s,css:i,color:null})}),e.color.forEach(({name:s,value:i})=>{const l=gn(i);Object.entries(pe).forEach(([d,f])=>{r.push({label:`${d}-${s}`,css:`${f}: var(--color-${s})`,color:l})}),r.push({label:`text-${s}`,css:`color: var(--color-${s})`,color:l})}),e.spacing.forEach(({name:s})=>{Object.entries(fe).forEach(([i,l])=>{r.push({label:`${i}-${s}`,css:`${l}: var(--spacing-${s})`,color:null})})}),e.text.forEach(({name:s})=>{r.push({label:`text-${s}`,css:`font-size: var(--text-${s})`,color:null})}),e.leading.forEach(({name:s})=>{r.push({label:`leading-${s}`,css:`line-height: var(--leading-${s})`,color:null})}),e.font.forEach(({name:s})=>{r.push({label:`font-${s}`,css:`font-family: var(--font-${s})`,color:null})}),e.radius.forEach(({name:s})=>{r.push({label:s==="DEFAULT"?"rounded":`rounded-${s}`,css:`border-radius: var(--radius-${s})`,color:null})});const a=new Map;return r.forEach(s=>{a.has(s.label)||a.set(s.label,s)}),{items:[...a.values()],byUtility:a}}function Et(t){return dt||(dt=t.fetch("/!/sve/tailwind-theme",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{css:""}).then(e=>Zt(typeof e.css=="string"?e.css:"")).catch(()=>Zt(""))),dt}function dn(t){return!!(t.matchBefore(/class\s*=\s*"[^"]*$/i)||t.matchBefore(/class\s*=\s*'[^']*$/i))}function un(t,e){const n=t.doc.lineAt(e),o=e-n.from,r=fn(n.text,o);if(!r)return null;const a=n.text.slice(r.valueFrom,r.valueTo),s=o-r.valueFrom,i=a.slice(0,s),l=a.slice(s),d=(i.match(/[^\s]*$/)||[""])[0],f=(l.match(/^[^\s]*/)||[""])[0],c=d+f;if(!c||c.includes("{"))return null;const u=n.from+r.valueFrom+(i.length-d.length);return{from:u,to:u+c.length,text:c}}function fn(t,e){const n=/\bclass\s*=\s*(["'])/gi;let o;for(;o=n.exec(t);){const r=o[1],a=o.index+o[0].length,s=t.indexOf(r,a),i=s===-1?t.length:s;if(e>=a&&e<=i)return{valueFrom:a,valueTo:i}}return null}function At(t){const e=[...ue].sort((s,i)=>i.length-s.length),n=[];let o=String(t||""),r=!0;for(;r;){r=!1;for(const s of e){const i=`${s}:`;if(o.startsWith(i)){n.push(s),o=o.slice(i.length),r=!0;break}}}let a=!1;return o.startsWith("!")?(a=!0,o=o.slice(1)):o.endsWith("!")&&(a=!0,o=o.slice(0,-1)),{variants:n,utility:o,important:a}}function pn(t,e){const{variants:n,utility:o}=At(t),r=n.length?`${n.join(":")}:`:"",a=o.toLowerCase(),s=[];return!a&&!r&&ue.forEach(i=>{s.push({label:`${i}:`,type:"keyword",detail:"variant",boost:2})}),e.items.forEach(i=>{if(a&&!i.label.startsWith(a)&&!i.label.includes(a))return;const l=`${r}${i.label}`;s.push({label:l,type:"property",detail:i.css,boost:i.label.startsWith(a)?1:0})}),s.sort((i,l)=>(l.boost||0)-(i.boost||0)||i.label.localeCompare(l.label))}function mn(t,e){const{variants:n,utility:o,important:r}=At(t),a=e.byUtility.get(o);if(!a)return"";let s=a.css;r&&(s+=" !important");const i=t.replace(/[^a-zA-Z0-9_-]/g,c=>`\\${c}`);let l="";const d=[];n.forEach(c=>{Ut[c]?d.push(Ut[c]):Vt[c]&&(l+=Vt[c])});let f=`.${i}${l} { ${s} }`;return d.slice().reverse().forEach(c=>{f=`@media ${c} {
  ${f}
}`}),f}function hn(t,e){const{utility:n}=At(t);return e.byUtility.get(n)?.color||null}function gn(t){const e=String(t||"").trim();return/^#([0-9a-fA-F]{3,8})$/.test(e)?e:null}function vn(t,e){const n=document.createElement("div");if(n.className="sve-tw-info",e){const r=document.createElement("span");r.className="sve-tw-swatch",r.style.background=e,n.appendChild(r)}const o=document.createElement("pre");return o.textContent=t,n.appendChild(o),n}const h=Fe({emptyText:"",tag:"",scope:"",scopeTitle:"",baseLabel:"",groups:[],canEdit:!1,onChip:null,variant:"",breakpoints:[],onBreakpoint:null,state:"",stateLabel:"",onState:null,onTag:null,dropTitle:"",onDrop:null,sortTitle:"",onSort:null,siteClasses:[]});function he(t,e,n){const o=String(t||"").slice(e,n),r=le(o),a=/(\sclass\s*=\s*)(["'])/i.exec(r);if(!a)return null;const s=a[2],i=a.index+a[1].length+1,l=r.indexOf(s,i);return l===-1?null:{from:e+i,to:e+l,quote:s,value:o.slice(i,l)}}function bn(t){const e=String(t||""),n=[];let o=0;for(;o<e.length;){if(/\s/.test(e[o])){o+=1;continue}let r=o,a=!1;for(;r<e.length;){if(e.startsWith("{{",r)){const s=e.indexOf("}}",r+2);a=!0,r=s===-1?e.length:s+2;continue}if(/\s/.test(e[r]))break;r+=1}n.push({text:e.slice(o,r),from:o,to:r,dynamic:a}),o=r}return n}function ge(t){const e=String(t||""),n=[];let o=0,r=0;for(let s=0;s<e.length;s+=1){const i=e[s];i==="["||i==="("?o+=1:i==="]"||i===")"?o=Math.max(0,o-1):i===":"&&o===0&&(n.push(e.slice(r,s)),r=s+1)}const a=e.slice(r);return{variants:n,base:a}}function ve(t){let n=String(t||""),o="";n.startsWith("!")?(o="pre",n=n.slice(1)):n.endsWith("!")&&(o="post",n=n.slice(0,-1));let r="";const a=yn(n);return a!==-1&&(r=n.slice(a),n=n.slice(0,a)),{name:n,modifier:r,important:o}}function yn(t){let e=0;for(let n=0;n<t.length;n+=1){const o=t[n];if(o==="["||o==="(")e+=1;else if(o==="]"||o===")")e=Math.max(0,e-1);else if(o==="/"&&e===0)return n}return-1}function vt({variants:t,name:e,modifier:n,important:o}){let r=`${e}${n||""}`;return o==="pre"?r=`!${r}`:o==="post"&&(r=`${r}!`),[...t||[],r].join(":")}function Lt(t){const e=bn(t),n=new Map;let o=null,r=0;const a=e.findIndex(i=>i.text==="]");if(e[0]?.text==="["&&a>0){const i=e.slice(1,a);o={from:e[0].from,to:e[a].to,label:`[ ${i.map(l=>l.text).join(" ")} ]`},r=a+1}for(;r<e.length;r+=1){const i=e[r],{variants:l,base:d}=ge(i.text),{name:f,modifier:c,important:u}=ve(d),v=l.join(":");n.has(v)||n.set(v,{key:v,variants:l,items:[]}),n.get(v).items.push({raw:i.text,from:i.from,to:i.to,dynamic:i.dynamic,variants:l,name:f,modifier:c,important:u})}const s=[...n.values()];return s.sort((i,l)=>i.key===""?-1:l.key===""?1:0),{scope:o,groups:s}}function st(t,e,n){const o=String(t||"");if(n)return o.slice(0,e.from)+n+o.slice(e.to);let r=e.from,a=e.to;if(r>0&&(o[r-1]===" "||o[r-1]==="	"))for(;r>0&&(o[r-1]===" "||o[r-1]==="	");)r-=1;else for(;a<o.length&&(o[a]===" "||o[a]==="	");)a+=1;return xn(o.slice(0,r)+o.slice(a),r)}function xn(t,e){const n=t.lastIndexOf(`
`,Math.max(0,e-1));if(n===-1)return t;const o=t.indexOf(`
`,n+1);return t.slice(n+1,o===-1?t.length:o).trim()!==""?t:t.slice(0,n)+t.slice(o===-1?t.length:o)}function be(t,e){const n=String(t||"");return n.trim()?`${n.replace(/\s+$/,"")} ${e}`:e}function ye(t,e,n){const o=String(t||"");if(!Array.isArray(e)||e.length!==n?.length)return o;let r=o;for(let a=e.length-1;a>=0;a-=1)r=r.slice(0,e[a].from)+n[a]+r.slice(e[a].to);return r}function xe(t,e,n){const o=String(t||""),r=String(n||"").trim().toLowerCase();if(!/^[a-z][a-z0-9-]*$/.test(r)||!e?.tag||r===e.tag.toLowerCase())return o;const a=e.tag.toLowerCase(),s=o.slice(e.from,e.openTo);if(!new RegExp(`^<${a}(?=[\\s/>])`,"i").test(s))return o;let i=o;const l=i.toLowerCase().lastIndexOf(`</${a}`,e.to);return l>e.from&&l<e.to&&(i=i.slice(0,l)+`</${r}`+i.slice(l+2+a.length)),i.slice(0,e.from)+`<${r}`+i.slice(e.from+1+a.length)}function wn(t,e,n){const o=he(t,e.from,e.openTo);if(o)return t.slice(0,o.from)+n+t.slice(o.to);const r=String(t).slice(e.from,e.openTo),a=/^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(r);if(!a||!n)return t;const s=e.from+a[0].length;return`${t.slice(0,s)} class="${n}"${t.slice(s)}`}const kn=[...Object.keys(fe),...Object.keys(pe),"text","leading","font","rounded"].sort((t,e)=>e.length-t.length);let ut=null;function $n(t){return ut||(ut=Et(t).then(Cn)),ut}function we(t){const e=String(t||"");if(e.includes(";"))return"";const n=e.indexOf(":");return n===-1?"":e.slice(0,n).trim()}function Cn(t){const e=new Map,n=new Map,o=new Map;for(const r of t.items){const a=we(r.css);a&&(e.has(a)||e.set(a,[]),e.get(a).push(r),n.set(r.label,a));const s=ke(r.label);s&&(o.has(s)||o.set(s,[]),o.get(s).push(r))}return{catalog:t,byProperty:e,propertyOfUtility:n,byPrefix:o}}function ke(t){for(const e of kn)if(String(t).startsWith(`${e}-`))return e;return""}function $e(t,e){if(!e||!t)return null;const n=e.propertyOfUtility.get(t);if(n)return{label:n,options:e.byProperty.get(n)||[]};const o=ke(t),r=o?e.byPrefix.get(o):null;return r?.length?{label:we(r[0].css)||o,options:r}:null}function Ce(t,e){return e?.catalog?.byUtility?.get(t)?.css||""}function _n(t,e){return e?.catalog?.byUtility?.get(t)?.color||""}const Sn={class:"sve-tw"},Tn={key:0,class:"sve-tw-head"},En=["disabled"],An=["title","data-active","disabled","onClick"],Ln=["data-active","disabled"],Mn=["title","disabled"],Pn={key:1,class:"sve-tw-empty"},On=["data-sve-tw-base","data-current"],zn={class:"sve-tw-chips"},Bn=["title","onClick"],Rn=["title","onClick"],In={__name:"TwClassList",setup(t){function e(n){const o={"data-sve-tw-chip":n.id};return n.locked&&(o["data-sve-tw-locked"]=""),n.open&&(o["data-open"]=""),o}return(n,o)=>($(),C("div",Sn,[T(h).tag?($(),C("div",Tn,[b("button",{type:"button",class:"sve-tw-tag",disabled:!T(h).canEdit,onClick:o[0]||(o[0]=A(r=>T(h).onTag?.(r),["prevent","stop"]))},"<"+P(T(h).tag)+">",9,En),($(!0),C(F,null,K(T(h).breakpoints,r=>($(),C("button",{key:r.index,type:"button","data-sve-tw-bp":"",title:r.title,"data-active":r.active?"":void 0,disabled:!T(h).canEdit,onClick:A(a=>T(h).onBreakpoint?.(r.index),["prevent","stop"])},P(r.label),9,An))),128)),b("button",{type:"button","data-sve-tw-state":"","data-active":T(h).state?"":void 0,disabled:!T(h).canEdit,onClick:o[1]||(o[1]=A(r=>T(h).onState?.(r),["prevent","stop"]))},[ht(P(T(h).stateLabel)+" ",1),o[3]||(o[3]=b("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[b("path",{d:"m6 9 6 6 6-6"})],-1))],8,Ln),b("button",{type:"button","data-sve-tw-sort":"",title:T(h).sortTitle,disabled:!T(h).canEdit,onClick:o[2]||(o[2]=A(r=>T(h).onSort?.(),["prevent","stop"]))},[...o[4]||(o[4]=[b("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round"},[b("path",{d:"M2.5 4h9M2.5 8h6M2.5 12h3"}),b("path",{d:"M13 5v7M11.4 10.4 13 12l1.6-1.6"})],-1)])],8,Mn),o[5]||(o[5]=b("span",{class:"sve-tw-gap"},null,-1))])):W("",!0),T(h).groups.length?W("",!0):($(),C("div",Pn,P(T(h).emptyText),1)),($(!0),C(F,null,K(T(h).groups,r=>($(),C("div",{key:r.key,class:"sve-tw-group"},[b("span",{class:"sve-tw-variant","data-sve-tw-base":r.key===""?"":void 0,"data-current":r.current?"":void 0},P(r.key===""?T(h).baseLabel:r.key),9,On),b("div",zn,[($(!0),C(F,null,K(r.chips,a=>($(),C("span",{key:a.id,class:"sve-tw-chip-wrap"},[b("button",We({type:"button"},{ref_for:!0},e(a),{title:a.title,onClick:A(s=>T(h).onChip?.(s,a.id),["prevent","stop"])}),[a.color?($(),C("span",{key:0,class:"sve-tw-dot",style:kt({background:a.color})},null,4)):W("",!0),ht(" "+P(a.raw),1)],16,Bn),a.locked?W("",!0):($(),C("button",{key:0,type:"button",class:"sve-tw-drop",title:T(h).dropTitle,onClick:A(s=>T(h).onDrop?.(a.id),["prevent","stop"])},"−",8,Rn))]))),128))])]))),128))]))}},Dn=je(In,[["__scopeId","data-v-d1960a11"]]),Fn={key:0,"data-sve-tw-menu-title":""},jn={"data-sve-tw-menu-list":""},Wn=["data-active","title","onClick"],qn={"data-sve-tw-tick":""},Hn={"data-sve-tw-label":""},Mt={__name:"TwClassMenu",props:{title:{type:String,default:""},options:{type:Array,default:()=>[]},removeLabel:{type:String,default:""},onPick:{type:Function,required:!0},onRemove:{type:Function,required:!0}},setup(t){return(e,n)=>($(),C(F,null,[t.title?($(),C("div",Fn,P(t.title),1)):W("",!0),b("div",jn,[($(!0),C(F,null,K(t.options,o=>($(),C("button",{key:o.label,type:"button","data-sve-tw-option":"","data-active":o.active?"":void 0,title:o.css,onClick:A(r=>t.onPick(o.label),["prevent","stop"])},[b("span",qn,P(o.active?"✓":""),1),o.color?($(),C("span",{key:0,"data-sve-tw-dot":"",style:kt({background:o.color})},null,4)):W("",!0),b("span",Hn,P(o.label),1)],8,Wn))),128))]),b("button",{type:"button","data-sve-tw-remove":"",onClick:n[0]||(n[0]=A(o=>t.onRemove(),["prevent","stop"]))},[n[1]||(n[1]=b("span",{"data-sve-tw-tick":""},"✕",-1)),ht(P(t.removeLabel),1)])],64))}},Nn={"data-sve-tw-search":""},Un=["placeholder","aria-label","onKeydown"],Vn={"data-sve-tw-tabs":""},Zn=["data-active"],Kn=["data-active"],Xn={key:0,"data-sve-tw-add-empty":""},Yn=["data-cursor","data-active","data-sve-tw-off","title","onMouseenter","onClick"],Gn={"data-sve-tw-label":""},Qn={__name:"TwAddClass",props:{label:{type:String,default:""},placeholder:{type:String,default:""},sitePlaceholder:{type:String,default:""},emptyText:{type:String,default:""},offText:{type:String,default:""},siteLabel:{type:String,default:""},tailwindLabel:{type:String,default:""},search:{type:Function,required:!0},onAdd:{type:Function,required:!0}},setup(t){const e=t,n=z(""),o=z(null),r=z("tailwind"),a=z(null),s=z(-1),i=z(!1),l=N(()=>n.value.trim().toLowerCase()),d=N(()=>(h.siteClasses||[]).flatMap(w=>w.items).filter(w=>!l.value||w.name.toLowerCase().includes(l.value))),f=N(()=>e.search(n.value)),c=N(()=>r.value==="site"?d.value:f.value),u=N(()=>r.value==="site"?e.sitePlaceholder:e.placeholder);re(()=>gt(()=>o.value?.focus()));function v(w){return w?.name||w?.label||""}function g(w){i.value=!0;const p=c.value.length;if(!p){s.value=-1;return}const x=s.value+w;s.value=x<0?-1:Math.min(x,p-1),gt(()=>m())}function m(){const w=a.value?.querySelector("[data-cursor]");if(!w)return;let p=w.parentElement;for(;p&&p.scrollHeight<=p.clientHeight;)p=p.parentElement;if(!p)return;const x=w.offsetTop,D=x+w.offsetHeight;x<p.scrollTop?p.scrollTop=x:D>p.scrollTop+p.clientHeight&&(p.scrollTop=D-p.clientHeight)}function M(w){i.value||(s.value=w)}function L(){s.value=-1}function I(){const w=s.value>=0?c.value[s.value]:null,p=w?v(w):n.value.trim();p&&e.onAdd(p)}return(w,p)=>($(),C(F,null,[b("div",Nn,[p[7]||(p[7]=b("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[b("circle",{cx:"11",cy:"11",r:"7"}),b("path",{d:"m20 20-3.5-3.5"})],-1)),se(b("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":p[0]||(p[0]=x=>n.value=x),type:"text",placeholder:u.value,"aria-label":t.label,onInput:L,onKeydown:[p[1]||(p[1]=q(A(x=>g(1),["prevent"]),["down"])),p[2]||(p[2]=q(A(x=>g(-1),["prevent"]),["up"])),q(A(I,["prevent"]),["enter"]),p[3]||(p[3]=q(A(()=>{},["stop"]),["escape"]))]},null,40,Un),[[ae,n.value]])]),b("div",Vn,[b("button",{type:"button","data-sve-tw-tab":"","data-active":r.value==="tailwind"?"":void 0,onClick:p[4]||(p[4]=A(x=>{r.value="tailwind",L()},["prevent","stop"]))},P(t.tailwindLabel),9,Zn),b("button",{type:"button","data-sve-tw-tab":"","data-active":r.value==="site"?"":void 0,onClick:p[5]||(p[5]=A(x=>{r.value="site",L()},["prevent","stop"]))},P(t.siteLabel),9,Kn)]),c.value.length?W("",!0):($(),C("div",Xn,P(t.emptyText),1)),b("div",{ref_key:"rowsEl",ref:a,onMousemove:p[6]||(p[6]=x=>i.value=!1)},[($(!0),C(F,null,K(c.value,(x,D)=>($(),C("button",{key:x.name||x.label,type:"button","data-sve-tw-option":"","data-cursor":D===s.value?"":void 0,"data-active":D===s.value?"":void 0,"data-sve-tw-off":x.loaded===!1?"":void 0,title:x.loaded===!1?t.offText:x.file||x.css,onMouseenter:lt=>M(D),onClick:A(lt=>t.onAdd(x.name||x.label),["prevent","stop"])},[x.color?($(),C("span",{key:0,"data-sve-tw-dot":"",style:kt({background:x.color})},null,4)):W("",!0),b("span",Gn,P(x.name||x.label),1)],40,Yn))),128))],544)],64))}},Jn={"data-sve-tw-search":""},to=["placeholder","aria-label","onKeydown"],eo=["data-active","onMouseenter","onClick"],no={"data-sve-tw-tick":""},oo={"data-sve-tw-label":""},_e={__name:"TwTagMenu",props:{label:{type:String,default:""},placeholder:{type:String,default:""},current:{type:String,default:""},tags:{type:Array,default:()=>[]},onPick:{type:Function,required:!0}},setup(t){const e=t,n=z(""),o=z(null),r=z(-1),a=z(!1),s=N(()=>n.value.trim().toLowerCase()),i=N(()=>{if(!s.value)return e.tags;const f=e.tags.filter(c=>c.includes(s.value));return f.sort((c,u)=>(c.startsWith(s.value)?0:1)-(u.startsWith(s.value)?0:1)),f});re(()=>gt(()=>o.value?.focus()));function l(f){a.value=!0;const c=i.value.length;r.value=c?Math.min(Math.max(r.value+f,-1),c-1):-1}function d(){const f=r.value>=0?i.value[r.value]:n.value.trim().toLowerCase();f&&e.onPick(f)}return(f,c)=>($(),C(F,null,[b("div",Jn,[c[6]||(c[6]=b("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[b("circle",{cx:"11",cy:"11",r:"7"}),b("path",{d:"m20 20-3.5-3.5"})],-1)),se(b("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":c[0]||(c[0]=u=>n.value=u),type:"text",placeholder:t.placeholder,"aria-label":t.label,onInput:c[1]||(c[1]=u=>r.value=-1),onKeydown:[c[2]||(c[2]=q(A(u=>l(1),["prevent"]),["down"])),c[3]||(c[3]=q(A(u=>l(-1),["prevent"]),["up"])),q(A(d,["prevent"]),["enter"]),c[4]||(c[4]=q(A(()=>{},["stop"]),["escape"]))]},null,40,to),[[ae,n.value]])]),b("div",{onMousemove:c[5]||(c[5]=u=>a.value=!1)},[($(!0),C(F,null,K(i.value,(u,v)=>($(),C("button",{key:u,type:"button","data-sve-tw-option":"","data-active":v===r.value||r.value===-1&&u===t.current?"":void 0,onMouseenter:g=>a.value?null:r.value=v,onClick:A(g=>t.onPick(u),["prevent","stop"])},[b("span",no,P(u===t.current?"✓":""),1),b("span",oo,"<"+P(u)+">",1)],40,eo))),128))],32)],64))}},S="__sve-tw-menu",Kt="--sve-tw-anchor",ro=typeof CSS<"u"&&CSS.supports?.("anchor-name: --x");let ot=null;const Xt="__sve-tw-style",Pt=[{key:"",all:!0,device:"Responsive",label:"tw_size_all"},{key:"",device:"Laptop",label:"tw_size_laptop",prefix:""},{key:"max-lg",device:"Tablet",label:"responsive_tablet",under:1024},{key:"max-md",device:"Mobile",label:"responsive_mobile",under:768}],Yt=["","dark","hover","focus","active","before","after"],Se={Mobile:"max-md",Tablet:"max-lg",Laptop:"",Desktop:""},Te=["div","section","article","header","footer","main","aside","nav","h1","h2","h3","h4","h5","h6","p","span","a","button","label","ul","ol","li","figure","figcaption","blockquote","strong","em","small","picture","img","video","form","table","tr","td","th"];let Ee="",X="",it=!1;function so(){try{return Se[$t(window,"sve-lp-device")]??""}catch{return""}}function Ot(){return it?Ee:so()}function Ae(){return[Ot(),X].filter(Boolean)}function zt(){return Ae().join(":")}const ao=/^(max-)?(sm|md|lg|xl|2xl)$/;function io(t){return String(t||"").split(":").find(e=>ao.test(e))||""}function Le(){if(it)return!0;try{return Object.prototype.hasOwnProperty.call(Se,$t(window,"sve-lp-device"))}catch{return!1}}function lo(t){if(!Le())return!0;const e=io(t);return e===Ot()?!0:!Pt.some(n=>n.key===e)}let k=null,Y=new Map,B=null,ft=!1,at="",bt=null;function Me(t){return t?.querySelector?.('[data-sve-style="tw"] [data-sve-tw-host]')||null}function Pe(t){if(t.getElementById(Xt))return;const e=t.createElement("style");e.id=Xt,e.textContent=`
    #${S} {
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
    #${S} [data-sve-tw-menu-title] {
      padding: 0.1em 0.2em 0.5em;
      opacity: .55;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.6875rem;
    }
    #${S} [data-sve-tw-option],
    #${S} [data-sve-tw-remove] {
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
    #${S} [data-sve-tw-option]:hover,
    #${S} [data-sve-tw-remove]:hover {
      background: rgba(255,255,255,.1);
    }
    #${S} [data-sve-tw-option][data-active] {
      background: rgba(255,255,255,.06);
    }
    #${S} [data-sve-tw-option][data-sve-tw-off] [data-sve-tw-label] {
      opacity: .45;
      text-decoration: line-through;
      text-decoration-thickness: 1px;
    }
    #${S} [data-sve-tw-tick] {
      flex: 0 0 auto;
      width: 0.9em;
      opacity: .7;
      font-family: ui-sans-serif, system-ui, sans-serif;
      line-height: 1;
    }
    #${S} [data-sve-tw-dot] {
      flex: 0 0 auto;
      width: 0.9em;
      height: 0.9em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
    #${S} [data-sve-tw-label] {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #${S} [data-sve-tw-remove] {
      margin-top: 0.3rem;
      border-top: 1px solid rgba(255,255,255,.14);
      border-radius: 0 0 0.4em 0.4em;
      padding-top: 0.6em;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    #${S} [data-sve-tw-search] {
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
    #${S} [data-sve-tw-search]:focus-within {
      border-color: rgba(147,197,253,.7);
    }
    #${S} [data-sve-tw-search] svg {
      flex: 0 0 auto;
      opacity: .5;
    }
    #${S} [data-sve-tw-add-input] {
      all: unset;
      flex: 1 1 auto;
      min-width: 0;
      color: inherit;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.75rem;
    }
    #${S} [data-sve-tw-tabs] {
      display: flex;
      gap: 0.2rem;
      margin-bottom: 0.45rem;
      padding: 0.15rem;
      border-radius: 0.45em;
      background: rgba(0,0,0,.28);
    }
    #${S} [data-sve-tw-tab] {
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
    #${S} [data-sve-tw-tab]:hover { opacity: 1; }
    #${S} [data-sve-tw-tab][data-active] {
      opacity: 1;
      background: rgba(255,255,255,.14);
    }
    #${S} [data-sve-tw-add-empty] {
      padding: 0.4em 0.5em;
      opacity: .55;
    }
  `,t.head.appendChild(e)}function Oe(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e.contentDocument;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o.contentDocument}catch{}return null}function co(t,e,n){const o=Oe(t);if(!(!o||!k?.path))for(const r of o.querySelectorAll(`[${Ve}="${k.path}"]`))try{e&&r.classList.remove(e),n&&r.classList.add(n)}catch{}}const pt=new Map,uo=/(^|-)color$|^fill$|^stroke$/;function Bt(t){const e=String(t||""),n=e.slice(0,e.indexOf(":")).trim();return uo.test(n)&&/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(e)?.[1]||""}function ze(t,e){if(!e)return"";if(pt.has(e))return pt.get(e);const n=Oe(t),o=n?.documentElement,r=n?.defaultView;if(!o||!r)return"";let a="",s=e;for(let i=0;i<6&&s;i+=1){try{a=r.getComputedStyle(o).getPropertyValue(s).trim()}catch{return""}if(!a)return"";if(s=Bt(a),!s)break}return a&&!a.startsWith("var(")?(pt.set(e,a),a):""}function fo(t,e){return _n(e,B)||ze(t,Bt(Ce(e,B)))}function O(t){const e=t?.document.getElementById(S);ot&&(ot.style.removeProperty("anchor-name"),ot=null),bt?.(),bt=null,at="",e&&(e._sveApp?.unmount(),e.remove())}function Gt(t,e,n){const o=e.getBoundingClientRect(),r=n.offsetWidth||176,a=8,s=140,i=e.closest?.("#__sve-tw-strip")?Ao(t):null,l=i?i.top:0,d=i?i.bottom:t.innerHeight,f=i?i.left:0,c=i?i.right:t.innerWidth,u=o.bottom+4,v=d-u-a,g=Math.max(s,Math.min(v,420));n.style.left=`${Math.max(f+a,Math.min(o.left,c-r-a))}px`,n.style.maxHeight=`${g}px`,n.style.top=`${v>=s?u:Math.max(l+a,d-a-g)}px`}function Q(t,e,n,o){const r=t.document;O(t),Pe(r);const a=r.createElement("div");a.id=S,r.body.appendChild(a),a._sveApp=qe(n,a,o);const s=ro&&!!e.closest?.("#__sve-tw-strip");s?(ot=e,e.style.setProperty("anchor-name",Kt),a.style.setProperty("position","absolute"),a.style.setProperty("position-anchor",Kt),a.style.setProperty("position-area","block-end span-inline-start"),a.style.setProperty("position-try-fallbacks","flip-block, flip-inline, flip-block flip-inline"),a.style.setProperty("margin","4px 0 0 0"),a.style.setProperty("max-height","20rem")):Gt(t,e,a);const i=()=>{s||Gt(t,e,a)},l=f=>{!a.contains(f.target)&&!e.contains(f.target)&&(O(t),nt())},d=f=>{f.key==="Escape"&&(O(t),nt())};return r.addEventListener("pointerdown",l,!0),r.addEventListener("keydown",d,!0),t.addEventListener("scroll",i,!0),t.addEventListener("resize",i),bt=()=>{r.removeEventListener("pointerdown",l,!0),r.removeEventListener("keydown",d,!0),t.removeEventListener("scroll",i,!0),t.removeEventListener("resize",i)},a}function Be(t,e,n){return(e||[]).map(o=>({label:o.label,css:o.css,color:o.color||ze(t,Bt(o.css)),active:o.label===n}))}function V(){return!k||j("dock:is-locked")===!0}function Z(){const t=j("dock:html");if(!k||typeof t!="string"||t[k.from]!=="<")return null;const e=he(t,k.from,k.openTo);return{html:t,value:e?e.value:""}}function po(t){if(!k?.path)return;const n=Tt(St(t),new Set).find(o=>o.path===k.path);n&&(k={from:n.from,openTo:n.openTo,path:n.path,tag:n.tag})}function H(t,e,n,o,r){const a=wn(e,k,n);a!==e&&(co(t,o,r),j("dock:set-html",a),po(a),R(t))}const Qt=["display","position","inset","top","right","bottom","left","z-index","flex-direction","flex-wrap","justify-content","align-items","gap","column-gap","row-gap","margin","margin-inline","margin-block","margin-top","margin-right","margin-bottom","margin-left","padding","padding-inline","padding-block","padding-top","padding-right","padding-bottom","padding-left","width","min-width","max-width","height","min-height","max-height","font-family","font-size","font-weight","line-height","text-align","text-transform","text-decoration-line","font-style","color","background-color","border-color","border-radius","fill","stroke","outline-color","overflow"];function Jt(t){const e=G(t);if(!e)return-1;const n=Qt.indexOf(e);return n===-1?Qt.length:n}function mo(t){if(V())return;const e=Z();if(!e)return;const n=Lt(e.value),o=n.groups.flatMap(l=>l.items).filter(l=>!l.dynamic);if(o.length<2)return;const r=new Map;n.groups.forEach((l,d)=>r.set(l.key,l.key===""?-1:d));const a=[...o].sort((l,d)=>{const f=r.get(l.variants.join(":"))??0,c=r.get(d.variants.join(":"))??0;return f-c||Jt(l.name)-Jt(d.name)||l.name.localeCompare(d.name)}),s=[...o].sort((l,d)=>l.from-d.from).map(l=>({from:l.from,to:l.to})),i=ye(e.value,s,a.map(l=>l.raw));i!==e.value&&H(t,e.html,i,"","")}function G(t){return $e(t,B)?.label||""}function yt(t){return Lt(t).groups.flatMap(e=>e.items)}function Re(t){const e=zt();return yt(t).filter(n=>!n.dynamic&&n.variants.join(":")===e)}function te(t,e){if(V()||!e)return;const n=Z();if(!n)return;const o=G(e),r=Re(n.value).find(s=>s.name===e||o&&G(s.name)===o);if(r?.name===e){H(t,n.html,st(n.value,r,""),e,"");return}if(r){const s=vt({variants:r.variants,name:e,modifier:r.modifier,important:r.important});H(t,n.html,st(n.value,r,s),r.raw,s);return}const a=vt({variants:Ae(),name:e,modifier:"",important:""});H(t,n.html,be(n.value,a),"",a)}function ho(t,e){const n=String(e||"").trim(),o=zt(),r=o&&!n.includes(":")?`${o}:${n}`:n;if(V()||!n)return;const a=Z();if(!a||yt(a.value).some(u=>u.raw===r))return;const{variants:i,base:l}=ge(r),d=G(ve(l).name),f=i.join(":"),c=d?yt(a.value).find(u=>!u.dynamic&&u.variants.join(":")===f&&G(u.name)===d):null;if(c){H(t,a.html,st(a.value,c,r),c.raw,r);return}H(t,a.html,be(a.value,r),"",r.includes(":")?"":r)}function xt(t,e,n){if(V())return;const o=Z();if(!o||o.value.slice(e.from,e.to)!==e.raw){R(t);return}const r=n?vt({variants:e.variants,name:n,modifier:e.modifier,important:e.important}):"";H(t,o.html,st(o.value,e,r),e.raw,r)}function go(t,e){if(V()||!k)return;const n=j("dock:html");if(typeof n!="string"||n[k.from]!=="<")return;const o=xe(n,k,e);if(o===n)return;const r=k.from;j("dock:set-html",o);const s=Tt(St(o),new Set).find(i=>i.from===r);s&&(k={from:s.from,openTo:s.openTo,path:s.path,tag:s.tag}),R(t),et("tw:changed")}function Wo(t,e,n){n?.tag&&Q(t,e,_e,{label:_(t,"tw_tag"),placeholder:_(t,"tw_tag_placeholder"),current:String(n.tag).toLowerCase(),tags:Te,onPick:o=>{vo(t,n,o),O(t)}})}function vo(t,e,n){if(j("dock:is-locked")===!0)return;const o=j("dock:html");if(typeof o!="string"||o[e.from]!=="<")return;const r=xe(o,e,n);r!==o&&j("dock:set-html",r)}function bo(t,e){Q(t,e,_e,{label:_(t,"tw_tag"),placeholder:_(t,"tw_tag_placeholder"),current:(k?.tag||"").toLowerCase(),tags:Te,onPick:n=>{go(t,n),O(t)}})}function yo(t,e){if(V())return;const n=Z();if(!n)return;const o=e.map(s=>Y.get(s)).filter(Boolean);if(o.length<2)return;const r=[...o].sort((s,i)=>s.from-i.from).map(s=>({from:s.from,to:s.to})),a=ye(n.value,r,o.map(s=>s.raw));a!==n.value&&H(t,n.html,a,"","")}function qo(t){It(t,k?.path||"")}function Ho(){return!!k}function xo(t,e){const n=Pt[e];n&&(j("lp:set-device",{win:t,key:n.device}),it=!n.all,Ee=n.key,O(t),R(t),et("tw:changed"))}function wo(t,e){Q(t,e,Mt,{title:_(t,"tw_state"),removeLabel:_(t,"tw_state_none"),options:Yt.filter(Boolean).map(n=>({label:n,css:"",color:null,active:n===X})),onPick:n=>{X=Yt.includes(n)?n:"",O(t),R(t),et("tw:changed")},onRemove:()=>{X="",O(t),R(t),et("tw:changed")}})}Ne("lp:device",()=>{it=!1,Me(window.document)&&R(window)});function ko(t){const e=t?Z():null;return e&&Re(e.value).find(n=>G(n.name)===t)?.name||""}function No(t,e,n,o){const r=B?.byProperty.get(n)||[];if(!r.length)return;const a=ko(n);Q(t,e,Mt,{title:n,removeLabel:_(t,"tw_classes_remove"),options:Be(t,r,a),onPick:s=>{te(t,s),O(t),o?.(s)},onRemove:()=>{a&&te(t,a),O(t),o?.("")}})}let ee=[],mt=!1;function $o(t){mt||(mt=!0,t.fetch("/!/sve/site-css/classes",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{groups:[]}).then(e=>{ee=Array.isArray(e?.groups)?e.groups:[],h.siteClasses=ee}).catch(()=>{mt=!1}))}function Co(t,e){$o(t),Q(t,e,Qn,{label:_(t,"tw_add_class"),placeholder:_(t,"tw_add_placeholder"),emptyText:_(t,"tw_add_empty"),offText:_(t,"tw_class_not_imported"),sitePlaceholder:_(t,"tw_add_placeholder_site"),siteLabel:_(t,"tw_add_site"),tailwindLabel:_(t,"tw_add_tailwind"),search:n=>{const o=String(n||"").trim().toLowerCase();if(!o||!B)return[];const r=B.catalog.items.filter(a=>a.label.toLowerCase().includes(o));return r.sort((a,s)=>{const i=a.label.toLowerCase().startsWith(o)?0:1,l=s.label.toLowerCase().startsWith(o)?0:1;return i-l||a.label.length-s.label.length}),r.slice(0,40).map(a=>({label:a.label,css:a.css,color:a.color,active:!1}))},onAdd:n=>{ho(t,n)}})}function _o(t,e,n){const o=Y.get(n);if(!o||o.locked)return;if(at===n){O(t),nt();return}const r=$e(o.name,B);Q(t,e.currentTarget,Mt,{title:r?.label||"",removeLabel:_(t,"tw_classes_remove"),options:Be(t,r?.options,o.name),onPick:a=>{xt(t,o,a),O(t)},onRemove:()=>{xt(t,o,""),O(t)}}),at=n,nt()}function nt(){for(const t of h.groups)for(const e of t.chips)e.open=e.id===at}function Uo(t,e){if(!e||e.from==null||e.openTo==null){k=null,Y=new Map,O(t),R(t);return}k={from:e.from,openTo:e.openTo,path:e.path,tag:e.tag},R(t)}function R(t){So(t);const e=k?Z():null,n=e?Lt(e.value):{scope:null,groups:[]};Y=new Map,h.baseLabel=_(t,"tw_size_base"),h.scopeTitle=_(t,"tw_classes_scope"),h.dropTitle=_(t,"tw_classes_remove"),h.variant=zt(),h.onBreakpoint=s=>xo(t,s),h.onState=s=>wo(t,s.currentTarget);const o=Le();h.breakpoints=Pt.map((s,i)=>({index:i,label:_(t,s.label),title:s.under?`${s.key}:  ·  < ${s.under}px`:_(t,s.all?"tw_size_all_title":"tw_size_base_title"),active:s.all?!o:o&&s.key===Ot()})),h.state=X,h.stateLabel=X||_(t,"tw_state"),h.canEdit=!V(),h.onChip=(s,i)=>_o(t,s,i),h.onTag=s=>bo(t,s.currentTarget),h.sortTitle=_(t,"tw_sort"),h.onSort=()=>mo(t),h.onDrop=s=>{const i=Y.get(s);i&&!i.locked&&(O(t),xt(t,i,""))},h.tag=k?.tag||"";const r=n.scope?.label||"";h.scope=/^\[\s*\]$/.test(r)?"":r,h.emptyText=_(t,k?n.groups.length?"tw_classes_none_size":"tw_classes_none":"tw_classes_pick"),h.groups=n.groups.filter(s=>lo(s.key)).map(s=>({key:s.key,current:s.key===h.variant,chips:s.items.map((i,l)=>{const d={...i,id:`${s.key}-${l}-${i.from}`,locked:i.dynamic||!h.canEdit,open:!1,color:i.dynamic?"":fo(t,i.name),title:i.dynamic?_(t,"tw_classes_dynamic"):Ce(i.name,B)||i.raw};return Y.set(d.id,d),d})}));const a=Me(t.document);a&&(Pe(t.document),He(a,Dn)),nt(),It(t,k?.path||""),et("tw:changed")}function So(t){B||ft||(ft=!0,$n(t).then(e=>{B=e,R(t)}).catch(()=>{ft=!1}))}const Ie="sve-tw-strip";function To(t){try{return $t(t,Ie)!=="0"}catch{return!0}}function Vo(t,e){Ue(t,Ie,e?"1":"0"),e||wt(t)}const y="__sve-tw-strip",ne="__sve-tw-strip-style";let oe=null,tt=null;function Rt(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o}catch{}return null}function Eo(t){if(t.getElementById(ne))return;const e=t.createElement("style");e.id=ne,e.textContent=`
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
  `,t.head.appendChild(e)}function Ao(t){const e=Rt(t);return e?e.getBoundingClientRect():null}let E=null;function Lo(t,e,n,o){if(e.button!==0||e.target?.closest?.("[data-drop]"))return;E={wrap:n,scroll:o,strip:t.document.getElementById(y),x:e.clientX,moved:!1,ghost:null};const r=s=>{if(!E||!E.moved&&Math.abs(s.clientX-E.x)<4)return;if(!E.moved){E.moved=!0,E.wrap.setAttribute("data-dragging",""),E.strip?.setAttribute("data-dragging","");const d=E.wrap.querySelector("button")?.cloneNode(!0);d&&(d.id=`${y}-ghost`,d.querySelector("[data-drop]")?.remove(),t.document.body.appendChild(d),E.ghost=d)}s.preventDefault(),E.ghost&&(E.ghost.style.left=`${s.clientX}px`,E.ghost.style.top=`${s.clientY}px`);const i=t.document.elementFromPoint(s.clientX,s.clientY)?.closest?.("[data-chip-wrap]");if(!i||i===E.wrap||i.parentElement!==E.scroll)return;const l=i.getBoundingClientRect();s.clientX<l.left+l.width/2?E.scroll.insertBefore(E.wrap,i):E.scroll.insertBefore(E.wrap,i.nextSibling)},a=()=>{t.document.removeEventListener("pointermove",r,!0),t.document.removeEventListener("pointerup",a,!0),t.document.removeEventListener("pointercancel",a,!0);const s=E;if(E=null,s?.ghost?.remove(),!s?.moved)return;s.wrap.removeAttribute("data-dragging"),s.strip?.removeAttribute("data-dragging");const i=l=>{l.preventDefault(),l.stopPropagation()};t.addEventListener("click",i,!0),t.setTimeout(()=>t.removeEventListener("click",i,!0),0),yo(t,[...s.scroll.querySelectorAll("[data-chip-wrap]")].map(l=>l.dataset.chip))};t.document.addEventListener("pointermove",r,!0),t.document.addEventListener("pointerup",a,!0),t.document.addEventListener("pointercancel",a,!0)}function wt(t){t?.document.getElementById(y)?.remove()}function Mo(t){const e=()=>Po(t);oe!==t&&(oe=t,t.addEventListener("resize",e),t.addEventListener("scroll",e,!0));const n=Rt(t)?.contentWindow;if(n&&!n._sveStripBound)try{n._sveStripBound=!0,n.addEventListener("scroll",e,!0),n.addEventListener("resize",e),n.addEventListener("statamic:preview-updated",()=>{t.setTimeout(()=>It(t,tt?.path||""),60)})}catch{}}function Po(t){const e=t?.document.getElementById(y);!e||!tt?.el?.isConnected||De(t,e,tt.frame,tt.el)}function It(t,e){if(!t||!To(t)){wt(t);return}const n=t.document,o=Rt(t),r=o?.contentDocument,a=e&&r?r.querySelector(`[data-sve-ht-path="${e}"]`):null;if(!a||!h.tag){wt(t);return}Eo(n),Mo(t);let s=n.getElementById(y);s||(s=n.createElement("div"),s.id=y,n.body.appendChild(s));let i=s.querySelector('[data-group="tag"]');if(!i){i=n.createElement("div"),i.setAttribute("data-group","tag");const c=n.createElement("span");c.setAttribute("data-sve-tw-strip-tag",""),i.appendChild(c),s.appendChild(i)}i.firstChild.textContent=`<${h.tag}>`;let l=s.querySelector('[data-group="classes"]'),d=l?.querySelector("[data-scroll]");const f=h.groups.flatMap(c=>c.chips);if(f.length&&!l){l=n.createElement("div"),l.setAttribute("data-group","classes"),d=n.createElement("div"),d.setAttribute("data-scroll","");const c=n.createElement("span");c.setAttribute("data-fade",""),l.appendChild(d),l.appendChild(c);const u=()=>{d.scrollWidth-d.scrollLeft-d.clientWidth>2?l.setAttribute("data-overflow",""):l.removeAttribute("data-overflow")};d.addEventListener("scroll",u),l._sveSync=u,s.insertBefore(l,s.querySelector('[data-group="add"]'))}if(!f.length)l?.remove();else if(d){d.replaceChildren();for(const c of f){const u=n.createElement("button");if(u.type="button",u.title=c.title||"",c.locked&&u.setAttribute("data-locked",""),c.color){const g=n.createElement("span");g.setAttribute("data-dot",""),g.style.background=c.color,u.appendChild(g)}u.appendChild(n.createTextNode(c.raw));const v=n.createElement("span");if(v.setAttribute("data-chip-wrap",""),v.dataset.chip=c.id,v.appendChild(u),c.locked||v.addEventListener("pointerdown",g=>Lo(t,g,v,d)),!c.locked){const g=n.createElement("button");g.type="button",g.setAttribute("data-drop",""),g.title=h.dropTitle||"",g.textContent="−",g.addEventListener("click",m=>{m.preventDefault(),m.stopPropagation(),h.onDrop?.(c.id)}),v.appendChild(g),u.addEventListener("click",m=>{m.preventDefault(),m.stopPropagation(),h.onChip?.(m,c.id)})}d.appendChild(v)}t.requestAnimationFrame(()=>l._sveSync?.())}if(!s.querySelector('[data-group="add"]')){const c=n.createElement("div");c.setAttribute("data-group","add");const u=n.createElement("button");u.type="button",u.setAttribute("data-add","");const v=n.createElement("span");v.setAttribute("data-plus",""),v.textContent="+",u.appendChild(v),u.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),Co(t,g.currentTarget)}),c.appendChild(u),s.appendChild(c)}tt={frame:o,el:a,path:e},De(t,s,o,a)}function De(t,e,n,o){const r=n.getBoundingClientRect(),a=n.clientWidth?r.width/n.clientWidth:1,s=o.getBoundingClientRect(),i=e.getBoundingClientRect(),l=6,d=16,f=r.left+s.left*a,c=r.top+s.top*a-i.height-l,u=r.top+s.top*a+l,v=Math.max(l,r.left+d),g=Math.max(v,Math.min(r.right,t.innerWidth)-i.width-d);e.style.left=`${Math.max(v,Math.min(f,g))}px`,e.style.top=`${Math.max(r.top+d,c<r.top+d?u:c)}px`;const m=n.clientHeight||r.height;e.hidden=s.bottom<=0||s.top>=m}export{rt as P,Wo as a,St as b,O as c,Ct as d,U as e,Tt as f,To as g,Ro as h,Do as i,qo as j,Fo as k,jo as l,Bo as m,ko as n,No as o,Io as p,Co as q,Uo as r,Vo as s,me as t,te as u,Ho as v};
