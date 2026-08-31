<script setup>
defineProps({
  htmlLabel: { type: String, required: true },
  cssLabel: { type: String, required: true },
  jsLabel: { type: String, required: true },
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7.5" y="7.5" width="9" height="9" rx="1"/></svg>
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
