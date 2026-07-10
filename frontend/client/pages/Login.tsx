import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { BackgroundState } from "@/background";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");

  // 🔥 redirect kalau sudah login
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================
  // LOGIN KE BACKEND
  // =====================
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();

      // 🔥 pakai context
      login(data.access_token);

      if (formData.rememberMe) {
        localStorage.setItem("email", formData.email);
      }

      navigate("/generate");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }

    setIsLoading(false);
  };

  return (
    <BackgroundState id="auth" className="relative z-10 flex min-h-screen flex-col">
      {/* NAVBAR */}
      <nav className="relative z-10 border-b border-gold-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="group">
              <div className="text-2xl md:text-3xl font-serif font-bold">
                <span className="text-gradient">Dungeon</span>
                <span className="text-gold-400 ml-2">Generator</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* BACKGROUND EFFECT */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-900/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          </div>

          {/* CARD */}
          <div className="relative z-10 card-dark rounded-2xl p-8 md:p-12 space-y-8">

            {/* HEADER */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                Enter the Dungeon
              </h1>
              <p className="text-foreground/60 text-sm">
                Sign in to access your generated maps
              </p>
            </div>

            <div className="divider-gold" />

            {/* ERROR */}
            {error && (
              <p className="text-red-400 text-sm text-center">
                {error}
              </p>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="block text-gold-400 text-sm">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gold-600/60" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="fantasy-input pl-12"
                    placeholder="adventurer@gmail.com"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <label className="block text-gold-400 text-sm">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gold-600/60" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="fantasy-input pl-12 pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-400"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* REMEMBER */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  Remember me
                </label>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full fantasy-button py-3 disabled:opacity-50"
              >
                {isLoading ? "Unlocking..." : "Enter the Dungeon"}
              </button>
            </form>

            <div className="divider-gold" />

            {/* SIGNUP */}
            <p className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-gold-400">
                Create one
              </Link>
            </p>
          </div>

          <div className="text-center mt-8">
            <Link to="/" className="text-sm text-gray-400">
              ← Back to home
            </Link>
          </div>

        </div>
      </div>
    </BackgroundState>
  );
}