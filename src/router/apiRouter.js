// router/deepseekProxy.js
const express = require('express');
const axios = require('axios');

const apiRouter = express.Router();

/**
 * POST /api/deepseek
 * Proxies the incoming body to OpenRouter and returns its response.
 */
apiRouter.post('/deepseek', async (req, res) => {
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

    if (!DEEPSEEK_API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const openRouterRes = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            req.body,                                // forward body as-is
            {
                headers: {
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        res.status(200).json(openRouterRes.data);  // return exact payload
    } catch (err) {
        console.error('DeepSeek proxy error:', err.response?.data || err.message);
        if (err.response) {
            res.status(err.response.status).json(err.response.data);
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

module.exports = { apiRouter };
