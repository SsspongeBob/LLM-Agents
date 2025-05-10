import { ChatOpenAI } from "@langchain/openai";
import { config } from "dotenv"

config({ override: true })

const openai = new ChatOpenAI({
  model: "qwen-plus",
  apiKey: process.env.QWEN_API_KEY,
  configuration: {
    baseURL: process.env.QWEN_BASE_URL
  }
})

openai.invoke("Hello")
  .then(res => {
    console.log(res.content);
  })
