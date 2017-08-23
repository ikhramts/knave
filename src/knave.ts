import * as fs from 'fs';
import * as path from 'path';

import * as AST from './AST';
import { parse } from './sql-parser';

export namespace Knave {
    export function parseFile(filePath: string) : Promise<AST.Table> {
        return new Promise((resolve, reject) => {
            let fullFilePath = path.resolve(filePath);
            if(!fs.existsSync(fullFilePath)) {
                throw "File '" + fullFilePath + "' does not exist";
            }

            fs.readFile(fullFilePath, (err, data) => {
                if (err)
                    reject (err);

                let model = <AST.Table>parse(data.toString(), {});
                console.log(JSON.stringify(model));
                resolve(model);
            });
        });
    }
}