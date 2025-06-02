import { Guild, GuildMember, TextChannel, CategoryChannel, Snowflake, Client, PermissionsBitField } from 'discord.js';
import { ServiceContainer } from 'zumito-framework';
import { ZumitoFramework } from 'zumito-framework';

export class TicketService {
    private framework: ZumitoFramework;
    private client: Client;
    constructor() {
        this.framework = ServiceContainer.getService(ZumitoFramework);
        this.client = ServiceContainer.getService(Client);
    }

    async createTicket(guild: Guild, user: GuildMember, categoryId: Snowflake): Promise<TextChannel> {
        const category = guild.channels.cache.get(categoryId) as CategoryChannel;
        if (!category) throw new Error('La categoría configurada no existe.');

        // Crear canal privado
        const channel = await guild.channels.create({
            name: `ticket-${user.user.username}`,
            type: 0, // 0 = GUILD_TEXT
            parent: categoryId,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                },
            ],
        });

        // Guardar ticket en la base de datos
        await this.framework.database.models.Ticket.create({
            guildId: guild.id,
            userId: user.id,
            channelId: channel.id,
            createdAt: new Date(),
            status: 'open',
        });
        return channel;
    }

    async closeTicket(channel: TextChannel): Promise<void> {
        const ticket = await this.framework.database.models.Ticket.findOne({ where: { channelId: channel.id, status: 'open' } });
        if (!ticket) throw new Error('No se encontró un ticket abierto para este canal.');
        ticket.status = 'closed';
        ticket.closedAt = new Date();
        await ticket.save();
        await channel.delete('Ticket cerrado');
    }

    async getOpenTicketByUser(guildId: Snowflake, userId: Snowflake): Promise<any> {
        return this.framework.database.models.Ticket.findOne({ where: { guildId, userId, status: 'open' } });
    }
}
