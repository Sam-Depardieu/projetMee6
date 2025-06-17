CREATE TABLE users(
   idUser VARCHAR(50) ,
   username VARCHAR(50)  NOT NULL,
   PRIMARY KEY(idUser)
);

CREATE TABLE guilds(
   idGuild VARCHAR(50) ,
   nameGuild VARCHAR(50)  NOT NULL,
   prefix TINYINT NOT NULL,
   memberCount INT NOT NULL,
   xpSystem BOOLEAN,
   logsSystem BOOLEAN,
   autoModeration BOOLEAN,
   PRIMARY KEY(idGuild)
);

CREATE TABLE guildLevelRewards(
   idRewards INT,
   level INT NOT NULL,
   roleId INT,
   rewardMessage VARCHAR(50) ,
   idGuild VARCHAR(50)  NOT NULL,
   PRIMARY KEY(idRewards),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild)
);

CREATE TABLE guildLevelSystem(
   idLevelSystem INT,
   background TEXT,
   roleUnique BOOLEAN,
   boost DECIMAL(4,1)  ,
   difficulty TINYINT NOT NULL,
   cooldown INT,
   minimumSize TINYINT NOT NULL,
   message TEXT,
   xpWinMin SMALLINT NOT NULL,
   xpWinMax SMALLINT NOT NULL,
   idGuild VARCHAR(50)  NOT NULL,
   PRIMARY KEY(idLevelSystem),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild)
);

CREATE TABLE guildLogs(
   idLogs INT,
   messageDelete VARCHAR(50) ,
   messageEdited VARCHAR(50) ,
   memberBan VARCHAR(50) ,
   memberUnban VARCHAR(50) ,
   memberAdd VARCHAR(50) ,
   memberRemove VARCHAR(50) ,
   sanctions VARCHAR(50) ,
   general VARCHAR(50) ,
   idGuild VARCHAR(50)  NOT NULL,
   PRIMARY KEY(idLogs),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild)
);

CREATE TABLE guildUsers(
   idGuildUser INT,
   username VARCHAR(50)  NOT NULL,
   pseudo VARCHAR(50)  NOT NULL,
   nextExpReq INT NOT NULL,
   xp INT NOT NULL,
   level INT NOT NULL,
   boost TINYINT,
   messageCount INT NOT NULL,
   lastMessageId VARCHAR(50) ,
   sanctions INT,
   idUser VARCHAR(50)  NOT NULL,
   idGuild VARCHAR(50)  NOT NULL,
   PRIMARY KEY(idGuildUser),
   FOREIGN KEY(idUser) REFERENCES users(idUser),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild)
);

CREATE TABLE xpDisabledChannels(
   idDisabled INT,
   idChannel INT NOT NULL,
   idLevelSystem INT NOT NULL,
   PRIMARY KEY(idDisabled),
   FOREIGN KEY(idLevelSystem) REFERENCES guildLevelSystem(idLevelSystem)
);

CREATE TABLE logsDisabledChannels(
   idDisabled INT,
   idChannel VARCHAR(50)  NOT NULL,
   idLogs INT NOT NULL,
   PRIMARY KEY(idDisabled),
   FOREIGN KEY(idLogs) REFERENCES guildLogs(idLogs)
);

CREATE TABLE xpDisabledRoles(
   idDisabled INT,
   idRole INT NOT NULL,
   idLevelSystem INT NOT NULL,
   PRIMARY KEY(idDisabled),
   FOREIGN KEY(idLevelSystem) REFERENCES guildLevelSystem(idLevelSystem)
);

CREATE TABLE xpDisabledMessages(
   idDisabled INT,
   message VARCHAR(50)  NOT NULL,
   idLevelSystem INT NOT NULL,
   PRIMARY KEY(idDisabled),
   FOREIGN KEY(idLevelSystem) REFERENCES guildLevelSystem(idLevelSystem)
);

CREATE TABLE commands(
   idCommand INT,
   nameCommand VARCHAR(50)  NOT NULL,
   message TEXT NOT NULL,
   permissions VARCHAR(50) ,
   PRIMARY KEY(idCommand),
   UNIQUE(nameCommand)
);

CREATE TABLE guildAutoModeration(
   idAutoModeration INT,
   type VARCHAR(50)  NOT NULL,
   sanction VARCHAR(50) ,
   action VARCHAR(50) ,
   duree INT,
   idGuild VARCHAR(50)  NOT NULL,
   PRIMARY KEY(idAutoModeration),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild)
);

CREATE TABLE guildCommands(
   idGuildCommand INT,
   enabled BOOLEAN NOT NULL,
   specificRole BOOLEAN,
   specificMember BOOLEAN,
   specificChannel BOOLEAN,
   idCommand INT NOT NULL,
   idGuild VARCHAR(50)  NOT NULL,
   PRIMARY KEY(idGuildCommand),
   FOREIGN KEY(idCommand) REFERENCES commands(idCommand),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild)
);

CREATE TABLE roleEnabledCommand(
   idEnabledRole INT,
   idRole VARCHAR(50)  NOT NULL,
   idGuildCommand INT NOT NULL,
   PRIMARY KEY(idEnabledRole),
   FOREIGN KEY(idGuildCommand) REFERENCES guildCommands(idGuildCommand)
);

CREATE TABLE memberEnabledCommand(
   idEnabledMember INT,
   idMember VARCHAR(50)  NOT NULL,
   idGuildCommand INT NOT NULL,
   PRIMARY KEY(idEnabledMember),
   FOREIGN KEY(idGuildCommand) REFERENCES guildCommands(idGuildCommand)
);

CREATE TABLE channelEnabledCommand(
   idEnabledRole INT,
   idChannel VARCHAR(50)  NOT NULL,
   idGuildCommand INT NOT NULL,
   PRIMARY KEY(idEnabledRole),
   FOREIGN KEY(idGuildCommand) REFERENCES guildCommands(idGuildCommand)
);
