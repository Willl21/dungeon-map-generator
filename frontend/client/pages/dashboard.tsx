import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/ProfileCard";
import StatisticsCards from "@/components/StatisticsCards";
import RecentMapsGallery from "@/components/RecentMapsGallery";
import ActivityTimeline from "@/components/ActivityTimeline";
import { fetchMe, fetchMyMaps, UserInfo, MapMeta } from "@/lib/mapApi";
import { useActiveBackground } from "@/background";

export default function Dashboard() {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    useActiveBackground("dashboard");

    const [user, setUser] = useState<UserInfo | null>(null);
    const [maps, setMaps] = useState<MapMeta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [userData, mapsData] = await Promise.all([
                fetchMe(),
                fetchMyMaps(),
            ]);
            setUser(userData);
            setMaps(mapsData);
        } catch (err: any) {
            console.error("Dashboard data load error:", err);
            if (err.message === "NOT_LOGGED_IN" || err.message === "UNAUTHORIZED") {
                logout();
                navigate("/login", { replace: true });
            } else {
                setError("Failed to load dashboard data. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }, [logout, navigate]);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login", { replace: true });
            return;
        }
        loadData();
    }, [isLoggedIn, navigate, loadData]);

    if (!isLoggedIn) return null;

    // Loading State
    if (loading) {
        return (
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center pt-20">
                <Navbar />
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 border-4 border-gold-600/30 border-t-gold-500 rounded-full animate-spin" />
                    <p className="text-gold-400 font-serif animate-pulse">Consulting the ancient tomes...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center pt-20">
                <Navbar />
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-full bg-red-950/50 flex items-center justify-center text-red-500 text-3xl mb-4">
                        ⚠️
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-red-400 mb-2">A magical disturbance occurred</h2>
                    <p className="text-foreground/60 mb-6">{error}</p>
                    <button onClick={loadData} className="px-6 py-2.5 bg-red-900/40 text-red-300 rounded-lg hover:bg-red-900/60 transition-colors border border-red-800/50">
                        Retry Ritual
                    </button>
                </div>
            </div>
        );
    }

    const handleDeleteMap = (deletedId: number) => {
        setMaps((prev) => prev.filter(m => m.id !== deletedId));
    };

    return (
        <div className="relative z-10 min-h-screen">
            {/* Dashboard Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="relative pt-20">
                {/* Background effects */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-20 right-10 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-40 left-10 w-72 h-72 bg-gold-600/3 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
                </div>

                {/* Content wrapper */}
                <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                    {/* ─── Quick Stats Row ─── */}
                    <section>
                        <StatisticsCards maps={maps} />
                    </section>

                    {/* ─── Main Layout: Profile Sidebar + Maps Grid ─── */}
                    <section className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                        {/* Left Column — Character Sheet */}
                        <div className="lg:sticky lg:top-[80px] lg:self-start">
                            <ProfileCard user={user} maps={maps} />
                        </div>

                        {/* Right Column — My Generated Maps */}
                        <div>
                            <RecentMapsGallery 
                                maps={maps} 
                                onDeleteMap={handleDeleteMap} 
                                onRefresh={loadData} 
                            />
                        </div>
                    </section>

                    {/* ─── Recent Activity ─── */}
                    <section>
                        <ActivityTimeline maps={maps} />
                    </section>

                    {/* Footer spacing */}
                    <div className="h-8" />
                </div>
            </main>
        </div>
    );
}
