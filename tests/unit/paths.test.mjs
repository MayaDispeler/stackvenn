import test from 'node:test';
import assert from 'node:assert/strict';
import { pathNeighbours } from '../../src/lib/paths.ts';

const p = (id, series, order) => ({ id, data: { series, order } });
const all = [p('c', 'start', 3), p('a', 'start', 1), p('x', undefined), p('b', 'start', 2)];

test('middle of a path links both ways', () => {
  const r = pathNeighbours(all, all[3]);
  assert.equal(r.prev?.id, 'a');
  assert.equal(r.next?.id, 'c');
  assert.equal(r.index, 2);
  assert.equal(r.total, 3);
});

test('ends of a path link one way', () => {
  assert.equal(pathNeighbours(all, all[1]).prev, undefined);
  assert.equal(pathNeighbours(all, all[0]).next, undefined);
});

test('a piece outside any path has no pager', () => {
  const r = pathNeighbours(all, all[2]);
  assert.equal(r.prev, undefined);
  assert.equal(r.next, undefined);
  assert.equal(r.total, 0);
});
