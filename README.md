# Statamic Visual Editor

Drop a tag on each component and editors always know exactly what they're editing — no matter how deeply nested.

- **Two-way sync** — click or hover in the Live Preview or Control Panel and the other side highlights instantly
- **Auto-expand** — click in the Live Preview and the matching set opens and scrolls into view in the Control Panel
- **Zero production footprint** — annotations and scripts are stripped outside of Live Preview

> [!IMPORTANT]
> **This is the installable package repository** — it is auto-synced from the [development repository](https://github.com/mariohamann/statamic-visual-editor-dev), which contains a full demo including tests. Please open issues and PRs there, not here.

## Demo

https://github.com/user-attachments/assets/97ec557d-2642-4e74-87df-fb365a03154b

## Requirements

- Statamic 6
- PHP 8.4+

## Installation

```bash
composer require statamic-addon/visual-editor
```

The compiled assets publish themselves on install and on every update, so there's
nothing else to run for the editor to load. (If you ever need to force it:
`php artisan vendor:publish --provider="MarioHamann\StatamicVisualEditor\ServiceProvider" --force`.)

Then scaffold the few content-model pieces the saved-section, global-section and
template features need:

```bash
php please sve:install
```

This creates two collections (**Global sections** and **Templates**) with their
blueprints, and the `global_section` render partial — using the handles from
`config/statamic-visual-editor.php`, so nothing is assumed. Existing files are
left as-is. It finishes by printing **one manual step**: add a `global_section`
set to your own page-builder fieldset (an entries field pointing at the Global
sections collection, `max_files: 1`, `hide: true`) so pages can reference a synced
section.

The editor itself is **standalone** — it needs only `statamic/cms` and
`spatie/browsershot` (pulled in automatically). It doesn't depend on any other
add-on; the column-builder / spacing / fluid-size editing only activates when
those fields are actually present.

Finally, annotate the templates you want to edit with the `{{ visual_edit }}`
tag — that's the one thing that's site-specific and can't be automated. The rest
of this README is the reference for those tags.

---

## Laravel Boost Support

This addon includes **three dedicated AI agent skills** to help you annotate templates with Visual Editor tags:

1. **`visual-editor-research`** — Audits your project to find where annotations should be added, scanning blueprints, fieldsets, and templates to map sets to partials.
2. **`visual-editor-antlers`** — Provides implementation guidance for adding tags to Antlers templates, with examples and parameter reference.
3. **`visual-editor-blade`** — Provides implementation guidance for adding tags to Blade templates, including component patterns and blueprint resolution.

When you install/update the addon in a Laravel Boost-enabled project (`php artisan boost:update`), these skills are automatically made available to your IDE's AI agent. The addon also extends the project's `AGENTS.md` with core concepts and activation triggers.

For details, see the [Boost documentation](https://laravel.com/docs/13.x/boost.md).

---

## Concepts

The addon provides a single tag — `{{ visual_edit }}` — that you place on HTML elements in your templates. During Live Preview it outputs data attributes that power bidirectional click-and-hover sync between the preview and the CP. Outside Live Preview it outputs nothing.

There are two targeting modes:

| Mode | What it targets | How it works |
|------|----------------|--------------|
| **Set targeting** | Replicator, Bard & Grid items | Links each rendered item to its CP set via an auto-generated UUID |
| **Field targeting** | Fixed blueprint fields (title, SEO, etc.) | Links any element to a CP field by its handle |

Both modes are fully bidirectional: clicking or hovering in the preview highlights the CP field, and vice versa.

---

## Set targeting

Targets individual Replicator, Bard, or Grid items. The addon automatically adds a hidden `_visual_id` field to every set in your blueprints and stamps a stable UUID during preview and on save — **no blueprint changes required**.

### Antlers

Add `{{ visual_edit }}` to the outermost element of each set partial. The tag reads `_visual_id` and `type` from the current context automatically:

```antlers
{{# Replicator / Bard set partial #}}
<div class="..." {{ visual_edit }}>
  {{ text }}
</div>
```

```antlers
{{# Grid rows #}}
{{ links }}
  <li {{ visual_edit }}>
    <a href="{{ link_url }}">{{ label }}</a>
  </li>
{{ /links }}
```

### Blade

Use `Statamic::tag('visual_edit')` with `->context($item->all())` to pass the set/row data. The tag reads `_visual_id` and `type` from the context, just like in Antlers:

```blade
{{-- Replicator / Bard set --}}
<div {!! Statamic::tag('visual_edit')->context($set->all())->fetch() !!}>
    {!! $set->text !!}
</div>
```

```blade
{{-- Grid rows --}}
@foreach ($rows as $row)
    <li {!! Statamic::tag('visual_edit')->context($row->all())->fetch() !!}>
        {!! (string) ($row->rule ?? '') !!}
    </li>
@endforeach
```

> **Important:** Always use `{!! !!}` (unescaped output), not `{{ }}`. The tag returns raw HTML attributes.

---

## Field targeting

Targets fixed blueprint fields — titles, SEO metadata, or any field that isn't inside a Replicator/Bard/Grid. The CP jumps directly to the field when clicked, switching tabs automatically if needed.

### Antlers

```antlers
{{# Top-level field #}}
<h1 {{ visual_edit field="hero_title" }}>{{ hero_title }}</h1>

{{# Nested field inside a group (dot notation) #}}
<p {{ visual_edit field="page_info.author" }}>{{ page_info:author }}</p>
```

The tooltip label is resolved from the field's Display Name in the current entry's blueprint automatically.

### Blade

```blade
{{-- Recommended: pass the blueprint handle (works without an entry object) --}}
<h1 {!! Statamic::tag('visual_edit')->blueprint('collections.pages')->field('hero_title')->fetch() !!}>

{{-- Alternative: pass the entry for blueprint resolution --}}
<h1 {!! Statamic::tag('visual_edit')->context(['page' => $entry])->field('hero_title')->fetch() !!}>

{{-- Minimal: no label resolution (CP navigation still works; label is cosmetic) --}}
<h1 {!! Statamic::tag('visual_edit')->field('hero_title')->fetch() !!}>
```

The `blueprint` parameter accepts a namespaced handle: `collections.{handle}`, `globals.{handle}`.

> **Tip:** In Blade components you often don't have the entry object — use `->blueprint()` instead of threading `$entry` through props.

### Dot notation

Use dots to target nested fields inside groups: `page_info.author`. Avoid top-level field handles containing underscores that could collide with group subfield paths — both `page_info.author` and `page_info_author` resolve to the same CP element ID.

---

## Additional features

### Pair tag

When there's no single outermost element to annotate, use the pair tag to wrap content in a `<div>`:

```antlers
{{ visual_edit }}
  <h1>{{ hero_title }}</h1>
  <p>{{ hero_text }}</p>
{{ /visual_edit }}
```

### Outline inside

For dense layouts where a 2 px outbound outline overlaps neighbouring elements, draw the outline inside instead:

```antlers
<div {{ visual_edit outline_inside="true" }}>
```

```blade
<div {!! Statamic::tag('visual_edit')->context($set->all())->params(['outline_inside' => true])->fetch() !!}>
```

---

## Editing & interaction

Set/field targeting (above) makes an element *highlightable*. These parameters
make it *editable* — inline text, drag-reordering, add/remove, opening panels.
Each is opt-in: add only what a given element should do.

### `inline_edit="true"` — edit the text right in the preview

Pairs with `field`. Without it, clicking the element only focuses the field in the
Control Panel. **With** it, you can type directly into the element in the preview,
and a Bard field brings its own toolbar (bold, links, styles — whatever that
field's `buttons` list allows, never hardcoded).

```antlers
<div {{ visual_edit field="text" inline_edit="true" }}>{{ text }}</div>
<h1 {{ visual_edit field="heading" inline_edit="true" }}>{{ heading }}</h1>
```

Also works on the field for an image, an Iconify icon, or a button — clicking
opens the right editor inline. An icon that already has a value offers
**Change / Remove** (the same two actions as the sidebar); an empty icon field
opens the Iconify search. Legacy spelling `inline-edit` is accepted.

```antlers
<div {{ visual_edit field="icon" inline_edit="true" }}>
    {{ iconify:icon }}
</div>
```

A plain text field gets no ✓/✕ buttons: **Enter** or a click outside commits it and
**Esc** cancels, so unless the element declares `controls` (below) or sits in a row
with a link, no toolbar appears at all. Rich text keeps its ✓/✕ — there Enter
splits blocks instead of committing.

### `controls="font_tag|size"` — a block's own settings in the toolbar

Pairs with `inline_edit`. Names sibling fields **on the same row** as the field
being edited; each one is rendered in the inline toolbar, so a block's settings can
be changed without opening the panel.

```antlers
{{ _tag = font_tag ? font_tag : 'h2' }}
<{{ _tag }} {{ visual_edit field="headline" inline_edit="true" controls="font_tag|size" }}>
  {{ headline }}
</{{ _tag }}>
```

Handles are separated by `|` or `,` and render in the order they're named. Types
and options come from the blueprint, so adding an option to the field adds it to
the toolbar:

| Field type | Rendered as |
|---|---|
| `button_group`, `radio` — up to 3 options | segmented buttons, current one highlighted |
| `select`, or any longer option list | dropdown showing the current label |
| `toggle` | a single on/off chip |

Anything else — and any handle that isn't a field on that row — is skipped.

What a control changes is rendered **server-side**, so using one commits the text
edit, writes the value, and reopens the editor on the re-rendered element. Give the
setting an effect in your template, or nothing will appear to happen.

The option a control starts on can be declared in the same string —
`controls="tag:h1|font_size:text-700"` — so one shared headline block can lead
with an H1 in the hero and an H3 in a content box. See `template` / `default`
below for the same idea on replicator rows and field values.

### `orderable="true"` — drag rows to reorder, with add/remove

Put it on **each repeated element** (the `<li>` or set `<div>` inside a loop).
In the preview each row can be dragged among its siblings that also carry
`orderable`, and gets **+ / −** controls on hover to add another row of the same
type or remove this one (min/max from the blueprint are respected).

```antlers
<ul>
  {{ benefits }}
    <li {{ visual_edit orderable="true" }}>
      <b {{ visual_edit field="number" inline_edit="true" }}>{{ number }}</b>
      <p {{ visual_edit field="text"   inline_edit="true" }}>{{ text }}</p>
    </li>
  {{ /benefits }}
</ul>
```

It belongs on the item, not the container — the item is what moves and needs its
own identity. Works in both Grid and Replicator loops.

### `move="true"` — up/down arrows instead of drag

A lighter alternative to `orderable`: shows reorder arrows on hover rather than
drag-and-drop. Handy where a full drag would be awkward.

```antlers
<div {{ visual_edit field="text" inline_edit="true" move="true" }}>{{ text }}</div>
```

### `section_orderable="true"` — move a whole section

Put it on a **top-level section** element. Adds a drag handle to the section's
hover control that moves the entire section, with a zoomed-out page overview so
you can see where it lands. Legacy spelling `section-orderable` is accepted.

```antlers
<section id="id-{{ id }}" {{ visual_edit outline_inside="true" section_orderable="true" }}>
  …
</section>
```

### `insertable="true"` — a "+" block inserter inside a replicator

Put it on the **container** that wraps a replicator loop, together with
`field="<replicator handle>"`. In the preview, a single **"+"** appears after
the last block while the container is hovered; clicking it opens Statamic's own
**Add Set** picker to append a new block of a chosen type (an empty field shows
one "+" to start). The insert is native, so it lands in the Control Panel form too.

```antlers
<div {{ visual_edit field="blocks" insertable="true" }}>
  {{ blocks }}
    {{ if type == 'text' }}
      <div {{ visual_edit orderable="true" }}>{{ text }}</div>
    {{ elseif type == 'links' }}
      <div {{ visual_edit orderable="true" }}>{{ partial:components/btn_group }}</div>
    {{ endif }}
  {{ /blocks }}
</div>
```

Give each block `orderable="true"` too, so a newly inserted block is a proper,
movable row.

### `template="3:item"` / `template="icon|title"` — starting rows, declared in the template

A shared replicator should not carry *place-specific* start content in its YAML
`default`. Declare it where the list is rendered.

`template="3:item"` on the **insertable container** is how many rows a new list
starts with. `template="icon|title"` on each **orderable row** is what that row
contains — the same reason a headline partial takes `headline_tag="h1"`.

```antlers
<ul {{ visual_edit field="list" insertable="true" template="3:item" }}>
  {{ list }}
    <li {{ visual_edit orderable="true" template="icon|title" }}>
      {{ blocks }}…{{ /blocks }}
    </li>
  {{ /list }}
</ul>
```

A new list is created with three `item` rows; each row gets an `icon` set and a
`title` set. Clicking + on an existing list adds one more row with the same
inner sets. YAML `default` on the fieldset is still the fallback when nothing
is declared here.

Optional `:text` on an inner set writes a starting **value** (`title:Hello`).
For a hint that should not be stored, leave the set empty and use `placeholder`
on the field (below).

JSON is accepted too, in the same shape BlockStudio's InnerBlocks template uses
(`[['icon'], ['title', { placeholder: 'Book Title' }]]`). A `placeholder` key in
JSON is not written as a value. Pipe syntax is the one that sits comfortably in
an HTML attribute.

### `placeholder="Enter a title"` — ghost text while the field is empty

On a text or Bard field. Shown only in Live Preview while the field has no
content; never saved. The live site stays empty until someone types. Declare it
where the field is used, so a shared title can hint "Book title" in one section
and "Your name" in another.

```antlers
<p {{ visual_edit field="title" inline_edit="true" placeholder="Enter a title" }}>{{ title }}</p>
```

On a Bard field the hint can name the node it belongs to — heading vs paragraph —
so a title starts as an H3 and a body as a paragraph, without a YAML default:

```antlers
<h3 {{ visual_edit field="title" inline_edit="true" placeholder="h3:Enter a title" }}>{{ title }}</h3>
<p {{ visual_edit field="text" inline_edit="true" placeholder="paragraph:Enter your text" }}>{{ text }}</p>
```

`as="h3"` does the same when the hint has no prefix. The wrapper tag is a
fallback if neither is set (`<h3>` → heading 3, `<p>` → paragraph).

### `default="Enter a title"` — starting value for a field, at this place

On a text or Bard field. Applied when the parent row is created, not written
over content the editor has already typed. A plain string is the value (Bard:
one paragraph). Richer Bard start content:

```antlers
<p {{ visual_edit field="title" inline_edit="true" default="Enter a title" }}>{{ title }}</p>

<div {{ visual_edit field="text" inline_edit="true" default="heading:1:Book Title|paragraph:Summary" }}>
  {{ text }}
</div>
```

An interpolated parameter that was never passed (`template="{foo}"`,
`default="{bar}"`) is omitted, so the fieldset's own default remains.

### `global_edit="set.field"` — open a global in the side panel

For content that comes from a **global set** (a phone number, an address rendered
inside other text). Clicking opens that global in a panel beside the preview with
the field focused — deliberately *not* inline, since the value is usually wrapped
in other text and writing the whole string back would corrupt it. `global_edit="true"`
just opens the panel on the first set. Legacy spelling `global-edit`.

```antlers
<span {{ visual_edit global_edit="site_settings.phone" }}>Tlf. {{ site_settings:phone }}</span>
```

### `popup="true"` — open the field's editor as a popup

Targets an item by its row `id` and opens a Control Panel popup for it when
clicked, rather than editing in place. Used for things like column-builder rows.
Combine with `field` + `inline_edit` for **dual mode**: a click tries inline
editing first and falls back to the popup when the click doesn't map onto an
editable value (padding, an image, unmatched text).

### `scope="{{ id }}"` — fix field identity in nested rows

`field` normally scopes to the section's `_visual_id`, which cascades down. Inside
a **column-builder row** the field lives on the row, not the section — so pass
`scope="{{ id }}"` (the row's own id) to point the edit at the right element.

```antlers
<div {{ visual_edit field="text" inline_edit="true" scope="{{ id }}" }}>{{ text }}</div>
```

---

## The focus panel

Beside the preview the panel shows **one thing at a time**, named at the top.

Click a section on the page and the panel becomes that section: its icon, its
display name and its `instructions` in a header, its own fields under it, and its
`tab` markers as the row of segments across the middle. Click a block *inside* the
section and the panel steps in one level — now it is the block, and the back arrow
in the Live Preview header points at the section it came from rather than at the
whole page.

A section shows everything it holds: its own fields, and the blocks built inside
it as a list that unfolds where it stands. Clicking a block on the page opens its
section with that block unfolded and scrolled to — you stay in the section and can
work down it — and each block's header carries an **arrow** that opens that block
on its own, for when one thing at a time is what's wanted. The back arrow then
points at the section it came from.

A segment with nothing in it — every field on it hidden from this editor — is
dropped rather than offered empty. Adding, removing and reordering blocks stays
where it already was: the hover controls on the page (`orderable`, `insertable`,
`move`).

Nothing here is configured per template. The header reads the set's own config:

```yaml
headline:
  display: Headline
  icon: h1                       # Statamic icon name, Iconify name, or an emoji
  instructions: 'One line for the editor about what this block is.'
  fields:
    # …
```

`icon` accepts a name from Statamic's own icon set (`h1`, `link`,
`fieldtype-bard`), an Iconify name (`lucide:layout-template`), a filename from a
custom SVG folder registered with `Icon::register()` (see below), pasted SVG
markup, or an emoji. In **Edit Set** the Icon picker still lists Statamic's
(or `Sets::useIcons`) SVGs; a **Custom (Iconify / SVG)** field under it accepts
the rest. With no icon the header draws the initial of the name, so blocks still
tell themselves apart at a glance.

### Custom SVG files

Drop `.svg` files in a folder and register it:

```php
use Statamic\Facades\Icon;

Icon::register('vizuall', resource_path('svg/set-icons'));
```

Then type the filename (without `.svg`) in the custom icon field — e.g. `hero`.

To also show those files in Statamic's Icon picker (replacing the default set for
Replicator/Bard sets), call:

```php
use Statamic\Fieldtypes\Sets;

Sets::useIcons('vizuall', resource_path('svg/set-icons'));
```

Switch it off under **Addons → Statamic Visual Editor → Focus panel** and the panel
is the section list Statamic renders, as before. The ordinary publish form — the
entry screen outside Live Preview — is untouched either way.

### Where a field is edited

Every field's own settings screen gains one question: **Where it is edited**.

| Answer | The field appears |
|---|---|
| Both editors *(default)* | in the panel beside the preview **and** in the ordinary entry form |
| Only beside the preview | in the panel alone |
| Not beside the preview | in the entry form alone |

Use the last one for a field whose value is already set on the page itself — a
heading's tag and size, offered in the inline toolbar through `controls` — so the
editor is not asked the same question twice.

It is a dropdown in the Control Panel, not a line of YAML: nobody needs access to
the site's files to decide where a field belongs. Under the hood the answer
becomes the custom condition this was done with before the setting existed
(`custom notInLivePreview` / `custom onlyInLivePreview`), applied as the blueprint
is read, together with the `always_save` that a conditionally hidden field needs —
so a field hidden from one editor still keeps whatever the other one set.

A condition written by hand always wins: a field carrying its own `if`, `if_any`
or `unless` is left exactly as it is, and a field that has never been asked the
question is not touched at all. Existing sites keep working unchanged.

---

## The heading outline

The icon of stepped lines in the Live Preview header opens the page's headings as
one list, docked on the right.

Not the sections the page is built from — the structure a reader, a screen reader
or a search engine actually meets, in the order they meet it, whether a heading
comes from a block, a global, a partial or the layout. Each entry is drawn at its
level (`H1`, `H2`, `H3`…), indented against the shallowest heading on the page, so
a page whose top heading is an `H2` reads flush rather than pushed in under a level
that isn't there.

Clicking an entry does two things:

- the preview scrolls to that heading, centred, and marks it the way a click in the
  Control Panel does;
- the block the heading sits in opens in the editor panel — where the template
  annotated it with `visual_edit`, the field's own block; otherwise the section
  around it. A panel put away (Hide) stays away: the click was "take me there",
  not "open everything".

The list keeps itself current. The preview reports its headings while the panel is
open and again whenever the page settles after a change, so typing into a heading
updates the outline as you type. Closing the panel stops the watching.

Nothing needs annotating for the outline itself — it reads the rendered page. The
`visual_edit` annotations are what make an entry *clickable through* to its block,
so a well-annotated template gets navigation for free.

A heading with no text yet is listed as *(no text yet)* rather than as a gap, and
headings inside the editor's own toolbars — or in something not currently rendered,
like a closed mobile menu — are left out.

### What it checks

The panel also says when the structure doesn't hold up. None of it shows on the
page — text looks the same whatever level it is written at — so the outline is
where it can be said at all:

| | |
|---|---|
| **No H1** | Nothing on the page says what the whole page is about. Shown as a note above the list. |
| **More than one H1** | Several things claim to be what the page is. Also a note above the list. |
| **A heading before the H1** | The H1 should be the first heading on the page. Marked on the row. |
| **A skipped level** | H1 straight to H3, H2 straight to H4. Levels step down one at a time. Marked on the row. |

Marked rows turn amber and carry a `!`; hovering one explains what is wrong with
it. Amber rather than red throughout: nothing here is broken — the page renders
fine, it just doesn't read the way its levels claim.

Nothing is stored and nothing is dismissed. The checks run against the list as it
stands, and the list is rebuilt whenever the page changes — so dragging a section
into place clears the warnings by the next render, because there is nothing left to
report.

Switch it off under **Addons → Statamic Visual Editor → Heading outline**.

---

## Parameter reference

All parameters work in both Antlers and Blade (via the fluent API).

| Parameter | Default | Description |
|---|---|---|
| _(none)_ | — | Auto-targets the current set by its UUID (put on each set's outer element) |
| `field` | — | Targets a fixed field by handle (dot notation for nested groups) |
| `inline_edit` | `false` | Edit the field's value right in the preview (Bard brings its own toolbar) |
| `controls` | — | With `inline_edit`: sibling fields on the same row (`"font_tag\|size"`) offered in the toolbar |
| `orderable` | `false` | On each repeated item: drag to reorder + hover **+/−** to add/remove |
| `move` | `false` | Show up/down reorder arrows on hover (lighter than `orderable`) |
| `section_orderable` | `false` | On a section: drag handle to move the whole section |
| `insertable` | `false` | On a replicator container (with `field`): one "+" after the last block |
| `template` | — | On an insertable container: starting inner sets for a new row (`"icon\|title"`) |
| `placeholder` | — | On a field: ghost text while empty (`"Enter a title"`, or Bard `"h3:Enter a title"`) — not stored |
| `as` | — | On a Bard field: node for empty content (`h1`–`h6` or `paragraph`) |
| `default` | — | On a field: starting **value** at this place (`"Enter a title"`, or Bard `"heading:1:Title\|paragraph:Summary"`) |
| `global_edit` | — | Open a global set (`set` or `set.field`) in the side panel |
| `popup` | `false` | Open the item's editor as a CP popup instead of editing in place |
| `scope` | _(cascaded `_visual_id`)_ | Override the field's scope — use `{{ id }}` inside column-builder rows |
| `blueprint` | — | Resolve field labels from a specific blueprint (e.g. `collections.pages`). In Antlers the entry's blueprint is used automatically. |
| `outline_inside` | `false` | Draws the outline inside the element border |
| `id` | — | Override: target a specific set by a known UUID |

### Antlers ↔ Blade mapping

| Antlers | Blade |
|---------|-------|
| `{{ visual_edit }}` | `Statamic::tag('visual_edit')->context($set->all())->fetch()` |
| `{{ visual_edit field="title" }}` | `Statamic::tag('visual_edit')->field('title')->fetch()` |
| `{{ visual_edit field="title" blueprint="collections.pages" }}` | `Statamic::tag('visual_edit')->blueprint('collections.pages')->field('title')->fetch()` |
| `{{ visual_edit outline_inside="true" }}` | `Statamic::tag('visual_edit')->context($set->all())->params(['outline_inside' => true])->fetch()` |

---

## Developer reference

### How it works

1. **Blueprint injection** — `InjectVisualIdIntoBlueprint` adds a hidden `_visual_id` field (type `auto_uuid`) to every Replicator, Bard, and Grid set when a blueprint is loaded.
2. **Ephemeral UUID generation** — When the CP form loads, `AutoUuidFieldtype::preProcess()` generates a fresh UUID in-memory for any set that doesn't already have one. UUIDs are never persisted — `StripVisualIds` removes any `_visual_id` values from the data before saving.
3. **Template annotation** — `{{ visual_edit }}` outputs `data-sid="{uuid}"` (set targeting) or `data-sid-field="{path}"` (field targeting) plus optional label/type attributes.
4. **Bridge script** — `InjectBridgeScript` middleware injects `bridge.js` into the Live Preview iframe. It handles click/hover events and communicates with the CP via `postMessage`.
5. **CP script** — `addon.js` (loaded via Vite) listens for messages from the iframe, expands collapsed sets, switches tabs, scrolls, and highlights the target field.

Because the CP form and the Live Preview share the same in-memory form state, the ephemeral UUIDs are identical on both sides for the duration of the editing session — no persistence is needed. Hover sync works in both directions for both mechanisms.
