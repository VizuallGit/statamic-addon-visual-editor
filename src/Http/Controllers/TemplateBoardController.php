<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use MarioHamann\StatamicVisualEditor\CollectionViewTemplates;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\TemplateBoard;
use Statamic\Contracts\Entries\Collection as CollectionContract;
use Statamic\Facades\Collection;
use Statamic\Facades\Taxonomy;
use Statamic\Facades\User;

/**
 * The Templates board: read the rows, and fill one empty slot.
 *
 * Creating is deliberately the smaller half. Statamic's own Scaffold Views and
 * the collection presets both already write these files, and both show up here
 * on their own because the board reads the views folder. This exists so an
 * empty slot is not a dead end — not to become a third way of scaffolding.
 */
class TemplateBoardController extends Controller
{
    public function index()
    {
        abort_unless(User::current(), 403);
        abort_unless(Features::allows('collection_templates'), 404);

        return response()->json(TemplateBoard::rows());
    }

    public function store(Request $request)
    {
        abort_unless(User::current(), 403);
        abort_unless(Features::allows('collection_templates'), 404);
        abort_unless(User::current()->can('store', CollectionContract::class), 403);

        $handle = (string) $request->input('handle', '');
        $slot = (string) $request->input('slot', '');

        [$view, $title] = $this->target($handle, $slot);

        abort_unless($view !== null, 404);

        // Already there — say so rather than writing over someone's template.
        if (TemplateBoard::viewFile($view) !== null) {
            return response()->json(['ok' => false, 'reason' => 'exists', 'view' => $view], 409);
        }

        $this->write($view, $handle, $slot);

        // A collection's or taxonomy's template also needs the CP row, so Live
        // Preview has something to open. `ensure` is idempotent and keeps the
        // one-index-one-show rule; the site's own views are not a source's, so
        // they get no row.
        $entry = in_array($slot, TemplateBoard::SOURCE_SLOTS, true)
            ? CollectionViewTemplates::ensure($handle, $slot, $view, $title)
            : null;

        return response()->json([
            'ok' => true,
            'view' => $view,
            'file' => TemplateBoard::viewFile($view),
            'entry' => $entry?->id(),
            'edit' => $entry?->editUrl(),
        ]);
    }

    /**
     * Which file this slot means, and what to call its row.
     *
     * Only a slot the board itself drew: the site's fixed list, or index/show
     * on a source that exists. Anything else is a request for a file nobody
     * asked the board about, and gets a 404 rather than a new view.
     *
     * @return array{0: ?string, 1: string}
     */
    protected function target(string $handle, string $slot): array
    {
        if ($handle === '_site') {
            $view = TemplateBoard::SITE_SLOTS[$slot] ?? null;

            return [$view, $slot];
        }

        if (! in_array($slot, TemplateBoard::SOURCE_SLOTS, true)) {
            return [null, ''];
        }

        $source = Collection::findByHandle($handle) ?: Taxonomy::findByHandle($handle);

        if (! $source) {
            return [null, ''];
        }

        $view = TemplateBoard::viewPath($handle, $slot);

        return [TemplateBoard::safeView($view) ? $view : null, $source->title()];
    }

    /**
     * A starting point, not a design.
     *
     * Enough that the slot renders something the moment it is opened in Live
     * Preview — an empty file renders an empty page, and an empty page reads
     * as a broken editor rather than a new template.
     */
    protected function write(string $view, string $handle, string $slot): void
    {
        $path = resource_path('views/'.$view.'.antlers.html');

        @mkdir(dirname($path), 0755, true);

        file_put_contents($path, $this->starter($handle, $slot));
    }

    protected function starter(string $handle, string $slot): string
    {
        if ($slot === 'index') {
            return "{{ collection:{$handle} }}\n"
                ."    <article>\n"
                ."        <h2><a href=\"{{ url }}\">{{ title }}</a></h2>\n"
                ."    </article>\n"
                ."{{ /collection:{$handle} }}\n";
        }

        if ($slot === 'show') {
            return "<article>\n    <h1>{{ title }}</h1>\n\n    {{ content }}\n</article>\n";
        }

        return "<h1>{{ title }}</h1>\n";
    }
}
