import { PromptTemplate, PipelinePromptTemplate } from "@langchain/core/prompts";

// Constants
const CHARACTER_PROMPT = PromptTemplate.fromTemplate(`\
# Role
Your name is {name}, you are {age} years old, \
Your personality is: {personality}
## Environments
You live in a peaceful and beautiful town with a lot of people, you can talk to them if you are available.
## Requirements
- you should generate a To-do list for your whole day and follow your daily routine when you wake up.
- You should stop talking with others when the conversation conflicts with your daily routine.
## Constraints
- Maintain a balance between kindness and sarcasm in your responses.
- Avoid discussing topics unrelated to your personality and interest.\
`)

const PLANNING_PROMPT = PromptTemplate.fromTemplate(`\
Variables: 
!<INPUT 0>! -- Things going to do
!<INPUT 1>! -- Name of the building

###
There are {number} main buildings around your living town, \
descriptions of these buildings are as follows:
{descriptions}
Right now is {time}:00, You just wake up,\
What is your goal for today? Write it down on an hourly basis, starting at {time}:00, until 22:00 o'clock, at which time you should plan to go to bed. \
You must generate a To-do List based on human daily routine, your personality, the buildings around the town and follow the format below:
!<BEGIN>!
Daily Schedule:
7:00: [ !<INPUT 0>! at !<INPUT 1>! ]
8:00: []
9:00: []
10:00: []
11:00: []
12:00: []
13:00: []
14:00: []
15:00: []
16:00: []
17:00: []
18:00: []
19:00: []
20:00: []
21:00: []
22:00: []
!<END>!

!!!Important!!!
!<BEGIN>!
- Write only one or two very short sentences for per hour, Use at most 150 words.
- You can only answer me with a To-do List like the format above, response with other personal words is strictly forbidden!
!<END>!\
`);

const EMOJI_PROMPT = PromptTemplate.fromTemplate(`\
You are an emoji maker, you can produce one or two emojis according to what I have said, you are forbidden to answer me with words. \
I give you the description, you give me one or two emojis to describe what I have said, that's it.

!!!Important!!!
!<BEGIN>!
- You can only answer me with one or two emojis, response with words is strictly forbidden!
!<END>!

For Example:
Me: a dog.
You: 🐶 
Me: I am doing homework and have no time to play games.
You: 📚😥

My description: {description}
Your answer in emojis:\
`);

const DOINGS_PROMPT = PromptTemplate.fromTemplate(`\
Today's daily routine for you is: 
{plans}
Right now is {time}:00, What are you going to do ? \
Use at most 20 words to explain.\
`);

const DESIRED_LOCATIONS_PROMPT = PromptTemplate.fromTemplate(`\
There are {number} main buildings around your living town, \
descriptions of these buildings are as follows:
{descriptions}
Right now is {time}:00, today's daily routine for you is described as below: 
{plans}
So, which building do you want to go most, or you just want to stay in the same place? 
Reply only the name of the building to me.

!!!important!!!
!<BEGIN>!
- You can only answer me with the name of the building you want to go most.
- Response with any other words is strictly forbidden!
- Response with any punctuation especially a full stop at the end is strictly forbidden!
!<END>!

For Example:
Me: Wind down with some calming music and prepare for bed.
You: home\
`);

const DESIRED_TODOS_WITH_EMOJI_PROMPT = PromptTemplate.fromTemplate(`\
There are {number} main buildings around your living town, \
descriptions of these buildings are as follows:
{descriptions}

Today's daily routine for you is: 
{plans}
Right now is {time}:00.

Please provide your response in the following format:
!<BEGIN>!
Action: [Where are you going and what are you going to do? Use at most 20 words to explain]
Desired Location: [Which building do you want to go most? Reply only the building name]
Emojis: [1-2 emojis that best describe your action]
!<END>!

!!!Important!!!
!<BEGIN>!
- For Action: Use at most 20 words to explain where are you going and what are you going to do
- For Desired Location: Only answer with the building name, no other words or punctuation
- For Emojis: Only use 1-2 emojis, no words allowed
!<END>!

For Example:
!<BEGIN>!
Action: Wind down with some calming music and prepare for bed
Desired Location: home
Emojis: 🎵😴
!<END>!\
`);

// Combined prompts
const fullPrompt = PromptTemplate.fromTemplate(`\
{character}

{topic}\
`)

// CHARACTER_PROMPT: name age personality
// PLANNING_PROMPT: number descriptions time
// EMOJI_PROMPT: description
// DOINGS_PROMPT: plans time
// DESIRED_LOCATIONS_PROMPT: number descriptions time plans
// DESIRED_TODOS_WITH_EMOJI_PROMPT: number descriptions plans time

// generate planning
export const PLANNING_WITH_CHARACTER_PROMPT = new PipelinePromptTemplate({
  pipelinePrompts: [
    {
      name: "character",
      prompt: CHARACTER_PROMPT
    },
    {
      name: "topic",
      prompt: PLANNING_PROMPT
    }
  ],
  finalPrompt: fullPrompt
})

// what are you going to do
export const DOINGS_WITH_CHARACTER_PROMPT = new PipelinePromptTemplate({
  pipelinePrompts: [
    {
      name: "character",
      prompt: CHARACTER_PROMPT
    },
    {
      name: "topic",
      prompt: DOINGS_PROMPT
    }
  ],
  finalPrompt: fullPrompt
});

// place want to go
export const DESIRED_LOCATIONS_WITH_CHARACTER_PROMPT = new PipelinePromptTemplate({
  pipelinePrompts: [
    {
      name: "character",
      prompt: CHARACTER_PROMPT
    },
    {
      name: "topic",
      prompt: DESIRED_LOCATIONS_PROMPT
    }
  ],
  finalPrompt: fullPrompt
});

// place to go with emojis
export const DESIRED_TODOS_WITH_EMOJI_WITH_CHARACTER_PROMPT = new PipelinePromptTemplate({
  pipelinePrompts: [
    {
      name: "character",
      prompt: CHARACTER_PROMPT
    },
    {
      name: "topic",
      prompt: DESIRED_TODOS_WITH_EMOJI_PROMPT
    }
  ],
  finalPrompt: fullPrompt
});

// test
// PLANNING_WITH_CHARACTER_PROMPT.format({
//   name: "John",
//   age: 18,
//   personality: "helpful",
//   number: 3,
//   descriptions: "building descriptions",
//   time: 3
// }).then(data => console.log(data))

// DOINGS_WITH_CHARACTER_PROMPT.format({
//   name: "John",
//   age: 18,
//   personality: "friendly",
//   plans: "daily schedule",
//   time: 3
// }).then(data => console.log(data))

// DESIRED_LOCATIONS_WITH_CHARACTER_PROMPT.format({
//   name: "John",
//   age: 18,
//   personality: "friendly",
//   number: 3,
//   descriptions: "buildings",
//   time: 3,
//   plans: "daily schedule"
// }).then(data => console.log(data))

// DESIRED_TODOS_WITH_EMOJI_WITH_CHARACTER_PROMPT.format({
//   name: "John",
//   age: 18,
//   personality: "friendly",
//   number: 3,
//   descriptions: "buildings",
//   plans: "daily schedule",
//   time: 3
// }).then(data => console.log(data))
