/**
 * Responsive fieldtype tegner stadig sin egen label i den byggede addon.js.
 * Det er ikke Statamics label, og hide_display rammer den ikke.
 *
 * Own CP script (kopieres ved boot), ikke addon.js. Skjul kun den custom
 * label — Statamics egen er urørt.
 */
(function () {
    'use strict';

    if (window.__sveResponsiveHideCustomLabel) {
        return;
    }
    window.__sveResponsiveHideCustomLabel = true;

    var pending = false;

    function hideCustom(root) {
        if (!root || !root.querySelectorAll) {
            return;
        }

        root.querySelectorAll('.responsive-fieldtype-header > .responsive-fieldtype-label').forEach(function (el) {
            el.style.setProperty('display', 'none', 'important');
        });

        root.querySelectorAll('.responsive-fieldtype[data-bp="laptop"] > .responsive-fieldtype-header').forEach(function (el) {
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
