import random


class IceEnvironment:
    def __init__(self, seed=None):
        self.rng = random.Random(seed)

    def apply(self, map_data: dict) -> dict:
        rng = self.rng

        tiles = map_data["tiles"]
        objects = map_data["objects"]

        height = len(tiles)
        width = len(tiles[0])

        # --- transform tile ---
        for y in range(height):
            for x in range(width):

                tile = tiles[y][x]

                # ===== WORLD TERRAIN =====

                if tile == "land":
                    tiles[y][x] = "snow"

                elif tile == "hill":
                    tiles[y][x] = "snow_dark"

                elif tile == "mountain":
                    tiles[y][x] = "ice"

                elif tile == "peak":
                    tiles[y][x] = "ice"

                elif tile == "water_shallow":
                    tiles[y][x] = "water_ice"

                elif tile == "water_deep":
                    tiles[y][x] = "water_ice_deep"

                # ===== CITY TERRAIN =====
                elif tile == "district_dense":
                    tiles[y][x] = "snow"  # dense districts become snowy
                elif tile == "district_stone":
                    tiles[y][x] = "ice"  # stone districts become icy
                elif tile == "district_green":
                    tiles[y][x] = "snow_light"  # green districts become light snow
                elif tile == "district_water":
                    tiles[y][x] = "water_ice"  # water districts freeze
                elif tile == "road":
                    tiles[y][x] = "snow"  # roads become snowy paths

                # ===== DUNGEON TERRAIN =====

                elif tile == "wall":
                    tiles[y][x] = "snow"

                elif tile == "floor":
                    if rng.random() < 0.2:
                        tiles[y][x] = "snow_light"
                    else:
                        tiles[y][x] = "floor"

                elif tile == "corridor":
                    if rng.random() < 0.2:
                        tiles[y][x] = "ice_floor"

        # --- cluster frozen rocks ---
        self._cluster_objects(
            tiles,
            objects,
            rng,
            base_tiles=("snow", "snow_light"),
            object_type="ice_rock",
            cluster_count=6,
            cluster_size=3
        )

        # --- cluster frozen trees ---
        self._cluster_objects(
            tiles,
            objects,
            rng,
            base_tiles=("snow",),
            object_type="frost_tree",
            cluster_count=5,
            cluster_size=4
        )

        # --- icicles (small clusters) ---
        self._cluster_objects(
            tiles,
            objects,
            rng,
            base_tiles=("ice_floor",),
            object_type="icicle",
            cluster_count=4,
            cluster_size=2
        )

        # --- ruins sparse ---
        for _ in range(3):
            x = rng.randint(2, width-3)
            y = rng.randint(2, height-3)

            if tiles[y][x] in ("snow", "snow_light"):
                objects.append({
                    "type": "frozen_ruins",
                    "x": x,
                    "y": y
                })

        return map_data


    def _cluster_objects(
        self,
        tiles,
        objects,
        rng,
        base_tiles,
        object_type,
        cluster_count,
        cluster_size
    ):
        height = len(tiles)
        width = len(tiles[0])

        for _ in range(cluster_count):

            cx = rng.randint(2, width-3)
            cy = rng.randint(2, height-3)

            for _ in range(cluster_size):

                dx = rng.randint(-2, 2)
                dy = rng.randint(-2, 2)

                x = cx + dx
                y = cy + dy

                if 0 <= x < width and 0 <= y < height:

                    if tiles[y][x] in base_tiles:

                        objects.append({
                            "type": object_type,
                            "x": x,
                            "y": y
                        })
