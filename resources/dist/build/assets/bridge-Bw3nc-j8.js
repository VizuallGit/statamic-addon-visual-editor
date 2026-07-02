const c="data-sid-active",f="data-sid-hover",p="data-sid-inner",a="data-sid",u="data-sid-field",v="__sve-bridge-styles",m="sve-mouse-active";function h(t,r){let e="currentColor",i="#9CA3AF";try{const l=getComputedStyle(r.top.document.documentElement);e=l.getPropertyValue("--focus-outline-color").trim()||e,i=l.getPropertyValue("--theme-color-gray-400").trim()||i}catch{}t.documentElement.style.setProperty("--sve-outline-width","2px"),t.documentElement.style.setProperty("--sve-outline-opacity","60%"),t.documentElement.style.setProperty("--sve-focus-color",e),t.documentElement.style.setProperty("--sve-hover-color",i)}function S(t){if(t.getElementById(v))return;const r=t.createElement("style");r.id=v,r.textContent=`
        [data-sid], [data-sid-field] {
            cursor: pointer;
            outline-width: var(--sve-outline-width, 1px);
            outline-style: dashed;
            outline-color: transparent;
            outline-offset: 2px;
            transition: outline-color 0.15s ease;
        }
        .${m} [data-sid], .${m} [data-sid-field] {
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
    `,t.head.appendChild(r)}function g(t){let r=t.previousElementSibling;for(;r;){if(r.hasAttribute(a)&&r.getAttribute("data-sid-type")!=="text")return r;const s=r.querySelector(`[${a}]:not([data-sid-type="text"])`);if(s)return s;r=r.previousElementSibling}return null}function b(t,r,s){if(r===null)return s.querySelector(`[${a}="${t}"][data-sid-type="text"]`);const o=s.querySelector(`[${a}="${r}"]`);if(!o)return null;let e=o;for(;e.parentElement&&!e.parentElement.hasAttribute(a)&&!e.nextElementSibling;)e=e.parentElement;let i=e.nextElementSibling;for(;i;){if(i.hasAttribute(a)&&i.getAttribute("data-sid-type")==="text")return i;i=i.nextElementSibling}return null}function E(t){let r=null;return function(o){t.document.documentElement.classList.add(m);const e=t.document.querySelector(`[${p}]`),i=o.target.closest(`[${a}], [${u}]`);e!==i&&(e&&e.removeAttribute(p),i&&i.setAttribute(p,"")),r&&clearTimeout(r),r=setTimeout(()=>{t.document.documentElement.classList.remove(m),t.document.querySelectorAll(`[${p}]`).forEach(l=>{l.removeAttribute(p)})},1500)}}function x(t){return function(s){const o=s.target.closest(`[${a}], [${u}]`);if(!o){t.document.querySelectorAll(`[${c}]`).forEach(d=>{d.removeAttribute(c)});return}if(s.preventDefault(),t.document.querySelectorAll(`[${c}]`).forEach(d=>{d.removeAttribute(c)}),o.setAttribute(c,""),o.getAttribute("data-sid-action")==="popup"){t.top.postMessage({source:"statamic-visual-editor",type:"popup",uid:o.getAttribute(a)},t.location.origin);return}if(o.hasAttribute(u)){t.top.postMessage({source:"statamic-visual-editor",type:"click",field:o.getAttribute(u),scope:o.getAttribute("data-sid-field-uid")||void 0,label:o.getAttribute("data-sid-label")||void 0},t.location.origin);return}const e=o.getAttribute(a),l=Array.from(t.document.querySelectorAll(`[${a}]`)).filter(d=>d.getAttribute(a)===e).indexOf(o),n={source:"statamic-visual-editor",type:"click",uid:e};if(l>0&&(n.uidIndex=l),o.getAttribute("data-sid-type")==="text"){const d=g(o);n.afterSetUid=d?d.getAttribute(a):null}t.top.postMessage(n,t.location.origin)}}function $(t){let r=null;function s(o){const e=o.target.closest(`[${a}], [${u}]`);if(e&&e.hasAttribute(u)){const n=e.getAttribute(u);if(n===r)return;r=n,t.top.postMessage({source:"statamic-visual-editor",type:"hover",field:n,scope:e.getAttribute("data-sid-field-uid")||void 0,label:e.getAttribute("data-sid-label")||void 0},t.location.origin);return}const i=e?e.getAttribute(a):null;if(i===r)return;if(r=i,!i){t.top.postMessage({source:"statamic-visual-editor",type:"hover",uid:null},t.location.origin);return}const l={source:"statamic-visual-editor",type:"hover",uid:i};if(e.getAttribute("data-sid-type")==="text"){const n=g(e);l.afterSetUid=n?n.getAttribute(a):null}t.top.postMessage(l,t.location.origin)}return s.reset=()=>{r=null,t.top.postMessage({source:"statamic-visual-editor",type:"hover",uid:null},t.location.origin)},s}function y(t,r,s){const o=s&&r.querySelector(`[${a}="${s}"]`)||r,e=t.replaceAll(".","_"),i=o.querySelector(`[${u}="${t}"]`);if(i)return i;const l=[...o.querySelectorAll(`[${u}]`)].find(n=>n.getAttribute(u).replaceAll(".","_")===e);if(l)return l;for(const n of o.querySelectorAll(`[${u}]`)){const d=n.getAttribute(u).replaceAll(".","_");if(e===d||e.endsWith("_"+d))return n}return null}function A(t){t.classList.remove("sve-cp-pulse"),t.offsetWidth,t.classList.add("sve-cp-pulse"),setTimeout(()=>t.classList.remove("sve-cp-pulse"),400)}function _(t){return function(s){if(s.source!==t.top)return;const{data:o}=s;if(!(!o||o.source!=="statamic-visual-editor")){if(o.type==="hover"){if(t.document.querySelectorAll(`[${f}]`).forEach(e=>{e.removeAttribute(f)}),o.field){const e=y(o.field,t.document,o.scope);e&&e.setAttribute(f,"");return}if(o.uid){const e="afterSetUid"in o?b(o.uid,o.afterSetUid,t.document):t.document.querySelector(`[${a}="${o.uid}"]`);e&&e.setAttribute(f,"")}return}if(o.type==="focus"){if(t.document.querySelectorAll(`[${c}]`).forEach(e=>{e.removeAttribute(c)}),o.field){const e=y(o.field,t.document,o.scope);e&&(e.setAttribute(c,""),o.scope&&(e.scrollIntoView({behavior:"smooth",block:"start"}),A(e)));return}if(o.uid){const e="afterSetUid"in o?b(o.uid,o.afterSetUid,t.document):t.document.querySelector(`[${a}="${o.uid}"]`);e&&(e.setAttribute(c,""),"afterSetUid"in o||(e.scrollIntoView({behavior:"smooth",block:"start"}),A(e)))}}}}}function T(t=window){if(t.self===t.top)return;S(t.document),h(t.document,t),t.document.addEventListener("click",x(t),!0),t.document.addEventListener("mousemove",E(t),!0);const r=$(t);t.document.addEventListener("mouseover",r,!0),t.document.addEventListener("mouseleave",()=>r.reset(),!0),t.addEventListener("message",_(t))}T();
