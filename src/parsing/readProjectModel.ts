import * as glob from 'glob';
import { Config } from '../config';
import { KnaveModel } from '../model';
import { parseFile } from './parseFile';
import { buildModel } from './buildModel';

export function readProjectModel(config: Config) : Promise<KnaveModel> {
    return new Promise<KnaveModel>((resolve, reject) => {
        let files = glob('**/*.sql', (err, files) => {
            if (err) throw err;

            let astPromises = files.map(file => parseFile(file));
            Promise.all(astPromises).then(fileDeclarations => {
                let model = buildModel(fileDeclarations);
                resolve(model);
            });
        });
    });
}
