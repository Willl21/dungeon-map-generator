import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProfileCard from "@/components/ProfileCard";
import StatisticsCards from "@/components/StatisticsCards";
import RecentMapsGallery from "@/components/RecentMapsGallery";
import Achievements from "@/components/Achievements";
import ActivityTimeline from "@/components/ActivityTimeline";

export default function Dashboard() {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    // Guard: jika token expired / tidak ada, redirect ke login
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login", { replace: true });
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) return null;
    return (
        <div className="dashboard-bg min-h-screen">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Main Content */}
            <main className="md:ml-64 relative">
                {/* Background effects */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    {/* Floating particles */}
                    <div className="absolute top-20 right-10 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-40 left-10 w-72 h-72 bg-gold-600/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
                    <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />

                    {/* Vignette effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/20 pointer-events-none" />
                </div>

                {/* Content wrapper */}
                <div className="relative z-10 p-6 md:p-8 space-y-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gold-300 mb-2">
                            Welcome, Adventurer
                        </h1>
                        <p className="text-foreground/60">
                            Manage your dungeons, track achievements, and continue your legend
                        </p>
                    </div>

                    {/* Profile Card */}
                    <section>
                        <ProfileCard />
                    </section>

                    {/* Statistics Section */}
                    <section className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-gold-300 mb-2">
                                Your Statistics
                            </h2>
                            <p className="text-foreground/60 text-sm">
                                Overview of your dungeon mastery progress
                            </p>
                        </div>
                        <StatisticsCards />
                    </section>

                    {/* Recent Maps Gallery */}
                    <section>
                        <RecentMapsGallery />
                    </section>

                    {/* Two Column Layout for Achievements and Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Achievements */}
                        <Achievements />

                        {/* Activity Timeline */}
                        <ActivityTimeline />
                    </div>

                    {/* Footer spacing */}
                    <div className="h-12" />
                </div>
            </main>
        </div>
    );
}
