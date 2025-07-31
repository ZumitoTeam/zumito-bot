import path from 'path';
import { ServiceContainer, type LauncherConfig } from 'zumito-framework';
import { UserPanelColorsService } from '@zumito-team/user-panel-module/services/UserPanelColorsService.js';
import { statusOptions } from 'src/config/StatusOptions';

const __dirname = process.cwd();

export const config: LauncherConfig = {
    statusOptions: statusOptions,
    bundles: [{
        path: path.join(__dirname, "node_modules", "@zumito-team", "admin-module"),
    }, {
        path: path.join(__dirname, "node_modules", "@zumito-team", "user-panel-module"),
    }],
    callbacks: {
        load: (zumito) => {
            const userPanelColorsService = ServiceContainer.getService(UserPanelColorsService);
            userPanelColorsService.setColors({
                primary: "#e11d48",
                accent: "#f472b6",
                success: "#43B581",
                warning: "#FEE75C",
                danger: "#ED4245",
                foreground: "#23272A",
                dark: {
                    100: "#E3E5E8",
                    200: "#F6F6F7",
                    300: "#FFFFFF",
                    400: "#F6F6F7"
                }
            });
        }
    },
};

