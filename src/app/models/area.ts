import { BaseId } from "./base/base-id";

export class Area extends BaseId{
    constructor(
        id: number, 
        public name: string){
            super(id);}
}
