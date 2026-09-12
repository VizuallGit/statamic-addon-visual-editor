/**
 * En klasse skrevet uden for scopet skal flyttes ind — men kun når det er sikkert.
 */
import { moveClassesIntoScope, canMoveIntoScope, strayClassRules } from '../resources/js/css-scope-move.js';

let fails = 0;
const is = (got, want, what) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) { fails += 1; console.log('FEJL', what, '\n  fik: ', JSON.stringify(got), '\n  vil: ', JSON.stringify(want)); }
  else console.log('ok  ', what);
};

const HTML = '<section id="id-{{ id }}" class="[ {{ _class }} ] wrapper">';
const SCOPE = '{{ _class }}';

const css = `#id-{{ id }} {
    --color-bg: {{ bg_color }};
}

@scope(.{{ _class }}) {
    :scope {
        background: var(--color-bg);
    }
}

.card {
    padding: 1rem;

    .title {
        font-size: 2rem;
    }
}`;

is(strayClassRules(css).map((r) => r.name), ['card'], 'kun .card står forkert');
is(canMoveIntoScope(css, HTML, SCOPE), true, 'sikkert at flytte');

const moved = moveClassesIntoScope(css, HTML, SCOPE);
is(/@scope\(\.\{\{ _class \}\}\) \{[\s\S]*\.card \{/.test(moved), true, '.card ligger nu inde i scopet');
is(/\}\s*$/.test(moved.trim()), true, 'filen slutter stadig med en lukket klamme');
is([...moved].reduce((n, c) => n + (c === '{') - (c === '}'), 0), 0, 'klammerne går op');
is(moved.includes('.title'), true, 'de nestede klasser kom med');
is(moved.indexOf('.card') > moved.indexOf('@scope'), true, '.card står efter @scope, ikke før');
is((moved.match(/\.card \{/g) || []).length, 1, 'og kun én gang');

// --- sikkerhedsreglerne -----------------------------------------------------
is(canMoveIntoScope(css, '<section class="wrapper">', SCOPE), false,
   'ingen scope-klasse i markup → rør ikke');
is(moveClassesIntoScope(css, '<section class="wrapper">', SCOPE), css,
   'og teksten er uændret');

const noScope = `.card { padding: 1rem; }`;
is(moveClassesIntoScope(noScope, HTML, SCOPE), noScope, 'ingen @scope at flytte ind i → rør ikke');

const twoScopes = `@scope(.a) { :scope { color: red } }\n@scope(.b) { :scope { color: blue } }\n.card { padding: 0 }`;
is(moveClassesIntoScope(twoScopes, HTML, SCOPE), twoScopes, 'to scopes → for tvetydigt, rør ikke');

// En selector bygget med Antlers er bevidst global — rør den ikke.
const dynamic = `@scope(.{{ _class }}) { :scope { color: red } }
.gallery-lb-{{ id }} {
    position: fixed;
}
.gallery-lb-{{ id }} img {
    width: 100%;
}`;
is(strayClassRules(dynamic).map((r) => r.name), [], 'Antlers i selectoren = ikke vores at flytte');
is(moveClassesIntoScope(dynamic, HTML, SCOPE), dynamic, 'og filen er urørt');

// --- hvad der IKKE er en løs klasse ----------------------------------------
const keep = `@scope(.{{ _class }}) { :scope { color: red } }
:root { --x: 1 }
html { font-size: 100% }
.a .b { color: red }
a:hover { color: blue }
@media (width < 48em) { .c { color: red } }`;
is(strayClassRules(keep).map((r) => r.name), [], 'root, html, efterkommere, pseudo og media er ikke løse klasser');
is(moveClassesIntoScope(keep, HTML, SCOPE), keep, 'og intet af det flyttes');

console.log(fails ? `\n${fails} FEJL` : '\nAlt grønt');
process.exit(fails ? 1 : 0);
