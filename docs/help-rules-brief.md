# Help rules in the HTML dock — brief for Opus (step 2 of 3)

You are extending **help mode** in the Visual Editor's template dock. When an
author types a tag (or clicks into one) in the HTML pane, a small popup offers
up to three things to write next, plus an `id` row last. Step 1 (done) split
the logic into **one rule per kind of tag** behind one contract, so you can add
rules without touching the editor. Your job is the rules matrix below.

Repo: `~/Sites/statamic-addon-visual-editor-vue`. Work on branch `help-rules`
from `main`. Tests first, then the rule. Do not build, release or touch the
dock/editor files.

## What you may touch

- `resources/js/dock/help-rules/*.js` — the rules (new files welcome) and
  `index.js` (the order). `context.js` only to **add** a helper; do not change
  an existing helper's behaviour.
- `tests/js/help-suggest.test.js` (or new `tests/js/help-rules-*.test.js`).
- `resources/lang/en/messages.php` and `resources/lang/da/messages.php` — new
  `code_dock_help_*` keys, both languages, next to the existing ones.

## What you must not touch

- `resources/js/dock/help-editor.js`, `help-attach.js`, `help-state.js`,
  `help-styles.js`, `help-suggest.js` (the entry; it only finds the caret).
- `resources/js/loop-inspector.js`, `resources/js/dock/code-dock*.js`,
  `resources/js/html-tree*.js`, `resources/js/antlers-blocks.js`.
- `resources/js/preview.js`, `overlay-host.js`, `bridge.js`, `cp.js`.
- `resources/dist/**`, `public/**`, anything in `src/` (PHP) or `config/`.
- Vue components (`resources/js/cp/surfaces/DockHelp*.vue`).
- No `npm run cp:build`, no composer, no tags, no push to `main`.

If a rule needs something the context does not have, write the test for it,
leave the rule out, and list it under «Needs Fable» in your final note. Do not
guess from the markup and do not add a second code path.

## Run

```sh
cd ~/Sites/statamic-addon-visual-editor-vue
node --test tests/js/help-suggest.test.js      # the help tests
npm test                                       # all JS tests (must stay green)
node scripts/assert-isolation.mjs              # no forbidden imports
```

## The contract (read `help-rules/context.js` first — it is the source)

A rule is `(ctx, offered) => suggestion[]`.

```js
{
  id: 'text:title',          // unique within one answer
  key: 'code_dock_help_text',// lang key; args fill :placeholders
  args: { name: 'Title' },
  meta: 'Welcome',           // short mono text at the right of the row
  changes: [{ from, to, insert }], // FILE offsets; one change where possible (⌘Z = one step)
  selection: 123,            // caret in the file after the change, or null
  after: 'class',            // optional: 'class' → picker/Tailwind list between the quotes
                             //           'loop'  → the loop panel (needs `loop`)
}
```

`offered` = what the rules before this one returned; a rule may stand down
(the class rule does when `shell` is offered). Rules in `RULES` fill the popup
up to `HELP_MAX` (3); `TAIL_RULES` come after the cap — the `id` lives there
and must stay last.

The context you get:

| key | what |
|---|---|
| `source`, `masked` | the file; `masked` has `{{ … }}` blanked, same length |
| `rows` | the section's Data rows `{ var, label, type, loop?, value?, parent? }` |
| `scope` | field loops open around the caret, outermost first; `null` inside a collection/nav loop |
| `blocks` | every Antlers block (`kind: 'loop'`, `loopKind: 'field'|'collection'|'nav'`, `name`, `from`, `openTo`, `to`) |
| `node`, `parent`, `siblings`, `index`, `close` | the element under the caret (`node.tag`, `from`, `openTo`, `to`, `children`); `close` = where `</tag>` starts, -1 when none |
| `isRoot`, `sectionPartial`, `shellRoot` | first element of the file / it is a page section partial / the scaffold a new section starts as |
| `blockPartials` | `{ src: 'blocks/{type}', handles: ['headline','richtext','links','media',…] }` — the site's shared block partials; `src` is `''` when the site has none |

Helpers already there: `emptyInside`, `indentOf`, `openTagOf`, `hasAttr`,
`beforeClose`, `afterName`, `withClass`, `withVisualEdit`, `staticClass`,
`rowsInScope`, `unusedFirst`, `printed`, `rowsOfLoop`, `bodyLines`,
`fieldLines`, `isWritable`, `blockPartialSrc(ctx, handle)`,
`hasBlockPartial(ctx, handle)`. Sets: `TEXT_TYPES`, `BLOCK_TEXT_TYPES`,
`ROW_LOOP_TYPES`, `ASSET_TYPES` (`assets`), `LINK_TYPES` (`link`),
`TITLE_HANDLE`, `INDENT`, `STEP`.

Data rows worth knowing:

- `type: 'assets'` is a file field. It carries `loop: true` (one file is still
  reached by looping: `{{ media }}{{ url }}{{ /media }}`), but the house
  renders it through the image partial — see below. Never write `<img src="{{ media }}">`.
- `type: 'link'` is Statamic's link field (URL / entry / asset). Printing it
  gives the URL.
- `type: 'replicator'` rows: the set's fields have `parent: 'list › item'`;
  a set named like a block partial (`headline`, `richtext`, `links`, `media`,
  `icon`, `title`, `text`, `content`, …) is rendered with the shared partial.
- `type: 'iconify'` is an icon handle; the house renders it with
  `{{ partial src="blocks/icon" }}`, not inline.

## Principles (these are the acceptance criteria)

1. **Only Data rows.** A suggestion names a field only if it is in `rows` and
   in scope (`rowsInScope(ctx)`). Nothing is guessed from the markup.
2. **Text only on text tags.** Fill-from-field rows (`text:*`) belong on
   `h1–h6 p span a li strong em small blockquote figcaption label button td th dt dd`.
   **Remove `div` from `TEXT_TAGS`.** A `div` gets a *Bard/Markdown* row
   instead (`<div {{ visual_edit field="text" inline_edit="true" }}>{{ text }}</div>`)
   — never a `text`/`textarea` row.
3. **Bard/Markdown never in `<p>`.** Already handled; keep it.
4. **Loops only in `div`, `ul`/`ol`, `li`.** Never directly under a `section`
   root: the house wraps the section's `blocks` in a `div`. On a `section`
   offer nothing but the shell (done) and, when the shell is already there,
   the *blocks wrapper* (below). No loop rows on `section`.
5. **`id` last, never pushes a field off.** It is in `TAIL_RULES`; leave it.
6. **No Alpine, no `<script>`, no `style_push`.** Markup and `visual_edit`
   only.
7. **No `px`**, no inline `style=""`. Classes stay empty (`class=""`): the dock
   names them when CSS is written.
8. **One change per suggestion** so ⌘Z takes it back in one step.
9. **Same wording family** as the existing keys: «Repeat over :name», «Text
   from :name», «Add a class». Danish and English both, in the two
   `messages.php`.
10. **House Antlers, verbatim.** Copy the patterns below; do not invent
    variants.

## The matrix — what each tag offers

Rows are in priority order; the cap is 3 primary + `id`. «—» means the rule
returns nothing in that case.

### `section` (root of a section partial)

- No `id` attr → `shell` (exists). Nothing else.
- Shell already there, nothing inside → **`blocks:<var>`** for each replicator
  row in scope whose sets are block partials (`hasBlockPartial`), unused first:

  ```antlers
  <section …>
      <div class="" {{ visual_edit field="blocks" outline_inside="true" insertable="true" }}>
          {{ blocks }}
              {{ if type == 'headline' }}
                  {{ partial src="blocks/headline" }}
              {{ elseif type == 'richtext' }}
                  {{ partial src="blocks/richtext" }}
              {{ /if }}
          {{ /blocks }}
      </div>
  </section>
  ```

  `src` comes from `blockPartialSrc(ctx, set)`. Sets that have **no** block
  partial get the existing `bodyLines` branch (a line per text field). Key:
  `code_dock_help_blocks` → «Blocks from :name» / «Blokke fra :name».
- `class` on a section root is the shell's job; `classRule` already stands down.

### `div`

1. Empty, replicator rows in scope → the **blocks wrapper** above, written
   onto this `div` (the div is the wrapper; keep its attrs, add
   `visual_edit field="…" outline_inside="true" insertable="true"`). Also for
   grid rows (then `bodyLines` as the list rule does, with `<div>` rows
   instead of `<li>`). Key `code_dock_help_blocks` for partial-backed,
   `code_dock_help_loop` («Repeat over :name») for the rest.
2. Empty, Bard/Markdown rows in scope → `<div {{ visual_edit field="text" inline_edit="true" }}>{{ text }}</div>`.
   Key `code_dock_help_text` (same wording, it *is* text from a field).
3. Empty, `assets` rows in scope → the **media wrapper**:

   ```antlers
   <div class="" {{ visual_edit field="media" outline_inside="true" inline_edit="true" }}>
       {{ partial:components/image :imagePath="media" class="" }}
   </div>
   ```

   One `partial:components/image` line, no `if` — the component draws the
   placeholder itself when the field is empty. Key
   `code_dock_help_media` → «Image from :name» / «Billede fra :name».
4. `class` (exists), then `id` (tail).

### `ul` / `ol`

- Exists: `loop:<var>` per grid/replicator row (`<li>` rows). Keep.
- Add: when the replicator's sets are block partials, the `<li>` body becomes
  `{{ partial src="blocks/{type}" }}` branches (reuse the blocks-wrapper
  branch writer, indented one level deeper) instead of `bodyLines`.

### `li`

- Inside a field loop, empty → `text:*` rows (exists) and, if the loop's row
  has nested replicator rows, a nested blocks wrapper as a `div`.
- Outside any loop → **—** for text (an `li` outside a loop is static), only
  `class` + `id`.

### `a`

1. Empty `<a>` with `link` rows in scope → `<a href="{{ url }}" {{ visual_edit field="url" }}>` with the
   text filled from the first text row in scope (`{{ text or 'Læs mere' }}` is
   the house default — write `{{ text }}` only, no fallback text).
   Key `code_dock_help_link` → «Link from :name» / «Link fra :name».
2. Empty `<a>` with a `links` replicator row in scope (its set has a `link`
   field) → suggest replacing the `<a>` with the **links partial**:
   `{{ partial src="blocks/links" }}` on the `a`'s line (the `<a>` goes away;
   the partial writes its own `<a>`s). Only when `hasBlockPartial(ctx, 'links')`.
   Key `code_dock_help_links_partial` → «Links block» / «Links-blok».
3. No `href` attr and no link rows → `href=""` with the caret between the
   quotes, written like the `id` row (`afterName`). Key
   `code_dock_help_href` → «Add a link» / «Tilføj link». This row comes
   **before** `class`.
4. `class`, `id`.

### `img`

`<img>` is void: `close === -1`, `emptyInside` is not the question.

1. `assets` row in scope → the house **does not** write `<img>` by hand; it
   uses the image partial. Suggest replacing the `<img …>` tag with
   `{{ partial:components/image :imagePath="media" class="" }}` (keep the
   `img`'s static class value in `class=""` when it has one). Key
   `code_dock_help_media`.
2. No `src` attr → `src="" loading="lazy" alt=""` written after the tag name,
   caret between the `src` quotes. Only the attrs that are missing; do not
   duplicate `alt` or `loading` when present. Key
   `code_dock_help_img_attrs` → «src, lazy loading and alt» / «src, lazy
   loading og alt».
3. Has `src`, missing `alt` → `alt=""`, caret inside. Key
   `code_dock_help_alt` → «Add alt text» / «Tilføj alt-tekst».
4. `class`, `id`.

### `h1–h6`, `p`, `span`, `strong`, `em`, `small`, `blockquote`, `figcaption`, `label`, `button`, `td`, `th`, `dt`, `dd`

- `text:*` (exists). Headings: offer rows matching `TITLE_HANDLE` first, then
  the rest (still «unused first» inside each group).
- `button`: no `text:*` from Bard/Markdown.
- `class`, `id`.

### `{{ … }}` loop tag

- `loop-ask` (exists, `after: 'loop'`). Do not change.

## Tests to write (before the rules)

For each new rule, in the style of `tests/js/help-suggest.test.js`
(`caret()`, `apply()`, `ids()`):

- the exact markup written (compare the whole string, not a regex);
- where the caret lands;
- that it is **not** offered where it must not be (section root, inside a
  collection loop, when the attr/field is already there, when
  `blockPartials.src` is `''`);
- order within the popup (`ids(...)`), and that `id` is still last;
- a fixture with the demo's shapes: the `GRID`, `FEATURE_LIST` already in the
  file, plus a `BLOCKS` fixture:

  ```js
  const BLOCKS = [
    { var: 'blocks', label: 'Blocks', type: 'replicator', loop: true, value: '2 ×' },
    { var: 'title', label: 'Title', type: 'text', parent: 'blocks › headline' },
    { var: 'text', label: 'Text', type: 'bard', parent: 'blocks › richtext' },
    { var: 'links', label: 'Links', type: 'replicator', loop: true, parent: 'blocks › links' },
    { var: 'url', label: 'URL', type: 'link', parent: 'blocks › links › links › link' },
    { var: 'text', label: 'Text', type: 'text', parent: 'blocks › links › links › link' },
    { var: 'media', label: 'Media', type: 'assets', loop: true, parent: 'blocks › media' },
  ];
  const PARTIALS = { src: 'blocks/{type}', handles: ['headline', 'richtext', 'links', 'media', 'icon', 'title', 'text', 'content'] };
  ```

Keep every existing test green. If an existing test contradicts this brief
(for example `div` in `TEXT_TAGS`), change the test **and say so** in the
final note.

## Files you will most likely create

```
resources/js/dock/help-rules/blocks.js     # blocks wrapper (section/div/ul/li)
resources/js/dock/help-rules/media.js      # div media wrapper + img rules
resources/js/dock/help-rules/link.js       # a: link field / links partial / href
resources/js/dock/help-rules/attrs.js      # (exists) class + id; add img attrs/alt here or in media.js
resources/js/dock/help-rules/text.js       # (exists) narrow TEXT_TAGS, heading order, div → Bard only
resources/js/dock/help-rules/index.js      # the order: section, blocks, media, link, list, text, class | id
```

## Final note (paste it back to the owner)

- which rules you added, one line each, with the key names;
- which existing tests you changed and why;
- «Needs Fable»: anything that wanted a context field, a PHP input or an
  editor `after` that does not exist. Do not work around it.
