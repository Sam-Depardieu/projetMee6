module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(client, guild) {
        console.log(`Le bot a rejoint un nouveau serveur : ${guild.name} (ID : ${guild.id})`);
        
        let guildData = await client.getGuild(guild);
        if (guildData.length > 0) return;
        client.addGuild(guild);
    },
};