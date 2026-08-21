/**
 * addon.js pins .stack-content on every DOM mutation. Text and select then
 * lose focus. Hiding the stack portal (querySelector → null) made Iconify
 * search empty. This file only no-ops that one pin observer. Not addon.js.
 *
 * Must run before addon.js ($scripts).
 */
(function () {
    'use strict';

    var Orig = window.MutationObserver;
    if (!Orig || Orig.__sveNoPublishPin) {
        return;
    }

    function MutationObserver(callback) {
        var src = typeof callback === 'function' ? Function.prototype.toString.call(callback) : '';
        if (src.indexOf('requestAnimationFrame(()=>{r=!1,c()})') !== -1) {
            callback = function () {};
        }
        return new Orig(callback);
    }

    MutationObserver.prototype = Orig.prototype;
    MutationObserver.__sveNoPublishPin = true;
    window.MutationObserver = MutationObserver;
})();
