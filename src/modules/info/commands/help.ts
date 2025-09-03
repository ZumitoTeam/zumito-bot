import { ActionRowBuilder, StringSelectMenuBuilder, Client } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, PrefixResolver, ServiceContainer } from "zumito-framework";
import { HelpEmbedBuilder } from "../services/embedBuilder/HelpEmbedBuilder";
import { HelpSelectMenuBuilder } from "../services/selectMenuBuilder/HelpSelectMenuBuilder";
import { HelpActionRowBuilder } from "../services/actionRows/HelpActionRowBuilder";

export class Help extends Command {

    categories = ["Information"];
    examples = [""];
    usage = "";
    args: CommandArgDefinition[] = [];

    helpEmbedBuilder: HelpEmbedBuilder;
    helpSelectMenuRowBuilder: HelpSelectMenuBuilder;
    helpActionRowBuilder: HelpActionRowBuilder;

    client: Client;
    prefixsolver: PrefixResolver;

    constructor() {

        super();
        this.helpEmbedBuilder = new HelpEmbedBuilder();
        this.helpSelectMenuRowBuilder = new HelpSelectMenuBuilder();
        this.helpActionRowBuilder = new HelpActionRowBuilder();
        this.client = ServiceContainer.getService(Client);
        this.prefixsolver = new PrefixResolver();
    }

    async execute({ message, interaction, guildSettings }: CommandParameters): Promise<void> {

        const embed = this.helpEmbedBuilder.getComandInfoEmbed ({
            locale: guildSettings.lang,
            botName: this.client!.user!.username,
            botAvatar: this.client!.user!.displayAvatarURL({ extension: 'png', size: 1024 }),
            categoria: 'Information',
            prefix: 'z!',
            commands: 'angry           baka            bang            bite  ',
            premiumCommands: 'angry           baka            bang            bite  ',
            arg: '[<comando>]',
            commandName: 'help',
            commandDescription: 'Displays the list of available commands or information about a specific one.',
            usage: '`z!help [<comando>]`',
            aliases: '?, h',
            examples: 'z!help \n z!help ping',
            category: 'Information',
            permissionsBot: 'View channels\n Send messages\n Embed links',
            permissionsUser: 'None',
        });

        (message||interaction)?.reply({
            embeds: [embed],
            allowedMentions: {
                repliedUser: false,
            },
            components: [

                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    this.helpSelectMenuRowBuilder.getCategorySelectMenu({
                        locale: guildSettings.lang,
                    }) as any
                ),

            this.helpActionRowBuilder.getCloseroRow({
                locale: guildSettings.lang,
            }) as any,
            ], 
        })
    } 
       
}
