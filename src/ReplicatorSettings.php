<?php

namespace MarioHamann\StatamicVisualEditor;

use Statamic\Fieldtypes\Bard;
use Statamic\Fieldtypes\Grid;
use Statamic\Fieldtypes\Replicator;
use Statamic\Statamic;

/**
 * De ekstra indstillinger på replicator-, grid- og bard-felter.
 *
 * De lægges på Statamics EGNE klasser, ikke på addonets `Replicator`.
 * `appendConfigFields()` gemmer under `static::class`, så en registrering lagt
 * på addonets klasse ville forsvinde den dag den fil blev fjernet igen. Lagt her
 * læses de af {@see \MarioHamann\StatamicVisualEditor\Fieldtypes\Replicator}
 * gennem `extraConfigFieldItems()`, og de virker uændret uden den.
 *
 * Kaldes pr. CP-request fra {@see Http\Middleware\RegisterPanelVisibility},
 * samme sted som resten af addonets feltindstillinger. At registrere flere gange
 * er gratis: felterne flettes på nøgle.
 */
class ReplicatorSettings
{
    public static function register(): void
    {
        self::registerFromTheStartCountStyle();

        // Låsen giver kun mening de to steder der har rækker at låse — derfor
        // pr. fieldtype-klasse frem for på Fieldtype::class, som "Responsive".
        foreach ([Replicator::class, Grid::class] as $fieldtype) {
            $fieldtype::appendConfigFields([
                'locked_rows' => [
                    'display' => __('sve::messages.field_locked_rows'),
                    'instructions' => __('sve::messages.field_locked_rows_instructions'),
                    'type' => 'toggle',
                    'default' => false,
                    'width' => 50,
                ],
            ]);
        }

        // Kun replicator. Grid har ingen sets at skelne imellem, og bards sets
        // tilføjes gennem editorens egen menu, som ikke er den vælger JS'en
        // kender — fluebenet ville stå der og ikke gøre noget.
        Replicator::appendConfigFields([
            'unique_sets' => [
                'display' => __('sve::messages.field_unique_sets'),
                'instructions' => __('sve::messages.field_unique_sets_instructions'),
                'type' => 'unique_sets',
                'full_width_setting' => true,
            ],
            // Handle er Statamics egen `default` — afkrydsningen SKRIVER de
            // rækker man ellers skulle taste i YAML. Type er felttypen her,
            // ikke en tekstboks.
            'default' => [
                'display' => __('sve::messages.field_from_the_start'),
                'instructions' => __('sve::messages.field_from_the_start_sets_instructions'),
                'type' => 'default_sets',
                'full_width_setting' => true,
            ],
        ]);

        // Bard arver ikke replicatorens `default`-afkrydsning: dens default er
        // et ProseMirror-dokument (afsnit, overskrift), ikke en liste af sets.
        Bard::appendConfigFields([
            'default' => [
                'display' => __('sve::messages.field_from_the_start'),
                'instructions' => __('sve::messages.field_from_the_start_bard_instructions'),
                'type' => 'bard_default',
                'full_width_setting' => true,
            ],
        ]);
    }

    /**
     * Kun `.sve-from-the-start-count`. Inline i CP-HTML, så addon.css-cachen
     * og `input-text` ikke kan skjule størrelse og baggrund.
     */
    private static function registerFromTheStartCountStyle(): void
    {
        $css = <<<'CSS'
.sve-from-the-start-count.input-text{width:2.75rem!important;height:1.5rem!important;min-height:1.5rem!important;padding:0 0 0 .4rem!important;font-size:13px!important;line-height:1.5rem!important;background-color:#2e2e33!important;border:1px solid #3a3a40!important;color:inherit!important;box-sizing:border-box!important;border-radius:3px!important;overflow:hidden!important;position:relative!important}
.sve-from-the-start-count::-webkit-inner-spin-button,.sve-from-the-start-count::-webkit-outer-spin-button{-webkit-appearance:inner-spin-button!important;opacity:1!important;margin:0!important;height:1.5rem!important;width:14px!important;position:absolute!important;top:0!important;right:0!important;bottom:0!important}
CSS;

        $json = json_encode($css, JSON_THROW_ON_ERROR);

        Statamic::inlineScript(<<<JS
(function () {
    var el = document.getElementById('sve-from-the-start-count-css');
    if (!el) {
        el = document.createElement('style');
        el.id = 'sve-from-the-start-count-css';
        document.documentElement.appendChild(el);
    }
    el.textContent = {$json};
})();
JS);
    }
}
