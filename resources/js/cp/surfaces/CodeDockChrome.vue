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
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M3.75 2A1.75 1.75 0 0 0 2 3.75v1c0 .966.784 1.75 1.75 1.75h.418A1.74 1.74 0 0 0 4 7.25v1.5c0 .49.201.932.525 1.25c-.324.318-.525.76-.525 1.25v1c0 .966.784 1.75 1.75 1.75h6.5A1.75 1.75 0 0 0 14 12.25v-1c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1.5c0-.49-.201-.932-.525-1.25c.324-.318.525-.76.525-1.25v-1A1.75 1.75 0 0 0 12.25 2zm8.5 7.5H8v-3h4.25a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75M7 6.5v3H5.75A.75.75 0 0 1 5 8.75v-1.5a.75.75 0 0 1 .75-.75zm1 4h4.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75H8zm-1 0V13H5.75a.75.75 0 0 1-.75-.75v-1a.75.75 0 0 1 .75-.75zm-1-5V3h6.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75zm-1 0H3.75A.75.75 0 0 1 3 4.75v-1A.75.75 0 0 1 3.75 3H5z"/></svg>
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
