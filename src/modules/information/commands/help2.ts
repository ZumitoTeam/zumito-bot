import { ActionRowBuilder, CommandInteraction, EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, Client } from "zumito-framework/discord";
import { Command, CommandParameters, ZumitoFramework, CommandType, SelectMenuParameters, EmojiFallback, ButtonPressedParams, ServiceContainer } from "zumito-framework";
import { config } from "../../../config/index.js";
import { HelpEmbedBuilderService } from "../services/HelpEmbedBuilderService.js";
import { HelpButtonBuilderService } from "../services/HelpButtonBuilderService.js";
import { HelpSelectMenuBuilderService } from "../services/HelpSelectMenuBuilderService.js";

export class Help2 extends Command {
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

    async execute({ message, interaction, args, guildSettings, trans }: CommandParameters): Promise<void> {

        if (args.has("command")) {

            if (this.framework.commands.getAll().has(args.get("command"))) {

                const closeButton: any = this.buttonBuilderService.buildCloseButton(trans, this.emojiFallback);
                const closeRow: any = new ActionRowBuilder().addComponents(closeButton)
                const command: Command = this.framework.commands.get(args.get("command"))!;
                const commandRow: any = new ActionRowBuilder().addComponents(this.selectMenuBuilderService.buildCategoriesSelectMenu(this.client, this.framework, guildSettings, this.emojiFallback));
                const commandEmbed = this.embedBuilderService.buildCommandEmbed(this.framework, command, guildSettings);
                
                (message || (interaction as unknown as CommandInteraction)).reply({
                    embeds: [commandEmbed],
                    components: [commandRow, closeRow],
                    allowedMentions: {
                        repliedUser: false,
                    },
                });
            }
        } else {
            
            const row: any = new ActionRowBuilder().addComponents(this.selectMenuBuilderService.buildCategoriesSelectMenu(this.client, this.framework, guildSettings, this.emojiFallback))
            
            const embed = this.embedBuilderService.buildHelpEmbed(this.client, this.framework, guildSettings, this.emojiFallback);

            (message || (interaction as unknown as CommandInteraction)).reply({
                embeds: [embed],
                components: [row],
                allowedMentions: {
                    repliedUser: false,
                },
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
            
            const category: string = interaction.values[0];

            let commands: Command[] = Array.from(framework.commands.getAll().values()).filter((c: Command) => c.categories.includes(category));
            // filter commmands with same name
            commands = commands.filter((c: Command, index: number, self: Command[]) =>
                index === self.findIndex((t: Command) => t.name === c.name)
            );

            const categoryEmbed = this.embedBuilderService.buildCategoryEmbed(client, category, commands, framework, guildSettings, this.emojiFallback, this.getPrefix(guildSettings));
            const closeButton: any = this.buttonBuilderService.buildCloseButton(trans, this.emojiFallback);
            const row1: any = new ActionRowBuilder().addComponents(this.selectMenuBuilderService.buildCategoriesSelectMenu(client, framework, guildSettings, this.emojiFallback, category));
            const closeRow: any = new ActionRowBuilder().addComponents(closeButton)

            await interaction.deferUpdate();
            await interaction.editReply({
                embeds: [categoryEmbed],
                components: [row1, closeRow],
                allowedMentions: {
                    repliedUser: false
                }
            });
                
        } else if (path[1] == "command") {
                    
            const command: Command | undefined = framework.commands.get(interaction.values[0]);
            
            const commandEmbed = this.embedBuilderService.buildCommandEmbed(framework, command!, guildSettings);
            const row: any = new ActionRowBuilder()
                .addComponents(this.selectMenuBuilderService.buildCategoriesSelectMenu(client, framework, guildSettings, this.emojiFallback));
            await interaction.deferUpdate();
            await interaction.editReply({
                embeds: [commandEmbed],
                components: [row],
                allowedMentions: {
                    repliedUser: false
                }
            });
        }
    }
    
    getPrefix(guildSettings: any, framework?: ZumitoFramework): string {
        return ( guildSettings?.prefix || process.env.BOT_PREFIX || framework?.settings.defaultPrefix || "!");
    }
}
