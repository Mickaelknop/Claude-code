/**
 * Golf Club du Forez — Web Scraper
 * Target: https://www.golfclubduforez.com/
 * Objective: Extract all site content to build a modern redesign
 *
 * Uses Crawlee (CheerioCrawler) for HTML scraping.
 * Output: scraped-content/all-pages.json, summary.json, content-structure.json
 *
 * NOTE: In restricted network environments, direct HTTP access may be blocked.
 * In that case, the script exits gracefully and content was collected via
 * web search aggregation (see ../scraped-content/).
 */

import { CheerioCrawler } from 'crawlee';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://www.golfclubduforez.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'scraped-content');

const scrapedPages = [];

function cleanText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function extractNavigation($) {
  const nav = [];
  const seen = new Set();
  $('nav a, .menu a, .navigation a, header a, #menu a, .nav a').each((i, el) => {
    const $el = $(el);
    const text = cleanText($el.text());
    const href = $el.attr('href');
    if (text && href && !seen.has(href)) {
      seen.add(href);
      nav.push({ text, href });
    }
  });
  return nav;
}

function extractImages($, baseUrl) {
  const images = [];
  $('img').each((i, el) => {
    const $el = $(el);
    let src = $el.attr('src') || $el.attr('data-src') || $el.attr('data-lazy-src');
    const alt = $el.attr('alt') || '';
    if (src) {
      if (src.startsWith('/')) src = baseUrl + src;
      else if (!src.startsWith('http')) src = baseUrl + '/' + src;
      images.push({ src, alt });
    }
  });
  return images;
}

function extractSections($) {
  const sections = [];
  $('section, article, .section, .block, .content-block, .wp-block-group').each((i, el) => {
    const $el = $(el);
    const title = cleanText($el.find('h1, h2, h3').first().text());
    const content = cleanText($el.text());
    if (content.length > 50) {
      sections.push({
        title: title || null,
        content: content.substring(0, 2000)
      });
    }
  });
  return sections;
}

function extractContactInfo(html) {
  const contact = {};
  const phoneMatch = html.match(/(\+33[\s\-]?[\d\s\-]{9,}|0[\d][\s\-]?[\d\s\-]{8,})/);
  if (phoneMatch) contact.phone = phoneMatch[1].replace(/\s+/g, ' ').trim();
  const emailMatch = html.match(/([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) contact.email = emailMatch[1];
  return contact;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const crawler = new CheerioCrawler({
    maxRequestsPerCrawl: 100,
    maxConcurrency: 3,
    requestHandlerTimeoutSecs: 30,

    async requestHandler({ request, $, enqueueLinks, log }) {
      const url = request.url;
      log.info(`Scraping: ${url}`);

      const title = cleanText($('title').text() || $('h1').first().text());
      const description = $('meta[name="description"]').attr('content') || '';

      const mainContent = cleanText(
        $('main, .main, #main, .content, #content, article, .entry-content').first().text()
        || $('body').text()
      );

      const headings = [];
      $('h1, h2, h3, h4').each((i, el) => {
        const text = cleanText($(el).text());
        if (text) headings.push({ level: el.tagName, text });
      });

      const navigation = extractNavigation($);
      const images = extractImages($, BASE_URL);
      const sections = extractSections($);
      const contact = extractContactInfo($.html());

      scrapedPages.push({
        url,
        title,
        description,
        headings,
        navigation: navigation.length > 0 ? navigation : undefined,
        sections: sections.length > 0 ? sections : undefined,
        images: images.slice(0, 20),
        contact: Object.keys(contact).length > 0 ? contact : undefined,
        mainContent: mainContent.substring(0, 5000),
        scrapedAt: new Date().toISOString()
      });

      await enqueueLinks({
        globs: [`${BASE_URL}/**`],
        transformRequestFunction(req) {
          if (req.url.match(/\.(pdf|jpg|jpeg|png|gif|svg|css|js|xml|zip)$/i)) return false;
          if (req.url.includes('#')) return false;
          return req;
        }
      });
    },

    failedRequestHandler({ request, log }) {
      log.error(`Failed: ${request.url}`);
    }
  });

  await crawler.run([BASE_URL]);

  // Save outputs
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'all-pages.json'),
    JSON.stringify(scrapedPages, null, 2),
    'utf-8'
  );

  const summary = {
    siteUrl: BASE_URL,
    totalPages: scrapedPages.length,
    scrapedAt: new Date().toISOString(),
    pages: scrapedPages.map(p => ({
      url: p.url,
      title: p.title,
      headingsCount: p.headings?.length || 0,
      imagesCount: p.images?.length || 0
    }))
  };

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'summary.json'),
    JSON.stringify(summary, null, 2),
    'utf-8'
  );

  const contentStructure = {
    site: { name: 'Golf Club du Forez', url: BASE_URL },
    navigation: scrapedPages[0]?.navigation || [],
    pages: scrapedPages.reduce((acc, page) => {
      const key = page.url.replace(BASE_URL, '').replace(/^\//, '') || 'home';
      acc[key] = {
        title: page.title,
        description: page.description,
        headings: page.headings,
        sections: page.sections,
        contact: page.contact,
        images: page.images
      };
      return acc;
    }, {})
  };

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'content-structure.json'),
    JSON.stringify(contentStructure, null, 2),
    'utf-8'
  );

  console.log(`\n✅ Scraping complete!`);
  console.log(`📄 Pages scraped: ${scrapedPages.length}`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
}

main().catch(console.error);
