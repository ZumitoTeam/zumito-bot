import { ServiceContainer, ZumitoFramework } from 'zumito-framework';
import { createCanvas } from 'canvas';

export class PetService {
    private framework: ZumitoFramework;

    constructor() {
        this.framework = ServiceContainer.getService(ZumitoFramework);
    }

    async getPet(userId: string) {
        return await this.framework.database.models.Pet.findOne({ where: { userId } });
    }

    async createPet(userId: string) {
        const PetModel = this.framework.database.models.Pet;
        return await PetModel.create({ userId, hunger: 100, happiness: 100 });
    }

    async modifyPet(userId: string, changes: Partial<{ hunger: number; happiness: number }>) {
        const PetModel = this.framework.database.models.Pet;
        let pet = await this.getPet(userId);
        if (!pet) pet = await PetModel.create({ userId, hunger: 100, happiness: 100 });
        if (changes.hunger !== undefined) {
            pet.hunger = Math.max(0, Math.min(100, pet.hunger + changes.hunger));
        }
        if (changes.happiness !== undefined) {
            pet.happiness = Math.max(0, Math.min(100, pet.happiness + changes.happiness));
        }
        pet.lastUpdated = new Date();
        await pet.save();
        return pet;
    }

    async feedPet(userId: string, amount: number = 10) {
        return await this.modifyPet(userId, { hunger: amount });
    }

    async playPet(userId: string, amount: number = 10) {
        return await this.modifyPet(userId, { happiness: amount });
    }

    drawPet(pet: any) {
        const width = 200;
        const height = 200;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#b3e5fc';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 60, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(width / 2 - 20, height / 2 - 20, 8, 0, Math.PI * 2);
        ctx.arc(width / 2 + 20, height / 2 - 20, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2 + 10, 20, 0, Math.PI, false);
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.font = '16px sans-serif';
        ctx.fillText(`Hunger: ${pet.hunger}`, 10, height - 40);
        ctx.fillText(`Happiness: ${pet.happiness}`, 10, height - 20);

        return canvas;
    }
}
