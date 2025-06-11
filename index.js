const mysql = require('mysql2');
require('dotenv').config();
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.MessageContent,
    ],
});

const connection = mysql.createConnection({
    host: '192.168.1.228',
    user: 'botuser',
    password: '76Quc_)eX@WZs8FQ',
    database: 'projetMee6',
    port: 3306
  });

connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        return;
    }
    console.log('Connecté à la base de données MySQL !');
});

/* Exemple de requête
connection.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    console.log('La solution est :', results);
});*/

client.commands = new Collection();
client.slashCommands = new Collection();

console.log('Chargement des handlers...');
['CommandUtil', 'EventUtil'].forEach(handler => {
    console.log(`Chargement du handler : ${handler}`);
    require(`./utils/handlers/${handler}.js`)(client);
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


client.login(process.env.TOKEN);