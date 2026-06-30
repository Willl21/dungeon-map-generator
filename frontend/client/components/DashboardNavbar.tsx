import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardNavbar() {
    const navigate = useNavigate();

    return (
        <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-gold-900/40 backdrop-blur-md">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left — Logo & Title */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate("/")}
                    >
                        {/* Chest/Book Icon */}
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-600/30 to-gold-700/10 border border-gold-700/40 flex items-center justify-center text-gold-400 group-hover:border-gold-500/60 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                <rect x="2" y="7" width="20" height="14" rx="2" />
                                <path d="M16 7V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v4" />
                                <path d="M12 11v4" />
                                <path d="M10 13h4" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-gold-500 uppercase leading-none">
                                Dungeon Generator
                            </span>
                            <span className="text-sm font-serif font-bold text-gold-300 italic leading-tight mt-0.5">
                                The Adventurer's Journal
                            </span>
                        </div>
                    </div>

                    {/* Center — Close Button (mobile: right, desktop: center) */}
                    <button
                        onClick={() => navigate("/")}
                        className="md:absolute md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-stone-800/80 border border-gold-900/30 flex items-center justify-center text-foreground/60 hover:text-gold-400 hover:border-gold-600/50 transition-all duration-300 hover:bg-stone-700/50"
                        title="Return to Home"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Right — Fantasy Date */}
                    <div className="hidden sm:block text-right">
                        <span className="text-xs font-serif italic text-foreground/40">
                            Moon of the Long Night · 1372 DR
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
