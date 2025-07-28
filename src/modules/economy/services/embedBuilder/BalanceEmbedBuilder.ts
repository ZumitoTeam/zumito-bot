import { EmbedBuilder } from 'zumito-framework/discord';
import { ServiceContainer, TranslationManager, EmojiFallback } from 'zumito-framework';
import { config } from "../../../../config/index.js";

export class BalanceEmbedBuilder {

    translator: TranslationManager;
    emojiFallback: EmojiFallback;

    constructor() {
        this.translator = ServiceContainer.getService(TranslationManager);
        this.emojiFallback = ServiceContainer.getService(EmojiFallback) as EmojiFallback;
    }

    getEmbed({ free, paid, coins, user, locale }: {
        free: number;
        paid: number;
        coins: number;
        user: string;
        locale: string;
    }) {

        const description = [

            `- ${ this.translator.get('balance.free', locale, {
                free: free
            })}`,

            `- ${  this.translator.get('balance.paid', locale, {
                paid: paid
            })}`,

            `- ${  this.translator.get('balance.coins', locale,{
                coins: coins
            })}`
        ];

        const balanceEmbed = new EmbedBuilder()
            
            .setTitle(this.translator.get('balance.title', locale, {
                user: user
            }))
            .setDescription(description.join('\n'))
            .setColor(config.colors.default);
            
        return balanceEmbed;
    }
}