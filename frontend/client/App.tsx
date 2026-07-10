import "./global.css";
import { AuthProvider, useAuth } from "./context/AuthContext";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { BackgroundManager, BackgroundProvider } from "@/background";

import Index from "./pages/Index";
import Generate from "./pages/Generate";
import FeaturesPage from "./pages/Features";
import About from "./pages/About";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard";
import MyMaps from "./pages/mymaps";

// =====================
// PROTECTED ROUTE
// =====================
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

const queryClient = new QueryClient();

let root: ReturnType<typeof createRoot> | null = null;

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {/* BackgroundProvider + BackgroundManager are mounted once, above
            the router, so the background is never unmounted/recreated by
            navigation — it's one continuous, living canvas for the whole
            app, not something each route renders for itself. */}
        <BackgroundProvider>
          <BackgroundManager />

          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-maps"
                element={
                  <ProtectedRoute>
                    <MyMaps />
                  </ProtectedRoute>
                }
              />

              {/* fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </BackgroundProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

const container = document.getElementById("root");

if (container) {
  if (!root) {
    root = createRoot(container);
  }

  root.render(<App />);
}