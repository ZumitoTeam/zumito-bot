import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType, EmojiFallback, SelectMenuParameters, ZumitoFramework } from "zumito-framework";
import { config } from "../../../config/index.js";

export class Lang extends Command {

    categories = ['configuration'];
    examples: string[] = ['es', 'en'];
    aliases = ['setlang', 'setlanguage', 'set-lang', 'set-language']; 
    args: CommandArgDefinition[] = [{
        name: 'lang',
        type: 'string',
        optional: true,
    }];
    adminOnly = true;
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    async execute({ message, interaction, args, client, framework, guildSettings, trans }: CommandParameters): Promise<void> {
        if (args.has('lang')) {
            const lang = args.get('lang')?.toLowerCase();
            if (lang === 'es' || lang === 'en') {
                guildSettings.lang = lang;
                await guildSettings.save();
                (message || interaction!)?.reply({
                    content: EmojiFallback.getEmoji(client, '879047636194316300', '♻') + ' ' + trans('changed', { lang: { lang }}), 
                    allowedMentions: { 
                        repliedUser: false 
                    }
                });
            } else {
                let description = [
                    trans('invalid', { 
                        lang 
                    }),
                    trans('valid', { 
                        langs: ['en', 'es'].join(', ') 
                    }),
                    trans('drop')
                ];

                const invalidEmbed = new EmbedBuilder()
                    .setTitle(trans('language'))
                    .setDescription(description.join('\n\n'))
                    .setColor(config.colors.default);

                    if (client && client.user) {
                        invalidEmbed.setThumbnail(
                            client.user.displayAvatarURL({ 
                                forceStatic: false, 
                                size: 4096  })
                        );
                    }
                
                const row: any = new ActionRowBuilder()
                    .addComponents(
                        this.getLanguageSelectMenu(framework, guildSettings.lang)
                    );

                (message || interaction!)?.reply({
                    embeds: [invalidEmbed],
                    components: [row],
                    allowedMentions: { 
                        repliedUser: false 
                    }
                });
            }
        } else {

            const embed = new EmbedBuilder()

                .setTitle(trans('language')).setDescription(trans('current', {
                     lang: guildSettings.lang
                 }) + '\n\n' +
                 trans('drop')
                 )
                .setColor(config.colors.default);

                if (client && client.user) {
                    embed.setThumbnail(
                        client.user.displayAvatarURL({ 
                            forceStatic: false, 
                            size: 4096  })
                    );
                }

            const row: any = new ActionRowBuilder()
                .addComponents(
                    this.getLanguageSelectMenu(framework, guildSettings.lang)
                );

            (message || interaction!)?.reply({
                embeds:[embed],
                components: [row],
                allowedMentions: { 
                    repliedUser: false 
                }
            });
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

    async selectMenu({ path, interaction, client, framework, guildSettings }: SelectMenuParameters): Promise<void> {
        if (path[1] === 'select') {
            const lang = interaction.values[0];
            guildSettings.lang = lang;
            await guildSettings.save();
            interaction.reply({
                content: EmojiFallback.getEmoji(client, '', '♻') + ' ' + framework.translations.get('command.lang.changed', lang, { lang }), 
                allowedMentions: { 
                    repliedUser: false 
                }
            });
        }
    }
}