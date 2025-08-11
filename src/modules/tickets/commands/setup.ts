import { Command, CommandParameters, ButtonPressedParams, SelectMenuParameters, ModalSubmitParameters } from "zumito-framework";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, PermissionsBitField, MessageFlags } from "zumito-framework/discord";
import { TicketPanelService } from "../services/TicketPanelService";

interface SetupState {
    guildId: string;
    name?: string;
    supportRoles?: string[];
    transcriptChannelId?: string | null;
    openCategoryId?: string | null;
    closedCategoryId?: string | null;
    sendChannelId?: string;
}

export class Setup extends Command {
    name = "setup";
    description = "Configura paneles de tickets";
    categories = ["tickets"];
    userPermissions: bigint[] = [PermissionsBitField.Flags.Administrator];

    private setups: Map<string, SetupState> = new Map();

    async execute({ interaction, message }: CommandParameters): Promise<void> {
        const guild = interaction?.guild || message?.guild;
        if (!guild) return;
        const panelService = new TicketPanelService();
        const panels = await panelService.getTicketPanels(guild.id);

        const row: any = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("setup.create")
                .setLabel("Crear panel")
                .setStyle(ButtonStyle.Primary)
        );

        const content = panels.length === 0
            ? "Nunca has usado este bot en este servidor. Para continuar, dale al botón para crear un panel."
            : "Gestiona tus paneles o crea uno nuevo.";

        await (interaction || message)!.reply({
            content,
            components: [row],
            flags: interaction ? MessageFlags.Ephemeral : undefined,
        });
    }

    async buttonPressed({ interaction, path }: ButtonPressedParams): Promise<void> {
        if (path[0] !== "setup") return;
        if (path[1] !== "create") return;
        if (!interaction.guild) return;

        const panelService = new TicketPanelService();
        const panels = await panelService.getTicketPanels(interaction.guild.id);
        let defaultName = "New Panel";
        let counter = 0;
        while (panels.some(p => p.name === defaultName)) {
            counter++;
            defaultName = `New Panel ${counter}`;
        }

        const modal = new ModalBuilder()
            .setCustomId("setup.name")
            .setTitle("Nombre del panel");

        const nameInput = new TextInputBuilder()
            .setCustomId("name")
            .setLabel("Nombre del panel")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(defaultName);

        const row: any = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
        modal.addComponents(row);

        await interaction.showModal(modal);
        this.setups.set(interaction.user.id, { guildId: interaction.guild.id });
    }

    async modalSubmit({ interaction, path }: ModalSubmitParameters): Promise<void> {
        if (path[0] !== "setup" || path[1] !== "name") return;
        const state = this.setups.get(interaction.user.id);
        if (!state) return;

        state.name = interaction.fields.getTextInputValue("name");

        const select = new RoleSelectMenuBuilder()
            .setCustomId("setup.roles")
            .setPlaceholder("Roles de soporte")
            .setMinValues(0)
            .setMaxValues(25);

        const row: any = new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(select);
        await interaction.reply({
            content: "Selecciona los roles de soporte.",
            components: [row],
            flags: MessageFlags.Ephemeral,
        });
    }

    async selectMenu({ interaction, path }: SelectMenuParameters): Promise<void> {
        if (path[0] !== "setup") return;
        const state = this.setups.get(interaction.user.id);
        if (!state) return;

        switch (path[1]) {
        case "roles": {
            state.supportRoles = interaction.values;
            const transcriptSelect = new ChannelSelectMenuBuilder()
                .setCustomId("setup.transcript")
                .setPlaceholder("Canal de transcripción (opcional)")
                .setChannelTypes(ChannelType.GuildText)
                .setMinValues(0)
                .setMaxValues(1);
            const row: any = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(transcriptSelect);
            await interaction.update({
                content: "Selecciona el canal de transcripción (opcional).",
                components: [row],
            });
            break;
        }
        case "transcript": {
            state.transcriptChannelId = interaction.values[0] || null;
            const openCategorySelect = new ChannelSelectMenuBuilder()
                .setCustomId("setup.open")
                .setPlaceholder("Categoría de tickets abiertos (opcional)")
                .setChannelTypes(ChannelType.GuildCategory)
                .setMinValues(0)
                .setMaxValues(1);
            const row: any = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(openCategorySelect);
            await interaction.update({
                content: "Selecciona la categoría para los tickets abiertos (opcional).",
                components: [row],
            });
            break;
        }
        case "open": {
            state.openCategoryId = interaction.values[0] || null;
            const closedCategorySelect = new ChannelSelectMenuBuilder()
                .setCustomId("setup.closed")
                .setPlaceholder("Categoría de tickets cerrados (opcional)")
                .setChannelTypes(ChannelType.GuildCategory)
                .setMinValues(0)
                .setMaxValues(1);
            const row: any = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(closedCategorySelect);
            await interaction.update({
                content: "Selecciona la categoría para los tickets cerrados (opcional).",
                components: [row],
            });
            break;
        }
        case "closed": {
            state.closedCategoryId = interaction.values[0] || null;
            const sendChannelSelect = new ChannelSelectMenuBuilder()
                .setCustomId("setup.send")
                .setPlaceholder("Canal donde enviar el panel")
                .setChannelTypes(ChannelType.GuildText)
                .setMinValues(1)
                .setMaxValues(1);
            const row: any = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(sendChannelSelect);
            await interaction.update({
                content: "Selecciona el canal donde enviar el panel.",
                components: [row],
            });
            break;
        }
        case "send": {
            state.sendChannelId = interaction.values[0];
            const panelService = new TicketPanelService();
            const panel = await panelService.createTicketPanel(state.guildId, {
                name: state.name,
                supportRoles: state.supportRoles || [],
                transcriptChannelId: state.transcriptChannelId || null,
                openCategoryId: state.openCategoryId || null,
                closedCategoryId: state.closedCategoryId || null,
                embed: {
                    title: state.name,
                    description: "Pulsa el botón para crear un ticket",
                    color: "#5865F2"
                },
                button: {
                    label: "Crear ticket"
                }
            });
            await panelService.sendTicketPanel(panel._id.toString(), state.sendChannelId!);
            this.setups.delete(interaction.user.id);
            await interaction.update({
                content: "Panel creado y enviado correctamente.",
                components: [],
            });
            break;
        }
        }
    }
}

