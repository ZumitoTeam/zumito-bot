import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember } from "discord.js";
import { ButtonPressed, ButtonPressedParams, Command, CommandArgDefinition, CommandParameters,  CommandType, SelectMenuParameters} from "zumito-framework";

export class MessageWithButtons extends Command implements ButtonPressed {

    categories = ['information'];
    examples: string[] = ['', "@zumito"]; 
    args: CommandArgDefinition[] = [{
        name: "user",
        type: "member",
        optional: true,
    }];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;
    

    execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): void {

        const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
                new ButtonBuilder()
                .setCustomId("messagewithbuttons.delete")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Delete"),
                new ButtonBuilder()
                .setCustomId("messagewithbuttons.reply")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Reply"),
            );

        (message||interaction!)?.reply({ 
            content: "Example message with buttons",
            components: [row], 
            allowedMentions: { 
                repliedUser: false 
            } 
        });
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {}

    buttonPressed({ path, interaction, client, framework, guildSettings, trans }: ButtonPressedParams): void {
        if (path[1] === "delete") {
            interaction.message.delete();
        } else if (path[1] === "reply") {
            interaction.reply("You pressed the reply button");
        }
    }

}