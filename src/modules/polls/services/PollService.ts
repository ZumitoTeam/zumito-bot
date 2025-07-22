import { ServiceContainer, ZumitoFramework } from 'zumito-framework';

export class PollService {
    db: any;
    constructor(private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework)) {
        this.db = this.framework.database; // this.db.collection('polls');
    }

    async createPoll(data: {
        guildId: string;
        channelId: string;
        messageId: string;
        question: string;
        options: string[];
        authorId: string;
    }) {
        const pollDoc = {
            guildId: data.guildId,
            channelId: data.channelId,
            messageId: data.messageId,
            question: data.question,
            options: data.options,
            authorId: data.authorId,
            votes: {},
            ended: false,
            createdAt: new Date(),
        };
        const result = await this.db.collection('polls').insertOne(pollDoc);
        return { ...pollDoc, _id: result.insertedId };
    }

    async getPollByMessage(messageId: string) {
        return await this.db.collection('polls').findOne({ messageId });
    }

    async vote(messageId: string, userId: string, option: number) {
        const poll = await this.getPollByMessage(messageId);
        if (!poll || poll.ended) return null;
        // Update the votes field for the user
        const update = { $set: { [`votes.${userId}`]: option } };
        await this.db.collection('polls').updateOne({ messageId }, update);
        // Return the updated poll
        return await this.getPollByMessage(messageId);
    }

    async endPoll(messageId: string) {
        const poll = await this.getPollByMessage(messageId);
        if (!poll) return null;
        await this.db.collection('polls').updateOne({ messageId }, { $set: { ended: true } });
        return await this.getPollByMessage(messageId);
    }
}
