<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Breakpoints;
use MarioHamann\StatamicVisualEditor\Breakpoints\Store;
use Statamic\Facades\User;

/**
 * Live Preview's «+» beside the size buttons (resources/js/breakpoint-add.js):
 * one more screen size, or one fewer, saved into the addon's settings
 * through {@see Store}. Both answer with the whole list as the browser
 * reads it, so the row of buttons, the CSS panel's tabs and the overview
 * redraw from the same answer the next page load would get.
 */
class BreakpointsController
{
    public function store(Request $request)
    {
        $this->authorize();

        return $this->list(Store::add($request->all()));
    }

    public function destroy(string $handle)
    {
        $this->authorize();

        return $this->list(Store::remove($handle));
    }

    protected function authorize(): void
    {
        abort_unless(User::current(), 403);
        abort_unless(Store::editable(), 403);
    }

    /**
     * The same two things ControlPanelScript and LivePreviewConfig hand a
     * fresh page: the list, and Statamic's device map the frame is sized by.
     *
     * @param  array<int, array<string, mixed>>  $breakpoints
     */
    protected function list(array $breakpoints)
    {
        return response()->json([
            'breakpoints' => $breakpoints,
            'devices' => Breakpoints::devices(),
        ]);
    }
}
