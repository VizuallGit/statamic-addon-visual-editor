/**
 * Common Statamic Antlers snippets for the HTML dock.
 * `|` marks the cursor. Placeholders (field, handle, …) are meant to be edited.
 * Does not import overlay / preview / bridge.
 */

export const ANTLERS_SNIPPET_GROUPS = [
  { id: 'logic', lang: 'code_dock_antlers_logic' },
  { id: 'loops', lang: 'code_dock_antlers_loops' },
  { id: 'include', lang: 'code_dock_antlers_include' },
  { id: 'fields', lang: 'code_dock_antlers_fields' },
  { id: 'output', lang: 'code_dock_antlers_output' },
  { id: 'modifiers', lang: 'code_dock_antlers_modifiers' },
];

export const ANTLERS_SNIPPETS = [
  { id: 'if', group: 'logic', label: 'if', snippet: '{{ if |field }}\n  \n{{ /if }}' },
  { id: 'if_else', group: 'logic', label: 'if / else', snippet: '{{ if |field }}\n  \n{{ else }}\n  \n{{ /if }}' },
  { id: 'if_elseif', group: 'logic', label: 'if / elseif / else', snippet: '{{ if |field }}\n  \n{{ elseif other }}\n  \n{{ else }}\n  \n{{ /if }}' },
  { id: 'unless', group: 'logic', label: 'unless', snippet: '{{ unless |field }}\n  \n{{ /unless }}' },
  { id: 'unless_else', group: 'logic', label: 'unless / else', snippet: '{{ unless |field }}\n  \n{{ else }}\n  \n{{ /unless }}' },
  // A field's text: what it ends with, starts with, or holds.
  { id: 'if_ends_with', group: 'logic', label: "if … ends_with('…')", snippet: "{{ if (|field | ends_with('.mp4')) }}\n  \n{{ /if }}" },
  { id: 'if_starts_with', group: 'logic', label: "if … starts_with('…')", snippet: "{{ if (|field | starts_with('http')) }}\n  \n{{ /if }}" },
  { id: 'if_contains', group: 'logic', label: "if … contains('…')", snippet: "{{ if (|field | contains('word')) }}\n  \n{{ /if }}" },
  // Inside a nav loop: the page being viewed, and the one above it.
  { id: 'is_current', group: 'logic', label: 'is_current', snippet: '{{ if |is_current }}\n  \n{{ /if }}' },
  { id: 'is_parent', group: 'logic', label: 'is_parent', snippet: '{{ if |is_parent }}\n  \n{{ /if }}' },
  { id: 'is_current_or_parent', group: 'logic', label: 'is_current || is_parent', snippet: '{{ if |is_current || is_parent }}\n  \n{{ /if }}' },
  { id: 'loop', group: 'loops', label: 'loop', snippet: '{{ |items }}\n  {{ title }}\n{{ /items }}' },
  { id: 'collection', group: 'loops', label: 'collection', snippet: '{{ collection from="|handle" }}\n  {{ title }}\n{{ /collection }}' },
  { id: 'collection_as', group: 'loops', label: 'collection as', snippet: '{{ collection from="|handle" as="entries" }}\n  {{ if no_results }}\n    \n  {{ /if }}\n  {{ entries }}\n    {{ title }}\n  {{ /entries }}\n{{ /collection }}' },
  { id: 'foreach', group: 'loops', label: 'foreach', snippet: '{{ foreach:|items }}\n  {{ key }}: {{ value }}\n{{ /foreach:items }}' },
  // Navigation: the tree by handle, the page being viewed marked; with the
  // home page in front of it; one level down; the way here.
  { id: 'nav', group: 'loops', label: 'nav', snippet: '{{ nav:|main }}\n  <a href="{{ url }}"{{ if is_current || is_parent }} aria-current="page"{{ /if }}>{{ title }}</a>\n{{ /nav:main }}' },
  { id: 'nav_home', group: 'loops', label: 'nav include_home', snippet: '{{ nav:|main include_home="true" }}\n  <a href="{{ url }}"{{ if is_current || is_parent }} aria-current="page"{{ /if }}>{{ title }}</a>\n{{ /nav:main }}' },
  { id: 'nav_children', group: 'loops', label: 'nav children', snippet: '{{ nav:|main }}\n  <a href="{{ url }}">{{ title }}</a>\n  {{ if children }}\n    {{ children }}\n      <a href="{{ url }}">{{ title }}</a>\n    {{ /children }}\n  {{ /if }}\n{{ /nav:main }}' },
  { id: 'breadcrumbs', group: 'loops', label: 'nav:breadcrumbs', snippet: '{{ nav:breadcrumbs }}\n  <a href="{{ url }}">{{ title }}</a>\n{{ /nav:breadcrumbs }}' },
  { id: 'partial', group: 'include', label: 'partial', snippet: '{{ partial:|path }}' },
  { id: 'partial_exists', group: 'include', label: 'partial:if_exists', snippet: '{{ partial:if_exists src="|path" }}' },
  { id: 'svg', group: 'include', label: 'svg', snippet: '{{ svg src="|icon" }}' },
  { id: 'iconify', group: 'include', label: 'iconify', snippet: '{{ iconify:|icon }}' },
  { id: 'nocache', group: 'include', label: 'nocache', snippet: '{{ nocache }}\n  \n{{ /nocache }}' },
  { id: 'assets', group: 'fields', label: 'assets', snippet: '{{ |assets }}\n  <img src="{{ url }}" alt="{{ alt }}">\n{{ /assets }}' },
  { id: 'asset', group: 'fields', label: 'asset', snippet: '{{ |image }}\n  <img src="{{ url }}" alt="{{ alt }}">\n{{ /image }}' },
  { id: 'replicator', group: 'fields', label: 'replicator', snippet: '{{ |blocks }}\n  {{ if type == "set_name" }}\n    \n  {{ /if }}\n{{ /blocks }}' },
  { id: 'grid', group: 'fields', label: 'grid', snippet: '{{ |items }}\n  {{ title }}\n{{ /items }}' },
  { id: 'variable', group: 'output', label: '{{ field }}', snippet: '{{ |field }}' },
  { id: 'trans', group: 'output', label: 'trans', snippet: '{{ trans:|key }}' },
  { id: 'comment', group: 'output', label: 'comment', snippet: '{{# | #}}' },
  // Modifiers go in at the caret, inside the tag already there: `{{ title| }}` → `{{ title | upper }}`.
  { id: 'mod_upper', group: 'modifiers', label: 'upper', snippet: ' | upper', inline: true },
  { id: 'mod_lower', group: 'modifiers', label: 'lower', snippet: ' | lower', inline: true },
  { id: 'mod_title', group: 'modifiers', label: 'title', snippet: ' | title', inline: true },
  { id: 'mod_ucfirst', group: 'modifiers', label: 'ucfirst', snippet: ' | ucfirst', inline: true },
  { id: 'mod_truncate', group: 'modifiers', label: 'truncate', snippet: ' | truncate:120', inline: true },
  { id: 'mod_markdown', group: 'modifiers', label: 'markdown', snippet: ' | markdown', inline: true },
  { id: 'mod_raw', group: 'modifiers', label: 'raw', snippet: ' | raw', inline: true },
  { id: 'mod_nl2br', group: 'modifiers', label: 'nl2br', snippet: ' | nl2br', inline: true },
  { id: 'mod_strip_tags', group: 'modifiers', label: 'strip_tags', snippet: ' | strip_tags', inline: true },
  { id: 'mod_date', group: 'modifiers', label: 'date', snippet: ' | date:d.m.Y', inline: true },
  { id: 'mod_count', group: 'modifiers', label: 'count', snippet: ' | count', inline: true },
  { id: 'mod_first', group: 'modifiers', label: 'first', snippet: ' | first', inline: true },
  { id: 'mod_last', group: 'modifiers', label: 'last', snippet: ' | last', inline: true },
  { id: 'mod_reverse', group: 'modifiers', label: 'reverse', snippet: ' | reverse', inline: true },
  { id: 'mod_sort', group: 'modifiers', label: 'sort', snippet: ' | sort:title:asc', inline: true },
  { id: 'mod_limit', group: 'modifiers', label: 'limit', snippet: ' | limit:3', inline: true },
  { id: 'mod_where', group: 'modifiers', label: 'where', snippet: ' | where:field:value', inline: true },
  { id: 'mod_default', group: 'modifiers', label: 'default', snippet: ' | default:""', inline: true },
  { id: 'mod_url', group: 'modifiers', label: 'url', snippet: ' | url', inline: true },
  { id: 'mod_slugify', group: 'modifiers', label: 'slugify', snippet: ' | slugify', inline: true },
  { id: 'mod_to_int', group: 'modifiers', label: 'to_int', snippet: ' | to_int', inline: true },
  { id: 'mod_multiply', group: 'modifiers', label: 'multiply', snippet: ' | multiply:2', inline: true },
  { id: 'mod_add', group: 'modifiers', label: 'add', snippet: ' | add:1', inline: true },
  { id: 'mod_join', group: 'modifiers', label: 'join', snippet: ' | join:", "', inline: true },
  { id: 'mod_ends_with', group: 'modifiers', label: 'ends_with', snippet: " | ends_with('.mp4')", inline: true },
  { id: 'mod_starts_with', group: 'modifiers', label: 'starts_with', snippet: " | starts_with('http')", inline: true },
  { id: 'mod_contains', group: 'modifiers', label: 'contains', snippet: " | contains('word')", inline: true },
];

export function antlersSnippet(id) {
  return ANTLERS_SNIPPETS.find((item) => item.id === id) || null;
}

export function expandAntlersSnippet(raw) {
  const at = String(raw || '').indexOf('|');

  if (at === -1) {
    return { text: raw, cursor: String(raw || '').length };
  }

  return { text: raw.slice(0, at) + raw.slice(at + 1), cursor: at };
}

export function indentAntlersSnippet(text, indent) {
  return String(text || '')
    .split('\n')
    .map((line, i) => (i === 0 ? line : `${indent}${line}`))
    .join('\n');
}
