import { ChevronDown } from "lucide-react";
import { useRef } from 'react';
import VariableProximity from './ui/VariableProximity';

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  const handleScroll = () => {
    const generatorSection = document.getElementById("generator");
    if (generatorSection) {
      generatorSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-[90vh] w-full overflow-hidden pt-20">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/dndvideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Background with gradient overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(20, 12, 8, 0.7) 0%, rgba(40, 20, 10, 0.8) 50%, rgba(60, 30, 15, 0.7) 100%),
            radial-gradient(ellipse at 20% 50%, rgba(201, 164, 97, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(180, 60, 40, 0.08) 0%, transparent 50%)
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Animated particles/glow effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-20 w-96 h-96 bg-red-900/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-80 h-80 bg-gold-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-20 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center px-4 py-2 rounded-full bg-gold-900/30 border border-gold-600/50">
          <span className="text-gold-300 text-sm font-semibold">
            Welcome to the Dungeon Generator
          </span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <span className="text-gradient">Forge Your</span>
          <br />
          <span className="text-gold-300">Own Dungeon</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mb-12 tracking-wider">
          <VariableProximity
            label="Generate unique D&D-style maps instantly. Customize themes, difficulty levels, and map sizes to create the perfect dungeon for your adventure."
            fromFontVariationSettings="'wght' 200"
            toFontVariationSettings="'wght' 700"
            containerRef={containerRef}
            radius={200}
            falloff="gaussian"
            style={{ fontFamily: '"Oswald", sans-serif', textTransform: 'uppercase' }}
          />
        </p>

        {/* CTA Button */}
        <button
          onClick={handleScroll}
          className="fantasy-button mb-8 group text-lg px-8 py-4"
        >
          <span className="relative z-10 flex items-center gap-2">
            Start Generating
            <ChevronDown className="h-5 w-5 group-hover:translate-y-1 transitio n-transform" />
          </span>
        </button>

        {/* Decorative divider */}
        <div className="mt-16 pt-16 border-t border-gold-900/20 w-full max-w-xl">
          <p className="text-foreground/50 text-sm font-serif italic">
            Where imagination meets procedural magic
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="text-gold-400/60">
          <ChevronDown className="h-8 w-8" />
        </div>
      </div>
    </section>
  );
}
