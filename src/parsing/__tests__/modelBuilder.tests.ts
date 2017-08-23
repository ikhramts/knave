import * as AST from '../../AST';
import { Table, KnaveModel, Column, ColumnType, Index } from '../../model';
import { buildTable } from '../modelBuilder';


describe("buildTable()", () => {
    var astTable: AST.Table;

    beforeEach(() => {
        let astConstraints = new AST.ColumnConstraints({});
        let astTableHeader = new AST.TableHeader("tableName")
        let astColumn = new AST.ColumnDefinition("colName", "colType", [astConstraints]);
        let astTableBody = new AST.TableBody([astColumn]);
        astTable = new AST.Table(astTableHeader, astTableBody);
    })
    
    it("Should set table name", () => {
        let table = buildTable(astTable);
        expect(table.name).toBe("tableName");
    })

    it("Should set column name", () => {
        let table = buildTable(astTable);
        expect(table.columns[0].name).toBe("colName");
    })

    it("Should set number of columns", () => {
        let astConstraints = new AST.ColumnConstraints({});
        let astColumn = new AST.ColumnDefinition("colName2", "colType", [astConstraints]);
        astTable.body.lines.push(astColumn);
        let table = buildTable(astTable);
        expect(table.columns.length).toBe(2);
    });

    it("Should set column type", () => {
        let table = buildTable(astTable);
        expect(table.columns[0].columnType.name).toBe("colType");
    })

    it("Should set model column not nullable if AST column is not nullable", () => {
        (astTable.body.lines[0] as AST.ColumnDefinition).constraints.notNull = true;
        let table = buildTable(astTable);
        expect(table.columns[0].isNotNull).toBe(true);
    });

    it("Should set model column to nullable if AST column is nullable", () => {
        (astTable.body.lines[0] as AST.ColumnDefinition).constraints.notNull = false;
        let table = buildTable(astTable);
        expect(table.columns[0].isNotNull).toBe(false);
    });

    it("Should set model column to nullable if AST nullability is not set", () => {
        let table = buildTable(astTable);
        expect(table.columns[0].isNotNull).toBe(false);
    });

    it("Should add AST primary key columns to model primary key", () => {
        let astConstraints = new AST.ColumnConstraints({primaryKey: true});
        let astColumn = new AST.ColumnDefinition("colName2", "colType", [astConstraints]);
        astTable.body.lines.push(astColumn);
        let table = buildTable(astTable);
        expect(table.primaryKey.columns.length).toBe(1);
        expect(table.primaryKey.columns[0].name).toBe("colName2");
    });

    it ("Should not add non-primary AST columns to primary key", () => {
        let table = buildTable(astTable);
        expect(table.primaryKey.columns.length).toBe(0);
    });
});
