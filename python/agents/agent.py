from typing import Optional
import networkx as nx
from agents.llm.llm import LLM
from environment.path_finder import path_finder
from environment.environment import ILOCATIONS, LOCATIONS
from langchain_core.prompts import PromptTemplate
from agents.prompt_template.template import (
    PLANNING_WITH_CHARACTER_PROMPT,
    DOINGS_WITH_CHARACTER_PROMPT,
    EMOJI_PROMPT,
    DESIRED_LOCATIONS_WITH_CHARACTER_PROMPT,
    DESIRED_TODOS_WITH_EMOJI_WITH_CHARACTER_PROMPT,
)
from agents.llm.schema import LocationName, DesiredTodosWithEmoji
import logging
from deprecated import deprecated

logger = logging.getLogger(__name__)


class Agent:
    """
    An agent representing a single character in the virtual world.

    Attributes:
    -----------
    name : str
        The name of the agent.
    age  : int
        The age of the agent.
    personality : str
        A brief description of the agent.
    plans : str
        The agent's daily plans, generated at the beginning of each day.
    emojis: str
        The emojis that represents the agent's mood.
    location : str
        The current location of the agent in the simulated environment.
    desired_location: str
        The desired location the character wants to move to.
    _memories : list
        A list of memories the agent has about their interactions.
    _compressed_memories : list
        A list of compressed memories that summarize the agent's experiences.

    Methods:
    --------
    planning(global_time, town_people, prompt_meta):
        Generates the agent's daily plan.

    execute(other_agents, location, global_time, town_areas, prompt_meta):
        Executes the agent's action based on their current situation and interactions with other agents.

    reflect():
        Reviews the persona's memory and create new thoughts based on it.

    update_memories(other_agents, global_time, action_results):
        Updates the agent's memories based on their interactions with other agents.

    compress_memories/reflection(memory_ratings, global_time, MEMORY_LIMIT=10):
        Compresses the agent's memories to a more manageable and relevant set.

    rate_locations(locations, town_areas, global_time, prompt_meta):
        Rates different locations in the simulated environment based on the agent's preferences and experiences.
    """

    def __init__(
        self,
        *,
        name: str,
        age: int,
        personality: str,
        location: ILOCATIONS,
        brain: LLM,
        relationships: Optional[nx.graph.Graph] = None,
    ) -> None:
        self.name = name
        self.age = age
        self.personality = personality
        self.location = location
        self.desired_location = location
        self.plans = ""
        self.emojis = "😀"
        self._memories = []
        self._compressed_memories = []
        self.relationships = relationships
        self.brain = brain

    def _update_status(
        self, memory_chunk: str = None, desired_location: str = None, emojis: str = None
    ) -> None:
        """Update the agent's status, including memory, desired_location and emojis.

        Args:
            memory_chunk (str): the memory to be updated.
            desired_location (str): the desired location to be updated.
            emojis (str): the emojis to be updated.
        """
        updates = []
        if memory_chunk:
            self._memories.append(memory_chunk)
            updates.append(f"memory: {memory_chunk}")
        if desired_location:
            self.desired_location = desired_location
            updates.append(f"desired_location: {desired_location}")
        if emojis:
            self.emojis = emojis
            updates.append(f"emojis: {emojis}")

        if updates:
            logger.info(f"Status updated - {' | '.join(updates)}")

    def planning(self, global_time: int) -> None:
        """Generates the agent's daily plan."""
        descriptions = ""
        for location, info in LOCATIONS.items():
            descriptions += "{}: {}\n".format(location, info["description"])
        plannings = PromptTemplate.from_template(PLANNING_WITH_CHARACTER_PROMPT).format(
            name=self.name,
            age=self.age,
            personality=self.personality,
            number=len(LOCATIONS.keys()),
            descriptions=descriptions,
            time=global_time,
        )
        # streaming
        print("Daily plans generated: \n")
        for plans_chunk in self.brain.stream_generate(plannings):
            self.plans += plans_chunk
            print(plans_chunk, end="", flush=True)
        # non-streaming
        # plans = self.brain.generate(plannings)
        # self.plans = plans
        # print(f"Daily plans generated: \n{plans}")

    async def async_planning(self, global_time: int) -> None:
        """Generates the agent's daily plan."""
        descriptions = ""
        for location, info in LOCATIONS.items():
            descriptions += "{}: {}\n".format(location, info["description"])
        plannings = await PromptTemplate.from_template(
            PLANNING_WITH_CHARACTER_PROMPT
        ).aformat(
            name=self.name,
            age=self.age,
            personality=self.personality,
            number=len(LOCATIONS.keys()),
            descriptions=descriptions,
            time=global_time,
        )
        # async streaming
        print("Daily plans generated: \n")
        async for chunk in self.brain.astream_generate(plannings):
            self.plans += chunk
            print(chunk, end="", flush=True)
        # non-async-streaming
        # plans = await self.brain.agenerate(plannings)
        # self.plans = plans
        # print(f"Daily plans generated: \n{plans}")

    def execute(self, global_time: int):
        """According to the agent's situation, choose to do his own things or chat with other agents.

        For now, based on global time, generate three things: things to do, place to go and current status.
        """
        if not self.plans:
            raise "Please generate the daily plan first!"
        descriptions = ""  # descriptions of all locations
        for location, info in LOCATIONS.items():
            descriptions += "{}: {}\n".format(location, info["description"])
        goings_and_doings = PromptTemplate.from_template(
            DESIRED_TODOS_WITH_EMOJI_WITH_CHARACTER_PROMPT
        ).format(
            name=self.name,
            age=self.age,
            personality=self.personality,
            number=len(LOCATIONS.keys()),
            descriptions=descriptions,
            plans=self.plans,
            time=global_time,
        )
        desired_todos_with_emoji: DesiredTodosWithEmoji = self.brain.equip_with_schema(
            DesiredTodosWithEmoji
        ).generate_structured_output(goings_and_doings)
        ### update status ###
        self._update_status(
            memory_chunk=f"[Right now is {global_time}:00, your doings: {desired_todos_with_emoji.action} at {desired_todos_with_emoji.desired_location}]",
            desired_location=desired_todos_with_emoji.desired_location,
            emojis=desired_todos_with_emoji.emojis,
        )
        action, desired_location, emojis = (
            desired_todos_with_emoji.model_dump().values()
        )
        return action, desired_location, emojis

    def reflect():
        """Compresses the agent's memories to a more manageable and relevant set, in the other world: reflection."""
        pass

    def move(
        self,
        maze: list[list[str]],
    ) -> list[tuple[int, int]]:
        """Compare current location with the desired destination, decide whether to move.

        Args:
            maze (list[list[str]]): the maze of the environment.

        Returns:
            list[tuple[int, int]]: the path to the desired location.
        """
        if self.location == self.desired_location:
            logger.info(f"Already at the desired location: {self.desired_location}")
            return [LOCATIONS[self.desired_location]["coordinate"]]
        # if not, reach the desired location
        tracer = path_finder(
            maze,
            LOCATIONS[self.location]["coordinate"],
            LOCATIONS[self.desired_location]["coordinate"],
            collision_block_char="#",
        )
        # update the location
        self.location = self.desired_location
        logger.info(f"Move Successfully! current location: {self.location}")
        return tracer

    @deprecated(version="0.2.0", reason="Combined to function 'execute'")
    def reply_with_emojis(self, global_time: int) -> str:
        """According to the global time, tell others what he is going to do with emojis.
        Firstly, generate the daily plan, then reply with emojis.
        """
        if not self.plans:
            raise "Please generate the daily plan first!"
        ### waht are you doing right now ###
        what_are_u_doing = PromptTemplate.from_template(
            DOINGS_WITH_CHARACTER_PROMPT
        ).format(
            name=self.name,
            age=self.age,
            personality=self.personality,
            plans=self.plans,
            time=global_time,
        )
        memory_right_now = self.brain.generate(what_are_u_doing)
        ### update memory ###
        self._update_status(
            f"[Right now is {global_time}:00, your doings: {memory_right_now}]"
        )
        ### reply with emojis ###
        reply_with_emojis = PromptTemplate.from_template(EMOJI_PROMPT).format(
            description=memory_right_now
        )
        emojis = self.brain.generate(reply_with_emojis)
        return emojis

    @deprecated(version="0.2.0", reason="Combined to function 'execute'")
    def rate_locations(self, global_time: str) -> str:
        """update the location where agent wants to go most."""
        if not self.plans:
            raise "Please generate the daily plan first!"
        descriptions = ""
        for location, info in LOCATIONS.items():
            descriptions += "{}: {}\n".format(location, info["description"])
        where_are_u_going = PromptTemplate.from_template(
            DESIRED_LOCATIONS_WITH_CHARACTER_PROMPT
        ).format(
            name=self.name,
            age=self.age,
            personality=self.personality,
            number=len(LOCATIONS.keys()),
            descriptions=descriptions,
            time=global_time,
            plans=self.plans,
        )
        # structured output of the name of the location.
        location: LocationName = self.brain.equip_with_schema(
            LocationName
        ).generate_structured_output(where_are_u_going)
        ### update the desired location ###
        self.desired_location = location.location_name
        return location.location_name

    def __repr__(self):
        return f"#name#: {self.name}\n#personality#: {self.personality}\n#location#: {self.location}"


if __name__ == "__main__":
    import json
    from environment.environment import maze

    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s"
    )

    ## get all people's info
    with open("agents/characters.json", encoding="utf-8") as file:
        characters = json.load(file)
        name = "Alex"
        alex = characters[name]

    ## create different people
    Alex = Agent(
        name=alex["name"],
        age=alex["age"],
        personality=alex["personality"],
        location=alex["starting_location"],
        brain=LLM("gpt-4o-mini", use_openai=True),
    )

    wakeup_time = input("Input time for waking up: ")
    Alex.planning(wakeup_time)

    print("\n")

    for time in range(7, 23):
        print(f"current time: {time}:00")

        action, desired_location, emojis = Alex.execute(time)
        print(
            f"todos: {action}, \ndesired_location: {desired_location}, \nemojis: {emojis};",
        )

        tracer = Alex.move(maze)
        print(f"Movement tracer: {tracer}", end="\n\n")
