import { Command, CommandArgDefinition, CommandChoiceDefinition, CommandParameters, CommandType, FrameworkEvent, SelectMenuParameters, ZumitoFramework } from "zumito-framework";
import { ActionRowBuilder, GuildMember, SelectMenuBuilder, Message, CommandInteraction, SelectMenuInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { config } from "../../../config.js";
import { DiscordTogether } from "discord-together";

export class Together extends Command {

    categories = ['utilities'];
    examples: string[] = ['', 'youtube']; 
    args: CommandArgDefinition[] = [{
        name: 'activity',
        type: 'string',
        optional: true,
        choices: this.getGamesChoices()
    }];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    async execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): Promise<void> {
        if (args.has('activity')) {
            const games: string[] = this.getGamesValues();
            const activity = args.get('activity')?.toLowerCase();
            let member = (message?.member || interaction?.member) as GuildMember;
            this.startActivity(activity, member, framework, interaction || message, guildSettings);
        } else {
            const gamesSelectMenu = new SelectMenuBuilder()
                .setCustomId('together.activity')
                .setPlaceholder('Select a game')
                .addOptions(this.getGames().map((game) => ({
                    label: game.name,
                    value: game.value,
                })));

            const row: any = new ActionRowBuilder().addComponents(gamesSelectMenu);


            let description = [
                framework.translations.get('command.together.welcome', guildSettings.lang),
                framework.translations.get('command.together.pull', guildSettings.lang)
            ];

            const embed = new EmbedBuilder()
                .setTitle('Discord Togethert')
                .setDescription(description.join('\n\n'))
                .setImage('https://raw.githubusercontent.com/fernandomema/Zumito/main/assets/images/banner.png')
                .setColor(config.embeds.color);


            (message || interaction!)?.reply({
                embeds: [embed],
                components: [row],
                allowedMentions: { 
                    repliedUser: false 
                }
            });
        }
    }

    selectMenu({ path, interaction, client, framework, guildSettings }: SelectMenuParameters): void {
        console.log(path[1]);
        if (path[1] == "activity") {
            this.startActivity(interaction.values[0], interaction.member as GuildMember, framework, interaction, guildSettings);
        }
    }

    startActivity(activity: string, member: GuildMember, framework: ZumitoFramework, reply: any, guildSettings: any) {
        if(member.voice.channel) {
            const discordTogether = new DiscordTogether(framework.client);
            discordTogether.createTogetherCode(member.voice.channel.id, activity).then(async invite => {
               
                const embed = new EmbedBuilder()
                .setTitle('Discord Togethert')
                .setDescription('')
                .setImage('https://raw.githubusercontent.com/fernandomema/Zumito/main/assets/images/banner.png')
                .setColor(config.embeds.color);

                const row: any = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("tes")
                            .setLabel('Click aqui')
                            .setStyle(ButtonStyle.Link)
                            .setURL(invite.code)
                    )
               
                return reply.reply({
                    embeds: [embed],
                    components: [row],
                    allowedMentions: { 
                        repliedUser: false 
                    }
                });
            }).catch((err) => {
                return reply.reply({
                    content: framework.translations.get('command.together.error', guildSettings.lang),
                });
            });
        } else {
            reply.reply({
                content: framework.translations.get('command.together.not_in_voice', guildSettings.lang, { lang: guildSettings.lang })
            });
        }
    }

    getGamesValues() {
        return this.getGames().map((game) => game.value);
    }

    getGamesChoices(): CommandChoiceDefinition[] {
        return this.getGames() as CommandChoiceDefinition[];
    }

    getGames() {
        return [{
            name: 'YouTube',
            value: 'youtube'
        }, {
            name: 'Poker',
            value: 'poker'
        }, {
            name: 'Betrayal',
            value: 'betrayal'
        }, {
            name: 'Fishing',
            value: 'fishing'
        }, {
            name: 'Chess',
            value: 'chess'
        }, {
            name: 'Letter Tile',
            value: 'lettertile'
        }, {
            name: 'Word Snack',
            value: 'wordsnack'
        }, {
            name: 'Doodle Crew',
            value: 'doodlecrew'
        }, {
            name: 'Awkword',
            value: 'awkword'
        }, {
            name: 'Spell Cast',
            value: 'spellcast'
        }, {
            name: 'Checkers',
            value: 'checkers'
        }, {
            name: 'Putt Party',
            value: 'puttparty'
        }, {
            name: 'Sketchheads',
            value: 'sketchheads'
        }, {
            name: 'Ocho',
            value: 'ocho'
        }, {
            name: 'Sketchy Artist',
            value: 'sketchyartist'
        }, {
            name: 'Land',
            value: 'land'
        }, {
            name: 'Meme',
            value: 'meme'
        }, {
            name: 'Ask Away',
            value: 'askaway'
        }, {
            name: 'Bobble',
            value: 'bobble'
        }]
    }
}