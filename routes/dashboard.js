const express = require('express');
const router = express.Router();
const path = require('path');
const client = require('../bot/index.js'); // Import du client Discord

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

router.get('/guilds/:guildId/roles', async (req, res) => {

  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  const guildId = req.params.guildId;

  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    return res.status(404).json({ error: 'Guild not found' });
  }

  const userGuild = req.session.guilds?.find(g => g.id === guildId);
  if (!userGuild) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const roles = guild.roles.cache
    .filter(role => role.name !== '@everyone')
    .map(role => ({
      id: role.id,
      name: role.name,
      managed: role.managed
    }));

  res.json(roles);
});

router.get('/guilds/:guildId/salons', async (req, res) => {

  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  const guildId = req.params.guildId;

  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    return res.status(404).json({ error: 'Guild not found' });
  }

  const userGuild = req.session.guilds?.find(g => g.id === guildId);
  if (!userGuild) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const salons = guild.channels.cache
    .filter(channel => channel.type !== 4) // Exclut les catégories, optionnel
    .map(channel => ({
      id: channel.id,
      name: channel.name,
      type: channel.type
    }));

  res.json(Array.from(salons.values()));
});

router.post('/save', async (req, res) => {
  if (!req.session.user) {
    console.log('[SAVE] Requête refusée : utilisateur non connecté');
    return res.status(401).json({ error: 'Not logged in' });
  }

  const { guildId, welcomeMessage, welcomeImage, welcomeChannel, welcomeRoles } = req.body;
  if (!guildId) {
    console.log('[SAVE] guildId manquant dans la requête');
    return res.status(400).json({ error: 'guildId manquant' });
  }

  try {
    // 1. Vérifie si une config existe déjà pour cette guild
    const [rows] = await client.connection.promise().query(
      'SELECT idGuildMemberAdd FROM guildMemberAdd WHERE idGuild = ?',
      [guildId]
    );
    console.log(`[SAVE] Recherche config existante pour guildId=${guildId} : ${rows.length} trouvée(s)`);

    let idGuildMemberAdd;
    if (rows.length > 0) {
      // Mise à jour
      idGuildMemberAdd = rows[0].idGuildMemberAdd;
      await client.connection.promise().query(
        'UPDATE guildMemberAdd SET message = ?, imageURL = ?, idChannel = ? WHERE idGuildMemberAdd = ?',
        [welcomeMessage, welcomeImage, welcomeChannel, idGuildMemberAdd]
      );
      console.log(`[SAVE] Mise à jour de guildMemberAdd id=${idGuildMemberAdd} pour guildId=${guildId}`);
    } else {
      // Insertion
      const [result] = await client.connection.promise().query(
        'INSERT INTO guildMemberAdd (message, imageURL, idChannel, idGuild) VALUES (?, ?, ?, ?)',
        [welcomeMessage, welcomeImage, welcomeChannel, guildId]
      );
      idGuildMemberAdd = result.insertId;
      console.log(`[SAVE] Insertion de guildMemberAdd id=${idGuildMemberAdd} pour guildId=${guildId}`);
    }

    // 2. Supprime les anciens rôles pour cette config
    await client.connection.promise().query(
      'DELETE FROM roleGuildMemberAdd WHERE idGuildMemberAdd = ?',
      [idGuildMemberAdd]
    );
    console.log(`[SAVE] Suppression des anciens rôles pour idGuildMemberAdd=${idGuildMemberAdd}`);

    // 3. Insère les nouveaux rôles
    if (Array.isArray(welcomeRoles)) {
      for (const role of welcomeRoles) {
        await client.connection.promise().query(
          'INSERT INTO roleGuildMemberAdd (idRole, idGuildMemberAdd) VALUES (?, ?)',
          [role.id, idGuildMemberAdd]
        );
        console.log(`[SAVE] Ajout du rôle idRole=${role.id} pour idGuildMemberAdd=${idGuildMemberAdd}`);
      }
    }

    res.json({ success: true });
    console.log(`[SAVE] Configuration sauvegardée avec succès pour guildId=${guildId}`);
  } catch (err) {
    console.error('[SAVE] Erreur MySQL :', err);
    res.status(500).json({ error: 'Erreur MySQL' });
  }
});


// Page de config du serveur choisi
router.get('/:guildId', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, '../website/public/pages/config.html'));
});


module.exports = router;
