import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Register failed");
      }

      setSuccess("Account created successfully!");

      // redirect ke login
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err: any) {
        console.error(err);
        setError(err.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col">

      {/* NAVBAR */}
      <nav className="border-b border-gold-900/30">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center">
          <Link to="/" className="text-2xl font-bold text-gold-400">
            Dungeon Generator
          </Link>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">

          <div className="card-dark rounded-2xl p-8 space-y-6">

            <h1 className="text-3xl font-bold text-center">
              Create Account
            </h1>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            {success && (
              <p className="text-green-400 text-sm text-center">{success}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* USERNAME */}
              <div className="relative">
                <User className="absolute left-3 top-3 text-gold-600" />
                <input
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="fantasy-input pl-10"
                />
              </div>

              {/* EMAIL */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gold-600" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="fantasy-input pl-10"
                />
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gold-600" />
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="fantasy-input pl-10"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full fantasy-button"
              >
                {isLoading ? "Creating..." : "Register"}
              </button>
            </form>

            <p className="text-center text-sm">
              Already have account?{" "}
              <Link to="/login" className="text-gold-400">
                Login
              </Link>
            </p>

          </div>

          <div className="text-center mt-4">
            <Link to="/" className="text-sm text-gray-400">
              ← Back
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}