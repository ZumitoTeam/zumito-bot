import { Command, CommandParameters } from "zumito-framework";
import { MessageFlags, PermissionsBitField } from "zumito-framework/discord";

// Este comando es solo un placeholder, ya que la lógica real de guardar la categoría debe implementarse en la config global del bot o guild
export class SetTicketCategory extends Command {
    name = "setticketcategory";
    description = "Establece la categoría donde se crearán los tickets (solo admins)";
    categories = ["tickets"];
    usage = "setticketcategory <categoryId>";
    userPermissions: bigint[] = [PermissionsBitField.Flags.Administrator];
    args = [
        { name: "category_id", type: "string", optional: false }
    ];
    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const categoryId = args.get("category_id");
        if (!categoryId) {
            const reply = "Debes especificar el ID de la categoría.";
            if (interaction) {
                await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            } else if (message) {
                await message.reply(reply);
            }
            return;
        }
        // Aquí deberías guardar el categoryId en la configuración global/guild
        // Por ahora solo respondemos con éxito
        const reply = `Categoría de tickets configurada: ${categoryId}`; 
        if (interaction) {
            await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
        } else if (message) {
            await message.reply(reply);
        }
    }
}
