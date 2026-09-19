<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\SectionTypeMaker\Names;
use MarioHamann\StatamicVisualEditor\StaticSection;
use Statamic\Facades\User;

/**
 * Making a static section: a partial of its own, called from the page's
 * template. Gated like making a section type — this writes files into the
 * repository and edits the template every page renders through.
 */
class StaticSectionsController
{
    public function store(Request $request)
    {
        abort_unless(User::current()?->can('configure fields'), 403);

        $display = trim((string) $request->input('display', ''));
        $template = trim((string) $request->input('template', ''));

        abort_if($display === '' || $template === '', 400);

        if (Names::slug($display) === null) {
            return response()->json(['error' => 'bad_name'], 422);
        }

        $made = StaticSection::create(mb_substr($display, 0, 60), $template);

        if ($made === null) {
            return response()->json(['error' => 'failed'], 422);
        }

        return response()->json(['ok' => true, 'section' => $made]);
    }
}
