import { User } from "zumito-framework/discord";
import { Command, CommandParameters, ZumitoFramework, CommandType, SelectMenuParameters, CommandArgDefinition } from "zumito-framework";
import { BananaEmbedBuilder } from "../embeds/BananaEmbedBuilder.ts";

export class Banana extends Command {

    type = CommandType.any;
    args: CommandArgDefinition[] = [{
        name: "user",
        optional: false,
        type: 'user',
    }]

    bananaEmbedBuilder: BananaEmbedBuilder;

    constructor() {
        super();
        this.bananaEmbedBuilder = new BananaEmbedBuilder();
    }

    async execute({ message, interaction, args, guildSettings }: CommandParameters): Promise<void> {
        const user = args.get("user") as User;
        const requesterUser: User = interaction?.user || message?.author!;
        const randomNumber = Math.floor(this.seededRandomString(user.globalName || user.username) * 100);
        
        const embed = this.bananaEmbedBuilder.getEmbed({
            authorName: requesterUser.globalName || requesterUser.username || '',
            authorIcon: requesterUser.avatarURL() || '',
            userName: user.globalName || user.username || '',
            userIcon: user.avatarURL() || '',
            randomNumber: randomNumber,
            locale: guildSettings.locale,
        });
        (message||interaction)?.reply({
            embeds: [embed],
        })
    }

    selectMenu({ path, interaction, trans, }: SelectMenuParameters): void {
        throw new Error("Method not implemented.");
    }

    hashStringToSeed(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
    
    randomWithSeed(seed) {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    
    seededRandomString(str) {
        const seed = this.hashStringToSeed(str);
        return this.randomWithSeed(seed);
    }

}