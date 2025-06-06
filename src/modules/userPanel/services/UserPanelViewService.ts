import { ServiceContainer } from "zumito-framework";
import { Client } from "zumito-framework/discord";
import { UserPanelNavigationService } from "./UserPanelNavigationService";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class UserPanelViewService {
    private static layoutPath = path.resolve(__dirname, '../views/layouts/main.ejs');
    private client: Client;
    private navigationService: UserPanelNavigationService;

    constructor() {
        this.client = ServiceContainer.getService(Client);
        this.navigationService = ServiceContainer.getService(UserPanelNavigationService);
    }

    async render({
        content,
        reqPath,
        user = { name: "Usuario" },
        options = {},
    }: {
        content: string;
        reqPath: string;
        user?: any;
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
        return await ejs.renderFile(
            UserPanelViewService.layoutPath,
            {
                content,
                user,
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
