<script setup>
defineProps({
  htmlLabel: { type: String, required: true },
  cssLabel: { type: String, required: true },
  jsLabel: { type: String, required: true },
  alpineLabel: { type: String, required: true },
  // Drawn from code-dock.js, which repaints this button as its state changes.
  treeIcon: { type: String, required: true },
  dataIcon: { type: String, required: true },
  dataLabel: { type: String, required: true },
});
</script>

<template>
  <div class="sve-code-dock">
    <div data-sve-code-grip aria-hidden="true"></div>
    <div data-sve-code-bar>
      <button type="button" data-sve-code-pane-btn="html">{{ htmlLabel }}</button>
      <button type="button" data-sve-code-pane-btn="css">{{ cssLabel }}</button>
      <button type="button" data-sve-code-pane-btn="alpine">{{ alpineLabel }}</button>
      <button type="button" data-sve-code-pane-btn="js">{{ jsLabel }}</button>
      <button type="button" data-sve-code-back hidden></button>
      <span data-sve-code-path></span>
      <span data-sve-code-status></span>
      <button type="button" data-sve-code-strip></button>
      <button type="button" data-sve-code-history></button>
      <button type="button" data-sve-style-mode></button>
      <button type="button" data-sve-values-mode></button>
      <button type="button" data-sve-code-autosave aria-pressed="true"></button>
      <button type="button" data-sve-code-save hidden></button>
      <!-- The tree's switch stands next to the lock, at the row's end: the two
           that decide what the panes show and whether they may be written. -->
      <button type="button" data-sve-html-scope aria-pressed="true">
        <span v-html="treeIcon"></span>
      </button>
      <button type="button" data-sve-code-lock hidden></button>
    </div>
    <div data-sve-code-lock-banner></div>
    <div data-sve-code-panes>
      <div data-sve-code-pane="html">
        <div data-sve-code-pane-label>
          <span>{{ htmlLabel }}</span>
          <div data-sve-html-tools></div>
          <!--
            Tidy is not a thing to write, it is a thing to do to what is
            written — so it stands with the other tools that act on the file,
            not in the strip of tags you build with.
          -->
          <button type="button" data-sve-html-tidy></button>
          <button type="button" data-sve-data-vars :title="dataLabel" :aria-label="dataLabel">
            <span v-html="dataIcon"></span>
          </button>
          <div data-sve-visual-edit-tools></div>
          <div data-sve-antlers-tools></div>
        </div>
        <!--
          What is wrong with the file, in words (dock/problems.js paints it;
          template-lint.js finds it). Hidden while there is nothing to say.
        -->
        <div data-sve-html-problems hidden></div>
        <div data-sve-code-host></div>
      </div>
      <div data-sve-code-split data-sve-code-split-after="html"></div>
      <div data-sve-code-pane="css">
        <div data-sve-css-chrome="subrow-2">
          <div data-sve-code-pane-label>
            <span data-sve-css-label>{{ cssLabel }}</span>
            <button type="button" data-sve-css-add-class></button>
            <div data-sve-css-tools></div>
          </div>
        </div>
        <div data-sve-css-head></div>
        <div data-sve-code-host></div>
        <div data-sve-tw-host></div>
      </div>
      <div data-sve-code-split data-sve-code-split-after="css"></div>
      <!--
        Alpine is not a fourth part of the file — it is the attributes on the
        tags in the HTML — so this pane holds a panel, not an editor. It sits
        beside the CSS it works with, before the JS nobody opens as often.
      -->
      <div data-sve-code-pane="alpine">
        <div data-sve-code-pane-label><span>{{ alpineLabel }}</span></div>
        <div data-sve-alpine-host></div>
      </div>
      <div data-sve-code-split data-sve-code-split-after="alpine"></div>
      <div data-sve-code-pane="js">
        <div data-sve-code-pane-label><span>{{ jsLabel }}</span></div>
        <div data-sve-code-host></div>
      </div>
    </div>
  </div>
</template>
