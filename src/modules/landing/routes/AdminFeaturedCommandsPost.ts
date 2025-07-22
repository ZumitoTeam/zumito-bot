import { Route, RouteMethod, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { AdminAuthService } from "../../admin/services/AdminAuthService";


export class AdminFeaturedCommandsPost extends Route {
    method = RouteMethod.post;
    path = '/admin/landing/featured-commands';

    constructor(
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
    ) {
        super();
    }

    async execute(req, res) {
        if (!this.adminAuthService.isLoginValid(req)) return res.status(400).json({ message: 'Access Denied' });

        const { commandName, emoji, order } = req.body;

        if (!commandName || !emoji || order === undefined) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        try {
            await this.framework.database.collection('featuredcommands').insertOne({
                commandName,
                emoji,
                order: parseInt(order),
            });
            res.status(200).json({ message: 'Featured command added successfully.' });
        } catch (error) {
            console.error('Error adding featured command:', error);
            res.status(500).json({ message: 'Failed to add featured command.', error: error.message });
        }
    }
}
