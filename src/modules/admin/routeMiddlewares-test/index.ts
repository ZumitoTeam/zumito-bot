import { RouteMiddleware } from 'zumito-framework';
import { express } from 'zumito-framework/express';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import path from 'path';
    
const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname, path.resolve(__dirname + '/../svelte/build'));

export class Index extends RouteMiddleware {
    path = "/admin";
    callback = express.static(path.resolve(__dirname + '/../svelte/build'));

}