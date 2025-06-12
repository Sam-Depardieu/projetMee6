const { MessageEmbed } = require("discord.js");
const fs = require('fs');
const sql = require('mysql2');

module.exports = client => {
    client.getUser = user => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'SELECT * FROM users WHERE idUser = ?',
                [Number(user.id)],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    };

    client.addUser = user => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'INSERT INTO users (idUser, username) VALUES (?, ?)',
                [Number(user.id), user.username],
                (err, results) => {
                    if (err) return reject(err);
                    console.log(`Utilisateur ${user.username} ajouté à la base de donnée.`);
                    resolve(results);
                }
            );
        });
    };

    client.getGuilds = () => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'SELECT * FROM guilds',
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    };

    client.getGuild = guild => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'SELECT * FROM guilds WHERE idGuild = ?',
                [Number(guild.id)],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    };

    client.addGuild = guild => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'INSERT INTO guilds (idGuild, nameGuild, memberCount) VALUES (?, ?, ?)',
                [Number(guild.id), guild.name, Number(guild.memberCount)],
                (err, results) => {
                    if (err) return reject(err);
                    console.log(`Guild ${guild.name} ajouté à la base de donnée.`);
                    resolve(results);
                }
            );
        }).then(() => {
            const cmds = client.guilds.cache.get(guild.id);
            if (cmds && cmds.commands) {
                cmds.commands.set(client.slashCommands.map(cmd => cmd));
            }
        }).catch(console.error);
    }

}