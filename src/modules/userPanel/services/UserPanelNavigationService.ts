export interface NavItem {
    id: string;
    icon?: string; // SVG string opcional para el icono
    label: string;
    url: string;
    order?: number;
    category?: string;
    sidebar?: NavSidebar;
}

export interface NavSidebar {
    showDropdown: boolean;
    sections: {
        label: string;
        items: {
            label: string;
            url: string;
        }[];
    }[]
}

export class UserPanelNavigationService {
    private items: NavItem[] = [];
    registerItem(item: NavItem) {
        this.items.push(item);
    }
    getItems() {
        return this.items;
    }

    /**
     * Returns a copy of the navigation items replacing the `:guildId` token
     * with the provided guild id on every url, including sidebar links.
     */
    getItemsWithGuildId(guildId: string): NavItem[] {
        const replaceId = (url: string) => url.replace(/:guildId(?:\(.*?\))?/, guildId);
        return this.items.map(item => ({
            ...item,
            url: replaceId(item.url),
            sidebar: item.sidebar ? {
                ...item.sidebar,
                sections: item.sidebar.sections.map(section => ({
                    ...section,
                    items: section.items.map(child => ({
                        ...child,
                        url: replaceId(child.url),
                    })),
                })),
            } : undefined,
        }));
    }
}
