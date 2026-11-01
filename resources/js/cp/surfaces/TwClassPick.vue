<script setup>
/**
 * New class, and moving classes into an open one: the same in Style
 * (BuildClassList.vue) and in the dock's Tailwind pane (dock/tw-class-parts.js).
 * Everything it knows is on dock/class-target.js, so what is chosen and typed in
 * one shows in the other. `line` goes over the list, `foot` under it.
 */
import { computed, nextTick, ref, watch } from 'vue';

const { part, who = '', classes, t } = defineProps({
  part: { type: String, required: true },
  who: { type: String, default: '' },
  classes: { type: Object, required: true },
  t: { type: Function, required: true },
});

const input = ref(null);

const picking = computed(() => (classes.rev.value, classes.picking()));
const target = computed(() => (classes.rev.value, classes.target()));
const count = computed(() => (classes.rev.value, classes.chosen().length));
const canChoose = computed(() => (classes.rev.value, classes.canChoose()));
const allChosen = computed(() => (classes.rev.value, classes.allChosen()));
const outside = computed(() => (classes.rev.value, target.value ? classes.outside() : []));
const joinable = computed(() => outside.value.filter((one) => one.joinable).map((one) => one.name));
const lockedTold = computed(() => {
  classes.rev.value;

  const name = classes.lockedTold();

  return name && classes.onTag().includes(name) ? name : '';
});
const typed = computed(() => classes.draft.value.trim());
const problem = computed(() => {
  classes.rev.value;

  if (!typed.value) {
    return '';
  }

  return classes.names().includes(typed.value) ? 'name_used' : classes.problem(typed.value);
});
const canCreate = computed(() => !!typed.value && !problem.value);
const createLabel = computed(() => {
  if (!count.value) {
    return t('class_create_empty');
  }

  return count.value === 1 ? t('class_create_one') : t('class_create_many', { n: count.value });
});

async function create() {
  if (canCreate.value) {
    await classes.create(typed.value);
  }
}

// The form takes the caret where New class was pressed.
watch(() => part === 'foot' && picking.value && classes.askedBy() === who, (asked) => {
  if (asked) {
    nextTick(() => input.value?.focus());
  }
}, { immediate: true });
</script>

<template>
  <div v-if="part === 'line' && picking" class="sve-class-pick sve-class-pick__line">
    <p class="sve-class-pick__hint">{{ t('class_pick_hint') }}</p>
    <button v-if="canChoose" type="button" class="sve-class-pick__small" :aria-pressed="allChosen" data-sve-build-class-choose-all @click="classes.chooseAll()">{{ t('class_choose_all') }}</button>
  </div>

  <template v-if="part === 'foot'">
    <div v-if="picking" class="sve-class-pick sve-class-pick__form" data-sve-build-class-pick>
      <input ref="input" v-model="classes.draft.value" type="text" spellcheck="false" :placeholder="t('class_name_placeholder')" :aria-label="t('class_name_placeholder')" @keydown.enter.prevent="create" @keydown.esc.prevent.stop="classes.stopPicking()" />
      <p v-if="problem" class="sve-class-pick__hint" data-sve-build-class-problem>{{ t(`class_${problem}`) }}</p>
      <div class="sve-class-pick__acts">
        <button type="button" class="sve-class-pick__new" :disabled="!canCreate" data-sve-build-class-create @click="create">{{ createLabel }}</button>
        <button type="button" class="sve-class-pick__cancel" data-sve-build-class-cancel @click="classes.stopPicking()">{{ t('class_cancel') }}</button>
      </div>
    </div>

    <p v-else-if="lockedTold" class="sve-class-pick sve-class-pick__hint" data-sve-build-class-locked-note>{{ t('class_locked', { name: lockedTold }) }}</p>

    <div v-if="outside.length" class="sve-class-pick sve-class-pick__outside" data-sve-build-class-outside>
      <div class="sve-class-pick__line">
        <p class="sve-class-pick__hint">{{ t('class_outside') }}</p>
        <button v-if="joinable.length" type="button" class="sve-class-pick__small" data-sve-build-class-take-all @click="classes.takeIn(joinable)">{{ t('class_take_all') }}</button>
      </div>
      <div class="sve-class-pick__rest">
        <template v-for="one in outside" :key="one.name">
          <button v-if="one.joinable" type="button" class="sve-class-pick__take" :title="t('class_take_one', { name: one.name, target })" :data-sve-build-class-take="one.name" @click="classes.takeIn([one.name])">{{ one.name }}</button>
          <code v-else :title="t('class_stays', { name: one.name })">{{ one.name }}</code>
        </template>
      </div>
    </div>
  </template>
</template>

<style scoped>
/* The panel's and the dock's greys (BuildPanel.vue, dock/layout.js). This stands
   in both, and neither's stylesheet can be counted on in the other. */
.sve-class-pick {
  --cp-bg: #18181a;
  --cp-raise: #2e2e30;
  --cp-hover: #39393c;
  --cp-line: rgba(255, 255, 255, 0.08);
  --cp-edge: rgba(255, 255, 255, 0.16);
  --cp-ink: #d4d4d4;
  --cp-muted: #9d9d9e;
  --cp-faint: #79797a;
  --cp-accent: #3858e9;
  --cp-accent-soft: rgba(56, 88, 233, 0.28);
  --cp-accent-text: #b4c1ff;
  --cp-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  box-sizing: border-box;
  min-width: 0;
}
[data-sve-tw-class-bar] .sve-class-pick { margin: 0.4rem 0.5rem 0; }
[data-sve-tw-class-foot] .sve-class-pick { margin: 0 0.5rem 0.4rem; }
.sve-class-pick__line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 0;
}
.sve-class-pick__hint {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 0.6875rem;
  line-height: 1.45;
  color: var(--cp-faint, #79797a);
}
.sve-class-pick__small {
  all: unset;
  flex: none;
  box-sizing: border-box;
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  background: var(--cp-raise, #2e2e30);
  color: var(--cp-ink, #d4d4d4);
  font-size: 0.625rem;
  font-weight: 500;
  cursor: pointer;
}
.sve-class-pick__small:hover { background: var(--cp-hover, #39393c); }
.sve-class-pick__small[aria-pressed='true'] { background: var(--cp-accent-soft, rgba(56, 88, 233, 0.28)); color: var(--cp-accent-text, #b4c1ff); }
.sve-class-pick__form {
  display: grid;
  gap: 0.35rem;
  padding: 0.4rem;
  border-radius: 0.3rem;
  background: var(--cp-raise);
}
.sve-class-pick__form input {
  box-sizing: border-box;
  width: 100%;
  height: 1.75rem;
  padding: 0 0.45rem;
  border-radius: 0.25rem;
  background: var(--cp-bg);
  border: 1px solid var(--cp-line);
  color: var(--cp-ink);
  font: 450 0.75rem var(--cp-mono);
  outline: 0;
}
.sve-class-pick__form input:focus { border-color: var(--cp-accent); }
/* The dock is low: the name and its buttons on one line, so the classes keep the room. */
[data-sve-tw-class-foot] .sve-class-pick__form { grid-template-columns: minmax(0, 1fr) auto; align-items: center; }
[data-sve-tw-class-foot] .sve-class-pick__form .sve-class-pick__hint { grid-column: 1 / -1; grid-row: 2; }
.sve-class-pick__acts { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.sve-class-pick__new,
.sve-class-pick__cancel {
  all: unset;
  box-sizing: border-box;
  padding: 0.3rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.6875rem;
  cursor: pointer;
}
.sve-class-pick__new { background: var(--cp-accent); color: #fff; font-weight: 600; }
.sve-class-pick__new:disabled { background: var(--cp-hover); color: var(--cp-faint); cursor: default; }
.sve-class-pick__cancel { background: var(--cp-hover); color: var(--cp-ink); }
.sve-class-pick__new:focus-visible,
.sve-class-pick__cancel:focus-visible,
.sve-class-pick__small:focus-visible,
.sve-class-pick__take:focus-visible { outline: 2px solid var(--cp-accent-text, #b4c1ff); outline-offset: 1px; }
.sve-class-pick__outside { display: grid; gap: 0.3rem; }
.sve-class-pick__rest { display: flex; flex-wrap: wrap; gap: 0.25rem; min-width: 0; }
.sve-class-pick__rest code { padding: 0.15rem 0.35rem; color: var(--cp-muted); font-size: 0.625rem; }
.sve-class-pick__take {
  all: unset;
  box-sizing: border-box;
  padding: 0.15rem 0.35rem;
  border-radius: 0.25rem;
  border: 1px dashed var(--cp-edge);
  color: var(--cp-ink);
  font: 500 0.625rem var(--cp-mono);
  overflow-wrap: anywhere;
  cursor: pointer;
}
.sve-class-pick__take:hover { background: var(--cp-accent-soft); border-color: var(--cp-accent); color: var(--cp-accent-text); }
</style>
