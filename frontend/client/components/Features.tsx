import {
  Wand2,
  Palette,
  Zap,
  Download as DownloadIcon,
} from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: <Wand2 className="h-8 w-8" />,
    title: "Procedural Generation",
    description:
      "Advanced algorithms create unique, playable dungeons every time. No two maps are ever identical.",
    color: "from-gold-500/20 to-gold-600/10",
  },
  {
    icon: <Palette className="h-8 w-8" />,
    title: "Custom Themes",
    description:
      "Choose from multiple themes including dungeons, caves, castles, and enchanted forests with unique aesthetics.",
    color: "from-red-600/20 to-red-700/10",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Fast Rendering",
    description:
      "Lightning-fast generation powered by optimized algorithms. Get your perfect map in seconds.",
    color: "from-yellow-500/20 to-yellow-600/10",
  },
  {
    icon: <DownloadIcon className="h-8 w-8" />,
    title: "Downloadable Maps",
    description:
      "Export your generated maps in high resolution. Compatible with VTT software and tabletop platforms.",
    color: "from-emerald-500/20 to-emerald-600/10",
  },
];

export default function Features() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            <span className="text-gradient">Powerful Features</span>
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Everything you need to create amazing dungeons for your next
            campaign
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group cursor-pointer"
            >
              <div
                className={`card-dark rounded-xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/20 hover:border-gold-500/50 hover:-translate-y-2`}
              >
                {/* Icon Container */}
                <div
                  className={`w-16 h-16 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-gold-400 group-hover:text-gold-300 transition-colors`}
                >
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/60 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Accent Line */}
                <div className="mt-6 h-0.5 w-0 bg-gradient-to-r from-gold-500 to-gold-600 group-hover:w-full transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider-gold my-16" />

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-foreground/70 text-lg mb-8">
            Ready to create your first dungeon?
          </p>
          <button className="fantasy-button group text-lg px-8 py-4">
            <span className="relative z-10">Start Generating Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-700 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
          </button>
        </div>
      </div>
    </section>
  );
}
