{{--
    Everything below the paragraph is mounted by resources/js/file-manager.js
    into the div. The paragraph is server-rendered so the page says what it is,
    and which folder it can reach, before the bundle has booted.
--}}
<div>
    <p class="text-gray mb-4">{{ __('sve::messages.files_intro') }}</p>

    <div id="sve-files-utility"></div>
</div>
