const { MessageEmbed } = require("discord.js");
const fs = require('fs');
const sql = require('mysql2');

module.exports = client => {
    client.getUser = user => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'SELECT * FROM guildUsers WHERE idUser = ?',
                [user.id],
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    };

    client.addUser = (message, user) => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'INSERT INTO users (idUser, username) VALUES (?, ?)',
                [user.id, user.username], // Assurez-vous que l'ID de la guilde est en string
                (err, results) => {
                    if (err) return reject(err);
                    console.log(`Utilisateur ${user.username}(${user.id}) ajouté à la base de donnée.`);
                    // Déplacez la logique asynchrone ici
                    client.getGuildUser(message, user)
                        .then(guildUsers => {
                            if (guildUsers.length === 0) {
                                client.addGuildUser(message, user).catch(console.error);
                            }
                            resolve(results);
                        })
                        .catch(reject);
                }
            );
        });
    };

    client.addGuildUser = (message, user) => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'INSERT INTO guildUsers (idUser, lastMessageId, idGuild) VALUES (?, ?, ?)',
                [user.id, message.id, String(message.guild.id)], // Assurez-vous que l'ID de la guilde est en string
                (err, results) => {
                    if (err) return reject(err);
                    console.log(`Utilisateur guild ${user.username}(${user.id}) ajouté à la base de donnée.`);
                    resolve(results);
                }
            );
        });
    };

    client.updateUser = async (user, guild, settings) => {
        try {
            // Construction dynamique de la requête SQL
            const fields = Object.keys(settings);
            if (fields.length === 0) return;

            const values = fields.map(key => settings[key]);
            const setClause = fields.map(key => `\`${key}\` = ?`).join(', ');

            const sql = `UPDATE guildUsers SET ${setClause} WHERE idUser = ? AND idGuild = ?`;
            values.push(String(user.id));
            values.push(String(guild.id)); // Assurez-vous que l'ID de la guilde est en string

            return new Promise((resolve, reject) => {
                client.connection.query(
                    sql,
                    values,
                    (err, results) => {
                        if (err) {
                            console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
                            return reject(err);
                        }
                        console.log(`Utilisateur ${user.username} mis à jour dans la base de donnée.`);
                        resolve(results);
                    }
                );
            });
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
            throw error;
        }
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

    client.getGuildLevelSystem = guild => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'SELECT * FROM guildLevelSystem WHERE idGuild = ?',
                [String(guild.id)], // ID en string
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    }

    client.createGuildLevelSystem = guild => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'INSERT INTO guildLevelSystem (idGuild, xpWinMin, xpWinMax, difficulty, cooldown, boost, minimumSize, background) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [String(guild.id), 10, 20, 1, 60, 1, 10, 'default'], // ID en string
                (err, results) => {
                    if (err) return reject(err);
                    console.log(`Système de niveau créé pour la guild ${guild.name} dans la base de donnée.`);
                    resolve(results);
                }
            );
        });
    }

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

    client.getGuildLevelRewards = guild => {
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

    client.getLevelRewards = (guild, level) => {
        return new Promise((resolve, reject) => {
            client.connection.query(
                'SELECT * FROM guildLevelRewards WHERE idGuild = ? AND level = ?',
                [String(guild.id), level], // ID en string
                (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                }
            );
        });
    }

    client.updateXp = async (message, xp, difficulty, guild) => {
        const user = message.author
        let memberSettings = await client.getUser(user);
        let guildSettings = await client.getGuild(guild);
        let guildLevelSettings = await client.getGuildLevelSystem(guild);

        let xpFinal = xp * (memberSettings.boost || 1) * (guildSettings.boost || 1);
        let xpNow = (memberSettings.exp || 0) + xpFinal;
        let xpTotal = memberSettings.expTotal || 0;

        let nextLevel = memberSettings.nextExpReq || 100;
        let level = memberSettings.lvl || 1;
        let levelsGained = 0;

        // Formule lissée : XP requis = base * (level^courbe) * difficulté
        // base = 50, courbe = 1.2 (ajuste à ta convenance)
        const base = 50;
        const courbe = 1.2;

        while (xpNow >= nextLevel) {
            level++;
            levelsGained++;
            xpNow -= nextLevel;
            nextLevel = Math.floor(base * Math.pow(level, courbe) * difficulty);
            xpTotal += nextLevel;
        }

        xpTotal += xpNow;

        // Mise à jour des données de l'utilisateur
        await client.updateUser(user, {
            lvl: level,
            exp: xpNow,
            expTotal: xpTotal,
            nextExpReq: nextLevel,
            expTotalToday: (memberSettings.expTotalToday || 0) + xp
        });

        memberSettings = await client.getUser(user);

        if(guildLevelSettings.length > 0) {
            let xpLevel = await client.getLevelRewards(guild, level);
            if(xpLevel.length > 0) {
                const role = guild.roles.cache.get(xpLevel[0].roleId);
                if (role && !memberSettings.roles.includes(role.id)) {
                    if(guildLevelSettings[0].roleUnique === true || guildLevelSettings[0].roleUnique === 1) {
                        const roles = await client.getGuildLevelRewards(guild);
                        for (const r of roles) {
                            const existingRole = guild.roles.cache.get(r.roleId);
                            if (existingRole && memberSettings.roles.includes(existingRole.id)) {
                                const member = guild.members.cache.get(user.id);
                                if (member) {
                                    await member.roles.remove(existingRole);
                                }
                            }
                        }
                    }
                    else await member.roles.add(role);
                    let embed = new MessageEmbed().setColor('#00FF00')
                    let message = `Félicitations ${user.username}, vous avez atteint le niveau ${level} et avez reçu le rôle ${role.name} !`;
                    if( xpLevel[0].rewardMessage) {
                        message = await client.formatMessage(xpLevel[0].rewardMessage, { user, guild, level });
                    }
                    else if (guildLevelSettings.messageLevelUp) {
                        message = await client.formatMessage(guildLevelSettings.messageLevelUp, { user, guild, level });
                    }
                    embed.setDescription(message);
                    if (guildLevelSettings.channelId) {
                        guild.channels.cache.get(guildSettings.channelLvl)?.send({ embeds: [embed] });
                    }
                    else message.channel.send({ embeds: [embed] });
                }
            }
        }

        return [memberSettings, xpFinal];
    };

    client.calculateXp = (level, difficulty) => {
        // Formule lissée : XP requis = base * (level^courbe) * difficulté
        // base = 50, courbe = 1.2 (ajuste à ta convenance)
        const base = 50;
        const courbe = 1.2;
        return Math.floor(base * Math.pow(level, courbe) * difficulty);
    };

    client.getUserRanks = async (guild) => {
        const users = await client.getGuilds();
        const userRanks = [];
        for (const user of users) {
            const userData = await client.getUser(user.idUser);
            if (userData.length > 0 && userData[0].idGuild === String(guild.id)) {
                userRanks.push({
                    id: user.idUser,
                    username: user.username,
                    level: userData[0].lvl,
                    exp: userData[0].exp
                });
            }
        }
        return userRanks.sort((a, b) => b.level - a.level || b.exp - a.exp);
    };

    client.getUserRank = async (user, guild) => {
        const userData = await client.getUser(user);
        if (userData.length > 0 && userData[0].idGuild === String(guild.id)) {
            const userRank = {
                id: user.id,
                username: user.username,
                level: userData[0].lvl,
                exp: userData[0].exp
            };
            return userRank;
        }
        return null;
    }

    client.formatMessage = (template, context) => {
        return template.replace(/{([\w.]+)}/g, (match, key) => {
            const parts = key.split('.');
            let value = context;
            for (const part of parts) {
                if (value && Object.prototype.hasOwnProperty.call(value, part)) {
                    value = value[part];
                } else {
                    return match; // Laisse la variable intacte si non trouvée
                }
            }
            return value;
        });
    }

    client.saveImage = async (source, filename, folder = '../img') => {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        const filePath = path.join(folder, filename);

        let buffer;
        if (typeof source === 'string') {
            // Télécharge l'image depuis l'URL
            const response = await fetch(source);
            if (!response.ok) throw new Error('Erreur lors du téléchargement de l\'image');
            buffer = await response.buffer();
        } else if (Buffer.isBuffer(source)) {
            buffer = source;
        } else {
            throw new Error('Source invalide pour l\'image');
        }

        await fs.promises.writeFile(filePath, buffer);
        return filePath;
    };
}