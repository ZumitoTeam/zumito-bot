import { Module, ServiceContainer } from "zumito-framework";
import { NavigationService } from "@zumito-team/admin-module/services/NavigationService.js";
import { TaskService } from "./services/TaskService";

export class TasksModule extends Module {
    requeriments = {
        services: ["NavigationService"],
    };

    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(TaskService, [], true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        try {
            const navigationService = ServiceContainer.getService(NavigationService);
            navigationService.registerItem({
                id: 'tasks',
                icon: `<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"w-6 h-6 text-discord-white/60 group-hover:text-white\" fill=\"currentColor\" viewBox=\"0 0 24 24\"><path d=\"M9 11l3 3L22 4l-2-2-8 8-3-3-2 2zm-5 9h16v-2H4v2zm0-6h10v-2H4v2z\"/></svg>`,
                label: 'Tasks',
                url: '/admin/tasks/kanban',
                order: 2,
                category: 'general',
                sidebar: {
                    showDropdown: false,
                    sections: [
                        {
                            id: 'tasks',
                            label: 'Tasks',
                            items: [ 
                                { label: 'Kanban', url: '/admin/tasks/kanban' },
                                { label: 'Pending Reviews', url: '/admin/tasks/pending' },
                            ],
                        },
                    ],
                },
            });
        } catch {
            // Admin module may not be available in some contexts
        }
    }
}
