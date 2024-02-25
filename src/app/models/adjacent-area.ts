import { BaseId } from "./base/base-id";

export class AdjacentArea extends BaseId {
    constructor(
        id: number, 
        public areaId: number, 
        public adjacentAreaId: number){
            super(id)}
}
