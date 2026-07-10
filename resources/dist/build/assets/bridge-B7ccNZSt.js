const v="data-sid-active",E="data-sid-hover",y="data-sid-inner",u="data-sid",f="data-sid-field",T="__sve-bridge-styles",h="sve-mouse-active";const x="data-sve-editing";let c=null,g=null,D=0;function A(e){return(e||"").replace(/\u00a0/g," ").replace(/\s+/g," ").trim()}function P(e,o){let n="currentColor",i="#9CA3AF";try{const a=getComputedStyle(o.top.document.documentElement);n=a.getPropertyValue("--focus-outline-color").trim()||n,i=a.getPropertyValue("--theme-color-gray-400").trim()||i}catch{}e.documentElement.style.setProperty("--sve-outline-width","2px"),e.documentElement.style.setProperty("--sve-outline-opacity","60%"),e.documentElement.style.setProperty("--sve-focus-color",n),e.documentElement.style.setProperty("--sve-hover-color",i)}function C(e){if(e.getElementById(T))return;const o=e.createElement("style");o.id=T,o.textContent=`
        [data-sid], [data-sid-field] {
            cursor: pointer;
            outline-width: var(--sve-outline-width, 1px);
            outline-style: dashed;
            outline-color: transparent;
            outline-offset: 2px;
            transition: outline-color 0.15s ease;
        }
        .${h} [data-sid], .${h} [data-sid-field] {
            outline-color: color-mix(in srgb, var(--sve-hover-color, #9CA3AF) var(--sve-outline-opacity, 55%), transparent);
        }
        [data-sid-inner],
        [data-sid-hover] {
            outline-width: var(--sve-outline-width, 1px) !important;
            outline-style: dashed !important;
            outline-color: color-mix(in srgb, var(--sve-focus-color, currentColor) var(--sve-outline-opacity, 55%), transparent) !important;
            outline-offset: 2px;
        }
        [data-sid-active] {
            outline-width: var(--sve-outline-width, 1px) !important;
            outline-style: solid !important;
            outline-color: color-mix(in srgb, var(--sve-focus-color, currentColor) var(--sve-outline-opacity, 55%), transparent) !important;
            outline-offset: 2px;
        }
        [${x}] {
            outline-width: var(--sve-outline-width, 1px) !important;
            outline-style: solid !important;
            outline-color: var(--sve-focus-color, currentColor) !important;
            outline-offset: 4px;
            cursor: text !important;
        }
        [${x}]:focus {
            /* suppress the site's own focus ring so only the edit outline shows */
            box-shadow: none;
        }
        [data-sid-inside] {
            outline-offset: -2px;
        }
        [data-sid-inside][data-sid-inner],
        [data-sid-inside][data-sid-hover],
        [data-sid-inside][data-sid-active] {
            outline-offset: -2px !important;
        }
        [data-sid-inside][data-sid-label]::after {
            top: -4px;
        }
        [data-sid][data-sid-label] {
            position: relative;
        }
        [data-sid][data-sid-label]::after {
            /* safe: data-sid-label is populated only by Blade/Antlers auto-escaped output; no XSS risk */
            content: attr(data-sid-label);
            position: absolute;
            top: -8px;
            left: calc(-2px - var(--sve-outline-width, 0));
            transform: translateY(calc(-100%));
            background: var(--sve-focus-color, currentColor);
            color: #fff;
            font-size: 10px;
            font-family: sans-serif;
            padding: 2px 8px !important;
            border-radius: 4px;
            pointer-events: none;
            z-index: 9999;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.15s ease;
        }
        [data-sid-inner][data-sid-label]::after,
        [data-sid-hover][data-sid-label]::after,
        [data-sid-active][data-sid-label]::after {
            opacity: 1;
        }
        .sve-cp-pulse {
            animation: sve-cp-pulse 0.4s ease-out;
        }
        @keyframes sve-cp-pulse {
            0%   { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
            100% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
        }
    `,e.head.appendChild(o)}function k(e){let o=e.previousElementSibling;for(;o;){if(o.hasAttribute(u)&&o.getAttribute("data-sid-type")!=="text")return o;const r=o.querySelector(`[${u}]:not([data-sid-type="text"])`);if(r)return r;o=o.previousElementSibling}return null}function L(e,o,r){if(o===null)return r.querySelector(`[${u}="${e}"][data-sid-type="text"]`);const t=r.querySelector(`[${u}="${o}"]`);if(!t)return null;let n=t;for(;n.parentElement&&!n.parentElement.hasAttribute(u)&&!n.nextElementSibling;)n=n.parentElement;let i=n.nextElementSibling;for(;i;){if(i.hasAttribute(u)&&i.getAttribute("data-sid-type")==="text")return i;i=i.nextElementSibling}return null}function O(e){let o=e;for(;o.children.length===1&&A(o.children[0].textContent)===A(o.textContent);)o=o.children[0];return o}function H(e,o,r){const t=e.document;let n=null;if(t.caretRangeFromPoint)n=t.caretRangeFromPoint(o,r);else if(t.caretPositionFromPoint){const i=t.caretPositionFromPoint(o,r);i&&(n=t.createRange(),n.setStart(i.offsetNode,i.offset),n.collapse(!0))}if(n){const i=e.getSelection();i.removeAllRanges(),i.addRange(n)}}function B(e,o,r){let t=null;if(r.target!==o){let i=r.target;for(;i.parentElement&&i.parentElement!==o;)i=i.parentElement;i.parentElement===o&&(t=i)}const n=`sve-edit-${++D}`;c&&clearTimeout(c.timeout),c={requestId:n,wrapper:o,blockEl:t,clickX:r.clientX,clickY:r.clientY,timeout:setTimeout(()=>{c&&c.requestId===n&&(c=null)},2e3)},e.top.postMessage({source:"statamic-visual-editor",type:"edit-request",requestId:n,field:o.getAttribute(f),scope:o.getAttribute("data-sid-field-uid")||void 0,blockIndex:t?Array.prototype.indexOf.call(o.children,t):null,blockText:t?A(t.textContent):null,wrapperText:A(o.textContent)},e.location.origin)}function q(e,o){clearTimeout(o.inputTimer),o.inputTimer=null,e.top.postMessage({source:"statamic-visual-editor",type:"edit-input",requestId:o.requestId,text:o.el.innerText,html:o.el.innerHTML},e.location.origin)}let p=null;function R(){p&&(p.remove(),p=null)}function I(e,o){if(!p)return;const r=o.el.getBoundingClientRect(),t=p.offsetHeight||34;let n=r.top-t-10;n<8&&(n=r.bottom+10);const i=e.innerWidth-p.offsetWidth-8;p.style.top=`${n}px`,p.style.left=`${Math.max(8,Math.min(r.left,i))}px`}function M(e){p&&p.querySelectorAll("[data-sve-cmd]").forEach(o=>{let r=!1;try{r=e.document.queryCommandState(o.dataset.sveCmd)}catch{}o.dataset.sveOn=r?"1":"",o.style.background=r?"rgba(59, 130, 246, 0.55)":"transparent"})}function F(e,o){R();const r=e.document,t=r.createElement("div");t.id="__sve-edit-toolbar",t.style.cssText="position:fixed;z-index:2147483647;display:flex;align-items:center;gap:2px;background:#1f2937;color:#fff;border-radius:8px;padding:4px;box-shadow:0 4px 16px rgba(0,0,0,0.35);font-family:sans-serif;font-size:13px;line-height:1;user-select:none;cursor:default;",t.addEventListener("mousedown",l=>l.preventDefault());const n=(l,s,m,S={})=>{const d=r.createElement("button");return d.type="button",d.textContent=l,d.title=s,S.cmd&&(d.dataset.sveCmd=S.cmd),d.style.cssText="all:unset;cursor:pointer;min-width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;border-radius:5px;padding:0 6px;box-sizing:border-box;text-align:center;"+(S.style||""),d.addEventListener("mouseenter",()=>{d.dataset.sveOn||(d.style.background="rgba(255, 255, 255, 0.14)")}),d.addEventListener("mouseleave",()=>{d.dataset.sveOn||(d.style.background="transparent")}),d.addEventListener("click",U=>{U.preventDefault(),m()}),t.appendChild(d),d},i=()=>{const l=r.createElement("span");l.style.cssText="width:1px;height:18px;background:rgba(255,255,255,0.2);margin:0 3px;",t.appendChild(l)},a=(l,s=null)=>{e.document.execCommand(l,!1,s),o.onInput(),M(e)};o.mode==="bard"&&(n("B","Fed (⌘B)",()=>a("bold"),{cmd:"bold",style:"font-weight:700;"}),n("I","Kursiv (⌘I)",()=>a("italic"),{cmd:"italic",style:"font-style:italic;font-family:serif;"}),n("🔗","Indsæt link",()=>{const l=e.getSelection();if(!l||l.isCollapsed)return;const s=l.getRangeAt(0).cloneRange();o.suspendBlur=!0;const m=e.prompt("Link URL:","https://");o.suspendBlur=!1,o.el.focus(),l.removeAllRanges(),l.addRange(s),m&&m!=="https://"&&a("createLink",m)}),n("⌫","Fjern formatering/link",()=>{a("removeFormat"),a("unlink")}),i()),n("✓","Gem (Enter)",()=>b(e,!1),{style:"color:#4ade80;font-weight:700;"}),n("✕","Annullér (Esc)",()=>b(e,!0),{style:"color:#f87171;"}),r.body.appendChild(t),p=t,I(e,o)}function N(e,o){if(!c||c.requestId!==o.requestId)return;const{wrapper:r,blockEl:t,clickX:n,clickY:i,timeout:a}=c;clearTimeout(a),c=null,g&&b(e,!1);const l=o.target==="block"&&t?t:O(r),s={requestId:o.requestId,mode:o.mode,el:l,restoreHtml:l.innerHTML,hadContentEditable:l.getAttribute("contenteditable"),inputTimer:null,dirty:!1};if(o.mode==="bard"){l.contentEditable="true";try{e.document.execCommand("styleWithCSS",!1,!1)}catch{}}else{try{l.contentEditable="plaintext-only"}catch{}l.contentEditable!=="plaintext-only"&&(l.contentEditable="true")}l.setAttribute(x,""),s.onInput=()=>{s.dirty=!0,clearTimeout(s.inputTimer),s.inputTimer=setTimeout(()=>q(e,s),150),I(e,s)},s.onKeydown=m=>{if(m.key==="Escape"){m.preventDefault(),b(e,!0);return}if(m.key==="Enter"){if(m.shiftKey&&o.mode==="string")return;m.preventDefault(),m.shiftKey||b(e,!1)}},s.onBlur=()=>{s.suspendBlur||b(e,!1)},s.onSelectionChange=()=>M(e),s.reposition=()=>I(e,s),l.addEventListener("input",s.onInput),l.addEventListener("keydown",s.onKeydown),l.addEventListener("blur",s.onBlur),e.document.addEventListener("selectionchange",s.onSelectionChange),e.addEventListener("scroll",s.reposition,!0),e.addEventListener("resize",s.reposition),g=s,e.__sveInlineEdit.active=!0,l.focus(),H(e,n,i),F(e,s)}function b(e,o){if(!g)return;const r=g;g=null,clearTimeout(r.inputTimer);const{el:t}=r;t.removeEventListener("input",r.onInput),t.removeEventListener("keydown",r.onKeydown),t.removeEventListener("blur",r.onBlur),e.document.removeEventListener("selectionchange",r.onSelectionChange),e.removeEventListener("scroll",r.reposition,!0),e.removeEventListener("resize",r.reposition),R(),!o&&r.dirty&&q(e,r),e.top.postMessage({source:"statamic-visual-editor",type:"edit-end",requestId:r.requestId,cancelled:!!o},e.location.origin),t.removeAttribute(x),r.hadContentEditable===null?t.removeAttribute("contenteditable"):t.setAttribute("contenteditable",r.hadContentEditable),o&&(t.innerHTML=r.restoreHtml),e.document.activeElement===t&&t.blur(),e.__sveInlineEdit.active=!1,e.dispatchEvent(new CustomEvent("sve:inline-edit-end"))}function V(e){let o=null;return function(t){if(g)return;e.document.documentElement.classList.add(h);const n=e.document.querySelector(`[${y}]`),i=t.target.closest(`[${u}], [${f}]`);n!==i&&(n&&n.removeAttribute(y),i&&i.setAttribute(y,"")),o&&clearTimeout(o),o=setTimeout(()=>{e.document.documentElement.classList.remove(h),e.document.querySelectorAll(`[${y}]`).forEach(a=>{a.removeAttribute(y)})},1500)}}function z(e){return function(r){if(g){if(p&&p.contains(r.target))return;if(g.el.contains(r.target)){r.stopPropagation();return}b(e,!1)}const t=r.target.closest(`[${u}], [${f}]`);if(!t){e.document.querySelectorAll(`[${v}]`).forEach(s=>{s.removeAttribute(v)});return}if(r.preventDefault(),e.document.querySelectorAll(`[${v}]`).forEach(s=>{s.removeAttribute(v)}),t.setAttribute(v,""),t.getAttribute("data-sid-action")==="popup"){e.top.postMessage({source:"statamic-visual-editor",type:"popup",uid:t.getAttribute(u),sectionUid:t.parentElement?.closest(`[${u}]`)?.getAttribute(u)??null},e.location.origin);return}if(t.hasAttribute(f)){e.top.postMessage({source:"statamic-visual-editor",type:"click",field:t.getAttribute(f),scope:t.getAttribute("data-sid-field-uid")||void 0,label:t.getAttribute("data-sid-label")||void 0},e.location.origin),B(e,t,r);return}const n=t.getAttribute(u),a=Array.from(e.document.querySelectorAll(`[${u}]`)).filter(s=>s.getAttribute(u)===n).indexOf(t),l={source:"statamic-visual-editor",type:"click",uid:n};if(a>0&&(l.uidIndex=a),t.getAttribute("data-sid-type")==="text"){const s=k(t);l.afterSetUid=s?s.getAttribute(u):null}e.top.postMessage(l,e.location.origin)}}function W(e){let o=null;function r(t){if(g)return;const n=t.target.closest(`[${u}], [${f}]`);if(n&&n.hasAttribute(f)){const l=n.getAttribute(f);if(l===o)return;o=l,e.top.postMessage({source:"statamic-visual-editor",type:"hover",field:l,scope:n.getAttribute("data-sid-field-uid")||void 0,label:n.getAttribute("data-sid-label")||void 0},e.location.origin);return}const i=n?n.getAttribute(u):null;if(i===o)return;if(o=i,!i){e.top.postMessage({source:"statamic-visual-editor",type:"hover",uid:null},e.location.origin);return}const a={source:"statamic-visual-editor",type:"hover",uid:i};if(n.getAttribute("data-sid-type")==="text"){const l=k(n);a.afterSetUid=l?l.getAttribute(u):null}e.top.postMessage(a,e.location.origin)}return r.reset=()=>{o=null,e.top.postMessage({source:"statamic-visual-editor",type:"hover",uid:null},e.location.origin)},r}function _(e,o,r){const t=r&&o.querySelector(`[${u}="${r}"]`)||o,n=e.replaceAll(".","_"),i=t.querySelector(`[${f}="${e}"]`);if(i)return i;const a=[...t.querySelectorAll(`[${f}]`)].find(l=>l.getAttribute(f).replaceAll(".","_")===n);if(a)return a;for(const l of t.querySelectorAll(`[${f}]`)){const s=l.getAttribute(f).replaceAll(".","_");if(n===s||n.endsWith("_"+s))return l}return null}function $(e){e.classList.remove("sve-cp-pulse"),e.offsetWidth,e.classList.add("sve-cp-pulse"),setTimeout(()=>e.classList.remove("sve-cp-pulse"),400)}function K(e){return function(r){if(r.source!==e.top)return;const{data:t}=r;if(!(!t||t.source!=="statamic-visual-editor")){if(t.type==="edit-start"){N(e,t);return}if(t.type==="edit-deny"){c&&c.requestId===t.requestId&&(clearTimeout(c.timeout),c=null);return}if(t.type==="hover"){if(e.document.querySelectorAll(`[${E}]`).forEach(n=>{n.removeAttribute(E)}),t.field){const n=_(t.field,e.document,t.scope);n&&n.setAttribute(E,"");return}if(t.uid){const n="afterSetUid"in t?L(t.uid,t.afterSetUid,e.document):e.document.querySelector(`[${u}="${t.uid}"]`);n&&n.setAttribute(E,"")}return}if(t.type==="focus"){if(e.document.querySelectorAll(`[${v}]`).forEach(n=>{n.removeAttribute(v)}),t.field){const n=_(t.field,e.document,t.scope);n&&(n.setAttribute(v,""),t.scope&&(n.scrollIntoView({behavior:"smooth",block:"start"}),$(n)));return}if(t.uid){const n="afterSetUid"in t?L(t.uid,t.afterSetUid,e.document):e.document.querySelector(`[${u}="${t.uid}"]`);n&&(n.setAttribute(v,""),"afterSetUid"in t||(n.scrollIntoView({behavior:"smooth",block:"start"}),$(n)))}}}}}function Y(e=window){if(e.self===e.top)return;e.__sveInlineEdit=e.__sveInlineEdit||{active:!1},C(e.document),P(e.document,e),new e.MutationObserver(()=>{e.document.getElementById(T)||C(e.document)}).observe(e.document.head,{childList:!0}),e.document.addEventListener("click",z(e),!0),e.document.addEventListener("mousemove",V(e),!0);const o=W(e);e.document.addEventListener("mouseover",o,!0),e.document.addEventListener("mouseleave",()=>o.reset(),!0),e.addEventListener("message",K(e))}Y();
