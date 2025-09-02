import { Route, RouteMethod, ServiceContainer } from 'zumito-framework';
import { UserPanelAuthService } from '@zumito-team/user-panel-module/services/UserPanelAuthService';
import { UserPanelViewService } from '@zumito-team/user-panel-module/services/UserPanelViewService';
import { UserPanelLanguageManager } from '@zumito-team/user-panel-module/services/UserPanelLanguageManager';
import ejs from 'ejs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class UserPanelCommunityTranslationsPage extends Route {
    method = RouteMethod.get;
    path = '/panel/community-translations';

    constructor(
        private auth = ServiceContainer.getService(UserPanelAuthService),
        private userPanelLanguageManager: UserPanelLanguageManager = ServiceContainer.getService(UserPanelLanguageManager),
    ) { super(); }

    async execute(req: any, res: any) {
        const authData = await this.auth.isLoginValid(req);
        if (!authData.isValid) return res.redirect('/panel/login');

        const content = await ejs.renderFile(
            path.resolve(__dirname, '../views/community-translations.ejs'),
            { ...this.userPanelLanguageManager.getLanguageVariables(req, res) }
        );
        const view = new UserPanelViewService();
        const html = await view.render({ content, reqPath: req.path, req, res });
        res.send(html);
    }
}
