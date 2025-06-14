CREATE TABLE users(
   idUser VARCHAR(50),
   username VARCHAR(50) NOT NULL,
   PRIMARY KEY(idUser)
);

CREATE TABLE guilds(
   idGuild VARCHAR(50),
   nameGuild VARCHAR(50) NOT NULL,
   memberCount INT NOT NULL,
   xpSystem BOOLEAN NOT NULL DEFAULT 0,
   logsSystem BOOLEAN NOT NULL DEFAULT 0,
   PRIMARY KEY(idGuild)
);

CREATE TABLE guildLevelRewards(
   idRewards INT AUTO_INCREMENT,
   level INT NOT NULL,
   roleId INT,
   rewardMessage VARCHAR(50),
   idGuild VARCHAR(50) NOT NULL,
   PRIMARY KEY(idRewards),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild)
);

CREATE TABLE guildLevelSystem(
   idLevelSystem INT AUTO_INCREMENT,
   roleUnique BOOLEAN NOT NULL DEFAULT 0,
   boost DECIMAL(4,1) DEFAULT 1.0,
   difficulty TINYINT NOT NULL DEFAULT 1,
   xpWinMin SMALLINT NOT NULL DEFAULT 5,
   xpWinMax SMALLINT NOT NULL DEFAULT 10,
   idGuild VARCHAR(50) NOT NULL,
   PRIMARY KEY(idLevelSystem),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild)
);

CREATE TABLE guildLogs(
   idLogs INT AUTO_INCREMENT,
   messageDelete VARCHAR(50) DEFAULT NULL,
   messageEdited VARCHAR(50) DEFAULT NULL,
   memberBan VARCHAR(50) DEFAULT NULL,
   memberUnban VARCHAR(50) DEFAULT NULL,
   memberAdd VARCHAR(50) DEFAULT NULL,
   memberRemove VARCHAR(50) DEFAULT NULL,
   sanctions VARCHAR(50) DEFAULT NULL,
   general VARCHAR(50) DEFAULT NULL,
   idGuild VARCHAR(50) NOT NULL,
   PRIMARY KEY(idLogs),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild)
);

CREATE TABLE guildUsers(
   idGuildUser INT AUTO_INCREMENT,
   xp INT NOT NULL  DEFAULT 0,
   level INT NOT NULL DEFAULT 0,
   messageCount INT NOT NULL DEFAULT 0,
   lastMessageId VARCHAR(50) NOT NULL,
   sanctions INT NOT NULL DEFAULT 0,
   idUser VARCHAR(50) NOT NULL,
   idGuild VARCHAR(50) NOT NULL,
   PRIMARY KEY(idGuildUser),
   FOREIGN KEY(idUser) REFERENCES users(idUser),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild)
);

CREATE TABLE xpDisabledChannels(
   idDisabled INT AUTO_INCREMENT,
   idChannel INT NOT NULL,
   idLevelSystem INT NOT NULL,
   PRIMARY KEY(idDisabled),
   FOREIGN KEY(idLevelSystem) REFERENCES guildLevelSystem(idLevelSystem)
);

CREATE TABLE logsDisabledChannels(
   idDisabled INT AUTO_INCREMENT,
   idChannel VARCHAR(50) NOT NULL,
   idLogs INT NOT NULL,
   PRIMARY KEY(idDisabled),
   FOREIGN KEY(idLogs) REFERENCES guildLogs(idLogs)
);

CREATE TABLE xpDisabledRoles(
   idDisabled INT AUTO_INCREMENT,
   idRole INT NOT NULL,
   idLevelSystem INT NOT NULL,
   PRIMARY KEY(idDisabled),
   FOREIGN KEY(idLevelSystem) REFERENCES guildLevelSystem(idLevelSystem)
);

CREATE TABLE xpDisabledMessages(
   idDisabled INT AUTO_INCREMENT,
   message VARCHAR(50) NOT NULL,
   idLevelSystem INT NOT NULL,
   PRIMARY KEY(idDisabled),
   FOREIGN KEY(idLevelSystem) REFERENCES guildLevelSystem(idLevelSystem)
);

CREATE TABLE guildCommands(
   idCommand INT AUTO_INCREMENT,
   nameCommand VARCHAR(50) NOT NULL,
   message TEXT NOT NULL,
   permissions VARCHAR(50),
   enabled BOOLEAN NOT NULL DEFAULT 1,
   specificRole BOOLEAN DEFAULT NULL,
   specificMember BOOLEAN DEFAULT NULL,
   specificChannel BOOLEAN DEFAULT NULL,
   idGuild VARCHAR(50) NOT NULL,
   PRIMARY KEY(idCommand),
   UNIQUE(nameCommand),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild)
);

CREATE TABLE roleEnabledCommand(
   idEnabledRole INT AUTO_INCREMENT,
   idRole VARCHAR(50) NOT NULL,
   idCommand INT NOT NULL,
   PRIMARY KEY(idEnabledRole),
   FOREIGN KEY(idCommand) REFERENCES guildCommands(idCommand)
);

CREATE TABLE memberEnabledCommand(
   idEnabledMember INT AUTO_INCREMENT,
   idMember VARCHAR(50) NOT NULL,
   idCommand INT NOT NULL,
   PRIMARY KEY(idEnabledMember),
   FOREIGN KEY(idCommand) REFERENCES guildCommands(idCommand)
);

CREATE TABLE channelEnabledCommand(
   idEnabledRole INT AUTO_INCREMENT,
   idChannel VARCHAR(50) NOT NULL,
   idCommand INT NOT NULL,
   PRIMARY KEY(idEnabledRole),
   FOREIGN KEY(idCommand) REFERENCES guildCommands(idCommand)
);

CREATE TABLE commands(
   idCommand INT AUTO_INCREMENT,
   nameCommand VARCHAR(50) NOT NULL,
   description TEXT NOT NULL,
   message TEXT NOT NULL,
   permissions VARCHAR(50),
   PRIMARY KEY(idCommand),
   UNIQUE(nameCommand)
);