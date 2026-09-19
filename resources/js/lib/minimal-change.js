/**
 * The one span to replace to turn `before` into `after`.
 *
 * A whole-document replacement maps every cursor to the end of the file, and
 * everything that follows the cursor follows it: the HTML tree's row, the
 * Tailwind strip's tag, the preview's focus. Replacing only what differs keeps
 * a caret that sits outside the change exactly where it was.
 *
 * @returns {[number, number, string]}  from, to, insert
 */
export function minimalChange(before, after) {
  let start = 0;
  const max = Math.min(before.length, after.length);

  while (start < max && before[start] === after[start]) {
    start += 1;
  }

  let endBefore = before.length;
  let endAfter = after.length;

  while (endBefore > start && endAfter > start && before[endBefore - 1] === after[endAfter - 1]) {
    endBefore -= 1;
    endAfter -= 1;
  }

  return [start, endBefore, after.slice(start, endAfter)];
}
