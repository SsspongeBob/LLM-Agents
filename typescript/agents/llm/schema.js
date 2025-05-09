"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesiredTodosWithEmojiSchema = exports.JokeSchema = void 0;
var zod_1 = require("zod");
// Structured Output Schema
var JokeSchema = zod_1.z.object({
    setup: zod_1.z.string().describe("The setup of the joke"),
    punchline: zod_1.z.string().describe("The punchline to the joke"),
    rating: zod_1.z.string().optional().describe("How funny the joke is, from 1 to 10"),
});
exports.JokeSchema = JokeSchema;
var DesiredTodosWithEmojiSchema = zod_1.z.object({
    action: zod_1.z.string().describe("What are you going to do, described in at most 20 words"),
    desired_location: zod_1.z.string().describe("Name of the building where you want to go most"),
    emojis: zod_1.z.string().describe("One or two emojis that describe your mood and the action")
});
exports.DesiredTodosWithEmojiSchema = DesiredTodosWithEmojiSchema;
