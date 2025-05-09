import { z } from 'zod';

// Define available model types
type IAvailableModels =
  /* openai official */
  | "gpt-4o-mini"
  /* openai compatible */
  | "llama-3-8b-instruct-chinese" // streaming error, function calling free, structured output free
  | "QWQ" // streaming error, function calling error, structured output error
  /* Ollama */
  | "qwen2.5:14b"
  | "gemma2:27b"
  // "qwq:latest"
  | "llama3.1:8b-instruct-q5_K_M" // streaming free, function calling error, structured output error

// Structured Output Schema
const JokeSchema = z.object({
  setup: z.string().describe("The setup of the joke"),
  punchline: z.string().describe("The punchline to the joke"),
  rating: z.string().optional().describe("How funny the joke is, from 1 to 10"),
});

const DesiredTodosWithEmojiSchema = z.object({
  action: z.string().describe("What are you going to do, described in at most 20 words"),
  desired_location: z.string().describe("Name of the building where you want to go most"),
  emojis: z.string().describe("One or two emojis that describe your mood and the action")
})

export {
  type IAvailableModels,
  JokeSchema,
  DesiredTodosWithEmojiSchema
};