<script>
// Module-level: shared across ALL instances so duplicate UUIDs can be detected
// when a Replicator row is duplicated (Statamic copies the _visual_id value,
// giving both the original and the duplicate the same UUID — the first set found
// by cp.js's findSetByUid() would always "win").
const _seenUuids = new Set();
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
        myUuid = crypto.randomUUID();
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
