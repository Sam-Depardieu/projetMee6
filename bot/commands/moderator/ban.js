const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'ban',
  description: 'Commande ban pour bannir les membre',
  permissions: ['ADMINISTRATOR'],
  async run(client, message, args){
    let user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
    let reason = (args.slice(1).join(' ') || 'Aucune raison spécifiée');

    try {
      // Tentative de bannissement de l'utilisateur de la guilde (serveur)
      await message.guild.members.ban(user, { reason });
    } catch (error) {
      // Si l'utilisateur n'est pas membre de la guilde, on tente de le bannir via l'API
      try {
          await client.users.ban(user, { reason });
      } catch (err) {
          console.error('Error banning user:', err);
          return message.channel.send("Une erreur s'est produite lors du bannissement de l'utilisateur.");
      }
    }

    const embed = new MessageEmbed()
      .setTitle(`${user.tag} (${user.id})`)
      .setColor("#dc143c")
      .setDescription(`**Action**: ban\n**Raison**: ${reason}`)
      .setTimestamp()
      .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() });

    if (client.getGuild(message.guild).logChannelID != '0') {
      client.channels.cache.get(client.getGuild(message.guild).logChannelID != undefined).send({ embeds: [embed] });
    }

    message.channel.send({ embeds: [embed] })
  }

};