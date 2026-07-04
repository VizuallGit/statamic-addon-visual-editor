<script>
// Module-level: shared across ALL instances so duplicate UUIDs can be detected
// when a Replicator row is duplicated (Statamic copies the _visual_id value,
// giving both the original and the duplicate the same UUID — the first set found
// by cp.js's findSetByUid() would always "win").
const _seenUuids = new Set();

// crypto.randomUUID only exists in secure contexts (https/localhost) — sites
// served over plain http (e.g. *.test via Herd without TLS) need a fallback.
function uuid() {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40; // version 4
    b[8] = (b[8] & 0x3f) | 0x80; // variant 10
    const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
</script>

<script setup>
import { Fieldtype } from '@statamic/cms';
import { onMounted, onUnmounted } from 'vue';

const emit = defineEmits(Fieldtype.emits);
const props = defineProps(Fieldtype.props);
const { expose, update } = Fieldtype.use(emit, props);
defineExpose(expose);

// Per-instance: track which UUID this instance claimed so onUnmounted can
// release the correct entry even if props.value has already been updated.
let myUuid = null;

onMounted(() => {
    if (!props.value || _seenUuids.has(props.value)) {
        // No value yet, or another set already owns this UUID (freshly duplicated row).
        myUuid = uuid();
        _seenUuids.add(myUuid);
        update(myUuid);
    } else {
        myUuid = props.value;
        _seenUuids.add(myUuid);
    }
});

onUnmounted(() => {
    if (myUuid) {
        _seenUuids.delete(myUuid);
        myUuid = null;
    }
});
</script>

<template>
    <input type="hidden" :value="value" :data-visual-id="value" />
</template>
