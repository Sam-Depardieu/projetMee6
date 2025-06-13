const { MessageEmbed } = require("discord.js");



module.exports = {
  name: 'unmute',
  description: 'Commande ban pour bannir les membre (no rire)',
  permissions: ['MANAGE_MESSAGES'],
  slashAvailable: false,
  async run(client, message, args){

    let user = message.guild.member.cache.find(message.mentions.users.first());
    let muteRole = message.guild.roles.cache.find(r => r.name === 'Muted');

    if (!user.roles.cache.has(muteRole.id)) return message.reply("L'utilisateur mentionné n'est pas muté!");

    user.roles.remove(muteRole);
    message.channel.send(`<@${user.id}> n'est plus muté!`);

    const embed = new MessageEmbed()

      .setTitle(`${user.user.username} (${user.id})`, user.user.displayAvatarURL())
      .setColor("#35f092")
      .setDescription(`**Action**: unmute`)
      .setTimestamp()
      .setFooter({text: message.author.username, value: message.author.displayAvatarURL()});


    if(client.getGuild(message.guild).logChannelID != undefined) client.channels.cache.get(client.getGuild(message.guild).logChannelID).send(embed)
    message.channel.send({ embeds: [embed] })
  }
};



module.exports.help ={
    name: "unmute"
}