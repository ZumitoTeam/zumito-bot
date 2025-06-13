import { Route, RouteMethod, ServiceContainer } from 'zumito-framework';
import { AdminAuthService } from '../../admin/services/AdminAuthService';
import { EconomyService } from '../services/EconomyService';

export class AdminEconomyUpdate extends Route {
    method = RouteMethod.post;
    path = '/admin/economy/update';

    constructor(
        private adminAuthService = ServiceContainer.getService(AdminAuthService),
        private economyService = ServiceContainer.getService(EconomyService),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        if (!await this.adminAuthService.isLoginValid(req).then(r => r.isValid)) return res.status(403).send('Access Denied');
        const { userId, free, paid } = req.body || {};
        if (!userId) return res.status(400).send('Missing userId');
        const freeAmount = Number(free);
        const paidAmount = Number(paid);
        if (isNaN(freeAmount) || isNaN(paidAmount)) return res.status(400).send('Invalid amounts');
        await this.economyService.setGlobal(userId, 'free', freeAmount);
        await this.economyService.setGlobal(userId, 'paid', paidAmount);
        res.redirect(`/admin/economy?userId=${userId}`);
    }
}
