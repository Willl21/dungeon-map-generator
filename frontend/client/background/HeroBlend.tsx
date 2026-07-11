import { useRef, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useBackground } from "./useBackground";
import type { BackgroundStateKey } from "./config";

interface HeroBlendProps {
  /** Which BackgroundManager state should take over as Hero scrolls away. */
  into: BackgroundStateKey;
  children: ReactNode;
}

/**
 * Fades out only the bottom ~12% of Hero's own box, structurally and
 * regardless of scroll position. This must stay below every piece of real
 * content (badge, title, subtitle, CTA button, divider) — Hero's own
 * content is vertically centered, and measuring it live puts the button's
 * bottom edge at ~66% of Hero's height and the divider's at ~88%. An
 * earlier version started this mask at 25%, which was already fading out
 * the subtitle and button even at rest (scrollY 0) — a real bug, not just
 * a cosmetic one. The *bulk* of the "overlap several hundred pixels"
 * requirement is carried by the scroll-driven opacity below instead, which
 * only kicks in once the user has actually started scrolling — fading
 * real content is expected once it's being scrolled away, just not before.
 */
const SAFE_MASK = "linear-gradient(to bottom, black 0%, black 88%, transparent 100%)";

function toMask(gradient: string): CSSProperties {
  return {
    maskImage: gradient,
    WebkitMaskImage: gradient,
    // A CSS gradient has no intrinsic size, and `mask-repeat` defaults to
    // `repeat` — without pinning size/repeat explicitly, engines can tile
    // the gradient instead of stretching it once across the element.
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  };
}

const safeMaskStyle = toMask(SAFE_MASK);

/**
 * Hero is the one place a page still renders its own visuals (the video) —
 * everywhere else defers entirely to `BackgroundManager`. This is the
 * bridge between the two: it drives the *target* layer's opacity directly
 * from scroll position (via the shared MotionValue in context, not a CSS
 * transition) while Hero is exiting, so Hero's own fade-out and
 * BackgroundManager's fade-in are mathematically the same continuous
 * value — there is no gap for a seam to appear in. Once the handoff
 * reaches 1, ownership passes to the normal discrete
 * (IntersectionObserver-driven) `BackgroundState` system.
 *
 * `useScroll`'s offset ["start start", "end start"] ties progress directly
 * to Hero's own scroll position — 0 the moment Hero's top reaches the
 * viewport top (scrollY 0), 1 the moment Hero has fully scrolled past the
 * top — so it stays scroll-locked (not time-based), correct regardless of
 * whether Hero is taller or shorter than the viewport.
 *
 * Deliberately never applies `filter` (blur/brightness) to anything that
 * wraps `children`: a non-"none" `filter` on an ancestor establishes a new
 * containing block for that ancestor's `position: absolute`/`fixed`
 * descendants. Hero's own video and gradient overlay are `absolute
 * inset-0 h-full`, sized against Hero's own `<section>` — wrapping them in
 * a filtered ancestor made their percentage heights resolve against an
 * auto-height box instead, which blew Hero's rendered height up to several
 * thousand pixels. Dimming is done with a plain opacity-driven overlay
 * instead, which has no such side effect.
 *
 * The video layer and the dark overlay share the exact same `SAFE_MASK` —
 * two independently-shaped masks (however close) create two slightly
 * different fade curves, which is enough of a mismatch to read as a
 * visible line. A single shared shape guarantees they release in lockstep.
 * The overlay also has no gradient stops of its own (`bg-black`, flat) —
 * a "rise, hold flat, release" gradient creates two visible kinks where
 * the rate of change jumps; a flat fill shaped only by the shared mask has
 * none.
 */
export function HeroBlend({ into, children }: HeroBlendProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { layerOpacities, setActiveState } = useBackground();
  const handedOff = useRef(false);

  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(progress, "change", (value) => {
    const targetLayer = layerOpacities[into];
    if (!targetLayer) return;

    const clamped = Math.max(0, Math.min(1, value));

    if (clamped >= 0.98) {
      if (!handedOff.current) {
        handedOff.current = true;
        targetLayer.set(1);
        setActiveState(into);
      }
    } else {
      handedOff.current = false;
      targetLayer.set(clamped);
    }
  });

  const heroOpacity = useTransform(progress, [0.25, 1], [1, 0]);
  const overlayOpacity = useTransform(progress, [0.15, 0.85], [0, 1]);

  return (
    <div ref={ref} className="relative z-20">
      {/* Video layer — crisp at first, fades out via scroll-driven opacity
          once the user actually scrolls; the mask only softens the very
          bottom edge, well below all real content. */}
      <motion.div style={{ opacity: heroOpacity, ...safeMaskStyle }}>
        {children}
      </motion.div>

      {/* Dark overlay — same shape as the video's own fade, so the two
          release in lockstep with no mismatch at the edge. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity, ...safeMaskStyle }}
      />
    </div>
  );
}
