import httpx
import os
from datetime import datetime
import base64

STABILITY_API_KEY = os.getenv("STABILITY_API_KEY")

PROMPTS = {

# =====================
# WORLD MAP
# =====================

"world": {

"forest": (
"top-down fantasy atlas map, hand-drawn cartography style, parchment paper texture, "
"detailed mountains illustrated as classic map symbols, dense forests drawn as tree clusters, "
"rivers flowing across the land, medieval fantasy world map, "
"small detailed castle and town illustrations representing kingdoms and settlements, "
"tolkien inspired fantasy map style, muted natural colors, preserve layout"
),

"desert": (
"top-down fantasy atlas map, hand-drawn cartography style, parchment texture, "
"desert continents with dunes and rocky mountains, stylized terrain symbols, "
"small illustrated cities and ruins placed across the land, "
"classic fantasy atlas style, muted warm colors, preserve layout"
),

"ice": (
"top-down fantasy atlas map, frozen continent, icy mountains illustrated as classic cartography symbols, "
"glaciers and frozen rivers, hand-drawn map style, parchment texture, "
"small illustrated nordic settlements and castles placed across the land, "
"tolkien style fantasy map, muted cold colors, preserve layout"
),

"swamp": (
"top-down fantasy atlas map, marshlands and wetlands terrain, stylized forest clusters and muddy rivers, "
"hand-drawn cartography symbols, parchment texture, "
"small illustrated villages and ruins placed across the land, "
"classic fantasy atlas style, muted dark green palette, preserve layout"
),
},


# =====================
# CITY MAP
# =====================

"city": {

    "forest": (
        "top-down D&D style city map, medieval forest town, "
        "tabletop RPG battlemap, grid-based layout, structured streets and districts, "
        "symbolic buildings (market, inn, temple, towers, castle), "
        "hand-drawn inked map style, parchment background, muted earthy colors, "
        "clean readable layout, minimal shading, no cartoon style, preserve structure"
    ),

    "desert": (
        "top-down D&D style desert city map, sandstone architecture, "
        "tabletop RPG battlemap, structured districts and roads, "
        "symbolic buildings (palace, market, towers), "
        "inked parchment style, warm muted tones, "
        "clean layout, minimal shading, no cartoon style, preserve structure"
    ),

    "ice": (
        "top-down D&D style nordic city map, snow covered settlement, icy terrain, "
        "tabletop RPG battlemap, structured layout, "
        "symbolic buildings (fortress, towers, houses), "
        "inked parchment style, cold muted colors, minimal shading, "
        "clean readable layout, no cartoon style, preserve structure"
    ),

    "swamp": (
        "top-down D&D style swamp village map, wooden huts on wetlands, canals, muddy terrain, "
        "tabletop RPG battlemap, structured paths and layout, "
        "symbolic buildings (huts, towers), "
        "inked parchment style, dark muted greens and browns, "
        "clean layout, minimal shading, no cartoon style, preserve structure"
    ),
},


# =====================
# DUNGEON MAP
# =====================

"dungeon": {

"forest": (
"top-down dungeon battlemap, moss covered ruins, vegetation growing in corridors, "
"small illustrated icons representing doors, treasure rooms, structures and points of interest, "
"tabletop RPG battlemap style, preserve layout"
),

"desert": (
"top-down dungeon battlemap, ancient desert temple ruins, sandy corridors, cracked stone walls, "
"small illustrated icons representing rooms, structures and points of interest, "
"tabletop RPG battlemap style, preserve layout"
),

"ice": (
"top-down dungeon battlemap, frozen dungeon, icy stone walls, frost covered floors, "
"small illustrated icons representing rooms, structures and points of interest, "
"tabletop RPG battlemap style, preserve layout"
),

"swamp": (
"top-down dungeon battlemap, damp dungeon, muddy floors, wet stone walls, "
"small illustrated icons representing rooms, structures and points of interest, "
"tabletop RPG battlemap style, preserve layout"
),

}

}


NEGATIVE_PROMPTS = {

"world": (
"cartoon style, vibrant colors, mobile game map style, stylized 3d render, "
"chibi buildings, exaggerated shapes, bright saturated colors, "
"modern illustration style, glossy digital painting, concept art style"
),

"city": (
"realistic photography, street level view, perspective render, "
"3d isometric render, futuristic city, modern buildings, photorealistic lighting"
),

"dungeon": (
"landscape illustration, exterior environment, realistic cave photo, "
"3d render perspective view, cinematic lighting"
)

}

def get_prompt(map_type, environment):
    return PROMPTS.get(
        map_type,
        PROMPTS["world"]
    ).get(
        environment,
        "fantasy map preserve layout"
    )



async def beautify_map(
    image_bytes,
    map_type,
    environment
):
    if not STABILITY_API_KEY:
        print("no api key")
        return None

    prompt = get_prompt(map_type, environment)

    negative_prompt = NEGATIVE_PROMPTS.get(map_type, "")

    headers = {
        "Authorization": f"Bearer {STABILITY_API_KEY}",
        "Accept": "image/*",
    }

    files = {
        "image": ("map.png", image_bytes, "image/png")
    }

    data = {
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "control_strength": "0.7",
        "output_format": "png",
    }

    url = "https://api.stability.ai/v2beta/stable-image/control/sketch"

    async with httpx.AsyncClient(timeout=120) as client:
        r = await client.post(
            url,
            headers=headers,
            files=files,
            data=data
        )

        if r.status_code != 200:
            print("ERROR:", r.text)
            return None
        
        b64 = base64.b64encode(r.content).decode()

        return f"data:image/png;base64,{b64}"