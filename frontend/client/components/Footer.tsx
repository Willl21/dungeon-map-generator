import { Link } from "react-router-dom";
import { Github, Mail, BookOpen } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 border-t border-gold-900/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="group">
              <div className="text-xl font-serif font-bold">
                <span className="text-gradient">Dungeon</span>
                <span className="text-gold-400 ml-2">Generator</span>
              </div>
            </Link>
            <p className="text-foreground/60 text-sm mt-2">
              Forge your own dungeons with procedural generation
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold-400 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-foreground/70 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-gold-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/generate"
                  className="hover:text-gold-400 transition-colors"
                >
                  Generator
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="hover:text-gold-400 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-gold-400 transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-gold-400 font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-foreground/70 text-sm">
              <li>
                <a
                  href="https://www.dndbeyond.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 transition-colors"
                >
                  D&D Beyond
                </a>
              </li>
              <li>
                <a
                  href="https://www.dndbeyond.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 transition-colors"
                >
                  Map Resources
                </a>
              </li>
              <li>
                <a
                  href="https://www.dndbeyond.com/characters/create"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 transition-colors"
                >
                  Character Creation
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold-400 font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-gold-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@dungeongenerator.com"
                className="text-foreground/70 hover:text-gold-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="#docs"
                className="text-foreground/70 hover:text-gold-400 transition-colors"
                aria-label="Documentation"
              >
                <BookOpen className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-gold mb-8" />

        {/* Copyright */}
        <div className="text-center text-foreground/50 text-sm">
          <p>
            &copy; {currentYear} Dungeon Generator. Forged with fantasy and
            procedural magic.
          </p>
        </div>
      </div>
    </footer>
  );
}
