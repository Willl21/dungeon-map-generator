import { Crown, Edit3 } from "lucide-react";
import { UserInfo, MapMeta } from "@/lib/mapApi";
import { useMemo } from "react";

// Helper to calculate the most frequent item in an array
function getMostFrequent(arr: string[]): string {
    if (!arr.length) return "-";
    const freq: Record<string, number> = {};
    arr.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}

function capitalize(s: string): string {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : "-";
}

function formatJoinDate(isoString: string | undefined): string {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export default function ProfileCard({ user, maps }: { user: UserInfo | null, maps: MapMeta[] }) {
    // Dynamic calculations based on real data
    const stats = useMemo(() => {
        const totalMaps = maps.length;
        const aiBeautified = maps.filter(m => m.beautify).length;
        
        const environments = maps.map(m => m.environment);
        const mapTypes = maps.map(m => m.map_type);
        const shapes = maps.map(m => m.image_preset ?? "square");

        const maxXP = 7000;
        const currentXP = Math.min(totalMaps * 100 + aiBeautified * 50, maxXP); // 100 XP per map, 50 XP per beautify
        
        // Let's invent a level calculation based on XP
        const level = Math.floor(currentXP / 500) + 1;
        const xpPercentage = Math.round((currentXP / maxXP) * 100);

        return {
            currentXP,
            maxXP,
            level,
            xpPercentage,
            totalMaps,
            aiBeautified,
            favoriteEnv: capitalize(getMostFrequent(environments)),
            favoriteType: capitalize(getMostFrequent(mapTypes)),
            favoriteShape: capitalize(getMostFrequent(shapes)),
        };
    }, [maps]);

    return (
        <div className="relative bg-stone-900/80 border border-gold-900/30 rounded-xl overflow-hidden">
            {/* Top decorative border glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />

            {/* Avatar Section */}
            <div className="flex flex-col items-center pt-8 pb-5 px-6">
                {/* Crown Avatar */}
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-stone-800 to-stone-700 border-2 border-gold-700/40 flex items-center justify-center">
                        <Crown className="h-10 w-10 text-gold-500/70" />
                    </div>
                    {/* Subtle glow ring */}
                    <div className="absolute inset-0 rounded-full border border-gold-500/10 animate-pulse" style={{ animationDuration: "4s" }} />
                </div>

                {/* Username */}
                <h2 className="text-xl font-serif font-bold text-foreground mb-0.5 text-center">
                    {user?.username ?? "Adventurer"}
                </h2>
                {/* Title */}
                <p className="text-[10px] font-sans font-bold tracking-[0.2em] text-gold-500 uppercase mb-3">
                    MASTER CARTOGRAPHER
                </p>

                {/* Rank Badge */}
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gold-700/15 border border-gold-700/30">
                    <span className="text-[10px] font-sans font-bold tracking-[0.15em] text-gold-400 uppercase">
                        CARTOGRAPHER · RANK VII
                    </span>
                </div>
            </div>

            {/* Divider */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-gold-800/30 to-transparent" />

            {/* Level & XP Section */}
            <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-sans font-bold tracking-[0.15em] text-foreground/50 uppercase">
                        Level {stats.level}
                    </span>
                    <span className="text-[10px] font-mono text-foreground/40">
                        {stats.currentXP.toLocaleString()} / {stats.maxXP.toLocaleString()} XP
                    </span>
                </div>
                {/* XP Progress Bar */}
                <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden border border-gold-900/20">
                    <div
                        className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-700"
                        style={{ width: `${stats.xpPercentage}%` }}
                    />
                </div>
            </div>

            {/* Divider */}
            <div className="mx-6 h-px bg-gradient-to-r from-transparent via-gold-800/30 to-transparent" />

            {/* Character Info Rows */}
            <div className="px-6 py-4 space-y-3">
                <InfoRow label="Member Since" value={formatJoinDate(user?.created_at)} />
                <InfoRow label="Maps Generated" value={String(stats.totalMaps)} />
                <InfoRow label="Downloads" value="0" /> {/* Backend does not track downloads yet */}
                <InfoRow label="AI Beautified Maps" value={String(stats.aiBeautified)} />
                <InfoRow label="Favorite Environment" value={stats.favoriteEnv} highlight />
                <InfoRow label="Favorite Map Type" value={stats.favoriteType} highlight />
                <InfoRow label="Favorite Map Shape" value={stats.favoriteShape} highlight />
            </div>

            {/* Edit Profile Button */}
            <div className="px-6 pb-6 pt-2">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold-700/20 to-gold-700/10 border border-gold-700/30 rounded-lg text-gold-400 text-xs font-bold tracking-[0.1em] uppercase hover:from-gold-700/30 hover:to-gold-700/20 hover:border-gold-600/50 transition-all duration-300">
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit Profile
                </button>
            </div>

            {/* Bottom decorative border glow */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-600/20 to-transparent" />
        </div>
    );
}

// =====================
// HELPER COMPONENT
// =====================
function InfoRow({
    label,
    value,
    highlight = false,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs text-foreground/50">{label}</span>
            <span
                className={`text-xs font-semibold ${
                    highlight ? "text-gold-400" : "text-foreground/80"
                }`}
            >
                {value}
            </span>
        </div>
    );
}
