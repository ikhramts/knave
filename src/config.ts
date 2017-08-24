import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export class Config {
    databases: {[id: string] : DbConfig};

    constructor(init? : Partial<Config>) {
        if (!init) return;
        Object.assign(this, init);
    }

    merge(other: Partial<Config>) {
        if (!this.databases) this.databases = {};
        
        if (other.databases) {
            for (let db in other.databases) {
                this.databases[db] = other.databases[db];
            }
        }
    }
}

export class DbConfig {
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

export function readDefaultConfigs(): Config {
    let projectConfig = readConfig('.knaverc');

    let userConfigPath = path.join(os.homedir(), ".knaverc");
    let userConfig = readConfig(userConfigPath);
    userConfig.merge(projectConfig);
    return userConfig;
}

function readConfig(filePath: string): Config {
    if (!fs.existsSync(filePath)) {
        console.log("no such file: " + filePath);
        return new Config();
    }

    let configJson = fs.readFileSync(filePath).toString();
    return new Config(<Config>JSON.parse(configJson));
}

