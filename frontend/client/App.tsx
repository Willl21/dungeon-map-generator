import "./global.css";
import { AuthProvider, useAuth } from "./context/AuthContext";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

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

// Page-transition fade. Kept short and opacity-only: the fixed
// BackgroundManager lives OUTSIDE this wrapper, so navigation only
// crossfades the page *content* over a background that stays continuous.
// Opacity (unlike transform/filter) creates no containing block, so Hero's
// absolutely-positioned video and the fixed Navbar keep sizing/positioning
// against the viewport during the fade.
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      // Reset scroll the instant the old page has left and just before the
      // new one mounts — so every page opens at the top without the old
      // page visibly jumping during its fade-out.
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      >
        <Routes location={location}>
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
      </motion.div>
    </AnimatePresence>
  );
}

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
            <AnimatedRoutes />
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