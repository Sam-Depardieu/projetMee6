module.exports = {
    name: 'ready',
    once: 'true',
    async execute(client) {
        console.log('Bot on!');

        const guildArray = await client.getGuilds();

        for (const guild of guildArray) {
            const cmds = await client.guilds.cache.get(guild.id);
            if (!cmds) {
                console.log(`Guild ${guild.name} not found in cache.`);
                continue;
            }
            else cmds.commands.set(client.slashCommands.map(cmd => cmd));
        }

        //client.application.commands.set(client.slashCommands.map(cmd => cmd))                       // global
        
    }
}
