<template>
  <div ref="host" class="sve-theme__code" data-sve-utility-editor></div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { loadCodeMirror, vscTheme } from '../../lib/codemirror.js';
import { cssCompletions } from '../theme-panel/css-complete.js';

/**
 * One rule's CSS in the Styles tab: CodeMirror over the body only — what goes
 * between `{` and `}`. Every change goes up as it is typed; Mod-S saves.
 *
 * Completion is ours, not the CSS language's. Without a selector around it a
 * bare `background` parses as one, so CodeMirror's own source offers nothing
 * where a property is wanted. `tokens` are the theme's custom properties, for
 * inside `var(`.
 */
const props = defineProps({
  value: { type: String, default: '' },
  label: { type: String, default: '' },
  onChange: { type: Function, required: true },
  onSave: { type: Function, required: true },
  tokens: { type: Array, default: () => [] },
});

const host = ref(null);
let view = null;
let applying = false;

onMounted(async () => {
  const cm = await loadCodeMirror();

  // Closed again while CodeMirror loaded.
  if (!host.value) {
    return;
  }

  const { EditorView, keymap, tooltips } = cm.view;
  const { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } = cm.autocomplete;
  const { defaultKeymap, history, historyKeymap, indentWithTab } = cm.commands;

  view = new EditorView({
    parent: host.value,
    state: cm.state.EditorState.create({
      doc: props.value,
      extensions: [
        history(),
        cm.langCss.css(),
        closeBrackets(),
        autocompletion({
          activateOnTyping: true,
          tooltipClass: () => 'sve-theme-complete',
          override: [cssCompletions(() => props.tokens)],
        }),
        // In the CP's <body>, so the list is not cut off by the sidebar.
        tooltips({ parent: host.value.ownerDocument.body }),
        keymap.of([
          { key: 'Mod-s', run: () => (props.onSave(), true) },
          ...closeBracketsKeymap,
          ...completionKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          indentWithTab,
        ]),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({ 'aria-label': props.label }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !applying) {
            props.onChange(update.state.doc.toString());
          }
        }),
        ...vscTheme(cm, {
          height: 'auto',
          background: '#161618',
          scroller: { overflow: 'auto', maxHeight: '22rem', minHeight: '5.5rem' },
        }),
        EditorView.theme({
          '.cm-content': { padding: '0.5rem 0', fontSize: '0.75rem' },
          '.cm-line': { padding: '0 0.625rem' },
        }),
      ],
    }),
  });

  view.focus();
});

// A save or a discard puts a new body in: the editor takes it, unless it is what it has.
watch(() => props.value, (value) => {
  if (!view || value === view.state.doc.toString()) {
    return;
  }

  applying = true;
  view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
  applying = false;
});

onBeforeUnmount(() => {
  view?.destroy();
  view = null;
});
</script>
