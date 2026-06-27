import { Lock, Star } from "lucide-react";

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedDate?: string;
}

const achievements: Achievement[] = [
    {
        id: "1",
        title: "First Adventure",
        description: "Generate your first dungeon map",
        icon: "🗺️",
        unlocked: true,
        unlockedDate: "March 15, 2024",
    },
    {
        id: "2",
        title: "Master Cartographer",
        description: "Generate 50 unique maps",
        icon: "🎨",
        unlocked: true,
        unlockedDate: "May 20, 2024",
    },
    {
        id: "3",
        title: "Frozen Realm Creator",
        description: "Create 10 ice/snow themed maps",
        icon: "❄️",
        unlocked: true,
        unlockedDate: "June 1, 2024",
    },
    {
        id: "4",
        title: "Dungeon Lord",
        description: "Generate 100 maps",
        icon: "👑",
        unlocked: false,
    },
    {
        id: "5",
        title: "Speed Runner",
        description: "Generate 5 maps in a single session",
        icon: "⚡",
        unlocked: false,
    },
    {
        id: "6",
        title: "Legendary Creator",
        description: "Get 1000 total downloads",
        icon: "⭐",
        unlocked: false,
    },
    {
        id: "7",
        title: "Architect Supreme",
        description: "Generate 500 maps",
        icon: "🏛️",
        unlocked: false,
    },
    {
        id: "8",
        title: "Community Hero",
        description: "Have maps liked by 100 users",
        icon: "🦸",
        unlocked: false,
    },
];

export default function Achievements() {
    const unlockedCount = achievements.filter((a) => a.unlocked).length;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-serif font-bold text-cyan-300 mb-2">
                    Achievements
                </h2>
                <p className="text-foreground/60 text-sm">
                    Unlock badges by completing legendary deeds — {unlockedCount} of{" "}
                    {achievements.length} achievements unlocked
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className={`group relative p-4 rounded-xl border transition-all duration-300 ${achievement.unlocked
                                ? "card-magical border-emerald-600/40 cursor-pointer hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1"
                                : "bg-slate-900/40 border-slate-700/40 opacity-60 cursor-not-allowed"
                            }`}
                    >
                        {/* Glow effect for unlocked */}
                        {achievement.unlocked && (
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}

                        <div className="relative z-10 flex flex-col items-center text-center">
                            {/* Icon */}
                            <div className="text-4xl mb-3">{achievement.icon}</div>

                            {/* Lock indicator for locked achievements */}
                            {!achievement.unlocked && (
                                <Lock className="absolute top-2 right-2 h-4 w-4 text-slate-500" />
                            )}

                            {/* Star indicator for unlocked */}
                            {achievement.unlocked && (
                                <Star className="absolute top-2 right-2 h-4 w-4 text-gold-400 fill-gold-400" />
                            )}

                            {/* Title */}
                            <h3 className="font-serif font-bold text-sm text-foreground mb-1 leading-tight">
                                {achievement.title}
                            </h3>

                            {/* Description */}
                            <p className="text-xs text-foreground/60 mb-2">
                                {achievement.description}
                            </p>

                            {/* Unlocked date */}
                            {achievement.unlocked && achievement.unlockedDate && (
                                <p className="text-xs text-emerald-400/70 pt-2 border-t border-emerald-600/20 w-full mt-2">
                                    {achievement.unlockedDate}
                                </p>
                            )}

                            {/* Progress for locked */}
                            {!achievement.unlocked && (
                                <div className="text-xs text-slate-500 pt-2">Locked</div>
                            )}
                        </div>

                        {/* Ornate corner decorations for unlocked */}
                        {achievement.unlocked && (
                            <>
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-400/50" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-400/50" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-400/50" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-400/50" />
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Progress stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-cyan-600/20">
                <div className="card-magical rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-cyan-300">{unlockedCount}</div>
                    <div className="text-xs text-foreground/60 mt-1">Unlocked</div>
                </div>
                <div className="card-magical rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-400">
                        {achievements.length - unlockedCount}
                    </div>
                    <div className="text-xs text-foreground/60 mt-1">Locked</div>
                </div>
                <div className="card-magical rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gold-400">
                        {Math.round((unlockedCount / achievements.length) * 100)}%
                    </div>
                    <div className="text-xs text-foreground/60 mt-1">Completion</div>
                </div>
            </div>
        </div>
    );
}
