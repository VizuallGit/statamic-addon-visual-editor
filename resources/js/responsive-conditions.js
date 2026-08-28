/**
 * Statamic field conditions + sve_responsive.
 *
 * Responsive stores `{ laptop: { handle: val }, tablet?: …, mobile?: … }`.
 * Statamic's equals/contains compares the sibling value as a whole — an object
 * always fails (`isObject(lhs) → false`). Without unwrapping, Show when →
 * flex_direction → Equals → flex-row never matches.
 *
 * This module patches Validator.getFieldValue so conditions see the *effective*
 * leaf at the active Live Preview breakpoint — same cascade as the fieldtype.
 * Storage, emit shape, and the responsive UI are untouched.
 */

import { chromeGet } from './chrome-prefs.js';

const BP_ORDER = ['laptop', 'tablet', 'mobile'];
const CAPTURE_KEY = 'passOnAny';

let activeBp = 'laptop';
let patched = false;

function deviceToBp(device) {
    if (!device || device === 'Responsive' || device === 'Desktop' || device === 'Laptop') {
        return 'laptop';
    }
    if (device === 'Tablet') return 'tablet';
    if (device === 'Mobile') return 'mobile';
    return 'laptop';
}

function bpFromStorage() {
    try {
        return deviceToBp(chromeGet(window, 'sve-lp-device'));
    } catch {
        return 'laptop';
    }
}

function leafHandle(field) {
    if (!field || typeof field !== 'string') return null;
    const clean = field.replace(/^\$?root\./, '').replace(/^\$parent\./, '');
    const parts = clean.split('.');
    return parts[parts.length - 1] || null;
}

/**
 * Breakpoint bag only — every own key is laptop|tablet|mobile, and each
 * drawer is a plain object of inner field values.
 */
export function isResponsiveBag(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return false;
    }

    const keys = Object.keys(value);
    if (!keys.length) return false;
    if (!keys.every((k) => BP_ORDER.includes(k))) return false;

    return keys.every((k) => {
        const inner = value[k];
        return inner != null && typeof inner === 'object' && !Array.isArray(inner);
    });
}

export function effectiveLeaf(bag, bp, handle) {
    const effective = {};
    for (const step of BP_ORDER) {
        Object.assign(effective, bag[step] || {});
        if (step === bp) break;
    }

    if (handle && Object.prototype.hasOwnProperty.call(effective, handle)) {
        return effective[handle];
    }

    const keys = Object.keys(effective);
    if (keys.length === 1) {
        return effective[keys[0]];
    }

    return effective;
}

export function unwrapResponsiveConditionValue(value, field, bp = activeBp) {
    if (!isResponsiveBag(value)) {
        return value;
    }

    return effectiveLeaf(value, bp || 'laptop', leafHandle(field));
}

function patchValidatorProto(proto) {
    if (patched || !proto || typeof proto.getFieldValue !== 'function') {
        return false;
    }

    const original = proto.getFieldValue;
    if (original._sveResponsiveConditions) {
        patched = true;
        return true;
    }

    function getFieldValue(field) {
        const value = original.call(this, field);
        return unwrapResponsiveConditionValue(value, field, activeBp);
    }

    getFieldValue._sveResponsiveConditions = true;
    proto.getFieldValue = getFieldValue;
    patched = true;
    return true;
}

/**
 * Validator sets `this.passOnAny = false` in its constructor. That name is
 * unique enough to catch the first instance, patch its prototype, then remove
 * the capture so Object.prototype stays clean.
 */
function installCapture() {
    if (patched || Object.prototype.hasOwnProperty(CAPTURE_KEY)) {
        return;
    }

    Object.defineProperty(Object.prototype, CAPTURE_KEY, {
        configurable: true,
        enumerable: false,
        get() {
            return undefined;
        },
        set(value) {
            const proto = Object.getPrototypeOf(this);
            const looksLikeValidator =
                this.field != null &&
                this.values != null &&
                typeof proto?.getFieldValue === 'function' &&
                typeof proto?.passesConditions === 'function' &&
                typeof proto?.getConditions === 'function';

            Object.defineProperty(this, CAPTURE_KEY, {
                value,
                writable: true,
                enumerable: true,
                configurable: true,
            });

            if (looksLikeValidator && patchValidatorProto(proto)) {
                try {
                    delete Object.prototype[CAPTURE_KEY];
                } catch {
                    // ignore
                }
            }
        },
    });
}

function trackBreakpoint() {
    activeBp = bpFromStorage();

    window.addEventListener('sve:breakpoint', (event) => {
        const next = event?.detail?.bp || deviceToBp(event?.detail?.device);
        if (BP_ORDER.includes(next)) {
            activeBp = next;
        }
    });
}

export function installResponsiveConditions() {
    trackBreakpoint();
    installCapture();
}
