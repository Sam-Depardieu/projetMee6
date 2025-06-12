const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const warns = require('./warns.json')

module.exports = {
    name: 'warn',
    description: 'Commande pour avertir un membre',
    permissions: ['MANAGE_MESSAGES'],
    async run(client, message, args){
        let member = message.mentions.members.first();
        if (!member) return message.channel.send("Veuillez mentionner un membre");
        let reason = args.slice(1).join(' ');
        if (!reason) return message.channel.send("Veuillez indiquer une raison");
        if (!warns[member.id]) {
            warns[member.id] = []
        }
        warns[member.id].unshift({
            reason: reason,
            date: Date.now(),
            mod: message.author.id
        });

        let user = message.mentions.users.first();

        const embed = new MessageEmbed()

            .setTitle(`${user.username} (${user.id})`, user.displayAvatarURL())
            .setColor("#287db5")
            .setDescription(`**Action**: warn\n**Raison**: ${reason}`)
            .setTimestamp()
            .setFooter({text: message.author.username, value: message.author.displayAvatarURL()});

        fs.writeFileSync('./Commandes/Moderation/warns.json', JSON.stringify(warns));
        if(client.getGuild(message.guild).logChannelID != undefined) client.channels.cache.get(client.getGuild(message.guild).logChannelID).send(embed);
        message.channel.send(member + " a été warn pour " + reason + " :white_check_mark:");
    }
}