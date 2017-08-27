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
        let colType = extractType(dbColumn);

        let column = new model.Column({
            name: dbColumn.columnName,
            columnType: colType,
            isNotNull: !dbColumn.isNullable
        });
        
        if (dbColumn.isPrimaryKey) {
            table.primaryKey.columns.push(column);
        }

        table.columns.push(column);
    }

    let tables = Object.keys(tablesByName).map(name => tablesByName[name]);
    
    return new model.KnaveModel({
        tables: tables,
    });
}

function getOrAddTable(tablesByName: {[id: string] : model.Table }, name: string) {
    var table = tablesByName[name];
    
    if (!table) {
        table = new model.Table();
        table.name = name;
        table.primaryKey = new model.Index();
        
        tablesByName[name] = table;
    }

    return table;
}

function extractType(dbColumn: MssqlColumnDef) : model.ColumnType {
    let typeArgs: number[] = [];

    switch(dbColumn.columnType) {
        case("decimal"):
        case("numeric"):
            typeArgs.push(dbColumn.precision);
            typeArgs.push(dbColumn.scale);
            break;
        
        case("float"):
        case("real"):
            typeArgs.push(dbColumn.precision);
            break;

        case("char"):
        case("varchar"):
        case("binary"):
        case("varbinary"):
            typeArgs.push(dbColumn.maxLength);
            break;
                
        case("nchar"):
        case("nvarchar"):
            if (dbColumn.maxLength == -1) typeArgs.push(dbColumn.maxLength);
            else typeArgs.push(Math.ceil(dbColumn.maxLength / 2));
            break;
            
    }

    let colType = new model.ColumnType({
        name: dbColumn.columnType,
        args: typeArgs
    });

    return colType;
    

}