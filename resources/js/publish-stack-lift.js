/**
 * Publicér-popup only. addon.js used to pin every stack (that stole focus);
 * disable-publish-stack-pin turns that observer off, which also left Publish
 * under the right sidebar (z-index 41). This file lifts that one dialog to
 * #__sve-publish-teleport at z-index 200 — same place as before. Iconify,
 * field settings, overlay and live preview are not touched.
 *
 * Must run after disable-publish-stack-pin.js ($scripts).
 */
(function () {
    'use strict';

    if (window.__svePublishStackLift) {
        return;
    }
    window.__svePublishStackLift = true;

    var HOST_ID = '__sve-publish-teleport';
    var homes = new WeakMap();
    var scheduled = false;

    function hostEl() {
        var host = document.getElementById(HOST_ID);
        if (!host) {
            host = document.createElement('div');
            host.id = HOST_ID;
            document.body.appendChild(host);
        }
        return host;
    }

    function isPublishPanel(panel) {
        if (!panel) {
            return false;
        }
        if (/search and select an icon/i.test(panel.textContent || '')) {
            return false;
        }
        var title = panel.querySelector('[data-ui-stack-title], h2, h3');
        var raw = ((title && title.textContent) || '').trim();
        return /^(publish|publicér|publicer)$/i.test(raw);
    }

    function pin(panel) {
        var box = panel.getBoundingClientRect();
        var gap = Math.round(box.top);
        panel.style.setProperty('position', 'fixed', 'important');
        panel.style.setProperty('top', gap + 'px', 'important');
        panel.style.setProperty('right', gap + 'px', 'important');
        panel.style.setProperty('left', 'auto', 'important');
        panel.style.setProperty('width', Math.round(box.width) + 'px', 'important');
        panel.style.setProperty('height', Math.round(window.innerHeight - gap * 2) + 'px', 'important');
        panel.style.setProperty('z-index', '200', 'important');
        panel.style.setProperty('margin', '0', 'important');
        panel.style.setProperty('pointer-events', 'auto', 'important');
    }

    function unpin(panel) {
        ['position', 'top', 'right', 'left', 'width', 'height', 'z-index', 'margin', 'pointer-events'].forEach(function (prop) {
            panel.style.removeProperty(prop);
        });
    }

    function restore(panel) {
        var home = homes.get(panel);
        unpin(panel);
        if (home && home.parentNode) {
            home.parentNode.insertBefore(panel, home);
            home.remove();
        }
        homes.delete(panel);
    }

    function sync() {
        var host = document.getElementById(HOST_ID);
        var open = document.querySelector('.portal-targets.stacks-on-stacks');

        if (!open) {
            if (host) {
                host.querySelectorAll('.stack-content').forEach(restore);
            }
            return;
        }

        var target = hostEl();
        document.querySelectorAll('.portal-targets .stack-content, #__sve-publish-teleport .stack-content').forEach(function (panel) {
            if (!isPublishPanel(panel)) {
                return;
            }
            if (panel.parentElement === target) {
                return;
            }
            pin(panel);
            var home = document.createComment('sve-publish-home');
            panel.parentNode.insertBefore(home, panel);
            homes.set(panel, home);
            target.appendChild(panel);
        });
    }

    function schedule() {
        if (scheduled) {
            return;
        }
        scheduled = true;
        requestAnimationFrame(function () {
            scheduled = false;
            sync();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', schedule);
    } else {
        schedule();
    }

    new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
