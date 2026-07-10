import { createContext } from "react";
import type { MotionValue } from "framer-motion";
import type { BackgroundStateKey } from "./config";

export interface BackgroundContextValue {
  activeState: BackgroundStateKey | null;
  setActiveState: (key: BackgroundStateKey) => void;
  /** One persistent MotionValue per layer, shared by BackgroundManager and HeroBlend. */
  layerOpacities: Record<BackgroundStateKey, MotionValue<number>>;
}

export const BackgroundContext = createContext<BackgroundContextValue | null>(
  null,
);
