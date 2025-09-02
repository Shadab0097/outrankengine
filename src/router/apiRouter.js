// router/deepseekProxy.js
const express = require('express');
const axios = require('axios');
const { GoogleGenAI } = require("@google/genai");


const apiRouter = express.Router();
require("dotenv").config();

const genAI = new GoogleGenAI({ apiKey: process.env.MY_CUSTOME_GOOGLE_API_KEY });
// console.log(process.env.MY_CUSTOME_GOOGLE_API_KEY)


apiRouter.post('/deepseek', async (req, res) => {

    try {
        // console.log(process.env.MY_CUSTOME_GOOGLE_API_KEY)
        const { message } = req.body;
        let contents;
        if (typeof message === "string") {
            contents = [{ role: "user", text: message }];
        } else if (Array.isArray(message)) {
            contents = message;
        } else {
            return res.status(400).json({ error: "Invalid message format. Must be string or array." });
        }

        const maxRetries = 5;
        let attempt = 0;
        let response;

        while (attempt < maxRetries) {
            try {
                response = await genAI.models.generateContent({
                    model: "gemini-2.5-pro",
                    contents
                });
                break; // Success - exit retry loop
            } catch (err) {
                // If 503 model overloaded error, retry with exponential backoff
                console.log(err)
                if (err.response?.status === 503 || err.response?.status === 500) {
                    const delaySec = 2 ** attempt; // 1, 2, 4, 8, 16 seconds
                    console.warn(`Gemini model overloaded, retrying in ${delaySec} seconds... (attempt ${attempt + 1})`);
                    await new Promise(resolve => setTimeout(resolve, delaySec * 1000));
                    attempt++;
                } else {
                    throw err; // Other errors - throw immediately
                }
            }
        }

        if (!response) {
            return res.status(503).json({ error: "Model overloaded. Please try again later." });
        }



        const candidateText =
            response.text ||
            response.candidates?.[0]?.content?.parts?.[0]?.text ||
            "";

        const resultText = candidateText.replace(/^```(?:json)?\s*/i, "")
            // Remove trailing ```
            .replace(/```$/i, "")
            .trim();

        res.status(200).json(resultText);
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
