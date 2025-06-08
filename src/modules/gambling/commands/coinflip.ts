import { Command, CommandParameters } from "zumito-framework";

export class CoinflipCommand extends Command {
    name = "coinflip";
    description = "¡Lanza una moneda y apuesta si sale cara o cruz!";
    categories = ["gambling"];
    examples = ["cara", "cruz"];
    usage = "coinflip <cara|cruz>";
    args = [
        { name: "eleccion", type: "string", optional: true }
    ];
    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const user = message?.author || interaction?.user;
        if (!user) return;
        const eleccion = (args.get("eleccion") || "").toLowerCase();
        const resultado = Math.random() < 0.5 ? "cara" : "cruz";
        let reply = `🪙 La moneda cayó en **${resultado}**.`;
        if (eleccion === "cara" || eleccion === "cruz") {
            const gano = eleccion === resultado;
            reply += ` ${gano ? "¡Ganaste! 🎉" : "Perdiste. 😢"}`;
        } else if (eleccion) {
            reply += " Debes elegir 'cara' o 'cruz'. Ejemplo: /coinflip cara";
        }
        if (message) { await message.reply(reply); return; }
        if (interaction) { await interaction.reply(reply); return; }
    }
}
