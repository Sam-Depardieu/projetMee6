module.exports = {
    name: 'guildDelete',
    once: false,
    async execute(client, guild) {
        console.log(`Le bot a quitté un serveur : ${guild.name} (ID : ${guild.id})`);
        
        let guildData = await client.getGuild(guild);
        if (guildData.length > 0) return;
        client.removeGuild(guild);
    },
};