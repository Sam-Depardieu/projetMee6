require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 80;

//require('./bot/index.js'); // Lance ton bot Discord

// Session (pour garder l'utilisateur connecté)
app.use(session({
  secret: 'secret-mee6-bot',
  resave: false,
  saveUninitialized: false
}));

// Sert les fichiers statiques HTML/CSS/JS
app.use(express.static(path.join(__dirname, 'website/public')));

// === Authentification OAuth2 Discord ===

app.get('/login', (req, res) => {
  const redirect = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=identify%20guilds`;
  res.redirect(redirect);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("Pas de code reçu.");

  try {
    // Obtenir le token d'accès
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      scope: 'identify guilds'
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { access_token } = tokenRes.data;

    // Récup info utilisateur
    const userRes = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    // Récup serveurs de l'utilisateur
    const guildsRes = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    // Sauvegarde en session
    req.session.user = userRes.data;
    req.session.guilds = guildsRes.data;

    res.redirect('/dashboard');
  } catch (err) {
    console.error('Erreur OAuth2 :', err.response?.data || err);
    res.send("Erreur lors de la connexion Discord.");
  }
});

app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  let guildsHtml = req.session.guilds.map(g => {
    // Affiche seulement les serveurs où l'utilisateur est admin
    if ((g.permissions & 0x20) !== 0x20) return ''; // Vérifie permission MANAGE_GUILD
    return `
      <li>
        ${g.name}
        <a href="https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=bot&guild_id=${g.id}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}">[Ajouter le bot]</a>
      </li>
    `;
  }).join('');

  res.send(`
    <h1>Bonjour, ${req.session.user.username}</h1>
    <h2>Vos serveurs où vous êtes admin :</h2>
    <ul>${guildsHtml}</ul>
    <a href="/logout">Déconnexion</a>
  `);
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Page d'accueil
app.get('/', (req, res) => {
  res.send(`
    <h1>Bienvenue sur le site de ton bot</h1>
    <a href="/login">Se connecter avec Discord</a>
  `);
});

app.listen(port, () => {
  console.log(`✅ Serveur web sur http://localhost:${port}`);
});
