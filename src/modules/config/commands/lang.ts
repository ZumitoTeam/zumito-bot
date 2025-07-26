import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, MessageFlags } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType, EmojiFallback, SelectMenuParameters, ZumitoFramework, ServiceContainer, CommandChoiceDefinition, TranslationManager } from "zumito-framework";
import { config } from "../../../config/index.js";

export class Lang extends Command {

    categories = ['configuration'];
    examples: string[] = ['', 'en'];
    aliases = ['setlang', 'setlanguage', 'set-lang', 'set-language']; 
    args: CommandArgDefinition[] = [{
        name: 'lang',
        type: 'string',
        optional: true,
        choices: () => {
            const choices: CommandChoiceDefinition[] = [];
            this.translator.getLanguages().forEach(lang => choices.push({
                name: this.getLanguageString(lang, false),
                value: lang
            }))
            return choices;
        },
    }];
    adminOnly = true;
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    emojiFallback: EmojiFallback;
    translator: TranslationManager;

    constructor(
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework)
    ) {
        super();
        this.emojiFallback = ServiceContainer.getService(EmojiFallback);
        this.translator = ServiceContainer.getService(TranslationManager);
    }

    private getLanguageString(lang: string, emoji = true): string {
        switch (lang) {
        case 'en':
            if (!emoji) return `English`;
            return `${this.emojiFallback.getEmoji('', ':flag_us:')  } `+ `English`;
        case 'es':
            if (!emoji) return `Español`;
            return `${this.emojiFallback.getEmoji('', ':flag_es:')  } `+ `Español`;
        default:
            return lang;
        }
    }

    async execute({ message, interaction, args, client, framework, guildSettings, trans }: CommandParameters): Promise<void> {

        const prefix = this.getPrefix(guildSettings, framework);

        if (args.has('lang')) {
            const lang = args.get('lang')?.toLowerCase();

            if (lang === guildSettings.lang) {
                
                if (interaction) {
                    await interaction.reply({
                        content: trans('alreadySet', { lang: this.getLanguageString(lang) }), 
                        allowedMentions: { 
                            repliedUser: false 
                        },
                        flags: MessageFlags.Ephemeral
                    });
                } else {
                    await message?.reply({
                        content: trans('alreadySet', { lang: this.getLanguageString(lang) }), 
                        allowedMentions: { 
                            repliedUser: false 
                        }
                    });
                }
            } else if (lang === 'es' || lang === 'en') {
                
                await this.framework.database.collection('guilds').updateOne(
                    { guild_id: guildSettings.guild_id },
                    { $set: { lang } }
                );

                if (interaction) {
                    await interaction.reply({
                        content: trans('changed', { lang: this.getLanguageString(lang) }), 
                        allowedMentions: { 
                            repliedUser: false 
                        },
                        flags: MessageFlags.Ephemeral
                    });
                } else {
                    await message?.reply({
                        content: trans('changed', { lang: this.getLanguageString(lang) }), 
                        allowedMentions: { 
                            repliedUser: false 
                        }
                    });
                }
            } else {
                const description = [
                    `${trans('invalid')  }\n\n`,
                    `${trans('valid', { langs: ['English(en)', 'Español(es)'].join(', ') })  }\n`,
                    `${trans('use', {
                        example: `\`${  prefix  }lang en\``
                    })  }\n\n`,
                    trans('drop')
                ];

                const invalidEmbed = new EmbedBuilder()
                    .setTitle(trans('language'))
                    .setDescription(description.join(''))
                    .setColor(config.colors.default);

                if (client && client.user) {
                    invalidEmbed.setThumbnail(client.user.displayAvatarURL({ 
                        forceStatic: false, 
                        size: 4096 
                    }));
                }

                const row: any = new ActionRowBuilder()
                    .addComponents(this.getLanguageSelectMenu(framework, guildSettings.lang));

                if (interaction) {
                    await interaction.reply({
                        embeds: [invalidEmbed],
                        components: [row],
                        allowedMentions: { 
                            repliedUser: false 
                        },
                        flags: MessageFlags.Ephemeral
                    });
                } else {
                    await message?.reply({
                        embeds: [invalidEmbed],
                        components: [row],
                        allowedMentions: { 
                            repliedUser: false 
                        }
                    });
                }
            }
        } else {
            const embed = new EmbedBuilder()
                .setTitle(trans('language'))
                .setDescription(`${trans('current', { lang: this.getLanguageString(guildSettings.lang) })}\n\n${trans('drop')}`)
                .setColor(config.colors.default);

            if (client && client.user) {
                embed.setThumbnail(client.user.displayAvatarURL({ 
                    forceStatic: false, 
                    size: 4096 
                }));
            }
            const row: any = new ActionRowBuilder()
                .addComponents(this.getLanguageSelectMenu(framework, guildSettings.lang));

            if (interaction) {
                await interaction.reply({
                    embeds:[embed],
                    components: [row],
                    allowedMentions: { 
                        repliedUser: false 
                    },
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await message?.reply({
                    embeds:[embed],
                    components: [row],
                    allowedMentions: { 
                        repliedUser: false 
                    }
                });
            }
        }
    }
    
    getLanguageSelectMenu(framework: ZumitoFramework, guildSettings: any): StringSelectMenuBuilder {

        return new StringSelectMenuBuilder()
            .setCustomId('lang.select')
            .setPlaceholder(framework.translations.get('command.lang.select', guildSettings.lang))
            .addOptions(
                {
                    label: 'English',
                    description: "Set your language to English",
                    emoji: '🇺🇸',
                    value: 'en'
                },
                {
                    label: 'Español',
                    description: "Establece tu idioma a Español",
                    emoji: '🇪🇸',
                    value: 'es'
                }
            );
    }

    async selectMenu({ path, interaction, guildSettings, trans }: SelectMenuParameters): Promise<void> {
        if (path[1] === 'select') {
            const lang = interaction.values[0];

            if (lang === guildSettings.lang) {

                if (interaction.replied || interaction.deferred) {
                    await interaction.editReply({
                        content: trans('alreadySet', { lang: this.getLanguageString(lang) }), 
                        allowedMentions: { 
                            repliedUser: false 
                        }
                    });
                } else {
                    await interaction.reply({
                        content: trans('alreadySet', { lang: this.getLanguageString(lang) }), 
                        allowedMentions: { 
                            repliedUser: false 
                        },
                        flags: MessageFlags.Ephemeral
                    });
                }
            } else {
                this.framework.database.collection('guilds').updateOne({ guild_id: guildSettings.guild_id }, { $set: { lang } });

                if (interaction.replied || interaction.deferred) {
                    await interaction.editReply({
                        content: trans('changed', { lang: this.getLanguageString(lang) }), 
                        allowedMentions: { 
                            repliedUser: false 
                        }
                    });
                } else {
                    await interaction.reply({
                        content: trans('changed', { lang: this.getLanguageString(lang) }), 
                        allowedMentions: { 
                            repliedUser: false 
                        },
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
        }
    }

    getPrefix(guildSettings: any, framework?: ZumitoFramework): string {
        return ( guildSettings?.prefix || process.env.BOT_PREFIX || framework?.settings.defaultPrefix || "!");
    }
}
