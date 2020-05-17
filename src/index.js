import puppeteer from 'puppeteer';
import http from 'http';
import cheerio from 'cheerio';

const hostname = '127.0.0.1';
const port = 8080;

async function getHtml(url) {
  console.log('--- begin getHtml ---', { url });
  const browser = await puppeteer.launch({ headless: false });
  console.log('browser launched');
  const page = await browser.newPage();
  console.log('page created');
  await page.goto(url, { waitUntil: 'networkidle2' });
  console.log('url loaded');
  const html = await page.content();
  console.log('html content retrieved', { html });
  await browser.close();
  console.log('--- end getHtml ---');
  return html;
}

async function parseCharacterSheet(url) {
  console.log('--- begin parseCharacterSheet ---', { url });
  const characterUrl = 'https://www.dndbeyond.com/profile/brianmcmillen1/characters';
  const html = await getHtml(`${characterUrl}${url}`);
  console.log('html retrieved');
  const $ = cheerio.load(html);
  const title = $('h1.page-title').text().trim();
  const stats = $('.ct-ability-summary__secondary');
  const str = stats.eq(0).text();
  const dex = stats.eq(1).text();
  const con = stats.eq(2).text();
  const int = stats.eq(3).text();
  const wis = stats.eq(4).text();
  const cha = stats.eq(5).text();
  const parsedData = {
    title,
    stats: { str, dex, con, int, wis, cha }
  };

  console.log('--- end parseCharacterSheet ---', { parsedData });
  return parsedData;
}

const server = http.createServer(async (req, res) => {
  console.log('--- begin request callback ---');
  const { url } = req;
  console.log({ url })
  let data = {};
  if (url.match(/^[/]\d+$/)) {
    console.log('url matched format');
    data = await parseCharacterSheet(url);
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
  console.log('--- end request callback ---');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
