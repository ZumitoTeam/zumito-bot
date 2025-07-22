import { Command, CommandParameters } from 'zumito-framework';
import { MessageFlags, PermissionsBitField, TextChannel } from 'zumito-framework/discord';
import { ZumitoFramework } from 'zumito-framework';

export class SetWelcomeCommand extends Command {
    name = 'setwelcome';
    description = 'Configure welcome channel and message';
    categories = ['configuration'];
    userPermissions: bigint[] = [PermissionsBitField.Flags.Administrator];
    args = [
        { name: 'channel', type: 'channel', optional: false },
        { name: 'message', type: 'string', optional: false }
    ];

    async execute({ message, interaction, args, framework }: CommandParameters) {
        const guild = message?.guild || interaction?.guild;
        const channel = args.get('channel') as TextChannel;
        const welcomeMessage = args.get('message');
        if (!guild || !channel || !welcomeMessage) {
            const reply = 'Missing channel or message.';
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            else if (message) await message.reply(reply);
            return;
        }
        const model = framework.database.models.WelcomeConfig;
        let config = await model.findOne({ where: { guildId: guild.id } });
        if (!config) {
            config = await model.create({ guildId: guild.id, channelId: channel.id, message: welcomeMessage });
        } else {
            config.channelId = channel.id;
            config.message = welcomeMessage;
            await config.save();
        }
        const reply = `Welcome message configured for <#${channel.id}>`;
        if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
        else if (message) await message.reply(reply);
    }
}
