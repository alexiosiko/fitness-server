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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const openai_1 = __importDefault(require("openai"));
require('dotenv').config();
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
router.post('/food-nutrients', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const completion = yield openai.chat.completions.create({
            messages: [{ role: "system", content: "How much protein in 4 strawberries?. Respond in JSON format: {\"calories\": number, \"protein\": number}" }],
            model: "gpt-3.5-turbo-0125",
        });
        const airesponse = completion.choices[0].message.content;
        if (!airesponse) {
            throw Error(`openai couldn't give a response for input`);
        }
        console.log("herE");
        const json = JSON.parse(airesponse);
        console.log(json);
        return res.json({ message: "Worked? " });
    }
    catch (e) {
        return res.status(500).json({ message: e.message });
    }
}));
module.exports = router;
