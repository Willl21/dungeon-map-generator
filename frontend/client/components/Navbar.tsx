import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import EvilEye from "./ui/EvilEye";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-stone-900 border-b border-gold-900/30 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-20">

          {/* LOGO */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="w-12 h-12 flex-shrink-0">
              <EvilEye
                eyeColor="#FF6F37"
                intensity={1.5}
                pupilSize={0.6}
                irisWidth={0.25}
                glowIntensity={0.35}
                scale={0.8}
                noiseScale={1}
                pupilFollow={1}
                flameSpeed={1}
              />
            </div>
            <div className="text-2xl md:text-3xl font-serif font-bold">
              <span className="text-gradient">Dungeon</span>
              <span className="text-gold-400 ml-2">Generator</span>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-gold-400">Home</Link>
            <Link to="/features" className="hover:text-gold-400">Features</Link>
            <Link to="/about" className="hover:text-gold-400">About</Link>
            {isLoggedIn && (
              <Link to="/dashboard" className="hover:text-gold-400">Dashboard</Link>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex items-center space-x-4">

            {!isLoggedIn ? (
              <>
                {/* BELUM LOGIN */}
                <button
                  onClick={() => navigate("/login")}
                  className="fantasy-button"
                >
                  Generate Map
                </button>
              </>
            ) : (
              <>
                {/* SUDAH LOGIN */}
                <button
                  onClick={() => navigate("/generate")}
                  className="fantasy-button"
                >
                  Generate Map
                </button>

                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 font-semibold"
                >
                  Logout
                </button>
              </>
            )}

          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gold-400"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-6 space-y-4 border-t border-gold-900/30">

            <Link to="/" onClick={() => setIsOpen(false)} className="block py-1 hover:text-gold-400">Home</Link>
            <Link to="/generate" onClick={() => setIsOpen(false)} className="block py-1 hover:text-gold-400">Generate</Link>
            <Link to="/features" onClick={() => setIsOpen(false)} className="block py-1 hover:text-gold-400">Features</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block py-1 hover:text-gold-400">About</Link>

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block font-semibold"
                >
                  Sign In
                </Link>

                <button
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="fantasy-button w-full"
                >
                  Generate Map
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block font-semibold hover:text-gold-400"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    navigate("/generate");
                    setIsOpen(false);
                  }}
                  className="fantasy-button w-full"
                >
                  Generate Map
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-red-400 w-full text-left"
                >
                  Logout
                </button>
              </>
            )}

          </div>
        )}
      </div>
    </nav>
  );
}