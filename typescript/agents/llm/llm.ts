import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { ChatOllama } from "@langchain/ollama"
import { DynamicStructuredTool } from "@langchain/core/tools";
import { config } from "dotenv";
import { infer as ZInfer, ZodObject } from "zod";
import { IAvailableTools, TOOLS_MAPPING } from "../tools/tools";
import { IAvailableModels } from "./schema";

// Load environment variables
config({ override: true });

// Setup logging
const logger = console;

/**
 * Implementation of Chatting with Large Language model.
 */
export class LLM<SchemaType extends ZodObject<any, any> = any> {
  private model: ChatOpenAI | ChatOllama;
  private tools?: DynamicStructuredTool[];
  private schema?: SchemaType;

  /**
   * Implementation of Chatting with Large Language model.
   * @param model name of the LLM.
   * @param options equip the LLM with other abilities, `tools` or `schema` if provided.
   */
  constructor(
    model: IAvailableModels,
    useOpenai: boolean = true,
    options?: {
      tools?: DynamicStructuredTool[],
      schema?: {
        schemaModel: SchemaType,
        schemaName: string,
      }
    },
  ) {
    this.model = useOpenai ? new ChatOpenAI({
      model,
      apiKey: process.env.OLLAMA_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY,
      configuration: {
        baseURL: process.env.OLLAMA_OPENAI_SERVER_URL ?? process.env.OPENAI_BASE_URL
      }
    }) : new ChatOllama({ model, baseUrl: process.env.OLLAMA_SERVER_URL });
    this.tools = options?.tools;
    this.schema = options?.schema?.schemaModel;

    if (this.tools) {
      // @ts-ignore
      this.model = this.model.bindTools(this.tools);
      logger.info(
        `LLM binded with tools: [${this.tools.map((tool) => tool.name).join(" ")}]`
      );
    } else if (this.schema) {
      // @ts-ignore
      this.model = this.model.withStructuredOutput(this.schema, { name: options?.schema?.schemaName });
      logger.info(
        `LLM successfully binded with structured output zod schema !`
      );
    } else {
      logger.info(
        "No tools or schema found, use the pure text generation of LLM."
      );
    }
  }

  /**
   * text to text generation by LLM.
   * @param messages messeges feeded to the LLM.
   * @returns string based response from the LLM.
   */
  async generate(
    messages: string | BaseMessage[]
  ): Promise<string> {
    const parsedMsgs = typeof messages === "string"
      ? [new HumanMessage({ content: messages })]
      : messages;

    if (this.schema) {
      throw new Error(
        "Please use 'generateStructuredOutput' method to generate structured output!"
      );
    }

    if (this.tools) {
      const aiMsg = await this.model.invoke(parsedMsgs) as AIMessage;
      if (aiMsg.tool_calls) {
        parsedMsgs.push(aiMsg);
        for (const toolCall of aiMsg.tool_calls) {
          const tool: DynamicStructuredTool = TOOLS_MAPPING[toolCall.name as IAvailableModels];
          const toolMsg = await tool.invoke(toolCall);
          parsedMsgs.push(toolMsg);
        }
        const finalResponse = await this.model.invoke(parsedMsgs);
        return finalResponse.content as string;
      }
      return aiMsg.content as string;
    }

    // If neither tools nor schema exists, parse the pure LLM result
    const chain = this.model.pipe(new StringOutputParser());
    return chain.invoke(parsedMsgs);
  }

  /**
   * streaming response form the LLM.
   * @param messages messeges feeded to the LLM.
   * @returns an `AsyncGenerator` to stream the response from the LLM.
   */
  async *streamGenerate(
    messages: string | BaseMessage[]
  ): AsyncGenerator<string> {
    const parsedMsgs = typeof messages === "string"
      ? [new HumanMessage({ content: messages })]
      : messages;

    if (this.schema) {
      throw new Error(
        "Please use 'generateStructuredOutput' method to generate structured output!"
      );
    }

    if (this.tools) {
      const aiMsg = await this.model.invoke(parsedMsgs) as AIMessage;
      if (aiMsg.tool_calls) {
        parsedMsgs.push(aiMsg);
        for (const toolCall of aiMsg.tool_calls) {
          const tool = TOOLS_MAPPING[toolCall.name as IAvailableTools];
          const toolMsg = await tool.invoke(toolCall);
          parsedMsgs.push(toolMsg);
        }
        for await (const chunk of await this.model.stream(parsedMsgs)) {
          yield chunk.content as string;
        }
      } else {
        for await (const chunk of aiMsg.content) {
          yield chunk as string;
        }
      }
    } else {
      // If neither tools nor schema exists, parse the pure LLM result
      const chain = this.model.pipe(new StringOutputParser());
      yield* await chain.stream(parsedMsgs);
    }
  }

  /**
   * structured output following the given `schema` from the LLM.
   * @param messages messeges feeded to the LLM.
   * @returns response from the LLM following the given `schema`.
   */
  async generateStructuredOutput(
    messages: string | BaseMessage[]
  ): Promise<ZInfer<SchemaType>> {
    if (!this.schema) {
      throw new Error("Schema is required for structured output generation");
    }
    const result = await this.model.invoke(messages);
    return result;
  }
}
