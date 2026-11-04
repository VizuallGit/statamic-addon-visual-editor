<script setup>
/**
 * Build's Action tab, as the approved canvas draws it
 * (animationer-forslag.canvas.tsx, "Action-fanen i samme design"): the same
 * frame as Animation. The element's actions as chips, the switches that reach
 * it, the triggers, and a library of patterns. A chip or a trigger opens the
 * editor over the panel, which dims under it.
 *
 * It writes the Alpine it wrote before, with the same functions: a new action
 * is withAction's, so its `x-data` lands where both elements reach it
 * (build-mode/alpine.js). A pattern is a few of those on one new switch, a
 * changed chip one statement rewritten (build-mode/action-flow.js).
 * Everything the dock's Alpine pane can write is under «Raw Alpine», one
 * attribute at a time, from the same list (ALPINE_BEHAVIOURS).
 *
 * The canvas runs no scripts, so a switch is seen with its preview toggle, the
 * HTML tree's own. Motion is Animation's: «Give it an animation» opens that
 * tab on the follower, on «When the switch turns on».
 */
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ALPINE_BEHAVIOURS, ALPINE_GROUPS, behaviourHint, fillName } from '../../alpine-behaviours.js';
import {
  actionsOn,
  DOES_BY_TRIGGER,
  followersOf,
  followsOn,
  PATTERNS,
  statement,
  THENS,
  TRIGGERS,
  TRIGGER_WORDS,
  withPattern,
  withStatement,
} from '../../build-mode/action-flow.js';
import { alpineAttrs, freeName, statesInScope, withAction, withAlpineAttr, withoutAlpineAttr } from '../../build-mode/alpine.js';
import { animationOf, newAnimation, timed, withAnimation } from '../../build-mode/animation.js';
import { ic } from '../../build-mode/icons.js';
import { findByPath } from '../../build-mode/place.js';
import { parseTemplateTree } from '../../html-tree-parse.js';
import { overSpot } from '../../lib/beside.js';

const props = defineProps({
  node: { type: Object, required: true },
});

const port = inject('sveBuild');
const chooseTab = inject('sveBuildTab', null);
const t = (key, replace) => port.t(key, replace);
const path = computed(() => props.node.path);
const html = computed(() => (port.rev.value, port.html()));
const nodeAt = (at) => findByPath(parseTemplateTree(html.value), at);
const tagOf = (node) => (node ? (node.label ? `${node.tag}.${node.label}` : node.tag) : '');

/** The two glyphs Animation draws that icons.js has not: its select caret and ▶. */
const OWN_ICONS = { caret: '<path d="M6 9l6 6 6-6"/>', play: '<path d="M7 5l12 7-12 7z"/>' };
const icon = (name) => (OWN_ICONS[name] ? `<svg class="bm-ic" viewBox="0 0 24 24" aria-hidden="true">${OWN_ICONS[name]}</svg>` : ic(name));
const here = computed(() => tagOf(nodeAt(path.value)));

/* ---------------- what the element has ---------------- */

const attrs = computed(() => {
  const node = nodeAt(path.value);

  return node && !node.kind ? alpineAttrs(html.value, node) : [];
});
const states = computed(() => statesInScope(html.value, path.value));
const names = computed(() => states.value.map((state) => state.name));
/** The tree's rows for the tags holding those switches: their toggle is the preview's. */
const previews = computed(() => (port.rev.value, port.alpineRows(states.value.map((state) => state.path))));
const previewOf = (state) => previews.value.find((row) => row.path === state.path) || null;

const DOES = [['toggle', 'action_toggle'], ['on', 'action_on'], ['off', 'action_off']];
const doesWord = (does) => t(DOES.find(([id]) => id === does)[1]).toLowerCase();
const whenWord = (when) => (TRIGGER_WORDS[when] ? t(TRIGGER_WORDS[when][0]) : when);
const whenIcon = (when) => TRIGGER_WORDS[when]?.[1] || 'cursor';
const thenWord = (id) => t(THENS.find((item) => item.id === id)?.label || 'action_then');

/** One chip per statement a trigger runs, and one per switch the element follows. */
const chips = computed(() => [
  ...actionsOn(attrs.value).map((action, i) => ({
    key: `act-${i}`,
    icon: whenIcon(action.attr),
    title: whenWord(action.attr),
    sub: action.does ? `→ ${doesWord(action.does)} ${action.name}` : `→ ${action.part}`,
    action,
  })),
  ...followsOn(attrs.value, names.value).map((follow, i) => ({
    key: `follow-${i}`,
    icon: 'eye',
    title: t('action_follows', { name: follow.name }),
    sub: `· ${thenWord(follow.then)}`,
    follow,
  })),
]);
const hasTrigger = (when) => attrs.value.some((attr) => attr.name === when);

function writeHere(next, name = '') {
  if (name) {
    port.startAlpine(name);
  }

  port.writeMoved(next, path.value);
}

/* ---------------- the chip's ⋯ menu ---------------- */

const menuKey = ref('');

function removeChip(chip) {
  menuKey.value = '';

  if (chip.action) {
    writeHere(withStatement(port.html(), path.value, chip.action, null));
  } else {
    dropFollow(path.value, chip.follow);
  }
}

/** A follower taken off: with its x-show go the x-transition and x-cloak that came with it. */
function dropFollow(at, follow) {
  let next = withoutAlpineAttr(port.html(), at, follow.attr);

  if (follow.then.startsWith('show')) {
    next = withoutAlpineAttr(withoutAlpineAttr(next, at, 'x-transition'), at, 'x-cloak');
  }

  port.writeMoved(next, path.value);
}

/* ---------------- the editor ---------------- */

const root = ref(null);
const editor = ref(null);
const open = ref(false);
/** null while a new action is put together; the statement `{ attr, part, name, does }` while one is changed. */
const editing = ref(null);
const anchor = ref(null);
const editorSpot = ref({ left: 0, top: 0, width: 0 });
const panelSpot = ref(null);
const panelEl = () => root.value?.closest('.sve-build');

const when = ref('@click');
const does = ref('toggle');
const typedName = ref('');
const thenId = ref('show');
const then = computed(() => THENS.find((item) => item.id === thenId.value));
const classes = ref('');
const target = ref('');
const picking = ref('');

const nameNow = computed(() => typedName.value.trim().replace(/[^\w$]/g, '') || freeName(html.value, [path.value, target.value || path.value]));
const targetNode = computed(() => (target.value ? nodeAt(target.value) : null));
const needsClass = computed(() => thenId.value === 'class_when');
const ready = computed(() => !!targetNode.value && (!needsClass.value || !!classes.value.trim()));

function openNew(at, el) {
  editing.value = null;
  when.value = at;
  does.value = DOES_BY_TRIGGER[at] || 'toggle';
  typedName.value = '';
  target.value = '';
  classes.value = '';
  thenId.value = 'show';
  anchor.value = el;
  open.value = true;
}

function openChip(chip, el) {
  if (!chip.action?.name) {
    raw.value = true;

    return;
  }

  editing.value = chip.action;
  target.value = '';
  classes.value = '';
  thenId.value = 'show';
  anchor.value = el;
  open.value = true;
}

/** The chip being changed, read again from the file each time it is written. */
const current = computed(() => {
  const was = editing.value;

  return was ? actionsOn(attrs.value).find((a) => a.attr === was.attr && a.part === was.part) || null : null;
});

watch(current, (now) => {
  if (editing.value && !now) {
    open.value = false;
  }
});

const switchName = computed(() => (current.value ? current.value.name : nameNow.value));
const holder = computed(() => states.value.find((state) => state.name === switchName.value) || null);
const followers = computed(() => (holder.value ? followersOf(html.value, holder.value.path, switchName.value) : []));
const title = computed(() => {
  const now = current.value;

  return now ? `${whenWord(now.attr)} → ${doesWord(now.does)} ${now.name}` : `${whenWord(when.value)} → ${doesWord(does.value)} ${nameNow.value}`;
});

/** A chip's trigger or what it does, changed where it stands. */
function changeChip(nextWhen, nextDoes) {
  const now = current.value;
  const to = { attr: nextWhen, part: statement(nextDoes, now.name) };

  writeHere(withStatement(port.html(), path.value, now, to));
  editing.value = { ...now, ...to, does: nextDoes };
}

function setWhen(value) {
  if (current.value) {
    changeChip(value, current.value.does);
  } else {
    when.value = value;
    does.value = DOES_BY_TRIGGER[value] || 'toggle';
  }
}

function setDoes(value) {
  if (current.value) {
    changeChip(current.value.attr, value);
  } else {
    does.value = value;
  }
}

function pickTarget() {
  if (picking.value) {
    port.cancelElementPick();
    picking.value = '';

    return;
  }

  picking.value = 'follower';
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
      picking.value = '';

      return true;
    },
    () => {
      picking.value = '';
    }
  );
}

/** A new action, or one more follower on the chip's switch: withAction either way, which does not write a statement twice. */
function add() {
  const now = current.value;
  const name = now ? now.name : nameNow.value;
  const next = withAction(port.html(), {
    trigger: path.value,
    target: target.value,
    when: now ? now.attr : when.value,
    does: now ? now.does : does.value,
    name,
    then: then.value,
    classes: classes.value.trim(),
  });

  if (next === null) {
    port.toast('error', 'action_no_holder');

    return;
  }

  writeHere(next, name);

  if (!now) {
    editing.value = { attr: when.value, part: statement(does.value, name), name, does: does.value };
  }

  target.value = '';
  typedName.value = '';
  classes.value = '';
}

function removeAction() {
  writeHere(withStatement(port.html(), path.value, current.value, null));
  open.value = false;
}

/** «Try»: the switch's preview toggle, as the tree has it. */
const tryRow = computed(() => (holder.value ? previewOf(holder.value) : null));

/**
 * «Give it an animation»: Animation's tab on the follower, its animation on
 * «When the switch turns on» — a fade up if it has none, the one it has
 * otherwise. A recipe (ticker, stack) is left as it is.
 */
function giveMotion(follower) {
  const had = animationOf(port.html(), findByPath(parseTemplateTree(port.html()), follower.path));
  const anim = had && !timed(had.target) ? null : { ...(had || newAnimation('fade-up')), on: 'switch', switch: switchName.value };

  open.value = false;

  if (anim) {
    port.write(withAnimation(port.html(), follower.path, anim), { select: follower.path });
  } else {
    port.select(follower.path);
  }

  chooseTab?.('animation');
}

function openRaw() {
  open.value = false;
  raw.value = true;
}

/* ---------------- the library ---------------- */

const patternPicking = ref('');

function usePattern(pattern) {
  if (pattern.later) {
    port.toast('info', 'action_later_note');

    return;
  }

  if (patternPicking.value) {
    port.cancelElementPick();
  }

  patternPicking.value = pattern.key;
  port.pickElement(
    (at) => {
      const node = nodeAt(at);

      if (!node || node.kind) {
        port.toast('error', 'action_not_a_tag');

        return false;
      }

      if (at === path.value) {
        port.toast('error', 'action_not_itself');

        return false;
      }

      patternPicking.value = '';

      const done = withPattern(port.html(), pattern, path.value, at);

      if (!done) {
        port.toast('error', 'action_no_holder');

        return true;
      }

      writeHere(done.html, done.name);
      port.toast('success', 'action_pattern_done');

      return true;
    },
    () => {
      patternPicking.value = '';
    }
  );
}

const stroke = 'stroke:var(--bm-accent);stroke-width:1.3';
const tint = (p) => `fill:color-mix(in srgb,var(--bm-accent) ${p}%,transparent)`;
const framed = (p, more = '') => `style="${tint(p)};${stroke}${more}"`;
const line = (d, more = '') => `<path d="${d}" style="${stroke}${more}"/>`;

/** The canvas's ActionLibrary drawings, a 64 × 40 box each. */
const ART = {
  popup: `<rect x="4" y="2" width="56" height="36" rx="3" ${framed(8, ';stroke-opacity:.35;stroke-width:1')}/><rect x="18" y="9" width="28" height="22" rx="3" ${framed(40)}/>${line('M41 13l2 2M43 13l-2 2')}`,
  dropdown: `<rect x="14" y="3" width="36" height="9" rx="2" ${framed(35)}/><rect x="14" y="15" width="36" height="22" rx="2" ${framed(14)}/>${line('M19 21h20M19 26h16M19 31h22')}`,
  accordion: `<rect x="10" y="2" width="44" height="8" rx="2" ${framed(18)}/><rect x="10" y="12" width="44" height="16" rx="2" ${framed(40)}/><rect x="10" y="30" width="44" height="8" rx="2" ${framed(18)}/>`,
  menu: `${line('M8 12h14M8 18h14M8 24h14', ';stroke-width:1.6;stroke-linecap:round')}<rect x="32" y="3" width="26" height="34" rx="3" ${framed(35)}/>${line('M37 11h14M37 17h10M37 23h12')}`,
  more: `${line('M10 8h44M10 14h44M10 20h40')}${line('M10 26h30', ';stroke-opacity:.35')}${line('M28 32l4 4 4-4')}`,
  tooltip: `<rect x="16" y="3" width="32" height="14" rx="3" ${framed(40)}/><path d="M29 17l3 4 3-4" ${framed(40)}/><rect x="22" y="26" width="20" height="10" rx="2" ${framed(14)}/>`,
  tabs: `<rect x="6" y="4" width="16" height="8" rx="2" style="${tint(45)}"/><rect x="24" y="4" width="16" height="8" rx="2" style="${tint(18)}"/><rect x="42" y="4" width="16" height="8" rx="2" style="${tint(18)}"/><rect x="6" y="14" width="52" height="22" rx="2" style="${tint(25)}"/>`,
  carousel: `<rect x="2" y="8" width="12" height="24" rx="2" style="${tint(15)}"/><rect x="17" y="4" width="30" height="32" rx="3" style="${tint(40)}"/><rect x="50" y="8" width="12" height="24" rx="2" style="${tint(15)}"/>`,
};

/* ---------------- raw Alpine, one attribute at a time ---------------- */

const raw = ref(false);
const rawEditing = ref('');
const draft = ref('');
const editBox = ref(null);

function startEdit(attr) {
  rawEditing.value = attr.name;
  draft.value = attr.value;
  nextTick(() => {
    const box = [].concat(editBox.value)[0];

    box?.focus();
    box?.select();
  });
}

function saveEdit() {
  if (rawEditing.value) {
    port.writeMoved(withAlpineAttr(port.html(), path.value, rawEditing.value, draft.value.trim().replace(/"/g, "'")), path.value);
  }

  rawEditing.value = '';
}

function dropAttr(name) {
  port.writeMoved(withoutAlpineAttr(port.html(), path.value, name), path.value);
}

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
  const name = states.value[0]?.name && item.group !== 'state' ? states.value[0].name : freeName(port.html(), [path.value]);
  let next = port.html();

  (item.needsName ? fillName(item.attrs, name) : item.attrs).forEach((attr) => {
    next = withAlpineAttr(next, path.value, attr.name, attr.value.replace('|', ''));
  });

  port.writeMoved(next, path.value);
}

/* ---------------- placing, closing ---------------- */

const view = () => ({ width: window.innerWidth, height: window.innerHeight });

function place() {
  const panel = panelEl();

  if (editor.value && anchor.value && panel) {
    const box = panel.getBoundingClientRect();

    editorSpot.value = overSpot(anchor.value.getBoundingClientRect(), box, { width: editor.value.offsetWidth, height: editor.value.offsetHeight }, view());
    panelSpot.value = { left: box.left, top: box.top, width: box.width, height: box.height };
  }
}

let sized = null;

watch(editor, (el) => {
  sized?.disconnect();
  sized = new ResizeObserver(place);
  [el, el ? panelEl() : null].filter(Boolean).forEach((one) => sized.observe(one));
  place();
}, { flush: 'post' });

watch(open, (now) => {
  if (!now && picking.value) {
    port.cancelElementPick();
    picking.value = '';
  }
});

// Ahead of Build's own Escape, which would let go of the pick.
const onKey = (event) => {
  if (event.key !== 'Escape' || !(open.value || menuKey.value) || picking.value || patternPicking.value) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if (menuKey.value) {
    menuKey.value = '';
  } else {
    open.value = false;
  }
};

const onDown = (event) => {
  if (menuKey.value && !event.target.closest?.(`[data-sve-build-action-wrap="${menuKey.value}"]`)) {
    menuKey.value = '';
  }
};

onMounted(() => {
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('resize', place);
  document.addEventListener('pointerdown', onDown, true);
});

onBeforeUnmount(() => {
  sized?.disconnect();

  if (picking.value || patternPicking.value) {
    port.cancelElementPick();
  }

  window.removeEventListener('keydown', onKey, true);
  window.removeEventListener('resize', place);
  document.removeEventListener('pointerdown', onDown, true);
});
</script>

<template>
  <div ref="root" class="bm-act" data-sve-build-action>
    <section class="bm-act-block is-first">
      <div class="bm-act-head"><span>{{ t('action_on_element') }}</span></div>
      <div v-for="chip in chips" :key="chip.key" class="bm-act-chipwrap" :data-sve-build-action-wrap="chip.key">
        <button
          type="button"
          class="bm-act-chip"
          :aria-pressed="open && !!current && chip.action?.part === current.part && chip.action?.attr === current.attr"
          :data-sve-build-action-chip="chip.action ? chip.action.attr : chip.follow.attr"
          @click="chip.action ? openChip(chip, $event.currentTarget) : (raw = true)"
        >
          <span class="bm-act-chip__ic" v-html="ic(chip.icon)"></span>
          <b>{{ chip.title }}</b>
          <span class="bm-act-chip__sub">{{ chip.sub }}</span>
        </button>
        <button type="button" class="bm-act-chip__more" :aria-expanded="menuKey === chip.key" :aria-label="t('alpine_remove')" @click="menuKey = menuKey === chip.key ? '' : chip.key" v-html="ic('more')"></button>
        <div v-if="menuKey === chip.key" class="bm-act-menu" role="menu">
          <button type="button" role="menuitem" data-sve-build-action-chip-remove @click="removeChip(chip)"><span v-html="ic('trash')"></span>{{ t('alpine_remove') }}</button>
        </div>
      </div>
      <p v-if="!chips.length" class="bm-act-none" data-sve-build-action-none>{{ t('action_none') }}</p>
    </section>

    <section class="bm-act-block" data-sve-build-action-states>
      <div class="bm-act-head"><span>{{ t('action_switches_head') }}</span></div>
      <div v-for="state in states" :key="state.name" class="bm-act-switchrow">
        <code>{{ state.name }}</code>
        <span>{{ t('action_on_tag', { tag: `<${state.tag}>` }) }} · {{ t('action_show_canvas') }}</span>
        <button
          v-if="previewOf(state)"
          type="button"
          role="switch"
          class="bm-act-switch"
          :aria-checked="!!previewOf(state).alpineSet"
          :aria-label="t('action_preview', { tag: `<${state.tag}>` })"
          data-sve-build-action-preview
          @click="port.flipAlpine($event, previewOf(state).id)"
        ></button>
      </div>
      <p v-if="!states.length" class="bm-act-hint">{{ t('action_no_switch') }}</p>
    </section>

    <section class="bm-act-block" data-sve-build-action-triggers>
      <div class="bm-act-head"><span>{{ t('action_triggers') }}</span></div>
      <div class="bm-act-triggers">
        <button
          v-for="at in TRIGGERS"
          :key="at"
          type="button"
          class="bm-act-trigger"
          :aria-pressed="hasTrigger(at)"
          :title="at"
          :data-sve-build-action-when="at"
          @click="openNew(at, $event.currentTarget)"
        >
          <span class="bm-act-trigger__ic" v-html="ic(whenIcon(at))"></span>
          <span class="bm-act-trigger__word">{{ whenWord(at) }}</span>
        </button>
      </div>
    </section>

    <section class="bm-act-block" data-sve-build-action-library>
      <div class="bm-act-head"><span>{{ t('action_library') }}</span></div>
      <p v-if="patternPicking" class="bm-act-hint is-picking" data-sve-build-action-pattern-picking>{{ t('action_pattern_pick') }}</p>
      <div class="bm-act-lib">
        <button
          v-for="pattern in PATTERNS"
          :key="pattern.key"
          type="button"
          class="bm-act-tile"
          :class="{ 'is-later': pattern.later }"
          :aria-pressed="patternPicking === pattern.key"
          :aria-disabled="pattern.later || undefined"
          :data-sve-build-action-pattern="pattern.key"
          @click="usePattern(pattern)"
        >
          <svg viewBox="0 0 64 40" fill="none" aria-hidden="true" v-html="ART[pattern.key]"></svg>
          <span>{{ t(`action_p_${pattern.key}`) }}<em v-if="pattern.later"> · {{ t('action_later') }}</em></span>
        </button>
      </div>
    </section>

    <section class="bm-act-block" data-sve-build-action-raw>
      <button type="button" class="bm-act-quiet" :aria-expanded="raw" data-sve-build-action-all @click="raw = !raw">
        <span v-html="ic('code')"></span>{{ t('action_raw') }}
      </button>
      <template v-if="raw">
        <div v-if="attrs.length" class="bm-act-raw" data-sve-build-action-attrs>
          <div v-for="attr in attrs" :key="attr.name" class="bm-act-raw__row" :data-sve-build-action-attr="attr.name">
            <template v-if="rawEditing === attr.name">
              <code>{{ attr.name }}</code>
              <input ref="editBox" v-model="draft" type="text" spellcheck="false" @keydown.enter.prevent="saveEdit" @keydown.esc.prevent.stop="rawEditing = ''" @blur="saveEdit" />
            </template>
            <button v-else type="button" class="bm-act-raw__attr" :title="`${attr.name}=&quot;${attr.value}&quot;`" @click="startEdit(attr)">
              <code>{{ attr.name }}</code><span>{{ attr.value }}</span>
            </button>
            <button type="button" class="bm-act-x" :title="t('alpine_remove')" :aria-label="t('alpine_remove')" :data-sve-build-action-drop="attr.name" @click="dropAttr(attr.name)" v-html="ic('minus')"></button>
          </div>
        </div>
        <template v-for="group in behaviourGroups" :key="group.id">
          <div class="bm-act-sub">{{ t(group.label) }}</div>
          <div class="bm-act-rows">
            <button v-for="item in group.rows" :key="item.id" type="button" :data-sve-build-action-behaviour="item.id" @click="runBehaviour(item)">
              <span>{{ t(item.label) }}</span><code>{{ behaviourHint(item) }}</code>
            </button>
          </div>
        </template>
      </template>
    </section>

    <Teleport to="body">
      <div
        v-if="open && panelSpot"
        class="sve-build bm-act-scrim"
        aria-hidden="true"
        data-sve-build-action-scrim
        :style="{ left: `${panelSpot.left}px`, top: `${panelSpot.top}px`, width: `${panelSpot.width}px`, height: `${panelSpot.height}px` }"
        @click="open = false"
      ></div>

      <div
        v-if="open"
        ref="editor"
        class="sve-build bm-act-pop"
        role="dialog"
        :aria-label="title"
        data-sve-build-action-editor
        :style="{ left: `${editorSpot.left}px`, top: `${editorSpot.top}px`, width: editorSpot.width ? `${editorSpot.width}px` : null }"
      >
        <header class="bm-act-pop__head">
          <b>{{ title }}</b>
          <span class="bm-act-pop__tag">{{ here }}</span>
          <button type="button" class="bm-act-pop__x" :aria-label="t('close')" @click="open = false" v-html="ic('x')"></button>
        </header>
        <div class="bm-act-pop__body">
          <div class="bm-act-flow" data-sve-build-action-flow>
            <span class="bm-act-flow__node"><code>&lt;{{ here }}&gt;</code><em>{{ t('action_flow_here') }}</em></span>
            <span class="bm-act-flow__arrow"><em>{{ whenWord(current ? current.attr : when).toLowerCase() }}</em></span>
            <span class="bm-act-flow__node is-switch"><code>{{ switchName }}</code><em>{{ t('action_flow_switch') }}</em></span>
            <span class="bm-act-flow__arrow"><em>{{ t('action_flow_on') }}</em></span>
            <span class="bm-act-flow__ends">
              <button
                v-for="f in followers"
                :key="`${f.path}-${f.attr}`"
                type="button"
                class="bm-act-flow__node"
                :title="t('action_flow_pick')"
                @click="open = false; port.select(f.path)"
              ><code>&lt;{{ tagOf(f) }}&gt;</code><em>{{ t('action_flow_follows') }}</em></button>
              <button v-if="!current && targetNode" type="button" class="bm-act-flow__node" @click="pickTarget"><code>&lt;{{ tagOf(targetNode) }}&gt;</code><em>{{ t('action_flow_follows') }}</em></button>
              <button v-if="!followers.length && !(!current && targetNode)" type="button" class="bm-act-flow__node is-empty" @click="pickTarget"><code>?</code><em>{{ t('action_flow_none') }}</em></button>
            </span>
          </div>

          <section class="bm-act-block is-first">
            <div class="bm-act-line">
              <span>{{ t('action_trigger') }}</span>
              <span class="bm-act-box">
                <span class="bm-act-box__val">{{ whenWord(current ? current.attr : when) }}</span>
                <span class="bm-act-caret" v-html="icon('caret')"></span>
                <select :value="current ? current.attr : when" :aria-label="t('action_trigger')" data-sve-build-action-trigger @change="setWhen($event.target.value)">
                  <option v-for="at in TRIGGERS" :key="at" :value="at">{{ whenWord(at) }}</option>
                </select>
              </span>
            </div>
            <div class="bm-act-line">
              <span>{{ t('action_does') }}</span>
              <span class="bm-act-seg">
                <button
                  v-for="[id, word] in DOES"
                  :key="id"
                  type="button"
                  :aria-pressed="(current ? current.does : does) === id"
                  :data-sve-build-action-does="id"
                  @click="setDoes(id)"
                >{{ t(word) }}</button>
              </span>
            </div>
            <div class="bm-act-line">
              <span>{{ t('alpine_name') }}</span>
              <code v-if="current" class="bm-act-box is-code">{{ current.name }}</code>
              <span v-else class="bm-act-namebox">
                <input v-model="typedName" type="text" spellcheck="false" :placeholder="nameNow" :aria-label="t('alpine_name')" data-sve-build-action-name />
                <button v-for="name in names" :key="name" type="button" :aria-pressed="nameNow === name" @click="typedName = name">{{ name }}</button>
              </span>
            </div>
          </section>

          <section class="bm-act-block" data-sve-build-action-followers>
            <div class="bm-act-head">
              <span>{{ t('action_followers') }}</span>
            </div>
            <div v-for="f in followers" :key="`${f.path}-${f.attr}`" class="bm-act-follow" :data-sve-build-action-follower="f.path">
              <span class="bm-act-follow__tag">{{ tagOf(f) }}</span>
              <span class="bm-act-box"><span class="bm-act-box__val">{{ thenWord(f.then) }}</span><code>{{ f.attr }}</code></span>
              <button type="button" class="bm-act-x" :aria-label="t('alpine_remove')" :title="t('alpine_remove')" @click="dropFollow(f.path, f)" v-html="ic('minus')"></button>
            </div>
            <button type="button" class="bm-act-pick" :class="{ 'is-picking': picking, 'is-set': !!targetNode }" data-sve-build-action-pick @click="pickTarget">
              <span v-html="ic('cursor')"></span>{{ picking ? t('action_picking') : targetNode ? `<${tagOf(targetNode)}>` : `+ ${t('action_pick')}` }}
            </button>
            <template v-if="targetNode">
              <div class="bm-act-line">
                <span>{{ t('action_then') }}</span>
                <span class="bm-act-box">
                  <span class="bm-act-box__val">{{ thenWord(thenId) }}</span>
                  <code>{{ behaviourHint(then) }}</code>
                  <select :value="thenId" :aria-label="t('action_then')" data-sve-build-action-then @change="thenId = $event.target.value">
                    <option v-for="item in THENS" :key="item.id" :value="item.id">{{ t(item.label) }}</option>
                  </select>
                </span>
              </div>
              <div v-if="needsClass" class="bm-act-line">
                <span>{{ t('action_class') }}</span>
                <input v-model="classes" class="bm-act-input" type="text" spellcheck="false" :placeholder="t('action_class_placeholder')" data-sve-build-action-class />
              </div>
            </template>
          </section>

          <section v-if="current && followers.some((f) => f.then.startsWith('show'))" class="bm-act-block" data-sve-build-action-motion>
            <div class="bm-act-head"><span>{{ t('action_motion') }}</span></div>
            <button
              v-for="f in followers.filter((one) => one.then.startsWith('show'))"
              :key="`m-${f.path}`"
              type="button"
              class="bm-act-quiet"
              data-sve-build-action-give-motion
              @click="giveMotion(f)"
            ><span v-html="ic('linkic')"></span>{{ t('action_give_motion', { tag: tagOf(f) }) }}</button>
            <p class="bm-act-hint">{{ t('action_motion_note', { name: switchName }) }}</p>
          </section>

          <section class="bm-act-block">
            <button type="button" class="bm-act-quiet" @click="openRaw"><span v-html="ic('code')"></span>{{ t('action_raw_on', { n: attrs.length }) }}</button>
          </section>

          <section class="bm-act-block bm-act-foot">
            <button v-if="tryRow" type="button" class="bm-act-btn" :aria-pressed="!!tryRow.alpineSet" data-sve-build-action-try @click="port.flipAlpine($event, tryRow.id)"><span v-html="icon('play')"></span>{{ t('action_try') }}</button>
            <button v-if="current" type="button" class="bm-act-btn" data-sve-build-action-remove @click="removeAction">{{ t('action_remove') }}</button>
            <button v-if="!current || targetNode" type="button" class="bm-act-btn is-primary" :disabled="!ready" data-sve-build-action-add @click="add">{{ t(current ? 'action_add_follower' : 'action_add') }}</button>
          </section>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style>
/*
 * Animation's frame (BuildAnimation.vue) in Action's own names: Block, Head,
 * Chip, Trigger, Tile, Line, Box, Seg, Switch, SmallBtn, Popover, in the
 * panel's greys. `bm-act-` only, under the panel's root.
 */
.sve-build .bm-scroll:has(> .bm-act) { padding: 0; border-top-width: 0; }
.sve-build .bm-act, .sve-build.bm-act-pop { --bm-quiet: color-mix(in srgb, var(--bm-ink) 38%, transparent); }
.sve-build .bm-act { padding-bottom: 0.25rem; }
.sve-build .bm-act .bm-ic, .sve-build.bm-act-pop .bm-ic { flex: none; width: 0.875rem; height: 0.875rem; }
.sve-build .bm-act-block { display: flex; flex-direction: column; gap: 0.5rem; padding: 0.625rem 0.75rem; border-top: 1px solid var(--bm-line); }
.sve-build .bm-act-block.is-first { border-top: 0; }
:root[data-sve-zones] .sve-build .bm-act > .bm-act-block { padding-inline: 0; }
.sve-build .bm-act-head { display: flex; align-items: center; font-size: 0.75rem; font-weight: 600; }
.sve-build .bm-act-none, .sve-build .bm-act-hint { margin: 0; color: var(--bm-faint); font-size: 0.625rem; line-height: 1.45; }
.sve-build .bm-act-none { color: var(--bm-muted); font-size: 0.6875rem; }
.sve-build .bm-act-hint.is-picking { color: var(--bm-accent); }
.sve-build .bm-act-sub { margin-top: 0.25rem; color: var(--bm-muted); font-size: 0.6875rem; font-weight: 600; }

/* Chip */
.sve-build .bm-act-chipwrap { position: relative; }
.sve-build .bm-act-chip { display: flex; align-items: center; gap: 0.5rem; width: 100%; height: 1.75rem; padding: 0 1.75rem 0 0.5rem; border-radius: 0.375rem; background: var(--bm-raise); border: 1px solid transparent; text-align: start; }
.sve-build .bm-act-chip:hover { background: var(--bm-hover); }
.sve-build .bm-act-chip[aria-pressed='true'] { background: color-mix(in srgb, var(--bm-accent) 22%, transparent); border-color: color-mix(in srgb, var(--bm-accent) 50%, transparent); }
.sve-build .bm-act-chip__ic { display: flex; color: var(--bm-muted); }
.sve-build .bm-act-chip[aria-pressed='true'] .bm-act-chip__ic { color: var(--bm-accent); }
.sve-build .bm-act-chip b { flex: none; font-weight: 600; }
.sve-build .bm-act-chip__sub { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--bm-muted); }
.sve-build .bm-act-chip__more { position: absolute; top: 50%; right: 0.25rem; display: grid; place-items: center; width: 1.25rem; height: 1.25rem; border-radius: 0.25rem; color: var(--bm-muted); transform: translateY(-50%); }
.sve-build .bm-act-chip__more:hover { background: var(--bm-hover); color: var(--bm-ink); }
.sve-build .bm-act-menu { position: absolute; top: calc(100% + 0.25rem); right: 0; z-index: 5; display: grid; min-width: 11rem; padding: 0.25rem; border: 1px solid var(--bm-edge); border-radius: 0.5rem; background: var(--bm-panel); box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.4); }
.sve-build .bm-act-menu button { display: flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.5rem; border-radius: 0.375rem; text-align: start; }
.sve-build .bm-act-menu button:hover { background: var(--bm-hover); }

/* Switches */
.sve-build .bm-act-switchrow { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 0.5rem; }
.sve-build .bm-act-switchrow code, .sve-build .bm-act-box code { padding: 0.0625rem 0.3125rem; border-radius: 0.25rem; background: var(--bm-hover); color: var(--bm-muted); font: 0.625rem var(--bm-mono); white-space: nowrap; }
.sve-build .bm-act-switchrow > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--bm-faint); font-size: 0.6875rem; }
.sve-build .bm-act-switch { position: relative; justify-self: end; width: 1.75rem; height: 1rem; border-radius: 0.5rem; background: var(--bm-hover); transition: background 0.15s; }
.sve-build .bm-act-switch::after { content: ''; position: absolute; top: 0.125rem; left: 0.125rem; width: 0.75rem; height: 0.75rem; border-radius: 50%; background: var(--bm-ink); transition: left 0.15s; }
.sve-build .bm-act-switch[aria-checked='true'] { background: var(--bm-accent); }
.sve-build .bm-act-switch[aria-checked='true']::after { left: 0.875rem; }

/* Triggers */
.sve-build .bm-act-triggers { display: flex; flex-direction: column; gap: 0.0625rem; margin-inline: -0.5rem; }
.sve-build .bm-act-trigger { display: flex; align-items: center; gap: 0.625rem; padding: 0.375rem 0.5rem; border-radius: 0.375rem; text-align: start; }
.sve-build .bm-act-trigger:hover { background: color-mix(in srgb, var(--bm-raise) 60%, transparent); }
.sve-build .bm-act-trigger[aria-pressed='true'] { background: var(--bm-raise); }
.sve-build .bm-act-trigger__ic { display: flex; color: var(--bm-accent); }
.sve-build .bm-act-trigger__word { flex: 1; min-width: 0; }

/* Library */
.sve-build .bm-act-lib { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.375rem; }
.sve-build .bm-act-tile { display: flex; flex-direction: column; align-items: center; gap: 0.375rem; padding: 0.625rem 0.375rem 0.5rem; border-radius: 0.5rem; background: var(--bm-raise); border: 1px solid transparent; transition: background 0.12s; }
.sve-build .bm-act-tile:hover { background: var(--bm-hover); }
.sve-build .bm-act-tile[aria-pressed='true'] { border-color: color-mix(in srgb, var(--bm-accent) 60%, transparent); }
.sve-build .bm-act-tile svg { width: 4rem; height: 2.5rem; }
.sve-build .bm-act-tile > span { color: var(--bm-muted); font-size: 0.625rem; line-height: 1.2; text-align: center; }
.sve-build .bm-act-tile em { font-style: normal; }
.sve-build .bm-act-tile.is-later { opacity: 0.45; cursor: default; }
.sve-build .bm-act-tile.is-later:hover { background: var(--bm-raise); }

/* QuietLink, raw Alpine */
.sve-build .bm-act-quiet { display: flex; align-items: center; gap: 0.5rem; color: var(--bm-muted); font-size: 0.6875rem; text-align: start; }
.sve-build .bm-act-quiet:hover { color: var(--bm-ink); }
.sve-build .bm-act-quiet .bm-ic { color: var(--bm-faint); }
.sve-build .bm-act-raw { display: flex; flex-direction: column; gap: 0.125rem; }
.sve-build .bm-act-raw__row { display: grid; grid-template-columns: minmax(0, 1fr) 1rem; align-items: center; gap: 0.375rem; }
.sve-build .bm-act-raw__row:has(input) { grid-template-columns: auto minmax(0, 1fr) 1rem; }
.sve-build .bm-act-raw__attr { display: flex; gap: 0.375rem; min-width: 0; padding: 0.25rem 0.375rem; border-radius: 0.25rem; background: var(--bm-raise); text-align: start; }
.sve-build .bm-act-raw__attr:hover { background: var(--bm-hover); }
.sve-build .bm-act-raw code { font: 0.625rem var(--bm-mono); color: var(--bm-ink); white-space: nowrap; }
.sve-build .bm-act-raw__attr span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--bm-muted); font: 0.625rem var(--bm-mono); }
.sve-build .bm-act-raw input, .sve-build .bm-act-input { min-width: 0; height: 1.625rem; padding: 0 0.5rem; border: 0; border-radius: 0.375rem; background: var(--bm-raise); color: var(--bm-ink); font: 0.6875rem var(--bm-mono); }
.sve-build .bm-act-raw input:focus, .sve-build .bm-act-input:focus, .sve-build .bm-act-namebox input:focus { outline: 0.125rem solid var(--bm-accent); outline-offset: 1px; }
.sve-build .bm-act-rows { display: flex; flex-direction: column; gap: 0.0625rem; margin-inline: -0.5rem; }
.sve-build .bm-act-rows button { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; padding: 0.3125rem 0.5rem; border-radius: 0.375rem; text-align: start; }
.sve-build .bm-act-rows button:hover { background: var(--bm-raise); }
.sve-build .bm-act-rows code { color: var(--bm-faint); font: 0.625rem var(--bm-mono); white-space: nowrap; }
.sve-build .bm-act-x { display: flex; color: var(--bm-faint); }
.sve-build .bm-act-x:hover { color: var(--bm-ink); }

/* Popover */
.sve-build.bm-act-pop { position: fixed; z-index: 99999; display: flex; flex-direction: column; width: 20rem; height: auto; max-height: calc(100vh - 1rem); border: 1px solid var(--bm-edge); border-radius: 0.75rem; box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.45); overflow: hidden; }
.sve-build .bm-act-pop__head { flex: none; display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 0.75rem; }
.sve-build .bm-act-pop__head b { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }
.sve-build .bm-act-pop__tag { flex: none; padding: 0.0625rem 0.375rem; border-radius: 0.25rem; background: var(--bm-hover); color: var(--bm-muted); font-size: 0.625rem; }
.sve-build .bm-act-pop__x { display: flex; margin-left: auto; color: var(--bm-faint); }
.sve-build .bm-act-pop__x:hover { color: var(--bm-ink); }
.sve-build .bm-act-pop__body { min-height: 0; overflow: auto; }

/* Flow: who talks to whom, as the stage is Animation's */
.sve-build .bm-act-flow { display: flex; align-items: center; justify-content: center; gap: 0.375rem; min-height: 8rem; padding: 0.75rem; background: var(--bm-bg); }
.sve-build .bm-act-flow__node { display: flex; flex-direction: column; align-items: center; gap: 0.125rem; max-width: 6rem; padding: 0.375rem 0.5rem; border: 1px solid var(--bm-edge); border-radius: 0.375rem; background: var(--bm-raise); }
.sve-build button.bm-act-flow__node:hover { border-color: color-mix(in srgb, var(--bm-accent) 60%, transparent); }
.sve-build .bm-act-flow__node code { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 0.625rem var(--bm-mono); color: var(--bm-ink); }
.sve-build .bm-act-flow__node em, .sve-build .bm-act-flow__arrow em { font-style: normal; color: var(--bm-faint); font-size: 0.5625rem; }
.sve-build .bm-act-flow__node.is-switch { border-color: color-mix(in srgb, var(--bm-accent) 70%, transparent); background: color-mix(in srgb, var(--bm-accent) 18%, transparent); }
.sve-build .bm-act-flow__node.is-empty { border-style: dashed; }
.sve-build .bm-act-flow__arrow { display: flex; flex-direction: column; align-items: center; min-width: 1.75rem; }
.sve-build .bm-act-flow__arrow::after { content: ''; width: 100%; border-top: 1px solid var(--bm-quiet); }
.sve-build .bm-act-flow__ends { display: flex; flex-direction: column; gap: 0.25rem; }

/* Line, Box, Seg, inputs */
.sve-build .bm-act-line { display: grid; grid-template-columns: 5.75rem minmax(0, 1fr); align-items: center; gap: 0.5rem; }
.sve-build .bm-act-line > span:first-child { color: var(--bm-muted); font-size: 0.6875rem; white-space: nowrap; }
.sve-build .bm-act-box { position: relative; display: flex; align-items: center; gap: 0.375rem; min-width: 0; height: 1.625rem; padding: 0 0.5rem; border-radius: 0.375rem; background: var(--bm-raise); }
.sve-build .bm-act-box:hover { background: var(--bm-hover); }
.sve-build .bm-act-box.is-code { font: 0.6875rem var(--bm-mono); color: var(--bm-ink); }
.sve-build .bm-act-box__val { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sve-build .bm-act-caret { display: flex; color: var(--bm-faint); }
.sve-build .bm-act-box select { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
.sve-build .bm-act-box:has(select:focus-visible) { outline: 0.125rem solid var(--bm-accent); outline-offset: 1px; }
.sve-build .bm-act-seg { display: flex; gap: 0.125rem; padding: 0.125rem; border-radius: 0.375rem; background: var(--bm-raise); }
.sve-build .bm-act-seg button { flex: 1; padding: 0.25rem 0.375rem; border-radius: 0.25rem; color: var(--bm-faint); font-size: 0.6875rem; white-space: nowrap; text-align: center; }
.sve-build .bm-act-seg button:hover { color: var(--bm-ink); }
.sve-build .bm-act-seg button[aria-pressed='true'] { background: var(--bm-accent); color: #fff; }
.sve-build .bm-act-namebox { display: flex; flex-wrap: wrap; align-items: center; gap: 0.25rem; min-width: 0; }
.sve-build .bm-act-namebox input { flex: 1 1 5rem; min-width: 0; height: 1.625rem; padding: 0 0.5rem; border: 0; border-radius: 0.375rem; background: var(--bm-raise); color: var(--bm-ink); font: 0.6875rem var(--bm-mono); }
.sve-build .bm-act-namebox button { padding: 0.0625rem 0.3125rem; border-radius: 0.25rem; background: var(--bm-hover); color: var(--bm-muted); font: 0.625rem var(--bm-mono); }
.sve-build .bm-act-namebox button[aria-pressed='true'] { background: var(--bm-accent); color: #fff; }

/* Followers */
.sve-build .bm-act-follow { display: grid; grid-template-columns: 5.75rem minmax(0, 1fr) 1rem; align-items: center; gap: 0.5rem; }
.sve-build .bm-act-follow__tag { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--bm-muted); font: 0.625rem var(--bm-mono); }
.sve-build .bm-act-pick { display: flex; align-items: center; gap: 0.375rem; color: var(--bm-faint); font-size: 0.625rem; text-align: start; }
.sve-build .bm-act-pick:hover, .sve-build .bm-act-pick.is-set { color: var(--bm-ink); }
.sve-build .bm-act-pick.is-picking { color: var(--bm-accent); }

/* SmallBtn, foot */
.sve-build .bm-act-foot { flex-direction: row; align-items: center; gap: 0.375rem; }
.sve-build .bm-act-foot .is-primary { margin-left: auto; }
.sve-build .bm-act-btn { display: inline-flex; align-items: center; gap: 0.375rem; height: 1.625rem; padding: 0 0.625rem; border-radius: 0.375rem; background: var(--bm-raise); color: var(--bm-ink); font-size: 0.6875rem; font-weight: 600; white-space: nowrap; }
.sve-build .bm-act-btn:hover { background: var(--bm-hover); }
.sve-build .bm-act-btn[aria-pressed='true'] { color: var(--bm-accent); }
.sve-build .bm-act-btn.is-primary { background: var(--bm-accent); color: #fff; }
.sve-build .bm-act-btn.is-primary:hover { background: color-mix(in srgb, var(--bm-accent) 85%, #fff); }
.sve-build .bm-act-btn:disabled { opacity: 0.5; cursor: default; }

/* Scrim: the panel dimmed and softened under the editor; the canvas beside it stays clear */
.sve-build.bm-act-scrim { position: fixed; z-index: 99998; height: auto; min-height: 0; background: color-mix(in srgb, var(--bm-bg) 55%, transparent); -webkit-backdrop-filter: blur(0.1875rem); backdrop-filter: blur(0.1875rem); }
</style>
