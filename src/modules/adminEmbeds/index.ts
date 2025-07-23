import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { NavigationService } from "@zumito-team/admin-module/services/NavigationService.js";

export class AdminEmbedsModule extends Module {
    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath);

        this.registerNavigationItem();
    }

    registerNavigationItem() {
        const navigationService = ServiceContainer.getService(NavigationService);
        navigationService.registerItem({
            id: 'embeds',
            icon: `<svg class="w-6 h-6 text-discord-white/60 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><rect x="7" y="9" width="10" height="2" rx="1" fill="#5865F2"/><rect x="7" y="13" width="6" height="2" rx="1" fill="#5865F2"/></svg>`,
            label: 'Embeds',
            url: '/admin/embed',
            order: 2,
            category: 'general',
            sidebar: {
                showDropdown: false,
                sections: [
                    {
                        label: 'Messages',
                        items: [
                            { label: 'Send Embed', url: '/admin/embed' },
                        ],
                    },
                ],
            },
        });
    }
}
