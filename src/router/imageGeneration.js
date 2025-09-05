// const { GoogleGenAI, Modality } = require("@google/genai");
// const fs = require("fs");
// require("dotenv").config();

// async function main() {
//     const ai = new GoogleGenAI({ apiKey: process.env.MY_CUSTOM_GEMINI_API_KEY });

//     const prompt = "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

//     const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash-image-preview",
//         contents: prompt,
//     });

//     //   const candidates = response.response?.candidates || [];
//     for (const part of response.candidates[0].content.parts) {
//         if (part.text) {
//             console.log(part.text);
//         } else if (part.inlineData) {
//             const imageData = part.inlineData.data;
//             const buffer = Buffer.from(imageData, "base64");
//             fs.writeFileSync("gemini-native-image.png", buffer);
//             console.log("Image saved as gemini-native-image.png");
//         }
//     }
// }

// main();
const express = require('express');

const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const imageRouter = express.Router()
require("dotenv").config();

const ai = new GoogleGenAI({
    apiKey: process.env.MY_CUSTOM_GEMINI_API_KEY,
});


// const data = {
//     "seoOptimizedH1Tags": [
//         {
//             "tag": "Sustainable & Eco-Friendly Leather Belts, Wallets & Bags",
//             "targetKeywords": [
//                 "eco-friendly leather belts",
//                 "sustainable wallets",
//                 "vegan leather bags"
//             ],
//             "competitorWeaknessExploited": "Replaces weak, brand-focused H1 with a keyword-optimized, product-focused headline.",
//             "searchIntent": "transactional"
//         },
//         {
//             "tag": "What is Cactus Leather? The Ultimate Guide to Plant-Based Fashion",
//             "targetKeywords": [
//                 "what is cactus leather made of",
//                 "plant-based leather accessories"
//             ],
//             "competitorWeaknessExploited": "Fills the in-depth content gap on unique materials, establishing topical authority.",
//             "searchIntent": "informational"
//         },
//         {
//             "tag": "Durable & Stylish Bamboo Leather: Everything You Need to Know",
//             "targetKeywords": [
//                 "is bamboo leather durable",
//                 "how to care for bamboo leather"
//             ],
//             "competitorWeaknessExploited": "Creates deep, educational content that the competitor lacks, boosting E-E-A-T.",
//             "searchIntent": "informational"
//         },
//         {
//             "tag": "The 2024 Buyer's Guide to Sustainable Wallets for Men",
//             "targetKeywords": [
//                 "sustainable wallets for men",
//                 "best men's cactus leather belt"
//             ],
//             "competitorWeaknessExploited": "Addresses the 'Buying Guides' content gap, capturing commercial investigation intent.",
//             "searchIntent": "commercial investigation"
//         },
//         {
//             "tag": "Shop Premium Sustainable Belts with a Lifetime Warranty",
//             "targetKeywords": [
//                 "premium sustainable belts",
//                 "eco-friendly leather belts"
//             ],
//             "competitorWeaknessExploited": "Combines a transactional keyword with a strong USP ('Lifetime Warranty') that the competitor mentions but doesn't leverage in headings.",
//             "searchIntent": "transactional"
//         },
//         {
//             "tag": "Cruelty-Free Tote Bags & Vegan Leather Purses for Work",
//             "targetKeywords": [
//                 "vegan leather bags for women",
//                 "cruelty-free tote bag for work"
//             ],
//             "competitorWeaknessExploited": "Targets specific long-tail user needs and use-cases missing from competitor's broad categories.",
//             "searchIntent": "transactional"
//         },
//         {
//             "tag": "LWG, USDA & GRS Certified Leather Goods in India Explained",
//             "targetKeywords": [
//                 "LWG certified leather goods India",
//                 "USDA certified bamboo leather wallet"
//             ],
//             "competitorWeaknessExploited": "Fills the major content gap of explaining certifications, building immense trust and authority.",
//             "searchIntent": "informational"
//         },
//         {
//             "tag": "How to Choose the Perfect Sustainable Belt for Any Occasion",
//             "targetKeywords": [
//                 "how to choose a sustainable belt",
//                 "are reversible belts good for formal wear"
//             ],
//             "competitorWeaknessExploited": "Creates a practical style guide, a key content gap, to improve user engagement and internal linking.",
//             "searchIntent": "informational"
//         },
//         {
//             "tag": "Recycled Leather (GRS Certified): The Future of Ethical Fashion",
//             "targetKeywords": [
//                 "GRS certified recycled leather bag",
//                 "ethical fashion"
//             ],
//             "competitorWeaknessExploited": "Builds deep content around another unique material, positioning the brand as an industry expert.",
//             "searchIntent": "informational"
//         },
//         {
//             "tag": "An Honest FountainEarth Belt Review: Is It Worth It?",
//             "targetKeywords": [
//                 "fountainearth belt review"
//             ],
//             "competitorWeaknessExploited": "Captures low-competition branded search queries to control the narrative and build trust.",
//             "searchIntent": "commercial investigation"
//         },
//         {
//             "tag": "Cactus Leather vs. Traditional Leather: A Full Comparison",
//             "targetKeywords": [
//                 "cactus leather vs traditional leather",
//                 "sustainable materials"
//             ],
//             "competitorWeaknessExploited": "Directly addresses the 'Comparison Content' gap, capturing users in the decision-making phase.",
//             "searchIntent": "commercial investigation"
//         },
//         {
//             "tag": "Sustainable Corporate Gifting in India: Wallets, Belts & More",
//             "targetKeywords": [
//                 "sustainable corporate gifting India"
//             ],
//             "competitorWeaknessExploited": "Targets a high-value, low-competition B2B keyword opportunity the competitor has completely missed.",
//             "searchIntent": "transactional"
//         },
//         {
//             "tag": "The Ultimate Guide to Plant-Based & Sustainable Leather Alternatives",
//             "targetKeywords": [
//                 "plant-based leather accessories",
//                 "sustainable materials"
//             ],
//             "competitorWeaknessExploited": "Creates a central pillar of authority content that the competitor lacks, establishing market leadership.",
//             "searchIntent": "informational"
//         }
//     ],
//     "keywordOptimizedH2Tags": [
//         {
//             "h2Tag": "The Science Behind Cactus Leather: How Is It Made?",
//             "parentH1": "What is Cactus Leather? The Ultimate Guide to Plant-Based Fashion",
//             "keywordDensity": "what is cactus leather made of",
//             "contentGapFilled": "In-depth explanation of unique materials."
//         },
//         {
//             "h2Tag": "Evaluating the Durability and Lifespan of Bamboo Leather",
//             "parentH1": "Durable & Stylish Bamboo Leather: Everything You Need to Know",
//             "keywordDensity": "is bamboo leather durable",
//             "contentGapFilled": "Detailed content on material properties and care."
//         },
//         {
//             "h2Tag": "Our Top 5 Picks for Sustainable Wallets in 2024",
//             "parentH1": "The 2024 Buyer's Guide to Sustainable Wallets for Men",
//             "keywordDensity": "sustainable wallets for men",
//             "contentGapFilled": "Actionable buying guide content."
//         },
//         {
//             "h2Tag": "Why Choose Cruelty-Free Accessories? The Ethical Impact",
//             "parentH1": "The Ultimate Guide to Plant-Based & Sustainable Leather Alternatives",
//             "keywordDensity": "cruelty-free accessories",
//             "contentGapFilled": "Deepens the 'ethical fashion' topic beyond just materials."
//         },
//         {
//             "h2Tag": "Decoding Certifications: What 'LWG Certified' Really Means",
//             "parentH1": "LWG, USDA & GRS Certified Leather Goods in India Explained",
//             "keywordDensity": "LWG certified leather goods India",
//             "contentGapFilled": "Explaining complex certifications to build consumer trust."
//         },
//         {
//             "h2Tag": "Styling a Reversible Belt for Formal vs. Casual Wear",
//             "parentH1": "How to Choose the Perfect Sustainable Belt for Any Occasion",
//             "keywordDensity": "are reversible belts good for formal wear",
//             "contentGapFilled": "Practical style guides missing from competitor site."
//         },
//         {
//             "h2Tag": "Cactus vs. Bamboo vs. Recycled Leather: Which Is Best for You?",
//             "parentH1": "The Ultimate Guide to Plant-Based & Sustainable Leather Alternatives",
//             "keywordDensity": "plant-based leather accessories",
//             "contentGapFilled": "Comparison content that helps users make informed decisions."
//         },
//         {
//             "h2Tag": "The Environmental Benefits of Choosing Plant-Based Leather",
//             "parentH1": "The Ultimate Guide to Plant-Based & Sustainable Leather Alternatives",
//             "keywordDensity": "eco-friendly leather",
//             "contentGapFilled": "Educates users on the 'why' behind the purchase."
//         },
//         {
//             "h2Tag": "How We Achieve Artisan Craftsmanship in Every Product",
//             "parentH1": "Sustainable & Eco-Friendly Leather Belts, Wallets & Bags",
//             "keywordDensity": "artisan craftsmanship",
//             "contentGapFilled": "Highlights a unique selling proposition (craftsmanship) competitor lacks depth on."
//         },
//         {
//             "h2Tag": "Caring for Your Bamboo Leather Wallet: A Step-by-Step Guide",
//             "parentH1": "Durable & Stylish Bamboo Leather: Everything You Need to Know",
//             "keywordDensity": "how to care for bamboo leather",
//             "contentGapFilled": "Provides value post-purchase and builds E-E-A-T."
//         },
//         {
//             "h2Tag": "What is the Most Eco-Friendly Wallet Material Available?",
//             "parentH1": "The Ultimate Guide to Plant-Based & Sustainable Leather Alternatives",
//             "keywordDensity": "most eco-friendly wallet material",
//             "contentGapFilled": "Directly answers a user question, targeting featured snippets."
//         },
//         {
//             "h2Tag": "Behind the Patents: The Innovation in Our Sustainable Materials",
//             "parentH1": "Sustainable & Eco-Friendly Leather Belts, Wallets & Bags",
//             "keywordDensity": "sustainable materials innovation",
//             "contentGapFilled": "Leverages the '65+ patents' USP, which competitor underutilizes."
//         },
//         {
//             "h2Tag": "A Closer Look at GRS Certified Recycled Leather",
//             "parentH1": "LWG, USDA & GRS Certified Leather Goods in India Explained",
//             "keywordDensity": "GRS certified recycled leather bag",
//             "contentGapFilled": "Detailed content on certifications."
//         },
//         {
//             "h2Tag": "Finding the Best Men's Reversible Cactus Leather Belt",
//             "parentH1": "How to Choose the Perfect Sustainable Belt for Any Occasion",
//             "keywordDensity": "best men's reversible cactus leather belt",
//             "contentGapFilled": "Targets specific long-tail product searches."
//         },
//         {
//             "h2Tag": "Our Commitment to Slow Fashion and Conscious Consumerism",
//             "parentH1": "The Ultimate Guide to Plant-Based & Sustainable Leather Alternatives",
//             "keywordDensity": "slow fashion",
//             "contentGapFilled": "Builds brand story and appeals to audience values."
//         },
//         {
//             "h2Tag": "Video: The Journey of Our USDA Certified Bamboo Leather",
//             "parentH1": "Durable & Stylish Bamboo Leather: Everything You Need to Know",
//             "keywordDensity": "USDA certified bamboo leather",
//             "contentGapFilled": "Fills the 'Video Content' gap identified in the analysis."
//         },
//         {
//             "h2Tag": "Tote Bags That Are Both Cruelty-Free and Professional",
//             "parentH1": "Cruelty-Free Tote Bags & Vegan Leather Purses for Work",
//             "keywordDensity": "cruelty-free tote bag for work",
//             "contentGapFilled": "Style and use-case specific content."
//         },
//         {
//             "h2Tag": "Why Non-Toxic Dyes Matter in Ethical Fashion",
//             "parentH1": "The Ultimate Guide to Plant-Based & Sustainable Leather Alternatives",
//             "keywordDensity": "non-toxic dyes",
//             "contentGapFilled": "Adds another layer of depth to the sustainability topic."
//         },
//         {
//             "h2Tag": "Designer Details: The Brogue Pattern on Our Reversible Belts",
//             "parentH1": "How to Choose the Perfect Sustainable Belt for Any Occasion",
//             "keywordDensity": "designer reversible belt with brogue pattern",
//             "contentGapFilled": "Highlights unique product features the competitor's shallow content misses."
//         },
//         {
//             "h2Tag": "Featured Product: Women's Sustainable Zip-Around Wallet",
//             "parentH1": "The 2024 Buyer's Guide to Sustainable Wallets",
//             "keywordDensity": "women's sustainable zip-around wallet",
//             "contentGapFilled": "Strategic internal linking from informational to commercial pages."
//         }
//     ],
//     "pillarContentStrategy": {
//         "mainPillarPage": {
//             "title": "The Ultimate Guide to Sustainable Leather Alternatives | Plant-Based & Vegan Materials",
//             "targetKeyword": "sustainable leather alternatives",
//             "wordCount": "3500+",
//             "h1Tag": "The Ultimate Guide to Plant-Based & Sustainable Leather Alternatives",
//             "h2Structure": [
//                 {
//                     "h2": "What Are Sustainable Leather Alternatives?",
//                     "keywords": [
//                         "sustainable materials",
//                         "ethical fashion"
//                     ],
//                     "h3Subsections": [
//                         "Defining Plant-Based vs. Vegan Leather",
//                         "The Problem with Traditional Leather Production"
//                     ]
//                 },
//                 {
//                     "h2": "Deep Dive: Cactus Leather (USDA Certified)",
//                     "keywords": [
//                         "what is cactus leather",
//                         "cactus leather benefits"
//                     ],
//                     "h3Subsections": [
//                         "How It's Made",
//                         "Environmental Impact Scorecard",
//                         "Durability and Care"
//                     ]
//                 },
//                 {
//                     "h2": "Deep Dive: Bamboo Leather (USDA Certified)",
//                     "keywords": [
//                         "is bamboo leather durable",
//                         "bamboo leather properties"
//                     ],
//                     "h3Subsections": [
//                         "From Plant to Product",
//                         "Comparing Bamboo to Other Vegan Leathers",
//                         "Long-Term Maintenance"
//                     ]
//                 },
//                 {
//                     "h2": "Deep Dive: Recycled Leather (GRS Certified)",
//                     "keywords": [
//                         "recycled leather",
//                         "GRS certified"
//                     ],
//                     "h3Subsections": [
//                         "The Recycling Process",
//                         "Benefits of a Circular Economy in Fashion",
//                         "Identifying High-Quality Recycled Goods"
//                     ]
//                 },
//                 {
//                     "h2": "How to Choose the Right Sustainable Accessory for You",
//                     "keywords": [
//                         "how to choose a sustainable belt",
//                         "eco-friendly wallet"
//                     ],
//                     "h3Subsections": [
//                         "Buying Guide: Belts",
//                         "Buying Guide: Wallets",
//                         "Buying Guide: Bags"
//                     ]
//                 }
//             ],
//             "seoFeatures": {
//                 "metaDescription": "Discover the best sustainable leather alternatives. Our complete guide covers cactus, bamboo, and recycled leather to help you make ethical fashion choices.",
//                 "focusKeyphrase": "sustainable leather alternatives",
//                 "relatedKeywords": [
//                     "plant-based leather",
//                     "vegan leather",
//                     "eco-friendly accessories",
//                     "ethical fashion materials"
//                 ],
//                 "internalLinks": [
//                     "/collections/mens-cactus-leather-belts",
//                     "/pages/our-certifications",
//                     "/blog/cactus-vs-traditional-leather"
//                 ],
//                 "externalAuthorityLinks": [
//                     "https://www.ecocult.com/guides/",
//                     "https://global-standard.org/"
//                 ]
//             }
//         }
//     },
//     "highConversionBlogPosts": [
//         {
//             "postTitle": "Cactus Leather vs. Traditional Leather: An In-Depth Durability & Sustainability Comparison",
//             "targetKeyword": "cactus leather vs traditional leather",
//             "h1Tag": "Cactus Leather vs. Traditional Leather: Which is Better?",
//             "h2Outline": [
//                 "Environmental Impact: A Side-by-Side Look",
//                 "Durability & Longevity Test Results",
//                 "Feel, Texture, and Appearance Differences",
//                 "Cost Analysis: Upfront vs. Lifetime Value"
//             ],
//             "metaDescription": "Is cactus leather better than real leather? We compare durability, sustainability, cost, and feel to help you decide which material is right for you.",
//             "estimatedWordCount": "2200+",
//             "contentType": "comparison",
//             "competitorAdvantage": "Provides a data-driven comparison the competitor lacks, capturing high-intent users ready to make a purchase decision."
//         },
//         {
//             "postTitle": "Is Bamboo Leather Durable? The Truth About This Eco-Friendly Material",
//             "targetKeyword": "is bamboo leather durable",
//             "h1Tag": "The Ultimate Durability Test: How Strong is Bamboo Leather?",
//             "h2Outline": [
//                 "What Makes Bamboo Leather Strong?",
//                 "Real-World Wear and Tear Scenarios",
//                 "How to Properly Care for Bamboo Leather to Maximize its Life",
//                 "Customer Reviews on Durability"
//             ],
//             "metaDescription": "Curious about bamboo leather durability? We break down the science, care instructions, and real-world tests for this innovative, sustainable material.",
//             "estimatedWordCount": "1800+",
//             "contentType": "informational",
//             "competitorAdvantage": "Answers a specific user question with expert detail and social proof, establishing trust where the competitor is silent."
//         },
//         {
//             "postTitle": "A Buyer's Guide: How to Choose the Perfect Sustainable Belt in 5 Easy Steps",
//             "targetKeyword": "how to choose a sustainable belt",
//             "h1Tag": "How to Choose a Sustainable Belt That Lasts a Lifetime",
//             "h2Outline": [
//                 "Step 1: Choose Your Material (Cactus, Bamboo, etc.)",
//                 "Step 2: Understand Buckle Types (Reversible vs. Formal)",
//                 "Step 3: How to Find Your Perfect Size",
//                 "Step 4: Matching Your Belt to Your Wardrobe",
//                 "Step 5: Look for Lifetime Warranties & Certifications"
//             ],
//             "metaDescription": "Don't just buy another belt. Learn how to choose a sustainable belt with our expert 5-step guide. Find the right material, size, and style for you.",
//             "estimatedWordCount": "2000+",
//             "contentType": "how-to guide",
//             "competitorAdvantage": "Fills the 'Buying Guide' content gap with actionable, helpful content that strategically links to various product category pages."
//         },
//         {
//             "postTitle": "Decoding the Labels: What LWG, USDA, and GRS Certifications Mean for Your Wallet",
//             "targetKeyword": "LWG certified leather goods India",
//             "h1Tag": "LWG, USDA & GRS: A Simple Guide to Sustainable Fashion Certifications",
//             "h2Outline": [
//                 "What is the Leather Working Group (LWG)?",
//                 "Understanding the USDA BioPreferred Program",
//                 "What Does the Global Recycled Standard (GRS) Guarantee?",
//                 "Why You Should Always Look for These Labels"
//             ],
//             "metaDescription": "Confused by sustainable fashion labels? We explain what LWG, USDA, and GRS certifications mean so you can shop for ethical leather goods with confidence.",
//             "estimatedWordCount": "2500+",
//             "contentType": "informational",
//             "competitorAdvantage": "This post builds immense E-E-A-T and topical authority by explaining complex topics the competitor completely ignores."
//         },
//         {
//             "postTitle": "5 Ways to Style a Reversible Belt for Any Occasion",
//             "targetKeyword": "how to style reversible belt",
//             "h1Tag": "From Boardroom to Brunch: 5 Killer Looks with One Reversible Belt",
//             "h2Outline": [
//                 "Look 1: The Corporate Professional",
//                 "Look 2: The Smart Casual Weekend",
//                 "Look 3: The Formal Event",
//                 "Video Tutorial: The 30-Second Switch",
//                 "Shop the Looks"
//             ],
//             "metaDescription": "Unlock the versatility of your wardrobe. Learn how to style a reversible belt for formal, casual, and business occasions with our expert fashion tips.",
//             "estimatedWordCount": "1500+",
//             "contentType": "how-to guide",
//             "competitorAdvantage": "Creates a highly engaging 'Style Guide' (a key competitor gap) with visuals and video, promoting specific products."
//         },
//         {
//             "postTitle": "Behind the Brand: The Story of Our 65+ Design Patents",
//             "targetKeyword": "fountainearth innovation",
//             "h1Tag": "More Than a Belt: How 65+ Patents Are Redefining Sustainable Fashion",
//             "h2Outline": [
//                 "An Interview with Our Founder",
//                 "Spotlight on 3 of Our Favorite Patented Designs",
//                 "What This Innovation Means for You",
//                 "The Future of Sustainable Accessory Design"
//             ],
//             "metaDescription": "Discover the innovation behind our brand. We go behind the scenes to explore the 65+ design patents that make our sustainable accessories unique.",
//             "estimatedWordCount": "1800+",
//             "contentType": "informational",
//             "competitorAdvantage": "Transforms a simple USP into a compelling brand story and E-E-A-T signal, a tactic the competitor misses."
//         },
//         {
//             "postTitle": "Top 7 Eco-Friendly Wallets for the Conscious Consumer in 2024",
//             "targetKeyword": "sustainable wallets for men",
//             "h1Tag": "The Best Eco-Friendly & Sustainable Wallets of 2024",
//             "h2Outline": [
//                 "Best Overall: The Executive Bifold Cactus Wallet",
//                 "Best Minimalist: The Slim Bamboo Card Holder",
//                 "Best for Durability: The Recycled Leather Zip Wallet",
//                 "What to Look for in a Sustainable Wallet",
//                 "Comparison Table"
//             ],
//             "metaDescription": "Searching for the best sustainable wallet? We've reviewed the top eco-friendly wallets for men and women based on material, durability, and ethics.",
//             "estimatedWordCount": "2000+",
//             "contentType": "comparison",
//             "competitorAdvantage": "Captures high commercial intent search traffic with a listicle format that is easy to read and internally link to products."
//         },
//         {
//             "postTitle": "Sustainable Corporate Gifting: Why Your Company Should Make the Switch",
//             "targetKeyword": "sustainable corporate gifting India",
//             "h1Tag": "Ethical & Elegant: The Ultimate Guide to Sustainable Corporate Gifting",
//             "h2Outline": [
//                 "The Benefits of Eco-Friendly Corporate Gifts",
//                 "Our Top Picks for Clients and Employees",
//                 "Customization and Bulk Order Options",
//                 "Case Study: How We Helped [Company X] with Their Gifting Needs"
//             ],
//             "metaDescription": "Elevate your corporate gifting with sustainable leather accessories. Discover unique, eco-friendly gift ideas for clients and employees in India.",
//             "estimatedWordCount": "1600+",
//             "contentType": "informational",
//             "competitorAdvantage": "Targets a lucrative, low-competition B2B niche that the competitor has not even considered, opening a new revenue channel."
//         }
//     ],
//     "socialMediaSEOPosts": [
//         {
//             "platform": "Instagram",
//             "postContent": "Cactus Leather vs. Traditional Leather. Ever wondered what the real difference is? 🤔 We break down the durability, eco-impact, and feel of each. Spoiler: The future is green. 🌵 Link in bio for the full comparison!",
//             "hashtags": [
//                 "#CactusLeather",
//                 "#SustainableFashion",
//                 "#EcoFriendly",
//                 "#VeganLeather",
//                 "#EthicalFashion",
//                 "#ConsciousConsumerism"
//             ],
//             "linkToContent": "/blog/cactus-vs-traditional-leather",
//             "seoObjective": "Drive targeted traffic to a high-conversion comparison post and build authority."
//         },
//         {
//             "platform": "LinkedIn",
//             "postContent": "Innovation in sustainable materials is not just a trend; it's the future. Our commitment to this is backed by 65+ design patents. We're proud to be at the forefront of creating accessories that are both stylish and sustainable. Learn more about our process and what sets us apart.",
//             "hashtags": [
//                 "#Sustainability",
//                 "#Innovation",
//                 "#Patents",
//                 "#EthicalBusiness",
//                 "#SlowFashion"
//             ],
//             "linkToContent": "/blog/behind-the-brand-65-patents",
//             "seoObjective": "Enhance brand E-E-A-T and credibility among a professional audience."
//         },
//         {
//             "platform": "Twitter",
//             "postContent": "Is bamboo leather durable enough for daily use? We put it to the test. The results might surprise you! #SustainableMaterials #BambooLeather #Durability",
//             "hashtags": [
//                 "#SustainableMaterials",
//                 "#BambooLeather",
//                 "#Durability",
//                 "#EcoTech"
//             ],
//             "linkToContent": "/blog/is-bamboo-leather-durable",
//             "seoObjective": "Generate clicks and engagement by answering a common user question directly."
//         },
//         {
//             "platform": "Pinterest",
//             "postContent": "[Infographic Pin] The Lifecycle of a Sustainable Belt: From cactus farm to your wardrobe, see the eco-friendly journey of our products. Learn about our water-saving processes and non-toxic dyes.",
//             "hashtags": [
//                 "#SustainableLifecycle",
//                 "#Infographic",
//                 "#EcoFashion",
//                 "#HowItsMade",
//                 "#CactusLeather"
//             ],
//             "linkToContent": "/sustainable-leather-alternatives-guide",
//             "seoObjective": "Earn backlinks and drive traffic from a visual search platform to the main pillar page."
//         }
//     ],
//     "technicalSEORecommendations": {
//         "urlStructure": [
//             "/guides/sustainable-leather-alternatives",
//             "/materials/what-is-cactus-leather",
//             "/materials/bamboo-leather-durability-care",
//             "/blog/how-to-choose-sustainable-belt",
//             "/collections/mens-eco-friendly-belts",
//             "/products/executive-brogue-cactus-leather-belt-black"
//         ],
//         "schemaMarkup": [
//             "Product",
//             "AggregateRating",
//             "Review",
//             "Article",
//             "FAQPage",
//             "VideoObject",
//             "BreadcrumbList",
//             "Organization"
//         ],
//         "featuredSnippetTargets": [
//             {
//                 "question": "What is cactus leather made of?",
//                 "answer": "Cactus leather is a sustainable, plant-based material made from the leaves of the Nopal cactus (prickly pear). The mature leaves are harvested, cleaned, mashed, and then dried in the sun before being processed into a durable, organic material that resembles traditional leather.",
//                 "targetPage": "/materials/what-is-cactus-leather"
//             },
//             {
//                 "question": "Is bamboo leather durable?",
//                 "answer": "Yes, high-quality bamboo leather is known for its durability and resistance to stretching and abrasion. Its strength comes from the natural cellulose fibers of the bamboo plant. With proper care, bamboo leather accessories can last for many years, making them a sustainable and long-lasting choice.",
//                 "targetPage": "/materials/bamboo-leather-durability-care"
//             },
//             {
//                 "question": "How do you choose a sustainable belt?",
//                 "answer": "To choose a sustainable belt, first check the material (opt for plant-based like cactus or recycled materials), look for official certifications like USDA BioPreferred or GRS, assess the quality of the buckle and stitching, and prefer brands that offer a repair service or lifetime warranty.",
//                 "targetPage": "/blog/how-to-choose-sustainable-belt"
//             }
//         ]
//     }
// }



imageRouter.post('/imageGeneration', async (req, res) => {
    try {
        const { data } = req.body

        function buildPromptsFromData(data) {
            const prompts = [];

            // From H1 Tags
            data.seoOptimizedH1Tags.forEach((item) => {
                prompts.push(
                    `Create a clean, modern SEO infographic for the topic: "${item.tag}". 
            Highlight the target keywords: ${item.targetKeywords.join(", ")}. 
            The image must be visually appealing, self-contained, and optimized for websites and social media posts. 
            Do not include competitor weaknesses, branding, logos, watermarks, or external links.`
                );
            });

            // From H2 Tags
            data.keywordOptimizedH2Tags.forEach((item) => {
                prompts.push(
                    `Design a professional infographic for the subtopic "${item.h2Tag}" under "${item.parentH1}". 
            Focus on keyword density: "${item.keywordDensity}" and content gap: "${item.contentGapFilled}". 
            Style: minimal, modern, and optimized for SEO and sharing. 
            Do not add competitor comparisons, branding, or external references.`
                );
            });

            // From Pillar Page
            if (data.pillarContentStrategy?.mainPillarPage) {
                const p = data.pillarContentStrategy.mainPillarPage;
                prompts.push(
                    `Create a high-quality cover image for the pillar page "${p.title}" (H1: "${p.h1Tag}"). 
            Highlight the main keyword: "${p.targetKeyword}" and related keywords: ${p.seoFeatures.relatedKeywords.join(", ")}. 
            The image must be clean, SEO-optimized, and suitable for website banners and social media sharing. 
            Avoid competitor weaknesses, logos, or watermarks.`
                );
            }

            // From Blog Posts
            data.highConversionBlogPosts.forEach((post) => {
                prompts.push(
                    `Generate a modern infographic for the blog "${post.postTitle}" (H1: "${post.h1Tag}"). 
            Visualize the outline: ${post.h2Outline.join(", ")}. 
            Emphasize the keyword: "${post.targetKeyword}". 
            The style should be clear, professional, and optimized for SEO and social sharing. 
            Do not mention competitor weaknesses or include logos, links, or watermarks.`
                );
            });

            return prompts;
        }



        const prompts = buildPromptsFromData(data);
        const outputDir = path.join(process.cwd(), 'public', 'images', 'seo');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        const results = [];

        for (let i = 0; i < 5; i++) {
            const prompt = prompts[i];
            console.log(`🔄 Generating image ${i + 1}/${prompts.length - 30}...`);

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-image-preview",
                contents: prompt,
            });

            const part = response.candidates[0].content.parts.find((p) => p.inlineData);
            if (part && part.inlineData) {
                const buffer = Buffer.from(part.inlineData.data, "base64");
                const filename = `seo-dynamic-${i + 1}.png`;
                const filePath = path.join(outputDir, filename);
                fs.writeFileSync(filePath, buffer);

                const imageUrl = `/images/seo/${filename}`;
                results.push({ prompt, imageUrl });
                console.log(`✅ Saved: ${filename}`);
            }
        }

        console.log("\n🎉 All images generated!");
        res.send(results)
    } catch (err) {
        res.status(404).send(err, 'unable to loadimage')
    }
    // return results;
}

)

module.exports = imageRouter
