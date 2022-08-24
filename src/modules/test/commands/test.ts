import { Command, CommandParameters } from "zumito-framework";

export class Test extends Command {

    name = 'test';

    execute({ message, interaction, args, client, framework }: CommandParameters): void {
        message!.channel.send({
            content: framework.translations.get('command.test.message'),
        });
    }
}