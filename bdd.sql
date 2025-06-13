CREATE TABLE guilds(
   idGuild VARCHAR(32),
   nameGuild VARCHAR(50),
   memberCount INT NOT NULL,
   PRIMARY KEY(idGuild)
);

CREATE TABLE guildLogs(
   idLog INT,
   messages VARCHAR(32),
   memberAdd VARCHAR(32),
   memberRemove VARCHAR(32),
   sanctions VARCHAR(32),
   general VARCHAR(32),
   idGuild VARCHAR(32) NOT NULL,
   PRIMARY KEY(idLog),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild)
);

CREATE TABLE users(
   idUser VARCHAR(32),
   username VARCHAR(50) NOT NULL,
   PRIMARY KEY(idUser)
);

CREATE TABLE guildLevelRewards(
   idRewards INT,
   level INT NOT NULL,
   roleId VARCHAR(32) NOT NULL,
   rewardMessage TEXT,
   idGuild VARCHAR(32) NOT NULL,
   PRIMARY KEY(idRewards),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild)
);

CREATE TABLE guildUsers(
   idGuildUser VARCHAR(32),
   xp INT NOT NULL,
   level INT NOT NULL,
   messageCount VARCHAR(32),
   lastMessageId VARCHAR(32),
   idGuild VARCHAR(32) NOT NULL,
   idUser VARCHAR(32) NOT NULL,
   PRIMARY KEY(idGuildUser),
   FOREIGN KEY(idGuild) REFERENCES guilds(idGuild),
   FOREIGN KEY(idUser) REFERENCES users(idUser)
);