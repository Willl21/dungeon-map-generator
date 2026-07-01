import { useState, useEffect } from "react";
import { Sparkles, Download, RotateCcw } from "lucide-react";
import { generateMap, downloadMap } from "@/lib/mapApi";

interface GeneratorState {
  mapShape: string;
  mapType: string;
  theme: string;
}

export default function Generator() {
  const [config, setConfig] = useState<GeneratorState>({
    mapShape: "square",
    mapType: "world",
    theme: "ice",
  });

  const [image, setImage] = useState<string | null>(null);
  const [mapId, setMapId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [seedInput, setSeedInput] = useState<string>("");
  const [usedSeed, setUsedSeed] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleGenerate = async (forceSeed?: number) => {
    if (!isLoggedIn) {
      alert("Please login first");
      return;
    }

    setIsGenerating(true);

    try {
      const finalSeed =
        forceSeed ??
        (seedInput
          ? parseInt(seedInput)
          : Math.floor(Math.random() * 999999));

      const res = await generateMap({
        map_type: config.mapType,
        environment: config.theme.toLowerCase(),
        image_preset: config.mapShape.toLowerCase(),
        seed: finalSeed,
        beautify: true,
      });

      setImage(res.image_url || null);
      setMapId(res.id);          
      setUsedSeed(finalSeed);
    } catch (err) {
      console.error(err);
      alert("Failed generate map");
    }

    setIsGenerating(false);
  };

  const handleRegenerate = () => {
    if (usedSeed) {
      handleGenerate(usedSeed);
    } else {
      handleGenerate();
    }
  };

  const handleDownload = async () => {
    if (!image || mapId === null) return;

    setIsDownloading(true);

    try {
      const blob = await downloadMap(mapId);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${config.mapType}-${config.theme}-${Date.now()}.png`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }

    setIsDownloading(false);
  };

  const handleCopySeed = () => {
    if (usedSeed) {
      navigator.clipboard.writeText(String(usedSeed));
      alert("Seed copied!");
    }
  };

  return (
    <section className="relative py-20 px-4 bg-stone-900">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            <span className="text-gradient">Map Generator</span>
          </h2>
          <p className="text-foreground/70 text-lg">
            Generate procedural fantasy maps with AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ===================== CONTROL PANEL ===================== */}
          <div>
            <div className="card-dark rounded-xl p-8 space-y-6">

              {!isLoggedIn && (
                <p className="text-red-400 text-sm">
                  You must login to generate map
                </p>
              )}
              <label className="text-gold-400 text-sm font-semibold">
                Map Shape
              </label>
              {/* MAP SHAPE */}
              <select
                value={config.mapShape}
                onChange={(e) =>
                  setConfig({ ...config, mapShape: e.target.value })
                }
                className="fantasy-input"
              >
                <option value="square">Square</option>
                <option value="landscape">Landscape</option>
                <option value="wide">Wide</option>
              </select>

              {/* MAP TYPE */}
              <label className="text-gold-400 text-sm font-semibold">
                Map Type
              </label>
              <select
                value={config.mapType}
                onChange={(e) =>
                  setConfig({ ...config, mapType: e.target.value })
                }
                className="fantasy-input"
              >
                <option value="world">World</option>
                <option value="city">City</option>
                <option value="dungeon">Dungeon</option>
                <option value="cave">Cave</option>
                <option value="sky">Sky</option>
              </select>

              {/* ENV */}
              <label className="text-gold-400 text-sm font-semibold">
                Theme
              </label>
              <select
                value={config.theme}
                onChange={(e) =>
                  setConfig({ ...config, theme: e.target.value })
                }
                className="fantasy-input"
              >
                <option value="forest">Forest</option>
                <option value="ice">Ice</option>
                <option value="desert">Desert</option>
                <option value="swamp">Swamp</option>
              </select>

              {/* SEED */}
              <label className="text-gold-400 text-sm font-semibold">
                Seed
              </label>
              <input
                type="number"
                placeholder="Seed (optional)"
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                className="fantasy-input"
              />

              {/* GENERATE */}
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating || !isLoggedIn}
                className="w-full fantasy-button disabled:opacity-50"
              >
                <Sparkles className="mr-2 inline" />
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>

          {/* ===================== PREVIEW ===================== */}
          <div className="lg:col-span-2">
            {image ? (
              <div className="space-y-6">

                <div className="card-dark p-4">
                  <img src={image} className="w-full rounded-lg" />

                  {usedSeed && (
                    <div className="flex justify-between mt-3 text-sm text-gold-400">
                      <span>Seed: {usedSeed}</span>
                      <button onClick={handleCopySeed}>Copy</button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleRegenerate}
                    className="bg-stone-800 p-3 rounded-lg"
                  >
                    <RotateCcw className="mr-2 inline" />
                    Regenerate
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-gold-600 p-3 rounded-lg text-black font-bold disabled:opacity-50"
                  >
                    <Download className="mr-2 inline" />
                    {isDownloading ? "Downloading..." : "Download"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="card-dark p-8 text-center">
                Ready to generate map
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}