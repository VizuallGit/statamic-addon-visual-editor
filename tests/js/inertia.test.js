/**
 * lib/inertia.js — Inertia's page resolver found off the app instance, the
 * shape Vue keeps in a production build (no `__vueParentComponent` on nodes).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inertiaPageResolver } from '../../resources/js/lib/inertia.js';

const resolve = async (name) => ({ default: { name } });

/** Statamic's root: a plain component whose render puts Inertia's App inside a wrapper. */
function app(inertiaProps) {
  return {
    _instance: {
      props: {},
      subTree: {
        children: [
          { children: 'text' },
          { component: { props: { other: 1 }, subTree: { children: [] } } },
          { component: { props: inertiaProps, subTree: null } },
        ],
      },
    },
  };
}

test('finds resolveComponent on Inertia\'s App below the root', () => {
  const win = { Statamic: { $app: app({ initialPage: {}, resolveComponent: resolve }) } };

  assert.equal(inertiaPageResolver(win), resolve);
});

test('a publish screen keeps _instance null: the container\'s root vnode is read instead', () => {
  const { _instance } = app({ resolveComponent: resolve });
  const win = { Statamic: { $app: { _instance: null, _container: { _vnode: { component: _instance } } } } };

  assert.equal(inertiaPageResolver(win), resolve);
});

test('null without an app, an instance or a resolver', () => {
  assert.equal(inertiaPageResolver({}), null);
  assert.equal(inertiaPageResolver({ Statamic: { $app: {} } }), null);
  assert.equal(inertiaPageResolver({ Statamic: { $app: app({ initialPage: {} }) } }), null);
});

test('a cycle or a very deep tree ends', () => {
  const loop = { props: {}, subTree: null };

  loop.subTree = { component: loop };
  assert.equal(inertiaPageResolver({ Statamic: { $app: { _instance: loop } } }), null);
});
