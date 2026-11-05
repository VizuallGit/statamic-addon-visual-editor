/**
 * A box in Build's Content typed into: the file's value until it is typed in,
 * then the box's, written once a frame — or, `live: false`, once typing is over
 * (raw HTML, where every keystroke on the way is half a tag). `typing` says the
 * box is being typed in: what is drawn from the file must not take the box away
 * from under the caret while the file holds only a keystroke's worth of it.
 *
 * Shared by BuildContent.vue and BuildAttrs.vue: one way a box writes.
 *
 * May import: vue.
 */
import { ref, watch } from 'vue';

export function typed(fromFile, write, { live = true } = {}) {
  const value = ref(fromFile.value ?? '');
  const typing = ref(false);
  let frame = 0;
  const flush = () => {
    frame = 0;
    write(value.value);
  };

  watch(fromFile, (next) => {
    if (!typing.value && next !== null) {
      value.value = next;
    }
  });

  return {
    value,
    typing,
    input() {
      typing.value = true;

      if (live && !frame) {
        frame = window.requestAnimationFrame(flush);
      }
    },
    /** Typing over: what is still on its way is written, and the box reads the file again. */
    done() {
      if (frame) {
        window.cancelAnimationFrame(frame);
        flush();
      } else if (!live && typing.value) {
        flush();
      }

      typing.value = false;

      if (fromFile.value !== null) {
        value.value = fromFile.value;
      }
    },
  };
}
