from langchain.tools import tool


@tool("get_current_weather")
def get_current_weather(location: str) -> str:
    """Get the current weather in a given location."""
    return "sunny"


@tool("move_to_certain_place")
def move_to_certain_place(place: str) -> str:
    """Move the character to certain palce."""
    return place
