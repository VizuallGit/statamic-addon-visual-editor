/**
 * Låste rækker i replicator- og grid-felter.
 *
 * Fluebenet "Lås rækker" på feltets indstillinger sætter `locked_rows` i
 * blueprintet (se AppServiceProvider). Rækkerne kan stadig redigeres og skjules
 * med den blå kontakt — men de kan ikke flyttes, duplikeres eller slettes.
 *
 * Låsen er en rækværk, ikke en spærring: hængelåsen er en knap, og et klik tager
 * låsen af den ene række, så den kan flyttes og slettes som alle andre. Endnu et
 * klik sætter den på igen. Det gemmes ikke — låsen er på igen næste gang siden
 * åbnes, hvilket er den rigtige vej at fejle for et værn mod uheld.
 *
 * Statamics CP er bygget og minified, og en række tegner ikke sit felts config i
 * DOM'en. Derfor stemples rækkerne med `data-row-locked` fra et globalt mixin,
 * og cp.css tager sig af udseendet (skjult trækhåndtag + hængelås).
 *
 * "Duplicate Set"/"Delete Set" ligger i en dropdown der portales til <body>, og
 * kan derfor ikke rammes med CSS fra rækken. De fjernes i stedet fra menuen når
 * den åbnes fra en låst række.
 *
 * ── To ting må aldrig gøres her igen ──────────────────────────────────────────
 *
 * 1. Ingen `stopPropagation()` i capture-fasen på document. En sådan vagt slugte
 *    de klik visual editoren selv sender for at folde et sæt ud: et syntetisk
 *    `MouseEvent` har `clientX: 0`, så tjekket "er markøren henne ved låsen?"
 *    sagde ja til alt. Sættet blev aldrig foldet ud, felterne står bag `v-show`,
 *    og sidepanelet var tomt — men kun på låste sektioner. Lyt på det element det
 *    handler om, og kræv `e.isTrusted`.
 *
 * 2. Ingen indsættelse FØRST i en headers børn. Editoren finder foldeknappen som
 *    den første `button[type="button"]` under headeren; alt der lægger sig foran
 *    den, bliver klikket i stedet. Hængelåsen sættes bagest og flyttes på plads
 *    med `order` i cp.css.
 *
 * Låsen er ellers ens i den almindelige formular og i visual editorens sidepanel.
 * Den slår flyt og slet fra — intet andet. Felterne inde i en låst blok vises,
 * åbnes og redigeres præcis som i en ulåst.
 */

const CONFIG_KEY = 'locked_rows';
const LOCKED_ATTR = 'data-row-locked';

// Sættes på en række der er låst op ved et klik. `stamp()` kører igen ved hver
// Vue-opdatering, og uden et mærke at kende rækken på ville låsen smække i igen
// et øjeblik efter klikket.
const UNLOCKED_ATTR = 'data-row-unlocked';

// Selve hængelåsen. Den tegnes af cp.css, som også vælger ikonet ud fra om
// rækken er låst eller ej.
const TOGGLE_ATTR = 'data-row-lock-toggle';

// Sættes på hvert felt der har sets (replicator, bard, grid) — ikke for at låse
// dem, men for at kunne afgøre hvilket felt en "Tilføj"-knap hører til.
const FIELD_ATTR = 'data-repeatable-field';

// Sættes på hver "Tilføj"-vælger, og på dem der skal skjules fordi feltet er låst.
const PICKER_ATTR = 'data-set-picker';
const PICKER_LOCKED_ATTR = 'data-set-picker-locked';

// Replicator-sets, grid-rækker i tabelvisning og grid-rækker i stakket visning.
const ROW_SELECTOR = '[data-replicator-set], [data-grid-row], tr[class*="-sortable-item"]';

/** Menupunkter der fjernes. Slås op i CP'ets eget sprog, ikke hardcodet dansk. */
const BLOCKED_ITEMS = ['Delete Set', 'Duplicate Set', 'Delete Row', 'Duplicate Row'];

/**
 * Rækkerne der hører til netop dette felt.
 *
 * En låst replicator kan sagtens indeholde en almindelig replicator, og den
 * indre replicators rækker må ikke låses med. En række hører til feltet, hvis
 * der ikke ligger en anden række imellem den og feltets rod.
 */
function ownRows(root) {
    return Array.from(root.querySelectorAll(ROW_SELECTOR)).filter((row) => {
        const parentRow = row.parentElement?.closest(ROW_SELECTOR);

        return !parentRow || !root.contains(parentRow);
    });
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
 * ingen klasse eller data-attribut at kende den på — men props'ene er unikke.
 */
function isSetPicker(vm) {
    const props = vm.$props;

    // Knappen under rækkerne og "+" imellem dem er samme komponent. Kravet om
    // alle tre props er med vilje snævert: en bredere prøve rammer også den
    // komponent der omslutter hele feltet, og så forsvinder feltet.
    return !!props && 'variant' in props && 'showConnector' in props && 'loadingSet' in props;
}

/**
 * Spærre: en tilføj-knap indeholder hverken rækker eller felter.
 *
 * Skjulningen er `display: none`, så rammer den forkert, forsvinder hele feltet.
 *
 * Rækker alene var ikke nok. I visual editorens focus-panel er søskenderækkerne
 * allerede skjult, så indpakningen om den åbne blok indeholder kun *felter* — og
 * den slap igennem og blev skjult. Symptomet var et helt tomt sidepanel på
 * netop de sektioner der havde låsen slået til.
 */
function safeToHide(el) {
    return !el.querySelector(ROW_SELECTOR)
        && !el.querySelector('.publish-fields, [class*="-fieldtype"], input, textarea, select');
}

/**
 * Hører vælgeren til et låst felt?
 *
 * Svaret findes i komponenttræet, ikke i DOM'en. Knappen kan stå hvor som helst
 * — visual editorens panel flytter den, et set kan give den videre gennem en
 * slot, og feltets konfiguration bæres af flere elementer på én gang — men
 * forælder-kæden peger altid på det felt knappen tilføjer til. Første forælder
 * der selv er et felt med rækker, ejer den.
 */
function belongsToLockedField(vm) {
    for (let parent = vm.$parent; parent; parent = parent.$parent) {
        const config = parent.config;

        if (!config) continue;

        if (config[CONFIG_KEY] === true) return true;

        // Et andet felt ligger imellem: så er det dét felt der ejer knappen.
        if (config.sets || config.fields) return false;
    }

    return false;
}

/** Feltets egne "Tilføj"-vælgere i DOM'en — reserve, hvis træet ikke rakte. */
function ownPickers(root) {
    return Array.from(root.querySelectorAll(`[${PICKER_ATTR}]`))
        .filter(picker => !picker.closest(ROW_SELECTOR));
}

/**
 * Knapper der tilføjer et set, fundet på deres tekst.
 *
 * Vælger-komponenten genkendes normalt på sine props, men visual editorens panel
 * tegner sin egen "Add Set"-knap uden om den. Teksten hentes fra feltets eget
 * `button_label` og ellers CP'ets oversættelse, så det ikke er dansk hardcodet.
 */
function ownAddButtons(root, config) {
    // Både feltets eget label, CP'ets oversættelse og den engelske original:
    // panelet er ikke altid på samme sprog som resten af CP'et.
    const labels = new Set(
        [config.button_label, translate('Add Set'), 'Add Set']
            .filter(Boolean)
            .map(label => label.trim().toLowerCase())
    );

    return Array.from(root.querySelectorAll('button, [role="button"]'))
        .filter(el => !el.closest(ROW_SELECTOR))
        .filter(el => labels.has(el.textContent.trim().toLowerCase()));
}

/**
 * Elementet hængelåsen sætter sig i.
 *
 * Et replicator-set har en header; en grid-række har cellen hvor trækhåndtaget
 * ellers ville stå. Begge steder er det første plads i rækken, så låsen lander
 * hvor håndtaget var.
 */
function lockHost(row) {
    return row.querySelector(':scope > header')
        ?? row.querySelector(':scope > td[class*="drag-handle"]');
}

/** Rækken et element hører til — den nærmeste, ikke en låst forfader. */
function ownRow(el) {
    return el?.closest?.(ROW_SELECTOR) ?? null;
}

/** Feltet en række hører til — det felt hvis egne rækker den er en af. */
function fieldOf(row) {
    return row.parentElement?.closest(`[${FIELD_ATTR}]`) ?? null;
}

/** Hængelåsens titel, sat efter rækkens tilstand. */
function paintToggle(row) {
    const button = lockHost(row)?.querySelector(`:scope > [${TOGGLE_ATTR}]`);

    if (!button) return;

    const title = translate(row.hasAttribute(UNLOCKED_ATTR) ? 'Lock' : 'Unlock');

    if (button.title !== title) button.title = title;
}

/**
 * Låser op — eller i igen. Hele feltets rækker følger med.
 *
 * Låsen er en indstilling på FELTET: alle rækker i listen er låst af samme grund,
 * så de skal også kunne låses op af én grund. Det er samtidig det bloktræet i
 * visual editoren kan udtrykke — det kan kun aflæse de rækker der tilfældigvis er
 * tegnet i formularen netop nu, og smitter derfor ét fund ud til hele listen.
 * Låste man kun den ene række op, ville træet stadig kalde listen låst, og de to
 * steder ville sige hver sit om samme blok.
 */
function toggleRow(row) {
    const unlock = !row.hasAttribute(UNLOCKED_ATTR);
    const field = fieldOf(row);

    (field ? ownRows(field) : [row]).forEach((sibling) => {
        sibling.toggleAttribute(UNLOCKED_ATTR, unlock);
        sibling.toggleAttribute(LOCKED_ATTR, !unlock);
        paintToggle(sibling);
    });
}

/**
 * Hængelåsen som en rigtig knap.
 *
 * Låsen var før et `::before` på rækkens header, og et pseudo-element kan ikke
 * tage imod et klik for sig — klikket lander på headeren, som folder rækken ud.
 * Derfor et element der findes: det kan standse klikket, så rækken låses op
 * uden også at folde sig ud.
 *
 * Knappen sættes SIDST i headeren, ikke først, og flyttes på plads forrest med
 * `order` i cp.css. Rækkefølgen i DOM'en er ikke kosmetik her: visual editoren
 * finder et sets foldeknap som den første `button[type="button"]` der er direkte
 * barn af headeren, og en hængelås indsat før den blev valgt i stedet. Så klikkede
 * editoren på låsen når den ville folde sættet ud, sættet blev foldet sammen — og
 * dets felter, som kun er skjult med `v-show`, kom aldrig frem i sidepanelet.
 * Editorens egen "gå ind i"-pil sættes bagest af samme grund.
 */
function ensureToggle(row) {
    const host = lockHost(row);

    if (!host || host.querySelector(`:scope > [${TOGGLE_ATTR}]`)) return;

    const button = document.createElement('button');

    button.type = 'button';
    button.setAttribute(TOGGLE_ATTR, '');
    button.title = translate(row.hasAttribute(UNLOCKED_ATTR) ? 'Lock' : 'Unlock');

    button.addEventListener('click', (e) => {
        // Kun rigtige klik. Både Statamic og visual editoren folder sæt ud ved at
        // sende et `MouseEvent` afsted selv, og et svar på et af dem ville lukke
        // for den handling der var på vej.
        if (!e.isTrusted) return;

        e.preventDefault();
        e.stopPropagation();

        // Kun super admins tager låsen af — se mayUnlock().
        if (!mayUnlock()) return;

        toggleRow(row);
    });

    host.appendChild(button);
}

/**
 * Er elementet inde i visual editorens sidepanel?
 *
 * Skjulningen af "Tilføj"-knapper holder sig ude derfra. Panelet bygger felterne
 * om — søskenderækker skjules, indpakninger flyttes — så genkendelsen af en
 * "tilføj"-knap kan ikke gøres pålidelig dér, og en fejltagelse koster hele
 * panelets indhold. I den almindelige publish-formular er markup'en Statamics
 * egen og stabil.
 *
 * Kun skjulningen. Selve låsen — hængelåsen, det skjulte trækhåndtag, de
 * fjernede menupunkter — virker ens begge steder.
 */
function inVisualEditorPanel(el) {
    return !!el.closest?.('.live-preview-editor');
}

/**
 * Må den her bruger låse op?
 *
 * Låsen er et værn mod uheld for redaktører, ikke mod udvikleren der satte den.
 * Super admins kan tage den af; alle andre ser den som en kendsgerning om
 * rækken. Tjekket ligger her ét sted, så begge veje til oplåsning — knappen i
 * formularen og klikket i panelet — svarer ens.
 */
function mayUnlock() {
    return !!window.Statamic?.$permissions?.has?.('super');
}

function stamp(vm) {
    const root = rootElement(vm);

    if (!root) return;

    if (isSetPicker(vm)) {
        root.setAttribute(PICKER_ATTR, '');

        if (belongsToLockedField(vm) && safeToHide(root) && !inVisualEditorPanel(root)) {
            root.setAttribute(PICKER_LOCKED_ATTR, '');
        }
    }

    const config = vm.config;

    if (!config) return;

    // Alt der gentager rækker: replicator og bard har sets, grid har fields.
    // Markeringen låser ingenting; den gør bare feltet til en grænse, så en låst
    // replicator ikke skjuler "Tilføj" i de felter der ligger inde i rækkerne.
    //
    // Bevidst ingen kontrol af `vm.value` her: konfigurationen bæres af flere
    // komponenter omkring feltet, og ikke alle har rækkerne som en almindelig
    // array. Kræver man det, rammer låsen ingenting.
    if (config.sets || config.fields) root.setAttribute(FIELD_ATTR, '');

    if (config[CONFIG_KEY] !== true) return;

    root.setAttribute(FIELD_ATTR, '');

    ownRows(root).forEach((row) => {
        // En række der er låst op bliver stående låst op — se UNLOCKED_ATTR.
        // Det gælder også når det var bloktræet der låste op: træet skriver i de
        // samme to attributter, så de to steder deler én tilstand.
        if (!row.hasAttribute(UNLOCKED_ATTR)) row.setAttribute(LOCKED_ATTR, '');

        ensureToggle(row);
        paintToggle(row);
    });

    [...ownPickers(root), ...ownAddButtons(root, config)]
        .filter(safeToHide)
        .filter(el => !inVisualEditorPanel(el))
        .forEach(el => el.setAttribute(PICKER_LOCKED_ATTR, ''));
}

/** CP'ets oversættelse af en nøgle — `__` er global i Statamics build. */
function translate(key) {
    return typeof window.__ === 'function' ? window.__(key) : key;
}

/**
 * Fjerner "Duplicate"/"Delete" fra dropdown-menuer der åbnes fra en låst række.
 *
 * Menuen findes først i DOM'en efter klikket, så trigger'en huskes i capture-
 * fasen og menuen ryddes når den dukker op. Statamic bruger ét sæt data-ui-*
 * attributter til alle dropdowns, så både replicator og grid er dækket.
 */
function watchDropdowns() {
    let lockedTrigger = false;

    document.addEventListener('pointerdown', (e) => {
        const target = e.target instanceof Element ? e.target : null;

        // Den NÆRMESTE række, ikke en låst forfader. En låst blok må gerne rumme
        // almindelige rækker, og de skal stadig kunne dubleres og slettes —
        // spurgte man `closest('[data-row-locked]')`, ville de arve låsen.
        lockedTrigger = !!ownRow(target)?.hasAttribute(LOCKED_ATTR);
    }, true);

    const blocked = () => BLOCKED_ITEMS.map(translate);

    const prune = (content) => {
        if (!lockedTrigger) return;

        const labels = blocked();

        content.querySelectorAll('[data-ui-dropdown-item]').forEach((item) => {
            if (labels.includes(item.textContent.trim())) item.remove();
        });
    };

    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                if (node.matches('[data-ui-dropdown-content]')) prune(node);

                node.querySelectorAll?.('[data-ui-dropdown-content]').forEach(prune);
            }
        }
    }).observe(document.body, { childList: true, subtree: true });
}

Statamic.configuring(() => {
    Statamic.$app.mixin({
        mounted() { stamp(this); },
        updated() { stamp(this); },
    });
});

Statamic.booting(() => {
    watchDropdowns();
});
