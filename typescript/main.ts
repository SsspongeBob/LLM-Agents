// import { LLM } from "./agents/llm/llm";
import { config } from "dotenv";

config({ override: true })

// ; (async () => {
//   const llm = new LLM("llama-3-8b-instruct-chinese");
//   const result = await llm.generate("你好");
//   console.log(result);
// })();

import { ChatOpenAI } from "@langchain/openai";

const openai = new ChatOpenAI({ model: "gpt-4o-mini" })

openai.invoke("Hello").then(data=>{
  console.log(data.content)
})
