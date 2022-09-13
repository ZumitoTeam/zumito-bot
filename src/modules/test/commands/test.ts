import { Command, CommandParameters } from "zumito-framework";
import { SelectMenuParameters } from "zumito-framework/dist/types/SelectMenuParameters";

export class Test extends Command {

    name = 'test';

    execute({ message, interaction, args, client, framework }: CommandParameters): void {
        debugger;
        message!.channel.send({
            content: framework.translations.get('command.test.message', 'en'),
        });
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {}
}