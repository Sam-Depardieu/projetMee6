// === CONFIG ===
require('dotenv').config();
const path = require('path');

// === LANCEMENT DU BOT ===
require('./bot/index.js'); // <- ton fichier bot principal

// === EXPRESS POUR LE SITE WEB ===
const express = require('express');
const app = express();
const port = 3000;

// Sert les fichiers HTML depuis /website/public
app.use(express.static(path.join(__dirname, 'website/public')));

// Route /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'website/public', 'index.html'));
});

app.listen(port, () => {
  console.log(`🌍 Site web en ligne : http://localhost:${port}`);
});
