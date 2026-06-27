from generators.dungeon import DungeonGenerator
from generators.environments.forest import ForestEnvironment

def print_map(grid):
    for row in grid:
        print("".join([
            "." if cell == "floor"
            else "T" if cell == "tree"
            else "R" if cell == "rock"
            else "#"
            for cell in row
        ]))

gen = DungeonGenerator(seed=42)
env = ForestEnvironment(seed=42)

result = gen.generate(50, 25)
result = env.apply(result)

print("=== MAP WITH FOREST ===")
print_map(result["tiles"])

print("\n=== META ===")
print(result["meta"])