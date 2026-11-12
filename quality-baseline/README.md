# Quality baselines

The quality gate (`scripts/quality.mjs`) compares every run with the files in
this folder. They hold the findings that existed on 12 November 2026, when the
gate was switched on (quality pass, phase 1). Old findings may stay; anything
new fails. The numbers may only go down.

| Command | Runs |
|---|---|
| `npm run quality` | ESLint, Prettier, Knip, jscpd, big files, silent catches, chunk budgets |
| `composer quality` | PHPStan (level 5), Pint, Rector (dry run) |
| `npm run check` | isolation, dist, protocol, `npm test`, then `npm run quality` |
| `npm run quality:update` | after a clean-up: writes the lower numbers here. It never raises one |
| `npm run quality:numbers` | the pass's headline numbers as JSON |
| `SVE_MOMENTS_UPDATE=1 npm run e2e -- moments` | on the bench, after a clean-up: writes the lower moment numbers into `moments.json`. It never raises one |
| `SVE_REPORT_DIR=… npm run report:bundle` | what fills each built file, outside `resources/dist` |

`git push` to main runs `scripts/hooks/pre-push`: the rollback guard, then
`node scripts/quality.mjs all`, `npm test` and `vendor/bin/phpunit`. A branch
push only runs the rollback guard.

## The files

| File | Holds | Fails when |
|---|---|---|
| `bigfiles.json` | JS/Vue files over 1000 lines, PHP over 300, with their length | one grows, or another crosses the line |
| `catches.json` | silent `catch` blocks per file (empty once comments are taken out) | a file gets one more |
| `knip.json` | dead files, unused exports and dependencies | a new one appears |
| `jscpd.json` | copied code: clones and lines | either grows |
| `budgets.json` | KB of each built entry and lazy chunk with everything it imports. A shared chunk is kept under its name without the build's hash (`_boot.js`); two with one name are told apart by what they import | one grows more than 5 % |
| `moments.json` | per moment (Live Preview opens, the first switch to Build, Build's dock, typing in place): KB of editor JS fetched and ms of long tasks, measured on the bench by `tests/e2e/moments.spec.mjs` | the JS grows more than 5 %, or the long tasks by half and at least 100 ms (`npm run e2e`) |
| `prettier.json` | files not yet formatted | any other file is not formatted |
| `pint.json` | PHP files not yet formatted | any other PHP file is not formatted |
| `rector.json` | Rector findings per PHP file | a file gets more |
| `exceptions.json` | big files allowed to grow, each with a reason | — |

ESLint's own baseline is `eslint-suppressions.json` in the root, PHPStan's is
`phpstan-baseline.neon`.

## Raising a baseline

Do not. A new big file, a heavier chunk or a new finding means the code needs
another shape. If there is a real reason (a feature the owner wants that cannot
be smaller), edit the JSON by hand in its own commit, say why in the message,
and get the owner's yes. `exceptions.json` is where a big file that must grow
gets its reason.

## Installing the hook in a fresh clone

```sh
cat > .git/hooks/pre-push <<'EOF'
#!/bin/sh
exec "$(git rev-parse --show-toplevel)/scripts/hooks/pre-push" "$@"
EOF
chmod +x .git/hooks/pre-push
```
