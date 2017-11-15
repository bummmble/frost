import { partitionObject } from './partitionObject';

export function partitionObjectByKeys(source, whitelist) {
    return partitionObject(source, (_, key) => whitelist.has(key));
}
