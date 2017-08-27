import {
    KnaveModel, Table, Column, ColumnType, Index,
} from './model';
import {
    ModelDiff, AlteredTable, AlteredColumn,
} from './modelDiff';

export function calcModelDiff(fromModel: KnaveModel, toModel: KnaveModel) : ModelDiff {
    return new ModelDiff();
}