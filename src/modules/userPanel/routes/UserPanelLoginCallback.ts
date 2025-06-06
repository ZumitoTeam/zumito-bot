import { Route, RouteMethod } from "zumito-framework";
import * as jose from 'jose';

export class UserPanelLoginCallback extends Route {
    method = RouteMethod.get;
    path = '/panel/login/callback';

    async execute(req: any, res: any) {
        const host = process.env.HOST ?? req.get('host');
        const params = {
            client_id: process.env.DISCORD_CLIENT_ID ?? '',
            client_secret: process.env.DISCORD_CLIENT_SECRET ?? '',
            code: req.query.code ?? '',
            grant_type: 'authorization_code',
            redirect_uri: process.env.FRONTEND_URL ?? `https://${host}/panel/login/callback`,
            scope: 'identify',
        };
        const tokenResponseData = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams(params).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const oauthData: any = await tokenResponseData.json();
        // Obtener el perfil del usuario de Discord
        let discordUserData = null;
        try {
            const userResponse = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    'Authorization': `Bearer ${oauthData.access_token}`
                }
            });
            const userData = await userResponse.json();
            if (userResponse.ok) {
                discordUserData = (userData as any);
            }
        } catch (e) {
            console.error('Error fetching Discord user:', e);
        }
        const payload = {
            discordToken: oauthData.access_token,
            discordRefreshToken: oauthData.refresh_token,
            expires_in: oauthData.expires_in,
            discordUserData: discordUserData
        };
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const jwt = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(secret);
        res.cookie('panel_token', jwt, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/',
        });
        return res.redirect('/panel');
    }
}
