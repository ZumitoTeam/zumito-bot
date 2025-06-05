import { Route, RouteMethod } from "zumito-framework";
import * as jose from 'jose'
import exp from "node:constants";

export class AdminLoginCallback extends Route {

    method = RouteMethod.get;
    path = '/admin/login/callback';
    
    async execute(req, res) {
        const host = process.env.HOST ??req.get('host');
        const params = {
            client_id: process.env.DISCORD_CLIENT_ID ?? '',
            client_secret: process.env.DISCORD_CLIENT_SECRET ?? '',
            code: req.query.code ?? '',
            grant_type: 'authorization_code',
            redirect_uri: process.env.FRONTEND_URL ?? `https://${host}/admin/login/callback`,
            scope: 'identify',
        }
        const tokenResponseData = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams(params).toString(),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
        
          const oauthData: any = await tokenResponseData.json();
          /* {"token_type":"Bearer","access_token":"...","expires_in":604800,"refresh_token":"...","scope":"identify guilds"} */

        // Obtener el perfil del usuario de Discord
        let discordUserId = null;
        try {
            const userResponse = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    'Authorization': `Bearer ${oauthData.access_token}`
                }
            });
            if (userResponse.ok) {
                const userData = await userResponse.json();
                discordUserId = (userData as any).id;
            }
        } catch {}

        const payload = {
            discordToken: oauthData.access_token,
            discordRefreshToken: oauthData.refresh_token,
            expires_in: oauthData.expires_in,
            discordUserId
        };

        const secret = new TextEncoder().encode(process.env.SECRET_KEY);

        const jwt = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(secret);

        res.cookie('admin_token', jwt, {
            httpOnly: false,
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/',
        });

        return res.redirect('/admin/');
    }
}