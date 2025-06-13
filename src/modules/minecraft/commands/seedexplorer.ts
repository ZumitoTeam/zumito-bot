import { EmbedBuilder } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters } from "zumito-framework";
import { config } from "../../../config/index.js";

export class SeedExplorerCommand extends Command {
    name = "mcseedexplorer";
    description = "Shows a preview of a Minecraft seed";
    categories = ["minecraft"];
    args: CommandArgDefinition[] = [{
        name: "seed",
        type: "string",
        optional: false,
    }];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"];

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const seed = args.get("seed");
        if (!seed) {
            (message || interaction)?.reply({ content: trans('error'), allowedMentions: { repliedUser: false } });
            return;
        }
        const encodedUrl = encodeURIComponent(`https://www.chunkbase.com/apps/seed-map?seed=${encodeURIComponent(seed)}`);
        const imageUrl = `https://image.thum.io/get/${encodedUrl}`;
        const embed = new EmbedBuilder()
            .setTitle(trans('title', { seed }))
            .setImage(imageUrl)
            .setColor(config.colors.default);
        (message || interaction)?.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}
