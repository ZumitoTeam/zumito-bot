import { Command, CommandArgDefinition, CommandParameters, CommandType, ServiceContainer } from "zumito-framework";
import { MessageFlags, PermissionsBitField, TextChannel } from "zumito-framework/discord";
import { BirthdayService } from "../services/BirthdayService";

export class SetBirthdayChannel extends Command {
    name = 'setbirthdaychannel';
    description = 'Set the channel for birthday notifications.';
    categories = ['configuration'];
    examples: string[] = ['#birthdays'];
    aliases = ['birthdaychannel', 'set-birthday-channel'];
    args: CommandArgDefinition[] = [
        {
            name: 'channel',
            type: 'channel',
            optional: false,
        },
    ];
    adminOnly = true;
    userPermissions: bigint[] = [PermissionsBitField.Flags.Administrator];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES'];
    type = CommandType.guild;

    constructor(
        private svc: BirthdayService = ServiceContainer.getService(BirthdayService)
    ) { super(); }

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const guild = message?.guild || interaction?.guild;
        const channel = args.get('channel') as TextChannel | undefined;
        if (!guild || !channel) {
            const reply = trans('invalid');
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            else if (message) await message.reply(reply);
            return;
        }
        await this.svc.setGuildChannel(guild.id, channel.id);
        const reply = trans('saved', { channel: `<#${channel.id}>` });
        if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
        else if (message) await message.reply(reply);
    }
}
