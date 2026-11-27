import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getNextScrollOffset,
  getScrollEdgeState,
  resolveWheelDeltaX,
} from './horizontalScroll';

test('getScrollEdgeState detects no overflow when content fits', () => {
  assert.deepEqual(
    getScrollEdgeState({ scrollLeft: 0, scrollWidth: 360, clientWidth: 360 }),
    { canScrollLeft: false, canScrollRight: false, hasOverflow: false }
  );
});

test('getScrollEdgeState detects left, middle, and right scroll boundaries', () => {
  assert.deepEqual(
    getScrollEdgeState({ scrollLeft: 0, scrollWidth: 900, clientWidth: 360 }),
    { canScrollLeft: false, canScrollRight: true, hasOverflow: true }
  );

  assert.deepEqual(
    getScrollEdgeState({ scrollLeft: 200, scrollWidth: 900, clientWidth: 360 }),
    { canScrollLeft: true, canScrollRight: true, hasOverflow: true }
  );

  assert.deepEqual(
    getScrollEdgeState({ scrollLeft: 540, scrollWidth: 900, clientWidth: 360 }),
    { canScrollLeft: true, canScrollRight: false, hasOverflow: true }
  );
});

test('getNextScrollOffset clamps within [0, maxScrollLeft]', () => {
  assert.equal(getNextScrollOffset(0, -1, 200, 500), 0);
  assert.equal(getNextScrollOffset(120, 1, 200, 500), 320);
  assert.equal(getNextScrollOffset(420, 1, 200, 500), 500);
});

test('resolveWheelDeltaX preserves native horizontal delta and translates vertical wheel', () => {
  assert.equal(resolveWheelDeltaX(45, 10), 45);
  assert.equal(resolveWheelDeltaX(0, 100), 100);
  assert.equal(resolveWheelDeltaX(-5, -80), -80);
});
