import * as AST from './AST';
import { Table, KnaveModel, Column, ColumnType, Index } from '../model'

export function buildModel(fileDeclarations: AST.FileDeclarations[]) : KnaveModel {
    let model = new KnaveModel();
    model.tables = buildTables(fileDeclarations);
    return model;
}

export function buildTables(fileDeclarations: AST.FileDeclarations[]) : Table[] {
    let tables: Table[] = [];

    for (let file of fileDeclarations) {
        for (let astDeclaration of file.declarations) {
            let astTable = astDeclaration as AST.Table;
            tables.push(buildTable(astTable));
        }
    }

    return tables;
}

export function buildTable(astTable: AST.Table) : Table {
    let table = new Table();
    table.name = astTable.header.name;

    let primaryKey = new Index();
    table.primaryKey = primaryKey;

    for (let bodyLine of astTable.body.lines) {
        let columnDef = bodyLine as AST.ColumnDefinition;
        let typeArgs = columnDef.type.args.map(arg => arg.intLiteral);

        let column = new Column({
            name: columnDef.name,
            columnType: new ColumnType({ name: columnDef.type.name, args: typeArgs}),
            isNotNull: !!columnDef.constraints.notNull,
        });
        
        table.columns.push(column);

        if (columnDef.constraints.primaryKey) {
            primaryKey.columns.push(column);
        }
    }

    return table;
}