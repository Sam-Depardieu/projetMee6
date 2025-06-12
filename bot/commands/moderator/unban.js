const { MessageEmbed } = require("discord.js");


module.exports = {
  name: 'unban',
  description: 'Commande ban pour bannir les membre (no rire)',
  permissions: ['ADMINISTRATOR'],
  async run(client, message, args){

    let user = await client.users.fetch(args[0]);
    if (!user) return message.reply("L'utilisateur n'existe pas.");

    message.guild.members.unban(user);

    const embed = new MessageEmbed()

      .setTitle(`${user.username} (${user.id})`, user.displayAvatarURL())
      .setColor("#35f092")
      .setDescription(`**Action**: unban`)
      .setTimestamp()
      .setFooter({text:message.author.username, value:message.author.displayAvatarURL()});

    if(client.getGuild(message.guild).logChannelID != undefined) client.channels.cache.get(client.getGuild(message.guild).logChannelID).send(embed)
    message.channel.send({ embeds: [embed] })
  }
};



module.exports.help ={
    name: "unban"
}