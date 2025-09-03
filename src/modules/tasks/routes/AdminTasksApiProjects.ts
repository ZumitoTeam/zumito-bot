import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { GithubIntegrationService } from "../services/GithubIntegrationService";

export class AdminTasksApiProjects extends Route {
    method = RouteMethod.get;
    path = '/admin/tasks/api/github/projects';

    constructor(
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private gh: GithubIntegrationService = new GithubIntegrationService(),
    ) { super(); }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return;
        const org = (req.query.org || 'ZumitoTeam') as string;
        const projects = await this.gh.listOrgProjects(org);
        res.json({ ok: true, projects });
    }
}

