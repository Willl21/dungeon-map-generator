import random

def generate_cave(seed: int, width: int, height: int) -> dict:
    """
    Algoritma: Cellular Automata
    - Init grid random dengan fill_prob
    - Iterasi: cell jadi wall jika tetangga wall >= threshold
    - Hasilnya cave organik yang natural
    """
    rng = random.Random(seed)
    FILL_PROB = 0.45
    ITERATIONS = 5
    BIRTH_LIMIT = 4   # jadi wall jika >= 4 tetangga wall
    DEATH_LIMIT = 3   # tetap wall jika >= 3 tetangga wall

    # Init random
    grid = []
    for y in range(height):
        row = []
        for x in range(width):
            # Border selalu wall
            if x == 0 or x == width-1 or y == 0 or y == height-1:
                row.append(1)
            else:
                row.append(1 if rng.random() < FILL_PROB else 0)
        grid.append(row)

    def count_neighbors(g, x, y):
        count = 0
        for dy in range(-1, 2):
            for dx in range(-1, 2):
                if dx == 0 and dy == 0:
                    continue
                nx, ny = x+dx, y+dy
                if nx < 0 or nx >= width or ny < 0 or ny >= height:
                    count += 1  # Out of bounds = wall
                else:
                    count += g[ny][nx]
        return count

    # Iterasi cellular automata
    for _ in range(ITERATIONS):
        new_grid = []
        for y in range(height):
            row = []
            for x in range(width):
                n = count_neighbors(grid, x, y)
                if grid[y][x] == 1:
                    row.append(1 if n >= DEATH_LIMIT else 0)
                else:
                    row.append(1 if n >= BIRTH_LIMIT else 0)
            new_grid.append(row)
        grid = new_grid

    # Konversi 0/1 ke tile string
    tile_grid = []
    for y in range(height):
        row = []
        for x in range(width):
            if grid[y][x] == 1:
                row.append("cave_wall")
            else:
                # Variasi floor berdasarkan posisi (tambah nuansa)
                n = count_neighbors(grid, x, y)
                if n >= 3:
                    row.append("cave_floor_dark")
                else:
                    row.append("cave_floor")
        tile_grid.append(row)

    # Tempatkan objects di cave floor
    objects = []
    placed = set()
    for _ in range(width * height // 12):
        tx = rng.randint(1, width-2)
        ty = rng.randint(1, height-2)
        if tile_grid[ty][tx].startswith("cave_floor") and (tx,ty) not in placed:
            t = rng.choices(
                ["rock", "water_pool", "stalactite", "torch"],
                weights=[40, 20, 25, 15]
            )[0]
            objects.append({"type": t, "x": tx, "y": ty})
            placed.add((tx, ty))

    return {"tiles": tile_grid, "objects": objects}
