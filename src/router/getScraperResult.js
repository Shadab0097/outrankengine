const express = require('express')

const { scraperUrl } = require('../services/scraper')
const { getGeminiSeoInsights } = require('../services/gemini')
const { userAuth } = require('../middleware/userAuth')
const User = require('../model/user');



const getScrapedRouter = express.Router()


getScrapedRouter.post('/analyze', userAuth, async (req, res) => {

    const requestedUser = req.user
    const tokenCost = 2500; // Fixed cost for comparison

    if (requestedUser.token < tokenCost) {
        return res.status(401).json({ error: "Not Enough Token" })
    }
    const { competitorUrl } = req.body;
    console.log(typeof competitorUrl)

    if (!competitorUrl || !competitorUrl.startsWith('http')) {
        return res.status(400).json({ error: "Invalid or missing URL." });
    }

    try {
        const scrapedContent = await scraperUrl(competitorUrl);
        // console.log(scrapedContent)
        const aiInsights = await getGeminiSeoInsights(scrapedContent);

        requestedUser.token -= tokenCost;
        await requestedUser.save();

        return res.status(200).json({
            remainingTokens: requestedUser.token,
            aiInsights,
            scrapedContent
        });

    } catch (err) {
        console.error("Scraping Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }


})


getScrapedRouter.post('/compare', userAuth, async (req, res) => {
    const requestedUser = req.user;
    const { competitorUrl, ourUrl } = req.body;
    console.log(typeof competitorUrl, ourUrl)


    // Validate both URLs are provided
    if (!competitorUrl || !competitorUrl.startsWith('http')) {
        return res.status(400).json({ error: "Invalid or missing competitor URL." });
    }

    if (!ourUrl || !ourUrl.startsWith('http')) {
        return res.status(400).json({ error: "Invalid or missing our URL." });
    }
    if (competitorUrl === ourUrl) {
        return res.status(400).json({ error: "Both URLs cannot be Same" });

    }

    const tokenCost = 4000; // Fixed cost for comparison

    if (requestedUser.token < tokenCost) {
        return res.status(401).json({
            error: "Not Enough Tokens",
            required: tokenCost,
            available: requestedUser.token
        });
    }

    try {
        // Scrape both URLs concurrently
        const scrapedContent = await scraperUrl({
            competitorUrl: competitorUrl,
            ourUrl: ourUrl
        });

        if (!scrapedContent || !scrapedContent.competitorData || !scrapedContent.ourData) {
            return res.status(500).json({ error: "Failed to scrape one or both URLs." });
        }

        // Generate insights for both sites
        const [competitorInsights, ourInsights] = await Promise.all([
            getGeminiSeoInsights(scrapedContent.competitorData),
            getGeminiSeoInsights(scrapedContent.ourData)
        ]);

        // Deduct tokens
        requestedUser.token -= tokenCost;
        await requestedUser.save();

        return res.status(200).json({
            remainingTokens: requestedUser.token,
            analysisType: 'comparison',
            tokensCost: tokenCost,
            analyzedUrls: {
                competitor: scrapedContent.competitorData.url,
                our: scrapedContent.ourData.url
            },
            comparison: {
                competitorInsights: competitorInsights,
                ourInsights: ourInsights
            }
        });

    } catch (err) {
        console.error("Comparison Error:", err.message);
        res.status(500).json({
            success: false,
            error: "Comparison analysis failed. Please try again.",
            details: err.message
        });
    }
});





module.exports = { getScrapedRouter }