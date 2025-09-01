import { EmbedBuilder } from "zumito-framework/discord";
import { ServiceContainer } from "zumito-framework";
import { GameServerService } from "../GameServerService.js";
import { config } from "../../../../config/index.js";

export class ServerListEmbedService {
    constructor(private gameServerService: GameServerService = ServiceContainer.getService(GameServerService)) {}

    async build(game: string, trans: (key: string, params?: Record<string, any>) => string): Promise<EmbedBuilder> {
        const servers = await this.gameServerService.getServers(game);
        const embed = new EmbedBuilder()
            .setTitle(trans('title', { game }))
            .setColor(config.colors.default);

        if (servers.length === 0) {
            embed.setDescription(trans('empty'));
            return embed;
        }

        for (const server of servers) {
            const status = await this.gameServerService.getStatus(server);
            const value = status.online
                ? trans('online', { players: status.players?.online, max: status.players?.max, version: status.version })
                : trans('offline');
            embed.addFields({ name: server.name, value });
        }
        return embed;
    }
}
