const mysql = require('mysql2');
const dotenv = require('dotenv');
var clc = require("cli-color");
const { red } = require('cli-color');

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

client.connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

client.connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        return;
    }
    console.log('Connecté à la base de données MySQL !');
});

client.commands = new Collection();
client.slashCommands = new Collection();

require('./utils/functions.js')(client);

console.log('Chargement des handlers...');
['CommandUtil', 'EventUtil'].forEach(handler => {
    console.log(`Chargement du handler : ${handler}`);
    require(`./utils/handlers/${handler}.js`)(client);
});


client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

process.on('exit', code => { console.log(clc.red(`Le processus s'est arrêté avec le code: ${code}!`)) });

process.on('uncaughtException', (err, origin) => { console.log(clc.red(`UNCAUGHT_EXCEPTION: ${err}`, `Origine: ${origin}`)) });

process.on('unhandledRejection', (reason, promise) =>  { console.log(clc.red(`UNHANDLED_REJECTION: ${reason}\n-----\n`, promise)) });

process.on('warning', (...args) => console.log(clc.red(...args)));

client.login(process.env.TOKEN);

module.exports = client;