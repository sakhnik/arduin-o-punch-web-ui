// server.js
import express from 'express';
import sirv from 'sirv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var storedSettings = {
  id: '19',
  key: '112233445566',
  'rec-size': '512',
  'rec-bits': '2',
  'rec-days': '1'
};

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(
  sirv(path.join(__dirname, 'public'), {
    single: false,
    dev: true,
  })
);

app.get('/settings', (req, res) => {
  let response = '';
  for (const [key, value] of Object.entries(storedSettings)) {
    response += `${key}=${value}\n`;
  }
  res.setHeader('Content-Type', 'text/plain');
  res.send(response);
});

// Store settings
app.post('/settings', (req, res) => {
  storedSettings = req.body;
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/update', (req, res) => {
  req.on('data', async (chunk) => {
    //console.log("chunk " + chunk.length);
  });

  req.on('end', () => {
    res.send('success');
  });

  req.on('error', (err) => {
    res.status(500).send('Error processing file');
  });
});
