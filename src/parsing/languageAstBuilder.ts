import * as fs from 'fs';
import * as path from 'path';

import * as AST from './AST';
import { parse } from './sql-parser';

export function parseFile(filePath: string) : Promise<AST.FileDeclarations> {
    return new Promise((resolve, reject) => {
        let fullFilePath = path.resolve(filePath);
        if(!fs.existsSync(fullFilePath)) {
            throw "File '" + fullFilePath + "' does not exist";
        }

        fs.readFile(fullFilePath, (err, data) => {
            if (err)
                reject (err);

            let model = <AST.FileDeclarations>parse(data.toString(), {});
            console.log(JSON.stringify(model));
            resolve(model);
        });
    });
}