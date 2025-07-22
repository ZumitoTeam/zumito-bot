import { Route, RouteMethod, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { AdminAuthService } from "../../admin/services/AdminAuthService";


export class AdminFeaturedCommandsDelete extends Route {
    method = RouteMethod.delete;
    path = '/admin/landing/featured-commands/:commandName';

    constructor(
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
    ) {
        super();
    }

    async execute(req, res) {
        if (!this.adminAuthService.isLoginValid(req, res)) {
            return res.status(401).json({ message: 'Access Denied' });
        }

        const { commandName } = req.params;

        try {
            const result = await this.framework.database.collection('featuredcommands').deleteOne({ commandName });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Featured command not found.' });
            }

            res.status(200).json({ message: 'Featured command deleted successfully.' });
        } catch (error) {
            console.error('Error deleting featured command:', error);
            res.status(500).json({ message: 'Failed to delete featured command.', error: error.message });
        }
    }
}
