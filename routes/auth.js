// routes/auth.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route /login : redirige vers Discord
router.get('/login', (req, res) => {
  const redirect = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=identify%20guilds`;
  res.redirect(redirect);
});

// Route /callback : récupère le token et les infos utilisateur
router.get('/callback', async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  if (!code) return res.send("Pas de code reçu.");

  try {
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.REDIRECT_URI, // = https://mee7.bot.sa-it.fr/callback
      scope: 'identify guilds'
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const access_token = tokenRes.data.access_token;

    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const guildsRes = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    req.session.user = userRes.data;
    req.session.guilds = guildsRes.data;

    res.redirect(`/pages/oauth-success.html${state ? '?guildId=' + state : ''}`);
  } catch (err) {
    console.error('Erreur OAuth2 :', err.response?.data || err);
    res.send("Erreur lors de la connexion Discord.");
  }
});


// Route /logout : détruit la session
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
