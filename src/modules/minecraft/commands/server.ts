import { EmbedBuilder } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType } from "zumito-framework";
import { config } from "../../../config/index.js";

export class ServerCommand extends Command {
    name = "mcserver";
    description = "Checks the status of a Minecraft server";
    categories = ["minecraft"];
    args: CommandArgDefinition[] = [{
        name: "ip",
        type: "string",
        optional: false,
    }];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"];


    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const ip = args.get("ip");
        if (!ip) {
            (message || interaction)?.reply({ content: trans('error'), allowedMentions: { repliedUser: false } });
            return;
        }
        const res = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(ip)}`);
        const data = await res.json().catch(() => null);
        if (!data || !data.online) {
            (message || interaction)?.reply({ content: trans('offline', { server: ip }), allowedMentions: { repliedUser: false } });
            return;
        }
        const embed = new EmbedBuilder()
            .setTitle(trans('title', { server: ip }))
            .addFields(
                { name: trans('players'), value: `${data.players.online}/${data.players.max}` },
                { name: trans('version'), value: data.version }
            )
            .setColor(config.colors.default);

        (message || interaction)?.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}
