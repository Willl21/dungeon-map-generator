import random

class ForestEnvironment:
    def __init__(self, seed=None):
        self.rng = random.Random(seed)

    def apply(self, map_data: dict) -> dict:
        grid = map_data["tiles"]
        objects = map_data["objects"]
        height = len(grid)
        width = len(grid[0])

        # STEP 1: transform tiles for both world and dungeon
        for y in range(height):
            for x in range(width):
                tile = grid[y][x]

                # ===== WORLD TERRAIN =====
                if tile == "land":
                    grid[y][x] = "grass"
                elif tile == "hill":
                    grid[y][x] = "rock"  # hills become rocky in forest
                elif tile == "mountain":
                    grid[y][x] = "rock"
                elif tile == "peak":
                    grid[y][x] = "rock"
                elif tile == "water_shallow":
                    grid[y][x] = "water_shallow"  # keep water as is
                elif tile == "water_deep":
                    grid[y][x] = "water_deep"

                # ===== CITY TERRAIN =====
                elif tile == "district_dense":
                    grid[y][x] = "grass"  # dense districts become grassy
                elif tile == "district_stone":
                    grid[y][x] = "rock"  # stone districts become rocky
                elif tile == "district_green":
                    grid[y][x] = "grass"  # green districts stay grassy
                elif tile == "district_water":
                    grid[y][x] = "water_shallow"  # water districts become shallow water
                elif tile == "road":
                    grid[y][x] = "grass"  # roads become grassy paths

                # ===== DUNGEON TERRAIN =====
                elif tile == "wall":
                    grid[y][x] = "grass"

        # STEP 2: bikin cluster pohon
        for _ in range(30):  # jumlah cluster
            cx = self.rng.randint(0, width-1)
            cy = self.rng.randint(0, height-1)

            radius = self.rng.randint(2, 5)

            for y in range(cy - radius, cy + radius):
                for x in range(cx - radius, cx + radius):
                    if 0 <= x < width and 0 <= y < height:
                        if grid[y][x] == "grass":
                            if self.rng.random() < 0.7:
                                grid[y][x] = "tree"

        # STEP 3: rock cluster kecil
        for _ in range(10):
            cx = self.rng.randint(0, width-1)
            cy = self.rng.randint(0, height-1)

            for y in range(cy-1, cy+2):
                for x in range(cx-1, cx+2):
                    if 0 <= x < width and 0 <= y < height:
                        if grid[y][x] == "grass":
                            grid[y][x] = "rock"

        # 🌿 TRANSISI: kasih semak di dalam dungeon dan world biar nyatu
        for y in range(height):
            for x in range(width):
                if (grid[y][x] == "floor" or grid[y][x] == "grass") and self.rng.random() < 0.03:
                    objects.append({
                        "type": "bush",
                        "x": x,
                        "y": y
                    })

        map_data["meta"]["environment"] = "forest"
        return map_data