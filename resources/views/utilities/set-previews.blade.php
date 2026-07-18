@php($results = session('sve_preview_results'))

<div class="max-w-2xl">
    <p class="text-gray mb-6">
        Regenererer preview-billederne til "Add Set"-pickeren ved at tage et screenshot af hver
        sektion, som den ser ud på sitet. Kør denne efter du har ændret styling. Kræver et
        browser-miljø (Node + chrome-headless-shell) på maskinen der kører den.
    </p>

    @if ($results)
        <div class="mb-6 rounded-lg border p-4 {{ empty($results['failed']) ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' }}">
            @if (!empty($results['ok']))
                <p class="font-medium text-green-700 dark:text-green-300 mb-1">
                    ✓ Regenereret: {{ implode(', ', $results['ok']) }}
                </p>
            @endif
            @if (!empty($results['failed']))
                <p class="text-sm text-yellow-700 dark:text-yellow-300">
                    Sprang over / fejlede: {{ implode(', ', $results['failed']) }}
                    <span class="text-gray">(mangler url/selector-mapping — sættes i config)</span>
                </p>
            @endif
        </div>
    @endif

    <form method="POST" action="{{ route('statamic.cp.utilities.set-previews.generate') }}">
        @csrf
        <button type="submit"
            class="inline-flex items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow">
            Regenerér alle preview-billeder
        </button>
    </form>

    @if (!empty($sets))
        <div class="mt-8">
            <h3 class="text-sm font-medium text-gray mb-3">Sektioner med preview-billede ({{ count($sets) }})</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                @foreach ($sets as $handle => $url)
                    <div class="rounded-lg border overflow-hidden bg-gray-100 dark:bg-gray-900">
                        <img src="{{ $url }}" alt="{{ $handle }}" class="w-full h-auto block">
                        <div class="px-2 py-1 text-xs text-gray truncate">{{ $handle }}</div>
                    </div>
                @endforeach
            </div>
        </div>
    @endif
</div>
