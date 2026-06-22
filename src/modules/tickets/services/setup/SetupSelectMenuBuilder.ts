import { ActionRowBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType } from "zumito-framework/discord";

export class SetupSelectMenuBuilder {
    roles() {
        const select = new RoleSelectMenuBuilder()
            .setCustomId("setup.roles")
            .setPlaceholder("Roles de soporte")
            .setMinValues(0)
            .setMaxValues(25);
        return new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(select);
    }

    transcript() {
        const select = new ChannelSelectMenuBuilder()
            .setCustomId("setup.transcript")
            .setPlaceholder("Canal de transcripción (opcional)")
            .setChannelTypes(ChannelType.GuildText)
            .setMinValues(0)
            .setMaxValues(1);
        return new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(select);
    }

    openCategory() {
        const select = new ChannelSelectMenuBuilder()
            .setCustomId("setup.open")
            .setPlaceholder("Categoría de tickets abiertos (opcional)")
            .setChannelTypes(ChannelType.GuildCategory)
            .setMinValues(0)
            .setMaxValues(1);
        return new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(select);
    }

    closedCategory() {
        const select = new ChannelSelectMenuBuilder()
            .setCustomId("setup.closed")
            .setPlaceholder("Categoría de tickets cerrados (opcional)")
            .setChannelTypes(ChannelType.GuildCategory)
            .setMinValues(0)
            .setMaxValues(1);
        return new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(select);
    }

    sendChannel() {
        const select = new ChannelSelectMenuBuilder()
            .setCustomId("setup.send")
            .setPlaceholder("Canal donde enviar el panel")
            .setChannelTypes(ChannelType.GuildText)
            .setMinValues(1)
            .setMaxValues(1);
        return new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(select);
    }
}
