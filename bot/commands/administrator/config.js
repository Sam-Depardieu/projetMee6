module.exports = {
    name: 'config',
    description: 'Configurez au mieux le serveur!',
    permissions: ['ADMINISTRATOR'],
    category: 'administration',
    slashAvailable: true,
    options: [
        {
            name: 'systeme',
            description: 'Configurer les systèmes du bot sur le serveur.',
            type: 1, // SUB_COMMAND
            options: [
                {
                    name: 'type',
                    description: 'Type de systèmes',
                    type: 3, // STRING
                    required: true,
                    choices: [
                        { name: 'Logs', value: 'logsSystem' },
                        { name: 'Niveaux', value: 'xpSystem' }
                    ]
                },
                {
                    name: 'activer',
                    description: 'Activer ou désactiver le système',
                    type: 5, // BOOLEAN
                    required: true
                }
            ]
        },
        {
            name: 'logs',
            description: 'Configurer les logs du serveur.',
            type: 1, // SUB_COMMAND
            options: [
                {
                    name: 'type',
                    description: 'Type de logs',
                    type: 3, // STRING
                    required: true,
                    choices: [
                        { name: 'Messages', value: 'messages' },
                        { name: 'Arrivée Membre', value: 'memberAdd' },
                        { name: 'Départ Membre', value: 'memberRemove' },
                        { name: 'Sanctions', value: 'sanctions' },
                        { name: 'Autres', value: 'general' }
                    ]
                },
                {
                    name: 'salon',
                    description: 'Salon où envoyer les logs',
                    type: 7, // CHANNEL
                    channel_types: [0], // 0 = GUILD_TEXT
                    required: true
                }
            ]
        },
        {
            name: 'recompense',
            description: 'Configurer une récompense de niveau.',
            type: 1, // SUB_COMMAND
            options: [
                {
                    name: 'niveau',
                    description: 'Niveau requis',
                    type: 4, // INTEGER
                    required: true
                },
                {
                    name: 'role',
                    description: 'Rôle à attribuer',
                    type: 8, // ROLE
                    required: true
                },
                {
                    name: 'message',
                    description: 'Message personnalisé (optionnel)',
                    type: 3, // STRING
                    required: false
                }
            ]
        },
        {
            name: 'prefix',
            description: 'Configurer le prefix du bot sur votre serveur.',
            type: 1, // SUB_COMMAND
            options: [
                {
                    name: 'prefix',
                    description: 'Nouveau prefix',
                    type: 3, // STRING
                    required: true
                }
            ]
        }
    ],
    async runSlash(client, interaction) {
        if (interaction.options.getSubcommand() === 'logs') {
            const type = interaction.options.getString('type');
            const salon = interaction.options.getChannel('salon');

            let logsGuild = await client.getLogsGuild(interaction.guild);
            if (!logsGuild || logsGuild.length === 0) {
                await client.createLogsGuild(interaction.guild);
            }
            await client.updateLogsGuild(interaction.guild, type, salon.id);

            await interaction.reply(`Logs de type **${type}** configurés pour le salon ${salon}.`);
        } else if (interaction.options.getSubcommand() === 'recompense') {
            const niveau = interaction.options.getInteger('niveau');
            const role = interaction.options.getRole('role');
            const message = interaction.options.getString('message') || '';

            let levelRewards = await client.getLevelRewards(interaction.guild);
            if (!levelRewards || levelRewards.length === 0) {
                await client.createLevelRewards(interaction.guild, niveau, role, message);
            }
            else await client.updateLevelRewards(interaction.guild, niveau, role, message);

            await interaction.reply(`Récompense configurée : niveau **${niveau}**, rôle ${role}, message : ${message}`);
        } else if (interaction.options.getSubcommand() === 'systeme') {
            const type = interaction.options.getString('type');
            const activer = interaction.options.getBoolean('activer');
            
            if (type === 'logsSystem' || type === 'xpSystem') {
                await client.updateGuild(interaction.guild, type, activer);
                await interaction.reply(`Système ${type} ${activer ? 'activé' : 'désactivé'} pour ce serveur.`);
            } 
            else {
                await interaction.reply('Type de système invalide.');
            }
        } else if (interaction.options.getSubcommand() === 'prefix') {
            const prefix = interaction.options.getString('prefix');
            
            if (prefix.length > 5) {
                return interaction.reply({ content: 'Le prefix ne peut pas dépasser 10 caractères.', ephemeral: true });
            }
            else
            {
                await client.updateGuild(interaction.guild, 'prefix', prefix);
                await interaction.reply(`Prefix du serveur mis à jour : \`${prefix}\``);
            }
        }
    },
};