module.exports = {
    name: 'leaderboard',
    description: 'Affiche le rang de l\'utilisateur',
    category: 'levelSystem',
    permissions: ['SEND_MESSAGES'],
    slashAvailable: true,
    async runSlash(client, interaction) {
        const guildLevelSystem = await client.getGuildLevelSystem(interaction.guild);
        if (!guildLevelSystem || guildLevelSystem.length === 0) {
            return interaction.reply({
                content: 'Le système de niveau n\'est pas activé sur ce serveur.',
                ephemeral: MessageFlags.Ephemeral
            });
        }
        try {
            const embed = await client.getClassement(interaction.author, interaction.guild)

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