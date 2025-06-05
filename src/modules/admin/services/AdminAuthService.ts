import { ServiceContainer } from "zumito-framework";
import { ZumitoFramework } from "zumito-framework";
import * as jose from 'jose';

export class AdminAuthService {
    private framework: ZumitoFramework;
    constructor() {
        this.framework = ServiceContainer.getService(ZumitoFramework);
    }

    /**
     * Checks if the user is logged in.
     * @returns {Promise<{ isValid: boolean, data?: any }>} true if valid, false otherwise
     */
    async isLoginValid(req: any): Promise<{ isValid: boolean, data?: any }> {
        const token = req.cookies?.admin_token;
        if (!token) return {
            isValid: false,
            data: {
                reason: 'No token provided'
            }
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
        if (!jwt.expires_in || now >= jwt.exp) return {
            isValid: false,
            data: {
                reason: 'Token expired'
            }
        };
        return {
            isValid: true,
            data: jwt
        }
    }

    /**
     * Checks if the user is a superadmin by their Discord user ID.
     * @param discordUserId Discord user ID to check
     * @returns Promise<boolean> true if the user is a superadmin, false otherwise
     */
    async isSuperAdmin(discordUserId: string): Promise<boolean> {
        if (!discordUserId) return false;
        const admin = await this.framework.database.models.AdminUser.findOne({ where: { discordUserId, isSuperAdmin: true } });
        return !!admin;
    }
}
