import { motion } from "framer-motion";
import { EtheralShadow } from "@/components/EtheralShadow";
import { useBackground } from "./useBackground";
import { backgroundStates, backgroundStateKeys } from "./config";

/**
 * The one and only background rendering surface for the entire app.
 * Mounted once in App.tsx, above the router, so it is never unmounted by
 * navigation — sections and pages never render their own background, they
 * only ever tell `BackgroundProvider` which of these layers should be
 * visible (see `BackgroundState` and `HeroBlend`).
 */
export function BackgroundManager() {
  const { activeState, layerOpacities } = useBackground();

  return (
    <div className="fixed inset-0 z-0 bg-black" aria-hidden="true">
      {backgroundStateKeys.map((key) => {
        const layer = backgroundStates[key];
        return (
          <motion.div
            key={key}
            className="absolute inset-0"
            style={{ opacity: layerOpacities[key] }}
          >
            <EtheralShadow
              color={layer.color}
              animation={layer.animation}
              noise={layer.noise}
              paused={key !== activeState}
            />
          </motion.div>
        );
      })}

      {/* Shared ambient vignette — one instance for the whole app instead of
          every page/section darkening its own edges independently. */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_220px_90px_rgba(0,0,0,0.6)]" />
    </div>
  );
}
