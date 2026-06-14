import { ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, CommandInteraction, Client } from "zumito-framework/discord";
import { Command, CommandParameters, ZumitoFramework, CommandType, SelectMenuParameters, EmojiFallback, ButtonPressedParams, ServiceContainer } from "zumito-framework";
import { HelpEmbedBuilderService } from "../services/embedBuilder/HelpEmbedBuilderService.js";
import { HelpButtonBuilderService } from "../services/actionRow/HelpButtonBuilderService.js";
import { HelpSelectMenuBuilderService } from "../services/actionRow/HelpSelectMenuBuilderService.js";

export class Help extends Command {
    categories = ["information"];
    examples = ["", "ping", "avatar"];
    aliases = ["?", "h"];
    args = [{
        name: "command",
        type: "string",
        optional: true,
    }];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"];
    userPermissions = [];
    type = CommandType.any;

    constructor(
        private client = ServiceContainer.getService(Client),
        private framework = ServiceContainer.getService(ZumitoFramework),
        private emojiFallback = ServiceContainer.getService(EmojiFallback),
        private embedBuilderService = ServiceContainer.getService(HelpEmbedBuilderService),
        private buttonBuilderService = ServiceContainer.getService(HelpButtonBuilderService),
        private selectMenuBuilderService = ServiceContainer.getService(HelpSelectMenuBuilderService)
    ) {
        super();
    }

    private buildButtonRow(trans: (key: string) => string): ActionRowBuilder<ButtonBuilder> {
        const closeButton = this.buttonBuilderService.buildCloseButton(trans, this.emojiFallback);
        const viewWebButton = this.buttonBuilderService.buildViewWebButton(trans);
        return new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton, viewWebButton);
    }

    async execute({ message, interaction, args, guildSettings, trans }: CommandParameters): Promise<void> {

        if (args.has("command")) {

            if (this.framework.commands.getAll().has(args.get("command"))) {

                const command = this.framework.commands.get(args.get("command"))!;
                const commandEmbed = this.embedBuilderService.buildCommandEmbed(this.framework, command, guildSettings, this.getPrefix(guildSettings));

                const commandRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    this.selectMenuBuilderService.buildCategoriesSelectMenu(this.client, this.framework, guildSettings, this.emojiFallback)
                );
                const closeRow = this.buildButtonRow(trans);

                (message || (interaction as unknown as CommandInteraction)).reply({
                    embeds: [commandEmbed],
                    components: [commandRow, closeRow],
                    allowedMentions: { repliedUser: false },
                });
            }

        } else {

            const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                this.selectMenuBuilderService.buildCategoriesSelectMenu(this.client, this.framework, guildSettings, this.emojiFallback)
            );
            const closeRow = this.buildButtonRow(trans);
            const embed = this.embedBuilderService.buildHelpEmbed(this.client, this.framework, guildSettings, this.emojiFallback);

            (message || (interaction as unknown as CommandInteraction)).reply({
                embeds: [embed],
                components: [row, closeRow],
                allowedMentions: { repliedUser: false },
            });
        }
    }

    async buttonPressed({ path, interaction }: ButtonPressedParams): Promise<void> {
        if (path[1] == "close") {
            await interaction.message.delete();
        }
    }

    async selectMenu({ path, interaction, client, framework, guildSettings, trans }: SelectMenuParameters): Promise<void> {

        if (path[1] == "category") {

            const category = interaction.values[0];

            const commands = Array.from(framework.commands.getAll().values())
                .filter((c: Command & { premium?: boolean }) => c.categories.includes(category) && !c.premium)
                .filter((c: Command & { premium?: boolean }, index: number, self: (Command & { premium?: boolean })[]) =>
                    index === self.findIndex((t: Command & { premium?: boolean }) => t.name === c.name)
                );

            const categoryEmbed = this.embedBuilderService.buildCategoryEmbed(
                client, category, commands, framework, guildSettings, this.emojiFallback, this.getPrefix(guildSettings)
            );

            const row1 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                this.selectMenuBuilderService.buildCategoriesSelectMenu(client, framework, guildSettings, this.emojiFallback, category)
            );
            const closeRow = this.buildButtonRow(trans);

            await interaction.deferUpdate();
            await interaction.editReply({
                embeds: [categoryEmbed],
                components: [row1, closeRow],
                allowedMentions: { repliedUser: false }
            });

        } else if (path[1] == "command") {

            const command = framework.commands.get(interaction.values[0]);
            const commandEmbed = this.embedBuilderService.buildCommandEmbed(framework, command!, guildSettings, this.getPrefix(guildSettings));

            const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                this.selectMenuBuilderService.buildCategoriesSelectMenu(client, framework, guildSettings, this.emojiFallback)
            );

            await interaction.deferUpdate();
            await interaction.editReply({
                embeds: [commandEmbed],
                components: [row],
                allowedMentions: { repliedUser: false }
            });
        }
    }

    getPrefix(guildSettings: { prefix?: string } | undefined, framework?: ZumitoFramework): string {
        return (guildSettings?.prefix || process.env.BOT_PREFIX || framework?.settings.defaultPrefix || "!");
    }
}
