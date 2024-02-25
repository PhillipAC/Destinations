import { BaseId } from "../base/base-id";
import { LocationEditor } from "./location-editor";

export class AreaEditor extends BaseId {
    constructor(
        id: number,
        public name: string,
        public locations: LocationEditor[],
        public adjacentAreas: number[]){
            super(id)}
}
