import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface MapFiltersProps {
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    searchQuery: string;
    filterType: "all" | "saved" | "downloaded" | "favorites";
    environment: string;
    sortBy: "newest" | "oldest" | "alphabetical";
}

export default function MapFilters({ onFilterChange }: MapFiltersProps) {
    const [filters, setFilters] = useState<FilterState>({
        searchQuery: "",
        filterType: "all",
        environment: "all",
        sortBy: "newest",
    });

    const handleFilterChange = (newFilters: Partial<FilterState>) => {
        const updated = { ...filters, ...newFilters };
        setFilters(updated);
        onFilterChange(updated);
    };

    const handleClearFilters = () => {
        const cleared: FilterState = {
            searchQuery: "",
            filterType: "all",
            environment: "all",
            sortBy: "newest",
        };
        setFilters(cleared);
        onFilterChange(cleared);
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gold-600/60 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search maps by name or seed..."
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
                    className="fantasy-input pl-12"
                />
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Filter Type */}
                <div className="space-y-2">
                    <label className="block text-gold-400 font-semibold text-sm">
                        Filter By
                    </label>
                    <select
                        value={filters.filterType}
                        onChange={(e) =>
                            handleFilterChange({
                                filterType: e.target.value as FilterState["filterType"],
                            })
                        }
                        className="fantasy-input"
                    >
                        <option value="all">All Maps</option>
                        <option value="saved">Saved Maps</option>
                        <option value="downloaded">Downloaded Maps</option>
                        <option value="favorites">Favorites</option>
                    </select>
                </div>

                {/* Environment Filter */}
                <div className="space-y-2">
                    <label className="block text-gold-400 font-semibold text-sm">
                        Environment
                    </label>
                    <select
                        value={filters.environment}
                        onChange={(e) => handleFilterChange({ environment: e.target.value })}
                        className="fantasy-input"
                    >
                        <option value="all">All Environments</option>
                        <option value="dungeon">Dungeon</option>
                        <option value="cave">Cave</option>
                        <option value="castle">Castle</option>
                        <option value="forest">Forest</option>
                        <option value="swamp">Swamp</option>
                        <option value="volcanic">Volcanic</option>
                    </select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                    <label className="block text-gold-400 font-semibold text-sm">
                        Sort By
                    </label>
                    <select
                        value={filters.sortBy}
                        onChange={(e) =>
                            handleFilterChange({
                                sortBy: e.target.value as FilterState["sortBy"],
                            })
                        }
                        className="fantasy-input"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="alphabetical">A - Z</option>
                    </select>
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-end">
                    <button
                        onClick={handleClearFilters}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-stone-800 border border-gold-900/40 rounded-lg text-foreground/70 hover:text-gold-400 hover:border-gold-600/40 transition-all duration-300"
                    >
                        <X className="h-4 w-4" />
                        <span className="text-sm font-semibold">Clear</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
