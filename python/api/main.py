import os
import sys

# Add the project root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, WebSocket
from agents.agent import Agent
from agents.llm.llm import LLM
from environment.environment import maze
import json
import asyncio

app = FastAPI()

groups = []


@app.websocket("/agents/{agent_name}")
async def websocket_endpoint(websocket: WebSocket, agent_name: str, wake_up_time: int):
    await websocket.accept()
    with open("agents/characters.json", encoding="utf-8") as file:
        characters = json.load(file)
        agent_info = characters[agent_name]
    await websocket.send_text(f"Creating character {agent_info['name']}, please wait...")
    agent = Agent(
        name=agent_info["name"],
        age=agent_info["age"],
        personality=agent_info["personality"],
        location=agent_info["starting_location"],
        brain=LLM("gpt-4o-mini", use_openai=True),
    )
    await websocket.send_text(f"Character {agent.name} created, info below:")
    await websocket.send_json(json.dumps(agent_info))
    await websocket.send_text(f"Planning for the day, please wait...")
    # async planning
    await agent.async_planning(wake_up_time)
    await websocket.send_text(f"My plan for today:\n {agent.plans}")
    await asyncio.sleep(1)

    while True:
        await websocket.send_text(f"{agent.name}: give me the time and i wil give you the todos :)")
        global_time = await websocket.receive_text()
        action, desired_location, emojis = agent.execute(global_time)
        await websocket.send_text(f"{agent.name}:{emojis}\n I will {action} at {desired_location} in {global_time}:00.")
        await asyncio.sleep(3)
        if agent.location == desired_location:
            await websocket.send_text(f"{agent.name}: Already at {desired_location}")
            pass
        else:
            await websocket.send_text(f"{agent.name}: Moving to {desired_location}")
        await asyncio.sleep(1)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", reload=True)
