import { ActivityType } from "discord.js";
import { StatusManagerOptions } from "zumito-framework";

export const statusOptions: StatusManagerOptions = {
    statuses: [{
        status: 'online',
        activities: [{
            name: 'z-help',
            type: ActivityType.Playing
        }]
    }],
    RuledStatuses: [],
    updateInterval: 15000,
    order: "sequential"
}