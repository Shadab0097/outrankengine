// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// puppeteer.use(StealthPlugin());

// async function scraperUrl(url) {
//     try {
//         const browser = await puppeteer.launch({
//             headless: true,
//             args: ['--no-sandbox', '--disable-setuid-sandbox']
//         });

//         const page = await browser.newPage();

//         // Set realistic user agent
//         await page.setUserAgent(
//             'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
//         );

//         await page.setViewport({ width: 1280, height: 800 });

//         await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

//         // ⏱️ Replace waitForTimeout with setTimeout
//         await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2s
//         await page.evaluate(() => window.scrollBy(0, window.innerHeight / 2));
//         await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1s

//         const data = await page.evaluate(() => {
//             const isVisible = (el) => {
//                 const style = window.getComputedStyle(el);
//                 const rect = el.getBoundingClientRect();
//                 return (
//                     style.display !== 'none' &&
//                     style.visibility !== 'hidden' &&
//                     style.opacity !== '0' &&
//                     rect.width > 0 &&
//                     rect.height > 0
//                 );
//             };

//             const getMeta = (name) => {
//                 return document.querySelector(`meta[name="${name}"]`)?.content || '';
//             };

//             const getOG = (property) => {
//                 return document.querySelector(`meta[property="${property}"]`)?.content || '';
//             };

//             const getAllHeadings = (tag) => {
//                 return Array.from(document.querySelectorAll(tag))
//                     .filter(isVisible)
//                     .map(el => el.textContent.trim());
//             };

//             const getAllLinks = () => {
//                 return Array.from(document.querySelectorAll('a'))
//                     .filter(el => isVisible(el) && el.href.includes(location.hostname))
//                     .map(el => el.href);
//             };

//             const getImagesWithAlt = () => {
//                 return Array.from(document.querySelectorAll('img'))
//                     .filter(isVisible)
//                     .map(img => ({
//                         src: img.src,
//                         alt: img.alt || 'N/A'
//                     }));
//             };

//             const getStructuredData = () => {
//                 return Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
//                     .map(script => script.innerText.trim());
//             };

//             return {
//                 title: document.title,
//                 metaDescription: getMeta('description'),
//                 metaKeywords: getMeta('keywords'),
//                 canonical: document.querySelector('link[rel="canonical"]')?.href || '',
//                 ogTitle: getOG('og:title'),
//                 ogDescription: getOG('og:description'),
//                 ogImage: getOG('og:image'),
//                 h1s: getAllHeadings('h1'),
//                 h2s: getAllHeadings('h2'),
//                 h3s: getAllHeadings('h3'),
//                 bodyTextPreview: (document.body?.innerText || '')
//                     .trim()
//                     .replace(/\s+/g, ' ')
//                     .slice(0, 500),
//                 internalLinks: getAllLinks(),
//                 images: getImagesWithAlt(),
//                 structuredData: getStructuredData()
//             };
//         });
//         // console.dir(data, { depth: null })
//         await browser.close();
//         return data;
//     } catch (err) {
//         console.log('Something went wrong:', err.message);
//         return null;
//     }
// }

// module.exports = { scraperUrl };


// const { executablePath } = require('puppeteer');

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());



async function scraperUrl(urls) {
    let browser;

    try {

        // Launch browser once for all operations
        browser = await puppeteer.launch({

            headless: true,

            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--single-procee',
                '--no-zygote',

            ]
        });

        // Determine if we have one URL or two URLs
        const isSingleUrl = typeof urls === 'string';
        const isDoubleUrl = typeof urls === 'object' && urls.competitorUrl && urls.ourUrl;

        if (!isSingleUrl && !isDoubleUrl) {
            throw new Error('Invalid input: provide either a single URL string or an object with competitorUrl and ourUrl');
        }



        if (isSingleUrl) {
            // Single URL scraping
            const data = await scrapeSinglePage(browser, urls);
            return data;
        } else {
            // Double URL scraping - concurrent for speed
            const [competitorData, ourData] = await Promise.all([
                scrapeSinglePage(browser, urls.competitorUrl),
                scrapeSinglePage(browser, urls.ourUrl)
            ]);

            return {
                competitorData: competitorData,
                ourData: ourData
            };
        }

    } catch (err) {
        console.log('Something went wrong:', err.message);
        return null;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function scrapeSinglePage(browser, url) {
    const page = await browser.newPage();

    try {

        await page.setRequestInterception(true);


        const blockedResourceTypes = ['image', 'stylesheet', 'font', 'media'];
        const blockedDomains = ['google-analytics', 'googletagmanager', 'facebook', 'twitter'];

        page.on('request', (request) => {
            const requestUrl = request.url();
            const resourceType = request.resourceType();

            if (
                blockedResourceTypes.includes(resourceType) ||
                blockedDomains.some(domain => requestUrl.includes(domain))
            ) {
                request.abort();
            } else {
                request.continue();
            }
        });


        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        );

        await page.setViewport({ width: 1280, height: 800 });


        await page.goto(url, {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });


        await new Promise(resolve => setTimeout(resolve, 1000)); // Reduced wait time
        await page.evaluate(() => window.scrollBy(0, window.innerHeight / 2));
        await new Promise(resolve => setTimeout(resolve, 500)); // Reduced wait time

        const data = await page.evaluate(() => {
            const isVisible = (el) => {
                const style = window.getComputedStyle(el);
                const rect = el.getBoundingClientRect();
                return (
                    style.display !== 'none' &&
                    style.visibility !== 'hidden' &&
                    style.opacity !== '0' &&
                    rect.width > 0 &&
                    rect.height > 0
                );
            };

            const getMeta = (name) => {
                return document.querySelector(`meta[name="${name}"]`)?.content || '';
            };

            const getOG = (property) => {
                return document.querySelector(`meta[property="${property}"]`)?.content || '';
            };

            const getAllHeadings = (tag) => {
                return Array.from(document.querySelectorAll(tag))
                    .filter(isVisible)
                    .map(el => el.textContent.trim());
            };

            const getAllLinks = () => {
                return Array.from(document.querySelectorAll('a'))
                    .filter(el => isVisible(el) && el.href.includes(location.hostname))
                    .map(el => el.href);
            };

            const getImagesWithAlt = () => {
                return Array.from(document.querySelectorAll('img'))
                    .filter(isVisible)
                    .map(img => ({
                        src: img.src,
                        alt: img.alt || 'N/A'
                    }));
            };

            const getStructuredData = () => {
                return Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
                    .map(script => script.innerText.trim());
            };

            return {
                url: location.href,
                title: document.title,
                metaDescription: getMeta('description'),
                metaKeywords: getMeta('keywords'),
                canonical: document.querySelector('link[rel="canonical"]')?.href || '',
                ogTitle: getOG('og:title'),
                ogDescription: getOG('og:description'),
                ogImage: getOG('og:image'),
                h1s: getAllHeadings('h1'),
                h2s: getAllHeadings('h2'),
                h3s: getAllHeadings('h3'),
                bodyTextPreview: (document.body?.innerText || '')
                    .trim()
                    .replace(/\s+/g, ' ')
                    .slice(0, 500),
                internalLinks: getAllLinks(),
                images: getImagesWithAlt(),
                structuredData: getStructuredData()
            };
        });
        // console.log(data)
        return data;

    } finally {

        await page.close();
    }
}

module.exports = { scraperUrl };

