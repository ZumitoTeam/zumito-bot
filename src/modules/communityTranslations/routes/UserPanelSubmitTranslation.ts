import { Route, RouteMethod, ServiceContainer, TranslationManager } from "zumito-framework";
import { UserPanelAuthService } from "@zumito-team/user-panel-module/services/UserPanelAuthService";
import { CommunityTranslationService } from "../services/CommunityTranslationService";

export class UserPanelSubmitTranslation extends Route {
    method = RouteMethod.post;
    path = '/panel/:lang/translations';

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
        const lang = req.params.lang;
        req.lang = lang;
        const { filePath, key, translation } = req.body;
        try {
            await this.communityService.submitTranslation({
                lang,
                filePath,
                key,
                value: translation,
            });
            res.json({ message: this.translator.get('community.submitted', lang) });
        } catch {
            res.status(500).json({ message: this.translator.get('community.error', lang) });
        }
    }
}
