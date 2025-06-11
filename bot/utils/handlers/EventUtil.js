const fs = require('fs');
const path = require('path');
var clc = require("cli-color");

module.exports = async client => {
    const eventsPath = path.join(process.cwd(), 'bot/events');
    const files = getAllFiles(eventsPath, '.js'); // Récupère tous les fichiers .js dans le dossier events et ses sous-dossiers
    console.log(clc.yellow(`Fichiers d'événements détectés : ${files.length}`));

    files.forEach(eventFile => {
        try {
            const event = require(eventFile);

            if (!eventList.includes(event.name) || !event.name) {
                return console.log(clc.red(`-----\nÉvénement non chargé : erreur de typo (ou pas de nom)\nFichier -> ${eventFile}\n-----`));
            }

            if (event.once) {
                client.once(event.name, (...args) => event.execute(client, ...args));
            } else {
                client.on(event.name, (...args) => event.execute(client, ...args));
            }

            console.log(clc.green(`Événement chargé : ${event.name}`));
        } catch (error) {
            console.error(clc.red(`Erreur lors du chargement du fichier d'événement ${eventFile}:`), error);
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
            files = files.concat(getAllFiles(fullPath, extension)); // Parcours récursif des sous-dossiers
        } else if (item.isFile() && fullPath.endsWith(extension)) {
            files.push(fullPath); // Ajoute les fichiers avec l'extension spécifiée
        }
    }

    return files;
}

const eventList = ['apiRequest', 'apiResponse', 'applicationCommandCreate', 'applicationCommandDelete', 'applicationCommandUpdate', 'channelCreate', 'channelDelete', 'channelPinsUpdate', 'channelUpdate', 'debug', 'emojiCreate', 'emojiDelete', 'emojiUpdate', 'error', 'guildBanAdd', 'guildBanRemove', 'guildCreate', 'guildDelete', 'guildIntegrationsUpdate', 'guildMemberAdd', 'guildMemberAvailable', 'guildMemberRemove', 'guildMembersChunk', 'guildMemberUpdate', 'guildScheduledEventCreate', 'guildScheduledEventDelete', 'guildScheduledEventUpdate', 'guildScheduledEventUserAdd', 'guildScheduledEventUserRemove', 'guildUnavailable', 'guildUpdate', 'interaction', 'interactionCreate', 'invalidated', 'invalidRequestWarning', 'inviteCreate', 'inviteDelete', 'message', 'messageCreate', 'messageDelete', 'messageDeleteBulk', 'messageReactionAdd', 'messageReactionRemove', 'messageReactionRemoveAll', 'messageReactionRemoveEmoji', 'messageUpdate', 'presenceUpdate', 'rateLimit', 'ready', 'roleCreate', 'roleDelete', 'roleUpdate', 'shardDisconnect', 'shardError', 'shardReady', 'shardReconnecting', 'shardResume', 'stageInstanceCreate', 'stageInstanceDelete', 'stageInstanceUpdate', 'stickerCreate', 'stickerDelete', 'stickerUpdate', 'threadCreate', 'threadDelete', 'threadListSync', 'threadMembersUpdate', 'threadMemberUpdate', 'threadUpdate', 'typingStart', 'userUpdate', 'voiceStateUpdate', 'warn', 'webhookUpdate', 'userCreate'];