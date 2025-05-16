import { bundle, renderMedia } from "@remotion/renderer";
import path from "path";
import { Command, CommandParameters } from "zumito-framework";
import fs from "fs";
import { RemotionRoot } from "../remotion/congratulationComposition.tsx";

export class VideoCommand extends Command {
  async execute({ interaction, args }: CommandParameters): Promise<void> {
    const texto = "¡Hola mundo!";
    if (interaction) await interaction.deferReply();

    const outputPath = `/tmp/remotion-video-${Date.now()}.mp4`;

    try {
      const entry = path.resolve("src/remotion"); // donde está tu RemotionRoot
      const bundleLocation = await bundle({
        entryPoint: entry,
        webpackOverride: (config) => config,
        onProgress: () => {},
        outDir: path.resolve(".remotion"),
        enableCaching: true,
      });

      await renderMedia({
        serveUrl: bundleLocation,
        codec: "h264",
        composition: RemotionRoot,
        outputLocation: outputPath,
        inputProps: {
          text: texto,
        },
      });

      await interaction.editReply({
        files: [outputPath],
      });
    } catch (e) {
      console.error(e);
      await interaction.editReply("❌ Error al generar el vídeo.");
    } finally {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }
  }
}
