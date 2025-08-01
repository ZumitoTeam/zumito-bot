import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { UserPanelAuthService } from "@zumito-team/user-panel-module/services/UserPanelAuthService";
import { UserPanelViewService } from "@zumito-team/user-panel-module/services/UserPanelViewService";
import ejs from "ejs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Octokit } from "@octokit/rest";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class UserPanelGitLog extends Route {
    method = RouteMethod.get;
    path = '/panel/:guildId(\\d+)/gitlog';

    private octokit: Octokit;

    constructor(
        private auth = ServiceContainer.getService(UserPanelAuthService),
    ) {
        super();
        // Inicializar Octokit - puedes agregar un token de GitHub si es necesario
        this.octokit = new Octokit({
            // auth: 'tu_token_github_aqui' // Opcional para mayor límite de rate
        });
    }

    async execute(req: any, res: any) {
        const authData = await this.auth.isLoginValid(req);
        if (!authData.isValid) {
            return res.redirect('/panel/login');
        }

        try {
            // Obtener commits del repositorio usando la API de GitHub
            const { data: commits } = await this.octokit.repos.listCommits({
                owner: 'ZumitoTeam', // Cambiar por el owner real del repo
                repo: 'zumito-bot',  // Cambiar por el nombre real del repo
                // eslint-disable-next-line camelcase
                per_page: 20,
                page: 1
            });

            const logs = commits.map(commit => {
                const subject = commit.commit.message.split('\n')[0]; // Primera línea del mensaje
                const body = commit.commit.message.split('\n').slice(1).join('\n').trim(); // Resto del mensaje
                
                // Determinar el tipo de commit basado en el mensaje
                let type = 'other';
                let icon = '🔧';
                let color = 'gray';
                
                const subjectLower = subject.toLowerCase();
                if (subjectLower.includes('feat') || subjectLower.includes('add')) {
                    type = 'feature';
                    icon = '✨';
                    color = 'green';
                } else if (subjectLower.includes('fix') || subjectLower.includes('bug')) {
                    type = 'fix';
                    icon = '🐛';
                    color = 'red';
                } else if (subjectLower.includes('docs') || subjectLower.includes('doc')) {
                    type = 'docs';
                    icon = '📚';
                    color = 'blue';
                } else if (subjectLower.includes('style') || subjectLower.includes('ui')) {
                    type = 'style';
                    icon = '💄';
                    color = 'purple';
                } else if (subjectLower.includes('refactor')) {
                    type = 'refactor';
                    icon = '♻️';
                    color = 'yellow';
                } else if (subjectLower.includes('test')) {
                    type = 'test';
                    icon = '🧪';
                    color = 'orange';
                } else if (subjectLower.includes('chore') || subjectLower.includes('update')) {
                    type = 'chore';
                    icon = '🔧';
                    color = 'gray';
                }
                
                const commitDate = new Date(commit.commit.author?.date || commit.commit.committer?.date || new Date());
                
                return {
                    fullHash: commit.sha,
                    shortHash: commit.sha.substring(0, 7),
                    author: commit.commit.author?.name || 'Unknown',
                    email: commit.commit.author?.email || '',
                    relativeDate: this.getRelativeTime(commitDate),
                    absoluteDate: commitDate.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    subject,
                    body: body || '',
                    type,
                    icon,
                    color,
                    url: commit.html_url // URL para ver el commit en GitHub
                };
            });

            const content = await ejs.renderFile(
                path.resolve(__dirname, '../views/gitlog.ejs'),
                {
                    logs
                }
            );
            const view = new UserPanelViewService();
            const html = await view.render({ content, reqPath: req.path, req, res });
            res.send(html);
        } catch {
            // Error al obtener datos de GitHub
            res.status(500).send("Error al obtener el historial de cambios desde GitHub");
        }
    }

    private getRelativeTime(date: Date): string {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) {
            return 'hace unos segundos';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `hace ${hours} hora${hours !== 1 ? 's' : ''}`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `hace ${days} día${days !== 1 ? 's' : ''}`;
        } else if (diffInSeconds < 31536000) {
            const months = Math.floor(diffInSeconds / 2592000);
            return `hace ${months} mes${months !== 1 ? 'es' : ''}`;
        } else {
            const years = Math.floor(diffInSeconds / 31536000);
            return `hace ${years} año${years !== 1 ? 's' : ''}`;
        }
    }
}
