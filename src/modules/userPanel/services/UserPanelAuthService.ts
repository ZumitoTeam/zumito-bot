import { ServiceContainer } from "zumito-framework";
import * as jose from 'jose';

export class UserPanelAuthService {
    /**
     * Verifica si el usuario está autenticado para el panel de usuario.
     * @returns {Promise<{ isValid: boolean, data?: any }>}
     */
    async isLoginValid(req: any): Promise<{ isValid: boolean, data?: any }> {
        const token = req.cookies?.panel_token;
        if (!token) return {
            isValid: false,
            data: { reason: 'No token provided' }
        };
        let jwt: any;
        try {
            const secret = new TextEncoder().encode(process.env.SECRET_KEY);
            const { payload } = await jose.jwtVerify(token, secret);
            jwt = payload;
        } catch (e) {
            return {
                isValid: false,
                data: {
                    reason: 'Invalid or expired token',
                    error: e instanceof Error ? e.message : e
                }
            };
        }
        const now = Math.floor(Date.now() / 1000);
        if (!jwt.exp || now >= jwt.exp) return {
            isValid: false,
            data: { reason: 'Token expired' }
        };
        return {
            isValid: true,
            data: jwt
        };
    }
}
