import * as process from 'process';
const stdout = process.stdout;

import { Knave } from '..'

export function diff(args: string[]) {
    Knave.diff({});
}