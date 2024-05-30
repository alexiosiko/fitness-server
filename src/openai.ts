const express = require("express");
import { Request, Response, response } from "express";
const router = express.Router();
import OpenAI from "openai";
require('dotenv').config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/food-nutrients', async (req: Request, res: Response) => {
	try {
		const { name: description } = req.body;

		const completion = await openai.chat.completions.create({
			messages: [{ role: "system", content: `Tell me info about this food: ${description}. Respond in JSON format: {\"calories\": number, \"protein\": number}` }],
			model: "gpt-3.5-turbo-0125",
		  });
		
		  const airesponse = completion.choices[0].message.content;
		  if (!airesponse)
			throw Error(`openai couldn't give a response for input`);
		  const json = JSON.parse(airesponse);
		return res.json(json);
	} catch (e: any) {
		return res.status(500).json({ message: e.message });
	}
})

router.post('/exercise-nutrients', async (req: Request, res: Response) => {
})

module.exports = router;
