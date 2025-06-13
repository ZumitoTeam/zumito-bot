import { ServiceContainer, ZumitoFramework } from "zumito-framework";
import { Client } from "zumito-framework/discord";

export class MentionChatService {
    private client: Client;
    private framework: ZumitoFramework;

    constructor() {
        this.client = ServiceContainer.getService(Client);
        this.framework = ServiceContainer.getService(ZumitoFramework);
        this.registerListener();
    }

    private registerListener() {
        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            const botId = this.client.user?.id;
            if (!botId) return;
            const mention = `<@${botId}>`;
            const mentionNick = `<@!${botId}>`;
            const content = message.content.trim();

            if (content === mention || content === mentionNick) {
                const prefix = this.framework.settings.defaultPrefix;
                await message.reply(`My prefix is \`${prefix}\``);
                return;
            }

            if (content.startsWith(mention) || content.startsWith(mentionNick)) {
                const text = content.replace(mention, '').replace(mentionNick, '').trim();
                if (!text) return;
                try {
                    const res = await fetch(`https://api.popcat.xyz/chatbot?msg=${encodeURIComponent(text)}&owner=Zumito&botname=Zumito`);
                    const data: any = await res.json();
                    if (data.response) {
                        await message.reply(data.response);
                    }
                } catch {
                    await message.reply('Failed to contact AI service.');
                }
            }
        });
    }
}
