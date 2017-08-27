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
    let tablesByName: {[id: string] : model.Table } = {};
    
    for (let dbColumn of dbColumns) {
        let table = getOrAddTable(tablesByName, dbColumn.tableName);
    }
    
    return new model.KnaveModel();
}

function makeTable(name: string) {

}

function getOrAddTable(tablesByName: {[id: string] : model.Table }, name: string) {
    var table = tablesByName[name];
    
    if (!table) {
        table = new model.Table();
        table.name = name;
        table.primaryKey = new model.Index();
    }

    return table;
}
