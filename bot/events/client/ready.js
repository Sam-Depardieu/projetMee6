module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Bot on!');

        const guildArray = await client.getGuilds();

        for (const guild of guildArray) {
            const guildId = guild.idGuild; // Toujours string
            const cmds = client.guilds.cache.get(guildId);
            if (!cmds) {
                console.log(`Guild ${guild.nameGuild} (${guildId}) not found in cache.`);
                continue;
            }
            //await cmds.commands.set([]);
            //console.log(`Toutes les commandes supprimées pour la guild ${guild.nameGuild} (${guildId})`);

            cmds.commands.set(client.slashCommands.map(cmd => cmd));
        }

        //client.application.commands.set(client.slashCommands.map(cmd => cmd))                       // global
        
    }
}
