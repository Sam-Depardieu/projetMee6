const { AttachmentBuilder, MessageFlags } = require('discord.js');
const Canvacord = require('canvacord');
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

        const userCls = await client.getUserClassement(user, interaction.guild);
        const userData = await client.getGuildUser(user);

        const guildLevelSystem = await client.getGuildLevelSystem(interaction.guild);
        if (!guildLevelSystem || guildLevelSystem.length === 0) {
            return interaction.reply({
                content: 'Le système de niveau n\'est pas activé sur ce serveur.',
                ephemeral: MessageFlags.Ephemeral
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

            console.log(userData[0].xp, userData[0].nextXpReq, userData[0].level, userCls);


            const levelImage = new Canvacord.Rank()
                .setAvatar(avatar)
                .setCurrentXP(userData[0].xp) // Utilise l'expérience de l'utilisateur pour représenter le niveau
                .setRequiredXP(userData[0].nextXpReq)
                .setLevel(userData[0].level) // Utilise le niveau de l'utilisateur
                .setRank(userCls)
                .setProgressBar('#FFA500', 'COLOR')
                .setUsername(username)
                .setDiscriminator(userData[0].pseudo)
            
            
            const bgBuffer = fs.readFileSync(backgroundPath);
            levelImage.setBackground("IMAGE", bgBuffer);

            const rankCard = await levelImage.build();

            await interaction.editReply({ files : [new AttachmentBuilder(rankCard, { name: 'rank.png' })] });
            
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
                ephemeral: MessageFlags.Ephemeral
            });
        }
    }
};
