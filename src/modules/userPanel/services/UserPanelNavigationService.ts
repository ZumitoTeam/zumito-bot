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
}
