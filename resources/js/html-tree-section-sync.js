/**
 * After a page section is removed: refresh HTML tree.
 * When none remain, clear the dock view via dock:show-empty (no autosave).
 */
(function () {
    "use strict";
    if (window.__sveHtmlTreeSectionSync === 15) return;
    window.__sveHtmlTreeSectionSync = 15;

    var askFn = null;
    var loading = null;
    var ADDON_URL = "/vendor/visual-editor/build/assets/addon-CwKv_5uQ.js";

    function unwrap(values) {
        var sve = window.sve;
        if (sve && typeof sve.unwrapRef === "function") return sve.unwrapRef(values);
        return values && values.__v_isRef ? values.value : values;
    }

    function pageSections(win) {
        var sve = window.sve;
        var field = (sve && typeof sve.sectionField === "function" && sve.sectionField(win)) || "page_sections";
        var out = [];
        if (!sve || typeof sve.activeContainers !== "function") return out;
        var containers = sve.activeContainers(win.document) || [];
        for (var i = 0; i < containers.length; i++) {
            var values = unwrap(containers[i].values);
            var list = values && typeof values === "object" ? values[field] : null;
            if (!Array.isArray(list)) continue;
            for (var j = 0; j < list.length; j++) {
                var row = list[j];
                if (!row || typeof row !== "object" || typeof row.type !== "string") continue;
                var ids = [row._visual_id, row.id, row._id].filter(function (id) {
                    return typeof id === "string" && id !== "";
                });
                if (!ids.length) continue;
                out.push({ uid: ids[0], type: row.type, ids: ids });
            }
            break;
        }
        return out;
    }

    function loadAsk() {
        if (askFn) return Promise.resolve(true);
        if (loading) return loading;
        loading = import(ADDON_URL)
            .then(function (addon) {
                if (typeof addon.S === "function") askFn = addon.S;
                return !!askFn;
            })
            .catch(function () {
                loading = null;
                return false;
            });
        return loading;
    }

    function clearEmptyDock(win) {
        if (pageSections(win).length) return;
        if (typeof askFn === "function") askFn("dock:set-html", "");
        if (win.sve && typeof win.sve.renderHtmlTree === "function") win.sve.renderHtmlTree(win);
    }

    function afterRemove(win, removedUid) {
        if (!win || !window.sve) return;
        var sections = pageSections(win);
        var next = null;
        for (var i = 0; i < sections.length; i++) {
            if (sections[i].uid !== removedUid) { next = sections[i]; break; }
        }
        if (!next && sections.length) next = sections[0];
        if (!next) {
            loadAsk().then(function () {
                clearEmptyDock(win);
            });
            win.setTimeout(function () { clearEmptyDock(win); }, 50);
            win.setTimeout(function () { clearEmptyDock(win); }, 200);
            return;
        }
        if (typeof window.sve.openLiteSection === "function") {
            window.sve.openLiteSection(next.uid, win.document, win, function () {
                if (typeof window.sve.focusFromPreview === "function") {
                    window.sve.focusFromPreview(next.uid, win.document, win, { clampToSection: true });
                }
                if (typeof window.sve.renderHtmlTree === "function") window.sve.renderHtmlTree(win);
            });
        }
        if (typeof window.sve.renderHtmlTree === "function") {
            window.sve.renderHtmlTree(win);
            win.setTimeout(function () { window.sve.renderHtmlTree(win); }, 50);
        }
    }

    function wrapRemove() {
        var sve = window.sve;
        if (!sve || typeof sve.handleRemoveRow !== "function") return false;
        if (sve.handleRemoveRow.__sveHtmlTreeSync === 15) return true;
        var orig = sve.handleRemoveRow.__sveHtmlTreeOrig || sve.handleRemoveRow;
        function wrapped(data, doc, win) {
            var uid = data && data.uid;
            var result = orig.call(this, data, doc, win);
            if (uid && win) afterRemove(win, uid);
            return result;
        }
        wrapped.__sveHtmlTreeOrig = orig;
        wrapped.__sveHtmlTreeSync = 15;
        sve.handleRemoveRow = wrapped;
        return true;
    }

    function boot() { wrapRemove(); loadAsk(); }
    boot();
    window.setInterval(boot, 500);
})();
