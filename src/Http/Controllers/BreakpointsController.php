<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Breakpoints;
use MarioHamann\StatamicVisualEditor\Breakpoints\Store;
use Statamic\Facades\User;

/**
 * Live Preview's «+» beside the size buttons (resources/js/breakpoint-add.js):
 * one more screen size, saved into the addon's settings through
 * {@see Store}. Returns the whole list as the browser reads it, so the row
 * of buttons, the CSS panel's tabs and the overview redraw from the same
 * answer the next page load would get.
 */
class BreakpointsController
{
    public function store(Request $request)
    {
        abort_unless(User::current(), 403);
        abort_unless(Store::editable(), 403);

        $breakpoints = Store::add($request->all());

        // The same two things ControlPanelScript and LivePreviewConfig hand a
        // fresh page: the list, and Statamic's device map the frame is sized by.
        return response()->json([
            'breakpoints' => $breakpoints,
            'devices' => Breakpoints::devices(),
        ]);
    }
}
