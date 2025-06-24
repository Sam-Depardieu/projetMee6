require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

require('./bot/index.js');
//const client = require('./bot'); // Import du client Discord

// Import des routes
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard');

// Session pour maintenir l'utilisateur connecté
app.use(session({
  secret: 'secret-mee6-bot',
  resave: false,
  saveUninitialized: false
}));

// Fichiers statiques HTML/CSS/JS
app.use(express.static(path.join(__dirname, 'website/public')));

// Utilisation des routes
app.use('/', authRoute);              // Routes: /login, /callback, /logout
app.use('/dashboard', dashboardRoute); // Routes: /dashboard

// Page d'accueil
app.get('/', (req, res) => {
  res.send(`
    <h1>Bienvenue sur le site de ton bot</h1>
    <a href="/login">Se connecter avec Discord</a>
  `);
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`✅ Serveur web lancé sur http://localhost:${port}`);
});
