import { Route, RouteMethod, ServiceContainer, TranslationManager, ZumitoFramework } from "zumito-framework";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import ejs from 'ejs';
import { Client, version as discordjsVersion } from "zumito-framework/discord";
import { LandingViewService } from "../services/LandingViewService";
import { DEFAULT_LANDING_MODULES } from "../definitions/defaultLandingModules";
import { DEFAULT_NAVBAR_LINKS } from "../definitions/defaultNavbarLinks";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class Landing extends Route {

    method = RouteMethod.get;
    path = '/';

    client: Client;

    constructor(
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private translationService: TranslationManager = ServiceContainer.getService(TranslationManager),
        private landingViewService: LandingViewService = ServiceContainer.getService(LandingViewService),
    ) {
        super();
        this.client = ServiceContainer.getService(Client);
    }

    async execute(req, res) {
        const client = this.client;
        const botUser = client.user;
        const botAvatar = botUser?.avatarURL?.() || botUser?.displayAvatarURL?.() || '/assets/images/banner.png';
        const botName = botUser?.username || process.env.BOT_NAME || "ZumitoBot";
        const botTag = botUser?.tag || botName;
        const botId = botUser?.id || '';
        const servers = client.guilds.cache.size;
        const users = client.guilds.cache.reduce((acc, g) => acc + (g.memberCount || 0), 0);
        const channels = client.channels?.cache?.size || 0;
        const version = discordjsVersion;
        const tagline = process.env.BOT_TAGLINE || "¡El bot de Discord todo en uno para tu comunidad!";
        const inviteUrl = process.env.BOT_INVITE_URL || `https://discord.com/oauth2/authorize?client_id=${botId}&scope=bot+applications.commands&permissions=8`;
        const supportUrl = process.env.BOT_SUPPORT_URL || "https://discord.gg/soporte";
        const githubUrl = process.env.BOT_GITHUB_URL || "https://github.com/zumito/zumito-bot";
        const host = process.env.HOST || req.header('host');

        // Comandos destacados (ahora desde la base de datos)
        const featuredCommands = (await this.framework.database.collection('featuredcommands').find({}).sort({ order: 1 }).toArray()).map(command => ({
            ...command,
            description: this.translationService.get('command.' + command.commandName + '.description', 'es')
        }));

        // Orden y activación de módulos de la landing
        const collection = this.framework.database.collection('landingmodules');
        let modules = await collection.find({ enabled: true }).sort({ order: 1 }).toArray();
        if (modules.length === 0) {
            await collection.insertMany(DEFAULT_LANDING_MODULES);
            modules = DEFAULT_LANDING_MODULES.filter(m => m.enabled);
        }

        const navCollection = this.framework.database.collection('landingnavbar');
        let navLinks = await navCollection.find().sort({ order: 1 }).toArray();
        if (navLinks.length === 0) {
            await navCollection.insertMany(DEFAULT_NAVBAR_LINKS);
            navLinks = DEFAULT_NAVBAR_LINKS;
        }
        
        // FAQs (pueden venir de config, aquí ejemplo hardcode)
        const faqs = [
            {
                q: '¿Cómo invito el bot a mi servidor?',
                a: 'Haz clic en el botón "Invitar al bot" arriba y sigue los pasos de Discord.',
            },
            {
                q: '¿El bot es gratis?',
                a: 'Sí, todas las funciones principales son gratuitas.',
            },
            {
                q: '¿Dónde puedo pedir soporte o sugerir funciones?',
                a: 'Únete al servidor de soporte usando el botón correspondiente.',
            },
            {
                q: '¿El bot tiene comandos de economía y juegos?',
                a: '¡Sí! Prueba comandos como /balance, /coinflip, /slots y más.',
            },
        ];

        // Configuración de colores y estilos (puede venir de config o env)
        const theme = await this.landingViewService.getTheme();

        const content = await ejs.renderFile(
            path.join(__dirname, "../views/landing.ejs"),
            {
                botName,
                botTag,
                botAvatar,
                tagline,
                servers,
                users,
                channels,
                version,
                inviteUrl,
                supportUrl,
                githubUrl,
                featuredCommands,
                faqs,
                theme,
                host,
                modules,
                t: this.translationService,
            }
        );

        const html = await this.landingViewService.render({
            title: "Inicio",
            content,
            extra: { theme, navLinks, botName }
        });
        res.send(html);
    }
}
