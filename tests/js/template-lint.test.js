import { test } from 'node:test';
import assert from 'node:assert/strict';
import { htmlLanguage } from '@codemirror/lang-html';
import { lintTemplate, scanAntlers } from '../../resources/js/template-lint.js';

const parser = htmlLanguage.parser;
const findings = (src) =>
  lintTemplate(src, parser).map((p) => `${p.key.replace('code_dock_problem_', '')}:${p.args.tag ?? p.args.name}`);

test('a section as the site writes it has nothing to say about', () => {
  const src = [
    '{{# sve-unlocked #}}',
    '<section id="id-{{ id }}" class="[ {{ _class }} ] {{ if wide }}is-wide{{ /if }}" {{ visual_edit outline_inside="true" }}>',
    '  {{ if image }}<img src="{{ glide :src="image" width="{{ w }}" height="{{ h }}" }}" alt="">{{ /if }}',
    '  {{ if wide }}<div class="wide">{{ else }}<div class="narrow">{{ /if }}',
    '    <h2>{{ headline }}</h2>',
    '    <ul>{{ items }}<li>{{ title }}</li>{{ /items }}</ul>',
    '    <p>{{ text }}</p>',
    '    {{ partial:components/image :src="image" }}',
    '    {{ svg src="/icons/{{ icon }}" }}',
    '    {{ total = 1 }}{{ switch((a) => "x", (b) => "y") }}',
    '  </div>',
    '  {{ responsive_css selector="#id-{{ id }} .wide" only="padding" }}',
    '  {{ collection:blog limit="3" }}<b>{{ title }}</b>{{ /collection }}',
    '  {{# a comment may hold anything: <div> {{ style_push }} #}}',
    '  {{ style_push }}<style>#id-{{ id }} { --gap: 1rem }</style>{{ /style_push }}',
    '</section>',
  ].join('\n');

  assert.deepEqual(findings(src), []);
});

test('a tag that never closes, and one that closes nothing', () => {
  const missing = '<section>\n  <div class="inner">\n    <h2>{{ headline }}</h2>\n</section>';
  const [problem] = lintTemplate(missing, parser);

  assert.deepEqual(findings(missing), ['tag_unclosed:div']);
  assert.equal(problem.from, missing.indexOf('<div'));
  assert.equal(missing.slice(problem.from, problem.to), '<div class="inner">');

  assert.deepEqual(findings('<section>\n  <p>{{ text }}</p>\n</sectoin>'), ['tag_stray:sectoin']);
});

test('a tag that is not finished is one finding, not two', () => {
  const src = '<div class="x"\n  <span>hej</span>\n</div>';

  assert.deepEqual(findings(src), ['tag_unfinished:div']);
  assert.deepEqual(findings('<div>hej</div'), ['tag_unfinished:div']);
});

test('a <p> or <li> left open is told, even though HTML would close it', () => {
  assert.deepEqual(findings('<div>\n  <p>fdsfsd</p>\n  <div>\n    <p>fdsfdsf\n  </div>\n</div>'), ['tag_unclosed:p']);
  assert.deepEqual(findings('<ul><li>a<li>b</ul>'), ['tag_unclosed:li', 'tag_unclosed:li']);
});

test('void tags and a tag decided by a field are not findings', () => {
  assert.deepEqual(findings('<div><img src="x"><br><input></div>'), []);
  assert.deepEqual(findings('<{{ tag }} class="x">{{ text }}</{{ tag }}>'), []);
});

test('antlers pairs: if without /if, /if without if, a closer with nothing open', () => {
  assert.deepEqual(findings('<div>\n  {{ if show }}\n    <img src="{{ image }}">\n</div>'), ['pair_unclosed:if']);
  assert.deepEqual(findings('<div>{{ title }}</div>\n{{ /if }}'), ['pair_stray:if']);
  assert.deepEqual(findings('{{ blocks }}<li>{{ title }}</li>{{ /items }}'), ['pair_stray:items']);
  assert.deepEqual(findings('{{ else }}<b>x</b>'), ['branch_stray:else']);
  assert.deepEqual(findings('{{ unless a }}x{{ endunless }}{{ if b }}y{{ endif }}'), []);
});

test('pair-only tags must close; single tags may stand alone', () => {
  assert.deepEqual(findings('{{ style_push }}\n<style>a{}</style>'), ['pair_unclosed:style_push']);
  assert.deepEqual(findings('{{ responsive_css }}\n{{ sve_defaults }}x{{ /sve_defaults }}'), []);
});

test('a {{ that never gets its }} names what was being written', () => {
  const src = '<section {{ visual_edit outline_inside="true">\n<div>x</div>\n</section>';
  const [problem] = lintTemplate(src, parser);

  assert.equal(problem.key, 'code_dock_problem_antlers_unclosed');
  assert.equal(problem.args.name, 'visual_edit');
  assert.equal(problem.from, src.indexOf('{{'));

  assert.deepEqual(findings('<h2>{{ title</h2>\n<p>{{ text }}</p>'), ['antlers_unclosed:title']);
});

test('scanAntlers reads a tag inside another tag as one', () => {
  const src = 'a {{ glide :src="x" width="{{ w }}" }} b {{# c {{ d }} #}} e';
  const { tags, unclosed } = scanAntlers(src);

  assert.deepEqual(unclosed, []);
  assert.deepEqual(
    tags.map((tag) => src.slice(tag.from, tag.to)),
    ['{{ glide :src="x" width="{{ w }}" }}', '{{# c {{ d }} #}}']
  );
});

test('nothing to read is nothing to say, and never a throw', () => {
  assert.deepEqual(lintTemplate('', parser), []);
  assert.deepEqual(lintTemplate('   ', parser), []);
  assert.deepEqual(lintTemplate('<div>', null), []);
  assert.deepEqual(lintTemplate('<<<{{{>>>', parser).length >= 0, true);
});
