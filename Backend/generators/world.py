import random
import math

# =====================
# BASE NOISE
# =====================

def _noise(x, y, seed):
    xi, yi = int(x), int(y)
    xf, yf = x - xi, y - yi

    def rand2(a, b):
        n = a * 1000 + b + seed * 7919
        n = ((n >> 13) ^ n)
        return (
            (
                n * (n * n * 15731 + 789221) + 1376312589
            ) & 0x7fffffff
        ) / 0x7fffffff


    v00 = rand2(xi, yi)
    v10 = rand2(xi+1, yi)
    v01 = rand2(xi, yi+1)
    v11 = rand2(xi+1, yi+1)
    sx = xf * xf * (3 - 2*xf)
    sy = yf * yf * (3 - 2*yf)


    return (
        v00
        + sx*(v10-v00)
        + sy*(v01-v00)
        + sx*sy*(v00-v10-v01+v11)
    )



def _octave_noise(x, y, seed, octaves=4):
    value = 0.0
    amplitude = 1.0
    frequency = 1.0
    max_value = 0.0

    for _ in range(octaves):
        value += (
            _noise(
                x * frequency,
                y * frequency,
                seed
            )
            * amplitude
        )
        max_value += amplitude
        amplitude *= 0.5
        frequency *= 2.0

    return value / max_value
# =====================
# WORLD GENERATOR
# =====================

def generate_world(
    seed: int,
    width: int,
    height: int
) -> dict:
    rng = random.Random(seed)
    grid = []
    objects = []
    scale = 8.0
    for y in range(height):
        row = []
        for x in range(width):
            nx = x / scale
            ny = y / scale
            n = _octave_noise(
                nx,
                ny,
                seed,
                octaves=4
            )
            # =====================
            # GENERIC TERRAIN
            # =====================
            if n < 0.28:
                tile = "water_deep"
            elif n < 0.38:
                tile = "water_shallow"
            elif n < 0.58:
                tile = "land"
            elif n < 0.72:
                tile = "hill"
            elif n < 0.88:
                tile = "mountain"
            else:
                tile = "peak"
            row.append(tile)
        grid.append(row)



    # =====================
    # GENERIC OBJECTS
    # =====================


    # vegetation placeholder
    placed = set()
    for _ in range(width * height // 7):
        tx = rng.randint(0, width-1)
        ty = rng.randint(0, height-1)


        if grid[ty][tx] in ("land", "hill"):
            too_close = any(
                abs(tx-px) < 2
                and abs(ty-py) < 2
                for px,py in placed
            )

            if not too_close:
                objects.append({
                    "type": "vegetation",
                    "x": tx,
                    "y": ty
                })
                placed.add((tx, ty))


    def place_capital(grid, objects, rng):
        height = len(grid)
        width = len(grid[0])
        candidates = []
        for y in range(height):
            for x in range(width):
                t = grid[y][x]
                if t in ("land","hill"):
                    # hindari pinggir map
                    if 5 < x < width-5 and 5 < y < height-5:
                        candidates.append((x,y))


        if not candidates:
            return
        x,y = rng.choice(candidates)
        objects.append({
            "type": "capital",
            "x": x,
            "y": y
    })
    place_capital(grid, objects, rng)

    # =====================
    # LANDMARK PLACEMENT
    # =====================
    def place_landmarks(grid, objects, rng):
        height = len(grid)
        width = len(grid[0])
        candidates = []
        for y in range(height):
            for x in range(width):
                if grid[y][x] in (
                    "land",
                    "hill"
                ):
                    candidates.append((x,y))
        rng.shuffle(candidates)
        placed = set()
        desired_count = max(
            10,
            (width * height) // 250
        )
        for x,y in candidates:
            if len(placed) >= desired_count:
                break
            # jaga jarak antar settlement
            too_close = any(
                abs(x-px) < 4
                and abs(y-py) < 4
                for px,py in placed
            )
            if too_close:
                continue
            obj_type = rng.choices(
                [
                    "settlement",
                    "ruins",
                    "tower"
                ],
                weights=[6,2,2]
            )[0]
            objects.append({
                "type": obj_type,
                "x": x,
                "y": y
            })
            placed.add((x,y))

    place_landmarks(
        grid,
        objects,
        rng
    )



    return {
        "tiles": grid,
        "objects": objects,
        "meta": {
            "seed": seed,
            "type": "world"
        }

    }