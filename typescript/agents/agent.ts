import { CHARACTERS, LOCATIONS } from "./constants";
import { LLM } from "./llm/llm";
import { DesiredTodosWithEmojiSchema } from "./llm/schema";
import { PLANNING_WITH_CHARACTER_PROMPT, DESIRED_TODOS_WITH_EMOJI_WITH_CHARACTER_PROMPT } from "./prompt_template/template";

async function planning(name: string, wakeUpTime: number) {
  const character = CHARACTERS[name];
  let descriptions = ""
  for (const location in LOCATIONS) {
    descriptions += `${location}: ${LOCATIONS[location].description}\n`
  }
  const prompt = await PLANNING_WITH_CHARACTER_PROMPT.format({
    name: character.name,
    age: character.age,
    personality: character.personality,
    number: Object.keys(LOCATIONS).length,
    descriptions: descriptions,
    time: wakeUpTime
  })
  const llm = new LLM("llama-3-8b-instruct-chinese");
  const plans = await llm.generate(prompt);
  return plans;
}

async function execute(name: string, global_time: number, plans: string) {
  const character = CHARACTERS[name];
  let descriptions = ""
  for (const location in LOCATIONS) {
    descriptions += `${location}: ${LOCATIONS[location].description}\n`
  }
  const prompt = await DESIRED_TODOS_WITH_EMOJI_WITH_CHARACTER_PROMPT.format({
    name: character.name,
    age: character.age,
    personality: character.personality,
    number: Object.keys(LOCATIONS).length,
    descriptions: descriptions,
    plans: plans,
    time: global_time
  })
  const structuredLLM = new LLM(
    "llama-3-8b-instruct-chinese",
    true,
    {
      schema: {
        schemaModel: DesiredTodosWithEmojiSchema,
        schemaName: "DesiredActionWithEmoji"
      }
    }
  );
  const desiredActions = await structuredLLM.generateStructuredOutput(prompt);
  console.log(desiredActions)
  return await desiredActions;
}

planning("Alex", 7)
  .then(plans => plans)
  .then(plans => execute("Alex", 10, plans))
