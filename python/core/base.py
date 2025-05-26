from langchain_core.runnables import Runnable
from abc import ABC, abstractmethod


class AbstractAgent(ABC):
    @abstractmethod
    def communicate_with(self, people: str):
        """communicate with other people

        Args:
             people(str): name of the people
        """
        ...
