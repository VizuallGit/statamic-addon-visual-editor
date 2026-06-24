const d="data-sid-active",p="data-sid-hover",c="data-sid-inner",a="data-sid",n="data-sid-field",v="__sve-bridge-styles",f="sve-mouse-active";function h(t,r){let e="currentColor",i="#9CA3AF";try{const u=getComputedStyle(r.top.document.documentElement);e=u.getPropertyValue("--focus-outline-color").trim()||e,i=u.getPropertyValue("--theme-color-gray-400").trim()||i}catch{}t.documentElement.style.setProperty("--sve-outline-width","2px"),t.documentElement.style.setProperty("--sve-outline-opacity","60%"),t.documentElement.style.setProperty("--sve-focus-color",e),t.documentElement.style.setProperty("--sve-hover-color",i)}function E(t){if(t.getElementById(v))return;const r=t.createElement("style");r.id=v,r.textContent=`
        [data-sid], [data-sid-field] {
            cursor: pointer;
            outline-width: var(--sve-outline-width, 1px);
            outline-style: dashed;
            outline-color: transparent;
            outline-offset: 2px;
            transition: outline-color 0.15s ease;
        }
        .${f} [data-sid], .${f} [data-sid-field] {
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
    `,t.head.appendChild(r)}function g(t){let r=t.previousElementSibling;for(;r;){if(r.hasAttribute(a)&&r.getAttribute("data-sid-type")!=="text")return r;const s=r.querySelector(`[${a}]:not([data-sid-type="text"])`);if(s)return s;r=r.previousElementSibling}return null}function b(t,r,s){if(r===null)return s.querySelector(`[${a}="${t}"][data-sid-type="text"]`);const o=s.querySelector(`[${a}="${r}"]`);if(!o)return null;let e=o;for(;e.parentElement&&!e.parentElement.hasAttribute(a)&&!e.nextElementSibling;)e=e.parentElement;let i=e.nextElementSibling;for(;i;){if(i.hasAttribute(a)&&i.getAttribute("data-sid-type")==="text")return i;i=i.nextElementSibling}return null}function S(t){let r=null;return function(o){t.document.documentElement.classList.add(f);const e=t.document.querySelector(`[${c}]`),i=o.target.closest(`[${a}], [${n}]`);e!==i&&(e&&e.removeAttribute(c),i&&i.setAttribute(c,"")),r&&clearTimeout(r),r=setTimeout(()=>{t.document.documentElement.classList.remove(f),t.document.querySelectorAll(`[${c}]`).forEach(u=>{u.removeAttribute(c)})},1500)}}function x(t){return function(s){const o=s.target.closest(`[${a}], [${n}]`);if(!o){t.document.querySelectorAll(`[${d}]`).forEach(i=>{i.removeAttribute(d)});return}if(s.preventDefault(),t.document.querySelectorAll(`[${d}]`).forEach(i=>{i.removeAttribute(d)}),o.setAttribute(d,""),o.hasAttribute(n)){t.top.postMessage({source:"statamic-visual-editor",type:"click",field:o.getAttribute(n),scope:o.getAttribute("data-sid-field-uid")||void 0,label:o.getAttribute("data-sid-label")||void 0},t.location.origin);return}const e={source:"statamic-visual-editor",type:"click",uid:o.getAttribute(a)};if(o.getAttribute("data-sid-type")==="text"){const i=g(o);e.afterSetUid=i?i.getAttribute(a):null}t.top.postMessage(e,t.location.origin)}}function $(t){let r=null;function s(o){const e=o.target.closest(`[${a}], [${n}]`);if(e&&e.hasAttribute(n)){const l=e.getAttribute(n);if(l===r)return;r=l,t.top.postMessage({source:"statamic-visual-editor",type:"hover",field:l,scope:e.getAttribute("data-sid-field-uid")||void 0,label:e.getAttribute("data-sid-label")||void 0},t.location.origin);return}const i=e?e.getAttribute(a):null;if(i===r)return;if(r=i,!i){t.top.postMessage({source:"statamic-visual-editor",type:"hover",uid:null},t.location.origin);return}const u={source:"statamic-visual-editor",type:"hover",uid:i};if(e.getAttribute("data-sid-type")==="text"){const l=g(e);u.afterSetUid=l?l.getAttribute(a):null}t.top.postMessage(u,t.location.origin)}return s.reset=()=>{r=null,t.top.postMessage({source:"statamic-visual-editor",type:"hover",uid:null},t.location.origin)},s}function y(t,r,s){const o=s&&r.querySelector(`[${a}="${s}"]`)||r,e=t.replaceAll(".","_"),i=o.querySelector(`[${n}="${t}"]`);if(i)return i;const u=[...o.querySelectorAll(`[${n}]`)].find(l=>l.getAttribute(n).replaceAll(".","_")===e);if(u)return u;for(const l of o.querySelectorAll(`[${n}]`)){const m=l.getAttribute(n).replaceAll(".","_");if(e===m||e.endsWith("_"+m))return l}return null}function A(t){t.classList.remove("sve-cp-pulse"),t.offsetWidth,t.classList.add("sve-cp-pulse"),setTimeout(()=>t.classList.remove("sve-cp-pulse"),400)}function _(t){return function(s){if(s.source!==t.top)return;const{data:o}=s;if(!(!o||o.source!=="statamic-visual-editor")){if(o.type==="hover"){if(t.document.querySelectorAll(`[${p}]`).forEach(e=>{e.removeAttribute(p)}),o.field){const e=y(o.field,t.document,o.scope);e&&e.setAttribute(p,"");return}if(o.uid){const e="afterSetUid"in o?b(o.uid,o.afterSetUid,t.document):t.document.querySelector(`[${a}="${o.uid}"]`);e&&e.setAttribute(p,"")}return}if(o.type==="focus"){if(t.document.querySelectorAll(`[${d}]`).forEach(e=>{e.removeAttribute(d)}),o.field){const e=y(o.field,t.document,o.scope);e&&(e.setAttribute(d,""),e.scrollIntoView({behavior:"smooth",block:"start"}),A(e));return}if(o.uid){const e="afterSetUid"in o?b(o.uid,o.afterSetUid,t.document):t.document.querySelector(`[${a}="${o.uid}"]`);e&&(e.setAttribute(d,""),e.scrollIntoView({behavior:"smooth",block:"start"}),A(e))}}}}}function T(t=window){if(t.self===t.top)return;E(t.document),h(t.document,t),t.document.addEventListener("click",x(t),!0),t.document.addEventListener("mousemove",S(t),!0);const r=$(t);t.document.addEventListener("mouseover",r,!0),t.document.addEventListener("mouseleave",()=>r.reset(),!0),t.addEventListener("message",_(t))}T();
