const { MessageEmbed } = require("discord.js");
const fs = require('fs');
const { connect } = require("http2");
const sql = require('mysql2');

module.exports = client => {
    client.getUser = user => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'SELECT * FROM users WHERE id_user = ?',
                [user.id],
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
                'INSERT INTO users (id_user, username) VALUES (?, ?)',
                [user.id, user.username],
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

    client.addGuild = guild => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'INSERT INTO guilds (id, name, memberCount) VALUES (?, ?, ?)',
                [guild.id, guild.name, guild.memberCount],
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