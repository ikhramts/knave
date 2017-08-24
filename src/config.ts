import * as fs from 'fs';

export class Config {
    dbType: string;
    host: string;
    database: string;
    port: number;
    username: string;
    password: string;

    constructor(init?: Partial<Config>) {
        if (init) (<any>Object).assign(this, init);
    }
}

function readConfigFile(filePath: string): Config {
    let configJson = fs.readFileSync(filePath).toString();
    return <Config>JSON.parse(configJson);
}