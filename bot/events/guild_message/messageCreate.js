require('dotenv').config();

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(client, message, guild) {

        if (message.author.bot) return;
        let prefix = process.env.PREFIX;
        
        const args = message.content.slice(prefix.length).trim().split(/ +/g);

        let user = message.mentions.users.first();
        if(user && message.content.trim() === `<@${client.user.id}>`){
            message.channel.send("Mon prefix sur ce serveur est -> \`\`"+ prefix+"\`\`");
        }
        
        const linkRegex = /(https?:\/\/[^\s]+)/g;
        const discordGifRegex = /https?:\/\/(tenor\.com|giphy\.com|media\.discordapp\.net|cdn\.discordapp\.com)/;
        if (linkRegex.test(message.content) && !discordGifRegex.test(message.content) && userSettings.level < 5) {
            await message.delete();
            return;
        }

        if (!message.content.startsWith(prefix)) return;

        const cmdName = args.shift().toLowerCase();
        if (cmdName.length == 0) return;

        let cmd = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));;
        if(!cmd) return;
        if (!message.member.permissions.has([cmd.permissions])) return message.reply(`Vous n'avez pas la/les permission(s) requise(s) (\`${cmd.permissions.join(', ')}\`) pour taper cette commande!`);

        if (cmd) cmd.run(client, message, args);
    },



};
