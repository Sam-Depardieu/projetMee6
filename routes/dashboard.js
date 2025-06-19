const express = require('express');
const router = express.Router();
const path = require('path');

// Page de sélection de serveur
router.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, '../website/public/pages/dashboard.html'));
});

router.get('/user', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not logged in' });
  res.json(req.session.user);
});

router.get('/guilds', (req, res) => {
  if (!req.session.guilds) return res.status(401).json({ error: 'Not logged in' });
  res.json(req.session.guilds);
});

// Page de config du serveur choisi
router.get('/:guildId', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, '../website/public/pages/config.html'));
});

module.exports = router;
