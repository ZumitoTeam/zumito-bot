import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType, EmojiFallback, SelectMenuParameters, ZumitoFramework, ServiceContainer } from "zumito-framework";
import { config } from "../../../config/index.js";

export class Lang extends Command {

    categories = ['configuration'];
    examples: string[] = ['', 'en'];
    aliases = ['setlang', 'setlanguage', 'set-lang', 'set-language']; 
    args: CommandArgDefinition[] = [{
        name: 'lang',
        type: 'string',
        optional: true,
    }];
    adminOnly = true;
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    emojiFallback: EmojiFallback;

    constructor() {
        super();
        this.emojiFallback = ServiceContainer.getService(EmojiFallback) as EmojiFallback;
    }

    private formatLang(lang: string): string {
        switch (lang) {
        case 'en':
                  return ':flag_us: English';
        case 'es':
                  return ':flag_es: Español';
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
                        content: trans('alreadySet', { lang: this.formatLang(lang) }), 
                        allowedMentions: { 
                            repliedUser: false 
                        },
                        ephemeral: true
                    });
                } else {
                    await message?.reply({
                        content: trans('alreadySet', { lang: this.formatLang(lang) }), 
                        allowedMentions: { 
                            repliedUser: false 
                        }
                    });
                }
            } else if (lang === 'es' || lang === 'en') {
                guildSettings.lang = lang;
                await guildSettings.save();

                if (interaction) {
                    await interaction.reply({
                        content: trans('changed', { lang: this.formatLang(lang) }), 
                        allowedMentions: { 
                            repliedUser: false 
                        },
                        ephemeral: true
                    });
                } else {
                    await message?.reply({
                        content: trans('changed', { lang: this.formatLang(lang) }), 
                        allowedMentions: { 
                            repliedUser: false 
                        }
                    });
                }
            } else {
                // Resto del código para manejar idiomas inválidos
                const description = [
                    trans('invalid') + '\n\n',
                    trans('valid', { langs: ['English(en)', 'Español(es)'].join(', ') }) + '\n',
                    trans('use', {
                        example: '`' + prefix + 'lang en`'
                    }) + '\n\n',
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
                        ephemeral: true
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
                .setDescription(`${trans('current', { lang: this.formatLang(guildSettings.lang) })}\n\n${trans('drop')}`)
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
                    ephemeral: true
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

    async selectMenu({ path, interaction, client, framework, guildSettings, trans }: SelectMenuParameters): Promise<void> {
        if (path[1] === 'select') {
            const lang = interaction.values[0];

            if (lang === guildSettings.lang) {

                if (interaction.replied || interaction.deferred) {
                    await interaction.editReply({
                        content: trans('alreadySet', { lang: this.formatLang(lang) }), 
                        allowedMentions: { 
                            repliedUser: false 
                        }
                    });
                } else {
                    await interaction.reply({
                        content: trans('alreadySet', { lang: this.formatLang(lang) }), 
                        allowedMentions: { 
                            repliedUser: false 
                        },
                        ephemeral: true
                    });
                }
            } else {
                guildSettings.lang = lang;
                await guildSettings.save();

                if (interaction.replied || interaction.deferred) {
                    await interaction.editReply({
                        content: trans('changed', { lang: this.formatLang(lang) }), 
                        allowedMentions: { 
                            repliedUser: false 
                        }
                    });
                } else {
                    await interaction.reply({
                        content: trans('changed', { lang: this.formatLang(lang) }), 
                        allowedMentions: { 
                            repliedUser: false 
                        },
                        ephemeral: true
                    });
                }
            }
        }
    }

    getPrefix(guildSettings: any, framework?: ZumitoFramework): string {
        return ( guildSettings?.prefix || process.env.BOT_PREFIX || framework?.settings.defaultPrefix || "!");
    }
}
