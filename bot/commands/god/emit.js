const { MessageFlags } = require('discord.js');

module.exports = {
    name: 'emit',
    description: 'Emettre un événement au choix!',
    permissions: ['ADMINISTRATOR'],
    category: 'god',
    slashAvailable: true,
    run(client, message, args) {
        if(message.author.id != process.env.OWNER_ID) return;

        if (!args[0] || !args[0].match(/^(guildMemberAdd|guildMemberRemove|guildCreate)$/)) return message.reply('Merci d\'entrer un événement valide (\ guildMemberAdd\`/\`guildMemberRemove\`/\`guildCreate)');
        if (args[0] == 'guildMemberAdd') {
            client.emit('guildMemberAdd', message.member);
            message.reply('Event guildMemberAdd émit!');
        } else if (args[0] == "guildCreate"){
            client.emit('guildCreate', message.guild);
            message.reply('Event guildCreate émit!');
        } else {
            client.emit('guildMemberRemove', message.member);
            message.reply( 'Event guildMemberRemove émit!');
        }
    },
    options: [
        {
            name: 'event',
            description: 'Choisir un événement à emettre',
            type: 3,
            required: true,
            choices: [
                {

                    name: 'guildMemberAdd',
                    value: 'guildMemberAdd',
                },
                {
                    name: 'guildMemberRemove',
                    value: 'guildMemberRemove',
                    
                },
                {
                    name: 'guildCreate',
                    value: 'guildCreate',
                    
                }
            ],
        }
    ],
    runSlash (client, interaction) {
        if(interaction.member.id != process.env.OWNER_ID) return;

        const evtChoices = interaction.options.getString('event');
        if (evtChoices == 'guildMemberAdd') {
            client.emit('guildMemberAdd', interaction.member);
            interaction.reply({ content: 'Event guildMemberAdd émit!', ephemeral: MessageFlags.Ephemeral  });
        } else if (evtChoices == "guildCreate"){
            client.emit('guildCreate', interaction.guild);
            interaction.reply({ content: 'Event guildCreate émit!', ephemeral: MessageFlags.Ephemeral  });
        }
    }
}