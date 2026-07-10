import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-stone-900 text-foreground">
      <Navbar />
      <main className={`flex-1 ${!isHome ? "pt-20" : ""}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
