import { mark } from '../lib/debug.js';

/**
 * Varmer set-preview-billederne, når siden er i ro.
 *
 * Statamics set-picker henter først et sets preview-billede ved hover, og
 * URL'en er en thumbnail-route der Glide-genererer ved første kald — så første
 * hover venter på server + netværk og "dunker". URL'erne står allerede i
 * Inertia-payloaden (#statamic[data-page]), så efter idle hentes de i
 * baggrunden; hover rammer derefter cachen i både Glide og browseren.
 *
 * Læser kun data-page-strengen — rører hverken Vue eller Statamics picker.
 */
(function () {
    'use strict';

    mark('warm-set-previews');

    var MAX = 80;

    function looksLikeImage(url) {
        return /\/thumbnails\//.test(url) || /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(url);
    }

    function warm() {
        var raw = document.getElementById('statamic')?.getAttribute('data-page');

        if (!raw) return;

        var seen = {};
        var count = 0;
        var re = /"preview":"((?:[^"\\]|\\.)+)"/g;
        var match;

        while (count < MAX && (match = re.exec(raw))) {
            var url;

            try {
                url = JSON.parse('"' + match[1] + '"');
            } catch {
                continue;
            }

            if (seen[url] || !looksLikeImage(url)) continue;

            seen[url] = true;
            count++;
            new Image().src = url;
        }
    }

    var idle = window.requestIdleCallback;

    if (typeof idle === 'function') {
        idle(warm, { timeout: 6000 });
    } else {
        window.setTimeout(warm, 3000);
    }
})();
