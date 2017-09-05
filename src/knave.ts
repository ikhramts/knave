import * as fs from 'fs';
import * as path from 'path';

import { Config, readDefaultConfigs } from './config';
import { MssqlAdapter } from './dbAdapters/mssqlAdapter';
import { mssqlRenderDiff } from './dbAdapters/mssqlRenderDiff';
import { KnaveModel, calcModelDiff } from './model';

import { readProjectModel } from './parsing';

export class DiffArgs {

}

export function diff(args: DiffArgs) {
    let config = readDefaultConfigs();
    let projectModel : KnaveModel;
    let dbModel : KnaveModel;

    readProjectModel(config).then(resultProjectModel => {
        projectModel = resultProjectModel;
        return readDbModel(config);
    }).then(resultDbModel => {
        dbModel = resultDbModel;
        let modelDiff = calcModelDiff(projectModel, dbModel);
        let diffSql = mssqlRenderDiff(modelDiff); 
        fs.writeFile('./diff.sql', diffSql, err => {
            if (err)
                console.log("Could not write to file");
            else   
                console.log("Done.");
        });
    });


    // Read config
    // Then: read + parse all project files & get model + errors
    // Then: read and process DB model
    // Then: diff db model vs project model
    // Then: render diff into a string
    // Then: write diff into diff.sql file.
    // Then: done
}

export function readDbModel(config: Config) : Promise<KnaveModel> {
    return new Promise<KnaveModel>((resolve, reject) => {
        let dbConfig = config.databases["default"]
        
        if (!dbConfig)
            throw "No default databse is set in .knaverc";

        let dbAdapter = new MssqlAdapter(dbConfig);
        dbAdapter.queryModel(dbConfig).then(model => {
            resolve(model);
        });
    });
}