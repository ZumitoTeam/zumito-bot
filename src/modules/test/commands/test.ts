import { Command, CommandParameters } from "zumito-framework";

export class Test extends Command {

    name = 'test';

    execute({ message, interaction, args, client }: CommandParameters): void {
        message!.channel.send({
            content: "Test command executed",
        });
    }
}