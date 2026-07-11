import { useEffect, useRef, useState } from "react";

/**
 * Fires exactly when an element's box crosses the vertical center of the
 * viewport. Using rootMargin instead of a fixed intersection-ratio
 * threshold means it correctly identifies the "dominant" section no matter
 * how tall each one is — a 0.5 ratio threshold would never fire for a
 * section taller than roughly 2x the viewport.
 */
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  rootMargin: "-50% 0px -50% 0px",
  threshold: 0,
};

export function useStateInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsActive(entry.isIntersecting);
    }, OBSERVER_OPTIONS);

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isActive };
}
