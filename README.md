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
<div {{ visual_edit outline-inside="true" }}>
```

```blade
<div {!! Statamic::tag('visual_edit')->context($set->all())->params(['outline-inside' => true])->fetch() !!}>
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

Also works on the field for an image or a button — clicking opens the right editor
inline. Legacy spelling `inline-edit` is accepted.

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

### `section-orderable="true"` — move a whole section

Put it on a **top-level section** element. Adds a drag handle to the section's
hover control that moves the entire section, with a zoomed-out page overview so
you can see where it lands. Legacy spelling `section_orderable` is accepted.

```antlers
<section id="id-{{ id }}" {{ visual_edit outline-inside="true" section-orderable="true" }}>
  …
</section>
```

### `insertable="true"` — a "+" block inserter inside a replicator

Put it on the **container** that wraps a replicator loop, together with
`field="<replicator handle>"`. In the preview, a Gutenberg-style **"+"** appears
under each block; clicking it opens Statamic's own **Add Set** picker to insert a
new block of a chosen type at that spot (an empty field shows one "+" to start).
The insert is native, so it lands in the Control Panel form too.

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

## Parameter reference

All parameters work in both Antlers and Blade (via the fluent API).

| Parameter | Default | Description |
|---|---|---|
| _(none)_ | — | Auto-targets the current set by its UUID (put on each set's outer element) |
| `field` | — | Targets a fixed field by handle (dot notation for nested groups) |
| `inline_edit` | `false` | Edit the field's value right in the preview (Bard brings its own toolbar) |
| `orderable` | `false` | On each repeated item: drag to reorder + hover **+/−** to add/remove |
| `move` | `false` | Show up/down reorder arrows on hover (lighter than `orderable`) |
| `section-orderable` | `false` | On a section: drag handle to move the whole section |
| `insertable` | `false` | On a replicator container (with `field`): a "+" that opens the Add Set picker |
| `global_edit` | — | Open a global set (`set` or `set.field`) in the side panel |
| `popup` | `false` | Open the item's editor as a CP popup instead of editing in place |
| `scope` | _(cascaded `_visual_id`)_ | Override the field's scope — use `{{ id }}` inside column-builder rows |
| `blueprint` | — | Resolve field labels from a specific blueprint (e.g. `collections.pages`). In Antlers the entry's blueprint is used automatically. |
| `outline-inside` | `false` | Draws the outline inside the element border |
| `id` | — | Override: target a specific set by a known UUID |

### Antlers ↔ Blade mapping

| Antlers | Blade |
|---------|-------|
| `{{ visual_edit }}` | `Statamic::tag('visual_edit')->context($set->all())->fetch()` |
| `{{ visual_edit field="title" }}` | `Statamic::tag('visual_edit')->field('title')->fetch()` |
| `{{ visual_edit field="title" blueprint="collections.pages" }}` | `Statamic::tag('visual_edit')->blueprint('collections.pages')->field('title')->fetch()` |
| `{{ visual_edit outline-inside="true" }}` | `Statamic::tag('visual_edit')->context($set->all())->params(['outline-inside' => true])->fetch()` |

---

## Developer reference

### How it works

1. **Blueprint injection** — `InjectVisualIdIntoBlueprint` adds a hidden `_visual_id` field (type `auto_uuid`) to every Replicator, Bard, and Grid set when a blueprint is loaded.
2. **Ephemeral UUID generation** — When the CP form loads, `AutoUuidFieldtype::preProcess()` generates a fresh UUID in-memory for any set that doesn't already have one. UUIDs are never persisted — `StripVisualIds` removes any `_visual_id` values from the data before saving.
3. **Template annotation** — `{{ visual_edit }}` outputs `data-sid="{uuid}"` (set targeting) or `data-sid-field="{path}"` (field targeting) plus optional label/type attributes.
4. **Bridge script** — `InjectBridgeScript` middleware injects `bridge.js` into the Live Preview iframe. It handles click/hover events and communicates with the CP via `postMessage`.
5. **CP script** — `addon.js` (loaded via Vite) listens for messages from the iframe, expands collapsed sets, switches tabs, scrolls, and highlights the target field.

Because the CP form and the Live Preview share the same in-memory form state, the ephemeral UUIDs are identical on both sides for the duration of the editing session — no persistence is needed. Hover sync works in both directions for both mechanisms.
