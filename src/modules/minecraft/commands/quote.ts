import { EmbedBuilder } from "zumito-framework/discord";
import { Command, CommandParameters, CommandType } from "zumito-framework";
import { config } from "../../../config/index.js";

const splashes = [
    "Hello world!",
    "100% pure!",
    "Made with Notepad!",
    "Also try Terraria!",
    "Awesome!",
    "Half the calories!",
    "Best played with friends!",
    "Now in 3D!",
    "Absolutely no memes!",
    "Notch approves!",
    "Spooky!",
    "Horses!",
    "Do not feed after midnight!",
    "Still better than a console!",
    "May contain traces of peanuts!",
    "Ride the pig!",
    "Kittens included!",
    "Survive!",
    "Totally not a virus!",
    "Check for updates!",
];

export class QuoteCommand extends Command {
    name = "mcquote";
    description = "Shows a random Minecraft splash text";
    categories = ["minecraft"];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"];
    type = CommandType.any;

    async execute({ message, interaction, trans }: CommandParameters): Promise<void> {
        const splash = splashes[Math.floor(Math.random() * splashes.length)];
        const embed = new EmbedBuilder()
            .setDescription(trans('result', { splash }))
            .setColor(config.colors.default);
        (message || interaction)?.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}
