import { Download, Eye, Trash2, RefreshCw, Wand2, Search, ChevronDown, Sparkles } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapMeta, deleteMap, downloadMap } from "@/lib/mapApi";
import { toast } from "sonner";

// Gradient placeholders for map previews (fallback if image_url fails)
const mapGradients = [
    "from-stone-700 via-stone-600 to-stone-800",
    "from-stone-600 via-amber-900/30 to-stone-700",
    "from-red-950/40 via-stone-700 to-stone-800",
    "from-stone-600 via-stone-700 to-amber-950/30",
    "from-stone-700 via-stone-800 to-stone-600",
    "from-amber-950/30 via-stone-700 to-stone-800",
];

// Helper to format date
function formatDate(isoString: string): string {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

// =====================
// COMPONENT
// =====================
export default function RecentMapsGallery({
    maps,
    onDeleteMap,
    onRefresh,
}: {
    maps: MapMeta[];
    onDeleteMap: (id: number) => void;
    onRefresh: () => void;
}) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("All Types");
    const [filterEnv, setFilterEnv] = useState("All Environments");
    const [filterDate, setFilterDate] = useState("Any Date");
    const [filterMaps, setFilterMaps] = useState("All Maps");
    const [sortBy, setSortBy] = useState("Newest");
    const [selectedMap, setSelectedMap] = useState<MapMeta | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Filtered maps
    const filteredMaps = useMemo(() => {
        let result = [...maps];

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (m) =>
                    m.map_type.toLowerCase().includes(q) ||
                    String(m.seed).includes(q) ||
                    m.environment.toLowerCase().includes(q)
            );
        }

        // Type filter
        if (filterType !== "All Types") {
            result = result.filter((m) => m.map_type.toLowerCase() === filterType.toLowerCase());
        }

        // Environment filter
        if (filterEnv !== "All Environments") {
            result = result.filter((m) => m.environment.toLowerCase() === filterEnv.toLowerCase());
        }

        // Beautify filter
        if (filterMaps === "AI Beautified") {
            result = result.filter((m) => m.beautify);
        } else if (filterMaps === "Standard") {
            result = result.filter((m) => !m.beautify);
        }

        // Sort
        if (sortBy === "Oldest") {
            result.reverse();
        } else if (sortBy === "A-Z") {
            result.sort((a, b) => a.map_type.localeCompare(b.map_type));
        }

        return result;
    }, [maps, searchQuery, filterType, filterEnv, filterMaps, sortBy]);

    const handleDelete = async (map: MapMeta) => {
        if (!confirm(`Are you sure you want to delete this ${map.map_type} map?`)) return;
        setIsDeleting(true);
        try {
            await deleteMap(map.id);
            toast.success("Map deleted successfully");
            onDeleteMap(map.id);
            if (selectedMap?.id === map.id) setSelectedMap(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete map");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDownload = async (map: MapMeta) => {
        setIsDownloading(true);
        try {
            const blob = await downloadMap(map.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `map_${map.map_type}_${map.environment}_${map.seed}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success("Download started");
        } catch (error) {
            console.error(error);
            toast.error("Failed to download map");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-1">
                    My Generated Maps
                </h2>
                <p className="text-sm text-foreground/50">
                    Browse, download, and manage every world you've forged.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={() => navigate("/generate")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold-700/25 to-gold-700/10 border border-gold-700/40 rounded-lg text-gold-400 text-xs font-bold tracking-wide uppercase hover:from-gold-700/40 hover:to-gold-700/20 hover:border-gold-600/60 transition-all duration-300"
                >
                    <Wand2 className="h-3.5 w-3.5" />
                    Generate New Map
                </button>
                <button
                    onClick={onRefresh}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800/60 border border-gold-900/20 rounded-lg text-foreground/50 text-xs font-semibold hover:text-gold-400 hover:border-gold-700/40 transition-all duration-300"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh
                </button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
                <FilterSelect value={filterType} onChange={setFilterType} options={["All Types", "Dungeon", "Cave", "Forest", "City", "Wilderness"]} />
                <FilterSelect value={filterEnv} onChange={setFilterEnv} options={["All Environments", "Swamp", "Ruins", "Cave", "Urban", "Desert", "Mountain"]} />
                <FilterSelect value={filterDate} onChange={setFilterDate} options={["Any Date", "Last Week", "Last Month", "Last Year"]} />
                <FilterSelect value={filterMaps} onChange={setFilterMaps} options={["All Maps", "AI Beautified", "Standard"]} />
                <FilterSelect value={sortBy} onChange={setSortBy} options={["Newest", "Oldest", "A-Z"]} />
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search maps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-800/60 border border-gold-900/20 rounded-lg text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-gold-600/40 focus:ring-1 focus:ring-gold-600/20 transition-all"
                />
            </div>

            {/* Maps Grid */}
            {filteredMaps.length === 0 ? (
                <div className="text-center py-12 text-foreground/40">
                    <p className="text-lg font-serif">{maps.length === 0 ? "You haven't forged any worlds yet." : "No maps found"}</p>
                    <p className="text-sm mt-1">{maps.length === 0 ? "Click 'Generate New Map' to begin your journey." : "Try adjusting your filters or search query."}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredMaps.map((map, idx) => (
                        <MapCard
                            key={map.id}
                            map={map}
                            gradient={mapGradients[idx % mapGradients.length]}
                            onView={() => setSelectedMap(map)}
                            onDownload={() => handleDownload(map)}
                            onDelete={() => handleDelete(map)}
                            isDownloading={isDownloading}
                            isDeleting={isDeleting}
                        />
                    ))}
                </div>
            )}

            {/* View Modal */}
            {selectedMap && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedMap(null)}
                >
                    <div
                        className="bg-stone-900 border border-gold-900/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gold-900/20">
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-foreground capitalize">
                                    {selectedMap.map_type} Map
                                </h3>
                                <p className="text-foreground/50 text-sm mt-1 capitalize">
                                    {selectedMap.map_type} · {selectedMap.environment} · Seed {selectedMap.seed}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedMap(null)}
                                className="text-foreground/50 hover:text-gold-400 transition-colors text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Image */}
                        <div className="p-6">
                            <div className="aspect-video rounded-xl bg-gradient-to-br from-stone-700 via-stone-600 to-stone-800 flex items-center justify-center overflow-hidden border border-gold-900/20">
                                {selectedMap.image_url ? (
                                    <img src={selectedMap.image_url} alt="Map Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-foreground/20 text-sm font-mono">Image missing</span>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                <TagChip label={selectedMap.map_type} />
                                <TagChip label={selectedMap.environment} />
                                <TagChip label={selectedMap.image_preset || "square"} />
                                {selectedMap.beautify && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide text-emerald-400 bg-emerald-600/15 border border-emerald-600/30 px-2.5 py-1 rounded-full uppercase">
                                        <Sparkles className="h-3 w-3" />
                                        AI Beautified
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <button 
                                    onClick={() => handleDownload(selectedMap)}
                                    disabled={isDownloading}
                                    className="px-6 py-2.5 bg-gradient-to-r from-gold-600 to-gold-700 text-stone-900 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/30 transition-all disabled:opacity-50"
                                >
                                    {isDownloading ? "Downloading..." : "Download PNG"}
                                </button>
                                <button 
                                    onClick={() => handleDelete(selectedMap)}
                                    disabled={isDeleting}
                                    className="px-6 py-2.5 border border-red-600/30 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-600/10 transition-all disabled:opacity-50"
                                >
                                    {isDeleting ? "Deleting..." : "Delete Map"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// =====================
// MAP CARD
// =====================
function MapCard({
    map,
    gradient,
    onView,
    onDownload,
    onDelete,
    isDownloading,
    isDeleting
}: {
    map: MapMeta;
    gradient: string;
    onView: () => void;
    onDownload: () => void;
    onDelete: () => void;
    isDownloading: boolean;
    isDeleting: boolean;
}) {
    return (
        <div className="group bg-stone-900/70 border border-gold-900/20 rounded-xl overflow-hidden hover:border-gold-700/40 transition-all duration-300">
            {/* Thumbnail */}
            <div
                className="relative aspect-[16/10] overflow-hidden cursor-pointer"
                onClick={onView}
            >
                {/* If image_url exists, show image. Otherwise show gradient placeholder */}
                {map.image_url ? (
                    <img
                        // Card renders at ~500px CSS width but source PNGs are
                        // 1024-1280px — ask the backend to downscale so we don't
                        // ship/decode 2x the pixels this card ever shows. The
                        // modal/download below still use the untouched image_url.
                        src={`${map.image_url}?w=700`}
                        alt={map.map_type}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-105`}>
                        {/* Grid overlay pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <pattern id={`grid-${map.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold-500" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill={`url(#grid-${map.id})`} />
                            </svg>
                        </div>
                        {/* Room shapes */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-15">
                            <div className="grid grid-cols-3 gap-2 w-2/3 h-2/3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-gold-600/40 border border-gold-600/20 rounded-sm" />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />

                {/* AI Beautified Badge */}
                {map.beautify && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-700/70 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-white tracking-wide uppercase">
                        <Sparkles className="h-3 w-3" />
                        AI Beautified
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-3">
                {/* Map Name */}
                <h3 className="text-base font-serif font-bold text-foreground group-hover:text-gold-300 transition-colors capitalize">
                    {map.map_type} Map
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                    <TagChip label={map.map_type} />
                    <TagChip label={map.environment} />
                    <TagChip label={map.image_preset || "square"} />
                </div>

                {/* Seed & Date */}
                <div className="flex items-center justify-between text-[11px] text-foreground/35 font-mono">
                    <span>{map.seed}</span>
                    <span>{formatDate(map.created_at)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-gold-900/15">
                    <button
                        onClick={onView}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-800/60 border border-gold-900/20 rounded-lg text-foreground/60 text-xs font-semibold hover:text-gold-400 hover:border-gold-700/40 transition-all duration-200"
                    >
                        <Eye className="h-3.5 w-3.5" />
                        View
                    </button>
                    <button 
                        onClick={onDownload}
                        disabled={isDownloading}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-gold-700/20 to-gold-700/10 border border-gold-700/30 rounded-lg text-gold-400 text-xs font-semibold hover:from-gold-700/30 hover:to-gold-700/20 hover:border-gold-600/50 transition-all duration-200 disabled:opacity-50"
                    >
                        <Download className="h-3.5 w-3.5" />
                        {isDownloading ? "..." : "Save"}
                    </button>
                    <button 
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="w-9 h-9 flex items-center justify-center bg-red-950/30 border border-red-800/20 rounded-lg text-red-400/60 hover:text-red-400 hover:border-red-600/40 hover:bg-red-950/50 transition-all duration-200 disabled:opacity-50"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// =====================
// TAG CHIP
// =====================
function TagChip({ label }: { label: string }) {
    return (
        <span className="inline-block text-[10px] font-semibold text-foreground/50 bg-stone-800/60 border border-gold-900/15 px-2 py-0.5 rounded-full">
            {label}
        </span>
    );
}

// =====================
// FILTER SELECT
// =====================
function FilterSelect({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (v: string) => void;
    options: string[];
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none bg-stone-800/50 border border-gold-900/20 rounded-lg text-xs text-foreground/60 font-semibold pl-3 pr-7 py-2 cursor-pointer hover:border-gold-700/40 focus:outline-none focus:border-gold-600/40 transition-all"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-foreground/30 pointer-events-none" />
        </div>
    );
}
