import { Sparkles, Download, Trash2, UserCog, Wand2, Clock, MapPin } from "lucide-react";
import { MapMeta } from "@/lib/mapApi";
import { useMemo } from "react";

// Helper for relative time
function timeAgo(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getIconColor(type: string): string {
    switch (type) {
        case "generate":
            return "text-gold-400";
        case "download":
            return "text-gold-500";
        case "beautify":
            return "text-emerald-400";
        case "delete":
            return "text-red-400/70";
        case "profile":
            return "text-gold-400";
        default:
            return "text-gold-400";
    }
}

export default function ActivityTimeline({ maps }: { maps: MapMeta[] }) {
    // Generate activity based on maps
    const activities = useMemo(() => {
        if (!maps || maps.length === 0) return [];

        const evts = maps.map(m => {
            let desc = `Generated ${m.environment} ${m.map_type}`;
            let type = "generate";
            let icon = <MapPin className="h-4 w-4" />;
            
            if (m.beautify) {
                desc = `AI Beautified ${m.environment} ${m.map_type}`;
                type = "beautify";
                icon = <Sparkles className="h-4 w-4" />;
            }
            
            return {
                id: `act-${m.id}`,
                icon,
                description: desc,
                timestampStr: m.created_at,
                timestamp: new Date(m.created_at).getTime(),
                type
            };
        });

        // Sort by timestamp descending
        evts.sort((a, b) => b.timestamp - a.timestamp);
        
        // Take top 8 recent
        return evts.slice(0, 8);
    }, [maps]);
    return (
        <div className="space-y-5">
            {/* Section Title */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-700/20 to-gold-700/5 border border-gold-800/30 flex items-center justify-center text-gold-500">
                    <Clock className="h-4 w-4" />
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-gold-400">
                    Recent Activity
                </h2>
            </div>

            {/* Activity List */}
            <div className="bg-stone-900/70 border border-gold-900/20 rounded-xl overflow-hidden">
                {activities.length === 0 ? (
                    <div className="px-5 py-8 text-center text-foreground/40 text-sm">
                        No activity recorded yet.
                    </div>
                ) : (
                    activities.map((event, index) => (
                        <div
                            key={event.id}
                            className={`flex items-center gap-4 px-5 py-4 hover:bg-gold-900/5 transition-colors duration-200 ${
                                index < activities.length - 1
                                    ? "border-b border-gold-900/10"
                                    : ""
                            }`}
                        >
                            {/* Icon */}
                            <div className={`flex-shrink-0 ${getIconColor(event.type)}`}>
                                {event.icon}
                            </div>

                            {/* Description */}
                            <span className="flex-1 text-sm text-foreground/80 font-medium capitalize">
                                {event.description}
                            </span>

                            {/* Timestamp */}
                            <span className="flex-shrink-0 text-xs text-foreground/30 font-mono">
                                {timeAgo(event.timestampStr)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
