module.exports = {
    name: 'guildCreate',
    once: false,
    execute(client, guild) {
        console.log(`Le bot a rejoint un nouveau serveur : ${guild.name} (ID : ${guild.id})`);
        
        // Exemple : Envoyer un message dans le premier canal textuel disponible
        const defaultChannel = guild.channels.cache.find(channel => 
            channel.type === 0 && channel.permissionsFor(guild.me).has('SEND_MESSAGES')
        );

        if (defaultChannel) {
            defaultChannel.send(`Merci de m'avoir ajouté à votre serveur, ${guild.name} !`);
        } else {
            console.log(`Aucun canal textuel disponible pour envoyer un message dans le serveur ${guild.name}.`);
        }
    },
};