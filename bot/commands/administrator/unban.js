const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'unban',
  description: 'Commande pour unban un utilisateur',
  message: '{user.tag} ({user.id}) a été débanni',
  permissions: ['ADMINISTRATOR'],
  slashAvailable: false,
  async run(client, message, args){

    let user = await client.users.fetch(args[0]);
    if (!user) return message.reply("L'utilisateur n'existe pas.");

    message.guild.members.unban(user);

    const banMsg = this.message
      .replace('{user.tag}', user.tag)
      .replace('{user.id}', user.id);

    if(client.getGuild(message.guild).logChannelID != undefined) client.channels.cache.get(client.getGuild(message.guild).logChannelID).send(embed)
    message.channel.send({ content: banMsg });
  }
};



module.exports.help ={
    name: "unban"
}