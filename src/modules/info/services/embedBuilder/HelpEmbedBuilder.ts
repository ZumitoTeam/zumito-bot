import { EmbedBuilder, Client } from 'zumito-framework/discord';
import { ServiceContainer, TranslationManager, EmojiFallback, PrefixResolver } from 'zumito-framework';
import { config } from "../../../../config/index.js";

export class HelpEmbedBuilder {

    translator: TranslationManager;
    emojiFallback: EmojiFallback;
    client: Client;
    prefixResolver: PrefixResolver;

    constructor() {
        this.translator = ServiceContainer.getService(TranslationManager);
        this.emojiFallback = ServiceContainer.getService(EmojiFallback);
        this.client = ServiceContainer.getService(Client);
        this.prefixResolver = ServiceContainer.getService(PrefixResolver);
    }

    getMainEmbed({ locale, botName, botAvatar }: {
        locale: string,
        botName: string,
        botAvatar: string,
    }) {

        const description = [

            this.translator.get('command.help.greeting.welcome', locale, {
                name: botName
            }),
            `\n\n${  this.translator.get('command.help.greeting.intro', locale)}`,
            `\n${  this.translator.get('command.help.greeting.callToAction', locale)  } ${  this.emojiFallback.getEmoji('', '🎉')}`,
            `\n${  this.translator.get('command.help.greeting.categories', locale)  } ${  this.emojiFallback.getEmoji('', '🎮')}`,
        ];

        const HelpMainEmbed = new EmbedBuilder()
            
            .setTitle(this.translator.get('command.help.title', locale))
            .setDescription(description.join(''))
            .setThumbnail(botAvatar)
            .setColor(config.colors.default);
         
        return HelpMainEmbed;
    }

    getCategoryEmbed({ locale, botName, botAvatar, categoria, prefix, commands, premiumCommands, arg }: {
        locale: string,
        botName: string,
        botAvatar: string,
        categoria: string,
        prefix: string,
        commands: string,
        premiumCommands: string,
        arg: string,
    }) {

        const description = [

            this.translator.get('command.help.fields.detailed', locale, {
                example: `\`${  prefix  }help ${  arg  }\``,
            }),
            `\n${  this.translator.get('command.help.fields.support', locale)  } [${  this.translator.get('command.help.fields.supportServer', locale)  }](${  config.links.support  })`,
        ];

        const HelpCategoryEmbed = new EmbedBuilder()

            .setAuthor({
                name: this.translator.get('command.help.labels.commandsOf', locale, {
                    name: botName,           
                }),
                iconURL: botAvatar, 
            })

            .addFields(
                {    
                    name: `${this.emojiFallback.getEmoji('book','📖')  } ${  categoria}`,
                    value: description.join('\n'),
                },
                {
                    name: `${this.emojiFallback.getEmoji('book','📖')  } ${ this.translator.get('command.help.labels.commands', locale)}`,
                    value: `\`\`\`${  commands  }\`\`\``,
                },
                {
                    name: `${this.emojiFallback.getEmoji('','⭐')  } ${  this.translator.get('command.help.labels.premium', locale)}`,
                    value: `\`\`\`fix\n${  premiumCommands  }\`\`\``,
                }
            )    
            .setColor(config.colors.default);

        return HelpCategoryEmbed;

    }

    getComandInfoEmbed({ locale, commandName, commandDescription, botAvatar, usage, aliases, examples, category, permissionsBot, permissionsUser }: {
        locale: string,
        commandName: string,
        commandDescription: string,
        botAvatar: string,
        usage: string,
        aliases: string,
        examples: string,
        category: string,
        permissionsBot: string,
        permissionsUser: string,
    }) {

        const HelpCommandInfoEmbed = new EmbedBuilder()
            
            .setAuthor({
                name: this.translator.get('command.help.labels.commandName', locale, {
                    commandName: commandName
                }),
                iconURL: botAvatar,
            })
            .setDescription(commandDescription)
            .addFields(
                {    
                    name: this.translator.get('command.help.labels.usage', locale),
                    value: `\`${  usage  }\``,
                },
                {
                    name: this.translator.get('command.help.labels.aliases', locale),
                    value: aliases,
                },
                {
                    name: this.translator.get('command.help.labels.examples', locale),
                    value: examples,
                },
                {
                    name: this.translator.get('command.help.labels.category', locale),
                    value: category,
                },
                {
                    name: this.translator.get('command.help.permissions.bot', locale),
                    value: permissionsBot,
                    inline: true,
                },
                {
                    name: this.translator.get('command.help.permissions.user', locale),
                    value: permissionsUser,
                    inline: true,
                }
            )
            .setColor(config.colors.default);
        
        return HelpCommandInfoEmbed;
    }
}