import random

class DesertEnvironment:
    def __init__(self, seed=None):
        self.rng = random.Random(seed)

    def apply(self, map_data: dict) -> dict:
        grid = map_data["tiles"]
        objects = map_data["objects"]

        height = len(grid)
        width = len(grid[0])

        # 🏜️ STEP 1: transform tiles for world, dungeon, and city
        for y in range(height):
            for x in range(width):
                tile = grid[y][x]

                # ===== WORLD TERRAIN =====
                if tile == "land":
                    grid[y][x] = "sand"
                elif tile == "hill":
                    grid[y][x] = "sand_dark"
                elif tile == "mountain":
                    grid[y][x] = "rock"
                elif tile == "peak":
                    grid[y][x] = "rock"
                elif tile == "water_shallow":
                    grid[y][x] = "sand"  # desert dries up shallow water
                elif tile == "water_deep":
                    grid[y][x] = "sand"  # desert dries up deep water too

                # ===== CITY TERRAIN =====
                elif tile == "district_dense":
                    grid[y][x] = "sand"  # dense districts become sandy
                elif tile == "district_stone":
                    grid[y][x] = "sand_dark"  # stone districts become darker sand
                elif tile == "district_green":
                    grid[y][x] = "sand_light"  # green districts become light sand
                elif tile == "district_water":
                    grid[y][x] = "sand"  # water districts dry up
                elif tile == "road":
                    grid[y][x] = "sand"  # roads become sandy paths

                # ===== DUNGEON TERRAIN =====
                elif tile == "wall":
                    grid[y][x] = "sand"

        # 🌊 STEP 2: bikin dune pattern (gelombang)
        for y in range(height):
            for x in range(width):
                if grid[y][x] == "sand":
                    noise = (
                        (x * 0.08) +
                        (y * 0.05) +
                        self.rng.random()
                    )
                    n = int(noise)

                    if n % 5 == 0:
                        grid[y][x] = "sand_light"
                    elif n % 3 == 0:
                        grid[y][x] = "sand_dark"

        # 🪨 STEP 3: batu kecil (jarang banget)
        for _ in range(5):
            cx = self.rng.randint(0, width-1)
            cy = self.rng.randint(0, height-1)

            for y in range(cy-1, cy+2):
                for x in range(cx-1, cx+2):
                    if 0 <= x < width and 0 <= y < height:
                        if grid[y][x] in ["sand", "sand_dark"]:
                            if self.rng.random() < 0.5:
                                objects.append({
                                    "type": "rock",
                                    "x": x,
                                    "y": y
                                })

        # 🏺 STEP 4: object desert (optional)
        for _ in range(3):
            x = self.rng.randint(0, width-1)
            y = self.rng.randint(0, height-1)

            if grid[y][x] == "sand":
                objects.append({
                    "type": "ruins",
                    "x": x,
                    "y": y
                })

        map_data["meta"]["environment"] = "desert"
        return map_data