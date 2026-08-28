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
}
