const { MessageFlags } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Répond avec Pong!',
    message: 'Pong!',
    permissions: ['SEND_MESSAGES'],
    slashAvailable: true,
    async runSlash(client, interaction) {
        await interaction.reply({ content: this.message, flags: MessageFlags.Ephemeral }); // Utilise un objet pour la réponse
    },
};