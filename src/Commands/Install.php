<?php

namespace MarioHamann\StatamicVisualEditor\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

/**
 * Scaffolds the few content-model pieces the editor's saved-section, global-section
 * and template features need — so the addon works on a fresh Statamic site without
 * the starter kit, or any manual setup.
 *
 * Everything is derived from config (handles, the page-builder field), never
 * hardcoded, so it lands right whatever the site calls its fields. Existing files
 * are left alone unless --force is given.
 */
class Install extends Command
{
    protected $signature = 'sve:install {--force : Overwrite files that already exist}';

    protected $description = 'Scaffold the collections, blueprints and partial the visual editor needs.';

    public function handle(): int
    {
        $sections = config('statamic-visual-editor.saved_sections.collection', 'saved_sections');
        $templates = config('statamic-visual-editor.templates.collection', 'saved_templates');
        $set = config('statamic-visual-editor.saved_sections.set', 'global_section');
        $field = config('statamic-visual-editor.previews.field', 'page_sections');

        $this->info('Setting up the visual editor…');

        // Collections (the stores) + their blueprints.
        $this->publish(
            "saved-sections.collection.yaml",
            base_path("content/collections/{$sections}.yaml")
        );
        $this->publish(
            "saved-section.blueprint.yaml",
            resource_path("blueprints/collections/{$sections}/saved_section.yaml"),
            ['PAGE_BUILDER_FIELD' => $field]
        );

        $this->publish(
            "saved-templates.collection.yaml",
            base_path("content/collections/{$templates}.yaml")
        );
        $this->publish(
            "saved-template.blueprint.yaml",
            resource_path("blueprints/collections/{$templates}/saved_template.yaml"),
            ['PAGE_BUILDER_FIELD' => $field]
        );

        // The partial that renders a referenced (synced) global section. Named for
        // the set handle, since that's what a page uses to reference one.
        $this->publish(
            "global-section.antlers.html",
            resource_path("views/partials/page_sections/{$set}.antlers.html"),
            ['SET_HANDLE' => $set, 'PAGE_BUILDER_FIELD' => $field]
        );

        $this->newLine();
        $this->info('Done.');
        $this->line("  One manual step left: add a <comment>{$set}</comment> set to your <comment>{$field}</comment> page-builder");
        $this->line('  fieldset (an entries field pointing at the Global sections collection, max 1),');
        $this->line("  so pages can reference a global section. Hide it from the native picker with <comment>hide: true</comment>.");

        return self::SUCCESS;
    }

    /**
     * Copies a stub into place, substituting placeholders. Skips a file that
     * already exists (the site's own version wins) unless --force.
     */
    protected function publish(string $stub, string $target, array $replace = []): void
    {
        $relative = str_replace(base_path().'/', '', $target);

        if (File::exists($target) && ! $this->option('force')) {
            $this->line("  <comment>•</comment> {$relative} — already there, left as-is");

            return;
        }

        $contents = File::get(__DIR__."/../../resources/stubs/{$stub}");

        foreach ($replace as $find => $value) {
            $contents = str_replace($find, $value, $contents);
        }

        File::ensureDirectoryExists(dirname($target));
        File::put($target, $contents);

        $this->line("  <info>✓</info> {$relative}");
    }
}
