import type { BackgroundLayerConfig } from "./types";

/**
 * Single source of truth for every mood the global background can be in.
 * `BackgroundManager` renders exactly one `EtheralShadow` layer per entry
 * here — nothing else in the app is allowed to render its own background.
 * To add a new mood: add an entry here, then reference its key from a
 * `<BackgroundState id="...">` wrapper anywhere in the app. `BackgroundState`
 * gets autocomplete + typo-safety for free because `BackgroundStateKey` is
 * derived from this object below.
 */
export const backgroundStates = {
  // Home: Generator section, Generate page's own panel — the app's primary tone.
  ember: {
    color: "rgba(192, 136, 99, 1)",
    animation: { scale: 100, speed: 90 },
    noise: { opacity: 1, scale: 1.2 },
  },
  // Home: Features section, Features page.
  gold: {
    color: "rgba(201, 164, 97, 1)",
    animation: { scale: 80, speed: 70 },
    noise: { opacity: 1, scale: 1.2 },
  },
  // Home: Gallery section.
  ruby: {
    color: "rgba(168, 82, 48, 1)",
    animation: { scale: 90, speed: 60 },
    noise: { opacity: 1, scale: 1.2 },
  },
  // About page — a cooler, quieter tone for a reflective page.
  void: {
    color: "rgba(74, 58, 92, 1)",
    animation: { scale: 60, speed: 50 },
    noise: { opacity: 0.8, scale: 1 },
  },
  // Login / Register.
  auth: {
    color: "rgba(255, 255, 255, 1)",
    animation: { scale: 50, speed: 30 },
    noise: { opacity: 0.2, scale: 1 },
  },
  // Dashboard / My Maps.
  dashboard: {
    color: "rgba(255, 255, 255, 1)",
    animation: { scale: 50, speed: 30 },
    noise: { opacity: 0.2, scale: 1 },
  },
} as const satisfies Record<string, BackgroundLayerConfig>;

export type BackgroundStateKey = keyof typeof backgroundStates;

export const backgroundStateKeys = Object.keys(
  backgroundStates,
) as BackgroundStateKey[];
