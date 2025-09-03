import { Attachment, AttachmentBuilder, GuildMember } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType, ServiceContainer } from "zumito-framework";
import { BlurService } from "../services/imageProcessor/BlurService.js";

export class BlurImageCommand extends Command {
    name = "blur";
    description = "Blur an attached image or a mentioned user's avatar.";
    categories = ["utilities"];
    examples: string[] = ["@user", "(with an image attached)"];
    usage = "blur [user] [intensity]";
    args: CommandArgDefinition[] = [
        { name: "user", type: "member", optional: true },
        { name: "intensity", type: "integer", optional: true }
    ];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'];
    type = CommandType.any;

    private blurService: BlurService;

    constructor() {
        super();
        this.blurService = ServiceContainer.getService(BlurService) as BlurService;
    }

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        // Resolve intensity (sigma for sharp.blur), clamp between 1 and 50 (typical good range)
        let intensity = Number(args.get('intensity') ?? 12);
        if (Number.isNaN(intensity)) intensity = 12;
        intensity = Math.max(1, Math.min(50, intensity));

        // Try attachment first (message-based); then mentioned user; finally author
        let imageUrl: string | null = null;
        let filename = 'blurred.png';

        if (message && message.attachments && message.attachments.size > 0) {
            const att: Attachment | undefined = [...message.attachments.values()].find(a => {
                const ct = (a as any).contentType || '';
                const name = (a as any).name || '';
                return String(ct).startsWith('image/') || /\.(png|jpe?g|webp|gif)$/i.test(name);
            });
            if (att) {
                imageUrl = (att as any).url;
                const n = (att as any).name as string | undefined;
                if (n) filename = `blurred-${n.replace(/[^a-zA-Z0-9_.-]+/g, '')}`;
            }
        }

        if (!imageUrl) {
            const member: GuildMember | undefined = args.get('user') || (message || interaction as any)?.member;
            const user = member?.user || interaction?.user || message?.author;
            if (user && typeof user.displayAvatarURL === 'function') {
                imageUrl = user.displayAvatarURL({ forceStatic: true, size: 512 });
                filename = `blurred-${user.id}.png`;
            }
        }

        if (!imageUrl) {
            (message || interaction)?.reply({ content: trans('noimage'), allowedMentions: { repliedUser: false } });
            return;
        }

        try {
            const res = await fetch(imageUrl);
            const buf = Buffer.from(await res.arrayBuffer());
            const out = await this.blurService.blur(buf, intensity);
            const attachment = new AttachmentBuilder(out, { name: filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? filename : 'blurred.png' });
            (message || interaction)?.reply({ files: [attachment], allowedMentions: { repliedUser: false } });
        } catch (e) {
            (message || interaction)?.reply({ content: trans('failed'), allowedMentions: { repliedUser: false } });
        }
    }
}

