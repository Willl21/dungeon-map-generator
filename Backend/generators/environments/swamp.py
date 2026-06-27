import random

class SwampEnvironment:
    def __init__(self, seed=None):
        self.rng = random.Random(seed)

    def apply(self, map_data: dict) -> dict:
        rng = self.rng
        tiles = map_data["tiles"]
        objects = map_data["objects"]
        height = len(tiles)
        width = len(tiles[0])


        # =====================
        # TILE TRANSFORM
        # =====================

        for y in range(height):
            for x in range(width):
                tile = tiles[y][x]
                # OUTSIDE DUNGEON
                if tile == "land":
                    tiles[y][x] = "swamp_grass"

                elif tile == "hill":
                    tiles[y][x] = "mud"

                elif tile == "mountain":
                    tiles[y][x] = "rock"

                elif tile == "peak":
                    tiles[y][x] = "rock"

                elif tile == "water_shallow":
                    tiles[y][x] = "water_swamp"

                elif tile == "water_deep":
                    tiles[y][x] = "water_swamp"

                # ===== CITY TERRAIN =====
                elif tile == "district_dense":
                    tiles[y][x] = "mud"  # dense districts become muddy
                elif tile == "district_stone":
                    tiles[y][x] = "mud_dark"  # stone districts become dark mud
                elif tile == "district_green":
                    tiles[y][x] = "swamp_grass"  # green districts stay swampy
                elif tile == "district_water":
                    tiles[y][x] = "water_swamp"  # water districts become swamp water
                elif tile == "road":
                    tiles[y][x] = "mud"  # roads become muddy paths

                elif tile == "wall":
                    r = rng.random()
                    if r < 0.6:
                        tiles[y][x] = "swamp_grass"
                    elif r < 0.85:
                        tiles[y][x] = "swamp_grass_dark"
                    else:
                        tiles[y][x] = "mud"


                # INSIDE ROOM
                elif tile == "floor":
                    r = rng.random()
                    if r < 0.2:
                        tiles[y][x] = "mud"
                    elif r < 0.35:
                        tiles[y][x] = "mud_dark"
                    else:
                        tiles[y][x] = "floor"

                # CORRIDOR
                elif tile == "corridor":
                    if rng.random() < 0.25:
                        tiles[y][x] = "mud_dark"
                    else:
                        tiles[y][x] = "floor"


        # =====================
        # MAIN CLUSTERS
        # =====================

        # dead tree cluster
        self._cluster_objects(
            tiles,
            objects,
            rng,
            base_tiles=("swamp_grass", "swamp_grass_dark"),
            object_type="dead_tree",
            cluster_count=6,
            cluster_size=3
        )


        # mushroom cluster
        self._cluster_objects(
            tiles,
            objects,
            rng,
            base_tiles=("mud", "mud_dark"),
            object_type="mushroom",
            cluster_count=5,
            cluster_size=3
        )

        # rock cluster
        self._cluster_objects(
            tiles,
            objects,
            rng,
            base_tiles=("swamp_grass", "mud"),
            object_type="rock",
            cluster_count=4,
            cluster_size=2
        )


        # =====================
        # WATER PATCH
        # =====================
        for _ in range(7):
            cx = rng.randint(2, width-3)
            cy = rng.randint(2, height-3)

            if tiles[cy][cx] in ("mud", "mud_dark", "swamp_grass"):
                for _ in range(rng.randint(4,9)):
                    dx = rng.randint(-1,1)
                    dy = rng.randint(-1,1)
                    x = cx + dx
                    y = cy + dy
                    if 0 <= x < width and 0 <= y < height:
                        if tiles[y][x] in (
                            "mud",
                            "mud_dark",
                            "swamp_grass"
                        ):
                            tiles[y][x] = "water_swamp"

        # =====================
        # SMALL PROPS
        # =====================

        # reed
        for _ in range(6):
            x = rng.randint(1, width-2)
            y = rng.randint(1, height-2)
            if tiles[y][x] in ("water_swamp",):
                objects.append({
                    "type": "reed",
                    "x": x,
                    "y": y
                })


        # skull (flavor)
        for _ in range(3):
            x = rng.randint(1, width-2)
            y = rng.randint(1, height-2)
            if tiles[y][x] in ("mud_dark",):
                objects.append({
                    "type": "skull",
                    "x": x,
                    "y": y
                })
        return map_data



    # =====================
    # CLUSTER HELPER
    # =====================

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