// router/deepseekProxy.js
const express = require('express');
const axios = require('axios');
const { GoogleGenAI } = require("@google/genai");


const apiRouter = express.Router();
require("dotenv").config();

const genAI = new GoogleGenAI({ apiKey: process.env.MY_CUSTOM_API_KEY });
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
                    model: "gemini-3-flash-preview",
                    contents
                });
                break; // Success - exit retry loop
            } catch (err) {
                // If 503 model overloaded error, retry with exponential backoff
                console.log(err)
                // Helper to check the error status. SDK errors might have .status or .response.status
                const status = err.status || err.response?.status;

                // These are retryable server/rate limit errors
                const retryableErrors = [
                    429, // Too Many Requests (Rate Limit)
                    500, // Internal Server Error
                    503  // Service Unavailable (Model Overloaded)
                ];

                // Check if the error is network-related (no response) or a retryable status
                const isRetryable = !err.response || retryableErrors.includes(status);

                if (isRetryable && attempt < maxRetries) {
                    const delayBase = 2 ** attempt; // 1, 2, 4, 8, 16
                    // Add random "jitter" (0-1000ms) to prevent "thundering herd"
                    const jitter = Math.random() * 1000;
                    const delaySec = (delayBase * 1000) + jitter;

                    console.warn(`Gemini API error (Status: ${status || 'N/A'}). Retrying in ${delaySec.toFixed(0)} ms... (attempt ${attempt + 1})`);
                    await new Promise(resolve => setTimeout(resolve, delaySec));
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
