import { Guild, GuildMember, TextChannel, CategoryChannel, Snowflake, Client, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
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
        const ticket = await this.framework.database.collection('tickets').insertOne({
            guildId: guild.id,
            userId: user.id,
            channelId: channel.id,
            createdAt: new Date(),
            status: 'open',
        });

        const embed = new EmbedBuilder()
            .setTitle('Ticket ' + ticket.insertedId)

        channel.send({
            embeds: [embed],
            components: [
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('ticket.close.' + channel.id)
                            .setLabel('Cerrar ticket')
                            .setStyle(ButtonStyle.Danger),
                    ),
            ]
        });
        return channel;
    }

    async closeTicket(channel: TextChannel): Promise<void> {
        const ticket = await this.framework.database.collection('tickets').findOne({ channelId: channel.id, status: 'open' });
        if (!ticket) throw new Error('No se encontró un ticket abierto para este canal.');
        await this.framework.database.collection('tickets').updateOne({ _id: ticket._id }, { $set: { status: 'closed' } });
        // Eliminar canal
        if (channel.deletable) await channel.delete("Ticket closed");
    }

    async getOpenTicketByUser(guildId: Snowflake, userId: Snowflake): Promise<any> {
        return this.framework.database.collection('tickets').findOne({ guildId, userId, status: 'open' });
    }

    async getOpenTicketsByGuild(guildId: Snowflake): Promise<any[]> {
        return this.framework.database.collection('tickets').find({ guildId, status: 'open' }).toArray();
    }

    async getTicketById(id: Snowflake): Promise<any> {
        return this.framework.database.collection('tickets').findOne({ _id: id });
    }

    async getTicketsByGuild(guildId: Snowflake): Promise<any[]> {
        return this.framework.database.collection('tickets').find({ guildId }).toArray();
    }

    async getTicketsByUser(userId: Snowflake): Promise<any[]> {
        return this.framework.database.collection('tickets').find({ userId }).toArray();
    }

    async getClosedTicketsByGuild(guildId: Snowflake): Promise<any[]> {
        return this.framework.database.collection('tickets').find({ guildId, status: 'closed' }).toArray();
    }

    async getClosedTicketsByUser(userId: Snowflake): Promise<any[]> {
        return this.framework.database.collection('tickets').find({ userId, status: 'closed' }).toArray();
    }
}
