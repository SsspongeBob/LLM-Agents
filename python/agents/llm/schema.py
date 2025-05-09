from typing import Dict, Literal, Optional, List
from typing_extensions import get_args
from pydantic import BaseModel, Field

IAVAILABLE_MODELS = Literal[
    # openai official
    "gpt-4o-mini",
    # openai compatible
    "llama-3-8b-instruct-chinese",  # streaming error, function calling free, structured output free
    "QWQ",  # streaming error, function calling error, structured output error
    # ollama
    "qwen2.5:14b",
    "gemma2:27b",
    # "qwq:latest",
    "llama3.1:8b-instruct-q5_K_M",  # streaming free, function calling error, structured output error
]

AVAILABLE_MODELS: Dict[IAVAILABLE_MODELS, str] = {
    model: model for model in get_args(IAVAILABLE_MODELS)
}


### Structured Output Schema ###
class Joke(BaseModel):
    """Joke to tell user."""

    setup: str = Field(description="The setup of the joke")
    punchline: str = Field(description="The punchline to the joke")
    rating: Optional[int] = Field(
        default=None, description="How funny the joke is, from 1 to 10"
    )


class LocationName(BaseModel):
    "Name of the building you want to go most."

    location_name: str = Field(description="Name of the building.")


class DesiredTodosWithEmoji(BaseModel):
    """Action you are going to take and the place you want to go, plus emojis."""

    action: str = Field(
        description="What are you going to do, described in at most 20 words"
    )
    desired_location: str = Field(
        description="Name of the building where you want to go most"
    )
    emojis: str = Field(
        description="One or two emojis that describe your mood and the action",
        # pattern=r"^[\p{Emoji}]{1,2}$",  # Ensures 1-2 emoji characters only
    )
