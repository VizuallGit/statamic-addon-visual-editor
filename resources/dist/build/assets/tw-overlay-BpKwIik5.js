const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-DdxyBBQG.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{J as Le,r as Pe,_ as Be,o as C,c as S,u as A,a as k,f as L,t as B,F,e as X,I as ht,d as q,m as Oe,n as xt,K as z,H as N,O as te,a2 as gt,M as ee,w as j,N as ne,j as T,l as ze,i as De,a9 as et,Q as W,a8 as $t,U as Re,A as Ie}from"./addon-9prGMb_i.js";import{H as Fe}from"./html-pick-align-BQgDq65Q.js";const rt="__sve-partial-menu",We=/\{\{#([\s\S]*?)#\}\}/g,It=/\{\{\s*partial(?::([^\s}]+)|(?=[\s}]))([\s\S]*?)\}\}/gi,ct=new Map;function _t(t){const e=String(t||"").replace(We,r=>" ".repeat(r.length)),n=[];It.lastIndex=0;let o;for(;o=It.exec(e);){const r=(o[1]||"").trim(),s=(o[2]||"").match(/\bsrc\s*=\s*(["'])([^"']+)\1/i),i=r||(s?s[2].trim():"");!i||i.includes("..")||n.push({from:o.index,to:o.index+o[0].length,src:i})}return n}function Ft(t,e){return _t(t).find(n=>e>=n.from&&e<=n.to)||null}const qe=new Set(["if","elseif","else","unless","foreach","forelse","noparse","once","cache","nocache","section","yield","partial","slot","switch","case","vite","sve_html","sve_css","sve_js","sve_tw","style_push","script_push"]);function je(t,e){const n=[],o=/\{\{\s*(\/?)([A-Za-z_][A-Za-z0-9_]*)\b[\s\S]*?\}\}/g;let r;for(;r=o.exec(String(t||""));){const s=r[2];if(!qe.has(s.toLowerCase())){if(!r[1]){n.push({name:s,from:r.index,to:null});continue}for(let i=n.length-1;i>=0;i-=1)if(n[i].name===s&&n[i].to==null){n[i].to=r.index+r[0].length;break}}}let a=null;for(const s of n)s.to==null||e<s.from||e>s.to||(!a||s.to-s.from<a.to-a.from)&&(a=s);return a?.name||null}function He(t,e){const n=new Set,o=r=>{if(Array.isArray(r)){if(!e){for(const a of r)a&&typeof a=="object"&&typeof a.type=="string"&&a.type&&n.add(a.type),o(a);return}r.forEach(o);return}if(!(!r||typeof r!="object")){if(e&&Array.isArray(r[e]))for(const a of r[e])a&&typeof a=="object"&&typeof a.type=="string"&&a.type&&n.add(a.type);Object.values(r).forEach(o)}};return o(t),n}function Ne(t,e,n,o){if(!t.src.includes("{")||!o)return e;const r=je(n,t.from),a=He(o,r);return r?e.filter(s=>a.has(s.label)):a.size===0?e:e.filter(s=>a.has(s.label))}function Ve(t,e){if(ct.has(e))return ct.get(e);const n=t.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():{items:[]}).then(o=>Array.isArray(o.items)?o.items:[]).catch(()=>[]);return ct.set(e,n),n}let Q=null;function Wt(t){t.clearTimeout(Q),Q=null}function Ke(t,e){Q||(Q=t.setTimeout(()=>{Q=null,e?.()},180))}function V(t){t?.getElementById(rt)?.remove()}function Ze(t,e,n,o,{onOpen:r,emptyLabel:a,onStay:s,onLeave:i}){const c=t.document;V(c);const l=c.createElement("div");if(l.id=rt,l.style.left=`${Math.max(8,Math.round(n))}px`,l.style.top=`${Math.max(8,Math.round(o))}px`,e.length)e.forEach(g=>{const h=c.createElement("button");h.type="button",h.setAttribute("data-sve-partial-choice",""),h.textContent=g.label,h.title=g.path||g.type,h.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation(),V(c),r?.(g.type)}),l.appendChild(h)});else{const g=c.createElement("div");g.setAttribute("data-sve-partial-empty",""),g.textContent=a||"",l.appendChild(g)}c.body.appendChild(l);const f=l.getBoundingClientRect(),u=8;let d=f.left,b=f.top;f.right>t.innerWidth-u&&(d=Math.max(u,t.innerWidth-f.width-u)),f.bottom>t.innerHeight-u&&(b=Math.max(u,t.innerHeight-f.height-u)),l.style.left=`${Math.round(d)}px`,l.style.top=`${Math.round(b)}px`,l.addEventListener("mouseenter",()=>s?.()),l.addEventListener("mouseleave",()=>i?.())}function Oo(t){const e=t.Decoration.mark({class:"sve-cm-partial"}),n=t.Decoration.line({class:"sve-cm-partial-line"}),o=t.StateEffect.define(),r=t.StateField.define({create(s){return qt(s,t,e)},update(s,i){return i.docChanged?qt(i.state,t,e):s},provide:s=>t.EditorView.decorations.from(s)}),a=t.StateField.define({create(){return t.Decoration.none},update(s,i){let c;for(const d of i.effects)d.is(o)&&(c=d.value);if(c===void 0)return i.docChanged?t.Decoration.none:s;if(!c)return t.Decoration.none;const l=new t.RangeSetBuilder,f=i.state.doc.lineAt(c.from),u=i.state.doc.lineAt(c.to);for(let d=f.number;d<=u.number;d+=1){const b=i.state.doc.line(d);l.add(b.from,b.from,n)}return l.finish()},provide:s=>t.EditorView.decorations.from(s)});return{extensions:[r,a],setHover(s,i){s&&s.dispatch({effects:o.of(i)})}}}function qt(t,e,n){const o=new e.RangeSetBuilder;for(const r of _t(t.doc.toString()))o.add(r.from,r.to,n);return o.finish()}function zo(t,e,{onOpen:n,emptyLabel:o,sectionValues:r,isLocked:a,setHover:s}){if(!e?.dom||e.dom._svePartialBound)return;e.dom._svePartialBound=!0;let i=null,c="",l="";const f=()=>{Wt(t),t.clearTimeout(i),i=null,l="",c="",s?.(e,null),V(t.document)},u={stay:()=>Wt(t),leave:()=>Ke(t,f)},d=()=>{t.clearTimeout(i),i=null,l="",s?.(e,null)},b=()=>!!a?.(),g=(h,p,y,{click:P}={})=>{if(b()){V(t.document),s?.(e,null);return}c=h.src,Ve(t,h.src).then($=>{if(c!==h.src)return;const m=e.state.doc.toString(),x=Ne(h,$,m,r?.()||null);if(x.length===1){P&&(V(t.document),n?.(x[0].type));return}!x.length&&!P||Ze(t,x,p,y,{onOpen:n,emptyLabel:o,onStay:u.stay,onLeave:u.leave})})};e.dom.addEventListener("mousemove",h=>{if(b()){f();return}const p=e.posAtCoords({x:h.clientX,y:h.clientY});if(p==null)return;const y=Ft(e.state.doc.toString(),p);if(!y){t.clearTimeout(i),i=null,l="",u.leave();return}u.stay(),s?.(e,{from:y.from,to:y.to}),!(l===y.src&&i)&&(d(),l=y.src,i=t.setTimeout(()=>{const P=e.coordsAtPos(y.from);g(y,P?.left??h.clientX,(P?.bottom??h.clientY)+6)},280))}),e.dom.addEventListener("mouseleave",h=>{if(h.relatedTarget?.closest?.(`#${rt}`)){u.stay();return}u.leave()}),e.dom.addEventListener("click",h=>{if(b()){V(t.document);return}const p=e.posAtCoords({x:h.clientX,y:h.clientY});if(p==null)return;const y=Ft(e.state.doc.toString(),p);y&&(d(),g(y,h.clientX,h.clientY+8,{click:!0}))}),Xe(t.document)||(t.document.addEventListener("mousedown",h=>{h.target.closest(`#${rt}, .sve-cm-partial`)||V(t.document)}),t.document._svePartialDismiss=!0)}function Xe(t){return!!t._svePartialDismiss}const Ue=new Set(["if","elseif","else","endif","unless","foreach","forelse","noparse","once","cache","nocache","section","yield","partial","slot","switch","case","vite","sve_html","sve_css","sve_js","sve_tw","sve_prop","style_push","script_push","visual_edit","responsive_css"]),jt=/\{\{\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.-]*)((?::[^\s}]*)?[\s\S]*?)\}\}/g;function Ye(t,e){const n=String(t||""),o={sortField:"",sortDir:"",limit:""};if(e){const s=n.match(/\bsort\s*=\s*["']([^"']*)["']/),i=n.match(/\blimit\s*=\s*["']?(\d+)["']?/);if(s){const c=s[1].trim();if(c.toLowerCase()==="random")o.sortDir="random";else if(c){const l=c.split(":"),f=l[l.length-1].toLowerCase(),u=f==="asc"||f==="desc";o.sortField=(u?l.slice(0,-1):l).join(":"),o.sortDir=u?f:"asc"}}return i&&(o.limit=i[1]),o}const r=n.match(/\|\s*sort\s*:\s*([A-Za-z_][A-Za-z0-9_.-]*)/),a=n.match(/\|\s*limit\s*:\s*(\d+)/);return/\|\s*shuffle\b/.test(n)?o.sortDir="random":r&&(o.sortField=r[1],o.sortDir=/\|\s*reverse\b/.test(n)?"desc":"asc"),a&&(o.limit=a[1]),o}function Ht(t){return String(t||"").replace(/\s+/g," ").trim()}function Ge(t){const e=String(t||""),n=[],o=[];jt.lastIndex=0;let r;for(;r=jt.exec(e);){const a=!!r[1],s=r[2].toLowerCase(),i=r.index,c=i+r[0].length;if(a||s==="endif"){const g=s==="endif"?"if":s;for(let h=o.length-1;h>=0;h-=1)if(g==="if"?o[h].branchOf==="if":o[h].name===g){n.push({...o[h],to:c}),o.length=h;break}continue}if(s==="if"||s==="unless"){o.push({kind:"if",loopKind:"",name:s,handle:"",params:"",expr:Ht(r[3]),from:i,openTo:c,branchOf:s});continue}if(s==="elseif"||s==="else"){let g=-1;for(let h=o.length-1;h>=0;h-=1)if(o[h].branchOf==="if"){g=h;break}if(g===-1)continue;n.push({...o[g],to:i}),o.length=g+1,o[g]={kind:"if",loopKind:"",name:s,handle:"",params:"",expr:Ht(r[3]),from:i,openTo:c,branchOf:"if"};continue}if(Ue.has(s)||r[3].trim().startsWith("="))continue;const l=r[3]||"",f=l.match(/^:([A-Za-z0-9_-]+)/),u=l.match(/\bfrom\s*=\s*["']([A-Za-z0-9_-]+)["']/),d=f?.[1]||u?.[1]||"",b=s==="collection";o.push({kind:"loop",loopKind:b?"collection":"field",name:s,handle:d,params:b?l.replace(/^:[A-Za-z0-9_-]+/,"").trim():l.trim(),expr:b?d:s,...Ye(l,b),from:i,openTo:c,branchOf:null})}return n.filter(a=>a.to>a.openTo).sort((a,s)=>a.from-s.from||s.to-a.to)}const oe=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function re(t){return String(t||"").replace(/\{\{[\s\S]*?\}\}/g,e=>" ".repeat(e.length))}function Je(t){const e=t.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(!e)return"";const n=e[2].match(/\[\s*([\s\S]*?)\s*\]/);if(n){const o=n[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).find(r=>/^[a-zA-Z_][\w-]*$/.test(r));if(o)return o}return(e[2].trim().split(/\s+/)[0]||"").replace(/\[|\]/g,"")}function se(t,e,n,o){t.hidden=!0,o&&(t.wrapFrom=e,t.wrapTo=n);for(const r of t.children)se(r,e,n,!1)}function ae(t,e,n,o){const r=[],a=[];let s=n,i=0;const c=l=>{a.length?a[a.length-1].children.push(l):r.push(l)};for(;s<o;){if(e[s]!=="<"){s+=1;continue}if(e.startsWith("<!--",s)){const m=e.indexOf("-->",s+4),x=m===-1||m>o?o:m,I=m===-1||m+3>o?o:m+3,lt=ae(t,e,s+4,x);for(const Rt of lt)se(Rt,s,I,!0),c(Rt);s=I;continue}if(e.startsWith("<!",s)||e.startsWith("<?",s)){const m=e.indexOf(">",s+2);s=m===-1||m+1>o?o:m+1;continue}const l=e[s+1]==="/",f=e.slice(s,o).match(/^<\/?([a-zA-Z][a-zA-Z0-9:-]*)/);if(!f){s+=1;continue}const u=f[1].toLowerCase(),d=e.indexOf(">",s);if(d===-1||d>=o)break;const b=e.slice(s,d+1),g=!l&&(oe.has(u)||/\/\s*>$/.test(b));if(l){for(let m=a.length-1;m>=0;m-=1)if(a[m].tag===u){a[m].to=d+1,a.length=m;break}s=d+1;continue}const h=Je(t.slice(s,d+1)),p=a.length?a[a.length-1]:null,y=p?p.children:r,P=p?`${p.path}/${y.length}:${u}`:`${y.length}:${u}`,$={id:`${u}-${s}-${i}`,tag:u,klass:h,path:P,label:h,from:s,to:d+1,openTo:d+1,hidden:!1,children:[]};i+=1,c($),g?$.to=d+1:a.push($),s=d+1}for(;a.length;)a.pop().to=o;return r}function Qe(t){const e=String(t||"");return/\{[A-Za-z_][A-Za-z0-9_]*\}/.test(e)?e:e.split("/").pop()||""}function Ct(t,e,n){for(const o of t||[])if(!(e<o.openTo||n>o.to))return Ct(o.children,e,n)||o;return null}function tn(t,e){for(const n of Ge(e)){const o=Ct(t,n.from,n.to),r=o?o.children:t,a=[];let s=!1;for(const f of r){const u=f.wrapFrom??f.from,d=f.wrapTo??f.to;if(!(d<=n.from||u>=n.to)){if(u<n.from||d>n.to){s=!0;break}a.push(f)}}if(s)continue;const i=n.loopKind==="collection"?`collection: ${n.handle||"?"}`:n.kind==="loop"?n.name:n.expr,c={id:`antlers-${n.from}`,tag:n.name,kind:"antlers",antlers:n.kind,loopKind:n.loopKind||"",handle:n.handle||"",params:n.params||"",sortField:n.sortField||"",sortDir:n.sortDir||"",limit:n.limit||"",expr:n.expr,klass:i,path:`${o?`${o.path}/`:""}a${n.from}:${n.name}`,label:i,from:n.from,to:n.to,openTo:n.openTo,hidden:!!o?.hidden,children:a},l=a.length?r.indexOf(a[0]):r.findIndex(f=>f.from>n.from);r.splice(l===-1?r.length:l,a.length,c)}return t}function en(t,e){for(const n of _t(e)){const o=Ct(t,n.from,n.to),r=o?o.children:t,a=Qe(n.src),s={id:`component-${n.from}`,tag:"component",kind:"component",src:n.src,klass:a,path:`${o?`${o.path}/`:""}c${n.from}:component`,label:a,from:n.from,to:n.to,openTo:n.to,hidden:!!o?.hidden,children:[]};let i=r.findIndex(c=>c.from>n.from);i===-1&&(i=r.length),r.splice(i,0,s)}return t}function St(t){const e=String(t||""),n=re(e);return ae(e,n,0,n.length)}function Do(t){const e=String(t||"");return en(tn(St(e),e),e)}function Tt(t,e,n=0,o=[]){for(const r of t){const a=r.children.length>0,s=e.has(r.id);o.push({id:r.id,tag:r.tag,kind:r.kind||"",antlers:r.antlers||"",loopKind:r.loopKind||"",handle:r.handle||"",params:r.params||"",sortField:r.sortField||"",sortDir:r.sortDir||"",limit:r.limit||"",expr:r.expr||"",src:r.src||"",klass:r.klass||"",path:r.path,label:r.label,from:r.from,to:r.to,openTo:r.openTo,hidden:!!r.hidden,wrapFrom:r.wrapFrom,wrapTo:r.wrapTo,depth:n,hasChildren:a,emptyBlock:r.kind==="antlers"&&!a,shut:s}),a&&!s&&Tt(r.children,e,n+1,o)}return o}function Ro(t){return oe.has(String(t||"").toLowerCase())}const nn=new Set(["*","**"]),on=24;let ut=null;function ie(t){return t?.Statamic?.$config?.get?.("sveFeatures")?.tailwind_dock===!0}function Io(t){return e=>{if(!ie(t)||!pn(e))return null;const n=e.matchBefore(/[^\s"']*$/),o=n?.text??"";return o.includes("{")||o.includes("}")?null:Et(t).then(r=>{const a=dn(o,r);return a.length?{from:n?n.from:e.pos,options:a,validFor:/^[^\s"'=]*$/}:null})}}function Fo(t,e){return t((n,o)=>{if(!ie(e))return null;const r=mn(n.state,o);return r?Et(e).then(a=>{const s=a.rule(r.text);return s?{pos:r.from,end:r.to,create(){return{dom:vn(s,a.color(r.text))}}}:null}):null})}function Et(t){return ut||(ut=Le(()=>import("./tw-compile-DdxyBBQG.js"),__vite__mapDeps([0,1]),import.meta.url).then(e=>e.loadTailwindDesign(t)).then(rn).catch(()=>sn())),ut}function rn(t){const e=t.getClassList().map(([p])=>p),n=e.map(p=>p.toLowerCase()),o=new Set(e),r=new Set(t.utilities.keys("static")),a=new Set(t.utilities.keys("functional")),s=new Map,i=new Map;function c(p){if(r.has(p))return p;const y=String(p).split("-");for(let P=y.length;P>0;P--){const $=y.slice(0,P).join("-");if(a.has($))return $}return""}const l=new Map;e.forEach(p=>{const y=c(p);y&&(l.has(y)||l.set(y,[]),l.get(y).push(p))});function f(p){const y=p.filter($=>!s.has($));if(!y.length)return;let P=[];try{P=t.candidatesToCss(y)}catch{P=[]}y.forEach(($,m)=>{s.set($,typeof P[m]=="string"?P[m]:"")})}function u(p){return p?(f([p]),s.get(p)||""):""}function d(p){return ln(u(p))}function b(p){if(i.has(p))return i.get(p);const y=cn(d(p),t);return i.set(p,y),y}const g=new Map;function h(p){return g.has(p)||g.set(p,{label:p,get css(){return d(p)},get color(){return b(p)}}),g.get(p)}return{design:t,names:e,lower:n,byRoot:l,variants:an(t),root:c,has:p=>o.has(p),fill:f,rule:u,css:d,color:b,rows(p){return f(p),p.map(h)},byUtility:{get:p=>o.has(p)?h(p):void 0},resolve(p){return u(p)?h(p):null}}}function sn(){const t=()=>"";return{design:null,names:[],lower:[],byRoot:new Map,variants:[],root:t,has:()=>!1,fill:()=>{},rule:t,css:t,color:t,rows:()=>[],byUtility:{get:()=>{}},resolve:()=>null}}function an(t){const e=[];let n=[];try{n=t.getVariants()}catch{n=[]}return n.forEach(o=>{const r=o?.name||"";if(!(!r||nn.has(r))){if(o.values?.length){const a=o.hasDash===!1?"":"-";o.values.forEach(s=>e.push(`${r}${a}${s}`));return}o.isArbitrary||e.push(r)}}),e}function ln(t){const e=String(t||"").split(/^@property/m)[0],n=[],o=[];return e.split(`
`).forEach(a=>{const s=a.trim();if(!s.endsWith(";")||s.startsWith("@")||!s.includes(":"))return;const i=s.slice(0,-1).trim();(i.startsWith("--tw-")?o:n).push(i)}),(n.length?n:o).join("; ")}function cn(t,e){const n=String(t||""),o=/(#[0-9a-fA-F]{3,8}\b|(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|color)\([^)]*\))/.exec(n);if(o)return o[1];const r=/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(n)?.[1];if(!r)return"";let a="";try{a=e?.resolveThemeValue?.(r)||""}catch{a=""}return gn(a)}function un(t){const e=String(t||""),n=e.lastIndexOf(":");return n===-1||e.slice(n).includes("]")?{prefix:"",rest:e}:{prefix:e.slice(0,n+1),rest:e.slice(n+1)}}function dn(t,e){const{prefix:n,rest:o}=un(t),r=o.toLowerCase(),a=[];n||fn(r,e).forEach(l=>a.push(l));const s=[],i=[];for(let l=0;l<e.names.length;l++){if(!r){if(s.length>=80)break;s.push(e.names[l]);continue}const f=e.lower[l];f.startsWith(r)?s.length<80&&s.push(e.names[l]):i.length<80&&f.includes(r)&&i.push(e.names[l])}const c=[...s,...i].slice(0,80);return e.fill(c),c.forEach((l,f)=>{a.push({label:`${n}${l}`,type:"property",detail:e.css(l),boost:f<s.length?1:0})}),a}function fn(t,e){return(t?e.variants.filter(o=>o.toLowerCase().startsWith(t)):e.variants.slice(0,on)).slice(0,40).map(o=>({label:`${o}:`,type:"keyword",detail:"variant",boost:2}))}function pn(t){return!!(t.matchBefore(/class\s*=\s*"[^"]*$/i)||t.matchBefore(/class\s*=\s*'[^']*$/i))}function mn(t,e){const n=t.doc.lineAt(e),o=e-n.from,r=hn(n.text,o);if(!r)return null;const a=n.text.slice(r.valueFrom,r.valueTo),s=o-r.valueFrom,i=a.slice(0,s),c=a.slice(s),l=(i.match(/[^\s]*$/)||[""])[0],f=(c.match(/^[^\s]*/)||[""])[0],u=l+f;if(!u||u.includes("{"))return null;const d=n.from+r.valueFrom+(i.length-l.length);return{from:d,to:d+u.length,text:u}}function hn(t,e){const n=/\bclass\s*=\s*(["'])/gi;let o;for(;o=n.exec(t);){const r=o[1],a=o.index+o[0].length,s=t.indexOf(r,a),i=s===-1?t.length:s;if(e>=a&&e<=i)return{valueFrom:a,valueTo:i}}return null}function gn(t){const e=String(t||"").trim();return/^#([0-9a-fA-F]{3,8})$/.test(e)?e:""}function vn(t,e){const n=document.createElement("div");if(n.className="sve-tw-info",e){const r=document.createElement("span");r.className="sve-tw-swatch",r.style.background=e,n.appendChild(r)}const o=document.createElement("pre");return o.textContent=t,n.appendChild(o),n}const v=Pe({emptyText:"",tag:"",scope:"",scopeTitle:"",baseLabel:"",groups:[],canEdit:!1,onChip:null,variant:"",breakpoints:[],onBreakpoint:null,state:"",stateLabel:"",onState:null,onTag:null,dropTitle:"",onDrop:null,sortTitle:"",onSort:null,siteClasses:[]});function le(t,e,n){const o=String(t||"").slice(e,n),r=re(o),a=/(\sclass\s*=\s*)(["'])/i.exec(r);if(!a)return null;const s=a[2],i=a.index+a[1].length+1,c=r.indexOf(s,i);return c===-1?null:{from:e+i,to:e+c,quote:s,value:o.slice(i,c)}}function bn(t){const e=String(t||""),n=[];let o=0;for(;o<e.length;){if(/\s/.test(e[o])){o+=1;continue}let r=o,a=!1;for(;r<e.length;){if(e.startsWith("{{",r)){const s=e.indexOf("}}",r+2);a=!0,r=s===-1?e.length:s+2;continue}if(/\s/.test(e[r]))break;r+=1}n.push({text:e.slice(o,r),from:o,to:r,dynamic:a}),o=r}return n}function ce(t){const e=String(t||""),n=[];let o=0,r=0;for(let s=0;s<e.length;s+=1){const i=e[s];i==="["||i==="("?o+=1:i==="]"||i===")"?o=Math.max(0,o-1):i===":"&&o===0&&(n.push(e.slice(r,s)),r=s+1)}const a=e.slice(r);return{variants:n,base:a}}function ue(t){let n=String(t||""),o="";n.startsWith("!")?(o="pre",n=n.slice(1)):n.endsWith("!")&&(o="post",n=n.slice(0,-1));let r="";const a=yn(n);return a!==-1&&(r=n.slice(a),n=n.slice(0,a)),{name:n,modifier:r,important:o}}function yn(t){let e=0;for(let n=0;n<t.length;n+=1){const o=t[n];if(o==="["||o==="(")e+=1;else if(o==="]"||o===")")e=Math.max(0,e-1);else if(o==="/"&&e===0)return n}return-1}function vt({variants:t,name:e,modifier:n,important:o}){let r=`${e}${n||""}`;return o==="pre"?r=`!${r}`:o==="post"&&(r=`${r}!`),[...t||[],r].join(":")}function At(t){const e=bn(t),n=new Map;let o=null,r=0;const a=e.findIndex(i=>i.text==="]");if(e[0]?.text==="["&&a>0){const i=e.slice(1,a);o={from:e[0].from,to:e[a].to,label:`[ ${i.map(c=>c.text).join(" ")} ]`},r=a+1}for(;r<e.length;r+=1){const i=e[r],{variants:c,base:l}=ce(i.text),{name:f,modifier:u,important:d}=ue(l),b=c.join(":");n.has(b)||n.set(b,{key:b,variants:c,items:[]}),n.get(b).items.push({raw:i.text,from:i.from,to:i.to,dynamic:i.dynamic,variants:c,name:f,modifier:u,important:d})}const s=[...n.values()];return s.sort((i,c)=>i.key===""?-1:c.key===""?1:0),{scope:o,groups:s}}function st(t,e,n){const o=String(t||"");if(n)return o.slice(0,e.from)+n+o.slice(e.to);let r=e.from,a=e.to;if(r>0&&(o[r-1]===" "||o[r-1]==="	"))for(;r>0&&(o[r-1]===" "||o[r-1]==="	");)r-=1;else for(;a<o.length&&(o[a]===" "||o[a]==="	");)a+=1;return kn(o.slice(0,r)+o.slice(a),r)}function kn(t,e){const n=t.lastIndexOf(`
`,Math.max(0,e-1));if(n===-1)return t;const o=t.indexOf(`
`,n+1);return t.slice(n+1,o===-1?t.length:o).trim()!==""?t:t.slice(0,n)+t.slice(o===-1?t.length:o)}function de(t,e){const n=String(t||"");return n.trim()?`${n.replace(/\s+$/,"")} ${e}`:e}function fe(t,e,n){const o=String(t||"");if(!Array.isArray(e)||e.length!==n?.length)return o;let r=o;for(let a=e.length-1;a>=0;a-=1)r=r.slice(0,e[a].from)+n[a]+r.slice(e[a].to);return r}function pe(t,e,n){const o=String(t||""),r=String(n||"").trim().toLowerCase();if(!/^[a-z][a-z0-9-]*$/.test(r)||!e?.tag||r===e.tag.toLowerCase())return o;const a=e.tag.toLowerCase(),s=o.slice(e.from,e.openTo);if(!new RegExp(`^<${a}(?=[\\s/>])`,"i").test(s))return o;let i=o;const c=i.toLowerCase().lastIndexOf(`</${a}`,e.to);return c>e.from&&c<e.to&&(i=i.slice(0,c)+`</${r}`+i.slice(c+2+a.length)),i.slice(0,e.from)+`<${r}`+i.slice(e.from+1+a.length)}function wn(t,e,n){const o=le(t,e.from,e.openTo);if(o)return t.slice(0,o.from)+n+t.slice(o.to);const r=String(t).slice(e.from,e.openTo),a=/^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(r);if(!a||!n)return t;const s=e.from+a[0].length;return`${t.slice(0,s)} class="${n}"${t.slice(s)}`}let dt=null;function xn(t){return dt||(dt=Et(t).then(e=>({catalog:e,groups:new Map}))),dt}function me(t){const e=String(t||"");if(e.includes(";"))return"";const n=e.indexOf(":");return n===-1?"":e.slice(0,n).trim()}function $n(t,e){if(t.groups.has(e))return t.groups.get(e);const n=t.catalog.byRoot.get(e);if(!n?.length)return t.groups.set(e,null),null;const o=new Map;return t.catalog.rows(n).forEach(r=>{const a=me(r.css);a&&(o.has(a)||o.set(a,[]),o.get(a).push(r))}),t.groups.set(e,o),o}function he(t,e){if(!e?.catalog||!t)return null;const n=e.catalog.root(t);if(!n)return null;const o=$n(e,n);if(!o?.size)return null;const r=me(e.catalog.css(t)),a=o.get(r)||(o.size===1?[...o.values()][0]:null);return a?.length?{label:r||n,options:a}:null}function ge(t,e){return e?.catalog?.css(t)||""}function _n(t,e){return e?.catalog?.color(t)||""}const Cn={class:"sve-tw"},Sn={key:0,class:"sve-tw-head"},Tn=["disabled"],En=["title","data-active","disabled","onClick"],An=["data-active","disabled"],Mn=["title","disabled"],Ln={key:1,class:"sve-tw-empty"},Pn=["data-sve-tw-base","data-current"],Bn={class:"sve-tw-chips"},On=["title","onClick"],zn=["title","onClick"],Dn={__name:"TwClassList",setup(t){function e(n){const o={"data-sve-tw-chip":n.id};return n.locked&&(o["data-sve-tw-locked"]=""),n.open&&(o["data-open"]=""),o}return(n,o)=>(C(),S("div",Cn,[A(v).tag?(C(),S("div",Sn,[k("button",{type:"button",class:"sve-tw-tag",disabled:!A(v).canEdit,onClick:o[0]||(o[0]=L(r=>A(v).onTag?.(r),["prevent","stop"]))},"<"+B(A(v).tag)+">",9,Tn),(C(!0),S(F,null,X(A(v).breakpoints,r=>(C(),S("button",{key:r.index,type:"button","data-sve-tw-bp":"",title:r.title,"data-active":r.active?"":void 0,disabled:!A(v).canEdit,onClick:L(a=>A(v).onBreakpoint?.(r.index),["prevent","stop"])},B(r.label),9,En))),128)),k("button",{type:"button","data-sve-tw-state":"","data-active":A(v).state?"":void 0,disabled:!A(v).canEdit,onClick:o[1]||(o[1]=L(r=>A(v).onState?.(r),["prevent","stop"]))},[ht(B(A(v).stateLabel)+" ",1),o[3]||(o[3]=k("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[k("path",{d:"m6 9 6 6 6-6"})],-1))],8,An),k("button",{type:"button","data-sve-tw-sort":"",title:A(v).sortTitle,disabled:!A(v).canEdit,onClick:o[2]||(o[2]=L(r=>A(v).onSort?.(),["prevent","stop"]))},[...o[4]||(o[4]=[k("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round"},[k("path",{d:"M2.5 4h9M2.5 8h6M2.5 12h3"}),k("path",{d:"M13 5v7M11.4 10.4 13 12l1.6-1.6"})],-1)])],8,Mn),o[5]||(o[5]=k("span",{class:"sve-tw-gap"},null,-1))])):q("",!0),A(v).groups.length?q("",!0):(C(),S("div",Ln,B(A(v).emptyText),1)),(C(!0),S(F,null,X(A(v).groups,r=>(C(),S("div",{key:r.key,class:"sve-tw-group"},[k("span",{class:"sve-tw-variant","data-sve-tw-base":r.key===""?"":void 0,"data-current":r.current?"":void 0},B(r.key===""?A(v).baseLabel:r.key),9,Pn),k("div",Bn,[(C(!0),S(F,null,X(r.chips,a=>(C(),S("span",{key:a.id,class:"sve-tw-chip-wrap"},[k("button",Oe({type:"button"},{ref_for:!0},e(a),{title:a.title,onClick:L(s=>A(v).onChip?.(s,a.id),["prevent","stop"])}),[a.color?(C(),S("span",{key:0,class:"sve-tw-dot",style:xt({background:a.color})},null,4)):q("",!0),ht(" "+B(a.raw),1)],16,On),a.locked?q("",!0):(C(),S("button",{key:0,type:"button",class:"sve-tw-drop",title:A(v).dropTitle,onClick:L(s=>A(v).onDrop?.(a.id),["prevent","stop"])},"−",8,zn))]))),128))])]))),128))]))}},Rn=Be(Dn,[["__scopeId","data-v-761b93dc"]]),In={key:0,"data-sve-tw-menu-title":""},Fn={"data-sve-tw-menu-list":""},Wn=["data-active","title","onClick"],qn={"data-sve-tw-tick":""},jn={"data-sve-tw-label":""},Mt={__name:"TwClassMenu",props:{title:{type:String,default:""},options:{type:Array,default:()=>[]},removeLabel:{type:String,default:""},onPick:{type:Function,required:!0},onRemove:{type:Function,required:!0}},setup(t){return(e,n)=>(C(),S(F,null,[t.title?(C(),S("div",In,B(t.title),1)):q("",!0),k("div",Fn,[(C(!0),S(F,null,X(t.options,o=>(C(),S("button",{key:o.label,type:"button","data-sve-tw-option":"","data-active":o.active?"":void 0,title:o.css,onClick:L(r=>t.onPick(o.label),["prevent","stop"])},[k("span",qn,B(o.active?"✓":""),1),o.color?(C(),S("span",{key:0,"data-sve-tw-dot":"",style:xt({background:o.color})},null,4)):q("",!0),k("span",jn,B(o.label),1)],8,Wn))),128))]),k("button",{type:"button","data-sve-tw-remove":"",onClick:n[0]||(n[0]=L(o=>t.onRemove(),["prevent","stop"]))},[n[1]||(n[1]=k("span",{"data-sve-tw-tick":""},"✕",-1)),ht(B(t.removeLabel),1)])],64))}},Hn={"data-sve-tw-search":""},Nn=["placeholder","aria-label","onKeydown"],Vn={"data-sve-tw-tabs":""},Kn=["data-active"],Zn=["data-active"],Xn={key:0,"data-sve-tw-add-empty":""},Un=["data-cursor","data-active","data-sve-tw-off","title","onMouseenter","onClick"],Yn={"data-sve-tw-label":""},Gn={__name:"TwAddClass",props:{label:{type:String,default:""},placeholder:{type:String,default:""},sitePlaceholder:{type:String,default:""},emptyText:{type:String,default:""},offText:{type:String,default:""},siteLabel:{type:String,default:""},tailwindLabel:{type:String,default:""},search:{type:Function,required:!0},onAdd:{type:Function,required:!0}},setup(t){const e=t,n=z(""),o=z(null),r=z("tailwind"),a=z(null),s=z(-1),i=z(!1),c=N(()=>n.value.trim().toLowerCase()),l=N(()=>(v.siteClasses||[]).flatMap($=>$.items).filter($=>!c.value||$.name.toLowerCase().includes(c.value))),f=N(()=>e.search(n.value)),u=N(()=>r.value==="site"?l.value:f.value),d=N(()=>r.value==="site"?e.sitePlaceholder:e.placeholder);te(()=>gt(()=>o.value?.focus()));function b($){return $?.name||$?.label||""}function g($){i.value=!0;const m=u.value.length;if(!m){s.value=-1;return}const x=s.value+$;s.value=x<0?-1:Math.min(x,m-1),gt(()=>h())}function h(){const $=a.value?.querySelector("[data-cursor]");if(!$)return;let m=$.parentElement;for(;m&&m.scrollHeight<=m.clientHeight;)m=m.parentElement;if(!m)return;const x=$.offsetTop,I=x+$.offsetHeight;x<m.scrollTop?m.scrollTop=x:I>m.scrollTop+m.clientHeight&&(m.scrollTop=I-m.clientHeight)}function p($){i.value||(s.value=$)}function y(){s.value=-1}function P(){const $=s.value>=0?u.value[s.value]:null,m=$?b($):n.value.trim();m&&e.onAdd(m)}return($,m)=>(C(),S(F,null,[k("div",Hn,[m[7]||(m[7]=k("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[k("circle",{cx:"11",cy:"11",r:"7"}),k("path",{d:"m20 20-3.5-3.5"})],-1)),ee(k("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":m[0]||(m[0]=x=>n.value=x),type:"text",placeholder:d.value,"aria-label":t.label,onInput:y,onKeydown:[m[1]||(m[1]=j(L(x=>g(1),["prevent"]),["down"])),m[2]||(m[2]=j(L(x=>g(-1),["prevent"]),["up"])),j(L(P,["prevent"]),["enter"]),m[3]||(m[3]=j(L(()=>{},["stop"]),["escape"]))]},null,40,Nn),[[ne,n.value]])]),k("div",Vn,[k("button",{type:"button","data-sve-tw-tab":"","data-active":r.value==="tailwind"?"":void 0,onClick:m[4]||(m[4]=L(x=>{r.value="tailwind",y()},["prevent","stop"]))},B(t.tailwindLabel),9,Kn),k("button",{type:"button","data-sve-tw-tab":"","data-active":r.value==="site"?"":void 0,onClick:m[5]||(m[5]=L(x=>{r.value="site",y()},["prevent","stop"]))},B(t.siteLabel),9,Zn)]),u.value.length?q("",!0):(C(),S("div",Xn,B(t.emptyText),1)),k("div",{ref_key:"rowsEl",ref:a,onMousemove:m[6]||(m[6]=x=>i.value=!1)},[(C(!0),S(F,null,X(u.value,(x,I)=>(C(),S("button",{key:x.name||x.label,type:"button","data-sve-tw-option":"","data-cursor":I===s.value?"":void 0,"data-active":I===s.value?"":void 0,"data-sve-tw-off":x.loaded===!1?"":void 0,title:x.loaded===!1?t.offText:x.file||x.css,onMouseenter:lt=>p(I),onClick:L(lt=>t.onAdd(x.name||x.label),["prevent","stop"])},[x.color?(C(),S("span",{key:0,"data-sve-tw-dot":"",style:xt({background:x.color})},null,4)):q("",!0),k("span",Yn,B(x.name||x.label),1)],40,Un))),128))],544)],64))}},Jn={"data-sve-tw-search":""},Qn=["placeholder","aria-label","onKeydown"],to=["data-active","onMouseenter","onClick"],eo={"data-sve-tw-tick":""},no={"data-sve-tw-label":""},ve={__name:"TwTagMenu",props:{label:{type:String,default:""},placeholder:{type:String,default:""},current:{type:String,default:""},tags:{type:Array,default:()=>[]},onPick:{type:Function,required:!0}},setup(t){const e=t,n=z(""),o=z(null),r=z(-1),a=z(!1),s=N(()=>n.value.trim().toLowerCase()),i=N(()=>{if(!s.value)return e.tags;const f=e.tags.filter(u=>u.includes(s.value));return f.sort((u,d)=>(u.startsWith(s.value)?0:1)-(d.startsWith(s.value)?0:1)),f});te(()=>gt(()=>o.value?.focus()));function c(f){a.value=!0;const u=i.value.length;r.value=u?Math.min(Math.max(r.value+f,-1),u-1):-1}function l(){const f=r.value>=0?i.value[r.value]:n.value.trim().toLowerCase();f&&e.onPick(f)}return(f,u)=>(C(),S(F,null,[k("div",Jn,[u[6]||(u[6]=k("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[k("circle",{cx:"11",cy:"11",r:"7"}),k("path",{d:"m20 20-3.5-3.5"})],-1)),ee(k("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":u[0]||(u[0]=d=>n.value=d),type:"text",placeholder:t.placeholder,"aria-label":t.label,onInput:u[1]||(u[1]=d=>r.value=-1),onKeydown:[u[2]||(u[2]=j(L(d=>c(1),["prevent"]),["down"])),u[3]||(u[3]=j(L(d=>c(-1),["prevent"]),["up"])),j(L(l,["prevent"]),["enter"]),u[4]||(u[4]=j(L(()=>{},["stop"]),["escape"]))]},null,40,Qn),[[ne,n.value]])]),k("div",{onMousemove:u[5]||(u[5]=d=>a.value=!1)},[(C(!0),S(F,null,X(i.value,(d,b)=>(C(),S("button",{key:d,type:"button","data-sve-tw-option":"","data-active":b===r.value||r.value===-1&&d===t.current?"":void 0,onMouseenter:g=>a.value?null:r.value=b,onClick:L(g=>t.onPick(d),["prevent","stop"])},[k("span",eo,B(d===t.current?"✓":""),1),k("span",no,"<"+B(d)+">",1)],40,to))),128))],32)],64))}},E="__sve-tw-menu",Nt="--sve-tw-anchor",oo=typeof CSS<"u"&&CSS.supports?.("anchor-name: --x");let ot=null;const Vt="__sve-tw-style",Lt=[{key:"",all:!0,device:"Responsive",label:"tw_size_all"},{key:"",device:"Laptop",label:"tw_size_laptop",prefix:""},{key:"max-lg",device:"Tablet",label:"responsive_tablet",under:1024},{key:"max-md",device:"Mobile",label:"responsive_mobile",under:768}],Kt=["","dark","hover","focus","active","before","after"],be={Mobile:"max-md",Tablet:"max-lg",Laptop:"",Desktop:""},ye=["div","section","article","header","footer","main","aside","nav","h1","h2","h3","h4","h5","h6","p","span","a","button","label","ul","ol","li","figure","figcaption","blockquote","strong","em","small","picture","img","video","form","table","tr","td","th"];let ke="",U="",it=!1;function ro(){try{return be[$t(window,"sve-lp-device")]??""}catch{return""}}function Pt(){return it?ke:ro()}function we(){return[Pt(),U].filter(Boolean)}function Bt(){return we().join(":")}const so=/^(max-)?(sm|md|lg|xl|2xl)$/;function ao(t){return String(t||"").split(":").find(e=>so.test(e))||""}function xe(){if(it)return!0;try{return Object.prototype.hasOwnProperty.call(be,$t(window,"sve-lp-device"))}catch{return!1}}function io(t){if(!xe())return!0;const e=ao(t);return e===Pt()?!0:!Lt.some(n=>n.key===e)}let _=null,Y=new Map,D=null,ft=!1,at="",bt=null;function $e(t){return t?.querySelector?.('[data-sve-style="tw"] [data-sve-tw-host]')||null}function _e(t){if(t.getElementById(Vt))return;const e=t.createElement("style");e.id=Vt,e.textContent=`
    #${E} {
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
    #${E} [data-sve-tw-menu-title] {
      padding: 0.1em 0.2em 0.5em;
      opacity: .55;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.6875rem;
    }
    #${E} [data-sve-tw-option],
    #${E} [data-sve-tw-remove] {
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
    #${E} [data-sve-tw-option]:hover,
    #${E} [data-sve-tw-remove]:hover {
      background: rgba(255,255,255,.1);
    }
    #${E} [data-sve-tw-option][data-active] {
      background: rgba(255,255,255,.06);
    }
    #${E} [data-sve-tw-option][data-sve-tw-off] [data-sve-tw-label] {
      opacity: .45;
      text-decoration: line-through;
      text-decoration-thickness: 1px;
    }
    #${E} [data-sve-tw-tick] {
      flex: 0 0 auto;
      width: 0.9em;
      opacity: .7;
      font-family: ui-sans-serif, system-ui, sans-serif;
      line-height: 1;
    }
    #${E} [data-sve-tw-dot] {
      flex: 0 0 auto;
      width: 0.9em;
      height: 0.9em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
    #${E} [data-sve-tw-label] {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #${E} [data-sve-tw-remove] {
      margin-top: 0.3rem;
      border-top: 1px solid rgba(255,255,255,.14);
      border-radius: 0 0 0.4em 0.4em;
      padding-top: 0.6em;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    #${E} [data-sve-tw-search] {
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
    #${E} [data-sve-tw-search]:focus-within {
      border-color: rgba(147,197,253,.7);
    }
    #${E} [data-sve-tw-search] svg {
      flex: 0 0 auto;
      opacity: .5;
    }
    #${E} [data-sve-tw-add-input] {
      all: unset;
      flex: 1 1 auto;
      min-width: 0;
      color: inherit;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.75rem;
    }
    #${E} [data-sve-tw-tabs] {
      display: flex;
      gap: 0.2rem;
      margin-bottom: 0.45rem;
      padding: 0.15rem;
      border-radius: 0.45em;
      background: rgba(0,0,0,.28);
    }
    #${E} [data-sve-tw-tab] {
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
    #${E} [data-sve-tw-tab]:hover { opacity: 1; }
    #${E} [data-sve-tw-tab][data-active] {
      opacity: 1;
      background: rgba(255,255,255,.14);
    }
    #${E} [data-sve-tw-add-empty] {
      padding: 0.4em 0.5em;
      opacity: .55;
    }
  `,t.head.appendChild(e)}function Ce(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e.contentDocument;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o.contentDocument}catch{}return null}function lo(t,e,n){const o=Ce(t);if(!(!o||!_?.path))for(const r of o.querySelectorAll(`[${Fe}="${_.path}"]`))try{e&&r.classList.remove(e),n&&r.classList.add(n)}catch{}}const pt=new Map,co=/(^|-)color$|^fill$|^stroke$/;function Ot(t){const e=String(t||""),n=e.slice(0,e.indexOf(":")).trim();return co.test(n)&&/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(e)?.[1]||""}function Se(t,e){if(!e)return"";if(pt.has(e))return pt.get(e);const n=Ce(t),o=n?.documentElement,r=n?.defaultView;if(!o||!r)return"";let a="",s=e;for(let i=0;i<6&&s;i+=1){try{a=r.getComputedStyle(o).getPropertyValue(s).trim()}catch{return""}if(!a)return"";if(s=Ot(a),!s)break}return a&&!a.startsWith("var(")?(pt.set(e,a),a):""}function uo(t,e){return _n(e,D)||Se(t,Ot(ge(e,D)))}function O(t){const e=t?.document.getElementById(E);ot&&(ot.style.removeProperty("anchor-name"),ot=null),bt?.(),bt=null,at="",e&&(e._sveApp?.unmount(),e.remove())}function Zt(t,e,n){const o=e.getBoundingClientRect(),r=n.offsetWidth||176,a=8,s=140,i=e.closest?.("#__sve-tw-strip")?Eo(t):null,c=i?i.top:0,l=i?i.bottom:t.innerHeight,f=i?i.left:0,u=i?i.right:t.innerWidth,d=o.bottom+4,b=l-d-a,g=Math.max(s,Math.min(b,420));n.style.left=`${Math.max(f+a,Math.min(o.left,u-r-a))}px`,n.style.maxHeight=`${g}px`,n.style.top=`${b>=s?d:Math.max(c+a,l-a-g)}px`}function J(t,e,n,o){const r=t.document;O(t),_e(r);const a=r.createElement("div");a.id=E,r.body.appendChild(a),a._sveApp=ze(n,a,o);const s=oo&&!!e.closest?.("#__sve-tw-strip");s?(ot=e,e.style.setProperty("anchor-name",Nt),a.style.setProperty("position","absolute"),a.style.setProperty("position-anchor",Nt),a.style.setProperty("position-area","block-end span-inline-start"),a.style.setProperty("position-try-fallbacks","flip-block, flip-inline, flip-block flip-inline"),a.style.setProperty("margin","4px 0 0 0"),a.style.setProperty("max-height","20rem")):Zt(t,e,a);const i=()=>{s||Zt(t,e,a)},c=f=>{!a.contains(f.target)&&!e.contains(f.target)&&(O(t),nt())},l=f=>{f.key==="Escape"&&(O(t),nt())};return r.addEventListener("pointerdown",c,!0),r.addEventListener("keydown",l,!0),t.addEventListener("scroll",i,!0),t.addEventListener("resize",i),bt=()=>{r.removeEventListener("pointerdown",c,!0),r.removeEventListener("keydown",l,!0),t.removeEventListener("scroll",i,!0),t.removeEventListener("resize",i)},a}function Te(t,e,n){return(e||[]).map(o=>({label:o.label,css:o.css,color:o.color||Se(t,Ot(o.css)),active:o.label===n}))}function K(){return!_||W("dock:is-locked")===!0}function Z(){const t=W("dock:html");if(!_||typeof t!="string"||t[_.from]!=="<")return null;const e=le(t,_.from,_.openTo);return{html:t,value:e?e.value:""}}function fo(t){if(!_?.path)return;const n=Tt(St(t),new Set).find(o=>o.path===_.path);n&&(_={from:n.from,openTo:n.openTo,path:n.path,tag:n.tag})}function H(t,e,n,o,r){const a=wn(e,_,n);a!==e&&(lo(t,o,r),W("dock:set-html",a),fo(a),R(t))}const Xt=["display","position","inset","top","right","bottom","left","z-index","flex-direction","flex-wrap","justify-content","align-items","gap","column-gap","row-gap","margin","margin-inline","margin-block","margin-top","margin-right","margin-bottom","margin-left","padding","padding-inline","padding-block","padding-top","padding-right","padding-bottom","padding-left","width","min-width","max-width","height","min-height","max-height","font-family","font-size","font-weight","line-height","text-align","text-transform","text-decoration-line","font-style","color","background-color","border-color","border-radius","fill","stroke","outline-color","overflow"];function Ut(t){const e=G(t);if(!e)return-1;const n=Xt.indexOf(e);return n===-1?Xt.length:n}function po(t){if(K())return;const e=Z();if(!e)return;const n=At(e.value),o=n.groups.flatMap(c=>c.items).filter(c=>!c.dynamic);if(o.length<2)return;const r=new Map;n.groups.forEach((c,l)=>r.set(c.key,c.key===""?-1:l));const a=[...o].sort((c,l)=>{const f=r.get(c.variants.join(":"))??0,u=r.get(l.variants.join(":"))??0;return f-u||Ut(c.name)-Ut(l.name)||c.name.localeCompare(l.name)}),s=[...o].sort((c,l)=>c.from-l.from).map(c=>({from:c.from,to:c.to})),i=fe(e.value,s,a.map(c=>c.raw));i!==e.value&&H(t,e.html,i,"","")}function G(t){return he(t,D)?.label||""}function yt(t){return At(t).groups.flatMap(e=>e.items)}function Ee(t){const e=Bt();return yt(t).filter(n=>!n.dynamic&&n.variants.join(":")===e)}function Yt(t,e){if(K()||!e)return;const n=Z();if(!n)return;const o=G(e),r=Ee(n.value).find(s=>s.name===e||o&&G(s.name)===o);if(r?.name===e){H(t,n.html,st(n.value,r,""),e,"");return}if(r){const s=vt({variants:r.variants,name:e,modifier:r.modifier,important:r.important});H(t,n.html,st(n.value,r,s),r.raw,s);return}const a=vt({variants:we(),name:e,modifier:"",important:""});H(t,n.html,de(n.value,a),"",a)}function mo(t,e){const n=String(e||"").trim(),o=Bt(),r=o&&!n.includes(":")?`${o}:${n}`:n;if(K()||!n)return;const a=Z();if(!a||yt(a.value).some(d=>d.raw===r))return;const{variants:i,base:c}=ce(r),l=G(ue(c).name),f=i.join(":"),u=l?yt(a.value).find(d=>!d.dynamic&&d.variants.join(":")===f&&G(d.name)===l):null;if(u){H(t,a.html,st(a.value,u,r),u.raw,r);return}H(t,a.html,de(a.value,r),"",r.includes(":")?"":r)}function kt(t,e,n){if(K())return;const o=Z();if(!o||o.value.slice(e.from,e.to)!==e.raw){R(t);return}const r=n?vt({variants:e.variants,name:n,modifier:e.modifier,important:e.important}):"";H(t,o.html,st(o.value,e,r),e.raw,r)}function ho(t,e){if(K()||!_)return;const n=W("dock:html");if(typeof n!="string"||n[_.from]!=="<")return;const o=pe(n,_,e);if(o===n)return;const r=_.from;W("dock:set-html",o);const s=Tt(St(o),new Set).find(i=>i.from===r);s&&(_={from:s.from,openTo:s.openTo,path:s.path,tag:s.tag}),R(t),et("tw:changed")}function Wo(t,e,n){n?.tag&&J(t,e,ve,{label:T(t,"tw_tag"),placeholder:T(t,"tw_tag_placeholder"),current:String(n.tag).toLowerCase(),tags:ye,onPick:o=>{go(t,n,o),O(t)}})}function go(t,e,n){if(W("dock:is-locked")===!0)return;const o=W("dock:html");if(typeof o!="string"||o[e.from]!=="<")return;const r=pe(o,e,n);r!==o&&W("dock:set-html",r)}function vo(t,e){J(t,e,ve,{label:T(t,"tw_tag"),placeholder:T(t,"tw_tag_placeholder"),current:(_?.tag||"").toLowerCase(),tags:ye,onPick:n=>{ho(t,n),O(t)}})}function bo(t,e){if(K())return;const n=Z();if(!n)return;const o=e.map(s=>Y.get(s)).filter(Boolean);if(o.length<2)return;const r=[...o].sort((s,i)=>s.from-i.from).map(s=>({from:s.from,to:s.to})),a=fe(n.value,r,o.map(s=>s.raw));a!==n.value&&H(t,n.html,a,"","")}function qo(t){Dt(t,_?.path||"")}function jo(){return!!_}function yo(t,e){const n=Lt[e];n&&(W("lp:set-device",{win:t,key:n.device}),it=!n.all,ke=n.key,O(t),R(t),et("tw:changed"))}function ko(t,e){J(t,e,Mt,{title:T(t,"tw_state"),removeLabel:T(t,"tw_state_none"),options:Kt.filter(Boolean).map(n=>({label:n,css:"",color:null,active:n===U})),onPick:n=>{U=Kt.includes(n)?n:"",O(t),R(t),et("tw:changed")},onRemove:()=>{U="",O(t),R(t),et("tw:changed")}})}Re("lp:device",()=>{it=!1,$e(window.document)&&R(window)});function wo(t){const e=t?Z():null;return e&&Ee(e.value).find(n=>G(n.name)===t)?.name||""}function Ho(t,e,n,o){const r=D?.byProperty.get(n)||[];if(!r.length)return;const a=wo(n);J(t,e,Mt,{title:n,removeLabel:T(t,"tw_classes_remove"),options:Te(t,r,a),onPick:s=>{Yt(t,s),O(t),o?.(s)},onRemove:()=>{a&&Yt(t,a),O(t),o?.("")}})}let Gt=[],mt=!1;function xo(t){mt||(mt=!0,t.fetch("/!/sve/site-css/classes",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{groups:[]}).then(e=>{Gt=Array.isArray(e?.groups)?e.groups:[],v.siteClasses=Gt}).catch(()=>{mt=!1}))}function $o(t,e){xo(t),J(t,e,Gn,{label:T(t,"tw_add_class"),placeholder:T(t,"tw_add_placeholder"),emptyText:T(t,"tw_add_empty"),offText:T(t,"tw_class_not_imported"),sitePlaceholder:T(t,"tw_add_placeholder_site"),siteLabel:T(t,"tw_add_site"),tailwindLabel:T(t,"tw_add_tailwind"),search:n=>{const o=String(n||"").trim(),r=o.toLowerCase();if(!r||!D)return[];const a=D.catalog,s=[],i=[];for(let l=0;l<a.names.length;l++){const f=a.lower[l];f.startsWith(r)?s.length<40&&s.push(a.names[l]):i.length<40&&f.includes(r)&&i.push(a.names[l])}s.sort((l,f)=>l.length-f.length);const c=[...s,...i].slice(0,40);return!c.includes(o)&&a.resolve(o)&&c.unshift(o),a.rows(c).map(l=>({label:l.label,css:l.css,color:l.color,active:!1}))},onAdd:n=>{mo(t,n)}})}function _o(t,e,n){const o=Y.get(n);if(!o||o.locked)return;if(at===n){O(t),nt();return}const r=he(o.name,D);J(t,e.currentTarget,Mt,{title:r?.label||"",removeLabel:T(t,"tw_classes_remove"),options:Te(t,r?.options,o.name),onPick:a=>{kt(t,o,a),O(t)},onRemove:()=>{kt(t,o,""),O(t)}}),at=n,nt()}function nt(){for(const t of v.groups)for(const e of t.chips)e.open=e.id===at}function No(t,e){if(!e||e.from==null||e.openTo==null){_=null,Y=new Map,O(t),R(t);return}_={from:e.from,openTo:e.openTo,path:e.path,tag:e.tag},R(t)}function R(t){Co(t);const e=_?Z():null,n=e?At(e.value):{scope:null,groups:[]};Y=new Map,v.baseLabel=T(t,"tw_size_base"),v.scopeTitle=T(t,"tw_classes_scope"),v.dropTitle=T(t,"tw_classes_remove"),v.variant=Bt(),v.onBreakpoint=s=>yo(t,s),v.onState=s=>ko(t,s.currentTarget);const o=xe();v.breakpoints=Lt.map((s,i)=>({index:i,label:T(t,s.label),title:s.under?`${s.key}:  ·  < ${s.under}px`:T(t,s.all?"tw_size_all_title":"tw_size_base_title"),active:s.all?!o:o&&s.key===Pt()})),v.state=U,v.stateLabel=U||T(t,"tw_state"),v.canEdit=!K(),v.onChip=(s,i)=>_o(t,s,i),v.onTag=s=>vo(t,s.currentTarget),v.sortTitle=T(t,"tw_sort"),v.onSort=()=>po(t),v.onDrop=s=>{const i=Y.get(s);i&&!i.locked&&(O(t),kt(t,i,""))},v.tag=_?.tag||"";const r=n.scope?.label||"";v.scope=/^\[\s*\]$/.test(r)?"":r,v.emptyText=T(t,_?n.groups.length?"tw_classes_none_size":"tw_classes_none":"tw_classes_pick"),v.groups=n.groups.filter(s=>io(s.key)).map(s=>({key:s.key,current:s.key===v.variant,chips:s.items.map((i,c)=>{const l={...i,id:`${s.key}-${c}-${i.from}`,locked:i.dynamic||!v.canEdit,open:!1,color:i.dynamic?"":uo(t,i.name),title:i.dynamic?T(t,"tw_classes_dynamic"):ge(i.name,D)||i.raw};return Y.set(l.id,l),l})}));const a=$e(t.document);a&&(_e(t.document),De(a,Rn)),nt(),Dt(t,_?.path||""),et("tw:changed")}function Co(t){D||ft||(ft=!0,xn(t).then(e=>{D=e,R(t)}).catch(()=>{ft=!1}))}const Ae="sve-tw-strip";function So(t){try{return $t(t,Ae)!=="0"}catch{return!0}}function Vo(t,e){Ie(t,Ae,e?"1":"0"),e||wt(t)}const w="__sve-tw-strip",Jt="__sve-tw-strip-style";let Qt=null,tt=null;function zt(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o}catch{}return null}function To(t){if(t.getElementById(Jt))return;const e=t.createElement("style");e.id=Jt,e.textContent=`
    #${w} {
      position: fixed;
      z-index: 99998;
      display: flex;
      align-items: stretch;
      gap: 0.3rem;
      font-size: 0.6875rem;
    }
    #${w} [data-group] {
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
    #${w} [data-group="classes"] {
      position: relative;
      max-width: 30rem;
      padding: 0;
    }
    #${w} [data-scroll] {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      min-width: 0;
      padding: 0.45rem;
      overflow-x: auto;
      scrollbar-width: none;
    }
    #${w} [data-scroll]::-webkit-scrollbar { display: none; }
    /* The fade is a sibling, never a mask on the scroller: a mask-image on a
       scrollable element resets scrollLeft in Chrome. */
    #${w} [data-fade] {
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
    #${w} [data-group="classes"][data-overflow] [data-fade] { opacity: 1; }
    #${w} [data-sve-tw-strip-tag] {
      flex: 0 0 auto;
      padding: 0 0.2em;
      opacity: .75;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    #${w} button {
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
    #${w} button:hover { background: rgba(255,255,255,.2); }
    #${w} button[data-locked] { cursor: default; opacity: .5; }
    #${w} button[data-locked]:hover { background: rgba(255,255,255,.1); }
    #${w} [data-chip-wrap] {
      position: relative;
      display: inline-flex;
      flex: 0 0 auto;
      touch-action: none;
      cursor: grab;
    }
    #${w} [data-chip-wrap][data-dragging] {
      opacity: .35;
      cursor: grabbing;
    }
    #${w}[data-dragging],
    #${w}[data-dragging] * { cursor: grabbing !important; }
    #${w}[data-dragging] [data-drop] { opacity: 0 !important; }
    #${w} [data-drop] {
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
    #${w} [data-chip-wrap]:hover [data-drop] { opacity: 1; }
    #${w} [data-drop]:hover { background: #f43f5e; }
    /* One box, not a button inside a plate: the group is the button. */
    #${w} [data-group="add"] {
      padding: 0;
    }
    #${w} [data-add],
    #${w} [data-add]:hover {
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
    #${w} [data-plus] {
      display: block;
      transform: translateY(-0.09em);
    }
    #${w} [data-group="add"]:hover {
      background: #3858e9;
      border-color: #3858e9;
      color: #fff;
    }
    #${w} [data-dot] {
      width: 0.8em;
      height: 0.8em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
    /* The ghost lives on the body, outside the strip, so none of the rules
       above reach it — it carries its own copy of the chip's look. */
    #${w}-ghost {
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
    #${w}-ghost [data-dot] {
      width: 0.8em;
      height: 0.8em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
  `,t.head.appendChild(e)}function Eo(t){const e=zt(t);return e?e.getBoundingClientRect():null}let M=null;function Ao(t,e,n,o){if(e.button!==0||e.target?.closest?.("[data-drop]"))return;M={wrap:n,scroll:o,strip:t.document.getElementById(w),x:e.clientX,moved:!1,ghost:null};const r=s=>{if(!M||!M.moved&&Math.abs(s.clientX-M.x)<4)return;if(!M.moved){M.moved=!0,M.wrap.setAttribute("data-dragging",""),M.strip?.setAttribute("data-dragging","");const l=M.wrap.querySelector("button")?.cloneNode(!0);l&&(l.id=`${w}-ghost`,l.querySelector("[data-drop]")?.remove(),t.document.body.appendChild(l),M.ghost=l)}s.preventDefault(),M.ghost&&(M.ghost.style.left=`${s.clientX}px`,M.ghost.style.top=`${s.clientY}px`);const i=t.document.elementFromPoint(s.clientX,s.clientY)?.closest?.("[data-chip-wrap]");if(!i||i===M.wrap||i.parentElement!==M.scroll)return;const c=i.getBoundingClientRect();s.clientX<c.left+c.width/2?M.scroll.insertBefore(M.wrap,i):M.scroll.insertBefore(M.wrap,i.nextSibling)},a=()=>{t.document.removeEventListener("pointermove",r,!0),t.document.removeEventListener("pointerup",a,!0),t.document.removeEventListener("pointercancel",a,!0);const s=M;if(M=null,s?.ghost?.remove(),!s?.moved)return;s.wrap.removeAttribute("data-dragging"),s.strip?.removeAttribute("data-dragging");const i=c=>{c.preventDefault(),c.stopPropagation()};t.addEventListener("click",i,!0),t.setTimeout(()=>t.removeEventListener("click",i,!0),0),bo(t,[...s.scroll.querySelectorAll("[data-chip-wrap]")].map(c=>c.dataset.chip))};t.document.addEventListener("pointermove",r,!0),t.document.addEventListener("pointerup",a,!0),t.document.addEventListener("pointercancel",a,!0)}function wt(t){t?.document.getElementById(w)?.remove()}function Mo(t){const e=()=>Lo(t);Qt!==t&&(Qt=t,t.addEventListener("resize",e),t.addEventListener("scroll",e,!0));const n=zt(t)?.contentWindow;if(n&&!n._sveStripBound)try{n._sveStripBound=!0,n.addEventListener("scroll",e,!0),n.addEventListener("resize",e),n.addEventListener("statamic:preview-updated",()=>{t.setTimeout(()=>Dt(t,tt?.path||""),60)})}catch{}}function Lo(t){const e=t?.document.getElementById(w);!e||!tt?.el?.isConnected||Me(t,e,tt.frame,tt.el)}function Dt(t,e){if(!t||!So(t)){wt(t);return}const n=t.document,o=zt(t),r=o?.contentDocument,a=e&&r?r.querySelector(`[data-sve-ht-path="${e}"]`):null;if(!a||!v.tag){wt(t);return}To(n),Mo(t);let s=n.getElementById(w);s||(s=n.createElement("div"),s.id=w,n.body.appendChild(s));let i=s.querySelector('[data-group="tag"]');if(!i){i=n.createElement("div"),i.setAttribute("data-group","tag");const u=n.createElement("span");u.setAttribute("data-sve-tw-strip-tag",""),i.appendChild(u),s.appendChild(i)}i.firstChild.textContent=`<${v.tag}>`;let c=s.querySelector('[data-group="classes"]'),l=c?.querySelector("[data-scroll]");const f=v.groups.flatMap(u=>u.chips);if(f.length&&!c){c=n.createElement("div"),c.setAttribute("data-group","classes"),l=n.createElement("div"),l.setAttribute("data-scroll","");const u=n.createElement("span");u.setAttribute("data-fade",""),c.appendChild(l),c.appendChild(u);const d=()=>{l.scrollWidth-l.scrollLeft-l.clientWidth>2?c.setAttribute("data-overflow",""):c.removeAttribute("data-overflow")};l.addEventListener("scroll",d),c._sveSync=d,s.insertBefore(c,s.querySelector('[data-group="add"]'))}if(!f.length)c?.remove();else if(l){l.replaceChildren();for(const u of f){const d=n.createElement("button");if(d.type="button",d.title=u.title||"",u.locked&&d.setAttribute("data-locked",""),u.color){const g=n.createElement("span");g.setAttribute("data-dot",""),g.style.background=u.color,d.appendChild(g)}d.appendChild(n.createTextNode(u.raw));const b=n.createElement("span");if(b.setAttribute("data-chip-wrap",""),b.dataset.chip=u.id,b.appendChild(d),u.locked||b.addEventListener("pointerdown",g=>Ao(t,g,b,l)),!u.locked){const g=n.createElement("button");g.type="button",g.setAttribute("data-drop",""),g.title=v.dropTitle||"",g.textContent="−",g.addEventListener("click",h=>{h.preventDefault(),h.stopPropagation(),v.onDrop?.(u.id)}),b.appendChild(g),d.addEventListener("click",h=>{h.preventDefault(),h.stopPropagation(),v.onChip?.(h,u.id)})}l.appendChild(b)}t.requestAnimationFrame(()=>c._sveSync?.())}if(!s.querySelector('[data-group="add"]')){const u=n.createElement("div");u.setAttribute("data-group","add");const d=n.createElement("button");d.type="button",d.setAttribute("data-add","");const b=n.createElement("span");b.setAttribute("data-plus",""),b.textContent="+",d.appendChild(b),d.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),$o(t,g.currentTarget)}),u.appendChild(d),s.appendChild(u)}tt={frame:o,el:a,path:e},Me(t,s,o,a)}function Me(t,e,n,o){const r=n.getBoundingClientRect(),a=n.clientWidth?r.width/n.clientWidth:1,s=o.getBoundingClientRect(),i=e.getBoundingClientRect(),c=6,l=16,f=r.left+s.left*a,u=r.top+s.top*a-i.height-c,d=r.top+s.top*a+c,b=Math.max(c,r.left+l),g=Math.max(b,Math.min(r.right,t.innerWidth)-i.width-l);e.style.left=`${Math.max(b,Math.min(f,g))}px`,e.style.top=`${Math.max(r.top+l,u<r.top+l?d:u)}px`;const h=n.clientHeight||r.height;e.hidden=s.bottom<=0||s.top>=h}export{rt as P,Wo as a,St as b,O as c,_t as d,V as e,Tt as f,So as g,zo as h,Ro as i,qo as j,Io as k,Fo as l,Oo as m,wo as n,Ho as o,Do as p,$o as q,No as r,Vo as s,ie as t,Yt as u,jo as v};
