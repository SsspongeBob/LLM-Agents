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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLM = void 0;
var messages_1 = require("@langchain/core/messages");
var output_parsers_1 = require("@langchain/core/output_parsers");
var openai_1 = require("@langchain/openai");
var ollama_1 = require("@langchain/ollama");
var dotenv_1 = require("dotenv");
var tools_1 = require("../tools/tools");
// Load environment variables
(0, dotenv_1.config)({ override: true });
// Setup logging
var logger = console;
/**
 * Implementation of Chatting with Large Language model.
 */
var LLM = /** @class */ (function () {
    /**
     * Implementation of Chatting with Large Language model.
     * @param model name of the LLM.
     * @param options equip the LLM with other abilities, `tools` or `schema` if provided.
     */
    function LLM(model, useOpenai, options) {
        if (useOpenai === void 0) { useOpenai = true; }
        var _a, _b, _c, _d;
        this.model = useOpenai ? new openai_1.ChatOpenAI({
            model: model,
            apiKey: (_a = process.env.OLLAMA_OPENAI_API_KEY) !== null && _a !== void 0 ? _a : process.env.OPENAI_API_KEY,
            configuration: {
                baseURL: (_b = process.env.OLLAMA_OPENAI_SERVER_URL) !== null && _b !== void 0 ? _b : process.env.OPENAI_BASE_URL
            }
        }) : new ollama_1.ChatOllama({ model: model, baseUrl: process.env.OLLAMA_SERVER_URL });
        this.tools = options === null || options === void 0 ? void 0 : options.tools;
        this.schema = (_c = options === null || options === void 0 ? void 0 : options.schema) === null || _c === void 0 ? void 0 : _c.schemaModel;
        if (this.tools) {
            // @ts-ignore
            this.model = this.model.bindTools(this.tools);
            logger.info("LLM binded with tools: [".concat(this.tools.map(function (tool) { return tool.name; }).join(" "), "]"));
        }
        else if (this.schema) {
            // @ts-ignore
            this.model = this.model.withStructuredOutput(this.schema, { name: (_d = options === null || options === void 0 ? void 0 : options.schema) === null || _d === void 0 ? void 0 : _d.schemaName });
            logger.info("LLM successfully binded with structured output zod schema !");
        }
        else {
            logger.info("No tools or schema found, use the pure text generation of LLM.");
        }
    }
    /**
     * text to text generation by LLM.
     * @param messages messeges feeded to the LLM.
     * @returns string based response from the LLM.
     */
    LLM.prototype.generate = function (messages) {
        return __awaiter(this, void 0, void 0, function () {
            var parsedMsgs, aiMsg, _i, _a, toolCall, tool, toolMsg, finalResponse, chain;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        parsedMsgs = typeof messages === "string"
                            ? [new messages_1.HumanMessage({ content: messages })]
                            : messages;
                        if (this.schema) {
                            throw new Error("Please use 'generateStructuredOutput' method to generate structured output!");
                        }
                        if (!this.tools) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.model.invoke(parsedMsgs)];
                    case 1:
                        aiMsg = _b.sent();
                        if (!aiMsg.tool_calls) return [3 /*break*/, 7];
                        parsedMsgs.push(aiMsg);
                        _i = 0, _a = aiMsg.tool_calls;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        toolCall = _a[_i];
                        tool = tools_1.TOOLS_MAPPING[toolCall.name];
                        return [4 /*yield*/, tool.invoke(toolCall)];
                    case 3:
                        toolMsg = _b.sent();
                        parsedMsgs.push(toolMsg);
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, this.model.invoke(parsedMsgs)];
                    case 6:
                        finalResponse = _b.sent();
                        return [2 /*return*/, finalResponse.content];
                    case 7: return [2 /*return*/, aiMsg.content];
                    case 8:
                        chain = this.model.pipe(new output_parsers_1.StringOutputParser());
                        return [2 /*return*/, chain.invoke(parsedMsgs)];
                }
            });
        });
    };
    /**
     * streaming response form the LLM.
     * @param messages messeges feeded to the LLM.
     * @returns an `AsyncGenerator` to stream the response from the LLM.
     */
    LLM.prototype.streamGenerate = function (messages) {
        return __asyncGenerator(this, arguments, function streamGenerate_1() {
            var parsedMsgs, aiMsg, _i, _a, toolCall, tool, toolMsg, _b, _c, _d, chunk, e_1_1, _e, _f, _g, chunk, e_2_1, chain;
            var _h, e_1, _j, _k, _l, e_2, _m, _o;
            return __generator(this, function (_p) {
                switch (_p.label) {
                    case 0:
                        parsedMsgs = typeof messages === "string"
                            ? [new messages_1.HumanMessage({ content: messages })]
                            : messages;
                        if (this.schema) {
                            throw new Error("Please use 'generateStructuredOutput' method to generate structured output!");
                        }
                        if (!this.tools) return [3 /*break*/, 34];
                        return [4 /*yield*/, __await(this.model.invoke(parsedMsgs))];
                    case 1:
                        aiMsg = _p.sent();
                        if (!aiMsg.tool_calls) return [3 /*break*/, 20];
                        parsedMsgs.push(aiMsg);
                        _i = 0, _a = aiMsg.tool_calls;
                        _p.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        toolCall = _a[_i];
                        tool = tools_1.TOOLS_MAPPING[toolCall.name];
                        return [4 /*yield*/, __await(tool.invoke(toolCall))];
                    case 3:
                        toolMsg = _p.sent();
                        parsedMsgs.push(toolMsg);
                        _p.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        _p.trys.push([5, 13, 14, 19]);
                        _b = true;
                        return [4 /*yield*/, __await(this.model.stream(parsedMsgs))];
                    case 6:
                        _c = __asyncValues.apply(void 0, [_p.sent()]);
                        _p.label = 7;
                    case 7: return [4 /*yield*/, __await(_c.next())];
                    case 8:
                        if (!(_d = _p.sent(), _h = _d.done, !_h)) return [3 /*break*/, 12];
                        _k = _d.value;
                        _b = false;
                        chunk = _k;
                        return [4 /*yield*/, __await(chunk.content)];
                    case 9: return [4 /*yield*/, _p.sent()];
                    case 10:
                        _p.sent();
                        _p.label = 11;
                    case 11:
                        _b = true;
                        return [3 /*break*/, 7];
                    case 12: return [3 /*break*/, 19];
                    case 13:
                        e_1_1 = _p.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 19];
                    case 14:
                        _p.trys.push([14, , 17, 18]);
                        if (!(!_b && !_h && (_j = _c.return))) return [3 /*break*/, 16];
                        return [4 /*yield*/, __await(_j.call(_c))];
                    case 15:
                        _p.sent();
                        _p.label = 16;
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 18: return [7 /*endfinally*/];
                    case 19: return [3 /*break*/, 33];
                    case 20:
                        _p.trys.push([20, 27, 28, 33]);
                        _e = true, _f = __asyncValues(aiMsg.content);
                        _p.label = 21;
                    case 21: return [4 /*yield*/, __await(_f.next())];
                    case 22:
                        if (!(_g = _p.sent(), _l = _g.done, !_l)) return [3 /*break*/, 26];
                        _o = _g.value;
                        _e = false;
                        chunk = _o;
                        return [4 /*yield*/, __await(chunk)];
                    case 23: return [4 /*yield*/, _p.sent()];
                    case 24:
                        _p.sent();
                        _p.label = 25;
                    case 25:
                        _e = true;
                        return [3 /*break*/, 21];
                    case 26: return [3 /*break*/, 33];
                    case 27:
                        e_2_1 = _p.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 33];
                    case 28:
                        _p.trys.push([28, , 31, 32]);
                        if (!(!_e && !_l && (_m = _f.return))) return [3 /*break*/, 30];
                        return [4 /*yield*/, __await(_m.call(_f))];
                    case 29:
                        _p.sent();
                        _p.label = 30;
                    case 30: return [3 /*break*/, 32];
                    case 31:
                        if (e_2) throw e_2.error;
                        return [7 /*endfinally*/];
                    case 32: return [7 /*endfinally*/];
                    case 33: return [3 /*break*/, 38];
                    case 34:
                        chain = this.model.pipe(new output_parsers_1.StringOutputParser());
                        return [4 /*yield*/, __await(chain.stream(parsedMsgs))];
                    case 35: return [5 /*yield**/, __values(__asyncDelegator.apply(void 0, [__asyncValues.apply(void 0, [_p.sent()])]))];
                    case 36: return [4 /*yield*/, __await.apply(void 0, [_p.sent()])];
                    case 37:
                        _p.sent();
                        _p.label = 38;
                    case 38: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * structured output following the given `schema` from the LLM.
     * @param messages messeges feeded to the LLM.
     * @returns response from the LLM following the given `schema`.
     */
    LLM.prototype.generateStructuredOutput = function (messages) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.schema) {
                            throw new Error("Schema is required for structured output generation");
                        }
                        return [4 /*yield*/, this.model.invoke(messages)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return LLM;
}());
exports.LLM = LLM;
