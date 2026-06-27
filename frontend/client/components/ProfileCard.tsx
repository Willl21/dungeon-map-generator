import { Sparkles, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchMyMaps } from "@/lib/mapApi";

const BASE_URL = "http://127.0.0.1:8000";

interface UserInfo {
    id: number;
    username: string;
    email: string;
    created_at: string;
}

function formatJoinDate(isoString: string): string {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

async function fetchMe(): Promise<UserInfo> {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("NOT_LOGGED_IN");
    const res = await fetch(`${BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to load profile");
    return res.json();
}

export default function ProfileCard() {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [totalMaps, setTotalMaps] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([fetchMe(), fetchMyMaps()])
            .then(([userInfo, maps]) => {
                setUser(userInfo);
                setTotalMaps(maps.length);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="relative card-dark rounded-2xl p-8 border-2 border-gold-600/40 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-slate-700 mb-4" />
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 bg-slate-700 rounded w-2/3" />
                        <div className="h-4 bg-slate-800 rounded w-1/2" />
                        <div className="h-4 bg-slate-800 rounded w-1/3" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`${i === 3 ? "col-span-2" : ""} h-20 bg-slate-700/40 rounded-lg`} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 via-gold-600/10 to-transparent rounded-2xl blur-2xl" />

            <div className="relative card-dark rounded-2xl p-8 backdrop-blur-xl border-2 border-gold-600/40 overflow-hidden">
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-400/50 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold-400/50 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-400/50 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-400/50 rounded-br-xl" />

                {/* Content */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 p-1 animate-pulse-glow">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-800 via-gold-900 to-stone-900 flex items-center justify-center">
                                    <Sparkles className="h-12 w-12 text-gold-300" />
                                </div>
                            </div>
                        </div>
                        <p className="text-gold-400 font-semibold text-sm">Dungeon Architect</p>
                    </div>

                    {/* Player Info */}
                    <div className="space-y-3">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-gold-300">
                                {user?.username ?? "Adventurer"}
                            </h2>
                            <p className="text-foreground/70 mt-1">{user?.email ?? ""}</p>
                        </div>
                        <div className="space-y-2 pt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-foreground/60">Joined</span>
                                <span className="text-foreground/80">
                                    {user?.created_at ? formatJoinDate(user.created_at) : "-"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-foreground/60">Total Maps</span>
                                <span className="text-gold-400 font-semibold">{totalMaps}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-gold-600/20 to-gold-600/10 border border-gold-600/30 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gold-300">{totalMaps}</div>
                            <div className="text-xs text-foreground/60 mt-1">Maps Generated</div>
                        </div>
                        <div className="bg-gradient-to-br from-gold-700/20 to-gold-600/10 border border-gold-700/30 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gold-400">
                                {user ? new Date(user.created_at).getFullYear() : "-"}
                            </div>
                            <div className="text-xs text-foreground/60 mt-1">Member Since</div>
                        </div>
                        <div className="col-span-2 bg-gradient-to-r from-gold-600/20 to-gold-600/10 border border-gold-600/30 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gold-300">
                                {user?.username?.[0]?.toUpperCase() ?? "?"}
                            </div>
                            <div className="text-xs text-foreground/60 mt-1">Adventurer Initial</div>
                        </div>
                    </div>
                </div>

                {/* Magical particles */}
                <div className="absolute top-10 right-10 w-2 h-2 bg-gold-400 rounded-full opacity-60 animate-float" />
                <div className="absolute bottom-20 left-10 w-1.5 h-1.5 bg-gold-500 rounded-full opacity-40 animate-float" style={{ animationDelay: "2s" }} />
            </div>
        </div>
    );
}
