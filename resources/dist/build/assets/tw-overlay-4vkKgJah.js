const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./tw-compile-DdxyBBQG.js","./tw-candidates-wYTeDvRv.js"])))=>i.map(i=>d[i]);
import{J as De,r as ze,_ as Re,o as S,c as T,u as L,a as x,f as P,t as B,F,e as X,I as ht,d as q,m as Ie,n as kt,K as R,H,O as ne,a2 as gt,M as oe,w as j,N as re,j as E,l as Fe,i as We,a9 as et,Q as W,a8 as $t,U as qe,A as je}from"./addon-DCz91pvm.js";import{H as Ve}from"./html-pick-align-BQgDq65Q.js";const rt="__sve-partial-menu",He=/\{\{#([\s\S]*?)#\}\}/g,Ft=/\{\{\s*partial(?::([^\s}]+)|(?=[\s}]))([\s\S]*?)\}\}/gi,ct=new Map;function Ct(t){const e=String(t||"").replace(He,r=>" ".repeat(r.length)),n=[];Ft.lastIndex=0;let o;for(;o=Ft.exec(e);){const r=(o[1]||"").trim(),s=(o[2]||"").match(/\bsrc\s*=\s*(["'])([^"']+)\1/i),i=r||(s?s[2].trim():"");!i||i.includes("..")||n.push({from:o.index,to:o.index+o[0].length,src:i})}return n}function Wt(t,e){return Ct(t).find(n=>e>=n.from&&e<=n.to)||null}const Ne=new Set(["if","elseif","else","unless","foreach","forelse","noparse","once","cache","nocache","section","yield","partial","slot","switch","case","vite","sve_html","sve_css","sve_js","sve_tw","style_push","script_push"]);function Ke(t,e){const n=[],o=/\{\{\s*(\/?)([A-Za-z_][A-Za-z0-9_]*)\b[\s\S]*?\}\}/g;let r;for(;r=o.exec(String(t||""));){const s=r[2];if(!Ne.has(s.toLowerCase())){if(!r[1]){n.push({name:s,from:r.index,to:null});continue}for(let i=n.length-1;i>=0;i-=1)if(n[i].name===s&&n[i].to==null){n[i].to=r.index+r[0].length;break}}}let a=null;for(const s of n)s.to==null||e<s.from||e>s.to||(!a||s.to-s.from<a.to-a.from)&&(a=s);return a?.name||null}function Ze(t,e){const n=new Set,o=r=>{if(Array.isArray(r)){if(!e){for(const a of r)a&&typeof a=="object"&&typeof a.type=="string"&&a.type&&n.add(a.type),o(a);return}r.forEach(o);return}if(!(!r||typeof r!="object")){if(e&&Array.isArray(r[e]))for(const a of r[e])a&&typeof a=="object"&&typeof a.type=="string"&&a.type&&n.add(a.type);Object.values(r).forEach(o)}};return o(t),n}function Xe(t,e,n,o){if(!t.src.includes("{")||!o)return e;const r=Ke(n,t.from),a=Ze(o,r);return r?e.filter(s=>a.has(s.label)):a.size===0?e:e.filter(s=>a.has(s.label))}function Ue(t,e){if(ct.has(e))return ct.get(e);const n=t.fetch(`/!/sve/section-template/partials?src=${encodeURIComponent(e)}`,{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(o=>o.ok?o.json():{items:[]}).then(o=>Array.isArray(o.items)?o.items:[]).catch(()=>[]);return ct.set(e,n),n}let Q=null;function qt(t){t.clearTimeout(Q),Q=null}function Ye(t,e){Q||(Q=t.setTimeout(()=>{Q=null,e?.()},180))}function Z(t){t?.getElementById(rt)?.remove()}function Ge(t,e,n,o,{onOpen:r,emptyLabel:a,labelFor:s,onStay:i,onLeave:l}){const c=t.document;Z(c);const f=c.createElement("div");if(f.id=rt,f.style.left=`${Math.max(8,Math.round(n))}px`,f.style.top=`${Math.max(8,Math.round(o))}px`,e.length)e.forEach(b=>{const p=c.createElement("button");p.type="button",p.setAttribute("data-sve-partial-choice",""),p.textContent=s?s(b.label):b.label,p.title=b.path||b.type,p.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation(),Z(c),r?.(b.type)}),f.appendChild(p)});else{const b=c.createElement("div");b.setAttribute("data-sve-partial-empty",""),b.textContent=a||"",f.appendChild(b)}c.body.appendChild(f);const u=f.getBoundingClientRect(),d=8;let v=u.left,g=u.top;u.right>t.innerWidth-d&&(v=Math.max(d,t.innerWidth-u.width-d)),u.bottom>t.innerHeight-d&&(g=Math.max(d,t.innerHeight-u.height-d)),f.style.left=`${Math.round(v)}px`,f.style.top=`${Math.round(g)}px`,f.addEventListener("mouseenter",()=>i?.()),f.addEventListener("mouseleave",()=>l?.())}function Vo(t){const e=t.Decoration.mark({class:"sve-cm-partial"}),n=t.Decoration.line({class:"sve-cm-partial-line"}),o=t.StateEffect.define(),r=t.StateField.define({create(s){return jt(s,t,e)},update(s,i){return i.docChanged?jt(i.state,t,e):s},provide:s=>t.EditorView.decorations.from(s)}),a=t.StateField.define({create(){return t.Decoration.none},update(s,i){let l;for(const d of i.effects)d.is(o)&&(l=d.value);if(l===void 0)return i.docChanged?t.Decoration.none:s;if(!l)return t.Decoration.none;const c=new t.RangeSetBuilder,f=i.state.doc.lineAt(l.from),u=i.state.doc.lineAt(l.to);for(let d=f.number;d<=u.number;d+=1){const v=i.state.doc.line(d);c.add(v.from,v.from,n)}return c.finish()},provide:s=>t.EditorView.decorations.from(s)});return{extensions:[r,a],setHover(s,i){s&&s.dispatch({effects:o.of(i)})}}}function jt(t,e,n){const o=new e.RangeSetBuilder;for(const r of Ct(t.doc.toString()))o.add(r.from,r.to,n);return o.finish()}function Ho(t,e,{onOpen:n,emptyLabel:o,openLabel:r,sectionValues:a,isLocked:s,setHover:i}){if(!e?.dom||e.dom._svePartialBound)return;e.dom._svePartialBound=!0;let l=null,c="",f="";const u=()=>{qt(t),t.clearTimeout(l),l=null,f="",c="",i?.(e,null),Z(t.document)},d={stay:()=>qt(t),leave:()=>Ye(t,u)},v=()=>{t.clearTimeout(l),l=null,f="",i?.(e,null)},g=()=>!!s?.(),b=(p,k,C,{open:y}={})=>{if(g()){Z(t.document),i?.(e,null);return}c=p.src,Ue(t,p.src).then(m=>{if(c!==p.src)return;const $=e.state.doc.toString(),D=Xe(p,m,$,a?.()||null);!y&&D.length<2||Ge(t,D,k,C,{onOpen:n,emptyLabel:o,labelFor:r,onStay:d.stay,onLeave:d.leave})})};e.dom.addEventListener("mousemove",p=>{if(g()){u();return}const k=e.posAtCoords({x:p.clientX,y:p.clientY});if(k==null)return;const C=Wt(e.state.doc.toString(),k);if(!C){t.clearTimeout(l),l=null,f="",d.leave();return}d.stay(),i?.(e,{from:C.from,to:C.to}),!(f===C.src&&l)&&(v(),f=C.src,l=t.setTimeout(()=>{const y=e.coordsAtPos(C.from);b(C,y?.left??p.clientX,(y?.bottom??p.clientY)+6)},280))}),e.dom.addEventListener("mouseleave",p=>{if(p.relatedTarget?.closest?.(`#${rt}`)){d.stay();return}d.leave()}),e.dom.addEventListener("contextmenu",p=>{if(g()){Z(t.document);return}const k=e.posAtCoords({x:p.clientX,y:p.clientY});if(k==null)return;const C=Wt(e.state.doc.toString(),k);C&&(p.preventDefault(),v(),b(C,p.clientX,p.clientY+8,{open:!0}))}),Je(t.document)||(t.document.addEventListener("mousedown",p=>{p.target.closest(`#${rt}, .sve-cm-partial`)||Z(t.document)}),t.document._svePartialDismiss=!0)}function Je(t){return!!t._svePartialDismiss}const Qe=new Set(["if","elseif","else","endif","unless","foreach","forelse","noparse","once","cache","nocache","section","yield","partial","slot","switch","case","vite","sve_html","sve_css","sve_js","sve_tw","sve_prop","style_push","script_push","visual_edit","responsive_css"]),Vt=/\{\{\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.-]*)((?::[^\s}]*)?[\s\S]*?)\}\}/g;function tn(t,e){const n=String(t||""),o={sortField:"",sortDir:"",limit:""};if(e){const s=n.match(/\bsort\s*=\s*["']([^"']*)["']/),i=n.match(/\blimit\s*=\s*["']?(\d+)["']?/);if(s){const l=s[1].trim();if(l.toLowerCase()==="random")o.sortDir="random";else if(l){const c=l.split(":"),f=c[c.length-1].toLowerCase(),u=f==="asc"||f==="desc";o.sortField=(u?c.slice(0,-1):c).join(":"),o.sortDir=u?f:"asc"}}return i&&(o.limit=i[1]),o}const r=n.match(/\|\s*sort\s*:\s*([A-Za-z_][A-Za-z0-9_.-]*)/),a=n.match(/\|\s*limit\s*:\s*(\d+)/);return/\|\s*shuffle\b/.test(n)?o.sortDir="random":r&&(o.sortField=r[1],o.sortDir=/\|\s*reverse\b/.test(n)?"desc":"asc"),a&&(o.limit=a[1]),o}function Ht(t){return String(t||"").replace(/\s+/g," ").trim()}function en(t){const e=String(t||""),n=[],o=[];Vt.lastIndex=0;let r;for(;r=Vt.exec(e);){const a=!!r[1],s=r[2].toLowerCase(),i=r.index,l=i+r[0].length;if(a||s==="endif"){const g=s==="endif"?"if":s;for(let b=o.length-1;b>=0;b-=1)if(g==="if"?o[b].branchOf==="if":o[b].name===g){n.push({...o[b],to:l}),o.length=b;break}continue}if(s==="if"||s==="unless"){o.push({kind:"if",loopKind:"",name:s,handle:"",params:"",expr:Ht(r[3]),from:i,openTo:l,branchOf:s});continue}if(s==="elseif"||s==="else"){let g=-1;for(let b=o.length-1;b>=0;b-=1)if(o[b].branchOf==="if"){g=b;break}if(g===-1)continue;n.push({...o[g],to:i}),o.length=g+1,o[g]={kind:"if",loopKind:"",name:s,handle:"",params:"",expr:Ht(r[3]),from:i,openTo:l,branchOf:"if"};continue}if(Qe.has(s)||r[3].trim().startsWith("="))continue;const c=r[3]||"",f=c.match(/^:([A-Za-z0-9_-]+)/),u=c.match(/\bfrom\s*=\s*["']([A-Za-z0-9_-]+)["']/),d=f?.[1]||u?.[1]||"",v=s==="collection";o.push({kind:"loop",loopKind:v?"collection":"field",name:s,handle:d,params:v?c.replace(/^:[A-Za-z0-9_-]+/,"").trim():c.trim(),expr:v?d:s,...tn(c,v),from:i,openTo:l,branchOf:null})}return n.filter(a=>a.to>a.openTo).sort((a,s)=>a.from-s.from||s.to-a.to)}const se=new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);function ae(t){return String(t||"").replace(/\{\{[\s\S]*?\}\}/g,e=>" ".repeat(e.length))}function nn(t){const e=t.match(/\sclass\s*=\s*(["'])([^"']*)\1/i);if(!e)return"";const n=e[2].match(/\[\s*([\s\S]*?)\s*\]/);if(n){const o=n[1].replace(/\{\{[\s\S]*?\}\}/g," ").split(/\s+/).find(r=>/^[a-zA-Z_][\w-]*$/.test(r));if(o)return o}return(e[2].trim().split(/\s+/)[0]||"").replace(/\[|\]/g,"")}function ie(t,e,n,o){t.hidden=!0,o&&(t.wrapFrom=e,t.wrapTo=n);for(const r of t.children)ie(r,e,n,!1)}function le(t,e,n,o){const r=[],a=[];let s=n,i=0;const l=c=>{a.length?a[a.length-1].children.push(c):r.push(c)};for(;s<o;){if(e[s]!=="<"){s+=1;continue}if(e.startsWith("<!--",s)){const m=e.indexOf("-->",s+4),$=m===-1||m>o?o:m,D=m===-1||m+3>o?o:m+3,lt=le(t,e,s+4,$);for(const It of lt)ie(It,s,D,!0),l(It);s=D;continue}if(e.startsWith("<!",s)||e.startsWith("<?",s)){const m=e.indexOf(">",s+2);s=m===-1||m+1>o?o:m+1;continue}const c=e[s+1]==="/",f=e.slice(s,o).match(/^<\/?([a-zA-Z][a-zA-Z0-9:-]*)/);if(!f){s+=1;continue}const u=f[1].toLowerCase(),d=e.indexOf(">",s);if(d===-1||d>=o)break;const v=e.slice(s,d+1),g=!c&&(se.has(u)||/\/\s*>$/.test(v));if(c){for(let m=a.length-1;m>=0;m-=1)if(a[m].tag===u){a[m].to=d+1,a.length=m;break}s=d+1;continue}const b=nn(t.slice(s,d+1)),p=a.length?a[a.length-1]:null,k=p?p.children:r,C=p?`${p.path}/${k.length}:${u}`:`${k.length}:${u}`,y={id:`${u}-${s}-${i}`,tag:u,klass:b,path:C,label:b,from:s,to:d+1,openTo:d+1,hidden:!1,children:[]};i+=1,l(y),g?y.to=d+1:a.push(y),s=d+1}for(;a.length;)a.pop().to=o;return r}function on(t){const e=String(t||"");return/\{[A-Za-z_][A-Za-z0-9_]*\}/.test(e)?e:e.split("/").pop()||""}function _t(t,e,n){for(const o of t||[])if(!(e<o.openTo||n>o.to))return _t(o.children,e,n)||o;return null}function rn(t,e){for(const n of en(e)){const o=_t(t,n.from,n.to),r=o?o.children:t,a=[];let s=!1;for(const f of r){const u=f.wrapFrom??f.from,d=f.wrapTo??f.to;if(!(d<=n.from||u>=n.to)){if(u<n.from||d>n.to){s=!0;break}a.push(f)}}if(s)continue;const i=n.loopKind==="collection"?`collection: ${n.handle||"?"}`:n.kind==="loop"?n.name:n.expr,l={id:`antlers-${n.from}`,tag:n.name,kind:"antlers",antlers:n.kind,loopKind:n.loopKind||"",handle:n.handle||"",params:n.params||"",sortField:n.sortField||"",sortDir:n.sortDir||"",limit:n.limit||"",expr:n.expr,klass:i,path:`${o?`${o.path}/`:""}a${n.from}:${n.name}`,label:i,from:n.from,to:n.to,openTo:n.openTo,hidden:!!o?.hidden,children:a},c=a.length?r.indexOf(a[0]):r.findIndex(f=>f.from>n.from);r.splice(c===-1?r.length:c,a.length,l)}return t}function sn(t,e){for(const n of Ct(e)){const o=_t(t,n.from,n.to),r=o?o.children:t,a=on(n.src),s={id:`component-${n.from}`,tag:"component",kind:"component",src:n.src,klass:a,path:`${o?`${o.path}/`:""}c${n.from}:component`,label:a,from:n.from,to:n.to,openTo:n.to,hidden:!!o?.hidden,children:[]};let i=r.findIndex(l=>l.from>n.from);i===-1&&(i=r.length),r.splice(i,0,s)}return t}function St(t){const e=String(t||""),n=ae(e);return le(e,n,0,n.length)}function No(t){const e=String(t||"");return sn(rn(St(e),e),e)}function Tt(t,e,n=0,o=[]){for(const r of t){const a=r.children.length>0,s=e.has(r.id);o.push({id:r.id,tag:r.tag,kind:r.kind||"",antlers:r.antlers||"",loopKind:r.loopKind||"",handle:r.handle||"",params:r.params||"",sortField:r.sortField||"",sortDir:r.sortDir||"",limit:r.limit||"",expr:r.expr||"",src:r.src||"",klass:r.klass||"",path:r.path,label:r.label,from:r.from,to:r.to,openTo:r.openTo,hidden:!!r.hidden,wrapFrom:r.wrapFrom,wrapTo:r.wrapTo,depth:n,hasChildren:a,emptyBlock:r.kind==="antlers"&&!a,shut:s}),a&&!s&&Tt(r.children,e,n+1,o)}return o}function Ko(t){return se.has(String(t||"").toLowerCase())}const an=new Set(["*","**"]),ln=["group","peer"],cn=24;let ut=null;function ce(t){return t?.Statamic?.$config?.get?.("sveFeatures")?.tailwind_dock===!0}function Zo(t){return e=>{if(!ce(t)||!bn(e))return null;const n=e.matchBefore(/[^\s"']*$/),o=n?.text??"";return o.includes("{")||o.includes("}")?null:Et(t).then(r=>{const a=gn(o,r);return a.length?{from:n?n.from:e.pos,options:a,validFor:/^[^\s"'=]*$/}:null})}}function Xo(t,e){return t((n,o)=>{if(!ce(e))return null;const r=yn(n.state,o);return r?Et(e).then(a=>{const s=a.rule(r.text);return s?{pos:r.from,end:r.to,create(){return{dom:kn(s,a.color(r.text))}}}:null}):null})}function Et(t){return ut||(ut=De(()=>import("./tw-compile-DdxyBBQG.js"),__vite__mapDeps([0,1]),import.meta.url).then(e=>e.loadTailwindDesign(t)).then(un).catch(()=>dn())),ut}function un(t){const e=[...ln,...t.getClassList().map(([p])=>p)],n=e.map(p=>p.toLowerCase()),o=new Set(e),r=new Set(t.utilities.keys("static")),a=new Set(t.utilities.keys("functional")),s=new Map,i=new Map;function l(p){if(r.has(p))return p;const k=String(p).split("-");for(let C=k.length;C>0;C--){const y=k.slice(0,C).join("-");if(a.has(y))return y}return""}const c=new Map;e.forEach(p=>{const k=l(p);k&&(c.has(k)||c.set(k,[]),c.get(k).push(p))});function f(p){const k=p.filter(y=>!s.has(y));if(!k.length)return;let C=[];try{C=t.candidatesToCss(k)}catch{C=[]}k.forEach((y,m)=>{s.set(y,typeof C[m]=="string"?C[m]:"")})}function u(p){return p?(f([p]),s.get(p)||""):""}function d(p){return pn(u(p))}function v(p){if(i.has(p))return i.get(p);const k=mn(d(p),t);return i.set(p,k),k}const g=new Map;function b(p){return g.has(p)||g.set(p,{label:p,get css(){return d(p)},get color(){return v(p)}}),g.get(p)}return{design:t,names:e,lower:n,byRoot:c,variants:fn(t),root:l,has:p=>o.has(p),isStatic:p=>r.has(p),themeValue(p){try{return t.resolveThemeValue?.(p)||""}catch{return""}},fill:f,rule:u,css:d,color:v,rows(p){return f(p),p.map(b)},byUtility:{get:p=>o.has(p)?b(p):void 0},resolve(p){return o.has(p)||u(p)?b(p):null}}}function dn(){const t=()=>"";return{design:null,names:[],lower:[],byRoot:new Map,variants:[],root:t,has:()=>!1,isStatic:()=>!1,themeValue:()=>"",fill:()=>{},rule:t,css:t,color:t,rows:()=>[],byUtility:{get:()=>{}},resolve:()=>null}}function fn(t){const e=[];let n=[];try{n=t.getVariants()}catch{n=[]}return n.forEach(o=>{const r=o?.name||"";if(!(!r||an.has(r))){if(o.values?.length){const a=o.hasDash===!1?"":"-";o.values.forEach(s=>e.push(`${r}${a}${s}`));return}o.isArbitrary||e.push(r)}}),e}function pn(t){const e=String(t||"").split(/^@property/m)[0],n=[],o=[];return e.split(`
`).forEach(a=>{const s=a.trim();if(!s.endsWith(";")||s.startsWith("@")||!s.includes(":"))return;const i=s.slice(0,-1).trim();(i.startsWith("--tw-")?o:n).push(i)}),(n.length?n:o).join("; ")}function mn(t,e){const n=String(t||""),o=/(#[0-9a-fA-F]{3,8}\b|(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|color)\([^)]*\))/.exec(n);if(o)return o[1];const r=/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(n)?.[1];if(!r)return"";let a="";try{a=e?.resolveThemeValue?.(r)||""}catch{a=""}return wn(a)}function hn(t){const e=String(t||""),n=e.lastIndexOf(":");return n===-1||e.slice(n).includes("]")?{prefix:"",rest:e}:{prefix:e.slice(0,n+1),rest:e.slice(n+1)}}function gn(t,e){const{prefix:n,rest:o}=hn(t),r=o.toLowerCase(),a=[];n||vn(r,e).forEach(c=>a.push(c));const s=[],i=[];for(let c=0;c<e.names.length;c++){if(!r){if(s.length>=80)break;s.push(e.names[c]);continue}const f=e.lower[c];f.startsWith(r)?s.length<80&&s.push(e.names[c]):i.length<80&&f.includes(r)&&i.push(e.names[c])}const l=[...s,...i].slice(0,80);return e.fill(l),l.forEach((c,f)=>{a.push({label:`${n}${c}`,type:"property",detail:e.css(c),boost:f<s.length?1:0})}),a}function vn(t,e){return(t?e.variants.filter(o=>o.toLowerCase().startsWith(t)):e.variants.slice(0,cn)).slice(0,40).map(o=>({label:`${o}:`,type:"keyword",detail:"variant",boost:2}))}function bn(t){return!!(t.matchBefore(/class\s*=\s*"[^"]*$/i)||t.matchBefore(/class\s*=\s*'[^']*$/i))}function yn(t,e){const n=t.doc.lineAt(e),o=e-n.from,r=xn(n.text,o);if(!r)return null;const a=n.text.slice(r.valueFrom,r.valueTo),s=o-r.valueFrom,i=a.slice(0,s),l=a.slice(s),c=(i.match(/[^\s]*$/)||[""])[0],f=(l.match(/^[^\s]*/)||[""])[0],u=c+f;if(!u||u.includes("{"))return null;const d=n.from+r.valueFrom+(i.length-c.length);return{from:d,to:d+u.length,text:u}}function xn(t,e){const n=/\bclass\s*=\s*(["'])/gi;let o;for(;o=n.exec(t);){const r=o[1],a=o.index+o[0].length,s=t.indexOf(r,a),i=s===-1?t.length:s;if(e>=a&&e<=i)return{valueFrom:a,valueTo:i}}return null}function wn(t){const e=String(t||"").trim();return/^#([0-9a-fA-F]{3,8})$/.test(e)?e:""}function kn(t,e){const n=document.createElement("div");if(n.className="sve-tw-info",e){const r=document.createElement("span");r.className="sve-tw-swatch",r.style.background=e,n.appendChild(r)}const o=document.createElement("pre");return o.textContent=t,n.appendChild(o),n}const h=ze({emptyText:"",tag:"",scope:"",scopeTitle:"",baseLabel:"",groups:[],canEdit:!1,onChip:null,variant:"",breakpoints:[],onBreakpoint:null,state:"",stateLabel:"",onState:null,onTag:null,dropTitle:"",onDrop:null,sortTitle:"",onSort:null,siteClasses:[]});function ue(t,e,n){const o=String(t||"").slice(e,n),r=ae(o),a=/(\sclass\s*=\s*)(["'])/i.exec(r);if(!a)return null;const s=a[2],i=a.index+a[1].length+1,l=r.indexOf(s,i);return l===-1?null:{from:e+i,to:e+l,quote:s,value:o.slice(i,l)}}function $n(t){const e=String(t||""),n=[];let o=0;for(;o<e.length;){if(/\s/.test(e[o])){o+=1;continue}let r=o,a=!1;for(;r<e.length;){if(e.startsWith("{{",r)){const s=e.indexOf("}}",r+2);a=!0,r=s===-1?e.length:s+2;continue}if(/\s/.test(e[r]))break;r+=1}n.push({text:e.slice(o,r),from:o,to:r,dynamic:a}),o=r}return n}function de(t){const e=String(t||""),n=[];let o=0,r=0;for(let s=0;s<e.length;s+=1){const i=e[s];i==="["||i==="("?o+=1:i==="]"||i===")"?o=Math.max(0,o-1):i===":"&&o===0&&(n.push(e.slice(r,s)),r=s+1)}const a=e.slice(r);return{variants:n,base:a}}function fe(t){let n=String(t||""),o="";n.startsWith("!")?(o="pre",n=n.slice(1)):n.endsWith("!")&&(o="post",n=n.slice(0,-1));let r="";const a=Cn(n);return a!==-1&&(r=n.slice(a),n=n.slice(0,a)),{name:n,modifier:r,important:o}}function Cn(t){let e=0;for(let n=0;n<t.length;n+=1){const o=t[n];if(o==="["||o==="(")e+=1;else if(o==="]"||o===")")e=Math.max(0,e-1);else if(o==="/"&&e===0)return n}return-1}function vt({variants:t,name:e,modifier:n,important:o}){let r=`${e}${n||""}`;return o==="pre"?r=`!${r}`:o==="post"&&(r=`${r}!`),[...t||[],r].join(":")}function At(t){const e=$n(t),n=new Map;let o=null,r=0;const a=e.findIndex(i=>i.text==="]");if(e[0]?.text==="["&&a>0){const i=e.slice(1,a);o={from:e[0].from,to:e[a].to,label:`[ ${i.map(l=>l.text).join(" ")} ]`},r=a+1}for(;r<e.length;r+=1){const i=e[r],{variants:l,base:c}=de(i.text),{name:f,modifier:u,important:d}=fe(c),v=l.join(":");n.has(v)||n.set(v,{key:v,variants:l,items:[]}),n.get(v).items.push({raw:i.text,from:i.from,to:i.to,dynamic:i.dynamic,variants:l,name:f,modifier:u,important:d})}const s=[...n.values()];return s.sort((i,l)=>i.key===""?-1:l.key===""?1:0),{scope:o,groups:s}}function st(t,e,n){const o=String(t||"");if(n)return o.slice(0,e.from)+n+o.slice(e.to);let r=e.from,a=e.to;if(r>0&&(o[r-1]===" "||o[r-1]==="	"))for(;r>0&&(o[r-1]===" "||o[r-1]==="	");)r-=1;else for(;a<o.length&&(o[a]===" "||o[a]==="	");)a+=1;return _n(o.slice(0,r)+o.slice(a),r)}function _n(t,e){const n=t.lastIndexOf(`
`,Math.max(0,e-1));if(n===-1)return t;const o=t.indexOf(`
`,n+1);return t.slice(n+1,o===-1?t.length:o).trim()!==""?t:t.slice(0,n)+t.slice(o===-1?t.length:o)}function pe(t,e){const n=String(t||"");return n.trim()?`${n.replace(/\s+$/,"")} ${e}`:e}function me(t,e,n){const o=String(t||"");if(!Array.isArray(e)||e.length!==n?.length)return o;let r=o;for(let a=e.length-1;a>=0;a-=1)r=r.slice(0,e[a].from)+n[a]+r.slice(e[a].to);return r}function he(t,e,n){const o=String(t||""),r=String(n||"").trim().toLowerCase();if(!/^[a-z][a-z0-9-]*$/.test(r)||!e?.tag||r===e.tag.toLowerCase())return o;const a=e.tag.toLowerCase(),s=o.slice(e.from,e.openTo);if(!new RegExp(`^<${a}(?=[\\s/>])`,"i").test(s))return o;let i=o;const l=i.toLowerCase().lastIndexOf(`</${a}`,e.to);return l>e.from&&l<e.to&&(i=i.slice(0,l)+`</${r}`+i.slice(l+2+a.length)),i.slice(0,e.from)+`<${r}`+i.slice(e.from+1+a.length)}function Sn(t,e,n){const o=ue(t,e.from,e.openTo);if(o)return t.slice(0,o.from)+n+t.slice(o.to);const r=String(t).slice(e.from,e.openTo),a=/^<([a-zA-Z][a-zA-Z0-9:-]*)/.exec(r);if(!a||!n)return t;const s=e.from+a[0].length;return`${t.slice(0,s)} class="${n}"${t.slice(s)}`}const ge=2e3;let dt=null;function Tn(t){return dt||(dt=Et(t).then(e=>{const n={catalog:e,groups:new Map,index:{at:0,roots:new Map}};return En(t,n),n})),dt}function En(t,e){const n=t?.requestIdleCallback?r=>t.requestIdleCallback(r,{timeout:500}):r=>(t?.setTimeout||globalThis.setTimeout)(r,0),o=()=>{e.index.at>=e.catalog.names.length||(ve(e,ge),n(o))};n(o)}function ve(t,e){const{at:n}=t.index,o=t.catalog.names.slice(n,n+e);t.index.at=n+o.length,t.catalog.fill(o),o.forEach(r=>{const a=Lt(t.catalog.css(r)),s=t.catalog.root(r);!a||!s||(t.index.roots.has(a)||t.index.roots.set(a,new Set),t.index.roots.get(a).add(s))})}function An(t){for(;t.index.at<t.catalog.names.length;)ve(t,ge)}function Ln(t,e){if(!e?.catalog||!t)return[];An(e);const n=[...e.index.roots.get(t)||[]];if(!n.length)return[];const o=n.filter(a=>!e.catalog.isStatic(a)).sort((a,s)=>a.length-s.length||a.localeCompare(s))[0];return(o?[o,...n.filter(a=>e.catalog.isStatic(a)&&a.startsWith(`${o}-`)).sort()]:n.slice().sort()).flatMap(a=>be(e,a)?.get(t)||[])}function Lt(t){const e=String(t||"");if(e.includes(";"))return"";const n=e.indexOf(":");return n===-1?"":e.slice(0,n).trim()}function be(t,e){if(t.groups.has(e))return t.groups.get(e);const n=t.catalog.byRoot.get(e);if(!n?.length)return t.groups.set(e,null),null;const o=new Map;return t.catalog.rows(n).forEach(r=>{const a=Lt(r.css);a&&(o.has(a)||o.set(a,[]),o.get(a).push(r))}),t.groups.set(e,o),o}function ye(t,e){if(!e?.catalog||!t)return null;const n=e.catalog.root(t);if(!n)return null;const o=be(e,n);if(!o?.size)return null;const r=Lt(e.catalog.css(t)),a=o.get(r)||(o.size===1?[...o.values()][0]:null);return a?.length?{label:r||n,options:a}:null}function xe(t,e){return e?.catalog?.css(t)||""}function Mn(t,e){return e?.catalog?.color(t)||""}const Pn={class:"sve-tw"},Bn={key:0,class:"sve-tw-head"},On=["disabled"],Dn=["title","data-active","disabled","onClick"],zn=["data-active","disabled"],Rn=["title","disabled"],In={key:1,class:"sve-tw-empty"},Fn=["data-sve-tw-base","data-current"],Wn={class:"sve-tw-chips"},qn=["title","onClick"],jn=["title","onClick"],Vn={__name:"TwClassList",setup(t){function e(n){const o={"data-sve-tw-chip":n.id};return n.locked&&(o["data-sve-tw-locked"]=""),n.open&&(o["data-open"]=""),o}return(n,o)=>(S(),T("div",Pn,[L(h).tag?(S(),T("div",Bn,[x("button",{type:"button",class:"sve-tw-tag",disabled:!L(h).canEdit,onClick:o[0]||(o[0]=P(r=>L(h).onTag?.(r),["prevent","stop"]))},"<"+B(L(h).tag)+">",9,On),(S(!0),T(F,null,X(L(h).breakpoints,r=>(S(),T("button",{key:r.index,type:"button","data-sve-tw-bp":"",title:r.title,"data-active":r.active?"":void 0,disabled:!L(h).canEdit,onClick:P(a=>L(h).onBreakpoint?.(r.index),["prevent","stop"])},B(r.label),9,Dn))),128)),x("button",{type:"button","data-sve-tw-state":"","data-active":L(h).state?"":void 0,disabled:!L(h).canEdit,onClick:o[1]||(o[1]=P(r=>L(h).onState?.(r),["prevent","stop"]))},[ht(B(L(h).stateLabel)+" ",1),o[3]||(o[3]=x("svg",{width:"8",height:"8",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"3","stroke-linecap":"round","stroke-linejoin":"round"},[x("path",{d:"m6 9 6 6 6-6"})],-1))],8,zn),x("button",{type:"button","data-sve-tw-sort":"",title:L(h).sortTitle,disabled:!L(h).canEdit,onClick:o[2]||(o[2]=P(r=>L(h).onSort?.(),["prevent","stop"]))},[...o[4]||(o[4]=[x("svg",{width:"12",height:"12",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round"},[x("path",{d:"M2.5 4h9M2.5 8h6M2.5 12h3"}),x("path",{d:"M13 5v7M11.4 10.4 13 12l1.6-1.6"})],-1)])],8,Rn),o[5]||(o[5]=x("span",{class:"sve-tw-gap"},null,-1))])):q("",!0),L(h).groups.length?q("",!0):(S(),T("div",In,B(L(h).emptyText),1)),(S(!0),T(F,null,X(L(h).groups,r=>(S(),T("div",{key:r.key,class:"sve-tw-group"},[x("span",{class:"sve-tw-variant","data-sve-tw-base":r.key===""?"":void 0,"data-current":r.current?"":void 0},B(r.key===""?L(h).baseLabel:r.key),9,Fn),x("div",Wn,[(S(!0),T(F,null,X(r.chips,a=>(S(),T("span",{key:a.id,class:"sve-tw-chip-wrap"},[x("button",Ie({type:"button"},{ref_for:!0},e(a),{title:a.title,onClick:P(s=>L(h).onChip?.(s,a.id),["prevent","stop"])}),[a.color?(S(),T("span",{key:0,class:"sve-tw-dot",style:kt({background:a.color})},null,4)):q("",!0),ht(" "+B(a.raw),1)],16,qn),a.locked?q("",!0):(S(),T("button",{key:0,type:"button",class:"sve-tw-drop",title:L(h).dropTitle,onClick:P(s=>L(h).onDrop?.(a.id),["prevent","stop"])},"−",8,jn))]))),128))])]))),128))]))}},Hn=Re(Vn,[["__scopeId","data-v-761b93dc"]]),Nn={key:0,"data-sve-tw-menu-title":""},Kn={"data-sve-tw-menu-list":""},Zn=["data-active","title","onClick"],Xn={"data-sve-tw-tick":""},Un={"data-sve-tw-label":""},Mt={__name:"TwClassMenu",props:{title:{type:String,default:""},options:{type:Array,default:()=>[]},removeLabel:{type:String,default:""},onPick:{type:Function,required:!0},onRemove:{type:Function,required:!0}},setup(t){return(e,n)=>(S(),T(F,null,[t.title?(S(),T("div",Nn,B(t.title),1)):q("",!0),x("div",Kn,[(S(!0),T(F,null,X(t.options,o=>(S(),T("button",{key:o.label,type:"button","data-sve-tw-option":"","data-active":o.active?"":void 0,title:o.css,onClick:P(r=>t.onPick(o.label),["prevent","stop"])},[x("span",Xn,B(o.active?"✓":""),1),o.color?(S(),T("span",{key:0,"data-sve-tw-dot":"",style:kt({background:o.color})},null,4)):q("",!0),x("span",Un,B(o.label),1)],8,Zn))),128))]),x("button",{type:"button","data-sve-tw-remove":"",onClick:n[0]||(n[0]=P(o=>t.onRemove(),["prevent","stop"]))},[n[1]||(n[1]=x("span",{"data-sve-tw-tick":""},"✕",-1)),ht(B(t.removeLabel),1)])],64))}},Yn={"data-sve-tw-search":""},Gn=["placeholder","aria-label","onKeydown"],Jn={"data-sve-tw-tabs":""},Qn=["data-active"],to=["data-active"],eo={key:0,"data-sve-tw-add-empty":""},no=["data-cursor","data-active","data-sve-tw-off","title","onMouseenter","onClick"],oo={"data-sve-tw-label":""},ro={__name:"TwAddClass",props:{label:{type:String,default:""},placeholder:{type:String,default:""},sitePlaceholder:{type:String,default:""},emptyText:{type:String,default:""},offText:{type:String,default:""},siteLabel:{type:String,default:""},tailwindLabel:{type:String,default:""},search:{type:Function,required:!0},onAdd:{type:Function,required:!0}},setup(t){const e=t,n=R(""),o=R(null),r=R("tailwind"),a=R(null),s=R(-1),i=R(!1),l=H(()=>n.value.trim().toLowerCase()),c=H(()=>(h.siteClasses||[]).flatMap(y=>y.items).filter(y=>!l.value||y.name.toLowerCase().includes(l.value))),f=H(()=>e.search(n.value)),u=H(()=>r.value==="site"?c.value:f.value),d=H(()=>r.value==="site"?e.sitePlaceholder:e.placeholder);ne(()=>gt(()=>o.value?.focus()));function v(y){return y?.name||y?.label||""}function g(y){i.value=!0;const m=u.value.length;if(!m){s.value=-1;return}const $=s.value+y;s.value=$<0?-1:Math.min($,m-1),gt(()=>b())}function b(){const y=a.value?.querySelector("[data-cursor]");if(!y)return;let m=y.parentElement;for(;m&&m.scrollHeight<=m.clientHeight;)m=m.parentElement;if(!m)return;const $=y.offsetTop,D=$+y.offsetHeight;$<m.scrollTop?m.scrollTop=$:D>m.scrollTop+m.clientHeight&&(m.scrollTop=D-m.clientHeight)}function p(y){i.value||(s.value=y)}function k(){s.value=-1}function C(){const y=s.value>=0?u.value[s.value]:null,m=y?v(y):n.value.trim();m&&e.onAdd(m)}return(y,m)=>(S(),T(F,null,[x("div",Yn,[m[7]||(m[7]=x("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[x("circle",{cx:"11",cy:"11",r:"7"}),x("path",{d:"m20 20-3.5-3.5"})],-1)),oe(x("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":m[0]||(m[0]=$=>n.value=$),type:"text",placeholder:d.value,"aria-label":t.label,onInput:k,onKeydown:[m[1]||(m[1]=j(P($=>g(1),["prevent"]),["down"])),m[2]||(m[2]=j(P($=>g(-1),["prevent"]),["up"])),j(P(C,["prevent"]),["enter"]),m[3]||(m[3]=j(P(()=>{},["stop"]),["escape"]))]},null,40,Gn),[[re,n.value]])]),x("div",Jn,[x("button",{type:"button","data-sve-tw-tab":"","data-active":r.value==="tailwind"?"":void 0,onClick:m[4]||(m[4]=P($=>{r.value="tailwind",k()},["prevent","stop"]))},B(t.tailwindLabel),9,Qn),x("button",{type:"button","data-sve-tw-tab":"","data-active":r.value==="site"?"":void 0,onClick:m[5]||(m[5]=P($=>{r.value="site",k()},["prevent","stop"]))},B(t.siteLabel),9,to)]),u.value.length?q("",!0):(S(),T("div",eo,B(t.emptyText),1)),x("div",{ref_key:"rowsEl",ref:a,onMousemove:m[6]||(m[6]=$=>i.value=!1)},[(S(!0),T(F,null,X(u.value,($,D)=>(S(),T("button",{key:$.name||$.label,type:"button","data-sve-tw-option":"","data-cursor":D===s.value?"":void 0,"data-active":D===s.value?"":void 0,"data-sve-tw-off":$.loaded===!1?"":void 0,title:$.loaded===!1?t.offText:$.file||$.css,onMouseenter:lt=>p(D),onClick:P(lt=>t.onAdd($.name||$.label),["prevent","stop"])},[$.color?(S(),T("span",{key:0,"data-sve-tw-dot":"",style:kt({background:$.color})},null,4)):q("",!0),x("span",oo,B($.name||$.label),1)],40,no))),128))],544)],64))}},so={"data-sve-tw-search":""},ao=["placeholder","aria-label","onKeydown"],io=["data-active","onMouseenter","onClick"],lo={"data-sve-tw-tick":""},co={"data-sve-tw-label":""},we={__name:"TwTagMenu",props:{label:{type:String,default:""},placeholder:{type:String,default:""},current:{type:String,default:""},tags:{type:Array,default:()=>[]},onPick:{type:Function,required:!0}},setup(t){const e=t,n=R(""),o=R(null),r=R(-1),a=R(!1),s=H(()=>n.value.trim().toLowerCase()),i=H(()=>{if(!s.value)return e.tags;const f=e.tags.filter(u=>u.includes(s.value));return f.sort((u,d)=>(u.startsWith(s.value)?0:1)-(d.startsWith(s.value)?0:1)),f});ne(()=>gt(()=>o.value?.focus()));function l(f){a.value=!0;const u=i.value.length;r.value=u?Math.min(Math.max(r.value+f,-1),u-1):-1}function c(){const f=r.value>=0?i.value[r.value]:n.value.trim().toLowerCase();f&&e.onPick(f)}return(f,u)=>(S(),T(F,null,[x("div",so,[u[6]||(u[6]=x("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2.4","stroke-linecap":"round","aria-hidden":"true"},[x("circle",{cx:"11",cy:"11",r:"7"}),x("path",{d:"m20 20-3.5-3.5"})],-1)),oe(x("input",{ref_key:"input",ref:o,"data-sve-tw-add-input":"","onUpdate:modelValue":u[0]||(u[0]=d=>n.value=d),type:"text",placeholder:t.placeholder,"aria-label":t.label,onInput:u[1]||(u[1]=d=>r.value=-1),onKeydown:[u[2]||(u[2]=j(P(d=>l(1),["prevent"]),["down"])),u[3]||(u[3]=j(P(d=>l(-1),["prevent"]),["up"])),j(P(c,["prevent"]),["enter"]),u[4]||(u[4]=j(P(()=>{},["stop"]),["escape"]))]},null,40,ao),[[re,n.value]])]),x("div",{onMousemove:u[5]||(u[5]=d=>a.value=!1)},[(S(!0),T(F,null,X(i.value,(d,v)=>(S(),T("button",{key:d,type:"button","data-sve-tw-option":"","data-active":v===r.value||r.value===-1&&d===t.current?"":void 0,onMouseenter:g=>a.value?null:r.value=v,onClick:P(g=>t.onPick(d),["prevent","stop"])},[x("span",lo,B(d===t.current?"✓":""),1),x("span",co,"<"+B(d)+">",1)],40,io))),128))],32)],64))}},A="__sve-tw-menu",Nt="--sve-tw-anchor",uo=typeof CSS<"u"&&CSS.supports?.("anchor-name: --x");let ot=null;const Kt="__sve-tw-style",Pt=[{key:"",all:!0,device:"Responsive",label:"tw_size_all"},{key:"",device:"Laptop",label:"tw_size_laptop",prefix:""},{key:"max-lg",device:"Tablet",label:"responsive_tablet",under:1024},{key:"max-md",device:"Mobile",label:"responsive_mobile",under:768}],Zt=["","dark","hover","focus","active","group-hover","group-focus","before","after"],ke={Mobile:"max-md",Tablet:"max-lg",Laptop:"",Desktop:""},$e=["div","section","article","header","footer","main","aside","nav","h1","h2","h3","h4","h5","h6","p","span","a","button","label","ul","ol","li","figure","figcaption","blockquote","strong","em","small","picture","img","video","form","table","tr","td","th"];let Ce="",U="",it=!1;function fo(){try{return ke[$t(window,"sve-lp-device")]??""}catch{return""}}function Bt(){return it?Ce:fo()}function _e(){return[Bt(),U].filter(Boolean)}function Ot(){return _e().join(":")}const po=/^(max-)?(sm|md|lg|xl|2xl)$/;function mo(t){return String(t||"").split(":").find(e=>po.test(e))||""}function Se(){if(it)return!0;try{return Object.prototype.hasOwnProperty.call(ke,$t(window,"sve-lp-device"))}catch{return!1}}function ho(t){if(!Se())return!0;const e=mo(t);return e===Bt()?!0:!Pt.some(n=>n.key===e)}let _=null,Y=new Map,z=null,ft=!1,at="",bt=null;function Te(t){return t?.querySelector?.('[data-sve-style="tw"] [data-sve-tw-host]')||null}function Ee(t){if(t.getElementById(Kt))return;const e=t.createElement("style");e.id=Kt,e.textContent=`
    #${A} {
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
    #${A} [data-sve-tw-menu-title] {
      padding: 0.1em 0.2em 0.5em;
      opacity: .55;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.6875rem;
    }
    #${A} [data-sve-tw-option],
    #${A} [data-sve-tw-remove] {
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
    #${A} [data-sve-tw-option]:hover,
    #${A} [data-sve-tw-remove]:hover {
      background: rgba(255,255,255,.1);
    }
    #${A} [data-sve-tw-option][data-active] {
      background: rgba(255,255,255,.06);
    }
    #${A} [data-sve-tw-option][data-sve-tw-off] [data-sve-tw-label] {
      opacity: .45;
      text-decoration: line-through;
      text-decoration-thickness: 1px;
    }
    #${A} [data-sve-tw-tick] {
      flex: 0 0 auto;
      width: 0.9em;
      opacity: .7;
      font-family: ui-sans-serif, system-ui, sans-serif;
      line-height: 1;
    }
    #${A} [data-sve-tw-dot] {
      flex: 0 0 auto;
      width: 0.9em;
      height: 0.9em;
      border-radius: 0.18em;
      border: 1px solid rgba(128,128,128,.5);
    }
    #${A} [data-sve-tw-label] {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #${A} [data-sve-tw-remove] {
      margin-top: 0.3rem;
      border-top: 1px solid rgba(255,255,255,.14);
      border-radius: 0 0 0.4em 0.4em;
      padding-top: 0.6em;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    #${A} [data-sve-tw-search] {
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
    #${A} [data-sve-tw-search]:focus-within {
      border-color: rgba(147,197,253,.7);
    }
    #${A} [data-sve-tw-search] svg {
      flex: 0 0 auto;
      opacity: .5;
    }
    #${A} [data-sve-tw-add-input] {
      all: unset;
      flex: 1 1 auto;
      min-width: 0;
      color: inherit;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.75rem;
    }
    #${A} [data-sve-tw-tabs] {
      display: flex;
      gap: 0.2rem;
      margin-bottom: 0.45rem;
      padding: 0.15rem;
      border-radius: 0.45em;
      background: rgba(0,0,0,.28);
    }
    #${A} [data-sve-tw-tab] {
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
    #${A} [data-sve-tw-tab]:hover { opacity: 1; }
    #${A} [data-sve-tw-tab][data-active] {
      opacity: 1;
      background: rgba(255,255,255,.14);
    }
    #${A} [data-sve-tw-add-empty] {
      padding: 0.4em 0.5em;
      opacity: .55;
    }
  `,t.head.appendChild(e)}function Ae(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e.contentDocument;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o.contentDocument}catch{}return null}const Xt="__sve-tw-live";function go(t){const e=new Set,n=[];for(const[,o]of String(t).matchAll(/var\(\s*(--[A-Za-z0-9_-]+)/g)){if(e.has(o)||o.startsWith("--tw-"))continue;e.add(o);const r=z?.catalog?.themeValue(o);r&&n.push(`    ${o}: ${r};`)}return n.length?`@layer theme {
  :root, :host {
${n.join(`
`)}
  }
}
`:""}function vo(t,e){const n=e?z?.catalog?.rule(e):"";if(!n)return;let o=t.getElementById(Xt);o||(o=t.createElement("style"),o.id=Xt,o.textContent=`@layer theme, base, components, utilities;
`,t.head.appendChild(o));const[r,...a]=String(n).split(/^(?=@property)/m),s=`${go(n)}@layer utilities {
${r}}
${a.join("")}`;o.textContent.includes(s)||(o.textContent+=s)}function bo(t,e,n){const o=Ae(t);if(!(!o||!_?.path)){vo(o,n);for(const r of o.querySelectorAll(`[${Ve}="${_.path}"]`))try{e&&r.classList.remove(e),n&&r.classList.add(n)}catch{}}}const pt=new Map,yo=/(^|-)color$|^fill$|^stroke$/;function Dt(t){const e=String(t||""),n=e.slice(0,e.indexOf(":")).trim();return yo.test(n)&&/var\(\s*(--[A-Za-z0-9_-]+)\s*\)/.exec(e)?.[1]||""}function Le(t,e){if(!e)return"";if(pt.has(e))return pt.get(e);const n=Ae(t),o=n?.documentElement,r=n?.defaultView;if(!o||!r)return"";let a="",s=e;for(let i=0;i<6&&s;i+=1){try{a=r.getComputedStyle(o).getPropertyValue(s).trim()}catch{return""}if(!a)return"";if(s=Dt(a),!s)break}return a&&!a.startsWith("var(")?(pt.set(e,a),a):""}function xo(t,e){return Mn(e,z)||Le(t,Dt(xe(e,z)))}function O(t){const e=t?.document.getElementById(A);ot&&(ot.style.removeProperty("anchor-name"),ot=null),bt?.(),bt=null,at="",e&&(e._sveApp?.unmount(),e.remove())}function Ut(t,e,n){const o=e.getBoundingClientRect(),r=n.offsetWidth||176,a=8,s=140,i=e.closest?.("#__sve-tw-strip")?Ro(t):null,l=i?i.top:0,c=i?i.bottom:t.innerHeight,f=i?i.left:0,u=i?i.right:t.innerWidth,d=o.bottom+4,v=c-d-a,g=Math.max(s,Math.min(v,420));n.style.left=`${Math.max(f+a,Math.min(o.left,u-r-a))}px`,n.style.maxHeight=`${g}px`,n.style.top=`${v>=s?d:Math.max(l+a,c-a-g)}px`}function J(t,e,n,o){const r=t.document;O(t),Ee(r);const a=r.createElement("div");a.id=A,r.body.appendChild(a),a._sveApp=Fe(n,a,o);const s=uo&&!!e.closest?.("#__sve-tw-strip");s?(ot=e,e.style.setProperty("anchor-name",Nt),a.style.setProperty("position","absolute"),a.style.setProperty("position-anchor",Nt),a.style.setProperty("position-area","block-end span-inline-start"),a.style.setProperty("position-try-fallbacks","flip-block, flip-inline, flip-block flip-inline"),a.style.setProperty("margin","4px 0 0 0"),a.style.setProperty("max-height","20rem")):Ut(t,e,a);const i=()=>{s||Ut(t,e,a)},l=f=>{!a.contains(f.target)&&!e.contains(f.target)&&(O(t),nt())},c=f=>{f.key==="Escape"&&(O(t),nt())};return r.addEventListener("pointerdown",l,!0),r.addEventListener("keydown",c,!0),t.addEventListener("scroll",i,!0),t.addEventListener("resize",i),bt=()=>{r.removeEventListener("pointerdown",l,!0),r.removeEventListener("keydown",c,!0),t.removeEventListener("scroll",i,!0),t.removeEventListener("resize",i)},a}function Me(t,e,n){return(e||[]).map(o=>({label:o.label,css:o.css,color:o.color||Le(t,Dt(o.css)),active:o.label===n}))}function N(){return!_||W("dock:is-locked")===!0}function K(){const t=W("dock:html");if(!_||typeof t!="string"||t[_.from]!=="<")return null;const e=ue(t,_.from,_.openTo);return{html:t,value:e?e.value:""}}function wo(t){if(!_?.path)return;const n=Tt(St(t),new Set).find(o=>o.path===_.path);n&&(_={from:n.from,openTo:n.openTo,path:n.path,tag:n.tag})}function V(t,e,n,o,r){const a=Sn(e,_,n);a!==e&&(bo(t,o,r),W("dock:set-html",a),wo(a),I(t))}const Yt=["display","position","inset","top","right","bottom","left","z-index","flex-direction","flex-wrap","justify-content","align-items","gap","column-gap","row-gap","margin","margin-inline","margin-block","margin-top","margin-right","margin-bottom","margin-left","padding","padding-inline","padding-block","padding-top","padding-right","padding-bottom","padding-left","width","min-width","max-width","height","min-height","max-height","font-family","font-size","font-weight","line-height","text-align","text-transform","text-decoration-line","font-style","color","background-color","border-color","border-radius","fill","stroke","outline-color","overflow"];function Gt(t){const e=G(t);if(!e)return-1;const n=Yt.indexOf(e);return n===-1?Yt.length:n}function ko(t){if(N())return;const e=K();if(!e)return;const n=At(e.value),o=n.groups.flatMap(l=>l.items).filter(l=>!l.dynamic);if(o.length<2)return;const r=new Map;n.groups.forEach((l,c)=>r.set(l.key,l.key===""?-1:c));const a=[...o].sort((l,c)=>{const f=r.get(l.variants.join(":"))??0,u=r.get(c.variants.join(":"))??0;return f-u||Gt(l.name)-Gt(c.name)||l.name.localeCompare(c.name)}),s=[...o].sort((l,c)=>l.from-c.from).map(l=>({from:l.from,to:l.to})),i=me(e.value,s,a.map(l=>l.raw));i!==e.value&&V(t,e.html,i,"","")}function G(t){return ye(t,z)?.label||""}function yt(t){return At(t).groups.flatMap(e=>e.items)}function Pe(t){const e=Ot();return yt(t).filter(n=>!n.dynamic&&n.variants.join(":")===e)}function Jt(t,e){if(N()||!e)return;const n=K();if(!n)return;const o=G(e),r=Pe(n.value).find(s=>s.name===e||o&&G(s.name)===o);if(r?.name===e){V(t,n.html,st(n.value,r,""),e,"");return}if(r){const s=vt({variants:r.variants,name:e,modifier:r.modifier,important:r.important});V(t,n.html,st(n.value,r,s),r.raw,s);return}const a=vt({variants:_e(),name:e,modifier:"",important:""});V(t,n.html,pe(n.value,a),"",a)}function $o(t,e){const n=String(e||"").trim(),o=Ot(),r=o&&!n.includes(":")?`${o}:${n}`:n;if(N()||!n)return;const a=K();if(!a||yt(a.value).some(d=>d.raw===r))return;const{variants:i,base:l}=de(r),c=G(fe(l).name),f=i.join(":"),u=c?yt(a.value).find(d=>!d.dynamic&&d.variants.join(":")===f&&G(d.name)===c):null;if(u){V(t,a.html,st(a.value,u,r),u.raw,r);return}V(t,a.html,pe(a.value,r),"",r.includes(":")?"":r)}function xt(t,e,n){if(N())return;const o=K();if(!o||o.value.slice(e.from,e.to)!==e.raw){I(t);return}const r=n?vt({variants:e.variants,name:n,modifier:e.modifier,important:e.important}):"";V(t,o.html,st(o.value,e,r),e.raw,r)}function Co(t,e){if(N()||!_)return;const n=W("dock:html");if(typeof n!="string"||n[_.from]!=="<")return;const o=he(n,_,e);if(o===n)return;const r=_.from;W("dock:set-html",o);const s=Tt(St(o),new Set).find(i=>i.from===r);s&&(_={from:s.from,openTo:s.openTo,path:s.path,tag:s.tag}),I(t),et("tw:changed")}function Uo(t,e,n){n?.tag&&J(t,e,we,{label:E(t,"tw_tag"),placeholder:E(t,"tw_tag_placeholder"),current:String(n.tag).toLowerCase(),tags:$e,onPick:o=>{_o(t,n,o),O(t)}})}function _o(t,e,n){if(W("dock:is-locked")===!0)return;const o=W("dock:html");if(typeof o!="string"||o[e.from]!=="<")return;const r=he(o,e,n);r!==o&&W("dock:set-html",r)}function So(t,e){J(t,e,we,{label:E(t,"tw_tag"),placeholder:E(t,"tw_tag_placeholder"),current:(_?.tag||"").toLowerCase(),tags:$e,onPick:n=>{Co(t,n),O(t)}})}function To(t,e){if(N())return;const n=K();if(!n)return;const o=e.map(s=>Y.get(s)).filter(Boolean);if(o.length<2)return;const r=[...o].sort((s,i)=>s.from-i.from).map(s=>({from:s.from,to:s.to})),a=me(n.value,r,o.map(s=>s.raw));a!==n.value&&V(t,n.html,a,"","")}function Yo(t){Rt(t,_?.path||"")}function Go(){return!!_}function Eo(t,e){const n=Pt[e];n&&(W("lp:set-device",{win:t,key:n.device}),it=!n.all,Ce=n.key,O(t),I(t),et("tw:changed"))}function Ao(t,e){J(t,e,Mt,{title:E(t,"tw_state"),removeLabel:E(t,"tw_state_none"),options:Zt.filter(Boolean).map(n=>({label:n,css:"",color:null,active:n===U})),onPick:n=>{U=Zt.includes(n)?n:"",O(t),I(t),et("tw:changed")},onRemove:()=>{U="",O(t),I(t),et("tw:changed")}})}qe("lp:device",()=>{it=!1,Te(window.document)&&I(window)});function Lo(t){const e=t?K():null;return e&&Pe(e.value).find(n=>G(n.name)===t)?.name||""}function Jo(t,e,n,o){const r=Ln(n,z);if(!r.length)return;const a=Lo(n);J(t,e,Mt,{title:n,removeLabel:E(t,"tw_classes_remove"),options:Me(t,r,a),onPick:s=>{Jt(t,s),O(t),o?.(s)},onRemove:()=>{a&&Jt(t,a),O(t),o?.("")}})}let Qt=[],mt=!1;function Mo(t){mt||(mt=!0,t.fetch("/!/sve/site-css/classes",{credentials:"same-origin",headers:{"X-Requested-With":"XMLHttpRequest"}}).then(e=>e.ok?e.json():{groups:[]}).then(e=>{Qt=Array.isArray(e?.groups)?e.groups:[],h.siteClasses=Qt}).catch(()=>{mt=!1}))}function Po(t,e){Mo(t),J(t,e,ro,{label:E(t,"tw_add_class"),placeholder:E(t,"tw_add_placeholder"),emptyText:E(t,"tw_add_empty"),offText:E(t,"tw_class_not_imported"),sitePlaceholder:E(t,"tw_add_placeholder_site"),siteLabel:E(t,"tw_add_site"),tailwindLabel:E(t,"tw_add_tailwind"),search:n=>{const o=String(n||"").trim(),r=o.toLowerCase();if(!r||!z)return[];const a=z.catalog,s=[],i=[];for(let c=0;c<a.names.length;c++){const f=a.lower[c];f.startsWith(r)?s.length<40&&s.push(a.names[c]):i.length<40&&f.includes(r)&&i.push(a.names[c])}s.sort((c,f)=>c.length-f.length);const l=[...s,...i].slice(0,40);return!l.includes(o)&&a.resolve(o)&&l.unshift(o),a.rows(l).map(c=>({label:c.label,css:c.css,color:c.color,active:!1}))},onAdd:n=>{$o(t,n)}})}function Bo(t,e,n){const o=Y.get(n);if(!o||o.locked)return;if(at===n){O(t),nt();return}const r=ye(o.name,z);J(t,e.currentTarget,Mt,{title:r?.label||"",removeLabel:E(t,"tw_classes_remove"),options:Me(t,r?.options,o.name),onPick:a=>{xt(t,o,a),O(t)},onRemove:()=>{xt(t,o,""),O(t)}}),at=n,nt()}function nt(){for(const t of h.groups)for(const e of t.chips)e.open=e.id===at}function Qo(t,e){if(!e||e.from==null||e.openTo==null){_=null,Y=new Map,O(t),I(t);return}_={from:e.from,openTo:e.openTo,path:e.path,tag:e.tag},I(t)}function I(t){Oo(t);const e=_?K():null,n=e?At(e.value):{scope:null,groups:[]};Y=new Map,h.baseLabel=E(t,"tw_size_base"),h.scopeTitle=E(t,"tw_classes_scope"),h.dropTitle=E(t,"tw_classes_remove"),h.variant=Ot(),h.onBreakpoint=s=>Eo(t,s),h.onState=s=>Ao(t,s.currentTarget);const o=Se();h.breakpoints=Pt.map((s,i)=>({index:i,label:E(t,s.label),title:s.under?`${s.key}:  ·  < ${s.under}px`:E(t,s.all?"tw_size_all_title":"tw_size_base_title"),active:s.all?!o:o&&s.key===Bt()})),h.state=U,h.stateLabel=U||E(t,"tw_state"),h.canEdit=!N(),h.onChip=(s,i)=>Bo(t,s,i),h.onTag=s=>So(t,s.currentTarget),h.sortTitle=E(t,"tw_sort"),h.onSort=()=>ko(t),h.onDrop=s=>{const i=Y.get(s);i&&!i.locked&&(O(t),xt(t,i,""))},h.tag=_?.tag||"";const r=n.scope?.label||"";h.scope=/^\[\s*\]$/.test(r)?"":r,h.emptyText=E(t,_?n.groups.length?"tw_classes_none_size":"tw_classes_none":"tw_classes_pick"),h.groups=n.groups.filter(s=>ho(s.key)).map(s=>({key:s.key,current:s.key===h.variant,chips:s.items.map((i,l)=>{const c={...i,id:`${s.key}-${l}-${i.from}`,locked:i.dynamic||!h.canEdit,open:!1,color:i.dynamic?"":xo(t,i.name),title:i.dynamic?E(t,"tw_classes_dynamic"):xe(i.name,z)||i.raw};return Y.set(c.id,c),c})}));const a=Te(t.document);a&&(Ee(t.document),We(a,Hn)),nt(),Rt(t,_?.path||""),et("tw:changed")}function Oo(t){z||ft||(ft=!0,Tn(t).then(e=>{z=e,I(t)}).catch(()=>{ft=!1}))}const Be="sve-tw-strip";function Do(t){try{return $t(t,Be)!=="0"}catch{return!0}}function tr(t,e){je(t,Be,e?"1":"0"),e||wt(t)}const w="__sve-tw-strip",te="__sve-tw-strip-style";let ee=null,tt=null;function zt(t){const e=t.document.getElementById("live-preview-iframe");if(e)return e;for(const n of t.document.querySelectorAll("iframe"))try{const o=n.contentDocument?.getElementById("live-preview-iframe");if(o)return o}catch{}return null}function zo(t){if(t.getElementById(te))return;const e=t.createElement("style");e.id=te,e.textContent=`
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
  `,t.head.appendChild(e)}function Ro(t){const e=zt(t);return e?e.getBoundingClientRect():null}let M=null;function Io(t,e,n,o){if(e.button!==0||e.target?.closest?.("[data-drop]"))return;M={wrap:n,scroll:o,strip:t.document.getElementById(w),x:e.clientX,moved:!1,ghost:null};const r=s=>{if(!M||!M.moved&&Math.abs(s.clientX-M.x)<4)return;if(!M.moved){M.moved=!0,M.wrap.setAttribute("data-dragging",""),M.strip?.setAttribute("data-dragging","");const c=M.wrap.querySelector("button")?.cloneNode(!0);c&&(c.id=`${w}-ghost`,c.querySelector("[data-drop]")?.remove(),t.document.body.appendChild(c),M.ghost=c)}s.preventDefault(),M.ghost&&(M.ghost.style.left=`${s.clientX}px`,M.ghost.style.top=`${s.clientY}px`);const i=t.document.elementFromPoint(s.clientX,s.clientY)?.closest?.("[data-chip-wrap]");if(!i||i===M.wrap||i.parentElement!==M.scroll)return;const l=i.getBoundingClientRect();s.clientX<l.left+l.width/2?M.scroll.insertBefore(M.wrap,i):M.scroll.insertBefore(M.wrap,i.nextSibling)},a=()=>{t.document.removeEventListener("pointermove",r,!0),t.document.removeEventListener("pointerup",a,!0),t.document.removeEventListener("pointercancel",a,!0);const s=M;if(M=null,s?.ghost?.remove(),!s?.moved)return;s.wrap.removeAttribute("data-dragging"),s.strip?.removeAttribute("data-dragging");const i=l=>{l.preventDefault(),l.stopPropagation()};t.addEventListener("click",i,!0),t.setTimeout(()=>t.removeEventListener("click",i,!0),0),To(t,[...s.scroll.querySelectorAll("[data-chip-wrap]")].map(l=>l.dataset.chip))};t.document.addEventListener("pointermove",r,!0),t.document.addEventListener("pointerup",a,!0),t.document.addEventListener("pointercancel",a,!0)}function wt(t){t?.document.getElementById(w)?.remove()}function Fo(t){const e=()=>Wo(t);ee!==t&&(ee=t,t.addEventListener("resize",e),t.addEventListener("scroll",e,!0));const n=zt(t)?.contentWindow;if(n&&!n._sveStripBound)try{n._sveStripBound=!0,n.addEventListener("scroll",e,!0),n.addEventListener("resize",e),n.addEventListener("statamic:preview-updated",()=>{t.setTimeout(()=>Rt(t,tt?.path||""),60)})}catch{}}function Wo(t){const e=t?.document.getElementById(w);!e||!tt?.el?.isConnected||Oe(t,e,tt.frame,tt.el)}function Rt(t,e){if(!t||!Do(t)){wt(t);return}const n=t.document,o=zt(t),r=o?.contentDocument,a=e&&r?r.querySelector(`[data-sve-ht-path="${e}"]`):null;if(!a||!h.tag){wt(t);return}zo(n),Fo(t);let s=n.getElementById(w);s||(s=n.createElement("div"),s.id=w,n.body.appendChild(s));let i=s.querySelector('[data-group="tag"]');if(!i){i=n.createElement("div"),i.setAttribute("data-group","tag");const u=n.createElement("span");u.setAttribute("data-sve-tw-strip-tag",""),i.appendChild(u),s.appendChild(i)}i.firstChild.textContent=`<${h.tag}>`;let l=s.querySelector('[data-group="classes"]'),c=l?.querySelector("[data-scroll]");const f=h.groups.flatMap(u=>u.chips);if(f.length&&!l){l=n.createElement("div"),l.setAttribute("data-group","classes"),c=n.createElement("div"),c.setAttribute("data-scroll","");const u=n.createElement("span");u.setAttribute("data-fade",""),l.appendChild(c),l.appendChild(u);const d=()=>{c.scrollWidth-c.scrollLeft-c.clientWidth>2?l.setAttribute("data-overflow",""):l.removeAttribute("data-overflow")};c.addEventListener("scroll",d),l._sveSync=d,s.insertBefore(l,s.querySelector('[data-group="add"]'))}if(!f.length)l?.remove();else if(c){c.replaceChildren();for(const u of f){const d=n.createElement("button");if(d.type="button",d.title=u.title||"",u.locked&&d.setAttribute("data-locked",""),u.color){const g=n.createElement("span");g.setAttribute("data-dot",""),g.style.background=u.color,d.appendChild(g)}d.appendChild(n.createTextNode(u.raw));const v=n.createElement("span");if(v.setAttribute("data-chip-wrap",""),v.dataset.chip=u.id,v.appendChild(d),u.locked||v.addEventListener("pointerdown",g=>Io(t,g,v,c)),!u.locked){const g=n.createElement("button");g.type="button",g.setAttribute("data-drop",""),g.title=h.dropTitle||"",g.textContent="−",g.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation(),h.onDrop?.(u.id)}),v.appendChild(g),d.addEventListener("click",b=>{b.preventDefault(),b.stopPropagation(),h.onChip?.(b,u.id)})}c.appendChild(v)}t.requestAnimationFrame(()=>l._sveSync?.())}if(!s.querySelector('[data-group="add"]')){const u=n.createElement("div");u.setAttribute("data-group","add");const d=n.createElement("button");d.type="button",d.setAttribute("data-add","");const v=n.createElement("span");v.setAttribute("data-plus",""),v.textContent="+",d.appendChild(v),d.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),Po(t,g.currentTarget)}),u.appendChild(d),s.appendChild(u)}tt={frame:o,el:a,path:e},Oe(t,s,o,a)}function Oe(t,e,n,o){const r=n.getBoundingClientRect(),a=n.clientWidth?r.width/n.clientWidth:1,s=o.getBoundingClientRect(),i=e.getBoundingClientRect(),l=6,c=16,f=r.left+s.left*a,u=r.top+s.top*a-i.height-l,d=r.top+s.top*a+l,v=Math.max(l,r.left+c),g=Math.max(v,Math.min(r.right,t.innerWidth)-i.width-c);e.style.left=`${Math.max(v,Math.min(f,g))}px`,e.style.top=`${Math.max(r.top+c,u<r.top+c?d:u)}px`;const b=n.clientHeight||r.height;e.hidden=s.bottom<=0||s.top>=b}export{rt as P,Uo as a,St as b,O as c,Ct as d,Z as e,Tt as f,Do as g,Ho as h,Ko as i,Yo as j,Zo as k,Xo as l,Vo as m,Lo as n,Jo as o,No as p,Po as q,Qo as r,tr as s,ce as t,Jt as u,Go as v};
