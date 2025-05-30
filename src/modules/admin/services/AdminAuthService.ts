import { ServiceContainer } from "zumito-framework";
import { ZumitoFramework } from "zumito-framework";

export class AdminAuthService {
    private framework: ZumitoFramework;
    constructor() {
        this.framework = ServiceContainer.getService(ZumitoFramework);
    }

    /**
     * Checks if the user is logged in.
     * @returns {Promise<{ isValid: boolean, data?: any }>} true if valid, false otherwise
     */
    isLoginValid(req: any): { isValid: boolean, data?: any } {
        const token = req.cookies?.token;
        if (!token) return {
            isValid: false
        };
        let jwt: any;
        try {
            jwt = JSON.parse(Buffer.from(token, 'base64').toString());
        } catch {
            return {
                isValid: false
            };
        }
        const now = Math.floor(Date.now() / 1000);
        if (!jwt.expires_in || now >= jwt.expires_in) return {
            isValid: false
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
