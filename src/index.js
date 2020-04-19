const puppeteer = require('puppeteer');
const http = require('http');
const cheerio = require('cheerio');

async function getHtml(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const html = await page.content();
  await browser.close();
  return html;
}

const hostname = '127.0.0.1';
const port = 3000;

const characterUrl = 'https://www.dndbeyond.com/profile/brianmcmillen1/characters/6626114';
getHtml(characterUrl).then((html) => {
  const $ = cheerio.load(html);
  const title = $('h1.page-title').text().trim();

  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Title: ${title}`);
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}).catch((error) => {
  console.error(error);
});
