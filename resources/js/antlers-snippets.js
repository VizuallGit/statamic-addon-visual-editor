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
];

export const ANTLERS_SNIPPETS = [
  { id: 'if', group: 'logic', label: 'if', snippet: '{{ if |field }}\n  \n{{ /if }}' },
  { id: 'if_else', group: 'logic', label: 'if / else', snippet: '{{ if |field }}\n  \n{{ else }}\n  \n{{ /if }}' },
  { id: 'if_elseif', group: 'logic', label: 'if / elseif / else', snippet: '{{ if |field }}\n  \n{{ elseif other }}\n  \n{{ else }}\n  \n{{ /if }}' },
  { id: 'unless', group: 'logic', label: 'unless', snippet: '{{ unless |field }}\n  \n{{ /unless }}' },
  { id: 'unless_else', group: 'logic', label: 'unless / else', snippet: '{{ unless |field }}\n  \n{{ else }}\n  \n{{ /unless }}' },
  { id: 'loop', group: 'loops', label: 'loop', snippet: '{{ |items }}\n  {{ title }}\n{{ /items }}' },
  { id: 'collection', group: 'loops', label: 'collection', snippet: '{{ collection:|handle }}\n  {{ title }}\n{{ /collection:handle }}' },
  { id: 'collection_as', group: 'loops', label: 'collection as', snippet: '{{ collection:|handle as="entries" }}\n  {{ if no_results }}\n    \n  {{ /if }}\n  {{ entries }}\n    {{ title }}\n  {{ /entries }}\n{{ /collection:handle }}' },
  { id: 'foreach', group: 'loops', label: 'foreach', snippet: '{{ foreach:|items }}\n  {{ key }}: {{ value }}\n{{ /foreach:items }}' },
  { id: 'partial', group: 'include', label: 'partial', snippet: '{{ partial:|path }}' },
  { id: 'partial_exists', group: 'include', label: 'partial:if_exists', snippet: '{{ partial:if_exists src="|path" }}' },
  { id: 'svg', group: 'include', label: 'svg', snippet: '{{ svg src="|icon" }}' },
  { id: 'nocache', group: 'include', label: 'nocache', snippet: '{{ nocache }}\n  \n{{ /nocache }}' },
  { id: 'assets', group: 'fields', label: 'assets', snippet: '{{ |assets }}\n  <img src="{{ url }}" alt="{{ alt }}">\n{{ /assets }}' },
  { id: 'asset', group: 'fields', label: 'asset', snippet: '{{ |image }}\n  <img src="{{ url }}" alt="{{ alt }}">\n{{ /image }}' },
  { id: 'replicator', group: 'fields', label: 'replicator', snippet: '{{ |blocks }}\n  {{ if type == "set_name" }}\n    \n  {{ /if }}\n{{ /blocks }}' },
  { id: 'grid', group: 'fields', label: 'grid', snippet: '{{ |items }}\n  {{ title }}\n{{ /items }}' },
  { id: 'variable', group: 'output', label: '{{ field }}', snippet: '{{ |field }}' },
  { id: 'trans', group: 'output', label: 'trans', snippet: '{{ trans:|key }}' },
  { id: 'comment', group: 'output', label: 'comment', snippet: '{{# | #}}' },
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
