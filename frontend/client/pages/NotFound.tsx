import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { MapPin } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-2xl">
          <MapPin className="h-24 w-24 text-gold-500/40 mx-auto mb-8" />
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-gradient mb-4">
            404
          </h1>
          <p className="text-2xl font-serif text-foreground mb-4">
            Lost in the Dungeon
          </p>
          <p className="text-foreground/70 text-lg mb-8">
            The page you're looking for doesn't exist in this dungeon.
            Let's get you back on the right path.
          </p>
          <div className="divider-gold my-8" />
          <Link to="/">
            <button className="fantasy-button group text-lg px-8 py-4">
              <span className="relative z-10">Return to Surface</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-700 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
