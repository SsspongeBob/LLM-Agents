import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_ollama import ChatOllama
from langchain_core.language_models.base import LanguageModelInput
from langchain_core.messages import BaseMessage, AIMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.tools import BaseTool
from agents.llm.schema import IAVAILABLE_MODELS, AVAILABLE_MODELS
from agents.tools.schema import picked_tools, TOOLS_MAPPING
from typing import (
    List,
    Optional,
    Sequence,
    Union,
    Dict,
    Any,
    Type,
    Callable,
    TypeVar,
    Generic,
    Generator,
    AsyncGenerator,
    Coroutine,
)
from pydantic import BaseModel
import logging

load_dotenv(override=True)
logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)


class LLM(Generic[T]):
    """Implementation of Chatting with Large Language model."""

    """the core language model for LLM."""
    model: ChatOpenAI | ChatOllama
    """tools binded to the LLM."""
    toos: Optional[Sequence[Union[Dict[str, Any], Type, Callable, BaseTool]]] = None
    """schema to acheive structured output."""
    schema: Optional[Type[T]] = None

    def __init__(
        self,
        model_name: IAVAILABLE_MODELS,
        use_openai: bool = True,
        *,
        tools: Optional[
            Sequence[Union[Dict[str, Any], Type, Callable, BaseTool]]
        ] = None,
        schema: Optional[Type[T]] = None,
        **kwargs,
    ) -> None:
        """Initialization of large language model.
           Without any of tools or schema, LLM can generate outputs by themselves in pure string,
           With tools, LLM can use external tools, the output is also a pure string,
           With schema, structured output is generated, but the output is not pure string.

        Args:
            model: the name of the model.
            tools: tools for the llm to bind.
            schema: schema for the structured output, output is pydantic BaseModel.
        """
        if use_openai:
            logger.info("***Currently using OpenAI Compatible Interface.***")
        self.model = (
            ChatOpenAI(model=model_name, **kwargs)
            if use_openai
            else ChatOllama(
                model=model_name, base_url=os.environ["OLLAMA_SERVER_URL"], **kwargs
            )
        )
        self.tools = tools
        self.schema = schema
        if self.tools:
            self.model = self.model.bind_tools(tools)
            logger.info(
                f"LLM binded with tools: [{' '.join([tool.name for tool in tools])}]"
            )
        elif self.schema:
            self.model = self.model.with_structured_output(schema)
            logger.info(
                f"LLM with with_structured_output schema: {schema.model_json_schema()['title']}"
            )
        else:
            logger.info(
                "No tools or schama found, use the pure text generation capability of LLM."
            )

    def generate(self, messages: LanguageModelInput) -> str:
        """Text completion generation.

        Args:
        - messages (LanguageModelInput): The langchain messages input.

        Returns:
        - str: The generated text completion.
        """
        parsed_msgs = (
            [HumanMessage(content=messages)] if isinstance(messages, str) else messages
        )
        if self.schema:
            logger.error(
                "Please use 'generate_structured_output' method to generate structured_output!"
            )
            raise "Please use 'generate_structured_output' method to generate structured_output!"
        if self.tools:
            ai_msg: AIMessage = self.model.invoke(parsed_msgs)
            if ai_msg.tool_calls:
                parsed_msgs.append(ai_msg)
                for tool_call in ai_msg.tool_calls:
                    tool_msg = TOOLS_MAPPING[tool_call["name"]].invoke(tool_call)
                    parsed_msgs.append(tool_msg)
                return self.model.invoke(parsed_msgs).content
            return ai_msg.content
        # if neither tools nor schema exists, parse the pure llm result
        chain = self.model | StrOutputParser()
        return chain.invoke(parsed_msgs)

    async def agenerate(self, messages: LanguageModelInput) -> Coroutine[Any, Any, str]:
        """Async text completion generation.

        Args:
        - messages (LanguageModelInput): The langchain messages input.

        Returns:
        - Coroutine[Any, Any, str]: The generated text completion.
        """
        parsed_msgs = (
            [HumanMessage(content=messages)] if isinstance(messages, str) else messages
        )
        if self.schema:
            logger.error(
                "Please use 'generate_structured_output' method to generate structured_output!"
            )
            raise "Please use 'generate_structured_output' method to generate structured_output!"
        if self.tools:
            ai_msg: AIMessage = await self.model.ainvoke(parsed_msgs)
            if ai_msg.tool_calls:
                parsed_msgs.append(ai_msg)
                for tool_call in ai_msg.tool_calls:
                    tool_msg = await TOOLS_MAPPING[tool_call["name"]].ainvoke(tool_call)
                    parsed_msgs.append(tool_msg)
                return (await self.model.ainvoke(parsed_msgs)).content
            return ai_msg.content
        # if neither tools nor schema exists, parse the pure llm result
        chain = self.model | StrOutputParser()
        return await chain.ainvoke(parsed_msgs)

    def stream_generate(
        self, messages: LanguageModelInput
    ) -> Generator[str, Any, None]:
        """Streaming text completion generation.

        Args:
        - messages (LanguageModelInput): The langchain messages input.

        Returns:
        - Generator[str, Any, None]: The streaming iterator of generated text completion.
        """
        parsed_msgs = (
            [HumanMessage(content=messages)] if isinstance(messages, str) else messages
        )
        if self.schema:
            logger.error(
                "Please use 'generate_structured_output' method to generate structured_output!"
            )
            raise "Please use 'generate_structured_output' method to generate structured_output!"
        elif self.tools:
            ai_msg: AIMessage = self.model.invoke(parsed_msgs)
            if ai_msg.tool_calls:
                parsed_msgs.append(ai_msg)
                for tool_call in ai_msg.tool_calls:
                    tool_msg = TOOLS_MAPPING[tool_call["name"]].invoke(tool_call)
                    parsed_msgs.append(tool_msg)
                for msg_chunk in self.model.stream(parsed_msgs):
                    yield msg_chunk.content
            else:
                yield from ai_msg.content
        # if neither tools nor schema exists, parse the pure llm result
        else:
            chain = self.model | StrOutputParser()
            yield from chain.stream(parsed_msgs)

    async def astream_generate(
        self, messages: LanguageModelInput
    ) -> AsyncGenerator[str, None]:
        """Async streaming text completion generation.

        Args:
        - messages (LanguageModelInput): The langchain messages input.

        Returns:
        - AsyncGenerator[str, None]: The streaming iterator of generated text completion.
        """
        parsed_msgs = (
            [HumanMessage(content=messages)] if isinstance(messages, str) else messages
        )
        if self.schema:
            logger.error(
                "Please use 'generate_structured_output' method to generate structured_output!"
            )
            raise "Please use 'generate_structured_output' method to generate structured_output!"
        elif self.tools:
            ai_msg: AIMessage = await self.model.ainvoke(parsed_msgs)
            if ai_msg.tool_calls:
                parsed_msgs.append(ai_msg)
                for tool_call in ai_msg.tool_calls:
                    tool_msg = await TOOLS_MAPPING[tool_call["name"]].ainvoke(tool_call)
                    parsed_msgs.append(tool_msg)
                async for msg_chunk in self.model.astream(parsed_msgs):
                    yield msg_chunk.content
            else:
                async for chunk in ai_msg.content:
                    yield chunk
        # if neither tools nor schema exists, parse the pure llm result
        else:
            chain = self.model | StrOutputParser()
            async for chunk in chain.astream(parsed_msgs):
                yield chunk

    def generate_structured_output(self, messages: LanguageModelInput) -> T:
        """Generate output with structured schema with dynamic type hints.

        Args:
            messages: The input messages to process

        Returns:
            T: A structured output matching the schema type provided during initialization
        """
        if not self.schema:
            logger.error(
                "Please use 'generate' method to generate text or tool output!"
            )
            raise "Please use 'generate' method to generate text or tool output!"
        return self.model.invoke(messages)

    def equip_with_tools(
        self, tools: Optional[Sequence[Union[Dict[str, Any], Type, Callable, BaseTool]]]
    ) -> "LLM":
        """provide the LLM with tools and return a new LLM.

        Args:
        - tools: tools binded to LLM.

        Return:
        - LLM: a new LLM binded with tools.
        """
        if self.tools:
            raise "LLM already binds with tools."
        elif self.schema:
            raise "LLM already binds with schema."
        else:
            return LLM(model_name=self.model.model_name, tools=tools)

    def equip_with_schema(self, schema: Optional[Type[T]]) -> "LLM":
        """provide the LLM with schema and return a new LLM.

        Args:
        - schema: schema binded to LLM.

        Returns:
        - LLM: a new LLM producing structured output based on given schema.
        """
        if self.schema:
            raise "LLM already binds with schema."
        elif self.tools:
            raise "LLM already binds with tools."
        else:
            return LLM(model_name=self.model.model_name, schema=schema)


if __name__ == "__main__":
    from .schema import Joke

    # llm = LLM(model_name="gpt-4o-mini")
    llm = LLM(
        model_name="gpt-4o-mini",
        use_openai=True,
        tools=picked_tools("get_current_weather"),
    )
    # llm = LLM(model_name="QWQ", schema=Joke)

    # print(llm.generate("Hello"))
    print(llm.generate("北京天气怎么样？"))

    # for chunk in llm.stream_generate("Hello"):
    #     print(chunk, end="", flush=True)
    #     print("\n")

    # print(llm.generate_structured_output("Tell me a joke."))
