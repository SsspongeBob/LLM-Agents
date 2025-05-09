"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveMentSchema = exports.WeatherSchema = exports.CalculatorSchema = void 0;
var zod_1 = require("zod");
var CalculatorSchema = zod_1.z.object({
    operation: zod_1.z
        .enum(["add", "subtract", "multiply", "divide"])
        .describe("The type of operation to execute."),
    number1: zod_1.z.number().describe("The first number to operate on."),
    number2: zod_1.z.number().describe("The second number to operate on."),
});
exports.CalculatorSchema = CalculatorSchema;
var WeatherSchema = zod_1.z.object({
    location: zod_1.z.string().describe("The location to get the weather for."),
});
exports.WeatherSchema = WeatherSchema;
var MoveMentSchema = zod_1.z.object({
    place: zod_1.z.string().describe("The place to move to."),
});
exports.MoveMentSchema = MoveMentSchema;
