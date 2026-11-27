export interface ScrollBounds {
  scrollLeft: number;
  scrollWidth: number;
  clientWidth: number;
}

export interface ScrollEdgeState {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  hasOverflow: boolean;
}

export function getScrollEdgeState(
  bounds: ScrollBounds,
  threshold = 2
): ScrollEdgeState {
  const maxScrollLeft = Math.max(0, bounds.scrollWidth - bounds.clientWidth);
  const hasOverflow = maxScrollLeft > threshold;

  if (!hasOverflow) {
    return {
      canScrollLeft: false,
      canScrollRight: false,
      hasOverflow: false,
    };
  }

  return {
    canScrollLeft: bounds.scrollLeft > threshold,
    canScrollRight: bounds.scrollLeft < maxScrollLeft - threshold,
    hasOverflow: true,
  };
}

export function getNextScrollOffset(
  currentLeft: number,
  direction: -1 | 1,
  stepPx: number,
  maxScrollLeft: number
): number {
  const safeMax = Math.max(0, maxScrollLeft);
  const next = currentLeft + direction * Math.max(0, stepPx);
  return Math.min(safeMax, Math.max(0, next));
}

export function resolveWheelDeltaX(deltaX: number, deltaY: number): number {
  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    return deltaX;
  }
  return deltaY;
}
