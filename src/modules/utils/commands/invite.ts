import { Command, CommandParameters } from "zumito-framework";
import { Client } from "zumito-framework/discord";

export class InviteCommand extends Command {
    name = "invite";
    description = "Get an invite link for the bot or the current server.";
    categories = ["utilities"];
    examples = ["invite bot", "invite server"];
    usage = "invite <bot|server>";
    args = [
        { 
            name: "type", 
            type: "string", 
            optional: false, 
            choices: [
                { name: "bot", value: "bot" }, 
                { name: "server", value: "server" }
            ] 
        }
    ];
    async execute({ message, interaction, args, client }: CommandParameters) {
        const type = args.get("type");
        if (!type || (type !== "bot" && type !== "server")) {
            const reply = "You must specify 'bot' or 'server'.";
            if (message) { await message.reply(reply); return; }
            if (interaction) { await interaction.reply(reply); return; }
            return;
        }
        if (type === "bot") {
            // Bot invite link
            const botClient = client as Client;
            const botId = botClient.user?.id;
            const permissions = 8; // Administrator by default
            const invite = `https://discord.com/oauth2/authorize?client_id=${botId}&permissions=${permissions}&scope=bot+applications.commands`;
            const reply = `🤖 Bot invite link: ${invite}`;
            if (message) { await message.reply(reply); return; }
            if (interaction) { await interaction.reply(reply); return; }
            return;
        } else if (type === "server") {
            // Server invite link
            const guild = message?.guild || interaction?.guild;
            if (!guild) {
                const reply = "This command must be used in a server.";
                if (message) { await message.reply(reply); return; }
                if (interaction) { await interaction.reply(reply); return; }
                return;
            }
            // Try to fetch an existing invite or create a new one
            let inviteUrl = null;
            try {
                const channels = guild.channels.cache.filter((ch: any) =>
                    ch.isTextBased?.() &&
                    typeof ch.createInvite === "function" &&
                    ch.permissionsFor(guild.members.me).has('CreateInstantInvite')
                );
                const channel = channels.first();
                if (!channel) throw new Error("No channel with invite permissions found.");
                // Cast to TextChannel to access createInvite
                const invite = await (channel as any).createInvite({ maxAge: 0, maxUses: 0, unique: true });
                inviteUrl = `https://discord.gg/${invite.code}`;
            } catch (e) {
                inviteUrl = null;
            }
            const reply = inviteUrl ? `🔗 Server invite link: ${inviteUrl}` : "Could not create an invite for this server.";
            if (message) { await message.reply(reply); return; }
            if (interaction) { await interaction.reply(reply); return; }
            return;
        }
    }
}
