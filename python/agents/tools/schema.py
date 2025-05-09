from typing import Dict, Literal, Callable, Any, Tuple
from .tools import get_current_weather, move_to_certain_place
from langchain_core.tools import BaseTool

IAVAILABLE_TOOLS = Literal["get_current_weather", "move_to_certain_place"]

TOOLS_MAPPING: Dict[IAVAILABLE_TOOLS, BaseTool] = {
    "get_current_weather": get_current_weather,
    "move_to_certain_place": move_to_certain_place
}

# tools list for langchain tools
def picked_tools(*args: IAVAILABLE_TOOLS):
    tools = []
    for func in args:
        tools.append(TOOLS_MAPPING[func])
    return tools
