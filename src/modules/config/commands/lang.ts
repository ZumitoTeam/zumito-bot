import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters } from "zumito-framework";
import { ActionRow, ActionRowBuilder, AnyComponentBuilder, CommandInteraction, EmbedBuilder, ImageURLOptions, SelectMenuBuilder, SelectMenuInteraction } from "discord.js";
import { config } from "../../../config.js";
import { emojis } from "../../../emojis.js";
import { type } from "os";

export class Lang extends Command {

    categories = ['configuration'];
    examples: string[] = ['es', 'en']; 
    args: CommandArgDefinition[] = [{
        name: 'lang',
        type: 'string',
        optional: true,
    }];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    async execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): Promise<void> {
        if (args.has('lang')) {
            const lang = args.get('lang')?.toLowerCase();
            if (lang === 'es' || lang === 'en') {
                guildSettings.lang = lang;
                await guildSettings.save().catch((e: any) => console.error(e)).then((a: any) => console.log(a));
                (message || interaction!)?.reply({
                    content: framework.translations.get('command.lang.changed', lang, { lang }),
                });
            } else {
                let text = "";
                text += framework.translations.get('command.lang.invalid', guildSettings.lang, { lang });
                text += '\n';
                text += framework.translations.get('command.lang.valid', guildSettings.lang, { 
                    langs: ['en', 'es'].join(', ') 
                });

                (message || interaction!)?.reply({
                content: text , 
                allowedMentions: { 
                        repliedUser: false 
                    }
                });
            }
        } else {
            (message || interaction!)?.reply({
                content: framework.translations.get('command.lang.current', guildSettings.lang, {
                    lang: guildSettings.lang
                }), 
                allowedMentions: { 
                    repliedUser: false 
                }
            });
        }
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {

    }
}