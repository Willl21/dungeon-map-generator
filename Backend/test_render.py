from generators.dungeon import DungeonGenerator
from generators.world import generate_world
from generators.city import generate_city
from generators.environments.forest import ForestEnvironment
from generators.environments.desert import DesertEnvironment
from generators.environments.ice import IceEnvironment
from generators.environments.swamp import SwampEnvironment

from PIL import Image, ImageDraw
import io

# ======================
# CONFIG
# ======================

GENERATORS = {
    "dungeon": DungeonGenerator,
    "world": generate_world,
    "city": generate_city,
}

ENVIRONMENTS = {
    "forest": ForestEnvironment,
    "desert": DesertEnvironment,
    "ice": IceEnvironment,
    "swamp": SwampEnvironment,
}

MAP_SIZES = {
    "dungeon": (50, 25),
    "world": (100, 50),
    "city": (80, 40),
}

TILE_COLORS = {
    "floor": (200, 184, 144),
    "wall": (80, 80, 72),
    "tree": (34, 139, 34),
    "rock": (120, 120, 120),
    "grass": (106, 158, 58),
    "sand": (200, 184, 130),
    "sand_dark": (180, 164, 110),
    "sand_light": (220, 204, 150),
    "snow": (230, 230, 235),
    "snow_light": (245, 245, 250),
    "snow_dark": (200, 210, 220),
    "ice_floor": (190, 220, 235),
    "ice": (170, 210, 230),
    "swamp_grass": (70, 110, 60),
    "swamp_grass_dark": (50, 90, 45),
    "mud": (120, 100, 70),
    "mud_dark": (95, 75, 55),
    "water_swamp": (60, 90, 70),
    "water_deep": (50,90,140),
    "water_shallow": (80,130,170),
    "land": (110,150,100),
    "hill": (130,140,110),
    "mountain": (140,140,140),
    "peak": (220,220,220),
    "water_ice": (120,180,210),
    "water_ice_deep": (90,140,170),
    "district_dense": (168, 158, 130),
    "district_stone": (140, 132, 120),
    "district_green": (120, 160, 80),
    "district_water": (80, 140, 190),
    "road": (190, 178, 140),
}

OBJECT_COLORS = {
    "tree": (42, 94, 24),
    "rock": (100, 96, 88),
    "chest": (180, 140, 30),
    "entrance": (60, 200, 60),
    "exit": (200, 60, 60),
    "bush": (50, 120, 50),
    "ice_rock": (180, 190, 200),
    "frost_tree": (210, 220, 230),
    "icicle": (160, 210, 235),
    "frozen_ruins": (200, 200, 210),
    "ruins": (140, 120, 100),
    "chest": (180, 140, 30),
    "entrance": (60, 200, 60),
    "exit": (200, 60, 60),
    "dead_tree": (90, 80, 60),
    "mushroom": (180, 150, 120),
    "reed": (110, 140, 80),
    "skull": (200, 200, 190),
    "vegetation": (40,120,40),
    "settlement": (210,180,80),
    "tower": (160,160,160),
    "district_marker": (240, 200, 80),
    "building": (160, 140, 110),
}

TILE_SIZE = 16
OUTPUT_SIZE = (1024, 1024)


# ======================
# RENDER FUNCTION
# ======================

def render_to_image(tiles, objects, output_size=(1024, 1024)):
    height = len(tiles)
    width = len(tiles[0])

    img = Image.new("RGB", (width * TILE_SIZE, height * TILE_SIZE), (0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw tiles
    for y, row in enumerate(tiles):
        for x, tile in enumerate(row):
            color = TILE_COLORS.get(tile, (255, 0, 255))
            px, py = x * TILE_SIZE, y * TILE_SIZE
            draw.rectangle([px, py, px+TILE_SIZE-1, py+TILE_SIZE-1], fill=color)

    # Draw objects
    for obj in objects:
        ox, oy = obj["x"] * TILE_SIZE, obj["y"] * TILE_SIZE
        color = OBJECT_COLORS.get(obj.get("type", "rock"), (255, 255, 255))

        cx, cy = ox + TILE_SIZE//2, oy + TILE_SIZE//2
        r = TILE_SIZE // 3
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=color)

    # Resize ke 1024x1024
    img = img.resize(output_size, Image.LANCZOS)

    return img


# ======================
# TEST FLOW
# ======================
# ======================
# TEST FLOW
# ======================

MAP_TYPE = "city"      # dungeon | world | city
ENV_TYPE = "desert"      # forest | desert | ice | swamp


# pilih generator
if MAP_TYPE not in GENERATORS:
    raise ValueError(f"Unknown map type: {MAP_TYPE}")

Generator = GENERATORS[MAP_TYPE]

# ukuran map sesuai tipe
width, height = MAP_SIZES.get(MAP_TYPE, (50, 25))

# generate map
if MAP_TYPE == "dungeon":
    gen = Generator(seed=42)
    result = gen.generate(width, height)
elif MAP_TYPE == "world":
    result = Generator(seed=42, width=width, height=height)
elif MAP_TYPE == "city":
    result = Generator(seed=42, width=width, height=height)

# pilih environment
if ENV_TYPE not in ENVIRONMENTS:
    raise ValueError(f"Unknown environment: {ENV_TYPE}")

EnvironmentClass = ENVIRONMENTS[ENV_TYPE]
env = EnvironmentClass(seed=42)

# apply environment
result = env.apply(result)


# render image
img = render_to_image(
    result["tiles"],
    result["objects"]
)


# save
img.save(f"map_{MAP_TYPE}_{ENV_TYPE}.png")


print("✅ Saved")
print("MAP:", MAP_TYPE)
print("ENV:", ENV_TYPE)
print("SIZE:", width, "x", height)
print("META:", result["meta"])