import { useEffect, type ReactNode } from "react";
import { useStateInView } from "./useStateInView";
import { useBackground } from "./useBackground";
import type { BackgroundStateKey } from "./config";

interface BackgroundStateProps {
  /** Must be a key from `config.ts` — invalid keys are a type error. */
  id: BackgroundStateKey;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps a piece of page content and claims the matching global background
 * mood whenever it's the section centered in the viewport. This never
 * renders any background pixels itself — it only calls `setActiveState` on
 * the one global `BackgroundManager`.
 */
export function BackgroundState({ id, children, className }: BackgroundStateProps) {
  const { ref, isActive } = useStateInView<HTMLDivElement>();
  const { setActiveState } = useBackground();

  useEffect(() => {
    if (isActive) setActiveState(id);
  }, [isActive, id, setActiveState]);

  return (
    <div ref={ref} data-bg-state={id} className={className}>
      {children}
    </div>
  );
}
