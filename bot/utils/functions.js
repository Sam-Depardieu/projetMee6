const { MessageEmbed } = require("discord.js");
const fs = require('fs');
const sql = require('mysql2');

module.exports = client => {
    client.getUser = user => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'SELECT * FROM users WHERE idUser = ?',
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
                'INSERT INTO users (idUser, username) VALUES (?, ?)',
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

    client.getGuild = guild => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'SELECT * FROM guilds WHERE idGuild = ?',
                [guild.id],
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
                [String(guild.id), guild.name, guild.memberCount], // ID en string, PAS de Number()
                (err, results) => {
                    if (err) return reject(err);
                    console.log(`Guild ${guild.name} ajouté à la base de donnée.`);
                    resolve(results);
                }
            );
        }).then(() => {
            const cmds = client.guilds.cache.get(String(guild.id)); // ID en string
            if (cmds && cmds.commands) {
                cmds.commands.set(client.slashCommands.map(cmd => cmd));
            }
        }).catch(console.error);
    }

    client.updateGuild = (guild, parameter, value) => {
        if (!['nameGuild', 'memberCount', 'xpSystem', 'logsSystem', 'prefix'].includes(parameter)) {
            return Promise.reject(new Error('Paramètre de mise à jour invalide.'));
        }
        const sql = `UPDATE guilds SET \`${parameter}\` = ? WHERE idGuild = ?`;
        return new Promise((resolve, reject) => {
            client.connection.query(
                sql,
                [value, String(guild.id)],
                (err, results) => {
                    if (err) return reject(err);
                    console.log(`Guild ${guild.name} mis à jour dans la base de donnée.`);
                    resolve(results);
                }
            );
        });
    }

    client.createLogsGuild = guild => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'INSERT INTO guildLogs (idGuild) VALUES (?)',
                [String(guild.id)], // ID en string
                (err, results) => {
                    if (err) return reject(err);
                    console.log(`Logs pour la guild ${guild.name} créés dans la base de donnée.`);
                    resolve(results);
                }
            );
        });
    };

    client.getLogsGuild = guild => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'SELECT * FROM guildLogs WHERE idGuild = ?',
                [String(guild.id)], // ID en string
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    };

    client.updateLogsGuild = (guild, type, salonId) => {
        if (!['messages', 'memberAdd', 'memberRemove', 'sanctions', 'general'].includes(type)) {
            return Promise.reject(new Error('Type de logs invalide.'));
        }
        const sql = `UPDATE guildLogs SET \`${type}\` = ? WHERE idGuild = ?`;
        return new Promise((resolve, reject) => {
            client.connection.query(
                sql,
                [salonId, String(guild.id)],
                (err, results) => {
                    if (err) return reject(err);
                    console.log(`Guild ${guild.name} mis à jour dans la base de donnée.`);
                    resolve(results);
                }
            );
        });
    };

    client.createLevelRewards = (guild, level, role, message) => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'INSERT INTO guildLevelRewards (level, roleId, rewardMessage, idGuild) VALUES (?, ?, ?, ?)',
                [level, role.id, message, String(guild.id)], // ID en string
                (err, results) => {
                    if (err) return reject(err);
                    console.log(`Logs pour la guild ${guild.name} créés dans la base de donnée.`);
                    resolve(results);
                }
            );
        });
    };

    client.getLevelRewards = guild => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'SELECT * FROM guildLevelRewards WHERE idGuild = ?',
                [String(guild.id)], // ID en string
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    };

    client.updateLevelRewards = (guild, level, role, message) => {
        
        const sql = `UPDATE guildLevelRewards SET level = ?, roleId = ?, rewardMessage = ? WHERE idGuild = ?`;
        return new Promise((resolve, reject) => {
            client.connection.query(
                sql,
                [level, role.id, message, String(guild.id)],
                (err, results) => {
                    if (err) return reject(err);
                    console.log(`Guild ${guild.name} mis à jour dans la base de donnée.`);
                    resolve(results);
                }
            );
        });
    };

    client.addCommand = (command) => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'INSERT INTO commands (nameCommand, description, message, category, permissions) VALUES (?, ?, ?, ?, ?)',
                [command.name, command.description, command.message, command.category, JSON.stringify(command.permissions || [])],
                (err, results) => {
                    if (err) return reject(err);
                    console.log(`Commande ${command.name} ajoutée à la base de donnée.`);
                    resolve(results);
                }
            );
        });
    }

    client.getCommandName = (name) => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'SELECT * FROM commands WHERE nameCommand = ?',
                [name],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    }
}