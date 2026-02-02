import { EmbedBuilder } from 'discord.js';

export class EmbedBuilderService {
    buildExampleEmbed(): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle('¡Hola! Esto es un Embed de Ejemplo')
            .setDescription('Este embed demuestra cómo se puede estructurar un mensaje con información rica. Incluye título, descripción, campos y más.')
            .setColor(0x0099ff)
            .addFields(
                { name: 'Campo 1', value: 'Valor del campo 1', inline: true },
                { name: 'Campo 2', value: 'Valor del campo 2', inline: true },
                { name: 'Campo 3', value: 'Valor del campo 3', inline: false }
            )
            .setFooter({ text: 'Pie de página del embed' })
            .setTimestamp();
    }

    buildResponseEmbed(name: string, description: string): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle('Respuesta del Modal')
            .setDescription(`¡Gracias por participar, ${name}!`)
            .addFields(
                { name: 'Nombre', value: name, inline: true },
                { name: 'Descripción', value: description, inline: false }
            )
            .setColor(0x00ff00)
            .setTimestamp();
    }
}