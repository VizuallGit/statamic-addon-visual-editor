/**
 * Contract tests for sectionField() / pageBuilderParams() in lib/config.js —
 * which field holds the page's sections, read off the meta the server gave
 * the form (`SveLiteSections::preload`), and what the server is asked about.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSectionField, pageBuilderParams, pageBuilderQuery, sectionField } from '../../resources/js/lib/config.js';
import { addContainer, pageHasSectionField } from '../../resources/js/lib/publish-containers.js';

const doc = { querySelector: () => null };
const win = {
  document: doc,
  location: { pathname: '/cp/collections/employees/entries/abc' },
  Statamic: { $config: { get: () => undefined } },
};

test('with no form on screen, the default field and nothing to name', () => {
  assert.equal(defaultSectionField(win), 'page_sections');
  assert.equal(sectionField(win), 'page_sections');
  assert.deepEqual(pageBuilderParams(win), { blueprint: '', collection: 'employees', sections_field: '' });
});

test('outside Live Preview: a form whose values carry page_sections', () => {
  addContainer({ name: 'page', setFieldValue() {}, values: { page_sections: [] }, meta: { page_sections: { existing: {} } } });

  assert.equal(sectionField(win), 'page_sections');
  assert.equal(pageBuilderParams(win).sections_field, 'page_sections');
  assert.equal(pageBuilderParams(win).blueprint, '');
});

test('the field the server marked in its meta wins, whatever it is called', () => {
  addContainer({
    name: 'lawyer',
    setFieldValue() {},
    // Refs, as the publish container provides them.
    values: { __v_isRef: true, value: { title: 'Jens', lawyer_info: [] } },
    meta: {
      __v_isRef: true,
      value: {
        title: null,
        lawyer_info: { existing: {}, sve_sections: true, sve_blueprint: 'collections.employees.employee' },
      },
    },
  });

  assert.equal(sectionField(win), 'lawyer_info');
  assert.deepEqual(pageBuilderParams(win), {
    blueprint: 'collections.employees.employee',
    collection: 'employees',
    sections_field: 'lawyer_info',
  });
  assert.equal(
    pageBuilderQuery(win),
    'blueprint=collections.employees.employee&collection=employees&sections_field=lawyer_info'
  );
  assert.equal(pageHasSectionField(win, doc), true);
});

test('the default name follows the site setting; a marked field still wins', () => {
  const other = { ...win, Statamic: { $config: { get: (key) => (key === 'sveSectionField' ? 'blocks' : undefined) } } };

  assert.equal(defaultSectionField(other), 'blocks');
  assert.equal(sectionField(other), 'lawyer_info');
});
