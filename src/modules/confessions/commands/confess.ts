import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, TextBasedChannel } from 'zumito-framework/discord';
import { Command, CommandArgDefinition, CommandParameters, CommandType, ModalSubmitParameters } from 'zumito-framework';
import { ZumitoFramework } from 'zumito-framework';

export class ConfessCommand extends Command {
    name = 'confess';
    description = 'Envía una confesión anónima';
    categories = ['utils'];
    args: CommandArgDefinition[] = [
        { name: 'text', type: 'string', optional: true },
    ];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES'];
    type = CommandType.any;

    async execute({ message, interaction, args, framework }: CommandParameters): Promise<void> {
        if (interaction) {
            const modal = new ModalBuilder()
                .setCustomId(`${this.name}.create`)
                .setTitle('Enviar confesión');

            const textInput = new TextInputBuilder()
                .setCustomId('text')
                .setLabel('Confesión')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const row: any = new ActionRowBuilder<TextInputBuilder>().addComponents(textInput);
            modal.addComponents(row);
            await interaction.showModal(modal);
            return;
        }

        const text = args.get('text');
        if (!text) {
            await message?.reply('Debes escribir una confesión.');
            return;
        }

        await this.sendConfession(text, message!.guild?.id, framework, message);
    }

    async modalSubmit({ interaction, path, framework }: ModalSubmitParameters): Promise<void> {
        if (path[1] !== 'create') return;
        const text = interaction.fields.getTextInputValue('text');
        await this.sendConfession(text, interaction.guild?.id, framework, interaction);
    }

    private async sendConfession(text: string, guildId: string | undefined, framework: ZumitoFramework, context: any) {
        if (!guildId) return;
        const collection = framework.database.collection('confession_configs');
        const config = await collection.findOne({ guildId }).catch(() => null);
        if (!config) {
            await context.reply({ content: 'No hay un canal configurado para confesiones.', ephemeral: true });
            return;
        }
        const channel = context.client.channels.cache.get(config.channelId) as TextBasedChannel | undefined;
        if (!channel || !('send' in channel)) {
            await context.reply({ content: 'El canal configurado no es válido.', ephemeral: true });
            return;
        }
        await (channel as any).send({ content: text });
        await context.reply({ content: 'Confesión enviada.', ephemeral: true });
    }
}

