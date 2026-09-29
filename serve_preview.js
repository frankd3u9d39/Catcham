const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PREVIEW_FILE = path.join(__dirname, 'preview.html');

const server = http.createServer((req, res) => {
  if (req.url === '/logo.png') {
    const logoPath = path.join(__dirname, 'logo.png');
    if (fs.existsSync(logoPath)) {
      res.writeHead(200, { 'Content-Type': 'image/png' });
      return fs.createReadStream(logoPath).pipe(res);
    }
  }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  const content = fs.readFileSync(PREVIEW_FILE, 'utf8');
  res.end(content);
});

server.listen(PORT, () => {
  console.log(`CATCHAM Live Frontend Server operational at http://localhost:${PORT}`);
});
