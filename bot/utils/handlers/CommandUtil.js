const fs = require('fs');
const path = require('path');
var clc = require("cli-color");

module.exports = async client => {
    const commandsPath = path.join(process.cwd(), 'bot/commands');
    const files = getAllFiles(commandsPath, '.js'); // Récupère tous les fichiers .js dans le dossier commands
    console.log(clc.yellow(`Fichiers détectés : ${files.length}`));

    files.forEach(async cmdFile =>{
        try {
            const cmd = require(cmdFile);

            if (!cmd.name || !cmd.description) {
                return console.log(clc.red(`-----\nCommande non chargée: pas de nom et/ou description \nFichier -> ${cmdFile}\n-----`));
            }
            if (!cmd.permissions) {
                return console.log(clc.red(`-----\nCommande non chargée: pas de permission\n Fichier -> ${cmdFile}\n-----`));
            }

            cmd.permissions.forEach(permissions => {
                if (!permissionList.includes(permissions)) {
                    return console.log(clc.red(`-----\nCommande non chargée: erreur de typo sur la permission '${permissions}'\n Fichier -> ${cmdFile}\n-----`));
                }
            });

            if (cmd.slashAvailable) client.slashCommands.set(cmd.name, cmd);
            client.commands.set(cmd.name, cmd);
            let command = await client.getCommandName(cmd.name);
            if(command.length == 0 && cmd.category != "god") await client.addCommand(cmd);

            console.log(clc.green(`Commande chargée: ${cmd.name}`));
        } catch (error) {
            console.error(clc.red(`Erreur lors du chargement du fichier ${cmdFile}:`), error);
        }
    });
};

// Fonction pour récupérer tous les fichiers dans un dossier et ses sous-dossiers
function getAllFiles(dirPath, extension) {
    let files = [];
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        if (item.isDirectory()) {
            files = files.concat(getAllFiles(fullPath, extension));
        } else if (item.isFile() && fullPath.endsWith(extension)) {
            files.push(fullPath);
        }
    }

    return files;
}

const permissionList = ['CREATE_INSTANT_INVITE', 'KICK_MEMBERS', 'BAN_MEMBERS', 'ADMINISTRATOR', 'MANAGE_CHANNELS',
'MANAGE_GUILD', 'ADD_REACTIONS', 'VIEW_AUDIT_LOG', 'PRIORITY_SPEAKER', 'STREAM', 'VIEW_CHANNEL', 'SEND_MESSAGES',
'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE',
'USE_EXTERNAL_EMOJIS', 'VIEW_GUILD_INSIGHTS', 'CONNECT', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD',
'CHANGE_NICKNAME', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS_AND_STICKERS',
'USE_APPLICATION_COMMANDS', 'REQUEST_TO_SPEAK', 'MANAGE_EVENTS', 'MANAGE_THREADS', 'USE_PUBLIC_THREADS', 'CREATE_PUBLIC_THREADS',
'USE_PRIVATE_THREADS', 'CREATE_PRIVATE_THREADS', 'USE_EXTERNAL_STICKERS', 'SEND_MESSAGES_IN_THREADS',
'START_EMBEDDED_ACTIVITIES', 'MODERATE_MEMBERS'];