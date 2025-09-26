import { ServiceContainer } from "zumito-framework";
import {
    CategoryChannel,
    ChannelType,
    Client,
    Guild,
    GuildBasedChannel,
    PermissionsBitField,
    Role,
} from "zumito-framework/discord";

export type BackupImportType = "roles" | "channels" | "full";

export interface BackupImportResult {
    createdRoles: number;
    updatedRoles: number;
    createdCategories: number;
    createdChannels: number;
}

interface RoleDefinition {
    name: string;
    color?: string | number;
    permissions?: unknown;
    hoist?: boolean;
    mentionable?: boolean;
    position?: number;
    unicodeEmoji?: string;
}

interface ChannelDefinition {
    name: string;
    type?: string;
    topic?: string;
    nsfw?: boolean;
    rateLimitPerUser?: number;
    bitrate?: number;
    userLimit?: number;
    parent?: string;
    category?: string;
    position?: number;
}

interface CategoryDefinition {
    name: string;
    position?: number;
    channels?: ChannelDefinition[];
}

interface ChannelExtraction {
    categories: CategoryDefinition[];
    channels: ChannelDefinition[];
}

export class BackupImportError extends Error {
    constructor(public code: string, message?: string) {
        super(message || code);
    }
}

export class BackupImportService {
    private client: Client;

    constructor() {
        this.client = ServiceContainer.getService(Client);
    }

    async importFromJson(guildId: string, type: BackupImportType, payload: unknown): Promise<BackupImportResult> {
        const guild = await this.ensureGuild(guildId);

        switch (type) {
            case "roles":
                return this.importRoles(guild, payload);
            case "channels":
                return this.importChannels(guild, payload);
            case "full":
                return this.importFull(guild, payload);
            default:
                throw new BackupImportError("unknownType");
        }
    }

    private async ensureGuild(guildId: string): Promise<Guild> {
        const cached = this.client.guilds.cache.get(guildId);
        if (cached) return cached;

        try {
            const fetched = await this.client.guilds.fetch(guildId);
            if (!fetched) throw new BackupImportError("guildNotFound");
            return fetched;
        } catch (error) {
            throw new BackupImportError("guildNotFound", (error as Error).message);
        }
    }

    private async importRoles(guild: Guild, payload: unknown): Promise<BackupImportResult> {
        const result: BackupImportResult = {
            createdRoles: 0,
            updatedRoles: 0,
            createdCategories: 0,
            createdChannels: 0,
        };

        const roleDefinitions = this.extractRoleDefinitions(payload);
        if (roleDefinitions.length === 0) return result;

        const positionUpdates: Array<{ role: Role; position: number }> = [];

        try {
            for (const roleDefinition of roleDefinitions) {
                const normalized = this.normalizeRoleDefinition(roleDefinition);
                if (!normalized || normalized.name === "@everyone") continue;

                const existing = guild.roles.cache.find(role => role.name === normalized.name);
                const roleData: Record<string, unknown> = {
                    name: normalized.name,
                };

                if (normalized.color !== undefined) roleData.color = normalized.color;
                if (normalized.permissions !== undefined) roleData.permissions = normalized.permissions;
                if (normalized.hoist !== undefined) roleData.hoist = normalized.hoist;
                if (normalized.mentionable !== undefined) roleData.mentionable = normalized.mentionable;
                if (normalized.unicodeEmoji !== undefined) roleData.unicodeEmoji = normalized.unicodeEmoji;

                let role: Role;
                if (existing) {
                    role = await existing.edit(roleData).catch(error => {
                        throw new BackupImportError("roleEditFailed", (error as Error).message);
                    });
                    result.updatedRoles += 1;
                } else {
                    role = await guild.roles.create(roleData).catch(error => {
                        throw new BackupImportError("roleCreateFailed", (error as Error).message);
                    });
                    result.createdRoles += 1;
                }

                if (normalized.position !== undefined) {
                    positionUpdates.push({ role, position: normalized.position });
                }
            }

            for (const update of positionUpdates) {
                await update.role.setPosition(update.position).catch(error => {
                    throw new BackupImportError("rolePositionFailed", (error as Error).message);
                });
            }
        } catch (error) {
            if (error instanceof BackupImportError) throw error;
            throw new BackupImportError("roleImportFailed", (error as Error).message);
        }

        return result;
    }

    private async importChannels(guild: Guild, payload: unknown): Promise<BackupImportResult> {
        const result: BackupImportResult = {
            createdRoles: 0,
            updatedRoles: 0,
            createdCategories: 0,
            createdChannels: 0,
        };

        const { categories, channels } = this.extractChannelDefinitions(payload);
        if (categories.length === 0 && channels.length === 0) return result;

        const categoryCache = new Map<string, CategoryChannel>();
        guild.channels.cache
            .filter(channel => channel.type === ChannelType.GuildCategory)
            .forEach(channel => {
                categoryCache.set(channel.name.toLowerCase(), channel as CategoryChannel);
            });

        try {
            for (const categoryDefinition of categories) {
                const { category, created } = await this.createOrUpdateCategory(guild, categoryDefinition);
                categoryCache.set(category.name.toLowerCase(), category);
                if (created) {
                    result.createdCategories += 1;
                }

                if (Array.isArray(categoryDefinition.channels)) {
                    for (const channelDefinition of categoryDefinition.channels) {
                        const operation = await this.createOrUpdateChannel(guild, channelDefinition, category.id);
                        if (operation.created) {
                            result.createdChannels += 1;
                        }
                    }
                }
            }

            for (const channelDefinition of channels) {
                const parentReference = channelDefinition.parent || channelDefinition.category;
                let parentId: string | undefined;
                if (parentReference) {
                    const category = this.findCategoryByReference(parentReference, categoryCache, guild);
                    parentId = category?.id;
                }

                const operation = await this.createOrUpdateChannel(guild, channelDefinition, parentId);
                if (operation.created) {
                    result.createdChannels += 1;
                }
            }
        } catch (error) {
            if (error instanceof BackupImportError) throw error;
            throw new BackupImportError("channelImportFailed", (error as Error).message);
        }

        return result;
    }

    private async importFull(guild: Guild, payload: unknown): Promise<BackupImportResult> {
        const result: BackupImportResult = {
            createdRoles: 0,
            updatedRoles: 0,
            createdCategories: 0,
            createdChannels: 0,
        };

        const rolesResult = await this.importRoles(guild, payload);
        result.createdRoles += rolesResult.createdRoles;
        result.updatedRoles += rolesResult.updatedRoles;

        const channelsResult = await this.importChannels(guild, payload);
        result.createdCategories += channelsResult.createdCategories;
        result.createdChannels += channelsResult.createdChannels;

        return result;
    }

    private extractRoleDefinitions(payload: unknown): RoleDefinition[] {
        if (!payload) return [];
        if (Array.isArray(payload)) {
            return payload.filter(item => typeof item === "object" && item !== null) as RoleDefinition[];
        }
        if (typeof payload === "object") {
            const roles = (payload as Record<string, unknown>).roles;
            if (roles === undefined) return [];
            if (!Array.isArray(roles)) throw new BackupImportError("invalidRolesPayload");
            return roles.filter(item => typeof item === "object" && item !== null) as RoleDefinition[];
        }
        throw new BackupImportError("invalidRolesPayload");
    }

    private extractChannelDefinitions(payload: unknown): ChannelExtraction {
        if (!payload) {
            return { categories: [], channels: [] };
        }

        if (Array.isArray(payload)) {
            return {
                categories: [],
                channels: payload.filter(item => typeof item === "object" && item !== null) as ChannelDefinition[],
            };
        }

        if (typeof payload === "object") {
            const obj = payload as Record<string, unknown>;
            const categoriesRaw = obj.categories;
            const channelsRaw = obj.channels;

            const categories: CategoryDefinition[] = [];
            const channels: ChannelDefinition[] = [];

            if (categoriesRaw !== undefined) {
                if (!Array.isArray(categoriesRaw)) throw new BackupImportError("invalidCategoriesPayload");
                for (const item of categoriesRaw) {
                    if (typeof item === "object" && item !== null) {
                        const category = item as CategoryDefinition;
                        if (!Array.isArray(category.channels)) {
                            category.channels = Array.isArray((item as any).channels)
                                ? (item as any).channels as ChannelDefinition[]
                                : [];
                        }
                        categories.push(category);
                    }
                }
            }

            if (channelsRaw !== undefined) {
                if (!Array.isArray(channelsRaw)) throw new BackupImportError("invalidChannelsPayload");
                channels.push(...channelsRaw.filter(item => typeof item === "object" && item !== null) as ChannelDefinition[]);
            }

            return { categories, channels };
        }

        throw new BackupImportError("invalidChannelsPayload");
    }

    private normalizeRoleDefinition(definition: RoleDefinition | undefined): (RoleDefinition & { permissions?: bigint }) | null {
        if (!definition || typeof definition !== "object") return null;

        const name = typeof definition.name === "string" ? definition.name.trim() : undefined;
        if (!name) throw new BackupImportError("roleNameRequired");

        const normalized: RoleDefinition & { permissions?: bigint } = {
            name,
        };

        if (definition.color !== undefined) normalized.color = this.resolveRoleColor(definition.color);
        if (definition.permissions !== undefined) normalized.permissions = this.resolveRolePermissions(definition.permissions);
        if (typeof definition.hoist === "boolean") normalized.hoist = definition.hoist;
        if (typeof definition.mentionable === "boolean") normalized.mentionable = definition.mentionable;
        if (typeof definition.position === "number" && Number.isFinite(definition.position)) normalized.position = definition.position;
        if (typeof definition.unicodeEmoji === "string") normalized.unicodeEmoji = definition.unicodeEmoji;

        return normalized;
    }

    private resolveRoleColor(color: string | number): number {
        if (typeof color === "number") return color;
        const value = color.trim();
        if (value.startsWith("#")) {
            const parsed = Number.parseInt(value.slice(1), 16);
            if (!Number.isNaN(parsed)) return parsed;
        }
        const numeric = Number(value);
        if (!Number.isNaN(numeric)) return numeric;
        throw new BackupImportError("invalidRoleColor");
    }

    private resolveRolePermissions(permissions: unknown): bigint {
        try {
            return PermissionsBitField.resolve(permissions as any);
        } catch (error) {
            throw new BackupImportError("invalidRolePermissions", (error as Error).message);
        }
    }

    private async createOrUpdateCategory(guild: Guild, definition: CategoryDefinition): Promise<{ category: CategoryChannel; created: boolean }> {
        if (!definition || typeof definition !== "object" || typeof definition.name !== "string" || definition.name.trim().length === 0) {
            throw new BackupImportError("categoryNameRequired");
        }

        const name = definition.name.trim();
        let category = guild.channels.cache.find(channel => channel.type === ChannelType.GuildCategory && channel.name === name) as CategoryChannel | undefined;
        let created = false;

        if (!category) {
            category = await guild.channels.create({
                name,
                type: ChannelType.GuildCategory,
            }).catch(error => {
                throw new BackupImportError("categoryCreateFailed", (error as Error).message);
            }) as CategoryChannel;
            created = true;
        }

        if (definition.position !== undefined && Number.isFinite(definition.position)) {
            await category.setPosition(definition.position).catch(error => {
                throw new BackupImportError("categoryPositionFailed", (error as Error).message);
            });
        }

        return { category, created };
    }

    private async createOrUpdateChannel(guild: Guild, definition: ChannelDefinition, parentId?: string): Promise<{ channel: GuildBasedChannel; created: boolean }> {
        if (!definition || typeof definition !== "object" || typeof definition.name !== "string" || definition.name.trim().length === 0) {
            throw new BackupImportError("channelNameRequired");
        }

        const name = definition.name.trim();
        const channelType = this.resolveChannelType(definition.type);
        if (channelType === ChannelType.GuildCategory) {
            throw new BackupImportError("channelCategoryAsChannel");
        }

        const existing = guild.channels.cache.find(channel => channel.name === name && channel.type === channelType && (!parentId || channel.parentId === parentId));
        const options = this.buildChannelOptions(definition, channelType, parentId, true);
        let channel: GuildBasedChannel;
        let created = false;

        if (existing) {
            channel = existing;
            const updateOptions = this.buildChannelOptions(definition, channelType, parentId, false);
            await channel.edit(updateOptions).catch(error => {
                throw new BackupImportError("channelUpdateFailed", (error as Error).message);
            });
            if (definition.position !== undefined && Number.isFinite(definition.position)) {
                await channel.setPosition(definition.position).catch(error => {
                    throw new BackupImportError("channelPositionFailed", (error as Error).message);
                });
            }
        } else {
            channel = await guild.channels.create(options).catch(error => {
                throw new BackupImportError("channelCreateFailed", (error as Error).message);
            });
            created = true;
            if (definition.position !== undefined && Number.isFinite(definition.position)) {
                await channel.setPosition(definition.position).catch(error => {
                    throw new BackupImportError("channelPositionFailed", (error as Error).message);
                });
            }
        }

        return { channel, created };
    }

    private buildChannelOptions(definition: ChannelDefinition, channelType: ChannelType, parentId: string | undefined, includeType: boolean): Record<string, unknown> {
        const options: Record<string, unknown> = {
            name: definition.name.trim(),
        };

        if (includeType) {
            options.type = channelType;
        }

        if (parentId && channelType !== ChannelType.GuildCategory) {
            options.parent = parentId;
        }

        if (definition.topic !== undefined && this.isTopicSupported(channelType)) {
            options.topic = definition.topic;
        }

        if (definition.nsfw !== undefined && this.isNsfwSupported(channelType)) {
            options.nsfw = definition.nsfw;
        }

        if (definition.rateLimitPerUser !== undefined && this.isSlowmodeSupported(channelType)) {
            options.rateLimitPerUser = definition.rateLimitPerUser;
        }

        if (definition.userLimit !== undefined && this.isVoiceType(channelType)) {
            options.userLimit = definition.userLimit;
        }

        if (definition.bitrate !== undefined && this.isVoiceType(channelType)) {
            options.bitrate = definition.bitrate;
        }

        return options;
    }

    private resolveChannelType(type?: string): ChannelType {
        if (!type) return ChannelType.GuildText;
        const value = type.toLowerCase();
        switch (value) {
            case "text":
            case "guildtext":
                return ChannelType.GuildText;
            case "voice":
            case "guildvoice":
                return ChannelType.GuildVoice;
            case "announcement":
            case "news":
            case "guildannouncement":
                return ChannelType.GuildAnnouncement;
            case "stage":
            case "guildstagevoice":
                return ChannelType.GuildStageVoice;
            case "forum":
            case "guildforum":
                return ChannelType.GuildForum;
            case "media":
            case "guildmedia":
                return ChannelType.GuildMedia;
            case "category":
            case "guildcategory":
                return ChannelType.GuildCategory;
            default:
                throw new BackupImportError("channelUnsupportedType", type);
        }
    }

    private findCategoryByReference(reference: string, cache: Map<string, CategoryChannel>, guild: Guild): CategoryChannel | undefined {
        const normalized = reference.trim().toLowerCase();
        if (cache.has(normalized)) return cache.get(normalized);

        const byId = guild.channels.cache.get(reference);
        if (byId && byId.type === ChannelType.GuildCategory) {
            return byId as CategoryChannel;
        }

        const byName = guild.channels.cache.find(channel => channel.type === ChannelType.GuildCategory && channel.name.toLowerCase() === normalized);
        if (byName) {
            return byName as CategoryChannel;
        }

        return undefined;
    }

    private isVoiceType(type: ChannelType): boolean {
        return type === ChannelType.GuildVoice || type === ChannelType.GuildStageVoice;
    }

    private isTopicSupported(type: ChannelType): boolean {
        return type === ChannelType.GuildText || type === ChannelType.GuildAnnouncement || type === ChannelType.GuildForum || type === ChannelType.GuildMedia;
    }

    private isNsfwSupported(type: ChannelType): boolean {
        return type === ChannelType.GuildText || type === ChannelType.GuildAnnouncement || type === ChannelType.GuildForum || type === ChannelType.GuildMedia;
    }

    private isSlowmodeSupported(type: ChannelType): boolean {
        return type === ChannelType.GuildText || type === ChannelType.GuildAnnouncement || type === ChannelType.GuildForum || type === ChannelType.GuildMedia;
    }
}
