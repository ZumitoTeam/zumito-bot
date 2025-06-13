import { ServiceContainer, ZumitoFramework } from 'zumito-framework';

export class PollService {
    private framework: ZumitoFramework;
    constructor() {
        this.framework = ServiceContainer.getService(ZumitoFramework);
    }

    async createPoll(data: {
        guildId: string;
        channelId: string;
        messageId: string;
        question: string;
        options: string[];
        authorId: string;
    }) {
        const PollModel = this.framework.database.models.Poll;
        return await PollModel.create({
            guildId: data.guildId,
            channelId: data.channelId,
            messageId: data.messageId,
            question: data.question,
            options: data.options,
            authorId: data.authorId,
            votes: {},
            ended: false,
            createdAt: new Date(),
        });
    }

    async getPollByMessage(messageId: string) {
        const PollModel = this.framework.database.models.Poll;
        return await PollModel.findOne({ where: { messageId } });
    }

    async vote(messageId: string, userId: string, option: number) {
        const poll = await this.getPollByMessage(messageId);
        if (!poll || poll.ended) return null;
        poll.votes[userId] = option;
        await poll.save();
        return poll;
    }

    async endPoll(messageId: string) {
        const poll = await this.getPollByMessage(messageId);
        if (!poll) return null;
        poll.ended = true;
        await poll.save();
        return poll;
    }
}
