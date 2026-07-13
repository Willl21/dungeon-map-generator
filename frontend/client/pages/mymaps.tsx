import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { Trash2, Download, Loader2 } from "lucide-react";
import { fetchMyMaps, deleteMap, downloadMap, MapMeta } from "@/lib/mapApi";
import { useToast } from "@/hooks/use-toast";

function formatDate(isoString: string): string {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export default function MyMaps() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [maps, setMaps] = useState<MapMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Fetch maps on mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMyMaps();
        setMaps(data);
      } catch (err: any) {
        if (err.message === "NOT_LOGGED_IN" || err.message === "UNAUTHORIZED") {
          navigate("/login");
          return;
        }
        toast({
          title: "Gagal memuat maps",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate, toast]);

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus map ini? Tindakan ini tidak dapat dibatalkan.")) return;
    setDeletingId(id);
    try {
      await deleteMap(id);
      setMaps((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Map berhasil dihapus" });
    } catch (err: any) {
      toast({
        title: "Gagal menghapus map",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (map: MapMeta) => {
    setDownloadingId(map.id);
    try {
      const blob = await downloadMap(map.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `map_${map.map_type}_${map.environment}_${map.seed}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      toast({
        title: "Gagal mendownload map",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  // ─── LOADING STATE ────────────────────────────────
  if (loading) {
    return (
      <Layout backgroundState="dashboard">
        <div className="py-12 px-4">
          <h1 className="text-4xl font-serif font-bold text-gold-300 mb-8">My Maps</h1>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-dark rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-slate-800" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-800 rounded w-1/2" />
                  <div className="h-4 bg-slate-800 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // ─── EMPTY STATE ──────────────────────────────────
  if (maps.length === 0) {
    return (
      <Layout backgroundState="dashboard">
        <div className="flex flex-col items-center justify-center text-center py-24 px-4">
          {/* Decorative scroll icon */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-600/20 to-gold-600/5 border border-gold-600/30 flex items-center justify-center mb-6 text-5xl">
            🗺️
          </div>
          <h1 className="text-4xl font-serif font-bold text-gold-300 mb-3">
            No Maps Yet
          </h1>
          <p className="text-foreground/60 mb-8 max-w-sm">
            Generate your first dungeon map to start your adventure.
          </p>
          <button
            className="fantasy-button"
            onClick={() => navigate("/generate")}
          >
            Generate Map
          </button>
        </div>
      </Layout>
    );
  }

  // ─── MAIN LIST ────────────────────────────────────
  return (
    <Layout backgroundState="dashboard">
      <div className="py-12 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gold-300 mb-2">My Maps</h1>
            <p className="text-foreground/60 text-sm">
              {maps.length} map{maps.length !== 1 ? "s" : ""} in your collection
            </p>
          </div>
          <button
            className="fantasy-button"
            onClick={() => navigate("/generate")}
          >
            + Generate New
          </button>
        </div>

        <div className="divider-gold mb-8" />

        {/* Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {maps.map((map) => (
            <div
              key={map.id}
              className="group magical-card card-dark border-gold-600/30 overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-slate-800 overflow-hidden">
                <img
                  src={map.image_url}
                  alt={`${map.map_type} - ${map.environment}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                {/* Environment badge */}
                <div className="absolute top-3 right-3 bg-gradient-to-r from-gold-600/80 to-gold-700/60 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-stone-900">
                  {capitalize(map.environment)}
                </div>

                {/* Beautify badge */}
                {map.beautify && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-cyan-600/80 to-cyan-700/60 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold text-white">
                    ✨ AI
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="relative z-10 p-4 space-y-3">
                <div>
                  <h2 className="text-lg font-serif font-bold text-gold-300 group-hover:text-gold-200 transition-colors">
                    {capitalize(map.map_type)} Map
                  </h2>
                  <p className="text-foreground/60 text-sm">
                    {capitalize(map.environment)} · Seed {map.seed}
                  </p>
                </div>

                <div className="text-xs text-foreground/50">
                  {formatDate(map.created_at)}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gold-600/20">
                  {/* Download */}
                  <button
                    onClick={() => handleDownload(map)}
                    disabled={downloadingId === map.id}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-gold-600/30 to-gold-600/10 border border-gold-600/40 rounded-lg text-gold-300 text-xs font-semibold hover:from-gold-600/50 hover:to-gold-600/30 transition-all disabled:opacity-40"
                  >
                    {downloadingId === map.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    {downloadingId === map.id ? "..." : "Download"}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(map.id)}
                    disabled={deletingId === map.id}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600/30 to-red-600/10 border border-red-600/40 rounded-lg text-red-400 text-xs font-semibold hover:from-red-600/50 hover:to-red-600/30 transition-all disabled:opacity-40"
                  >
                    {deletingId === map.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    {deletingId === map.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
