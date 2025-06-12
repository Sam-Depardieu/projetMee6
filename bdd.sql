CREATE TABLE guilds(
   idGuild BIGINT,
   nameGuild VARCHAR(50),
   memberCount INT NOT NULL,
   PRIMARY KEY(idGuild)
);

CREATE TABLE guildLogs(
   idLog INT,
   messagesChannelId BIGINT,
   memberAddChannelId BIGINT,
   memberRemoveChannelId BIGINT,
   sanctionsChannelId BIGINT,
   generalChannelId BIGINT,
   idGuild BIGINT NOT NULL,
   PRIMARY KEY(idLog),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild)
);

CREATE TABLE users(
   idUser BIGINT,
   username VARCHAR(50) NOT NULL,
   PRIMARY KEY(idUser)
);

CREATE TABLE guildLevelRewards(
   idRewards INT,
   level INT NOT NULL,
   roleId BIGINT NOT NULL,
   rewardMessage TEXT,
   idGuild BIGINT NOT NULL,
   PRIMARY KEY(idRewards),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild)
);

CREATE TABLE guildUsers(
   idGuildUser BIGINT,
   xp INT NOT NULL,
   level INT NOT NULL,
   messageCount BIGINT,
   lastMessageId BIGINT,
   idGuild BIGINT NOT NULL,
   idUser BIGINT NOT NULL,
   PRIMARY KEY(idGuildUser),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild),
   FOREIGN KEY(idUser) REFERENCES users(idUser)
);
