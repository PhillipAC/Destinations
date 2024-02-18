import { Area } from "./area";

export class Location {
    public area: Area | undefined;
    
    constructor(public id: number, public areaId: number,
        public name: string){}

    loadArea(areas: Area[]): void{
        this.area = areas.find(a => a.id == this.areaId);
    }
}
