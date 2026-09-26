/**
 * A font file from the editor's computer, read in the browser: what it is
 * (TTF, OTF, WOFF, WOFF2), its family, weight, style and weight axis from
 * its own tables, and WOFF2 bytes when it should be converted. The server
 * needs nothing installed for that — the WOFF2 encoder is Google's, compiled
 * to WebAssembly, and only loaded when a file needs it.
 *
 * Pure except for `readFontFile` / `toWoff2` (they load the encoder).
 */

const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];

export const FONT_EXTENSIONS = ['woff2', 'woff', 'ttf', 'otf'];

/** The format from the first four bytes, whatever the file is called. */
export function fontKind(bytes) {
  const tag = String.fromCharCode(...bytes.subarray(0, 4));

  if (tag === 'wOF2') {
    return 'woff2';
  }

  if (tag === 'wOFF') {
    return 'woff';
  }

  if (tag === 'OTTO') {
    return 'otf';
  }

  return tag === 'true' || (bytes[0] === 0 && bytes[1] === 1 && bytes[2] === 0 && bytes[3] === 0) ? 'ttf' : null;
}

const view = (bytes) => new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
const tagAt = (bytes, at) => String.fromCharCode(...bytes.subarray(at, at + 4));

/** The table directory of a TTF/OTF: `{ 'OS/2': { offset, length }, … }`. */
export function sfntTables(bytes) {
  const v = view(bytes);
  const tables = {};

  for (let i = 0, count = v.getUint16(4); i < count; i++) {
    const at = 12 + i * 16;

    tables[tagAt(bytes, at)] = { offset: v.getUint32(at + 8), length: v.getUint32(at + 12) };
  }

  return tables;
}

function decodeName(bytes, platform, encoding) {
  // Windows and Unicode records are UTF-16BE; Mac Roman is close enough to Latin-1 for a name.
  if (platform === 3 || platform === 0) {
    let out = '';

    for (let i = 0; i + 1 < bytes.length; i += 2) {
      out += String.fromCharCode((bytes[i] << 8) | bytes[i + 1]);
    }

    return out;
  }

  return platform === 1 && encoding === 0 ? String.fromCharCode(...bytes) : '';
}

/** name table: id → string, English Windows records first. */
function readNames(bytes, offset) {
  const v = view(bytes);
  const count = v.getUint16(offset + 2);
  const strings = offset + v.getUint16(offset + 4);
  const names = {};
  const rank = {};

  for (let i = 0; i < count; i++) {
    const at = offset + 6 + i * 12;
    const platform = v.getUint16(at);
    const encoding = v.getUint16(at + 2);
    const language = v.getUint16(at + 4);
    const id = v.getUint16(at + 6);
    const length = v.getUint16(at + 8);
    const start = strings + v.getUint16(at + 10);
    const score = platform === 3 && language === 0x409 ? 3 : platform === 3 || platform === 0 ? 2 : 1;

    if ((rank[id] || 0) < score) {
      const text = decodeName(bytes.subarray(start, start + length), platform, encoding).trim();

      if (text) {
        names[id] = text;
        rank[id] = score;
      }
    }
  }

  return names;
}

/**
 * `{ family, weight, italic, axis }` from a TTF/OTF: the typographic family
 * (name 16, else 1), OS/2's weight class and italic bit, and the `wght`
 * axis as `[min, max]` for a variable font.
 */
export function sfntInfo(bytes) {
  const v = view(bytes);
  const tables = sfntTables(bytes);
  const info = { family: '', weight: 400, italic: false, axis: null };

  if (tables['OS/2']) {
    info.weight = v.getUint16(tables['OS/2'].offset + 4) || 400;
    info.italic = (v.getUint16(tables['OS/2'].offset + 62) & 1) === 1;
  } else if (tables.head) {
    const style = v.getUint16(tables.head.offset + 44);

    info.weight = style & 1 ? 700 : 400;
    info.italic = (style & 2) === 2;
  }

  if (tables.name) {
    const names = readNames(bytes, tables.name.offset);

    info.family = names[16] || names[1] || '';
  }

  if (tables.fvar) {
    const at = tables.fvar.offset;
    const axes = at + v.getUint16(at + 4);
    const size = v.getUint16(at + 10);

    for (let i = 0, count = v.getUint16(at + 8); i < count; i++) {
      const axis = axes + i * size;

      if (tagAt(bytes, axis) === 'wght') {
        const min = Math.round(v.getInt32(axis + 4) / 65536);
        const max = Math.round(v.getInt32(axis + 12) / 65536);

        info.axis = min < max ? [min, max] : null;
      }
    }
  }

  return info;
}

/** WOFF (1.0) back to the TTF/OTF it wraps: each table inflated where it was compressed. */
export async function woffToSfnt(bytes) {
  const v = view(bytes);
  const count = v.getUint16(12);
  const entries = [];

  for (let i = 0; i < count; i++) {
    const at = 44 + i * 20;
    const offset = v.getUint32(at + 4);
    const compressed = v.getUint32(at + 8);
    const length = v.getUint32(at + 12);
    let data = bytes.subarray(offset, offset + compressed);

    if (compressed < length) {
      data = new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate'))).arrayBuffer());
    }

    entries.push({ tag: bytes.subarray(at, at + 4), checksum: v.getUint32(at + 16), data });
  }

  const log2 = Math.floor(Math.log2(count));
  const range = 2 ** log2 * 16;
  let size = 12 + count * 16;

  entries.forEach((e) => {
    e.offset = size;
    size += (e.data.length + 3) & ~3;
  });

  const out = new Uint8Array(size);
  const o = view(out);

  o.setUint32(0, v.getUint32(4));
  o.setUint16(4, count);
  o.setUint16(6, range);
  o.setUint16(8, log2);
  o.setUint16(10, count * 16 - range);
  entries.forEach((e, i) => {
    const at = 12 + i * 16;

    out.set(e.tag, at);
    o.setUint32(at + 4, e.checksum);
    o.setUint32(at + 8, e.offset);
    o.setUint32(at + 12, e.data.length);
    out.set(e.data, e.offset);
  });

  return out;
}

/** Any of the four formats as TTF/OTF bytes, for reading its tables and for the encoder. */
export async function toSfnt(bytes, kind) {
  if (kind === 'woff2') {
    // The decoder alone (a third of the encoder's size): enough to read a WOFF2's tables.
    const { default: decompress } = await import('woff2-encoder/decompress');

    return decompress(bytes);
  }

  return kind === 'woff' ? woffToSfnt(bytes) : bytes;
}

/** WOFF2 bytes for a TTF/OTF/WOFF; a WOFF2 as it is. */
export async function toWoff2(bytes, kind) {
  if (kind === 'woff2') {
    return bytes;
  }

  const { compress } = await import('woff2-encoder');

  return compress(await toSfnt(bytes, kind));
}

/** The nearest of the nine CSS weights: 350 → 400. */
export function nearestWeight(weight) {
  return WEIGHTS.reduce((best, w) => (Math.abs(w - weight) < Math.abs(best - weight) ? w : best), 400);
}

/**
 * A dropped file, read: `{ file, bytes, kind, family, weight, italic, axis }`,
 * or `{ file, error: 'not_a_font' }`. The family falls back to the file name.
 */
export async function readFontFile(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = fontKind(bytes);
  const stem = file.name.replace(/\.[^.]+$/, '');

  if (!kind) {
    return { file, error: 'not_a_font' };
  }

  let info = { family: '', weight: 400, italic: /italic|oblique/i.test(stem), axis: null };

  try {
    info = sfntInfo(await toSfnt(bytes, kind));
  } catch {
    // Unreadable tables: the name and the defaults above are the best guess.
  }

  return {
    file,
    bytes,
    kind,
    family: info.family || stem.replace(/[-_](thin|extralight|light|regular|medium|semibold|bold|extrabold|black|italic|variable|vf)\b.*$/i, '').replace(/[-_]+/g, ' ').trim() || stem,
    weight: info.axis ? info.weight : nearestWeight(info.weight),
    italic: info.italic,
    axis: info.axis,
  };
}
