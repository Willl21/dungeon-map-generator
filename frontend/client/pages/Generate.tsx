import Layout from "@/components/Layout";
import Generator from "@/components/Generator";
import { BackgroundState } from "@/background";

export default function Generate() {
  return (
    <Layout>
      <div className="relative z-10">
        <BackgroundState id="ember">
          <section className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12">
                <h1 className="text-5xl font-serif font-bold mb-4">
                  <span className="text-gradient">Map Generator</span>
                </h1>
                <p className="text-foreground/70 text-lg">
                  Create custom D&D-style dungeon maps with advanced configuration options
                </p>
              </div>
            </div>
          </section>
        </BackgroundState>

        <BackgroundState id="gold">
          <Generator />
        </BackgroundState>
      </div>
    </Layout>
  );
}
