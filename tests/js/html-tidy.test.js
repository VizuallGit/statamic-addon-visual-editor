import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tidyHtml } from '../../resources/js/html-tidy.js';

test('empty lines go, wherever they stand', () => {
  const messy = '<section>\n  <div>\n    <p>x</p>\n  </div>\n\n\n  <ul>\n    <li>a</li>\n  </ul>\n\n\n</section>\n';

  assert.equal(tidyHtml(messy), '<section>\n  <div>\n    <p>x</p>\n  </div>\n  <ul>\n    <li>a</li>\n  </ul>\n</section>\n');
});

test('a verbatim block keeps its own empty lines (an unindented file gets four spaces)', () => {
  const messy = '<div>\n<pre>\nline 1\n\nline 3\n</pre>\n\n</div>\n';

  assert.equal(tidyHtml(messy), '<div>\n    <pre>\nline 1\n\nline 3\n</pre>\n</div>\n');
});
