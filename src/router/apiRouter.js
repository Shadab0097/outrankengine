// router/deepseekProxy.js
const express = require('express');
const axios = require('axios');
const { GoogleGenAI } = require("@google/genai");


const apiRouter = express.Router();
require("dotenv").config();

const genAI = new GoogleGenAI({ apiKey: process.env.MY_CUSTOM_GOOGLE_API_KEY });

apiRouter.post('/deepseek', async (req, res) => {

    try {
        const { message } = req.body;
        let contents;
        if (typeof message === "string") {
            contents = [{ role: "user", text: message }];
        } else if (Array.isArray(message)) {
            contents = message;
        } else {
            return res.status(400).json({ error: "Invalid message format. Must be string or array." });
        }

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-pro",
            contents: message
        });

        const candidateText =
            response.text ||
            response.candidates?.[0]?.content?.parts?.[0]?.text ||
            "";

        candidateText.replace(/^```(?:json)?\s*/i, "")
            // Remove trailing ```
            .replace(/```$/i, "")
            .trim();

        res.status(200).json(candidateText);
    } catch (err) {
        console.error('Gemini-content proxy error:', err.response?.data || err.message);
        if (err.response) {
            res.status(err.response.status).json(err.response.data);
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

module.exports = { apiRouter };
