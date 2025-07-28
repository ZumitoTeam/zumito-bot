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

    getEmbed({ locale }: {
        locale: string;
    }) {

        const description = [

            `- ${ this.translator.get('balance.free', locale, {
                free: '**20**'
            })}`,

            `- ${  this.translator.get('balance.paid', locale, {
                paid: '**30**'
            })}`,

            `- ${  this.translator.get('balance.coins', locale,{
                coins: '**20**'
            })}`
        ];

        const balanceEmbed = new EmbedBuilder()
            
            .setTitle(this.translator.get('balance.title', locale, {
                user: 'WilliamAcosta'
            }))
            .setDescription(description.join('\n'))
            .setColor(config.colors.default);
            
        return balanceEmbed;
    }
}