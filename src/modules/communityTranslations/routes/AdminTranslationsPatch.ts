import { Route, RouteMethod, ServiceContainer, TranslationManager } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { CommunityTranslationService } from "../services/CommunityTranslationService";

export class AdminTranslationsPatch extends Route {
    method = RouteMethod.get;
    path = '/admin/translations/patch';

    constructor(
        private auth: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private communityService: CommunityTranslationService = ServiceContainer.getService(CommunityTranslationService),
        private translator: TranslationManager = ServiceContainer.getService(TranslationManager),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        if (!await this.auth.isLoginValid(req).then(r => r.isValid)) {
            return res.redirect('/admin/login');
        }
        const lang = req.query.lang || 'en';
        req.lang = lang;
        try {
            const patch = await this.communityService.generatePatch();
            if (!patch) {
                return res.status(404).send(this.translator.get('community.noTranslations', lang));
            }
            res.set('Content-Type', 'text/plain');
            res.send(patch);
        } catch {
            res.status(500).send(this.translator.get('community.error', lang));
        }
    }
}

