import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BackgroundState, type BackgroundStateKey } from "@/background";

interface LayoutProps {
  children: React.ReactNode;
  /**
   * Convenience for pages with a single, uniform mood: wraps `children` in
   * one `<BackgroundState>` automatically. Pages with several moods along
   * their own scroll (Home, Generate) place `<BackgroundState>` /
   * `<HeroBlend>` themselves instead and leave this unset.
   */
  backgroundState?: BackgroundStateKey;
}

export default function Layout({ children, backgroundState }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Note: no `display: contents` here — BackgroundState's own box is what
  // IntersectionObserver measures, so it needs a real box to observe.
  const content = backgroundState ? (
    <BackgroundState id={backgroundState}>{children}</BackgroundState>
  ) : (
    children
  );

  return (
    <div className="min-h-screen flex flex-col text-foreground">
      <Navbar />

      {isHome ? (
        <main className="flex-1">{content}</main>
      ) : (
        <>
          <main className="relative z-10 flex-1 pt-20">{content}</main>
          <div className="relative z-10">
            <Footer />
          </div>
        </>
      )}
    </div>
  );
}
