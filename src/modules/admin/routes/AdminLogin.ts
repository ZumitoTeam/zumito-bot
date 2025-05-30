import { Route, RouteMethod } from "zumito-framework";
import { AdminLoginCallback } from "./AdminLoginCallback";

export class AdminLogin extends Route {

    method = RouteMethod.get;
    path = '/admin/login';

    execute(req, res) {
        if (this.isLoginValid(req, res)) return res.redirect('/admin');  
        const clientId = process.env.DISCORD_CLIENT_ID;
        if (!clientId) throw new Error('DISCORD_CLIET_ID .env var not defined');
        const host = process.env.HOST ??req.get('host');
        const callbackUrl = `https://${host}/admin/login/callback`;
        res.redirect(`https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURI(callbackUrl)}&scope=identify`);
    }

    isLoginValid(req, res) {
        const token = req.cookies.token;
        if (!token) return false;
        const jwt = JSON.parse(Buffer.from(token, 'base64').toString());
        const now = Math.floor(Date.now() / 1000);
        return now < jwt.expires_in;
    }
}