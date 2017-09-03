import * as model from '../model';

export function mssqlRenderDiff(modelDiff: model.ModelDiff) : string {
    let sql = "";

    for (let createTable of modelDiff.addedTables) {
        sql += renderCreateTable(createTable) + "\n";
    }

    for (let dropTable of modelDiff.removedTables) {
        sql += renderDropTable(dropTable);
    }

    for (let alterTable of modelDiff.alteredTables) {
        sql += renderAlterTable(alterTable);
    }

    return sql;
}

function renderDropTable(tableName: string): string {
    return 'DROP TABLE "' + tableName + '";\n';
}

function renderCreateTable(table: model.Table): string {
    let sql = 'CREATE TABLE "' + table.name + '" (\n    ';
    
    let columnsSql = table.columns.map(renderColumn);
    sql += columnsSql.join(',\n    ');

    let primaryKeySql = renderPrimaryKey(table.primaryKey, table.name);
    if (table.primaryKey) {
        sql += ',\n    ' + primaryKeySql;
    }

    sql += '\n);\n'

    return sql;
}

function renderColumn(column: model.Column) : string {
    let colType = column.columnType;
    let sql = '"' + column.name + '" ' + renderType(column.columnType);

    sql += ' ' + renderNullability(column.isNotNull);

    return sql;
}

function renderPrimaryKey(primaryKey: model.Index, tableName: string) : string {
    if (!primaryKey || !primaryKey.columns || primaryKey.columns.length == 0)
        return null;

    let pkeyName = getPrimaryKeyName(primaryKey.name, tableName);
    let sql = 'CONSTRAINT "' + pkeyName + '" PRIMARY KEY CLUSTERED (\n        ';

    let pkColumns = primaryKey.columns.map(c => '"' + c.name + '" ASC').join(',\n        ');
    sql += pkColumns + '\n    )';
    return sql;
}

function renderAlterTable(table: model.AlteredTable): string {
    let tableName = table.name;
    let sql = '--------------- ALTER TABLE "' + tableName + '" ---------------\n';

    let alterTable = () => 'ALTER TABLE "' + tableName + '" ';

    for (let addColumn of table.addedColumns) {
        sql += alterTable() + 'ADD ' + renderColumn(addColumn) + ';\n';
    }

    for (let dropColumn of table.removedColumns) {
        sql += alterTable() + 'DROP "' + dropColumn + '";\n';
    }

    for (let alterColumn of table.alteredColumns) {
        sql += alterTable() + renderAlterColumn(alterColumn);
    }

    if (table.alteredPrimaryKey) {
        let oldKey = table.alteredPrimaryKey.oldIndex;
        let newKey = table.alteredPrimaryKey.newIndex;

        if (oldKey) {
            let oldKeyName = getPrimaryKeyName(table.alteredPrimaryKey.oldIndex.name, table.name);
            sql += alterTable() + 'DROP CONSTRAINT "' + oldKeyName + '";\n';
        }

        if (newKey) {
            sql += alterTable() + 'ADD ' + renderPrimaryKey(newKey, table.name) + ';\n';
        }
    }

    sql += '\n';
    
    return sql;
}

function renderAlterColumn(alterColumn: model.AlteredColumn) : string {
    let sql = 'ALTER COLUMN "' + alterColumn.name + '"';

    if (!alterColumn.columnType.isEqualTo(alterColumn.originalColumn.columnType)) {
        sql += ' ' + renderType(alterColumn.columnType);
    }

    if((!alterColumn.isNotNull) != (!alterColumn.originalColumn.isNotNull)) {
        sql += ' ' + renderNullability(alterColumn.isNotNull);
    };

    return sql;
}

function renderType(colType: model.ColumnType) : string {
    let sql = colType.name;

    if (colType.args && colType.args.length > 0) {
        let argsSql = '(' + colType.args.map(arg => "" + arg).join(', ') + ')';
        sql += argsSql;
    }

    return sql;
} 

function renderNullability(isNotNull: boolean) : string {
    if (isNotNull) return 'NOT NULL';
    return 'NULL';
}

function getPrimaryKeyName(keyName: string, tableName: string) {
    if (keyName) return keyName;
    return "PK_" + tableName;
}

