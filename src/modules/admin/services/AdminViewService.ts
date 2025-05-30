import { ServiceContainer } from "zumito-framework";
import { Client } from "zumito-framework/discord";
import { NavigationService } from "./NavigationService";
import ejs from "ejs";
import path from "path";

export class AdminViewService {
    private static layoutPath = path.resolve(__dirname, '../views/layouts/main.ejs');
    private client: Client;
    private navigationService: NavigationService;

    constructor() {
        this.client = ServiceContainer.getService(Client);
        this.navigationService = ServiceContainer.getService(NavigationService);
    }

    async render({
        title,
        content,
        reqPath,
        user = { name: "Admin" },
        extra = {}
    }: {
        title: string;
        content: string;
        reqPath: string;
        user?: any;
        extra?: Record<string, any>;
    }) {
        const navItems = this.navigationService.getItems();
        let selectedNavItem = navItems.find(item => item.url === reqPath);
        if (!selectedNavItem) {
            // Buscar coincidencia en los hijos de sidebar.sections.items
            selectedNavItem = navItems.find(item =>
                item.sidebar && item.sidebar.sections &&
                item.sidebar.sections.some(section =>
                    section.items && section.items.some(child => child.url === reqPath)
                )
            );
        }
        const botName = this.client.user?.username || "Zumito";
        return await ejs.renderFile(
            AdminViewService.layoutPath,
            {
                title,
                content,
                user,
                navItems,
                selectedNavItem,
                botName,
                reqPath,
                ...extra
            }
        );
    }
}
