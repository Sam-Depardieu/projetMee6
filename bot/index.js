const mysql = require('mysql2');
if (!process.env.TOKEN) require('dotenv').config();
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
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
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