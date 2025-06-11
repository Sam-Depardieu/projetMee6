module.exports = {
    name: 'guildCreate',
    once: false,
    execute(client, guild) {
        console.log(`Le bot a rejoint un nouveau serveur : ${guild.name} (ID : ${guild.id})`);
        
    },
};