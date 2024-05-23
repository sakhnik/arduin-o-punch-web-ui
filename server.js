// server.js
import express from 'express';
import sirv from 'sirv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Additional API route
app.post('/settings', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});

// Example POST route
app.post('/api/submit', (req, res) => {
  const { name, email } = req.body;
  res.json({ success: true, name, email });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
