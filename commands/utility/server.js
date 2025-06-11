const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	name: 'server',
	description: 'Affiche des informations sur le serveur actuel.',
    permissions: ['SEND_MESSAGES'],
	async runSlash(client, interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
	},
};