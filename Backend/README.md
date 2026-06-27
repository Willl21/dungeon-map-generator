# D&D Map Generator — Backend

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env → isi REPLICATE_API_TOKEN
```

## Jalankan

```bash
uvicorn main:app --reload --port 8000
```

API docs otomatis tersedia di: http://localhost:8000/docs

## Endpoints

### POST /generate

```json
{
  "map_type": "dungeon",   // dungeon | world | cave | city
  "seed": 42,
  "width": 40,
  "height": 30,
  "beautify": true         // false = skip Stable Diffusion
}
```

### Response

```json
{
  "seed": 42,
  "map_type": "dungeon",
  "width": 40,
  "height": 30,
  "tiles": [["wall","wall","floor",...], ...],
  "objects": [{"type":"chest","x":10,"y":8}, ...],
  "image_url": "https://replicate.delivery/..."
}
```

## Alur Hybrid

```
1. Frontend kirim request params
2. Backend jalankan algoritma PCG → tiles[][] + objects[]
3. Pillow render grid → PNG (input SD)
4. Replicate API (SD img2img) beautify PNG → illustrated map
5. Return JSON + image_url ke frontend
```

## Algoritma per map type

| Map type | Algoritma         | Parameter utama         |
|----------|-------------------|-------------------------|
| dungeon  | BSP Tree          | seed, width, height     |
| world    | Perlin Noise      | seed, width, height     |
| cave     | Cellular Automata | seed, width, height     |
| city     | Voronoi Diagram   | seed, width, height     |
