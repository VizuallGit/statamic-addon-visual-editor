import { reactive } from 'vue';

/**
 * The CSS/Tailwind icon row, as state rather than as attributes on buttons.
 *
 * One list. Each entry is a tool — icon, whether it is set, whether it is
 * open — and carries its own children in the same shape. The row and the
 * children it unfolds are drawn by one loop over this, so a change to how a
 * tool looks or behaves reaches every one of them at once.
 */
export const cssToolsUi = reactive({
  tools: [],
  onTool: null,
  onKid: null,
});
