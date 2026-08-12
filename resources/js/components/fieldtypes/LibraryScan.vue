<script setup>
import { Fieldtype } from '@statamic/cms';
import { computed, onMounted, ref } from 'vue';

const emit = defineEmits(Fieldtype.emits);
const props = defineProps(Fieldtype.props);
const { expose } = Fieldtype.use(emit, props);
defineExpose(expose);

const snapshot = ref(null);
const running = ref(false);
const failed = ref(false);

// Server-rendered, in the Control Panel user's own language — the same source
// the editor's strings come from, so this screen cannot drift out of step.
const t = (key) => window.Statamic?.$config?.get?.('sveStrings')?.[key] ?? key;

function csrf() {
    return (
        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
        window.Statamic?.$config?.get?.('csrfToken') ||
        ''
    );
}

async function ask(method) {
    running.value = true;
    failed.value = false;

    try {
        const res = await fetch('/!/sve/library-scan', {
            method,
            credentials: 'same-origin',
            headers: { 'X-CSRF-TOKEN': csrf(), 'X-Requested-With': 'XMLHttpRequest' },
        });

        if (!res.ok) throw new Error(res.status);

        snapshot.value = await res.json();
    } catch (e) {
        failed.value = true;
    } finally {
        running.value = false;
    }
}

onMounted(() => ask('GET'));

const scanned = computed(() => !!snapshot.value?.scanned_at);

// The date in the reader's own locale rather than the ISO string on disk.
const when = computed(() => {
    if (!scanned.value) return '';

    const date = new Date(snapshot.value.scanned_at);

    return date.toLocaleString(undefined, {
        dateStyle: 'long',
        timeStyle: 'short',
    });
});

const summary = computed(() =>
    t('library_scan_summary')
        .replace(':types', snapshot.value?.types ?? 0)
        .replace(':globals', snapshot.value?.globals ?? 0)
        .replace(':when', when.value)
);
</script>

<template>
    <div class="flex flex-wrap items-center gap-3">
        <!-- The same classes the Section Previews utility spells out for its own
             button. Statamic's .btn is not in the Control Panel's stylesheet
             under an addon's build, so it has to say what it means. -->
        <button
            type="button"
            class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="running"
            @click="ask('POST')"
        >
            {{ running ? t('library_scan_running') : t('library_scan_button') }}
        </button>

        <p v-if="failed" class="text-sm text-red-500">
            {{ t('library_scan_failed') }}
        </p>

        <!-- The warning matters more than the summary: the setting above is on
             but does nothing at all until this has been run once. -->
        <p v-else-if="!scanned && snapshot" class="text-sm text-yellow-600 dark:text-yellow-400">
            {{ t('library_scan_never') }}
        </p>

        <p v-else-if="scanned" class="text-sm text-gray">
            {{ summary }}
        </p>
    </div>

    <p v-if="snapshot?.path" class="mt-2 text-xs text-gray">
        <code>{{ snapshot.path }}</code>
    </p>
</template>
