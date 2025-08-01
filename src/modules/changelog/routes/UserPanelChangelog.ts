import { Route, RouteMethod, ServiceContainer, TranslationManager } from "zumito-framework";
import { UserPanelAuthService } from "@zumito-team/user-panel-module/services/UserPanelAuthService";
import { UserPanelViewService } from "@zumito-team/user-panel-module/services/UserPanelViewService";
import ejs from "ejs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Octokit } from "@octokit/rest";
import { UserPanelLanguageManager } from "@zumito-team/user-panel-module/services/UserPanelLanguageManager";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class UserPanelChangelog extends Route {
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
                per_page: 40,
                page: 1
            });

            // Agrupar commits por día para simular "actualizaciones"
            const updateGroups = this.groupCommitsByDay(commits, req.lang);

            const content = await ejs.renderFile(
                path.resolve(__dirname, '../views/changelog.ejs'),
                {
                    updateGroups,
                    t, lang, availableLanguages, defaultLanguage
                }
            );
            const view = new UserPanelViewService();
            const html = await view.render({ content, reqPath: req.path, req, res });
            res.send(html);
        } catch {
            res.status(500).send(this.translationService.get('changelog.error', req.lang));
        }
    }

    private groupCommitsByDay(commits: any[], lang: string) {
        const groups: any[] = [];
        const commitsByDate = new Map();
        
        // Agrupar commits por fecha
        commits.forEach(commit => {
            const date = new Date(commit.commit.author?.date || commit.commit.committer?.date || new Date());
            const dateKey = date.toDateString();
            
            if (!commitsByDate.has(dateKey)) {
                commitsByDate.set(dateKey, []);
            }
            commitsByDate.get(dateKey).push(commit);
        });

        // Convertir grupos a formato para la vista
        commitsByDate.forEach((dayCommits, dateKey) => {
            const date = new Date(dateKey);
            const processedCommits = dayCommits.map(commit => this.processCommit(commit, lang));
            
            // Contar tipos de cambios
            const changeTypes = {
                features: processedCommits.filter(c => c.type === 'feature').length,
                fixes: processedCommits.filter(c => c.type === 'fix').length,
                improvements: processedCommits.filter(c => ['style', 'refactor', 'docs'].includes(c.type)).length,
                other: processedCommits.filter(c => ['chore', 'test', 'other'].includes(c.type)).length
            };

            // Generar versión basada en fecha
            const version = this.generateDateBasedVersion(date);

            groups.push({
                version: version,
                displayTitle: this.generateUpdateTitle(date, lang),
                date: date,
                formattedDate: date.toLocaleDateString(lang, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                relativeDate: this.getRelativeTime(date, lang),
                commits: processedCommits,
                changeTypes,
                totalChanges: processedCommits.length,
                summary: this.generateUpdateSummary(processedCommits, lang)
            });
        });

        return groups.slice(0, 10); // Limitar a las últimas 10 actualizaciones
    }

    private processCommit(commit: any, lang: string) {
        const subject = commit.commit.message.split('\n')[0];
        const body = commit.commit.message.split('\n').slice(1).join('\n').trim();
        
        // Extraer información del mensaje de commit
        const commitInfo = this.parseCommitMessage(subject);
        
        const commitDate = new Date(commit.commit.author?.date || commit.commit.committer?.date || new Date());
        
        return {
            fullHash: commit.sha,
            shortHash: commit.sha.substring(0, 7),
            author: commit.commit.author?.name || 'Unknown',
            email: commit.commit.author?.email || '',
            relativeDate: this.getRelativeTime(commitDate, lang),
            absoluteDate: commitDate.toLocaleDateString(lang, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            subject,
            body: body || '',
            url: commit.html_url,
            ...commitInfo
        };
    }

    private parseCommitMessage(subject: string) {
        let type = 'other';
        let icon = '🔧';
        let color = 'gray';
        let category = '';
        let description = subject;
        
        // Parsear formato: type(category): description
        const conventionalCommitMatch = subject.match(/^(\w+)(?:\(([^)]+)\))?: (.+)$/);
        if (conventionalCommitMatch) {
            const [, commitType, commitCategory, commitDescription] = conventionalCommitMatch;
            category = commitCategory || '';
            description = commitDescription;
            
            switch (commitType.toLowerCase()) {
                case 'feat':
                    type = 'feature';
                    icon = '✨';
                    color = 'green';
                    break;
                case 'fix':
                    type = 'fix';
                    icon = '🐛';
                    color = 'red';
                    break;
                case 'docs':
                    type = 'docs';
                    icon = '📚';
                    color = 'blue';
                    break;
                case 'style':
                    type = 'style';
                    icon = '💄';
                    color = 'purple';
                    break;
                case 'refactor':
                    type = 'refactor';
                    icon = '♻️';
                    color = 'yellow';
                    break;
                case 'test':
                    type = 'test';
                    icon = '🧪';
                    color = 'orange';
                    break;
                case 'chore':
                    type = 'chore';
                    icon = '🔧';
                    color = 'gray';
                    break;
            }
        } else {
            // Fallback para mensajes no convencionales
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
            }
        }
        
        return { type, icon, color, category, description };
    }

    private generateUpdateSummary(commits: any[], lang: string) {
        const features = commits.filter(c => c.type === 'feature');
        const fixes = commits.filter(c => c.type === 'fix');
        const improvements = commits.filter(c => ['style', 'refactor', 'docs'].includes(c.type));
        
        const summary = [];
        
        if (features.length > 0) {
            if (lang === 'es') {
                summary.push(`${features.length} nueva${features.length > 1 ? 's' : ''} función${features.length > 1 ? 'es' : ''}`);
            } else {
                summary.push(`${features.length} new feature${features.length > 1 ? 's' : ''}`);
            }
        }
        
        if (fixes.length > 0) {
            if (lang === 'es') {
                summary.push(`${fixes.length} corrección${fixes.length > 1 ? 'es' : ''}`);
            } else {
                summary.push(`${fixes.length} fix${fixes.length > 1 ? 'es' : ''}`);
            }
        }
        
        if (improvements.length > 0) {
            if (lang === 'es') {
                summary.push(`${improvements.length} mejora${improvements.length > 1 ? 's' : ''}`);
            } else {
                summary.push(`${improvements.length} improvement${improvements.length > 1 ? 's' : ''}`);
            }
        }
        
        return summary.join(', ') || (lang === 'es' ? 'Cambios diversos' : 'Various changes');
    }

    private generateDateBasedVersion(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}.${month}.${day}`;
    }

    private generateUpdateTitle(date: Date, lang: string): string {
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) {
            return lang === 'es' ? 'Actualización de Hoy' : 'Today\'s Update';
        } else if (diffInDays === 1) {
            return lang === 'es' ? 'Actualización de Ayer' : 'Yesterday\'s Update';
        } else if (diffInDays <= 7) {
            const dayName = date.toLocaleDateString(lang, { weekday: 'long' });
            const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
            return lang === 'es' ? `Actualización del ${capitalizedDay}` : `${capitalizedDay}'s Update`;
        } else if (diffInDays <= 30) {
            const weekNum = Math.ceil(diffInDays / 7);
            return lang === 'es' ? `Actualización de hace ${weekNum} semana${weekNum > 1 ? 's' : ''}` : `Update from ${weekNum} week${weekNum > 1 ? 's' : ''} ago`;
        } else {
            const monthName = date.toLocaleDateString(lang, { month: 'long' });
            const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
            return lang === 'es' ? `Actualización de ${capitalizedMonth}` : `${capitalizedMonth} Update`;
        }
    }

    private getRelativeTime(date: Date, lang: string): string {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) {
            return this.translationService.get('time.justNow', lang);
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            const template = this.translationService.get('time.minutesAgo', lang);
            return template.replace('{0}', minutes.toString());
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            const template = this.translationService.get('time.hoursAgo', lang);
            return template.replace('{0}', hours.toString());
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            const template = this.translationService.get('time.daysAgo', lang);
            return template.replace('{0}', days.toString());
        } else if (diffInSeconds < 31536000) {
            const months = Math.floor(diffInSeconds / 2592000);
            const template = this.translationService.get('time.monthsAgo', lang);
            return template.replace('{0}', months.toString());
        } else {
            const years = Math.floor(diffInSeconds / 31536000);
            const template = this.translationService.get('time.yearsAgo', lang);
            return template.replace('{0}', years.toString());
        }
    }
}