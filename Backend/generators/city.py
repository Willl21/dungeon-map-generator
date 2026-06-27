import random
import math

DISTRICT_TYPES = [
    "market",
    "temple",
    "barracks",
    "harbor",
    "guild",
    "slums",
    "palace",
    "library",
    "inn",
    "forge",
    "garden",
    "prison"
]

def generate_city(
    seed: int,
    width: int,
    height: int
) -> dict:
    rng = random.Random(seed)
    margin = max(
        3,
        min(width, height) // 8
    )
    num_districts = min(
        12,
        (width * height) // 40
    )
    districts = []
    for i in range(num_districts):
        dx = rng.randint(
            margin,
            width - margin
        )
        dy = rng.randint(
            margin,
            height - margin
        )
        dtype = DISTRICT_TYPES[
            i % len(DISTRICT_TYPES)
        ]
        districts.append({
            "x": dx,
            "y": dy,
            "type": dtype
        })

    # =====================
    # VORONOI DISTRICT
    # =====================
    grid = []
    for y in range(height):
        row = []
        for x in range(width):
            min_dist = float("inf")
            nearest = 0
            for i, d in enumerate(districts):
                dist = math.sqrt(
                    (x-d["x"])**2 +
                    (y-d["y"])**2
                )
                if dist < min_dist:
                    min_dist = dist
                    nearest = i
            dtype = districts[nearest]["type"]
            # =====================
            # GENERIC DISTRICT TILE
            # =====================
            if dtype == "harbor":
                tile = "district_water"
            elif dtype in (
                "garden",
                "slums"
            ):
                tile = "district_green"
            elif dtype in (
                "palace",
                "temple"
            ):
                tile = "district_stone"
            else:
                tile = "district_dense"
            row.append(tile)
        grid.append(row)

    # =====================
    # ROAD NETWORK
    # =====================
    def dist(a, b):
        return math.sqrt(
            (a["x"]-b["x"])**2 +
            (a["y"]-b["y"])**2
        )

    road_threshold = max(
        width,
        height
    ) * 0.45
    for i in range(len(districts)):
        for j in range(i+1, len(districts)):
            if dist(
                districts[i],
                districts[j]
            ) < road_threshold:
                _carve_road(
                    grid,
                    districts[i],
                    districts[j],
                    width,
                    height
                )

    # ring road
    cx = width // 2
    cy = height // 2
    radius = min(width, height) // 4
    _carve_circle_road(
        grid,
        cx,
        cy,
        radius,
        width,
        height
    )
    # =====================
    # OBJECTS
    # =====================
    objects = []
    for d in districts:
        objects.append({
            "type": "district_marker",
            "subtype": d["type"],
            "x": d["x"],
            "y": d["y"]
        })

    # buildings
    for _ in range(num_districts * 6):
        tx = rng.randint(1, width-2)
        ty = rng.randint(1, height-2)

        if grid[ty][tx] != "road":
            objects.append({
                "type": "building",
                "x": tx,
                "y": ty
            })

    return {
        "tiles": grid,
        "objects": objects,
        "meta": {
            "seed": seed,
            "type": "city"
        }
    }

# =====================
# ROAD HELPERS
# =====================

def _carve_road(
    grid,
    a,
    b,
    width,
    height
):
    x = a["x"]
    y = a["y"]
    bx = b["x"]
    by = b["y"]
    while x != bx:
        if 0 <= y < height and 0 <= x < width:
            grid[y][x] = "road"
        x += 1 if x < bx else -1

    while y != by:
        if 0 <= y < height and 0 <= x < width:
            grid[y][x] = "road"
        y += 1 if y < by else -1


def _carve_circle_road(
    grid,
    cx,
    cy,
    radius,
    width,
    height
):
    steps = radius * 8

    for i in range(steps):
        angle = 2 * math.pi * i / steps
        x = int(
            cx +
            radius *
            math.cos(angle)
        )
        y = int(
            cy +
            radius *
            math.sin(angle)
        )

        if 0 <= x < width and 0 <= y < height:
            grid[y][x] = "road"