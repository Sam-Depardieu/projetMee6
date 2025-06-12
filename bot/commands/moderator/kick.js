const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'kick',
  description: 'Commande kick pour virer un membre.',
  permissions: ['MANAGE_ROLES'],
  async run(client, message, args){
    let user = message.mentions.users.first();

    let reason = (args.splice(1).join(' ') || 'Aucune raison spécifiée');

    user ? message.guild.member.cache.find(user).kick(reason) : message.channel.send("L'utilisateur n'existe pas.");

    const embed = new MessageEmbed()
      .setTitle(`${user.user.username} (${user.id})`)
      .setColor("#ffa500")
      .setDescription(`**Action**: kick\n**Raison**: ${reason}`)
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp()
      .setFooter({text: message.author.username, iconURL: message.author.displayAvatarURL()});
      
    if(client.getGuild(message.guild).logChannelID != undefined) client.channels.cache.get(client.getGuild(message.guild).logChannelID).send(embed)
    message.channel.send({ embeds: [embed] })
  }
};