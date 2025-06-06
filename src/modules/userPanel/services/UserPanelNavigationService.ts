export class UserPanelNavigationService {
    private items = [];
    registerItem(item) {
        this.items.push(item);
    }
    getItems() {
        return this.items;
    }
}
