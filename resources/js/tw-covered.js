/**
 * Which padding, margin and gap classes a class just written makes pointless.
 *
 * `py-1000 pt-2 pb-2.5`: nothing is left of `py-1000`, since Tailwind sorts a
 * side after its axis and an axis after all sides. A class goes when what it
 * sets is set by narrower ones, and a class that widens over narrower ones takes
 * them along, or they would go on winning over it (`py-4` over `pt-2`).
 *
 * Pure functions over class names without variants. The caller hands in the
 * classes of one size and state, so `max-md:pt-2` never ends `py-1000`.
 */

const BOX_SIDES = {
  '': ['t', 'r', 'b', 'l'],
  x: ['l', 'r'],
  y: ['t', 'b'],
  t: ['t'],
  bs: ['t'],
  b: ['b'],
  be: ['b'],
  l: ['l'],
  s: ['l'],
  r: ['r'],
  e: ['r'],
};

const BOX = /^-?([pm])(x|y|t|bs|be|b|l|s|r|e)?-/;
const GAP = /^gap(?:-([xy]))?-/;

/** `{ family, sides }` of a class, or null when it is not padding, margin or gap. */
function reach(name) {
  const gap = String(name).match(GAP);

  if (gap) {
    return { family: 'gap', sides: gap[1] ? [gap[1]] : ['x', 'y'] };
  }

  const box = String(name).match(BOX);

  return box ? { family: box[1], sides: BOX_SIDES[box[2] || ''] } : null;
}

const within = (sides, outer) => sides.every((side) => outer.includes(side));

/**
 * The classes among `names` that `name`, just written, leaves with nothing to do.
 *
 * @param {string[]} names the element's classes at this size and state, `name` among them
 * @param {string} name
 * @returns {string[]}
 */
export function coveredBy(names, name) {
  const own = reach(name);

  if (!own) {
    return [];
  }

  const others = [...new Set(names)]
    .filter((other) => other !== name)
    .map((other) => ({ name: other, ...reach(other) }))
    .filter((other) => other.family === own.family);
  const replaced = others.filter((other) => within(other.sides, own.sides));
  const left = [...others.filter((other) => !replaced.includes(other)), { name, ...own }];
  const dead = left.filter((wide) => wide.name !== name && within(
    wide.sides,
    left.filter((narrow) => narrow.sides.length < wide.sides.length).flatMap((narrow) => narrow.sides)
  ));

  return [...replaced, ...dead].map((other) => other.name);
}
