const f="data-sid-active",g="data-sid-hover",v="data-sid-inner",a="data-sid",c="data-sid-field",A="__sve-bridge-styles",E="sve-mouse-active";const y="data-sve-editing";let d=null,p=null,q=0;function h(t){return(t||"").replace(/\u00a0/g," ").replace(/\s+/g," ").trim()}function C(t,o){let i="currentColor",n="#9CA3AF";try{const u=getComputedStyle(o.top.document.documentElement);i=u.getPropertyValue("--focus-outline-color").trim()||i,n=u.getPropertyValue("--theme-color-gray-400").trim()||n}catch{}t.documentElement.style.setProperty("--sve-outline-width","2px"),t.documentElement.style.setProperty("--sve-outline-opacity","60%"),t.documentElement.style.setProperty("--sve-focus-color",i),t.documentElement.style.setProperty("--sve-hover-color",n)}function T(t){if(t.getElementById(A))return;const o=t.createElement("style");o.id=A,o.textContent=`
        [data-sid], [data-sid-field] {
            cursor: pointer;
            outline-width: var(--sve-outline-width, 1px);
            outline-style: dashed;
            outline-color: transparent;
            outline-offset: 2px;
            transition: outline-color 0.15s ease;
        }
        .${E} [data-sid], .${E} [data-sid-field] {
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
        [${y}] {
            outline-width: var(--sve-outline-width, 1px) !important;
            outline-style: solid !important;
            outline-color: var(--sve-focus-color, currentColor) !important;
            outline-offset: 4px;
            cursor: text !important;
        }
        [${y}]:focus {
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
    `,t.head.appendChild(o)}function _(t){let o=t.previousElementSibling;for(;o;){if(o.hasAttribute(a)&&o.getAttribute("data-sid-type")!=="text")return o;const r=o.querySelector(`[${a}]:not([data-sid-type="text"])`);if(r)return r;o=o.previousElementSibling}return null}function x(t,o,r){if(o===null)return r.querySelector(`[${a}="${t}"][data-sid-type="text"]`);const e=r.querySelector(`[${a}="${o}"]`);if(!e)return null;let i=e;for(;i.parentElement&&!i.parentElement.hasAttribute(a)&&!i.nextElementSibling;)i=i.parentElement;let n=i.nextElementSibling;for(;n;){if(n.hasAttribute(a)&&n.getAttribute("data-sid-type")==="text")return n;n=n.nextElementSibling}return null}function L(t){let o=t;for(;o.children.length===1&&h(o.children[0].textContent)===h(o.textContent);)o=o.children[0];return o}function M(t,o,r){const e=t.document;let i=null;if(e.caretRangeFromPoint)i=e.caretRangeFromPoint(o,r);else if(e.caretPositionFromPoint){const n=e.caretPositionFromPoint(o,r);n&&(i=e.createRange(),i.setStart(n.offsetNode,n.offset),i.collapse(!0))}if(i){const n=t.getSelection();n.removeAllRanges(),n.addRange(i)}}function k(t,o,r){let e=null;if(r.target!==o){let n=r.target;for(;n.parentElement&&n.parentElement!==o;)n=n.parentElement;n.parentElement===o&&(e=n)}const i=`sve-edit-${++q}`;d&&clearTimeout(d.timeout),d={requestId:i,wrapper:o,blockEl:e,clickX:r.clientX,clickY:r.clientY,timeout:setTimeout(()=>{d&&d.requestId===i&&(d=null)},2e3)},t.top.postMessage({source:"statamic-visual-editor",type:"edit-request",requestId:i,field:o.getAttribute(c),scope:o.getAttribute("data-sid-field-uid")||void 0,blockIndex:e?Array.prototype.indexOf.call(o.children,e):null,blockText:e?h(e.textContent):null,wrapperText:h(o.textContent)},t.location.origin)}function $(t,o){clearTimeout(o.inputTimer),o.inputTimer=null,t.top.postMessage({source:"statamic-visual-editor",type:"edit-input",requestId:o.requestId,text:o.el.innerText,html:o.el.innerHTML},t.location.origin)}function R(t,o){if(!d||d.requestId!==o.requestId)return;const{wrapper:r,blockEl:e,clickX:i,clickY:n,timeout:u}=d;clearTimeout(u),d=null,p&&b(t,!1);const l=o.target==="block"&&e?e:L(r),s={requestId:o.requestId,mode:o.mode,el:l,restoreHtml:l.innerHTML,hadContentEditable:l.getAttribute("contenteditable"),inputTimer:null,dirty:!1};try{l.contentEditable="plaintext-only"}catch{}l.contentEditable!=="plaintext-only"&&(l.contentEditable="true"),l.setAttribute(y,""),s.onInput=()=>{s.dirty=!0,clearTimeout(s.inputTimer),s.inputTimer=setTimeout(()=>$(t,s),150)},s.onKeydown=m=>{if(m.key==="Escape"){m.preventDefault(),b(t,!0);return}if(m.key==="Enter"){if(m.shiftKey&&o.mode==="string")return;m.preventDefault(),m.shiftKey||b(t,!1)}},s.onBlur=()=>b(t,!1),l.addEventListener("input",s.onInput),l.addEventListener("keydown",s.onKeydown),l.addEventListener("blur",s.onBlur),p=s,t.__sveInlineEdit.active=!0,l.focus(),M(t,i,n)}function b(t,o){if(!p)return;const r=p;p=null,clearTimeout(r.inputTimer);const{el:e}=r;e.removeEventListener("input",r.onInput),e.removeEventListener("keydown",r.onKeydown),e.removeEventListener("blur",r.onBlur),!o&&r.dirty&&$(t,r),t.top.postMessage({source:"statamic-visual-editor",type:"edit-end",requestId:r.requestId,cancelled:!!o},t.location.origin),e.removeAttribute(y),r.hadContentEditable===null?e.removeAttribute("contenteditable"):e.setAttribute("contenteditable",r.hadContentEditable),o&&(e.innerHTML=r.restoreHtml),t.document.activeElement===e&&e.blur(),t.__sveInlineEdit.active=!1,t.dispatchEvent(new CustomEvent("sve:inline-edit-end"))}function U(t){let o=null;return function(e){if(p)return;t.document.documentElement.classList.add(E);const i=t.document.querySelector(`[${v}]`),n=e.target.closest(`[${a}], [${c}]`);i!==n&&(i&&i.removeAttribute(v),n&&n.setAttribute(v,"")),o&&clearTimeout(o),o=setTimeout(()=>{t.document.documentElement.classList.remove(E),t.document.querySelectorAll(`[${v}]`).forEach(u=>{u.removeAttribute(v)})},1500)}}function P(t){return function(r){if(p){if(p.el.contains(r.target)){r.stopPropagation();return}b(t,!1)}const e=r.target.closest(`[${a}], [${c}]`);if(!e){t.document.querySelectorAll(`[${f}]`).forEach(s=>{s.removeAttribute(f)});return}if(r.preventDefault(),t.document.querySelectorAll(`[${f}]`).forEach(s=>{s.removeAttribute(f)}),e.setAttribute(f,""),e.getAttribute("data-sid-action")==="popup"){t.top.postMessage({source:"statamic-visual-editor",type:"popup",uid:e.getAttribute(a),sectionUid:e.parentElement?.closest(`[${a}]`)?.getAttribute(a)??null},t.location.origin);return}if(e.hasAttribute(c)){t.top.postMessage({source:"statamic-visual-editor",type:"click",field:e.getAttribute(c),scope:e.getAttribute("data-sid-field-uid")||void 0,label:e.getAttribute("data-sid-label")||void 0},t.location.origin),k(t,e,r);return}const i=e.getAttribute(a),u=Array.from(t.document.querySelectorAll(`[${a}]`)).filter(s=>s.getAttribute(a)===i).indexOf(e),l={source:"statamic-visual-editor",type:"click",uid:i};if(u>0&&(l.uidIndex=u),e.getAttribute("data-sid-type")==="text"){const s=_(e);l.afterSetUid=s?s.getAttribute(a):null}t.top.postMessage(l,t.location.origin)}}function D(t){let o=null;function r(e){if(p)return;const i=e.target.closest(`[${a}], [${c}]`);if(i&&i.hasAttribute(c)){const l=i.getAttribute(c);if(l===o)return;o=l,t.top.postMessage({source:"statamic-visual-editor",type:"hover",field:l,scope:i.getAttribute("data-sid-field-uid")||void 0,label:i.getAttribute("data-sid-label")||void 0},t.location.origin);return}const n=i?i.getAttribute(a):null;if(n===o)return;if(o=n,!n){t.top.postMessage({source:"statamic-visual-editor",type:"hover",uid:null},t.location.origin);return}const u={source:"statamic-visual-editor",type:"hover",uid:n};if(i.getAttribute("data-sid-type")==="text"){const l=_(i);u.afterSetUid=l?l.getAttribute(a):null}t.top.postMessage(u,t.location.origin)}return r.reset=()=>{o=null,t.top.postMessage({source:"statamic-visual-editor",type:"hover",uid:null},t.location.origin)},r}function S(t,o,r){const e=r&&o.querySelector(`[${a}="${r}"]`)||o,i=t.replaceAll(".","_"),n=e.querySelector(`[${c}="${t}"]`);if(n)return n;const u=[...e.querySelectorAll(`[${c}]`)].find(l=>l.getAttribute(c).replaceAll(".","_")===i);if(u)return u;for(const l of e.querySelectorAll(`[${c}]`)){const s=l.getAttribute(c).replaceAll(".","_");if(i===s||i.endsWith("_"+s))return l}return null}function I(t){t.classList.remove("sve-cp-pulse"),t.offsetWidth,t.classList.add("sve-cp-pulse"),setTimeout(()=>t.classList.remove("sve-cp-pulse"),400)}function H(t){return function(r){if(r.source!==t.top)return;const{data:e}=r;if(!(!e||e.source!=="statamic-visual-editor")){if(e.type==="edit-start"){R(t,e);return}if(e.type==="edit-deny"){d&&d.requestId===e.requestId&&(clearTimeout(d.timeout),d=null);return}if(e.type==="hover"){if(t.document.querySelectorAll(`[${g}]`).forEach(i=>{i.removeAttribute(g)}),e.field){const i=S(e.field,t.document,e.scope);i&&i.setAttribute(g,"");return}if(e.uid){const i="afterSetUid"in e?x(e.uid,e.afterSetUid,t.document):t.document.querySelector(`[${a}="${e.uid}"]`);i&&i.setAttribute(g,"")}return}if(e.type==="focus"){if(t.document.querySelectorAll(`[${f}]`).forEach(i=>{i.removeAttribute(f)}),e.field){const i=S(e.field,t.document,e.scope);i&&(i.setAttribute(f,""),e.scope&&(i.scrollIntoView({behavior:"smooth",block:"start"}),I(i)));return}if(e.uid){const i="afterSetUid"in e?x(e.uid,e.afterSetUid,t.document):t.document.querySelector(`[${a}="${e.uid}"]`);i&&(i.setAttribute(f,""),"afterSetUid"in e||(i.scrollIntoView({behavior:"smooth",block:"start"}),I(i)))}}}}}function O(t=window){if(t.self===t.top)return;t.__sveInlineEdit=t.__sveInlineEdit||{active:!1},T(t.document),C(t.document,t),new t.MutationObserver(()=>{t.document.getElementById(A)||T(t.document)}).observe(t.document.head,{childList:!0}),t.document.addEventListener("click",P(t),!0),t.document.addEventListener("mousemove",U(t),!0);const o=D(t);t.document.addEventListener("mouseover",o,!0),t.document.addEventListener("mouseleave",()=>o.reset(),!0),t.addEventListener("message",H(t))}O();
