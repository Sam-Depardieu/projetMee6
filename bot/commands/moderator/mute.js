const ms = require("ms");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'mute',
  description: 'Commande pour mute un membre',
  permissions: ['MANAGE_MESSAGES'],
  async run(client, message, args){
    let user = message.mentions.users.first()
    let muteRole = message.guild.roles.cache.find((r) => r.name === 'Muted');
    let muteTime = (args[1] || '60s');
    let muteRaison = (args[2] || '(Raison non donné)');

    if (!muteRole) {
      muteRole = await message.guild.roles.create({
        data: {
          name: 'Muted',
          color: '#000',
          permissions: []
        }
      });
    
      message.guild.channels.cache.forEach(async (channel, id) => {
        await channel.permissionOverwrites.create(muteRole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          CONNECT: false
        });
      });
    };
    await user.roles.add(muteRole.id)
    message.delete(message.author);
    message.channel.send(`${user.user.username} est muté pendant ${ms(muteTime)} ms, pour ${muteRaison}.`);

    setTimeout(() => {
      user.roles.remove(muteRole);
    }, ms(muteTime));

    const embed = new MessageEmbed()

      .setTitle(`${user.user.username} (${user.id})`, user.user.displayAvatarURL())
      .setColor("#287db5")
      .setDescription(`**Action**: mute\n**Temps**: ${ms(muteTime)}`)
      .setTimestamp()
      .setFooter({text:message.author.username, value:message.author.displayAvatarURL()});
      
    if(client.getGuild(message.guild).logChannelID != undefined) client.channels.cache.get(client.getGuild(message.guild).logChannelID).send(embed);
    message.channel.send({ embeds: [embed] })
  }
};