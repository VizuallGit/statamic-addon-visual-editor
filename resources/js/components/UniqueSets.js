/**
 * "Kun én af hver" i replicator-felter.
 *
 * Afkrydsningen på feltets indstillinger sætter `unique_sets` i blueprintet — en
 * liste af set-handles (se app/Fieldtypes/UniqueSets.php). Ligger en af de typer
 * allerede i listen, står den ikke længere i "Tilføj"-vælgeren, og den kommer
 * først igen når rækken er slettet.
 *
 * ── Hvordan ───────────────────────────────────────────────────────────────────
 *
 * Statamic registrerer sin set-vælger som en helt almindelig global komponent,
 * `set-picker`, og `Statamic.configuring()` kører EFTER at den er meldt ind. Så
 * kan den udvides: vi henter originalen, arver den med `extends`, og lader de to
 * computeds der bestemmer menuens indhold køre originalen igennem først og
 * derefter sortere de brugte typer fra.
 *
 * Det er kilden, ikke resultatet. Søgefeltet, piletasterne, "ingen resultater",
 * liste- og gittervisning følger med af sig selv, fordi de alle sammen læser de
 * samme to lister. Et tidligere forsøg skjulte punkterne i DOM'en bagefter, og
 * det var både skrøbeligt og forkert: menuen er portaleret ud af feltet, et
 * skjult punkt tæller stadig med når man går ned gennem listen med piletasterne,
 * og i visual editorens panel blev den slet ikke fundet.
 *
 * ── To ting der IKKE virker ───────────────────────────────────────────────────
 *
 * 1. Sætte `hide` på selve sættene. Vælgeren filtrerer ganske rigtigt på det,
 *    men `setConfigs` returnerer de SAMME objekter som feltets `config.sets` —
 *    de er ikke kopieret. To hero-blokke på samme side deler altså config, og en
 *    brugt blok i den ene ville forsvinde i den anden.
 *
 * 2. At lede efter feltet med `config.fields` som stopklods. Et sets egen
 *    komponent har også en config, og den har `fields` — så "+"-knappen mellem
 *    to rækker fandt aldrig sit felt. Feltet findes nu på at dets `setConfigs`
 *    ER den liste vælgeren har fået (se ownerField).
 *
 * Alt fejler åbent: kan originalen ikke hentes, eller kan feltet ikke findes,
 * sker der ingenting. Et replicator-felt der ikke kan tilføje rækker er værre
 * end et der kan tilføje en for meget.
 */

const CONFIG_KEY = 'unique_sets';

/** Sættes på hele vælgeren når der ikke er en eneste type tilbage at tilføje. */
const PICKER_ATTR = 'data-set-picker-exhausted';

/** Replicator-vm'er hvis `addSet` allerede har fået spærren på. */
const guarded = new WeakSet();

/** CP'ets oversættelse af en nøgle — `__` er global i Statamics build. */
function translate(key) {
    return typeof window.__ === 'function' ? window.__(key) : key;
}

/** Feltets rod-element. Er komponenten et fragment, er `$el` ikke et element. */
function rootElement(vm) {
    const el = vm.$el;

    if (el?.nodeType === Node.ELEMENT_NODE) return el;

    return el?.parentElement ?? null;
}

/**
 * Er komponenten Statamics vælger til at tilføje et set?
 *
 * Den optræder både som knappen under rækkerne og som "+" mellem dem, og har
 * ingen klasse at kende den på — men props'ene er unikke. Samme prøve som i
 * LockedRows.js.
 */
function isSetPicker(vm) {
    const props = vm.$props;

    return !!props && 'variant' in props && 'showConnector' in props && 'loadingSet' in props;
}

/**
 * Replicator-feltet en vælger tilføjer til.
 *
 * Kendetegnet er ikke hvor knappen står, men hvad den har fået: vælgerens
 * `sets`-prop ER feltets `setConfigs`, samme array. Den prøve kan ikke tage fejl
 * af et felt der ligger uden om et andet, og den holder uanset om knappen er
 * givet videre gennem en slot eller flyttet af visual editorens panel.
 *
 * Slår identiteten fejl — Vue kan have regnet listen om siden — tages den
 * nærmeste forfader der overhovedet er et replicator-felt.
 */
function ownerField(vm) {
    const sets = vm.$props?.sets;
    let fallback = null;

    for (let parent = vm.$parent; parent; parent = parent.$parent) {
        if (!parent.config?.sets || !Array.isArray(parent.value)) continue;

        if (sets && parent.setConfigs === sets) return parent;

        if (!fallback) fallback = parent;
    }

    return fallback;
}

/** De typer feltet siger kun må optræde én gang. */
function uniqueHandles(field) {
    const handles = field?.config?.[CONFIG_KEY];

    return Array.isArray(handles) ? handles : [];
}

/**
 * De typer der er brugt op — krydset af som "kun én", og allerede i listen.
 *
 * Kun feltets egne rækker tælles. Rækker i et indre replicator-felt ligger i
 * DETS `value` og kan ikke forveksles med disse.
 */
function blockedHandles(field) {
    const unique = uniqueHandles(field);

    if (!unique.length) return [];

    const rows = Array.isArray(field.value) ? field.value : [];
    const used = new Set(rows.map(row => row?.type).filter(Boolean));

    return unique.filter(handle => used.has(handle));
}

/** De typer denne vælger skal holde tilbage. */
function blockedForPicker(vm) {
    const field = ownerField(vm);

    return field ? blockedHandles(field) : [];
}

/** Navnet på et set, som det står i menuen. */
function setDisplay(field, handle) {
    for (const group of field?.config?.sets ?? []) {
        const set = (group?.sets ?? []).find(s => s?.handle === handle);

        if (set) return translate(set.display || set.handle);
    }

    return handle;
}

/**
 * Udvider Statamics set-vælger, så den ikke tilbyder det der er brugt op.
 *
 * `visibleSets` er listevisningens kilde, `groupedItems` gittervisningens — de
 * to læser ikke hinanden, så begge skal filtreres. Originalen kaldes først, så
 * søgning og gruppevalg er klaret inden vi rører noget.
 */
function extendSetPicker() {
    const picker = Statamic.$app.component('set-picker');

    const superVisibleSets = picker?.computed?.visibleSets;
    const superGroupedItems = picker?.computed?.groupedItems;

    if (typeof superVisibleSets !== 'function' || typeof superGroupedItems !== 'function') {
        console.warn('[unique-sets] set-picker ser anderledes ud end forventet — "kun én af hver" filtrerer ikke menuen');

        return;
    }

    if (picker.__uniqueSets) return;

    picker.__uniqueSets = true;

    // De to computeds byttes PÅ selve komponenten — der registreres ikke en ny.
    //
    // Replicatoren slår ikke vælgeren op på navn; den importerer den direkte, så
    // en ny `set-picker`-registrering ville stå ubrugt hen. Men det er det samme
    // objekt der er meldt ind globalt, så retter man i det, rammer det begge veje.
    //
    // Det skal ske i `configuring()` og ikke senere: Vue fletter en komponents
    // options én gang og gemmer resultatet, og et globalt mixin gør netop det.
    // Her er ingen instanser lavet endnu, så flettingen ser den rigtige udgave.
    picker.computed.visibleSets = function () {
        const sets = superVisibleSets.call(this);
        const blocked = blockedForPicker(this);

        if (!blocked.length || !Array.isArray(sets)) return sets;

        return sets.filter(set => !blocked.includes(set?.handle));
    };

    picker.computed.groupedItems = function () {
        const groups = superGroupedItems.call(this);
        const blocked = blockedForPicker(this);

        if (!blocked.length || !groups) return groups;

        return Object.fromEntries(
            Object.entries(groups).map(([key, group]) => [
                key,
                {
                    ...group,
                    items: (group?.items ?? []).filter(set => !blocked.includes(set?.handle)),
                },
            ])
        );
    };
}

/**
 * Spærre: en tilføj-knap indeholder hverken rækker eller felter.
 *
 * Skjulningen er `display: none`, så rammer den forkert, forsvinder feltet. I
 * visual editorens panel er søskenderækkerne allerede skjult, så en indpakning
 * dér kan bestå af felter alene — derfor tælles de med. Samme prøve som i
 * LockedRows.js, og af samme grund.
 */
function safeToHide(el) {
    return !el.querySelector('[data-replicator-set], [data-grid-row]')
        && !el.querySelector('.publish-fields, [class*="-fieldtype"], input, textarea, select');
}

/** Alle de typer vælgeren overhovedet kan tilbyde. */
function offeredHandles(vm) {
    return (vm.$props?.sets ?? [])
        .flatMap(group => (group?.sets ?? []))
        .filter(set => set && !set.hide)
        .map(set => set.handle);
}

/**
 * Er der intet tilbage at tilføje, skjules hele knappen.
 *
 * Ellers stod der en "Tilføj"-knap der åbnede en tom menu. Kun når hver eneste
 * type er brugt op — er der bare én tilbage, bliver knappen stående.
 */
function applyToPicker(vm, blocked) {
    const root = rootElement(vm);

    if (!root) return;

    const offered = offeredHandles(vm);
    const exhausted = offered.length > 0 && offered.every(handle => blocked.includes(handle));

    if (exhausted && !safeToHide(root)) return;

    root.toggleAttribute(PICKER_ATTR, exhausted);

    if (exhausted) {
        root.style.setProperty('display', 'none', 'important');
    } else {
        root.style.removeProperty('display');
    }
}

/**
 * Sidste spærre: replicatoren siger nej til en type der er brugt op.
 *
 * Den skulle helst aldrig komme i brug — menuen tilbyder ikke længere typen, så
 * der er ikke noget at klikke på. Den står der for data der kommer ad andre veje
 * ind i formularen, og for den dag Statamic laver sin vælger om.
 *
 * Metoden byttes på selve instansen. Går det ikke, beholder vi den vi har.
 */
function guardAddSet(field) {
    if (guarded.has(field)) return;

    const original = field.addSet;

    if (typeof original !== 'function') return;

    guarded.add(field);

    try {
        // Alle argumenter gives videre som de kom. "+" mellem to rækker sender et
        // andet sted end knappen nederst — skrev vi dem af én for én, ville en ny
        // blok lande i bunden hver gang.
        field.addSet = function (...args) {
            const handle = args[0];

            if (blockedHandles(field).includes(handle)) {
                window.Statamic?.$toast?.error?.(
                    `"${setDisplay(field, handle)}" kan kun tilføjes én gang.`
                );

                return;
            }

            return original.apply(this, args);
        };
    } catch {
        // Kan metoden ikke byttes, er filtreringen af menuen alene om det.
    }
}

function stamp(vm) {
    if (vm.config?.sets && uniqueHandles(vm).length) guardAddSet(vm);

    if (!isSetPicker(vm)) return;

    const field = ownerField(vm);

    if (!field || !uniqueHandles(field).length) return;

    applyToPicker(vm, blockedHandles(field));
}

Statamic.configuring(() => {
    extendSetPicker();

    Statamic.$app.mixin({
        mounted() { stamp(this); },
        updated() { stamp(this); },
    });
});
