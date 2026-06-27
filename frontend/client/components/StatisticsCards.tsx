import { MapPin, Flame, Zap, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchMyMaps, MapMeta } from "@/lib/mapApi";

// =====================
// HELPERS
// =====================
function getMostFrequent(arr: string[]): string {
    if (!arr.length) return "-";
    const freq: Record<string, number> = {};
    arr.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}

function capitalize(s: string): string {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : "-";
}

// =====================
// SKELETON CARD
// =====================
function SkeletonCard() {
    return (
        <div className="magical-card card-dark bg-gradient-to-br from-gold-600/10 to-gold-600/5 border-gold-600/30 animate-pulse">
            <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 rounded-lg bg-slate-700/60" />
                <div className="space-y-2">
                    <div className="h-3 bg-slate-700/60 rounded w-3/4" />
                    <div className="h-6 bg-slate-700/40 rounded w-1/2" />
                </div>
            </div>
        </div>
    );
}

// =====================
// COMPONENT
// =====================
export default function StatisticsCards() {
    const [maps, setMaps] = useState<MapMeta[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyMaps()
            .then(setMaps)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
            </div>
        );
    }

    // Compute stats from real data
    const totalMaps = maps.length;
    const environments = maps.map((m) => m.environment);
    const mapTypes = maps.map((m) => m.map_type);
    const beautifyCount = maps.filter((m) => m.beautify).length;
    const beautifyPct = totalMaps > 0 ? Math.round((beautifyCount / totalMaps) * 100) : 0;

    const stats = [
        {
            title: "Total Maps Generated",
            value: totalMaps,
            icon: <MapPin className="h-8 w-8" />,
            color: "text-gold-400",
            bgGradient: "from-gold-600/20 to-gold-600/5",
            borderColor: "border-gold-600/40",
        },
        {
            title: "Favorite Environment",
            value: capitalize(getMostFrequent(environments)),
            icon: <Flame className="h-8 w-8" />,
            color: "text-gold-300",
            bgGradient: "from-gold-700/20 to-gold-600/5",
            borderColor: "border-gold-700/40",
        },
        {
            title: "Favorite Map Type",
            value: capitalize(getMostFrequent(mapTypes)),
            icon: <Zap className="h-8 w-8" />,
            color: "text-gold-400",
            bgGradient: "from-gold-600/20 to-gold-600/5",
            borderColor: "border-gold-600/40",
        },
        {
            title: "AI Beautify Usage",
            value: `${beautifyPct}%`,
            icon: <Wand2 className="h-8 w-8" />,
            color: "text-gold-300",
            bgGradient: "from-gold-700/20 to-gold-700/5",
            borderColor: "border-gold-700/40",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className={`magical-card card-dark bg-gradient-to-br ${stat.bgGradient} ${stat.borderColor} group cursor-pointer`}
                >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 via-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />

                    <div className="relative z-10 space-y-4">
                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${stat.bgGradient} border ${stat.borderColor} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                            {stat.icon}
                        </div>

                        {/* Content */}
                        <div>
                            <h3 className="text-foreground/70 text-sm font-semibold mb-2">
                                {stat.title}
                            </h3>
                            <p className={`text-2xl font-bold ${stat.color}`}>
                                {stat.value}
                            </p>
                        </div>

                        {/* Progress bar for percentage values */}
                        {typeof stat.value === "string" && stat.value.includes("%") && (
                            <div className="mt-4 pt-4 border-t border-gold-600/20">
                                <div className="w-full h-1.5 bg-slate-800/50 rounded-full overflow-hidden border border-gold-600/20">
                                    <div
                                        className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-700"
                                        style={{ width: stat.value }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Decorative element */}
                        <div className="absolute top-2 right-2 w-1 h-1 bg-cyan-400 rounded-full opacity-60" />
                    </div>
                </div>
            ))}
        </div>
    );
}
