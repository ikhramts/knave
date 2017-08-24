import { KnaveModel } from '../model';
import { DbConfig } from '../config';

export interface DbAdapter {
    queryModel: (config: DbConfig) => Promise<KnaveModel>;
    renderDiff: () => string;
    execute: (sql: String) => void;
}