import { ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'zumito-framework/discord';
import { Command, CommandArgDefinition, CommandParameters, CommandType, ModalSubmitParameters, ServiceContainer } from 'zumito-framework';
import { PollService } from '../services/PollService.js';
import { config } from '../../../config/index.js';

export class PollCommand extends Command {
    categories = ['utils'];
    examples = ['"Favorite color?" "Red|Blue|Green"'];
    args: CommandArgDefinition[] = [
        { name: 'question', type: 'string', optional: true },
        { name: 'options', type: 'string', optional: true },
    ];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'];
    type = CommandType.any;

    numberEmojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];

    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        if (interaction) {
            const modal = new ModalBuilder()
                .setCustomId(`${this.name}.create`)
                .setTitle('Create Poll');

            const questionInput = new TextInputBuilder()
                .setCustomId('question')
                .setLabel('Question')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const optionsInput = new TextInputBuilder()
                .setCustomId('options')
                .setLabel('Options separated by |')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const row1: any = new ActionRowBuilder<TextInputBuilder>().addComponents(questionInput);
            const row2: any = new ActionRowBuilder<TextInputBuilder>().addComponents(optionsInput);

            modal.addComponents(row1, row2);

            await interaction.showModal(modal);
            return;
        }

        const question = args.get('question');
        const optionsRaw = args.get('options');
        const options = String(optionsRaw).split('|').map(o => o.trim()).filter(Boolean).slice(0, 10);
        await this.createPoll(question, options, message!, undefined);
    }

    async modalSubmit({ interaction, path }: ModalSubmitParameters): Promise<void> {
        if (path[1] !== 'create') return;
        const question = interaction.fields.getTextInputValue('question');
        const optionsRaw = interaction.fields.getTextInputValue('options');
        const options = optionsRaw.split('|').map(o => o.trim()).filter(Boolean).slice(0, 10);
        await this.createPoll(question, options, undefined, interaction);
    }

    private async createPoll(question: string, options: string[], message?: any, interaction?: any): Promise<void> {
        if (!question || options.length < 2) {
            const reply = 'Invalid poll options.';
            (interaction || message)?.reply({ content: reply, ephemeral: Boolean(interaction) });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(question)
            .setColor(config.colors.default)
            .setDescription(options.map((opt, i) => `${this.numberEmojis[i]} ${opt}`).join('\n'));

        const pollMessage = await (interaction || message)!.reply({ embeds: [embed], fetchReply: true });

        const pollService = ServiceContainer.getService(PollService) as PollService;
        const guildId = interaction?.guild?.id || message?.guild?.id!;
        const channelId = interaction?.channelId || message?.channelId!;
        const authorId = interaction?.user.id || message?.author.id!;

        await pollService.createPoll({
            guildId,
            channelId,
            messageId: pollMessage.id,
            question,
            options,
            authorId,
        });

        for (let i = 0; i < options.length; i++) {
            await pollMessage.react(this.numberEmojis[i]);
        }
    }
}
