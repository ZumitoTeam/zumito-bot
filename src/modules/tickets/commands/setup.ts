import { Command, CommandParameters, ButtonPressedParams, SelectMenuParameters, ModalSubmitParameters } from "zumito-framework";
import { PermissionsBitField, MessageFlags } from "zumito-framework/discord";
import { TicketPanelService } from "../services/TicketPanelService";
import { SetupState } from "../services/setup/SetupState";
import { SetupStartActionRowBuilder } from "../services/setup/SetupStartActionRowBuilder";
import { SetupNameModalBuilder } from "../services/setup/SetupNameModalBuilder";
import { SetupSelectMenuBuilder } from "../services/setup/SetupSelectMenuBuilder";
import { SetupEmbedBuilder } from "../services/setup/SetupEmbedBuilder";

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

        const row = new SetupStartActionRowBuilder().getRow();

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

        const modal = new SetupNameModalBuilder().getModal(defaultName);

        await interaction.showModal(modal);
        this.setups.set(interaction.user.id, { guildId: interaction.guild.id });
    }

    async modalSubmit({ interaction, path }: ModalSubmitParameters): Promise<void> {
        if (path[0] !== "setup" || path[1] !== "name") return;
        const state = this.setups.get(interaction.user.id);
        if (!state) return;

        state.name = interaction.fields.getTextInputValue("name");

        const selectBuilder = new SetupSelectMenuBuilder();
        const row = selectBuilder.roles();
        const embed = new SetupEmbedBuilder().getEmbed(state, "Selecciona los roles de soporte.");
        await interaction.reply({
            embeds: [embed],
            components: [row],
            flags: MessageFlags.Ephemeral,
        });
    }

    async selectMenu({ interaction, path }: SelectMenuParameters): Promise<void> {
        if (path[0] !== "setup") return;
        const state = this.setups.get(interaction.user.id);
        if (!state) return;

        const selectBuilder = new SetupSelectMenuBuilder();
        const embedBuilder = new SetupEmbedBuilder();

        switch (path[1]) {
        case "roles": {
            state.supportRoles = interaction.values;
            const row = selectBuilder.transcript();
            const embed = embedBuilder.getEmbed(state, "Selecciona el canal de transcripción (opcional).");
            await interaction.update({
                embeds: [embed],
                components: [row],
            });
            break;
        }
        case "transcript": {
            state.transcriptChannelId = interaction.values[0] || null;
            const row = selectBuilder.openCategory();
            const embed = embedBuilder.getEmbed(state, "Selecciona la categoría para los tickets abiertos (opcional).");
            await interaction.update({
                embeds: [embed],
                components: [row],
            });
            break;
        }
        case "open": {
            state.openCategoryId = interaction.values[0] || null;
            const row = selectBuilder.closedCategory();
            const embed = embedBuilder.getEmbed(state, "Selecciona la categoría para los tickets cerrados (opcional).");
            await interaction.update({
                embeds: [embed],
                components: [row],
            });
            break;
        }
        case "closed": {
            state.closedCategoryId = interaction.values[0] || null;
            const row = selectBuilder.sendChannel();
            const embed = embedBuilder.getEmbed(state, "Selecciona el canal donde enviar el panel.");
            await interaction.update({
                embeds: [embed],
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
                    label: "Crear ticket",
                }
            });
            await panelService.sendTicketPanel(panel._id.toString(), state.sendChannelId!);
            this.setups.delete(interaction.user.id);
            const embed = embedBuilder.getEmbed(state, "Panel creado y enviado correctamente.");
            await interaction.update({
                embeds: [embed],
                components: [],
            });
            break;
        }
        }
    }

}
