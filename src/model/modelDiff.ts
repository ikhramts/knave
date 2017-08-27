import {
    Table,
    Column,
    ColumnType,
    Index
} from './model';

export class ModelDiff {
    addedTables: Table[];
    removedTables: string[];
    alteredTables: AlteredTable[];

    constructor(init?: Partial<ModelDiff>) {
        if (init) Object.assign(this, init);
    }
}

export class AlteredTable {
    originalTable: Table;

    addedColumns: Column[];
    removedColumns: string[];
    alteredColumns: AlteredColumn[];

    alteredPrimaryKey: Index | null;

    constructor(init?: Partial<AlteredTable>) {
        if (init) Object.assign(this, init);
    }
}

export class AlteredColumn extends Column {
    originalColumn: Column;

    constructor(init?: Partial<AlteredColumn>) {
        super({});
        if (init) Object.assign(this, init);
    }
}