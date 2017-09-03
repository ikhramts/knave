import {
    KnaveModel, Table, Column, ColumnType, Index,
} from './model';
import {
    ModelDiff, AlteredTable, AlteredColumn, AlteredPrimaryKey
} from './modelDiff';

export function calcModelDiff(newModel: KnaveModel, oldModel: KnaveModel) : ModelDiff {
    // Do the diff on tables.
    let addedTables: Table[] = [];
    let removedTables: string[] = [];
    let alteredTables: AlteredTable[] = [];

    let newTablesByName = toMap(newModel.tables, table => table.name);
    let oldTablesByName = toMap(oldModel.tables, table => table.name);

    // Find added and altered tables.
    for (let newTable of newModel.tables) {
        let oldTable = oldTablesByName[newTable.name];

        if (oldTable) {
            // The table might have been altered.
            let alteredTable = calcTableDiff(newTable, oldTable);

            if (alteredTable) {
                alteredTables.push(alteredTable);
            } // Else: table was not altered.
        
        } else  {
            addedTables.push(newTable);
        }
    }

    // Find removed tables.
    for (let oldTable of oldModel.tables) {
        if (!newTablesByName[oldTable.name]) {
            removedTables.push(oldTable.name);
        }
    }

    let modelDiff = new ModelDiff();
    modelDiff.addedTables = addedTables;
    modelDiff.removedTables = removedTables;
    modelDiff.alteredTables = alteredTables;

    return modelDiff;
}

export function calcTableDiff(newTable: Table, oldTable: Table) : AlteredTable | null {
    if (newTable.name != oldTable.name) {
        throw "Column names are unexpectedly different. New column: " + newTable.name +
            "; old column: " + oldTable.name;
    }

    // Do diff on columns.
    let addedColumns: Column[] = [];
    let removedColumns: string[] = [];
    let alteredColumns: AlteredColumn[] = [];

    let newColumnsByName = toMap(newTable.columns, col => col.name);
    let oldColumnsByName = toMap(oldTable.columns, col => col.name);
    
    // Find added and altered columns.
    for (let newColumn of newTable.columns) {
        let colName = newColumn.name;
        let oldColumn = oldColumnsByName[colName];
        
        if (oldColumn) {
            // Might be altered
            let alteredColumn = calcColumnDiff(newColumn, oldColumn);

            if (alteredColumn) {
                alteredColumns.push(alteredColumn);
            } // Else: column was not altered.
        
        } else {
            addedColumns.push(newColumn)
        }
    }

    // Find removed columns.
    for (let oldColumn of oldTable.columns) {
        if (!newColumnsByName[oldColumn.name]) {
            removedColumns.push(oldColumn.name);
        }
    }

    // Find other differences.
    let alteredPrimaryKey = calcPrimaryKeyDiff(newTable.primaryKey, oldTable.primaryKey);
    
    // Compose output
    if (addedColumns.length == 0
        && removedColumns.length == 0
        && alteredColumns.length == 0
        && (!alteredPrimaryKey) ) 
    {
        return null;
    }

    let alteredTable = new AlteredTable();
    alteredTable.addedColumns = addedColumns;
    alteredTable.removedColumns = removedColumns;
    alteredTable.alteredColumns = alteredColumns;
    alteredTable.alteredPrimaryKey = alteredPrimaryKey;
    alteredTable.name = newTable.name;

    return alteredTable;
}

export function calcColumnDiff(newColumn: Column, oldColumn: Column) : AlteredColumn | null {
    if (newColumn.name != oldColumn.name) {
        throw "Column names are unexpectedly different. New column: " + newColumn.name +
            "; old column: " + oldColumn.name;
    }

    let newType = newColumn.columnType;
    let oldType = oldColumn.columnType;

    let columnsAreDifferent = 
        (newType.name != oldType.name) ||
        (!areArraysEqual(newType.args, oldType.args)) ||
        ((!newColumn.isNotNull) != (!oldColumn.isNotNull));

    if (columnsAreDifferent) {
        let alteredColumn = new AlteredColumn(newColumn);
        alteredColumn.originalColumn = oldColumn;
        return alteredColumn;
    }
    
    return null;
}

export function calcPrimaryKeyDiff(newIndex: Index, oldIndex: Index) : AlteredPrimaryKey | null {
    if ((!newIndex) && (!oldIndex)) {
        return null;
    }

    let alteredKey = new AlteredPrimaryKey();
    alteredKey.newIndex = newIndex;
    alteredKey.oldIndex = oldIndex;

    if ((!newIndex) || (!oldIndex)) return alteredKey;

    if (newIndex.name && newIndex.name != oldIndex.name) 
        return alteredKey;

    if (!containsSame(newIndex.columns, oldIndex.columns, index => index.name)) {
        return alteredKey;
    }
    
    return null;
}


function containsSame<T>(first: T[], second: T[], compareOn: (it:T) => string) : boolean {
    if ((!first) && (!second)) return true;
    if ((!first) || (!second)) return false;
    if (first.length != second.length) return false;
    
    let firstComparator = first.map(compareOn).sort();
    let secondComparator = second.map(compareOn).sort();
    let length = first.length;
    
    for (var i = 0; i < length; i++) {
        if (firstComparator[i] != secondComparator[i])
            return false;
    }

    return true;
}

function areArraysEqual<T>(first: T[], second: T[]) {
    if ((!first) && (!second)) return true;
    if ((!first) || (!second)) return false;
    if (first.length != second.length) return false;

    let length = first.length;

    for (let i = 0; i++; i < length) {
        if (first[i] != second[i])
            return false;
    }

    return true;
}

function toMap<T>(list: T[], getKey : (obj: T) => string) : {[id: string] : T} {
    if (!list) return null;
    if (list.length == 0) return {}

    let map : {[id: string] : T} = {};

    for (let item of list) {
        map[getKey(item)] = item;
    }

    return map;
}