import { useEffect } from "react";
import { useBackground } from "./useBackground";
import type { BackgroundStateKey } from "./config";

/**
 * Immediately claims a background mood on mount — no IntersectionObserver,
 * no wait for a frame. Use for whole-page single-mood screens (via Layout's
 * `backgroundState` prop, or the auth/dashboard pages) where the mood is
 * known the instant the page mounts, so the crossfade begins in lockstep
 * with the page-transition fade instead of a frame later.
 *
 * Scroll pages with several moods along their length (Home, Generate) keep
 * `<BackgroundState>` + its observer instead, since which mood is active
 * genuinely depends on scroll position there.
 */
export function useActiveBackground(id?: BackgroundStateKey | null) {
  const { setActiveState } = useBackground();

  useEffect(() => {
    if (id) setActiveState(id);
  }, [id, setActiveState]);
}
