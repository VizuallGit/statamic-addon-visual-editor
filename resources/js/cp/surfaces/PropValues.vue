<script setup>
/**
 * One publish form, drawn with the Control Panel's own fields.
 *
 * Rich text is Bard, with its toolbar and its link stack. A picture is the
 * asset browser. A link is the page picker. None of that is drawn here — it is
 * the Control Panel's own, borrowed by the app this surface is mounted in.
 *
 * What *is* drawn here is the label, and the data icon. A field either holds a
 * value or reads one from the page, and that is Antlers' own distinction —
 * `headline="Hi"` against `:headline="title"`. Typed into, it holds a value;
 * the icon's pick makes it read one, shown as the tag it is (`{{ title }}`) in a
 * box of its own. Empty that box and the field comes back.
 *
 * The store arrives as a prop rather than being imported: there are two of
 * these on screen at once, showing different things.
 */
import { PublishContainer, PublishField, PublishFieldsProvider } from '@statamic/cms/ui';
import { TEXT_FIELDS } from '../../data-var-types.js';

const props = defineProps({
  store: { type: Object, required: true },
});

const DATA =
  '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>';

function bound(handle) {
  return Object.prototype.hasOwnProperty.call(props.store.bindings || {}, handle);
}

/** A field whose own box has room for the icon. The others wear it beside the label. */
function typedIn(field) {
  return TEXT_FIELDS.includes(field.type);
}

function canPick(field) {
  return props.store.canBind && !bound(field.handle);
}
</script>

<template>
  <PublishContainer
    v-if="props.store.ready && props.store.blueprint"
    :name="props.store.name"
    :blueprint="props.store.blueprint"
    :model-value="props.store.values"
    :meta="props.store.meta"
    :read-only="props.store.readOnly"
    :track-dirty-state="false"
    @update:model-value="props.store.onChange?.($event)"
  >
    <PublishFieldsProvider :fields="props.store.fields">
      <div
        v-for="field in props.store.fields"
        :key="field.handle"
        class="sve-pv__row"
        :data-group="['replicator', 'grid', 'group'].includes(field.type) ? '' : undefined"
        :data-typed="canPick(field) && typedIn(field) ? '' : undefined"
      >
        <div class="sve-pv__bar">
          <span class="sve-pv__label">{{ field.display }}</span>
          <button
            v-if="canPick(field) && !typedIn(field)"
            type="button"
            class="sve-pv__data"
            :title="props.store.dataTitle"
            :aria-label="props.store.dataTitle"
            :disabled="props.store.readOnly"
            @click="props.store.onPickData?.(field.handle, $event.currentTarget)"
            v-html="DATA"
          ></button>
        </div>

        <!--
          Reading from the page: what belongs in the call is an expression, not
          a value, so the field steps aside for a box and the same picker the
          conditions and loops use.
        -->
        <span v-if="bound(field.handle)" class="sve-pv__expr">
          <input
            type="text"
            :value="`{{ ${props.store.bindings[field.handle]} }}`"
            :placeholder="props.store.exprPlaceholder"
            :disabled="props.store.readOnly"
            spellcheck="false"
            @change="props.store.onBox?.(field.handle, $event.target.value)"
          />
          <button
            type="button"
            :title="props.store.dataTitle"
            :aria-label="props.store.dataTitle"
            :disabled="props.store.readOnly"
            @click="props.store.onPickData?.(field.handle, $event.currentTarget)"
            v-html="DATA"
          ></button>
        </span>
        <PublishField v-else :config="field" />
        <button
          v-if="canPick(field) && typedIn(field)"
          type="button"
          class="sve-pv__data sve-pv__data--inside"
          :title="props.store.dataTitle"
          :aria-label="props.store.dataTitle"
          :disabled="props.store.readOnly"
          @click="props.store.onPickData?.(field.handle, $event.currentTarget)"
          v-html="DATA"
        ></button>
      </div>
    </PublishFieldsProvider>
  </PublishContainer>
</template>

<style scoped>
/*
  Statamic's own label for the field, off. `hide_display` in the config is not
  enough — the header is still rendered — and the label has to go, because this
  panel draws its own with the switch beside it. Two labels for one field reads
  as a bug, which it would be.

  Not inside a group: every header there belongs to a field in a row, and
  without it a row is two boxes nobody can tell apart.
*/
.sve-pv__row:not([data-group]) :deep([data-ui-field-header]) {
  display: none;
}
/* A group's own header, and only its own: the list's "collapse all" bar. Its
   rows already fold one at a time, and the bar was a line of height with a
   lone button in it. The headers of the fields inside the rows stay. */
.sve-pv__row[data-group] > :deep([data-ui-input-group] > [data-ui-field-header]) {
  display: none;
}
.sve-pv__row + .sve-pv__row {
  margin-top: .75rem;
}
.sve-pv__bar {
  display: flex;
  align-items: center;
  gap: .375rem;
  margin-bottom: .3rem;
}
.sve-pv__label {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: .8125rem;
  font-weight: 500;
}
.sve-pv__data {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  /* Its own size, not the row's: `all: unset` leaves the font to the panel it lands in. */
  font-size: .8125rem;
  width: 1.5em;
  height: 1.5em;
  border-radius: .25rem;
  cursor: pointer;
  opacity: .55;
}
.sve-pv__data:hover:not([disabled]) {
  opacity: 1;
  background: rgba(128, 128, 128, .22);
}
.sve-pv__data[disabled] {
  cursor: default;
  opacity: .3;
}
/* A text field's icon stands in the field's own box, over its right end, as it
   does in the box a field reading from the page gets. Statamic's field is left
   as it is but for room at that end, and only in a row of ours. */
.sve-pv__row[data-typed] {
  position: relative;
}
.sve-pv__row[data-typed] :deep(input),
.sve-pv__row[data-typed] :deep(textarea) {
  padding-inline-end: 2em;
}
.sve-pv__data--inside {
  position: absolute;
  right: .3em;
  bottom: .625rem;
}
.sve-pv__expr {
  position: relative;
  display: block;
}
.sve-pv__expr input {
  box-sizing: border-box;
  width: 100%;
  padding: .45em 2.2em .45em .6em;
  border-radius: .35rem;
  border: 1px solid rgba(128, 128, 128, .35);
  background: rgba(0, 0, 0, .22);
  color: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: .75rem;
}
.sve-pv__expr input:focus {
  outline: 2px solid #3858e9;
  outline-offset: -1px;
}
.sve-pv__expr button {
  all: unset;
  position: absolute;
  top: 50%;
  right: .3em;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5em;
  height: 1.5em;
  border-radius: .25rem;
  cursor: pointer;
  opacity: .55;
}
.sve-pv__expr button:hover:not([disabled]) {
  opacity: 1;
  background: rgba(128, 128, 128, .22);
}
</style>
