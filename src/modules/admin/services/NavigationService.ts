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

export class NavigationService {
    private items: NavItem[] = [];

    registerItem(item: NavItem) {
        this.items.push(item);
        // Ordenar por la propiedad order, si existe
        this.items.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    getItems(): NavItem[] {
        return this.items;
    }

    getItemsByCategory(category: string): NavItem[] {
        return this.items.filter(item => item.category === category);
    }
}
