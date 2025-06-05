import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { AdminLoginCallback } from "./AdminLoginCallback";
import { AdminAuthService, AdminAuthService } from "../services/AdminAuthService";

export class AdminLogin extends Route {

    method = RouteMethod.get;
    path = '/admin/login';

    constructor(
        private adminAuthService = ServiceContainer.getService(AdminAuthService)
    ) {
        super();
    }

    execute(req, res) {
        if (this.adminAuthService.isLoginValid(req).isValid) return res.redirect('/admin');   
        const clientId = process.env.DISCORD_CLIENT_ID;
        if (!clientId) throw new Error('DISCORD_CLIET_ID .env var not defined');
        const host = process.env.HOST ??req.get('host');
        const callbackUrl = `https://${host}/admin/login/callback`;
        res.redirect(`https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURI(callbackUrl)}&scope=identify`);
    }

}