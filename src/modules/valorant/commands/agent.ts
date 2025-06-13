import { EmbedBuilder } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType } from "zumito-framework";
import { config } from "../../../config/index.js";

export class ValorantAgentCommand extends Command {
    name = "valorantagent";
    description = "Show information about a Valorant agent.";
    categories = ["valorant"];
    args: CommandArgDefinition[] = [
        { name: "agent", type: "string", optional: false }
    ];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"];
    type = CommandType.any;

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const agentName = args.get("agent");
        if (!agentName) {
            (message || interaction)?.reply({
                content: trans('error'),
                allowedMentions: { repliedUser: false }
            });
            return;
        }
        try {
            const res = await fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=en-US");
            const json = await res.json();
            const agent = json.data.find((a: any) => a.displayName.toLowerCase() === agentName.toLowerCase());
            if (!agent) {
                (message || interaction)?.reply({
                    content: trans('notfound', { agent: agentName }),
                    allowedMentions: { repliedUser: false }
                });
                return;
            }
            const embed = new EmbedBuilder()
                .setTitle(agent.displayName)
                .setDescription(agent.description)
                .setThumbnail(agent.displayIcon)
                .setImage(agent.fullPortrait)
                .addFields({ name: trans('role'), value: agent.role?.displayName || trans('unknown') })
                .setColor(config.colors.default);
            (message || interaction)?.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        } catch {
            (message || interaction)?.reply({
                content: trans('fail'),
                allowedMentions: { repliedUser: false }
            });
        }
    }
}
