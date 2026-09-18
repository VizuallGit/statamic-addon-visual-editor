/**
 * Responsive fieldtype tegner stadig sin egen label i den byggede addon.js.
 * Det er ikke Statamics label, og hide_display rammer den ikke.
 *
 * Own CP script (kopieres ved boot), ikke addon.js. Skjul kun den custom
 * label — Statamics egen er urørt.
 */
import { bpBase } from '../breakpoints.js';

(function () {
    'use strict';

    if (window.__sveResponsiveHideCustomLabel) {
        return;
    }
    window.__sveResponsiveHideCustomLabel = true;

    var pending = false;

    function baseBp() {
        // breakpoints.js is the one reader of `sveBreakpoints` and falls back to
        // the shipped list on its own; only the selector-safe spelling is ours.
        return String(bpBase(window)).replace(/["\\]/g, '');
    }

    function hideCustom(root) {
        if (!root || !root.querySelectorAll) {
            return;
        }

        root.querySelectorAll('.responsive-fieldtype-header > .responsive-fieldtype-label').forEach(function (el) {
            el.style.setProperty('display', 'none', 'important');
        });

        // Kun basis-størrelsens header. Den er ikke en override, den er reglen,
        // så den har ingen "arver fra"-linje at vise. Hvilken der er basis, er
        // sitets egen liste — ikke altid `laptop`.
        root.querySelectorAll('.responsive-fieldtype[data-bp="' + baseBp() + '"] > .responsive-fieldtype-header').forEach(function (el) {
            el.style.setProperty('display', 'none', 'important');
        });
    }

    function schedule() {
        if (pending) {
            return;
        }

        pending = true;
        requestAnimationFrame(function () {
            pending = false;
            hideCustom(document);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', schedule);
    } else {
        schedule();
    }

    new MutationObserver(schedule).observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
})();
