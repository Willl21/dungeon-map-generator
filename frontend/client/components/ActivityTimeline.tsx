import { Sparkles, Download, Heart, Trash2 } from "lucide-react";

interface ActivityEvent {
    id: string;
    action: string;
    details: string;
    timestamp: string;
    type: "create" | "download" | "favorite" | "delete";
}

const activityEvents: ActivityEvent[] = [
    {
        id: "1",
        action: "Generated Map",
        details: "Created Ice Dungeon - Crystal Caverns",
        timestamp: "2 hours ago",
        type: "create",
    },
    {
        id: "2",
        action: "Downloaded Map",
        details: "Downloaded Shadowmere Fortress (5 hours ago map)",
        timestamp: "1 hour ago",
        type: "download",
    },
    {
        id: "3",
        action: "Favorited Map",
        details: "Added Swamp Sanctuary to favorites",
        timestamp: "5 hours ago",
        type: "favorite",
    },
    {
        id: "4",
        action: "Generated Map",
        details: "Created Volcanic Dungeon - Obsidian Depths",
        timestamp: "1 day ago",
        type: "create",
    },
    {
        id: "5",
        action: "Downloaded Map",
        details: "Downloaded Frostbite Citadel",
        timestamp: "2 days ago",
        type: "download",
    },
    {
        id: "6",
        action: "Generated Map",
        details: "Created Enchanted Forest - Mystic Grove",
        timestamp: "1 week ago",
        type: "create",
    },
];

function getActivityIcon(type: string) {
    switch (type) {
        case "create":
            return <Sparkles className="h-4 w-4" />;
        case "download":
            return <Download className="h-4 w-4" />;
        case "favorite":
            return <Heart className="h-4 w-4" />;
        case "delete":
            return <Trash2 className="h-4 w-4" />;
        default:
            return <Sparkles className="h-4 w-4" />;
    }
}

function getActivityColor(type: string) {
    switch (type) {
        case "create":
            return "from-cyan-600 to-cyan-700";
        case "download":
            return "from-emerald-600 to-emerald-700";
        case "favorite":
            return "from-gold-600 to-gold-700";
        case "delete":
            return "from-red-600 to-red-700";
        default:
            return "from-cyan-600 to-cyan-700";
    }
}

export default function ActivityTimeline() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-serif font-bold text-cyan-300 mb-2">
                    Activity Journal
                </h2>
                <p className="text-foreground/60 text-sm">
                    Your recent adventures and creations
                </p>
            </div>

            <div className="card-magical rounded-xl p-6 border-cyan-600/30">
                <div className="space-y-6">
                    {activityEvents.map((event, index) => (
                        <div key={event.id} className="relative">
                            {/* Timeline line connector (except for last item) */}
                            {index < activityEvents.length - 1 && (
                                <div className="absolute left-7 top-12 w-0.5 h-8 bg-gradient-to-b from-cyan-500/50 to-transparent pointer-events-none" />
                            )}

                            <div className="flex gap-4">
                                {/* Timeline icon */}
                                <div
                                    className={`relative flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br ${getActivityColor(
                                        event.type
                                    )} flex items-center justify-center text-white shadow-lg border border-white/20`}
                                >
                                    {getActivityIcon(event.type)}
                                    <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
                                </div>

                                {/* Event content */}
                                <div className="flex-1 pt-1">
                                    <h3 className="font-semibold text-foreground mb-1">
                                        {event.action}
                                    </h3>
                                    <p className="text-foreground/70 text-sm mb-2">
                                        {event.details}
                                    </p>
                                    <p className="text-foreground/50 text-xs font-mono">
                                        {event.timestamp}
                                    </p>
                                </div>

                                {/* Decorative element */}
                                <div className="flex-shrink-0 h-1 w-1 bg-cyan-500/50 rounded-full mt-2" />
                            </div>

                            {/* Divider */}
                            {index < activityEvents.length - 1 && (
                                <div className="divider-cyan my-4" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* View all activities link */}
            <button className="w-full px-4 py-3 text-center border border-cyan-600/30 rounded-lg text-cyan-400 hover:bg-cyan-600/10 transition-all duration-300 font-semibold text-sm">
                View All Activities
            </button>
        </div>
    );
}
