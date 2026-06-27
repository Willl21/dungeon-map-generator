import random
import math

from generators.world import _octave_noise

def generate_sky(seed: int, width: int, height: int) -> dict:
    rng = random.Random(seed)
    grid = []
    objects = []

    cx = width / 2
    cy = height / 2
    radius = min(width, height) * 0.28

    for y in range(height):
        row = []
        for x in range(width):
            dx = x - cx
            dy = y - cy

            distance = math.sqrt(dx*dx + dy*dy)

            n = _octave_noise(x / 6, y / 6, seed)

            # radius berubah sesuai seed + noise
            dynamic_radius = radius + (n * 6) - 3

            if distance < dynamic_radius:
                if n > 0.80:
                    tile = "sky_temple"
                elif n > 0.65:
                    tile = "crystal_island"
                elif n > 0.45:
                    tile = "floating_grass"
                else:
                    tile = "cloud"
            else:
                if rng.random() < 0.04:
                    tile = "floating_stone"
                else:
                    tile = "sky_void"

            row.append(tile)
        grid.append(row)

    # object placement
    for _ in range(width * height // 12):
        tx = rng.randint(0, width - 1)
        ty = rng.randint(0, height - 1)

        if grid[ty][tx] in ("floating_grass", "crystal_island"):
            objects.append({
                "type": "sky_tree",
                "x": tx,
                "y": ty
            })

    # landmark
    objects.append({
        "type": "cloud_tower",
        "x": width // 2,
        "y": height // 2
    })

    return {
        "tiles": grid,
        "objects": objects
    }