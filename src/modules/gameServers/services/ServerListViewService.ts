import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

export class ServerListViewService {
    private static layoutPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../views/layouts/server-list.ejs');

    async render({ title, content }: { title: string; content: string; }): Promise<string> {
        return await ejs.renderFile(ServerListViewService.layoutPath, { title, content });
    }
}
