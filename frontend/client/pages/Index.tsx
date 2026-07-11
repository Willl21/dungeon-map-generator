import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import Generator from "@/components/Generator";
import Features from "@/components/Features";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import { BackgroundState, HeroBlend } from "@/background";

export default function Index() {
  return (
    <Layout>
      {/* Hero Section — uses video background, no BackgroundManager layer.
          Hero itself is untouched; HeroBlend wraps it from the outside and
          drives the handoff to BackgroundManager's "ember" layer directly
          from scroll position, so there's no seam between the video and
          the rest of the site. */}
      <HeroBlend into="ember">
        <Hero />
      </HeroBlend>

      <div className="relative z-10">
        <BackgroundState id="ember">
          <Generator />
        </BackgroundState>
        <BackgroundState id="gold">
          <Features />
        </BackgroundState>
        <BackgroundState id="ruby">
          <Gallery />
        </BackgroundState>
        <Footer />
      </div>
    </Layout>
  );
}
