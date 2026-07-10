import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import Generator from "@/components/Generator";
import Features from "@/components/Features";
import Gallery from "@/components/Gallery";

export default function Index() {
  return (
    <Layout>
      <Hero />
      <Generator />
      <Features />
      <Gallery />
    </Layout>
  );
}
