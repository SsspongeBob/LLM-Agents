import { log } from 'node:console';
import { pickedTools } from '../tools/tools';
import { LLM } from './llm';
import { JokeSchema } from './schema';

describe("LLM", () => {
  test("LLM should output some texts.", async () => {
    const llm = new LLM("llama-3-8b-instruct-chinese");
    const result = await llm.generate("你好");
    log(result);
    expect(result).toBeTruthy();
  })
  test("LLM should output some texts with tools.", async () => {
    const llm = new LLM("llama-3-8b-instruct-chinese", true, { tools: pickedTools("getCurrentWeather") });
    const result = await llm.generate("东京天气怎么样?");
    log(result);
    expect(result).toBeTruthy();
  })
  test("LLM should output some structured data.", async () => {
    const llm = new LLM("llama-3-8b-instruct-chinese", true, { schema: { schemaModel: JokeSchema, schemaName: "Joke" } });
    const result = await llm.generateStructuredOutput("Tell me a joke");
    log(result);
    expect(result).toBeTruthy();
  })
})
