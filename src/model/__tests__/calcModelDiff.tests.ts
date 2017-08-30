import {
    KnaveModel, Table, Column, ColumnType, Index,
} from '../model';
import {
    ModelDiff, AlteredTable, AlteredColumn,
} from '../modelDiff';

import { 
    calcModelDiff, calcTableDiff, calcColumnDiff, calcIndexDiff 
} from '../calcModelDiff';

describe("calcModelDiff()", () => {
    let newModel : KnaveModel;
    let oldModel : KnaveModel;

    beforeEach(() => {
        newModel = new KnaveModel();
        oldModel = new KnaveModel();
    })

    it("If a table is in newModel and not in oldModel, should add it to addedTables", () => {
        newModel.tables.push(getTestTable());
        let diff = calcModelDiff(newModel, oldModel);
        expect(diff.addedTables.filter(t => t.name == "table1")).toHaveLength(1);
        expect(diff.alteredTables.filter(t => t.name == "table1")).toHaveLength(0);
        expect(diff.removedTables.filter(n => n == "table1")).toHaveLength(0);
    });

    it("If a table is in oldModel and not in newModel, should add it to removedTables", () => {
        oldModel.tables.push(getTestTable());
        let diff = calcModelDiff(newModel, oldModel);
        expect(diff.addedTables.filter(t => t.name == "table1")).toHaveLength(0);
        expect(diff.alteredTables.filter(t => t.name == "table1")).toHaveLength(0);
        expect(diff.removedTables.filter(n => n == "table1")).toHaveLength(1);
    });

    it("If a table is same in newModel and oldModel, should not add it to modelDiff", ()=> {
        newModel.tables.push(getTestTable());
        oldModel.tables.push(getTestTable());
        let diff = calcModelDiff(newModel, oldModel);
        expect(diff.addedTables.filter(t => t.name == "table1")).toHaveLength(0);
        expect(diff.alteredTables.filter(t => t.name == "table1")).toHaveLength(0);
        expect(diff.removedTables.filter(n => n == "table1")).toHaveLength(0);
    });

    it("If a table is different in newModel and oldModel, should add it to alteredTables", () => {
        let newTable = getTestTable();
        newTable.columns[0].name = "not_column1";
        newModel.tables.push(newTable);
        oldModel.tables.push(getTestTable());
        let diff = calcModelDiff(newModel, oldModel);
        expect(diff.addedTables.filter(t => t.name == "table1")).toHaveLength(0);
        expect(diff.alteredTables.filter(t => t.name == "table1")).toHaveLength(1);
        expect(diff.removedTables.filter(n => n == "table1")).toHaveLength(0);
    });
});

describe("calcTableDiff()", () => {
    let newTable: Table;
    let oldTable: Table;

    beforeEach(() => {
        newTable = getTestTable();
        oldTable = getTestTable();
    });

    it("If a column is in newTable and not in oldTable, should add it to addedColumns", () => {
        newTable.columns.push(getTestColumn("col2"));
        let alteredTable = calcTableDiff(newTable, oldTable);
        expect(alteredTable.addedColumns.filter(c => c.name == "col2")).toHaveLength(1);
        expect(alteredTable.alteredColumns.filter(c => c.name == "col2")).toHaveLength(0);
        expect(alteredTable.removedColumns.filter(n => n == "col2")).toHaveLength(0);
    });

    it("If a column is in oldTable and not in newTable, should add it to removedColumns", () => {
        oldTable.columns.push(getTestColumn("col2"));
        let alteredTable = calcTableDiff(newTable, oldTable);
        expect(alteredTable.addedColumns.filter(c => c.name == "col2")).toHaveLength(0);
        expect(alteredTable.alteredColumns.filter(c => c.name == "col2")).toHaveLength(0);
        expect(alteredTable.removedColumns.filter(n => n == "col2")).toHaveLength(1);
    });

    it("If a column is same in newTable and oldTable, should not add it to differences", ()=> {
        // Have to have differences between tables - otherwise AlteredTable will be null.
        newTable.columns.push(getTestColumn("col2", "type1"));
        newTable.columns.push(getTestColumn("col2", "type2"));
        
        let alteredTable = calcTableDiff(newTable, oldTable);

        // col1 is the same in both tables, so it should not be in differences.
        expect(alteredTable.addedColumns.filter(c => c.name == "col1")).toHaveLength(0);
        expect(alteredTable.alteredColumns.filter(c => c.name == "col1")).toHaveLength(0);
        expect(alteredTable.removedColumns.filter(n => n == "col1")).toHaveLength(0);
    });

    it("If a column is different in newTable and oldTable, should add it to alteredColumns", () => {
        newTable.columns.push(getTestColumn("col2", "type1"));
        newTable.columns.push(getTestColumn("col2", "type2"));
        
        let alteredTable = calcTableDiff(newTable, oldTable);
        expect(alteredTable.addedColumns.filter(c => c.name == "col2")).toHaveLength(0);
        expect(alteredTable.alteredColumns.filter(c => c.name == "col2")).toHaveLength(1);
        expect(alteredTable.removedColumns.filter(n => n == "col2")).toHaveLength(0);

    });

    it("If primary key is different in newTable and oldTable, should add new key to AlteredTable", () => {
        oldTable.columns.push(getTestColumn("col2"));
        oldTable.primaryKey.columns.push(oldTable.columns[1]);
        newTable.primaryKey.columns.push(newTable.columns[0]);

        let alteredTable = calcTableDiff(newTable, oldTable);
        let alteredKeyColumns = alteredTable.alteredPrimaryKey.columns;
        expect(alteredKeyColumns.filter(c => c.name == "col2")).toHaveLength(1);
    });

    it("If primary key is same in newTable and oldTable, should not set alteredPrimaryKey", () => {
        // Have to have differences between tables - otherwise AlteredTable will be null.
        newTable.columns.push(getTestColumn("col2", "type1"));
        let alteredTable = calcTableDiff(newTable, oldTable);
        expect(alteredTable.alteredPrimaryKey).toBeNull();
    });

    it("If newTable and oldTable are equivalent, should return null", () => {
        let alteredTable = calcTableDiff(newTable, oldTable);
        expect(alteredTable).toBeNull();
    });

    it("Should set name of the altered table", () => {
        // Have to have differences between tables - otherwise AlteredTable will be null.
        newTable.columns.push(getTestColumn("col2", "type1"));
        let alteredTable = calcTableDiff(newTable, oldTable);
        expect(alteredTable.name).toBe(newTable.name);
    });

    it("If newTable and oldTable names are not the same, should throw", () => {
        newTable.name = "table1";
        oldTable.name = "table2";
        expect(() => calcTableDiff(newTable, oldTable)).toThrow();
    });
});

describe("calcColumnDiff()", ()=> {
    let newColumn: Column;
    let oldColumn: Column;

    beforeEach(() => {
        newColumn = getTestColumn();
        oldColumn = getTestColumn();
    })

    it("If newColumn and oldColumn are equivalent, should return null", () => {
        let alteredColumn = calcColumnDiff(newColumn, oldColumn);
        expect(alteredColumn).toBeNull();
    });

    it("If newColumn and oldColumn are different, should set original column", () => {
        newColumn.columnType.name = "different_type";
        let alteredColumn = calcColumnDiff(newColumn, oldColumn);
        expect(alteredColumn.originalColumn).toBe(oldColumn);
    });

    it("If newColumn and oldColumn are different, should set AlteredColumn properties to new column", () => {
        newColumn.columnType.name = "different_type";
        let alteredColumn = calcColumnDiff(newColumn, oldColumn);
        expect(alteredColumn).toContain(newColumn);
    });

    it("Columns are different if columnType name is different", () => {
        newColumn.columnType.name = "different_type";
        let alteredColumn = calcColumnDiff(newColumn, oldColumn);
        expect(alteredColumn).not.toBeNull();
    });

    it("Columns are different if columnType args is different", () => {
        newColumn.columnType.args.push(10);
        let alteredColumn = calcColumnDiff(newColumn, oldColumn);
        expect(alteredColumn).not.toBeNull();
    });

    it("Columns are different if column nullability changes", () => {
        newColumn.isNotNull = !oldColumn.isNotNull;
        let alteredColumn = calcColumnDiff(newColumn, oldColumn);
        expect(alteredColumn).not.toBeNull();
    });

    it("If newColumn and oldColumn names are different, should throw", () => {
        newColumn.name = "different_name";
        expect(() => calcColumnDiff(newColumn, oldColumn)).toThrow();
    });
});

describe("calcIndexDiff()", () => {
    let newIndex : Index;
    let oldIndex: Index;
    let column1: Column;
    let column2: Column;
    
    beforeEach(() => {
        column1 = getTestColumn("col1");
        column2 = getTestColumn("col2");

        newIndex = new Index({name: "index1", columns: [column1]});
        oldIndex = new Index({name: "index1", columns: [column1]});

        column1 = getTestColumn("col1");
        column2 = getTestColumn("col2");
    });

    it("If newIndex has a column that oldIndex doesn't have, return newIndex", () => {
        newIndex.columns.push(column2);
        let alteredIndex = calcIndexDiff(newIndex, oldIndex);
        expect(alteredIndex).toBe(newIndex);
    });

    it("If newIndex doesn't have column that oldIndex has, return newIndex", () => {
        oldIndex.columns.push(column2);
        let alteredIndex = calcIndexDiff(newIndex, oldIndex);
        expect(alteredIndex).toBe(newIndex);
    });

    it("If newIndex name is not null and different from oldIndex name, return newIndex", () => {
        newIndex.name = "different_name";
        let alteredIndex = calcIndexDiff(newIndex, oldIndex);
        expect(alteredIndex).toBe(newIndex);
    });

    it("If newIndex name is null and there are no other differences, return null", () => {
        newIndex.name = null;
        let alteredIndex = calcIndexDiff(newIndex, oldIndex);
        expect(alteredIndex).toBeNull();
    });

    it("If newIndex and oldIndex are equivalent, return null", () => {
        let alteredIndex = calcIndexDiff(newIndex, oldIndex);
        expect(alteredIndex).toBeNull();
    });
});

function getTestTable() : Table {
    let colType = new ColumnType({name: "type1"});
    let column = new Column({name: "col1", columnType: colType, isNotNull: false});
    let table = new Table({name: "table1", columns: [column]});
    return table;
}

function getTestColumn(name?: string, colTypeName?: string) : Column {
    let actualColTypeName = colTypeName ? colTypeName : "type1";
    let colType = new ColumnType({name: actualColTypeName});

    let columnName = name ? name : "col1";
    let column = new Column({name: columnName, columnType: colType, isNotNull: false});
    return column;
}