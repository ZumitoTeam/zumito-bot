import { Route, RouteMethod } from "zumito-framework";

export class UserPanelLogin extends Route {
    method = RouteMethod.get;
    path = '/panel/login';

    async execute(req: any, res: any) {
        const clientId = process.env.DISCORD_CLIENT_ID;
        if (!clientId) throw new Error('DISCORD_CLIENT_ID .env var not defined');
        const host = process.env.HOST ?? req.get('host');
        const callbackUrl = `https://${host}/panel/login/callback`;
        const url = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURI(callbackUrl)}&scope=identify`;
        res.redirect(url);
    }
}
