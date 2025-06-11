const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: 'user',
	description: 'Affiche des informations sur l\'utilisateur qui a exécuté la commande.',
    permissions: ['SEND_MESSAGES'],
	async runSlash(client, interaction) {
		await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
	},
};