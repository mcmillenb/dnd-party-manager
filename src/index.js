const http = require('http');
const axios = require('axios');
const cheerio = require('cheerio');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const characterUrl = 'https://www.dndbeyond.com/profile/brianmcmillen1/characters/6626114';
axios({
  url: characterUrl,
  method: 'get',
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-cache',
    'Cookies': 'foo=bar',
    'User-Agent': 'dnd-party-manager',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
  }
}).then((resp) => {
  const $ = cheerio.load(resp.data);
  console.log('Title:', $('h1.page-title').text().trim());
}).catch((error) => {
  console.error(error);
});
