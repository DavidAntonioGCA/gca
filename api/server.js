'use strict';

const express = require('express');
const app = express();

app.use(express.json({ limit: '1mb' }));

// CORS: permite peticiones solo desde tu dominio
const allowedOrigins = new Set([
  'https://gcanetworks.com',
  'https://www.gcanetworks.com'
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // Vary para que el proxy considere el Origin en caché
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Endpoint de salud
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'gca-api',
    ts: new Date().toISOString()
  });
});

// Manejador de contacto reutilizable
function handleContact(req, res) {
  const body = req.body || {};
  // Acepta nombres en español o inglés
  const name = body.name ?? body.nombre;
  const business = body.business ?? body.negocio;
  const email = body.email ?? '';
  const phone = body.phone ?? body.telefono;
  const message = body.message ?? body.mensaje;
  const website = body.website ?? ''; // honeypot opcional

  // Honeypot: si se llena, se ignora
  if (String(website).trim()) {
    return res.json({ ok: true, msg: 'Recibido' });
  }

  if (!name || !email || !phone) {
    return res.status(400).json({
      ok: false,
      error: 'Faltan campos requeridos: nombre, email y teléfono'
    });
  }

  console.log('[CONTACT]', {
    name,
    business,
    email,
    phone,
    message,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
  });

  return res.json({
    ok: true,
    msg: 'Recibido. En breve te contactamos.'
  });
}

// Rutas de contacto
app.post('/api/contact', handleContact);
app.post('/api/contacto', handleContact);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`GCA API listening on http://127.0.0.1:${PORT}`);
});
