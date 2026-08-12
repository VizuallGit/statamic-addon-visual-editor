/**
 * Én åben sektion ad gangen.
 *
 * Statamic kan folde en blueprint-sektion (`collapsible: true`), men kender kun
 * den enkelte sektion: åbner man tre, står tre åbne. I et smalt panel er det
 * netop det man ville undgå ved at folde dem.
 *
 * Foldetilstanden ligger i Vues egen sektions-state, ikke i DOM'en, og der er
 * ingen vej derind udefra. Til gengæld stempler Statamic beholderen med
 * `--collapsed`/`--expanded`, og overskriftens knap er den ene ting der kan
 * vende tilstanden. Så: se hvem der står åben, og tryk på deres knap.
 *
 * Alt genkendes på struktur, ikke på klassenavne. Kortet er det eneste element
 * med en foldebeholder som direkte barn, og overskriften er beholderens nabo
 * ovenfor. Det er med vilje: der findes en `.publish-section-header`-klasse i
 * Statamics stylesheet, men den sidder ikke på elementet i denne version, og en
 * tidligere udgave af filen her hang på netop den — og gjorde derfor ingenting.
 *
 * Rækkevidden følger af sig selv: der lukkes kun blandt kortets egne søskende,
 * og hver fane har sin egen beholder om sine sektioner. En harmonika under
 * Colors rører derfor ikke noget under Sizes eller Typography.
 */
(function () {
    'use strict';

    const BODY = '.publish-section-collapsible';
    const CARD = ':has(> ' + BODY + ')';
    const OPEN = 'publish-section-collapsible--expanded';
    const SHUT = 'publish-section-collapsible--collapsed';

    // De klik vi selv sender, må ikke starte en ny runde.
    let closing = false;

    /** Sektionens foldebeholder. */
    function bodyOf(card) {
        return card.querySelector(':scope > ' + BODY);
    }

    /**
     * Foldeknappen. Overskriften står lige før beholderen, og knappen findes kun
     * i den, når sektionen kan foldes — en sektion der ikke kan, har ingen knap
     * at trykke på og bliver stående som den er.
     */
    function toggleOf(body) {
        return body.previousElementSibling?.querySelector('button') ?? null;
    }

    document.addEventListener(
        'click',
        (e) => {
            if (closing) return;

            // Klik nede i felterne er ikke et klik på overskriften. Overskriften
            // ligger uden for beholderen, så det her skiller de to fra hinanden
            // uden at skulle kende overskriftens markup.
            if (e.target.closest(BODY)) return;

            const card = e.target.closest(CARD);
            const body = card && bodyOf(card);

            // Kun når en foldet sektion åbnes. Lukker man en, sker der intet —
            // ellers ville automatikken lukke noget man lige havde åbnet.
            if (!body || !body.classList.contains(SHUT)) return;

            requestAnimationFrame(() => {
                closing = true;
                try {
                    [...(card.parentElement?.children ?? [])].forEach((sibling) => {
                        if (sibling === card) return;

                        const other = bodyOf(sibling);
                        if (!other || !other.classList.contains(OPEN)) return;

                        toggleOf(other)?.click();
                    });
                } finally {
                    closing = false;
                }
            });
        },
        true
    );
}());
