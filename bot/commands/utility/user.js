const { MessageFlags } = require('discord.js');

module.exports = {
	name: 'user',
	description: 'Affiche des informations sur l\'utilisateur qui a exécuté la commande.',
    permissions: ['SEND_MESSAGES'],
    category: 'utility',
	message: `This command was run by {user.username}, who joined on {member.joinedAt}.`,
	slashAvailable: true,
	async runSlash(client, interaction) {
		await interaction.reply({
		content: this.message
			.replace('{user.username}', interaction.user.username)
			.replace('{member.joinedAt}', interaction.member.joinedAt.toDateString()),
		ephemeral: MessageFlags.Ephemeral, // Makes the response visible only to the user who invoked the command
		});
	},
};