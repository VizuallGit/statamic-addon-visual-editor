<?php

namespace MarioHamann\StatamicVisualEditor;

/**
 * Super-admin Cursor chat from Live Preview.
 *
 * Uses the same Cursor account — not a second Claude/Anthropic bill.
 * Build mode may change YAML / Antlers under fieldsets, blueprints and
 * page_sections partials. Write mode asks for markup in the reply and
 * reverts any file writes. Anything outside the allowlist is reverted.
 */
class AiChat
{
    public static function apiKey(): string
    {
        $saved = trim((string) Features::setting('ai_api_key', ''));

        if ($saved !== '') {
            return $saved;
        }

        return trim((string) config('statamic-visual-editor.ai.api_key', ''));
    }

    public static function ready(): bool
    {
        return Features::enabled('ai_panel') && static::apiKey() !== '';
    }

    public static function modeOf(mixed $mode): string
    {
        return is_string($mode) && strtolower(trim($mode)) === 'build' ? 'build' : 'write';
    }

    /**
     * @param  list<array{role: string, content: string}>  $messages
     * @return array{reply: string, applied: bool, path: ?string, mode: string}
     */
    public static function talk(string $handle, array $messages, string $mode = 'write'): array
    {
        abort_unless(static::apiKey() !== '', 422, 'Missing Cursor API key. Get one at cursor.com/dashboard/api — same Cursor account, not Claude.');

        set_time_limit(180);

        $mode = static::modeOf($mode);
        $messages = static::sanitize($messages);
        $before = static::allowedSnapshot();
        $forbidden = AiWriteGuard::snapshot();
        $locked = SectionTemplate::lockedSnapshots();
        $allowed = [];
        $dirtyBefore = [];

        if ($mode === 'write') {
            $dirtyBefore = AiWriteGuard::changedRelativePaths();
            $allowed = AiWriteGuard::snapshotAllowed();
        }

        $out = CursorAgent::run(static::prompt($handle, $messages, $mode));

        AiWriteGuard::restore($forbidden);

        if ($mode === 'write') {
            AiWriteGuard::restoreAllowed($allowed, $dirtyBefore);
        }

        SectionTemplate::restoreLocked($locked);

        $changed = $mode === 'write' ? [] : static::changedPaths($before, static::allowedSnapshot());

        return [
            'reply' => $out['reply'] !== '' ? $out['reply'] : 'Done.',
            'applied' => $changed !== [],
            'path' => $changed[0] ?? null,
            'mode' => $mode,
        ];
    }

    public static function modeInstructions(string $mode): string
    {
        if (static::modeOf($mode) === 'write') {
            return <<<'TXT'
WRITE MODE — output only. Do not write, create, edit or delete any files. Do not use file-writing tools.
The user wants the result in the chat so they can copy or insert it.

Reply with fenced code blocks, in this order when they apply:
```html
Antlers/HTML for the HTML pane
```
```css
CSS for the CSS pane — no <style> wrapper, no style_push
```
```js
JS if needed — no <script> wrapper
```
```yaml
Fieldset YAML only if they asked for fields or a new set
```

A short sentence, then the blocks. Paste-ready. No file paths as the main answer.
If a section is selected, output INNER markup that fits that section (reuse its fields and visual_edit tags). Do not repeat the outer <section id="id-{{ id }}"> wrapper unless they asked for a whole new section type.
If no section is selected, output a complete section using the frame under "New section".
TXT;
        }

        return <<<'TXT'
BUILD MODE — edit the selected section's files on disk (or create a new section type only when they explicitly ask for one).
TXT;
    }

    /**
     * @return array{handle: string, antlers: ?string, fieldset: ?string}
     */
    public static function targetFiles(string $handle): array
    {
        $handle = str_replace('\\', '/', trim($handle));
        $antlers = $handle !== '' ? SectionTemplate::path($handle) : null;
        $fieldsetRel = $handle !== ''
            ? 'resources/fieldsets/'.str_replace('.', '/', $handle).'.yaml'
            : '';

        return [
            'handle' => $handle,
            'antlers' => $antlers ? SectionTemplate::relative($antlers) : null,
            'fieldset' => $fieldsetRel !== '' && AiFiles::allowed($fieldsetRel) && AiFiles::resolve($fieldsetRel, true)
                ? $fieldsetRel
                : null,
        ];
    }

    /**
     * @param  list<array{role: string, content: string}>  $messages
     */
    protected static function prompt(string $handle, array $messages, string $mode = 'write'): string
    {
        $mode = static::modeOf($mode);
        $target = static::targetFiles($handle);
        $path = $handle !== '' ? SectionTemplate::path($handle) : null;
        $parts = $path
            ? SectionTemplate::split((string) file_get_contents($path), $handle)
            : ['html' => '', 'css' => '', 'js' => ''];
        $html = static::clip((string) ($parts['html'] ?? ''));
        $css = static::clip((string) ($parts['css'] ?? ''));
        $js = static::clip((string) ($parts['js'] ?? ''));
        $fieldsetBody = '';

        if ($target['fieldset']) {
            $fieldsetBody = static::clip(AiFiles::read($target['fieldset']), 20000);
        }

        $conversation = '';

        foreach ($messages as $row) {
            $conversation .= strtoupper($row['role']).":\n".$row['content']."\n\n";
        }

        $rules = AiRules::text();
        $modeBlock = static::modeInstructions($mode);
        $scope = $handle !== ''
            ? ($mode === 'write'
                ? <<<TXT
SELECTED SECTION — context only. Do not write these files.
Handle: {$target['handle']}
Antlers file: {$target['antlers']}
Fieldset file: {$target['fieldset']}

The user clicked this section. Write a snippet they can paste into it. Match its fields, loops and visual_edit tags.
TXT
                : <<<TXT
SELECTED SECTION — write here.
Handle: {$target['handle']}
Antlers file: {$target['antlers']}
Fieldset file: {$target['fieldset']}

The user clicked this section. Requests like "add a heading", "create a heading", "make the title bigger" or "add padding" mean: edit the Antlers file above (and the fieldset only if a new field is required).
The current HTML/CSS/JS below is the source of truth. Keep all of it. Insert or tweak only what they asked for. Never replace the file with a new layout.
Do not create a new section type, a new style_N file, or a new folder.
Do not write another section's files.
Only create new files if they explicitly ask for a new section type / new set / new fieldset.
TXT)
            : ($mode === 'write'
                ? <<<TXT
No section is selected.
Write a complete section they can paste. Use the frame under "New section".
TXT
                : <<<TXT
No section is selected.
If they ask to change "the heading" or "this section", tell them to click a section in the preview first.
Create new files only when they explicitly ask for a new section type, fieldset or YAML file.
TXT);

        if ($mode === 'build' && $path && SectionTemplate::fileIsLocked($path)) {
            $scope .= <<<'TXT'


LOCKED — do not edit this Antlers file. It is locked in the template dock. You may still edit the fieldset, or create a new section type if they asked for one. Do not remove the {{# sve-locked #}} comment.
TXT;
        }

        $folders = $mode === 'write'
            ? <<<TXT
You may READ these folders for context. Do not write them:
- resources/fieldsets/
- resources/blueprints/
- resources/views/partials/page_sections/
- resources/visual-editor/ai-rules.md

Never touch vendor, .env, PHP, config or content entries.
In Write mode, skip appending to ai-rules.md — mention the rule in the reply instead.
TXT
            : <<<TXT
You may read and write these folders only:
- resources/fieldsets/          (YAML fieldsets)
- resources/blueprints/         (YAML blueprints)
- resources/views/partials/page_sections/  (Antlers section templates)
- resources/visual-editor/ai-rules.md      (operating rules — append only)

Allowed extensions: .yaml .yml .antlers.html, and ai-rules.md
Never touch vendor, .env, PHP, config or content entries.

When the user or a designer says how they want things built ("we always wrap in .wrapper", "remember this", "make that a rule", "sådan gør vi"), APPEND a new numbered item to resources/visual-editor/ai-rules.md. Do not delete or rewrite existing rules. Then follow the new rule in the same turn.
TXT;

        return <<<TXT
You are helping a Statamic v6 super admin from Live Preview. You run as a local Cursor agent on their site.

Follow these rules. They outrank a vague request to "make a heading" or "improve this":

{$modeBlock}

{$rules}

{$scope}

{$folders}

When filling a new fieldset, first read resources/fieldsets/ai_demo/section.yaml as a guideline for tabs (Content, Style, Farver accordion, Spacing accordion) and fieldtypes (theme_color_picker, common.section_spacing, sve_responsive). Do not copy that file. Build the fields the user asked for — a hero with heading, image and buttons gets those fields, not only the demo's. Never register ai_demo in page_sections.yaml.

When the new section is done, it is not done until it is added to resources/fieldsets/page_sections.yaml. Read that file first, append the new set, write the full YAML back so existing sets stay.

When filling CSS: put every value that can differ per instance (color, padding, gap, width) as a custom property on #id-{{ id }} only. Put the real CSS inside @scope(.{{ _class }}) and consume those variables with var(--…). Never write {{ bg_color }} directly onto a CSS property in @scope.

A new page-section type (only when they ask for one) needs three things:
1. Fieldset YAML, e.g. resources/fieldsets/foo/style_1.yaml
2. Antlers partial that STARTS as this exact frame (then fill in content/CSS/JS):

<section id="id-{{ id }}" class="[ {{ _class }} ] wrapper relative " {{ visual_edit outline_inside="true" section_orderable="true" }}>

</section>

{{ style_push }}
<style>
  #id-{{ id }} {
    --color-bg: {{ bg_color ?? 'var(--gray-600)' }};
  }

  @scope(.{{ _class }}) {
    :scope {
      background-color: var(--color-bg);
    }
  }
</style>
{{ /style_push }}

{{ script_push }}
<script>

</script>
{{ /script_push }}

Do not put `{{ _class = type | replace... }}` in the section file. `_class` is passed from the page_sections loop.
3. Register it in resources/fieldsets/page_sections.yaml under the matching group (hero, entries, featured, media, content, layout, more). Read that file first, then write the full YAML. Example:
            hero:
              display: Hero
              sets:
                foo/style_1:
                  display: 'Foo style 1'
                  fields:
                    - import: foo.style_1

After creating a new set, tell the user to refresh the Control Panel so the section library picks it up.
Keep existing visual_edit tags and field handles unless asked to change them.
Prefer CSS variables (--size-*, color tokens, --gutter) when it fits.
If the fieldset already has a heading/title field, use that Antlers variable — do not hardcode the text unless they gave the words.
Reply in the user's language. Be short.

Current HTML:
{$html}

Current CSS:
{$css}

Current JS:
{$js}

Current fieldset:
{$fieldsetBody}

Conversation:
{$conversation}
TXT;
    }

    /**
     * @param  list<mixed>  $messages
     * @return list<array{role: string, content: string}>
     */
    protected static function sanitize(array $messages): array
    {
        $out = [];

        foreach (array_slice($messages, -20) as $row) {
            if (! is_array($row)) {
                continue;
            }

            $role = $row['role'] ?? '';
            $content = $row['content'] ?? '';

            if (! in_array($role, ['user', 'assistant'], true) || ! is_string($content) || trim($content) === '') {
                continue;
            }

            $out[] = [
                'role' => $role,
                'content' => static::clip($content, 20000),
            ];
        }

        abort_unless($out !== [] && $out[array_key_last($out)]['role'] === 'user', 422);

        return $out;
    }

    /**
     * @return array<string, string>
     */
    protected static function allowedSnapshot(): array
    {
        $out = [];

        foreach (AiFiles::roots() as $root) {
            if (! is_dir($root)) {
                continue;
            }

            $iter = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($root, \FilesystemIterator::SKIP_DOTS)
            );

            foreach ($iter as $file) {
                if (! $file->isFile()) {
                    continue;
                }

                $path = $file->getPathname();
                $out[$path] = $file->getMTime().':'.$file->getSize();
            }
        }

        ksort($out);

        return $out;
    }

    /**
     * @param  array<string, string>  $before
     * @param  array<string, string>  $after
     * @return list<string>
     */
    protected static function changedPaths(array $before, array $after): array
    {
        $changed = [];

        foreach ($after as $path => $stamp) {
            if (($before[$path] ?? null) !== $stamp) {
                $changed[] = SectionTemplate::relative($path);
            }
        }

        return $changed;
    }

    protected static function clip(string $text, int $max = 60000): string
    {
        if (strlen($text) <= $max) {
            return $text;
        }

        return substr($text, 0, $max)."\n…";
    }
}
