<script setup>
/**
 * The header's or footer's globals form, headless.
 *
 * Statamic's own PublishContainer on the globals screen's Inertia props —
 * blueprint, values, meta, the fields localized on this site — under the
 * editor's own container name. It draws no fields: the selection panel draws
 * the tab's fields on the context this container provides, exactly as it
 * draws a page section's on the page form's. What lives here is the data,
 * the publish-container events every reader of the form listens to (the
 * value poll, the dock's header style, the dirty mark) and the save.
 *
 * The globals screen's page component used to be borrowed whole: fetched as
 * Inertia would, resolved through Inertia's resolver, its render patched to
 * rename the container. A production build compiles a `<script setup>` page
 * without a `render` to patch, so on the server the header never opened in
 * the left column and fell back to the globals iframe (Cuben, 19 Oct 2026).
 *
 * The save is Statamic's own: its save pipeline (before-save hooks, the PATCH
 * to the globals action with `_blueprint` and `_localized`, after-save hooks),
 * run on this container exactly as the globals form runs it — the request the
 * save watcher in globals-panel.js already listens for.
 */
import { defineComponent, inject, onMounted, onUnmounted, ref } from 'vue';
import { PublishContainer } from '@statamic/cms/ui';
import { AfterSaveHooks, BeforeSaveHooks, Pipeline, PipelineStopped, Request } from '@statamic/cms/save-pipeline';
import { registerContainerContext, unregisterContainerContext } from '../../lib/publish-containers.js';
import { unwrapRef } from '../../lib/values.js';

const props = defineProps({
  /** The publish container's name (`sve-chrome`), never the page's `base`. */
  name: { type: String, required: true },
  /** The globals screen's Inertia props, as the Control Panel hands them to its own form. */
  page: { type: Object, required: true },
  /** Called once with `{ save }`, so the host can save without reaching into Vue. */
  bind: { type: Function, default: null },
  /** Called with the values whenever the container changes them — the host stashes them for the preview. */
  onChange: { type: Function, default: null },
});

const clone = (value) => JSON.parse(JSON.stringify(value ?? {}));

const values = ref(clone(props.page.values));
const meta = ref(clone(props.page.meta));
const localizedFields = ref(Array.isArray(props.page.localizedFields) ? [...props.page.localizedFields] : []);
/** The PublishContainer instance: the pipeline reads its visibleValues and writes the saved values back. */
const container = ref(null);
const errors = ref({});
const saving = ref(false);

/** Registers the container's context the moment it exists, from inside it. */
const ContextTap = defineComponent({
  setup() {
    const ctx = inject('PublishContainerContext', null);

    onMounted(() => registerContainerContext(ctx));
    onUnmounted(() => unregisterContainerContext(ctx));

    return () => null;
  },
});

function onValues(next) {
  values.value = unwrapRef(next);
  props.onChange?.(values.value);
}

function translate(text) {
  return typeof window.__ === 'function' ? window.__(text) : text;
}

/** Save the set the way Statamic's own form does. Resolves true on success. */
async function save() {
  const url = props.page.actions?.save;

  if (saving.value || !container.value || !url) {
    return false;
  }

  try {
    await new Pipeline()
      .provide({ container, errors, saving })
      .through([
        new BeforeSaveHooks('global-set', { globalSet: props.page.handle, values: values.value }),
        new Request(url, 'patch', { _blueprint: props.page.blueprint?.handle, _localized: localizedFields.value }),
        new AfterSaveHooks('global-set', { globalSet: props.page.handle, reference: props.page.reference }),
      ]);

    window.Statamic?.$toast?.success?.(translate('Saved'));

    return true;
  } catch (error) {
    if (!(error instanceof PipelineStopped)) {
      window.Statamic?.$toast?.error?.(translate('Something went wrong'));
      console.error('[sve] chrome save', error);
    }

    return false;
  }
}

onMounted(() => props.bind?.({ save }));
</script>

<template>
  <PublishContainer
    ref="container"
    :name="name"
    :reference="page.reference"
    :blueprint="page.blueprint"
    :model-value="values"
    :meta="meta"
    :origin-values="page.originValues"
    :origin-meta="page.originMeta"
    :errors="errors"
    :site="page.locale"
    :read-only="!!page.readOnly"
    :modified-fields="localizedFields"
    @update:model-value="onValues($event)"
    @update:meta="meta = unwrapRef($event)"
    @update:modified-fields="localizedFields = unwrapRef($event)"
  >
    <ContextTap />
  </PublishContainer>
</template>
