import { config } from "dotenv";
import { ChatOpenAI } from "@langchain/openai";

config({ override: true })

const openai = new ChatOpenAI({ model: "gpt-4o-mini" })

openai.invoke("Hello").then(data=>{
  console.log(data.content)
})
