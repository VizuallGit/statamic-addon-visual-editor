<?php

namespace MarioHamann\StatamicVisualEditor\Http\Controllers;

use Illuminate\Http\Request;
use MarioHamann\StatamicVisualEditor\Features;
use MarioHamann\StatamicVisualEditor\FileManager;

/**
 * Browse, edit, create and delete the site's own code files from the CP.
 *
 * Thin on purpose: every rule about which paths exist lives in FileManager, so
 * there is one place to read when asking "can this reach my server's files".
 * The settings toggle and its access rule both have to be on — off by default,
 * super admins only unless the site names someone.
 */
class FileManagerController
{
    public function index()
    {
        $this->authorize();

        return response()->json(FileManager::listing());
    }

    public function show(Request $request)
    {
        $this->authorize();

        $path = (string) $request->query('path', '');
        $found = FileManager::existingPath($path);

        abort_unless($found, 404);

        // Separate from "not there": a file too big to hand to a browser is a
        // real file, and the screen should say which of the two happened.
        abort_if(filesize($found) > FileManager::MAX_BYTES, 413);

        $file = FileManager::read($path);

        abort_unless($file, 404);

        return response()->json($file);
    }

    public function update(Request $request)
    {
        $this->authorize();

        $contents = $request->input('contents');

        abort_unless(is_string($contents), 422);
        abort_if(strlen($contents) > FileManager::MAX_BYTES, 413);

        $file = FileManager::write((string) $request->input('path', ''), $contents);

        abort_unless($file, 404);

        return response()->json($file);
    }

    public function store(Request $request)
    {
        $this->authorize();

        $file = FileManager::create((string) $request->input('path', ''));

        abort_unless($file, 422);

        return response()->json([
            ...$file,
            ...FileManager::listing(),
        ]);
    }

    public function storeFolder(Request $request)
    {
        $this->authorize();

        $folder = FileManager::createFolder((string) $request->input('path', ''));

        abort_unless($folder, 422);

        return response()->json([
            ...$folder,
            ...FileManager::listing(),
        ]);
    }

    public function destroy(Request $request)
    {
        $this->authorize();

        abort_unless(FileManager::delete((string) $request->input('path', '')), 404);

        return response()->json(FileManager::listing());
    }

    /** What a folder holds, so the browser can say so before it asks. */
    public function folder(Request $request)
    {
        $this->authorize();

        $stats = FileManager::folderStats((string) $request->query('path', ''));

        abort_unless($stats, 404);

        return response()->json($stats);
    }

    public function destroyFolder(Request $request)
    {
        $this->authorize();

        $path = (string) $request->input('path', '');

        abort_unless(FileManager::existingFolder($path), 404);

        // Refused rather than emptied: the folder holds something this screen
        // never showed. 409 so the browser can say why instead of "failed".
        abort_unless(FileManager::deleteFolder($path), 409);

        return response()->json(FileManager::listing());
    }

    protected function authorize(): void
    {
        abort_unless(Features::allows('file_manager'), 403);
    }
}
