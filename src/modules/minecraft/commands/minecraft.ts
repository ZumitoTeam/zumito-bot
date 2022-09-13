import { CommandInteraction, Message, EmbedBuilder, InteractionResponse } from "discord.js";
import { Command, CommandArguments, CommandParameters } from "zumito-framework";
import fetch from "node-fetch";
import { SelectMenuParameters } from "zumito-framework/dist/types/SelectMenuParameters";

export class Minecraft extends Command {

    args: any = [{
        name: "username",
        type: "string",
        required: true
    }]

    async execute({ message, interaction, args, client, framework }: CommandParameters): Promise<any> {
        if (!args.has("username")) {
            return (message || interaction as unknown as CommandInteraction).reply({
                content: framework.translations.get('command.minecraft.no_username', 'en'),
            });
        }

        let profile = await fetch('https://api.mojang.com/users/profiles/minecraft/' + args.get("username")).then(res => res.json());
        console.log(args.get('username'));
        if (!profile) {
            return (message || interaction as unknown as CommandInteraction).reply({
                content: framework.translations.get('command.minecraft.invalid_username'),
            });
        } else {
            let sendedMessage: Message | InteractionResponse | any = await (message || interaction as unknown as CommandInteraction).reply({
                content: framework.translations.get('command.minecraft.fetching_data'),
            });
            let profileData = await fetch('https://api.mojang.com/user/profiles/' + profile.id + '/names').then(res => res.json());
            console.log(profileData);
            let embed = new EmbedBuilder()
                .setTitle(framework.translations.get('command.minecraft.title', 'en', { username: profileData[0].name }))
                .setFields([{
                    name: framework.translations.get('command.minecraft.name_history', 'en'),
                    value: profileData.map((pd: any) => pd.name).reverse().join(", ") || framework.translations.get('global.none', 'en')
                }, {
                    name: framework.translations.get('command.minecraft.uuid', 'en'),
                    value: profile.id
                }, {
                    name: framework.translations.get('command.minecraft.name_mc_link', 'en'),
                    value: framework.translations.get('global.link', 'en', {
                        title: framework.translations.get('global.click_here', 'en'),
                        link: 'https://namemc.com/profile/' + profile.name
                    })
                }])
                .setThumbnail('https://visage.surgeplay.com/bust/' + profile.id)
                .setTimestamp();

            if (sendedMessage instanceof Message) {
                sendedMessage.edit({
                    embeds: [embed]
                });
            } else if (interaction) {
                (interaction as unknown as CommandInteraction).reply({
                    embeds: [embed]
                });
            }

        }
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {}

}