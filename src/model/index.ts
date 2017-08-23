export class KnaveModel {
    tables: Table[] = [];

    constructor(init?: Partial<KnaveModel>) {
        if (init) (<any>Object).assign(this, init);
    }
}

export class Table {
    name: string;
    columns: Column[] = [];
    primaryKey: Index;

    constructor(init?: Partial<Table>) {
        if (init) (<any>Object).assign(this, init);
    }
}

export class Column {
    name: string
    columnType: ColumnType;
    isNotNull?: boolean;

    constructor(init?: Partial<Column>) {
        if (init) (<any>Object).assign(this, init);
    }
}

export class ColumnType {
    name: string;

    constructor(init?: Partial<ColumnType>) {
        if (init) (<any>Object).assign(this, init);
    }
}

export class Index {
    name: string;
    columns: Column[] = [];

    constructor(init?: Partial<Index>) {
        if (init) (<any>Object).assign(this, init);
    }
}