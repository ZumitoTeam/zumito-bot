// export module
module.exports = {
	name : "ping",
	description : "check transmit and server runtime!",
	aliases : ["p","test"],
	ussage : null,
	hidden : false,
	admin : true,
	nsfw : false,
	execute(client,message,args){
		const dt = new Date(message.createdTimestamp);
		return message.reply(`pong \`\`${new Date() - dt}ms\`\` | ws : \`\`${client.ws.ping}ms\`\``);
	}
}