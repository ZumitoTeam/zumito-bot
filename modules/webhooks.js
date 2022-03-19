module.exports = {
    generateUserWebhook: async function(user, channel) {
        return await channel.createWebhook(user.username, {
            avatar: user.displayAvatarURL(),
        });
    }
}