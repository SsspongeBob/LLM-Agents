"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOOLS_MAPPING = void 0;
exports.pickedTools = pickedTools;
var tools_1 = require("@langchain/core/tools");
var schema_1 = require("./schema");
// calculation
var calculatorTool = (0, tools_1.tool)(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var operation = _b.operation, number1 = _b.number1, number2 = _b.number2;
    return __generator(this, function (_c) {
        // Functions must return strings
        if (operation === "add") {
            return [2 /*return*/, "".concat(number1 + number2)];
        }
        else if (operation === "subtract") {
            return [2 /*return*/, "".concat(number1 - number2)];
        }
        else if (operation === "multiply") {
            return [2 /*return*/, "".concat(number1 * number2)];
        }
        else if (operation === "divide") {
            return [2 /*return*/, "".concat(number1 / number2)];
        }
        else {
            throw new Error("Invalid operation.");
        }
        return [2 /*return*/];
    });
}); }, {
    name: "calculator",
    description: "Can perform mathematical operations.",
    schema: schema_1.CalculatorSchema
});
// weather
var getCurrentWeather = (0, tools_1.tool)(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var location = _b.location;
    return __generator(this, function (_c) {
        return [2 /*return*/, "sunny"];
    });
}); }, {
    name: "getCurrentWeather",
    description: "Get the current weather in a given location.",
    schema: schema_1.WeatherSchema
});
// movement
var moveToPlace = (0, tools_1.tool)(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var place = _b.place;
    return __generator(this, function (_c) {
        return [2 /*return*/, place];
    });
}); }, {
    name: "moveToPlace",
    description: "Move the character to certain place.",
    schema: schema_1.MoveMentSchema
});
// Create tools mapping
exports.TOOLS_MAPPING = {
    "calculator": calculatorTool,
    "getCurrentWeather": getCurrentWeather,
    "moveToPlace": moveToPlace
};
// Function to pick tools for langchain
function pickedTools() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.map(function (toolName) { return exports.TOOLS_MAPPING[toolName]; });
}
