const { AttachmentBuilder } = require('discord.js');
const { RankCardBuilder } = require('canvacord'); // Vérifie bien l'existence
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'rank',
    description: 'Affiche le rang de l\'utilisateur',
    message: 'Votre rang est : `{rank}`',
    category: 'levelSystem',
    permissions: ['SEND_MESSAGES'],
    slashAvailable: true,
    options: [
        {
            name: 'membre',
            description: 'Mentionnez ou indiquez le pseudo d\'une personne, aucun si vous voulez connaître votre niveau.',
            type: 6, // USER
            required: false
        }
    ],
    async runSlash(client, interaction) {
        const user = interaction.options.getUser("membre") || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);

        const userCls = await client.getUserRank(user, interaction.guild);
        const userData = await client.getUser(user);

        const guildLevelSystem = await client.getGuildLevelSystem(interaction.guild);
        if (!guildLevelSystem || guildLevelSystem.length === 0) {
            return interaction.reply({
                content: 'Le système de niveau n\'est pas activé sur ce serveur.',
                ephemeral: true
            });
        }

        // Gestion du chemin d'image
        const backgroundName = guildLevelSystem[0].background || 'default.png';
        let backgroundPath = path.resolve(process.cwd(), 'bot', 'img', backgroundName);
        if (!fs.existsSync(backgroundPath)) {
            backgroundPath = path.resolve(process.cwd(), 'bot', 'img', 'default.png');
        }

        try {
            await interaction.deferReply();

            const avatar = user.displayAvatarURL({ format: 'png' });
            const username = member ? (member.nickname || user.username) : user.username;

            // Création de la carte de niveau
            const canvasRank = await new RankCardBuilder({
                currentLvl: Number(userData.lvl) || 1,
                currentRank: Number(userCls?.rank) || 1,
                currentXP: Number(userData.exp) || 0,
                requiredXP: Number(userData.nextExpReq) || 100,
                backgroundImgURL: backgroundPath,
                avatar: avatar,
                nicknameText: { content: username, font: 'Nunito', color: '#0CA7FF' },
                userStatus: member?.presence?.status || 'online',
            }).build();

            const attachment = new AttachmentBuilder(canvasRank.toBuffer(), { name: 'rank.png' });

            await interaction.editReply({ files: [attachment] });

        } catch (err) {
            console.error("Erreur canvacord :", err);
            const guildSettings = await client.getGuild(interaction.guild);

            try {
                await interaction.user.send(
                    `Erreur lors de la génération de votre image de niveau. Essayez la commande \`${guildSettings.prefix}level\`.`
                );
            } catch (dmErr) {
                console.error("Impossible d'envoyer un message privé :", dmErr);
            }

            await interaction.editReply({
                content: 'Une erreur est survenue lors de la génération de votre carte de rang.',
                ephemeral: true
            });
        }
    }
};
