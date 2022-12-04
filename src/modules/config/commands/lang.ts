import { ActionRow, ActionRowBuilder, AnyComponentBuilder, CommandInteraction, EmbedBuilder, ImageURLOptions, SelectMenuBuilder, SelectMenuInteraction } from "discord.js";
import { Command, CommandArgDefinition, CommandParameters, CommandType, EmojiFallback, SelectMenuParameters, ZumitoFramework } from "zumito-framework";

import { config } from "../../../config.js";
import { emojis } from "../../../emojis.js";
import { type } from "os";

export class Lang extends Command {

    categories = ['configuration'];
    examples: string[] = ['es', 'en'];
    aliases = ['language', 'setlang', 'setlanguage', 'set-lang', 'set-language']; 
    args: CommandArgDefinition[] = [{
        name: 'lang',
        type: 'string',
        optional: true,
    }];
    adminOnly = true;
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS', 'ATTACH_FILES'];
    type = CommandType.any;

    async execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): Promise<void> {
        if (args.has('lang')) {
            const lang = args.get('lang')?.toLowerCase();
            if (lang === 'es' || lang === 'en') {
                guildSettings.lang = lang;
                await guildSettings.save();
                (message || interaction!)?.reply({
                    content: EmojiFallback.getEmoji(client, '879047636194316300', '♻') + ' ' + framework.translations.get('command.lang.changed', lang, { lang }), 
                    allowedMentions: { 
                        repliedUser: false 
                    }
                });
            } else {
                let description = [
                    framework.translations.get('command.lang.invalid', guildSettings.lang, { 
                        lang 
                    }),
                    framework.translations.get('command.lang.valid', guildSettings.lang, { 
                        langs: ['en', 'es'].join(', ') 
                    }),
                    framework.translations.get('command.lang.drop', guildSettings.lang)
                ];

                const invalidEmbed = new EmbedBuilder()
                    .setTitle(framework.translations.get('command.lang.language', guildSettings.lang))
                    .setThumbnail('https://images-ext-2.discordapp.net/external/kPORDs0-YzHMbuef3WOcTuC-hRRy4noiukIFdUgqwPs/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/878950861122985996/d05ce5c0de25fd9afb4f5492f31f21fe.webp?width=609&height=609')
                    .setDescription(description.join('\n\n'))
                    .setColor(config.embeds.color);
                
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

                .setTitle(framework.translations.get('command.lang.language', guildSettings.lang))
                .setThumbnail('https://images-ext-2.discordapp.net/external/kPORDs0-YzHMbuef3WOcTuC-hRRy4noiukIFdUgqwPs/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/878950861122985996/d05ce5c0de25fd9afb4f5492f31f21fe.webp?width=609&height=609')
                .setDescription(framework.translations.get('command.lang.current', guildSettings.lang, {
                     lang: guildSettings.lang
                 }) + '\n\n' +
                 framework.translations.get('command.lang.drop', guildSettings.lang)
                 )
                .setColor(config.embeds.color);

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
    
    getLanguageSelectMenu(framework: ZumitoFramework, guildSettings: any): SelectMenuBuilder {
        return new SelectMenuBuilder()
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
                content: EmojiFallback.getEmoji(client, '879047636194316300', '♻') + ' ' + framework.translations.get('command.lang.changed', lang, { lang }), 
                allowedMentions: { 
                    repliedUser: false 
                }
            });
        }
    }
}