import { LLM } from "./agents/llm/llm";
import { config } from "dotenv";

config()

; (async () => {
  const llm = new LLM("llama-3-8b-instruct-chinese");
  const result = await llm.generate("你好");
  console.log(result);
})();