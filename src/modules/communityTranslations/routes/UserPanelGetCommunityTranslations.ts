import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { UserPanelAuthService } from "@zumito-team/user-panel-module/services/UserPanelAuthService";
import { CommunityTranslationService } from "../services/CommunityTranslationService";

export class UserPanelGetCommunityTranslations extends Route {
    method = RouteMethod.get;
    path = '/panel/:lang/community-translations';

    constructor(
        private auth: UserPanelAuthService = ServiceContainer.getService(UserPanelAuthService),
        private communityService: CommunityTranslationService = ServiceContainer.getService(CommunityTranslationService),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        const authData = await this.auth.isLoginValid(req);
        if (!authData.isValid) {
            return res.redirect('/panel/login');
        }
        const lang = req.params.lang;
        req.lang = lang;
        const proposals = await this.communityService.getCommunityTranslations(lang);
        res.json(proposals);
    }
}

