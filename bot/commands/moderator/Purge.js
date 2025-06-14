const { MessageEmbed } = require("discord.js");


module.exports = {
  name: 'purge',
  description: 'Permet de clear des message!',
    category: 'moderation',
  permissions: ['MANAGE_MESSAGES'],
  slashAvailable: false,
  async run(client, message, args) {
    var amount = parseInt(args[0])

    if (!amount) return message.channel.send("Please specify the amount of messages you want me to delete")
    if (amount > 100 || amount < 1) return message.channel.send("Please select a number *between* 100 and 1")

    message.channel.bulkDelete(amount).catch(async err => {
      let msg = await message.channel.send(':x: Due to Discord Limitations, I cannot delete messages older than 14 days')
      setTimeout(() => {
        if(msg) msg.delete()
      }, 2000)
    })

    let msg = await message.channel.send(`Deleted \`${amount}\` messages`)
    setTimeout(() => {
        if(msg) msg.delete()
    }, 2000)
  },
}