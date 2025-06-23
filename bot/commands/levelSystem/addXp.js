const { MessageFlags } = require('discord.js');

module.exports = {
    name: 'addxp',
    description: 'Ajoute de l\'expérience à un utilisateur',
    category: 'levelSystem',
    permissions: ['ADMINISTRATOR'],
    slashAvailable: true,
    options: [
        {
            name: 'membre',
            description: 'Mentionnez ou indiquez le pseudo d\'une personne, aucun si vous voulez connaître votre niveau.',
            type: 6, // USER
            required: true
        },
        {
            name: 'xp',
            description: 'Le nombre d\'expérience à ajouter.',
            type: 4, // INTEGER
            required: true
        }
    ],
    async runSlash(client, interaction) {
        const guildLevelSystem = await client.getGuildLevelSystem(interaction.guild);
        if (!guildLevelSystem || guildLevelSystem.length === 0) {
            return interaction.reply({
                content: 'Le système de niveau n\'est pas activé sur ce serveur.',
                ephemeral: MessageFlags.Ephemeral
            });
        }
        
        const user = interaction.options.getUser("membre");
        const xpToAdd = interaction.options.getInteger("xp");

        let memberSettings = await client.getGuildUser(user);
        let guildSettings = await client.getGuild(interaction.guild);
        let difficulty = guildLevelSystem.length > 0 ? guildLevelSystem[0].difficulty : 1;
        let base = 50;
        let courbe = 1.2;

        await client.updateXp(user, xpToAdd, interaction.guild);

        return interaction.reply({
            content: `Ajout de ${xpToAdd} XP à ${user.username} (${user.id}) :white_check_mark:`,
            ephemeral: MessageFlags.Ephemeral
        });
    }
}