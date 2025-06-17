const expCooldown = new Set();
let prec = 0

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(client, message, guild) {

        if (message.author.bot) return;

        let userData = await client.getUser(message.author);
        if (!userData || userData.length === 0) {
            await client.addUser(message, message.author);
            userData = await client.getUser(message.author)
        }

        let guildData = await client.getGuild(message.guild);
        if (!guildData || guildData.length === 0) {
            await client.addGuild(message.guild);
            guildData = await client.getGuild(message.guild)
        }

        let prefix = guildData[0].prefix;
        
        const args = message.content.slice(prefix.length).trim().split(/ +/g);

        let user = message.mentions.users.first();
        if(user && message.content.trim() === `<@${client.user.id}>`){
            message.channel.send("Mon prefix sur ce serveur est -> \`\`"+ prefix+"\`\`");
        }
        
        const linkRegex = /(https?:\/\/[^\s]+)/g;
        const discordGifRegex = /https?:\/\/(tenor\.com|giphy\.com|media\.discordapp\.net|cdn\.discordapp\.com)/;
        if (linkRegex.test(message.content) && !discordGifRegex.test(message.content)) {
            await message.delete();
            return;
        }

        //système de niveau
        const levelSystem = await client.getGuildLevelSystem(message.guild);
        if( guildData[0].xpSystem && levelSystem.length > 0)
        {
            const miniSize = message.content.length >= levelSystem[0].minimumSize || 10;
            const xpMinWin = levelSystem[0].xpMinWin;
            const xpMaxWin = levelSystem[0].xpMaxWin;
            const difficulty = levelSystem[0].difficulty;
            const cooldown = levelSystem[0].cooldown;
            const boost = levelSystem[0].boost;
            const personalBoost = userData.boost || 1;

            if (!expCooldown.has(message.author.id) && userData && !message.content.startsWith(prefix) && miniSize && prec != message.author.id) {

                let xpToAdd = Math.floor(Math.random() * (xpMaxWin - xpMinWin + 1) + xpMinWin) * personalBoost * boost;

                expCooldown.add(message.author.id);

                setTimeout(() => {
                    expCooldown.delete(message.author.id)
                }, cooldown * 1000);
                prec = message.author.id;

                await client.updateXp(message, xpToAdd, difficulty, message.guild)
            };
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
