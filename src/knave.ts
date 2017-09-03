import * as fs from 'fs';
import * as path from 'path';

import { Config, readDefaultConfigs } from './config';
import { MssqlAdapter } from './dbAdapters/mssqlAdapter';

export namespace Knave {
    export class DiffArgs {

    }

    export function diff(args: DiffArgs) {
        let config = readDefaultConfigs();
        let dbConfig = config.databases["default"]

        if (!dbConfig)
            throw "No default databse is set in .knaverc";

        let dbAdapter = new MssqlAdapter(dbConfig);
        dbAdapter.queryModel(dbConfig).then(model => {
            console.log(model)
        });

    }
}