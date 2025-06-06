import { ServiceContainer } from "zumito-framework";
import { Client } from "zumito-framework/discord";
import { UserPanelNavigationService } from "./UserPanelNavigationService";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { UserPanelAuthService } from "./UserPanelAuthService";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class UserPanelViewService {
    private static layoutPath = path.resolve(__dirname, '../views/layouts/main.ejs');

    constructor(
        private client = ServiceContainer.getService(Client),
        private navigationService = ServiceContainer.getService(UserPanelNavigationService),
        private userPanelAuthService = ServiceContainer.getService(UserPanelAuthService),
    ) {}

    async render({
        content,
        reqPath,
        req, res,
        options = {},
    }: {
        content: string;
        reqPath: string;
        req: any; // Express request object
        res: any; // Express response object
        options?: {
            extra?: Record<string, any>,
            hideSidebar?: boolean,
        }
    }) {
        const navItems = this.navigationService.getItems();
        let selectedNavItem = navItems.find(item => item.url === reqPath);
        if (!selectedNavItem) {
            selectedNavItem = navItems.find(item =>
                item.sidebar && item.sidebar.sections &&
                item.sidebar.sections.some(section =>
                    section.items && section.items.some(child => child.url === reqPath)
                )
            );
        }
        const botName = this.client.user?.username || "Zumito";
        const tokenData = await this.userPanelAuthService.isLoginValid(req).then(result => result.data);
        return await ejs.renderFile(
            UserPanelViewService.layoutPath,
            {
                content,
                tokenData,
                navItems,
                selectedNavItem,
                botName,
                reqPath,
                ...options.extra,
                hideSidebar: options.hideSidebar || false,
            }
        );
    }
}
