<script setup>
defineProps({
  htmlLabel: { type: String, required: true },
  cssLabel: { type: String, required: true },
  jsLabel: { type: String, required: true },
  // Drawn from code-dock.js, which repaints this button as its state changes.
  treeIcon: { type: String, required: true },
});
</script>

<template>
  <div class="sve-code-dock">
    <div data-sve-code-grip aria-hidden="true"></div>
    <div data-sve-code-bar>
      <button type="button" data-sve-code-pane-btn="html">{{ htmlLabel }}</button>
      <button type="button" data-sve-code-pane-btn="css">{{ cssLabel }}</button>
      <button type="button" data-sve-code-pane-btn="js">{{ jsLabel }}</button>
      <button type="button" data-sve-code-back hidden></button>
      <span data-sve-code-path></span>
      <span data-sve-code-status></span>
      <button type="button" data-sve-html-scope aria-pressed="true">
        <span v-html="treeIcon"></span>
      </button>
      <button type="button" data-sve-code-autosave aria-pressed="true"></button>
      <button type="button" data-sve-code-save hidden></button>
      <button type="button" data-sve-code-lock hidden></button>
    </div>
    <div data-sve-code-lock-banner></div>
    <div data-sve-code-panes>
      <div data-sve-code-pane="html">
        <div data-sve-code-pane-label>
          <span>{{ htmlLabel }}</span>
          <div data-sve-html-tools></div>
          <div data-sve-visual-edit-tools></div>
          <div data-sve-antlers-tools></div>
        </div>
        <div data-sve-code-host></div>
      </div>
      <div data-sve-code-split data-sve-code-split-after="html"></div>
      <div data-sve-code-pane="css">
        <div data-sve-css-chrome="subrow-2">
          <div data-sve-code-pane-label>
            <span>{{ cssLabel }}</span>
            <button type="button" data-sve-css-add-class></button>
            <div data-sve-css-tools></div>
          </div>
          <div data-sve-css-subrow>
            <div data-sve-css-sub="box"></div>
            <div data-sve-css-sub="display"></div>
          </div>
        </div>
        <div data-sve-code-host></div>
      </div>
      <div data-sve-code-split data-sve-code-split-after="css"></div>
      <div data-sve-code-pane="js">
        <div data-sve-code-pane-label><span>{{ jsLabel }}</span></div>
        <div data-sve-code-host></div>
      </div>
    </div>
  </div>
</template>
