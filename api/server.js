const express = require('express');
const app = express();

app.use(express.json({ limit: '1mb' }));

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

function handleContact(req, res) {
  const b = req.body || {};
  const name = b.name || b.nombre;
  const business = b.business || b.negocio;
  const email = b.email;
  const phone = b.phone || b.telefono;
  const message = b.message || b.mensaje;

  if (!name || !email || !phone) {
    return res.status(400).json({ ok: false, error: 'Faltan campos requeridos.' });
  }

  console.log('[CONTACT]', {
    name, business, email, phone, message,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
  });

  return res.json({ ok: true, msg: 'Recibido. En breve te contactamos.' });
}

app.post('/api/contact', handleContact);
app.post('/api/contacto', handleContact);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`GCA API listening on http://127.0.0.1:${PORT}`);
});
EOF

sudo systemctl reset-failed gca-api
sudo systemctl restart gca-api
