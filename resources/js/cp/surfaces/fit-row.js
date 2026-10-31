/**
 * One line of buttons in Build's Style, and a ⋯ for those that do not fit.
 *
 * The row is a wrapping flex box one line high (`.fg-fit`): what wraps is what
 * does not fit, and the browser has already measured it. ⋯ takes room itself,
 * so the row is read without it first, or a row that fits would go on showing it.
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

/**
 * @param {import('vue').Ref<HTMLElement|null>} list the `.fg-fit` row
 * @param {import('vue').Ref<HTMLElement|null>} more the ⋯ button, rendered with `display: none`
 * @param {import('vue').Ref<HTMLElement|null>} panel what ⋯ opens; a press outside it and ⋯ shuts it
 * @returns {{ hidden: import('vue').Ref<number>, open: import('vue').Ref<boolean>, toggle: () => void, measure: () => void }}
 */
export function useFitRow(list, more, panel) {
  const hidden = ref(0);
  const open = ref(false);
  let size = null;
  let content = null;

  function wrapped(row) {
    const kids = [...row.children];

    return kids.filter((kid) => kid.offsetTop > kids[0].offsetTop);
  }

  function measure() {
    const row = list.value;
    const button = more.value;

    if (!row?.children.length || !button) {
      hidden.value = 0;

      return;
    }

    button.style.display = 'none';

    let out = wrapped(row);

    if (out.length) {
      button.style.display = '';
      out = wrapped(row);
    }

    [...row.children].forEach((kid) => {
      kid.style.visibility = out.includes(kid) ? 'hidden' : '';
    });
    hidden.value = out.length;

    if (!out.length) {
      open.value = false;
    }
  }

  function watchRow(row) {
    size?.disconnect();
    content?.disconnect();

    if (row) {
      size = new ResizeObserver(measure);
      size.observe(row);
      content = new MutationObserver(measure);
      content.observe(row, { childList: true, characterData: true, subtree: true });
      measure();
    }
  }

  function shut(event) {
    const target = event.target;

    if (!panel.value?.contains(target) && !more.value?.contains(target)) {
      open.value = false;
    }
  }

  function onKey(event) {
    // Only the list: Build's own Escape would let go of the element as well.
    if (event.key === 'Escape') {
      event.stopPropagation();
      open.value = false;
    }
  }

  function onLeave() {
    open.value = false;
  }

  watch(open, (now) => {
    const act = now ? 'addEventListener' : 'removeEventListener';

    document[act]('pointerdown', shut, true);
    document[act]('keydown', onKey, true);
    // A press on the canvas is in another document, and only this says so.
    window[act]('blur', onLeave);
  });

  // A v-if around the row hands over a new element.
  watch(list, watchRow, { flush: 'post' });
  onMounted(() => watchRow(list.value));
  onBeforeUnmount(() => {
    open.value = false;
    document.removeEventListener('pointerdown', shut, true);
    document.removeEventListener('keydown', onKey, true);
    window.removeEventListener('blur', onLeave);
    size?.disconnect();
    content?.disconnect();
  });

  return {
    hidden,
    open,
    measure,
    toggle() {
      open.value = !open.value;
    },
  };
}
