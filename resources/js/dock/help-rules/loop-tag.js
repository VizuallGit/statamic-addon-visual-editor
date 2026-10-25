/**
 * On a loop's own tag (`{{ items }}`, `{{ collection:x }}`) the question is
 * what it repeats, and only that: the loop panel opens, nothing is written.
 *
 * Runs before the element rules, on the Antlers blocks alone — the caret is
 * inside a tag, not an element.
 */

/** The field loop whose opening tag the caret is on, or null. */
export function loopTagAt(blocks, pos) {
  return blocks.find((block) => block.kind === 'loop' && pos >= block.from && pos <= block.openTo) || null;
}

export function loopTagRule(blocks, pos) {
  const loop = loopTagAt(blocks, pos);

  if (!loop) {
    return [];
  }

  return [
    {
      id: 'loop-ask',
      key: 'code_dock_help_loop_ask',
      args: { name: loop.name },
      meta: loop.expr,
      changes: [],
      selection: null,
      after: 'loop',
      loop,
    },
  ];
}
