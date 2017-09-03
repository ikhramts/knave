export class KnaveModel {
    tables: Table[] = [];

    constructor(init?: Partial<KnaveModel>) {
        if (init) Object.assign(this, init);
    }

    table(name: string) : Table | null {
        let found = this.tables.filter(t => t.name == name);
        if (found.length > 0)
            return found[0];

        return null;
    }
}

export class Table {
    name: string;
    columns: Column[] = [];
    primaryKey: Index;

    constructor(init?: Partial<Table>) {
        if (init) Object.assign(this, init);
    }

    column(name: string) : Column{
        let found = this.columns.filter(c => c.name == name);
        if (found.length > 0)
            return found[0];

        return null;
    }
}

export class Column {
    name: string
    columnType: ColumnType;
    isNotNull: boolean;

    constructor(init?: Partial<Column>) {
        if (init) Object.assign(this, init);
    }
}

export class ColumnType {
    name: string;
    args: number[] = []

    constructor(init?: Partial<ColumnType>) {
        if (init) Object.assign(this, init);
    }
}

export class Index {
    name: string;
    columns: Column[] = [];

    constructor(init?: Partial<Index>) {
        if (init) Object.assign(this, init);
    }
}