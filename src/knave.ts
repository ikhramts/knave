import { Table } from './model'
import { parse } from './sql-parser'
import * as fs from 'fs';
import * as path from 'path';

export namespace Knave {
    export function buildFile(filePath: string) : Promise<Table> {
        return new Promise((resolve, reject) => {
            let fullFilePath = path.resolve(filePath);
            if(!fs.existsSync(fullFilePath)) {
                throw "File '" + fullFilePath + "' does not exist";
            }

            fs.readFile(fullFilePath, (err, data) => {
                if (err)
                    reject (err);

                let model = <Table>parse(data.toString(), {});
                console.log(JSON.stringify(model));
                resolve(model);
            });
        });
    }
}