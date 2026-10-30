import { SpaceEntry } from "../model/Model";

export class MissingFieldError extends Error {
    constructor(missingField: string) {
        super(`Field '${missingField}' is missing`);
    }
}

export class JSONError extends Error {}


export function validateSpaceEntry(arg: any) {
    if ((arg as SpaceEntry).location === undefined) {
        throw new MissingFieldError("location");
    }
    if ((arg as SpaceEntry).name === undefined) {
        throw new MissingFieldError("name");
    }
    if ((arg as SpaceEntry).id === undefined) {
        throw new MissingFieldError("id");
    }
}