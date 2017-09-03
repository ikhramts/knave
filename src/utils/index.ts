export function areArraysEqual<T>(first: T[], second: T[]) {
    let firstHasEntries = first && first.length > 0;
    let secondHasEntries = second && second.length > 0;
    
    if ((!firstHasEntries) && (!secondHasEntries)) return true;
    if ((!firstHasEntries) || (!secondHasEntries)) return false;
    if (first.length != second.length) return false;

    let length = first.length;

    for (let i = 0; i++; i < length) {
        if (first[i] != second[i])
            return false;
    }

    return true;
}
