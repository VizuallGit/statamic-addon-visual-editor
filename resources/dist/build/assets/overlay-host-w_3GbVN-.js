const I="statamic-visual-editor",G="sve-overlay-host-styles",y="sve-overlay-loading",p="sve-preview-loading",L="sve-keep-chrome",H="sve-open-in-preview-origin";function Y(e,n){try{if(e.sessionStorage.getItem(H))return;const a=new URL(String(n),e.location.origin),s=a.pathname.match(/\/collections\/([^/]+)\/entries\//);if(!s)return;e.sessionStorage.setItem(H,JSON.stringify({entry:a.pathname,from:`${a.origin}/cp/collections/${s[1]}`}))}catch{}}const z='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>';function A(e){return/\/cp(\/|$)/.test(e.location.pathname)}function N(e){const n=e.Statamic?.$dirty;let a=[];try{const s=typeof n?.names=="function"?n.names():n?.names,o=Array.isArray(s)?s:s?.value;a=Array.isArray(o)?[...o]:[],n?.disableWarning?.(),a.forEach(i=>n?.remove?.(i))}catch{}try{e.history.back()}catch{}e.setTimeout(()=>{try{a.forEach(s=>n?.add?.(s))}catch{}},0)}function j(e,n){if(e.__sveReloadGuard)return;e.__sveReloadGuard=!0;const a=o=>function(...i){if(!n())return o.apply(this,i)};try{const o=e.location.reload.bind(e.location);e.location.reload=a(o)}catch{}try{const o=Object.getPrototypeOf(e.location),i=Object.getOwnPropertyDescriptor(o,"reload");if(i?.value&&!i.value.__sveGuarded){const d=i.value,u=a(d);u.__sveGuarded=!0,Object.defineProperty(o,"reload",{...i,value:u})}}catch{}const s=o=>{!o||o.__sveGuarded||(o.__sveGuarded=!0,o.addEventListener("message",i=>{if(!n())return;let d=i.data;try{d=typeof d=="string"?JSON.parse(d):d}catch{return}d?.type==="full-reload"&&i.stopImmediatePropagation()}))};try{const o=e.WebSocket;o&&!o.__sveGuarded&&(e.WebSocket=function(i,d){const u=d===void 0?new o(i):new o(i,d);return s(u),u},e.WebSocket.prototype=o.prototype,e.WebSocket.__sveGuarded=!0,Object.setPrototypeOf(e.WebSocket,o))}catch{}}function U(e){return e.parent!==e.self}function Q(e){const n=e.document;if(n.getElementById(G))return;const a=n.createElement("style");a.id=G,a.textContent=`
    .sve-edit-overlay {
      position: fixed; top: 0; left: -12000px;
      width: 1440px; height: 900px;
      border: 0; margin: 0; z-index: 2147483200;
      opacity: 0; pointer-events: none;
      contain: strict;
      transition: opacity 380ms cubic-bezier(.4, 0, .2, 1);
    }
    .sve-edit-overlay[data-open] {
      inset: 0; left: 0; width: 100%; height: 100%;
      opacity: 1; pointer-events: auto; contain: none;
    }
    html.sve-editing { overflow: hidden; }
    html.sve-editing,
    html.sve-editing body {
      background: #18181b !important;
    }
    html.sve-editing #sve-edit-button { display: none; }
    html.sve-morphing .sve-edit-overlay { transition: none; }
    html.sve-morphing::view-transition-old(root),
    html.sve-morphing::view-transition-new(root) {
      animation-duration: 380ms;
      animation-timing-function: cubic-bezier(.4, 0, .2, 1);
    }
    #${y} {
      position: fixed; top: 16px; right: 16px; z-index: 2147483300;
      display: flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border-radius: 999px;
      background: #18181b; color: #fff; box-shadow: 0 4px 14px rgba(0,0,0,.28);
      pointer-events: none;
    }
    #${y} svg { animation: sve-overlay-spin 1s linear infinite; }
    #${p} {
      position: fixed; z-index: 2147483250; box-sizing: border-box;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,.6); color: #fff;
      opacity: 0; pointer-events: none;
      transition: opacity 380ms cubic-bezier(.4, 0, .2, 1);
    }
    #${p}[data-show] { opacity: 1; pointer-events: auto; }
    #${p} .sve-spinner-chip {
      display: flex; align-items: center; justify-content: center;
      width: 44px; height: 44px; border-radius: 999px;
      background: #000; color: #fff;
      box-shadow: 0 4px 14px rgba(0,0,0,.35);
    }
    #${p} svg { animation: sve-overlay-spin 1s linear infinite; }
    @keyframes sve-overlay-spin { to { transform: rotate(360deg); } }
    @media print { #sve-edit-button, .sve-edit-overlay, #${y}, #${p} { display: none; } }
    ${A(e)?`#${y} { display: none !important; }`:""}
  `,n.head.appendChild(a)}function X(e){const n=e.document,a=n.documentElement,s=()=>n.getElementById("sve-edit-button");let o=null,i=null,d=null,u=!1,m=!1,h=!1,E=!1,T=null,b=null,v=null;Q(e),j(e,()=>m);function K(){const t=()=>{const r=o?.getBoundingClientRect();return!r||r.width<8||r.height<8?{left:0,top:0,width:e.innerWidth,height:e.innerHeight}:{left:r.left,top:r.top,width:r.width,height:r.height}};try{const r=o?.contentDocument,c=r?.getElementById("live-preview-iframe")||r?.querySelector(".live-preview-contents");if(!c)return t();const l=c.getBoundingClientRect(),f=o.getBoundingClientRect();return l.width<8||l.height<8?t():{left:f.left+l.left,top:f.top+l.top,width:l.width,height:l.height}}catch{return t()}}function $(t){const r=K();t.style.left=`${Math.round(r.left)}px`,t.style.top=`${Math.round(r.top)}px`,t.style.width=`${Math.round(r.width)}px`,t.style.height=`${Math.round(r.height)}px`}function V(){if(!o)return;e.clearTimeout(v);let t=n.getElementById(p);t||(t=n.createElement("div"),t.id=p,t.setAttribute("aria-hidden","true"),t.innerHTML=`<span class="sve-spinner-chip">${z}</span>`,n.body.appendChild(t),e.addEventListener("resize",x)),$(t),t.offsetWidth,t.setAttribute("data-show","")}function x(){const t=n.getElementById(p);t&&$(t)}function P(){const t=n.getElementById(p);t&&(t.removeAttribute("data-show"),e.clearTimeout(v),v=e.setTimeout(()=>{t.remove(),e.removeEventListener("resize",x),v=null},380))}function R(){e.clearTimeout(v),v=null,e.removeEventListener("resize",x),n.getElementById(p)?.remove()}function k(t){const r=n.createElement("iframe");return r.className="sve-edit-overlay",r.title="Live Preview",r.src=t,n.body.appendChild(r),r}function g(t){const r=s();r&&(t?r.setAttribute("data-loading",""):r.removeAttribute("data-loading"));try{e.dispatchEvent(new CustomEvent(t?"sve-overlay-loading":"sve-overlay-idle"))}catch{}const c=n.getElementById(y);if(A(e)){c?.remove();return}if(t&&!r&&!c){const l=n.createElement("div");l.id=y,l.innerHTML=z,n.body.appendChild(l)}else t||c?.remove()}function q(t,r){try{t.contentWindow.postMessage({source:I,type:r},e.location.origin)}catch{}}function _(t){if(!n.startViewTransition){t();return}a.classList.add("sve-morphing"),n.startViewTransition(t).finished.catch(()=>{}).then(()=>a.classList.remove("sve-morphing"))}function B(t){if(Y(e,t),o){try{if(new URL(o.src,e.location.origin).href===new URL(t,e.location.origin).href)return}catch{}o.remove(),o=null,u=!1}o=k(t)}function S(){if(!(m||!o)){m=!0;try{e.history.pushState({sveEditing:!0},"",e.location.href)}catch{}_(()=>{o.setAttribute("data-open",""),a.classList.add("sve-editing")}),j(e,()=>m)}}function M(t){if(!o||!m){W(t);return}i&&i.remove(),V();try{e.sessionStorage.setItem(L,"1")}catch{}e.clearTimeout(d),i=k(t),d=e.setTimeout(()=>{i&&(i.remove(),i=null,P(),q(o,"lp-goto-failed"))},2e4)}function W(t){h=!0;try{e.sessionStorage.removeItem(L)}catch{}if(B(t),u){h=!1,g(!1),S();return}g(!0),e.clearTimeout(T),T=e.setTimeout(()=>{h&&!u&&o?(u=!0,h=!1,g(!1),S()):h&&!u&&(h=!1,g(!1),e.location.href=t)},8e3)}function C(){e.clearTimeout(b),b=null,R(),o?.remove(),i?.remove(),o=null,i=null,u=!1,e.clearTimeout(d),i=null}function D(t,r){if(!m)return;m=!1,h=!1,g(!1),R();try{e.sessionStorage.removeItem(L)}catch{}if(A(e)){C(),E=!1,t||N(e),_(()=>a.classList.remove("sve-editing"));return}let c=null;if(r)try{const f=new URL(String(r),e.location.origin);f.origin===e.location.origin&&(c=f)}catch{}const l=c&&c.pathname!==e.location.pathname;if(E||l){if(C(),l)e.location.href=c.href;else{try{e.sessionStorage.setItem("sve-noanim","1")}catch{}e.location.reload()}return}t||N(e),_(()=>{o?.removeAttribute("data-open"),a.classList.remove("sve-editing")})}return e.addEventListener("message",t=>{if(t.origin!==e.location.origin)return;const r=t.data;if(!r||r.source!==I)return;let c=o&&t.source===o.contentWindow?"frame":i&&t.source===i.contentWindow?"next":null;if(!c){const f=[...n.querySelectorAll("iframe.sve-edit-overlay")].find(J=>{try{return t.source===J.contentWindow}catch{return!1}});if(!f)return;c=i&&f===i?"next":"frame",c==="frame"&&f!==o&&(o=f)}if(r.type==="lp-goto"){let l;try{l=new URL(String(r.url),e.location.origin)}catch{return}c==="frame"&&l.origin===e.location.origin&&M(l.href);return}if(r.type==="lp-ready"){if(c==="next"){e.clearTimeout(d),e.clearTimeout(b);const l=o;o=i,i=null,o.setAttribute("data-open",""),P(),b=e.setTimeout(()=>{l?.remove(),b=null},380);return}u=!0,g(!1),h&&(h=!1,S());return}if(r.type==="lp-saved")E=!0;else if(r.type==="lp-leaving")try{e.sessionStorage.setItem("sve-noanim","1")}catch{}else r.type==="lp-close"&&D(!1,r.url)}),e.addEventListener("popstate",t=>{if(m){t.stopImmediatePropagation();try{e.history.replaceState({sveEditing:!0},"",e.location.href)}catch{}}},!0),{boot:B,open:W,goto:M,close:D}}function O(e=window){return e.__sveOverlayHost||(e.__sveOverlayHost=X(e)),e.__sveOverlayHost}function te(e,n){if(U(e)){Z(e,n);return}O(e).open(n)}function Z(e,n){if(U(e)){try{e.parent.postMessage({source:I,type:"lp-goto",url:n},e.location.origin)}catch{}return}O(e).goto(n)}function F(e){e.document.getElementById("sve-edit-button")?.setAttribute("data-ready","")}function w(e){return new Promise(n=>{const a=()=>{const s=e.document.fonts?.ready;s&&typeof s.then=="function"?Promise.resolve(s).then(()=>n(),()=>n()):n()};e.document.readyState==="complete"?a():e.addEventListener("load",a,{once:!0})})}function ee(e){const n=e.document.getElementById("sve-edit-button");if(!n)return;const a=O(e),s=n.getAttribute("href");if(n.addEventListener("pointerenter",()=>a.boot(s)),n.addEventListener("pointerdown",()=>a.boot(s)),n.addEventListener("focus",()=>a.boot(s)),n.addEventListener("click",o=>{o.metaKey||o.ctrlKey||o.shiftKey||o.button!==0||(o.preventDefault(),a.open(s))},!0),e.__sveWantEditor){F(e),a.open(s);return}w(e).then(()=>{F(e)})}ee(window);export{Z as g,te as o};
