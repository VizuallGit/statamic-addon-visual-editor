import{_ as ie,o as f,c as p,a as k,t as b,b as je,r as ke,m as U,u as d,d as _,F as O,e as N,w as z,f as h,K as Ae,L as ze,n as be,I as Te,j as v,i as A,M as g,l as Ue,x as le,s as x,h as Ne,B as we,R as qe,C as Ve,N as We,E as Ye,G as Ke,O as Xe}from"./addon-CbXvvW5-.js";import{i as _e,m as Ge,l as Je,B as Ze,C as Qe,p as et,f as tt}from"./tailwind-complete-CSJ8XaZ4.js";import{H as nt,a as ot}from"./html-pick-align-gkRPeJkt.js";const rt={class:"sve-html-tree"},st={class:"sve-pane-bar","data-sve-pane-bar":""},it={"data-sve-right-title":""},lt={__name:"HtmlTreePane",props:{title:{type:String,default:""}},setup(e){return(t,o)=>(f(),p("div",rt,[k("div",st,[k("div",it,b(e.title),1),o[0]||(o[0]=je('<div data-sve-right-actions data-v-52956467><button type="button" data-sve-right-pin aria-pressed="false" data-v-52956467></button><button type="button" data-sve-close aria-label="Close" data-v-52956467><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" data-v-52956467><path d="M18 6 6 18" data-v-52956467></path><path d="m6 6 12 12" data-v-52956467></path></svg></button></div>',1))]),o[1]||(o[1]=k("div",{"data-sve-html-tree-list":""},null,-1)),o[2]||(o[2]=k("div",{"data-sve-tw-classes":""},null,-1))]))}},Ce=ie(lt,[["__scopeId","data-v-52956467"]]),l=ke({emptyText:"",rows:[],editingId:null,draft:"",renameTitle:"",hideTitle:"",showTitle:"",duplicateTitle:"",deleteTitle:"",canEdit:!1,dragging:!1,dropId:null,dropPlace:null,onSelect:null,onTwist:null,onRename:null,onRenameCommit:null,onRenameCancel:null,onHide:null,onDuplicate:null,onDelete:null,onPointerDown:null}),at={key:0,class:"sve-ht-empty"},ct=["title","onClick","onDblclick","onKeydown","onPointerdown"],dt=["onClick"],ut={key:1,"data-sve-ht-letter":""},ft=["innerHTML"],pt=["title"],ht={"data-sve-ht-tag":""},mt={key:1,"data-sve-ht-name":""},vt={key:3,"data-sve-ht-actions":""},gt=["title","innerHTML","onClick"],yt=["title","onClick"],xt=["title","onClick"],kt='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',bt='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',Tt='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c6 0 10 7 10 7a17.6 17.6 0 0 1-3.1 3.9"/><path d="M6.1 6.1A17.6 17.6 0 0 0 2 12s4 7 10 7a10.8 10.8 0 0 0 3.1-.5"/></svg>',wt='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',_t='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>',Ct={__name:"HtmlTreeList",setup(e){function t(r){return r.name?`${r.tag} ${r.name}`:r.tag}function o(r){const s={"data-sve-ht-id":r.id};return r.current&&(s["data-sve-ht-current"]=""),r.hidden&&(s["data-sve-ht-hidden"]=""),l.dropId===r.id&&l.dropPlace&&(s["data-sve-ht-drop"]=l.dropPlace),s}function n(r){return!r.hidden||r.wrapFrom!=null}return(r,s)=>(f(),p("div",U({class:"sve-ht-root"},d(l).dragging?{"data-sve-ht-dragging":""}:{}),[d(l).rows.length?_("",!0):(f(),p("div",at,b(d(l).emptyText),1)),(f(!0),p(O,null,N(d(l).rows,i=>(f(),p("div",U({key:i.id,"data-sve-ht-row":""},{ref_for:!0},o(i),{role:"button",tabindex:"0",title:t(i),style:{marginLeft:i.depth*12+"px"},onClick:a=>d(l).onSelect?.(i.id),onDblclick:h(a=>d(l).onRename?.(i.id),["prevent"]),onKeydown:[z(h(a=>d(l).onSelect?.(i.id),["prevent"]),["enter"]),z(h(a=>d(l).onSelect?.(i.id),["prevent"]),["space"])],onPointerdown:a=>d(l).onPointerDown?.(a,i.id)}),[i.hasChildren?(f(),p("button",U({key:0,type:"button","data-sve-ht-twist":""},{ref_for:!0},i.shut?{"data-sve-ht-shut":""}:{},{innerHTML:kt,onClick:h(a=>d(l).onTwist?.(i.id),["stop","prevent"]),onPointerdown:s[0]||(s[0]=h(()=>{},["stop"])),onDblclick:s[1]||(s[1]=h(()=>{},["stop"]))}),null,16,dt)):_("",!0),i.letter?(f(),p("span",ut,b(i.letter),1)):(f(),p("span",{key:2,"data-sve-ht-icon":"",innerHTML:i.svg},null,8,ft)),k("span",{"data-sve-ht-text":"",title:d(l).renameTitle},[k("span",ht,b(i.tag),1),d(l).editingId===i.id?Ae((f(),p("input",{key:0,"data-sve-ht-rename":"","onUpdate:modelValue":s[2]||(s[2]=a=>d(l).draft=a),onMousedown:s[3]||(s[3]=h(()=>{},["stop"])),onPointerdown:s[4]||(s[4]=h(()=>{},["stop"])),onClick:s[5]||(s[5]=h(()=>{},["stop"])),onDblclick:s[6]||(s[6]=h(()=>{},["stop"])),onKeydown:[s[7]||(s[7]=h(()=>{},["stop"])),s[8]||(s[8]=z(h(a=>d(l).onRenameCommit?.(),["prevent"]),["enter"])),s[9]||(s[9]=z(h(a=>d(l).onRenameCancel?.(),["prevent"]),["escape"]))],onBlur:s[10]||(s[10]=a=>d(l).onRenameCommit?.())},null,544)),[[ze,d(l).draft]]):(f(),p("span",mt,b(i.name),1))],8,pt),d(l).canEdit?(f(),p("span",vt,[d(l).canEdit&&n(i)?(f(),p("button",{key:0,type:"button","data-sve-ht-eye":"",title:i.hidden?d(l).showTitle:d(l).hideTitle,innerHTML:i.hidden?Tt:bt,onClick:h(a=>d(l).onHide?.(i.id),["stop","prevent"]),onPointerdown:s[11]||(s[11]=h(()=>{},["stop"])),onDblclick:s[12]||(s[12]=h(()=>{},["stop"]))},null,40,gt)):_("",!0),d(l).canEdit?(f(),p("button",{key:1,type:"button","data-sve-ht-dup":"",title:d(l).duplicateTitle,innerHTML:wt,onClick:h(a=>d(l).onDuplicate?.(i.id),["stop","prevent"]),onPointerdown:s[13]||(s[13]=h(()=>{},["stop"])),onDblclick:s[14]||(s[14]=h(()=>{},["stop"]))},null,40,yt)):_("",!0),d(l).canEdit?(f(),p("button",{key:2,type:"button","data-sve-ht-del":"",title:d(l).deleteTitle,innerHTML:_t,onClick:h(a=>d(l).onDelete?.(i.id),["stop","prevent"]),onPointerdown:s[15]||(s[15]=h(()=>{},["stop"])),onDblclick:s[16]||(s[16]=h(()=>{},["stop"]))},null,40,xt)):_("",!0)])):_("",!0)],16,ct))),128))],16))}},Ht=ie(Ct,[["__scopeId","data-v-a292d01e"]]);function ne(e,t){for(const o of e||[]){if(o.id===t)return o;const n=ne(o.children,t);if(n)return n}return null}function He(e,t){return(e.children||[]).some(o=>o.id===t||He(o,t))}function D(e,t){let o=t.wrapFrom??t.from,n=t.wrapTo??t.to;return o>0&&e[o-1]===`
`&&(o-=1),{from:o,to:n}}function Et(e,t){const o=e.slice(t.from,t.to),n=`</${t.tag}`,r=o.toLowerCase().lastIndexOf(n);return r===-1?t.to:t.from+r}function Q(e,t,o){return e>=t+o?e-o:e>t?t:e}function Pt(e,t,o,n,r){const s=ne(t,o),i=ne(t,n);if(!e||!s||!i||o===n||He(s,n))return e;let a=r;a==="inside"&&(_e(i.tag)||i.wrapFrom!=null)&&(a="after");const u=D(e,s),c=e.slice(u.from,u.to);if(!c)return e;const y=e.slice(0,u.from)+e.slice(u.to),I=u.to-u.from;let C;a==="before"?C=Q(D(e,i).from,u.from,I):a==="inside"?C=Q(Et(e,i),u.from,I):C=Q(D(e,i).to,u.from,I),C=Math.max(0,Math.min(C,y.length));let H=c;return C>0&&y[C-1]!==`
`&&H[0]!==`
`&&(H=`
${H}`),y.slice(0,C)+H+y.slice(C)}function $t(e,t){if(!e||!t)return e;if(t.wrapFrom!=null&&t.wrapTo!=null){const o=e.slice(t.wrapFrom+4,t.wrapTo-3);return e.slice(0,t.wrapFrom)+o+e.slice(t.wrapTo)}return t.hidden?e:`${e.slice(0,t.from)}<!--${e.slice(t.from,t.to)}-->${e.slice(t.to)}`}function Mt(e,t,o){const n=e/Math.max(t,1);return o&&n>.32&&n<.68?"inside":n<.5?"before":"after"}function Lt(e,t){if(!e||!t)return e;const{from:o,to:n}=D(e,t);let r=e.slice(o,n);return r?(r.startsWith(`
`)||(r=`
${r}`),e.slice(0,n)+r+e.slice(n)):e}function It(e,t){if(!e||!t)return e;const{from:o,to:n}=D(e,t);return e.slice(0,o)+e.slice(n)}const Ee="sve-html-tree-labels";function Pe(){try{const e=globalThis.localStorage?.getItem(Ee);if(!e)return{};const t=JSON.parse(e);return t&&typeof t=="object"?t:{}}catch{return{}}}function St(e){try{globalThis.localStorage?.setItem(Ee,JSON.stringify(e))}catch{}}function $e(e){return String(e||"_")}function Dt(e){const t=Pe()[$e(e)];return t&&typeof t=="object"?{...t}:{}}function Rt(e,t,o){const n=o?.[t];return typeof n=="string"&&n.trim()?n.replace(/\s+/g," ").trim():String(e||"").trim()}function Bt(e,t,o,n){if(!t)return;const r=$e(e),s=Pe(),i={...s[r]||{}},a=String(o||"").replace(/\s+/g," ").trim(),u=String(n||"").trim();!a||a===u?delete i[t]:i[t]=a,Object.keys(i).length?s[r]=i:delete s[r],St(s)}const M={div:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="3.5" width="11" height="9" rx="1.2"/></svg>',section:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="1.2"/><path d="M2 6.5h12"/></svg>',ul:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="4" r="1"/><circle cx="3.2" cy="8" r="1"/><circle cx="3.2" cy="12" r="1"/><rect x="5.5" y="3.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="7.2" width="8" height="1.5" rx=".4"/><rect x="5.5" y="11.2" width="8" height="1.5" rx=".4"/></svg>',li:'<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3.2" cy="8" r="1.1"/><rect x="5.5" y="7.2" width="8" height="1.6" rx=".4"/></svg>',a:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.2 8.8 4.8 10.2a2.2 2.2 0 0 0 3.1 3.1l1.8-1.8"/><path d="M9.8 7.2l1.4-1.4a2.2 2.2 0 0 0-3.1-3.1L6.3 4.5"/></svg>',img:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.2"/><circle cx="5.5" cy="6.2" r="1.1"/><path d="M2.8 12.2 6.2 9l2.2 2.2 2-1.8 2.8 2.8"/></svg>',other:'<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 3.5 2.8 8l2.4 4.5"/><path d="M10.8 3.5 13.2 8l-2.4 4.5"/></svg>'};function Ot(e){return/^h[1-6]$/.test(e)?{letter:"H"}:e==="p"?{letter:"P"}:e==="div"?{svg:M.div}:e==="section"||e==="article"||e==="header"||e==="footer"||e==="main"||e==="nav"||e==="aside"?{svg:M.section}:e==="ul"||e==="ol"?{svg:M.ul}:e==="li"?{svg:M.li}:e==="a"?{svg:M.a}:e==="img"||e==="picture"||e==="svg"?{svg:M.img}:{svg:M.other}}function ae(e,t,o){const n=String(e||"").slice(t,o),r=Ge(n),s=/(\sclass\s*=\s*)(["'])/i.exec(r);if(!s)return null;const i=s[2],a=s.index+s[1].length+1,u=r.indexOf(i,a);return u===-1?null:{from:t+a,to:t+u,quote:i,value:n.slice(a,u)}}function Ft(e){const t=String(e||""),o=[];let n=0;for(;n<t.length;){if(/\s/.test(t[n])){n+=1;continue}let r=n,s=!1;for(;r<t.length;){if(t.startsWith("{{",r)){const i=t.indexOf("}}",r+2);s=!0,r=i===-1?t.length:i+2;continue}if(/\s/.test(t[r]))break;r+=1}o.push({text:t.slice(n,r),from:n,to:r,dynamic:s}),n=r}return o}function jt(e){const t=String(e||""),o=[];let n=0,r=0;for(let i=0;i<t.length;i+=1){const a=t[i];a==="["||a==="("?n+=1:a==="]"||a===")"?n=Math.max(0,n-1):a===":"&&n===0&&(o.push(t.slice(r,i)),r=i+1)}const s=t.slice(r);return{variants:o,base:s}}function At(e){let o=String(e||""),n="";o.startsWith("!")?(n="pre",o=o.slice(1)):o.endsWith("!")&&(n="post",o=o.slice(0,-1));let r="";const s=zt(o);return s!==-1&&(r=o.slice(s),o=o.slice(0,s)),{name:o,modifier:r,important:n}}function zt(e){let t=0;for(let o=0;o<e.length;o+=1){const n=e[o];if(n==="["||n==="(")t+=1;else if(n==="]"||n===")")t=Math.max(0,t-1);else if(n==="/"&&t===0)return o}return-1}function Ut({variants:e,name:t,modifier:o,important:n}){let r=`${t}${o||""}`;return n==="pre"?r=`!${r}`:n==="post"&&(r=`${r}!`),[...e||[],r].join(":")}function Nt(e){const t=Ft(e),o=new Map;let n=null,r=0;const s=t.findIndex(a=>a.text==="]");if(t[0]?.text==="["&&s>0){const a=t.slice(1,s);n={from:t[0].from,to:t[s].to,label:`[ ${a.map(u=>u.text).join(" ")} ]`},r=s+1}for(;r<t.length;r+=1){const a=t[r],{variants:u,base:c}=jt(a.text),{name:y,modifier:I,important:C}=At(c),H=u.join(":");o.has(H)||o.set(H,{key:H,variants:u,items:[]}),o.get(H).items.push({raw:a.text,from:a.from,to:a.to,dynamic:a.dynamic,variants:u,name:y,modifier:I,important:C})}const i=[...o.values()];return i.sort((a,u)=>a.key===""?-1:u.key===""?1:0),{scope:n,groups:i}}function qt(e,t,o){const n=String(e||"");if(o)return n.slice(0,t.from)+o+n.slice(t.to);let r=t.from,s=t.to;if(r>0&&(n[r-1]===" "||n[r-1]==="	"))for(;r>0&&(n[r-1]===" "||n[r-1]==="	");)r-=1;else for(;s<n.length&&(n[s]===" "||n[s]==="	");)s+=1;return Vt(n.slice(0,r)+n.slice(s),r)}function Vt(e,t){const o=e.lastIndexOf(`
`,Math.max(0,t-1));if(o===-1)return e;const n=e.indexOf(`
`,o+1);return e.slice(o+1,n===-1?e.length:n).trim()!==""?e:e.slice(0,o)+e.slice(n===-1?e.length:n)}function Wt(e,t,o){const n=ae(e,t.from,t.openTo);return n?e.slice(0,n.from)+o+e.slice(n.to):e}const Yt=[...Object.keys(Ze),...Object.keys(Qe),"text","leading","font","rounded"].sort((e,t)=>t.length-e.length);let ee=null;function Kt(e){return ee||(ee=Je(e).then(Xt)),ee}function Me(e){const t=String(e||"");if(t.includes(";"))return"";const o=t.indexOf(":");return o===-1?"":t.slice(0,o).trim()}function Xt(e){const t=new Map,o=new Map,n=new Map;for(const r of e.items){const s=Me(r.css);s&&(t.has(s)||t.set(s,[]),t.get(s).push(r),o.set(r.label,s));const i=Le(r.label);i&&(n.has(i)||n.set(i,[]),n.get(i).push(r))}return{catalog:e,byProperty:t,propertyOfUtility:o,byPrefix:n}}function Le(e){for(const t of Yt)if(String(e).startsWith(`${t}-`))return t;return""}function Gt(e,t){if(!t||!e)return null;const o=t.propertyOfUtility.get(e);if(o)return{label:o,options:t.byProperty.get(o)||[]};const n=Le(e),r=n?t.byPrefix.get(n):null;return r?.length?{label:Me(r[0].css)||n,options:r}:null}function Jt(e,t){return t?.catalog?.byUtility?.get(e)?.css||""}function Zt(e,t){return t?.catalog?.byUtility?.get(e)?.color||""}const m=ke({emptyText:"",tag:"",scope:"",scopeTitle:"",baseLabel:"",groups:[],canEdit:!1,onChip:null}),Qt={class:"sve-tw"},en={key:0,class:"sve-tw-head"},tn={class:"sve-tw-tag"},nn=["title"],on={key:1,class:"sve-tw-empty"},rn=["data-sve-tw-base"],sn={class:"sve-tw-chips"},ln=["title","onClick"],an={__name:"TwClassList",setup(e){function t(o){const n={"data-sve-tw-chip":o.id};return o.locked&&(n["data-sve-tw-locked"]=""),o.open&&(n["data-open"]=""),n}return(o,n)=>(f(),p("div",Qt,[d(m).tag?(f(),p("div",en,[k("span",tn,"<"+b(d(m).tag)+">",1),d(m).scope?(f(),p("span",{key:0,class:"sve-tw-scope",title:d(m).scopeTitle},b(d(m).scope),9,nn)):_("",!0)])):_("",!0),d(m).groups.length?_("",!0):(f(),p("div",on,b(d(m).emptyText),1)),(f(!0),p(O,null,N(d(m).groups,r=>(f(),p("div",{key:r.key,class:"sve-tw-group"},[k("span",{class:"sve-tw-variant","data-sve-tw-base":r.key===""?"":void 0},b(r.key===""?d(m).baseLabel:r.key),9,rn),k("div",sn,[(f(!0),p(O,null,N(r.chips,s=>(f(),p("button",U({key:s.id,type:"button"},{ref_for:!0},t(s),{title:s.title,onClick:h(i=>d(m).onChip?.(i,s.id),["prevent","stop"])}),[s.color?(f(),p("span",{key:0,class:"sve-tw-dot",style:be({background:s.color})},null,4)):_("",!0),Te(" "+b(s.raw),1)],16,ln))),128))])]))),128))]))}},Ie=ie(an,[["__scopeId","data-v-e167f4d5"]]),cn={key:0,"data-sve-tw-menu-title":""},dn={"data-sve-tw-menu-list":""},un=["data-active","title","onClick"],fn={"data-sve-tw-tick":""},pn={"data-sve-tw-label":""},hn={__name:"TwClassMenu",props:{title:{type:String,default:""},options:{type:Array,default:()=>[]},removeLabel:{type:String,default:""},onPick:{type:Function,required:!0},onRemove:{type:Function,required:!0}},setup(e){return(t,o)=>(f(),p(O,null,[e.title?(f(),p("div",cn,b(e.title),1)):_("",!0),k("div",dn,[(f(!0),p(O,null,N(e.options,n=>(f(),p("button",{key:n.label,type:"button","data-sve-tw-option":"","data-active":n.active?"":void 0,title:n.css,onClick:h(r=>e.onPick(n.label),["prevent","stop"])},[k("span",fn,b(n.active?"✓":""),1),n.color?(f(),p("span",{key:0,"data-sve-tw-dot":"",style:be({background:n.color})},null,4)):_("",!0),k("span",pn,b(n.label),1)],8,un))),128))]),k("button",{type:"button","data-sve-tw-remove":"",onClick:o[0]||(o[0]=h(n=>e.onRemove(),["prevent","stop"]))},[o[1]||(o[1]=k("span",{"data-sve-tw-tick":""},"✕",-1)),Te(b(e.removeLabel),1)])],64))}},T="__sve-tw-menu",me="__sve-tw-style";let w=null,q=new Map,F=null,te=!1,G="",oe=null;function ce(e){return e?.querySelector?.("[data-sve-tw-classes]")||null}function Se(e){if(e.getElementById(me))return;const t=e.createElement("style");t.id=me,t.textContent=`
    #${T} {
      position: fixed;
      z-index: 100000;
      box-sizing: border-box;
      min-width: 11rem;
      max-width: 18rem;
      max-height: 60vh;
      overflow-y: auto;
      padding: 6px;
      border-radius: 8px;
      border: 1px solid rgba(128,128,128,.32);
      background: var(--theme-color-content-bg, #fff);
      color: inherit;
      box-shadow: 0 8px 24px rgba(0,0,0,.24);
      font-size: 11px;
    }
    #${T} [data-sve-tw-menu-title] {
      padding: 2px 6px 6px;
      opacity: .55;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 10px;
    }
    #${T} [data-sve-tw-option],
    #${T} [data-sve-tw-remove] {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      padding: 4px 6px;
      border-radius: 5px;
      cursor: pointer;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      line-height: 1.5;
    }
    #${T} [data-sve-tw-option]:hover,
    #${T} [data-sve-tw-remove]:hover {
      background: rgba(128,128,128,.2);
    }
    #${T} [data-sve-tw-option][data-active] { background: rgba(128,128,128,.14); }
    #${T} [data-sve-tw-tick] {
      flex: none;
      width: 10px;
      opacity: .7;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
    #${T} [data-sve-tw-dot] {
      flex: none;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      border: 1px solid rgba(128,128,128,.5);
    }
    #${T} [data-sve-tw-label] {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    #${T} [data-sve-tw-remove] {
      margin-top: 4px;
      border-top: 1px solid rgba(128,128,128,.25);
      border-radius: 0 0 5px 5px;
      padding-top: 7px;
      font-family: ui-sans-serif, system-ui, sans-serif;
    }
  `,e.head.appendChild(t)}function mn(e){const t=e.document.getElementById("live-preview-iframe");if(t)return t.contentDocument;for(const o of e.document.querySelectorAll("iframe"))try{const n=o.contentDocument?.getElementById("live-preview-iframe");if(n)return n.contentDocument}catch{}return null}function vn(e,t,o,n){const r=mn(e);if(!(!r||!t))for(const s of r.querySelectorAll(`[${nt}="${t}"]`))try{o&&s.classList.remove(o),n&&s.classList.add(n)}catch{}}function P(e){const t=e?.document.getElementById(T);oe?.(),oe=null,G="",t&&(t._sveApp?.unmount(),t.remove())}function ve(e,t,o){const n=t.getBoundingClientRect(),r=o.offsetWidth||176,s=o.offsetHeight||0,i=8,a=Math.max(i,Math.min(n.left,e.innerWidth-r-i)),u=n.bottom+4,c=s&&u+s>e.innerHeight-i?Math.max(i,n.top-s-4):u;o.style.left=`${a}px`,o.style.top=`${c}px`}function gn(e,t,o){const n=e.document;P(e),Se(n);const r=Gt(o.name,F),s=n.createElement("div");s.id=T,n.body.appendChild(s),s._sveApp=Ue(hn,s,{title:r?.label||"",removeLabel:v(e,"tw_classes_remove"),options:(r?.options||[]).map(c=>({label:c.label,css:c.css,color:c.color,active:c.label===o.name})),onPick:c=>{ge(e,o,c),P(e)},onRemove:()=>{ge(e,o,""),P(e)}}),ve(e,t,s),G=o.id,R(e);const i=()=>ve(e,t,s),a=c=>{!s.contains(c.target)&&!t.contains(c.target)&&(P(e),R(e))},u=c=>{c.key==="Escape"&&(P(e),R(e))};n.addEventListener("pointerdown",a,!0),n.addEventListener("keydown",u,!0),e.addEventListener("scroll",i,!0),e.addEventListener("resize",i),oe=()=>{n.removeEventListener("pointerdown",a,!0),n.removeEventListener("keydown",u,!0),e.removeEventListener("scroll",i,!0),e.removeEventListener("resize",i)}}function ge(e,t,o){if(!w||g("dock:is-locked"))return;const n=g("dock:html"),r=typeof n=="string"?ae(n,w.from,w.openTo):null;if(!r||r.value.slice(t.from,t.to)!==t.raw){de(e,w);return}const s=o?Ut({variants:t.variants,name:o,modifier:t.modifier,important:t.important}):"",i=qt(r.value,t,s),a=Wt(n,w,i);a!==n&&(vn(e,w.path,t.raw,s),g("dock:set-html",a))}function yn(e,t,o){const n=q.get(o);if(!(!n||n.locked)){if(G===o){P(e),R(e);return}gn(e,t.currentTarget,n)}}function R(e){if(ce(e.document))for(const o of m.groups)for(const n of o.chips)n.open=n.id===G}function xn(e,t){const o=ce(e.document);if(o){if(!t||t.from==null||t.openTo==null){w=null,q=new Map,P(e),m.tag="",m.scope="",m.groups=[],m.emptyText=v(e,"tw_classes_pick"),m.baseLabel=v(e,"tw_classes_base"),A(o,Ie);return}de(e,{from:t.from,openTo:t.openTo,path:t.path,tag:t.tag})}}function de(e,t){const o=ce(e.document);if(!o)return;w=t,Se(e.document),kn(e);const n=g("dock:html"),r=typeof n=="string"?ae(n,w.from,w.openTo):null,s=r?Nt(r.value):{scope:null,groups:[]};q=new Map,m.tag=w.tag||"",m.scope=s.scope?.label||"",m.scopeTitle=v(e,"tw_classes_scope"),m.baseLabel=v(e,"tw_classes_base"),m.canEdit=!g("dock:is-locked"),m.emptyText=v(e,"tw_classes_none"),m.onChip=(i,a)=>yn(e,i,a),m.groups=s.groups.map(i=>({key:i.key,chips:i.items.map((a,u)=>{const c=a.dynamic||!m.canEdit,y={...a,id:`${i.key}-${u}-${a.from}`,locked:c,open:!1,color:a.dynamic?"":Zt(a.name,F),title:a.dynamic?v(e,"tw_classes_dynamic"):Jt(a.name,F)||a.raw};return q.set(y.id,y),y})})),A(o,Ie),R(e)}function kn(e){F||te||(te=!0,Kt(e).then(t=>{F=t,w&&de(e,w)}).catch(()=>{te=!1}))}const j="__sve-html-tree-panel",ye="__sve-html-tree-style",S=new Set;let J=null,V=null,W=0,ue=[],L=null,B=null,Y=null,K=null,re=null,X=!1;function E(e){return e.getElementById(j)}function bn(e){let t=e.getElementById(ye);t||(t=e.createElement("style"),t.id=ye,e.head.appendChild(t)),t.textContent=`
    [data-sve-ht-row] {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 8px;
      min-height: 28px;
      margin-bottom: 3px;
      background: rgba(128,128,128,.16);
      border-radius: 6px;
      font-size: 11px;
      line-height: 1.3;
      cursor: pointer;
      user-select: none;
      position: relative;
      touch-action: none;
    }
    [data-sve-ht-dragging],
    [data-sve-ht-dragging] * {
      cursor: grabbing !important;
    }
    [data-sve-ht-row]:hover { background: rgba(128,128,128,.26); }
    [data-sve-ht-row]:focus-visible { outline: 2px solid #3858e9; outline-offset: -2px; }
    [data-sve-ht-row][data-sve-ht-current] { background: #3858e9; color: #fff; }
    [data-sve-ht-row][data-sve-ht-current]:hover { background: #4a68ee; }
    [data-sve-ht-row][data-sve-ht-hidden] { opacity: .5; }
    [data-sve-ht-row][data-sve-ht-drop="before"]::before,
    [data-sve-ht-row][data-sve-ht-drop="after"]::after {
      content: '';
      position: absolute;
      left: 8px;
      right: 8px;
      height: 2px;
      background: #93c5fd;
      pointer-events: none;
    }
    [data-sve-ht-row][data-sve-ht-drop="before"]::before { top: -2px; }
    [data-sve-ht-row][data-sve-ht-drop="after"]::after { bottom: -2px; }
    [data-sve-ht-row][data-sve-ht-drop="inside"] {
      outline: 2px solid #93c5fd;
      outline-offset: -2px;
    }
    [data-sve-ht-twist] {
      all: unset;
      box-sizing: border-box;
      width: 14px;
      height: 14px;
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: .7;
    }
    [data-sve-ht-twist][data-sve-ht-shut] { transform: rotate(-90deg); }
    [data-sve-ht-actions] {
      margin-left: auto;
      flex: none;
      display: none;
      align-items: center;
      gap: 4px;
    }
    [data-sve-ht-row]:hover [data-sve-ht-actions],
    [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-actions],
    [data-sve-ht-row][data-sve-ht-hidden] [data-sve-ht-actions] {
      display: inline-flex;
    }
    [data-sve-ht-eye],
    [data-sve-ht-dup],
    [data-sve-ht-del] {
      all: unset;
      box-sizing: border-box;
      width: 18px;
      height: 18px;
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: .7;
      border-radius: 4px;
    }
    [data-sve-ht-eye]:hover,
    [data-sve-ht-dup]:hover,
    [data-sve-ht-del]:hover { opacity: 1; background: rgba(255,255,255,.12); }
    [data-sve-ht-icon] {
      flex: none;
      width: 14px;
      height: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    [data-sve-ht-icon] svg { display: block; }
    [data-sve-ht-letter] {
      flex: none;
      width: 14px;
      height: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      line-height: 1;
    }
    [data-sve-ht-text] {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      overflow: hidden;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
    }
    [data-sve-ht-tag] {
      flex: none;
      opacity: .55;
    }
    [data-sve-ht-row][data-sve-ht-current] [data-sve-ht-tag] { opacity: .72; }
    [data-sve-ht-name] {
      min-width: 2em;
      min-height: 1em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    [data-sve-ht-rename] {
      all: unset;
      box-sizing: border-box;
      min-width: 48px;
      max-width: 100%;
      padding: 0 4px;
      border-radius: 3px;
      background: rgba(0,0,0,.22);
      font: inherit;
      color: inherit;
    }
  `}function fe(){const e=g("dock:html");return typeof e=="string"?e:""}function De(e){return!!g("dock:is-open",e)}function Re(e){return g("dock:set-html",e)===!0}function $(e){const t=e.document,n=E(t)?.querySelector("[data-sve-html-tree-list]");if(!n)return;bn(t);const r=fe(),s=et(r);ue=s;const i=tt(s,S),a=g("dock:current-type")||"",u=Dt(a);!r.trim()&&!De(t)?l.emptyText=v(e,"html_tree_need_dock"):l.emptyText=v(e,"html_tree_empty"),l.renameTitle=v(e,"html_tree_rename"),l.hideTitle=v(e,"html_tree_hide"),l.showTitle=v(e,"html_tree_show"),l.duplicateTitle=v(e,"html_tree_duplicate"),l.deleteTitle=v(e,"html_tree_delete"),l.canEdit=!g("dock:is-locked"),l.onSelect=c=>Oe(e,c,i),l.onTwist=c=>{S.has(c)?S.delete(c):S.add(c),$(e)},l.onRename=c=>_n(e,c),l.onRenameCommit=()=>xe(e,!0),l.onRenameCancel=()=>xe(e,!1),l.onHide=c=>Cn(e,c),l.onDuplicate=c=>Hn(e,c),l.onDelete=c=>En(e,c),l.onPointerDown=(c,y)=>Pn(e,c,y),l.rows=i.map(c=>{const y=Ot(c.tag);return{...c,name:Rt(c.klass,c.path,u),current:c.id===J,letter:y.letter||"",svg:y.svg||""}}),A(n,Ht),Tn(e,s),Be(e)}function Be(e){xn(e,l.rows.find(t=>t.current)||null)}function Tn(e,t){if(!E(e.document))return;const o=t[0];le({source:"statamic-visual-editor",type:"sve-html-pick",on:!0,uid:g("dock:current-uid")||"",tag:o?.tag||"",klass:o?.klass||"",nodes:ot(t)},e)}function wn(e){if(!e)return;const t=[],o=String(e).split("/");for(let r=0;r<o.length;r+=1)t.push(o.slice(0,r+1).join("/"));const n=r=>{for(const s of r||[])t.includes(s.path)&&S.delete(s.id),n(s.children)};n(ue)}function _n(e,t){if(X)return;const o=l.rows.find(n=>n.id===t);o&&(J=t,l.rows.forEach(n=>{n.current=n.id===t}),l.editingId=t,l.draft=o.name,e.setTimeout(()=>{const n=E(e.document)?.querySelector("[data-sve-ht-rename]");n?.focus(),n?.select()},0))}function xe(e,t){const o=l.editingId;if(!o)return;const n=l.rows.find(r=>r.id===o);l.editingId=null,t&&n&&Bt(g("dock:current-type")||"",n.path,l.draft,n.klass),l.draft="",$(e)}function Cn(e,t){pe(e,t,$t)}function Hn(e,t){pe(e,t,Lt)}function En(e,t){pe(e,t,It)}function pe(e,t,o){if(g("dock:is-locked"))return;const n=fe(),r=l.rows.find(i=>i.id===t);if(!r)return;const s=o(n,r);s!==n&&Re(s)}function Pn(e,t,o){if(t.button!==0||g("dock:is-locked")||l.editingId||t.target?.closest?.("button, input"))return;he(),L=o,B={x:t.clientX,y:t.clientY},Y=t.currentTarget,K=t.pointerId;const n=s=>$n(e,s),r=s=>Mn(e,s);re=()=>{e.document.removeEventListener("pointermove",n,!0),e.document.removeEventListener("pointerup",r,!0),e.document.removeEventListener("pointercancel",r,!0),re=null},e.document.addEventListener("pointermove",n,!0),e.document.addEventListener("pointerup",r,!0),e.document.addEventListener("pointercancel",r,!0)}function $n(e,t){if(!L||!B)return;const o=t.clientX-B.x,n=t.clientY-B.y;if(!l.dragging&&o*o+n*n<25)return;if(!l.dragging){l.dragging=!0;try{Y?.setPointerCapture?.(K)}catch{}}t.preventDefault();const r=e.document.elementFromPoint(t.clientX,t.clientY)?.closest?.("[data-sve-ht-row]"),s=r?.getAttribute("data-sve-ht-id");if(!s||s===L){l.dropId=null,l.dropPlace=null;return}const i=l.rows.find(c=>c.id===s),a=l.rows.find(c=>c.id===L);if(!i||a&&i.path.startsWith(`${a.path}/`)){l.dropId=null,l.dropPlace=null;return}const u=r.getBoundingClientRect();l.dropId=s,l.dropPlace=Mt(t.clientY-u.top,u.height,!_e(i.tag))}function Mn(e,t){const o=L,n=l.dropId,r=l.dropPlace||"after",s=l.dragging;if(he(),s&&(X=!0,e.setTimeout(()=>{X=!1},0)),!s||g("dock:is-locked")||!o||!n||o===n)return;t?.preventDefault?.();const i=fe(),a=Pt(i,ue,o,n,r);a!==i&&Re(a)}function he(){try{Y?.releasePointerCapture?.(K)}catch{}re?.(),L=null,B=null,Y=null,K=null,l.dragging=!1,l.dropId=null,l.dropPlace=null}function Oe(e,t,o){if(X)return;const n=(o||l.rows).find(r=>r.id===t);n&&(J=t,l.rows.forEach(r=>{r.current=r.id===t}),Be(e),g("dock:reveal-html",{from:n.from,to:n.to}),le({source:"statamic-visual-editor",type:"sve-html-pick-focus",path:n.path},e))}function Ln(e,t){if(!t||!E(e.document))return;wn(t),$(e);const o=l.rows.find(n=>n.path===t);o&&Oe(e,o.id,l.rows)}function se(e){if(V)return;V=We("dock:html-changed",()=>{l.editingId||l.dragging||(e.clearTimeout(W),W=e.setTimeout(()=>{E(e.document)&&$(e)},80))})}function In(e){V?.(),V=null,e?.clearTimeout?.(W),W=0}function Z(e){const t=E(e.document);if(le({source:"statamic-visual-editor",type:"sve-html-pick",on:!1},e),In(e),he(),P(e),J=null,l.editingId=null,l.draft="",!t){x.syncPreviewInset(e);return}t.remove(),Ye.headerTab==="html_tree"&&Ke(e,null),Ne(e),x.persistDockedPanel(e),we(e),x.syncPreviewInset(e)}function Sn(e,t){t.querySelector("[data-sve-html-tree-list]")||(t.id=j,A(t,Ce,{title:v(e,"html_tree")}),t.querySelector("[data-sve-close]")?.addEventListener("click",()=>Z(e)))}function Dn(e){se(e),$(e)}function Fe(e){const t=e.document;if(!x.featureOn(e,"html_tree"))return;if(E(t)){se(e),$(e);return}if(!De(t))return;x.closeRightPanels(e,[j]);const o=t.createElement("div");o.id=j,o.style.cssText=qe,A(o,Ce,{title:v(e,"html_tree")}),o.querySelector("[data-sve-close]")?.addEventListener("click",()=>Z(e)),Ve(e,o),x.persistDockedPanel(e),we(e),x.syncPreviewInset(e),se(e),$(e)}function Rn(e){if(E(e.document)){Z(e);return}Fe(e)}Xe("html-tree:from-preview",({path:e}={})=>{Ln(window,e)});x.HTML_TREE_PANEL_ID=j;x.htmlTreePanel=E;x.closeHtmlTreePanel=Z;x.fillHtmlTreePane=Sn;x.showHtmlTreePane=Dn;x.openHtmlTreePanel=Fe;x.toggleHtmlTreePanel=Rn;x.renderHtmlTree=$;export{j as HTML_TREE_PANEL_ID,ye as HTML_TREE_STYLE_ID,Z as closeHtmlTreePanel,bn as ensureHtmlTreeStyles,Sn as fillHtmlTreePane,J as htmlTreeActiveId,S as htmlTreeCollapsed,E as htmlTreePanel,W as htmlTreeTimer,V as htmlTreeUnhook,Fe as openHtmlTreePanel,$ as renderHtmlTree,Dn as showHtmlTreePane,In as stopWatchHtmlTreeDock,Rn as toggleHtmlTreePanel,se as watchHtmlTreeDock};
