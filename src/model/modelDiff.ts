import {
    Table,
    Column,
    ColumnType,
    Index
} from './model';

export class ModelDiff {
    addedTables: Table[] = [];
    removedTables: string[] = [];
    alteredTables: AlteredTable[] = [];

    constructor(init?: Partial<ModelDiff>) {
        if (init) Object.assign(this, init);
    }
}

export class AlteredTable {
    name: string;
    originalTable: Table;

    addedColumns: Column[] = [];
    removedColumns: string[] = [];
    alteredColumns: AlteredColumn[] = [];

    alteredPrimaryKey: AlteredPrimaryKey | null;

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

export class AlteredPrimaryKey {
    oldIndex: Index;
    newIndex: Index;

    constructor(init?: Partial<AlteredPrimaryKey>) {
        if (init) Object.assign(this, init);
    }
}