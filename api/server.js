cat > /var/www/gcanetworks/api/server.js <<'EOF'
'use strict';

const express = require('express');

const app = express();
app.use(express.json({ limit: '1mb' }));

// CORS simple (por si algún día pegas desde otro dominio)
const allowed = new Set([
  'https://gcanetworks.com',
  'https://www.gcanetworks.com'
]);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://gcanetworks.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'gca-api', ts: new Date().toISOString() });
});

// Endpoint para tu formulario
app.post('/api/contact', (req, res) => {
  const { name, business, email, phone, message } = req.body || {};

  if (!name || !email || !phone || !message) {
    return res.status(400).json({
      ok: false,
      error: 'Campos requeridos: name, email, phone, message'
    });
  }

  // Por ahora solo log (luego lo conectamos a email/telegram/discord)
  console.log('[CONTACT]', {
    name, business, email, phone, message,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
  });

  return res.json({ ok: true, msg: 'Recibido. En breve te contactamos.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`GCA API listening on http://127.0.0.1:${PORT}`);
});
EOF

