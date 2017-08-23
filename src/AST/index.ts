export class TokenLocation {
    start: Position;
    end: Position;
}

export class Position {
    offset: number;
    line: number;
    column: number;
}

export class FileDeclarations {
    declarations: Declaration[]

    constructor(declarations: Declaration[]) {
        this.declarations = declarations;
    }
}

export type Declaration = Table

export class Table {
    header : TableHeader;
    body: TableBody

    constructor(header: TableHeader, body: TableBody) {
        this.header = header;
        this.body = body;
    }
}

export class TableHeader {
    name: string

    constructor(name: string) {
        this.name = name;
    }
}

export class TableBody {
    lines: TableBodyLine[]

    constructor(lines: TableBodyLine[]) {
        this.lines = lines;
    }
}

export type TableBodyLine = ColumnDefinition;

export class ColumnDefinition {
    name: string;
    type: string;
    constraints: ColumnConstraints;

    constructor(name: string, type: string, constraintList: ColumnConstraints[]) {
        this.name = name;
        this.type = type;
        
        let constraints = new ColumnConstraints({});
        for (let constraint of constraintList) {
            (Object as any).assign(constraints, constraint);
        }

        this.constraints = constraints;
    }
}

export class ColumnConstraints {
    primaryKey?: boolean;
    notNull?: boolean;

    constructor(init: Partial<ColumnConstraints>) {
        (<any>Object).assign(this, init);
    }
}