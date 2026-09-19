/**
 * The HTML tree's search: which rows a query keeps.
 *
 * A row matches when the words the row shows — its name, its tag, its class
 * list, a component's file — contain the query, case-insensitive. What is kept
 * is every match and every row above a match, so the path down to it still
 * reads; a row kept only for that reason is marked, and the list draws it
 * held back. Rows under a match are not kept: searching "hero" shows the
 * sections called Hero, not everything inside them.
 *
 * Pure: rows in, rows out. May import: nothing.
 */

export function normalizeHtmlTreeQuery(query) {
  return String(query || '').trim().toLowerCase();
}

export function matchesHtmlTreeRow(row, q) {
  if (!q) {
    return true;
  }

  return [row.name, row.tag, row.klass, row.label, row.src]
    .filter((part) => typeof part === 'string' && part)
    .join(' ')
    .toLowerCase()
    .includes(q);
}

/**
 * @param {Array<{ path: string }>} rows  the flattened file, in order
 * @param {string} query
 * @returns {{ rows: Array, hits: Set<string> }}  the rows to draw, and the paths that matched themselves
 */
export function searchHtmlTreeRows(rows, query) {
  const q = normalizeHtmlTreeQuery(query);

  if (!q) {
    return { rows, hits: new Set() };
  }

  const hits = new Set();

  for (const row of rows) {
    if (matchesHtmlTreeRow(row, q)) {
      hits.add(row.path);
    }
  }

  const paths = [...hits];
  const kept = rows.filter(
    (row) => hits.has(row.path) || paths.some((path) => path.startsWith(`${row.path}/`))
  );

  return { rows: kept, hits };
}
