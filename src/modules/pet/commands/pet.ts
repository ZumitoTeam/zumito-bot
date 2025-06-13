import { Command, CommandParameters, ServiceContainer } from 'zumito-framework';
import { AttachmentBuilder } from 'discord.js';
import { PetService } from '../services/PetService';

export class PetCommand extends Command {
    name = 'pet';
    description = 'View and take care of your virtual pet';
    categories = ['fun'];
    usage = 'pet [feed|play]';
    args = [
        { name: 'action', type: 'string', optional: true },
    ];

    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const user = message?.author || interaction?.user;
        if (!user) return;

        const action = (args.get('action') || '').toLowerCase();
        const petService = ServiceContainer.getService(PetService) as PetService;

        let pet = await petService.getPet(user.id).catch(() => null);
        if (!pet) pet = await petService.createPet(user.id);

        let reply = '';
        if (action === 'feed') {
            pet = await petService.feedPet(user.id);
            reply = 'You fed your pet!';
        } else if (action === 'play') {
            pet = await petService.playPet(user.id);
            reply = 'You played with your pet!';
        }

        const canvas = petService.drawPet(pet);
        const buffer = canvas.toBuffer();
        const attachment = new AttachmentBuilder(buffer, { name: 'pet.png' });

        if (message) {
            await message.reply({ content: reply || undefined, files: [attachment] });
            return;
        }
        if (interaction) {
            await interaction.reply({ content: reply || undefined, files: [attachment] });
            return;
        }
    }
}
