import { BaseId } from "../base/base-id";

export class LocationEditor extends BaseId{
    constructor(
        id: number,
        public name: string){
            super(id)}
}
