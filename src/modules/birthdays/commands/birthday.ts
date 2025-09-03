import { Command, CommandArgDefinition, CommandParameters, CommandType, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { MessageFlags } from "zumito-framework/discord";
import { BirthdayService } from "../services/BirthdayService";

export class Birthday extends Command {
    name = 'birthday';
    description = 'Set your birthday to receive greetings.';
    categories = ['configuration'];
    examples: string[] = ['12/05', '05-12-1999'];
    aliases = ['setbirthday', 'set-birthday'];
    args: CommandArgDefinition[] = [
        {
            name: 'date',
            type: 'string',
            optional: false,
            description: (framework: ZumitoFramework, lang: string) => framework.translations.get('command.birthday.arguments.date.description', lang),
        },
    ];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES'];
    type = CommandType.any;

    private svc: BirthdayService;

    constructor(
        svc: BirthdayService = ServiceContainer.getService(BirthdayService)
    ) {
        super();
        this.svc = svc;
    }

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const reply = async (content: any) => {
            if (interaction) return interaction.reply({ ...content, flags: MessageFlags.Ephemeral });
            return message?.reply(content);
        };

        const raw = args.get('date') as string;
        const parsed = this.parseDate(raw);
        if (!parsed) {
            return reply({ content: trans('invalid') });
        }

        const userId = (message?.author?.id || interaction?.user?.id)!;
        await this.svc.setUserBirthday(userId, parsed.month, parsed.day, parsed.year);

        const formatted = `${String(parsed.day).padStart(2, '0')}/${String(parsed.month).padStart(2, '0')}${parsed.year ? '/' + parsed.year : ''}`;
        return reply({ content: trans('saved', { date: formatted }) });
    }

    private parseDate(input: string): { day: number; month: number; year?: number } | null {
        const s = input.trim();
        // Accept: DD/MM, DD-MM, YYYY-MM-DD, DD/MM/YYYY, MM-DD, MM/DD
        let m: RegExpMatchArray | null;
        // YYYY-MM-DD
        m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
        if (m) {
            const year = parseInt(m[1]);
            const month = parseInt(m[2]);
            const day = parseInt(m[3]);
            if (this.validDate(year, month, day)) return { day, month, year };
        }
        // DD-MM or DD/MM or DD.MM (place hyphen at end to avoid range)
        m = s.match(/^(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2,4}))?$/);
        if (m) {
            const a = parseInt(m[1]);
            const b = parseInt(m[2]);
            const y = m[3] ? parseInt(m[3]) : undefined;
            // Try interpret as DD/MM first
            if (this.validDate(y || 2000, b, a)) return { day: a, month: b, year: y };
            // Fallback as MM/DD
            if (this.validDate(y || 2000, a, b)) return { day: b, month: a, year: y };
        }
        return null;
    }

    private validDate(year: number, month: number, day: number): boolean {
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;
        const dt = new Date(year, month - 1, day);
        return dt.getFullYear() === year && dt.getMonth() === month - 1 && dt.getDate() === day;
    }
}
