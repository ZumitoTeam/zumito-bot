import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { RankService } from "./services/RankService";
import { RankMessageService } from "./services/RankMessageService";
import { RankCommand } from "./commands/rank";
import { LeaderboardCommand } from "./commands/leaderboard";

export class RanksModule extends Module {
    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath);
        ServiceContainer.addService(RankService, [], true);
        ServiceContainer.addService(RankMessageService, [], true);
    }
}
