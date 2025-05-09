import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import { CalculatorSchema, MoveMentSchema, WeatherSchema } from "./schema";

// calculation
const calculatorTool = tool(
  async ({ operation, number1, number2 }) => {
    // Functions must return strings
    if (operation === "add") {
      return `${number1 + number2}`;
    } else if (operation === "subtract") {
      return `${number1 - number2}`;
    } else if (operation === "multiply") {
      return `${number1 * number2}`;
    } else if (operation === "divide") {
      return `${number1 / number2}`;
    } else {
      throw new Error("Invalid operation.");
    }
  },
  {
    name: "calculator",
    description: "Can perform mathematical operations.",
    schema: CalculatorSchema
  }
);

// weather
const getCurrentWeather = tool(
  async ({ location }) => {
    return "sunny";
  },
  {
    name: "getCurrentWeather",
    description: "Get the current weather in a given location.",
    schema: WeatherSchema
  }
)

// movement
const moveToPlace = tool(
  async ({ place }) => {
    return place;
  },
  {
    name: "moveToPlace",
    description: "Move the character to certain place.",
    schema: MoveMentSchema
  }
)

// Define available tool types
export type IAvailableTools = "calculator" | "getCurrentWeather" | "moveToPlace";

// Create tools mapping
export const TOOLS_MAPPING: Record<IAvailableTools, DynamicStructuredTool<any>> = {
  "calculator": calculatorTool,
  "getCurrentWeather": getCurrentWeather,
  "moveToPlace": moveToPlace
};

// Function to pick tools for langchain
export function pickedTools(...args: IAvailableTools[]): DynamicStructuredTool[] {
  return args.map(toolName => TOOLS_MAPPING[toolName]);
}
