import { Table } from './model'
import { parse } from './sql-parser'
import * as fs from 'fs'

export namespace Knave {
    export function buildFile(filePath: string) : Promise<Table> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err)
                    reject (err);

                let model = <Table>parse(data, {});
                resolve(model);
            });
        });
    }
}