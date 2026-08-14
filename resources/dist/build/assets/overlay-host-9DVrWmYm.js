const S="statamic-visual-editor",F="sve-overlay-host-styles",h="sve-overlay-loading",c="sve-preview-loading",I="sve-keep-chrome";const W='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>';function _(e){return/\/cp(\/|$)/.test(e.location.pathname)}function U(e){return e.parent!==e.self}function j(e){const n=e.document;if(n.getElementById(F))return;const a=n.createElement("style");a.id=F,a.textContent=`
    .sve-edit-overlay {
      position: fixed; inset: 0; width: 100%; height: 100%;
      border: 0; margin: 0; z-index: 2147483200;
      opacity: 0; pointer-events: none;
      transition: opacity 380ms cubic-bezier(.4, 0, .2, 1);
    }
    .sve-edit-overlay[data-open] { opacity: 1; pointer-events: auto; }
    html.sve-editing { overflow: hidden; }
    html.sve-editing #sve-edit-button { display: none; }
    html.sve-morphing .sve-edit-overlay { transition: none; }
    html.sve-morphing::view-transition-old(root),
    html.sve-morphing::view-transition-new(root) {
      animation-duration: 380ms;
      animation-timing-function: cubic-bezier(.4, 0, .2, 1);
    }
    #${h} {
      position: fixed; top: 16px; right: 16px; z-index: 2147483300;
      display: flex; align-items: center; justify-content: center;
      width: 34px; height: 34px; border-radius: 999px;
      background: #18181b; color: #fff; box-shadow: 0 4px 14px rgba(0,0,0,.28);
      pointer-events: none;
    }
    #${h} svg { animation: sve-overlay-spin 1s linear infinite; }
    #${c} {
      position: fixed; z-index: 2147483250; box-sizing: border-box;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,.6); color: #fff;
      opacity: 0; pointer-events: none;
      transition: opacity 380ms cubic-bezier(.4, 0, .2, 1);
    }
    #${c}[data-show] { opacity: 1; pointer-events: auto; }
    #${c} .sve-spinner-chip {
      display: flex; align-items: center; justify-content: center;
      width: 44px; height: 44px; border-radius: 999px;
      background: #000; color: #fff;
      box-shadow: 0 4px 14px rgba(0,0,0,.35);
    }
    #${c} svg { animation: sve-overlay-spin 1s linear infinite; }
    @keyframes sve-overlay-spin { to { transform: rotate(360deg); } }
    @media print { #sve-edit-button, .sve-edit-overlay, #${h}, #${c} { display: none; } }
    ${_(e)?`#${h} { display: none !important; }`:""}
  `,n.head.appendChild(a)}function G(e){const n=e.document,a=n.documentElement,u=()=>n.getElementById("sve-edit-button");let i=null,l=null,b=null,v=!1,f=!1,d=!1,E=!1,A=0,M=null,m=null,p=null;j(e);function K(){const t=()=>{const o=i?.getBoundingClientRect();return!o||o.width<8||o.height<8?{left:0,top:0,width:e.innerWidth,height:e.innerHeight}:{left:o.left,top:o.top,width:o.width,height:o.height}};try{const o=i?.contentDocument,r=o?.getElementById("live-preview-iframe")||o?.querySelector(".live-preview-contents");if(!r)return t();const s=r.getBoundingClientRect(),y=i.getBoundingClientRect();return s.width<8||s.height<8?t():{left:y.left+s.left,top:y.top+s.top,width:s.width,height:s.height}}catch{return t()}}function B(t){const o=K();t.style.left=`${Math.round(o.left)}px`,t.style.top=`${Math.round(o.top)}px`,t.style.width=`${Math.round(o.width)}px`,t.style.height=`${Math.round(o.height)}px`}function N(){if(!i)return;e.clearTimeout(p);let t=n.getElementById(c);t||(t=n.createElement("div"),t.id=c,t.setAttribute("aria-hidden","true"),t.innerHTML=`<span class="sve-spinner-chip">${W}</span>`,n.body.appendChild(t),e.addEventListener("resize",x)),B(t),t.offsetWidth,t.setAttribute("data-show","")}function x(){const t=n.getElementById(c);t&&B(t)}function D(){const t=n.getElementById(c);t&&(t.removeAttribute("data-show"),e.clearTimeout(p),p=e.setTimeout(()=>{t.remove(),e.removeEventListener("resize",x),p=null},380))}function k(){e.clearTimeout(p),p=null,e.removeEventListener("resize",x),n.getElementById(c)?.remove()}function C(t){const o=n.createElement("iframe");return o.className="sve-edit-overlay",o.title="Live Preview",o.src=t,n.body.appendChild(o),o}function g(t){const o=u();o&&(t?o.setAttribute("data-loading",""):o.removeAttribute("data-loading"));const r=n.getElementById(h);if(_(e)){r?.remove();return}if(t&&!o&&!r){const s=n.createElement("div");s.id=h,s.innerHTML=W,n.body.appendChild(s)}else t||r?.remove()}function V(t,o){try{t.contentWindow.postMessage({source:S,type:o},e.location.origin)}catch{}}function L(t){if(!n.startViewTransition){t();return}a.classList.add("sve-morphing"),n.startViewTransition(t).finished.catch(()=>{}).then(()=>a.classList.remove("sve-morphing"))}function R(t){if(i){try{if(new URL(i.src,e.location.origin).href===new URL(t,e.location.origin).href)return}catch{}i.remove(),i=null,v=!1}i=C(t)}function z(){if(!(f||!i)){f=!0;try{e.history.pushState({sveEditing:!0},"",e.location.href)}catch{}L(()=>{i.setAttribute("data-open",""),a.classList.add("sve-editing")})}}function H(t){if(!i||!f){O(t);return}l&&l.remove(),N();try{e.sessionStorage.setItem(I,"1")}catch{}e.clearTimeout(b),l=C(t),b=e.setTimeout(()=>{l&&(l.remove(),l=null,D(),V(i,"lp-goto-failed"))},2e4)}function O(t){d=!0,g(!0);try{e.sessionStorage.removeItem(I)}catch{}R(t),v&&(d=!1,g(!1),z()),e.clearTimeout(M),M=e.setTimeout(()=>{d&&!v&&(d=!1,g(!1),e.location.href=t)},2e4)}function P(){e.clearTimeout(m),m=null,k(),i?.remove(),l?.remove(),i=null,l=null,v=!1,e.clearTimeout(b),l=null}function T(t,o){if(!f)return;f=!1,d=!1,g(!1),k();try{e.sessionStorage.removeItem(I)}catch{}if(_(e)){if(P(),E=!1,!t)try{e.history.back()}catch{}L(()=>a.classList.remove("sve-editing"));return}let r=null;if(o)try{const y=new URL(String(o),e.location.origin);y.origin===e.location.origin&&(r=y)}catch{}const s=r&&r.pathname!==e.location.pathname;if(E||s){if(P(),s)e.location.href=r.href;else{try{e.sessionStorage.setItem("sve-noanim","1")}catch{}e.location.reload()}return}if(!t)try{e.history.back()}catch{}L(()=>{i?.removeAttribute("data-open"),a.classList.remove("sve-editing")})}return e.addEventListener("message",t=>{if(t.origin!==e.location.origin)return;const o=i&&t.source===i.contentWindow?"frame":l&&t.source===l.contentWindow?"next":null;if(!o)return;const r=t.data;if(!(!r||r.source!==S)){if(r.type!=="lp-close"&&(A=Date.now()+1500),r.type==="lp-goto"){let s;try{s=new URL(String(r.url),e.location.origin)}catch{return}o==="frame"&&s.origin===e.location.origin&&H(s.href);return}if(r.type==="lp-ready"){if(o==="next"){e.clearTimeout(b),e.clearTimeout(m);const s=i;i=l,l=null,i.setAttribute("data-open",""),D(),m=e.setTimeout(()=>{s?.remove(),m=null},380);return}v=!0,g(!1),d&&(d=!1,z());return}if(r.type==="lp-saved")E=!0;else if(r.type==="lp-leaving")try{e.sessionStorage.setItem("sve-noanim","1")}catch{}else r.type==="lp-close"&&T(!1,r.url)}}),e.addEventListener("popstate",t=>{if(f&&!t.state?.sveEditing){if(Date.now()<A){try{e.history.pushState({sveEditing:!0},"",e.location.href)}catch{}return}T(!0)}}),{boot:R,open:O,goto:H,close:T}}function $(e=window){return e.__sveOverlayHost||(e.__sveOverlayHost=G(e)),e.__sveOverlayHost}function J(e,n){if(U(e)){Y(e,n);return}$(e).open(n)}function Y(e,n){if(U(e)){try{e.parent.postMessage({source:S,type:"lp-goto",url:n},e.location.origin)}catch{}return}$(e).goto(n)}function q(e){const n=e.document.getElementById("sve-edit-button");if(!n)return;const a=$(e),u=n.getAttribute("href");n.addEventListener("pointerenter",()=>a.boot(u)),n.addEventListener("focus",()=>a.boot(u)),n.addEventListener("click",i=>{i.metaKey||i.ctrlKey||i.shiftKey||i.button!==0||(i.preventDefault(),a.open(u))}),e.__sveWantEditor&&a.open(u)}q(window);export{Y as g,J as o};
