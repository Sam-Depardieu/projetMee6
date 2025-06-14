const { SlashCommandBuilder } = require('discord.js');
const { message } = require('./ping');

module.exports = {
	name: 'server',
	description: 'Affiche des informations sur le serveur actuel.',
    permissions: ['SEND_MESSAGES'],
    category: 'utility',
	message: `This server is {guild.name} and has {guild.memberCount} members.`,
	slashAvailable: true,
	async runSlash(client, interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply({
			content: this.message
				.replace('{guild.name}', interaction.guild.name)
				.replace('{guild.memberCount}', interaction.guild.memberCount),
			ephemeral: true, // Makes the response visible only to the user who invoked the command
		});
	},
};