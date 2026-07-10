import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { animate, motionValue, type MotionValue } from "framer-motion";
import { BackgroundContext } from "./BackgroundContext";
import { backgroundStateKeys, type BackgroundStateKey } from "./config";

const TRANSITION_SECONDS = 1.4;

interface BackgroundProviderProps {
  children: ReactNode;
}

/**
 * Mount this ONCE, above <BrowserRouter> in App.tsx, so it never unmounts
 * across route changes — that persistence is the entire point: the
 * background is one continuous, living thing, not something every page
 * recreates from scratch.
 *
 * `layerOpacities` are plain `motionValue()`s (not the `useMotionValue`
 * hook), created once via a ref, because they need to exist as a fixed-size
 * map keyed by every state in `config.ts` — calling a hook inside a loop
 * would break the rules of hooks. Two things ever write to them:
 *   - this provider's own effect, animating towards whichever state is
 *     `activeState` (discrete, IntersectionObserver-driven sections).
 *   - `HeroBlend`, which drives one layer directly from scroll position
 *     while Hero is exiting (continuous, so there is no seam to create).
 */
export function BackgroundProvider({ children }: BackgroundProviderProps) {
  const [activeState, setActiveState] = useState<BackgroundStateKey | null>(
    null,
  );

  const layerOpacitiesRef = useRef<Record<BackgroundStateKey, MotionValue<number>>>();
  if (!layerOpacitiesRef.current) {
    const map = {} as Record<BackgroundStateKey, MotionValue<number>>;
    backgroundStateKeys.forEach((key) => {
      map[key] = motionValue(0);
    });
    layerOpacitiesRef.current = map;
  }
  const layerOpacities = layerOpacitiesRef.current;

  useEffect(() => {
    backgroundStateKeys.forEach((key) => {
      const target = key === activeState ? 1 : 0;
      animate(layerOpacities[key], target, {
        duration: TRANSITION_SECONDS,
        ease: "easeInOut",
      });
    });
  }, [activeState, layerOpacities]);

  const value = useMemo(
    () => ({ activeState, setActiveState, layerOpacities }),
    [activeState, layerOpacities],
  );

  return (
    <BackgroundContext.Provider value={value}>
      {children}
    </BackgroundContext.Provider>
  );
}
