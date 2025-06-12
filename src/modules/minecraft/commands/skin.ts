import { EmbedBuilder } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType } from "zumito-framework";
import { config } from "../../../config/index.js";

export class SkinCommand extends Command {
    name = "mcskin";
    description = "Shows the Minecraft skin of a player";
    categories = ["minecraft"];
    args: CommandArgDefinition[] = [{
        name: "username",
        type: "string",
        optional: false,
    }];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"];


    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const username = args.get("username");
        if (!username) {
            (message || interaction)?.reply({ content: trans('error'), allowedMentions: { repliedUser: false } });
            return;
        }
        const embed = new EmbedBuilder()
            .setTitle(trans('title', { user: username }))
            .setImage(`https://mc-heads.net/body/${encodeURIComponent(username)}`)
            .setColor(config.colors.default);

        (message || interaction)?.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}
