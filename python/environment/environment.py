from typing import Literal, Dict, Tuple

# map loading 8×13
maze = [
    ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    [" ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " ", " ", "#"],
    ["#", " ", "#", " ", " ", "#", "#", " ", " ", " ", "#", " ", "#"],
    ["#", " ", "#", " ", " ", "#", "#", " ", "#", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", " ", " ", " ", "#", " ", " ", " ", "#"],
    ["#", "#", "#", " ", "#", " ", "#", "#", "#", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " "],
    ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
]

# location info
ILOCATIONS = Literal[
    "home",
    "library",
    "artStudio",
    "lab",
    "cafe",
    "park",
]
IMETADATA = Literal["coordinate", "description"]

LOCATIONS: Dict[ILOCATIONS, Dict[IMETADATA, Tuple[int, int] | str]] = {
    "home": {
        "coordinate": (5, 3), # (488, 609)
        "description": "a place to relax and unwind, where you can find comfort and peace.",
    },
    "library": {
        "coordinate": (1, 1), # (83, 609)
        "description": "a quiet place filled with books, perfect for reading and studying.",
    },
    "artStudio": {
        "coordinate": (6, 1), # (662, 199)
        "description": "a creative space with art supplies, ideal for artists to work on their projects.",
    },
    "lab": {
        "coordinate": (2, 7), # (742, 469)
        "description": "a laboratory equipped for experiments, where scientific discoveries are made.",
    },
    "cafe": {
        "coordinate": (1, 5), # (630, 424)
        "description": "a coffee shop serving various beverages, a great spot to meet friends and enjoy a drink.",
    },
    "park": {
        "coordinate": (4, 10), # (1090, 224)
        "description": "a peaceful park with benches, a lovely place to take a walk and enjoy nature.",
    },
}
