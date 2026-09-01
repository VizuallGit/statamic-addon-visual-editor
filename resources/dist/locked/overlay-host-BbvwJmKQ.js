const O="statamic-visual-editor",G="sve-overlay-host-styles",y="sve-overlay-loading",p="sve-preview-loading",I="sve-keep-chrome",K="sve-overlay-src",H="sve-open-in-preview-origin";function Q(e,r){try{if(e.sessionStorage.getItem(H))return;const i=new URL(String(r),e.location.origin),s=i.pathname.match(/\/collections\/([^/]+)\/entries\//);if(!s)return;e.sessionStorage.setItem(H,JSON.stringify({entry:i.pathname,from:`${i.origin}/cp/collections/${s[1]}`}))}catch{}}function X(e,r){try{e.sessionStorage.setItem(K,String(r))}catch{}}function Z(e){try{return!!e.sessionStorage.getItem(K)}catch{return!1}}const z='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>';function E(e){return/\/cp(\/|$)/.test(e.location.pathname)}function N(e){const r=e.Statamic?.$dirty;let i=[];try{const s=typeof r?.names=="function"?r.names():r?.names,o=Array.isArray(s)?s:s?.value;i=Array.isArray(o)?[...o]:[],r?.disableWarning?.(),i.forEach(a=>r?.remove?.(a))}catch{}try{e.history.back()}catch{}e.setTimeout(()=>{try{i.forEach(s=>r?.add?.(s))}catch{}},0)}function j(e,r){if(e.__sveReloadGuard)return;e.__sveReloadGuard=!0;const i=o=>function(...a){if(!r())return o.apply(this,a)};try{const o=e.location.reload.bind(e.location);e.location.reload=i(o)}catch{}try{const o=Object.getPrototypeOf(e.location),a=Object.getOwnPropertyDescriptor(o,"reload");if(a?.value&&!a.value.__sveGuarded){const d=a.value,u=i(d);u.__sveGuarded=!0,Object.defineProperty(o,"reload",{...a,value:u})}}catch{}const s=o=>{!o||o.__sveGuarded||(o.__sveGuarded=!0,o.addEventListener("message",a=>{if(!r())return;let d=a.data;try{d=typeof d=="string"?JSON.parse(d):d}catch{return}d?.type==="full-reload"&&a.stopImmediatePropagation()}))};try{const o=e.WebSocket;o&&!o.__sveGuarded&&(e.WebSocket=function(a,d){const u=d===void 0?new o(a):new o(a,d);return s(u),u},e.WebSocket.prototype=o.prototype,e.WebSocket.__sveGuarded=!0,Object.setPrototypeOf(e.WebSocket,o))}catch{}}function U(e){return e.parent!==e.self}function w(e){const r=e.document;if(r.getElementById(G))return;const i=r.createElement("style");i.id=G,i.textContent=`
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
    ${E(e)?`#${y} { display: none !important; }`:""}
  `,r.head.appendChild(i)}function ee(e){const r=e.document,i=r.documentElement,s=()=>r.getElementById("sve-edit-button");let o=null,a=null,d=null,u=!1,m=!1,h=!1,S=!1,A=null,b=null,v=null;w(e),j(e,()=>m);function V(){const t=()=>{const n=o?.getBoundingClientRect();return!n||n.width<8||n.height<8?{left:0,top:0,width:e.innerWidth,height:e.innerHeight}:{left:n.left,top:n.top,width:n.width,height:n.height}};try{const n=o?.contentDocument,l=n?.getElementById("live-preview-iframe")||n?.querySelector(".live-preview-contents");if(!l)return t();const c=l.getBoundingClientRect(),f=o.getBoundingClientRect();return c.width<8||c.height<8?t():{left:f.left+c.left,top:f.top+c.top,width:c.width,height:c.height}}catch{return t()}}function $(t){const n=V();t.style.left=`${Math.round(n.left)}px`,t.style.top=`${Math.round(n.top)}px`,t.style.width=`${Math.round(n.width)}px`,t.style.height=`${Math.round(n.height)}px`}function q(){if(!o)return;e.clearTimeout(v);let t=r.getElementById(p);t||(t=r.createElement("div"),t.id=p,t.setAttribute("aria-hidden","true"),t.innerHTML=`<span class="sve-spinner-chip">${z}</span>`,r.body.appendChild(t),e.addEventListener("resize",x)),$(t),t.offsetWidth,t.setAttribute("data-show","")}function x(){const t=r.getElementById(p);t&&$(t)}function P(){const t=r.getElementById(p);t&&(t.removeAttribute("data-show"),e.clearTimeout(v),v=e.setTimeout(()=>{t.remove(),e.removeEventListener("resize",x),v=null},380))}function R(){e.clearTimeout(v),v=null,e.removeEventListener("resize",x),r.getElementById(p)?.remove()}function k(t){const n=r.createElement("iframe");return n.className="sve-edit-overlay",n.title="Live Preview",n.src=t,r.body.appendChild(n),n}function g(t){const n=s();n&&(t?n.setAttribute("data-loading",""):n.removeAttribute("data-loading"));try{e.dispatchEvent(new CustomEvent(t?"sve-overlay-loading":"sve-overlay-idle"))}catch{}const l=r.getElementById(y);if(E(e)){l?.remove();return}if(t&&!n&&!l){const c=r.createElement("div");c.id=y,c.innerHTML=z,r.body.appendChild(c)}else t||l?.remove()}function Y(t,n){try{t.contentWindow.postMessage({source:O,type:n},e.location.origin)}catch{}}function _(t){if(!r.startViewTransition){t();return}i.classList.add("sve-morphing"),r.startViewTransition(t).finished.catch(()=>{}).then(()=>i.classList.remove("sve-morphing"))}function B(t){if(Q(e,t),X(e,t),o){try{if(new URL(o.src,e.location.origin).href===new URL(t,e.location.origin).href)return}catch{}o.remove(),o=null,u=!1}o=k(t)}function L(){if(!(m||!o)){m=!0;try{e.history.pushState({sveEditing:!0},"",e.location.href)}catch{}_(()=>{o.setAttribute("data-open",""),i.classList.add("sve-editing")}),j(e,()=>m)}}function M(t){if(!o||!m){C(t);return}a&&a.remove(),q();try{e.sessionStorage.setItem(I,"1")}catch{}e.clearTimeout(d),a=k(t),d=e.setTimeout(()=>{a&&(a.remove(),a=null,P(),Y(o,"lp-goto-failed"))},2e4)}function C(t){h=!0;try{e.sessionStorage.removeItem(I)}catch{}if(B(t),u){h=!1,g(!1),L();return}g(!0),e.clearTimeout(A),A=e.setTimeout(()=>{h&&!u&&o?(u=!0,h=!1,g(!1),L()):h&&!u&&(h=!1,g(!1),e.location.href=t)},8e3)}function W(){e.clearTimeout(b),b=null,R(),o?.remove(),a?.remove(),o=null,a=null,u=!1,e.clearTimeout(d),a=null}function D(t,n){if(!m)return;m=!1,h=!1,g(!1),R();try{e.sessionStorage.removeItem(I)}catch{}if(E(e)){W(),S=!1,t||N(e),_(()=>i.classList.remove("sve-editing"));return}let l=null;if(n)try{const f=new URL(String(n),e.location.origin);f.origin===e.location.origin&&(l=f)}catch{}const c=l&&l.pathname!==e.location.pathname;if(S||c){if(W(),c)e.location.href=l.href;else{try{e.sessionStorage.setItem("sve-noanim","1")}catch{}e.location.reload()}return}t||N(e),_(()=>{o?.removeAttribute("data-open"),i.classList.remove("sve-editing")})}return e.addEventListener("message",t=>{if(t.origin!==e.location.origin)return;const n=t.data;if(!n||n.source!==O)return;let l=o&&t.source===o.contentWindow?"frame":a&&t.source===a.contentWindow?"next":null;if(!l){const f=[...r.querySelectorAll("iframe.sve-edit-overlay")].find(J=>{try{return t.source===J.contentWindow}catch{return!1}});if(!f)return;l=a&&f===a?"next":"frame",l==="frame"&&f!==o&&(o=f)}if(n.type==="lp-goto"){let c;try{c=new URL(String(n.url),e.location.origin)}catch{return}l==="frame"&&c.origin===e.location.origin&&M(c.href);return}if(n.type==="lp-ready"){if(l==="next"){e.clearTimeout(d),e.clearTimeout(b);const c=o;o=a,a=null,o.setAttribute("data-open",""),P(),b=e.setTimeout(()=>{c?.remove(),b=null},380);return}u=!0,g(!1),h&&(h=!1,L());return}if(n.type==="lp-saved")S=!0;else if(n.type==="lp-leaving")try{e.sessionStorage.setItem("sve-noanim","1")}catch{}else n.type==="lp-close"&&D(!1,n.url)}),e.addEventListener("popstate",t=>{if(m){t.stopImmediatePropagation();try{e.history.replaceState({sveEditing:!0},"",e.location.href)}catch{}}},!0),{boot:B,open:C,goto:M,close:D}}function T(e=window){return e.__sveOverlayHost||(e.__sveOverlayHost=ee(e)),e.__sveOverlayHost}function ne(e,r){if(U(e)){te(e,r);return}T(e).open(r)}function te(e,r){if(U(e)){try{e.parent.postMessage({source:O,type:"lp-goto",url:r},e.location.origin)}catch{}return}T(e).goto(r)}function F(e){e.document.getElementById("sve-edit-button")?.setAttribute("data-ready","")}function oe(e){return new Promise(r=>{const i=()=>{const s=e.document.fonts?.ready;s&&typeof s.then=="function"?Promise.resolve(s).then(()=>r(),()=>r()):r()};e.document.readyState==="complete"?i():e.addEventListener("load",i,{once:!0})})}function re(e){const r=e.document.getElementById("sve-edit-button");if(!r)return;const i=T(e),s=r.getAttribute("href");if(r.addEventListener("pointerenter",()=>i.boot(s)),r.addEventListener("pointerdown",()=>i.boot(s)),r.addEventListener("focus",()=>i.boot(s)),r.addEventListener("click",o=>{o.metaKey||o.ctrlKey||o.shiftKey||o.button!==0||(o.preventDefault(),i.open(s))},!0),e.__sveWantEditor){F(e),i.open(s);return}oe(e).then(()=>{F(e),!E(e)&&Z(e)&&i.boot(s)})}re(window);export{te as gotoOverlay,T as installOverlayHost,ne as openOverlay};
