<script setup>
/**
 * Build's Action tab: Alpine, without writing it. Pick when, what it does and
 * which element follows, on the canvas or in the tree. The `x-data` is placed
 * by build-mode/alpine.js where both can reach it, so the one mistake Alpine
 * never reports cannot be made here.
 *
 * Everything the dock's Alpine pane can write is here too, from the same list
 * (ALPINE_BEHAVIOURS), under "Every behaviour". The canvas runs no scripts, so
 * a switch is seen with its preview toggle, the HTML tree's own.
 */
import { computed, inject, nextTick, onBeforeUnmount, ref } from 'vue';
import { ALPINE_BEHAVIOURS, ALPINE_GROUPS, behaviourHint, fillName } from '../../alpine-behaviours.js';
import { alpineAttrs, freeName, statesInScope, withAction, withAlpineAttr, withoutAlpineAttr } from '../../build-mode/alpine.js';
import { ic } from '../../build-mode/icons.js';
import { findByPath } from '../../build-mode/place.js';
import { parseTemplateTree } from '../../html-tree-parse.js';

const props = defineProps({
  node: { type: Object, required: true },
});

const port = inject('sveBuild');
const path = computed(() => props.node.path);
const nodeAt = (at) => findByPath(parseTemplateTree(port.html()), at);

/* ---------------- what the element has ---------------- */

const attrs = computed(() => {
  port.rev.value;

  const node = nodeAt(path.value);

  return node && !node.kind ? alpineAttrs(port.html(), node) : [];
});
const states = computed(() => (port.rev.value, statesInScope(port.html(), path.value)));
/** The tree's rows for the tags holding those switches: their toggle is the preview's. */
const previews = computed(() => (port.rev.value, port.alpineRows(states.value.map((state) => state.path))));

const editing = ref('');
const draft = ref('');

const editBox = ref(null);

function startEdit(attr) {
  editing.value = attr.name;
  draft.value = attr.value;
  nextTick(() => {
    const box = [].concat(editBox.value)[0];

    box?.focus();
    box?.select();
  });
}

function saveEdit() {
  if (editing.value) {
    port.write(withAlpineAttr(port.html(), path.value, editing.value, draft.value.trim().replace(/"/g, "'")), { select: path.value });
  }

  editing.value = '';
}

function drop(name) {
  port.write(withoutAlpineAttr(port.html(), path.value, name), { select: path.value });
}

/* ---------------- the action ---------------- */

const TRIGGER_WORDS = {
  '@click': ['action_click', 'cursor'],
  '@mouseenter': ['action_enter', 'mouseIn'],
  '@mouseleave': ['action_leave', 'mouseOut'],
  '@focusin': ['action_focus', 'focusIn'],
  '@focusout': ['action_blur', 'focusOut'],
  '@click.outside': ['action_outside', 'clickOut'],
  '@keydown.escape.window': ['action_escape', 'keyEsc'],
};

/** The dock's triggers, each once, in the dock's order: a trigger added there is a trigger here. */
const triggers = [...new Set(ALPINE_BEHAVIOURS.filter((item) => item.group === 'act').map((item) => item.attrs[0].name))];
const DOES_BY_TRIGGER = { '@mouseleave': 'off', '@focusout': 'off', '@click.outside': 'off', '@keydown.escape.window': 'off', '@mouseenter': 'on', '@focusin': 'on' };
const DOES = [['toggle', 'action_toggle'], ['on', 'action_on'], ['off', 'action_off']];
const THENS = ALPINE_BEHAVIOURS.filter((item) => item.group === 'react' && item.needsName);

const when = ref('@click');
const does = ref('toggle');
const thenId = ref('show');
const then = computed(() => THENS.find((item) => item.id === thenId.value));
const classes = ref('');
const target = ref('');
const picking = ref(false);
const typedName = ref('');

function chooseWhen(attr) {
  when.value = attr;
  does.value = DOES_BY_TRIGGER[attr] || 'toggle';
}

const targetNode = computed(() => (port.rev.value, target.value ? nodeAt(target.value) : null));
const targetLabel = computed(() => (targetNode.value ? `<${targetNode.value.tag}>` : ''));
/** Reachable from both: reusing one of these makes two elements talk to each other. */
const nameNow = computed(() => {
  port.rev.value;

  return typedName.value.trim().replace(/[^\w$]/g, '') || freeName(port.html(), [path.value, target.value || path.value]);
});

const needsClass = computed(() => thenId.value === 'class_when');
const ready = computed(() => !!targetNode.value && (!needsClass.value || !!classes.value.trim()));

function pickTarget() {
  if (picking.value) {
    port.cancelElementPick();
    picking.value = false;

    return;
  }

  picking.value = true;
  port.pickElement(
    (at) => {
      const node = nodeAt(at);

      if (!node || node.kind) {
        port.toast('error', 'action_not_a_tag');

        return false;
      }

      if (at === path.value && thenId.value.startsWith('show')) {
        port.toast('error', 'action_not_itself');

        return false;
      }

      target.value = at;
      picking.value = false;

      return true;
    },
    () => {
      picking.value = false;
    }
  );
}

function add() {
  const next = withAction(port.html(), {
    trigger: path.value,
    target: target.value,
    when: when.value,
    does: does.value,
    name: nameNow.value,
    then: then.value,
    classes: classes.value.trim(),
  });

  if (next === null) {
    port.toast('error', 'action_no_holder');

    return;
  }

  port.startAlpine(nameNow.value);
  port.writeMoved(next, path.value);
  target.value = '';
  typedName.value = '';
  classes.value = '';
}

onBeforeUnmount(() => {
  if (picking.value) {
    port.cancelElementPick();
  }
});

/* ---------------- every behaviour, as the dock lists them ---------------- */

const allOpen = ref(false);
const behaviourGroups = computed(() => {
  // The dock's rule: nothing to point at yet, only the first step.
  const none = !states.value.length;

  return ALPINE_GROUPS.filter((group) => group.id === 'state' || !none).map((group) => ({
    id: group.id,
    label: group.lang,
    rows: ALPINE_BEHAVIOURS.filter((item) => item.group === group.id),
  }));
});

function runBehaviour(item) {
  const name = states.value[0]?.name && item.group !== 'state' ? (typedName.value.trim() || states.value[0].name) : nameNow.value;
  let next = port.html();

  (item.needsName ? fillName(item.attrs, name) : item.attrs).forEach((attr) => {
    next = withAlpineAttr(next, path.value, attr.name, attr.value.replace('|', ''));
  });

  port.write(next, { select: path.value });
}
</script>

<template>
  <div class="bm-content fg-action" data-sve-build-action>
    <!-- What the element already does -->
    <div v-if="attrs.length" class="fg-action__list" data-sve-build-action-attrs>
      <div class="fg-lab">{{ port.t('action_has') }}</div>
      <div v-for="attr in attrs" :key="attr.name" class="fg-action__row" :data-sve-build-action-attr="attr.name">
        <template v-if="editing === attr.name">
          <code>{{ attr.name }}</code>
          <input ref="editBox" v-model="draft" type="text" spellcheck="false" @keydown.enter.prevent="saveEdit" @keydown.esc.prevent.stop="editing = ''" @blur="saveEdit" />
        </template>
        <button v-else type="button" class="fg-action__attr" :title="`${attr.name}=&quot;${attr.value}&quot;`" @click="startEdit(attr)">
          <code>{{ attr.name }}</code><span>{{ attr.value }}</span>
        </button>
        <button type="button" class="fg-ib" :title="port.t('alpine_remove')" :aria-label="port.t('alpine_remove')" :data-sve-build-action-drop="attr.name" @click="drop(attr.name)" v-html="ic('minus')"></button>
      </div>
    </div>

    <!-- The switches that reach it -->
    <div v-if="states.length" class="fg-action__list" data-sve-build-action-states>
      <div class="fg-lab">{{ port.t('action_switches') }}</div>
      <div v-for="state in states" :key="state.name" class="fg-action__state">
        <code>{{ state.name }}</code>
        <span class="fg-action__on">{{ port.t('action_on_tag', { tag: `<${state.tag}>` }) }}</span>
      </div>
      <button v-for="row in previews" :key="row.id" type="button" class="fg-more" :aria-pressed="row.alpineSet" data-sve-build-action-preview @click="port.flipAlpine($event, row.id)">
        <span v-html="ic('eye')"></span>{{ port.t('action_preview', { tag: `<${row.tag}>` }) }}
      </button>
    </div>
    <p v-else class="fg-hint">{{ port.t('action_no_switch') }}</p>

    <!-- A new action -->
    <div class="fg-lab">{{ port.t('action_when') }}</div>
    <div class="fg-action__when">
      <button
        v-for="attr in triggers"
        :key="attr"
        type="button"
        :aria-pressed="when === attr"
        :title="attr"
        :data-sve-build-action-when="attr"
        @click="chooseWhen(attr)"
      ><span v-html="ic(TRIGGER_WORDS[attr]?.[1] || 'cursor')"></span>{{ TRIGGER_WORDS[attr] ? port.t(TRIGGER_WORDS[attr][0]) : attr }}</button>
    </div>

    <div class="fg-lab">{{ port.t('action_does') }}</div>
    <div class="fg-seg">
      <button v-for="[id, word] in DOES" :key="id" type="button" :aria-pressed="does === id" :data-sve-build-action-does="id" @click="does = id">{{ port.t(word) }}</button>
    </div>

    <div class="fg-lab">{{ port.t('action_target') }}</div>
    <div class="fg-line">
      <button type="button" class="fg-action__pick" :class="{ 'is-picking': picking, 'is-set': !!targetNode }" data-sve-build-action-pick @click="pickTarget">
        <span v-html="ic('cursor')"></span>{{ picking ? port.t('action_picking') : targetNode ? targetLabel : port.t('action_pick') }}
      </button>
      <button v-if="targetNode" type="button" class="fg-ib" :title="port.t('alpine_remove')" :aria-label="port.t('alpine_remove')" @click="target = ''" v-html="ic('x')"></button>
    </div>

    <div class="fg-lab">{{ port.t('action_then') }}</div>
    <div class="fg-action__rows">
      <button v-for="item in THENS" :key="item.id" type="button" :aria-pressed="thenId === item.id" :data-sve-build-action-then="item.id" @click="thenId = item.id">
        <span>{{ port.t(item.label) }}</span><code>{{ behaviourHint(item) }}</code>
      </button>
    </div>
    <input v-if="needsClass" v-model="classes" class="fg-action__input" type="text" spellcheck="false" :placeholder="port.t('action_class_placeholder')" data-sve-build-action-class />

    <div class="fg-lab">{{ port.t('alpine_name') }}</div>
    <input v-model="typedName" class="fg-action__input" type="text" spellcheck="false" :placeholder="nameNow" data-sve-build-action-name />
    <div v-if="states.length" class="fg-action__names">
      <button v-for="state in states" :key="state.name" type="button" :aria-pressed="nameNow === state.name" @click="typedName = state.name">{{ state.name }}</button>
    </div>

    <button type="button" class="fg-action__add" :disabled="!ready" data-sve-build-action-add @click="add">{{ port.t('action_add') }}</button>

    <!-- The dock's whole list, one attribute at a time -->
    <button type="button" class="fg-more" :aria-pressed="allOpen" data-sve-build-action-all @click="allOpen = !allOpen">
      <span v-html="ic(allOpen ? 'minus' : 'plus')"></span>{{ port.t('action_all') }}
    </button>
    <template v-if="allOpen">
      <template v-for="group in behaviourGroups" :key="group.id">
        <div class="fg-lab">{{ port.t(group.label) }}</div>
        <div class="fg-action__rows">
          <button v-for="item in group.rows" :key="item.id" type="button" :data-sve-build-action-behaviour="item.id" @click="runBehaviour(item)">
            <span>{{ port.t(item.label) }}</span><code>{{ behaviourHint(item) }}</code>
          </button>
        </div>
      </template>
    </template>
  </div>
</template>
