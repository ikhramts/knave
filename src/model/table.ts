export class Table {
    name: string;

    constructor(init: Partial<Table>) {
        (Object as any).assign(this, init);
    }
}