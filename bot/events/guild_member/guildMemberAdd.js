module.exports = {
    name: 'guildMemberAdd',
    once: false,
    execute(client, user) {
        console.log(`Un nv membre à rejoins le serveur : ${user.username} (ID : ${user.id})`);
        
        client.addUser(user);
    },
};