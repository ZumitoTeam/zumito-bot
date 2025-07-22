import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel, Client, PermissionFlagsBits } from 'discord.js';
import { ServiceContainer, ZumitoFramework } from 'zumito-framework';

export class TicketPanelService {
    private framework: ZumitoFramework;
    private client: Client;

    constructor() {
        this.framework = ServiceContainer.getService(ZumitoFramework);
        this.client = ServiceContainer.getService(Client);
    }

    async createTicketPanel(guildId: string, data: any) {
        const panel = { guildId, ...data };
        const result = await this.framework.database.collection('ticket_panels').insertOne(panel);
        return { ...panel, _id: result.insertedId };
    }

    async getTicketPanels(guildId: string) {
        return await this.framework.database.collection('ticket_panels').find({ guildId }).toArray();
    }

    async getTicketPanel(panelId: string) {
        const { ObjectId } = await import('mongodb');
        return await this.framework.database.collection('ticket_panels').findOne({ _id: new ObjectId(panelId) });
    }

    async updateTicketPanel(panelId: string, data: any) {
        const { ObjectId } = await import('mongodb');
        await this.framework.database.collection('ticket_panels').updateOne({ _id: new ObjectId(panelId) }, { $set: data });
        return this.getTicketPanel(panelId);
    }

    async deleteTicketPanel(panelId: string) {
        const { ObjectId } = await import('mongodb');
        await this.framework.database.collection('ticket_panels').deleteOne({ _id: new ObjectId(panelId) });
    }

    async sendTicketPanel(panelId: string, channelId: string) {
        const panel = await this.getTicketPanel(panelId);
        if (!panel) throw new Error('Panel not found');
        const channel = await this.client.channels.fetch(channelId);
        if (!channel || channel.type !== 0) throw new Error('Invalid channel');
        const embed = EmbedBuilder.from(panel.embed || {});
        const button = new ButtonBuilder()
            .setCustomId(`ticket.open:${panelId}`)
            .setLabel(panel.button?.label || 'Open Ticket')
            .setStyle(ButtonStyle.Primary);
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
        await (channel as TextChannel).send({ embeds: [embed], components: [row] });
    }
}
