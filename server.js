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

function biasedRandomRecord(recBits, recSize) {
  const n = 2 ** recBits;
  const weights = [0.9, ...Array(n - 1).fill(0.1 / (n - 1))];
  
  function getRandomIndex(weights) {
    const sum = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * sum;
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i];
      if (r < 0) {
        return i;
      }
    }
  }

  return Array.from({ length: recSize }, () => getRandomIndex(weights));
}

app.get('/record', (req, res) => {
  let record = biasedRandomRecord(storedSettings['rec-bits'], storedSettings['rec-size']);
  let response = record
    .map((count, index) => count > 0 ? `${index}:${count}` : null)
    .filter(item => item !== null)
    .join(' ');
  res.setHeader('Content-Type', 'text/plain');
  res.send(response);
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
