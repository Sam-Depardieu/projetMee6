const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'ban',
  description: 'Commande ban pour bannir un utilisateur',
  message: '{user.tag} ({user.id}) a été banni pour : {reason}',
  permissions: ['ADMINISTRATOR'],
  slashAvailable: false,
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

    const banMsg = this.message
      .replace('{user.tag}', user.tag)
      .replace('{user.id}', user.id)
      .replace('{reason}', reason);

    if (client.getGuild(message.guild).logChannelID != '0') {
      client.channels.cache.get(client.getGuild(message.guild).logChannelID != undefined).send({ embeds: [embed] });
    }

    message.channel.send({ content: banMsg});
  }

};