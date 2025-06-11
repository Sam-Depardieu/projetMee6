module.exports = {
    name: 'ready',
    once: 'true',
    async execute(client) {
        console.log('Bot on!');

        const ldg = await client.guilds.cache.get('1361742010117259447');       //test bot
        ldg.commands.set(client.slashCommands.map(cmd => cmd));

        //client.application.commands.set(client.slashCommands.map(cmd => cmd))                       // global
        
    }
}
