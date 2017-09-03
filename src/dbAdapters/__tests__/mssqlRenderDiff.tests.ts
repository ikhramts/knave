import * as model from '../../model';
import { mssqlRenderDiff } from '../mssqlRenderDiff';

describe("mssqlRenderDiff()", () => {
    it("Create table without primary key", () => {
        let modelDiff = new model.ModelDiff();
        modelDiff.addedTables.push(getTestTable());

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Create table with two columns", () => {
        let table = getTestTable();
        table.columns.push(getTestColumn('col2', 'type2'));
        let modelDiff = new model.ModelDiff();
        modelDiff.addedTables.push(table);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Create table with a primary key", () => {
        let table = getTestTable();
        let primaryKey = new model.Index();
        primaryKey.columns.push(table.columns[0]);
        table.primaryKey = primaryKey;

        let modelDiff = new model.ModelDiff();
        modelDiff.addedTables.push(table);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Create table with a primary key that references two columns", () => {
        let table = getTestTable();
        table.columns.push(getTestColumn('col2', 'type2'));

        let primaryKey = new model.Index();
        primaryKey.columns.push(table.columns[0]);
        primaryKey.columns.push(table.columns[1]);
        table.primaryKey = primaryKey;

        let modelDiff = new model.ModelDiff();
        modelDiff.addedTables.push(table);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Create table with primary key that has a name", () => {
        let table = getTestTable();
        let primaryKey = new model.Index({name: 'PK_someName'});
        primaryKey.columns.push(table.columns[0]);
        table.primaryKey = primaryKey;

        let modelDiff = new model.ModelDiff();
        modelDiff.addedTables.push(table);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Create table with null and not null columns", () => {
        let table = getTestTable();
        table.columns.push(getTestColumn('col2', 'type2'));
        table.columns[0].isNotNull = false;
        table.columns[1].isNotNull = true;

        let modelDiff = new model.ModelDiff();
        modelDiff.addedTables.push(table);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Create table with column that has type arguments", () => {
        let table = getTestTable();
        table.columns[0].columnType.args = [2, 3];
        let modelDiff = new model.ModelDiff();
        modelDiff.addedTables.push(table);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Create two tables", () => {
        let modelDiff = new model.ModelDiff();
        modelDiff.addedTables.push(getTestTable("table1"));
        modelDiff.addedTables.push(getTestTable("table2"));
        
        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Drop table", () => {
        let modelDiff = new model.ModelDiff();
        modelDiff.removedTables.push("table1");
        
        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Drop two tables", () => {
        let modelDiff = new model.ModelDiff();
        modelDiff.removedTables.push("table1");
        modelDiff.removedTables.push("table2");
        
        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Drop table and create table", () => {
        let modelDiff = new model.ModelDiff();
        modelDiff.addedTables.push(getTestTable("table1"));
        modelDiff.removedTables.push("table2");
        
        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Alter table - add column", () => {
        let alterTable = getTestAlterTable();
        alterTable.addedColumns.push(getTestColumn());

        let modelDiff = new model.ModelDiff();
        modelDiff.alteredTables.push(alterTable);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Alter table - add two columns", () => {
        let alterTable = getTestAlterTable();
        alterTable.addedColumns.push(getTestColumn("col1"));
        alterTable.addedColumns.push(getTestColumn("col2"));
        
        let modelDiff = new model.ModelDiff();
        modelDiff.alteredTables.push(alterTable);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Alter table - drop column", () => {
        let alterTable = getTestAlterTable();
        alterTable.removedColumns.push("col1");
        let modelDiff = new model.ModelDiff();
        modelDiff.alteredTables.push(alterTable);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Alter table - drop two columns", () => {
        let alterTable = getTestAlterTable();
        alterTable.removedColumns.push("col1");
        alterTable.removedColumns.push("col2");
        let modelDiff = new model.ModelDiff();
        modelDiff.alteredTables.push(alterTable);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Alter table - alter column - change type", () => {
        let alterColumn = getTestAlterColumn();
        alterColumn.columnType.name = 'type2';
        alterColumn.columnType.args = [3, 4];

        let alterTable = getTestAlterTable();
        alterTable.alteredColumns.push(alterColumn);
        let modelDiff = new model.ModelDiff();
        modelDiff.alteredTables.push(alterTable);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Alter table - alter column - change nullability", () => {
        let alterColumn = getTestAlterColumn();
        alterColumn.isNotNull = !alterColumn.originalColumn.isNotNull;
        
        let alterTable = getTestAlterTable();
        alterTable.alteredColumns.push(alterColumn);
        let modelDiff = new model.ModelDiff();
        modelDiff.alteredTables.push(alterTable);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Alter table - alter column - change type and nullability", () => {
        let alterColumn = getTestAlterColumn();
        alterColumn.isNotNull = !alterColumn.originalColumn.isNotNull;
        alterColumn.columnType.name = 'type2';
        
        let alterTable = getTestAlterTable();
        alterTable.alteredColumns.push(alterColumn);
        let modelDiff = new model.ModelDiff();
        modelDiff.alteredTables.push(alterTable);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Alter table - change primary key", () => {
        let alterKey = new model.AlteredPrimaryKey({ 
            oldIndex: getTestPrimaryKey(),
            newIndex: getTestPrimaryKey()
        });
        alterKey.newIndex.columns[0].name = 'col2';

        let alterTable = new model.AlteredTable({
            name: "table1", 
            alteredPrimaryKey: alterKey
        });
        
        let modelDiff = new model.ModelDiff();
        modelDiff.alteredTables.push(alterTable);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Alter table - remove primary key", () => {
        let alterKey = new model.AlteredPrimaryKey({ 
            oldIndex: getTestPrimaryKey(),
        });

        let alterTable = new model.AlteredTable({
            name: "table1", 
            alteredPrimaryKey: alterKey
        });
        
        let modelDiff = new model.ModelDiff();
        modelDiff.alteredTables.push(alterTable);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });

    it("Alter table - add primary key", () => {
        let alterKey = new model.AlteredPrimaryKey({ 
            newIndex: getTestPrimaryKey(),
        });

        let alterTable = new model.AlteredTable({
            name: "table1", 
            alteredPrimaryKey: alterKey
        });
        
        let modelDiff = new model.ModelDiff();
        modelDiff.alteredTables.push(alterTable);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();

    });

    it("Alter table - add primary key with custom name", () => {
        let alterKey = new model.AlteredPrimaryKey({ 
            newIndex: getTestPrimaryKey()
        });
        alterKey.newIndex.name = "CustomKeyName";

        let alterTable = new model.AlteredTable({
            name: "table1", 
            alteredPrimaryKey: alterKey
        });
        
        let modelDiff = new model.ModelDiff();
        modelDiff.alteredTables.push(alterTable);

        let sql = mssqlRenderDiff(modelDiff);
        expect(sql).toMatchSnapshot();
    });
});

function getTestTable(name?: string) : model.Table {
    if (!name) name = "table1";

    let column = getTestColumn();
    let table = new model.Table({
        name: name,
        columns: [column]
    });

    return table;
}

function getTestColumn(name?: string, typeName?: string) : model.Column {
    if (!name) name = "col1";
    if (!typeName) typeName = "type1";
    
    let colType = new model.ColumnType({name: typeName});
    let column = new model.Column({
        name: name,
        columnType: colType
    });
    
    return column;
}

function getTestAlterTable(name?: string) : model.AlteredTable {
    if (!name) name = "table1";
    
    let alterTable = new model.AlteredTable({name: name});
    return alterTable;
}

function getTestAlterColumn(name?: string, typeName?: string) : model.AlteredColumn {
    if (!name) name = "col1";
    if (!typeName) typeName = "type1";

    let originalColumn = getTestColumn(name, typeName);
    let alterColumnType = new model.ColumnType(originalColumn.columnType);
    let alterColumn = new model.AlteredColumn({
        originalColumn: originalColumn,
        name: name,
        columnType: alterColumnType
    });

    return alterColumn;
}

function getTestPrimaryKey(col1Name?: string) {
    if (!col1Name) col1Name = 'col1';

    let column = getTestColumn(col1Name);
    let primaryKey = new model.Index({columns: [column]});
    return primaryKey;
}

