import { MapPin, Download, Sparkles, HardDrive } from "lucide-react";
import { MapMeta } from "@/lib/mapApi";
import { useMemo } from "react";

export default function StatisticsCards({ maps }: { maps: MapMeta[] }) {
    const stats = useMemo(() => {
        const totalMaps = maps.length;
        const aiBeautified = maps.filter((m) => m.beautify).length;
        // Estimate storage used: 1.5 MB per map roughly
        const storageUsedMB = totalMaps * 1.5;
        const storageDisplay = storageUsedMB > 1000 
            ? (storageUsedMB / 1024).toFixed(1) + " GB"
            : storageUsedMB.toFixed(1) + " MB";

        return [
            {
                label: "TOTAL MAPS",
                value: String(totalMaps),
                icon: <MapPin className="h-5 w-5" />,
            },
            {
                label: "DOWNLOADS",
                value: "0",
                icon: <Download className="h-5 w-5" />,
            },
            {
                label: "AI BEAUTIFY USAGE",
                value: String(aiBeautified),
                icon: <Sparkles className="h-5 w-5" />,
            },
            {
                label: "STORAGE USED",
                value: storageDisplay,
                icon: <HardDrive className="h-5 w-5" />,
            },
        ];
    }, [maps]);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="group relative bg-stone-900/80 border border-gold-900/30 rounded-xl p-5 hover:border-gold-700/50 transition-all duration-300 overflow-hidden cursor-default"
                >
                    {/* Subtle hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-600/0 to-gold-600/0 group-hover:from-gold-600/5 group-hover:to-transparent transition-all duration-500 rounded-xl pointer-events-none" />

                    <div className="relative z-10">
                        {/* Icon */}
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-700/20 to-gold-700/5 border border-gold-800/30 flex items-center justify-center text-gold-500 mb-4">
                            {stat.icon}
                        </div>

                        {/* Value */}
                        <div className="text-3xl font-serif font-bold text-gold-300 mb-1 tracking-tight">
                            {stat.value}
                        </div>

                        {/* Label */}
                        <div className="text-[10px] font-sans font-bold tracking-[0.15em] text-foreground/40 uppercase">
                            {stat.label}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
