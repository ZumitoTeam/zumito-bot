import { GuildMember } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType, ServiceContainer } from "zumito-framework";
import { AvatarEmbedBuilderService } from "../source/avatar/AvatarEmbedBuilderService.js";

export class Avatar extends Command {

    categories = ['information'];
    examples: string[] = ['', "@zumito"]; 
    args: CommandArgDefinition[] = [{
        name: "user",
        type: "member",
        optional: true,
    }];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'];
    type = CommandType.any;

    constructor() {
        super();
    }
    
    async execute({ message, interaction, args, trans, guildSettings }: CommandParameters): Promise<void> {

        const member: GuildMember = args.get('user') || (message||interaction!).member;

        if (!member) {
            (message||interaction!)?.reply({
                content: trans('error'), 
                allowedMentions: { 
                    repliedUser: false 
                }
            });
            return;
        }
        
        /* const row: any = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(trans('button.browser'))
                    .setStyle(ButtonStyle.Link)
                    .setURL(`${member.user.displayAvatarURL({ forceStatic: false, size: 4096 })}`)
            ); */

        const embedBuilderService = ServiceContainer.getService(AvatarEmbedBuilderService);
        const embed = embedBuilderService.buildAvatarEmbed(
            guildSettings.language,
            member.user.globalName || member.user.displayName,
            member.user.displayAvatarURL({ forceStatic: false, size: 4096 }),
            message?.author.globalName || interaction?.user.globalName || '',
            message?.author.displayAvatarURL({ forceStatic: false }) || interaction?.user.displayAvatarURL({ forceStatic: false }) || ''
        );

        (message||interaction!)?.reply({ 
            embeds: [embed], 
            // components: [row],
            allowedMentions: { 
                repliedUser: false 
            } 
        });
    }

}