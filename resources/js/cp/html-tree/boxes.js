/**
 * Where the Figma look's boxes end (HtmlTreeList.vue).
 *
 * The look draws every open element as a box with its children inside it,
 * but the rows come flat, in document order — so a box is the run from an
 * open row to the last row inside it. After each row (or the room an empty
 * one shows, one level in) as many boxes close as the next row stands levels
 * further out. `ends` is that count for the row and `roomEnds` for its room;
 * `after` is what the row before it closed, so the row knows how far up the
 * boxes it is still inside have to reach.
 *
 * @param {Array<{ id: string, depth: number }>} rows
 * @param {(row: object) => boolean} showsRoom whether a row shows its empty room
 * @param {number} tail the depth the list goes on at after its last row — 1
 *   on the layout, where the page's sections follow inside <main>'s box
 * @returns {Map<string, { ends: number, after: number, roomEnds: number }>}
 */
export function treeBoxes(rows, showsRoom, tail = 0) {
  const items = [];

  for (const row of rows) {
    items.push({ row, depth: row.depth, room: false });

    if (showsRoom(row)) {
      items.push({ row, depth: row.depth + 1, room: true });
    }
  }

  const out = new Map();
  let after = 0;

  items.forEach((item, i) => {
    const next = i + 1 < items.length ? items[i + 1].depth : tail;
    const ends = Math.max(0, item.depth - next);
    const box = out.get(item.row.id) || { ends: 0, after: 0, roomEnds: 0 };

    if (item.room) {
      box.roomEnds = ends;
    } else {
      box.ends = ends;
      box.after = after;
    }

    out.set(item.row.id, box);
    after = ends;
  });

  return out;
}
