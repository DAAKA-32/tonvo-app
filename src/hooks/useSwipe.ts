import { useEffect, useRef, useCallback } from "react";

interface UseSwipeOptions {
  /** Called when a left→right swipe is detected from the edge */
  onSwipeRight?: () => void;
  /** Called when a right→left swipe is detected */
  onSwipeLeft?: () => void;
  /** Max X from left edge to start detecting (px). Default: 30 */
  edgeThreshold?: number;
  /** Min horizontal distance to trigger (px). Default: 50 */
  minDistance?: number;
  /** Max vertical drift before cancelling (ratio). Default: 0.6 */
  maxVerticalRatio?: number;
  /** Only run on mobile viewports (<=768px). Default: true */
  mobileOnly?: boolean;
  /** Whether the gesture is currently enabled. Default: true */
  enabled?: boolean;
}

export function useSwipe({
  onSwipeRight,
  onSwipeLeft,
  edgeThreshold = 30,
  minDistance = 50,
  maxVerticalRatio = 0.6,
  mobileOnly = true,
  enabled = true,
}: UseSwipeOptions = {}) {
  const touchRef = useRef<{
    startX: number;
    startY: number;
    isEdgeSwipe: boolean;
    tracking: boolean;
  } | null>(null);

  const onSwipeRightRef = useRef(onSwipeRight);
  const onSwipeLeftRef = useRef(onSwipeLeft);
  onSwipeRightRef.current = onSwipeRight;
  onSwipeLeftRef.current = onSwipeLeft;

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;
      if (mobileOnly && window.innerWidth > 768) return;

      const touch = e.touches[0];
      touchRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        isEdgeSwipe: touch.clientX <= edgeThreshold,
        tracking: true,
      };
    },
    [enabled, mobileOnly, edgeThreshold]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const t = touchRef.current;
      if (!t?.tracking) return;

      const touch = e.touches[0];
      const dx = touch.clientX - t.startX;

      // If this is an edge swipe going right, prevent browser back navigation
      if (t.isEdgeSwipe && dx > 10) {
        e.preventDefault();
      }
    },
    []
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const t = touchRef.current;
      if (!t?.tracking) return;
      touchRef.current = null;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - t.startX;
      const dy = touch.clientY - t.startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Must be primarily horizontal
      if (absDy > absDx * maxVerticalRatio) return;
      // Must exceed minimum distance
      if (absDx < minDistance) return;

      if (dx > 0 && t.isEdgeSwipe && onSwipeRightRef.current) {
        // Left→Right edge swipe: open sidebar
        onSwipeRightRef.current();
      } else if (dx < 0 && onSwipeLeftRef.current) {
        // Right→Left swipe: close sidebar
        onSwipeLeftRef.current();
      }
    },
    [minDistance, maxVerticalRatio]
  );

  useEffect(() => {
    if (!enabled) return;

    // Use { passive: false } on touchmove so we can preventDefault for edge swipes
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);
}
