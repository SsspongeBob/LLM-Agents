from .base import AbstractAgent
from langchain_nvidia_ai_endpoints import ChatNVIDIA


class Agent(AbstractAgent):
    """Basic agent class"""
    def __init__(self, name: str):
        self.name = name
        self.brain = ChatNVIDIA(
            model="meta/llama-3.3-70b-instruct",
            temperature=0.6,
            # top_p=0.7,
            max_tokens=1024,
        )
        self.short_term_memory = ""

    def communicate_with(self, people):
        pass


if __name__ == "__main__":
    agent = Agent("John")
    agent.short_term_memory = "1"
