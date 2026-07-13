import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EtheralShadow } from "@/components/EtheralShadow";
import { useBackground } from "./useBackground";
import { TRANSITION_SECONDS } from "./BackgroundProvider";
import { backgroundStates, backgroundStateKeys, type BackgroundStateKey } from "./config";

// Small buffer on top of the crossfade duration so the outgoing layer's
// filter stays mounted until it has actually finished fading, not just
// until the transition "should" be done.
const SETTLE_MS = TRANSITION_SECONDS * 1000 + 200;

/**
 * The one and only background rendering surface for the entire app.
 * Mounted once in App.tsx, above the router, so it is never unmounted by
 * navigation — sections and pages never render their own background, they
 * only ever tell `BackgroundProvider` which of these layers should be
 * visible (see `BackgroundState` and `HeroBlend`).
 */
export function BackgroundManager() {
  const { activeState, layerOpacities } = useBackground();

  // Which layers currently need the REAL EtheralShadow mounted (SVG
  // feTurbulence + feDisplacementMap + blur — expensive to paint). Only the
  // active layer and whichever layer is still fading out during a crossfade
  // get it; everything else renders a flat, filter-free div instead. Since
  // those other layers sit at opacity 0 anyway, this is invisible — but it
  // stops the browser from computing 5 extra full-viewport SVG filter
  // chains on every frame it doesn't need to. This was the main source of
  // jank across the app (all 6 layers were mounted on every page, always).
  const [renderedKeys, setRenderedKeys] = useState<Set<BackgroundStateKey>>(
    () => new Set(activeState ? [activeState] : []),
  );

  useEffect(() => {
    if (!activeState) return;

    setRenderedKeys((prev) => new Set(prev).add(activeState));

    const timer = setTimeout(() => {
      setRenderedKeys(new Set([activeState]));
    }, SETTLE_MS);

    return () => clearTimeout(timer);
  }, [activeState]);

  return (
    <div className="fixed inset-0 z-0 bg-black" aria-hidden="true">
      {backgroundStateKeys.map((key) => {
        const layer = backgroundStates[key];
        const needsFilter = renderedKeys.has(key);
        return (
          <motion.div
            key={key}
            className="absolute inset-0"
            style={{ opacity: layerOpacities[key] }}
          >
            {needsFilter ? (
              <EtheralShadow
                color={layer.color}
                animation={layer.animation}
                noise={layer.noise}
                paused={key !== activeState}
              />
            ) : (
              <div
                className="h-full w-full"
                style={{ backgroundColor: layer.color }}
              />
            )}
          </motion.div>
        );
      })}

      {/* Shared ambient vignette — one instance for the whole app instead of
          every page/section darkening its own edges independently. */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_220px_90px_rgba(0,0,0,0.6)]" />
    </div>
  );
}
