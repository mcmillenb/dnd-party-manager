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

const characterUrl = 'https://www.dndbeyond.com/profile/brianmcmillen1/characters';
const server = http.createServer(async (req, res) => {
  const { url } = req;
  if (!url.match(/^[\/]\d+$/)) {
    res.end('bad id');
    return;
  }
  const html = await getHtml(`${characterUrl}${url}`);
  const $ = cheerio.load(html);
  const title = $('h1.page-title').text().trim();
  const stats = $('.ct-ability-summary__secondary');
  const str = stats.eq(0).text();
  const dex = stats.eq(1).text();
  const con = stats.eq(2).text();
  const int = stats.eq(3).text();
  const wis = stats.eq(4).text();
  const cha = stats.eq(5).text();

  const data = {
    title,
    stats: { str, dex, con, int, wis, cha }
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
