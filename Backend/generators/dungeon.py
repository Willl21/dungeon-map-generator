import random
from dataclasses import dataclass


@dataclass
class Room:
    x: int
    y: int
    w: int
    h: int

    @property
    def center(self):
        return (self.x + self.w // 2, self.y + self.h // 2)


class DungeonGenerator:
    def __init__(self, seed: int = None):
        self.rng = random.Random(seed)

    def generate(self, width: int, height: int) -> dict:
        grid = [["wall"] * width for _ in range(height)]
        rooms: list[Room] = []

        self._split(0, 0, width, height, 4, grid, rooms)

        self._connect_rooms(grid, rooms, width, height)
        objects = self._place_objects(rooms)

        return {
            "tiles": grid,
            "objects": objects,
            "meta": {
                "type": "dungeon"
            }
        }

    # ========================
    # INTERNAL LOGIC (PRIVATE)
    # ========================

    def _split(self, x, y, w, h, depth, grid, rooms):
        if depth == 0 or w < 8 or h < 6:
            rx = x + self.rng.randint(1, 3)
            ry = y + self.rng.randint(1, 3)
            rw = w - self.rng.randint(3, 5)
            rh = h - self.rng.randint(3, 5)

            if rw >= 4 and rh >= 3:
                rooms.append(Room(rx, ry, rw, rh))
                for dy in range(rh):
                    for dx in range(rw):
                        if 0 <= ry+dy < len(grid) and 0 <= rx+dx < len(grid[0]):
                            grid[ry+dy][rx+dx] = "floor"
            return

        if w > h:
            cut = self.rng.randint(int(w*0.35), int(w*0.65))
            self._split(x, y, cut, h, depth-1, grid, rooms)
            self._split(x+cut, y, w-cut, h, depth-1, grid, rooms)
        else:
            cut = self.rng.randint(int(h*0.35), int(h*0.65))
            self._split(x, y, w, cut, depth-1, grid, rooms)
            self._split(x, y+cut, w, h-cut, depth-1, grid, rooms)

    def _connect_rooms(self, grid, rooms, width, height):
        def carve_corridor(ax, ay, bx, by):
            x, y = ax, ay

            while x != bx:
                if 0 <= y < height and 0 <= x < width:
                    grid[y][x] = "floor"
                x += 1 if x < bx else -1

            while y != by:
                if 0 <= y < height and 0 <= x < width:
                    grid[y][x] = "floor"
                y += 1 if y < by else -1

        for i in range(len(rooms) - 1):
            ax, ay = rooms[i].center
            bx, by = rooms[i+1].center
            carve_corridor(ax, ay, bx, by)

    def _place_objects(self, rooms):
        objects = []

        for i, room in enumerate(rooms):
            cx, cy = room.center

            if i == 0:
                objects.append({"type": "entrance", "x": cx, "y": cy})
            elif i == len(rooms) - 1:
                objects.append({"type": "exit", "x": cx, "y": cy})
            elif self.rng.random() < 0.3:
                objects.append({"type": "chest", "x": cx, "y": cy})
            elif self.rng.random() < 0.4:
                objects.append({"type": "rock", "x": cx+1, "y": cy+1})

        return objects