module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(client, interaction) {
        if (interaction.isCommand()) {
            const cmd = client.slashCommands.get(interaction.commandName);
            if (!cmd) return interaction.reply('Cette commande n\'existe pas!');

            if (!interaction.member.permissions.has([cmd.permissions])) 
                return interaction.reply({ 
                    content: `Vous n'avez pas la/les permission(s) requise(s) (\`${cmd.permissions.join(', ')}\`) pour taper cette commande!`, 
                    ephemeral: true 
                });

            if (cmd.slashAvailable === false)
                return interaction.reply({ 
                    content: 'Cette commande n\'est pas disponible en slash command!', 
                    ephemeral: true 
                });

            // Remplacement de runSlash par execute
            cmd.runSlash(client, interaction);
        }
    },
}