import path from 'path';
import type { LauncherConfig } from 'zumito-framework';

const __dirname = process.cwd();

export const config: LauncherConfig = {
    bundles: [{
        path: path.join(__dirname, "node_modules", "@zumito-team", "admin-module"),
    }, {
        path: path.join(__dirname, "node_modules", "@zumito-team", "user-panel-module"),
    }],
};

