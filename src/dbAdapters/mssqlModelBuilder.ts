import * as model from '../model';

export class MssqlColumnDef {
    tableName: string;
    columnName: string;
    columnType: string;
    maxLength: number;
    precision: number;
    scale: number;
    isNullable: boolean;
    isPrimaryKey: boolean;

    constructor(init?: Partial<MssqlColumnDef>) {
        if (init) Object.assign(this, init);
    }
};

export function buildModel(dbColumns: MssqlColumnDef[]) : model.KnaveModel {
    return new model.KnaveModel();
}
