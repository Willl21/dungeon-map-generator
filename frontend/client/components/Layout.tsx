import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useActiveBackground, type BackgroundStateKey } from "@/background";

interface LayoutProps {
  children: React.ReactNode;
  /**
   * Convenience for pages with a single, uniform mood: claims that mood the
   * instant the page mounts (no IntersectionObserver lag), so the crossfade
   * starts in lockstep with the page-transition fade. Pages with several
   * moods along their own scroll (Home, Generate) place `<BackgroundState>`
   * / `<HeroBlend>` themselves instead and leave this unset.
   */
  backgroundState?: BackgroundStateKey;
}

export default function Layout({ children, backgroundState }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  useActiveBackground(backgroundState);

  return (
    <div className="min-h-screen flex flex-col text-foreground">
      <Navbar />

      {isHome ? (
        <main className="flex-1">{children}</main>
      ) : (
        <>
          <main className="relative z-10 flex-1 pt-20">{children}</main>
          <div className="relative z-10">
            <Footer />
          </div>
        </>
      )}
    </div>
  );
}
