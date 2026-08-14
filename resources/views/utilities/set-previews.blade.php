@php
    $results = session('sve_preview_results');

    // Status → [label, badge classes]. Anything that isn't "current" reads as a
    // warning rather than an error: a stale preview is a picture that is about to
    // be retaken, not something broken.
    $badges = [
        'fresh' => [__('sve::messages.previews_status_fresh'), 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'],
        'stale' => [__('sve::messages.previews_status_stale'), 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200'],
        'missing' => [__('sve::messages.previews_status_missing'), 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'],
        'no_source' => [__('sve::messages.previews_status_no_source'), 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'],
        'renders_nothing' => [__('sve::messages.previews_status_renders_nothing'), 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'],
        'excluded' => [__('sve::messages.previews_status_excluded'), 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'],
    ];

    $sources = [
        'defaults' => __('sve::messages.previews_source_defaults'),
        'instance' => __('sve::messages.previews_source_instance'),
        'override' => __('sve::messages.previews_source_override'),
        'global' => __('sve::messages.previews_source_global'),
    ];
@endphp

<div class="max-w-4xl">
    <p class="text-gray mb-3">{{ __('sve::messages.previews_intro') }}</p>

    <p class="text-gray text-sm mb-6">
        {!! __('sve::messages.previews_build_note', ['command' => '<code>npm run dev:previews</code>']) !!}
    </p>

    @if ($problem)
        <div class="mb-6 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 p-4">
            <p class="text-sm text-red-700 dark:text-red-200">{{ $problem }}</p>
        </div>
    @endif

    @if ($running)
        <div class="mb-6 rounded-lg border border-blue-300 bg-blue-50 dark:bg-blue-900/20 p-4">
            <p class="text-sm text-blue-700 dark:text-blue-200">{{ __('sve::messages.previews_running') }}</p>
        </div>
    @endif

    @if ($results)
        <div class="mb-6 rounded-lg border p-4 {{ $results['ok'] ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' }}">
            <p class="font-medium mb-2 {{ $results['ok'] ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300' }}">
                {{ $results['ok'] ? __('sve::messages.previews_ran') : __('sve::messages.previews_failed') }}
            </p>
            @if ($results['output'])
                <pre class="text-xs text-gray whitespace-pre-wrap overflow-x-auto">{{ $results['output'] }}</pre>
            @endif
        </div>
    @endif

    <div class="flex flex-wrap items-center gap-3">
        <form method="POST" action="{{ route('statamic.cp.utilities.set-previews.generate') }}">
            @csrf
            <button type="submit"
                class="inline-flex items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow">
                {{ __('sve::messages.previews_generate') }}
            </button>
        </form>

        <form method="POST" action="{{ route('statamic.cp.utilities.set-previews.generate') }}">
            @csrf
            <input type="hidden" name="force" value="1">
            <button type="submit"
                class="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                {{ __('sve::messages.previews_generate_force') }}
            </button>
        </form>
    </div>

    @foreach ([
        'previews_types' => $types,
        'previews_sections' => $sections,
        'previews_templates' => $templates,
    ] as $heading => $rows)
        <div class="mt-8">
            <h3 class="text-sm font-medium text-gray mb-3">
                {{ __('sve::messages.'.$heading) }} ({{ count($rows) }})
            </h3>

            @if (empty($rows))
                <p class="text-sm text-gray">{{ __('sve::messages.previews_none') }}</p>
            @else
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    @foreach ($rows as $row)
                        @php([$label, $badge] = $badges[$row['status']] ?? [$row['status'], $badges['missing'][1]])
                        <div class="rounded-lg border overflow-hidden bg-gray-100 dark:bg-gray-900">
                            <div class="aspect-video bg-white dark:bg-gray-950 flex items-center justify-center">
                                @if ($row['url'])
                                    <img src="{{ $row['url'] }}" alt="{{ $row['name'] }}" class="w-full h-full object-cover object-top block">
                                @else
                                    <span class="text-xs text-gray">{{ __('sve::messages.previews_status_missing') }}</span>
                                @endif
                            </div>
                            <div class="px-2 py-2 space-y-1">
                                <div class="text-xs text-gray truncate" title="{{ $row['name'] }}">
                                    @if ($row['edit_url'] ?? null)
                                        <a href="{{ $row['edit_url'] }}" class="text-blue hover:underline">{{ $row['name'] }}</a>
                                    @else
                                        {{ $row['name'] }}
                                    @endif
                                </div>
                                <div class="flex flex-wrap items-center gap-1">
                                    <span class="inline-block rounded px-1.5 py-0.5 text-[0.65rem] font-medium {{ $badge }}">{{ $label }}</span>
                                    @if ($row['source'] && isset($sources[$row['source']]))
                                        <span class="text-[0.65rem] text-gray">{{ $sources[$row['source']] }}</span>
                                    @endif
                                </div>
                                @if ($row['status'] === 'no_source')
                                    <p class="text-[0.65rem] text-gray leading-snug">{{ __('sve::messages.previews_no_source_help') }}</p>
                                @elseif ($row['status'] === 'renders_nothing')
                                    <p class="text-[0.65rem] text-gray leading-snug">{{ __('sve::messages.previews_renders_nothing_help') }}</p>
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    @endforeach
</div>
