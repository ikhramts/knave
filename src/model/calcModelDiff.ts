import {
    KnaveModel, Table, Column, ColumnType, Index,
} from './model';
import {
    ModelDiff, AlteredTable, AlteredColumn,
} from './modelDiff';

export function calcModelDiff(newModel: KnaveModel, oldModel: KnaveModel) : ModelDiff {
    return new ModelDiff();
}

export function calcTableDiff(newTable: Table, oldTable: Table) : AlteredTable | null {
    return null;
}

export function calcColumnDiff(newColumn: Column, oldColumn: Column) : AlteredColumn | null {
    return null;
}

export function calcIndexDiff(newIndex: Index, oldIndex: Index) : Index | null {
    return null;
}