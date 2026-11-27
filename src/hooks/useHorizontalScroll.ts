import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  getScrollEdgeState,
  resolveWheelDeltaX,
  ScrollEdgeState,
} from '../utils/horizontalScroll';

interface DragState {
  active: boolean;
  startX: number;
  startScrollLeft: number;
  moved: boolean;
}

export interface UseHorizontalScrollResult {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  edgeState: ScrollEdgeState;
  scrollByStep: (direction: -1 | 1, stepPx?: number) => void;
  updateEdges: () => void;
  containerProps: {
    onScroll: () => void;
    onWheel: React.WheelEventHandler<HTMLDivElement>;
    onPointerDown: React.PointerEventHandler<HTMLDivElement>;
    onPointerMove: React.PointerEventHandler<HTMLDivElement>;
    onPointerUp: React.PointerEventHandler<HTMLDivElement>;
    onPointerCancel: React.PointerEventHandler<HTMLDivElement>;
    onClickCapture: React.MouseEventHandler<HTMLDivElement>;
  };
}

export function useHorizontalScroll(
  defaultStepPx = 220
): UseHorizontalScrollResult {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState>({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

  const [edgeState, setEdgeState] = useState<ScrollEdgeState>({
    canScrollLeft: false,
    canScrollRight: false,
    hasOverflow: false,
  });

  const updateEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const next = getScrollEdgeState({
      scrollLeft: el.scrollLeft,
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    });
    setEdgeState((prev) =>
      prev.canScrollLeft === next.canScrollLeft &&
      prev.canScrollRight === next.canScrollRight &&
      prev.hasOverflow === next.hasOverflow
        ? prev
        : next
    );
  }, []);

  useEffect(() => {
    updateEdges();
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      updateEdges();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateEdges]);

  const scrollByStep = useCallback(
    (direction: -1 | 1, stepPx = defaultStepPx) => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollBy({
        left: direction * stepPx,
        behavior: 'smooth',
      });
    },
    [defaultStepPx]
  );

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const el = scrollRef.current;
      if (!el || el.scrollWidth <= el.clientWidth + 2) return;
      const delta = resolveWheelDeltaX(e.deltaX, e.deltaY);
      if (delta === 0) return;

      const atStart = el.scrollLeft <= 1 && delta < 0;
      const atEnd =
        el.scrollLeft >= el.scrollWidth - el.clientWidth - 1 && delta > 0;
      if (atStart || atEnd) return;

      el.scrollLeft += delta;
      updateEdges();
    },
    [updateEdges]
  );

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> =
    useCallback((e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      const el = scrollRef.current;
      if (!el || el.scrollWidth <= el.clientWidth + 2) return;
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startScrollLeft: el.scrollLeft,
        moved: false,
      };
    }, []);

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> =
    useCallback(
      (e) => {
        if (!dragRef.current.active) return;
        const el = scrollRef.current;
        if (!el) return;
        const dx = e.clientX - dragRef.current.startX;
        if (Math.abs(dx) > 6) {
          dragRef.current.moved = true;
        }
        if (dragRef.current.moved) {
          el.scrollLeft = dragRef.current.startScrollLeft - dx;
          updateEdges();
        }
      },
      [updateEdges]
    );

  const stopDrag = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  const handleClickCapture: React.MouseEventHandler<HTMLDivElement> =
    useCallback((e) => {
      if (dragRef.current.moved) {
        e.preventDefault();
        e.stopPropagation();
        dragRef.current.moved = false;
      }
    }, []);

  return {
    scrollRef,
    edgeState,
    scrollByStep,
    updateEdges,
    containerProps: {
      onScroll: updateEdges,
      onWheel: handleWheel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: stopDrag,
      onPointerCancel: stopDrag,
      onClickCapture: handleClickCapture,
    },
  };
}
