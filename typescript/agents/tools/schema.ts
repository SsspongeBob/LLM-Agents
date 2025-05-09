import { z } from "zod";

const CalculatorSchema = z.object({
  operation: z
    .enum(["add", "subtract", "multiply", "divide"])
    .describe("The type of operation to execute."),
  number1: z.number().describe("The first number to operate on."),
  number2: z.number().describe("The second number to operate on."),
})

const WeatherSchema = z.object({
  location: z.string().describe("The location to get the weather for."),
})

const MoveMentSchema = z.object({
  place: z.string().describe("The place to move to."),
})

export { CalculatorSchema, WeatherSchema, MoveMentSchema };
