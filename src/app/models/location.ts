import { Area } from "./area";
import { BaseId } from "./base/base-id";

export class Location extends BaseId{
    public area: Area | undefined;
    
    constructor(
        id: number, 
        public areaId: number,
        public name: string){
            super(id);}

    loadArea(areas: Area[]): void{
        this.area = areas.find(a => a.id == this.areaId);
    }
}
