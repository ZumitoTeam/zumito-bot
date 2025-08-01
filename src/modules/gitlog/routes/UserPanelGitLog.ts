import { Route, RouteMethod, ServiceContainer, TranslationManager } from "zumito-framework";
import { UserPanelAuthService } from "@zumito-team/user-panel-module/services/UserPanelAuthService";
import { UserPanelViewService } from "@zumito-team/user-panel-module/services/UserPanelViewService";
import ejs from "ejs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Octokit } from "@octokit/rest";
import { UserPanelLanguageManager } from "@zumito-team/user-panel-module/services/UserPanelLanguageManager";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class UserPanelGitLog extends Route {
    method = RouteMethod.get;
    path = '/panel/:guildId(\\d+)/gitlog';

    private octokit: Octokit;

    constructor(
        private auth = ServiceContainer.getService(UserPanelAuthService),
        private translationService: TranslationManager = ServiceContainer.getService(TranslationManager),
        private userPanelLanguageManager = ServiceContainer.getService(UserPanelLanguageManager),
    ) {
        super();
        this.octokit = new Octokit();
    }

    async execute(req: any, res: any) {
        const authData = await this.auth.isLoginValid(req);
        if (!authData.isValid) {
            return res.redirect('/panel/login');
        }

        const { t, lang, availableLanguages, defaultLanguage } = this.userPanelLanguageManager.getLanguageVariables(req, res);

        try {
            const { data: commits } = await this.octokit.repos.listCommits({
                owner: 'ZumitoTeam',
                repo: 'zumito-bot',
                per_page: 20,
                page: 1
            });

            const logs = commits.map(commit => {
                const subject = commit.commit.message.split('\n')[0];
                const body = commit.commit.message.split('\n').slice(1).join('\n').trim();
                
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
                    relativeDate: this.getRelativeTime(commitDate, req.lang),
                    absoluteDate: commitDate.toLocaleDateString(req.lang, {
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
                    url: commit.html_url,
                };
            });

            const content = await ejs.renderFile(
                path.resolve(__dirname, '../views/gitlog.ejs'),
                {
                    logs,
                    t, lang, availableLanguages, defaultLanguage
                }
            );
            const view = new UserPanelViewService();
            const html = await view.render({ content, reqPath: req.path, req, res });
            res.send(html);
        } catch (e) {
            res.status(500).send(this.translationService.get('changelog.error', req.lang));
        }
    }

    private getRelativeTime(date: Date, lang: string): string {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        const t = (key, ...args) => this.translationService.get(key, lang, ...args);
        
        if (diffInSeconds < 60) {
            return t('time.justNow');
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return t('time.minutesAgo', minutes);
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return t('time.hoursAgo', hours);
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return t('time.daysAgo', days);
        } else if (diffInSeconds < 31536000) {
            const months = Math.floor(diffInSeconds / 2592000);
            return t('time.monthsAgo', months);
        } else {
            const years = Math.floor(diffInSeconds / 31536000);
            return t('time.yearsAgo', years);
        }
    }
}