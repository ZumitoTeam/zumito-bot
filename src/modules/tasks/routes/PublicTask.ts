import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { TaskService } from "../services/TaskService";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class PublicTask extends Route {
    method = RouteMethod.get;
    path = '/tasks/:id';

    constructor(
        private taskService: TaskService = ServiceContainer.getService(TaskService),
    ) { super(); }

    async execute(req: any, res: any) {
        const id = String(req.params.id || '');
        const task = await this.taskService["col"]().findOne({ id }).catch(() => null);
        if (!task || task.public !== true) return res.status(404).send('Task not found');
        const html = await ejs.renderFile(path.resolve(__dirname, '../views/public_task.ejs'), { task, origin: `${req.protocol}://${req.get('host')}` });
        res.send(html);
    }
}

