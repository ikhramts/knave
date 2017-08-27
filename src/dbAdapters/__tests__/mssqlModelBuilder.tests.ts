import { itAll } from './itAll';
import * as model from '../../model';
import { MssqlColumnDef, buildModel} from '../mssqlModelBuilder'

describe("mmsqlModelBuilder.buildModel()", () => {
    let dbColumn1: MssqlColumnDef;
    let dbColumns: MssqlColumnDef[];

    beforeEach(() => {
        dbColumn1 = new MssqlColumnDef({
            tableName: "table1",
            columnName: "col1",
            columnType: "type1",
            maxLength: 10,
            precision: 20,
            scale: 22,
            isNullable: true,
            isPrimaryKey: false
        });

        dbColumns = [dbColumn1];
    });

    it("If there're no entries, should create empty model", () => {
        let model = buildModel([]);
        expect(model).not.toBeNull();
        expect(model.tables.length).toBe(0);
    });
    
    it("If a table is mentioned, should create it", () => {
        let model = buildModel(dbColumns);
        expect(model.tables.filter(t => t.name == "table1")).toHaveLength(1);
    });

    it("If a table is mentioned in two columns, should create it once", () => {
        let column2 = new MssqlColumnDef(dbColumn1);
        column2.columnName = "col2";
        dbColumns.push(column2);
        let model = buildModel(dbColumns);

        expect(model.tables.filter(t => t.name == "table1")).toHaveLength(1);
    });

    it("If a column is mentioned, should create it in correct table", () => {
        let model = buildModel(dbColumns);
        let columns = model.table("table1").columns;

        expect(columns.filter(c => c.name == "col1")).toHaveLength(1);
    });

    it("If two columns are mentioend in same table, should add them to the table", () => {
        let column2 = new MssqlColumnDef(dbColumn1);
        column2.columnName = "col2";
        dbColumns.push(column2);
        let model = buildModel(dbColumns);

        let columns = model.table("table1").columns;
        expect(columns.filter(c => c.name == "col2")).toHaveLength(1);
    });

    it("If a column is nullable, should set it as nullable", () => {
        dbColumn1.isNullable = true;
        let model = buildModel(dbColumns);
        expect(model.table("table1").column("col1").isNotNull).toBe(false);
    });

    it("If a column is not nullable, should set it as not nullable", () => {
        dbColumn1.isNullable = false;
        let model = buildModel(dbColumns);
        expect(model.table("table1").column("col1").isNotNull).toBe(true);
    });

    it("Should set the column type for the column", () => {
        let model = buildModel(dbColumns);
        expect(getTestColumnType(model).name).toBe("type1");
    });

    it("If column has primary key flag, add it to the primary key", () => {
        dbColumn1.isPrimaryKey = true;
        let model = buildModel(dbColumns);
        let primaryKeyCols = model.table("table1").primaryKey.columns;

        expect(primaryKeyCols.filter(c => c.name == "col1")).toHaveLength(1);
    });

    it("If column doesn't have primary key flag, do not add it to the primary key", () => {
        dbColumn1.isPrimaryKey = false;
        let model = buildModel(dbColumns);
        let primaryKeyCols = model.table("table1").primaryKey.columns;

        expect(primaryKeyCols.filter(c => c.name == "col1")).toHaveLength(0);
    });
            

    describe("Type arguments", () => {
        itAll("If type is numeric or decimal, should extract precision and scale", [
            "decimal",
            "numeric",
        ], (typeName: string) => {
            dbColumn1.columnType = typeName;
            dbColumn1.precision = 15;
            dbColumn1.scale = 12;

            let model = buildModel(dbColumns);
            let args = getTestColumnTypeArgs(model);

            expect(args).toHaveLength(2);
            expect(args[0]).toBe(15);
            expect(args[1]).toBe(12);
        });

        itAll("If type has needs precision, should extract precision", [
            "float",
            "real",
        ], (typeName: string) => {
            dbColumn1.columnType = typeName;
            dbColumn1.precision = 15;

            let model = buildModel(dbColumns);
            let args = getTestColumnTypeArgs(model);

            expect(args).toHaveLength(1);
            expect(args[0]).toBe(15);
        });

        itAll("If type is single width string, should extract maxLength",[
            "char",
            "varchar",
            "binary",
            "varbinary",
        ], (typeName: string) => {
            dbColumn1.columnType = typeName;
            dbColumn1.maxLength = 15;

            let model = buildModel(dbColumns);
            let args = getTestColumnTypeArgs(model);

            expect(args).toHaveLength(1);
            expect(args[0]).toBe(15);
        });

        itAll("If type is double width string, should extract 1/2 of maxLength",[
            "nchar",
            "nvarchar",
        ], (typeName: string) => {
            dbColumn1.columnType = typeName;
            dbColumn1.maxLength = 16;

            let model = buildModel(dbColumns);
            let args = getTestColumnTypeArgs(model);

            expect(args).toHaveLength(1);
            expect(args[0]).toBe(8);
        });

        itAll("If type is double width string, should extract -1 maxLength as -1",[
            "nchar",
            "nvarchar",
        ], (typeName: string) => {
            dbColumn1.columnType = typeName;
            dbColumn1.maxLength = -1;

            let model = buildModel(dbColumns);
            let args = getTestColumnTypeArgs(model);

            expect(args).toHaveLength(1);
            expect(args[0]).toBe(-1);
        });

        itAll("Should not extract type args from other types", [
            "bigint",
            "bit",
            "int",
            "money",
            "smallint",
            "smallmoney",
            "tinyint",
            "date",
            "datetime",
            "datetime2",
            "datetimeoffset",
            "smalldatetime",
            "time",
            "text",
            "ntext",
            "image",
            "cursor",
            "hierarchyid",
            "sql_variant",
            "timestamp",
            "uniqueidentifier",
            "xml",
            "any_data_type",
        ], (typeName: string) => {
            dbColumn1.columnType = typeName;
            let model = buildModel(dbColumns);
            let args = getTestColumnTypeArgs(model);

            expect(args).toHaveLength(0);
        });
    });
});

function getTestColumnType(model: model.KnaveModel) : model.ColumnType {
    return model.table("table1").column("col1").columnType;
}

function getTestColumnTypeArgs(model : model.KnaveModel) : number[] {
    return model.table("table1").column("col1").columnType.args;
}