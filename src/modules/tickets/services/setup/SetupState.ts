export interface SetupState {
    guildId: string;
    name?: string;
    supportRoles?: string[];
    transcriptChannelId?: string | null;
    openCategoryId?: string | null;
    closedCategoryId?: string | null;
    sendChannelId?: string;
}
