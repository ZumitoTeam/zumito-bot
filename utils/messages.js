module.exports = {
    sendTimedMessage(channel, message, time) {
        var time = 10 - Math.min( (time || 5), 10);
        channel.send(message).then(async function(sendedMessage) {
            emoji = ['9️⃣','8️⃣','7️⃣','6️⃣','5️⃣','4️⃣','3️⃣','2️⃣','1️⃣','0️⃣']
            for (var i = time; i < 10; i++) {
                //await sendedMessage.react(emoji[i]);
                await module.exports.sleep(1000);
                //await sendedMessage.reactions.removeAll();
            }
            sendedMessage.delete();
        });
    },

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
}