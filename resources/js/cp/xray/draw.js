/**
 * X-ray: painting what scan.js measured onto one canvas over the preview.
 *
 * One canvas, redrawn whole, rather than an element per line: a section with
 * three grids is a few hundred lines and labels, and one `<canvas>` that
 * nothing can click (pointer-events: none) is the only layer that cannot get
 * in the page's way — no hit testing, no stacking, no styles to inherit.
 *
 * The picture follows browser DevTools on purpose, because that is what a
 * designer has seen before: solid lines on the track edges, hatching in the
 * gaps, numbered lines, dashed outlines for flex.
 *
 * May import: cp/xray/measure.js.
 */
import { placementLabel, px, sizeLabel, tokenFor } from './measure.js';

/** One colour per grid, cycled — nested grids must be told apart. */
export const GRID_COLORS = ['#d6336c', '#7048e8', '#1c7ed6', '#e8590c', '#0ca678'];
export const FLEX_COLOR = '#9c36b5';
const SPACING_COLOR = '#f03e3e';
const TYPE_COLOR = '#0c8599';
const OVERFLOW_COLOR = '#e03131';
const BOX_COLOR = 'rgba(28, 126, 214, .32)';

/** DevTools' box-model colours: margin, border, padding, content. */
const BOX_MODEL = {
  margin: 'rgba(246, 178, 107, .45)',
  border: 'rgba(255, 229, 153, .55)',
  padding: 'rgba(147, 196, 125, .5)',
  content: 'rgba(111, 168, 220, .45)',
};

const FONT = '600 10px system-ui, -apple-system, "Segoe UI", sans-serif';
const NUMBER_FONT = '600 9px system-ui, -apple-system, "Segoe UI", sans-serif';
const PILL_H = 16;
const NUMBER_H = 14;

function rgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);

  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

const patterns = new Map();

/**
 * A pattern belongs to the document whose canvas made it; a reloaded preview
 * is a new document. Called whenever the drawing moves to one.
 */
export function resetPatterns() {
  patterns.clear();
}

/** Diagonal hatching in one colour — what DevTools draws in a gap. */
function hatch(ctx, color, alpha) {
  const key = `${color}|${alpha}`;

  if (patterns.has(key)) {
    return patterns.get(key);
  }

  const tile = ctx.canvas.ownerDocument.createElement('canvas');
  const size = 8;

  tile.width = size;
  tile.height = size;

  const t = tile.getContext('2d');

  t.strokeStyle = rgba(color, alpha);
  t.lineWidth = 1;
  t.beginPath();
  t.moveTo(0, size);
  t.lineTo(size, 0);
  t.moveTo(-1, 1);
  t.lineTo(1, -1);
  t.moveTo(size - 1, size + 1);
  t.lineTo(size + 1, size - 1);
  t.stroke();

  const pattern = ctx.createPattern(tile, 'repeat');

  patterns.set(key, pattern);

  return pattern;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const overlaps = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/**
 * Labels are collected while drawing and painted last, on top of every line,
 * nudged down when two would sit on each other (nested grids start at the
 * same corner more often than not).
 */
function createLabels(view) {
  const queue = [];

  return {
    add(text, x, y, color, { align = 'left', small = false } = {}) {
      queue.push({ text, x, y, color, align, small });
    },
    paint(ctx) {
      const placed = [];

      for (const label of queue) {
        ctx.font = label.small ? NUMBER_FONT : FONT;

        const h = label.small ? NUMBER_H : PILL_H;
        const w = Math.max(h, Math.ceil(ctx.measureText(label.text).width) + (label.small ? 8 : 10));
        let x = label.align === 'center' ? label.x - w / 2 : label.x;
        let y = label.small ? label.y - h / 2 : label.y;

        x = Math.min(Math.max(2, x), view.w - w - 2);
        y = Math.min(Math.max(2, y), view.h - h - 2);

        if (!label.small) {
          for (let i = 0; i < 4 && placed.some((box) => overlaps(box, { x, y, w, h })); i++) {
            y += h + 2;
          }

          placed.push({ x, y, w, h });
        }

        ctx.fillStyle = label.color;
        roundRect(ctx, x, y, w, h, label.small ? h / 2 : 4);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(label.text, x + w / 2, y + h / 2 + 0.5);
      }
    },
  };
}

const visible = (r, view) => r.right > 0 && r.bottom > 0 && r.left < view.w && r.top < view.h;

function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

/** Where line k (0-based) of an axis sits: the outer edges, else mid-gap. */
function linePositions(tracks) {
  const out = [tracks[0].start];

  for (let k = 1; k < tracks.length; k++) {
    out.push((tracks[k - 1].end + tracks[k].start) / 2);
  }

  out.push(tracks[tracks.length - 1].end);

  return out;
}

/**
 * Small text that must not land on another: a nested grid's first track starts
 * where its parent's does, and both write their size there. Moved down a line
 * until it is clear.
 */
function placeText(ctx, text, x, y, spots, align = 'center') {
  const w = ctx.measureText(text).width;
  const h = 11;
  const left = align === 'center' ? x - w / 2 : x;
  let top = y;

  for (let i = 0; i < 4 && spots.some((s) => overlaps(s, { x: left, y: top, w, h })); i++) {
    top += h;
  }

  spots.push({ x: left, y: top, w, h });
  ctx.fillText(text, x, top);
}

function drawGrid(ctx, grid, color, { layers, hover, labels, words, tokens, spots }) {
  const { cols, rows, box } = grid;
  const top = rows[0].start;
  const bottom = rows[rows.length - 1].end;
  const left = cols[0].start;
  const right = cols[cols.length - 1].end;
  const isHovered = hover?.grid === grid.el;

  // The slots: every cell tinted, so empty ones read as places to put things…
  ctx.fillStyle = rgba(color, 0.06);

  for (const col of cols) {
    for (const row of rows) {
      ctx.fillRect(col.start, row.start, col.end - col.start, row.end - row.start);
    }
  }

  // …and the empty ones hatched on top, so "four columns, three cards" shows.
  ctx.fillStyle = hatch(ctx, color, 0.35);

  for (const [c, r] of grid.empty) {
    ctx.fillRect(cols[c].start, rows[r].start, cols[c].end - cols[c].start, rows[r].end - rows[r].start);
  }

  // Gaps.
  ctx.fillStyle = hatch(ctx, color, 0.55);

  for (let i = 1; i < cols.length; i++) {
    const w = cols[i].start - cols[i - 1].end;

    if (w > 0.5) {
      ctx.fillRect(cols[i - 1].end, top, w, bottom - top);
    }
  }

  for (let i = 1; i < rows.length; i++) {
    const h = rows[i].start - rows[i - 1].end;

    if (h > 0.5) {
      ctx.fillRect(left, rows[i - 1].end, right - left, h);
    }
  }

  // The content box.
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([]);
  ctx.strokeRect(box.x + 0.5, box.y + 0.5, Math.max(0, box.w - 1), Math.max(0, box.h - 1));

  // Track edges. A subgridded axis is dashed: those lines are the parent's.
  ctx.lineWidth = 1;
  ctx.strokeStyle = rgba(color, 0.9);
  ctx.setLineDash(grid.subCols ? [4, 3] : []);

  for (const col of cols) {
    line(ctx, col.start + 0.5, top, col.start + 0.5, bottom);
    line(ctx, col.end - 0.5, top, col.end - 0.5, bottom);
  }

  ctx.setLineDash(grid.subRows ? [4, 3] : []);

  for (const row of rows) {
    line(ctx, left, row.start + 0.5, right, row.start + 0.5);
    line(ctx, left, row.end - 0.5, right, row.end - 0.5);
  }

  ctx.setLineDash([]);

  // Line numbers, 1-based like `col-start-2` and `grid-column: 2 / 4`.
  // Negative ones (-1 is the last line) on the far edges of the grid you point at.
  const xs = linePositions(cols);
  const ys = linePositions(rows);

  xs.forEach((x, k) => {
    labels.add(String(k + 1), x, top - 9, color, { align: 'center', small: true });

    if (isHovered) {
      labels.add(String(k - xs.length), x, bottom + 9, color, { align: 'center', small: true });
    }
  });

  ys.forEach((y, k) => {
    labels.add(String(k + 1), left - 9, y, color, { align: 'center', small: true });

    if (isHovered) {
      labels.add(String(k - ys.length), right + 9, y, color, { align: 'center', small: true });
    }
  });

  if (layers.names) {
    // What `1fr` came to: the measured width of each track, on the track. Not
    // on a subgridded axis — those tracks are the parent's, already labelled,
    // and a second number on the same spot only makes both unreadable.
    ctx.font = NUMBER_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = rgba(color, 0.95);

    for (const col of grid.subCols ? [] : cols) {
      const w = col.end - col.start;

      if (w >= 34) {
        placeText(ctx, `${px(w)}px`, (col.start + col.end) / 2, top + 4, spots);
      }
    }

    ctx.textAlign = 'left';

    for (const row of grid.subRows ? [] : rows) {
      const h = row.end - row.start;

      if (h >= 18 && right - left >= 60) {
        placeText(ctx, `${px(h)}px`, left + 4, (row.start + row.end) / 2 - 5, spots, 'left');
      }
    }

    const sub = [grid.subCols && words.subgridCols, grid.subRows && words.subgridRows].filter(Boolean).join(', ');

    labels.add(
      `${grid.label} · ${words.grid} ${cols.length} × ${rows.length}${sub ? ` · ${sub}` : ''}`,
      grid.rect.left,
      grid.rect.top - PILL_H - 14,
      color,
    );

    // The gap, as the token it is: `gap-500 · 34`. One label when both
    // directions are the same, `gap-x` / `gap-y` when they differ.
    const same = Math.abs(grid.colGap - grid.rowGap) < 0.5;

    if (!grid.subCols && grid.colGap > 0.5 && cols.length > 1) {
      labels.add(
        sizeLabel(grid.colGap, tokenFor(tokens.spacing, grid.colGap), same ? 'gap' : 'gap-x'),
        (cols[0].end + cols[1].start) / 2,
        rows[0].start + 22,
        color,
        { align: 'center' },
      );
    }

    if (!grid.subRows && grid.rowGap > 0.5 && rows.length > 1 && !(same && cols.length > 1)) {
      labels.add(
        sizeLabel(grid.rowGap, tokenFor(tokens.spacing, grid.rowGap), same ? 'gap' : 'gap-y'),
        left + 40,
        (rows[0].end + rows[1].start) / 2 - PILL_H / 2,
        color,
      );
    }
  }

  // The item you point at: its whole area, and where it sits in words.
  const item = isHovered ? grid.items.find((entry) => entry.el === hover.item) : null;

  if (item?.col && item?.row) {
    const x = cols[item.col[0]].start;
    const y = rows[item.row[0]].start;
    const w = cols[item.col[1]].end - x;
    const h = rows[item.row[1]].end - y;

    ctx.fillStyle = rgba(color, 0.2);
    ctx.fillRect(x, y, w, h);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.strokeRect(x + 1, y + 1, Math.max(0, w - 2), Math.max(0, h - 2));
    labels.add(placementLabel(item.col, item.row, words), x + 4, y + 4, color);
  }
}

function drawFlex(ctx, flex, { layers, labels }) {
  const r = flex.rect;

  ctx.strokeStyle = rgba(FLEX_COLOR, 0.85);
  ctx.lineWidth = 1.25;
  ctx.setLineDash([5, 4]);
  ctx.strokeRect(r.left + 0.5, r.top + 0.5, Math.max(0, r.width - 1), Math.max(0, r.height - 1));
  ctx.setLineDash([]);
  ctx.fillStyle = hatch(ctx, FLEX_COLOR, 0.5);

  for (const gap of flex.gaps) {
    ctx.fillRect(gap.x, gap.y, gap.w, gap.h);
  }

  if (layers.names) {
    labels.add(`${flex.label} · flex ${flex.arrow}${flex.wrap ? ' wrap' : ''}`, r.left, r.top - PILL_H - 2, FLEX_COLOR);
  }
}

function drawBoxModel(ctx, model, labels, tokens) {
  const { rect: r, margin: m, border: b, padding: p } = model;
  const band = (outer, inner, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(outer.x, outer.y, outer.w, outer.h);
    ctx.rect(inner.x, inner.y + inner.h, inner.w, -inner.h);
    ctx.fill('evenodd');
  };
  const borderBox = { x: r.left, y: r.top, w: r.width, h: r.height };
  const marginBox = { x: r.left - m.l, y: r.top - m.t, w: r.width + m.l + m.r, h: r.height + m.t + m.b };
  const paddingBox = { x: r.left + b.l, y: r.top + b.t, w: r.width - b.l - b.r, h: r.height - b.t - b.b };
  const contentBox = { x: paddingBox.x + p.l, y: paddingBox.y + p.t, w: paddingBox.w - p.l - p.r, h: paddingBox.h - p.t - p.b };

  band(marginBox, borderBox, BOX_MODEL.margin);
  band(borderBox, paddingBox, BOX_MODEL.border);
  band(paddingBox, contentBox, BOX_MODEL.padding);
  ctx.fillStyle = BOX_MODEL.content;
  ctx.fillRect(contentBox.x, contentBox.y, Math.max(0, contentBox.w), Math.max(0, contentBox.h));
  labels.add(`${model.label} · ${px(r.width)} × ${px(r.height)}`, r.left, r.bottom + 4, '#1c7ed6');

  // Each side's padding and margin written in its band, as the token it is.
  ctx.font = NUMBER_FONT;
  ctx.fillStyle = '#212529';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const side = (size, prefix, x, y, room) => {
    if (size < 0.5 || room < 11) {
      return;
    }

    ctx.fillText(sizeLabel(size, tokenFor(tokens.spacing, size), prefix), x, y);
  };
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;

  side(p.t, 'pt', cx, paddingBox.y + p.t / 2, p.t);
  side(p.b, 'pb', cx, paddingBox.y + paddingBox.h - p.b / 2, p.b);
  side(p.l, 'pl', paddingBox.x + p.l / 2, cy, Math.min(p.l * 3, 60));
  side(p.r, 'pr', paddingBox.x + paddingBox.w - p.r / 2, cy, Math.min(p.r * 3, 60));
  side(m.t, 'mt', cx, r.top - m.t / 2, m.t);
  side(m.b, 'mb', cx, r.bottom + m.b / 2, m.b);
}

/** Figma's red lines: the space from the element to what faces it on each side. */
function drawSpacing(ctx, spacing, labels, tokens) {
  const r = spacing.rect;

  ctx.strokeStyle = SPACING_COLOR;
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.strokeRect(r.left + 0.5, r.top + 0.5, Math.max(0, r.width - 1), Math.max(0, r.height - 1));

  for (const gap of spacing.lines) {
    const label = sizeLabel(gap.size, tokenFor(tokens.spacing, gap.size));

    ctx.beginPath();

    if (gap.axis === 'y') {
      const x = Math.round(gap.at) + 0.5;

      ctx.moveTo(x, gap.from);
      ctx.lineTo(x, gap.to);
      ctx.moveTo(x - 4, gap.from + 0.5);
      ctx.lineTo(x + 4, gap.from + 0.5);
      ctx.moveTo(x - 4, gap.to - 0.5);
      ctx.lineTo(x + 4, gap.to - 0.5);
      ctx.stroke();
      labels.add(label, x + 6, (gap.from + gap.to) / 2 - PILL_H / 2, SPACING_COLOR);
    } else {
      const y = Math.round(gap.at) + 0.5;

      ctx.moveTo(gap.from, y);
      ctx.lineTo(gap.to, y);
      ctx.moveTo(gap.from + 0.5, y - 4);
      ctx.lineTo(gap.from + 0.5, y + 4);
      ctx.moveTo(gap.to - 0.5, y - 4);
      ctx.lineTo(gap.to - 0.5, y + 4);
      ctx.stroke();
      labels.add(label, (gap.from + gap.to) / 2, y - PILL_H - 4, SPACING_COLOR, { align: 'center' });
    }
  }
}

/** `h2 · text-700 · 56/62 · Inter 700` on every text that sets its own type. */
function drawType(ctx, text, labels, tokens) {
  const token = tokenFor(tokens.text, text.size);
  const leading = text.leading ? px(text.leading) : '–';
  const weight = text.weight !== 400 ? ` ${text.weight}` : '';

  labels.add(
    `${text.tag} · ${token ? `text-${token} · ` : ''}${px(text.size)}/${leading} · ${text.family}${weight}`,
    text.rect.left,
    text.rect.top - PILL_H - 1,
    TYPE_COLOR,
  );
}

/** What reaches past the page's edge: outlined, the part outside hatched, the overshoot written. */
function drawOverflow(ctx, item, view, labels) {
  const r = item.rect;

  ctx.strokeStyle = OVERFLOW_COLOR;
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.strokeRect(r.left + 1, r.top + 1, Math.max(0, r.width - 2), Math.max(0, r.height - 2));
  ctx.fillStyle = hatch(ctx, OVERFLOW_COLOR, 0.7);

  if (item.right > 0) {
    ctx.fillRect(view.w - Math.min(item.right, 40), r.top, Math.min(item.right, 40), r.height);
    labels.add(`${item.label} → +${px(item.right)}px`, view.w, r.top + 4, OVERFLOW_COLOR);
  }

  if (item.left > 0) {
    ctx.fillRect(0, r.top, Math.min(item.left, 40), r.height);
    labels.add(`← +${px(item.left)}px ${item.label}`, 0, r.top + 4, OVERFLOW_COLOR);
  }
}

/**
 * Paint one frame.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ w: number, h: number, dpr: number }} view
 * @param {{ grids: object[], flexes: object[], boxes: Element[], boxModel: object|null,
 *   spacing: object|null, texts: object[], overflow: object[], tokens: object }} scene
 * @param {{ layers: object, hover: object|null, words: object }} opts
 */
export function drawXray(ctx, view, scene, { layers, hover, words }) {
  const tokens = scene.tokens || { spacing: [], text: [] };
  const spots = [];

  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  ctx.clearRect(0, 0, view.w, view.h);

  const labels = createLabels(view);

  if (layers.boxes) {
    ctx.strokeStyle = BOX_COLOR;
    ctx.lineWidth = 1;

    for (const el of scene.boxes) {
      const r = el.getBoundingClientRect();

      if (r.width > 0 && r.height > 0 && visible(r, view)) {
        ctx.strokeRect(r.left + 0.5, r.top + 0.5, Math.max(0, r.width - 1), Math.max(0, r.height - 1));
      }
    }
  }

  for (const flex of scene.flexes) {
    if (visible(flex.rect, view)) {
      drawFlex(ctx, flex, { layers, labels });
    }
  }

  scene.grids.forEach((grid, i) => {
    if (visible(grid.rect, view)) {
      drawGrid(ctx, grid, GRID_COLORS[i % GRID_COLORS.length], { layers, hover, labels, words, tokens, spots });
    }
  });

  for (const item of scene.overflow || []) {
    drawOverflow(ctx, item, view, labels);
  }

  for (const text of scene.texts || []) {
    if (visible(text.rect, view)) {
      drawType(ctx, text, labels, tokens);
    }
  }

  if (layers.boxes && scene.boxModel) {
    drawBoxModel(ctx, scene.boxModel, labels, tokens);
  }

  if (scene.spacing) {
    drawSpacing(ctx, scene.spacing, labels, tokens);
  }

  labels.paint(ctx);
}
