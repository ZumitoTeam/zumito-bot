import { Command, CommandArgDefinition, CommandParameters, CommandType } from "zumito-framework";
import { EmbedBuilder } from "zumito-framework/discord";
import { config } from "../../../config/index.js";
import { Octokit } from "@octokit/rest";

export class Changelog extends Command {

    categories = ['information'];
    examples: string[] = [''];
    args: CommandArgDefinition[] = [];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'];
    type = CommandType.any;

    private octokit = new Octokit();

    async execute({ message, interaction, trans }: CommandParameters): Promise<void> {
        try {
            const { data: commits } = await this.octokit.repos.listCommits({
                owner: 'ZumitoTeam',
                repo: 'zumito-bot',
                per_page: 5,
                page: 1
            });

            if (!commits.length) {
                (message||interaction!)?.reply({
                    content: trans('empty'),
                    allowedMentions: { repliedUser: false }
                });
                return;
            }

            const description = commits.map(commit => {
                const subject = commit.commit.message.split('\n')[0];
                const short = commit.sha.substring(0, 7);
                return `[\`${short}\`](${commit.html_url}) ${subject}`;
            }).join('\n');

            const embed = new EmbedBuilder()
                .setTitle(trans('title'))
                .setDescription(description)
                .setColor(config.colors.default);

            (message||interaction!)?.reply({
                embeds: [embed],
                allowedMentions: { repliedUser: false }
            });
        } catch {
            (message||interaction!)?.reply({
                content: trans('error'),
                allowedMentions: { repliedUser: false }
            });
        }
    }
}
