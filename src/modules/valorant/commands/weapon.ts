import { EmbedBuilder } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType } from "zumito-framework";
import { config } from "../../../config/index.js";

export class ValorantWeaponCommand extends Command {
    name = "valorantweapon";
    description = "Show information about a Valorant weapon.";
    categories = ["valorant"];
    args: CommandArgDefinition[] = [
        { name: "weapon", type: "string", optional: false }
    ];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"];
    type = CommandType.any;

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const weaponName = args.get("weapon");
        if (!weaponName) {
            (message || interaction)?.reply({
                content: trans('error'),
                allowedMentions: { repliedUser: false }
            });
            return;
        }
        try {
            const res = await fetch("https://valorant-api.com/v1/weapons");
            const json = await res.json();
            const weapon = json.data.find((w: any) => w.displayName.toLowerCase() === weaponName.toLowerCase());
            if (!weapon) {
                (message || interaction)?.reply({
                    content: trans('notfound', { weapon: weaponName }),
                    allowedMentions: { repliedUser: false }
                });
                return;
            }
            const embed = new EmbedBuilder()
                .setTitle(weapon.displayName)
                .setThumbnail(weapon.displayIcon)
                .addFields(
                    { name: trans('category'), value: weapon.shopData?.categoryText || trans('unknown') },
                    { name: trans('cost'), value: weapon.shopData?.cost ? weapon.shopData.cost.toString() : '0' }
                )
                .setColor(config.colors.default);
            (message || interaction)?.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        } catch {
            (message || interaction)?.reply({
                content: trans('fail'),
                allowedMentions: { repliedUser: false }
            });
        }
    }
}
