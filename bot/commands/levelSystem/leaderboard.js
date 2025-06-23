module.exports = {
    name: 'leaderboard',
    description: 'Affiche le rang de l\'utilisateur',
    message: 'Vous êtes actuellement {rank} dans le classement.',
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
        try {
            const embed = await client.getClassement(message.author, message.guild)

            await interaction.deferReply();
            if (!embed) {
                return interaction.editReply('Aucun classement trouvé pour ce serveur.');
            }
            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.error('Erreur lors de la génération du classement :', error);
            return interaction.editReply('Une erreur est survenue lors de la génération du classement.');
        }
    }
}