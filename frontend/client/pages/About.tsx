import Layout from "@/components/Layout";
import { Heart, Users, Sparkles } from "lucide-react";

export default function About() {
  return (
    <Layout backgroundState="void">
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-serif font-bold mb-4">
              <span className="text-gradient">About Us</span>
            </h1>
            <p className="text-foreground/70 text-lg">
              Empowering Dungeons & Dragons players and dungeon masters with cutting-edge procedural generation
            </p>
          </div>

          {/* Mission Statement */}
          <div className="card-dark rounded-xl p-12 mb-12">
            <h2 className="text-3xl font-serif font-bold text-gold-400 mb-6">Our Mission</h2>
            <p className="text-foreground/80 text-lg leading-relaxed mb-6">
              The Dungeon Generator was created with a simple goal: to empower game masters and players 
              by removing the friction from dungeon creation. Whether you're preparing for your next campaign 
              or need inspiration mid-session, our procedurally-generated maps provide endless possibilities.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed">
              We believe that great adventures start with great environments. That's why we've built tools 
              that are both powerful and intuitive, letting you focus on what really matters—telling amazing stories.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-dark rounded-xl p-8 text-center">
              <Sparkles className="h-12 w-12 text-gold-400 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">Innovation</h3>
              <p className="text-foreground/70">
                We continuously push the boundaries of procedural generation to deliver better, more diverse maps.
              </p>
            </div>
            <div className="card-dark rounded-xl p-8 text-center">
              <Users className="h-12 w-12 text-gold-400 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">Community</h3>
              <p className="text-foreground/70">
                Built by tabletop enthusiasts, for tabletop enthusiasts. Your feedback shapes our future.
              </p>
            </div>
            <div className="card-dark rounded-xl p-8 text-center">
              <Heart className="h-12 w-12 text-gold-400 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">Passion</h3>
              <p className="text-foreground/70">
                We love what we do, and that passion is reflected in every feature we build.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="divider-gold my-12" />

          {/* CTA */}
          <div className="text-center">
            <p className="text-foreground/70 text-lg mb-8">
              Ready to experience the future of dungeon creation?
            </p>
            <button className="fantasy-button group text-lg px-8 py-4">
              <span className="relative z-10">Start Your Adventure</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-700 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity" />
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
