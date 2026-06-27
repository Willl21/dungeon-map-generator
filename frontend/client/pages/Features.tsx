import Layout from "@/components/Layout";
import Features from "@/components/Features";

export default function FeaturesPage() {
  return (
    <Layout>
      <section className="py-12 px-4 bg-stone-900">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-serif font-bold mb-4">
              <span className="text-gradient">Features & Capabilities</span>
            </h1>
            <p className="text-foreground/70 text-lg">
              Discover what makes the Dungeon Generator the ultimate tool for D&D map creation
            </p>
          </div>
        </div>
      </section>
      <Features />
    </Layout>
  );
}
