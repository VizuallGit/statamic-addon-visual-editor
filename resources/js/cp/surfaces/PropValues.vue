<script setup>
/**
 * One publish form, drawn with the Control Panel's own fields.
 *
 * Rich text is Bard, with its toolbar and its link stack. A picture is the
 * asset browser. A link is the page picker. None of that is drawn here — it is
 * the Control Panel's own, borrowed by the app this surface is mounted in.
 *
 * What *is* drawn here is the label, and the switch beside it. A field either
 * holds a value or reads one from the page, and that is Antlers' own
 * distinction — `headline="Hi"` against `:headline="title"`. The switch is how
 * you say which, the same way a condition or a loop does.
 *
 * The store arrives as a prop rather than being imported: there are two of
 * these on screen at once, showing different things.
 */
import { PublishContainer, PublishField, PublishFieldsProvider } from '@statamic/cms/ui';

const props = defineProps({
  store: { type: Object, required: true },
});

const DATA =
  '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><ellipse cx="8" cy="4" rx="5" ry="2.1"/><path d="M3 4v8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1V4"/><path d="M3 8c0 1.16 2.24 2.1 5 2.1s5-.94 5-2.1"/></svg>';

function bound(handle) {
  return Object.prototype.hasOwnProperty.call(props.store.bindings || {}, handle);
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
      <div v-for="field in props.store.fields" :key="field.handle" class="sve-pv__row">
        <div class="sve-pv__bar">
          <span class="sve-pv__label">{{ field.display }}</span>
          <!--
            A switch, not the data icon. The icon means "pick a variable" in
            the box below and everywhere else in the editor; wearing it here as
            well would make one of the two lie.
          -->
          <button
            v-if="props.store.canBind"
            type="button"
            class="sve-pv__toggle"
            role="switch"
            :data-on="bound(field.handle) ? '' : undefined"
            :title="props.store.dataTitle"
            :aria-label="props.store.dataTitle"
            :aria-checked="bound(field.handle)"
            :disabled="props.store.readOnly"
            @click="props.store.onToggleBind?.(field.handle, !bound(field.handle))"
          ><span></span></button>
        </div>

        <!--
          Reading from the page: what belongs in the call is an expression, not
          a value, so the field steps aside for a box and the same picker the
          conditions and loops use.
        -->
        <span v-if="bound(field.handle)" class="sve-pv__expr">
          <input
            type="text"
            :value="props.store.bindings[field.handle]"
            :placeholder="props.store.exprPlaceholder"
            :disabled="props.store.readOnly"
            spellcheck="false"
            @change="props.store.onExpr?.(field.handle, $event.target.value)"
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
*/
.sve-pv__row :deep([data-ui-field-header]) {
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
/* Smaller than a real switch: it marks a field rather than being one, and at
   full size it was the loudest thing on the row. */
.sve-pv__toggle {
  all: unset;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  /* Its own size, not the row's. `all: unset` leaves the font to whatever the
     panel it lands in happens to have, and the switch then changes size with
     the surroundings instead of staying the mark it is. */
  font-size: .8125rem;
  width: 1.3em;
  height: .775em;
  padding: .0625em;
  border-radius: 1em;
  background: rgba(128, 128, 128, .4);
  transition: background .12s ease;
}
.sve-pv__toggle span {
  display: block;
  width: .625em;
  height: .625em;
  border-radius: 50%;
  background: #fff;
  transition: transform .12s ease;
}
/* On: the field is reading from the page, and says so in the tree's own blue. */
.sve-pv__toggle[data-on] {
  background: #3858e9;
}
.sve-pv__toggle[data-on] span {
  transform: translateX(.55em);
}
.sve-pv__toggle[disabled] {
  cursor: default;
  opacity: .4;
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
