import { Download, Eye, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { fetchMyMaps, deleteMap, downloadMap, MapMeta } from "@/lib/mapApi";

// =====================
// HELPERS
// =====================
function formatDate(isoString: string): string {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}

function capitalize(s: string): string {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// =====================
// COMPONENT
// =====================
export default function RecentMapsGallery() {
    const [maps, setMaps] = useState<MapMeta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMap, setSelectedMap] = useState<MapMeta | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    // ─── FETCH ───────────────────────────────────────
    const loadMaps = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchMyMaps();
            setMaps(data);
        } catch (err: any) {
            if (err.message === "NOT_LOGGED_IN" || err.message === "UNAUTHORIZED") {
                setError("Please login to view your maps.");
            } else {
                setError("Failed to load maps.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMaps();
    }, [loadMaps]);

    // ─── DELETE ──────────────────────────────────────
    const handleDelete = async (id: number) => {
        if (!confirm("Delete this map? This cannot be undone.")) return;

        setDeletingId(id);
        try {
            await deleteMap(id);
            setMaps((prev) => prev.filter((m) => m.id !== id));
            if (selectedMap?.id === id) setSelectedMap(null);
        } catch (err) {
            alert("Failed to delete map.");
        } finally {
            setDeletingId(null);
        }
    };

    // ─── DOWNLOAD ────────────────────────────────────
    const handleDownload = async (map: MapMeta) => {
        setDownloadingId(map.id);
        try {
            const blob = await downloadMap(map.id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `map_${map.map_type}_${map.environment}_${map.seed}.png`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert("Failed to download map.");
        } finally {
            setDownloadingId(null);
        }
    };

    // ─── LOADING ─────────────────────────────────────
    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-cyan-300 mb-2">
                        Recent Generated Maps
                    </h2>
                    <p className="text-foreground/60 text-sm">Loading your maps...</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="card-dark rounded-xl overflow-hidden animate-pulse"
                        >
                            <div className="aspect-video bg-slate-800 rounded-lg mb-4" />
                            <div className="space-y-2 p-4">
                                <div className="h-4 bg-slate-700 rounded w-3/4" />
                                <div className="h-3 bg-slate-800 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ─── ERROR ───────────────────────────────────────
    if (error) {
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold text-cyan-300">
                    Recent Generated Maps
                </h2>
                <div className="card-dark rounded-xl p-8 text-center text-red-400">
                    <p>{error}</p>
                    <button
                        onClick={loadMaps}
                        className="mt-4 px-4 py-2 border border-red-600/40 rounded-lg text-sm hover:bg-red-600/10 transition-all"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // ─── EMPTY ───────────────────────────────────────
    if (maps.length === 0) {
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold text-cyan-300">
                    Recent Generated Maps
                </h2>
                <div className="card-dark rounded-xl p-12 text-center text-foreground/50">
                    <p className="text-lg">No maps generated yet.</p>
                    <p className="text-sm mt-2">
                        Go to the{" "}
                        <a href="/generate" className="text-cyan-400 hover:underline">
                            Generator
                        </a>{" "}
                        to create your first map!
                    </p>
                </div>
            </div>
        );
    }

    // ─── MAIN RENDER ─────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-cyan-300 mb-2">
                        Recent Generated Maps
                    </h2>
                    <p className="text-foreground/60 text-sm">
                        Your {maps.length} most recent creation{maps.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={loadMaps}
                    className="text-xs text-foreground/50 hover:text-cyan-300 transition-colors border border-slate-700 px-3 py-1.5 rounded-lg"
                >
                    Refresh
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {maps.map((map) => (
                    <div
                        key={map.id}
                        className="group magical-card card-dark border-gold-600/30 overflow-hidden"
                    >
                        {/* Thumbnail */}
                        <div
                            className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden mb-4 cursor-pointer"
                            onClick={() => setSelectedMap(map)}
                        >
                            <img
                                src={map.image_url}
                                alt={`${map.map_type} - ${map.environment}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                }}
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                            {/* Hover — view button */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-cyan-600/80 backdrop-blur p-3 rounded-lg">
                                    <Eye className="h-5 w-5 text-white" />
                                </div>
                            </div>

                            {/* Environment badge */}
                            <div className="absolute top-3 right-3 bg-gradient-to-r from-gold-600/80 to-gold-700/60 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-stone-900">
                                {capitalize(map.environment)}
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="relative z-10 space-y-3">
                            <div>
                                <h3 className="text-lg font-serif font-bold text-gold-300 group-hover:text-gold-200 transition-colors">
                                    {capitalize(map.map_type)} Map
                                </h3>
                                <p className="text-foreground/60 text-sm">
                                    {capitalize(map.environment)} · {map.image_preset ?? "square"}
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-xs text-foreground/50">
                                <span className="font-mono">Seed: {map.seed}</span>
                                <span>{formatDate(map.created_at)}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gold-600/20">
                                {/* Download */}
                                <button
                                    onClick={() => handleDownload(map)}
                                    disabled={downloadingId === map.id}
                                    className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-gold-600/30 to-gold-600/10 border border-gold-600/40 rounded-lg text-gold-300 text-xs font-semibold hover:from-gold-600/50 hover:to-gold-600/30 transition-all disabled:opacity-40"
                                >
                                    <Download className="h-4 w-4" />
                                    <span className="hidden sm:inline">
                                        {downloadingId === map.id ? "..." : "Download"}
                                    </span>
                                </button>

                                {/* View */}
                                <button
                                    onClick={() => setSelectedMap(map)}
                                    className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-gold-700/30 to-gold-700/10 border border-gold-700/40 rounded-lg text-gold-400 text-xs font-semibold hover:from-gold-700/50 hover:to-gold-700/30 transition-all"
                                >
                                    <Eye className="h-4 w-4" />
                                    <span className="hidden sm:inline">View</span>
                                </button>

                                {/* Delete */}
                                <button
                                    onClick={() => handleDelete(map.id)}
                                    disabled={deletingId === map.id}
                                    className="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-red-600/30 to-red-600/10 border border-red-600/40 rounded-lg text-red-400 text-xs font-semibold hover:from-red-600/50 hover:to-red-600/30 transition-all disabled:opacity-40"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="hidden sm:inline">
                                        {deletingId === map.id ? "..." : "Delete"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal — Full View */}
            {selectedMap && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedMap(null)}
                >
                    <div
                        className="bg-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gold-900/30">
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-foreground">
                                    {capitalize(selectedMap.map_type)} Map
                                </h3>
                                <p className="text-foreground/60 text-sm mt-1">
                                    {capitalize(selectedMap.environment)} · Seed {selectedMap.seed} ·{" "}
                                    {formatDate(selectedMap.created_at)}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedMap(null)}
                                className="text-foreground/60 hover:text-gold-400 transition-colors text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Image */}
                        <div className="p-6">
                            <img
                                src={selectedMap.image_url}
                                alt={`${selectedMap.map_type} - ${selectedMap.environment}`}
                                className="w-full rounded-xl"
                            />

                            {/* Modal Actions */}
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <button
                                    onClick={() => handleDownload(selectedMap)}
                                    disabled={downloadingId === selectedMap.id}
                                    className="px-6 py-2 bg-gradient-to-r from-gold-600 to-gold-700 text-stone-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-gold-500/40 transition-all disabled:opacity-50"
                                >
                                    {downloadingId === selectedMap.id ? "Downloading..." : "Download PNG"}
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete(selectedMap.id);
                                    }}
                                    disabled={deletingId === selectedMap.id}
                                    className="px-6 py-2 border border-red-600/40 text-red-400 rounded-lg hover:bg-red-600/10 transition-all disabled:opacity-50"
                                >
                                    {deletingId === selectedMap.id ? "Deleting..." : "Delete Map"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
