<?php

namespace MarioHamann\StatamicVisualEditor\Fieldtypes;

/**
 * Live Preview-skal omkring page sections: Vue mounter én sektion ad gangen.
 *
 * Det er en *egen* handle (`sve_lite_sections`), ikke Statamics `replicator`.
 * YAML på disken bliver ved med at sige `type: replicator`. Listeneren
 * {@see \MarioHamann\StatamicVisualEditor\Listeners\UseLiteSections} bytter
 * kun i hukommelsen, og kun i Live Preview.
 *
 * Arver {@see Replicator} så `unique_sets` stadig gælder. Ingen ekstra
 * validering her.
 */
class SveLiteSections extends Replicator
{
    protected static $handle = 'sve_lite_sections';

    protected $selectable = false;

    public function component(): string
    {
        return 'sve_lite_sections';
    }

    /**
     * Replicator's meta, plus the answer to "which field is the page's
     * sections, on which blueprint". The listener swapped exactly that field
     * ({@see \MarioHamann\StatamicVisualEditor\SectionField}), and the meta is
     * what the Control Panel gets with the form — Statamic's
     * `publish-container-created` carries `meta` but not the blueprint. Read
     * by `sectionField()` in lib/config.js.
     */
    public function preload()
    {
        $parent = $this->field()?->parent();
        $blueprint = is_object($parent) && method_exists($parent, 'blueprint') ? $parent->blueprint() : null;

        return array_merge(parent::preload(), [
            'sve_sections' => true,
            'sve_blueprint' => is_object($blueprint) ? (string) $blueprint->fullyQualifiedHandle() : null,
        ]);
    }
}
