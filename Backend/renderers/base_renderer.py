from PIL import Image, ImageDraw
import io

TILE_COLORS = {
    # World
    "deep_water":       (58,  122, 191),
    "shallow_water":    (90,  159, 212),
    "sand":             (200, 184, 130),
    "grass":            (106, 158,  58),
    "dark_grass":       (74,  126,  40),
    "highland":         (160, 140, 100),
    "stone":            (136, 128, 112),
    "snow":             (220, 215, 210),
    "swamp_grass":      (70, 110,  60),
    "swamp_grass_dark": (50,  90,  45),
    "mud":              (120, 100,  70),
    "mud_dark":         (95,  75,  55),
    "water_swamp":      (60,  90,  70),
    "water_shallow":    (80, 130, 170),
    "water_ice":        (120,180,210),
    "water_ice_deep":   (90, 140, 170),
    "land":             (110, 150, 100),
    "hill":             (130, 140, 110),
    "mountain":         (140, 140, 140),
    "peak":             (220, 220, 220),
    # Dungeon
    "floor":            (200, 184, 144),
    "wall":             (80,   80,  72),
    "cave_floor":       (160, 148, 120),
    "cave_floor_dark":  (130, 118,  90),
    "cave_wall":        (60,   55,  48),
    # City
    "cobble_district":  (168, 158, 130),
    "stone_district":   (140, 132, 120),
    "grass_district":   (120, 160,  80),
    "water_district":   (80,  140, 190),
    "road":             (190, 178, 140),
    # Sky
    "sky_void":        (135, 206, 235),
    "cloud":           (240, 248, 255),
    "floating_grass":  (120, 190, 100),
    "floating_stone":  (160, 160, 170),
    "crystal_island":  (180, 220, 255),
    "sky_temple":      (255, 245, 220),
}

OBJECT_COLORS = {
    "tree":             (42,  94,  24),
    "rock":             (100, 96,  88),
    "chest":            (180, 140,  30),
    "entrance":         (60,  200,  60),
    "exit":             (200,  60,  60),
    "village":          (220, 180,  80),
    "town":             (200, 160,  60),
    "ruins":            (140, 120, 100),
    "water_pool":       (60,  140, 200),
    "stalactite":       (110, 100,  90),
    "torch":            (230, 160,  40),
    "building":         (160, 140, 110),
    "bush":             (50,  120,  50),
    "ice_rock":         (180, 190, 200),
    "frost_tree":       (210, 220, 230),
    "icicle":           (160, 210, 235),
    "frozen_ruins":     (200, 200, 210),
    "dead_tree":        (90,  80,  60),
    "mushroom":         (180, 150, 120),
    "reed":             (110, 140,  80),
    "skull":            (200, 200, 190),
    "vegetation":       (40, 120,  40),
    "settlement":       (210, 180,  80),
    "tower":            (160, 160, 160),
    "district_marker":  (240, 200,  80),
    "sky_tree":        (80, 160, 120),
    "sky_village":     (220, 200, 140),
    "cloud_tower":     (200, 220, 255),
    "airship_dock":    (170, 140, 100),
    "capital": (255, 215, 0),
}

TILE_SIZE = 16
OUTPUT_SIZE = (1024, 1024)

def render_to_image(
    tiles: list[list[str]],
    objects: list[dict],
    output_size: tuple[int, int] = (1024, 1024)
) -> bytes:
    height = len(tiles)
    width = len(tiles[0]) if tiles else 0

    img = Image.new("RGB", (width * TILE_SIZE, height * TILE_SIZE), (0, 0, 0))
    draw = ImageDraw.Draw(img)

    for y, row in enumerate(tiles):
        for x, tile in enumerate(row):
            color = TILE_COLORS.get(tile, (128, 128, 128))
            px, py = x * TILE_SIZE, y * TILE_SIZE
            draw.rectangle([px, py, px+TILE_SIZE-1, py+TILE_SIZE-1], fill=color)

    for obj in objects:
        ox, oy = obj["x"] * TILE_SIZE, obj["y"] * TILE_SIZE
        color = OBJECT_COLORS.get(obj.get("type", "rock"), (255, 255, 255))
        cx, cy = ox + TILE_SIZE//2, oy + TILE_SIZE//2
        r = TILE_SIZE // 3
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=color)

    img = img.resize(output_size, Image.LANCZOS)

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return buf.read()
