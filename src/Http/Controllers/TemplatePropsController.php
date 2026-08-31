<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\SectionTemplate;
use MarioHamann\StatamicVisualEditor\TemplateProps;
use Statamic\Facades\User;

/**
 * The `:name ?? …` bindings currently in a section template.
 *
 * The template is the source. The sidebar asks here so a rename in the
 * file shows up without a new fieldtype per handle.
 */
class TemplatePropsController
{
    public function __invoke(Request $request)
    {
        abort_unless(User::current(), 403);

        $type = (string) $request->query('type', '');

        abort_unless($type !== '' && SectionTemplate::path($type), 404);

        return response()->json(TemplateProps::payloadForType($type));
    }
}
