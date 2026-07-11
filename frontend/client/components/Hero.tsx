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
      {/* Darkening overlay for text readability — neutral black, no color tint */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.75) 50%, rgba(0, 0, 0, 0.65) 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

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
