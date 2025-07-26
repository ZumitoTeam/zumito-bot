import { ButtonPressedParams, Command, CommandArgDefinition, CommandParameters } from "zumito-framework";
import { CoinFlipEmbedBuilder } from "../services/embeds/CoinFlipEmbedBuilder";
import { CoinFlipActionRowBuilder } from "../services/actionRow/CoinFlipActionRowBuilder";

export class CoinflipCommand extends Command {
    name = "coinflip";
    description = "¡Lanza una moneda y apuesta si sale cara o cruz!";
    categories = ["gambling"];
    examples = ["cara", "cruz"];
    usage = "coinflip <cara|cruz>";
    args: CommandArgDefinition[] = [
        { 
            name: "election", 
            type: "string", 
            optional: true,
            choices: [
                { name: "cara", value: "head" },
                { name: "cruz", value: "tail" },
            ]
        }
    ];

    coinFlipmbedBuilder: CoinFlipEmbedBuilder;
    coinflipActionRowBuilder: CoinFlipActionRowBuilder;

    constructor() {
        super();
        this.coinFlipmbedBuilder = new CoinFlipEmbedBuilder();
        this.coinflipActionRowBuilder = new CoinFlipActionRowBuilder();
    }

    async execute({ message, interaction, args, guildSettings }: CommandParameters): Promise<void> {

        const election = (args.get("election") || "").toLowerCase();
        if(!args.has('election') || (election !== "head" && election !== "tail")) {

            const embed = this.coinFlipmbedBuilder.getNoEmbed({
                locale: guildSettings.lang,
            });

            (message||interaction)?.reply({
                embeds: [embed],
                components: [
                    this.coinflipActionRowBuilder.getRow({
                        locale: guildSettings.lang,
                    }) as any
                ],
            })
        } else {

            const result = Math.random() < 0.5 ? "head" : "tail";
            const win = election === result;

            const embed = this.coinFlipmbedBuilder.getEmbed({
                result: result,
                election: election,
                win: win,
                locale: guildSettings.lang,
            });
            (message||interaction)?.reply({
                embeds: [embed],
            })
        }
       
    }

    async buttonPressed({ path, interaction, guildSettings }: ButtonPressedParams): Promise<void> {
        const eleccion = (path[1] || "").toLowerCase();
        const resultado = Math.random() < 0.5 ? "tail" : "head"; 
        const win = eleccion === resultado;
        const embed = this.coinFlipmbedBuilder.getEmbed({
            result: resultado,
            election: eleccion as ("tail"|"head"),
            win: win,
            locale: guildSettings.lang,
        });
        await interaction.update({ embeds: [embed] });
    }

}
