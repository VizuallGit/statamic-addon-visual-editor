<template>
  <div class="sve-theme__section">
    <span class="sve-theme__section-title">{{ ui.labels.fonts_installed }}</span>
    <p class="sve-theme__hint" style="margin: -0.375rem 0 0">{{ ui.labels.fonts_installed_hint }}</p>
    <p v-if="!ui.fontsWritable" class="sve-theme__note">{{ ui.labels.fonts_not_writable }}</p>
    <p v-if="ui.fontsStatus" class="sve-theme__fonts-status">{{ ui.fontsStatus }}</p>

    <p v-if="!ui.installed.length" class="sve-theme__empty">{{ ui.labels.fonts_empty }}</p>
    <div v-else class="sve-theme__fonts">
      <div v-for="family in ui.installed" :key="family.name" class="sve-theme__font" :data-sve-font="family.name">
        <span class="sve-theme__font-top">
          <span class="sve-theme__font-name" :style="{ fontFamily: `'${familyAlias(family.name)}', ui-sans-serif, system-ui, sans-serif` }">{{ family.name }}</span>
          <span class="sve-theme__font-uses">
            <span v-for="use in usesOf(family.name)" :key="use">{{ use }}</span>
          </span>
        </span>
        <span class="sve-theme__font-meta">{{ summary(family) }}</span>
      </div>
    </div>
  </div>

  <div v-if="ui.kits.length" class="sve-theme__section">
    <span class="sve-theme__section-title">{{ ui.labels.fonts_kits }}</span>
    <div class="sve-theme__fonts">
      <div v-for="kit in ui.kits" :key="kit.url" class="sve-theme__font">
        <span class="sve-theme__font-meta">{{ kit.url }}</span>
        <span v-if="kit.families.length" class="sve-theme__font-kit">
          <span v-for="name in kit.families" :key="name" :style="{ fontFamily: `'${name}', ui-sans-serif, system-ui, sans-serif` }">{{ name }}</span>
        </span>
        <span v-else class="sve-theme__font-meta">{{ ui.labels.fonts_kit_unreadable }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { themePanelUi as ui } from '../theme-panel/store.js';
import { familyAlias, familyShape, formatBytes } from '../theme-panel/font-helpers.js';
import { firstFamily } from '../theme-panel/presets.js';

defineProps({ h: { type: Object, required: true } });

const label = (key, fallback, n = null) => String(ui.labels[key] || fallback).replace(':count', n ?? '');

/** `Variable 300–900 · italic · 2 files · 64 KB`, `3 weights (400–700) · 1 file · 36 KB`. */
function summary(family) {
  const shape = familyShape(family);
  const parts = [];

  if (shape.variable) {
    parts.push(`${label('fonts_variable', 'Variable')} ${shape.weights}`);
  } else if (shape.count) {
    parts.push(`${shape.count === 1 ? label('fonts_weight_one', '1 weight') : label('fonts_weights', ':count weights', shape.count)} (${shape.weights})`);
  }

  if (shape.italic) {
    parts.push(label('fonts_italic', 'italic'));
  }

  if (family.files) {
    parts.push(family.files === 1 ? label('fonts_file_one', '1 file') : label('fonts_files', ':count files', family.files));
    parts.push(formatBytes(family.bytes));
  } else if (family.faces.some((f) => f.missing)) {
    parts.push(label('fonts_missing', 'file missing'));
  }

  return parts.join(' · ');
}

/** "Body", "Headings", "Button" — what the theme draws in this family. */
function usesOf(name) {
  const uses = [];
  const key = name.toLowerCase();

  if (firstFamily(ui.type['font-base']).toLowerCase() === key) {
    uses.push(ui.labels.type_body || 'Body');
  }

  if (firstFamily(ui.type['font-heading']).toLowerCase() === key) {
    uses.push(ui.labels.type_headings || 'Headings');
  }

  return uses;
}
</script>
