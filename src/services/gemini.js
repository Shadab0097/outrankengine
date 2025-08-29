// const { GoogleGenAI } = require("@google/genai");
// require("dotenv").config();


// const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


// async function getGeminiSeoInsights(scrapedData) {

//   const prompt = `

// You are an expert SEO strategist with deep knowledge of current Google ranking factors, algorithm updates, and competitive analysis methodologies.

// I will provide you with content from a competitor's website that ranks well on Google for our target market.

// Your task is to conduct a thorough competitive SEO analysis and return a comprehensive outranking strategy.

// CRITICAL: Your response must be ONLY valid JSON format with no additional text, explanations, or conversational elements before or after the JSON. Start immediately with the opening curly brace "{" and end with the closing curly brace "}".

// ANALYSIS REQUIREMENTS:
// - Identify specific ranking factors that make the competitor successful
// - Analyze content gaps and opportunities we can exploit
// - Consider search intent alignment and user experience factors
// - Evaluate E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness)
// - Assess current SEO trends and algorithm preferences (2024-2025)
// - Factor in Core Web Vitals, mobile-first indexing, and AI content considerations
// - Provide measurable, prioritized recommendations with estimated impact

// REQUIRED JSON STRUCTURE (return ONLY this JSON, no other text):

// {
//   "analysisSummary": {
//     "competitorStrengths": "",
//     "competitorWeaknesses": "",
//     "rankingFactors": [],
//     "contentGaps": [],
//     "overallAssessment": ""
//   },
//   "targetKeywords": {
//     "primaryKeywords": [],
//     "longTailKeywords": [],
//     "questionBasedKeywords": [],
//     "semanticKeywords": [],
//     "lowCompetitionOpportunities": [],
//     "keywordDifficulty": []
//   },
//   "contentStrategy": {
//     "contentTypes": [],
//     "contentFormat": [],
//     "contentDepth": "",
//     "uniqueAngles": [],
//     "expertiseSignals": [],
//     "userIntentAlignment": [],
//     "contentClusterStrategy": []
//   },
//   "onPageSEOSuggestions": {
//     "titleTagOptimization": [],
//     "metaDescriptions": [],
//     "headerStructure": [],
//     "internalLinking": [],
//     "schemaMarkup": [],
//     "urlStructure": [],
//     "imageOptimization": [],
//     "contentStructure": []
//   },
//   "backlinkStrategy": {
//     "highAuthorityTargets": [],
//     "linkBuildingTactics": [],
//     "contentForLinkEarning": [],
//     "digitalPROpportunities": [],
//     "competitorBacklinkGaps": []
//   },
//   "technicalSEO": {
//     "coreWebVitals": [],
//     "mobileOptimization": [],
//     "siteSpeed": [],
//     "crawlability": [],
//     "indexingOptimization": [],
//     "structuredData": [],
//     "securityEnhancements": []
//   },
//   "additionalOpportunities": {
//     "eatSignals": [],
//     "localSEOTactics": [],
//     "socialSignals": [],
//     "aiContentOptimization": [],
//     "featuredSnippetTargets": [],
//     "voiceSearchOptimization": [],
//     "competitiveAdvantages": []
//   },
//   "implementationPlan": {
//     "quickWins": [],
//     "mediumTermGoals": [],
//     "longTermStrategy": [],
//     "priorityMatrix": [],
//     "estimatedTimeline": [],
//     "requiredResources": []
//   }
// }

// REMINDER: Return ONLY the JSON object above with your analysis data. Do not include any text before "{" or after "}". Do not add explanations, introductions, or conclusions. Start your response with "{" immediately.

// COMPETITOR WEBSITE CONTENT:
// [Insert the competitor's content here]

// ${JSON.stringify(scrapedData, null, 2)}
// `;



//   const response = await genAI.models.generateContent({
//     model: "gemini-2.5-pro",
//     contents: prompt
//   });


//   const rawText = response.text;

//   // Remove markdown formatting
//   const cleanedText = rawText
//     .replace(/^```json\s*/, '')
//     .replace(/```$/, '')
//     .trim();


//   const parsed = JSON.parse(cleanedText);

//   return parsed
// }

// module.exports = { getGeminiSeoInsights };


const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const genAI = new GoogleGenAI({ apiKey: process.env.MY_CUSTOM_GEMINI_API_KEY });

function cleanGeminiResponse(text) {
  return text
    // Remove starting fences like ```json or ``` (with optional spaces/newlines)
    .replace(/^```(?:json)?\s*/i, "")
    // Remove trailing ```
    .replace(/```$/i, "")
    .trim();
}


async function getGeminiSeoInsights(scrapedData) {
  try {
    // Detect if this is single or comparison analysis
    const isComparisonAnalysis = scrapedData.competitorData && scrapedData.ourData;

    if (isComparisonAnalysis) {
      return await getComparisonSeoInsights(scrapedData);
    } else {
      return await getSingleSeoInsights(scrapedData);
    }
  } catch (error) {
    console.error("Gemini SEO Insights Error:", error);
    throw new Error("Failed to generate SEO insights");
  }
}

async function getSingleSeoInsights(scrapedData, retries = 1) {
  const prompt = `

You are an expert SEO strategist with deep knowledge of current Google ranking factors, algorithm updates, and competitive analysis methodologies.

I will provide you with content from a competitor's website that ranks well on Google for our target market.

Your task is to conduct a thorough competitive SEO analysis and return a comprehensive outranking strategy.

CRITICAL: Your response must be ONLY valid JSON format with no additional text, explanations, or conversational elements before or after the JSON. Start immediately with the opening curly brace "{" and end with the closing curly brace "}".

ANALYSIS REQUIREMENTS:
- Identify specific ranking factors that make the competitor successful
- Analyze content gaps and opportunities we can exploit
- Consider search intent alignment and user experience factors
- Evaluate E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness)
- Assess current SEO trends and algorithm preferences (2024-2025)
- Factor in Core Web Vitals, mobile-first indexing, and AI content considerations
- Provide measurable, prioritized recommendations with estimated impact

REQUIRED JSON STRUCTURE (return ONLY this JSON, no other text):

{
  "analysisSummary": {
    "competitorStrengths": "",
    "competitorWeaknesses": "",
    "rankingFactors": [],
    "contentGaps": [],
    "overallAssessment": ""
  },
  "targetKeywords": {
    "primaryKeywords": [],
    "longTailKeywords": [],
    "questionBasedKeywords": [],
    "semanticKeywords": [],
    "lowCompetitionOpportunities": [],
    "keywordDifficulty": []
  },
  "contentStrategy": {
    "contentTypes": [],
    "contentFormat": [],
    "contentDepth": "",
    "uniqueAngles": [],
    "expertiseSignals": [],
    "userIntentAlignment": [],
    "contentClusterStrategy": []
  },
  "onPageSEOSuggestions": {
    "titleTagOptimization": [],
    "metaDescriptions": [],
    "headerStructure": [],
    "internalLinking": [],
    "schemaMarkup": [],
    "urlStructure": [],
    "imageOptimization": [],
    "contentStructure": []
  },
  "backlinkStrategy": {
    "highAuthorityTargets": [],
    "linkBuildingTactics": [],
    "contentForLinkEarning": [],
    "digitalPROpportunities": [],
    "competitorBacklinkGaps": []
  },
  "technicalSEO": {
    "coreWebVitals": [],
    "mobileOptimization": [],
    "siteSpeed": [],
    "crawlability": [],
    "indexingOptimization": [],
    "structuredData": [],
    "securityEnhancements": []
  },
  "additionalOpportunities": {
    "eatSignals": [],
    "localSEOTactics": [],
    "socialSignals": [],
    "aiContentOptimization": [],
    "featuredSnippetTargets": [],
    "voiceSearchOptimization": [],
    "competitiveAdvantages": []
  },
  "implementationPlan": {
    "quickWins": [],
    "mediumTermGoals": [],
    "longTermStrategy": [],
    "priorityMatrix": [],
    "estimatedTimeline": [],
    "requiredResources": []
  }
}

REMINDER: Return ONLY the JSON object above with your analysis data. Do not include any text before "{" or after "}". Do not add explanations, introductions, or conclusions. Start your response with "{" immediately.

COMPETITOR WEBSITE CONTENT:
[Insert the competitor's content here]

${JSON.stringify(scrapedData, null, 2)}
`;
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt
    });
    // console.log(response)


    const candidateText =
      response.text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";



    if (!candidateText) {
      if (retries > 0) {
        console.warn("⚠️ Gemini returned no text. Retrying...");
        return await getSingleSeoInsights(scrapedData, retries - 1);
      }
      throw new Error("Gemini did not return any text.");
    }

    // Clean text
    const cleanedText = cleanGeminiResponse(candidateText);

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (err) {
      console.error("JSON parse error:", err);
      console.error("Raw Gemini output:", candidateText);
      console.error("After cleaning:", cleanedText);
      throw new Error("Gemini returned invalid JSON");
    }

    return parsed
  } catch (error) {
    console.error("❌ Error in getSingleSeoInsights:", error);
    throw error;
  }
}

async function getComparisonSeoInsights(scrapedData, retries = 1) {
  const prompt = `
You are an expert SEO strategist conducting a comprehensive competitive analysis between two websites.

I will provide you with scraped data from both a competitor's website and our own website.

Your task is to perform a detailed comparative SEO analysis and provide actionable strategies to outrank the competitor.

⚠️ CRITICAL INSTRUCTIONS:
- Respond ONLY with a valid JSON object.
- Do NOT include markdown, code fences, or explanations.
- Do NOT add text before the opening curly brace { or after the closing curly brace }.
- Ensure the JSON is syntactically valid and can be parsed directly with JSON.parse().


ANALYSIS REQUIREMENTS:
- Direct comparison between our site and competitor
- Identify specific areas where competitor excels vs our weaknesses
- Highlight our existing strengths that can be leveraged
- Provide gap analysis with prioritized action items
- Consider latest SEO trends and Google algorithm preferences (2024-2025)
- Focus on E-E-A-T, Core Web Vitals, and user experience factors
- Deliver measurable recommendations with ROI potential

REQUIRED JSON SCHEMA (fill in all fields with your analysis):

{
  "competitiveComparison": {
    "overallAssessment": "",
    "competitorAdvantages": [],
    "ourAdvantages": [],
    "criticalGaps": [],
    "opportunityScore": ""
  },
  "seoGapAnalysis": {
    "titleTagComparison": {
      "competitor": "",
      "ours": "",
      "recommendations": []
    },
    "metaDescriptionComparison": {
      "competitor": "",
      "ours": "",
      "recommendations": []
    },
    "contentQualityGap": {
      "competitorStrengths": [],
      "ourWeaknesses": [],
      "improvementActions": []
    },
    "headerStructureGap": {
      "competitorApproach": [],
      "ourApproach": [],
      "optimizationNeeded": []
    },
    "internalLinkingGap": {
      "competitorStrategy": [],
      "ourStrategy": [],
      "actionItems": []
    }
  },
  "keywordGapAnalysis": {
    "competitorTargetKeywords": [],
    "ourTargetKeywords": [],
    "missingKeywordOpportunities": [],
    "keywordCannibalizationRisks": [],
    "priorityKeywordsToTarget": []
  },
  "contentGapStrategy": {
    "contentTypesCompetitorUses": [],
    "contentTypesWeMiss": [],
    "contentDepthComparison": "",
    "topicsToCreate": [],
    "contentUpgradeNeeded": [],
    "uniqueContentAngles": []
  },
  "technicalSEOComparison": {
    "siteSpeedComparison": "",
    "mobileOptimizationGap": [],
    "structuredDataGap": [],
    "crawlabilityIssues": [],
    "indexingOptimizations": []
  },
  "competitiveAdvantageStrategy": {
    "quickWinsToImplement": [],
    "mediumTermGoals": [],
    "longTermDifferentiators": [],
    "resourceRequirements": [],
    "riskAssessment": []
  },
  "actionPlan": {
    "immediate30Days": [],
    "next90Days": [],
    "next6Months": [],
    "priorityMatrix": [],
    "expectedOutcomes": [],
    "successMetrics": []
  },
  "outRankingStrategy": {
    "primaryTactics": [],
    "contentStrategy": [],
    "linkBuildingApproach": [],
    "technicalOptimizations": [],
    "competitiveMonitoring": [],
    "estimatedTimeToOutrank": ""
  }
}
REMINDER: Return ONLY the JSON object above with your comparative analysis data. Do not include any text before "{" or after "}". Start your response with "{" immediately.

COMPETITOR WEBSITE DATA:
${JSON.stringify(scrapedData.competitorData, null, 2)}

OUR WEBSITE DATA:
${JSON.stringify(scrapedData.ourData, null, 2)}
`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt
    });
    console.log("🔎 Gemini raw response:", JSON.stringify(response, null, 2));
    // console.log(response)
    const candidateText =
      response.text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";


    if (!candidateText) {
      // 🔹 Retry once if Gemini gave empty response
      if (retries > 0) {
        console.warn("⚠️ Gemini returned no text (comparison). Retrying...");
        return await getComparisonSeoInsights(scrapedData, retries - 1);
      }
      throw new Error("Gemini did not return any text.");
    }

    // Clean text
    const cleanedText = cleanGeminiResponse(candidateText);

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (err) {
      console.error("JSON parse error:", err);
      console.error("Raw Gemini output:", candidateText);
      console.error("After cleaning:", cleanedText);
      throw new Error("Gemini returned invalid JSON");
    }

    return parsed
  } catch (error) {
    console.error("❌ Error in getComparisonSeoInsights:", error);
    throw error;
  }
}


module.exports = { getGeminiSeoInsights }