import { Route, RouteMethod, ServiceContainer, TranslationManager } from "zumito-framework";
import { UserPanelAuthService } from "@zumito-team/user-panel-module/services/UserPanelAuthService";
import { CommunityTranslationService } from "../services/CommunityTranslationService";

export class UserPanelVoteTranslation extends Route {
    method = RouteMethod.post;
    path = '/panel/translations/vote/:id';

    constructor(
        private auth: UserPanelAuthService = ServiceContainer.getService(UserPanelAuthService),
        private communityService: CommunityTranslationService = ServiceContainer.getService(CommunityTranslationService),
        private translator: TranslationManager = ServiceContainer.getService(TranslationManager),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        const authData = await this.auth.isLoginValid(req);
        if (!authData.isValid) {
            return res.redirect('/panel/login');
        }
        const lang = req.body.lang || 'en';
        req.lang = lang;
        const id = req.params.id;
        const vote = Number(req.body.vote) > 0 ? 1 : -1;
        try {
            await this.communityService.voteTranslation(id, vote);
            res.json({ message: this.translator.get('community.voteRegistered', lang) });
        } catch {
            res.status(500).json({ message: this.translator.get('community.error', lang) });
        }
    }
}

