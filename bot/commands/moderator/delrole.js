module.exports = {
    name: 'del-role',
    description: 'Commande pour enlever un rôle',
    permissions: ['MANAGE_ROLES'],
    async run(client, message, args){
        if (!args[1]) { return message.channel.send('Vous n\'avez pas la spécifié un nom de role !'); }

        let member = message.mentions.members.first();
        let role = message.mentions.roles.first()

        if (!role) { return message.channel.send('Ce role n\'existe pas !'); }
        if (!member.roles.cache.has(role.id)) { return message.channel.send('Vous n\'avez pas ce role !'); }
        
        member.roles.remove(role.id)
            .then(() => message.channel.send('Vous n\'avez désormais plus le role ' + role.toString()))
            .catch(console.error);
    }
};