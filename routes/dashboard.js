const express = require('express');
const router = express.Router();
const path = require('path');
const client = require('../bot'); // Import du client Discord

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

  // Liste des IDs des serveurs où le bot est présent
  const botGuildIds = client.guilds.cache.map(guild => guild.id);

  // Ajoute la propriété hasBot à chaque guild utilisateur
  const userGuilds = req.session.guilds.map(guild => ({
    ...guild,
    hasBot: botGuildIds.includes(guild.id)
  }));

  res.json(userGuilds);
});

// Page de config du serveur choisi
router.get('/:guildId', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, '../website/public/pages/config.html'));
});

module.exports = router;
